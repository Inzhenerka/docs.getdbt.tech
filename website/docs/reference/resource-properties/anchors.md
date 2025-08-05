---
title: anchors
sidebar_label: "anchors"
id: anchors
---

Anchors are a [YAML feature](https://yaml.org/spec/1.2.2/#692-node-anchors) that make it possible to reuse configuration blocks inside a single YAML file. Fragments of configuration which are not valid on their own or which only exist as template data should be enclosed in the `anchors:` key. Using the `anchors:` key protects them from being rejected during file validation. The following scenarios describe how unexpected keys are handled across different dbt versions:


- dbt Core v1.10 and higher will raise a warning, while the dbt Fusion engine will raise an error. _Note that during Fusion's beta period, these errors are downgraded to warnings._
- dbt Core v1.9 and earlier will not raise a warning at all.

<VersionBlock lastVersion="1.9">
In dbt Core v1.9 and earlier, you can use standalone anchor definitions at the top level of YAML files. For example:

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

To verify syntax compatibility, run `dbt parse`.

</VersionBlock>

