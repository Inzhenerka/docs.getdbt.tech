---
title: "Хуки и операции"  
description: "Настройка рабочих процессов dbt с использованием хуков и операций."
id: "hooks-operations"
---

import OnRunCommands from '/snippets/_onrunstart-onrunend-commands.md';

## Связанная документация
* [pre-hook & post-hook](/reference/resource-configs/pre-hook-post-hook)
* [on-run-start & on-run-end](/reference/project-configs/on-run-start-on-run-end)
* [`run-operation` command](/reference/commands/run-operation)

### Предполагаемые знания
* [Конфигурации проекта](/reference/dbt_project.yml.md)
* [Конфигурации моделей](/reference/model-configs)
* [Макросы](/docs/build/jinja-macros#macros)

## Начало работы с хуками и операциями

Эффективное администрирование баз данных иногда требует выполнения дополнительных SQL-запросов, например:
- Создание UDF
- Управление разрешениями на уровне строк или столбцов
- Очистка таблиц в Redshift
- Создание разделов в внешних таблицах Redshift Spectrum
- Возобновление/приостановка/изменение размера складов в Snowflake
- Обновление pipe в Snowflake
- Создание общего доступа в Snowflake
- Клонирование базы данных в Snowflake

dbt предоставляет хуки и операции, чтобы вы могли контролировать версии и выполнять эти запросы как часть вашего проекта dbt.

## О хуках

Хуки — это фрагменты SQL, которые выполняются в разное время:
  * `pre-hook`: выполняется _перед_ построением модели, seed или snapshot.
  * `post-hook`: выполняется _после_ построения модели, seed или snapshot.
  * `on-run-start`: выполняется в _начале_ <OnRunCommands/>
  * `on-run-end`: выполняется в _конце_ <OnRunCommands/>

Хуки — это более продвинутая возможность, которая позволяет вам выполнять пользовательский SQL и использовать специфические для базы данных действия, выходящие за рамки того, что dbt предоставляет из коробки с помощью стандартных материализаций и конфигураций.

Если (и только если) вы не можете использовать [`grants` resource-config](/reference/resource-configs/grants), вы можете использовать `post-hook` для выполнения более сложных рабочих процессов:

* Необходимо применить `grants` более сложным способом, который конфигурация `grants` в dbt Core пока не поддерживает.
* Необходимо выполнить пост-обработку, которую dbt не поддерживает из коробки. Например, `analyze table`, `alter table set property`, `alter table ... add row access policy` и т.д.

### Примеры использования хуков

Вы можете использовать хуки для запуска действий в определенные моменты при выполнении операции или построении модели, seed или snapshot.

Для получения дополнительной информации о том, когда могут быть вызваны хуки, см. разделы справки для [`on-run-start` и `on-run-end` хуков](/reference/project-configs/on-run-start-on-run-end) и [`pre-hook` и `post-hook`](/reference/resource-configs/pre-hook-post-hook).

Вы можете использовать хуки для предоставления специфичной для базы данных функциональности, недоступной из коробки в dbt. Например, вы можете использовать блок `config` для выполнения оператора `ALTER TABLE` сразу после построения отдельной модели с помощью `post-hook`:

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

Вы также можете использовать [макрос](/docs/build/jinja-macros#macros) для объединения логики хука. Ознакомьтесь с некоторыми примерами в разделах справки для [on-run-start и on-run-end хуков](/reference/project-configs/on-run-start-on-run-end) и [pre- и post-хуков](/reference/resource-configs/pre-hook-post-hook).

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

## Операции

Операции — это [макросы](/docs/build/jinja-macros#macros), которые вы можете выполнять с помощью команды [`run-operation`](/reference/commands/run-operation). Таким образом, операции на самом деле не являются отдельным ресурсом в вашем проекте dbt — это просто удобный способ вызвать макрос без необходимости выполнения модели.

:::info Явное выполнение SQL в операции
В отличие от хуков, вам нужно явно выполнить запрос внутри макроса, используя либо [statement block](/reference/dbt-jinja-functions/statement-blocks), либо вспомогательный макрос, такой как макрос [run_query](/reference/dbt-jinja-functions/run_query). В противном случае dbt вернет запрос в виде строки без его выполнения.
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
Running with dbt=1.6.0
Privileges granted

```

Полная документация по использованию команды `run-operation` доступна [здесь](/reference/commands/run-operation).

## Дополнительные примеры

Эти примеры из сообщества подчеркивают некоторые случаи использования хуков и операций!

Эти примеры от сообщества демонстрируют некоторые сценарии использования хуков и операций:

* [Подробное обсуждение выдачи привилегий с использованием хуков и операций для версий <Constant name="core" /> ниже 1.2](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)
* [Подготовка (staging) внешних таблиц](https://github.com/dbt-labs/dbt-external-tables)
* [Выполнение zero copy clone в Snowflake для сброса dev-окружения](https://discourse.getdbt.com/t/creating-a-dev-environment-quickly-on-snowflake/1151/2)
* [Запуск `vacuum` и `analyze` в хранилище Redshift](https://github.com/dbt-labs/redshift/tree/0.2.3/#redshift_maintenance_operation-source)
* [Создание Snowflake share](https://discourse.getdbt.com/t/how-drizly-is-improving-collaboration-with-external-partners-using-dbt-snowflake-shares/1110)
* [Выгрузка файлов в S3 на Redshift](https://github.com/dbt-labs/redshift/tree/0.2.3/#unload_table-source)
* [Создание audit-событий для измерения времени выполнения моделей](https://github.com/dbt-labs/dbt-event-logging)
* [Создание UDF](https://discourse.getdbt.com/t/using-dbt-to-manage-user-defined-functions/18)
