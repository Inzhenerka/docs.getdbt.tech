---
sidebar_label: "database"
resource_types: [models, seeds, tests]
datatype: string
description: "Переопределение базы данных по умолчанию при создании ресурсов в вашей платформе данных с помощью dbt."
---

<Tabs>
<TabItem value="model" label="Модель">

Укажите пользовательскую базу данных для модели в вашем файле `dbt_project.yml`.

Например, если у вас есть модель, которую вы хотите загрузить в базу данных, отличную от целевой, вы можете настроить её следующим образом:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_metrics:
      +database: reporting
```
</File>

Это приведет к тому, что сгенерированное отношение будет находиться в базе данных `reporting`, и полное имя отношения будет `reporting.finance.sales_metrics` вместо базы данных по умолчанию.
</TabItem>

<TabItem value="seeds" label="Сиды">

Настройте базу данных в вашем файле `dbt_project.yml`.

Например, чтобы загрузить сид в базу данных под названием `staging` вместо целевой базы данных, вы можете настроить его следующим образом:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_categories:
      +database: staging
```

Это приведет к тому, что сгенерированное отношение будет находиться в базе данных `staging`, и полное имя отношения будет `staging.finance.product_categories`.

</File>
</TabItem>

<TabItem value="snapshots" label="Снапшоты">


<VersionBlock firstVersion="1.9">

Укажите пользовательскую базу данных для снапшота в вашем файле `dbt_project.yml`, `snapshot.yml` или конфигурационном файле.

Например, если у вас есть снапшот, который вы хотите загрузить в базу данных, отличную от целевой, вы можете настроить его следующим образом:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +database: snapshots
```
</File>

Or in a `snapshot_name.yml` file:

<File name='snapshots/snapshot_name.yml'>

```yaml

snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      database: snapshots
```
</File>

Это приведет к тому, что сгенерированное отношение будет находиться в базе данных `snapshots`, и полное имя отношения будет `snapshots.finance.your_snapshot` вместо базы данных по умолчанию.

</VersionBlock>

</TabItem>

<TabItem value="test" label="Тесты">

Настройте базу данных для хранения результатов тестов в вашем файле `dbt_project.yml`.

Например, чтобы сохранить результаты тестов в определенной базе данных, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
data_tests:
  +store_failures: true
  +database: test_results
```

Это приведет к тому, что результаты тестов будут сохранены в базе данных `test_results`.
</File>
</TabItem>
</Tabs>

## Определение

При необходимости укажите пользовательскую базу данных для [модели](/docs/build/sql-models), [сида](/docs/build/seeds) или [теста данных](/docs/build/data-tests). (Чтобы указать базу данных для [снапшота](/docs/build/snapshots), используйте [`target_database` config](/reference/resource-configs/target_database)).

Необязательно можно указать пользовательскую базу данных для [model](/docs/build/sql-models), [seed](/docs/build/seeds), [snapshot](/docs/build/snapshots) или [data test](/docs/build/data-tests).

Стандартное поведение dbt:
* Если пользовательская база данных _не_ указана, база данных отношения — это целевая база данных (`{{ target.database }}`).
* Если пользовательская база данных указана, база данных отношения — это значение `{{ database }}`.

Чтобы узнать больше о том, как изменить способ генерации `database` для отношения в dbt, прочитайте [Использование пользовательских баз данных](/docs/build/custom-databases).

## Информация, специфичная для хранилища
* BigQuery: `project` и `database` взаимозаменяемы.