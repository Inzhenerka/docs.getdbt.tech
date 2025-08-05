---
title: anchors
sidebar_label: "anchors"
id: anchors
---

Anchors are a [feature of YAML](https://yaml.org/spec/1.2.2/#692-node-anchors) making it possible to reuse configuration blocks inside of a single YAML file. Fragments of configuration which are not valid on their own or which only exist as template data should be enclosed in the `anchors:` key, to protect them from being rejected during file validation:

- The dbt Fusion engine will raise an error when it encounters unexpected keys, including those used as part of an anchor definition. _Note that during the Fusion engine's beta period, these errors are downgraded to warnings._
- Version 1.10 and later of dbt Core will raise a warning on unexpected keys.
- Earlier versions of dbt Core will not raise a warning at all

<VersionBlock lastVersion="1.9">
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
</VersionBlock>

<VersionBlock firstVersion="1.10">
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
Not all anchors should be moved under an `anchors:` block, such as anchors that are part of the main YAML structure (for example, defining tests on a column).

For example:

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

</VersionBlock>

