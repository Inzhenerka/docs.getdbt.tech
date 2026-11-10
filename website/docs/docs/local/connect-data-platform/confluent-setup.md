---
title: "Подключение Confluent Cloud к dbt v1"
sidebar_label: "Confluent Cloud"
id: "confluent-setup"
description: "Настройте dbt v1 для работы с Confluent Cloud for Apache Flink с помощью адаптера dbt-confluent."
meta:
  maintained_by: Confluent
  authors: "Confluent"
  github_repo: "confluentinc/dbt-confluent"
  pypi_package: "dbt-confluent"
  min_core_version: "v1.11.0"
  cloud_support: Not Supported
  min_supported_version: "n/a"
  platform_name: "Confluent Cloud"
  config_page: "/reference/resource-configs/confluent-configs"
availability: local_free
---

:::info Плагин сообщества

Некоторые возможности могут быть ограничены. Чтобы внести свой вклад в разработку, обратитесь к репозиторию исходного кода ниже.
:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Confluent Cloud с помощью dbt-confluent

Используйте адаптер `dbt-confluent` для подключения к [Confluent Cloud for Apache Flink](https://docs.confluent.io/cloud/current/flink/overview.html) — полностью управляемому сервису обработки потоковых данных. Адаптер [развёртывает модели dbt в виде SQL-операторов Flink](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/deploy-flink-dbt.html), которые непрерывно выполняются в Confluent Cloud.

### Предварительные требования

- Учётная запись [Confluent Cloud](https://confluent.cloud/)
- [Вычислительный пул Flink](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/compute-pools.html) в вашей среде
- [Ключ API Flink](https://docs.confluent.io/cloud/current/flink/authenticate/authenticate-api-keys.html) для сервисной учётной записи с соответствующими [разрешениями RBAC](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/flink-rbac.html)
- Python 3.10 или более поздней версии

### Установка

Установите `dbt-confluent` из PyPI:

```bash
pip install dbt-confluent
```

### Настройка профиля

Добавьте следующую конфигурацию в файл `profiles.yml`, чтобы определить целевые среды Confluent Cloud.

<File name='~/.dbt/profiles.yml'>

```yaml
my_confluent_project:
  target: dev
  outputs:
    dev:
      type: confluent
      cloud_provider: aws
      cloud_region: us-east-1
      organization_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      compute_pool_id: lfcp-xxxxx
      environment_id: env-xxxxx
      dbname: my_kafka_cluster
      flink_api_key: "{{ env_var('CONFLUENT_FLINK_API_KEY') }}"
      flink_api_secret: "{{ env_var('CONFLUENT_FLINK_API_SECRET') }}"
      threads: 1
```

</File>

#### Описание полей профиля

| Поле | Обязательное | Описание |
|---|---|---|
| `type` | Да | Должно иметь значение `confluent`. |
| `cloud_provider` | Да | Облачный провайдер вашей среды Confluent Cloud (`aws`, `azure` или `gcp`). |
| `cloud_region` | Да | Облачный регион вашей среды (например, `us-east-1`, `us-west-2`). |
| `organization_id` | Да | Идентификатор вашей организации Confluent Cloud (в формате UUID). Его можно найти в консоли Confluent Cloud в разделе **Settings**. |
| `compute_pool_id` | Да | Идентификатор вычислительного пула Flink для выполнения операторов (например, `lfcp-xxxxx`). |
| `environment_id` | Да | Идентификатор среды Confluent Cloud (например, `env-xxxxx`). Соответствует каталогу Flink SQL. |
| `dbname` | Да | Имя кластера Kafka в среде. Соответствует базе данных Flink SQL. |
| `flink_api_key` | Да | Ключ API Flink для аутентификации в Confluent Cloud. Используйте `env_var`, чтобы не хранить секреты в открытом виде. |
| `flink_api_secret` | Да | Соответствующий секрет API Flink. Используйте `env_var`, чтобы не хранить секреты в открытом виде. |
| `execution_mode` | Нет | Задаёт режим выполнения операторов по умолчанию. Допустимые значения: `streaming_query` (по умолчанию), `streaming_ddl`, `snapshot`, `snapshot_ddl`. |
| `statement_name_prefix` | Нет | Добавляет префикс к имени каждого оператора Flink. По умолчанию: `dbt-`. |
| `statement_label` | Нет | Применяет метку ко всем операторам Flink, чтобы их можно было фильтровать в консоли Confluent Cloud. По умолчанию: `dbt-confluent`. |
| `threads` | Нет | Задаёт количество моделей, которые dbt выполняет одновременно. По умолчанию: `1`. |

### Основные понятия Confluent Cloud

В Confluent Cloud for Apache Flink понятия dbt соответствуют понятиям Flink SQL следующим образом:

| Понятие dbt | Понятие Confluent Cloud / Flink SQL |
|---|---|
| `database` (через `environment_id`) | Каталог Flink SQL (среда Confluent Cloud) |
| `schema` (через `dbname`) | База данных Flink SQL (кластер Kafka) |
| `model` | SQL-оператор Flink |
| `table` | Топик Kafka со схемой |

### Переменные окружения

Используйте переменные окружения для настройки профиля, особенно в конвейерах CI/CD:

```bash
export CONFLUENT_FLINK_API_KEY=your-api-key
export CONFLUENT_FLINK_API_SECRET=your-api-secret
```

Затем ссылайтесь на них в `profiles.yml` с помощью функции Jinja `env_var`:

```yaml
flink_api_key: "{{ env_var('CONFLUENT_FLINK_API_KEY') }}"
flink_api_secret: "{{ env_var('CONFLUENT_FLINK_API_SECRET') }}"
```
