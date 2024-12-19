---
title: "Пользовательские базы данных"
id: "custom-databases"
---

:::info Слово о наименовании

Разные хранилища имеют разные названия для _логических баз данных_. Информация в этом документе охватывает "базы данных" в Snowflake, Redshift и Postgres; "проекты" в BigQuery; и "каталоги" в Databricks Unity Catalog.

Значения `project` и `database` взаимозаменяемы в конфигурациях проектов BigQuery.

:::

## Настройка пользовательских баз данных

Логическая база данных, в которую строятся модели dbt, может быть настроена с помощью конфигурации модели `database`. Если эта конфигурация не указана для модели, dbt будет использовать базу данных, настроенную в активной цели из вашего файла `profiles.yml`. Если конфигурация `database` *указана* для модели, dbt построит модель в указанную базу данных.

Конфигурация `database` может быть указана для групп моделей в файле `dbt_project.yml` или для отдельных моделей в SQL-файлах моделей.

### Настройка переопределений базы данных в `dbt_project.yml`:

Эта конфигурация изменяет все модели в проекте `jaffle_shop`, чтобы они строились в базу данных с названием `jaffle_shop`.

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

Эта конфигурация изменяет конкретную модель, чтобы она строилась в базу данных с названием `jaffle_shop`.

<File name='models/my_model.sql'>

```sql

{{ config(database="jaffle_shop") }}

select * from ...
```

</File>

### generate_database_name

Имя базы данных, генерируемое для модели, контролируется макросом под названием `generate_database_name`. Этот макрос может быть переопределен в проекте dbt, чтобы изменить способ, которым dbt генерирует имена баз данных моделей. Этот макрос работает аналогично макросу [generate_schema_name](/docs/build/custom-schemas#advanced-custom-schema-configuration).

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

### Управление различными поведениями между пакетами

Смотрите документацию по макросу `dispatch`: ["Управление различными глобальными переопределениями между пакетами"](/reference/dbt-jinja-functions/dispatch)

## Учитываемые моменты

### BigQuery

Когда dbt открывает соединение с BigQuery, он делает это, используя `project_id`, определенный в вашей активной цели `profiles.yml`. Этот `project_id` будет выставлен в счет за запросы, которые выполняются в ходе выполнения dbt, даже если некоторые модели настроены на построение в других проектах.