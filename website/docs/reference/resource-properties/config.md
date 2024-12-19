---
title: "О свойстве config"
sidebar_label: "config"
resource_types: [models, seeds, snapshots, tests, sources, metrics, exposures]
datatype: "{dictionary}"
hide_table_of_contents: true
---


<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Семена', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Тесты', value: 'tests', },
    { label: 'Источники', value: 'sources', },
    { label: 'Метрики', value: 'metrics', },
    { label: 'Экспозиции', value: 'exposures', },
    { label: 'Семантические модели', value: 'semantic models', },
    { label: 'Сохраненные запросы', value: 'saved queries', },
  ]
}>

<TabItem value="models">

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    config:
      [<model_config>](/reference/model-configs): <config_value>
      ...
```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <seed_name>
    config:
      [<seed_config>](/reference/seed-configs): <config_value>
      ...
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot_name>
    config:
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
      ...
```

</File>

</TabItem>


<TabItem value="tests">

<File name='<resource_path>/<filename>.yml'>

```yml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          config:
            <test_config>: <config-value>
            ...

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              config:
                [<test_config>](/reference/data-test-configs): <config-value>
                ...

```

</File>

</TabItem>

<TabItem value="sources">


<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    config:
      [<source_config>](/reference/source-configs): <config_value>
    tables:
      - name: <table_name>
        config:
          [<source_config>](/reference/source-configs): <config_value>
```

</File>

</TabItem>

<TabItem value="metrics">

<File name='models/<filename>.yml'>

```yml
version: 2

metrics:
  - name: <metric_name>
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [group](/reference/resource-configs/group): <string>
      [meta](/reference/resource-configs/meta): {dictionary}
```

</File>

</TabItem>

<TabItem value="exposures">

<File name='models/<filename>.yml'>

```yml
version: 2

exposures:
  - name: <exposure_name>
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [meta](/reference/resource-configs/meta): {dictionary}
```

</File>

</TabItem>

<TabItem value="semantic models">

<File name='models/<filename>.yml'>

```yml
version: 2

semantic_models:
  - name: <semantic_model_name>
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [group](/reference/resource-configs/group): <string>
      [meta](/reference/resource-configs/meta): {dictionary}
```

</File>

</TabItem>

<TabItem value="saved queries">

<File name='models/<filename>.yml'>

```yml
version: 2

saved-queries:
  - name: <saved-query-name>
    config:
      [cache](/docs/build/saved-queries#parameters): 
        enabled: true | false
      [enabled](/reference/resource-configs/enabled): true | false
      [export_as](/docs/build/saved-queries#parameters): view | table 
      [group](/reference/resource-configs/group): <string>
      [meta](/reference/resource-configs/meta): {dictionary}
      [schema](/reference/resource-configs/schema): <string>
```

</File>

</TabItem>

</Tabs>

## Определение
Свойство `config` позволяет настраивать ресурсы одновременно с определением свойств в YAML файлах.