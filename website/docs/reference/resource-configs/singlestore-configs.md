---
title: "Конфигурации SingleStore"
id: "singlestore-configs"
---

## Стратегии инкрементной материализации
Конфигурация [`incremental_strategy`](/docs/build/incremental-models#about-incremental_strategy) управляет тем, как dbt строит инкрементные модели. В настоящее время SingleStoreDB поддерживает только конфигурацию `delete+insert`.

Стратегия инкрементного обновления `delete+insert` указывает dbt следовать двухэтапному инкрементному подходу. Сначала она определяет и удаляет записи, помеченные в блоке `is_incremental()`. Затем эти записи повторно вставляются.

## Оптимизация производительности
Документация [по проектированию физической схемы базы данных SingleStore](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design.html) полезна, если вы хотите использовать определенные параметры (описанные ниже) в вашем проекте dbt.

### Тип хранения
SingleStore поддерживает два типа хранения: **In-Memory Rowstore** и **Disk-based Columnstore** (последний является типом по умолчанию). Подробности можно найти в [документации](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design/choosing-a-table-storage-type.html). Адаптер dbt-singlestore позволяет вам указать, на каком типе хранения будет основываться материализация вашей таблицы, используя параметр конфигурации `storage_type`.

<File name='rowstore_model.sql'>

```sql
{{ config(materialized='table', storage_type='rowstore') }}

select ...
```

</File>

### Ключи

Таблицы SingleStore являются [шардированными](https://docs.singlestore.com/managed-service/en/getting-started-with-managed-service/about-managed-service/sharding.html) и могут быть созданы с различными определениями столбцов. Следующие параметры поддерживаются адаптером dbt-singlestore, каждый из них принимает `column_list` (список имен столбцов) в качестве значения параметра. Пожалуйста, обратитесь к [Созданию таблицы Columnstore](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/procedures-for-physical-database-schema-design/creating-a-columnstore-table.html) для получения дополнительной информации о различных типах ключей в SingleStore.
- `primary_key` (переводится как `PRIMARY KEY (column_list)`)
- `sort_key` (переводится как `KEY (column_list) USING CLUSTERED COLUMNSTORE`)
- `shard_key` (переводится как `SHARD KEY (column_list)`)
- `unique_table_key` (переводится как `UNIQUE KEY (column_list)`)

<File name='primary_and_shard_model.sql'>

```sql
{{
    config(
        primary_key=['id', 'user_id'],
        shard_key=['id']
    )
}}

select ...
```

</File>

<File name='unique_and_sort_model.sql'>

```sql
{{
    config(
        materialized='table',
        unique_table_key=['id'],
        sort_key=['status'],
    )
}}

select ...
```

</File>

### Индексы
Аналогично адаптеру Postgres, модели таблиц, инкрементные модели, семена и снимки могут иметь определенный список `indexes`. Каждый индекс может иметь следующие компоненты:
- `columns` (список, обязательный): один или несколько столбцов, на которых определяется индекс
- `unique` (логический, необязательный): указывает, должен ли индекс быть объявлен уникальным
- `type` (строка, необязательный): поддерживаемый [тип индекса](https://docs.singlestore.com/managed-service/en/reference/sql-reference/data-definition-language-ddl/create-index.html), `hash` или `btree`

Поскольку таблицы SingleStore являются шардированными, существуют определенные ограничения на создание индексов, см. [документацию](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design/understanding-keys-and-indexes-in-singlestore.html) для получения дополнительных деталей.

<File name='indexes_model.sql'>

```sql
{{
    config(
        materialized='table',
        shard_key=['id'],
        indexes=[{'columns': ['order_date', 'id']}, {'columns': ['status'], 'type': 'hash'}]
    )
}}

select ...
```

</File>

### Другие параметры

Вы можете указать набор символов и сортировку для таблицы, используя параметры `charset` и/или `collation`. Поддерживаемые значения для `charset` — это `binary`, `utf8` и `utf8mb4`. Поддерживаемые значения для `collation` можно просмотреть как результат SQL-запроса `SHOW COLLATION`. Значения по умолчанию для соответствующих наборов символов — это `binary`, `utf8_general_ci` и `utf8mb4_general_ci`.

<File name='utf8mb4_model.sql'>

```sql
{{
    config(
        charset='utf8mb4',
        collation='utf8mb4_general_ci'
    )
}}

select ...
```

</File>

## Контракты моделей

Начиная с версии 1.5, адаптер `dbt-singlestore` поддерживает контракты моделей.

| Тип ограничения | Поддержка       | Принуждение на платформе |
|:----------------|:----------------|:------------------|
| not_null        | ✅  Поддерживается | ✅ Принуждается  |
| primary_key     | ✅  Поддерживается | ❌ Не принуждается |
| foreign_key     | ❌  Не поддерживается | ❌ Не принуждается |
| unique          | ✅  Поддерживается | ❌ Не принуждается |
| check           | ❌ Не поддерживается | ❌  Не принуждается |

Учитывайте следующие ограничения при использовании контрактов с адаптером `dbt-singlestore`:

### Определения модели и столбцов:
   - Ограничение `unique` может быть установлено только на уровне модели. Поэтому не устанавливайте его на уровне столбца.
   - Повторяющиеся ограничения вызовут ошибку. Например, установка `primary_key` как в настройках столбца, так и в настройках модели вызовет ошибку.

### Переопределение настроек:

Настройка контракта переопределяет настройку конфигурации. Например, если вы определяете `primary_key` или `unique_table_key` в конфигурации, а затем также устанавливаете его в контракте, настройка контракта заменяет настройку конфигурации.

### Работа с константами:

<File name='dim_customers.yml'>

```sql
models:
  - name: dim_customers
    config:
      materialized: table
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: int
        constraints:
          - type: not_null
      - name: customer_name
        data_type: text
```

</File>

Предположим, ваша модель определена как:

<File name='dim_customers.sql'>

```sql
select
  'abc123' as customer_id,
  'My Best Customer' as customer_name
```

</File>

При использовании констант вы должны явно указывать типы данных. Если этого не сделать, SingleStoreDB автоматически выберет то, что считает наиболее подходящим типом данных.

<File name='dim_customers.sql'>

```sql
select
  ('abc123' :> int) as customer_id,
  ('My Best Customer' :> text) as customer_name
```

</File>

### Вводящие в заблуждение типы данных

Использование `контрактов моделей` гарантирует, что вы случайно не добавите неправильный тип данных в столбец. Например, если вы ожидаете число в столбце, но случайно указываете текст для добавления, контракт модели поймает это и вернет ошибку.

Сообщение об ошибке может иногда показывать другое имя типа данных, чем ожидалось, из-за того, как работает соединитель `singlestoredb-python`. Например,

<File name='dim_customers.sql'>

```sql
select
  'abc123' as customer_id,
  ('My Best Customer' :> text) as customer_name
```

</File>

приведет к

```sql
Пожалуйста, убедитесь, что имя, тип данных и количество столбцов в вашем контракте соответствуют столбцам в определении вашей модели.
| column_name | definition_type | contract_type | mismatch_reason       |
| customer_id | LONGBLOB        | LONG          | несоответствие типа данных |
```

Важно отметить, что некоторые сопоставления типов данных могут отображаться иначе в сообщениях об ошибках, но это не влияет на их работу. Вот краткий список того, что вы можете увидеть:

| Тип данных  | Тип данных, возвращаемый<br/>singlestoredb-python |
|:-----------|:-----------------------------------------------|
| BOOL       | TINY                                           |
| INT        | LONG                                           |
| CHAR       | BINARY                                         |
| VARCHAR    | VARBINARY                                      |
| TEXT       | BLOB                                           |
| TINYTEXT   | TINYBLOB                                       |
| MEDIUMTEXT | MEDIUMBLOB                                     |
| LONGTEXT   | LONGBLOB                                       |

Просто имейте в виду эти моменты при настройке и использовании вашего адаптера `dbt-singlestore`, и вы избежите распространенных ошибок!