---
title: "О команде dbt source"
sidebar_label: "source"
id: "source"
---

Команда `dbt source` предоставляет подкоманды, которые полезны при работе с исходными данными. Эта команда включает одну подкоманду — `dbt source freshness`.

### dbt source freshness {#dbt-source-freshness}

Если ваш проект dbt [настроен с источниками](/docs/build/sources), то команда `dbt source freshness` выполнит запрос ко всем определенным исходным таблицам, определяя "свежесть" этих таблиц. Если таблицы устарели (на основе конфигурации `freshness`, указанной для ваших источников), то dbt сообщит предупреждение или ошибку соответственно. Если исходная <Term id="table" /> находится в устаревшем состоянии, то dbt завершится с ненулевым кодом выхода.

Вы также можете использовать [команды source freshness](/reference/commands/source#source-freshness-commands), чтобы убедиться, что получаемые данные являются актуальными, а не старыми или устаревшими.

### Настройка source freshness {#configure-source-freshness}

В примере ниже показано, как настроить source freshness в dbt. Подробнее см. в разделе [Declaring source freshness](/docs/build/sources#declaring-source-freshness).

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

Вы также можете настроить source freshness в разделе **Execution settings** на странице **Settings** вашего задания в <Constant name="cloud" />. Подробнее см. в разделе [Enabling source freshness snapshots](/docs/deploy/source-freshness#enabling-source-freshness-snapshots).

### Команды source freshness {#source-freshness-commands}

Команды source freshness гарантируют, что вы получаете максимально актуальную, релевантную и точную информацию.

Некоторые из наиболее часто используемых команд:

| **Command**                                                                 | **Description**                  | 
| ----------------------------------------------------------------------------| ---------------------------------|
|[`dbt source freshness`](/reference/commands/source#dbt-source-freshness)    |Проверяет «freshness» для всех источников.|
|[`dbt source freshness --output target/source_freshness.json`](/reference/commands/source#configuring-source-freshness-output)|Выводит информацию о «freshness» в другой путь.|
|[`dbt source freshness --select "source:source_name"`](/reference/commands/source#specifying-sources-to-snapshot)|Проверяет «freshness» для конкретных источников.|

### Указание источников для snapshot {#specifying-sources-to-snapshot}

По умолчанию `dbt source freshness` будет вычислять информацию о свежести для всех источников в вашем проекте. Чтобы сделать снимок свежести для подмножества этих источников, используйте флаг `--select`.

```bash
# Сделать снимок свежести для всех таблиц Snowplow:
$ dbt source freshness --select "source:snowplow"

# Сделать снимок свежести для конкретной исходной таблицы:
$ dbt source freshness --select "source:snowplow.event"
```

### Настройка вывода свежести источников {#configuring-source-freshness-output}

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

### Использование свежести источников {#using-source-freshness}

Снимки свежести источников могут быть использованы для понимания:

1. Если конкретный источник данных находится в задержанном состоянии
2. Тренда свежести источников данных с течением времени

Эту команду можно запускать вручную, чтобы определить состояние свежести ваших исходных данных в любое время. Также рекомендуется запускать эту команду по расписанию, сохраняя результаты снимка свежести через регулярные интервалы. Эти продольные снимки позволят получать уведомления, когда нарушаются SLA свежести данных источников, а также понимать тренд свежести с течением времени.

<Constant name="cloud" /> упрощает создание снапшотов свежести источников по расписанию и предоставляет готовый дашборд, который показывает состояние свежести для всех источников, определённых в вашем проекте. Подробнее о создании снапшотов свежести в <Constant name="cloud" /> см. в [документации](/docs/build/sources#source-data-freshness).
