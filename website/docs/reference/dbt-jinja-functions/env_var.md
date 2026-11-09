---
title: "О функции env_var"
sidebar_label: "env_var"
id: "env_var"
description: "Используйте переменные окружения с помощью функции `env_var`."
---

import Envvarsecrets from '/snippets/_env-var-secrets.md';
import EnvFileConsiderations from '/snippets/_env-file-considerations.md';

<Envvarsecrets />

Если переменные окружения `DBT_USER` и `DBT_ENV_SECRET_PASSWORD` заданы на момент запуска dbt, dbt будет использовать их в конфигурации подключения &mdash; например, в `profiles.yml` при локальном запуске или в [профилях подключения](/docs/platform/about-profiles), если у вас есть проект в <Constant name="dbt_platform" />. Если ваш проект ссылается на переменные окружения, которые не заданы, dbt выдаст ошибку компиляции.


<VersionBlock firstVersion="1.12">

### Using the `.env` file

When running dbt locally (the [dbt CLI](/docs/local/install-dbt), dbt VS Code extension, and dbt v1.12), dbt automatically loads environment variables from a `.env` file in your current working directory (where you run the dbt command). Shell environment variables take precedence over values in `.env` and will not be overridden by the file.

Create a `.env` file (typically at the root of your dbt project) and define variables using `KEY=value` syntax. For example:

<File name='.env'>

```bash
DBT_USER=user
DBT_PASSWORD=password
DBT_SCHEMA=dbt_schema
```

</File>

Reference them in your `profiles.yml` using `env_var()`:

<File name='~/.dbt/profiles.yml'>

```yaml
my_profile:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASSWORD') }}"
      schema: "{{ env_var('DBT_SCHEMA') }}"
      port: 5432
      threads: 4
```

</File>

<EnvFileConsiderations />

</VersionBlock>

### Converting env_vars

Environment variables are always strings. When using them for configurations that expect integers or booleans, you must explicitly convert the value to the correct type.

Use a Jinja filter to convert the string to the correct type:

- **Integers** &mdash; Convert the string to a number using the `int` or [`as_number`](/reference/dbt-jinja-functions/as_number) filter to avoid errors like `'1' is not of type 'integer'`. For example, `"{{ env_var('DBT_THREADS') | int }}"` or `"{{ env_var('DB_PORT') | as_number }}"`.

- **Booleans** &mdash; Convert the string to a boolean explicitly using the [`as_bool`](/reference/dbt-jinja-functions/as_bool) filter. For example, `"{{ env_var('DBT_PERSIST_DOCS_RELATION', False) | as_bool }}"`.

For boolean defaults, use capitalized `True` or `False`. Using lowercase `true` or `false` will be treated as a string and can result in unexpected results.

For example, to disable [`persist_docs`](/reference/resource-configs/persist_docs) using environment variables:

<File name='dbt_project.yml'>

```yml
+persist_docs:
  relation: "{{ env_var('DBT_PERSIST_DOCS_RELATION', False) | as_bool }}"
  columns: "{{ env_var('DBT_PERSIST_DOCS_COLUMNS', False) | as_bool }}"
```
</File>

:::caution Кавычки, фигурные скобки и вы

Обязательно заключайте всю строку Jinja в кавычки. Иначе фигурные скобки Jinja приведут к ошибке при разборе YAML.

:::

### Значения по умолчанию

Вы также можете указать значение по умолчанию в качестве второго аргумента:

<File name='dbt_project.yml'>

```yaml
...
models:
  jaffle_shop:
    +materialized: "{{ env_var('DBT_MATERIALIZATION', 'view') }}"
```

</File>

Это может быть полезно для избежания ошибок компиляции, когда переменная окружения недоступна.

### Секреты {#secrets}

Для определенных конфигураций вы можете использовать "секретные" переменные окружения. Любая переменная окружения с префиксом `DBT_ENV_SECRET` будет:
- Доступна для использования в `profiles.yml` + `packages.yml` через ту же функцию `env_var()`
- Запрещена везде, включая `dbt_project.yml` и SQL моделей, чтобы предотвратить случайную запись этих секретных значений в <Term id="data-warehouse" /> или метаданные артефактов
- Удалена из логов dbt и заменена на `*****`, всякий раз, когда ее значение появляется в этих логах (даже если переменная окружения не была вызвана напрямую)

Основной случай использования секретных переменных окружения — это токены доступа git для [частных пакетов](/docs/build/packages#private-packages).

**Примечание:** Когда dbt загружает учетные данные профиля и конфигурацию пакета, секретные переменные окружения будут заменены строковым значением переменной окружения. Вы не можете изменять секреты с помощью фильтров Jinja, включая фильтры приведения типов, такие как [`as_number`](/reference/dbt-jinja-functions/as_number) или [`as_bool`](/reference/dbt-jinja-functions/as_bool), или передавать их в качестве аргументов в другие макросы Jinja. Вы можете использовать _один секрет_ на конфигурацию:
```yml
# работает
host: "{{ env_var('DBT_ENV_SECRET_HOST') }}"

# не работает
host: "www.{{ env_var('DBT_ENV_SECRET_HOST_DOMAIN') }}.com/{{ env_var('DBT_ENV_SECRET_HOST_PATH') }}"
```

### Пользовательские метаданные {#custom-metadata}

Любая переменная окружения с префиксом `DBT_ENV_CUSTOM_ENV_` будет включена в двух местах, с именем без префикса в качестве ключа:
- [Артефакты dbt](/reference/artifacts/dbt-artifacts#common-metadata): `metadata` -> `env`
- [События и структурированные логи](/reference/events-logging#structured-logging): `info` -> `extra`

Словарь этих переменных окружения с префиксом также будет доступен в контекстной переменной `dbt_metadata_envs`:
```sql
-- {{ dbt_metadata_envs }}

select 1 as id
```
```shell
$ DBT_ENV_CUSTOM_ENV_MY_FAVORITE_COLOR=indigo DBT_ENV_CUSTOM_ENV_MY_FAVORITE_NUMBER=6 dbt compile
```
Компилируется в:
```sql
-- {'MY_FAVORITE_COLOR': 'indigo', 'MY_FAVORITE_NUMBER': '6'}

select 1 as id
```

### Использование платформы dbt {#dbt-platform-usage}

Если вы используете <Constant name="dbt_platform" />, переменные окружения должны:
- Иметь префикс `DBT_` (в том числе `DBT_ENV_CUSTOM_ENV_` или `DBT_ENV_SECRET`)
- Быть записаны в верхнем регистре
- Учитывать регистр символов

При обращении к `{{env_var('DBT_KEY')}}` в коде вашего проекта ключ должен в точности совпадать с именем переменной, заданным в пользовательском интерфейсе <Constant name="dbt_platform" />.

Если вы используете dbt Cloud, вы должны соблюдать соглашения о наименовании переменных окружения. Переменные окружения в dbt Cloud должны иметь префикс `DBT_` (включая `DBT_ENV_CUSTOM_ENV_` или `DBT_ENV_SECRET`). Ключи переменных окружения пишутся заглавными буквами и чувствительны к регистру. При обращении к `{{env_var('DBT_KEY')}}` в коде вашего проекта ключ должен точно соответствовать переменной, определенной в интерфейсе dbt Cloud.
