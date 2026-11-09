---
title: "О команде dbt environment"
sidebar_label: "environment"
id: dbt-environment
availability: platform_login
---

:::info 
<Constant name="platform_cli" /> предоставляет команду `dbt environment` для просмотра сведений о среде и подключении. Если вы используете <Constant name="fusion" /> или <Constant name="core" />, используйте `dbt debug` для проверки профиля, целевой конфигурации и подключения &mdash; или используйте `dbtf debug`, если у вас установлены и <Constant name="core" />/<Constant name="fusion" />, и CLI платформы, а проверить нужно <Constant name="fusion" />.

:::

Команда `dbt environment` позволяет взаимодействовать с вашей средой <Constant name="dbt" />. Используйте эту команду для:

- Просмотра сведений о локальной конфигурации (идентификатор аккаунта, идентификатор активного проекта, среда развертывания и другие параметры).
- Просмотра сведений о конфигурации <Constant name="dbt" /> (идентификатор среды, имя среды, тип подключения и другие параметры).

В этом руководстве перечислены все команды и параметры, которые можно использовать с `dbt environment` в [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation). Чтобы использовать их, добавьте команду или параметр следующим образом: `dbt environment [command]` или воспользуйтесь сокращенной формой `dbt env [command]`.

### dbt environment show {#dbt-environment-show}

Команда `show` позволяет просмотреть сведения о локальной конфигурации и конфигурации <Constant name="dbt" />. Чтобы выполнить команду с помощью <Constant name="platform_cli" />, введите одну из следующих команд, включая сокращённый вариант:

```shell
dbt environment show
```
```shell
dbt env show
```

Команда возвращает следующую информацию:

```bash
❯ dbt env show
Local Configuration:
  Active account ID              185854
  Active project ID              271692
  Active host name               cloud.getdbt.com
  dbt_cloud.yml file path        /Users/cesar/.dbt/dbt_cloud.yml
  dbt_project.yml file path      /Users/cesar/git/cloud-cli-test-project/dbt_project.yml
  dbt CLI version          0.35.7
  OS info                        darwin arm64

Cloud Configuration:
  Account ID                     185854
  Project ID                     271692
  Project name                   Snowflake
  Environment ID                 243762
  Environment name               Development
  Defer environment ID           [N/A]
  dbt version                    1.6.0-latest
  Target name                    default
  Connection type                snowflake

Snowflake Connection Details:
  Account                        ska67070
  Warehouse                      DBT_TESTING_ALT
  Database                       DBT_TEST
  Schema                         CLOUD_CLI_TESTING
  Role                           SYSADMIN
  User                           dbt_cloud_user
  Client session keep alive      false 
```

Обратите внимание: <Constant name="dbt" /> не выводит секретные ключи и возвращает 'NA' для любого поля, которое не настроено.

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

Например, чтобы просмотреть справочную документацию по команде `show`, введите одну из следующих команд, в том числе с использованием сокращённой формы:

  ```shell
  dbt environment show --help
  dbt env show -h
  ```