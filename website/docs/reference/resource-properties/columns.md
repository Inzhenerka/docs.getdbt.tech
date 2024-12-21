---
resource_types: all
datatype: test
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
  ]
}>

<TabItem value="models">

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    columns:
      - name: <column_name>
        data_type: <string>
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/quote): true | false
        [tests](/reference/resource-properties/data-tests): ...
        [tags](/reference/resource-configs/tags): ...
        [meta](/reference/resource-configs/meta): ...
      - name: <another_column>
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
    tables:
    - name: <table_name>
      columns:
        - name: <column_name>
          [description](/reference/resource-properties/description): <markdown_string>
          data_type: <string>
          [quote](/reference/resource-properties/quote): true | false
          [tests](/reference/resource-properties/data-tests): ...
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
        - name: <another_column>
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
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/quote): true | false
        [tests](/reference/resource-properties/data-tests): ...
        [tags](/reference/resource-configs/tags): ...
        [meta](/reference/resource-configs/meta): ...
      - name: <another_column>
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
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/quote): true | false
        [tests](/reference/resource-properties/data-tests): ...
        [tags](/reference/resource-configs/tags): ...
        [meta](/reference/resource-configs/meta): ...
      - name: <another_column>

```

</File>

</TabItem>


<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: <analysis_name>
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
      - name: <another_column>

```

</File>

</TabItem>

</Tabs>

Столбцы не являются самостоятельными ресурсами. Вместо этого они являются дочерними свойствами другого типа ресурса. Они могут определять под-свойства, которые аналогичны свойствам, определенным на уровне ресурса:
- `tags`
- `meta`
- `tests`
- `description`

Поскольку столбцы не являются ресурсами, их свойства `tags` и `meta` не являются настоящими конфигурациями. Они не наследуют значения `tags` или `meta` от своих родительских ресурсов. Однако вы можете выбрать общий тест, определенный для столбца, используя теги, примененные к его столбцу или ресурсу верхнего уровня; см. [примеры выбора тестов](/reference/node-selection/test-selection-examples#run-tests-on-tagged-columns).

Столбцы могут по желанию определять `data_type`, что необходимо для:
- Обеспечения соблюдения [контракта](/reference/resource-configs/contract) модели
- Использования в других пакетах или плагинах, таких как свойство [`external`](/reference/resource-properties/external) источников и [`dbt-external-tables`](https://hub.getdbt.com/dbt-labs/dbt_external_tables/latest/)