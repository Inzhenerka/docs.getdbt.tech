---
resource_types: [models, seeds, snapshots, tests, functions]
description: "Псевдоним ресурса позволяет задать ему собственное имя в базе данных вместо имени файла."
datatype: string
intro_text: Укажите собственный псевдоним для модели, теста данных, снимка, seed или функции, чтобы задать более удобное имя в базе данных.
---

<Tabs>
<TabItem value="model" label="Модели">

Укажите пользовательский алиас для модели в YAML‑файле проекта (`dbt_project.yml`), в YAML‑файле с описанием свойств (например, `models/properties.yml`) через `config`, либо в блоке `config` внутри SQL‑файла.

Например, если у вас есть модель, которая вычисляет `sales_total`, и вы хотите дать ей более удобный для пользователя псевдоним, вы можете сделать это, как показано в следующих примерах.

В файле `dbt_project.yml` следующий пример задает псевдоним по умолчанию для модели `sales_total` на уровне проекта:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_total:
      +alias: sales_dashboard
```
</File>

Следующий пример указывает псевдоним как часть метаданных файла `models/properties.yml`, что полезно для централизованной конфигурации:

<File name='models/properties.yml'>

```yml

models:
  - name: sales_total
    config:
      alias: sales_dashboard
```
</File>

Следующий пример назначает псевдоним непосредственно в файле `models/sales_total.sql`:

<File name='models/sales_total.sql'>

```sql
{{ config(
    alias="sales_dashboard"
) }}
```
</File>

Это вернет `analytics.finance.sales_dashboard` в базе данных вместо стандартного `analytics.finance.sales_total`.

</TabItem>

<TabItem value="seeds" label="Сиды">

Настройте `alias` для seed в файле проекта (`dbt_project.yml`) или в конфигурационном файле свойств (например, `seeds/properties.yml`). Следующие примеры показывают, как задать `alias` для seed с именем `product_categories`, чтобы он использовался под именем `categories_data`.

В файле `dbt_project.yml` на уровне проекта:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_categories:
      +alias: categories_data
```
</File>

В файле `seeds/properties.yml`:

<File name='seeds/properties.yml'>

```yml

seeds:
  - name: product_categories
    config:
      alias: categories_data
```
</File>

Это вернет имя `analytics.finance.categories_data` в базе данных.

В следующем примере сид в `seeds/country_codes.csv` будет построен как <Term id="table" /> с именем `country_mappings`.

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    country_codes:
      +alias: country_mappings

```
</File>
</TabItem>

<TabItem value="snapshot" label="Снапшоты">

Настройте alias для snapshot в YAML-файле проекта (`dbt_project.yml`), YAML-файле свойств (например, `snapshots/snapshot_name.yml`) или в блоке конфигурации SQL-файла модели.

Следующие примеры демонстрируют, как задать псевдоним для снапшота с именем `your_snapshot` как `the_best_snapshot`.

В файле `dbt_project.yml` на уровне проекта:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +alias: the_best_snapshot
```
</File>

В файле `snapshots/snapshot_name.yml`:

<File name='snapshots/snapshot_name.yml'>

```yml

snapshots:
  - name: your_snapshot_name
    config:
      alias: the_best_snapshot
```

</File>

В файле `snapshots/your_snapshot.sql`:

<File name='snapshots/your_snapshot.sql'>

```sql
{{ config(
    alias="the_best_snapshot"
) }}
```
</File>

Это построит ваш снапшот как `analytics.finance.the_best_snapshot` в базе данных.

</TabItem>

<TabItem value="test" label="Тесты">

Настройте alias для data test в YAML-файле проекта (`dbt_project.yml`), в YAML-файле свойств (например, `models/properties.yml`) или в блоке `config` внутри SQL-файла модели.

Следующие примеры демонстрируют, как задать псевдоним для уникального теста данных с именем `order_id` как `unique_order_id_test` для идентификации конкретного теста данных.

В файле `dbt_project.yml` на уровне проекта:

<File name='dbt_project.yml'>

```yml
data_tests:
  your_project:
    +alias: unique_order_id_test
```
</File>

В файле `models/properties.yml`:

<File name='models/properties.yml'>

```yml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                alias: unique_order_id_test
```
</File>

В файле `tests/unique_order_id_test.sql`:

<File name='tests/unique_order_id_test.sql'>

```sql
{{ config(
    alias="unique_order_id_test",
    severity="error"
) }}
```
</File>

При использовании [`store_failures_as`](/reference/resource-configs/store_failures_as), это вернет имя `analytics.dbt_test__audit.orders_order_id_unique_order_id_test` в базе данных.

</TabItem>

<TabItem value="functions" label="Functions">

Configure a function's alias in your project YAML file (`dbt_project.yml`), a properties YAML file (for example, `functions/properties.yml`), or in a SQL file config block.

The following examples demonstrate how to `alias` a function named `calculate_tax` to `tax_calculator`.

In the `dbt_project.yml` file at the project level:

<File name='dbt_project.yml'>

```yml
functions:
  your_project:
    calculate_tax:
      +alias: tax_calculator
```

</File>

In `functions/properties.yml`:

<File name='functions/properties.yml'>

```yml
functions:
  - name: calculate_tax
    config:
      alias: tax_calculator
```

</File>

In `functions/calculate_tax.sql`:

<File name='functions/calculate_tax.sql'>

```sql
{{ config(
    alias="tax_calculator"
) }}
```

</File>

This creates the function as `analytics.finance.tax_calculator` in the database. Without an alias, dbt uses the function name (`calculate_tax`) as the identifier.

When referencing the function in your project, use `{{ function('calculate_tax') }}`. dbt looks up the function name and returns the fully-qualified name using the alias, for example `analytics.finance.tax_calculator`.

</TabItem>
</Tabs>

## Определение

При необходимости укажите пользовательский псевдоним для [модели](/docs/build/models), [теста данных](/docs/build/data-tests), [снимка](/docs/build/snapshots), [seed](/docs/build/seeds) или [функции](/docs/build/udfs).

Когда dbt создает отношение (<Term id="table" />/<Term id="view" />) в базе данных, оно создается как: `{{ database }}.{{ schema }}.{{ identifier }}`, например, `analytics.finance.payments`.

Стандартное поведение dbt:
* Если пользовательский псевдоним _не_ указан, идентификатором отношения является имя ресурса (т.е. имя файла).
* Если пользовательский псевдоним указан, идентификатором отношения является значение `{{ alias }}`.

**Примечание** С [эфемерной моделью](/docs/build/materializations) dbt всегда будет применять префикс `__dbt__cte__` к идентификатору <Term id="cte" />. Это означает, что если псевдоним установлен на эфемерной модели, то ее идентификатор CTE будет `__dbt__cte__{{ alias }}`, но если псевдоним не установлен, то ее идентификатор будет `__dbt__cte__{{ filename }}`.

Чтобы узнать больше о том, как изменить способ генерации идентификатора отношения dbt, прочитайте [Использование псевдонимов](/docs/build/custom-aliases).
