---
title: Сущности
id: entities
description: "Сущности — это концепции реального мира, которые соответствуют ключевым частям вашего бизнеса, таким как клиенты, транзакции и рекламные кампании."
sidebar_label: "Сущности"
tags: [Metrics, Semantic Layer]
---

Сущности — это концепции реального мира в бизнесе, такие как клиенты, транзакции и рекламные кампании. Мы часто фокусируем наши аналитические задачи на конкретных сущностях, например на оттоке клиентов или моделировании годовой регулярной выручки. В моделях Semantic Layer эти сущности служат ключами для соединения (join key) между семантическими моделями.

В семантическом графе обязательными параметрами для сущности являются `name` и `type`. `name` относится либо к названию ключевого столбца из исходной таблицы данных, либо может служить псевдонимом с именем столбца, указанным в параметре `expr`. `name` вашей сущности должно быть уникальным для семантической модели и не может совпадать с существующими `measure` или `dimension` в этой же модели.

Сущности могут быть заданы с одним столбцом или несколькими столбцами. Сущности (ключи соединения) в семантической модели идентифицируются по их имени. Каждое имя сущности должно быть уникальным в пределах семантической модели, но не обязательно уникальным в разных семантических моделях.

Существует четыре типа сущностей:
- [Первичный](#primary) &mdash; Имеет только одну запись для каждой строки в таблице и включает каждую запись на платформе данных. Этот ключ уникально идентифицирует каждую запись в таблице.
- [Уникальный](#unique) &mdash; Содержит только одну запись на строку в таблице и допускает нулевые значения. Может иметь подмножество записей в хранилище данных.
- [Внешний](#foreign) &mdash; Поле (или набор полей) в одной таблице, которое уникально идентифицирует строку в другой таблице. Этот ключ устанавливает связь между таблицами.
- [Естественный](#natural) &mdash; Столбцы или комбинации столбцов в таблице, которые уникально идентифицируют запись на основе данных реального мира. Этот ключ выводится из фактических атрибутов данных.

:::tip Используйте сущности как измерения
Вы также можете использовать сущности как измерения, что позволяет агрегировать метрику до уровня детализации этой сущности.
:::

## Типы сущностей

Логика соединения MetricFlow зависит от типа сущности, который вы используете, и определяет, как соединять семантические модели. Обратитесь к [Соединениям](/docs/build/join-logic) для получения дополнительной информации о том, как строить соединения.

### Первичный
Первичный ключ имеет _только одну_ запись для каждой строки в таблице и включает каждую запись на платформе данных. Он должен содержать уникальные значения и не может содержать нулевые значения. Используйте первичный ключ, чтобы гарантировать, что каждая запись в таблице является уникальной и идентифицируемой.

<Expandable alt_header="Пример первичного ключа">

Например, рассмотрим таблицу сотрудников со следующими столбцами:

```sql
employee_id (primary key)
first_name
last_name
```
В этом случае `employee_id` является первичным ключом. Каждый `employee_id` уникален и представляет одного конкретного сотрудника. Не может быть дублирующих `employee_id` и не может быть нулевым.

</Expandable>

### Уникальный
Уникальный ключ содержит _только одну_ запись на строку в таблице, но может иметь подмножество записей в хранилище данных. Однако, в отличие от первичного ключа, уникальный ключ допускает нулевые значения. Уникальный ключ гарантирует, что значения столбца являются уникальными, за исключением нулевых значений.

<Expandable alt_header="Пример уникального ключа">

Например, рассмотрим таблицу студентов со следующими столбцами:

```sql
student_id (primary key)
email (unique key)
first_name
last_name
```

В этом примере `email` определен как уникальный ключ. Каждый адрес электронной почты должен быть уникальным; однако, у нескольких студентов могут быть нулевые адреса электронной почты. Это связано с тем, что ограничение уникального ключа допускает одно или несколько нулевых значений, но ненулевые значения должны быть уникальными. Это создает набор записей с уникальными (ненулевыми) адресами электронной почты, которые могут быть подмножеством всей таблицы, включающей всех студентов.

</Expandable>

### Внешний
Внешний ключ — это поле (или набор полей) в одной таблице, которое уникально идентифицирует строку в другой таблице. Внешний ключ устанавливает связь между данными в двух таблицах.
Он может включать ноль, одну или несколько экземпляров одной и той же записи. Он также может содержать нулевые значения.

<Expandable alt_header="Пример внешнего ключа">

Например, предположим, у вас есть две таблицы, `customers` и `orders`:

таблица customers:

```sql
customer_id (primary key)
customer_name
```

таблица orders:

```sql
order_id (primary key)
order_date
customer_id (foreign key)
```

В этом примере `customer_id` в таблице `orders` является внешним ключом, который ссылается на `customer_id` в таблице `customers`. Эта связь означает, что каждый заказ связан с конкретным клиентом. Однако не каждый заказ должен иметь клиента; `customer_id` в таблице заказов может быть нулевым или иметь тот же `customer_id` для нескольких заказов.

</Expandable>

### Естественный

Естественные ключи — это столбцы или комбинации столбцов в таблице, которые уникально идентифицируют запись на основе данных реального мира. Например, если у вас есть таблица измерений `sales_person_department`, `sales_person_id` может служить естественным ключом. Вы можете использовать естественные ключи только для [измерений типа SCD II](/docs/build/dimensions#scd-type-ii).

## Конфигурация сущностей

Ниже приведена полная спецификация для сущностей:

<VersionBlock firstVersion="1.9">

```yaml
semantic_models:
  - name: semantic_model_name
   ..rest of the semantic model config
    entities:
      - name: entity_name  ## Обязательно
        type: Primary, natural, foreign, or unique ## Обязательно
        description: Описание поля или роли, которую сущность выполняет в этой таблице  ## Необязательно
        expr: Поле, которое обозначает эту сущность (transaction_id).  ## Необязательно
              По умолчанию используется значение name, если не указано.  
        [config](/reference/resource-properties/config): Укажите конфигурации для сущности.  ## Необязательно
          [meta](/reference/resource-configs/meta): {<dictionary>} Задайте метаданные для ресурса и организуйте ресурсы. Принимает обычный текст, пробелы и кавычки.  ## Необязательно
```
</VersionBlock>

Вот пример того, как определить сущности в семантической модели:

<VersionBlock firstVersion="1.9">

```yaml
entities:
  - name: transaction
    type: primary
    expr: id_transaction
  - name: order
    type: foreign
    expr: id_order
  - name: user
    type: foreign
    expr: substring(id_order from 2)
    entities:
  - name: transaction
    type: 
    description: A description of the field or role the entity takes in this table ## Optional
    expr: The field that denotes that entity (transaction_id).  
          Defaults to name if unspecified.
    [config](/reference/resource-properties/config):
      [meta](/reference/resource-configs/meta):
        data_owner: "Finance team"
```
</VersionBlock>

## Комбинирование столбцов с ключом

Если у таблицы нет какого-либо ключа (например, первичного ключа), используйте **_суррогатную комбинацию_**, чтобы сформировать ключ, который позволит идентифицировать запись путём объединения двух колонок. Это применимо к любому [типу сущности](/docs/build/entities#entity-types).

Например, вы можете объединить `date_key` и `brand_code` из таблицы `raw_brand_target_weekly`, чтобы сформировать _суррогатный ключ_. В следующем примере суррогатный ключ создаётся путём объединения `date_key` и `brand_code` с использованием вертикальной черты (`|`) в качестве разделителя.

```yaml

entities:
  - name: brand_target_key # Entity name or identified.
    type: foreign # This can be any entity type key. 
    expr: date_key || '|' || brand_code # Defines the expression for linking fields to form the surrogate key.
```

## Примеры

Как уже упоминалось, сущности (entities) используются как ключи для соединений, опираясь на уникальное имя сущности. Благодаря этому мы можем соединять один `unique`‑ключ с несколькими `foreign`‑ключами.

Рассмотрим таблицу `date_categories` со следующими колонками:

```sql
date_id (primary key)
date_day (unique key)
fiscal_year_name
```

И таблицу `orders` со следующими колонками:

```sql
order_id (primary key)
ordered_at
delivered_at
order_total
```

Как можно определить YAML для Semantic Layer так, чтобы иметь возможность запрашивать `order_total` по `ordered_at` `fiscal_year_name` и по `delivered_at` `fiscal_year_name`?

Сначала необходимо определить две сущности типа `unique` в модели `date_categories`, указав выражение `date_day`:

```yaml
semantic_models:
- name: date_categories
  description: A date dimension table providing fiscal time attributes for analysis.
  model: ref('date_categories')
  entities:
  - name: date_id
    type: primary

  - name: ordered_at_entity
    type: unique
    expr: date_day

  - name: delivered_at_entity
    type: unique
    expr: date_day

  dimensions:
  - name: date_day
    type: time
    type_params:
      time_granularity: day

  - name: fiscal_year_name
    description: Formatted fiscal year string (for example, 'FY2025')
    type: categorical
```

Затем нужно добавить эти же сущности в модель `orders` как ключи типа `foreign`, указав выражения `ordered_at` и `delivered_at` соответственно:

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Order fact table. This table is at the order grain with one row per order.
    model: ref('orders')
    entities:
      - name: order_id
        type: primary

      - name: ordered_at_entity
        type: foreign
        expr: ordered_at

      - name: delivered_at_entity
        type: foreign
        expr: delivered_at

    dimensions:
      - name: ordered_at
        expr: ordered_at
        type: time
        type_params:
          time_granularity: day

    measures:
      - name: order_total
        description: Total amount for each order including taxes.
        agg: sum
        create_metric: True
```

При такой конфигурации семантические модели смогут выполнять соединение по условию `ordered_at = date_day` через сущность `ordered_at_entity`, а также по условию `delivered_at = date_day` через сущность `delivered_at_entity`.  
Чтобы проверить результат, можно выполнить одну из следующих команд:

- `dbt sl query --metrics order_total --group-by ordered_at_entity__fiscal_year_name`
- `dbt sl query --metrics order_total --group-by delivered_at_entity__fiscal_year_name`
