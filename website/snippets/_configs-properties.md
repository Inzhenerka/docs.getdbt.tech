## Пример
Ниже приведён пример, в котором для проекта определены и `sources`, и `models`:

<File name='models/jaffle_shop.yml'>

```yml
version: 2

sources:
  - name: raw_jaffle_shop
    description: A replica of the postgres database used to power the jaffle_shop app.
    tables:
      - name: customers
        columns:
          - name: id
            description: Primary key of the table
            data_tests:
              - unique
              - not_null

      - name: orders
        columns:
          - name: id
            description: Primary key of the table
            data_tests:
              - unique
              - not_null

          - name: user_id
            description: Foreign key to customers

          - name: status
            data_tests:
              - accepted_values:
                  arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                    values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']


models:
  - name: stg_jaffle_shop__customers #  Must match the filename of a model -- including case sensitivity.
    config:
      tags: ['pii']
    columns:
      - name: customer_id
        data_tests:
          - unique
          - not_null

  - name: stg_jaffle_shop__orders
    config:
      materialized: view
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
      - name: status
        data_tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
              config:
                severity: warn
```

</File>

## Связанная документация
Полный список всех поддерживаемых свойств и конфигураций, разбитый по типам ресурсов, можно найти здесь:
* Модели: [properties](/reference/model-properties) и [configs](/reference/model-configs)
* Источники: [properties](/reference/source-properties) и [configs](/reference/source-configs)
* Seed-данные: [properties](/reference/seed-properties) и [configs](/reference/seed-configs)
* Снимки (snapshots): [properties](/reference/snapshot-properties)
* Анализы: [properties](/reference/analysis-properties)
* Макросы: [properties](/reference/macro-properties)
* Экспозиции (exposures): [properties](/reference/exposure-properties)

## Часто задаваемые вопросы (FAQ)
<FAQ path="Project/schema-yml-name" />
<FAQ path="Project/resource-yml-name" />
<FAQ path="Project/multiple-resource-yml-files" />
<FAQ path="Project/properties-not-in-config" />
<FAQ path="Project/why-version-2" />
<FAQ path="Project/yaml-file-extension" />

## Устранение распространённых ошибок

<Expandable alt_header="Invalid test config given in [model name]">

Эта ошибка возникает, когда ваш файл `.yml` не соответствует структуре, ожидаемой dbt. Полное сообщение об ошибке может выглядеть так:
```
* Invalid test config given in models/schema.yml near {'namee': 'event', ...}
  Invalid arguments passed to "UnparsedNodeUpdate" instance: 'name' is a required property, Additional properties are not allowed ('namee' was unexpected)
```

Хотя сообщение достаточно подробное, оно должно помочь определить источник проблемы. В данном случае поле `name` было по ошибке указано как `namee`. Чтобы исправить эту ошибку, убедитесь, что ваш `.yml` файл соответствует ожидаемой структуре, описанной в этом руководстве.

</Expandable>

<Expandable alt_header="Invalid syntax in your schema.yml file" >

Если ваш файл `.yml` не является корректным YAML, dbt покажет ошибку вида:

```text
Runtime Error
  Syntax error near line 6
  ------------------------------
  5  |   - name: events
  6  |     description; "A table containing clickstream events from the marketing website"
  7  |

  Raw Error:
  ------------------------------
  while scanning a simple key
    in "<unicode string>", line 6, column 5:
          description; "A table containing clickstream events from the marketing website"
          ^
```

Эта ошибка произошла из-за того, что после поля `description` по ошибке была использована точка с запятой (`;`) вместо двоеточия (`:`). Чтобы устранить подобные проблемы, найдите файл `.yml`, указанный в сообщении об ошибке, и исправьте все синтаксические ошибки в этом файле. В этом могут помочь онлайн-валидаторы YAML, однако будьте осторожны и не отправляйте конфиденциальную информацию в сторонние сервисы!

</Expandable>
