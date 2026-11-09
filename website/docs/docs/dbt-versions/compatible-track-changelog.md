---
title: "Платформа dbt: канал v1 Compatible — журнал изменений"
sidebar_label: "Журнал изменений канала v1 Compatible"
description: "Канал релизов v1 Compatible обновляется раз в месяц и включает актуальные на момент ежемесячного выпуска версии компонентов с открытым исходным кодом."
availability:
  surface: platform
  access: free
---

Выберите каналы релизов **v1 Compatible** и **v1 Extended**, если вам нужны менее частые обновления, возможность тестировать новые релизы dbt перед их использованием в производственной среде и/или постоянная совместимость с последними релизами <Constant name="core" /> с открытым исходным кодом.

Каждый ежемесячный релиз **v1 Compatible** включает функциональность, соответствующую актуальным на момент выпуска версиям <Constant name="core" /> и адаптеров с открытым исходным кодом.

Подробнее см. в разделе [Каналы релизов](/docs/dbt-versions/dbt-release-tracks).

## Октябрь 2026

Дата выпуска: 15 октября 2026 г.

### Платформа dbt

#### Изменения, нарушающие обратную совместимость

- Значением по умолчанию для следующих ранее введённых флагов изменения поведения теперь является `true`: `require_batched_execution_for_custom_microbatch_strategy`, `skip_nodes_if_on_run_start_fails`, `state_modified_compare_more_unrendered_values`, `require_yaml_configuration_for_mf_time_spines`, `require_nested_cumulative_type_params`, `validate_macro_args` и `require_all_warnings_handled_by_warn_error`. Это изменение переносит dbt-core#15489 после истечения срока уведомления клиентов.

#### Новые возможности

- Добавлено инструментирование выполнения узлов и хуков с помощью спанов OpenTelemetry, включаемое флагом `--snowflake-projects-otel` (по умолчанию отключено).
- Теперь вы можете разрешать приватные пакеты (`packages.private` в `packages.yml`) через эндпоинт разрешения приватных пакетов платформы dbt с аутентификацией с помощью HMAC-токена, внедряемого системой оркестрации (`DBT_CLOUD_PRIVATE_PACKAGES_AUTH_TOKEN`, `DBT_CLOUD_ACCOUNT_ID`, `DBT_CLOUD_ACCOUNT_HOST`, `DBT_CLOUD_PROJECT_ID`). dbt обращается к этому эндпоинту после существующего устаревшего механизма разрешения через `DBT_ENV_PRIVATE_GIT_PROVIDER_INFO`, который не изменился и по-прежнему имеет приоритет, если настроен. Приватный пакет, обнаруженный после первоначального разрешения (например, транзитивная приватная зависимость), dbt разрешает по мере необходимости через тот же эндпоинт, а не переключается на SSH, поскольку учётные данные SSH никогда не доступны при оркестрации на платформе dbt. Если dbt не удаётся разрешить какой-либо из запрошенных пакетов, он немедленно выдаёт ошибку, а не выполняет неявный переход к резервному механизму.
- Добавлена поддержка метаданных маршрутизации окружений Mesh в межпроектных зависимостях.
- Теперь dbt предупреждает об использовании устаревшей версии dbt.
- Добавлены функции Jinja `otel_trace_id()` и `otel_span_id()` для сопоставления комментариев к запросам и SQL-кода моделей с идентификаторами трассировок и спанов OpenTelemetry.

#### Исправления

- Ключи конфигурации адаптера Databricks (`query_tags`, `zorder`, `options`, `unique_tmp_table_suffix`, `skip_optimize`) теперь распознаются при проверке по JSON Schema и больше не вызывают ошибочных предупреждений `CustomKeyInConfigDeprecation` (dbt-databricks#1540, dbt-databricks#1302).
- Исправлено завышенное количество узлов («X из Y») в `dbt build` при выборе модульных тестов. Теперь dbt добавляет количество модульных тестов к `num_nodes` ровно один раз, а не при каждом извлечении из очереди, пока `run_count` остаётся равным 0.
- Устранено преждевременное разрешение тестируемой модели модульного теста на этапе разбора. Теперь dbt разрешает её только в рамках единственного детерминированного прохода после разбора, поэтому разрешение больше никак не зависит от порядка разбора файлов в файловой системе.
- Исправлены спаны OpenTelemetry для хуков: имена теперь формируются по хуку и фазе транзакции, вызовы без выполняемых хуков пропускаются, а также добавлены контекст узла и статус.
- При загрузке артефактов по подписанному URL Azure Blob Storage теперь отправляется заголовок `x-ms-blob-type: BlockBlob` и принимается ответ `201 Created`, поэтому приём артефактов больше не завершается ошибкой `400 MissingRequiredHeader` в регионах, размещённых в Azure. Сообщения об ошибках загрузки теперь включают код ошибки поставщика хранилища наряду с кодом статуса.
- Значение `unrendered_config` функции теперь разрешается из блока конфигурации проекта `functions:`, а не из `models:`, поэтому значения по умолчанию уровня моделей больше не попадают в конфигурации функций и не приводят к тому, что функции считаются изменёнными при использовании `state:modified`.
- Перенесены исправления парсера v2: `--v2-parser` теперь по умолчанию использует входящий в поставку исполняемый файл <Constant name="fusion" /> вместо `dbt-core-experimental-parser`; после загрузки манифеста, созданного <Constant name="fusion" />, макросы адаптера повторно разбираются из установленного пакета адаптера (перенос dbt-core#15529); встроенные макросы универсальных тестов обнаруживаются повторно, чтобы они не оставались неопределёнными при компиляции тестов (перенос dbt-core#15925).
- Вывод подпроцесса парсера <Constant name="fusion" /> теперь перехватывается и повторно передаётся через систему событий dbt-core, а не направляется напрямую в stdout и stderr; уровень каждой строки устанавливается в соответствии с уровнем серьёзности из JSON, если он доступен.
- Добавлена проверка того, что разрешённый путь установки пакета находится в пределах настроенного `packages-install-path`.
- Исправлен `Dimension` для соответствия протоколу `metricflow-semantic-interfaces`, а минимальная версия `metricflow` повышена до 0.213.0.

#### Зависимости

- Минимальная версия `dbt-core-experimental-parser` повышена до 2.0.0b1.
- Требуется `sqlparse>=0.5.5,<0.7.0`. В версии 0.6.0 исправлены уязвимости CVE-2026-54284, CVE-2026-59893, CVE-2026-59894 и CVE-2026-71491 (отказ в обслуживании при разборе).

Этот релиз канала Compatible включает функциональность следующих версий <Constant name="core" /> и компонентов с открытым исходным кодом:

```
dbt-core==1.12.5

# общие интерфейсы
dbt-adapters==1.24.5
dbt-common==1.38.0
dbt-extractor==0.6.0
dbt-semantic-interfaces==0.9.0
dbt-sl-sdk[sync]==0.13.4
dbt-state==2.61.0

# адаптеры
dbt-athena==1.11.1
dbt-bigquery==1.12.1
dbt-databricks==1.12.7
dbt-fabric==1.9.4
dbt-postgres==1.11.0
dbt-redshift==1.11.1
dbt-snowflake==1.12.3
dbt-spark==1.10.3
dbt-synapse==1.8.5
dbt-teradata==1.11.0
dbt-trino==1.10.6
```

Журналы изменений:
- [dbt-core 1.12.5](https://github.com/dbt-labs/dbt/blob/1.12.latest/CHANGELOG.md)
- [dbt-adapters 1.24.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md)
- [dbt-common 1.38.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-state 2.61.0](https://github.com/dbt-labs/dbt-state)
- [dbt-athena 1.11.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-athena/CHANGELOG.md)
- [dbt-bigquery 1.12.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-bigquery/CHANGELOG.md)
- [dbt-databricks 1.12.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.11.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-postgres/CHANGELOG.md)
- [dbt-redshift 1.11.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-redshift/CHANGELOG.md)
- [dbt-snowflake 1.12.3](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.10.3](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-spark/CHANGELOG.md)
- [dbt-synapse 1.8.5](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.11.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.11.0)
- [dbt-trino 1.10.6](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md)

## Август 2026

Дата выпуска: 18 августа 2026 г.

Этот релиз канала Compatible включает функциональность следующих версий <Constant name="core" /> и компонентов с открытым исходным кодом:

```
dbt-core==1.12.0

# общие интерфейсы
dbt-adapters==1.24.5
dbt-common==1.38.0
dbt-extractor==0.6.0
dbt-semantic-interfaces==0.9.0
dbt-sl-sdk[sync]==0.13.4
dbt-state==2.42.0

# адаптеры
dbt-athena==1.11.0
dbt-bigquery==1.12.0
dbt-databricks==1.12.4
dbt-fabric==1.9.4
dbt-postgres==1.11.0
dbt-redshift==1.11.0
dbt-snowflake==1.12.0
dbt-spark==1.10.3
dbt-synapse==1.8.5
dbt-teradata==1.11.0
dbt-trino==1.10.3
```

Журналы изменений:
- [dbt-core 1.12.0](https://github.com/dbt-labs/dbt/blob/1.12.latest/CHANGELOG.md)
- [dbt-adapters 1.24.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md)
- [dbt-common 1.38.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-state 2.42.0](https://github.com/dbt-labs/dbt-state)
- [dbt-athena 1.11.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-athena/CHANGELOG.md)
- [dbt-bigquery 1.12.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-bigquery/CHANGELOG.md)
- [dbt-databricks 1.12.4](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.11.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-postgres/CHANGELOG.md)
- [dbt-redshift 1.11.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-redshift/CHANGELOG.md)
- [dbt-snowflake 1.12.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.10.3](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-spark/CHANGELOG.md)
- [dbt-synapse 1.8.5](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.11.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.11.0)
- [dbt-trino 1.10.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md)

## Июль 2026

Дата выпуска: 21 июля 2026 г.

### Платформа dbt

### Исправления

- Устаревшие межпроектные зависимости теперь удаляются из внедрённых внешних узлов до связывания. Публикация может содержать транзитивного публичного предка, который уже удалён в исходном проекте; ранее его внедрение в виде ребра `depends_on`, ведущего к отсутствующему узлу, вызывало сбой компиляции с ошибкой `GraphDependencyNotFoundError`. Теперь такое ребро удаляется с предупреждением и восстанавливается после повторного создания публикации проекта-производителя.

### Зависимости

- Версия `pyathena` ограничена v3.35 и более ранними версиями

Этот релиз канала Compatible включает функциональность следующих версий <Constant name="core" /> и компонентов с открытым исходным кодом:

```
dbt-core==1.11.12

# общие интерфейсы
dbt-adapters==1.22.10
dbt-common==1.37.5
dbt-extractor==0.6.0
dbt-semantic-interfaces==0.9.0
dbt-sl-sdk[sync]==0.13.4

# адаптеры
dbt-athena==1.10.2
dbt-bigquery==1.11.1
dbt-databricks==1.12.2
dbt-fabric==1.9.4
dbt-postgres==1.10.2
dbt-redshift==1.10.2
dbt-snowflake==1.11.6
dbt-spark==1.10.3
dbt-synapse==1.8.5
dbt-teradata==1.10.3
dbt-trino==1.10.2
```

Журналы изменений:
- [dbt-core 1.11.12](https://github.com/dbt-labs/dbt/blob/1.11.latest/CHANGELOG.md)
- [dbt-adapters 1.22.10](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md)
- [dbt-common 1.37.5](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-athena 1.10.2](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-athena/CHANGELOG.md)
- [dbt-bigquery 1.11.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-bigquery/CHANGELOG.md)
- [dbt-databricks 1.12.2](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.10.2](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-postgres/CHANGELOG.md)
- [dbt-redshift 1.10.2](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-redshift/CHANGELOG.md)
- [dbt-snowflake 1.11.6](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.10.3](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-spark/CHANGELOG.md)
- [dbt-synapse 1.8.5](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.3](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.3)
- [dbt-trino 1.10.2](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md)

## Июнь 2026

Дата выпуска: 15 июня 2026 г.

### Облачная платформа dbt

Этот релиз канала Compatible включает функциональность следующих версий <Constant name="core" /> и компонентов с открытым исходным кодом:

```
dbt-core==1.11.11

# общие интерфейсы
dbt-adapters==1.22.10
dbt-common==1.37.5
dbt-extractor==0.6.0
dbt-semantic-interfaces==0.9.0
dbt-sl-sdk[sync]==0.13.4

# адаптеры
dbt-athena==1.10.1
dbt-bigquery==1.11.1
dbt-databricks==1.12.1
dbt-fabric==1.9.4
dbt-postgres==1.10.0
dbt-redshift==1.10.1
dbt-snowflake==1.11.5
dbt-spark==1.10.1
dbt-synapse==1.8.5
dbt-teradata==1.10.2
dbt-trino==1.10.2
```

Журналы изменений:
- [dbt-core 1.11.11](https://github.com/dbt-labs/dbt/blob/1.11.latest/CHANGELOG.md)
- [dbt-adapters 1.22.10](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md)
- [dbt-common 1.37.5](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-athena 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-athena/CHANGELOG.md)
- [dbt-bigquery 1.11.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-bigquery/CHANGELOG.md)
- [dbt-databricks 1.12.1](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-postgres/CHANGELOG.md)
- [dbt-redshift 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-redshift/CHANGELOG.md)
- [dbt-snowflake 1.11.5](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-spark/CHANGELOG.md)
- [dbt-synapse 1.8.5](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.2)
- [dbt-trino 1.10.2](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md)

## Май 2026

Релиз канала Compatible, запланированный на май 2026 года, будет пропущен для стабилизации релиза `dbt-core 1.12.0` на всей <Constant name="dbt_platform" />.

Выпуск релизов канала Compatible возобновится в июне 2026 года.

## Апрель 2026

Дата выпуска: 21 апреля 2026 г.

### Облачная платформа dbt

Этот релиз канала Compatible включает функциональность следующих версий <Constant name="core" /> и компонентов с открытым исходным кодом:

```
dbt-core==1.11.8

# общие интерфейсы
dbt-adapters==1.22.10
dbt-common==1.37.3
dbt-extractor==0.6.0
dbt-semantic-interfaces==0.9.0
dbt-sl-sdk[sync]==0.13.2

# адаптеры
dbt-athena==1.10.0
dbt-bigquery==1.11.1
dbt-databricks==1.11.7
dbt-fabric==1.9.4
dbt-postgres==1.10.0
dbt-redshift==1.10.1
dbt-snowflake==1.11.4
dbt-spark==1.10.1
dbt-synapse==1.8.4
dbt-teradata==1.10.2
dbt-trino==1.10.1
```

Журналы изменений:
- [dbt-core 1.11.8](https://github.com/dbt-labs/dbt/blob/1.11.latest/CHANGELOG.md)
- [dbt-adapters 1.22.10](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md)
- [dbt-common 1.37.3](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-athena 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-athena/CHANGELOG.md)
- [dbt-bigquery 1.11.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-bigquery/CHANGELOG.md)
- [dbt-databricks 1.11.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-postgres/CHANGELOG.md)
- [dbt-redshift 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-redshift/CHANGELOG.md)
- [dbt-snowflake 1.11.4](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-spark/CHANGELOG.md)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.2)
- [dbt-trino 1.10.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md)

## Март 2026

Релиз канала Compatible, запланированный на март 2026 года, будет пропущен для дальнейшей стабилизации минорного обновления `dbt-core==1.11.6` на всей платформе dbt.

Выпуск релизов канала Compatible возобновится в апреле 2026 года.

## Февраль 2026

Дата выпуска: 27 февраля 2026 г.

### Облачная платформа dbt

### Новые возможности
- Добавлена поддержка статуса частичного успеха для результатов Advanced CI

### Зависимости
- Верхняя граница версии dbt-databricks обновлена до 1.12

Этот релиз канала Compatible включает функциональность следующих версий <Constant name="core" /> и компонентов с открытым исходным кодом:

```
dbt-core==1.11.6

# общие интерфейсы
dbt-adapters==1.22.6
dbt-common==1.37.2
dbt-extractor==0.6.0
dbt-semantic-interfaces==0.9.0
dbt-sl-sdk[sync]==0.13.1

# адаптеры
dbt-athena==1.10.0
dbt-bigquery==1.11.0
dbt-databricks==1.11.5
dbt-fabric==1.9.4
dbt-postgres==1.10.0
dbt-redshift==1.10.1
dbt-snowflake==1.11.2
dbt-spark==1.10.1
dbt-synapse==1.8.4
dbt-teradata==1.10.1
dbt-trino==1.10.1
```

Журналы изменений:
- [dbt-core 1.11.6](https://github.com/dbt-labs/dbt/blob/1.11.latest/CHANGELOG.md#dbt-core-1116---february-17-2026)
- [dbt-adapters 1.22.6](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1226---february-17-2026)
- [dbt-common 1.37.2](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1372---december-15-2025)
- [dbt-athena 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-athena/CHANGELOG.md#dbt-athena-1100---december-22-2025)
- [dbt-bigquery 1.11.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1110---december-22-2025)
- [dbt-databricks 1.11.5](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-1115-feb-19-2026)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-postgres/CHANGELOG.md#dbt-postgres-1100---december-22-2025)
- [dbt-redshift 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-redshift/CHANGELOG.md#dbt-redshift-1101---february-11-2026)
- [dbt-snowflake 1.11.2](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-snowflake/CHANGELOG.md#dbt-snowflake-1112---february-11-2026)
- [dbt-spark 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-spark/CHANGELOG.md#dbt-spark-1101---february-11-2026)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.1](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.1)
- [dbt-trino 1.10.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-1101---january-16-2026)

## Январь 2026

Дата выпуска: 22 января 2026 г.

### Облачная платформа dbt

### Внутренние изменения
- Добавлено отладочное сообщение в журнал с локальным хешем md5 для проверки соответствия dbt v2
- Устранено предупреждение UserWarning от Click CLI об использовании --target и --profile в Advanced CI

Этот релиз канала Compatible включает функциональность следующих версий <Constant name="core" /> и компонентов с открытым исходным кодом:

```
dbt-core==1.10.19

# общие интерфейсы
dbt-adapters==1.22.5
dbt-common==1.37.2
dbt-extractor==0.6.0
dbt-semantic-interfaces==0.9.0
dbt-sl-sdk[sync]==0.13.1

# адаптеры
dbt-athena==1.10.0
dbt-bigquery==1.11.0
dbt-databricks==1.10.19
dbt-fabric==1.9.4
dbt-postgres==1.10.0
dbt-redshift==1.10.0
dbt-snowflake==1.11.1
dbt-spark==1.9.3
dbt-synapse==1.8.4
dbt-teradata==1.10.1
dbt-trino==1.10.1
```

Журналы изменений:
- [dbt-core 1.10.19](https://github.com/dbt-labs/dbt/blob/1.10.latest/CHANGELOG.md#dbt-core-11019---january-20-2026)
- [dbt-adapters 1.22.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1225---january-14-2026)
- [dbt-common 1.37.2](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1372---december-15-2025)
- [dbt-athena 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-athena/CHANGELOG.md#dbt-athena-1100---december-22-2025)
- [dbt-bigquery 1.11.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1110---december-22-2025)
- [dbt-databricks 1.10.19](https://github.com/databricks/dbt-databricks/blob/1.10.latest/CHANGELOG.md#dbt-databricks-11019-jan-21-2026)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-postgres/CHANGELOG.md#dbt-postgres-1100---december-22-2025)
- [dbt-redshift 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-redshift/CHANGELOG.md#dbt-redshift-1100---december-22-2025)
- [dbt-snowflake 1.11.1](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-snowflake/CHANGELOG.md#dbt-snowflake-1111---january-08-2026)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/stable/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.1](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.1)
- [dbt-trino 1.10.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-1101---january-16-2026)

## Декабрь 2025 {#december-2025}

Дата релиза: 9 декабря 2025 г.

### Облачная платформа dbt {#dbt-cloud-based-platform}

Этот совместимый релиз включает функциональность следующих версий <Constant name="core" /> OSS:

```
dbt-core==1.10.15

# shared interfaces
dbt-adapters==1.16.7
dbt-common==1.33.0
dbt-semantic-interfaces==0.9.0

# adapters
dbt-athena==1.9.5
dbt-bigquery==1.10.3
dbt-databricks==1.10.15
dbt-extractor==0.6.0
dbt-fabric==1.9.4
dbt-postgres==1.9.1
dbt-redshift==1.9.5
dbt-sl-sdk[sync]==0.13.0
dbt-snowflake==1.10.3
dbt-spark==1.9.3
dbt-synapse==1.8.4
dbt-teradata==1.10.0
dbt-trino==1.9.3
```

Журналы изменений:
- [dbt-core 1.10.15](https://github.com/dbt-labs/dbt/blob/1.10.latest/CHANGELOG.md#dbt-core-11015---november-12-2025)
- [dbt-adapters 1.16.7](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1166---september-03-2025)
- [dbt-common 1.33.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1330---october-20-2025)
- [dbt-athena 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.10.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1101---july-29-2025)
- [dbt-databricks 1.10.15](https://github.com/databricks/dbt-databricks/blob/1.10.latest/CHANGELOG.md#dbt-databricks-11015-nov-17-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/CHANGELOG.md#changelog)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.10.3](http://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.0)
- [dbt-trino 1.9.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-193---july-22-2025)

## Ноябрь 2025 {#november-2025}

Дата релиза: 11 ноября 2025 г.

### Облачная платформа dbt {#dbt-cloud-based-platform-1}

### Под капотом {#under-the-hood}
- Запись схем столбцов источников, когда установлен `DBT_RECORDER_MODE`
- Дополнительное получение схем столбцов для жёстко заданных ссылок на отношения в SQL
- Потокобезопасный кэш для записи схем источников
- Запись схем столбцов для отложенных отношений и невыбранных зависимостей

### Внутренние изменения
- Запись схем столбцов источников при заданной переменной `DBT_RECORDER_MODE`
- Выполнение дополнительных запросов для получения схем столбцов для жёстко заданных ссылок на отношения в SQL
- Обеспечение потокобезопасности кеша записи схем источников
- Запись схем столбцов для отложенных отношений и невыбранных зависимостей

Этот совместимый релиз включает функциональность из следующих версий <Constant name="core" /> OSS:

```
dbt-core==1.10.15

# shared interfaces
dbt-adapters==1.16.7
dbt-common==1.33.0
dbt-semantic-interfaces==0.9.0

# adapters
dbt-athena==1.9.5
dbt-bigquery==1.10.3
dbt-databricks==1.10.15
dbt-extractor==0.6.0
dbt-fabric==1.9.4
dbt-postgres==1.9.1
dbt-redshift==1.9.5
dbt-sl-sdk[sync]==0.13.0
dbt-snowflake==1.10.3
dbt-spark==1.9.3
dbt-synapse==1.8.4
dbt-teradata==1.10.0
dbt-trino==1.9.3
```

Журналы изменений:
- [dbt-core 1.10.15](https://github.com/dbt-labs/dbt/blob/1.10.latest/CHANGELOG.md#dbt-core-11015---november-12-2025)
- [dbt-adapters 1.16.7](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1166---september-03-2025)
- [dbt-common 1.33.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1330---october-20-2025)
- [dbt-athena 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.10.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1101---july-29-2025)
- [dbt-databricks 1.10.15](https://github.com/databricks/dbt-databricks/blob/1.10.latest/CHANGELOG.md#dbt-databricks-11015-nov-17-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/CHANGELOG.md#changelog)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.10.3](http://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.0)
- [dbt-trino 1.9.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-193---july-22-2025)

## Октябрь 2025 {#october-2025}

Дата релиза: 23 октября 2025 г.

### Облачная платформа dbt {#dbt-cloud-based-platform-2}

### Под капотом {#under-the-hood-1}
- Добавлена инструментация методов адаптеров для надёжных трассировок отладки на границе адаптера

### Под капотом
- Добавлено инструментирование методов адаптера для получения надёжных отладочных трассировок на границе адаптера

Этот совместимый релиз включает функциональность из следующих версий <Constant name="core" /> OSS:

```
dbt-core==1.10.13

# shared interfaces
dbt-adapters==1.16.7
dbt-common==1.33.0
dbt-semantic-interfaces==0.9.0

# adapters
dbt-athena==1.9.5
dbt-bigquery==1.10.2
dbt-databricks==1.10.14
dbt-extractor==0.6.0
dbt-fabric==1.9.4
dbt-postgres==1.9.1
dbt-redshift==1.9.5
dbt-sl-sdk[sync]==0.13.0
dbt-snowflake==1.10.2
dbt-spark==1.9.3
dbt-synapse==1.8.4
dbt-teradata==1.10.0
dbt-trino==1.9.3
```

Журналы изменений:
- [dbt-core 1.10.13](https://github.com/dbt-labs/dbt/blob/1.10.latest/CHANGELOG.md#dbt-core-11013---september-25-2025)
- [dbt-adapters 1.16.7](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1166---september-03-2025)
- [dbt-common 1.33.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1330---october-20-2025)
- [dbt-athena 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.10.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1101---july-29-2025)
- [dbt-databricks 1.10.14](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-11014-october-22-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/CHANGELOG.md#changelog)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.10.2](http://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.0)
- [dbt-trino 1.9.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-193---july-22-2025)

## Сентябрь 2025 {#september-2025}

Дата релиза: 10 сентября 2025 г.

Дата выпуска: 10 сентября 2025 г.

Этот совместимый релиз включает функциональность из следующих версий <Constant name="core" /> OSS:

```
dbt-core==1.10.11

# shared interfaces
dbt-adapters==1.16.6
dbt-common==1.29.0
dbt-semantic-interfaces==0.9.0

# adapters
dbt-athena==1.9.5
dbt-bigquery==1.10.2
dbt-databricks==1.10.12
dbt-extractor==0.6.0
dbt-fabric==1.9.4
dbt-postgres==1.9.1
dbt-protos==1.0.348
dbt-redshift==1.9.5
dbt-sl-sdk[sync]==0.13.0
dbt-snowflake==1.10.2
dbt-spark==1.9.3
dbt-synapse==1.8.4
dbt-teradata==1.10.0
dbt-trino==1.9.3
```

Журналы изменений:
- [dbt-core 1.10.11](https://github.com/dbt-labs/dbt/blob/1.10.latest/CHANGELOG.md#dbt-core-11011---september-04-2025)
- [dbt-adapters 1.16.6](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1166---september-03-2025)
- [dbt-common 1.29.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1290---september-04-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.10.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1101---july-29-2025)
- [dbt-databricks 1.10.12](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-11012-september-8-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/CHANGELOG.md#changelog)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.10.2](http://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.0)
- [dbt-trino 1.9.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-193---july-22-2025)

## August 2025 {#august-2025}

Дата релиза: 12 августа 2025 г.

### Важные изменения в <Constant name="core" /> OSS

Это совместимое обновление включает переход на новую минорную версию `dbt-core`: с `dbt-core==1.9.8` на `dbt-core==1.10.8`. Среди важных изменений этой минорной версии:
- Добавлено несколько новых [предупреждений об устаревании](/reference/deprecations), которые сообщают о несовместимости проектов между <Constant name="core" /> и v2.
- Добавлена поддержка определения `meta` и `tags` в `config` столбцов и экспозиций, а также определения `freshness` в `config` источников. Эти изменения приводят к незначительным изменениям схемы manifest.json, из-за которых при сравнениях с использованием `state:modified` может периодически увеличиваться количество ложноположительных результатов.

### Облачная платформа dbt {#dbt-cloud-based-platform-3}

### Исправления {#fixes}

- Обновлён скрипт генерации публикаций для добавления project и env id в сгенерированный файл публикации
- Использование JSON-потока для скрипта генерации артефактов публикации
- Корректное получение переменных окружения из среды для артефактов публикации
- Добавлены флаги `--resource-type` и `--exclude-resource-type` для команд Semantic Layer
- Приватные пакеты Azure DevOps теперь корректно сопоставляются с Private Package Definition в `packages.yml`

### Под капотом {#under-the-hood-2}

- Подготовка поддержки URL приватных пакетов с несколькими уровнями
- Отключение логгера клиента телеметрии
- Обновление semantic layer SDK до версии 0.11

Этот релиз включает функциональность из следующих версий <Constant name="core" /> OSS:

```
dbt-core==1.10.8

# shared interfaces
dbt-adapters==1.16.3
dbt-common==1.27.1
dbt-semantic-interfaces==0.9.0
dbt-extractor==0.6.0
dbt-protos==1.0.348

# dbt-adapters
dbt-athena==1.9.4
dbt-bigquery==1.10.1
dbt-databricks==1.10.10
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-redshift==1.9.5
dbt-snowflake==1.10.0
dbt-spark==1.9.3
dbt-synapse==1.8.2
dbt-teradata==1.9.3
dbt-trino==1.9.3
```

Журналы изменений:
- [dbt-core 1.10.8](https://github.com/dbt-labs/dbt/blob/1.10.latest/CHANGELOG.md#dbt-core-1108---august-12-2025)
- [dbt-adapters 1.16.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1163---july-21-2025)
- [dbt-common 1.25.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1271---july-21-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1101---july-29-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-1109-august-7-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-1100-rc3---june-24-2025)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.3](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.3)
- [dbt-trino 1.9.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-193---july-22-2025)

## Июль 2025 {#july-2025}

Совместимый релиз, запланированный на июль 2025 года, будет пропущен для дополнительной стабилизации минорного обновления `dbt-core==1.10.0` ([выпущенного 16 июня 2025 г.](https://pypi.org/project/dbt-core/1.10.0/)) на всей платформе dbt.

Совместимые релизы возобновятся в августе 2025 года.

## Июнь 2025 {#june-2025}

Дата релиза: 12 июня 2025 г.

Дата выпуска: 12 июня 2025 г.

Этот выпуск включает функциональность из следующих версий <Constant name="core" /> OSS:

```
dbt-core==1.9.8

# shared interfaces
dbt-adapters==1.15.3
dbt-common==1.25.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.4
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-extractor==0.6.0
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-protos==1.0.317
dbt-redshift==1.9.5
dbt-sl-sdk-internal[sync]==0.7.0
dbt-sl-sdk[sync]==0.7.0
dbt-snowflake==1.9.4
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.2
dbt-trino==1.9.2
```

Журналы изменений:
- [dbt-core 1.9.8](https://github.com/dbt-labs/dbt/blob/1.9.latest/CHANGELOG.md#dbt-core-198---june-10-2025)
- [dbt-adapters 1.15.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1153---may-20-2025)
- [dbt-common 1.25.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1250---may-20-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-194---may-02-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.2)
- [dbt-trino 1.9.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-192---june-03-2025)

## Май 2025 {#may-2025}

Дата релиза: 19 мая 2025 г.

### Облачная платформа dbt {#dbt-cloud-based-platform-4}

Эти изменения отражают возможности, доступные только на платформе dbt.

### Исправления {#fixes-1}

- Корректное получение переменных окружения из среды для артефактов публикации

### Под капотом {#under-the-hood-3}

- Создание JSON-схем для `PublicationArtifact` и `ResolvedProjectsArtifact`

Этот релиз включает функциональность из следующих версий <Constant name="core" /> OSS:
```
dbt-core==1.9.4

# shared interfaces
dbt-adapters==1.14.8
dbt-common==1.24.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.4
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-redshift==1.9.5
dbt-snowflake==1.9.4
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.2
dbt-trino==1.9.1
```

Журналы изменений:
- [dbt-core 1.9.4](https://github.com/dbt-labs/dbt/blob/1.9.latest/CHANGELOG.md#dbt-core-194---april-02-2025)
- [dbt-adapters 1.14.8](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1148---april-25-2025)
- [dbt-common 1.24.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1240---may-09-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-194---may-02-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.2)
- [dbt-trino 1.9.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-191---march-26-2025)

## Апрель 2025 {#april-2025}

Дата релиза: 9 апреля 2025 г.

### dbt Cloud {#dbt-cloud}

Эти изменения отражают возможности, доступные только в dbt Cloud.

### Под капотом {#under-the-hood-4}

- Добавлены вторичные профили в `profile.py`

Этот релиз включает функциональность из следующих версий <Constant name="core" /> OSS:
```
dbt-core==1.9.4

# shared interfaces
dbt-adapters==1.14.5
dbt-common==1.17.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.3
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-redshift==1.9.3
dbt-snowflake==1.9.2
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.2
dbt-trino==1.9.1
```

Журналы изменений:
- [dbt-core 1.9.4](https://github.com/dbt-labs/dbt/blob/1.9.latest/CHANGELOG.md#dbt-core-194---april-02-2025)
- [dbt-adapters 1.14.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1145---april-07-2025)
- [dbt-common 1.17.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1170---march-31-2025)
- [dbt-athena 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-193---april-07-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-193---april-01-2025)
- [dbt-snowflake 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-192---march-07-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.2)
- [dbt-trino 1.9.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-191---march-26-2025)

## Март 2025 {#march-2025}

Дата релиза: 11 марта 2025 г.

Этот релиз включает функциональность следующих версий <Constant name="core" /> OSS:
```
dbt-core==1.9.3

# shared interfaces
dbt-adapters==1.14.1
dbt-common==1.15.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.2
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-fabric==1.9.2
dbt-postgres==1.9.0
dbt-redshift==1.9.1
dbt-snowflake==1.9.2
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.1
dbt-trino==1.9.0
```

Журналы изменений:
- [dbt 1.9.3](https://github.com/dbt-labs/dbt/blob/1.9.latest/CHANGELOG.md#dbt-core-193---march-07-2025)
- [dbt-adapters 1.14.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1141---march-04-2025)
- [dbt-common 1.15.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1150---february-14-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.2](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.2)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-191---march-07-2025)
- [dbt-snowflake 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-192---march-07-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.1](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.1)
- [dbt-trino 1.9.0](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-190---december-20-2024)

## Февраль 2025 {#february-2025}

Дата релиза: 12 февраля 2025 г.

### dbt Cloud {#dbt-cloud-1}

Эти изменения отражают возможности, доступные только в <Constant name="dbt" />.

### Возможности {#features}

- Добавлен [`event_time`](/reference/resource-configs/event-time) в артефакт cross-project ref.
- Включение сообщения исключения отладки в ObservabilityMetric.

### Исправления {#fixes-2}

- Добавлена поддержка deferral для нового определения time spine.
- Исправлены сообщения об ошибках для SL-запросов.
- Команды Semantic Layer теперь учитывают `--favor-state` при запуске с `--defer`.

Этот релиз включает функциональность следующих версий <Constant name="core" /> OSS:
```
dbt-core==1.9.2

# shared interfaces
dbt-adapters==1.14.0
dbt-common==1.14.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.1
dbt-bigquery==1.9.1
dbt-databricks==1.9.4
dbt-fabric==1.9.0
dbt-postgres==1.9.0
dbt-redshift==1.9.0
dbt-snowflake==1.9.1
dbt-spark==1.9.1
dbt-synapse==1.8.2
dbt-teradata==1.9.1
dbt-trino==1.9.0
```

Журналы изменений:
- [dbt 1.9.2](https://github.com/dbt-labs/dbt/blob/1.9.latest/CHANGELOG.md#dbt-core-192---january-29-2025)
- [dbt-adapters 1.14.0](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1140---february-07-2025)
- [dbt-common 1.14.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.4](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-194-jan-30-2024)
- [dbt-fabric 1.9.0](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.0)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.0](https://github.com/dbt-labs/dbt-redshift/blob/1.9.latest/CHANGELOG.md#dbt-redshift-190---december-09-2024)
- [dbt-snowflake 1.9.1](https://github.com/dbt-labs/dbt-snowflake/blob/1.9.latest/CHANGELOG.md#dbt-snowflake-191---february-07-2025)
- [dbt-spark 1.9.1](https://github.com/dbt-labs/dbt-spark/blob/1.9.latest/CHANGELOG.md#dbt-spark-191---february-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.1](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.1)
- [dbt-trino 1.9.0](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-190---december-20-2024)

## January 2025 {#january-2025}

Дата релиза: 14 января 2025 г.

### dbt Cloud {#dbt-cloud-2}

Эти изменения отражают возможности, доступные только в <Constant name="dbt" />.

### Возможности {#features-1}

- Исключение внешних exposures в dbt compare.

### Исправления {#fixes-3}

- Использование `meta.dbt_cloud_id` для построения `unique_id` для вручную определённых exposure при объединении с дублирующимся exposure.

Этот релиз включает функциональность следующих версий <Constant name="core" /> OSS:
```
dbt-core==1.9.1

# shared interfaces
dbt-adapters==1.13.1
dbt-common==1.14.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.0
dbt-bigquery==1.9.1
dbt-databricks==1.9.1
dbt-fabric==1.9.0
dbt-postgres==1.9.0
dbt-redshift==1.9.0
dbt-snowflake==1.9.0
dbt-spark==1.9.0
dbt-synapse==1.8.2
dbt-teradata==1.9.0
dbt-trino==1.9.0
```

Журналы изменений:
- [dbt 1.9.1](https://github.com/dbt-labs/dbt/blob/1.9.latest/CHANGELOG.md#dbt-core-191---december-16-2024)
- [dbt-adapters 1.13.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1131---january-10-2025)
- [dbt-common 1.14.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.1](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-191-december-16-2024)
- [dbt-fabric 1.9.0](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.0)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.0](https://github.com/dbt-labs/dbt-redshift/blob/1.9.latest/CHANGELOG.md#dbt-redshift-190---december-09-2024)
- [dbt-snowflake 1.9.0](https://github.com/dbt-labs/dbt-snowflake/blob/1.9.latest/CHANGELOG.md#dbt-snowflake-190---december-09-2024)
- [dbt-spark 1.9.0](https://github.com/dbt-labs/dbt-spark/blob/1.9.latest/CHANGELOG.md#dbt-spark-190---december-10-2024)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.0)
- [dbt-trino 1.9.0](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-190---december-20-2024)

## Декабрь 2024 {#december-2024}

Дата релиза: 12 декабря 2024 г.

Этот релиз включает функциональность следующих версий <Constant name="core" /> OSS:
```
dbt-core==1.9.0

# shared interfaces
dbt-adapters==1.10.4
dbt-common==1.14.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.0
dbt-bigquery==1.9.0
dbt-databricks==1.9.0
dbt-fabric==1.8.8
dbt-postgres==1.9.0
dbt-redshift==1.9.0
dbt-snowflake==1.9.0
dbt-spark==1.9.0
dbt-synapse==1.8.2
dbt-teradata==1.8.2
dbt-trino==1.8.5
```

Журналы изменений:
- [dbt 1.9.0](https://github.com/dbt-labs/dbt/blob/1.9.latest/CHANGELOG.md#dbt-core-190---december-09-2024)
- [dbt-adapters 1.10.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1104---november-11-2024)
- [dbt-common 1.14.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-bigquery 1.9.0](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-190---december-09-2024)
- [dbt-databricks 1.9.0](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-190-december-9-2024)
- [dbt-fabric 1.8.8](https://github.com/microsoft/dbt-fabric/blob/v1.8.latest/CHANGELOG.md)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.0](https://github.com/dbt-labs/dbt-redshift/blob/1.9.latest/CHANGELOG.md#dbt-redshift-190---december-09-2024)
- [dbt-snowflake 1.9.0](https://github.com/dbt-labs/dbt-snowflake/blob/1.9.latest/CHANGELOG.md#dbt-snowflake-190---december-09-2024)
- [dbt-spark 1.9.0](https://github.com/dbt-labs/dbt-spark/blob/1.9.latest/CHANGELOG.md#dbt-spark-190---december-10-2024)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.8.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.8.2)
- [dbt-trino 1.8.5](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-185---december-11-2024)
