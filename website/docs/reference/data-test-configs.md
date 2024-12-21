---
title: Конфигурации тестов данных
description: "Прочтите это руководство, чтобы узнать о конфигурациях тестов данных в dbt."
meta:
  resource_type: Data tests
---
import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';


## Связанная документация

* [Тесты данных](/docs/build/data-tests)

Тесты данных могут быть настроены несколькими способами:
1. Свойства в определении `.yml` (только для общих тестов, полную синтаксис смотрите в [свойствах тестов](/reference/resource-properties/data-tests))
2. Блок `config()` в SQL-определении теста
3. В `dbt_project.yml`

Конфигурации тестов данных применяются иерархически, в порядке специфичности, указанном выше. В случае отдельного теста блок `config()` в SQL-определении имеет приоритет над конфигурациями в файле проекта. В случае конкретного экземпляра общего теста свойства `.yml` теста будут иметь приоритет над любыми значениями, установленными в `config()` его общего SQL-определения, которые, в свою очередь, будут иметь приоритет над значениями, установленными в `dbt_project.yml`.

## Доступные конфигурации

Нажмите на ссылку каждой опции конфигурации, чтобы узнать больше о её возможностях.

### Конфигурации, специфичные для тестов данных

<ConfigResource meta={frontMatter.meta} />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
    { label: 'Файл свойств', value: 'property-yaml', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
tests:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[fail_calc](/reference/resource-configs/fail_calc): <string>
    [+](/reference/resource-configs/plus-prefix)[limit](/reference/resource-configs/limit): <integer>
    [+](/reference/resource-configs/plus-prefix)[severity](/reference/resource-configs/severity): error | warn
    [+](/reference/resource-configs/plus-prefix)[error_if](/reference/resource-configs/severity): <string>
    [+](/reference/resource-configs/plus-prefix)[warn_if](/reference/resource-configs/severity): <string>
    [+](/reference/resource-configs/plus-prefix)[store_failures](/reference/resource-configs/store_failures): true | false
    [+](/reference/resource-configs/plus-prefix)[where](/reference/resource-configs/where): <string>

```

</File>

</TabItem>


<TabItem value="config">

```jinja

{{ config(
    [fail_calc](/reference/resource-configs/fail_calc) = "<string>",
    [limit](/reference/resource-configs/limit) = <integer>,
    [severity](/reference/resource-configs/severity) = "error | warn",
    [error_if](/reference/resource-configs/severity) = "<string>",
    [warn_if](/reference/resource-configs/severity) = "<string>",
    [store_failures](/reference/resource-configs/store_failures) = true | false,
    [where](/reference/resource-configs/where) = "<string>"
) }}

```


</TabItem>

<TabItem value="property-yaml">

```yaml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - <test_name>: # # Фактическое имя теста. Например, dbt_utils.equality
          name: # Человеко-понятное имя теста. Например, equality_fct_test_coverage
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [fail_calc](/reference/resource-configs/fail_calc): <string>
            [limit](/reference/resource-configs/limit): <integer>
            [severity](/reference/resource-configs/severity): error | warn
            [error_if](/reference/resource-configs/severity): <string>
            [warn_if](/reference/resource-configs/severity): <string>
            [store_failures](/reference/resource-configs/store_failures): true | false
            [where](/reference/resource-configs/where): <string>

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - <test_name>:
              name: 
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [fail_calc](/reference/resource-configs/fail_calc): <string>
                [limit](/reference/resource-configs/limit): <integer>
                [severity](/reference/resource-configs/severity): error | warn
                [error_if](/reference/resource-configs/severity): <string>
                [warn_if](/reference/resource-configs/severity): <string>
                [store_failures](/reference/resource-configs/store_failures): true | false
                [where](/reference/resource-configs/where): <string>
```

Этот механизм конфигурации поддерживается только для конкретных экземпляров общих тестов. Чтобы настроить конкретный отдельный тест, следует использовать макрос `config()` в его SQL-определении.


</TabItem>

</Tabs>


### Общие конфигурации

<ConfigGeneral />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
    { label: 'Файл свойств', value: 'property-yaml', },
  ]
}>
<TabItem value="project-yaml">


<File name='dbt_project.yml'>

```yaml
tests:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {dictionary}
    # актуально только для [store_failures](/reference/resource-configs/store_failures)
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
```
</File>

</TabItem>

<TabItem value="config">


```jinja

{{ config(
    [enabled](/reference/resource-configs/enabled)=true | false,
    [tags](/reference/resource-configs/tags)="<string>" | ["<string>"]
    [meta](/reference/resource-configs/meta)={dictionary},
    [database](/reference/resource-configs/database)="<string>",
    [schema](/reference/resource-properties/schema)="<string>",
    [alias](/reference/resource-configs/alias)="<string>",
) }}

```

</TabItem>

<TabItem value="property-yaml">

```yaml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - <test_name>: # Фактическое имя теста. Например, dbt_utils.equality
          name: # Человеко-понятное имя теста. Например, equality_fct_test_coverage
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [enabled](/reference/resource-configs/enabled): true | false
            [tags](/reference/resource-configs/tags): <string> | [<string>]
            [meta](/reference/resource-configs/meta): {dictionary}
            # актуально только для [store_failures](/reference/resource-configs/store_failures)
            [database](/reference/resource-configs/database): <string>
            [schema](/reference/resource-properties/schema): <string>
            [alias](/reference/resource-configs/alias): <string>

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - <test_name>:
              name: 
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [enabled](/reference/resource-configs/enabled): true | false
                [tags](/reference/resource-configs/tags): <string> | [<string>]
                [meta](/reference/resource-configs/meta): {dictionary}
                # актуально только для [store_failures](/reference/resource-configs/store_failures)
                [database](/reference/resource-configs/database): <string>
                [schema](/reference/resource-properties/schema): <string>
                [alias](/reference/resource-configs/alias): <string>
```

Этот механизм конфигурации поддерживается только для конкретных экземпляров общих тестов данных. Чтобы настроить конкретный отдельный тест, следует использовать макрос `config()` в его SQL-определении.


</TabItem>


</Tabs>

### Примеры

#### Добавление тега к одному тесту

Если это конкретный экземпляр общего теста данных:

<File name='models/<filename>.yml'>

```yml
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - unique:
              tags: ['my_tag']
```

</File>

Если это отдельный тест данных:

<File name='tests/<filename>.sql'>

```sql
{{ config(tags = ['my_tag']) }}

select ...
```

</File>

#### Установка уровня серьезности по умолчанию для всех экземпляров общего теста данных

<File name='macros/<filename>.sql'>

```sql
{% test my_test() %}

    {{ config(severity = 'warn') }}

    select ...

{% endtest %}
```

</File>

#### Отключение всех тестов данных из пакета

<File name='dbt_project.yml'>

```yml
tests:
  package_name:
    +enabled: false
```

</File>

#### Указание пользовательских конфигураций для общих тестов данных

Начиная с dbt v1.9, вы можете использовать любой пользовательский ключ конфигурации для указания пользовательских конфигураций для тестов данных. Например, следующее указывает пользовательскую конфигурацию `snowflake_warehouse`, которую dbt должен использовать при выполнении теста данных `accepted_values`:

```yml

models:
  - name: my_model
    columns:
      - name: color
        tests:
          - accepted_values:
              values: ['blue', 'red']
              config:
                severity: warn
                snowflake_warehouse: my_warehouse

```

С учетом конфигурации, тест данных выполняется на другом виртуальном складе Snowflake, чем тот, который используется в вашем подключении по умолчанию, чтобы обеспечить лучшее соотношение цены и производительности с другим размером склада или более детальной аллокацией и видимостью затрат.