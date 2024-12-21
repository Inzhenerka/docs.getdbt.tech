---
title: "О свойстве тестов данных"
sidebar_label: "Тесты данных"
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
version: 2

models:
  - name: <model_name>
    tests:
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/data-test-configs): <config-value>

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/data-test-configs): <config-value>
```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    tables:
    - name: <table_name>
      tests:
        - [<test_name>](#test_name)
        - [<test_name>](#test_name):
            <argument_name>: <argument_value>
            [config](/reference/resource-properties/config):
              [<test_config>](/reference/data-test-configs): <config-value>

      columns:
        - name: <column_name>
          tests:
            - [<test_name>](#test_name)
            - [<test_name>](#test_name):
                <argument_name>: <argument_value>
                [config](/reference/resource-properties/config):
                  [<test_config>](/reference/data-test-configs): <config-value>

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <seed_name>
    tests:
      - [<test_name>](#test_name)
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/data-test-configs): <config-value>

    columns:
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/data-test-configs): <config-value>

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot_name>
    tests:
      - [<test_name>](#test_name)
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/data-test-configs): <config-value>

    columns:
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
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

Свойство `tests` данных определяет утверждения о столбце, <Term id="table" />, или <Term id="view" />. Это свойство содержит список [общих тестов](/docs/build/data-tests#generic-data-tests), указанных по имени, которые могут включать четыре встроенных общих теста, доступных в dbt. Например, вы можете добавить тесты, которые гарантируют, что в столбце нет дубликатов и нулевых значений. Любые аргументы или [конфигурации](/reference/data-test-configs), переданные этим тестам, должны быть вложены под именем теста.

После того как эти тесты определены, вы можете проверить их корректность, запустив `dbt test`.

## Готовые тесты данных

Существует четыре общих теста данных, которые доступны из коробки для всех пользователей dbt.

### `not_null`

Этот тест проверяет, что в столбце нет значений `null`.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - not_null
```

</File>

### `unique`

Этот тест проверяет, что в поле нет дублирующихся значений.

Конфигурация и условие where являются необязательными.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique:
              config:
                where: "order_id > 21"
```

</File>

### `accepted_values`

Этот тест проверяет, что все значения в столбце присутствуют в предоставленном списке `values`. Если присутствуют какие-либо значения, отличные от указанных в списке, тест не пройдет.

Тест `accepted_values` поддерживает необязательный параметр `quote`, который по умолчанию будет заключать в одинарные кавычки список допустимых значений в запросе теста. Чтобы протестировать нестроковые значения (например, целые числа или логические значения), явно установите конфигурацию `quote` в `false`.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']

      - name: status_id
        tests:
          - accepted_values:
              values: [1, 2, 3, 4]
              quote: false
```

</File>

### `relationships`

Этот тест проверяет, что все записи в дочерней <Term id="table" /> имеют соответствующую запись в родительской таблице. Это свойство называется "ссылочная целостность".

Следующий пример проверяет, что каждый `customer_id` заказа соответствует действительному `customer`.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: customer_id
        tests:
          - relationships:
              to: ref('customers')
              field: id
```

</File>

Аргумент `to` принимает [Relation](/reference/dbt-classes#relation) – это означает, что вы можете передать ему `ref` на модель (например, `ref('customers')`), или `source` (например, `source('jaffle_shop', 'customers')`).

## Дополнительные примеры

### Тестирование выражения
Некоторые тесты данных требуют нескольких столбцов, поэтому их не имеет смысла вкладывать под ключом `columns:`. В этом случае вы можете применить тест данных к модели (или источнику, seed, или снимку):

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    tests:
      - unique:
          column_name: "country_code || '-' || order_id"
```

</File>

### Использование пользовательского общего теста

Если вы определили свой собственный пользовательский общий тест, вы можете использовать его в качестве `test_name`:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - primary_key  # имя моего пользовательского общего теста

```

</File>

Ознакомьтесь с руководством по написанию [пользовательского общего теста](/best-practices/writing-custom-generic-tests) для получения дополнительной информации.

### Пользовательское имя теста данных

По умолчанию dbt синтезирует имя для вашего общего теста, объединяя:
- имя теста (`not_null`, `unique` и т.д.)
- имя модели (или source/seed/snapshot)
- имя столбца (если применимо)
- аргументы (если применимо, например, `values` для `accepted_values`)

Оно не включает в себя никакие конфигурации для теста. Если объединенное имя слишком длинное, dbt использует усеченную и хешированную версию вместо него. Цель состоит в том, чтобы сохранить уникальные идентификаторы для всех ресурсов в вашем проекте, включая тесты.

Вы также можете определить свое собственное имя для конкретного теста через свойство `name`.

**Когда это может понадобиться?** Подход dbt по умолчанию может привести к появлению странных (и некрасивых) имен тестов. Определив пользовательское имя, вы получаете полный контроль над тем, как тест будет отображаться в сообщениях журнала и метаданных. Вы также сможете выбрать тест по этому имени.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              name: unexpected_order_status_today
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

Имя теста должно быть уникальным для всех тестов, определенных для данной комбинации модель-столбец. Если вы дадите одинаковое имя тестам, определенным для нескольких разных столбцов или в нескольких разных моделях, то `dbt test --select <repeated_custom_name>` выберет их все.

**Когда это может понадобиться?** В случаях, когда вы определили один и тот же тест дважды, с единственным различием в конфигурации, dbt будет считать эти тесты дубликатами:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
          - accepted_values:
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

Предоставив пользовательское имя, вы помогаете dbt различать тесты:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              name: unexpected_order_status_today
              values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
          - accepted_values:
              name: unexpected_order_status_yesterday
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

**Если используется [`store_failures`](/reference/resource-configs/store_failures):** dbt использует имя каждого теста данных в качестве имени таблицы, в которой будут храниться любые неудачные записи. Если вы определили пользовательское имя для одного теста, это пользовательское имя также будет использоваться для его таблицы с неудачами. Вы можете дополнительно настроить [`alias`](/reference/resource-configs/alias) для теста, чтобы отдельно управлять как именем теста (для метаданных), так и именем его таблицы в базе данных (для хранения неудач).

### Альтернативный формат для определения тестов

При определении общего теста данных с несколькими аргументами и конфигурациями YAML может выглядеть и ощущаться громоздким. Если вам так удобнее, вы можете определить те же свойства теста в виде ключей верхнего уровня одного словаря, указав имя теста как `test_name`. Это полностью на ваше усмотрение.

Этот пример идентичен предыдущему:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - name: unexpected_order_status_today
            test_name: accepted_values  # имя общего теста для применения
            values:
              - placed
              - shipped
              - completed
              - returned
            config:
              where: "order_date = current_date"
```

</File>