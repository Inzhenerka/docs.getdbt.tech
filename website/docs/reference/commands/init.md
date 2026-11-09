---
title: "О команде dbt init"
sidebar_label: "init"
id: "init"
---

`dbt init` поможет вам начать работу с dbt!

## Новый проект {#new-project}

Если вы используете этот инструмент впервые, он:
- попросит вас указать название проекта
- спросит, какой адаптер базы данных вы используете (см. [Поддерживаемые платформы данных](/docs/supported-data-platforms))
- запросит все сведения, необходимые dbt для подключения к этой базе данных, такие как `account`, `user`, `password` и другие

Затем он:
- Создаст новую папку с названием вашего проекта и примерами файлов, достаточными для начала работы с dbt
- Создаст профиль подключения на вашем локальном компьютере. Расположение по умолчанию — `~/.dbt/profiles.yml`. Подробнее читайте в разделе [Настройка профиля](/docs/local/profiles.yml).
- Создаст файл `.gitignore`, включающий `.env` (начиная с dbt v1.12), `target/`, `dbt_packages/` и `logs/`, чтобы локальные учётные данные и артефакты сборки по умолчанию не попадали в систему контроля версий.

При использовании `dbt init` для инициализации вашего проекта, включите флаг `--profile`, чтобы указать существующий `profiles.yml` в качестве ключа `profile:`, который будет использоваться вместо создания нового. Например, `dbt init --profile profile_name`.

Если профиль не существует в `profiles.yml` или команда выполняется внутри существующего проекта, команда вызовет ошибку.

## Параметры командной строки

`dbt init --help` включает как глобальные флаги (которые применяются ко всем командам dbt), так и небольшое количество параметров, специфичных для `init`. Наиболее часто используемые параметры `init`:

- `PROJECT_NAME` (необязательный позиционный аргумент): имя папки проекта, которую нужно создать. Если аргумент не указан, `dbt init` предложит вам ввести имя проекта.
- `--profile PROFILE_NAME`: использовать существующий профиль из файла `profiles.yml` вместо предложения создать или настроить профиль.
- `-s`, `--skip-profile-setup`: пропустить интерактивную настройку профиля.

```bash
dbt init [PROJECT_NAME] [--profile PROFILE_NAME] [--skip-profile-setup]
```

Глобальные параметры командной строки, которые также применяются к `dbt init`, описаны в разделе [Параметры командной строки](/reference/global-configs/command-line-options).

Если вы только что клонировали или загрузили существующий проект dbt, `dbt init` все равно может помочь вам настроить ваш профиль подключения, чтобы вы могли быстро начать работу. Он запросит информацию о подключении, как указано выше, и добавит профиль (используя имя `profile` из проекта) в ваш локальный `profiles.yml`, или создаст файл, если он еще не существует.

## profile_template.yml {#profile_templateyml}

`dbt init` знает, как запрашивать информацию о подключении, находя файл с именем `profile_template.yml`. Он будет искать этот файл в двух местах:

- **Плагин адаптера:** Какой минимальный профиль Postgres необходим? Какие типы данных у каждого поля, какие значения используются по умолчанию? Эта информация хранится в файле [`dbt/include/postgres/profile_template.yml`](https://github.com/dbt-labs/dbt-postgres/blob/main/dbt/include/postgres/profile_template.yml). Если вы являетесь мейнтейнером плагина адаптера, мы настоятельно рекомендуем добавить файл `profile_template.yml` и в ваш плагин. Подробнее см. руководство [Build, test, document, and promote adapters](/guides/adapter-creation).

- **Существующий проект:** Если вы являетесь сопровождающим существующего проекта и хотите помочь новым пользователям быстро и легко подключиться к вашей базе данных, вы можете включить свой собственный пользовательский `profile_template.yml` в корень вашего проекта, рядом с `dbt_project.yml`. Для общих атрибутов подключения установите значения в `fixed`; оставьте пользовательские атрибуты в `prompts`, но с пользовательскими подсказками и значениями по умолчанию, как вам нравится.

<File name='profile_template.yml'>

```yml
fixed:
  account: abc123
  authenticator: externalbrowser
  database: analytics
  role: transformer
  type: snowflake
  warehouse: transforming
prompts:
  target:
    type: string
    hint: your desired target name
  user:
    type: string
    hint: yourname@jaffleshop.com
  schema:
    type: string
    hint: usually dbt_<yourname>
  threads:
    hint: "your favorite number, 1-10"
    type: int
    default: 8
```

</File>

```
$ dbt init
Running with dbt=1.0.0
Setting up your profile.
user (yourname@jaffleshop.com): summerintern@jaffleshop.com
schema (usually dbt_<yourname>): dbt_summerintern
threads (your favorite number, 1-10) [8]: 6
Profile internal-snowflake written to /Users/intern/.dbt/profiles.yml using project's profile_template.yml and your supplied values. Run 'dbt debug' to validate the connection.
```