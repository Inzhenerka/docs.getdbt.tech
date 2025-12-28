---
title: "Примеры выбора тестов"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Выбор тестов работает немного иначе, чем выбор других типов ресурсов. Это делает очень простым выполнение следующих задач:
* запуск тестов для конкретной модели
* запуск тестов для всех моделей в подкаталоге
* запуск тестов для всех моделей выше / ниже по графу зависимостей (upstream / downstream) относительно модели и т.д.

Как и все типы ресурсов, тесты можно выбирать **напрямую** — с помощью методов и операторов, которые сопоставляются с их атрибутами: именем, свойствами, тегами и т.д.

В отличие от других типов ресурсов, тесты также можно выбирать **косвенно**. Если метод или оператор выбора включает родительский ресурс (или ресурсы) теста, то сам тест тоже будет выбран. Подробнее см. [ниже](#indirect-selection).

Выбор тестов — мощный механизм, и мы понимаем, что он может быть непростым для понимания. Поэтому ниже мы привели большое количество примеров.

### Прямой выбор (Direct selection)

Запуск только generic-тестов:

```bash
dbt test --select "test_type:generic"
```

Запуск только singular-тестов:

```bash
dbt test --select "test_type:singular"
```

В обоих случаях `test_type` проверяет свойство самого теста. Это примеры **прямого** выбора тестов.

### Косвенный выбор (Indirect selection)

<IndirSelect features={'/snippets/indirect-selection-definitions.md'}/>

<!--вкладки для жадного режима, осторожного режима, пустого и режима сборки -->
<!--Вкладки для 1.5+ -->

### Примеры косвенного выбора

Чтобы наглядно представить работу этих режимов, предположим, что у вас есть `model_a`, `model_b` и `model_c` и связанные с ними data tests. Ниже показано, какие тесты будут выполнены при запуске `dbt build` с различными режимами косвенного выбора:

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/reference/indirect-selection-dbt-build.png" width="85%" title="dbt build" />

<Lightbox src src="/img/docs/reference/indirect-selection-eager.png" width="85%" title="Eager (по умолчанию)"/>

<Lightbox src src="/img/docs/reference/indirect-selection-buildable.png" width="85%" title="Buildable"/>

<Lightbox src src="/img/docs/reference/indirect-selection-cautious.png" width="85%" title="Cautious"/>

<Lightbox src src="/img/docs/reference/indirect-selection-empty.png" width="85%" title="Empty"/>

</DocCarousel>

<Tabs queryString="indirect-selection-mode">
<TabItem value="eager" label="Режим Eager (по умолчанию)">

В этом примере во время процесса сборки будут выполнены любые тесты, которые зависят от выбранной модели `orders` или от моделей, зависящих от неё, даже если сами тесты также зависят от других моделей.

```shell
dbt test --select "orders"
dbt build --select "orders"
```

</TabItem>

<TabItem value="buildable" label="Режим Buildable">

В этом примере dbt выполняет тесты, которые ссылаются на `orders` в рамках выбранных узлов (или их предков).

```shell
dbt test --select "orders" --indirect-selection=buildable
dbt build --select "orders" --indirect-selection=buildable
```

</TabItem>

<TabItem value="cautious" label="Режим Cautious">

В этом примере будут выполнены только те тесты, которые зависят _исключительно_ от модели `orders`:

```shell
dbt test --select "orders" --indirect-selection=cautious
dbt build --select "orders" --indirect-selection=cautious
```

</TabItem>

<TabItem value="empty" label="Режим Empty">

В этом режиме не выполняются никакие тесты — независимо от того, привязаны ли они напрямую к выбранному узлу или нет.

```shell
dbt test --select "orders" --indirect-selection=empty
dbt build --select "orders" --indirect-selection=empty
```

</TabItem>

</Tabs>

<!--End of tabs for eager mode, cautious mode, buildable mode, and empty mode -->

### Примеры синтаксиса выбора тестов

Параметр `indirect_selection` также можно задать в [yaml-селекторе](/reference/node-selection/yaml-selectors#indirect-selection).

Следующие примеры должны показаться знакомыми, если вы привыкли выполнять `dbt run` с опцией `--select` для сборки частей вашего DAG:

```bash
# Запуск тестов для одной модели (косвенный выбор)
dbt test --select "customers"

# Запуск тестов для двух или более конкретных моделей (косвенный выбор)
dbt test --select "customers orders"

# Запуск тестов для всех моделей в директории models/staging/jaffle_shop (косвенный выбор)
dbt test --select "staging.jaffle_shop"

# Запуск тестов ниже по графу зависимостей от модели
# (обратите внимание: эти тесты будут выбраны напрямую!)
dbt test --select "stg_customers+"

# Запуск тестов выше по графу зависимостей от модели (косвенный выбор)
dbt test --select "+stg_customers"

# Запуск тестов для всех моделей с определённым тегом (прямой + косвенный выбор)
dbt test --select "tag:my_model_tag"

# Запуск тестов для всех моделей с определённой materialization (косвенный выбор)
dbt test --select "config.materialized:table"
```

Тот же принцип можно применить и к тестам, определённым для других типов ресурсов. В этих случаях будут выполнены все тесты, определённые на источниках, выбранных с помощью метода `source:`:

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

Комбинируя прямой и косвенный выбор, можно добиться одного и того же результата разными способами. Допустим, у нас есть data test с именем `assert_total_payment_amount_is_positive`, который зависит от модели `payments`. Все приведённые ниже команды позволят выбрать и выполнить именно этот тест:

```bash
dbt test --select "assert_total_payment_amount_is_positive" # прямой выбор теста по имени
dbt test --select "payments,test_type:singular" # косвенный выбор, v1.2
```

Если вы можете выбрать общее свойство группы ресурсов, косвенный выбор позволяет выполнить все тесты, связанные с этими ресурсами. В примере выше мы увидели, что можно запустить тесты для всех моделей с materialization `table`. Этот принцип распространяется и на другие типы ресурсов:

```bash
# Запуск тестов для всех моделей с определённой materialization
dbt test --select "config.materialized:table"

# Запуск тестов для всех seeds, использующих materialization 'seed'
dbt test --select "config.materialized:seed"

# Запуск тестов для всех snapshots, использующих materialization 'snapshot'
dbt test --select "config.materialized:snapshot"
```

Обратите внимание, что это поведение может измениться в будущих версиях dbt.

### Запуск тестов для колонок с тегами

Поскольку колонка `order_id` помечена тегом `my_column_tag`, сам тест также получает тег `my_column_tag`. Поэтому это пример прямого выбора.

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

В настоящее время тесты «наследуют» теги, применённые к колонкам, источникам и таблицам источников. Они _не_ наследуют теги, применённые к моделям, seeds или snapshots. Скорее всего, такие тесты всё равно будут выбраны косвенно, потому что тег выбирает их родительский ресурс. Это тонкое различие, и оно может измениться в будущих версиях dbt.

### Запуск только тегированных тестов

Это ещё более наглядный пример прямого выбора: сам тест помечен тегом `my_test_tag` и выбирается напрямую.

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
