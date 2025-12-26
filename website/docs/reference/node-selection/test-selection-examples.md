---
title: "Примеры выбора тестов"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Выбор тестов работает немного иначе, чем выбор других ресурсов. Это делает его очень удобным для:
* запуска тестов на конкретной модели
* запуска тестов на всех моделях в подкаталоге
* запуска тестов на всех моделях, находящихся выше или ниже по потоку от модели, и т.д.

Как и все типы ресурсов, тесты могут быть выбраны **напрямую**, с помощью методов и операторов, которые захватывают один из их атрибутов: их имя, свойства, теги и т.д.

В отличие от других типов ресурсов, тесты также могут быть выбраны **косвенно**. Если метод выбора или оператор включает родительский(ие) элемент(ы) теста, тест также будет выбран. [См. ниже](#indirect-selection) для получения более подробной информации.

Выбор тестов мощный инструмент, и мы знаем, что он может быть сложным. В этой связи мы включили множество примеров ниже:

### Прямой выбор

Запуск только общих тестов:

```bash
dbt test --select "test_type:generic"
```

Запуск только единичных тестов:

```bash
dbt test --select "test_type:singular"
```

В обоих случаях `test_type` проверяет свойство самого теста. Это формы "прямого" выбора тестов.

### Косвенный выбор

<IndirSelect features={'/snippets/indirect-selection-definitions.md'}/>

<!-- вкладки для режима eager, cautious, empty и buildable -->
<!-- Вкладки для 1.5+ -->

### Примеры косвенного выбора

Чтобы визуализировать эти методы, предположим, что у вас есть `model_a`, `model_b` и `model_c` и связанные с ними тесты данных. Следующее иллюстрирует, какие тесты будут запущены, когда вы выполните `dbt build` с различными режимами косвенного выбора:

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/reference/indirect-selection-dbt-build.png" width="85%" title="dbt build" />

<Lightbox src src="/img/docs/reference/indirect-selection-eager.png" width="85%" title="Eager (по умолчанию)"/>

<Lightbox src src="/img/docs/reference/indirect-selection-buildable.png" width="85%" title="Buildable"/>

<Lightbox src src="/img/docs/reference/indirect-selection-cautious.png" width="85%" title="Cautious"/>

<Lightbox src src="/img/docs/reference/indirect-selection-empty.png" width="85%" title="Empty"/>

</DocCarousel>

<Tabs queryString="indirect-selection-mode">
<TabItem value="eager" label="Режим Eager (по умолчанию)">

В этом примере, в процессе сборки, любой тест, который зависит от выбранной модели "orders" или её зависимых моделей, будет выполнен, даже если он также зависит от других моделей.

```shell
dbt test --select "orders"
dbt build --select "orders"
```

</TabItem>

<TabItem value="buildable" label="Режим Buildable">

В этом примере dbt выполняет тесты, которые ссылаются на "orders" в выбранных узлах (или их предках).

```shell
dbt test --select "orders" --indirect-selection=buildable
dbt build --select "orders" --indirect-selection=buildable
```

</TabItem>

<TabItem value="cautious" label="Режим Cautious">

В этом примере будут выполнены только те тесты, которые зависят _исключительно_ от модели "orders":

```shell
dbt test --select "orders" --indirect-selection=cautious
dbt build --select "orders" --indirect-selection=cautious

```

</TabItem>

<TabItem value="empty" label="Режим Empty">

Этот режим не выполняет никаких тестов, независимо от того, прикреплены ли они напрямую к выбранному узлу или нет.

```shell

dbt test --select "orders" --indirect-selection=empty
dbt build --select "orders" --indirect-selection=empty

```

</TabItem>

</Tabs>

<!-- Конец вкладок для режима eager, cautious, buildable и empty -->

### Примеры синтаксиса выбора тестов

Установка `indirect_selection` также может быть указана в [yaml селекторе](/reference/node-selection/yaml-selectors#indirect-selection).

Следующие примеры должны быть вам знакомы, если вы привыкли выполнять `dbt run` с опцией `--select` для сборки частей вашего DAG:

```bash
# Запуск тестов на модели (косвенный выбор)
dbt test --select "customers"

# Запуск тестов на двух или более конкретных моделях (косвенный выбор)
dbt test --select "customers orders"

# Запуск тестов на всех моделях в каталоге models/staging/jaffle_shop (косвенный выбор)
dbt test --select "staging.jaffle_shop"

# Запуск тестов ниже по потоку от модели (обратите внимание, что это выберет эти тесты напрямую!)
dbt test --select "stg_customers+"

# Запуск тестов выше по потоку от модели (косвенный выбор)
dbt test --select "+stg_customers"

# Запуск тестов на всех моделях с определённым тегом (прямой + косвенный)
dbt test --select "tag:my_model_tag"

# Запуск тестов на всех моделях с определённой материализацией (косвенный выбор)
dbt test --select "config.materialized:table"

```

Тот же принцип может быть расширен на тесты, определённые для других типов ресурсов. В этих случаях мы будем выполнять все тесты, определённые для определённых источников, с помощью метода выбора `source:`:

```bash
# тесты на всех источниках

dbt test --select "source:*"

# тесты на одном источнике
dbt test --select "source:jaffle_shop"

# тесты на двух или более конкретных источниках
dbt test --select "source:jaffle_shop source:raffle_bakery"

# тесты на одной таблице источника
dbt test --select "source:jaffle_shop.customers"

# тесты на всём, _кроме_ источников
dbt test --exclude "source:*"
```

### Более сложный выбор

С помощью комбинации прямого и косвенного выбора существует множество способов достичь одного и того же результата. Допустим, у нас есть тест данных с именем `assert_total_payment_amount_is_positive`, который зависит от модели с именем `payments`. Все следующие команды позволят выбрать и выполнить этот тест:

```bash

dbt test --select "assert_total_payment_amount_is_positive" # прямой выбор теста по имени
dbt test --select "payments,test_type:singular" # косвенный выбор, v1.2
dbt test --select "payments,test_type:data" # косвенный выбор, v0.18.0
dbt test --select "payments" --data  # косвенный выбор, более ранние версии

```bash
dbt test --select "assert_total_payment_amount_is_positive" # directly select the test by name
dbt test --select "payments,test_type:singular" # indirect selection, v1.2
```

Пока вы можете выбрать общее свойство группы ресурсов, косвенный выбор позволяет вам выполнять все тесты на этих ресурсах. В приведённом выше примере мы увидели, что возможно тестировать все модели с материализацией таблицы. Этот принцип может быть расширен и на другие типы ресурсов:

```bash
# Запуск тестов на всех моделях с определённой материализацией
dbt test --select "config.materialized:table"

# Запуск тестов на всех seeds, которые используют материализацию 'seed'
dbt test --select "config.materialized:seed"

# Запуск тестов на всех snapshots, которые используют материализацию 'snapshot'
dbt test --select "config.materialized:snapshot"

```

Обратите внимание, что эта функциональность может измениться в будущих версиях dbt.

### Запуск тестов на тегированных столбцах

Поскольку столбец `order_id` имеет тег `my_column_tag`, сам тест также получает тег `my_column_tag`. Поэтому это пример прямого выбора.

<File name='models/<filename>.yml'>

```yml

models:
  - name: orders
    columns:
      - name: order_id
        config:
          tags: [my_column_tag] # changed to config in v1.10 and backported to 1.9
        data_tests:
          - unique

```

</File>

```bash
dbt test --select "tag:my_column_tag"

```

В настоящее время тесты "наследуют" теги, применённые к столбцам, источникам и таблицам источников. Они _не_ наследуют теги, применённые к моделям, seeds или snapshots. Скорее всего, эти тесты всё равно будут выбраны косвенно, потому что тег выбирает его родителя. Это тонкое различие, и оно может измениться в будущих версиях dbt.

### Запуск только тегированных тестов

Это ещё более ясный пример прямого выбора: сам тест имеет тег `my_test_tag` и выбирается соответственно.

<File name='models/<filename>.yml'>

```yml

models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique:
            config:
              tags: [my_test_tag] # changed to config in v1.10

```

</File>

```bash
dbt test --select "tag:my_test_tag"

```