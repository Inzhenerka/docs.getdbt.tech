---
resource_types: [models, seeds, snapshots, tests]
description: "Псевдоним ресурса позволяет задать ему пользовательское имя в базе данных вместо использования имени файла."
datatype: string
---

<Tabs>
<TabItem value="model" label="Модели">

Укажите пользовательский псевдоним для модели в вашем файле `dbt_project.yml`, файле `models/properties.yml` или в блоке конфигурации в SQL-файле.

Например, если у вас есть модель, которая вычисляет `sales_total`, и вы хотите дать ей более удобочитаемый псевдоним, вы можете задать псевдоним, как показано в следующих примерах.

В файле `dbt_project.yml` следующий пример устанавливает значение по умолчанию для `alias` модели `sales_total` на уровне проекта:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_total:
      +alias: sales_dashboard
```
</File>

Следующий пример задает `alias` как часть метаданных файла `models/properties.yml`, что полезно для централизованной конфигурации:

<File name='models/properties.yml'>

```yml
version: 2

models:
  - name: sales_total
    config:
      alias: sales_dashboard
```
</File>

Следующий пример задает `alias` непосредственно в файле `models/sales_total.sql`:

<File name='models/sales_total.sql'>

```sql
{{ config(
    alias="sales_dashboard"
) }}
```
</File>

Это приведет к тому, что в базе данных будет возвращено `analytics.finance.sales_dashboard`, вместо значения по умолчанию `analytics.finance.sales_total`.

</TabItem>

<TabItem value="seeds" label="Семена">

Настройте псевдоним семени в вашем файле `dbt_project.yml` или файле `properties.yml`. Следующие примеры демонстрируют, как задать `alias` для семени с именем `product_categories` как `categories_data`.

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
version: 2

seeds:
  - name: product_categories
    config:
      alias: categories_data
```
</File>

Это приведет к тому, что в базе данных будет возвращено имя `analytics.finance.categories_data`.

В следующем примере семя в `seeds/country_codes.csv` будет создано как <Term id="table" /> с именем `country_mappings`.

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    country_codes:
      +alias: country_mappings

```
</File>
</TabItem>

<TabItem value="snapshot" label="Снимки">

Настройте псевдоним снимка в вашем файле `dbt_project.yml` или в блоке конфигурации.

Следующие примеры демонстрируют, как задать `alias` для снимка с именем `your_snapshot` как `the_best_snapshot`.

В файле `dbt_project.yml` на уровне проекта:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +alias: the_best_snapshot
```
</File>

В файле `snapshots/properties.yml`:

<File name='snapshots/properties.yml'>

```yml
version: 2

snapshots:
  - name: your_snapshot
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

Это создаст ваш снимок как `analytics.finance.the_best_snapshot` в базе данных.

</TabItem>

<TabItem value="test" label="Тесты">

Настройте псевдоним теста данных в вашем файле `dbt_project.yml`, файле `properties.yml` или в блоке конфигурации в файле модели.

Следующие примеры демонстрируют, как задать `alias` для уникального теста данных с именем `order_id` как `unique_order_id_test`, чтобы идентифицировать конкретный тест данных.

В файле `dbt_project.yml` на уровне проекта:

<File name='dbt_project.yml'>

```yml
tests:
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
        tests:
          - unique:
              alias: unique_order_id_test
```
</File>

В файле `tests/unique_order_id_test.sql`:

<File name='tests/unique_order_id_test.sql'>

```sql
{{ config(
    alias="unique_order_id_test",
    severity="error",
```
</File>

При использовании [`store_failures_as`](/reference/resource-configs/store_failures_as) это приведет к тому, что в базе данных будет возвращено имя `analytics.finance.orders_order_id_unique_order_id_test`.

</TabItem>
</Tabs>

## Определение

При желании укажите пользовательский псевдоним для [модели](/docs/build/models), [теста данных](/docs/build/data-tests), [снимка](/docs/build/snapshots) или [семени](/docs/build/seeds).

Когда dbt создает отношение (<Term id="table" />/<Term id="view" />) в базе данных, оно создается как: `{{ database }}.{{ schema }}.{{ identifier }}`, например, `analytics.finance.payments`.

Стандартное поведение dbt таково:
* Если пользовательский псевдоним _не_ указан, идентификатор отношения будет равен имени ресурса (т.е. имени файла).
* Если пользовательский псевдоним указан, идентификатор отношения будет равен значению `{{ alias }}`.

**Примечание**: В случае [эпhemeral model](/docs/build/materializations) dbt всегда будет применять префикс `__dbt__cte__` к идентификатору <Term id="cte" />. Это означает, что если псевдоним установлен на эпhemer model, то его идентификатор CTE будет `__dbt__cte__{{ alias }}`, но если псевдоним не установлен, то его идентификатор будет `__dbt__cte__{{ filename }}`.

Чтобы узнать больше о том, как изменить способ, которым dbt генерирует идентификатор отношения, прочитайте [Использование псевдонимов](/docs/build/custom-aliases).