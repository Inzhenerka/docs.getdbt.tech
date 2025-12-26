---
resource_types: [models, seeds, snapshots, tests]
description: "Псевдонимизация ресурса позволяет задать ему пользовательское имя в базе данных вместо использования имени файла."
datatype: string
intro_text: Specify a custom alias for a model, data test, snapshot, or seed and give it a more user-friendly name in the database.
---

<Tabs>
<TabItem value="model" label="Модели">

Укажите пользовательский псевдоним для модели в вашем файле `dbt_project.yml`, `models/properties.yml` или блоке конфигурации в SQL файле.

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

Настройте псевдоним для сида в вашем файле `dbt_project.yml` или `properties.yml`. Следующие примеры демонстрируют, как задать псевдоним для сида с именем `product_categories` как `categories_data`.

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

Настройте псевдоним для снапшота в вашем файле `dbt_project.yml`, файле `snapshots/snapshot_name.yml` или блоке конфигурации.

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

Настройте псевдоним для теста данных в вашем файле `dbt_project.yml`, `properties.yml` или блоке конфигурации в файле модели.

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
</Tabs>

## Определение

При необходимости укажите пользовательский псевдоним для [модели](/docs/build/models), [теста данных](/docs/build/data-tests), [снапшота](/docs/build/snapshots) или [сида](/docs/build/seeds).

Когда dbt создает отношение (<Term id="table" />/<Term id="view" />) в базе данных, оно создается как: `{{ database }}.{{ schema }}.{{ identifier }}`, например, `analytics.finance.payments`.

Стандартное поведение dbt:
* Если пользовательский псевдоним _не_ указан, идентификатором отношения является имя ресурса (т.е. имя файла).
* Если пользовательский псевдоним указан, идентификатором отношения является значение `{{ alias }}`.

**Примечание** С [эфемерной моделью](/docs/build/materializations) dbt всегда будет применять префикс `__dbt__cte__` к идентификатору <Term id="cte" />. Это означает, что если псевдоним установлен на эфемерной модели, то ее идентификатор CTE будет `__dbt__cte__{{ alias }}`, но если псевдоним не установлен, то ее идентификатор будет `__dbt__cte__{{ filename }}`.

Чтобы узнать больше о том, как изменить способ генерации идентификатора отношения dbt, прочитайте [Использование псевдонимов](/docs/build/custom-aliases).