---
resource_types: all
datatype: test
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
  ]
}>

<TabItem value="models">

<File name='models/<filename>.yml'>

```yml

models:
  - name: <model_name>
    columns:
      - name: <column_name>
        data_type: <string>
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests): ...
        config:
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
      - name: <another_column>
        ...
```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/<filename>.yml'>

```yml

sources:
  - name: <source_name>
    tables:
    - name: <table_name>
      columns:
        - name: <column_name>
          [description](/reference/resource-properties/description): <markdown_string>
          data_type: <string>
          [quote](/reference/resource-properties/columns#quote): true | false
          [data_tests](/reference/resource-properties/data-tests): ...
          config:
            [tags](/reference/resource-configs/tags): ...
            [meta](/reference/resource-configs/meta): ...
        - name: <another_column>
          ...

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/<filename>.yml'>

```yml

seeds:
  - name: <seed_name>
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests): ...
        config:
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
      - name: <another_column>
            ...
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.yml'>

```yml

snapshots:
  - name: <snapshot_name>
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests): ...
        config:
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
      - name: <another_column>

```

</File>

</TabItem>


<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yml

analyses:
  - name: <analysis_name>
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
      - name: <another_column>

```

</File>

</TabItem>

</Tabs>

Столбцы не являются самостоятельными ресурсами. Вместо этого они являются дочерними свойствами другого типа ресурса. Они могут определять под-свойства, которые аналогичны свойствам, определенным на уровне ресурса:
- `tags`
- `meta`
- `data_tests`
- `description`

Поскольку столбцы не являются ресурсами, их свойства `tags` и `meta` не считаются полноценными конфигурациями, даже если они вложены в блок `config`. Они **не наследуют** значения `tags` или `meta` от родительских ресурсов. Однако вы можете выбрать обобщённый тест (generic test), определённый на столбце, используя теги, применённые к этому столбцу или к ресурсу верхнего уровня; см. [примеры выбора тестов](/reference/node-selection/test-selection-examples#run-tests-on-tagged-columns).

Столбцы могут опционально определять `data_type`. Это необходимо для:
- обеспечения соблюдения [контракта](/reference/resource-configs/contract) модели;
- использования в других пакетах или плагинах, например, в свойстве [`external`](/reference/resource-properties/external) для источников и в пакете [`dbt-external-tables`](https://hub.getdbt.com/dbt-labs/dbt_external_tables/latest/).

### `quote` {#quote}

Поле `quote` можно использовать для включения или отключения кавычек для имён столбцов.

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml

models:
  - name: model_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/schema.yml'>

```yml

sources:
  - name: source_name
    tables:
      - name: table_name
        columns:
          - name: column_name
            quote: true | false

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml

seeds:
  - name: seed_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml

snapshots:
  - name: snapshot_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analysis/schema.yml'>

```yml

analyses:
  - name: analysis_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

</Tabs>

### Значение по умолчанию {#default}
Значение кавычек по умолчанию — `false`.

### Пояснение {#explanation}
Это особенно актуально для пользователей Snowflake, где поведение кавычек может быть достаточно непредсказуемым.

Это свойство полезно в следующих случаях:
- источник (<Term id="table" />) имеет столбец, который необходимо брать в кавычки для корректного выбора, например, чтобы сохранить регистр имени столбца;
- seed был создан с `quote_columns: true` ([документация](/reference/resource-configs/quote_columns)) в Snowflake;
- модель использует кавычки в SQL, потенциально как обходное решение при использовании зарезервированных слов:
```sql
select user_group as "group"
```

Если не установить `quote: true`:
- [тесты данных](/docs/build/data-tests), применённые к этому столбцу, могут завершаться ошибкой из‑за некорректного SQL;
- документация может отображаться некорректно, например `group` и `"group"` могут не сопоставляться как одно и то же имя столбца.

### Пример {#example}
#### Добавление тестов данных к столбцу с кавычками в таблице источника {#add-data-tests-to-a-quoted-column-in-a-source-table}
Это особенно важно при использовании Snowflake:

```yml

sources:
  - name: stripe
    tables:
      - name: payment
        columns:
          - name: orderID
            quote: true
            data_tests:
              - not_null

```

Без `quote: true` возникнет следующая ошибка:

```
$ dbt test -s source:stripe.*
Running with dbt=0.16.1
Found 7 models, 22 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 0 seed files, 4 sources

13:33:37 | Concurrency: 4 threads (target='learn')
13:33:37 |
13:33:37 | 1 of 1 START test source_not_null_stripe_payment_order_id............ [RUN]
13:33:39 | 1 of 1 ERROR source_not_null_stripe_payment_order_id................. [ERROR in 1.89s]
13:33:39 |
13:33:39 | Finished running 1 tests in 6.43s.

Completed with 1 error and 0 warnings:

Database Error in test source_not_null_stripe_payment_order_id (models/staging/stripe/src_stripe.yml)
  000904 (42000): SQL compilation error: error line 3 at position 6
  invalid identifier 'ORDERID'
  compiled SQL at target/compiled/jaffle_shop/schema_test/source_not_null_stripe_payment_orderID.sql
```

Это происходит потому, что dbt пытается выполнить:
```sql
select count(*)
from raw.stripe.payment
where orderID is null

```

Вместо:
```sql
select count(*)
from raw.stripe.payment
where "orderID" is null

```
