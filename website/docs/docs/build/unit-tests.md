---
title: "Модульные тесты"
sidebar_label: "Модульные тесты"
description: "Реализуйте модульные тесты для проверки вашего кода dbt."
search_weight: "heavy"
id: "unit-tests"
keywords:
- unit test, unit tests, unit testing, dag
availability: all_users
---

<VersionCallout version="1.8" />

Исторически, тестовое покрытие dbt ограничивалось [“data” тестами](/docs/build/data-tests), оценивающими качество входных данных или структуру полученных наборов данных. Однако эти тесты могли выполняться _только после_ построения модели.

В dbt есть ещё один тип тестов — модульные тесты. В разработке программного обеспечения модульные тесты проверяют небольшие фрагменты кода, реализующего определённую функциональность, и здесь они работают примерно так же. Модульные тесты позволяют проверять логику SQL-моделей на небольшом наборе статических входных данных _до того_, как вы материализуете модель целиком в production-среде. Модульные тесты позволяют применять разработку через тестирование, повышая эффективность работы разработчиков и надёжность кода. 

import UnitTestsPrereqs from '/snippets/_unit-tests-prereqs.md';

<UnitTestsPrereqs />

#### Особенности, зависящие от адаптера {#adapter-specific-caveats}
- В модульном тесте для BigQuery необходимо указывать **все** поля в `STRUCT`. Нельзя использовать только подмножество полей в `STRUCT`.
- Пользователям Redshift следует учитывать [ограничение при создании модульных тестов](/reference/resource-configs/redshift-configs#unit-test-limitations), которое требует использования обходного решения.
- Источники (sources) в Redshift должны находиться в той же базе данных, что и модели.

:::tip
Ознакомьтесь с нашим [on-demand курсом по модульным тестам](https://learn.getdbt.com/learn/course/unit-testing/welcome-to-unit-testing-5min/introduction-to-unit-testing), чтобы узнать, как добавлять модульные тесты и не только!
:::

Прочтите [документацию по ссылке](/reference/resource-properties/unit-tests) для получения более подробной информации о форматировании ваших модульных тестов.

### Когда добавлять модульный тест к вашей модели {#when-to-add-a-unit-test-to-your-model}

Вы должны модульно тестировать модель:
- Когда ваш SQL содержит сложную логику:
    - Регулярные выражения
    - Математика дат
    - Оконные функции
    - Операторы `case when`, когда много `when`
    - Усечение
- Когда вы пишете пользовательскую логику для обработки входных данных, аналогично созданию функции.
- Мы не рекомендуем проводить модульное тестирование для таких функций, как `min()`, поскольку эти функции тщательно тестируются хранилищем. Если возникает неожиданная проблема, скорее всего, это результат проблем в исходных данных, а не в самой функции. Поэтому фиктивные данные в модульном тесте не предоставят ценной информации.
- Логика, для которой ранее сообщалось о багах.
- Граничные случаи, которые еще не встречались в ваших фактических данных, но которые вы хотите обработать.
- Перед рефакторингом логики преобразования (особенно если рефакторинг значительный).
- Модели с высокой "критичностью" (публичные, контрактные модели или модели, непосредственно находящиеся выше по потоку от экспозиции).

### Когда запускать модульные тесты {#when-to-run-unit-tests}

dbt Labs настоятельно рекомендует запускать модульные тесты только в средах разработки или CI. Поскольку входные данные модульных тестов статичны, нет необходимости использовать дополнительные вычислительные циклы для их запуска в производстве. Используйте их в разработке для подхода, ориентированного на тестирование, и в CI, чтобы убедиться, что изменения не ломают их.

Используйте флаг [типа ресурса](/reference/global-configs/resource-type) `--exclude-resource-type` или переменную окружения <VersionBlock lastVersion="1.10">`DBT_EXCLUDE_RESOURCE_TYPES`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_EXCLUDE_RESOURCE_TYPES`</VersionBlock>, чтобы исключить модульные тесты из сборок в производственной среде и сэкономить вычислительные ресурсы.

Чтобы запускать только модульные тесты по требованию, используйте селектор `test_type` — он работает со всеми движками (<Constant name="core" /> и <Constant name="fusion" />):

```bash
dbt test --select "test_type:unit"
```

<VersionBlock firstVersion="2.0">

## Локальный запуск модульных тестов {#run-unit-tests-locally}

:::note Включение с помощью переменной окружения

Запуск отдельного модульного теста на локальных вычислительных ресурсах пока является экспериментальной возможностью. Прежде чем использовать `compute: local`, установите `DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS=true` в окружении, где запускается dbt.

:::

Вы можете запускать модульные тесты локально, когда работаете над сложным SQL и хотите сразу узнать, правильно ли работает ваша логика. По умолчанию каждый модульный тест отправляет запрос на вашу платформу данных и ожидает результата. Это может замедлять тестирование и расходовать вычислительные ресурсы хранилища.

Поскольку модульные тесты используют статические наборы тестовых данных вместо реальных данных, их необязательно запускать на вашей платформе данных. Используйте [конфигурацию `compute: local`](/reference/resource-configs/compute), чтобы запускать их локально с помощью DuckDB и быстрее получать результаты _без_ затрат на вычислительные ресурсы хранилища.

Это даёт вам:

- Цикл тестирования, который не замедляет вашу работу. Изменяйте SQL, повторно запускайте тест и повторяйте эти шаги, не ожидая в очереди хранилища.
- Возможность тестировать по ходу работы, чтобы обнаруживать ошибки в логике ещё при её написании, а не в CI (или, что хуже, после попадания в производственную среду)
- Запросы, которые выполняются с теми же функциями и семантикой выполнения, что и в удалённом хранилище
- Сохранение вычислительных ресурсов вашей платформы данных для построения моделей.

### Предварительные требования

- Переменная окружения `DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS` установлена в `true`. Эта конфигурация экспериментальная, и её нужно включить явно. Без этого dbt завершится с ошибкой недопустимой конфигурации, в которой будет указано имя переменной.
- Snowflake или BigQuery. Локальное выполнение недоступно для других платформ данных и применяется только к модульным тестам.
- Непосредственные вышестоящие модели тестируемой модели уже существуют на вашей платформе данных. dbt получает их схемы для преобразования вашего SQL, поэтому, если они не существуют, тест завершается с ошибкой получения схемы вышестоящего объекта.
- Для теста параметр `static_analysis` не установлен в `off`. Локальному выполнению нужен статический анализ для преобразования вашего SQL, поэтому `compute: local` переводит [статический анализ](/reference/resource-configs/static-analysis) в режим `strict` для этого теста. Если вы установите `static_analysis: off`, тест не сможет выполняться локально и завершится с ошибкой `ExecutorFailed (dbt1401)`.

### Что нужно знать перед использованием

- dbt получает схемы вышестоящих объектов при первом запуске теста, а затем кэширует их. Последующие запуски используют кэш, поэтому схемы не запрашиваются повторно.
- Локальное выполнение работает, только если dbt может скомпилировать SQL вашей модели и преобразовать его в SQL для DuckDB. Для сложного SQL и функций, специфичных для вашей платформы данных, эквивалента в DuckDB может не быть — например, для функций Snowflake `AI_CLASSIFY` и `haversine`. Так, модель, вызывающая `haversine`, завершается с ошибкой `failed in db_runner: Internal: Catalog Error: Scalar Function with name haversine does not exist!`.
- Ошибка преобразования означает неудачное выполнение теста. Режим `local` не переключается на вашу платформу данных при ошибке, поэтому тест завершается неудачно, а dbt возвращает ненулевой код выхода. 

### Как настроить

Сначала включите эту конфигурацию в окружении, где запускается dbt:

```bash
export DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS=true
```

Затем вы можете настроить её для отдельного модульного теста:

<File name='models/schema.yml'>

```yaml
unit_tests:
  - name: test_is_valid_email_address
    model: dim_customers
    config:
      compute: local
```

</File>

Или для всех модульных тестов в вашем проекте:

<File name='dbt_project.yml'>

```yaml
unit_tests:
  my_project:
    +compute: local
```

</File>

[`compute`](/reference/resource-configs/compute) принимает два значения:

<SimpleTable>

| Значение | Что оно делает |
|-------|--------------|
| `remote` | Отправляет тест на вашу платформу данных для выполнения, используя вычислительные ресурсы хранилища, как и любой другой запрос. Это значение по умолчанию, поэтому явно задавать его нужно только для того, чтобы отменить для конкретного теста действие настройки `+compute: local`, заданной на уровне проекта. |
| `local` | Запускает тест с помощью DuckDB там, где работает сам dbt. На вашу платформу данных ничего не отправляется, поэтому тест быстро возвращает результат и не использует вычислительные ресурсы хранилища. |

</SimpleTable>

В сообщениях об ошибках также может встречаться `sidecar`, но это означает то же самое, что и `local`.

</VersionBlock>

## Модульное тестирование модели {#unit-testing-a-model}

Этот пример создает новую модель `dim_customers` с полем `is_valid_email_address`, которое вычисляет, является ли электронная почта клиента действительной:

<file name='dim_customers.sql'>

```sql
with customers as (

    select * from {{ ref('stg_customers') }}

),

accepted_email_domains as (

    select * from {{ ref('top_level_email_domains') }}

),
	
check_valid_emails as (

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customers.email,
	      coalesce (regexp_like(
            customers.email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
        )
        = true
        and accepted_email_domains.tld is not null,
        false) as is_valid_email_address
    from customers
		left join accepted_email_domains
        on customers.email_top_level_domain = lower(accepted_email_domains.tld)

)

select * from check_valid_emails
```
</file>

Логику, представленную в этом примере, может быть сложно проверить. Вы можете добавить модульный тест к этой модели, чтобы убедиться, что логика `is_valid_email_address` охватывает все известные граничные случаи: электронные письма без `.`, электронные письма без `@` и электронные письма из недействительных доменов.

<file name='dbt_project.yml'> 

```yaml
unit_tests:
  - name: test_is_valid_email_address
    description: "Проверьте, что моя логика is_valid_email_address охватывает все известные граничные случаи - электронные письма без ., электронные письма без @ и электронные письма из недействительных доменов."
    model: dim_customers
    given:
      - input: ref('stg_customers')
        format: dict
        rows:
          - {email: cool@example.com,    email_top_level_domain: example.com}
          - {email: cool@unknown.com,    email_top_level_domain: unknown.com}
          - {email: badgmail.com,        email_top_level_domain: gmail.com}
          - {email: missingdot@gmailcom, email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        format: dict
        rows:
          - {tld: example.com}
          - {tld: gmail.com}
    expect:
      format: dict
      rows:
        - {email: cool@example.com,    is_valid_email_address: true}
        - {email: cool@unknown.com,    is_valid_email_address: false}
        - {email: badgmail.com,        is_valid_email_address: false}
        - {email: missingdot@gmailcom, is_valid_email_address: false}

```
</file>

Предыдущий пример определяет фиктивные данные, используя встроенный формат `dict`, но вы также можете использовать `csv` или `sql` как встроенно, так и в отдельном файле фикстуры. Храните ваши файлы фикстур в подкаталоге `fixtures` в любом из ваших [путей тестирования](/reference/project-configs/test-paths). Например, `tests/fixtures/my_unit_test_fixture.sql`.

Следующие примеры показывают, как определить тестовые данные и ожидаемый результат с помощью `csv` и `sql`.

<File name='models/schema.yml'>

```yaml
unit_tests:
  - name: test_is_valid_email_address__csv
    model: dim_customers
    given:
      - input: ref('stg_customers')
        format: dict
        rows:
          - {email: cool@example.com,    email_top_level_domain: example.com}
          - {email: cool@unknown.com,    email_top_level_domain: unknown.com}
          - {email: badgmail.com,        email_top_level_domain: gmail.com}
          - {email: missingdot@gmailcom, email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        format: csv
        rows: |
          tld
          example.com
          gmail.com
    expect:
      format: csv
      fixture: valid_email_address_fixture_output
```

</File>

<File name='models/schema.yml'>

```yaml
unit_tests:
  - name: test_is_valid_email_address__sql
    model: dim_customers
    given:
      - input: ref('stg_customers')
        format: dict
        rows:
          - {email: cool@example.com,    email_top_level_domain: example.com}
          - {email: cool@unknown.com,    email_top_level_domain: unknown.com}
          - {email: badgmail.com,        email_top_level_domain: gmail.com}
          - {email: missingdot@gmailcom, email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        format: sql
        rows: |
          select 'example.com' as tld union all
          select 'gmail.com' as tld
    expect:
      format: sql
      fixture: valid_email_address_fixture_output
```

</File>

При использовании формата `dict` или `csv` достаточно определить тестовые данные только для нужных вам столбцов. Это позволяет писать краткие и _узконаправленные_ модульные тесты.

:::note

Прямые родители модели, которую вы тестируете модульно (в этом примере, `stg_customers` и `top_level_email_domains`), должны существовать в хранилище до того, как вы сможете выполнить модульный тест.

Используйте флаг [`--empty`](/reference/commands/build#the-empty-flag), чтобы построить пустую версию моделей и сэкономить расходы на хранилище.

```bash

dbt run --select "stg_customers top_level_email_domains" --empty

```

Или используйте `dbt build`, чтобы, в порядке наследования:

- Запустить модульные тесты на вашей модели.
- Материализовать вашу модель в хранилище.
- Запустить тесты данных на вашей модели.

:::

Теперь вы готовы запустить этот модульный тест. У вас есть несколько вариантов команд в зависимости от того, насколько конкретно вы хотите быть:

- `dbt test --select dim_customers` запускает _все_ тесты на `dim_customers`.
- `dbt test --select "dim_customers,test_type:unit"` запускает все _модульные_ тесты на `dim_customers`.
- `dbt test --select test_is_valid_email_address` запускает тест с именем `test_is_valid_email_address`.

```shell

dbt test --select test_is_valid_email_address
16:03:49  Running with dbt=1.8.0-a1
16:03:49  Registered adapter: postgres=1.8.0-a1
16:03:50  Found 6 models, 5 seeds, 4 data tests, 0 sources, 0 exposures, 0 metrics, 410 macros, 0 groups, 0 semantic models, 1 unit test
16:03:50  
16:03:50  Concurrency: 5 threads (target='postgres')
16:03:50  
16:03:50  1 of 1 START unit_test dim_customers::test_is_valid_email_address ................... [RUN]
16:03:51  1 of 1 FAIL 1 dim_customers::test_is_valid_email_address ............................ [FAIL 1 in 0.26s]
16:03:51  
16:03:51  Finished running 1 unit_test in 0 hours 0 minutes and 0.67 seconds (0.67s).
16:03:51  
16:03:51  Completed with 1 error and 0 warnings:
16:03:51  
16:03:51  Failure in unit_test test_is_valid_email_address (models/marts/unit_tests.yml)
16:03:51    

actual differs from expected:

@@ ,email           ,is_valid_email_address
→  ,cool@example.com,True→False
   ,cool@unknown.com,False
...,...             ,...


16:03:51  
16:03:51    compiled Code at models/marts/unit_tests.yml
16:03:51  
16:03:51  Done. PASS=0 WARN=0 ERROR=1 SKIP=0 TOTAL=1

```

Умное регулярное выражение оказалось не таким умным, как предполагалось, так как модель неправильно пометила `cool@example.com` как недействительный адрес электронной почты.

Обновление логики регулярного выражения на `'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'` (эти надоедливые символы экранирования) и повторный запуск модульного теста решает проблему:

```shell

dbt test --select test_is_valid_email_address
16:09:11  Running with dbt=1.8.0-a1
16:09:12  Registered adapter: postgres=1.8.0-a1
16:09:12  Found 6 models, 5 seeds, 4 data tests, 0 sources, 0 exposures, 0 metrics, 410 macros, 0 groups, 0 semantic models, 1 unit test
16:09:12  
16:09:13  Concurrency: 5 threads (target='postgres')
16:09:13  
16:09:13  1 of 1 START unit_test dim_customers::test_is_valid_email_address ................... [RUN]
16:09:13  1 of 1 PASS dim_customers::test_is_valid_email_address .............................. [PASS in 0.26s]
16:09:13  
16:09:13  Finished running 1 unit_test in 0 hours 0 minutes and 0.75 seconds (0.75s).
16:09:13  
16:09:13  Completed successfully
16:09:13  
16:09:13  Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1

```

Ваша модель теперь готова к производству! Добавление этого модульного теста помогло выявить проблему с логикой SQL _до_ того, как вы материализовали `dim_customers` в вашем хранилище, и лучше обеспечит надежность этой модели в будущем.

## Модульное тестирование инкрементальных моделей {#unit-testing-incremental-models}

При настройке модульного теста вы можете переопределять вывод макросов, значения `vars` или переменных окружения. Это позволяет выполнять модульное тестирование инкрементальных моделей как в режиме **«full refresh»**, так и в **«incremental»**.

:::note
Инкрементальные модели должны существовать в базе данных до запуска модульных тестов или выполнения `dbt build`. Используйте [флаг `--empty`](/reference/commands/build#the-empty-flag), чтобы создать пустые версии моделей и сократить расходы на использование хранилища данных. При необходимости можно выбрать только инкрементальные модели с помощью [флага `--select`](/reference/node-selection/syntax#shorthand).

  ```shell
  dbt run --select "config.materialized:incremental" --empty
  ```

  После выполнения этой команды вы можете запустить обычный `dbt build` для нужной модели, а затем выполнить модульный тест.
:::

Например, предположим, что у вас есть инкрементная модель в вашем проекте:

<File name='my_incremental_model.sql'>

```sql

{{
    config(
        materialized='incremental'
    )
}}

select * from {{ ref('events') }}
{% if is_incremental() %}
where event_time > (select max(event_time) from {{ this }})
{% endif %}

```

</File>

Вы можете определить модульные тесты для `my_incremental_model`, чтобы убедиться, что ваша инкрементная логика работает как ожидается:

```yaml

unit_tests:
  - name: my_incremental_model_full_refresh_mode
    model: my_incremental_model
    overrides:
      macros:
        # модульно тестировать эту модель в режиме "полного обновления"
        is_incremental: false 
    given:
      - input: ref('events')
        rows:
          - {event_id: 1, event_time: 2020-01-01}
    expect:
      rows:
        - {event_id: 1, event_time: 2020-01-01}

  - name: my_incremental_model_incremental_mode
    model: my_incremental_model
    overrides:
      macros:
        # модульно тестировать эту модель в режиме "инкрементного"
        is_incremental: true 
    given:
      - input: ref('events')
        rows:
          - {event_id: 1, event_time: 2020-01-01}
          - {event_id: 2, event_time: 2020-01-02}
          - {event_id: 3, event_time: 2020-01-03}
      - input: this 
        # содержимое текущей my_incremental_model
        rows:
          - {event_id: 1, event_time: 2020-01-01}
    expect:
      # что будет вставлено/объединено в my_incremental_model
      rows:
        - {event_id: 2, event_time: 2020-01-02}
        - {event_id: 3, event_time: 2020-01-03}

```

В настоящее время нет возможности с помощью юнит-тестов проверить, правильно ли фреймворк dbt вставил записи в существующую модель или объединил их с уже имеющимися, но [мы изучаем возможность добавить такую поддержку в будущем](https://github.com/dbt-labs/dbt/issues/8664).

## Юнит‑тестирование модели, которая зависит от эфемерной модели (или моделей) {#unit-testing-a-model-that-depends-on-ephemeral-models}

Если вы хотите модульно протестировать модель, которая зависит от эфемерной модели, вы должны использовать `format: sql` для этого входа.

```yaml
unit_tests:
  - name: my_unit_test
    model: dim_customers
    given:
      - input: ref('ephemeral_model')
        format: sql
        rows: |
          select 1 as id, 'emily' as first_name
    expect:
      rows:
        - {id: 1, first_name: emily}
```

## Коды выхода модульных тестов {#unit-test-exit-codes}

Успехи и неудачи модульных тестов представлены двумя кодами выхода:
- Успех (0)
- Неудача (1)

Коды выхода отличаются от выходов успеха и неудачи тестов данных, потому что они не отражают напрямую неудачные тесты данных. Тесты данных - это запросы, предназначенные для проверки определенных условий в ваших данных, и они возвращают одну строку на каждый неудачный тестовый случай (например, количество значений с дубликатами для теста `unique`). dbt сообщает количество неудачных записей как неудачи. В то время как каждый модульный тест представляет один 'тестовый случай', поэтому результаты всегда 0 (успех) или 1 (неудача) независимо от того, сколько записей не удалось в этом тестовом случае.

Узнайте больше о [кодах выхода](/reference/exit-codes) для получения дополнительной информации.

## Дополнительные ресурсы {#additional-resources}

- [Страница справки по модульному тестированию](/reference/resource-properties/unit-tests)
- [Поддерживаемые форматы данных для фиктивных данных](/reference/resource-properties/data-formats)
- [Модульное тестирование версионных моделей](/reference/resource-properties/unit-testing-versions)
- [Входы модульных тестов](/reference/resource-properties/unit-test-input)
- [Переопределения модульных тестов](/reference/resource-properties/unit-test-overrides)
- [Платформенно-специфичные типы данных](/reference/resource-properties/data-types)