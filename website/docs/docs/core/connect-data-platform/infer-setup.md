---
title: "Настройка Infer"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Infer в dbt."
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

:::info Плагин с поддержкой поставщика

Некоторые основные функции могут различаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете ознакомиться с указанным репозиторием и открыть проблему.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Подключение к Infer с помощью **dbt-infer**

Infer позволяет вам выполнять продвинутую ML-аналитику в SQL, как если бы это было нативно для вашего хранилища данных. 
Для этого Infer использует вариант, называемый SQL-inf, который определяет набор примитивных ML-команд, с помощью которых 
вы можете строить продвинутый анализ для любого бизнес-кейса. 
Узнайте больше о SQL-inf и Infer в [документации Infer](https://docs.getinfer.io/).

Пакет `dbt-infer` позволяет вам легко использовать SQL-inf в ваших моделях DBT. 
Вы можете узнать больше о самом пакете `dbt-infer` и о том, как он подключается к Infer в [документации dbt-infer](https://dbt.getinfer.io/).

Адаптер dbt-infer поддерживается через PyPi и устанавливается с помощью pip. 
Чтобы установить последнюю версию пакета dbt-infer, просто выполните следующее в том же терминале, где вы запускаете dbt.
```python
pip install dbt-infer
```

Версионирование dbt-infer следует стандартной схеме версионирования dbt, что означает, что если вы используете dbt 1.2, соответствующий dbt-infer будет называться 1.2.x, где x - это номер последней минорной версии.

Перед использованием SQL-inf в ваших моделях DBT вам необходимо настроить учетную запись Infer и сгенерировать API-ключ для подключения. 
Вы можете прочитать, как это сделать, в [Руководстве по началу работы](https://docs.getinfer.io/docs/reference/integrations/dbt).

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

Обратите внимание, что вам также необходимо установить пакет адаптера для вашего основного хранилища данных. 
Например, если ваше хранилище данных - это BigQuery, то вам также необходимо установить соответствующий пакет `dbt-bigquery`. 
Конфигурация этого помещается в поле `data_config`.

### Описание полей профиля Infer

| Поле        | Обязательно | Описание                                                                                                                                       |
|-------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`      | Да          | Должен быть установлен в `infer`. Это должно быть включено либо в `profiles.yml`, либо в файл `dbt_project.yml`.                             |
| `url`       | Да          | Имя хоста сервера Infer, к которому нужно подключиться. Обычно это `https://app.getinfer.io`.                                                |
| `username`  | Да          | Ваше имя пользователя Infer - то, которое вы используете для входа.                                                                           |
| `apikey`    | Да          | Ваш API-ключ Infer.                                                                                                                          |
| `data_config` | Да        | Конфигурация для вашего основного хранилища данных. Формат этого следует формату конфигурации для вашего адаптера хранилища данных.          |


### Пример конфигурации Infer

Чтобы проиллюстрировать вышеописанные описания, вот пример того, как может выглядеть конфигурация `dbt-infer`. 
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

## Использование

Вам не нужно изменять что-либо в ваших существующих моделях DBT при переходе на использование SQL-inf – 
они будут работать так же, как и раньше – но теперь у вас есть возможность использовать команды SQL-inf 
в качестве нативных SQL-функций.

Infer поддерживает ряд команд SQL-inf, включая 
`PREDICT`, `EXPLAIN`, `CLUSTER`, `SIMILAR_TO`, `TOPICS`, `SENTIMENT`. 
Вы можете узнать больше о SQL-inf и поддерживаемых командах в [Справочном руководстве по SQL-inf](https://docs.getinfer.io/docs/category/commands).

Чтобы помочь вам начать, мы приведем краткий пример того, как может выглядеть такая модель. 
Вы можете найти другие более сложные примеры в [репозитории примеров dbt-infer](https://github.com/inferlabs/dbt-infer-examples).

В нашем простом примере мы покажем, как использовать предыдущую модель 'user_features' для предсказания оттока, 
предсказывая столбец `has_churned`.

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
Это связано с тем, что мы считаем, что `user_id` может и не должен влиять на наше предсказание оттока, поэтому мы его исключаем. 
Мы также используем соглашение о сборе входных данных для нашего предсказания в CTE, названном `predict_user_churn_input`.