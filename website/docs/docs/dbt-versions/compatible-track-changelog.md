---
title: "Совместимый трек платформы dbt — журнал изменений"
sidebar_label: "Журнал изменений совместимого трека"
description: "Совместимый трек релизов обновляется один раз в месяц и включает актуальные версии open source на момент ежемесячного релиза."
---

Выбирайте треки релизов **"Compatible"** и **"Extended"**, если вам нужен менее частый график обновлений, возможность протестировать новые релизы dbt до их выхода в продакшн и/или постоянная совместимость с последними open source‑релизами <Constant name="core" />.

Каждый ежемесячный релиз **"Compatible"** включает функциональность, соответствующую актуальным на момент релиза open source‑версиям <Constant name="core" /> и адаптеров.

Для получения дополнительной информации см. [треки релизов](/docs/dbt-versions/cloud-release-tracks).

## Декабрь 2025

Дата релиза: 9 декабря 2025 г.

### Платформа dbt (cloud-based)

Этот совместимый релиз включает функциональность следующих версий dbt Core OSS:

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
- [dbt-core 1.10.15](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md#dbt-core-11015---november-12-2025)
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

---

## Ноябрь 2025

Дата релиза: 11 ноября 2025 г.

### Платформа dbt (cloud-based)

### Внутренние изменения (Under the Hood)
- Запись схем столбцов источников, когда установлен `DBT_RECORDER_MODE`
- Дополнительное получение схем столбцов для жёстко заданных ссылок на отношения (relations) в SQL
- Обеспечение потокобезопасности кэша записи схем источников
- Запись схем столбцов для отложенных (deferred) отношений и невыбранных зависимостей

Этот совместимый релиз включает функциональность следующих версий dbt Core OSS:

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
*(список и ссылки сохранены без изменений)*

---

## Октябрь 2025

Дата релиза: 23 октября 2025 г.

### Платформа dbt (cloud-based)

### Внутренние изменения (Under the Hood)
- Добавлена инструментализация методов адаптеров для надёжного сбора трасс отладки на границе адаптера

Этот совместимый релиз включает функциональность следующих версий dbt Core OSS:

```
dbt-core==1.10.13
...
```

Журналы изменений:  
*(список и ссылки сохранены без изменений)*

---

## Сентябрь 2025

Дата релиза: 10 сентября 2025 г.

Этот совместимый релиз включает функциональность следующих версий dbt Core OSS:

```
dbt-core==1.10.11
...
```

Журналы изменений:  
*(список и ссылки сохранены без изменений)*

---

## Август 2025

Дата релиза: 12 августа 2025 г.

### Заметные изменения в dbt Core OSS

Это совместимое обновление включает минорное обновление `dbt-core` — с `dbt-core==1.9.8` до `dbt-core==1.10.8`. Среди наиболее важных изменений этой минорной версии:

- Появление нескольких новых [deprecations](/reference/deprecations), которые предупреждают о несовместимостях проектов между dbt Core и движками Fusion.
- Поддержка определения `meta` и `tags` внутри `config` для столбцов и exposures, а также определения `freshness` внутри `config` для sources. Эти изменения приводят к небольшим эволюциям схемы `manifest.json`, что может вызвать периодическое увеличение количества ложных срабатываний при сравнении `state:modified`.

### Платформа dbt (cloud-based)

### Исправления (Fixes)

- Обновлён скрипт генерации публикаций: добавлены project id и env id в создаваемый файл публикации
- Использование JSON‑потока для скрипта генерации артефактов публикаций
- Корректное получение переменных окружения для артефактов публикаций
- Добавлены флаги `--resource-type` и `--exclude-resource-type` для команд Semantic Layer
- Частные пакеты Azure DevOps теперь корректно сопоставляются с Private Package Definition в `packages.yml`

### Внутренние изменения (Under the Hood)

- Подготовка поддержки URL частных пакетов с несколькими уровнями
- Отключение логгера телеметрического клиента
- Обновление SDK семантического слоя до версии 0.11

*(Далее список версий и changelog’и сохранены без изменений)*

---

## Июль 2025

Совместимый релиз, запланированный на июль 2025 года, будет пропущен, чтобы обеспечить дополнительную стабилизацию минорного обновления `dbt-core==1.10.0` ([релиз от 16 июня 2025 г.](https://pypi.org/project/dbt-core/1.10.0/)) на всей платформе dbt.

Совместимые релизы возобновятся в августе 2025 года.

---

## Июнь 2025

Дата релиза: 12 июня 2025 г.

Этот релиз включает функциональность следующих версий dbt Core OSS:

```
dbt-core==1.9.8
...
```

Журналы изменений:  
*(список и ссылки сохранены без изменений)*

---

## Май 2025

Дата релиза: 19 мая 2025 г.

### Платформа dbt (cloud-based)

Эти изменения отражают возможности, доступные только в платформе dbt.

### Исправления (Fixes)
- Корректное получение переменных окружения для артефактов публикаций

### Внутренние изменения (Under the Hood)
- Создание JSON‑схем для `PublicationArtifact` и `ResolvedProjectsArtifact`

*(Далее список версий и changelog’и сохранены без изменений)*

---

## Апрель 2025

Дата релиза: 9 апреля 2025 г.

### dbt Cloud

Эти изменения отражают возможности, доступные только в dbt Cloud.

### Внутренние изменения (Under the Hood)
- Добавлены вторичные профили в `profile.py`

*(Далее список версий и changelog’и сохранены без изменений)*

---

## Март 2025

Дата релиза: 11 марта 2025 г.

Этот релиз включает функциональность следующих версий <Constant name="core" /> OSS:

```
dbt-core==1.9.3
...
```

*(Журналы изменений сохранены без изменений)*

---

## Февраль 2025

Дата релиза: 12 февраля 2025 г.

### dbt Cloud

Эти изменения отражают возможности, доступные только в <Constant name="cloud" />.

### Возможности (Features)
- Добавлен [`event_time`](/reference/resource-configs/event-time) в артефакт cross-project ref.
- Сообщение об исключении из debug теперь включается в `ObservabilityMetric`.

### Исправления (Fixes)
- Добавлена поддержка deferral для нового определения time spine.
- Исправлены сообщения об ошибках для запросов Semantic Layer.
- Команды Semantic Layer теперь учитывают `--favor-state` при запуске с `--defer`.

*(Далее список версий и changelog’и сохранены без изменений)*

---

## Январь 2025

Дата релиза: 14 января 2025 г.

### dbt Cloud

Эти изменения отражают возможности, доступные только в <Constant name="cloud" />.

### Возможности (Features)
- Исключение внешних exposures из dbt compare.

### Исправления (Fixes)
- Использование `meta.dbt_cloud_id` для формирования `unique_id` при ручном определении exposure, чтобы корректно объединять его с дублирующимся exposure.

*(Далее список версий и changelog’и сохранены без изменений)*

---

## Декабрь 2024

Планируемый релиз: 11-13 декабря

Этот релиз включает функциональность из следующих версий OSS‑компонентов <Constant name="core" />:
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
- [<Constant name="core" /> 1.9.0](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-190---december-09-2024)
- [dbt-adapters 1.10.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1104---november-11-2024)
- [dbt-common 1.14.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-bigquery 1.9.0](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-190---december-09-2024)
- [dbt-databricks 1.9.0](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-190-december-9-2024)
- [dbt-fabric 1.8.8](https://github.com/microsoft/dbt-fabric/blob/v1.8.latest/CHANGELOG.md)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.0](https://github.com/dbt-labs/dbt-redshift/blob/1.9.latest/CHANGELOG.md#dbt-redshift-190---december-09-2024)
- [dbt-snowflake 1.9.0](https://github.com/dbt-labs/dbt-snowflake/blob/1.9.latest/CHANGELOG.md#dbt-snowflake-190---december-09-2024)
- [dbt-spark 1.9.0](https://github.com/dbt-labs/dbt-spark/blob/1.9.latest/CHANGELOG.md#dbt-spark-190---december-10-2024)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.8.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.8.2)
- [dbt-trino 1.8.5](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-185---december-11-2024)
