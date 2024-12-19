---
title: "Конфигурации Firebolt"
id: "firebolt-configs"
---


## Установка `quote_columns`

Чтобы избежать предупреждения, убедитесь, что вы явно установили значение для `quote_columns` в вашем `dbt_project.yml`. Дополнительную информацию смотрите в [документации по quote_columns](https://docs.getdbt.com/reference/resource-configs/quote_columns).

```yaml
seeds:
  +quote_columns: false  #или `true`, если у вас есть заголовки столбцов CSV с пробелами
```


## Конфигурация модели для фактических таблиц

Модель dbt может быть создана как фактическая таблица Firebolt <Term id="table" /> и настроена с использованием следующего синтаксиса:

<Tabs
  groupId="config-fact"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: table
    +table_type: fact
    +primary_index: [ <column-name>, ... ]
    +indexes:
      - index_type: aggregating
        key_columns: [ <column-name>, ... ]
        aggregation: [ <agg-sql>, ... ]
      ...
```

</File>
</TabItem>

<TabItem value="property-yaml">
<File name='models/properties.yml'>

```yaml
models:
  - name: <model-name>
    config:
      materialized: table
      table_type: fact
      primary_index: [ <column-name>, ... ]
      indexes:
        - index_type: aggregating
          key_columns: [ <column-name>, ... ]
          aggregation: [ <agg-sql>, ... ]
        ...
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "table"
    table_type = "fact"
    primary_index = [ "<column-name>", ... ],
    indexes = [
      {
        "index_type": "aggregating"
        "key_columns": [ "<column-name>", ... ],
        "aggregation": [ "<agg-sql>", ... ],
      },
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>


#### Конфигурации фактической таблицы

| Конфигурация     | Описание                                                                               |
|-------------------|-------------------------------------------------------------------------------------------|
| `materialized`    | Как модель будет материализована в Firebolt. Должно быть `table`, чтобы создать фактическую таблицу. |
| `table_type`      | Будет ли материализованная таблица [фактической или размерной](https://docs.firebolt.io/godocs/Overview/working-with-tables/working-with-tables.html#fact-and-dimension-tables). |
| `primary_index`   | Устанавливает первичный индекс для фактической таблицы, используя введенный список имен столбцов из модели. Обязательно для фактических таблиц. |
| `indexes`         | Список агрегирующих индексов, которые необходимо создать на фактической таблице. |
| `index_type`      | Указывает, что индекс является [агрегирующим индексом](https://docs.firebolt.io/godocs/Guides/working-with-indexes/using-aggregating-indexes.html). Должен быть установлен на `aggregating`. |
| `key_columns`     | Устанавливает группировку агрегирующего индекса, используя введенный список имен столбцов из модели. |
| `aggregation`     | Устанавливает агрегации на агрегирующем индексе, используя введенный список SQL-агрегатных выражений. |


#### Пример фактической таблицы с агрегирующим индексом

```
{{ config(
    materialized = "table",
    table_type = "fact",
    primary_index = "id",
    indexes = [
      {
        "index_type": "aggregating",
        "key_columns": "order_id",
        "aggregation": ["COUNT(DISTINCT status)", "AVG(customer_id)"]
      }
    ]
) }}
```


## Конфигурация модели для размерных таблиц

Модель dbt может быть материализована как размерная таблица Firebolt и настроена с использованием следующего синтаксиса:

<Tabs
  groupId="config-dimension"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: table
    +table_type: dimension
    ...
```

</File>
</TabItem>

<TabItem value="property-yaml">
<File name='models/properties.yml'>

```yaml
models:
  - name: <model-name>
    config:
      materialized: table
      table_type: dimension
    ...
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "table",
    table_type = "dimension",
    ...
) }}
```

</File>
</TabItem>
</Tabs>

Размерные таблицы не поддерживают агрегирующие индексы.

#### Конфигурации размерной таблицы

| Конфигурация      | Описание                                                                               |
|--------------------|-------------------------------------------------------------------------------------------|
| `materialized`     | Как модель будет материализована в Firebolt. Должно быть `table`, чтобы создать размерную таблицу. |
| `table_type`       | Будет ли материализованная таблица [фактической или размерной](https://docs.firebolt.io/godocs/Overview/working-with-tables/working-with-tables.html#fact-and-dimension-tables). |


## Как именуются агрегирующие индексы

В dbt-firebolt вы не указываете имена для агрегирующих индексов; они именуются программно. dbt будет генерировать имена индексов, используя следующую конвенцию:

```
<table-name>__<key-column>__<index-type>_<unix-timestamp-at-execution>
```

Например, индекс соединения может быть назван `my_users__id__join_1633504263`, а агрегирующий индекс может быть назван `my_orders__order_date__aggregating_1633504263`.


## Управление загрузкой через внешние таблицы

`dbt-firebolt` поддерживает [функцию внешних таблиц](https://docs.getdbt.com/reference/resource-properties/external) dbt, которая позволяет dbt управлять процессом загрузки таблиц из S3 в Firebolt. Это необязательная функция, но она может быть очень удобной в зависимости от вашего случая использования.

Дополнительную информацию о использовании внешних таблиц, включая правильную настройку IAM, можно найти в [документации Firebolt](https://docs.firebolt.io/godocs/Guides/loading-data/working-with-external-tables.html).


#### Установка пакета внешних таблиц

Чтобы установить и использовать `dbt-external-tables` с Firebolt, вам необходимо:

1. Добавить этот пакет в ваш packages.yml:

    ```yaml
    packages:
      - package: dbt-labs/dbt_external_tables
        version: <version>
    ```

2. Добавить эти поля в ваш `dbt_project.yml`:

    ```yaml
    dispatch:
      - macro_namespace: dbt_external_tables
        search_order: ['dbt', 'dbt_external_tables']
    ```

3. Подтянуть зависимости из `packages.yml`, вызвав `dbt deps`.


#### Использование внешних таблиц

Чтобы использовать внешние таблицы, вы должны определить таблицу как `external` в вашем файле `dbt_project.yml`. Каждая внешняя таблица должна содержать поля `url`, `type` и `object_pattern`. Обратите внимание, что спецификация внешней таблицы Firebolt требует меньше полей, чем указано в документации dbt.

В дополнение к указанию столбцов, внешняя таблица может указывать разделы. Разделы не являются столбцами, и они не могут иметь такое же имя, как столбцы. Чтобы избежать ошибок парсинга YAML, не забудьте заключить строковые литералы (такие как значения `url` и `object_pattern`) в одинарные кавычки.


#### Синтаксис dbt_project.yml для внешней таблицы

```yml
sources:
  - name: firebolt_external
    schema: "{{ target.schema }}"
    loader: S3

    tables:
      - name: <table-name>
        external:
          url: 's3://<bucket_name>/'
          object_pattern: '<regex>'
          type: '<type>'
          credentials:
            aws_key_id: <key-id>
            aws_secret_key: <key-secret>
          object_pattern: '<regex>'
          compression: '<compression-type>'
          partitions:
            - name: <partition-name>
              data_type: <partition-type>
              regex: '<partition-definition-regex>'
          columns:
            - name: <column-name>
              data_type: <type>
```

`aws_key_id` и `aws_secret_key` — это учетные данные, которые позволяют Firebolt получить доступ к вашему S3-бакету. Узнайте, как их настроить, следуя этому [руководству](https://docs.firebolt.io/godocs/Guides/loading-data/creating-access-keys-aws.html). Если ваш бакет является общедоступным, эти параметры не обязательны.

#### Запуск внешних таблиц

Макрос `stage_external_sources` унаследован от [пакета dbt-external-tables](https://github.com/dbt-labs/dbt-external-tables#syntax) и является основной точкой входа при использовании этого пакета. У него есть два рабочих режима: стандартный и "полное обновление".

```bash
# пройтись по всем узлам источников, создать, если отсутствует, обновить метаданные
$ dbt run-operation stage_external_sources

# пройтись по всем узлам источников, создать или заменить (команда обновления не требуется, так как данные извлекаются в реальном времени из удаленного источника)
$ dbt run-operation stage_external_sources --vars "ext_full_refresh: true"
```

## Инкрементальные модели

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) управляет тем, как dbt строит инкрементальные модели. Firebolt в настоящее время поддерживает конфигурации `append`, `insert_overwrite` и `delete+insert`. Вы можете указать `incremental_strategy` в `dbt_project.yml` или в блоке `config()` файла модели. Конфигурация `append` является значением по умолчанию. Указание этой конфигурации является необязательным.

Стратегия `append` выполняет оператор `INSERT INTO` со всеми новыми данными на основе определения модели. Эта стратегия не обновляет и не удаляет существующие строки, поэтому, если вы не фильтруете данные только по самым последним записям, вероятно, будут вставлены дублирующиеся записи.

Пример исходного кода:

```
{{ config(
   materialized = 'incremental',
   incremental_strategy='append'
) }}

/* Все строки, возвращаемые этим запросом, будут добавлены к существующей модели */


select * from {{ ref('raw_orders') }}
{% if is_incremental() %}
   where order_date > (select max(order_date) from {{ this }})
{% endif %}
```

Пример кода выполнения:

```sql
CREATE DIMENSION TABLE IF NOT EXISTS orders__dbt_tmp AS
SELECT * FROM raw_orders
WHERE order_date > (SELECT MAX(order_date) FROM orders);

INSERT INTO orders VALUES ([columns])
SELECT ([columns])
FROM orders__dbt_tmp;
```

## Поведение семян

При выполнении команды ```dbt seed``` мы выполняем операцию `DROP CASCADE` вместо `TRUNCATE`.

## Практика

Вы можете посмотреть на нашу модифицированную версию jaffle_shop, [jaffle_shop_firebolt](https://github.com/firebolt-db/jaffle_shop_firebolt), чтобы увидеть, как можно настроить индексы, а также внешние таблицы, или клонировать и выполнить команды, указанные в README.md.