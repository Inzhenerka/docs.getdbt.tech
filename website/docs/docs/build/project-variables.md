---
title: "Переменные проекта"
description: "Используйте переменные проекта dbt для настройки условной или повторно используемой логики в моделях и других ресурсах."
id: "project-variables"
pagination_next: "docs/build/environment-variables"
availability: all_users
---

dbt предоставляет механизм [переменных](/reference/dbt-jinja-functions/var) для передачи данных в модели при компиляции. Переменные позволяют задавать настраиваемые значения для проекта вместо того, чтобы жёстко прописывать их в SQL.

<VersionBlock lastVersion="1.11">

Переменные можно определить двумя способами:

- В файле [`dbt_project.yml`](/reference/dbt_project.yml)
- В командной строке

Переменные, определённые в `dbt_project.yml`, служат значениями по умолчанию для всего проекта. Эти значения применяются везде, где есть обращение к переменной. Их можно переопределить при запуске с помощью аргумента командной строки `--vars`. Это удобно, когда нужно изменить значение для конкретного запуска. Например, при тестировании с другим диапазоном дат или запуске моделей с настройками, зависящими от окружения.

</VersionBlock>

<VersionBlock firstVersion="1.12">

Переменные можно определить тремя способами:

- В файле `vars.yml` (рекомендуется для проектов с несколькими переменными или когда нужно обращаться к переменным из [`dbt_project.yml`](/reference/dbt_project.yml))
- В файле `dbt_project.yml`
- В командной строке

Переменные, определённые в `vars.yml` или `dbt_project.yml`, служат значениями по умолчанию для всего проекта. Эти значения применяются везде, где есть обращение к переменной. Их можно переопределить при запуске с помощью аргумента командной строки `--vars`. Это удобно, когда нужно изменить значение для конкретного запуска. Например, при тестировании с другим диапазоном дат или запуске моделей с настройками, зависящими от окружения.

</VersionBlock>

Переменные можно использовать, чтобы [настраивать часовые пояса](https://github.com/dbt-labs/snowplow/blob/0.3.9/dbt_project.yml#L22), задавать диапазоны дат для отчётности, [избегать жёстко заданных имён таблиц](https://github.com/dbt-labs/quickbooks/blob/v0.1.0/dbt_project.yml#L23) или иным образом управлять компиляцией моделей.

Чтобы использовать переменную в модели, хуке или макросе, используйте функцию `{{ var('...') }}`. Функция `var()` получает значение, определённое в проекте или переданное с помощью `--vars`. Подробнее см. в разделе [О функции var](/reference/dbt-jinja-functions/var).

Обратите внимание: см. раздел [YAML tips](/docs/build/dbt-tips#yaml-tips), чтобы узнать больше о работе с YAML.

<VersionBlock firstVersion="1.12">

### Defining variables in `vars.yml`

`vars.yml` is a dedicated file for project variables located at the project root. Because dbt parses it _before_ `dbt_project.yml`, variables from `vars.yml` are available when `dbt_project.yml` is evaluated, so you can reference them in `dbt_project.yml` using `{{ var('...') }}`. For more information, refer to [Using vars.yml variables in dbt_project.yml](#using-varsyml-variables-in-dbt_projectyml).

To define variables in a `vars.yml` file, add a `vars` config. You can scope these variables globally, or to a specific package imported in your project. The following example shows variables in a `vars.yml` file:

<File name='vars.yml'>

```yaml
vars:
  # The `start_date` variable is accessible to all resources
  start_date: '2016-06-01'
  
  # The `platforms` variable is only accessible to resources in the my_dbt_project project
  my_dbt_project:
    platforms: ['web', 'mobile']
  
  # The `app_ids` variable is only accessible to resources in the snowplow package
  snowplow:
    app_ids: ['marketing', 'app', 'landing-page']
```

</File>

You cannot define variables in both `vars.yml` and `dbt_project.yml`. If both files contain a `vars` block with definitions, dbt raises an error.

If `vars.yml` is empty or doesn't exist, variables defined in `dbt_project.yml` are used instead. 

#### Using `vars.yml` variables in `dbt_project.yml`

Because `vars.yml` is parsed before `dbt_project.yml`, you can reference variables from `vars.yml` within `dbt_project.yml` using `{{ var('...') }}`. Variables referenced in `dbt_project.yml` are resolved only from `vars.yml` or the `--vars` command-line argument, not from the `vars` block in `dbt_project.yml` itself. If `dbt_project.yml` references a variable that is defined only in its own `vars` block, dbt raises an error.

For example, you have the following variables defined in `vars.yml`:

<File name='vars.yml'>

```yaml
vars:
  schema_name: analytics
  materialization: table
```

</File>

You can reference them in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
models:
  my_dbt_project:
    +schema: "{{ var('schema_name') }}"
    +materialized: "{{ var('materialization') }}"
```

</File>

</VersionBlock>

### Defining variables in `dbt_project.yml`

:::info

Jinja не поддерживается в конфигурации `vars`, и все значения будут интерпретироваться буквально.

:::

Чтобы определить переменные в проекте dbt, добавьте конфигурацию `vars` в файл `dbt_project.yml`.
Область действия этих переменных `vars` может быть глобальной или ограничиваться конкретным пакетом, импортированным в ваш
проект.

<File name='dbt_project.yml'>

```yaml
name: my_dbt_project
version: 1.0.0

config-version: 2

vars:
  # Переменная `start_date` будет доступна во всех ресурсах
  start_date: '2016-06-01'

  # Переменная `platforms` доступна только для ресурсов в проекте my_dbt_project
  my_dbt_project:
    platforms: ['web', 'mobile']

  # Переменная `app_ids` доступна только для ресурсов в пакете snowplow
  snowplow:
    app_ids: ['marketing', 'app', 'landing-page']

models:
    ...
```

</File>

<VersionBlock firstVersion="1.12">

Нельзя определять переменные одновременно в `vars.yml` и `dbt_project.yml`. Если оба файла содержат блок `vars` с определениями, dbt выдаёт ошибку.

</VersionBlock>

### Определение переменных в командной строке {#defining-variables-on-the-command-line}

import Commandlinevariable from '/snippets/_command-line-variables.md';

<Commandlinevariable />

Более подробную информацию об определении словарей с помощью YAML можно найти [здесь](https://github.com/Animosity/CraftIRC/wiki/Complete-idiot%27s-introduction-to-yaml).

### Приоритет переменных {#variable-precedence}

<VersionBlock lastVersion="1.11">

Переменные, заданные с помощью аргумента командной строки `--vars`, переопределяют переменные, заданные в файле `dbt_project.yml`. Они имеют глобальную область видимости и доступны в корневом проекте и во всех установленных пакетах.

Порядок приоритета для объявления переменных следующий (наивысший приоритет в начале):

1. Переменные, определённые в командной строке с помощью `--vars`
2. Объявление переменной с областью видимости пакета в корневом файле `dbt_project.yml`
3. Объявление глобальной переменной в корневом файле `dbt_project.yml`
4. Если этот узел определён в пакете: объявления переменных в файле `dbt_project.yml` этого пакета
5. Значение переменной по умолчанию, переданное в качестве аргумента (если оно указано)

</VersionBlock>

<VersionBlock firstVersion="1.12">

Переменные, определённые с помощью аргумента командной строки `--vars`, переопределяют переменные, определённые в `vars.yml` или `dbt_project.yml`. Они имеют глобальную область видимости и доступны корневому проекту и всем установленным пакетам.

Порядок приоритета объявлений переменных следующий (от высшего к низшему):

1. Переменные, определённые в командной строке с помощью `--vars`
2. Объявление переменной с областью видимости пакета в корневом файле `vars.yml` (если он существует)
3. Объявление глобальной переменной в корневом файле `vars.yml` (если он существует)
4. Объявление переменной с областью видимости пакета в корневом файле `dbt_project.yml`
5. Объявление глобальной переменной в корневом файле `dbt_project.yml`
6. Если этот узел определён в пакете: объявления переменных в файле `dbt_project.yml` этого пакета
7. Значение переменной по умолчанию, переданное в качестве аргумента (если оно указано)

Файл `vars.yml` разбирается _до_ `dbt_project.yml`, поэтому переменные, определённые в `vars.yml`, доступны при разборе `dbt_project.yml`. Если файл `vars.yml` пуст или не существует, вместо них используются переменные из `dbt_project.yml`. При изменении любой переменной (в `vars.yml`, `dbt_project.yml` или в командной строке) частичный разбор отключается для следующего запуска.

</VersionBlock>

Если dbt не удаётся найти определение переменной после проверки всех возможных мест объявления переменных, возникает ошибка компиляции.

**Примечание:** Область видимости переменной основана на узле, который в конечном итоге использует эту переменную. Представьте случай, когда модель, определенная в корневом проекте, вызывает макрос, определенный в установленном пакете. Этот макрос, в свою очередь, использует значение переменной. Переменная будет разрешена на основе области видимости _корневого проекта_, а не области видимости пакета.

