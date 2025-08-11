---
title: anchors
sidebar_label: "anchors"
id: anchors
---

Anchors are a [YAML feature](https://yaml.org/spec/1.2.2/#692-node-anchors) that make it possible to reuse configuration blocks inside a single YAML file. Fragments of configuration which are not valid on their own or which only exist as template data should be enclosed in the `anchors:` key, which was introduced in dbt Core v1.10. Using the `anchors:` key protects these fragments from being rejected during file validation.

In dbt Core v1.10 and higher, invalid anchors trigger a warning. In the dbt Fusion engine, these invalid anchors will result in errors when Fusion leaves beta.

<VersionBlock lastVersion="1.9">
:::note
You can define anchors in dbt Core v1.9 and earlier, but there is no dedicated location for anchors in these versions. If you need to define a standalone anchor, you can put it at the top level of your YAML file.
:::
</VersionBlock>

## YAML anchor syntax

### Anchors and aliases

To define a YAML anchor, add an `anchors:` block in your YAML file and use the `&` symbol in front of the anchor's name (for example, `&id_column_alias`). This creates an alias which you can reference elsewhere by prefixing the alias with a `*` character.

The following example creates an anchor whose alias is `*id_column_alias`. The `id` column, its description, data type, and data tests are all applied to `my_first_model`, `my_second_model`, and `my_third_model`.

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

<Lightbox src="/img/reference/resource-properties/anchor_example_expansion.png" title="Behind the scenes, the alias is replaced with the object defined by the anchor."/>

### Merge syntax

Sometimes, an anchor is mostly the same but one part needs to be overridden. When the anchor refers to a dictionary/mapping (not a list or a <Term id="scalar-value" />), you can use the `<<:` merge syntax to override an already-defined key, or add extra keys to the dictionary. For example:

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
      - *id_column_alias # brings in the full anchor defined above
      - name: unrelated_column_a
        description: This column is not repeated in other models.
      - name: unrelated_column_b
  - name: my_second_model
    columns: 
      - <<: *id_column_alias
        data_type: bigint # overrides the data_type from int to bigint, while inheriting the name, description, and data tests
      - name: unrelated_column_c
  - name: my_third_model
    columns: 
      - <<: *id_column_alias
        config:
          meta: 
            extra_key: extra_value # adds config.meta.extra_key to just this version of the id column, in addition to the name, description, data type, and data tests
      - name: unrelated_column_d

sources:
  # both sources start with their database, loader, and freshness expectations set from the anchor, and merge in additional keys
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

## Tips and common pitfalls

<VersionBlock lastVersion="1.9">
- Old versions of dbt Core (v1.9 and earlier) do not have a dedicated `anchors:` key. If you need to define a standalone anchor, you can leave it at the top level of your file.
</VersionBlock>
- You can't merge additional elements into a list which was defined as an anchor. For example, if you define an anchor containing multiple columns, you can't attach extra columns to the end of the list. Instead, define each column as an individual anchor and add each one to the relevant tables.
- You do not need to move existing anchors to the `anchors:` key if they are already defined in a larger valid YAML object. For example, the following `&customer_id_tests` anchor does not need to be moved because it is a valid part of the existing `columns` block.

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
