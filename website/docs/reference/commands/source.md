---
title: "О команде dbt source"
sidebar_label: "source"
id: "source"
description: "Используйте команду dbt source для работы с исходными данными в проекте dbt."
---

<VersionBlock firstVersion="2.0">

Команда `dbt source` предоставляет одну устаревшую подкоманду — `dbt source freshness`, которая проверяет только источники.

В версии v2 используйте команду верхнего уровня [`dbt freshness`](/reference/commands/freshness), чтобы одной командой проверять и источники, и модели на соответствие настроенным для них [пороговым значениям свежести данных](/reference/resource-configs/freshness).

</VersionBlock>

<VersionBlock lastVersion="1.99">

Команда `dbt source` предоставляет подкоманду, полезную при работе с исходными данными. Доступная подкоманда — `dbt source freshness`.

</VersionBlock>

### dbt source freshness {#dbt-source-freshness}

### Актуальность {#freshness}

<VersionBlock firstVersion="2.0">

Если в вашем проекте dbt [настроены источники](/docs/build/sources), dbt определяет «актуальность» каждой таблицы источника на основе конфигурации `freshness`, заданной для этого источника. Если данные в таблице устарели, dbt сообщает об этом предупреждением или ошибкой в зависимости от настроек и завершает работу с ненулевым кодом выхода.

Чтобы проверить актуальность источников, выполните команду [`dbt freshness`](/reference/commands/freshness).

</VersionBlock>

<VersionBlock lastVersion="1.99">

### Настройка source freshness {#configure-source-freshness}

Вы также можете использовать [команды проверки свежести источников](/reference/commands/source#source-freshness-commands), чтобы убедиться, что получаемые данные свежие, а не старые или устаревшие.

</VersionBlock>

### Настройка свежести

В примере ниже показано, как настроить проверку свежести источников в dbt. Дополнительную информацию см. в разделе [Объявление свежести источников](/docs/build/sources#declaring-source-freshness).

<File name='models/<filename>.yml'>

```yaml


sources:
  - name: jaffle_shop
    database: raw
    config:
      freshness: # changed to config in v1.9
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}

      loaded_at_field: _etl_loaded_at # changed to config in v1.10

    tables:
      - name: customers

      - name: orders
        config:
          freshness: 
            warn_after: {count: 6, period: hour}
            error_after: {count: 12, period: hour}
            filter: datediff('day', _etl_loaded_at, current_timestamp) < 2

      - name: product_skus
        config:
          freshness: null 
          

```
</File>

Это помогает отслеживать состояние и «здоровье» пайплайна данных.

Вы также можете настроить проверку свежести источников в разделе **Execution settings** на странице **Settings** задания в dbt platform. Дополнительную информацию см. в разделе [Включение проверок свежести источников](/docs/deploy/source-freshness#enabling-source-freshness-checks).


<VersionBlock lastVersion="1.99">

### Команды source freshness {#source-freshness-commands}

Команды source freshness гарантируют, что вы получаете максимально актуальную, релевантную и точную информацию.

Некоторые из наиболее часто используемых команд:

| **Команда** | **Описание** |
| ----------------------------------------------------------------------------| ---------------------------------|
|[`dbt source freshness`](/reference/commands/source#dbt-source-freshness)    |Проверяет актуальность всех источников.|
|[`dbt source freshness --output target/source_freshness.json`](/reference/commands/source#configuring-source-freshness-output)|Выводит информацию об актуальности по другому пути.|
|[`dbt source freshness --select "source:source_name"`](/reference/commands/source#specifying-sources-to-check)|Проверяет актуальность указанных источников.|

</VersionBlock>

<VersionBlock firstVersion="2.0">

### Проверка указанных источников

По умолчанию `dbt freshness` проверяет все источники и модели в вашем проекте, для которых задана конфигурация `freshness`. Чтобы проверить только часть источников, используйте флаг `--select`.

```bash
# Проверить актуальность всех таблиц Snowplow:
$ dbt freshness --select "source:snowplow"

# Проверить актуальность определённой таблицы источника:
$ dbt freshness --select "source:snowplow.event"
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

### Указание источников для проверки

По умолчанию `dbt source freshness` рассчитывает показатели актуальности для всех источников в вашем проекте. Чтобы проверить актуальность только части этих источников, используйте флаг `--select`.

```bash
# Проверить актуальность всех таблиц Snowplow:
$ dbt source freshness --select "source:snowplow"

# Проверить актуальность определённой таблицы источника:
$ dbt source freshness --select "source:snowplow.event"
```

</VersionBlock>

<VersionBlock firstVersion="2.0">

### Результаты проверки актуальности

После завершения `dbt freshness` dbt записывает результаты для проверенных источников и моделей в `target/freshness.json`. Каждая запись содержит поле `resource_type`, указывающее, является ли ресурс источником или моделью. Полную схему см. в разделе [`freshness.json`](/reference/artifacts/freshness-json).

Если в ходе запуска проверяются источники, dbt также записывает `target/sources.json` для обратной совместимости. Этот файл содержит только источники, без поля `resource_type`. Полную схему см. в разделе [`sources.json`](/reference/artifacts/sources-json).

</VersionBlock>

<VersionBlock lastVersion="1.99">

### Настройка вывода результатов проверки актуальности источников

Когда `dbt source freshness` завершится, файл <Term id="json" /> с информацией о свежести ваших источников будет сохранен в `target/sources.json`. Пример `sources.json` будет выглядеть следующим образом:

<File name='target/sources.json'>

```json
{
    "meta": {
        "generated_at": "2019-02-15T00:53:03.971126Z",
        "elapsed_time": 0.21452808380126953
    },
    "sources": {
        "source.project_name.source_name.table_name": {
            "max_loaded_at": "2019-02-15T00:45:13.572836+00:00Z",
            "snapshotted_at": "2019-02-15T00:53:03.880509+00:00Z",
            "max_loaded_at_time_ago_in_s": 481.307673,
            "state": "pass",
            "criteria": {
                "warn_after": {
                    "count": 12,
                    "period": "hour"
                },
                "error_after": {
                    "count": 1,
                    "period": "day"
                }
            }
        }
    }
}

```

</File>

Чтобы изменить место назначения для этого файла `sources.json`, используйте флаг `-o` (или `--output`):
```
# Вывести информацию о свежести источников в другой путь
$ dbt source freshness --output target/source_freshness.json
```

</VersionBlock>

<VersionBlock firstVersion="2.0">

### Использование результатов проверки актуальности

Результаты проверки актуальности помогают понять, поступают ли данные в источник или модель с задержкой и как их актуальность меняется со временем.

Вы можете в любой момент проверить актуальность вручную с помощью [`dbt freshness`](/reference/commands/freshness). Мы также рекомендуем запускать эту проверку по расписанию и сохранять результаты через регулярные интервалы времени. Накопленные за длительный период результаты позволяют получать оповещения о нарушении соглашений об уровне обслуживания (SLA) в отношении актуальности исходных данных и отслеживать, как актуальность меняется со временем.

</VersionBlock>

<VersionBlock lastVersion="1.99">

### Использование проверки актуальности источников

Результаты проверки актуальности источников позволяют понять:

1. Если конкретный источник данных находится в задержанном состоянии
2. Тренда свежести источников данных с течением времени

Эту команду можно запускать вручную в любое время, чтобы определить актуальность исходных данных. Также рекомендуется запускать эту команду по расписанию, сохраняя результаты проверки актуальности через регулярные интервалы. Результаты, накопленные за длительный период, позволят получать оповещения о нарушении SLA по актуальности исходных данных, а также отслеживать, как актуальность меняется со временем.

</VersionBlock>

<Constant name="dbt" /> позволяет легко запускать проверки актуальности по расписанию и предоставляет готовую панель мониторинга, которая показывает состояние актуальности источников, определённых в вашем проекте. Подробнее см. в разделе [Актуальность исходных данных](/docs/build/sources#source-data-freshness).
