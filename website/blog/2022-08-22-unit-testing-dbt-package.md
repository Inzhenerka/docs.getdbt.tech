---
title: "Введение в модульное тестирование ваших dbt пакетов"
description: "Традиционно, интеграционные тесты были основной стратегией тестирования dbt пакетов. В этом посте Ю Исикава расскажет, как добавить модульное тестирование."
slug: unit-testing-dbt-packages
authors: [yu_ishikawa]
tags: [dbt tutorials]
hide_table_of_contents: false

date: 2022-08-25
is_featured: true
---

_Примечание редактора - этот пост предполагает знание разработки dbt пакетов. Для введения в dbt пакеты ознакомьтесь с [So You Want to Build a dbt Package](https://docs.getdbt.tech/blog/so-you-want-to-build-a-package)._

Важно уметь тестировать любой dbt проект, но еще важнее убедиться в наличии надежного тестирования, если вы разрабатываете [dbt пакет](https://docs.getdbt.tech/docs/build/packages).

Я люблю dbt пакеты, потому что они упрощают расширение функциональности dbt и создание повторно используемых аналитических ресурсов. Еще лучше, мы можем находить и делиться dbt пакетами, разработанными другими, находя отличные пакеты на [dbt hub](https://hub.getdbt.com/). Однако разработка сложных dbt макросов может быть затруднительной, потому что dbt на базе [Jinja2](https://palletsprojects.com/p/jinja/) не обладает некоторыми функциями, которые вы ожидаете в разработке программного обеспечения, такими как модульное тестирование.

В этой статье я хотел бы поделиться вариантами модульного тестирования вашего dbt пакета - сначала обсудив часто используемый паттерн интеграционного тестирования, а затем показав, как мы можем внедрить модульные тесты в наш арсенал тестирования.
<!--truncate-->

## Модульное тестирование vs. Интеграционное тестирование {#unit-testing-vs-integration-testing}

Модульное тестирование и интеграционное тестирование - это два общих подхода к созданию хорошо протестированного кода. Для глубокого погружения в различия между ними ознакомьтесь с [этой статьей](https://circleci.com/blog/unit-testing-vs-integration-testing/) от команды CircleCI. На высоком уровне:

- **Интеграционные тесты** - это тесты, которые работают с целым интегрированным проектом или приложением.
- **Модульные тесты** - это тесты, которые проверяют отдельный элемент в проекте программного обеспечения, такой как отдельная функция или макрос.

Многие dbt пакеты используют интеграционные тесты как основную методологию тестирования. Например, [dbt-utils](https://github.com/dbt-labs/dbt-utils) имеет [каталог integration_tests](https://github.com/dbt-labs/dbt-utils/tree/main/integration_tests), чтобы мы могли запускать интеграционные тесты, используя общие тесты и макросы, содержащиеся в пакете. Каталог интеграционных тестов по сути является стандартным dbt проектом внутри пакета dbt-utils, который тестируется так же, как и любой другой dbt проект.

Чтобы использовать интеграционные тесты, вы просто запускаете `dbt test` в каталоге `integration_tests`. Тесты выполняются как обычно, что означает, что вы можете использовать свои любимые методы запуска CI для вашего dbt проекта, чтобы убедиться, что ваши интеграционные тесты проходят.

Интеграционные тесты могут помочь вам быть уверенными, что ваш пакет работает как ожидается, но у них есть некоторые недостатки. Макросы и общие тесты часто вызывают другие макросы, и чем глубже становятся вызовы зависимостей, тем сложнее становится отлаживать ваши макросы, используя только интеграционные тесты.

В этой ситуации может быть полезно выйти за рамки интеграционных тестов и внедрить модульные тесты для ваших макросов. Эти модульные тесты можно запускать с помощью [dbt run operation](https://docs.getdbt.tech/reference/commands/run-operation). Давайте рассмотрим быстрый пример того, как это можно сделать.

Рассмотрим dbt пакет под названием dbt_sample_package. Мы хотели бы реализовать простой макрос для создания строкового литерала из текстовой строки в макросе с именем `to_literal` в файле `macros/to_literal.sql`.

```sql
-- macros/to_literal.sql
{% macro to_literal(text) %}

    '{{- text -}}'

{% endmacro %}
```

---

Чтобы реализовать макрос модульного тестирования, соответствующий макросу `to_literal`, мы можем создать макрос для тестирования нашего оригинального макроса в `integration_tests/macros/test_to_literal.sql`.

Затем мы вызываем макрос `to_literal` в тестовом макросе, и если результат не соответствует ожидаемому, мы вызываем ошибку с помощью макроса [exceptions.raise_compiler_error](https://docs.getdbt.tech/reference/dbt-jinja-functions/exceptions).

```sql
-- integration_tests/macros/test_to_literal.sql
{% macro test_to_literal() %}

    {% = dbt_sample_package.to_literal('test string') %}

    {% if result != "'test string'" %}

        {{ exceptions.raise_compiler_error('The test is failed') }}

    {% endif %}

{% endmacro %}
```

---

Таким образом, мы можем вызвать тестовый макрос в dbt проекте интеграционных тестов, используя `dbt run-operation`.

```shell
dbt run-operation test_to_literal
```

---

Если мы хотим запустить все тесты одной командой, было бы хорошо объединить их в макрос. Более того, мы можем вызвать макрос с помощью `dbt run-operation`.

```sql
-- integration_tests/macros/run_unit_tests.sql
{% macro run_unit_tests() %}

    {% do test_to_literal() %}

    {% do another_test() %}

{% endmacro %}
```

---

## Модульные тесты для нескольких адаптеров {#unit-tests-for-multiple-adapters}

Ваш dbt пакет может поддерживать несколько адаптеров. Если вы пользователь postgres, вы понимаете, что предыдущий макрос `to_literal` не работает на postgres, потому что выражение для работы со строковым литералом отличается. Поэтому мы должны реализовать макрос для обработки особого случая postgres. Теперь мы реализуем следующий макрос под названием `postgres__to_literal` в `macros/to_literal.sql` в дополнение к вышеуказанной реализации.

```sql
-- macros/to_literal.sql
{% macro to_literal(text) %}

    {{ return(adapter.dispatch('to_literal', 'dbt_sample_package')(text)) }}

{% endmacro %}

{% macro default__to_literal(text) %}

    '{{- text -}}'

{% endmacro %}

{% macro postgres__to_literal(text) %}

    E'{{- text -}}'

{% endmacro %}
```

---

Вы можете подумать, как мы можем эффективно реализовать макросы модульного тестирования. Мы можем использовать [макрос adapter.dispatch](https://docs.getdbt.tech/reference/dbt-jinja-functions/dispatch) даже в макросах модульного тестирования. Поскольку мы разделяем поведение для postgres, мы можем также реализовать независимый макрос модульного тестирования для postgres.

```sql
-- integration_tests/macros/test_to_literal.sql
{% macro test_to_literal() %}

    {{ return(adapter.dispatch('test_to_literal', 'integration_tests')(text)) }}

{% endmacro %}

{% macro default__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {% if result != "'test string'" %}

        {{ exceptions.raise_compiler_error('The test is failed') }}

    {% endif %}

{% endmacro %}

{% macro postgres__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {% if result != "E'test string'" %}

        {{ exceptions.raise_compiler_error('The test is failed') }}

    {% endif %}

{% endmacro%}
```

---

Затем мы можем выбирать модульные тесты на основе указанного адаптера. Предположим, у нас есть разные dbt профили, соответствующие BigQuery и postgres. Указав dbt профиль на основе адаптера, мы можем выбрать, какие тестовые макросы вызываются внутренне.

```shell
# Запуск модульных тестов на BigQuery
dbt run-operation run_unit_tests --profile bigquery
# `default__test_to_literal` вызывается внутренне.

# Запуск модульных тестов на postgres
dbt run-operation run_unit_tests --profile postgres
# `postgres__test_to_literal` вызывается внутренне.
```

---

## Введение в dbt-unittest {#introducing-dbt-unittest}

Исторически сложилось так, что выполнение модульного тестирования в вашем dbt пакете было сложной задачей, так как Jinja2 не предлагает встроенной функции модульного тестирования. Но у нас есть хорошие новости: dbt предоставляет макрос `exceptions.raise_compiler_error`, чтобы мы могли вызывать ошибки в `dbt run-operation`. Используя это, я реализовал dbt пакет под названием [yu-iskw/dbt-unittest](https://hub.getdbt.com/yu-iskw/dbt_unittest/latest/), который вдохновлен [модулем unittest в Python](https://docs.python.org/3/library/unittest.html), чтобы улучшить модульное тестирование в разработке dbt пакетов.

[GitHub — yu-iskw/dbt-unittest: пакет dbt, предоставляющий макросы для модульного тестирования](https://github.com/yu-iskw/dbt-unittest)

Используя это, мы можем переосуществить пример, используя макрос `dbt_unittest.assert_equals`, и реализация становится намного проще.

```sql
-- integration_tests/macros/test_to_literal.sql
{% macro test_to_literal() %}

    {{ return(adapter.dispatch('test_to_literal', 'integration_tests')(text)) }}

{% endmacro %}

{% macro default__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {{ dbt_unittest.assert_equals(result, "'test string'") }}

{% endmacro %}

{% macro postgres__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {{ dbt_unittest.assert_equals(result, "E'test string'") }}

{% endmacro %}
```

---

Я применил эту идею даже в разработке `yu-iskw/dbt-unittest`. Фактические тестовые макросы находятся [здесь](https://github.com/yu-iskw/dbt-unittest/tree/main/integration_tests/macros/tests). Более того, мы можем реализовать рабочий процесс непрерывной интеграции как в обычной разработке программного обеспечения. Например, я реализовал [рабочий процесс с GitHub Actions](https://github.com/yu-iskw/dbt-unittest/blob/main/.github/workflows/unit-tests.yml). Это позволяет мне заметить, если что-то не так с изменениями.

Кроме того, было бы здорово взглянуть на другие dbt пакеты для интеграционного и модульного тестирования на dbt hub. Например, [пакет dbt_datamocktool](https://hub.getdbt.com/mjirv/dbt_datamocktool/latest/) - это еще один полезный пакет для модульного тестирования dbt проектов. Мы можем создавать фиктивные CSV семена, чтобы заменить источники и ссылки, которые используют ваши модели, и тестировать, что модель производит желаемый результат. Это было бы полезно для создания фиктивных тестовых данных для вашего dbt проекта.

## Резюме {#summary}

В этой статье мы:

- Представили два подхода к тестированию ваших dbt пакетов
- Продемонстрировали простой пример модульного тестирования
- Показали, как вы можете использовать существующие инструменты для расширения ваших возможностей модульного тестирования

Надеюсь, это будет полезно вам в вашем пути разработки dbt пакетов.