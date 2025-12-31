---
title: "О объекте model"
sidebar_label: "model"
id: "model"
description: "`model` — это объект графа dbt (или узел) для текущей модели."
---

`model` — это [объект графа](/reference/dbt-jinja-functions/graph) dbt (или узел) для текущей модели. Он может использоваться для:
- Доступа к настройкам `config`, например, в post-hook
- Доступа к пути модели

Например:
```jinja
{% if model.config.materialized == 'view' %}
  {{ log(model.name ~ " is a view.", info=True) }}
{% endif %}
```

Чтобы просмотреть содержимое `model` для данной модели:

<Tabs>

<TabItem value="cli" label="Интерфейс командной строки">

Если вы используете интерфейс командной строки (CLI), используйте [log()](/reference/dbt-jinja-functions/log) для вывода полного содержимого:

```jinja
{{ log(model, info=True) }}
```
  
</TabItem>
 
<TabItem value="ide" label="Studio IDE">
   
 Если вы используете Studio IDE, скомпилируйте следующее, чтобы вывести всё содержимое целиком: <br /><br />

```jinja
{{ model | tojson(indent = 4) }}
```
   
</TabItem>

</Tabs>

## Свойства пакета для микропакетных моделей {#batch-properties-for-microbatch-models}

Начиная с dbt Core v1.9, объект модели включает свойство `batch` (`model.batch`), которое предоставляет информацию о текущем пакете при выполнении [инкрементальной микропакетной](/docs/build/incremental-microbatch) модели. Это свойство заполняется только во время выполнения пакета микропакетной модели.

Следующая таблица описывает свойства объекта `batch`. Обратите внимание, что dbt добавляет свойство к объектам `model` и `batch`.

| Свойство | Описание | Пример |  
| -------- | ----------- | ------- |
| `id` | Уникальный идентификатор пакета в контексте микропакетной модели. | `model.batch.id` |
| `event_time_start` | Время начала фильтра [`event_time`](/reference/resource-configs/event-time) пакета (включительно). | `model.batch.event_time_start` |
| `event_time_end` | Время окончания фильтра `event_time` пакета (исключительно). | `model.batch.event_time_end` |

### Примечания по использованию {#usage-notes}

`model.batch` доступен только во время выполнения пакета микропакетной модели. Вне выполнения микропакета `model.batch` равен `None`, и его под-свойства недоступны.

#### Пример безопасного доступа к свойствам пакета {#example-of-safeguarding-access-to-batch-properties}

Мы рекомендуем всегда проверять, заполнен ли `model.batch`, прежде чем обращаться к его свойствам. Для этого используйте оператор `if` для безопасного доступа к свойствам `batch`:

```jinja
{% if model.batch %}
  {{ log(model.batch.id) }}  # Логирование ID пакета #
  {{ log(model.batch.event_time_start) }}  # Логирование времени начала пакета #
  {{ log(model.batch.event_time_end) }}  # Логирование времени окончания пакета #
{% endif %}
```

В этом примере оператор `if model.batch` гарантирует, что код выполняется только во время выполнения пакета. `log()` используется для вывода свойств `batch` для отладки.

#### Пример логирования деталей пакета {#example-of-log-batch-details}

Это практический пример того, как вы можете использовать `model.batch` в микропакетной модели для логирования деталей пакета для `batch.id`:

```jinja
{% if model.batch %}
  {{ log("Processing batch with ID: " ~ model.batch.id, info=True) }}
  {{ log("Batch event time range: " ~ model.batch.event_time_start ~ " to " ~ model.batch.event_time_end, info=True) }}
{% endif %}
```
В этом примере оператор `if model.batch` гарантирует, что код выполняется только во время выполнения пакета. `log()` используется для вывода свойств `batch` для отладки.

## Структура модели и JSON-схема {#model-structure-and-json-schema}

Чтобы просмотреть структуру `models` и их определения:
- Обратитесь к [JSON-схеме dbt](https://schemas.getdbt.com/) для описания и использования артефактов, сгенерированных dbt
- Выберите соответствующую версию манифеста в разделе **Manifest**. Например, если вы используете dbt v1.8, выберите Manifest v12
  * Номер версии `manifest.json` связан с (но не равен) вашей версии dbt, поэтому вы _должны_ использовать правильную версию `manifest.json` для вашей версии dbt. Чтобы найти правильную версию `manifest.json`, обратитесь к [Manifest](/reference/artifacts/manifest-json) и выберите версию dbt в верхней навигации (например, `v1.5`). Это поможет вам узнать, какие теги связаны с вашей моделью.
- Затем перейдите к `nodes` --> Выберите Дополнительные свойства --> `CompiledModelNode` или просмотрите другие определения/объекты.

Используйте следующую таблицу, чтобы понять, как работает паттерн версионирования и сопоставить версию Manifest с версией dbt:

import ManifestVersions from '/snippets/_manifest-versions.md';

<ManifestVersions />

## Связанные документы {#related-docs}

- [JSON-схема dbt](https://schemas.getdbt.com/)