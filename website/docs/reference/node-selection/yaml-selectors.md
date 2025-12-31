---
title: "YAML Селекторы"
---

Пишите селекторы ресурсов в YAML, сохраняйте их с удобочитаемым именем и используйте их с помощью флага `--selector`.
Записывая селекторы в файл верхнего уровня `selectors.yml`:

* **Читаемость:** сложные критерии выбора составляются из словарей и массивов
* **Контроль версий:** определения селекторов хранятся в том же git-репозитории, что и проект dbt
* **Повторное использование:** селекторы могут использоваться в нескольких определениях задач, и их определения могут быть расширены (с помощью якорей YAML)

Селекторы находятся в файле верхнего уровня с именем `selectors.yml`. Каждый должен иметь `name` и `definition`, и может дополнительно определять `description` и [`default` флаг](#default).

<File name='selectors.yml'>

```yml
selectors:
  - name: nodes_to_joy
    definition: ...
  - name: nodes_to_a_grecian_urn
    description: Аттическая форма с хорошим настроением
    default: true
    definition: ...
```
</File>

## Определения {#definitions}

Каждое `definition` состоит из одного или нескольких аргументов, которые могут быть следующими:
* **CLI-стиль:** строки, представляющие аргументы в стиле CLI
* **Ключ-значение:** пары в форме `method: value`
* **Полный YAML:** полностью определенные словари с элементами для `method`, `value`, эквивалентными операторами и поддержкой `exclude`

Используйте эквивалентные операторам ключевые слова `union` и `intersection` для организации нескольких аргументов.

### CLI-стиль {#cli-style}

```yml
definition:
  'tag:nightly'
```

Этот простой синтаксис поддерживает использование операторов графа `+`, `@` и `*`, [операторов множеств](/reference/node-selection/set-operators), а также `exclude`.

### Ключ-значение {#key-value}

```yml
definition:
  tag: nightly
```

Этот простой синтаксис не поддерживает никаких [граф](/reference/node-selection/graph-operators) или [множество](/reference/node-selection/set-operators) операторов или `exclude`.

### Полный YAML {#full-yaml}

Это самый подробный синтаксис, который может включать эквивалентные операторам ключевые слова для [граф](/reference/node-selection/graph-operators) и [множество](/reference/node-selection/set-operators) операторов.

Просмотрите [методы](/reference/node-selection/methods) для доступного списка.

```yml
definition:
  method: tag
  value: nightly

  # Необязательные ключевые слова соответствуют операторам `+` и `@` графа:

  children: true | false
  parents: true | false

  children_depth: 1    # если children: true, количество уровней для включения
  parents_depth: 1     # если parents: true, количество уровней для включения

  childrens_parents: true | false     # оператор @

  indirect_selection: eager | cautious | buildable | empty # включать все тесты, выбранные косвенно? по умолчанию eager
```

Оператор `*` для выбора всех узлов можно записать как:
```yml
definition:
  method: fqn
  value: "*"
```

#### Исключение {#exclude}

Ключевое слово `exclude` поддерживается только полностью квалифицированными словарями.
Оно может быть передано как аргумент к каждому словарю или как элемент в `union`. Следующие примеры эквивалентны:

```yml
- method: tag
  value: nightly
  exclude:
    - "@tag:daily"
```

```yml
- union:
    - method: tag
      value: nightly
    - exclude:
       - method: tag
         value: daily
```

Примечание: Аргумент `exclude` в YAML селекторах немного отличается от аргумента `--exclude` в CLI. Здесь `exclude` _всегда_ возвращает [разность множеств](https://en.wikipedia.org/wiki/Complement_(set_theory)), и он всегда применяется _последним_ в своей области.

Когда передается более одного "yeslist" (`--select`), они рассматриваются как [объединение](/reference/node-selection/set-operators#unions), а не как [пересечение](/reference/node-selection/set-operators#intersections). То же самое происходит, когда есть более одного "nolist" (`--exclude`).

#### Косвенный выбор {#indirect-selection}

Как общее правило, dbt будет косвенно выбирать _все_ тесты, если они касаются _любого_ ресурса, который вы выбираете напрямую. Мы называем это "жадным" косвенным выбором. Вы можете переключить режим косвенного выбора на "осторожный", "строимый" или "пустой", установив `indirect_selection` для конкретного критерия:

```yml
- union:
    - method: fqn
      value: model_a
      indirect_selection: eager  # по умолчанию: будут включены все тесты, касающиеся model_a
    - method: fqn
      value: model_b
      indirect_selection: cautious  # не будут включены тесты, касающиеся model_b
                        # если у них есть другие невыбранные родители
    - method: fqn
      value: model_c
      indirect_selection: buildable  # не будут включены тесты, касающиеся model_c
                        # если у них есть другие невыбранные родители (если только у них нет предка, который выбран)
    - method: fqn
      value: model_d
      indirect_selection: empty  # будут включены тесты только для выбранного узла и игнорированы все тесты, прикрепленные к model_d
```

Если указано, значение `indirect_selection` YAML селектора будет иметь приоритет над флагом CLI `--indirect-selection`. Поскольку `indirect_selection` определяется отдельно для _каждого_ критерия выбора, возможно смешивать режимы eager/cautious/buildable/empty в одном определении, чтобы достичь нужного поведения. Помните, что вы всегда можете протестировать свои критерии с помощью `dbt ls --selector`.

Смотрите [примеры выбора тестов](/reference/node-selection/test-selection-examples) для более подробной информации о косвенном выборе.

## Пример {#example}

Вот два способа представления:

```bash
$ dbt run --select @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
```

<Tabs
  defaultValue="cli_style"
  values={[
    { label: 'CLI-стиль', value: 'cli_style', },
    { label: 'Полный YML', value: 'all_yml', },
  ]
}>

<TabItem value="cli_style">
<File name='selectors.yml'>

```yml

selectors:
  - name: nightly_diet_snowplow
    description: "Неинкрементальные модели Snowplow, которые обеспечивают ночные экспорты"
    definition:

      # Необязательные ключевые слова `union` и `intersection` соответствуют операторам ` ` и `,` множества:
      union:
        - intersection:
            - '@source:snowplow'
            - 'tag:nightly'
        - 'models/export'
        - exclude:
            - intersection:
                - 'package:snowplow'
                - 'config.materialized:incremental'
            - export_performance_timing
```
</File>
</TabItem>

<TabItem value="all_yml">
<File name='selectors.yml'>

```yml
selectors:
  - name: nightly_diet_snowplow
    description: "Неинкрементальные модели Snowplow, которые обеспечивают ночные экспорты"
    definition:
      # Необязательные ключевые слова `union` и `intersection` соответствуют операторам ` ` и `,` множества:
      union:
        - intersection:
            - method: source
              value: snowplow
              childrens_parents: true
            - method: tag
              value: nightly
        - method: path
          value: models/export
        - exclude:
            - intersection:
                - method: package
                  value: snowplow
                - method: config.materialized
                  value: incremental
            - method: fqn
              value: export_performance_timing
```
</File>
</TabItem>

</Tabs>

Затем в определении нашей задачи:
```bash
dbt run --selector nightly_diet_snowplow
```

## По умолчанию {#default}

Селекторы могут определять булевое свойство `default`. Если у селектора `default: true`, dbt будет использовать критерии этого селектора, когда задачи не определяют свои собственные критерии выбора.

Предположим, мы определяем селектор по умолчанию, который выбирает только ресурсы, определенные в нашем корневом проекте:

```yml
selectors:
  - name: root_project_only
    description: >
        Только ресурсы из корневого проекта.
        Исключает ресурсы, определенные в установленных пакетах.
    default: true
    definition:
      method: package
      value: <my_root_project_name>
```

Если я запускаю "неквалифицированную" команду, dbt будет использовать критерии выбора, определенные в `root_project_only` — то есть, dbt будет только строить / проверять свежесть / генерировать скомпилированный SQL для ресурсов, определенных в моем корневом проекте.

```
dbt build
dbt source freshness
dbt docs generate
```

Если я запускаю команду, которая определяет свои собственные критерии выбора (через `--select`, `--exclude` или `--selector`), dbt проигнорирует селектор по умолчанию и использует критерии флага вместо этого. Он не будет пытаться комбинировать их.

```bash
dbt run --select  "model_a"
dbt run --exclude model_a
```

Только один селектор может установить `default: true` для данного вызова; в противном случае dbt вернет ошибку. Вы можете использовать выражение Jinja, чтобы настроить значение `default` в зависимости от среды:

```yml
selectors:
  - name: default_for_dev
    default: "{{ target.name == 'dev' | as_bool }}"
    definition: ...
  - name: default_for_prod
    default: "{{ target.name == 'prod' | as_bool }}"
    definition: ...
```

### Наследование селекторов {#selector-inheritance}

Селекторы могут повторно использовать и расширять определения из других селекторов с помощью метода `selector`.

```yml
selectors:
  - name: foo_and_bar
    definition:
      intersection:
        - tag: foo
        - tag: bar

  - name: foo_bar_less_buzz
    definition:
      intersection:
        # повторное использование определения из выше
        - method: selector
          value: foo_and_bar
        # с модификацией!
        - exclude:
            - method: tag
              value: buzz
```

**Примечание:** Хотя наследование селекторов позволяет _повторно использовать_ логику из другого селектора, оно не позволяет _модифицировать_ логику этого селектора с помощью `parents`, `children`, `indirect_selection` и так далее.

Метод `selector` возвращает полный набор узлов, который определяется именованным селектором.

## Разница между `--select` и `--selector` {#difference-between-select-and-selector}

В dbt [`select`](/reference/node-selection/syntax#how-does-selection-work) и `selector` — это связанные концепции, которые используются для выбора конкретных моделей, тестов или других ресурсов. В таблице ниже объясняются различия между ними и приводятся рекомендации, когда лучше использовать каждый из подходов:

| Характеристика | `--select` | `--selector` |
| -------------- | ---------- | ------------- |
| Определение | Ad-hoc, задаётся напрямую в команде. | Предварительно определяется в файле `selectors.yml`. |
| Использование | Одноразовая или задачеспецифичная фильтрация. | Переиспользуемый вариант для многократных запусков. |
| Сложность | Требует ручного ввода критериев выбора. | Может инкапсулировать сложную логику для повторного использования. |
| Гибкость | Гибкий, но менее переиспользуемый. | Гибкий, с акцентом на переиспользуемую и структурированную логику. |
| Пример | `dbt run --select my_model+`<br /> (запускает `my_model` и все downstream‑зависимости с использованием оператора `+`). | `dbt run --selector nightly_diet_snowplow`<br /> (запускает модели, определённые селектором `nightly_diet_snowplow` в файле `selectors.yml`). |

Примечания:
- Вы можете комбинировать `--select` с `--exclude` для ad-hoc выбора узлов.
- Синтаксис `--select` и `--selector` предоставляет один и тот же набор возможностей для выбора узлов. Использование [графовых операторов](/reference/node-selection/graph-operators) (таких как `+`, `@` и т.д.) и [операторов над множествами](/reference/node-selection/set-operators) (таких как `union` и `intersection`) в `--select` эквивалентно YAML‑конфигурациям в `--selector`.

Для дополнительных примеров см. [этот GitHub Gist](https://gist.github.com/jeremyyeo/1aeca767e2a4f157b07955d58f8078f7).
