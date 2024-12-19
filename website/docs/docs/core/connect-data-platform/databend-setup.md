---
title: "Настройка Databend Cloud"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Databend в dbt."
id: "databend-setup"
meta:
  maintained_by: Databend Cloud
  authors: Shanjie Han
  github_repo: 'databendcloud/dbt-databend'
  pypi_package: 'dbt-databend-cloud'
  min_core_version: 'v1.0.0'
  core_version: 'v1.0.0 и новее'
  cloud_support: Не поддерживается
  min_supported_version: 'n/a'
  platform_name: 'Databend Cloud'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Плагин с поддержкой поставщика

Некоторые [основные функции](https://github.com/databendcloud/dbt-databend#supported-features) могут быть ограничены. 
Если вы заинтересованы в внесении вклада, ознакомьтесь с репозиторием исходного кода, указанным ниже.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Databend Cloud с помощью **dbt-databend-cloud**

### Аутентификация пользователя / пароля

Настройте свой профиль dbt для использования Databend Cloud:

#### Профиль подключения Databend Cloud
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

#### Описание полей профиля

| Опция   | Описание                                          | Обязательно? | Пример             |
|----------|--------------------------------------------------|--------------|---------------------|
| type     | Конкретный адаптер для использования             | Обязательно   | `databend`              |
| host     | Хост (имя хоста) для подключения                | Обязательно   | `yourorg.datafusecloud.com`  |
| port     | Порт для использования                            | Обязательно   | `443`              |
| schema   | Укажите схему (базу данных) для создания моделей | Обязательно   | `default`         |
| user     | Имя пользователя для подключения к хосту        | Обязательно   | `dbt_admin`         |
| pass     | Пароль для аутентификации на хосте              | Обязательно   | `awesome_password`  |

## Привилегии пользователя базы данных

Ваш пользователь базы данных будет иметь возможность выполнять некоторые операции чтения или записи, такие как `SELECT`, `CREATE` и так далее.
Вы можете найти дополнительную информацию [здесь](https://docs.databend.com/using-databend-cloud/warehouses/connecting-a-warehouse) о управлении привилегиями в Databend Cloud.

| Обязательная привилегия     |
|-----------------------------|
| SELECT                      |
| CREATE                      |
| CREATE TEMPORARY TABLE      |
| CREATE VIEW                 |
| INSERT                      |
| DROP                        |
| SHOW DATABASE               |
| SHOW VIEW                   |
| SUPER                       |

## Поддерживаемые функции

 | ok |           Функция           |
|:--:|:---------------------------:|
|  ✅ |    Материализация таблиц    |
|  ✅ |    Материализация представлений     |
|  ✅ | Инкрементальная материализация |
|  ❌  |  Эфемерная материализация  |
|  ✅ |            Seeds            |
|  ✅ |           Sources           |
|  ✅ |      Пользовательские тесты данных      |
|  ✅ |        Генерация документации        |
|  ❌ |          Снимки          |
|  ✅ |      Повторное подключение       |

**Примечание:**

* Databend не поддерживает `Эфемерные` и `Снимки`. Вы можете найти более подробную информацию [здесь](https://github.com/datafuselabs/databend/issues/8685)