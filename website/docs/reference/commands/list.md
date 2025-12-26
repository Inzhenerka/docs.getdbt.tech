---
title: "О команде dbt ls (list)"
sidebar_label: "ls (list)"
description: "Прочтите это руководство, чтобы узнать, как команда dbt ls (list) может использоваться для перечисления ресурсов в вашем проекте dbt."
id: "list"
---

Команда `dbt ls` перечисляет ресурсы в вашем проекте dbt. Она принимает аргументы селектора, которые аналогичны тем, что предоставляются в [dbt run](/reference/commands/run). `dbt list` является псевдонимом для `dbt ls`. Хотя `dbt ls` будет читать ваш [профиль подключения](/docs/core/connect-data-platform/connection-profiles) для разрешения логики, специфичной для [`target`](/reference/dbt-jinja-functions/target), эта команда не будет подключаться к вашей базе данных или выполнять какие-либо запросы.

### Использование
```
dbt ls
     [--resource-type {model,semantic_model,source,seed,snapshot,metric,test,exposure,analysis,function,default,all}]
     [--select SELECTION_ARG [SELECTION_ARG ...]]
     [--models SELECTOR [SELECTOR ...]]
     [--exclude SELECTOR [SELECTOR ...]]
     [--selector YML_SELECTOR_NAME]
     [--output {json,name,path,selector}]
     [--output-keys KEY_NAME [KEY_NAME]]
```

Смотрите [синтаксис выбора ресурсов](/reference/node-selection/syntax) для получения дополнительной информации о том, как выбирать ресурсы в dbt.

**Аргументы**:
- `--resource-type`: Этот флаг ограничивает "типы ресурсов", возвращаемые dbt в команде `dbt ls`. По умолчанию все типы ресурсов включены в результаты `dbt ls`, за исключением типа анализа.
- `--select`: Этот флаг указывает один или несколько аргументов выбора, используемых для фильтрации узлов, возвращаемых командой `dbt ls`.
- `--models`: Как и флаг `--select`, этот флаг используется для выбора узлов. Он подразумевает `--resource-type=model` и будет возвращать только модели в результатах команды `dbt ls`. Поддерживается только для обратной совместимости.
- `--exclude`: Укажите селекторы, которые должны быть _исключены_ из списка возвращаемых узлов.
- `--selector`: Этот флаг указывает один именованный селектор, определенный в файле `selectors.yml`.
- `--output`: Этот флаг управляет форматом вывода команды `dbt ls`.
- `--output-keys`: Если `--output json`, этот флаг управляет тем, какие свойства узла включены в вывод.

Обратите внимание, что команда `dbt ls` не включает модели, которые отключены, или тесты схем, которые зависят от отключенных моделей. Все возвращаемые ресурсы будут иметь значение `config.enabled` равное `true`.

### Примеры использования

В следующих примерах показано, как использовать команду `dbt ls` для вывода списка ресурсов в вашем проекте.

<!-- no toc -->
  - [Listing models by package](#listing-models-by-package)
  - [Listing tests by tag name](#listing-tests-by-tag-name)
  - [Listing schema tests of incremental models](#listing-schema-tests-of-incremental-models)
  - [Listing JSON output](#listing-json-output)
  - [Listing JSON output with custom keys](#listing-json-output-with-custom-keys)
  - [Listing semantic models](#listing-semantic-models)
  - [Listing functions](#listing-functions)

#### Listing models by package

```bash
dbt ls --select snowplow.*
```
snowplow.snowplow_base_events
snowplow.snowplow_base_web_page_context
snowplow.snowplow_id_map
snowplow.snowplow_page_views
snowplow.snowplow_sessions
...
```

#### Перечисление тестов по имени тега

```bash
dbt ls --select tag:nightly --resource-type test
```
my_project.schema_test.not_null_orders_order_id
my_project.schema_test.unique_orders_order_id
my_project.schema_test.not_null_products_product_id
my_project.schema_test.unique_products_product_id
...
```

#### Перечисление схемных тестов инкрементальных моделей

```bash
dbt ls --select config.materialized:incremental,test_type:schema
```
model.my_project.logs_parsed
model.my_project.events_categorized
```

#### Вывод списка в формате JSON

```bash
dbt ls --select snowplow.* --output json
```
{"name": "snowplow_events", "resource_type": "model", "package_name": "snowplow",  ...}
{"name": "snowplow_page_views", "resource_type": "model", "package_name": "snowplow",  ...}
...
```

#### Вывод JSON с пользовательским набором ключей    

```bash
dbt ls --select snowplow.* --output json --output-keys "name resource_type description"
{"name": "snowplow_events", "description": "This is a pretty cool model",  ...}
{"name": "snowplow_page_views", "description": "This model is even cooler",  ...}
...
```

В этом примере команда выводит результаты в формате JSON и включает только указанные ключи (`name`, `resource_type`, `description`) для каждого ресурса.

#### Вывод семантических моделей

Вывести все ресурсы, находящиеся выше по графу зависимостей относительно семантической модели `orders`:

```bash
dbt ls -s +semantic_model:orders
```

#### Вывод путей к файлам

```bash
```
dbt ls --select snowplow.* --output path
models/base/snowplow_base_events.sql
models/base/snowplow_base_web_page_context.sql
models/identification/snowplow_id_map.sql
...
```
#### Listing functions

Перечисление всех функций в вашем проекте:

```bash
dbt list --select "resource_type:function" # or dbt ls --resource-type function
jaffle_shop.area_of_circle
jaffle_shop.whoami
```
