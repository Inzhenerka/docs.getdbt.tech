---
resource_types: all
datatype: markdown_string
description: "Этот гид объясняет, как использовать ключ description для добавления YAML описаний к ресурсам dbt (моделям, источникам, семенам) с использованием markdown и Jinja для улучшения документации."
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Источники', value: 'sources', },
    { label: 'Семена', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Анализы', value: 'analyses', },
    { label: 'Макросы', value: 'macros', },
    { label: 'Тесты данных', value: 'data_tests', },
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

Свойство `description` доступно для общих и единичных тестов данных, начиная с версии dbt v1.9.

</VersionBlock>

</TabItem>

</Tabs>

## Определение
Описание, заданное пользователем. Может использоваться для документирования:
- модели и столбцов модели
- источников, таблиц источников и столбцов источников
- семян и столбцов семян
- снимков и столбцов снимков
- анализов и столбцов анализа
- макросов и аргументов макросов

Эти описания используются на сайте документации, создаваемом dbt (см. [гид по документации](/docs/build/documentation) или [dbt Explorer](/docs/collaborate/explore-projects)). 

Описания могут включать markdown, а также [`doc` функцию jinja](/reference/dbt-jinja-functions/doc).

:::caution Вам может понадобиться заключить ваше YAML в кавычки

Обратите внимание на семантику YAML при предоставлении описания. Если ваше описание содержит специальные символы YAML, такие как фигурные скобки, двоеточия или квадратные скобки, вам может понадобиться заключить ваше описание в кавычки. Пример заключенного в кавычки описания показан [ниже](#use-some-markdown-in-a-description).

:::

## Примеры

### Добавление простого описания к модели и столбцу

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: Один запись на клиента

    columns:
      - name: customer_id
        description: Первичный ключ

```

</File>

### Добавление многострочного описания к модели

Вы можете использовать [блочную нотацию YAML](https://yaml-multiline.info/), чтобы разбить более длинное описание на несколько строк:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: >
      Один запись на клиента. Обратите внимание, что клиент должен совершить покупку, чтобы
      быть включенным в эту <Term id="table" /> — учетные записи клиентов, которые были созданы, но никогда
      не использовались, были отфильтрованы.

    columns:
      - name: customer_id
        description: Первичный ключ.

```

</File>

### Использование markdown в описании

Вы можете использовать markdown в ваших описаниях, но вам может понадобиться заключить ваше описание в кавычки, чтобы гарантировать, что парсер YAML не запутается из-за специальных символов!

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: "**\[Читать далее](https://www.google.com/)**"

    columns:
      - name: customer_id
        description: Первичный ключ.

```

</File>

### Использование блока docs в описании

Если у вас длинное описание, особенно если оно содержит markdown, может быть более целесообразно использовать [`docs` блок](/reference/dbt-jinja-functions/doc). Преимущество этого подхода заключается в том, что редакторы кода правильно выделяют markdown, что упрощает отладку во время написания.

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: fct_orders
    description: Эта таблица содержит основную информацию о заказах, а также некоторые производные факты на основе платежей

    columns:
      - name: status
        description: '{{ doc("orders_status") }}'

```

</File>

<File name='models/docs.md'>

```

{% docs orders_status %}

Заказы могут иметь один из следующих статусов:

| статус         | описание                                                               |
|----------------|---------------------------------------------------------------------------|
| placed         | Заказ был размещен, но еще не покинул склад                              |
| shipped        | Заказ был отправлен клиенту и в настоящее время находится в пути         |
| completed      | Заказ был получен клиентом                                               |
| returned       | Заказ был возвращен клиентом и получен на складе                        |


{% enddocs %}

```

</File>


### Ссылка на другую модель в описании

Вы можете использовать относительные ссылки для ссылки на другую модель. Это немного хитро — но для этого:

1. Запустите ваш сайт документации.
2. Перейдите к модели, на которую хотите сослаться, например, `http://127.0.0.1:8080/#!/model/model.jaffle_shop.stg_stripe__payments`
3. Скопируйте url_path, т.е. все после `http://127.0.0.1:8080/`, в данном случае `#!/model/model.jaffle_shop.stg_stripe__payments`
4. Вставьте это как ссылку

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "Фильтрация выполнена на основе \[stg_stripe__payments](#!/model/model.jaffle_shop.stg_stripe__payments)"

    columns:
      - name: customer_id
        description: Первичный ключ

```

</File>


### Включение изображения из вашего репозитория в ваши описания

Этот раздел применим только к пользователям dbt Core. Включение изображения из вашего репозитория гарантирует, что ваши изображения находятся под контролем версий. 

Как пользователи dbt Cloud, так и dbt Core могут [включать изображение из интернета](#include-an-image-from-the-web-in-your-descriptions), что предлагает динамический контент, уменьшение размера репозитория, доступность и легкость сотрудничества.

Чтобы включить изображение в поле `description` вашей модели:

1. Добавьте файл в подкаталог, например, `assets/dbt-logo.svg`
2. Установите конфигурацию [`asset-paths`](/reference/project-configs/asset-paths) в вашем файле `dbt_project.yml`, чтобы этот каталог копировался в каталог `target/` в рамках `dbt docs generate`

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
    description: "!\[Логотип dbt](assets/dbt-logo.svg)"

    columns:
      - name: customer_id
        description: Первичный ключ

```

</File>

3. Запустите `dbt docs generate` — каталог `assets` будет скопирован в каталог `target`

4. Запустите `dbt docs serve` — изображение будет отображено как часть вашей документации проекта:

Если вы смешиваете изображения и текст, также рассмотрите возможность использования блока docs.

### Включение изображения из интернета в ваши описания

Этот раздел применим как к пользователям dbt Cloud, так и к пользователям dbt Core. Включение изображения из интернета предлагает динамический контент, уменьшение размера репозитория, доступность и легкость сотрудничества.

Чтобы включить изображения из интернета, укажите URL изображения в поле `description` вашей модели:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "!\[Логотип dbt](https://github.com/dbt-labs/dbt-core/blob/main/etc/dbt-core.svg)"

    columns:
      - name: customer_id
        description: Первичный ключ

```

</File>

Если вы смешиваете изображения и текст, также рассмотрите возможность использования блока docs.