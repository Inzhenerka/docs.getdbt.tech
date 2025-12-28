---
title: "lookback"
id: "lookback"
sidebar_label: "lookback"
resource_types: [models]
description: "Настройте `lookback`, чтобы определить, сколько «батчей» размером `batch_size` нужно повторно обработать при инкрементальном запуске dbt microbatch модели"
datatype: int
---

<VersionCallout version="1.9" />
## Определение

Настройте окно `lookback`, чтобы повторно обрабатывать дополнительные батчи во время запусков [microbatch incremental model](/docs/build/incremental-microbatch). Модель обрабатывает X батчей вплоть до последней закладки (последней успешно обработанной точки данных), чтобы захватить записи, поступившие с задержкой.

Установите параметр `lookback` в целое число, большее или равное нулю. Значение по умолчанию — `1`. Вы можете настроить `lookback` для [microbatch incremental model](/docs/build/incremental-microbatch) в YAML-файле проекта (`dbt_project.yml`), YAML-файле свойств (`models/properties.yml`) или в конфигурации SQL-файла.

## Примеры

Следующие примеры устанавливают `2` в качестве конфигурации `lookback` для модели `user_sessions`.

Пример в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +lookback: 2
```
</File>

Пример в файле свойств:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      lookback: 2
```

</File>

Пример в SQL-блоке `config`:

<File name="models/user_sessions.sql">

```sql
{{ config(
    lookback=2
) }}
```

</File> 
