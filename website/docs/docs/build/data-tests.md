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
---

import CopilotBeta from '/snippets/_dbt-copilot-avail.md';

<CopilotBeta resource='data tests' />

## Связанные справочные документы
* [Команда тестирования](/reference/commands/test)
* [Свойства тестов данных](/reference/resource-properties/data-tests)
* [Конфигурации тестов данных](/reference/data-test-configs)
* [Примеры выбора тестов](/reference/node-selection/test-selection-examples)

:::important

Тесты теперь называются **data tests**, чтобы избежать путаницы с [unit tests](/docs/build/unit-tests). YAML-ключ `tests:` по‑прежнему поддерживается как алиас для `data_tests:`. Подробнее см. в разделе [New `data_tests:` syntax](#new-data_tests-syntax).

:::

## Overview

Data tests — это утверждения, которые вы задаёте для своих моделей и других ресурсов в проекте dbt (например, sources, seeds и snapshots). Когда вы запускаете `dbt test`, dbt сообщает, проходит ли каждый тест в вашем проекте или завершается с ошибкой.

Вы можете использовать тесты данных для улучшения целостности SQL в каждой модели, делая утверждения о сгенерированных результатах. Из коробки вы можете проверить, содержит ли указанный столбец в модели только ненулевые значения, уникальные значения или значения, которые имеют соответствующее значение в другой модели (например, `customer_id` для `order` соответствует `id` в модели `customers`), и значения из указанного списка. Вы можете расширить тесты данных, чтобы они соответствовали бизнес-логике, специфичной для вашей организации — любое утверждение, которое вы можете сделать о своей модели в форме запроса select, может быть преобразовано в тест данных.

Тесты данных возвращают набор записей, которые не прошли проверку. Универсальные тесты данных (также известные как schema tests) определяются с помощью блоков `test`.

Как и почти все в dbt, тесты данных — это SQL-запросы. В частности, это операторы `select`, которые стремятся захватить "неудачные" записи, те, которые опровергают ваше утверждение. Если вы утверждаете, что столбец уникален в модели, тестовый запрос выбирает дубликаты; если вы утверждаете, что столбец никогда не бывает пустым, тест ищет пустые значения. Если тест данных возвращает ноль неудачных строк, он проходит, и ваше утверждение подтверждается.

В dbt есть два способа определения тестов данных:

- **Сингулярный** (singular) тест данных — это тестирование в самом простом виде: если вы можете написать SQL‑запрос, который возвращает строки с ошибками, вы можете сохранить этот запрос в `.sql`‑файле внутри вашего [каталога тестов](/reference/project-configs/test-paths). Теперь это тест данных, и он будет выполнен командой `dbt test`.
- **Обобщённый** (generic) тест данных — это параметризованный запрос, который принимает аргументы. Сам запрос теста определяется в специальном блоке `test` (аналогично [macro](jinja-macros)). После определения вы можете ссылаться на обобщённый тест по имени в ваших `.yml`‑файлах — назначать его моделям, колонкам, источникам, снапшотам и сид‑таблицам. В dbt уже встроены четыре обобщённых теста данных, и мы считаем, что вам стоит ими пользоваться!

Определение тестов данных — отличный способ подтвердить, что ваши выходные и входные данные соответствуют ожиданиям, и помогает предотвратить регрессии при изменении вашего кода. Поскольку вы можете использовать их снова и снова, делая аналогичные утверждения с небольшими вариациями, общие тесты данных, как правило, гораздо более распространены — они должны составлять основную часть вашего набора тестов данных dbt. Тем не менее, оба способа определения тестов данных имеют свое время и место.

:::tip Создание ваших первых data tests
Если вы только начинаете работать с dbt, мы рекомендуем ознакомиться с нашим [онлайн-курсом dbt Fundamentals](https://learn.getdbt.com/learn/course/dbt-fundamentals/data-tests-30min/building-tests?page=1) или [кратким руководством](/guides), чтобы создать свой первый dbt‑проект с моделями и тестами.
:::

## Единичные тесты данных

Самый простой способ определить тест данных — это написать точный SQL, который вернет неудачные записи. Мы называем их "единичными" тестами данных, потому что это одноразовые утверждения, используемые для одной цели.

Эти тесты определяются в файлах `.sql`, обычно в вашем каталоге `tests` (как определено вашей конфигурацией [`test-paths`](/reference/project-configs/test-paths)). Вы можете использовать Jinja (включая `ref` и `source`) в определении теста, так же как и при создании моделей. Каждый файл `.sql` содержит один оператор `select` и определяет один тест данных:

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

Имя этого теста — это имя файла: `assert_total_payment_amount_is_positive`.

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

## Общие тесты данных
Некоторые тесты данных являются общими: их можно использовать снова и снова. Общий тест данных определяется в блоке `test`, который содержит параметризованный запрос и принимает аргументы. Он может выглядеть так:

```sql
{% test not_null(model, column_name) %}

    select *
    from {{ model }}
    where {{ column_name }} is null

{% endtest %}
```

Вы заметите, что здесь есть два аргумента — `model` и `column_name`, — которые затем подставляются в запрос с помощью шаблонов. Именно это делает тест данных «обобщённым» (generic): его можно определить для любого количества колонок и для любого количества моделей, а dbt соответствующим образом передаст значения `model` и `column_name`. После того как такой обобщённый тест определён, его можно добавить как _свойство_ к любой существующей модели (или источнику, seed или snapshot). Эти свойства добавляются в файлах `.yml`, расположенных в той же директории, что и ваш ресурс.

:::info
Если это ваш первый опыт работы с добавлением свойств к ресурсу, ознакомьтесь с документацией по [объявлению свойств](/reference/configs-and-properties).
:::

Из коробки dbt поставляется с четырьмя уже определенными общими тестами данных: `unique`, `not_null`, `accepted_values` и `relationships`. Вот полный пример использования этих тестов на модели `orders`:

```yml

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

На простом языке, эти тесты данных переводятся как:
* `unique`: столбец `order_id` в модели `orders` должен быть уникальным
* `not_null`: столбец `order_id` в модели `orders` не должен содержать пустых значений
* `accepted_values`: столбец `status` в `orders` должен быть одним из `'placed'`, `'shipped'`, `'completed'` или `'returned'`
* `relationships`: каждый `customer_id` в модели `orders` существует как `id` в `customers` <Term id="table" /> (также известная как ссылочная целостность)

За кулисами dbt строит `select` запрос для каждого теста данных, используя параметризованный запрос из общего блока теста. Эти запросы возвращают строки, где ваше утверждение _не_ является истинным; если тест возвращает ноль строк, ваше утверждение проходит.

Вы можете найти больше информации об этих тестах данных, а также о дополнительных настройках (включая [`severity`](/reference/resource-configs/severity) и [`tags`](/reference/resource-configs/tags)) в [разделе справки](/reference/resource-properties/data-tests). Также вы можете добавлять описания в Jinja‑макрос, который реализует основную логику обобщённого теста данных. Подробнее см. в разделе [Add description to generic data test logic](/best-practices/writing-custom-generic-tests#add-description-to-generic-data-test-logic).

### Больше общих тестов данных

Этих четырёх тестов достаточно, чтобы начать работу. Очень скоро вы обнаружите, что хотите использовать более широкий набор тестов данных — и это хорошо! Вы также можете установить обобщённые (generic) тесты данных из пакета или написать свои собственные, чтобы использовать их (и переиспользовать) в рамках проекта dbt. Подробнее об этом читайте в [руководстве по созданию собственных generic‑тестов данных](/best-practices/writing-custom-generic-tests).

:::info
В некоторых open‑source пакетах уже определены generic‑тесты данных, например в [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) и [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) — перейдите к документации по [пакетам](/docs/build/packages), чтобы узнать больше!
:::

### Пример
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
   * **<Constant name="cloud" />:** проверьте вкладку Details.
   * **dbt Core:** проверьте директорию `target/compiled`.


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

## Хранение результатов неудачных тестов данных

Обычно запрос теста данных вычисляет неудачи в процессе своего выполнения. Если вы установите необязательный флаг `--store-failures`, конфигурацию [`store_failures`](/reference/resource-configs/store_failures) или конфигурацию [`store_failures_as`](/reference/resource-configs/store_failures_as), dbt сначала сохранит результаты тестового запроса в таблицу в базе данных, а затем выполнит запрос к этой таблице, чтобы вычислить количество неудач.

Этот рабочий процесс позволяет вам быстрее запрашивать и изучать неудачные записи в процессе разработки:

<Lightbox src="/img/docs/building-a-dbt-project/test-store-failures.gif" title="Храните неудачные тесты в базе данных для более быстрого отладки во время разработки."/>

Обратите внимание: если вы выбираете сохранение результатов неудачных data tests:

* Таблицы с результатами тестов по умолчанию создаются в схеме с суффиксом или именем `dbt_test__audit`. Это значение можно изменить, указав параметр `schema` в конфигурации. (Подробнее о правилах именования схем см. в разделе [using custom schemas](/docs/build/custom-schemas).)
* Результаты теста всегда **заменяют** предыдущие неудачные результаты для того же самого теста.



## Новый синтаксис `data_tests:`
  
Исторически data tests в dbt назывались просто «tests», поскольку это была единственная форма тестирования. С появлением unit tests ключ был переименован с `tests:` на `data_tests:`. 

dbt по‑прежнему поддерживает ключ `tests:` в ваших YML‑файлах конфигурации из соображений обратной совместимости, и вы можете встретить его использование в документации. Однако нельзя одновременно использовать ключи `tests` и `data_tests`, связанные с одним и тем же ресурсом (например, с одной моделью).

<File name='models/schema.yml'>

```yml
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

```yml
data_tests:
  +store_failures: true
```

</File>


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
