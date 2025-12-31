---
title: "Конфигурации SingleStore"
id: "singlestore-configs"
---

## Стратегии материализации инкрементальных моделей {#incremental-materialization-strategies}
[Конфигурация `incremental_strategy`](/docs/build/incremental-models#about-incremental_strategy) управляет тем, как dbt строит инкрементальные модели. В настоящее время SingleStoreDB поддерживает только конфигурацию `delete+insert`.

Инкрементальная стратегия `delete+insert` направляет dbt следовать двухэтапному инкрементальному подходу. Сначала она идентифицирует и удаляет записи, отмеченные в блоке `is_incremental()`. Затем эти записи повторно вставляются.

## Оптимизация производительности {#performance-optimizations}
[Документация по проектированию физической схемы базы данных SingleStore](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design.html) будет полезна, если вы хотите использовать определенные опции (описанные ниже) в вашем проекте dbt.

### Тип хранения {#storage-type}
SingleStore поддерживает два типа хранения: **In-Memory Rowstore** и **Disk-based Columnstore** (по умолчанию используется последний). Подробности смотрите в [документации](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design/choosing-a-table-storage-type.html). Адаптер dbt-singlestore позволяет указать, на каком типе хранения будет основываться материализация вашей таблицы, используя параметр конфигурации `storage_type`.

<File name='rowstore_model.sql'>

```sql
{{ config(materialized='table', storage_type='rowstore') }}

select ...
```

</File>

### Ключи {#keys}

Таблицы SingleStore [шардированы](https://docs.singlestore.com/managed-service/en/getting-started-with-managed-service/about-managed-service/sharding.html) и могут быть созданы с различными определениями столбцов. Адаптер dbt-singlestore поддерживает следующие опции, каждая из которых принимает `column_list` (список имен столбцов) в качестве значения опции. Пожалуйста, обратитесь к [Создание таблицы Columnstore](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/procedures-for-physical-database-schema-design/creating-a-columnstore-table.html) для получения дополнительной информации о различных типах ключей в SingleStore.
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

### Индексы {#indexes}
Аналогично адаптеру Postgres, модели таблиц, инкрементальные модели, seeds и snapshots могут иметь список определенных `indexes`. Каждый индекс может иметь следующие компоненты:
- `columns` (список, обязательный): один или несколько столбцов, по которым определяется индекс
- `unique` (логический, необязательный): должен ли индекс быть объявлен уникальным
- `type` (строка, необязательный): поддерживаемый [тип индекса](https://docs.singlestore.com/managed-service/en/reference/sql-reference/data-definition-language-ddl/create-index.html), `hash` или `btree`

Поскольку таблицы SingleStore шардированы, существуют определенные ограничения на создание индексов, подробнее см. в [документации](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design/understanding-keys-and-indexes-in-singlestore.html).

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

### Другие опции {#other-options}

Вы можете указать набор символов и сортировку для таблицы, используя опции `charset` и/или `collation`. Поддерживаемые значения для `charset` — `binary`, `utf8` и `utf8mb4`. Поддерживаемые значения для `collation` можно увидеть в выводе SQL-запроса `SHOW COLLATION`. Значения сортировки по умолчанию для соответствующих наборов символов — `binary`, `utf8_general_ci` и `utf8mb4_general_ci`.

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

## Контракты моделей {#model-contracts}

Начиная с версии 1.5, адаптер `dbt-singlestore` поддерживает контракты моделей.

| Тип ограничения | Поддержка       | Принудительное выполнение на платформе |
|:----------------|:----------------|:--------------------------------------|
| not_null        | ✅  Поддерживается | ✅ Принудительно выполняется         |
| primary_key     | ✅  Поддерживается | ❌ Не принудительно выполняется      |
| foreign_key     | ❌  Не поддерживается | ❌ Не принудительно выполняется      |
| unique          | ✅  Поддерживается | ❌ Не принудительно выполняется      |
| check           | ❌  Не поддерживается | ❌ Не принудительно выполняется      |

Учтите следующие ограничения при использовании контрактов с адаптером `dbt-singlestore`:

### Определения моделей и столбцов: {#model-and-column-definitions}
   - Ограничение `unique` может быть установлено только на уровне модели. Поэтому не устанавливайте его на уровне столбца.
   - Повторяющиеся ограничения вызовут ошибку. Например, установка `primary_key` как в настройках столбца, так и в настройках модели вызовет ошибку.

### Перезапись настроек: {#overwriting-settings}

Настройка контракта переопределяет настройку конфигурации. Например, если вы определяете `primary_key` или `unique_table_key` в конфигурации, а затем также устанавливаете его в контракте, настройка контракта заменяет настройку конфигурации.

### Работа с константами: {#working-with-constants}

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

При использовании констант вы должны указывать типы данных напрямую. В противном случае SingleStoreDB автоматически выберет, какой тип данных, по его мнению, наиболее подходящий.

<File name='dim_customers.sql'>

```sql
select
  ('abc123' :> int) as customer_id,
  ('My Best Customer' :> text) as customer_name
```

</File>

### Ошибочные типы данных {#misleading-datatypes}

Использование `контрактов моделей` гарантирует, что вы случайно не добавите данные неправильного типа в столбец. Например, если вы ожидаете число в столбце, но случайно указываете текст для добавления, контракт модели поймает это и вернет ошибку.

Сообщение об ошибке может иногда показывать другое имя типа данных, чем ожидалось, из-за того, как работает коннектор `singlestoredb-python`. Например,

<File name='dim_customers.sql'>

```sql
select
  'abc123' as customer_id,
  ('My Best Customer' :> text) as customer_name
```

</File>

приведет к

```sql
Пожалуйста, убедитесь, что имя, data_type и количество столбцов в вашем контракте соответствуют столбцам в определении вашей модели.
| column_name | definition_type | contract_type | mismatch_reason       |
| customer_id | LONGBLOB        | LONG          | несоответствие типа данных |
```

Важно отметить, что определенные отображения типов данных могут отображаться по-разному в сообщениях об ошибках, но это не влияет на их работу. Вот краткий список того, что вы можете увидеть:

| Тип данных | Тип данных, возвращаемый<br/>singlestoredb-python |
|:-----------|:--------------------------------------------------|
| BOOL       | TINY                                              |
| INT        | LONG                                              |
| CHAR       | BINARY                                            |
| VARCHAR    | VARBINARY                                         |
| TEXT       | BLOB                                              |
| TINYTEXT   | TINYBLOB                                          |
| MEDIUMTEXT | MEDIUMBLOB                                        |
| LONGTEXT   | LONGBLOB                                          |

Просто имейте в виду эти моменты при настройке и использовании вашего адаптера `dbt-singlestore`, и вы избежите распространенных ошибок!