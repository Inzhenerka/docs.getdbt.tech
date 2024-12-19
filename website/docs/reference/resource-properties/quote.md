---
resource_types: all
datatype: boolean
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Источники', value: 'sources', },
    { label: 'Сиды', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Анализы', value: 'analyses', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml
version: 2

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
version: 2

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
version: 2

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
version: 2

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
version: 2

analyses:
  - name: analysis_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

</Tabs>

## Определение
Поле `quote` может использоваться для включения или отключения кавычек для имен столбцов.

## По умолчанию
Значение по умолчанию для кавычек — `false`.

## Объяснение
Это особенно актуально для пользователей Snowflake, где использование кавычек может быть довольно капризным.

Это свойство полезно, когда:
- Источник <Term id="table" /> имеет столбец, который необходимо заключить в кавычки для выбора, например, чтобы сохранить регистр столбца.
- Сид был создан с `quote_columns: true` ([документация](/reference/resource-configs/quote_columns)) в Snowflake.
- Модель использует кавычки в SQL, возможно, чтобы обойти использование зарезервированных слов.
```sql
select user_group as "group"
```

Без установки `quote: true`:
- [Тесты данных](/docs/build/data-tests), применяемые к этому столбцу, могут завершиться неудачей из-за недопустимого SQL.
- Документация может отображаться некорректно, например, `group` и `"group"` могут не совпадать как одно и то же имя столбца.

## Пример
### Добавление тестов к столбцу с кавычками в таблице источника
Это особенно актуально при использовании Snowflake:

```yml
version: 2

sources:
  - name: stripe
    tables:
      - name: payment
        columns:
          - name: orderID
            quote: true
            tests:
              - not_null

```

Без `quote: true` произойдет следующая ошибка:

```
$ dbt test -s source:stripe.*
Запуск с dbt=0.16.1
Найдено 7 моделей, 22 теста, 0 снимков, 0 анализов, 130 макросов, 0 операций, 0 файлов сидов, 4 источника

13:33:37 | Параллелизм: 4 потока (target='learn')
13:33:37 |
13:33:37 | 1 из 1 НАЧАЛ тест source_not_null_stripe_payment_order_id............ [RUN]
13:33:39 | 1 из 1 ОШИБКА source_not_null_stripe_payment_order_id................. [ERROR in 1.89s]
13:33:39 |
13:33:39 | Завершено выполнение 1 теста за 6.43s.

Завершено с 1 ошибкой и 0 предупреждениями:

Ошибка базы данных в тесте source_not_null_stripe_payment_order_id (models/staging/stripe/src_stripe.yml)
  000904 (42000): Ошибка компиляции SQL: ошибка на строке 3 в позиции 6
  недопустимый идентификатор 'ORDERID'
  скомпилированный SQL в target/compiled/jaffle_shop/schema_test/source_not_null_stripe_payment_orderID.sql
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