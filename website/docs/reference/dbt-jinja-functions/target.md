---
title: "О переменных target"
sidebar_label: "target"
id: "target"
description: "Переменная `target` содержит информацию о вашем подключении к хранилищу данных."
---

Переменная `target` содержит информацию о вашем подключении к хранилищу данных.

- **dbt Core:** Эти значения основаны на целевом значении, определенном в вашем файле [profiles.yml](/docs/core/connect-data-platform/profiles.yml). Обратите внимание, что для некоторых адаптеров могут потребоваться дополнительные шаги конфигурации. Обратитесь к [странице настройки](/docs/core/connect-data-platform/about-core-connections) для вашей платформы данных.
- **dbt Cloud:** Чтобы узнать больше о настройке вашего адаптера в dbt Cloud, обратитесь к разделу [О подключениях к платформам данных](/docs/cloud/connect-data-platform/about-connections).
   - **[dbt Cloud Scheduler](/docs/deploy/job-scheduler)**: `target.name` определяется для каждой задачи, как описано в разделе [Пользовательские имена целей](/docs/build/custom-target-names). Для других атрибутов значения определяются подключением развертывания. Чтобы проверить эти значения, нажмите **Deploy** и выберите **Environments**. Затем выберите соответствующую среду развертывания и нажмите **Settings**.
   - **[dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)**: Эти значения определяются вашим подключением и учетными данными. Чтобы изменить эти значения, нажмите на имя вашей учетной записи в левом меню и выберите **Account settings**. Затем нажмите **Credentials**. Выберите и отредактируйте проект, чтобы настроить учетные данные и имя цели.

Некоторые конфигурации общие для всех адаптеров, в то время как другие специфичны для адаптера.

## Общие
| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.profile_name` | jaffle_shop | Имя активного профиля |
| `target.name` | dev | Имя активной цели |
| `target.schema` | dbt_alice | Имя схемы dbt (или набора данных в BigQuery) |
| `target.type` | postgres | Активный используемый адаптер. Один из "postgres", "snowflake", "bigquery", "redshift", "databricks" |
| `target.threads` | 4 | Количество потоков, используемых dbt |


## Специфично для адаптера
### Snowflake

| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.database` | RAW | Имя базы данных, указанное в активной цели. |
| `target.warehouse` | TRANSFORM | Имя виртуального хранилища Snowflake |
| `target.user` | TRANSFORM_USER | Пользователь, указанный в активной цели |
| `target.role` | TRANSFORM_ROLE | Роль, указанная в активной цели |
| `target.account` | abc123 | Учетная запись, указанная в активной цели |

### Postgres/Redshift

| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.dbname` | analytics | Имя базы данных, указанное в активной цели. |
| `target.host` | abc123.us-west-2.redshift.amazonaws.com | Хост, указанный в активной цели |
| `target.user` | dbt_user | Пользователь, указанный в активной цели |
| `target.port` | 5439 | Порт, указанный в активном профиле |

### BigQuery

| Переменная | Пример | Описание |
| -------- | ------- | ----------- |
| `target.project` | abc-123 | Проект, указанный в активном профиле |
| `target.dataset` | dbt_alice | Набор данных активного профиля |

## Примеры

### Используйте `target.name` для ограничения данных в dev

Пока вы используете разумные имена целей, вы можете выполнять условную логику для ограничения данных при работе в dev.

```sql
select
  *
from source('web_events', 'page_views')
{% if target.name == 'dev' %}
where created_at >= dateadd('day', -3, current_date)
{% endif %}
```

### Используйте `target.name` для изменения вашей исходной базы данных

Если у вас есть конкретные базы данных Snowflake, настроенные для ваших сред dev/qa/prod, вы можете настроить свои источники для компиляции в разные базы данных в зависимости от вашей среды.

```yml
version: 2
 
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