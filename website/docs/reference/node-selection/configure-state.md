---
title: "Настройка выбора по состоянию (state selection)"
description: "Узнайте, как настроить выбор по состоянию (state selection) в dbt."
pagination_next: "reference/node-selection/state-comparison-caveats"
---

State и [defer](/reference/node-selection/defer) можно задавать как через переменные окружения, так и через флаги CLI:

- `--state` или <VersionBlock lastVersion="1.10">`DBT_STATE`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_STATE`</VersionBlock>: путь к файлу
- `--defer` или <VersionBlock lastVersion="1.10">`DBT_DEFER`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_DEFER`</VersionBlock>: логическое значение
- `--defer-state` или <VersionBlock lastVersion="1.10">`DBT_DEFER_STATE`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_DEFER_STATE`</VersionBlock>: путь к файлу, используемому только для отложенного разрешения ссылок (необязательно)

Если `--defer-state` не указан, для deferral будут использоваться артефакты, переданные через `--state`. Это позволяет более гибко управлять поведением в ситуациях, когда вы хотите сравниваться с логическим состоянием из одного окружения или момента времени, а defer выполнять к применённому состоянию из другого окружения или другого момента времени.

Если указаны и флаг, и переменная окружения, приоритет имеет флаг.

#### Примечания {#notes}
- Артефакты, передаваемые через `--state`, должны иметь версии схем, совместимые с текущей версией dbt.
- Это мощные и достаточно сложные возможности. Рекомендуем ознакомиться с [известными оговорками и ограничениями](/reference/node-selection/state-comparison-caveats), связанными со сравнением состояний.

:::warning Синтаксис устарел

В [dbt v1.5](/docs/dbt-versions/dbt-upgrade/Older%20versions/upgrading-to-v1.5#behavior-changes) мы объявили устаревшим исходный синтаксис для state (`DBT_ARTIFACT_STATE_PATH`) и defer (`DBT_DEFER_TO_STATE`). Хотя dbt сохраняет обратную совместимость со старым синтаксисом, мы удалим его в одном из будущих выпусков, который пока не определён.

:::

### Статус "result" {#the-result-status}

Ещё одним элементом состояния задания является `result` — результат предыдущего запуска dbt. Например, после выполнения `dbt run` dbt создаёт артефакт `run_results.json`, который содержит время выполнения и статусы успеха / ошибок для моделей dbt. Подробнее о `run_results.json` можно прочитать на странице ['run results'](/reference/artifacts/run-results-json).

Следующие команды dbt создают артефакты `run_results.json`, результаты которых можно использовать в последующих запусках dbt:  
- `dbt run`
- `dbt test`
- `dbt build`
- `dbt seed`

После выполнения одной из этих команд вы можете сослаться на результаты, добавив селектор в следующую команду:

<VersionBlock lastVersion="1.10">

```bash
# You can also set the DBT_STATE environment variable instead of the --state flag.
dbt run --select "result:<status>" --defer --state path/to/prod/artifacts
```

</VersionBlock>

<VersionBlock firstVersion="1.11">

```bash
# Вместо флага --state также можно задать переменную окружения DBT_ENGINE_STATE.
dbt run --select "result:<status>" --defer --state path/to/prod/artifacts
```

</VersionBlock>

Доступные варианты зависят от типа ресурса (узла):

|      `result:\<status>`        | model | seed | snapshot | test |
|----------------|-------|------|------|----------|
| `result:error`   | ✅  | ✅   | ✅   |  ✅      |
| `result:success` | ✅  | ✅   | ✅   |          |
| `result:skipped` | ✅  |      | ✅   |  ✅      |
| `result:fail`    |     |      |      |  ✅      |
| `result:warn`    |     |      |      |  ✅      |
| `result:pass`    |     |      |      |  ✅      |

### Совмещение селекторов `state` и `result` {#combining-state-and-result-selectors}

Селекторы state и result можно комбинировать в одном запуске dbt, чтобы, например, обработать ошибки из предыдущего запуска **или** любые новые либо изменённые модели.

```bash
dbt run --select "result:<status>+" state:modified+ --defer --state ./<dbt-artifact-path>
```

### Статус "source_status" {#the-source_status-status}

Ещё одним элементом состояния задания является `source_status` предыдущего запуска dbt. Например, после выполнения `dbt source freshness` dbt создаёт артефакт `sources.json`, который содержит время выполнения и значения `max_loaded_at` для источников dbt. Подробнее о `sources.json` можно прочитать на странице ['sources'](/reference/artifacts/sources-json).

Команда `dbt source freshness` создаёт артефакт `sources.json`, результаты которого можно использовать в последующих запусках dbt.

Когда задание выбрано, <Constant name="dbt" /> предоставит артефакты его последнего успешного запуска. Затем dbt использует эти артефакты, чтобы определить набор источников с более свежими данными. В командах задания можно указать dbt выполнять запуск и тестирование только для источников с более свежими данными и их дочерних узлов, добавив аргумент `source_status:fresher+`. Для этого артефакт `sources.json` должен быть доступен как для предыдущего, так и для текущего состояния. Проще говоря, в обоих запусках задания необходимо выполнить `dbt source freshness`.

После выполнения команды `dbt source freshness` вы можете сослаться на результаты проверки свежести источников, добавив селектор в следующую команду:

<VersionBlock lastVersion="1.10">

```bash
# You can also set the DBT_STATE environment variable instead of the --state flag.
dbt source freshness # must be run again to compare current to previous state
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```
</VersionBlock>

<VersionBlock firstVersion="1.11">

```bash
# Вместо флага --state также можно задать переменную окружения DBT_ENGINE_STATE.
dbt source freshness # необходимо запустить повторно, чтобы сравнить текущее состояние с предыдущим
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```

</VersionBlock>
Дополнительные примеры команд приведены в разделе [Советы по рабочим процессам](/best-practices/best-practice-workflows#pro-tips-for-workflows).

Другие примеры команд см. в разделе [Советы по рабочим процессам](/best-practices/best-practice-workflows#pro-tips-for-workflows).

## Связанные материалы {#related-docs}
- [О state в dbt](/reference/node-selection/state-selection)
- [Оговорки сравнения state](/reference/node-selection/state-comparison-caveats)
