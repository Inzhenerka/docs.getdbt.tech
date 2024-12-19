---
title: "Хуки и операции"
description: "Прочитайте этот учебник, чтобы узнать, как использовать хуки и операции при разработке в dbt."
id: "hooks-operations"
---

import OnRunCommands from '/snippets/_onrunstart-onrunend-commands.md';

## Связанная документация
* [pre-hook & post-hook](/reference/resource-configs/pre-hook-post-hook)
* [on-run-start & on-run-end](/reference/project-configs/on-run-start-on-run-end)
* [`run-operation` команда](/reference/commands/run-operation)

### Предполагаемые знания
* [Конфигурации проекта](/reference/dbt_project.yml.md)
* [Конфигурации моделей](/reference/model-configs)
* [Макросы](/docs/build/jinja-macros#macros)

## Начало работы с хуками и операциями

Эффективное администрирование баз данных иногда требует выполнения дополнительных SQL-запросов, например:
- Создание UDF
- Управление правами доступа на уровне строк или столбцов
- Вакуумирование таблиц в Redshift
- Создание разделов в внешних таблицах Redshift Spectrum
- Возобновление/приостановка/изменение размера складов в Snowflake
- Обновление канала в Snowflake
- Создание общего доступа в Snowflake
- Клонирование базы данных в Snowflake

dbt предоставляет хуки и операции, чтобы вы могли контролировать версии и выполнять эти запросы как часть вашего проекта dbt.

## О хуках

Хуки — это фрагменты SQL, которые выполняются в разное время:
  * `pre-hook`: выполняется _перед_ созданием модели, семени или снимка.
  * `post-hook`: выполняется _после_ создания модели, семени или снимка.
  * `on-run-start`: выполняется в _начале_ <OnRunCommands/>
  * `on-run-end`: выполняется в _конце_ <OnRunCommands/>

Хуки — это более продвинутая возможность, которая позволяет вам выполнять пользовательский SQL и использовать специфические для базы данных действия, выходящие за рамки того, что dbt предоставляет из коробки с стандартными материализациями и конфигурациями.

Если (и только если) вы не можете использовать [`grants` resource-config](/reference/resource-configs/grants), вы можете использовать `post-hook` для выполнения более сложных рабочих процессов:

* Необходимо применить `grants` более сложным образом, который конфигурация `grants` в dbt Core (пока) не поддерживает.
* Необходимо выполнить постобработку, которую dbt не поддерживает из коробки. Например, `analyze table`, `alter table set property`, `alter table ... add row access policy` и т.д.

### Примеры использования хуков

Вы можете использовать хуки для запуска действий в определенные моменты при выполнении операции или создании модели, семени или снимка.

Для получения дополнительной информации о том, когда хуки могут быть вызваны, смотрите разделы справки для [`on-run-start` и `on-run-end` хуков](/reference/project-configs/on-run-start-on-run-end) и [`pre-hook` и `post-hook`](/reference/resource-configs/pre-hook-post-hook).

Вы можете использовать хуки для предоставления специфической для базы данных функциональности, недоступной из коробки с dbt. Например, вы можете использовать блок `config`, чтобы выполнить оператор `ALTER TABLE` сразу после создания отдельной модели с помощью `post-hook`:

<File name='models/<model_name>.sql'>

```sql
{{ config(
    post_hook=[
      "alter table {{ this }} ..."
    ]
) }}
```

</File>

### Вызов макроса в хуке

Вы также можете использовать [макрос](/docs/build/jinja-macros#macros) для объединения логики хуков. Ознакомьтесь с некоторыми примерами в разделах справки для [on-run-start и on-run-end хуков](/reference/project-configs/on-run-start-on-run-end) и [pre- и post-hooks](/reference/resource-configs/pre-hook-post-hook).

<File name='models/<model_name>.sql'>

```sql
{{ config(
    pre_hook=[
      "{{ some_macro() }}"
    ]
) }}
```

</File>

<File name='models/properties.yml'>

```yaml
models:
  - name: <model_name>
    config:
      pre_hook:
        - "{{ some_macro() }}"
```

</File>

<File name='dbt_project.yml'>

```yaml
models:
  <project_name>:
    +pre-hook:
      - "{{ some_macro() }}"
```

</File>

## О операциях

Операции — это [макросы](/docs/build/jinja-macros#macros), которые вы можете выполнять с помощью команды [`run-operation`](/reference/commands/run-operation). Таким образом, операции на самом деле не являются отдельным ресурсом в вашем проекте dbt — это просто удобный способ вызвать макрос, не запуская модель.

:::info Явное выполнение SQL в операции
В отличие от хуков, вам нужно явно выполнить запрос внутри макроса, используя либо [statement block](/reference/dbt-jinja-functions/statement-blocks), либо вспомогательный макрос, такой как [run_query](/reference/dbt-jinja-functions/run_query). В противном случае dbt вернет запрос как строку, не выполняя его.
:::

Этот макрос выполняет аналогичное действие, как и вышеупомянутые хуки:

<File name='macros/grant_select.sql'>

```sql
{% macro grant_select(role) %}
{% set sql %}
    grant usage on schema {{ target.schema }} to role {{ role }};
    grant select on all tables in schema {{ target.schema }} to role {{ role }};
    grant select on all views in schema {{ target.schema }} to role {{ role }};
{% endset %}

{% do run_query(sql) %}
{% do log("Privileges granted", info=True) %}
{% endmacro %}

```

</File>

Чтобы вызвать этот макрос как операцию, выполните `dbt run-operation grant_select --args '{role: reporter}'`.

```
$ dbt run-operation grant_select --args '{role: reporter}'
Running with dbt=0.16.1
Privileges granted

```

Полная документация по использованию команды `run-operation` доступна [здесь](/reference/commands/run-operation).

## Дополнительные примеры

Эти примеры из сообщества подчеркивают некоторые случаи использования хуков и операций!

* [Подробное обсуждение предоставления привилегий с использованием хуков и операций для версий dbt Core до 1.2](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)
* [Стадирование внешних таблиц](https://github.com/dbt-labs/dbt-external-tables)
* [Выполнение клонирования без копирования в Snowflake для сброса среды разработки](https://discourse.getdbt.com/t/creating-a-dev-environment-quickly-on-snowflake/1151/2)
* [Выполнение `vacuum` и `analyze` на складе Redshift](https://github.com/dbt-labs/redshift/tree/0.2.3/#redshift_maintenance_operation-source)
* [Создание общего доступа в Snowflake](https://discourse.getdbt.com/t/how-drizly-is-improving-collaboration-with-external-partners-using-dbt-snowflake-shares/1110)
* [Выгрузка файлов в S3 на Redshift](https://github.com/dbt-labs/redshift/tree/0.2.3/#unload_table-source)
* [Создание событий аудита для времени модели](https://github.com/dbt-labs/dbt-event-logging)
* [Создание UDF](https://discourse.getdbt.com/t/using-dbt-to-manage-user-defined-functions/18)