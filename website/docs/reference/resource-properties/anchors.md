---
title: anchors
description: "Храните переиспользуемые фрагменты конфигурации YAML под ключом anchors, чтобы файл проходил валидацию."
sidebar_label: "anchors"
id: anchors
---

## Определение {#definition}

Якоря — это [возможность YAML](https://yaml.org/spec/1.2.2/#692-node-anchors), которая позволяет повторно использовать блоки конфигурации в пределах одного YAML-файла. В <Constant name="dbt" /> v1.10 появился ключ `anchors:`, предназначенный для размещения фрагментов конфигурации, которые сами по себе не являются допустимыми или существуют только как данные для шаблонов. Использование ключа `anchors:` гарантирует, что эти фрагменты не будут отклонены при проверке файла.


В <Constant name="dbt" /> v1.10 и более поздних версиях недопустимые якоря вызывают предупреждение. В <Constant name="fusion_engine" /> такие недопустимые якоря приводят к ошибкам.

:::note
Вы можете определять якоря в <Constant name="dbt" /> v1.9 и более ранних версиях, но в этих версиях для якорей нет специально выделенного места. Если вам нужно определить отдельный якорь, вы можете разместить его на верхнем уровне YAML-файла.
:::

## Синтаксис YAML anchors {#yaml-anchor-syntax}

### Якоря и алиасы {#anchors-and-aliases}

Чтобы определить YAML anchor, добавьте блок `anchors:` в ваш YAML-файл и используйте символ `&` перед именем anchor (например, `&id_column_alias`). Это создаёт alias, на который можно ссылаться в других местах, добавляя символ `*` перед именем alias.

В следующем примере создаётся anchor, alias которого — `*id_column_alias`. Колонка `id`, её описание, тип данных и data tests применяются к моделям `my_first_model`, `my_second_model` и `my_third_model`.

<File name='models/_models.yml'>

```yml
anchors: 
  - &id_column_alias
      name: id
      description: This is a unique identifier.
      data_type: int
      data_tests:
        - not_null
        - unique

models:
  - name: my_first_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_a
        description: This column is not repeated in other models.
      - name: unrelated_column_b
  - name: my_second_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_c
  - name: my_third_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_d
```

</File>

<Lightbox src="/img/reference/resource-properties/anchor_example_expansion.png" title="За кулисами alias заменяется объектом, определённым в anchor."/>

### Синтаксис merge {#merge-syntax}

Иногда anchor в основном подходит, но одну его часть нужно переопределить. Если anchor ссылается на словарь / mapping (а не на список и не на <Term id="scalar-value" />), вы можете использовать синтаксис merge `<<:` для переопределения уже определённого ключа или добавления новых ключей в словарь. Например:

<File name='models/_models.yml'>

```yml
anchors: 
  - &id_column_alias
      name: id
      description: This is a unique identifier.
      data_type: int
      data_tests:
        - not_null
        - unique
  - &source_template_alias
      database: RAW
      loader: fivetran
      config:
        freshness:
          warn_after: {count: 1, period: day}

models:
  - name: my_first_model
    columns: 
      - *id_column_alias # подтягивает весь anchor, определённый выше
      - name: unrelated_column_a
        description: This column is not repeated in other models.
      - name: unrelated_column_b
  - name: my_second_model
    columns: 
      - <<: *id_column_alias
        data_type: bigint # переопределяет data_type с int на bigint, при этом наследуя name, description и data tests
      - name: unrelated_column_c
  - name: my_third_model
    columns: 
      - <<: *id_column_alias
        config:
          meta: 
            extra_key: extra_value # добавляет config.meta.extra_key только для этой версии колонки id, помимо name, description, data type и data tests
      - name: unrelated_column_d

sources:
  # оба source начинаются с database, loader и ожиданий freshness, заданных через anchor, и дополняются остальными ключами
  - <<: *source_template_alias
    name: salesforce
    schema: etl_salesforce_schema
    tables:
      - name: opportunities
      - name: users
  - <<: *source_template_alias
    name: hubspot
    schema: etl_hubspot_schema
    tables:
      - name: contacts
```

</File>

## Примечания по использованию {#usage-notes}

- В старых версиях <Constant name="dbt" /> (v1.9 и более ранних) нет отдельного ключа `anchors:`. Если вам нужно определить самостоятельный якорь, его можно оставить на верхнем уровне файла.
- Нельзя добавлять дополнительные элементы в список, определённый как якорь. Например, если вы определили якорь, содержащий несколько столбцов, вы не сможете добавить дополнительные столбцы в конец этого списка. Вместо этого определите каждый столбец как отдельный якорь и добавьте каждый из них в соответствующие таблицы.
- Не нужно переносить существующие якоря в ключ `anchors:`, если они уже определены внутри более крупного корректного объекта YAML. Например, следующий якорь `&customer_id_tests` не нужно переносить, поскольку он является допустимой частью существующего блока `columns`.

  ```yml
  models:
    - name: my_first_model
      columns:
        - name: customer_id
          data_tests: &customer_id_tests
            - not_null
            - unique

        - name: order_id
          data_tests: *customer_id_tests
  ```
