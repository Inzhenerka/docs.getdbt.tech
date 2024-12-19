---
title: "О команде dbt environment"
sidebar_label: "environment"
id: dbt-environment
---

Команда `dbt environment` позволяет вам взаимодействовать с вашей средой dbt Cloud. Используйте эту команду для:

- Просмотра деталей вашей локальной конфигурации (идентификатор учетной записи, идентификатор активного проекта, среда развертывания и многое другое).
- Просмотра деталей конфигурации вашей среды dbt Cloud (идентификатор среды, имя среды, тип подключения и многое другое).

Этот гид перечисляет все команды и параметры, которые вы можете использовать с `dbt environment` в [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). Чтобы использовать их, добавьте команду или параметр следующим образом: `dbt environment [command]` или используйте сокращение `dbt env [command]`.

### dbt environment show

Команда `show` &mdash; Для просмотра деталей вашей локальной конфигурации и конфигурации dbt Cloud. Чтобы выполнить команду с помощью dbt Cloud CLI, введите одну из следующих команд, включая сокращение:

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
  dbt Cloud CLI version          0.35.7
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

Обратите внимание, что dbt Cloud не вернет ничего, что является секретным ключом, и вернет 'NA' для любого поля, которое не настроено.

### Флаги dbt environment

Используйте следующие флаги (или параметры) с командой `dbt environment`:

- `-h`, `--help` &mdash; Для просмотра документации справки по конкретной команде в вашем интерфейсе командной строки.

  ```shell 
  dbt environment [command] --help
  dbt environment [command] -h
  ```

  Флаг `--help` возвращает следующую информацию:

  ```bash
    ❯ dbt help environment
    Взаимодействие с окружениями dbt

  Использование:
    dbt environment [command]

  Псевдонимы:
    environment, env

  Доступные команды:
    show        Показать рабочую среду

  Флаги:
    -h, --help   справка по environment

  Используйте "dbt environment [command] --help" для получения дополнительной информации о команде.
  ```

  Например, чтобы просмотреть документацию справки для команды `show`, введите одну из следующих команд, включая сокращение:

  ```shell
  dbt environment show --help
  dbt env show -h
  ```