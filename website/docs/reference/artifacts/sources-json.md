---
title: "Файл JSON источников"
sidebar_label: "Источники"
---

**Текущая схема:** [`v3`](https://schemas.getdbt.com/dbt/sources/v3/index.html)

**Создано с помощью:** [`source freshness`](/reference/commands/source)

Этот файл содержит информацию об [источниках с проверками свежести](/docs/build/sources#checking-source-freshness). В настоящее время <Constant name="cloud" /> использует этот файл для работы своей [визуализации свежести источников данных](/docs/build/sources#source-data-freshness).

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