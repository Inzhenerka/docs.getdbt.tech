---
title: "О функции var"
sidebar_label: "var"
id: "var"
description: "Передача переменных из файла `dbt_project.yml` в модели."
---

<VersionBlock lastVersion="1.11">

Переменные из файла [`dbt_project.yml`](/reference/dbt_project.yml) можно передавать в модели во время компиляции. Эти переменные позволяют настраивать модели, а не задавать значения непосредственно в SQL-коде. Например, вы можете один раз определить в проекте дату отчётности по умолчанию, регион или флаг функциональности и обращаться к ним из нескольких моделей.

Переменные, определённые в файле `dbt_project.yml`, задают значения по умолчанию для всего проекта. Вы можете переопределить их во время выполнения с помощью аргумента командной строки `--vars`. Например, чтобы протестировать другой диапазон дат или запустить модели с настройками для конкретной среды, не изменяя логику моделей.

</VersionBlock>

<VersionBlock firstVersion="1.12">

Вы можете передавать переменные из `vars.yml` или `dbt_project.yml` в модели во время компиляции. Эти переменные полезны для настройки пакетов при развёртывании в нескольких средах или для определения значений, которые должны использоваться в нескольких моделях одного пакета.

Переменные, определённые в `vars.yml` или `dbt_project.yml`, задают значения по умолчанию для всего проекта. Вы можете переопределить их во время выполнения с помощью аргумента командной строки `--vars`. Например, при тестировании с другим диапазоном дат или запуске моделей с настройками для конкретной среды без изменения логики моделей.

</VersionBlock>

Чтобы получить значение переменной внутри модели, хука или макроса, используйте функцию `var()`. Функция `var()` возвращает значение, определённое в проекте или переданное с помощью `--vars`, в соответствии с порядком приоритетов.

Вы можете использовать `var()` везде, где dbt обрабатывает Jinja во время компиляции, в том числе в большинстве файлов `.sql` и `.yml` вашего проекта. Эта функция не работает в конфигурационных файлах, которые dbt читает до компиляции, таких как [`profiles.yml`](/reference/dbt-jinja-functions/profiles-yml-context) или [`packages.yml`](/reference/dbt-jinja-functions/packages.yml%20context).

Чтобы добавить переменную в модель, используйте функцию `var()`:

<File name='my_model.sql'>

```sql
select * from events where event_type = '{{ var("event_type") }}'
```

</File>

Если вы попытаетесь запустить эту модель, не передав переменную `event_type`, вы получите
ошибку компиляции, которая будет выглядеть примерно так:

```
Encountered an error:
! Compilation error while compiling model package_name.my_model:
! Required var 'event_type' not found in config:
Vars supplied to package_name.my_model = {
}
```

<VersionBlock lastVersion="1.11">

Чтобы определить переменную в проекте, добавьте конфигурацию `vars:` в файл `dbt_project.yml`.
Подробнее об определении переменных в проекте dbt см. в документации
[Переменные проекта](/docs/build/project-variables).

<File name='dbt_project.yml'>

```yaml
name: my_dbt_project
version: 1.0.0

config-version: 2

# Define variables here
vars:
  event_type: activation
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

Чтобы определить переменную в проекте, добавьте конфигурацию `vars:` в отдельный файл `vars.yml` или в файл `dbt_project.yml`. Файл `vars.yml` обрабатывается _до_ `dbt_project.yml`, поэтому в `dbt_project.yml` можно ссылаться на переменные из `vars.yml` с помощью `{{ var('...') }}`.

<Tabs>
<TabItem value="vars.yml" label="vars.yml">

<File name='vars.yml'>

```yaml
vars:
  event_type: activation
```

</File>

</TabItem>
<TabItem value="dbt_project.yml" label="dbt_project.yml">

Вы можете определить переменные в `dbt_project.yml` или сослаться на переменные из `vars.yml` (например, в конфигурации `models`):

<File name='dbt_project.yml'>

```yaml
name: my_dbt_project
version: 1.0.0
config-version: 2

# Вариант 1: определите переменные здесь
vars:
  event_type: activation

# Вариант 2: сошлитесь на переменную из vars.yml
models:
  my_dbt_project:
    +schema: "{{ var('event_type') }}"
```

</File>

</TabItem>
</Tabs>

Нельзя определять переменные одновременно в `vars.yml` и `dbt_project.yml`; для этого можно использовать только один из этих файлов. Если оба файла содержат блок `vars` с определениями переменных, dbt выдаст ошибку.

Подробнее об определении переменных в проекте dbt см. в документации по [использованию переменных](/docs/build/project-variables).

</VersionBlock>

### Значения переменных по умолчанию

Функция `var()` принимает необязательный второй аргумент — `default`. Если этот
аргумент указан, он будет использоваться как значение переменной по умолчанию, если
переменная не определена явно.

<File name='my_model.sql'>

```sql
-- Use 'activation' as the event_type if the variable is not defined.
select * from events where event_type = '{{ var("event_type", "activation") }}'
```

</File>

### Command line variables

import Commandlinevariable from '/snippets/_command-line-variables.md';

<Commandlinevariable />

