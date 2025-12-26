---
resource_types: sources
datatype: {dictionary}
---

<File name='models/<filename>.yml'>

```yml

sources:
  - name: <source_name>
    tables:
      - name: <table_name>
        external:
          location: <string>
          file_format: <string>
          row_format: <string>
          tbl_properties: <string>      
          partitions:
            - name: <column_name>
              data_type: <string>
              description: <string>
              config:
                meta: {dictionary} # changed to config in v1.10
            - ...
          <additional_property>: <additional_value>
```

</File>

## Определение

Расширяемый словарь метаданных, специфичных для источников, которые указывают на внешние таблицы.
Существуют необязательные встроенные свойства с простой проверкой типов, которые примерно соответствуют спецификации внешних таблиц Hive. Вы можете определить и использовать столько дополнительных свойств, сколько захотите.

Вы можете захотеть определить свойство `external`, чтобы:
- Поддерживать макросы, которые анализируют [`graph.sources`](/reference/dbt-jinja-functions/graph)
- Определять метаданные, которые вы сможете позже извлечь из [manifest](/reference/artifacts/manifest-json)

Для примера того, как это свойство может быть использовано для поддержки пользовательских рабочих процессов, смотрите пакет [`dbt-external-tables`](https://github.com/dbt-labs/dbt-external-tables).