---
title: "Настройка Databend Cloud"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Databend в dbt."
id: "databend-setup"
meta:
  maintained_by: Databend Cloud
  authors: Shanjie Han
  github_repo: 'databendcloud/dbt-databend'
  pypi_package: 'dbt-databend-cloud'
  min_core_version: 'v1.0.0'
  core_version: 'v1.0.0 и новее'
  cloud_support: Не поддерживается
  min_supported_version: 'н/д'
  platform_name: 'Databend Cloud'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Плагин, поддерживаемый поставщиком

Некоторая [основная функциональность](https://github.com/databendcloud/dbt-databend#supported-features) может быть ограничена.
Если вы заинтересованы в участии, ознакомьтесь с репозиторием исходного кода, указанным ниже.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Databend Cloud с помощью **dbt-databend-cloud** {#connecting-to-databend-cloud-with-dbt-databend-cloud}

### Аутентификация с использованием имени пользователя и пароля {#user-password-authentication}

Настройте ваш профиль dbt для использования Databend Cloud:

#### Профиль подключения к Databend Cloud {#databend-cloud-connection-profile}
<File name='profiles.yml'>

```yaml
dbt-databend-cloud:
  target: dev
  outputs:
    dev:
      type: databend
      host: databend-cloud-host
      port: 443
      schema: database_name
      user: username
      pass: password
```

</File>

#### Описание полей профиля {#description-of-profile-fields}

| Опция   | Описание                                              | Обязательно? | Пример             |
|---------|-------------------------------------------------------|--------------|--------------------|
| type    | Конкретный адаптер для использования                  | Обязательно  | `databend`         |
| host    | Хост (имя хоста) для подключения                      | Обязательно  | `yourorg.datafusecloud.com` |
| port    | Порт для использования                                | Обязательно  | `443`              |
| schema  | Укажите схему (базу данных) для построения моделей    | Обязательно  | `default`          |
| user    | Имя пользователя для подключения к хосту              | Обязательно  | `dbt_admin`        |
| pass    | Пароль для аутентификации на хосте                    | Обязательно  | `awesome_password` |

## Привилегии пользователя базы данных {#database-user-privileges}

Ваш пользователь базы данных должен иметь некоторые возможности для чтения или записи, такие как `SELECT`, `CREATE` и так далее.
Вы можете найти помощь [здесь](https://docs.databend.com/using-databend-cloud/warehouses/connecting-a-warehouse) с управлением привилегиями в Databend Cloud.

| Необходимая привилегия     |
|----------------------------|
| SELECT                     |
| CREATE                     |
| CREATE TEMPORARY TABLE     |
| CREATE VIEW                |
| INSERT                     |
| DROP                       |
| SHOW DATABASE              |
| SHOW VIEW                  |
| SUPER                      |

## Поддерживаемые функции {#supported-features}

| ok |           Функция           |
|:--:|:---------------------------:|
|  ✅ |    Материализация таблиц   |
|  ✅ |    Материализация представлений |
|  ✅ | Инкрементальная материализация |
|  ❌  |  Эфемерная материализация  |
|  ✅ |            Seeds            |
|  ✅ |           Источники         |
|  ✅ |      Пользовательские тесты данных      |
|  ✅ |        Генерация документации        |
|  ❌ |          Снимки          |
|  ✅ |      Повторное подключение       |

**Примечание:**

* Databend не поддерживает `Ephemeral` и `SnapShot`. Более подробную информацию можно найти [здесь](https://github.com/datafuselabs/databend/issues/8685)