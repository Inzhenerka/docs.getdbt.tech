---
title: "Настройка Infer"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Infer в dbt."
id: "infer-setup"
meta:
  maintained_by: Infer
  authors: Erik Mathiesen-Dreyfus, Ryan Garland
  github_repo: 'inferlabs/dbt-infer'
  pypi_package: 'dbt-infer'
  min_core_version: 'v1.2.0'
  cloud_support: Не поддерживается
  slack_channel_name: n/a
  slack_channel_link: 
  platform_name: 'Infer'
  config_page: '/reference/resource-configs/infer-configs'
  min_supported_version: n/a
---

:::info Плагин, поддерживаемый поставщиком

Некоторая основная функциональность может отличаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете посетить связанный репозиторий и открыть задачу.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Infer с помощью **dbt-infer** {#connecting-to-infer-with-dbt-infer}

Infer позволяет выполнять продвинутую ML аналитику в SQL, как если бы она была встроена в ваше хранилище данных.
Для этого Infer использует вариант, называемый SQL-inf, который определяет набор примитивных ML команд, из которых вы можете строить продвинутый анализ для любых бизнес-задач.
Подробнее о SQL-inf и Infer читайте в [документации Infer](https://docs.getinfer.io/).

Пакет `dbt-infer` позволяет легко использовать SQL-inf в ваших моделях DBT.
Подробнее о самом пакете `dbt-infer` и о том, как он подключается к Infer, читайте в [документации dbt-infer](https://dbt.getinfer.io/).

Пакет `dbt-infer` позволяет легко использовать SQL-inf прямо в ваших моделях dbt.  
Подробнее о самом пакете `dbt-infer` и о том, как он интегрируется с Infer, вы можете прочитать в [документации dbt-infer](https://dbt.getinfer.io/).

Адаптер dbt-infer распространяется через PyPi и устанавливается с помощью pip.  
Чтобы установить последнюю версию пакета dbt-infer, просто выполните следующую команду в том же shell-окружении, в котором вы запускаете dbt.
```python
pip install dbt-infer
```

Версионирование dbt-infer следует стандартной схеме версионирования dbt - это означает, что если вы используете dbt 1.2, соответствующий dbt-infer будет называться 1.2.x, где x - это последний номер минорной версии.

Перед использованием SQL-inf в ваших dbt-моделях необходимо настроить аккаунт Infer и сгенерировать API-key для подключения.  
Подробные инструкции можно найти в [Getting Started Guide](https://docs.getinfer.io/docs/reference/integrations/dbt).

Конфигурация профиля в `profiles.yml` для `dbt-infer` должна выглядеть примерно так:

<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: infer
      url: "<infer-api-endpoint>"
      username: "<infer-api-username>"
      apikey: "<infer-apikey>"
      data_config:
        [конфигурация для вашего основного хранилища данных]  
```

</File>

Обратите внимание, что вам также нужно установить пакет адаптера для вашего основного хранилища данных.
Например, если ваше хранилище данных - это BigQuery, то вам также нужно установить соответствующий пакет `dbt-bigquery`.
Конфигурация этого пакета помещается в поле `data_config`.

### Описание полей профиля Infer {#description-of-infer-profile-fields}

| Поле      | Обязательно | Описание                                                                                                                                       |
|-----------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`    | Да          | Должно быть установлено в `infer`. Это должно быть включено либо в `profiles.yml`, либо в файл `dbt_project.yml`.                             |
| `url`     | Да          | Имя хоста сервера Infer для подключения. Обычно это `https://app.getinfer.io`.                                                                |
| `username`| Да          | Ваше имя пользователя Infer - то, которое вы используете для входа.                                                                           |
| `apikey`  | Да          | Ваш API-ключ Infer.                                                                                                                           |
| `data_config` | Да      | Конфигурация для вашего основного хранилища данных. Формат этой конфигурации следует формату конфигурации для вашего адаптера хранилища данных. |

### Пример конфигурации Infer {#example-of-infer-configuration}

Чтобы проиллюстрировать вышеописанное, вот пример того, как может выглядеть конфигурация `dbt-infer`.
В этом случае основное хранилище данных - это BigQuery, для которого мы настраиваем адаптер внутри поля `data_config`.

```yaml
infer_bigquery:
  apikey: 1234567890abcdef
  username: my_name@example.com
  url: https://app.getinfer.io
  type: infer
  data_config:
    dataset: my_dataset
    job_execution_timeout_seconds: 300
    job_retries: 1
    keyfile: bq-user-creds.json
    location: EU
    method: service-account
    priority: interactive
    project: my-bigquery-project
    threads: 1
    type: bigquery
```

## Использование {#usage}

Вам не нужно ничего менять в существующих dbt‑моделях при переходе на использование SQL‑inf —  
все они будут работать так же, как и раньше, — но теперь у вас появляется возможность использовать команды SQL‑inf как нативные SQL‑функции.

Infer поддерживает ряд команд SQL-inf, включая 
`PREDICT`, `EXPLAIN`, `CLUSTER`, `SIMILAR_TO`, `TOPICS`, `SENTIMENT`.
Подробнее о SQL-inf и поддерживаемых командах читайте в [Руководстве по SQL-inf](https://docs.getinfer.io/docs/category/commands).

Чтобы помочь вам начать, мы приведем здесь краткий пример того, как может выглядеть такая модель.
Другие более сложные примеры вы можете найти в [репозитории примеров dbt-infer](https://github.com/inferlabs/dbt-infer-examples).

В нашем простом примере мы покажем, как использовать предыдущую модель 'user_features' для предсказания оттока
путем предсказания столбца `has_churned`.

```sql title="predict_user_churn.sql"
{{
  config(
    materialized = "table"
  )
}}

with predict_user_churn_input as (
    select * from {{ ref('user_features') }}
)

SELECT * FROM predict_user_churn_input PREDICT(has_churned, ignore=user_id)
```

Обратите внимание, что мы игнорируем `user_id` в предсказании.
Это связано с тем, что мы считаем, что `user_id` может и должен не влиять на наше предсказание оттока, поэтому мы его исключаем.
Мы также используем соглашение о сборе входных данных для нашего предсказания в CTE, названном `predict_user_churn_input`.