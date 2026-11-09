---
title: "YAML Селекторы"
---

<VersionBlock lastVersion="1.11">
Определяйте селекторы ресурсов в YAML, сохраняйте их под понятными именами и ссылайтесь на них с помощью флага `--selector`.
</VersionBlock>

<VersionBlock firstVersion="1.12">
Определяйте селекторы ресурсов в YAML, сохраняйте их под понятными именами и ссылайтесь на них с помощью метода `selector:` с флагом `--select`.
</VersionBlock>

Сохраняя селекторы в файле `selectors.yml` в корне проекта:

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

<VersionBlock firstVersion="1.12">

Начиная с <Constant name="dbt" /> v1.12, вы можете ссылаться на именованный селектор в `--select` или `--exclude` с помощью [метода `selector`](/reference/node-selection/methods#selector) (например, `selector:my_selector`).

</VersionBlock>

## Определения

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

Если для YAML-селектора задано значение `indirect_selection`, оно имеет приоритет над флагом CLI `--indirect-selection`. Поскольку `indirect_selection` задаётся отдельно для _каждого_ критерия выбора, в одном определении можно сочетать режимы eager/cautious/buildable/empty, чтобы добиться именно того поведения, которое вам нужно. <VersionBlock lastVersion="1.11">Вы всегда можете проверить свои критерии с помощью `dbt ls --selector`.</VersionBlock><VersionBlock firstVersion="1.12">Вы всегда можете проверить свои критерии с помощью `dbt ls --select selector:SELECTOR_NAME`.</VersionBlock>

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

Затем в определении нашего задания:

<VersionBlock lastVersion="1.11">
```bash
dbt run --selector nightly_diet_snowplow
```
</VersionBlock>

<VersionBlock firstVersion="1.12">
```bash
dbt run --select selector:nightly_diet_snowplow
```
</VersionBlock>

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

<VersionBlock lastVersion="1.11">
Если я выполняю команду, которая задаёт собственные критерии выбора (через `--select`, `--exclude` или `--selector`), dbt игнорирует селектор по умолчанию и вместо него использует критерии, заданные флагами. Он не пытается объединить эти два набора критериев.
</VersionBlock>

<VersionBlock firstVersion="1.12">
Если я выполняю команду, которая задаёт собственные критерии выбора (через `--select` или `--exclude`), dbt игнорирует селектор по умолчанию и вместо него использует критерии, заданные флагами. Он не пытается объединить эти два набора критериев.

Если вы хотите применить оба набора критериев, используйте метод `selector:` с флагом `--select`, чтобы сослаться на селектор по умолчанию наряду с другими критериями. Например:

```
dbt build --select selector:root_project_only tag:nightly
```

For more information, refer to [Using `selector:` with `--select`](#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-selector-%D1%81---select).
</VersionBlock>

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

<VersionBlock firstVersion="1.12">
Если определения селекторов циклически ссылаются друг на друга, dbt вызывает ошибку `DbtRecursionError` во время выполнения. Например, следующее наследование селекторов недопустимо:

```yaml
selectors:
  - name: selector_a
    definition:
      method: selector
      value: selector_b

  - name: selector_b
    definition:
      method: selector
      value: selector_a
```
</VersionBlock>

<VersionBlock lastVersion="1.11">
## Разница между `--select` и `--selector`

В dbt [`select`](/reference/node-selection/syntax#how-does-selection-work) и `selector` — связанные понятия, используемые для выбора конкретных моделей, тестов или ресурсов. В следующей таблице объясняются различия между ними и ситуации, в которых их лучше использовать:

| Характеристика | `--select` | `--selector` |
| ------- | ---------- | ------------- |
| Определение |	Задаётся непосредственно в команде для конкретного случая.	| Заранее определяется в файле `selectors.yml`. |
| Использование |	Разовая фильтрация или фильтрация для конкретной задачи.|	Повторное использование при нескольких запусках. |
| Сложность	| Требует ручного ввода критериев выбора.	| Позволяет объединить сложную логику для повторного использования. |
| Гибкость	| Гибкий подход; меньше возможностей для повторного использования. |	Гибкий подход с упором на повторно используемую и структурированную логику.|
| Пример	| `dbt run --select my_model+`<br /> (запускает `my_model` и все зависимые от неё узлы с помощью оператора `+`). |	`dbt run --selector nightly_diet_snowplow`<br /> (запускает модели, определённые селектором `nightly_diet_snowplow` в `selectors.yml`).  |

Примечания:
- Можно сочетать `--select` с `--exclude` для выбора узлов под конкретную задачу.
- Использование [операторов графа](/reference/node-selection/graph-operators) (таких как `+`, `@`) и [операторов множеств](/reference/node-selection/set-operators) (таких как `union` и `intersection`) в `--select` эквивалентно конфигурациям на основе YAML в `--selector`.
- Если использовать `--selector` вместе с `--select` или `--exclude`, dbt применяет для выбора узлов только `--selector` и игнорирует `--select` и `--exclude`.

Дополнительные примеры приведены в [этом GitHub Gist](https://gist.github.com/jeremyyeo/1aeca767e2a4f157b07955d58f8078f7).
</VersionBlock>

<VersionBlock firstVersion="1.12">

## Использование `selector:` с `--select`

Начиная с <Constant name="dbt" /> v1.12, dbt выдаёт предупреждение `SelectExcludeIgnoredWithSelectorWarning`, если устаревший флаг `--selector` используется вместе с `--select` или `--exclude`. Используйте [метод `selector:`](/reference/node-selection/methods#selector) непосредственно с `--select`, чтобы ссылаться на заранее определённый селектор наряду с другими критериями выбора.

Например: 

```
dbt run --select selector:nightly_diet_snowplow tag:nightly
```

</VersionBlock>
