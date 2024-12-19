---
title: "Примеры выбора тестов"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Выбор тестов работает немного иначе, чем выбор других ресурсов. Это позволяет легко:
* запускать тесты на конкретной модели
* запускать тесты на всех моделях в подкаталоге
* запускать тесты на всех моделях, находящихся выше / ниже по потоку от модели и т.д.

Как и все типы ресурсов, тесты могут быть выбраны **непосредственно** с помощью методов и операторов, которые захватывают один из их атрибутов: имя, свойства, теги и т.д.

В отличие от других типов ресурсов, тесты также могут быть выбраны **косвенно**. Если метод или оператор выбора включает родительские модели теста, тест также будет выбран. [Смотрите ниже](#indirect-selection) для получения более подробной информации.

Выбор тестов является мощным инструментом, и мы знаем, что он может быть сложным. В связи с этим мы включили множество примеров ниже:

### Непосредственный выбор

Запустите общие тесты только:


  ```bash
    dbt test --select "test_type:generic"
  ```

Запустите только одиночные тесты:


  ```bash
    dbt test --select "test_type:singular"
  ```

В обоих случаях `test_type` проверяет свойство самого теста. Это формы "непосредственного" выбора тестов.

### Косвенный выбор

<IndirSelect features={'/snippets/indirect-selection-definitions.md'}/>

<!--tabs для режима eager, cautious, empty и buildable -->
<!--Tabs для 1.5+ -->

### Примеры косвенного выбора

Чтобы визуализировать эти методы, предположим, что у вас есть `model_a`, `model_b` и `model_c`, а также связанные с ними тесты данных. Следующее иллюстрирует, какие тесты будут запущены, когда вы выполните `dbt build` с различными режимами косвенного выбора:

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/reference/indirect-selection-dbt-build.png" width="85%" title="dbt build" />

<Lightbox src src="/img/docs/reference/indirect-selection-eager.png" width="85%" title="Eager (по умолчанию)"/>

<Lightbox src src="/img/docs/reference/indirect-selection-buildable.png" width="85%" title="Buildable"/>

<Lightbox src src="/img/docs/reference/indirect-selection-cautious.png" width="85%" title="Cautious"/>

<Lightbox src src="/img/docs/reference/indirect-selection-empty.png" width="85%" title="Empty"/>

</DocCarousel>

<Tabs queryString="indirect-selection-mode">
<TabItem value="eager" label="Режим eager (по умолчанию)">

В этом примере, в процессе сборки, любой тест, который зависит от выбранной модели "orders" или ее зависимых моделей, будет выполнен, даже если он зависит и от других моделей.
 
```shell
dbt test --select "orders"
dbt build --select "orders"
```

</TabItem>

<TabItem value="buildable" label="Режим buildable">

В этом примере dbt выполняет тесты, которые ссылаются на "orders" в выбранных узлах (или их предках).


```shell
dbt test --select "orders" --indirect-selection=buildable
dbt build --select "orders" --indirect-selection=buildable
```

</TabItem>

<TabItem value="cautious" label="Режим cautious">

В этом примере будут выполнены только тесты, которые зависят _исключительно_ от модели "orders":

```shell
dbt test --select "orders" --indirect-selection=cautious
dbt build --select "orders" --indirect-selection=cautious

```

</TabItem>

<TabItem value="empty" label="Режим empty">

Этот режим не выполняет никаких тестов, независимо от того, прикреплены ли они непосредственно к выбранному узлу или нет.

```shell

dbt test --select "orders" --indirect-selection=empty
dbt build --select "orders" --indirect-selection=empty

```

</TabItem>

</Tabs>

<!--Конец вкладок для режима eager, cautious, buildable и empty -->

### Примеры синтаксиса выбора тестов

Установка `indirect_selection` также может быть указана в [yaml селекторе](/reference/node-selection/yaml-selectors#indirect-selection).

Следующие примеры должны показаться вам знакомыми, если вы привыкли выполнять `dbt run` с опцией `--select`, чтобы строить части вашего DAG:


  ```bash
  # Запустите тесты на модели (косвенный выбор)
  dbt test --select "customers"
  
  # Запустите тесты на двух или более конкретных моделях (косвенный выбор)
  dbt test --select "customers orders"

  # Запустите тесты на всех моделях в директории models/staging/jaffle_shop (косвенный выбор)
  dbt test --select "staging.jaffle_shop"

  # Запустите тесты ниже по потоку от модели (обратите внимание, что это выберет эти тесты непосредственно!)
  dbt test --select "stg_customers+"

  # Запустите тесты выше по потоку от модели (косвенный выбор)
  dbt test --select "+stg_customers"

  # Запустите тесты на всех моделях с определенным тегом (непосредственный + косвенный)
  dbt test --select "tag:my_model_tag"

  # Запустите тесты на всех моделях с определенной материализацией (косвенный выбор)
  dbt test --select "config.materialized:table"

  ```

 Тот же принцип можно распространить на тесты, определенные для других типов ресурсов. В этих случаях мы будем выполнять все тесты, определенные для определенных источников, с помощью метода выбора `source:`:


  ```bash
  # тесты на всех источниках

  dbt test --select "source:*"

  # тесты на один источник
  dbt test --select "source:jaffle_shop"
  
  # тесты на два или более конкретных источника
   dbt test --select "source:jaffle_shop source:raffle_bakery"

  # тесты на одну таблицу источника
  dbt test --select "source:jaffle_shop.customers"

  # тесты на все, _кроме_ источников
  dbt test --exclude "source:*"
  ```

 ### Более сложный выбор

С помощью комбинации непосредственного и косвенного выбора существует множество способов достижения одного и того же результата. Допустим, у нас есть тест данных с именем `assert_total_payment_amount_is_positive`, который зависит от модели с именем `payments`. Все из следующих команд смогут выбрать и выполнить этот тест конкретно:


  ```bash

  dbt test --select "assert_total_payment_amount_is_positive" # непосредственный выбор теста по имени
  dbt test --select "payments,test_type:singular" # косвенный выбор, v1.2
  dbt test --select "payments,test_type:data" # косвенный выбор, v0.18.0
  dbt test --select "payments" --data  # косвенный выбор, более ранние версии

  ```


 Пока вы можете выбрать общее свойство группы ресурсов, косвенный выбор позволяет вам выполнять все тесты на этих ресурсах тоже. В приведенном выше примере мы видели, что возможно протестировать все модели с материализацией в виде таблицы. Этот принцип можно распространить и на другие типы ресурсов:


  ```bash
  # Запустите тесты на всех моделях с определенной материализацией
  dbt test --select "config.materialized:table"

  # Запустите тесты на всех семенах, которые используют материализацию 'seed'
  dbt test --select "config.materialized:seed"

  # Запустите тесты на всех снимках, которые используют материализацию 'snapshot'
  dbt test --select "config.materialized:snapshot"

  ```

 Обратите внимание, что эта функциональность может измениться в будущих версиях dbt.

### Запуск тестов на тегированных колонках

Поскольку колонка `order_id` имеет тег `my_column_tag`, сам тест также получает тег `my_column_tag`. Поэтому это пример непосредственного выбора.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tags: [my_column_tag]
        tests:
          - unique

```

</File>


  ```bash
  dbt test --select "tag:my_column_tag"

  ```

В настоящее время тесты "наследуют" теги, примененные к колонкам, источникам и таблицам источников. Они _не_ наследуют теги, примененные к моделям, семенам или снимкам. Скорее всего, эти тесты все равно будут выбраны косвенно, поскольку тег выбирает его родителя. Это тонкое различие, и оно может измениться в будущих версиях dbt.

### Запуск только тегированных тестов

Это еще более ясный пример непосредственного выбора: сам тест имеет тег `my_test_tag` и выбирается соответственно.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique:
              tags: [my_test_tag]

```

</File>


  ```bash
  dbt test --select "tag:my_test_tag"

  ```