---
title: "О команде dbt environment"
sidebar_label: "environment"
id: dbt-environment
---

Команда `dbt environment` позволяет взаимодействовать с вашей средой <Constant name="cloud" />. Используйте эту команду для:

- Просмотра сведений о вашей локальной конфигурации (ID аккаунта, ID активного проекта, среда деплоя и другие параметры).
- Просмотра сведений о конфигурации <Constant name="cloud" /> (ID среды, имя среды, тип подключения и другие параметры).

В этом руководстве перечислены все команды и опции, которые можно использовать с `dbt environment` в [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation). Чтобы воспользоваться ими, добавьте команду или опцию в таком виде: `dbt environment [command]` или используйте сокращённый вариант `dbt env [command]`.

### dbt environment show {#dbt-environment-show}

Команда `show` — предназначена для просмотра сведений о вашей локальной конфигурации и конфигурации <Constant name="cloud" />. Чтобы выполнить команду с помощью <Constant name="cloud_cli" />, введите одну из следующих команд, включая сокращённый вариант:

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
```
Active account ID              185854
Active project ID              271692
Active host name               cloud.getdbt.com
dbt_cloud.yml file path        /Users/cesar/.dbt/dbt_cloud.yml
dbt_project.yml file path      /Users/cesar/git/cloud-cli-test-project/dbt_project.yml
<Constant name="cloud" /> CLI version          0.35.7
OS info                        darwin arm64
```

> Примечание: значения, имена файлов, пути, версии и другие технические идентификаторы приведены без изменений, так как они относятся к конфигурации и выводу CLI.

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

Обратите внимание, что `<Constant name="cloud" />` не вернёт никаких значений, являющихся секретными ключами, и вернёт `'NA'` для любого поля, которое не настроено.

### Флаги dbt environment {#dbt-environment-flags}

Используйте следующие флаги (или опции) с командой `dbt environment`:

- `-h`, `--help` &mdash; для просмотра документации по помощи для конкретной команды в вашем интерфейсе командной строки.

  ```shell 
  dbt environment [command] --help
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