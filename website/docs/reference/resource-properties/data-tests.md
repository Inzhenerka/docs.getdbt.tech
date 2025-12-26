---
title: "О свойстве data tests"
description: "Справочное руководство по свойствам ресурсов, доступным для data tests в dbt."
sidebar_label: "Data tests"
resource_types: all
datatype: data-test
keywords: [test, tests, custom tests, custom test name, test name]
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
  ]
}>

<TabItem value="models">

<File name='models/<filename>.yml'>

```yml

models:
  - name: <model_name>
    data_tests:
      - [<test_name>](#custom-data-test-name):
          arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
            <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/data-test-configs): <config-value>

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        data_tests:
          - [<test_name>](#custom-data-test-name)
          - [<test_name>](#custom-data-test-name):
              arguments:
                <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/data-test-configs): <config-value>
```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/<filename>.yml'>

```yml

sources:
  - name: <source_name>
    tables:
    - name: <table_name>
      data_tests:
        - [<test_name>](#custom-data-test-name)
        - [<test_name>](#custom-data-test-name):
            arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
              <argument_name>: <argument_value>
            [config](/reference/resource-properties/config):
              [<test_config>](/reference/data-test-configs): <config-value>

      columns:
        - name: <column_name>
          data_tests:
            - [<test_name>](#custom-data-test-name)
            - [<test_name>](#custom-data-test-name):
                arguments:
                  <argument_name>: <argument_value>
                [config](/reference/resource-properties/config):
                  [<test_config>](/reference/data-test-configs): <config-value>

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/<filename>.yml'>

```yml

seeds:
  - name: <seed_name>
    data_tests:
      - [<test_name>](#custom-data-test-name)
      - [<test_name>](#custom-data-test-name):
          arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
            <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/data-test-configs): <config-value>

    columns:
      - name: <column_name>
        data_tests:
          - [<test_name>](#custom-data-test-name)
          - [<test_name>](#custom-data-test-name):
              arguments:
                <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/data-test-configs): <config-value>

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.yml'>

```yml

snapshots:
  - name: <snapshot_name>
    data_tests:
      - [<test_name>](#custom-data-test-name)
      - [<test_name>](#custom-data-test-name):
          arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
            <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/data-test-configs): <config-value>

    columns:
      - name: <column_name>
        data_tests:
          - [<test_name>](#custom-data-test-name)
          - [<test_name>](#custom-data-test-name):
              arguments:
                <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/data-test-configs): <config-value>

```

</File>

</TabItem>


<TabItem value="analyses">

Эта функция не реализована для анализов.

</TabItem>

</Tabs>

## Связанная документация

* [Руководство по тестированию данных](/docs/build/data-tests)

## Описание

Свойство `data_tests` определяет проверки (assertions) для столбца, <Term id="table" /> или <Term id="view" />. Это свойство содержит список [обобщённых тестов данных](/docs/build/data-tests#generic-data-tests), на которые ссылаются по имени; в него могут входить четыре встроенных обобщённых теста, доступных в dbt. Например, вы можете добавить тесты данных, которые гарантируют, что столбец не содержит дубликатов и нулевых значений. Любые аргументы или [конфигурации](/reference/data-test-configs), передаваемые в эти тесты данных, должны быть вложены в свойство `arguments`.

После определения этих тестов данных вы можете проверить их корректность, выполнив команду `dbt test`.

## Готовые тесты данных

Существует четыре общих теста данных, которые доступны из коробки для всех пользователей dbt.

### `not_null`

Этот тест данных проверяет, что в столбце отсутствуют значения `null`.

<File name='models/<filename>.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - not_null
```

</File>

### `unique`

Этот data test проверяет, что в поле отсутствуют дублирующиеся значения.

Параметр `config` и выражение `where` являются необязательными.

<File name='models/<filename>.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique:
              config:
                where: "order_id > 21"
```

</File>

### `accepted_values`

Этот тест данных проверяет, что все **не-`null`** значения в колонке присутствуют в предоставленном списке `values`. Если в колонке обнаруживаются какие-либо значения, отсутствующие в этом списке, тест данных завершится с ошибкой.

Тест `accepted_values` поддерживает необязательный параметр `quote`, который по умолчанию будет заключать в одинарные кавычки список допустимых значений в запросе теста. Чтобы протестировать нестроковые значения (например, целые числа или логические значения), явно установите конфигурацию `quote` в `false`.

<File name='schema.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ['placed', 'shipped', 'completed', 'returned']

      - name: status_id
        data_tests:
          - accepted_values:
              arguments:
                values: [1, 2, 3, 4]
                quote: false
```

</File>

### `relationships`

Этот тест данных проверяет, что у всех записей в дочерней таблице `<Term id="table" />` есть соответствующая запись в родительской таблице. Это свойство называется «референциальной целостностью» (referential integrity). Тест автоматически исключает значения `NULL` из проверки — так же, как это делают ограничения внешних ключей в базах данных. Если значения `NULL` должны приводить к ошибкам, используйте тест `not_null` отдельно.

Следующий пример проверяет, что каждый `customer_id` заказа соответствует действительному `customer`.

<File name='schema.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: customer_id
        data_tests:
          - relationships:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                to: ref('customers')
                field: id
```

</File>

Аргумент `to` принимает [Relation](/reference/dbt-classes#relation) – это означает, что вы можете передать ему `ref` на модель (например, `ref('customers')`), или `source` (например, `source('jaffle_shop', 'customers')`).

## Дополнительные примеры

### Тестирование выражения
Некоторые тесты данных требуют нескольких столбцов, поэтому их не имеет смысла вкладывать под ключом `columns:`. В этом случае вы можете применить тест данных к модели (или источнику, seed, или снимку):

<File name='models/orders.yml'>

```yaml

models:
  - name: orders
    description: 
        Order overview data mart, offering key details for each order including if it's a customer's first order and a food vs. drink item breakdown. One row per order.
    data_tests:
      - dbt_utils.expression_is_true:
          arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
            expression: "order_items_subtotal = subtotal"
      - dbt_utils.expression_is_true:
          arguments:
            expression: "order_total = subtotal + tax_paid"
```
</File>

В этом примере основное внимание уделяется тестированию выражений, чтобы убедиться, что `order_items_subtotal` равен `subtotal`, а `order_total` корректно суммирует `subtotal` и `tax_paid`.

### Использование пользовательского обобщённого (generic) теста данных

Если вы определили собственный пользовательский обобщённый тест данных, вы можете использовать его в качестве `test_name`:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - primary_key  # name of my custom generic test

```

</File>

Ознакомьтесь с руководством по написанию [пользовательского обобщённого теста данных](/best-practices/writing-custom-generic-tests), чтобы получить больше информации.

### Пользовательское имя теста данных

По умолчанию dbt синтезирует имя для обобщённого data test, объединяя:

- имя теста (`not_null`, `unique` и т.д.)
- имя модели (или source/seed/snapshot)
- имя колонки (если применимо)
- аргументы (если применимо, например `values` для `accepted_values`)

При этом в имя не включаются никакие конфигурации data test. Если получившееся объединённое имя слишком длинное, dbt вместо него использует усечённую и захэшированную версию. Цель этого механизма — сохранить уникальные идентификаторы для всех ресурсов в проекте, включая тесты.

Вы также можете задать собственное имя для конкретного data test с помощью свойства `name`.

**Когда это может понадобиться?** Подход dbt по умолчанию иногда приводит к довольно странным (и не очень красивым) именам data test. Определив пользовательское имя, вы получаете полный контроль над тем, как тест будет выглядеть в логах и метаданных. Кроме того, вы сможете выбирать этот data test по заданному имени.

<File name='models/<filename>.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              name: unexpected_order_status_today
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
```

</File>

```sh
$ dbt test --select unexpected_order_status_today
12:43:41  Running with dbt=1.1.0
12:43:41  Found 1 model, 1 test, 0 snapshots, 0 analyses, 167 macros, 0 operations, 1 seed file, 0 sources, 0 exposures, 0 metrics
12:43:41
12:43:41  Concurrency: 5 threads (target='dev')
12:43:41
12:43:41  1 of 1 START test unexpected_order_status_today ................................ [RUN]
12:43:41  1 of 1 PASS unexpected_order_status_today ...................................... [PASS in 0.03s]
12:43:41
12:43:41  Finished running 1 test in 0.13s.
12:43:41
12:43:41  Completed successfully
12:43:41
12:43:41  Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

Имя data‑теста должно быть уникальным для всех тестов, определённых для конкретной комбинации модели и колонки. Если вы зададите одно и то же имя data‑тестам, определённым для нескольких разных колонок или для нескольких разных моделей, то команда `dbt test --select <repeated_custom_name>` выберет их все.

**Когда это может понадобиться?** В ситуациях, когда вы определили один и тот же data‑тест дважды, но с различиями только в конфигурации, dbt будет считать такие data‑тесты дубликатами:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
          - accepted_values:
              arguments:
                values: ['placed', 'shipped', 'completed', 'returned']
              config:
                # единственное различие в конфигурации 'where'
                where: "order_date = (current_date - interval '1 day')" # синтаксис PostgreSQL
```

</File>

```sh
Compilation Error
  dbt found two tests with the name "accepted_values_orders_status__placed__shipped__completed__returned" defined on column "status" in "models.orders".

  Since these resources have the same name, dbt will be unable to find the correct resource
  when running tests.

  To fix this, change the name of one of these resources:
  - test.testy.accepted_values_orders_status__placed__shipped__completed__returned.69dce9e5d5 (models/one_file.yml)
  - test.testy.accepted_values_orders_status__placed__shipped__completed__returned.69dce9e5d5 (models/one_file.yml)
```

Предоставляя пользовательское имя, вы помогаете dbt различать тесты данных:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              name: unexpected_order_status_today
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
          - accepted_values:
              name: unexpected_order_status_yesterday
              arguments:
                values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = (current_date - interval '1 day')" # PostgreSQL
```

</File>

```sh
$ dbt test
12:48:03  Running with dbt=1.1.0-b1
12:48:04  Found 1 model, 2 tests, 0 snapshots, 0 analyses, 167 macros, 0 operations, 1 seed file, 0 sources, 0 exposures, 0 metrics
12:48:04
12:48:04  Concurrency: 5 threads (target='dev')
12:48:04
12:48:04  1 of 2 START test unexpected_order_status_today ................................ [RUN]
12:48:04  2 of 2 START test unexpected_order_status_yesterday ............................ [RUN]
12:48:04  1 of 2 PASS unexpected_order_status_today ...................................... [PASS in 0.04s]
12:48:04  2 of 2 PASS unexpected_order_status_yesterday .................................. [PASS in 0.04s]
12:48:04
12:48:04  Finished running 2 tests in 0.21s.
12:48:04
12:48:04  Completed successfully
12:48:04
12:48:04  Done. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2
```

**Если используется [`store_failures`](/reference/resource-configs/store_failures):** dbt использует имя каждого data test в качестве имени таблицы, в которой будут храниться записи, не прошедшие проверку. Если для конкретного data test задано пользовательское имя, именно оно будет использовано и для таблицы с ошибками. При необходимости вы можете дополнительно настроить [`alias`](/reference/resource-configs/alias) для data test, чтобы раздельно управлять именем самого data test (для метаданных) и именем таблицы в базе данных (для хранения неуспешных записей).

### Альтернативный формат для определения тестов

При определении универсального теста данных с несколькими аргументами и конфигурациями YAML может выглядеть громоздко и быть неудобным для чтения. Если так проще, вы можете задать те же свойства теста данных как верхнеуровневые ключи одного словаря, указав имя теста данных в ключе `test_name`. Это полностью на ваше усмотрение.

Этот пример идентичен предыдущему:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: status
        data_tests:
          - name: unexpected_order_status_today
            test_name: accepted_values  # имя применяемого обобщённого теста
            arguments: # доступно в v1.10.5 и выше. В более старых версиях можно задавать <argument_name> как свойство верхнего уровня.
              values:
                - placed
                - shipped
                - completed
                - returned
            config:
              where: "order_date = current_date"
```

</File>