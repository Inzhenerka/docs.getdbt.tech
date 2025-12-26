---
title: "Пользовательские базы данных"
id: "custom-databases"
---

:::info Слово о наименованиях

Разные хранилища данных используют разные названия для _логических баз данных_. Информация в этом документе охватывает "базы данных" в Snowflake, Redshift и Postgres; "проекты" в BigQuery; и "каталоги" в Databricks Unity Catalog.

Значения `project` и `database` взаимозаменяемы в конфигурациях проектов BigQuery.

:::

## Настройка пользовательских баз данных

Логическая база данных, в которую строятся модели dbt, может быть настроена с помощью конфигурации модели `database`. Если эта конфигурация не указана для модели, то dbt будет использовать базу данных, настроенную в активной цели из вашего файла `profiles.yml`. Если конфигурация `database` *указана* для модели, то dbt построит модель в указанной базе данных.

Конфигурация `database` может быть указана для групп моделей в файле `dbt_project.yml` или для отдельных моделей в SQL-файлах моделей.

### Настройка переопределений базы данных в `dbt_project.yml`:

Эта конфигурация изменяет все модели в проекте `jaffle_shop`, чтобы они строились в базе данных под названием `jaffle_shop`.

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop

models:
  jaffle_shop:
    +database: jaffle_shop

    # Для пользователей BigQuery:
    # project: jaffle_shop
```

</File>

### Настройка переопределений базы данных в файле модели

Эта конфигурация изменяет конкретную модель, чтобы она строилась в базе данных под названием `jaffle_shop`.

<File name='models/my_model.sql'>

```sql

{{ config(database="jaffle_shop") }}

select * from ...
```

</File>

### generate_database_name

Имя базы данных, генерируемое для модели, контролируется макросом под названием `generate_database_name`. Этот макрос может быть переопределен в проекте dbt для изменения способа генерации имен баз данных для моделей. Этот макрос работает аналогично макросу [generate_schema_name](/docs/build/custom-schemas#advanced-custom-schema-configuration).

Чтобы переопределить генерацию имен баз данных в dbt, создайте макрос с именем `generate_database_name` в вашем собственном проекте dbt. Макрос `generate_database_name` принимает два аргумента:

1. Пользовательская база данных, указанная в конфигурации модели
2. Узел, для которого генерируется пользовательская база данных

Стандартная реализация `generate_database_name` просто использует указанную конфигурацию `database`, если она присутствует, в противном случае используется база данных, настроенная в активной `target`. Эта реализация выглядит следующим образом:

<File name='get_custom_database.sql'>

```jinja2
{% macro generate_database_name(custom_database_name=none, node=none) -%}

    {%- set default_database = target.database -%}
    {%- if custom_database_name is none -%}

        {{ default_database }}

    {%- else -%}

        {{ custom_database_name | trim }}

    {%- endif -%}

{%- endmacro %}

```

</File>

import WhitespaceControl from '/snippets/_whitespace-control.md';

<WhitespaceControl/>

### Управление различными поведениями в пакетах

См. документацию по макросу `dispatch`: ["Управление различными глобальными переопределениями в пакетах"](/reference/dbt-jinja-functions/dispatch)

## Соображения

### BigQuery

Когда dbt открывает соединение с BigQuery, он делает это, используя `project_id`, указанный в активном таргете в файле `profiles.yml`. Именно на этот `project_id` будут выставляться счета за запросы, выполняемые в рамках запуска dbt, даже если некоторые модели настроены так, чтобы создаваться в других проектах.

## Related docs

- [Customize dbt models database, schema, and alias](/guides/customize-schema-alias?step=1) — о том, как настраивать database, schema и alias для моделей dbt  
- [Custom schema](/docs/build/custom-schemas) — о том, как настраивать schema для моделей dbt  
- [Custom aliases](/docs/build/custom-aliases) — о том, как настраивать alias (имя) моделей dbt
