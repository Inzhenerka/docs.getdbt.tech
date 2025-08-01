---
title: anchors
sidebar_label: "anchors"
id: anchors
---

With YAML anchors, you can reuse configuration blocks across your dbt project files. Note that the way anchors are defined and used is different between dbt versions.

dbt Core v1.9 supports standalone anchor definitions at the top level of YAML files. For example:

<Tabs>
<TabItem value="model" label="Models">

<File name='models/_models.yml'>

```yml
columns: &id_column # standalone anchor definition - not supported in 1.10 and Fusion
  - name: id
    description: This is a unique identifier.
    data_tests:
      - not_null

models:
  - name: my_first_model
    columns: *id_column
```

</File>

</TabItem>

<TabItem value="source" label="Sources">

<File name='models/_sources.yml'>

```yml
sources:
  - &common_database # standalone anchor definition - not supported in 1.10 and Fusion
    name: common_database
    database: "{{ target.database }}"

  - <<: *common_database
    name: my_source
    schema: "{{ target.schema }}"
    tables:
      - name: my_seed
```

</File>

</TabItem>

</Tabs>


In dbt Core v1.10 and dbt Fusion engine, standalone anchors that are meant to be used as reusable snippets should be moved under the `anchors:` key. For example:

<Tabs>
<TabItem value="model" label="Models">

<File name='models/_models.yml'>

```yml
anchors: # use the anchors key
  - columns: &id_column
    - name: id
      description: This is a unique identifier.
      data_tests:
        - not_null

models:
  - name: my_first_model
    columns: *id_column
  - name: my_second_model
    columns: *id_column
```

</File>

</TabItem>

<TabItem value="source" label="Sources">

<File name='models/_sources.yml'>

```yml
anchors: # use the anchors key
  - &common_database
    name: common_database
    database: "{{ target.database }}"

sources:
  - <<: *common_database
    name: my_source
    schema: "{{ target.schema }}"
    tables:
      - name: my_seed
```

</File>

</TabItem>

</Tabs>

:::important 
Not all anchors should be moved under an `anchors:` block. Some anchors are part of the main YAML structure (for example, defining tests on a column) and should _not_ be moved under a top-level `anchors:` key. For example:

```yml
models:
  - name: my_first_model
    columns:
      - name: customer_id
        tests: &customer_id_tests
          - not_null: {}
          - unique: {}

      - name: order_id
        tests: *customer_id_tests
```
:::

Only move anchors to the `anchors:` section if they are defined solely for reuse and not part of the YAML’s intended structure. Anchor references (`*anchor_name` or `<<: *anchor_name`) should remain unchanged.

The YAML structure is validated more strictly in dbt Core v1.10 and Fusion; top-level keys that dbt does not recognize as part of the official config spec would result in a deprecation warning. To verify syntax compatibility, run `dbt parse`.

