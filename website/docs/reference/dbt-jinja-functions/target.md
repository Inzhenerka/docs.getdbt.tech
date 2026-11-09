---
title: "О переменных target"
sidebar_label: "target"
id: "target"
description: "Переменная `target` содержит информацию о вашем подключении к хранилищу."
---

Переменная `target` содержит информацию о вашем подключении к хранилищу.

- **<Constant name="core" />:** Эти значения определяются на основе целевого окружения, заданного в файле [profiles.yml](/docs/local/profiles.yml). Обратите внимание: для некоторых адаптеров могут потребоваться дополнительные шаги настройки. См. [страницу настройки](/docs/local/connect-data-platform/about-dbt-connections) для вашей платформы данных.
- **<Constant name="dbt" />** Подробнее о настройке адаптера в <Constant name="dbt" /> см. в разделе [О подключениях к платформам данных](/docs/platform/connect-data-platform/about-connections).
   - **[<Constant name="orchestrator" />](/docs/deploy/job-scheduler)**: `target.name` задаётся для каждого задания, как описано в разделе [Пользовательские имена целевых окружений](/docs/build/custom-target-names). Значения остальных атрибутов определяются подключением среды развёртывания. Чтобы проверить эти значения, нажмите **Deploy** и выберите **Environments**. Затем выберите нужную среду развёртывания и нажмите **Settings**.
   - **[<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)**: Эти значения определяются вашим подключением и учётными данными. Чтобы изменить эти значения, нажмите на имя своей учётной записи в левом боковом меню и выберите **Account settings**. Затем нажмите **Credentials**. Выберите проект и отредактируйте его настройки, чтобы задать учётные данные и имя целевого окружения.

Некоторые настройки общие для всех адаптеров, а другие зависят от адаптера. Вы также можете использовать [флаг `--target`](#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D1%84%D0%BB%D0%B0%D0%B3%D0%B0---target), чтобы задать активное целевое окружение при выполнении команд dbt.

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

## Использование флага --target

Используйте флаг `--target` при выполнении команд dbt, чтобы задать активную целевую конфигурацию и связанное с ней значение `target.name`:

```bash
dbt run --target dev
```

```bash
dbt run --target prod
```

Вы можете использовать флаг `--target` с любой командой dbt, чтобы переопределить целевую конфигурацию по умолчанию, указанную в файле `profiles.yml`. Это удобно для запуска одного и того же проекта dbt в разных средах (например, dev, staging или prod) без изменения файлов конфигурации.

## Примеры

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