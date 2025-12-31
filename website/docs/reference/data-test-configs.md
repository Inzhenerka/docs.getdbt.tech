---
title: Конфигурации тестов данных
description: "Прочтите это руководство, чтобы узнать о конфигурациях тестов данных в dbt."
meta:
  resource_type: Data tests
---
import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';


## Связанная документация {#related-documentation}

* [Тесты данных](/docs/build/data-tests)

Тесты данных могут быть настроены несколькими способами:
1. Свойства в определении `.yml` (только для общих тестов, полную синтаксис смотрите в [свойствах тестов](/reference/resource-properties/data-tests))
2. Блок `config()` в SQL-определении теста
3. В `dbt_project.yml`

Конфигурации тестов данных применяются иерархически, в порядке возрастания специфичности, описанном выше. В случае **singular‑теста** блок `config()` внутри SQL‑определения имеет приоритет над конфигурациями, заданными в YAML‑файле проекта. В случае конкретного экземпляра **generic‑теста** свойства теста, указанные в его `.yml`‑файле, имеют приоритет над любыми значениями, заданными в `config()` его обобщённого SQL‑определения, которые, в свою очередь, имеют приоритет над значениями, указанными в YAML‑файле проекта (`dbt_project.yml`).

## Доступные конфигурации {#available-configurations}

Нажмите на ссылку каждой опции конфигурации, чтобы узнать больше о её возможностях.

### Конфигурации, специфичные для тестов данных {#data-test-specific-configurations}

<ConfigResource meta={frontMatter.meta} />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Конфигурация SQL-файла', value: 'config', },
    { label: 'Файл свойств', value: 'property-yaml', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
data_tests:
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

<resource_type>:
  - name: <resource_name>
    data_tests:
      - <test_name>: # Фактическое имя теста. Например, dbt_utils.equality
          name: # Человекочитаемое имя теста. Например, equality_fct_test_coverage
          [description](/reference/resource-properties/description): "markdown formatting"
          arguments: # Доступно в версии v1.10.5 и выше. В более старых версиях <argument_name> можно указывать как свойство верхнего уровня.
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
        data_tests:
          - <test_name>:
              name: 
              [description](/reference/resource-properties/description): "markdown formatting"
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
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


### Общие конфигурации {#general-configurations}

<ConfigGeneral />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Конфигурация SQL-файла', value: 'config', },
    { label: 'Файл свойств', value: 'property-yaml', },
  ]
}>
<TabItem value="project-yaml">


<File name='dbt_project.yml'>

```yaml
data_tests:
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

<resource_type>:
  - name: <resource_name>
    data_tests:
      - <test_name>: # Фактическое имя теста. Например, dbt_utils.equality
          name: # Человекочитаемое имя теста. Например, equality_fct_test_coverage
          [description](/reference/resource-properties/description): "markdown formatting"
          arguments: # доступно в версии v1.10.5 и выше. В более старых версиях <argument_name> можно задавать как свойство верхнего уровня.
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
        data_tests:
          - <test_name>:
              name: 
              [description](/reference/resource-properties/description): "markdown formatting"
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
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

### Примеры {#examples}

#### Добавление тега к одному тесту {#add-a-tag-to-one-test}

Если это конкретный экземпляр общего теста данных:

<File name='models/<filename>.yml'>

```yml
models:
  - name: my_model
    columns:
      - name: id
        data_tests:
          - unique:
              config:
                tags: ['my_tag'] # changed to config in v1.10
```

</File>

Если это отдельный тест данных:

<File name='tests/<filename>.sql'>

```sql
{{ config(tags = ['my_tag']) }}

select ...
```

</File>

#### Установка уровня серьезности по умолчанию для всех экземпляров общего теста данных {#set-the-default-severity-for-all-instances-of-a-generic-data-test}

<File name='macros/<filename>.sql'>

```sql
{% test my_test() %}

    {{ config(severity = 'warn') }}

    select ...

{% endtest %}
```

</File>

#### Отключение всех тестов данных из пакета {#disable-all-data-tests-from-a-package}

<File name='dbt_project.yml'>

```yml
data_tests:
  package_name:
    +enabled: false
```

</File>

#### Указание пользовательских конфигураций для общих тестов данных {#specify-custom-configurations-for-generic-data-tests}

Начиная с dbt v1.9, вы можете использовать любой пользовательский ключ конфигурации для указания пользовательских конфигураций для тестов данных. Например, следующее указывает пользовательскую конфигурацию `snowflake_warehouse`, которую dbt должен использовать при выполнении теста данных `accepted_values`:

```yml

models:
  - name: my_model
    columns:
      - name: color
        data_tests:
          - accepted_values:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ['blue', 'red']
              config:
                severity: warn
                snowflake_warehouse: my_warehouse

```

При такой конфигурации data test выполняется на другом виртуальном складе Snowflake, а не на том, который указан в вашем подключении по умолчанию. Это позволяет добиться лучшего соотношения цены и производительности за счёт использования склада другого размера или более детального распределения и прозрачности затрат.

#### Добавление описания к generic и singular тестам {#add-a-description-to-generic-and-singular-tests}

Начиная с dbt v1.9 (также доступно в <Constant name="cloud" /> [release tracks](/docs/dbt-versions/cloud-release-tracks)), вы можете добавлять [описания](/reference/resource-properties/data-tests#description) как к generic, так и к singular тестам.

Для generic теста описание добавляется непосредственно в существующий YAML:

<File name='models/staging/<filename>.yml'>

```yml
models:
  - name: my_model
    columns:
      - name: delivery_status
        data_tests:
          - accepted_values:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ['delivered', 'pending', 'failed']
              description: "This test checks whether there are unexpected delivery statuses. If it fails, check with logistics team"
```

</File>

Также можно добавлять описания непосредственно в Jinja‑макрос, который реализует основную логику generic data test. Подробнее см. в разделе [Add description to generic data test logic](/best-practices/writing-custom-generic-tests#add-description-to-generic-data-test-logic).

Для singular теста описание задаётся в файле в директории тестов:

<File name='tests/my_custom_test.yml'>

```yml
data_tests: 
  - name: my_custom_test
    description: "This test checks whether the rolling average of returns is inside of expected bounds. If it isn't, flag to customer success team"
```

</File>

Дополнительную информацию см. в разделе [Add a description to a data test](/reference/resource-properties/description#add-a-description-to-a-data-test).
