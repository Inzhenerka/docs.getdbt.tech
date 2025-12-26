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
    { label: 'Unit tests', value: 'unit_tests', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml

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

You can add a description to a [singular data test](/docs/build/data-tests#singular-data-tests) or a [generic data test](/docs/build/data-tests#generic-data-tests).

<File name='tests/schema.yml'>

```yml
# Singular data test example

version: 2

data_tests:
  - name: data_test_name
    description: markdown_string
```
</File>

<File name='tests/schema.yml'>

```yml
# Generic data test example

version: 2

models:
  - name: model_name
    columns:
      - name: column_name
        data_tests:
          - unique:
              description: markdown_string
```
</File>

</VersionBlock>

</TabItem>

<TabItem value="unit_tests">

Здесь нет текста для перевода, поэтому фрагмент нужно оставить **без изменений**.

<File name='models/schema.yml'>

```yml
unit_tests:
  - name: unit_test_name
    description: "markdown_string"
    model: model_name 
    given: ts
      - input: ref_or_source_call
        rows:
         - {column_name: column_value}
         - {column_name: column_value}
         - {column_name: column_value}
         - {column_name: column_value}
      - input: ref_or_source_call
        format: csv
        rows: dictionary | string
    expect: 
      format: dict | csv | sql
      fixture: fixture_name
```

</File>

</TabItem>

</Tabs>

## Определение

Пользовательское описание, используемое для документирования:

- моделей и столбцов моделей
- источников, таблиц источников и столбцов источников
- seed-файлов и столбцов seed-файлов
- snapshots и столбцов snapshots
- analyses и столбцов analyses
- macros и аргументов macros
- data tests и столбцов data tests
- unit tests для моделей

Эти описания используются на сайте документации, который рендерится dbt (см. [руководство по документации](/docs/build/documentation) или [<Constant name="explorer" />](/docs/explore/explore-projects)).

Описания могут включать markdown, а также [Jinja-функцию `doc`](/reference/dbt-jinja-functions/doc).

:::caution Возможно, вам потребуется заключить ваше YAML в кавычки

Будьте внимательны к семантике YAML при предоставлении описания. Если ваше описание содержит специальные символы YAML, такие как фигурные скобки, двоеточия или квадратные скобки, возможно, вам потребуется заключить ваше описание в кавычки. Пример описания в кавычках показан [ниже](#use-some-markdown-in-a-description).

:::

## Примеры

В этом разделе приведены примеры того, как добавлять описания к различным ресурсам:

- [Добавление простого описания для модели и колонки](#add-a-simple-description-to-a-model-and-column) <br />
- [Добавление многострочного описания для модели](#add-a-multiline-description-to-a-model) <br />
- [Использование Markdown в описании](#use-some-markdown-in-a-description) <br />
- [Использование docs-блока в описании](#use-a-docs-block-in-a-description) <br />
- [Ссылка на другую модель в описании](#link-to-another-model-in-a-description)
- [Добавление изображения из вашего репозитория в описание](#include-an-image-from-your-repo-in-your-descriptions) <br />
- [Добавление изображения из интернета в описание](#include-an-image-from-the-web-in-your-descriptions) <br />
- [Добавление описания к data test](#add-a-description-to-a-data-test) <br />
- [Добавление описания к unit test](#add-a-description-to-a-unit-test) <br />

### Добавление простого описания для модели и колонки

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

Этот раздел относится только к пользователям <Constant name="core" />. Добавление изображений непосредственно из вашего репозитория гарантирует, что они будут находиться под версионным контролем.

Пользователи как <Constant name="cloud" />, так и <Constant name="core" /> могут [добавлять изображения из интернета](#include-an-image-from-the-web-in-your-descriptions), что обеспечивает динамический контент, уменьшение размера репозитория, улучшенную доступность и удобство совместной работы.

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

Этот раздел относится к пользователям <Constant name="cloud" /> и <Constant name="core" />. Использование изображений из интернета обеспечивает динамический контент, уменьшает размер репозитория, повышает доступность и упрощает совместную работу.

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

Если вы комбинируете изображения и текст, также рассмотрите возможность использования блока docs.

### Добавление описания к data test

Вы можете добавить свойство `description` к generic или singular data test.

#### Generic data test

В этом примере показан generic data test, который проверяет уникальность значений в колонке для модели `orders`.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique:
              description: "The order_id is unique for every row in the orders model"
```
</File>

Вы также можете добавлять описания к Jinja-макросу, который содержит основную логику generic data test. Подробнее см. в разделе [Add description to generic data test logic](/best-practices/writing-custom-generic-tests#add-description-to-generic-data-test-logic).

#### Singular data test

В этом примере показан singular data test, который проверяет, что все значения в модели `payments` не являются отрицательными (≥ 0).

<File name='tests/<filename>.yml'>

```yaml
data_tests:
  - name: assert_total_payment_amount_is_positive
    description: >
      Refunds have a negative amount, so the total amount should always be >= 0.
      Therefore return records where total amount < 0 to make the test fail.

```
</File>

Обратите внимание, что для запуска теста SQL‑файл `tests/assert_total_payment_amount_is_positive.sql` должен существовать в директории `tests`.

### Добавление описания к unit test

В этом примере показан unit test, который проверяет, что временная метка `opened_at` корректно усекается до даты для модели `stg_locations`.

<File name='models/<filename>.yml'>

```yaml
unit_tests:
  - name: test_does_location_opened_at_trunc_to_date
    description: "Check that opened_at timestamp is properly truncated to a date."
    model: stg_locations
    given:
      - input: source('ecom', 'raw_stores')
        rows:
          - {id: 1, name: "Rego Park", tax_rate: 0.2, opened_at: "2016-09-01T00:00:00"}
          - {id: 2, name: "Jamaica", tax_rate: 0.1, opened_at: "2079-10-27T23:59:59.9999"}
    expect:
      rows:
        - {location_id: 1, location_name: "Rego Park", tax_rate: 0.2, opened_date: "2016-09-01"}
        - {location_id: 2, location_name: "Jamaica", tax_rate: 0.1, opened_date: "2079-10-27"}
```

</File>
