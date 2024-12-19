---
title: "YAML Селекторы"
---

Записывайте селекторы ресурсов в YAML, сохраняйте их с понятным именем и ссылайтесь на них, используя флаг `--selector`. Записывая селекторы в файл верхнего уровня `selectors.yml`:

* **Читаемость:** сложные критерии выбора состоят из словарей и массивов
* **Контроль версий:** определения селекторов хранятся в том же git-репозитории, что и проект dbt
* **Повторное использование:** селекторы могут использоваться в нескольких определениях задач, и их определения могут быть расширены (с помощью якорей YAML)

Селекторы находятся в файле верхнего уровня с именем `selectors.yml`. Каждый селектор должен иметь `name` и `definition`, а также может опционально определять `description` и [`default` флаг](#default).

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

## Определения

Каждое `definition` состоит из одного или нескольких аргументов, которые могут быть одним из следующих:
* **CLI-стиль:** строки, представляющие аргументы в стиле CLI
* **Ключ-значение:** пары в формате `method: value`
* **Полный YAML:** полностью определенные словари с элементами для `method`, `value`, эквивалентными ключевыми словами операторов и поддержкой `exclude`

Используйте ключевые слова, эквивалентные операторам `union` и `intersection`, чтобы организовать несколько аргументов.

### CLI-стиль

```yml
definition:
  'tag:nightly'
```

Этот простой синтаксис поддерживает использование операторов `+`, `@` и `*` [графа](/reference/node-selection/graph-operators), но не поддерживает [множества](/reference/node-selection/set-operators) или `exclude`.

### Ключ-значение

```yml
definition:
  tag: nightly
```

Этот простой синтаксис не поддерживает никакие [графовые](/reference/node-selection/graph-operators) или [множества](/reference/node-selection/set-operators) операторы или `exclude`.

### Полный YAML

Это самый полный синтаксис, который может включать эквивалентные ключевые слова для [графовых](/reference/node-selection/graph-operators) и [множества](/reference/node-selection/set-operators) операторов.

Посмотрите [методы](/reference/node-selection/methods) для доступного списка.

```yml
definition:
  method: tag
  value: nightly

  # Опциональные ключевые слова соответствуют операторам графа `+` и `@`:

  children: true | false
  parents: true | false

  children_depth: 1    # если children: true, степени для включения
  parents_depth: 1     # если parents: true, степени для включения

  childrens_parents: true | false     # оператор @

  indirect_selection: eager | cautious | buildable | empty # включать все тесты, выбранные косвенно? по умолчанию eager
```

Оператор `*`, чтобы выбрать все узлы, можно записать как:
```yml
definition:
  method: fqn
  value: "*"
```

#### Исключение

Ключевое слово `exclude` поддерживается только полностью квалифицированными словарями. Оно может быть передано как аргумент каждому словарю или как элемент в `union`. Следующие примеры эквивалентны:

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

Примечание: Аргумент `exclude` в YAML селекторах немного отличается от аргумента CLI `--exclude`. Здесь `exclude` _всегда_ возвращает [разность множеств](https://en.wikipedia.org/wiki/Complement_(set_theory)), и он всегда применяется _последним_ в своем контексте.

Когда передается более одного "yeslist" (`--select`), они обрабатываются как [объединение](/reference/node-selection/set-operators#unions), а не как [пересечение](/reference/node-selection/set-operators#intersections). То же самое происходит, когда есть более одного "nolist" (`--exclude`).

#### Косвенный выбор

В общем случае dbt будет косвенно выбирать _все_ тесты, если они касаются _любого_ ресурса, который вы выбираете напрямую. Мы называем это "eager" косвенным выбором. Вы можете опционально переключить режим косвенного выбора на "cautious", "buildable" или "empty", установив `indirect_selection` для конкретного критерия:

```yml
- union:
    - method: fqn
      value: model_a
      indirect_selection: eager  # по умолчанию: будет включать все тесты, касающиеся model_a
    - method: fqn
      value: model_b
      indirect_selection: cautious  # не будет включать тесты, касающиеся model_b
                        # если у них есть другие невыбранные родительские узлы
    - method: fqn
      value: model_c
      indirect_selection: buildable  # не будет включать тесты, касающиеся model_c
                        # если у них есть другие невыбранные родительские узлы (если у них нет предка, который выбран)
    - method: fqn
      value: model_d
      indirect_selection: empty  # будет включать тесты только для выбранного узла и игнорировать все тесты, связанные с model_d
```

Если указано, значение `indirect_selection` селектора YAML будет иметь приоритет над флагом CLI `--indirect-selection`. Поскольку `indirect_selection` определяется отдельно для _каждого_ критерия выбора, возможно смешивать режимы eager/cautious/buildable/empty в одном определении, чтобы достичь необходимого поведения. Помните, что вы всегда можете протестировать свои критерии с помощью `dbt ls --selector`.

Смотрите [примеры выбора тестов](/reference/node-selection/test-selection-examples) для получения дополнительной информации о косвенном выборе.

## Пример

Вот два способа представить:

```bash
$ dbt run --select @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
```

<Tabs
  defaultValue="cli_style"
  values={[
    { label: 'CLI-стиль', value: 'cli_style', },
    { label: 'Полный YAML', value: 'all_yml', },
  ]
}>

<TabItem value="cli_style">
<File name='selectors.yml'>

```yml

selectors:
  - name: nightly_diet_snowplow
    description: "Неинкрементальные модели Snowplow, которые обеспечивают ночные экспорты"
    definition:

      # Опциональные ключевые слова `union` и `intersection` соответствуют операторам ` ` и `,` множеств:
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
      # Опциональные ключевые слова `union` и `intersection` соответствуют операторам ` ` и `,` множеств:
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

Затем в нашем определении задачи:
```bash
dbt run --selector nightly_diet_snowplow
```

## По умолчанию

Селекторы могут определять логическое свойство `default`. Если у селектора установлено `default: true`, dbt будет использовать критерии этого селектора, когда задачи не определяют свои собственные критерии выбора.

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

Если я выполню "неквалифицированную" команду, dbt будет использовать критерии выбора, определенные в `root_project_only` — то есть dbt будет строить / проверять свежесть / генерировать скомпилированный SQL только для ресурсов, определенных в моем корневом проекте.

```
dbt build
dbt source freshness
dbt docs generate
```

Если я выполню команду, которая определяет свои собственные критерии выбора (через `--select`, `--exclude` или `--selector`), dbt проигнорирует селектор по умолчанию и будет использовать критерии флага вместо этого. Он не будет пытаться комбинировать оба.

```bash
dbt run --select  "model_a"
dbt run --exclude model_a
```

Только один селектор может установить `default: true` для данного вызова; в противном случае dbt вернет ошибку. Вы можете использовать выражение Jinja, чтобы изменить значение `default` в зависимости от окружения:

```yml
selectors:
  - name: default_for_dev
    default: "{{ target.name == 'dev' | as_bool }}"
    definition: ...
  - name: default_for_prod
    default: "{{ target.name == 'prod' | as_bool }}"
    definition: ...
```

### Наследование селекторов

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
        # повторно используем определение из выше
        - method: selector
          value: foo_and_bar
        # с модификацией!
        - exclude:
            - method: tag
              value: buzz
```

**Примечание:** Хотя наследование селекторов позволяет _повторно использовать_ логику из другого селектора, оно не позволяет _изменять_ логику этого селектора с помощью `parents`, `children`, `indirect_selection` и т. д.

Метод `selector` возвращает полный набор узлов, возвращаемых именованным селектором.