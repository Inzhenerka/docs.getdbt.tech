---
title: "Настройка TiDB"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища TiDB в dbt."
id: "tidb-setup"
meta:
  maintained_by: PingCAP
  authors: Xiang Zhang, Qiang Wu, Yuhang Shi
  github_repo: 'pingcap/dbt-tidb'
  pypi_package: 'dbt-tidb'
  min_core_version: 'v1.0.0'
  core_version: 'v1.0.0 и новее'
  cloud_support: Не поддерживается
  min_supported_version: 'n/a'
  slack_channel_name: '#db-tidb'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03CC86R1NY'
  platform_name: 'TiDB'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Плагин с поддержкой поставщика

Некоторые [основные функции](https://github.com/pingcap/dbt-tidb/blob/main/README.md#supported-features) могут быть ограничены. 
Если вы заинтересованы в внесении вклада, ознакомьтесь с репозиторием исходного кода, указанным ниже.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

## Подключение к TiDB с помощью **dbt-tidb**

### Аутентификация пользователя / пароля

Настройте свой профиль dbt для использования TiDB:

#### Профиль подключения TiDB
<File name='profiles.yml'>

```yaml
dbt-tidb:
  target: dev
  outputs:
    dev:
      type: tidb
      server: 127.0.0.1
      port: 4000
      schema: database_name
      username: tidb_username
      password: tidb_password

      # необязательно
      retries: 3 # по умолчанию 1
```

</File>

#### Описание полей профиля

| Опция    | Описание                                           | Обязательно? | Пример              |
|----------|---------------------------------------------------|--------------|---------------------|
| type     | Конкретный адаптер для использования               | Обязательно  | `tidb`              |
| server   | Сервер (имя хоста), к которому нужно подключиться | Обязательно  | `yourorg.tidb.com`  |
| port     | Порт для использования                             | Обязательно  | `4000`              |
| schema   | Укажите схему (базу данных), в которую будут создаваться модели | Обязательно  | `analytics`         |
| username | Имя пользователя для подключения к серверу        | Обязательно  | `dbt_admin`         |
| password | Пароль для аутентификации на сервере             | Обязательно  | `awesome_password`  |
| retries  | Количество попыток после неудачного подключения   | Необязательно | `по умолчанию 1`    |

## Привилегии пользователя базы данных

Ваш пользователь базы данных должен иметь возможность выполнять некоторые операции чтения или записи, такие как `SELECT`, `CREATE` и так далее. 
Вы можете найти дополнительную информацию [здесь](https://docs.pingcap.com/tidb/v4.0/privilege-management) о управлении привилегиями в TiDB.

| Обязательное привилегия     |
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

| TiDB 4.X | TiDB 5.0 ~ 5.2 | TiDB >= 5.3 |           Функция           |
|:--------:|:--------------:|:-----------:|:---------------------------:|
|    ✅     |       ✅        |      ✅      |    Материализация таблиц    |
|    ✅     |       ✅        |      ✅      |    Материализация представлений     |
|    ❌     |       ❌        |      ✅      | Инкрементальная материализация |
|    ❌     |       ✅        |      ✅      |  Эфемерная материализация  |
|    ✅     |       ✅        |      ✅      |            Seeds            |
|    ✅     |       ✅        |      ✅      |           Sources           |
|    ✅     |       ✅        |      ✅      |      Пользовательские тесты данных      |
|    ✅     |       ✅        |      ✅      |        Генерация документации        |
|    ❌     |       ❌        |      ✅      |          Снимки          |
|    ✅     |       ✅        |      ✅      |            Grant            |
|    ✅     |       ✅        |      ✅      |      Повторное подключение       |

**Примечание:**

* TiDB 4.0 ~ 5.0 не поддерживает [CTE](https://docs.pingcap.com/tidb/dev/sql-statement-with),
  вам следует избегать использования `WITH` в вашем SQL-коде.
* TiDB 4.0 ~ 5.2 не поддерживает создание [временной таблицы или представления](https://docs.pingcap.com/tidb/v5.2/sql-statement-create-table#:~:text=sec\)-,MySQL%20compatibility,-TiDB%20does%20not).
* TiDB 4.X не поддерживает использование SQL-функций в `CREATE VIEW`, избегайте этого в вашем SQL-коде.
  Вы можете найти больше деталей [здесь](https://github.com/pingcap/tidb/pull/27252).