---
title: "Добавление тестов данных в ваш DAG"
sidebar_label: "Тесты данных"
description: "Настройте тесты данных dbt, чтобы оценивать качество входных данных и обеспечивать точность результирующих наборов данных."
pagination_next: "docs/build/unit-tests"
pagination_prev: null
search_weight: "heavy"
id: "data-tests"
keywords:
  - test, tests, testing, dag
availability: all_users
---

import CopilotBeta from '/snippets/_dbt-copilot-avail.md';

<CopilotBeta resource='data tests' />

## Связанная справочная документация
* [Команда test](/reference/commands/test)
* [Свойства тестов данных](/reference/resource-properties/data-tests)
* [Конфигурации тестов данных](/reference/data-test-configs)
* [Примеры выбора тестов](/reference/node-selection/test-selection-examples)
* [Пакетные тесты](/reference/global-configs/batch-tests)

:::important

Тесты теперь называются **data tests**, чтобы избежать путаницы с [unit tests](/docs/build/unit-tests). YAML-ключ `tests:` по‑прежнему поддерживается как алиас для `data_tests:`. Подробнее см. в разделе [New `data_tests:` syntax](#new-data_tests-syntax).

:::

## Обзор {#overview}

Data tests — это утверждения, которые вы задаёте для своих моделей и других ресурсов в проекте dbt (например, sources, seeds и snapshots). Когда вы запускаете `dbt test`, dbt сообщает, проходит ли каждый тест в вашем проекте или завершается с ошибкой.

Вы можете использовать тесты данных для улучшения целостности SQL в каждой модели, делая утверждения о сгенерированных результатах. Из коробки вы можете проверить, содержит ли указанный столбец в модели только ненулевые значения, уникальные значения или значения, которые имеют соответствующее значение в другой модели (например, `customer_id` для `order` соответствует `id` в модели `customers`), и значения из указанного списка. Вы можете расширить тесты данных, чтобы они соответствовали бизнес-логике, специфичной для вашей организации — любое утверждение, которое вы можете сделать о своей модели в форме запроса select, может быть преобразовано в тест данных.

Тесты данных возвращают набор записей, не прошедших проверку. Универсальные тесты данных (также известные как тесты схемы) определяются с помощью блоков `test`.

Как и почти всё в dbt, тесты данных — это SQL-запросы. В частности, это операторы `select`, которые выбирают записи, не прошедшие проверку, то есть опровергающие ваше утверждение. Если вы утверждаете, что значения столбца в модели уникальны, тестовый запрос выбирает дубликаты; если вы утверждаете, что столбец никогда не содержит null, тест ищет значения null. Если тест данных не возвращает ни одной строки, не прошедшей проверку, он считается пройденным, а ваше утверждение — подтверждённым.

В dbt есть два способа определения тестов данных:

- **Сингулярный** тест данных в простейшем виде — это SQL-запрос, который возвращает строки, не прошедшие проверку. Сохраните этот запрос в файле `.sql` в [каталоге тестов](/reference/project-configs/test-paths). Теперь это тест данных, который будет выполняться командой `dbt test`.
- **Универсальный** тест данных — это параметризованный запрос, принимающий аргументы. Запрос теста определяется в специальном блоке `test` (как [макрос](/docs/build/jinja-macros)). После определения вы можете ссылаться на универсальный тест по имени в своих файлах `.yml` — задавать его для моделей, столбцов, источников, снимков и seed-файлов. В dbt есть четыре встроенных универсальных теста данных, и мы рекомендуем их использовать!

Определение тестов данных — отличный способ подтвердить, что ваши выходные и входные данные соответствуют ожиданиям, и помогает предотвратить регрессии при изменении вашего кода. Поскольку вы можете использовать их снова и снова, делая аналогичные утверждения с небольшими вариациями, общие тесты данных, как правило, гораздо более распространены — они должны составлять основную часть вашего набора тестов данных dbt. Тем не менее, оба способа определения тестов данных имеют свое время и место.

:::tip Создание ваших первых data tests
Если вы только начинаете работать с dbt, мы рекомендуем ознакомиться с нашим [онлайн-курсом dbt Fundamentals](https://learn.getdbt.com/learn/course/dbt-fundamentals/data-tests-30min/building-tests?page=1) или [кратким руководством](/guides), чтобы создать свой первый dbt‑проект с моделями и тестами.
:::

## Единичные тесты данных {#singular-data-tests}

Самый простой способ определить тест данных — это написать точный SQL, который вернет неудачные записи. Мы называем их "единичными" тестами данных, потому что это одноразовые утверждения, используемые для одной цели.

Эти тесты определяются в файлах `.sql`, обычно в каталоге `tests` (указанном в конфигурации `test-paths`). **Примечание:** Каталог `tests/` (`test-paths`) предназначен только для единичных и универсальных тестов данных (SQL). YAML-определения модульных тестов должны находиться в каталогах, указанных в `model-paths` вашего проекта (например, в каталоге `models/`), а не в `tests/`. В определении теста можно использовать Jinja (включая `ref` и `source`), как и при создании моделей. Каждый файл `.sql` содержит один оператор `select` и определяет один тест данных:

<File name='tests/assert_total_payment_amount_is_positive.sql'>

```sql
-- Возвраты имеют отрицательную сумму, поэтому общая сумма всегда должна быть >= 0.
-- Поэтому возвращаем записи, где total_amount < 0, чтобы тест не прошел.
select
    order_id,
    sum(amount) as total_amount
from {{ ref('fct_payments') }}
group by 1
having total_amount < 0
```

</File>

Название теста совпадает с именем файла: `assert_total_payment_amount_is_positive`.

Примечание:
- Не ставьте точку с запятой (`;`) в конце SQL‑запроса в файлах с одиночными тестами, так как это может привести к сбою выполнения data‑теста.
- Одиночные data‑тесты, размещённые в директории `tests`, автоматически выполняются при запуске `dbt test`. Не ссылайтесь на одиночные тесты в `model_name.yml`, так как они не рассматриваются как generic‑тесты или макросы, и это приведёт к ошибке.

Чтобы добавить описание к одиночному data‑тесту в вашем проекте, добавьте файл `.yml` в директорию `tests`, например `tests/schema.yml`, со следующим содержимым:

<File name='tests/schema.yml'>

```yaml
data_tests:
  - name: assert_total_payment_amount_is_positive
    description: >
      Возвраты имеют отрицательную сумму, поэтому общая сумма всегда должна быть >= 0.
      Поэтому возвращаем записи, где общая сумма < 0, чтобы тест не прошел.

```

</File>

Единичные тесты данных настолько просты, что вы можете обнаружить, что пишете одну и ту же базовую структуру снова и снова, только меняя имя столбца или модели. В этот момент тест уже не так уж и единичен! В этом случае мы рекомендуем общие тесты данных.

## Универсальные тесты данных {#generic-data-tests}
Некоторые тесты данных являются универсальными: их можно использовать многократно. Универсальный тест данных определяется в блоке `test`, который содержит параметризованный запрос и принимает аргументы. Он может выглядеть так:

```sql
{% test not_null(model, column_name) %}

    select *
    from {{ model }}
    where {{ column_name }} is null

{% endtest %}
```

Обратите внимание на два аргумента, `model` и `column_name`, которые затем подставляются в запрос с помощью шаблонизации. Именно это делает тест данных «универсальным»: его можно определить для любого количества столбцов в любом количестве моделей, и dbt передаст соответствующие значения `model` и `column_name`. После определения такого универсального теста его можно добавить в качестве _свойства_ к любой существующей модели (или источнику, seed-файлу либо снимку). Эти свойства добавляются в файлы `.yml` в том же каталоге, где находится ваш ресурс.

:::info
Если это ваш первый опыт работы с добавлением свойств к ресурсу, ознакомьтесь с документацией по [объявлению свойств](/reference/configs-and-properties).
:::

По умолчанию в dbt уже определены четыре универсальных теста данных: `unique`, `not_null`, `accepted_values` и `relationships`. Вот полный пример использования этих тестов для модели `orders`:

```yaml

models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
      - name: status
        data_tests:
          - accepted_values:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ['placed', 'shipped', 'completed', 'returned']
      - name: customer_id
        data_tests:
          - relationships:
              arguments:
                to: ref('customers')
                field: id
```

Простыми словами, эти тесты данных означают следующее:
* `unique`: значения в столбце `order_id` модели `orders` должны быть уникальными
* `not_null`: столбец `order_id` модели `orders` не должен содержать значения null
* `accepted_values`: значения в столбце `status` модели `orders` должны быть одним из следующих: `'placed'`, `'shipped'`, `'completed'` или `'returned'`
* `relationships`: каждое значение `customer_id` в модели `orders` должно существовать как значение `id` в таблице `customers` <Term id="table" /> (это также называется ссылочной целостностью)

За кулисами dbt формирует запрос `select` для каждого теста данных, используя параметризованный запрос из блока универсального теста. Эти запросы возвращают строки, для которых ваше утверждение _не_ выполняется; если тест возвращает ноль строк, проверка вашего утверждения пройдена.

Вы можете найти больше информации об этих тестах данных, а также о дополнительных настройках (включая [`severity`](/reference/resource-configs/severity) и [`tags`](/reference/resource-configs/tags)) в [разделе справки](/reference/resource-properties/data-tests). Также вы можете добавлять описания в Jinja‑макрос, который реализует основную логику обобщённого теста данных. Подробнее см. в разделе [Add description to generic data test logic](/best-practices/writing-custom-generic-tests#add-description-to-generic-data-test-logic).

### Больше общих тестов данных {#more-generic-data-tests}

Этих четырёх тестов достаточно, чтобы начать работу. Очень скоро вы обнаружите, что хотите использовать более широкий набор тестов данных — и это хорошо! Вы также можете установить обобщённые (generic) тесты данных из пакета или написать свои собственные, чтобы использовать их (и переиспользовать) в рамках проекта dbt. Подробнее об этом читайте в [руководстве по созданию собственных generic‑тестов данных](/best-practices/writing-custom-generic-tests).

:::info
В некоторых open‑source пакетах уже определены generic‑тесты данных, например в [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) и [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) — перейдите к документации по [пакетам](/docs/build/packages), чтобы узнать больше!
:::

### Пример {#example}
Чтобы добавить generic (или «schema») тест данных в ваш проект:

1. Добавьте файл `.yml` в директорию `models`, например `models/schema.yml`, со следующим содержимым (возможно, вам потребуется скорректировать значения `name:` для уже существующей модели).

<File name='models/schema.yml'>

```yaml

models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null

```

</File>

2. Запустите [`команду dbt test`](/reference/commands/test):

```
$ dbt test

Found 3 models, 2 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 0 seed files, 0 sources

17:31:05 | Concurrency: 1 threads (target='learn')
17:31:05 |
17:31:05 | 1 of 2 START test not_null_order_order_id..................... [RUN]
17:31:06 | 1 of 2 PASS not_null_order_order_id........................... [PASS in 0.99s]
17:31:06 | 2 of 2 START test unique_order_order_id....................... [RUN]
17:31:07 | 2 of 2 PASS unique_order_order_id............................. [PASS in 0.79s]
17:31:07 |
17:31:07 | Finished running 2 tests in 7.17s.

Completed successfully

Done. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2

```
3. Посмотрите SQL, который выполняет dbt, одним из следующих способов:
   * **<Constant name="dbt" />:** откройте вкладку Details.
   * **<Constant name="core" />:** просмотрите каталог `target/compiled`


**Тест на уникальность**
<Tabs
  defaultValue="compiled"
  values={[
    {label: 'Скомпилированный SQL', value: 'compiled'},
    {label: 'Шаблонизированный SQL', value: 'templated'},
  ]}>
  <TabItem value="compiled">

```sql
select *
from (

    select
        order_id

    from analytics.orders
    where order_id is not null
    group by order_id
    having count(*) > 1

) validation_errors
```

  </TabItem>
  <TabItem value="templated">

```sql
select *
from (

    select
        {{ column_name }}

    from {{ model }}
    where {{ column_name }} is not null
    group by {{ column_name }}
    having count(*) > 1

) validation_errors
```

  </TabItem>
</Tabs>

**Тест на отсутствие null**

<Tabs
  defaultValue="compiled"
  values={[
    {label: 'Скомпилированный SQL', value: 'compiled'},
    {label: 'Шаблонизированный SQL', value: 'templated'},
  ]}>
  <TabItem value="compiled">

```sql
select *
from analytics.orders
where order_id is null
```

  </TabItem>
  <TabItem value="templated">

```sql
select *
from {{ model }}
where {{ column_name }} is null
```

  </TabItem>
</Tabs>

## Запуск только тестов данных
Чтобы запускать тесты данных, исключая модульные тесты, используйте селектор `test_type` &mdash; он работает во всех движках (<Constant name="core"/> и <Constant name="fusion"/>):

```bash
dbt test --select "test_type:data"
```

В <Constant name="dbt" /> (v1.9+) также можно использовать `dbt test --resource-type test`. Дополнительные варианты приведены в разделе [Примеры выбора тестов](/reference/node-selection/test-selection-examples).

## Группировка тестов данных

В <Constant name="dbt" /> v2 можно сократить количество запросов, которые dbt выполняет для тестов, включив [пакетное выполнение тестов](/reference/global-configs/batch-tests). При пакетном выполнении тесты `unique` и `not_null`, привязанные к одной модели, объединяются в один запрос для каждого типа теста, при этом каждый тест по-прежнему сообщает собственный результат: пройден или не пройден.

## Сохранение результатов тестов данных с нарушениями {#storing-data-test-failures}

Обычно запрос теста данных определяет нарушения в процессе выполнения. Если задать необязательный флаг `--store-failures` или параметры конфигурации [`store_failures`](/reference/resource-configs/store_failures) либо [`store_failures_as`](/reference/resource-configs/store_failures_as), dbt сначала сохранит результаты тестового запроса в таблицу в базе данных, а затем выполнит запрос к этой таблице, чтобы подсчитать количество нарушений.

Этот рабочий процесс позволяет вам быстрее запрашивать и изучать неудачные записи в процессе разработки:

<Lightbox src="/img/docs/building-a-dbt-project/test-store-failures.gif" title="Храните неудачные тесты в базе данных для более быстрого отладки во время разработки."/>

Обратите внимание: если вы решите сохранять записи, не прошедшие тесты данных:
- По умолчанию таблицы с результатами тестов создаются в схеме с суффиксом или именем `dbt_test__audit`. Это значение можно изменить с помощью настройки `schema`. (Подробнее об именовании схем см. в разделе [использование пользовательских схем](/docs/build/custom-schemas).)
- Результаты теста всегда будут **заменять** предыдущие записи, не прошедшие тот же тест.

## Новый синтаксис `data_tests:` {#new-data_tests-syntax}

Исторически тесты данных в dbt назывались просто «тестами», поскольку были единственным доступным видом тестирования. С появлением модульных тестов ключ `tests:` был переименован в `data_tests:`.

dbt по-прежнему поддерживает `tests:` в файлах конфигурации YAML для обратной совместимости, и вы можете встретить его в нашей документации. Однако нельзя одновременно использовать ключи `tests` и `data_tests` для одного и того же ресурса (например, одной модели).

<File name='models/schema.yml'>

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
```

</File>

<File name='dbt_project.yml'>

```yaml
data_tests:
  +store_failures: true
```

</File>


## Тесты с `arguments` и без него

Для некоторых универсальных тестов данных достаточно указать только имя теста. Другим нужны дополнительные входные параметры, которые следует вкладывать в свойство `arguments` (доступно в версии v1.10.5 и выше). В v2 вложение входных параметров теста в `arguments` обязательно. Если указать входные параметры теста как свойства верхнего уровня рядом с именем теста, возникнет ошибка валидации.

### Без `arguments`

Тестам `unique` и `not_null` не нужны дополнительные входные параметры. Например, `unique` проверяет, что в столбце нет повторяющихся значений, а `not_null` — что в столбце нет значений null. dbt уже определяет модель и столбец из контекста YAML, поэтому достаточно указать имя теста:

<File name='models/schema.yml'>

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
```

</File>

### С `arguments`

Тестам `accepted_values` и `relationships` нужны дополнительные входные параметры для макроса теста. Например, `accepted_values` проверяет, что значения столбца входят в заданный список, а `relationships` — что каждое значение существует в другой модели (ссылочная целостность). Вложите эти параметры в `arguments:`:

<File name='models/schema.yml'>

```yaml
models:
  - name: orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              arguments: # доступно в версии v1.10.5 и выше. 
                values: ['placed', 'shipped', 'completed', 'returned']
      - name: customer_id
        data_tests:
          - relationships:
              arguments:
                to: ref('customers')
                field: id
```

</File>

Используйте `arguments:` для входных параметров макроса теста (например, `values`, `to` и `field`). Используйте [`config`](/reference/data-test-configs) для параметров фреймворка, таких как `severity`, `where` и `store_failures`.

Если раньше вы указывали входные параметры теста как свойства верхнего уровня рядом с именем теста, перенесите их в `arguments:`. Подробнее см. [`require_generic_test_arguments_property`](/reference/global-configs/behavior-flags/require_generic_test_arguments_property) и [MissingArgumentsPropertyInGenericTestDeprecation](/reference/deprecations#missingargumentspropertyingenerictestdeprecation).

## Добавление контекста к строкам, не прошедшим проверку

Тесты данных возвращают по одной строке для каждого нарушения. Столбцы, указанные в SQL-запросе select вашего теста, — это те столбцы, которые вы видите при разборе нарушений, в том числе при [сохранении результатов тестов с нарушениями](#storing-data-test-failures).

Встроенные тесты часто возвращают только значение, не прошедшее проверку. Чтобы добавить контекст к каждой такой строке, напишите [единичный тест данных](#singular-data-tests) (или [собственный универсальный тест данных](/best-practices/writing-custom-generic-tests)), который выбирает нужные дополнительные столбцы. Ниже приведён единичный тест на основе теста `accepted_values` из примера выше, который также включает `customer_id` для дополнительного контекста. 

<File name='tests/assert_unexpected_order_status.sql'>

```sql
select
    order_id,
    status,
    customer_id
from {{ ref('orders') }}
where status not in ('placed', 'shipped', 'completed', 'returned')
```

</File>

При выполнении `dbt test --store-failures` (или настройке параметра [`store_failures`](/reference/resource-configs/store_failures)) dbt сохраняет эти строки, чтобы вы могли запрашивать их и проверять каждый выбранный столбец.

## Часто задаваемые вопросы

<FAQ path="Tests/available-tests" />
<FAQ path="Tests/test-one-model" />
<FAQ path="Runs/failed-tests" />
<FAQ path="Tests/recommended-tests" />
<FAQ path="Tests/when-to-test" />
<FAQ path="Tests/configurable-data-test-path" />
<FAQ path="Tests/testing-sources" />
<FAQ path="Tests/custom-test-thresholds" />
<FAQ path="Tests/uniqueness-two-columns" />
