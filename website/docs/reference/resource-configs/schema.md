---
sidebar_label: "schema"
resource_types: [models, seeds, tests]
description: "Переопределение стандартной схемы при создании ресурсов dbt на вашей платформе данных."
datatype: string
---

<Tabs>
<TabItem value="model" label="Модель">

Укажите [пользовательскую схему](/docs/build/custom-schemas#understanding-custom-schemas) для группы моделей в вашем файле `dbt_project.yml` или в [блоке конфигурации](/reference/resource-configs/schema#models).

Например, если у вас есть группа моделей, связанных с маркетингом, и вы хотите разместить их в отдельной схеме под названием `marketing`, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    marketing: # Группировка или папка для набора моделей
      +schema: marketing
```
</File>

Это приведет к тому, что сгенерированные отношения для этих моделей будут находиться в схеме `marketing`, так что полные имена отношений будут `analytics.target_schema_marketing.model_name`. Это происходит потому, что схема отношения — это `{{ target.schema }}_{{ schema }}`. Раздел [определение](#definition) объясняет это более подробно.

</TabItem>

<TabItem value="seeds" label="Сиды">

Настройте [пользовательскую](/docs/build/custom-schemas#understanding-custom-schemas) схему в вашем файле `dbt_project.yml`.

Например, если у вас есть сид, который должен быть размещен в отдельной схеме под названием `mappings`, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_mappings:
      +schema: mappings
```

Это приведет к тому, что сгенерированное отношение будет находиться в схеме `mappings`, так что полное имя отношения будет `analytics.mappings.seed_name`.

</File>
</TabItem>

<TabItem value="snapshots" label="Снапшоты">

<VersionBlock firstVersion="1.9">

Укажите [пользовательскую схему](/docs/build/custom-schemas#understanding-custom-schemas)) для снапшота в вашем файле `dbt_project.yml` или файле конфигурации.

Например, если у вас есть снапшот, который вы хотите загрузить в схему, отличную от целевой схемы, вы можете настроить это следующим образом:

In a `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +schema: snapshots
```
</File>

In a `snapshots/snapshot_name.yml` file:

<File name='snapshots/snapshot_name.yml'>

```yaml

snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      schema: snapshots
```

</File>

Это приведет к тому, что сгенерированное отношение будет находиться в схеме `snapshots`, так что полное имя отношения будет `analytics.snapshots.your_snapshot` вместо стандартной целевой схемы.

</VersionBlock>

</TabItem>

<TabItem value="saved-queries" label="Сохраненные запросы">

Specify a [custom schema](/docs/build/custom-schemas#understanding-custom-schemas) for a [saved query](/docs/build/saved-queries#parameters) in your `dbt_project.yml` or YAML file.

<File name='dbt_project.yml'>
```yml
saved-queries:
  +schema: metrics
```
</File>

This would result in the saved query being stored in the `metrics` schema.

</TabItem>
<TabItem value="tests" label="Тест">

Настройте [свою схему](/docs/build/custom-schemas#understanding-custom-schemas) для хранения результатов тестов в вашем файле `dbt_project.yml`.

Например, чтобы сохранить результаты тестов в определенной схеме, вы можете настроить это следующим образом:

<File name='dbt_project.yml'>

```yml
data_tests:
  +store_failures: true
  +schema: test_results
```

Это приведет к тому, что результаты тестов будут сохранены в схеме `test_results`.
</File>
</TabItem>
</Tabs>

Обратитесь к разделу [Использование](#usage) для получения дополнительных примеров.

## Определение
При необходимости укажите пользовательскую схему для [модели](/docs/build/sql-models), [сида](/docs/build/seeds), [снапшота](/docs/build/snapshots), [сохраненного запроса](/docs/build/saved-queries) или [теста](/docs/build/data-tests).

Для пользователей <Constant name="cloud" /> версии 1.8 или ниже используйте конфигурацию [`target_schema`](/reference/resource-configs/target_schema), чтобы указать пользовательскую схему для snapshot.

Когда dbt создает отношение (<Term id="table" />/<Term id="view" />) в базе данных, оно создается как: `{{ database }}.{{ schema }}.{{ identifier }}`, например, `analytics.finance.payments`.

Стандартное поведение dbt:
* Если пользовательская схема _не_ указана, схема отношения — это целевая схема (`{{ target.schema }}`).
* Если пользовательская схема указана, по умолчанию схема отношения — это `{{ target.schema }}_{{ schema }}`.

Чтобы узнать больше о том, как изменить способ генерации схемы отношения dbt, прочитайте [Использование пользовательских схем](/docs/build/custom-schemas).

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

Настройте отдельные модели с помощью блока конфигурации:

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

### Тесты данных

Настройте имя схемы, в которой тесты [настроенные для хранения сбоев](/reference/resource-configs/store_failures) будут сохранять свои результаты.
Полученная схема — это `{{ profile.schema }}_{{ tests.schema }}`, с суффиксом по умолчанию `dbt_test__audit`.
Чтобы использовать ту же схему профиля, установите `+schema: null`.

<File name='dbt_project.yml'>

```yml
data_tests:
  +store_failures: true
  +schema: _sad_test_failures  # Запишет таблицы в my_database.my_schema__sad_test_failures
```

</File>

Убедитесь, что у вас есть права на создание или доступ к схемам, необходимым для вашей работы. Чтобы проверить, что требуемые схемы имеют корректные разрешения, выполните SQL‑запрос в соответствующей среде вашей платформы данных. Например, при использовании Redshift выполните следующую команду (конкретный запрос для проверки прав может отличаться в зависимости от платформы данных):

```sql
create schema if not exists dev_username_dbt_test__audit authorization username;
```
_Замените `dev_username` на ваше конкретное имя схемы разработки и `username` на соответствующего пользователя, которому должны быть предоставлены разрешения._

Эта команда предоставляет соответствующие разрешения для создания и доступа к схеме `dbt_test__audit`, которая часто используется с конфигурацией `store_failures`.

## Информация, специфичная для хранилища
* BigQuery: `dataset` и `schema` взаимозаменяемы.