---
title: "Разбор SQL"
id: "sqlparse"
sidebar: "sqlparse"
description: "Настройка ограничений группировки sqlparse при компиляции SQL в dbt."
---

dbt использует библиотеку Python [`sqlparse`](https://pypi.org/project/sqlparse/) для разбора SQL. Для больших или сложных запросов может потребоваться настроить группировку токенов в `sqlparse`, чтобы избежать проблем с производительностью или достижения ограничений при разборе.

Вы можете использовать флаг `--sqlparse`, чтобы настроить группировку токенов в `sqlparse`. Этот флаг позволяет задать ограничения группировки, описанные в разделе [«Безопасность и производительность» документации sqlparse](https://sqlparse.readthedocs.io/en/latest/api.html#security-and-performance-considerations).

Поддерживаемые ключи:

<SimpleTable>
| Ключ | Назначение |
| --- | --- |
| `MAX_GROUPING_DEPTH` | Задаёт максимальную глубину вложенности при группировке токенов |
| `MAX_GROUPING_TOKENS` | Задаёт максимальное количество токенов, которые можно сгруппировать за один раз |
</SimpleTable>

<br></br>

Каждый ключ принимает одно значение: целое число или `null`. Значение по умолчанию для обоих ключей — `null`, что означает, что dbt не задаёт пользовательское ограничение.

`sqlparse` применяет встроенные ограничения (`MAX_GROUPING_DEPTH = 100` и `MAX_GROUPING_TOKENS = 10000`), чтобы предотвратить чрезмерное использование ресурсов. Установка значения `null` полностью отключает соответствующее ограничение.

Например, следующая команда задаёт оба ограничения группировки:

```bash
dbt compile --sqlparse '{"MAX_GROUPING_DEPTH": 200, "MAX_GROUPING_TOKENS": 20000}'
```

Вы можете настроить только один ключ, чтобы задать одно ограничение. Любой неуказанный ключ по умолчанию принимает значение `null`. В следующем примере только ограничение глубины увеличивается до `500`; `MAX_GROUPING_TOKENS` не задан, поэтому `sqlparse` не применяет ограничение количества токенов при этом запуске.

```bash
dbt compile --sqlparse '{"MAX_GROUPING_DEPTH": 500}'
```

Если ключи не указаны, оба ограничения остаются незаданными (`null`), и `sqlparse` не применяет никаких ограничений группировки.

Вы можете использовать `--sqlparse` со следующими командами:

- [`dbt compile`](/reference/commands/compile)
- [`dbt run`](/reference/commands/run)
- [`dbt build`](/reference/commands/build)
- [`dbt test`](/reference/commands/test)
- [`dbt seed`](/reference/commands/seed)
- [`dbt snapshot`](/reference/commands/snapshot)
- [`dbt source freshness`](/reference/commands/source#freshness)
- [`dbt docs generate`](/reference/commands/cmd-docs?version=1.12#dbt-docs-generate)
- [`dbt show`](/reference/commands/show)
