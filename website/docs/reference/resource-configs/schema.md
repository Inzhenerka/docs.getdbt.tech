---
sidebar_label: "схема"
resource_types: [models, seeds, tests]
description: "Переопределите схему по умолчанию, когда dbt создает ресурсы в вашей платформе данных."
datatype: string
---

<Tabs>
<TabItem value="model" label="Модель">

Укажите [пользовательскую схему](/docs/build/custom-schemas#understanding-custom-schemas) для группы моделей в вашем файле `dbt_project.yml` или в [блоке конфигурации](/reference/resource-configs/schema#models). 

Например, если у вас есть группа моделей, связанных с маркетингом, и вы хотите поместить их в отдельную схему под названием `marketing`, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    marketing: # Группировка или папка для набора моделей
      +schema: marketing
```
</File>

В результате сгенерированные отношения для этих моделей будут находиться в схеме `marketing`, поэтому полные имена отношений будут `analytics.target_schema_marketing.model_name`. Это происходит потому, что схема отношения имеет вид `{{ target.schema }}_{{ schema }}`. Раздел [определение](#definition) объясняет это более подробно.

</TabItem>

<TabItem value="seeds" label="Сиды">

Настройте пользовательскую схему в вашем файле `dbt_project.yml`. 

Например, если у вас есть сид, который должен быть помещен в отдельную схему под названием `mappings`, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_mappings:
      +schema: mappings
```

В результате сгенерированное отношение будет находиться в схеме `mappings`, поэтому полное имя отношения будет `analytics.mappings.seed_name`. 

</File>
</TabItem>

<TabItem value="snapshots" label="Снимки">

<VersionBlock lastVersion="1.8">

Доступно в dbt Core v1.9+. Выберите v1.9 или новее в выпадающем списке версий, чтобы просмотреть конфигурации. Попробуйте это сейчас в [последнем релизе dbt Cloud](/docs/dbt-versions/cloud-release-tracks).

</VersionBlock>

<VersionBlock firstVersion="1.9">

Укажите пользовательскую схему для снимка в вашем `dbt_project.yml` или файле конфигурации. 

Например, если у вас есть снимок, который вы хотите загрузить в схему, отличную от целевой схемы, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +schema: snapshots
```
</File>

Это приведет к тому, что сгенерированное отношение будет находиться в схеме `snapshots`, поэтому полное имя отношения будет `analytics.snapshots.your_snapshot`, а не в целевой схеме по умолчанию.

</VersionBlock>

</TabItem>

<TabItem value="saved-queries" label="Сохраненные запросы">

<File name='dbt_project.yml'>
```yml
saved-queries:
  +schema: metrics
```
</File>
</TabItem>
<TabItem value="tests" label="Тест">

Настройте схему для хранения результатов тестов в вашем файле `dbt_project.yml`. 

Например, чтобы сохранить результаты тестов в определенной схеме, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
tests:
  +store_failures: true
  +schema: test_results
```

В результате результаты тестов будут храниться в схеме `test_results`.
</File>
</TabItem>
</Tabs>

Смотрите [Использование](#usage) для получения дополнительных примеров.

## Определение
При желании укажите пользовательскую схему для [модели](/docs/build/sql-models), [сида](/docs/build/seeds), [снимка](/docs/build/snapshots), [сохраненного запроса](/docs/build/saved-queries) или [теста](/docs/build/data-tests). 

Для пользователей dbt Cloud v1.8 или ранее используйте [`target_schema` config](/reference/resource-configs/target_schema), чтобы указать пользовательскую схему для снимка.

Когда dbt создает отношение (<Term id="table" />/<Term id="view" />) в базе данных, оно создается как: `{{ database }}.{{ schema }}.{{ identifier }}`, например `analytics.finance.payments`.

Стандартное поведение dbt:
* Если пользовательская схема _не_ указана, схема отношения — это целевая схема (`{{ target.schema }}`).
* Если пользовательская схема указана, по умолчанию схема отношения будет `{{ target.schema }}_{{ schema }}`.

Чтобы узнать больше о том, как изменить способ, которым dbt генерирует `schema` для отношения, прочитайте [Использование пользовательских схем](/docs/build/custom-schemas).

## Использование

### Модели

Настройте группы моделей из файла `dbt_project.yml`.

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop: # имя проекта
    marketing:
      +schema: marketing
```

</File>

Настройте отдельные модели, используя блок конфигурации:

<File name='models/my_model.sql'>

```sql
{{ config(
    schema='marketing'
) }}
```

</File>

### Сиды
<File name='dbt_project.yml'>

```yml
seeds:
  +schema: mappings
```

</File>

### Тесты

Настройте имя схемы, в которой тесты [настроены для хранения неудач](/reference/resource-configs/store_failures), чтобы сохранить свои результаты.
Полученная схема будет `{{ profile.schema }}_{{ tests.schema }}`, с суффиксом по умолчанию `dbt_test__audit`.
Чтобы использовать ту же схему профиля, установите `+schema: null`.

<File name='dbt_project.yml'>

```yml
tests:
  +store_failures: true
  +schema: _sad_test_failures  # Запишет таблицы в my_database.my_schema__sad_test_failures
```

</File>

Убедитесь, что у вас есть разрешения на создание или доступ к схемам для вашей работы. Чтобы убедиться, что необходимые схемы имеют правильные разрешения, выполните SQL-запрос в вашей среде платформы данных. Например, выполните следующую команду, если используете Redshift (точный запрос на авторизацию может отличаться в зависимости от платформы данных):

```sql
create schema if not exists dev_username_dbt_test__audit authorization username;
```
_Замените `dev_username` на ваше конкретное имя схемы разработки и `username` на соответствующего пользователя, который должен иметь разрешения._

Эта команда предоставляет соответствующие разрешения для создания и доступа к схеме `dbt_test__audit`, которая часто используется с конфигурацией `store_failures`.

## Информация, специфичная для склада
* BigQuery: `dataset` и `schema` взаимозаменяемы.