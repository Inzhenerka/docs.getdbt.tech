---
title: Настройка переменных окружения
id: configure-environment-variables
description: "Настройка переменных окружения"
sidebar_label: "Переменные окружения"
pagination_next: "docs/local/profiles.yml"
pagination_prev: "docs/local/install-dbt"
availability:
  surface: local
---

<Constant name="fusion"/> автоматически загружает переменные окружения из файла `.env` в текущем рабочем каталоге (папке, в которую вы переходите с помощью `cd` и из которой запускаете команды dbt в терминале). Это помогает управлять учетными данными и настройками, не прописывая их значения напрямую в `profiles.yml` и не раскрывая их в истории команд оболочки.

## Использование файла `.env`

1. Создайте файл `.env` в текущем рабочем каталоге (обычно в корне проекта dbt):
   ```env
   DBT_MY_DATABASE=my_database
   DBT_MY_SCHEMA=my_schema
   DBT_SECRET_KEY=my_secret_value
   ```

2. Используйте эти переменные в `profiles.yml` с помощью [функции Jinja `env_var`](/reference/dbt-jinja-functions/env_var):
   ```yaml
   my_profile:
     target: dev
     outputs:
       dev:
         type: snowflake
         account: my_account
         database: "{{ env_var('DBT_MY_DATABASE') }}"
         schema: "{{ env_var('DBT_MY_SCHEMA') }}"
   ```

3. Запускайте команды dbt как обычно. <Constant name="fusion"/> автоматически загрузит переменные из файла `.env`. Например, при запуске `dbtf debug` будут показаны параметры подключения со значениями из `.env`:
   ```shell
   dbtf debug
   ...
   Debugging connection:
   "authenticator": "my_authenticator",
   "account": "my_account",
   "user": "my_user",
   "database": "my_database",        # Загружено из DBT_MY_DATABASE в .env
   "schema": "my_schema",            # Загружено из DBT_MY_SCHEMA в .env
   ```

:::note
Рекомендуем размещать файл `.env` в корне проекта и запускать команды dbt из этого каталога, поскольку файл загружается _только_ из текущего рабочего каталога. При его загрузке не учитываются флаг `--project-dir` и переменная окружения <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock>, а dbt не будет искать файл в корне проекта, если вы запускаете команды из другого каталога.
:::

### Порядок приоритета

Если одна и та же переменная окружения определена в нескольких местах, <Constant name="fusion"/> использует следующий порядок приоритета (от высшего к низшему):

1. Окружение оболочки &mdash; переменные, заданные непосредственно в оболочке (например, `export DBT_MY_VAR=value`)
2. Файл `.env` &mdash; переменные, определенные в файле `.env` в текущем рабочем каталоге

Это означает, что переменные окружения, заданные в оболочке, всегда переопределяют значения из файла `.env`.

:::tip
Добавьте `.env` в файл `.gitignore`, чтобы конфиденциальные учетные данные не попали в систему контроля версий. Команда `dbtf init` автоматически добавляет `.env` в создаваемый файл `.gitignore`.
:::

Подробнее об управлении переменными окружения в локальной среде см. в разделе [Настройка локальной среды](/docs/configure-dbt-extension#set-environment-variables-locally).
