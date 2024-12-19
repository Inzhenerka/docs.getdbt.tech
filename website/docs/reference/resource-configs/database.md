---
sidebar_label: "база данных"
resource_types: [models, seeds, tests]
datatype: string
description: "Переопределите базу данных по умолчанию, когда dbt создает ресурсы в вашей платформе данных."
---

<Tabs>
<TabItem value="model" label="Модель">

Укажите пользовательскую базу данных для модели в вашем файле `dbt_project.yml`. 

Например, если у вас есть модель, которую вы хотите загрузить в базу данных, отличную от целевой базы данных, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_metrics:
      +database: reporting
```
</File>

В результате сгенерированное отношение будет находиться в базе данных `reporting`, поэтому полное имя отношения будет `reporting.finance.sales_metrics`, а не в целевой базе данных по умолчанию.
</TabItem>

<TabItem value="seeds" label="Семена">

Настройте базу данных в вашем файле `dbt_project.yml`. 

Например, чтобы загрузить семя в базу данных под названием `staging`, а не в целевую базу данных, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_categories:
      +database: staging
```

В результате сгенерированное отношение будет находиться в базе данных `staging`, поэтому полное имя отношения будет `staging.finance.product_categories`.

</File>
</TabItem>

<TabItem value="snapshots" label="Снимки">

<VersionBlock lastVersion="1.8">

Доступно для релизов dbt Cloud или dbt Core v1.9+. Выберите v1.9 или новее в выпадающем списке версий, чтобы просмотреть конфигурации.

</VersionBlock>

<VersionBlock firstVersion="1.9">

Укажите пользовательскую базу данных для снимка в вашем файле `dbt_project.yml` или конфигурационном файле. 

Например, если у вас есть снимок, который вы хотите загрузить в базу данных, отличную от целевой базы данных, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +database: snapshots
```
</File>

В результате сгенерированное отношение будет находиться в базе данных `snapshots`, поэтому полное имя отношения будет `snapshots.finance.your_snapshot`, а не в целевой базе данных по умолчанию.

</VersionBlock>

</TabItem>

<TabItem value="test" label="Тесты">

Настройте базу данных для хранения результатов тестов в вашем файле `dbt_project.yml`.

Например, чтобы сохранить результаты тестов в конкретной базе данных, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
tests:
  +store_failures: true
  +database: test_results
```

В результате результаты тестов будут храниться в базе данных `test_results`.
</File>
</TabItem>
</Tabs>

## Определение

При желании укажите пользовательскую базу данных для [модели](/docs/build/sql-models), [семени](/docs/build/seeds) или [теста данных](/docs/build/data-tests). (Чтобы указать базу данных для [снимка](/docs/build/snapshots), используйте [`target_database` config](/reference/resource-configs/target_database)).

Когда dbt создает отношение (<Term id="table" />/<Term id="view" />) в базе данных, оно создается как: `{{ database }}.{{ schema }}.{{ identifier }}`, например, `analytics.finance.payments`.

Стандартное поведение dbt:
* Если пользовательская база данных _не_ указана, база данных отношения — это целевая база данных (`{{ target.database }}`).
* Если указана пользовательская база данных, база данных отношения — это значение `{{ database }}`.

Чтобы узнать больше о том, как изменить способ, которым dbt генерирует `database` для отношения, прочитайте [Использование пользовательских баз данных](/docs/build/custom-databases).

## Информация, специфичная для склада
* BigQuery: `project` и `database` взаимозаменяемы.