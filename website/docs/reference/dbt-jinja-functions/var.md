---
title: "О функции var"
sidebar_label: "var"
id: "var"
description: "Передача переменных из файла `dbt_project.yml` в модели."
---

Переменные могут быть переданы из вашего файла `dbt_project.yml` в модели во время компиляции. Эти переменные полезны для настройки пакетов для развертывания в нескольких средах или для определения значений, которые должны использоваться в нескольких моделях внутри пакета.

Чтобы добавить переменную в модель, используйте функцию `var()`:

<File name='my_model.sql'>

```sql
select * from events where event_type = '{{ var("event_type") }}'
```

</File>

Если вы попытаетесь запустить эту модель без предоставления переменной `event_type`, вы получите ошибку компиляции, которая будет выглядеть следующим образом:

```
Encountered an error:
! Compilation error while compiling model package_name.my_model:
! Required var 'event_type' not found in config:
Vars supplied to package_name.my_model = {
}
```

Чтобы определить переменную в вашем проекте, добавьте конфигурацию `vars:` в ваш файл `dbt_project.yml`. См. документацию по [использованию переменных](/docs/build/project-variables) для получения дополнительной информации о том, как определять переменные в вашем проекте dbt.

<File name='dbt_project.yml'>

```yaml
name: my_dbt_project
version: 1.0.0

config-version: 2

# Определите переменные здесь
vars:
  event_type: activation
```

</File>

### Значения по умолчанию для переменных

Функция `var()` принимает необязательный второй аргумент, `default`. Если этот аргумент указан, то он будет значением по умолчанию для переменной, если она не определена явно.

<File name='my_model.sql'>

```sql
-- Используйте 'activation' в качестве event_type, если переменная не определена.
select * from events where event_type = '{{ var("event_type", "activation") }}'
```

</File>