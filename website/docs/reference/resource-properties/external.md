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
              meta: {dictionary}
            - ...
          <additional_property>: <additional_value>
```

</File>

## Определение {#definition}

Используйте `external` для источника, чтобы описать таблицу, которая читает файлы из облачного хранилища, например S3 или GCS. dbt сохраняет эти свойства в манифесте, а пакет [`dbt-external-tables`](https://github.com/dbt-labs/dbt-external-tables) использует их для создания таблицы в вашем хранилище данных. Доступны необязательные встроенные свойства с простой проверкой типов, которые в общих чертах соответствуют спецификации внешних таблиц Hive (<Term id="table" />).

dbt не проверяет большинство этих свойств, поэтому вы также можете добавлять собственные.

Вы можете захотеть определить свойство `external`, чтобы:
- Поддерживать макросы, которые анализируют [`graph.sources`](/reference/dbt-jinja-functions/graph)
- Определять метаданные, которые вы сможете позже извлечь из [manifest](/reference/artifacts/manifest-json)

Пример использования этого свойства для реализации пользовательских рабочих процессов см. в пакете [`dbt-external-tables`](https://github.com/dbt-labs/dbt-external-tables).

## Партиции

Партиция — это столбец, значение которого определяется путём к папке файла, например `dt` в `events/dt=2025-01-01/`. Объявление партиции позволяет вашей платформе данных пропускать папки, к которым вы не обращаетесь в запросе.

Необходимые свойства зависят от вашей платформы данных. Например:

<SimpleTable>
  
| Платформа данных | Свойства |
|---|---|
| Snowflake | `name`, `data_type`, `expression` |
| BigQuery | `name`, `data_type` |
| Redshift | `name`, `data_type`, `vals`, `path_macro` |
| Spark | `name` |

</SimpleTable>

Полный список см. в [примерах источников `dbt-external-tables`](https://github.com/dbt-labs/dbt-external-tables/tree/main/sample_sources).

:::info
Размещайте `meta` непосредственно в определении партиции. dbt не переносит его в `config` для `external`, а `dbt-external-tables` не считывает `config.meta`.
:::

## Примеры

Следующие примеры показывают внешнюю таблицу на основе файлов событий в облачном хранилище с партиционированием по дате (обратите внимание, что свойства партиций различаются в зависимости от платформы данных).

<Tabs>
<TabItem value="snowflake" label="Snowflake">

```yml
sources:
  - name: snowplow
    tables:
      - name: event_ext_tbl
        external:
          location: "@raw.snowplow.snowplow"  # существующая внешняя промежуточная область
          file_format: "( type = json )"
          auto_refresh: true
          partitions:
            - name: collector_hour
              data_type: timestamp
              expression: to_timestamp(substr(metadata$filename, 8, 13), 'YYYY/MM/DD/HH24')
```

`metadata$filename` — это путь к файлу. Выражение `expression` извлекает из него час.

</TabItem>
<TabItem value="bigquery" label="BigQuery">

```yml
sources:
  - name: snowplow
    tables:
      - name: event
        external:
          location: 'gs://bucket/path/*'
          options:
            format: csv
            skip_leading_rows: 1
            hive_partition_uri_prefix: 'gs://bucket/path/'
          partitions:
            - name: collector_date
              data_type: date
```

BigQuery считывает партицию из папок в стиле Hive, например `gs://bucket/path/collector_date=2020-01-01/`. Вам достаточно указать имя столбца и его тип.

</TabItem>
<TabItem value="redshift" label="Redshift">

```yml
sources:
  - name: snowplow
    tables:
      - name: event
        external:
          location: "s3://bucket/path"
          row_format: >
            serde 'org.openx.data.jsonserde.JsonSerDe'
          partitions:
            - name: appId
              data_type: varchar(255)
              vals:
                - dev
                - prod
              path_macro: dbt_external_tables.key_value
```

Для Redshift необходимо указать значения (`vals`) и макрос (`path_macro`), который преобразует каждое значение в путь к папке.

</TabItem>
</Tabs>
