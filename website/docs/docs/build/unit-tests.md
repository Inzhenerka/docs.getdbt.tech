---
title: "Модульные тесты"
sidebar_label: "Модульные тесты"
description: "Реализуйте модульные тесты для проверки вашего кода dbt."
search_weight: "heavy"
id: "unit-tests"
keywords:
  - модульный тест, модульные тесты, модульное тестирование, dag
---

<VersionCallout version="1.8" />

Исторически, тестовое покрытие dbt ограничивалось [“data” тестами](/docs/build/data-tests), оценивающими качество входных данных или структуру полученных наборов данных. Однако эти тесты могли выполняться _только после_ построения модели.

В dbt существует дополнительный тип тестов — unit tests (модульные тесты). В программировании модульные тесты проверяют небольшие фрагменты функционального кода, и здесь они работают аналогичным образом. Unit tests позволяют проверять логику SQL-моделирования на небольшом наборе статических входных данных **до того**, как вы материализуете полную модель в продакшене. Модульные тесты делают возможной разработку через тестирование (test-driven development), что повышает эффективность разработчиков и надежность кода.

## Прежде чем начать {#before-you-begin}

- В настоящее время мы поддерживаем модульное тестирование только для SQL-моделей.
- В настоящее время мы поддерживаем добавление модульных тестов только к моделям в вашем _текущем_ проекте.
- В настоящее время мы _не_ поддерживаем модульное тестирование моделей, использующих материализацию [`materialized view`](/docs/build/materializations#materialized-view).
- В настоящее время мы _не_ поддерживаем модульное тестирование моделей, использующих рекурсивный SQL.
- В настоящее время мы _не_ поддерживаем модульное тестирование моделей, использующих интроспективные запросы.
- Если у вашей модели есть несколько версий, по умолчанию модульный тест будет выполняться на *всех* версиях вашей модели. Прочтите [модульное тестирование версионных моделей](/reference/resource-properties/unit-testing-versions) для получения дополнительной информации.
- Модульные тесты должны быть определены в YML-файле в вашем [`models/` каталоге](/reference/project-configs/model-paths).
- Имена таблиц должны быть алиасированы для модульного тестирования логики `join`.
- Включите все ссылки на модели [`ref`](/reference/dbt-jinja-functions/ref) или [`source`](/reference/dbt-jinja-functions/source) в конфигурацию модульного теста как `input`, чтобы избежать ошибок "узел не найден" во время компиляции.

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

Используйте флаг [resource type](/reference/global-configs/resource-type) `--exclude-resource-type` или переменную окружения `DBT_EXCLUDE_RESOURCE_TYPES`, чтобы исключить модульные тесты из ваших производственных сборок и сэкономить вычислительные ресурсы.

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
        rows:
          - {email: cool@example.com,    email_top_level_domain: example.com}
          - {email: cool@unknown.com,    email_top_level_domain: unknown.com}
          - {email: badgmail.com,        email_top_level_domain: gmail.com}
          - {email: missingdot@gmailcom, email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        rows:
          - {tld: example.com}
          - {tld: gmail.com}
    expect:
      rows:
        - {email: cool@example.com,    is_valid_email_address: true}
        - {email: cool@unknown.com,    is_valid_email_address: false}
        - {email: badgmail.com,        is_valid_email_address: false}
        - {email: missingdot@gmailcom, is_valid_email_address: false}

```
</file>

Предыдущий пример определяет фиктивные данные, используя встроенный формат `dict`, но вы также можете использовать `csv` или `sql` как встроенно, так и в отдельном файле фикстуры. Храните ваши файлы фикстур в подкаталоге `fixtures` в любом из ваших [путей тестирования](/reference/project-configs/test-paths). Например, `tests/fixtures/my_unit_test_fixture.sql`.

При использовании формата `dict` или `csv` вам нужно определить только фиктивные данные для столбцов, которые вас интересуют. Это позволяет вам писать краткие и _специфичные_ модульные тесты.

:::note

Прямые родители модели, которую вы тестируете модульно (в этом примере, `stg_customers` и `top_level_email_domains`), должны существовать в хранилище до того, как вы сможете выполнить модульный тест.

Используйте флаг [`--empty`](/reference/commands/build#the---empty-flag), чтобы построить пустую версию моделей и сэкономить расходы на хранилище.

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
Инкрементальные модели должны **сначала существовать в базе данных**, прежде чем можно запускать модульные тесты или выполнять `dbt build`. Используйте флаг [`--empty`](/reference/commands/build#the---empty-flag), чтобы создать пустую версию моделей и сократить затраты на хранилище данных. Также при необходимости можно выбрать только инкрементальные модели с помощью флага [`--select`](/reference/node-selection/syntax#shorthand).

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

```yml

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

В настоящее время нет способа модульно протестировать, правильно ли фреймворк dbt вставил/объединил записи в вашу существующую модель, но [мы исследуем поддержку этого в будущем](https://github.com/dbt-labs/dbt-core/issues/8664).

## Юнит‑тестирование модели, которая зависит от эфемерной модели (или моделей) {#unit-testing-a-model-that-depends-on-ephemeral-models}

Если вы хотите модульно протестировать модель, которая зависит от эфемерной модели, вы должны использовать `format: sql` для этого входа.

```yml
unit_tests:
  - name: my_unit_test
    model: dim_customers
    given:
      - input: ref('ephemeral_model')
        format: sql
        rows: |
          select 1 as id, 'emily' as name
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