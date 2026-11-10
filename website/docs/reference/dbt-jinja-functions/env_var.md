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

### Использование файла `.env` {#using-the-env-file}

При локальном запуске dbt через [CLI](/docs/local/install-dbt), расширение для VS Code или в версии dbt v1.12 переменные автоматически загружаются из файла `.env` в текущем рабочем каталоге. Переменные окружения оболочки имеют приоритет над значениями в файле.

Создайте файл `.env`, обычно в корне проекта dbt, и задайте переменные в формате `KEY=value`. Например:

<File name='.env'>

```bash
DBT_USER=user
DBT_PASSWORD=password
DBT_SCHEMA=dbt_schema
```

</File>

Сошлитесь на них в `profiles.yml` через `env_var()`:

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

### Преобразование переменных окружения {#converting-env_vars}

Значения переменных окружения всегда являются строками. Для параметров, которые ожидают целые числа или логические значения, тип нужно преобразовать явно.

Для преобразования используйте фильтр Jinja:

- **Целые числа** &mdash; преобразуйте строку через `int` или [`as_number`](/reference/dbt-jinja-functions/as_number), чтобы избежать ошибок вида `'1' is not of type 'integer'`. Например, `"{{ env_var('DBT_THREADS') | int }}"` или `"{{ env_var('DB_PORT') | as_number }}"`.

- **Логические значения** &mdash; явно преобразуйте строку фильтром [`as_bool`](/reference/dbt-jinja-functions/as_bool). Например, `"{{ env_var('DBT_PERSIST_DOCS_RELATION', False) | as_bool }}"`.

В качестве логических значений по умолчанию используйте `True` или `False` с заглавной буквы. Варианты `true` и `false` будут обработаны как строки и могут дать неожиданный результат.

Например, чтобы отключить [`persist_docs`](/reference/resource-configs/persist_docs) через переменные окружения:

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
