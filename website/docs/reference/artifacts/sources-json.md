---
title: "Файл JSON источников"
sidebar_label: "Источники"
---

**Текущая схема:** [`v3`](https://schemas.getdbt.com/dbt/sources/v3/index.html)

**Сгенерировано с помощью:** [`source freshness`](/reference/commands/source)

Этот файл содержит информацию о [источниках с проверками свежести](/docs/build/sources#checking-source-freshness). В настоящее время dbt Cloud использует этот файл для отображения [визуализации свежести источников](/docs/build/sources#source-data-freshness).

### Ключи верхнего уровня

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `elapsed_time`: Общее время выполнения в секундах.
- `results`: Массив деталей выполнения проверок свежести.

Каждая запись в `results` представляет собой словарь с следующими ключами:

- `unique_id`: Уникальный идентификатор узла источника, который связывает результаты с `sources` в [манифесте](/reference/artifacts/manifest-json)
- `max_loaded_at`: Максимальное значение временной метки `loaded_at_field` в источнике <Term id="table" /> на момент запроса.
- `snapshotted_at`: Текущая временная метка на момент запроса.
- `max_loaded_at_time_ago_in_s`: Интервал между `max_loaded_at` и `snapshotted_at`, рассчитанный на Python для учета сложности часовых поясов.
- `criteria`: Порог(и) свежести для этого источника, определенные в проекте.
- `status`: Статус свежести этого источника, основанный на `max_loaded_at_time_ago_in_s` + `criteria`, сообщаемый в CLI. Один из `pass`, `warn` или `error`, если запрос выполнен успешно, `runtime error`, если запрос завершился неудачей.
- `execution_time`: Общее время, затраченное на проверку свежести для этого источника.
- `timing`: Массив, который разбивает время выполнения на этапы (`compile` + `execute`)

import RowsAffected from '/snippets/_run-result.md'; 

<RowsAffected/>