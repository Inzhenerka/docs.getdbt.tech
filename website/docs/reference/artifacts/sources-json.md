---
title: "Файл JSON источников"
sidebar_label: "Источники"
---

**Текущая схема:** [`v3`](https://schemas.getdbt.com/dbt/sources/v3/index.html)

<VersionBlock lastVersion="1.99">

**Создаётся командой:** [`dbt source freshness`](/reference/commands/source)

</VersionBlock>

<VersionBlock firstVersion="2.0">

**Создаётся командой:** [`dbt freshness`](/reference/commands/freshness) (если в запуск включены источники)

</VersionBlock>

Этот файл содержит информацию об [источниках с проверками актуальности данных](/docs/build/sources#evaluate-source-freshness). dbt использует этот файл для [визуализации актуальности данных источников](/docs/build/sources#source-data-freshness).

<VersionBlock firstVersion="2.0">

`sources.json` — устаревший артефакт, который содержит результаты проверок актуальности данных только для источников. Чтобы получить результаты для источников и моделей в одном файле, используйте [`freshness.json`](/reference/artifacts/freshness-json). Если при запуске `dbt freshness` проверяются только модели и источники не включены, dbt не перезаписывает `sources.json`.

</VersionBlock>

### Ключи верхнего уровня {#top-level-keys}

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `elapsed_time`: Общее время выполнения в секундах.
- `results`: Массив с деталями выполнения проверки актуальности.

Каждая запись в `results` является словарем со следующими ключами:

- `unique_id`: Уникальный идентификатор узла источника, который связывает результаты с `sources` в [манифесте](/reference/artifacts/manifest-json)
- `max_loaded_at`: Максимальное значение временной метки `loaded_at_field` в источнике <Term id="table" />, когда выполняется запрос.
- `snapshotted_at`: Текущая временная метка при выполнении запроса.
- `max_loaded_at_time_ago_in_s`: Интервал между `max_loaded_at` и `snapshotted_at`, рассчитанный в Python для учета сложности часовых поясов.
- `criteria`: Порог(и) актуальности для этого источника, определенные в проекте.
- `status`: Статус актуальности этого источника, основанный на `max_loaded_at_time_ago_in_s` + `criteria`, отображаемый в CLI. Может быть `pass`, `warn` или `error`, если запрос выполнен успешно, или `runtime error`, если запрос не выполнен.
- `execution_time`: Общее время, затраченное на проверку актуальности для этого источника.
- `timing`: Массив, который разбивает время выполнения на этапы (`compile` + `execute`).

import RowsAffected from '/snippets/_run-result.md'; 

<RowsAffected/>