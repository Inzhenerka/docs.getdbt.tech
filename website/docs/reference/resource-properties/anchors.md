---
title: anchors
sidebar_label: "anchors"
id: anchors
---

## Определение {#definition}

Anchors (якоря) — это [возможность YAML](https://yaml.org/spec/1.2.2/#692-node-anchors), которая позволяет переиспользовать блоки конфигурации внутри одного YAML-файла. В dbt Core v1.10 был добавлен ключ `anchors:`, предназначенный для размещения фрагментов конфигурации, которые сами по себе не являются валидными или существуют только как шаблонные данные. Использование ключа `anchors:` гарантирует, что такие фрагменты не будут отклонены при валидации файла.

В dbt Core v1.10 и выше невалидные anchors вызывают предупреждение. В движке dbt Fusion такие невалидные anchors будут приводить к ошибкам, когда Fusion выйдет из беты.

:::note
Вы можете определять anchors в dbt Core v1.9 и более ранних версиях, однако в этих версиях нет выделенного места для anchors. Если вам нужно определить standalone anchor, вы можете разместить его на верхнем уровне вашего YAML-файла.
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

- В старых версиях dbt Core (v1.9 и ниже) нет выделенного ключа `anchors:`. Если вам нужно определить standalone anchor, вы можете оставить его на верхнем уровне файла.
- Нельзя добавлять дополнительные элементы в список, который был определён как anchor. Например, если вы определили anchor, содержащий несколько колонок, вы не можете «прицепить» дополнительные колонки в конец этого списка. Вместо этого определяйте каждую колонку как отдельный anchor и добавляйте их по отдельности в нужные таблицы.
- Вам не нужно переносить существующие anchors под ключ `anchors:`, если они уже определены внутри валидного YAML-объекта большего размера. Например, следующий anchor `&customer_id_tests` не нужно перемещать, так как он является валидной частью существующего блока `columns`.

  ```yml
  models:
    - name: my_first_model
      columns:
        - name: customer_id
          tests: &customer_id_tests
            - not_null
            - unique

        - name: order_id
          tests: *customer_id_tests
  ```
