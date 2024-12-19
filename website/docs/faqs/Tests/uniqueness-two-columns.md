---
title: Могу ли я протестировать уникальность двух столбцов?
description: "Варианты тестирования уникальности двух столбцов"
sidebar_label: 'Проверка уникальности двух столбцов'
id: uniqueness-two-columns

---

Да, есть несколько различных вариантов.

Рассмотрим таблицу заказов <Term id="table" /> , которая содержит записи из нескольких стран, и комбинация ID и кода страны является уникальной:

| order_id | country_code |
|----------|--------------|
| 1        | AU           |
| 2        | AU           |
| ...      | ...          |
| 1        | US           |
| 2        | US           |
| ...      | ...          |


Вот некоторые подходы:

#### 1. Создайте уникальный ключ в модели и протестируйте его

<File name='models/orders.sql'>

```sql

select
  country_code || '-' || order_id as surrogate_key,
  ...

```

</File>

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    columns:
      - name: surrogate_key
        tests:
          - unique

```

</File>


#### 2. Протестируйте выражение

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    tests:
      - unique:
          column_name: "(country_code || '-' || order_id)"
```

</File>


#### 3. Используйте тест `dbt_utils.unique_combination_of_columns`

Это особенно полезно для больших наборов данных, так как это более производительно. Ознакомьтесь с документацией по [пакетам](/docs/build/packages) для получения дополнительной информации.

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    tests:
      - dbt_utils.unique_combination_of_columns:
          combination_of_columns:
            - country_code
            - order_id
```

</File>