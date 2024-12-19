---
resource_types: all
datatype: test
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Источники', value: 'sources', },
    { label: 'Семена', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Анализы', value: 'analyses', },
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
        [описание](/reference/resource-properties/description): <markdown_string>
        [цитата](/reference/resource-properties/quote): true | false
        [тесты](/reference/resource-properties/data-tests): ...
        [теги](/reference/resource-configs/tags): ...
        [мета](/reference/resource-configs/meta): ...
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
          [описание](/reference/resource-properties/description): <markdown_string>
          data_type: <string>
          [цитата](/reference/resource-properties/quote): true | false
          [тесты](/reference/resource-properties/data-tests): ...
          [теги](/reference/resource-configs/tags): ...
          [мета](/reference/resource-configs/meta): ...
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
        [описание](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [цитата](/reference/resource-properties/quote): true | false
        [тесты](/reference/resource-properties/data-tests): ...
        [теги](/reference/resource-configs/tags): ...
        [мета](/reference/resource-configs/meta): ...
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
        [описание](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [цитата](/reference/resource-properties/quote): true | false
        [тесты](/reference/resource-properties/data-tests): ...
        [теги](/reference/resource-configs/tags): ...
        [мета](/reference/resource-configs/meta): ...
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
        [описание](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
      - name: <another_column>

```

</File>

</TabItem>

</Tabs>

Столбцы не являются ресурсами сами по себе. Вместо этого они являются дочерними свойствами другого типа ресурса. Они могут определять под-свойства, которые аналогичны свойствам, определенным на уровне ресурса:
- `теги`
- `мета`
- `тесты`
- `описание`

Поскольку столбцы не являются ресурсами, их свойства `теги` и `мета` не являются истинными конфигурациями. Они не наследуют значения `тегов` или `мета` своих родительских ресурсов. Тем не менее, вы можете выбрать общий тест, определенный на столбце, используя теги, примененные к его столбцу или ресурсу верхнего уровня; см. [примеры выбора тестов](/reference/node-selection/test-selection-examples#run-tests-on-tagged-columns).

Столбцы могут дополнительно определять `data_type`, что необходимо для:
- Принуждения модели к [контракту](/reference/resource-configs/contract)
- Использования в других пакетах или плагинах, таких как свойство [`external`](/reference/resource-properties/external) источников и [`dbt-external-tables`](https://hub.getdbt.com/dbt-labs/dbt_external_tables/latest/)