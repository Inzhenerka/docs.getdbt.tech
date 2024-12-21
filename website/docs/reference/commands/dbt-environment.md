---
title: "О команде dbt environment"
sidebar_label: "environment"
id: dbt-environment
---

Команда `dbt environment` позволяет взаимодействовать с вашей средой dbt Cloud. Используйте эту команду для:

- Просмотра деталей вашей локальной конфигурации (ID аккаунта, ID активного проекта, среда развертывания и многое другое).
- Просмотра деталей конфигурации dbt Cloud (ID среды, имя среды, тип подключения и многое другое).

Это руководство перечисляет все команды и опции, которые вы можете использовать с `dbt environment` в [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). Чтобы использовать их, добавьте команду или опцию следующим образом: `dbt environment [command]` или используйте сокращение `dbt env [command]`.

### dbt environment show

Команда `show` &mdash; для просмотра деталей вашей локальной и dbt Cloud конфигурации. Чтобы выполнить команду с помощью dbt Cloud CLI, введите одну из следующих команд, включая сокращение:

```shell
dbt environment show
```
```shell
dbt env show
```

Команда возвращает следующую информацию:

```bash
❯ dbt env show
Локальная конфигурация:
  ID активного аккаунта          185854
  ID активного проекта           271692
  Имя активного хоста            cloud.getdbt.com
  Путь к файлу dbt_cloud.yml     /Users/cesar/.dbt/dbt_cloud.yml
  Путь к файлу dbt_project.yml   /Users/cesar/git/cloud-cli-test-project/dbt_project.yml
  Версия dbt Cloud CLI           0.35.7
  Информация об ОС               darwin arm64

Конфигурация Cloud:
  ID аккаунта                    185854
  ID проекта                     271692
  Имя проекта                    Snowflake
  ID среды                       243762
  Имя среды                      Development
  ID отложенной среды            [N/A]
  Версия dbt                     1.6.0-latest
  Имя цели                       default
  Тип подключения                snowflake

Детали подключения Snowflake:
  Аккаунт                        ska67070
  Склад                          DBT_TESTING_ALT
  База данных                    DBT_TEST
  Схема                          CLOUD_CLI_TESTING
  Роль                           SYSADMIN
  Пользователь                   dbt_cloud_user
  Поддержка сессии клиента       false 
```

Обратите внимание, что dbt Cloud не вернет ничего, что является секретным ключом, и вернет 'NA' для любого поля, которое не настроено.

### Флаги dbt environment

Используйте следующие флаги (или опции) с командой `dbt environment`:

- `-h`, `--help` &mdash; для просмотра документации по помощи для конкретной команды в вашем интерфейсе командной строки.

  ```shell 
  dbt environment [command] --help
  dbt environment [command] -h
  ```

  Флаг `--help` возвращает следующую информацию:

  ```bash
    ❯ dbt help environment
    Взаимодействие со средами dbt

  Использование:
    dbt environment [command]

  Псевдонимы:
    environment, env

  Доступные команды:
    show        Показать рабочую среду

  Флаги:
    -h, --help   помощь для environment

  Используйте "dbt environment [command] --help" для получения дополнительной информации о команде.
  ```

  Например, чтобы просмотреть документацию по помощи для команды `show`, введите одну из следующих команд, включая сокращение:

  ```shell
  dbt environment show --help
  dbt env show -h
  ```