---
title: "О переменных target"
sidebar_label: "target"
id: "target"
description: "Переменная `target` содержит информацию о вашем подключении к хранилищу."
---

Переменная `target` содержит информацию о вашем подключении к хранилищу.

- **<Constant name="core" />:** Эти значения основаны на target, определённом в вашем файле [profiles.yml](/docs/core/connect-data-platform/profiles.yml). Обратите внимание, что для некоторых адаптеров могут потребоваться дополнительные шаги настройки. Подробности см. на странице [set up page](/docs/core/connect-data-platform/about-core-connections) для вашей платформы данных.
- **<Constant name="cloud" />** Чтобы узнать больше о настройке адаптера в <Constant name="cloud" />, см. раздел [About data platform connections](/docs/cloud/connect-data-platform/about-connections).
   - **[<Constant name="orchestrator" />](/docs/deploy/job-scheduler)**: `target.name` задаётся отдельно для каждого job, как описано в разделе [Custom target names](/docs/build/custom-target-names). Для остальных атрибутов значения определяются подключением deployment. Чтобы посмотреть эти значения, нажмите **Deploy** и выберите **Environments**. Затем выберите соответствующее deployment environment и нажмите **Settings**.
   - **[<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio)**: Эти значения определяются вашим подключением и учётными данными. Чтобы изменить их, нажмите на имя своей учётной записи в левом боковом меню и выберите **Account settings**. Затем нажмите **Credentials**. Выберите и отредактируйте проект, чтобы настроить учётные данные и имя target.

Некоторые конфигурации общие для всех адаптеров, в то время как другие специфичны для адаптеров.

## Общие {#common}
| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.profile_name` | jaffle_shop | Имя активного профиля |
| `target.name` | dev | Имя активной цели |
| `target.schema` | dbt_alice | Имя схемы dbt (или, набора данных в BigQuery) |
| `target.type` | postgres | Активный используемый адаптер. Один из "postgres", "snowflake", "bigquery", "redshift", "databricks" |
| `target.threads` | 4 | Количество потоков, используемых dbt |

## Специфичные для адаптера {#adapter-specific}
### Snowflake {#snowflake}

| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.database` | RAW | Имя базы данных, указанное в активной цели. |
| `target.warehouse` | TRANSFORM | Имя виртуального склада Snowflake |
| `target.user` | TRANSFORM_USER | Пользователь, указанный в активной цели |
| `target.role` | TRANSFORM_ROLE | Роль, указанная в активной цели |
| `target.account` | abc123 | Учетная запись, указанная в активной цели |

### Postgres/Redshift {#postgresredshift}

| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.dbname` | analytics | Имя базы данных, указанное в активной цели. |
| `target.host` | abc123.us-west-2.redshift.amazonaws.com | Хост, указанный в активной цели |
| `target.user` | dbt_user | Пользователь, указанный в активной цели |
| `target.port` | 5439 | Порт, указанный в активном профиле |

### BigQuery {#bigquery}

| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.project` | abc-123 | Проект, указанный в активном профиле |
| `target.dataset` | dbt_alice | Набор данных активного профиля |

## Примеры {#examples}

### Использование `target.name` для ограничения данных в dev {#use-targetname-to-limit-data-in-dev}

Пока вы используете разумные имена целей, вы можете выполнять условную логику для ограничения данных при работе в dev.

```sql
select
  *
from source('web_events', 'page_views')
{% if target.name == 'dev' %}
where created_at >= dateadd('day', -3, current_date)
{% endif %}
```

### Использование `target.name` для изменения вашей исходной базы данных {#use-targetname-to-change-your-source-database}

Если у вас настроены определенные базы данных Snowflake для ваших сред dev/qa/prod, вы можете настроить ваши источники для компиляции в разные базы данных в зависимости от вашей среды.

```yml
 
sources:
  - name: source_name 
    database: |
      {%- if  target.name == "dev" -%} raw_dev
      {%- elif target.name == "qa"  -%} raw_qa
      {%- elif target.name == "prod"  -%} raw_prod
      {%- else -%} invalid_database
      {%- endif -%}
    schema: source_schema
```