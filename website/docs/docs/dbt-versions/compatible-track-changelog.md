---
title: "Совместимый трек платформы dbt — журнал изменений"
sidebar_label: "Журнал изменений совместимого трека"
description: "Совместимый трек релизов обновляется раз в месяц и включает актуальные версии open source на момент ежемесячного релиза."
---

Выбирайте релизные треки **Compatible** и **Extended**, если вам нужен менее частый выпуск релизов, возможность протестировать новые версии dbt до их выхода в продакшен и/или постоянная совместимость с последними open source-релизами <Constant name="core" />.

Каждый ежемесячный релиз **Compatible** включает функциональность, соответствующую актуальным open source-версиям <Constant name="core" /> и адаптеров на момент выпуска.

Подробнее см. в разделе [release tracks](/docs/dbt-versions/cloud-release-tracks).

## Декабрь 2025

Дата релиза: 9 декабря 2025 г.

### Облачная платформа dbt

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

## Ноябрь 2025

Дата релиза: 11 ноября 2025 г.

### Облачная платформа dbt 

### Под капотом
- Запись схем столбцов источников, когда установлен `DBT_RECORDER_MODE`
- Дополнительное получение схем столбцов для жёстко заданных ссылок на отношения в SQL
- Потокобезопасный кэш для записи схем источников
- Запись схем столбцов для отложенных отношений и невыбранных зависимостей

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

## Октябрь 2025

Дата релиза: 23 октября 2025 г.

### Облачная платформа dbt 

### Под капотом
- Добавлена инструментация методов адаптеров для надёжных трассировок отладки на границе адаптера

Этот совместимый релиз включает функциональность следующих версий dbt Core OSS:

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
- [dbt-core 1.10.13](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md#dbt-core-11013---september-25-2025)
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

## Сентябрь 2025

Дата релиза: 10 сентября 2025 г.

Этот совместимый релиз включает функциональность следующих версий dbt Core OSS:

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
- [dbt-core 1.10.11](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md#dbt-core-11011---september-04-2025)
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

## August 2025

Дата релиза: 12 августа 2025 г.

### Заметные изменения в dbt Core OSS

Это совместимое обновление включает минорное обновление `dbt-core` — с `dbt-core==1.9.8` до `dbt-core==1.10.8`. Среди наиболее важных изменений в этой минорной версии:
- Введение нескольких новых [deprecations](/reference/deprecations), которые предупреждают о несовместимостях проектов между dbt Core и движками Fusion.
- Поддержка определения `meta` и `tags` внутри `config` для колонок и exposures, а также определения `freshness` внутри `config` для sources. Эти изменения приводят к небольшим эволюциям схемы `manifest.json`, что может вызывать периодическое увеличение ложных срабатываний при сравнении `state:modified`.

### Облачная платформа dbt 

### Исправления

- Обновлён скрипт генерации публикаций для добавления project и env id в сгенерированный файл публикации
- Использование JSON-потока для скрипта генерации артефактов публикации
- Корректное получение переменных окружения из среды для артефактов публикации
- Добавлены флаги `--resource-type` и `--exclude-resource-type` для команд Semantic Layer
- Приватные пакеты Azure DevOps теперь корректно сопоставляются с Private Package Definition в `packages.yml`

### Под капотом

- Подготовка поддержки URL приватных пакетов с несколькими уровнями
- Отключение логгера клиента телеметрии
- Обновление semantic layer SDK до версии 0.11

Этот релиз включает функциональность следующих версий dbt Core OSS:

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
- [dbt-core 1.10.8](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md#dbt-core-1108---august-12-2025)
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

## Июль 2025

Совместимый релиз, запланированный на июль 2025 года, будет пропущен для дополнительной стабилизации минорного обновления `dbt-core==1.10.0` ([выпущенного 16 июня 2025 г.](https://pypi.org/project/dbt-core/1.10.0/)) на всей платформе dbt.

Совместимые релизы возобновятся в августе 2025 года.

## Июнь 2025

Дата релиза: 12 июня 2025 г.

Этот релиз включает функциональность следующих версий dbt Core OSS:

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
- [dbt-core 1.9.8](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-198---june-10-2025)
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

## Май 2025

Дата релиза: 19 мая 2025 г.

### Облачная платформа dbt

Эти изменения отражают возможности, доступные только на платформе dbt.

### Исправления

- Корректное получение переменных окружения из среды для артефактов публикации

### Под капотом

- Создание JSON-схем для `PublicationArtifact` и `ResolvedProjectsArtifact`

Этот релиз включает функциональность следующих версий dbt Core OSS:
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
- [dbt-core 1.9.4](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-194---april-02-2025)
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

## Апрель 2025

Дата релиза: 9 апреля 2025 г.

### dbt Cloud 

Эти изменения отражают возможности, доступные только в dbt Cloud.

### Под капотом

- Добавлены вторичные профили в `profile.py`

Этот релиз включает функциональность следующих версий dbt Core OSS:
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
- [dbt-core 1.9.4](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-194---april-02-2025)
- [dbt-adapters 1.14.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1145---april-07-2025)
- [dbt-common 1.17.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1170---march-31-2025)
- [dbt-athena 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-193---april-07-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-193---april-01-2025)
- [dbt-snowflake 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-192---march-07-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.2)
- [dbt-trino 1.9.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-191---march-26-2025)

## Март 2025

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
- [<Constant name="core" /> 1.9.3](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-193---march-07-2025)
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

## Февраль 2025

Дата релиза: 12 февраля 2025 г.

### dbt Cloud 

Эти изменения отражают возможности, доступные только в <Constant name="cloud" />.

### Возможности

- Добавлен [`event_time`](/reference/resource-configs/event-time) в артефакт cross-project ref.
- Включение сообщения исключения отладки в ObservabilityMetric.

### Исправления

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
- [<Constant name="core" /> 1.9.2](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-192---january-29-2025)
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

## January 2025

Дата релиза: 14 января 2025 г.

### dbt Cloud 

Эти изменения отражают возможности, доступные только в <Constant name="cloud" />.

### Возможности

- Исключение внешних exposures в dbt compare.

### Исправления

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
- [<Constant name="core" /> 1.9.1](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-191---december-16-2024)
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

## Декабрь 2024

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
