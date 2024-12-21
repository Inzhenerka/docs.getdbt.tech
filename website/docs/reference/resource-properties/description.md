---
resource_types: all
datatype: markdown_string
description: "Это руководство объясняет, как использовать ключ description для добавления YAML-описаний к ресурсам dbt (моделям, источникам, семенам) с использованием markdown и Jinja для улучшения документации."
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
    { label: 'Macros', value: 'macros', },
    { label: 'Data tests', value: 'data_tests', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/schema.yml'>

```yml
version: 2

sources:
  - name: source_name
    description: markdown_string

    tables:
      - name: table_name
        description: markdown_string

        columns:
          - name: column_name
            description: markdown_string

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml
version: 2

snapshots:
  - name: snapshot_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analysis/schema.yml'>

```yml
version: 2

analyses:
  - name: analysis_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="macros">

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: macro_name
    description: markdown_string

    arguments:
      - name: argument_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="data_tests">

<VersionBlock firstVersion="1.9">

<File name='tests/schema.yml'>

```yml
version: 2

data_tests:
  - name: data_test_name
    description: markdown_string

```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">

Свойство `description` доступно для общих и одиночных тестов данных, начиная с dbt v1.9.

</VersionBlock>

</TabItem>

</Tabs>

## Определение
Пользовательское описание. Может использоваться для документирования:
- модели и столбцов модели
- источников, таблиц источников и столбцов источников
- семян и столбцов семян
- снимков и столбцов снимков
- анализов и столбцов анализов
- макросов и аргументов макросов

Эти описания используются на сайте документации, создаваемом dbt (см. [руководство по документации](/docs/build/documentation) или [dbt Explorer](/docs/collaborate/explore-projects)).

Описания могут включать markdown, а также функцию [`doc` jinja](/reference/dbt-jinja-functions/doc).

:::caution Возможно, вам потребуется заключить ваше YAML в кавычки

Будьте внимательны к семантике YAML при предоставлении описания. Если ваше описание содержит специальные символы YAML, такие как фигурные скобки, двоеточия или квадратные скобки, возможно, вам потребуется заключить ваше описание в кавычки. Пример описания в кавычках показан [ниже](#use-some-markdown-in-a-description).

:::

## Примеры

### Добавление простого описания к модели и столбцу

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: One record per customer

    columns:
      - name: customer_id
        description: Primary key

```

</File>

### Добавление многострочного описания к модели

Вы можете использовать [блочную нотацию YAML](https://yaml-multiline.info/) для разделения более длинного описания на несколько строк:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: >
      One record per customer. Note that a customer must have made a purchase to
      be included in this <Term id="table" /> — customer accounts that were created but never
      used have been filtered out.

    columns:
      - name: customer_id
        description: Primary key.

```

</File>

### Использование markdown в описании

Вы можете использовать markdown в своих описаниях, но вам может потребоваться заключить ваше описание в кавычки, чтобы YAML-парсер не запутался из-за специальных символов!

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: "**\[Read more](https://www.google.com/)**"

    columns:
      - name: customer_id
        description: Primary key.

```

</File>

### Использование блока docs в описании

Если у вас есть длинное описание, особенно если оно содержит markdown, может быть более целесообразно использовать блок [`docs`](/reference/dbt-jinja-functions/doc). Преимущество этого подхода в том, что редакторы кода будут правильно подсвечивать markdown, что облегчит отладку при написании.

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: fct_orders
    description: This table has basic information about orders, as well as some derived facts based on payments

    columns:
      - name: status
        description: '{{ doc("orders_status") }}'

```

</File>

<File name='models/docs.md'>

```

{% docs orders_status %}

Orders can be one of the following statuses:

| status         | description                                                               |
|----------------|---------------------------------------------------------------------------|
| placed         | The order has been placed but has not yet left the warehouse              |
| shipped        | The order has been shipped to the customer and is currently in transit     |
| completed      | The order has been received by the customer                               |
| returned       | The order has been returned by the customer and received at the warehouse |


{% enddocs %}

```

</File>


### Ссылка на другую модель в описании

Вы можете использовать относительные ссылки для ссылки на другую модель. Это немного хитро — но чтобы сделать это:

1. Запустите ваш сайт документации.
2. Перейдите к модели, на которую хотите сослаться, например, `http://127.0.0.1:8080/#!/model/model.jaffle_shop.stg_stripe__payments`
3. Скопируйте url_path, т.е. все после `http://127.0.0.1:8080/`, в данном случае `#!/model/model.jaffle_shop.stg_stripe__payments`
4. Вставьте это как ссылку

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "Filtering done based on \[stg_stripe__payments](#!/model/model.jaffle_shop.stg_stripe__payments)"

    columns:
      - name: customer_id
        description: Primary key

```

</File>


### Включение изображения из вашего репозитория в ваши описания

Этот раздел применим только к пользователям dbt Core. Включение изображения из вашего репозитория гарантирует, что ваши изображения находятся под версионным контролем.

Как пользователи dbt Cloud, так и dbt Core могут [включать изображение из интернета](#include-an-image-from-the-web-in-your-descriptions), что предлагает динамическое содержание, уменьшенный размер репозитория, доступность и легкость сотрудничества.

Чтобы включить изображение в поле `description` вашей модели:

1. Добавьте файл в подкаталог, например, `assets/dbt-logo.svg`
2. Установите конфигурацию [`asset-paths`](/reference/project-configs/asset-paths) в вашем файле `dbt_project.yml`, чтобы этот каталог копировался в каталог `target/` как часть `dbt docs generate`

<File name='dbt_project.yml'>

```yml
asset-paths: ["assets"]
```

</File>

2. Используйте Markdown-ссылку на изображение в вашем `description:`

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "!\[dbt Logo](assets/dbt-logo.svg)"

    columns:
      - name: customer_id
        description: Primary key

```

</File>

3. Запустите `dbt docs generate` — каталог `assets` будет скопирован в каталог `target`

4. Запустите `dbt docs serve` — изображение будет отображено как часть документации вашего проекта:

Если вы смешиваете изображения и текст, также рассмотрите возможность использования блока docs.

### Включение изображения из интернета в ваши описания

Этот раздел применим к пользователям dbt Cloud и dbt Core. Включение изображения из интернета предлагает динамическое содержание, уменьшенный размер репозитория, доступность и легкость сотрудничества.

Чтобы включить изображения из интернета, укажите URL изображения в поле `description` вашей модели:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "!\[dbt Logo](https://github.com/dbt-labs/dbt-core/blob/main/etc/dbt-core.svg)"

    columns:
      - name: customer_id
        description: Primary key

```

</File>

Если вы смешиваете изображения и текст, также рассмотрите возможность использования блока docs.