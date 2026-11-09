---
title: "О команде dbt ls (list)"
sidebar_label: "ls (list)"
description: "Прочтите это руководство, чтобы узнать, как команда dbt ls (list) может использоваться для перечисления ресурсов в вашем проекте dbt."
id: "list"
---

Команда `dbt ls` выводит список ресурсов в вашем проекте dbt. Она принимает аргументы выбора, аналогичные тем, которые используются в [dbt run](/reference/commands/run). `dbt list` — это псевдоним команды `dbt ls`. Хотя `dbt ls` читает ваш [профиль подключения](/docs/local/profiles.yml) для обработки логики, зависящей от [`target`](/reference/dbt-jinja-functions/target), эта команда не подключается к базе данных и не выполняет запросы.

<VersionBlock firstVersion="2.0">
В журналах запусков <Constant name="dbt_platform" /> при использовании <Constant name="fusion_engine" /> результаты для узлов, выбранных командами `dbt ls` и `dbt list`, могут отображаться как **No-op**, если итоговый статус отсутствует. Этот статус заменяет **Unknown** и означает, что dbt выбрал узел, но не выполнил его.
</VersionBlock>

### Использование {#usage}
```
dbt ls
     [--resource-type {model,semantic_model,source,seed,snapshot,metric,test,exposure,analysis,function,default,all}]
     [--select SELECTION_ARG [SELECTION_ARG ...]]
     [--models SELECTOR [SELECTOR ...]]
     [--exclude SELECTOR [SELECTOR ...]]
     [--selector YML_SELECTOR_NAME] # legacy flag; use `--select selector:SELECTOR_NAME` in v1.12+
     [--output {json,name,path,selector}]
     [--output-keys KEY_NAME [KEY_NAME]]
```

Подробнее о выборе ресурсов в dbt см. в разделе [Синтаксис выбора ресурсов](/reference/node-selection/syntax)

**Аргументы**:
- `--resource-type`: Этот флаг ограничивает «типы ресурсов», возвращаемых dbt при выполнении команды `dbt ls`. По умолчанию результаты `dbt ls` включают все типы ресурсов, кроме типа analysis.
- `--select`: Этот флаг задаёт один или несколько аргументов выбора для фильтрации узлов, возвращаемых командой `dbt ls`
- `--models`: Как и флаг `--select`, этот флаг используется для выбора узлов. Он подразумевает `--resource-type=model`, и в результатах команды `dbt ls` будут возвращены только модели. Поддерживается только для обратной совместимости.
- `--exclude`: Указывает селекторы, которые следует _исключить_ из списка возвращаемых узлов.
<VersionBlock lastVersion="1.11">
- `--selector`: Этот флаг задаёт один именованный селектор, определённый в файле `selectors.yml`.
</VersionBlock>
- `--output`: Этот флаг управляет форматом вывода команды `dbt ls`.
- `--output-keys`: Если указано `--output json`, этот флаг определяет, какие свойства узлов включаются в вывод.

Обратите внимание, что команда `dbt ls` не включает модели, которые отключены, или тесты схем, которые зависят от отключенных моделей. Все возвращаемые ресурсы будут иметь значение `config.enabled` равное `true`.

### Примеры использования {#example-usage}

В следующих примерах показано, как использовать команду `dbt ls` для вывода списка ресурсов в вашем проекте.

<!-- no toc -->
  - [Перечень моделей по пакету](#listing-models-by-package)
  - [Перечень тестов по имени тега](#listing-tests-by-tag-name)
  - [Перечень схемных тестов инкрементальных моделей](#listing-schema-tests-of-incremental-models)
  - [Перечень вывода в формате JSON](#listing-json-output)
  - [Перечень вывода в формате JSON с пользовательскими ключами](#listing-json-output-with-custom-keys)
  - [Перечень семантических моделей](#listing-semantic-models)
  - [Перечень функций](#listing-functions)

#### Список моделей по пакету {#listing-models-by-package}

```bash
dbt ls --select snowplow.*
snowplow.snowplow_base_events
snowplow.snowplow_base_web_page_context
snowplow.snowplow_id_map
snowplow.snowplow_page_views
snowplow.snowplow_sessions
...
```

#### Перечисление тестов по имени тега {#listing-tests-by-tag-name}

```bash
dbt ls --select tag:nightly --resource-type test
my_project.schema_test.not_null_orders_order_id
my_project.schema_test.unique_orders_order_id
my_project.schema_test.not_null_products_product_id
my_project.schema_test.unique_products_product_id
...
```

#### Перечисление схемных тестов инкрементальных моделей {#listing-schema-tests-of-incremental-models}

```bash
dbt ls --select config.materialized:incremental,test_type:schema
model.my_project.logs_parsed
model.my_project.events_categorized
```

#### Вывод списка в формате JSON {#listing-json-output}

```bash
dbt ls --select snowplow.* --output json
{"name": "snowplow_events", "resource_type": "model", "package_name": "snowplow",  ...}
{"name": "snowplow_page_views", "resource_type": "model", "package_name": "snowplow",  ...}
...
```

#### Вывод JSON с пользовательским набором ключей {#listing-json-output-with-custom-keys}

```bash
dbt ls --select snowplow.* --output json --output-keys "name resource_type description"
{"name": "snowplow_events", "description": "This is a pretty cool model",  ...}
{"name": "snowplow_page_views", "description": "This model is even cooler",  ...}
...
```

#### Вывод семантических моделей {#listing-semantic-models}

Вывести все ресурсы, находящиеся выше по графу зависимостей относительно семантической модели `orders`:
```bash
dbt ls -s +semantic_model:orders
```

#### Вывод путей к файлам {#listing-file-paths}
```bash
dbt ls --select snowplow.* --output path
models/base/snowplow_base_events.sql
models/base/snowplow_base_web_page_context.sql
models/identification/snowplow_id_map.sql
...
```

#### Вывод функций {#listing-functions}

Перечисление всех функций в вашем проекте:

```bash
dbt list --select "resource_type:function" # or dbt ls --resource-type function
jaffle_shop.area_of_circle
jaffle_shop.whoami
```
