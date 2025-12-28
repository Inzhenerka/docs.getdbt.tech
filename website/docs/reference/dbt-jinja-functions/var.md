---
title: "О функции var"
sidebar_label: "var"
id: "var"
description: "Передача переменных из файла `dbt_project.yml` в модели."
---

Переменные могут быть переданы из файла `dbt_project.yml` в модели на этапе компиляции.
Эти переменные полезны для настройки пакетов при развертывании в нескольких окружениях или для определения значений, которые должны использоваться в нескольких моделях внутри одного пакета.

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

Чтобы определить переменную в вашем проекте, добавьте конфигурацию `vars:` в файл `dbt_project.yml`.
Подробнее о том, как определять переменные в dbt‑проекте, см. документацию по [использованию переменных](/docs/build/project-variables).

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
