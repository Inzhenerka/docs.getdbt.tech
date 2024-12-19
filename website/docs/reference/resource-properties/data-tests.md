---
title: "О свойстве тестов данных"
sidebar_label: "Тесты данных"
resource_types: all
datatype: data-test
keywords: [тест, тесты, пользовательские тесты, имя пользовательского теста, имя теста]
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Источники', value: 'sources', },
    { label: 'Сиды', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Анализы', value: 'analyses', },
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

Свойство `tests` данных определяет утверждения о столбце, <Term id="table" />, или <Term id="view" />. Это свойство содержит список [общих тестов](/docs/build/data-tests#generic-data-tests), на которые ссылаются по имени, и которые могут включать четыре встроенных общих теста, доступных в dbt. Например, вы можете добавить тесты, которые гарантируют, что в столбце нет дубликатов и нулевых значений. Любые аргументы или [конфигурации](/reference/data-test-configs), переданные этим тестам, должны быть вложены под именем теста.

После определения этих тестов вы можете проверить их корректность, запустив `dbt test`.

## Тесты данных "из коробки"

Существует четыре общих теста данных, которые доступны "из коробки" для всех пользователей dbt.

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

Конфигурация и условие `where` являются необязательными.

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

Тест `accepted_values` поддерживает необязательный параметр `quote`, который по умолчанию будет заключать список допустимых значений в одинарные кавычки в запросе теста. Чтобы протестировать нестроковые значения (например, целые числа или логические значения), явно установите конфигурацию `quote` в `false`.

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

Этот тест проверяет, что все записи в дочерней <Term id="table" /> имеют соответствующую запись в родительской таблице. Это свойство называется "ссылочной целостностью".

Следующий пример проверяет, что `customer_id` каждого заказа соответствует действительному `customer`.

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

Аргумент `to` принимает [Relation](/reference/dbt-classes#relation) – это означает, что вы можете передать ему `ref` на модель (например, `ref('customers')`), или источник (например, `source('jaffle_shop', 'customers')`).

## Дополнительные примеры

### Тестирование выражения
Некоторые тесты данных требуют нескольких столбцов, поэтому не имеет смысла вкладывать их под ключ `columns:`. В этом случае вы можете применить тест данных к модели (или источнику, сид, или снимку) вместо:

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

Посмотрите руководство по написанию [пользовательского общего теста](/best-practices/writing-custom-generic-tests) для получения дополнительной информации.

### Пользовательское имя теста данных

По умолчанию dbt будет синтезировать имя для вашего общего теста, объединяя:
- имя теста (`not_null`, `unique` и т.д.)
- имя модели (или источника/сида/снимка)
- имя столбца (если применимо)
- аргументы (если применимо, например, `values` для `accepted_values`)

В него не включаются никакие конфигурации для теста. Если объединенное имя слишком длинное, dbt будет использовать сокращенную и хэшированную версию вместо. Цель состоит в том, чтобы сохранить уникальные идентификаторы для всех ресурсов в вашем проекте, включая тесты.

Вы также можете определить свое собственное имя для конкретного теста с помощью свойства `name`.

**Когда это может понадобиться?** Подход по умолчанию dbt может привести к некоторым странным (и некрасивым) именам тестов. Определив пользовательское имя, вы получаете полный контроль над тем, как тест будет отображаться в сообщениях журнала и метаданных. Вы также сможете выбрать тест по этому имени.

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
12:43:41  Запуск с dbt=1.1.0
12:43:41  Найдено 1 модель, 1 тест, 0 снимков, 0 анализов, 167 макросов, 0 операций, 1 файл сидов, 0 источников, 0 экспозиций, 0 метрик
12:43:41
12:43:41  Параллелизм: 5 потоков (target='dev')
12:43:41
12:43:41  1 из 1 НАЧАЛО теста unexpected_order_status_today ................................ [RUN]
12:43:41  1 из 1 УСПЕШНО unexpected_order_status_today ...................................... [PASS in 0.03s]
12:43:41
12:43:41  Завершено выполнение 1 теста за 0.13s.
12:43:41
12:43:41  Завершено успешно
12:43:41
12:43:41  Готово. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

Имя теста должно быть уникальным для всех тестов, определенных для данной комбинации модели-столбца. Если вы дадите одно и то же имя тестам, определенным на нескольких разных столбцах или в нескольких разных моделях, то `dbt test --select <repeated_custom_name>` выберет их все.

**Когда это может понадобиться?** В случаях, когда вы определили один и тот же тест дважды, с различием только в конфигурации, dbt будет считать эти тесты дубликатами:

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
Ошибка компиляции
  dbt нашел два теста с именем "accepted_values_orders_status__placed__shipped__completed__returned", определенными для столбца "status" в "models.orders".

  Поскольку эти ресурсы имеют одно и то же имя, dbt не сможет найти правильный ресурс при выполнении тестов.

  Чтобы исправить это, измените имя одного из этих ресурсов:
  - test.testy.accepted_values_orders_status__placed__shipped__completed__returned.69dce9e5d5 (models/one_file.yml)
  - test.testy.accepted_values_orders_status__placed__shipped__completed__returned.69dce9e5d5 (models/one_file.yml)
```

Определив пользовательское имя, вы помогаете dbt различать тесты:

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
12:48:03  Запуск с dbt=1.1.0-b1
12:48:04  Найдено 1 модель, 2 теста, 0 снимков, 0 анализов, 167 макросов, 0 операций, 1 файл сидов, 0 источников, 0 экспозиций, 0 метрик
12:48:04
12:48:04  Параллелизм: 5 потоков (target='dev')
12:48:04
12:48:04  1 из 2 НАЧАЛО теста unexpected_order_status_today ................................ [RUN]
12:48:04  2 из 2 НАЧАЛО теста unexpected_order_status_yesterday ............................ [RUN]
12:48:04  1 из 2 УСПЕШНО unexpected_order_status_today ...................................... [PASS in 0.04s]
12:48:04  2 из 2 УСПЕШНО unexpected_order_status_yesterday .................................. [PASS in 0.04s]
12:48:04
12:48:04  Завершено выполнение 2 тестов за 0.21s.
12:48:04
12:48:04  Завершено успешно
12:48:04
12:48:04  Готово. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2
```

**Если используется [`store_failures`](/reference/resource-configs/store_failures):** dbt использует имя каждого теста данных в качестве имени таблицы, в которой будут храниться любые неудачные записи. Если вы определили пользовательское имя для одного теста, это пользовательское имя также будет использоваться для его таблицы с неудачами. Вы можете дополнительно настроить [`alias`](/reference/resource-configs/alias) для теста, чтобы отдельно контролировать как имя теста (для метаданных), так и имя его таблицы в базе данных (для хранения неудач).

### Альтернативный формат для определения тестов

При определении общего теста данных с несколькими аргументами и конфигурациями YAML может выглядеть и ощущаться громоздко. Если вам будет удобнее, вы можете определить те же свойства теста в качестве ключей верхнего уровня одного словаря, указав имя теста как `test_name`. Это полностью зависит от вас.

Этот пример идентичен приведенному выше:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - name: unexpected_order_status_today
            test_name: accepted_values  # имя общего теста, который нужно применить
            values:
              - placed
              - shipped
              - completed
              - returned
            config:
              where: "order_date = current_date"
```

</File>