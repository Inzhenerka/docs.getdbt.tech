---
title: "Создание пользовательских универсальных тестов данных"
id: "writing-custom-generic-tests"
description: Узнайте, как определить собственные пользовательские универсальные тесты данных.
displayText: Создание пользовательских универсальных тестов данных
hoverSnippet: Узнайте, как написать собственные пользовательские универсальные тесты данных.
---

dbt поставляется с универсальными тестами данных [Not Null](/reference/resource-properties/data-tests#not-null), [Unique](/reference/resource-properties/data-tests#unique), [Relationships](/reference/resource-properties/data-tests#relationships) и [Accepted Values](/reference/resource-properties/data-tests#accepted-values). (Ранее они назывались "тестами схемы", и вы все еще можете встретить это название в некоторых местах.) Внутри эти универсальные тесты данных определяются как блоки `test` (как макросы).

:::info
Существует множество универсальных тестов данных, определенных в open source пакетах, таких как [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) и [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) — возможно, тест, который вы ищете, уже здесь!
:::

### Универсальные тесты со стандартными аргументами

Универсальные тесты определяются в SQL-файлах. Эти файлы могут находиться в двух местах:
- `tests/generic/`: то есть в специальной подпапке с именем `generic` в ваших [путях тестов](/reference/project-configs/test-paths) (`tests/` по умолчанию)
- `macros/`: Почему? Универсальные тесты работают очень похоже на макросы, и исторически это было единственное место, где их можно было определить. Если ваш универсальный тест зависит от сложной логики макросов, вам может быть удобнее определить макросы и универсальный тест в одном файле.

Чтобы определить свои собственные универсальные тесты, просто создайте блок `test` с именем `<test_name>`. Все универсальные тесты должны принимать один или оба стандартных аргумента:
- `model`: Ресурс, на котором определен тест, шаблонизированный до его имени отношения. (Обратите внимание, что аргумент всегда называется `model`, даже если ресурс является источником, seed или snapshot.)
- `column_name`: Столбец, на котором определен тест. Не все универсальные тесты работают на уровне столбца, но если они это делают, они должны принимать `column_name` в качестве аргумента.

Вот пример теста схемы `is_even`, который использует оба аргумента:

<File name='tests/generic/test_is_even.sql'>

```sql
{% test is_even(model, column_name) %}

with validation as (

    select
        {{ column_name }} as even_field

    from {{ model }}

),

validation_errors as (

    select
        even_field

    from validation
    -- если это условие истинно, то even_field на самом деле нечетное!
    where (even_field % 2) = 1

)

select *
from validation_errors

{% endtest %}
```

</File>

Если этот `select` запрос возвращает ноль записей, то каждая запись в переданном аргументе `model` четная! Если вместо этого возвращается ненулевое количество записей, то по крайней мере одна запись в `model` нечетная, и тест не прошел.

Чтобы использовать этот универсальный тест, укажите его по имени в свойстве `tests` модели, источника, snapshot или seed:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: users
    columns:
      - name: favorite_number
        tests:
      	  - is_even
```

</File>

С одной строкой кода вы только что создали тест! В этом примере `users` будет передан в тест `is_even` как аргумент `model`, а `favorite_number` будет передан как аргумент `column_name`. Вы можете добавить ту же строку для других столбцов, других моделей — каждая добавит новый тест в ваш проект, _используя то же самое определение универсального теста_.

### Универсальные тесты с дополнительными аргументами

Тест `is_even` работает без необходимости указывать какие-либо дополнительные аргументы. Другие тесты, такие как `relationships`, требуют больше, чем просто `model` и `column_name`. Если ваш пользовательский тест требует больше, чем стандартные аргументы, включите эти аргументы в сигнатуру теста, как `field` и `to` включены ниже:

<File name='tests/generic/test_relationships.sql'>

```sql
{% test relationships(model, column_name, field, to) %}

with parent as (

    select
        {{ field }} as id

    from {{ to }}

),

child as (

    select
        {{ column_name }} as id

    from {{ model }}

)

select *
from child
where id is not null
  and id not in (select id from parent)

{% endtest %}
```

</File>

При вызове этого теста из `.yml` файла, передайте аргументы тесту в виде словаря. Обратите внимание, что стандартные аргументы (`model` и `column_name`) предоставляются контекстом, поэтому вам не нужно определять их снова.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: account_id
        tests:
          - relationships:
              to: ref('accounts')
              field: id
```

</File>

### Универсальные тесты с значениями конфигурации по умолчанию

Возможно включить блок `config()` в определение универсального теста. Значения, установленные там, будут установлены по умолчанию для всех конкретных экземпляров этого универсального теста, если они не будут переопределены в свойствах конкретного экземпляра `.yml`.

<File name='tests/generic/warn_if_odd.sql'>

```sql
{% test warn_if_odd(model, column_name) %}

    {{ config(severity = 'warn') }}

    select *
    from {{ model }}
    where ({{ column_name }} % 2) = 1

{% endtest %}
```

Любой раз, когда используется тест `warn_if_odd`, он _всегда_ будет иметь уровень серьезности "предупреждение", если только конкретный тест не переопределит это значение:

</File>

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: users
    columns:
      - name: favorite_number
        tests:
      	  - warn_if_odd         # по умолчанию 'warn'
      - name: other_number
        tests:
          - warn_if_odd:
              severity: error   # переопределение
```

</File>

### Настройка встроенных тестов dbt

Чтобы изменить способ работы встроенного универсального теста — будь то добавление дополнительных параметров, переписывание SQL или по любой другой причине — просто добавьте блок теста с именем `<test_name>` в ваш собственный проект. dbt отдаст предпочтение вашей версии перед глобальной реализацией!

<File name='tests/generic/<filename>.sql'>

```sql
{% test unique(model, column_name) %}

    -- любой SQL, который вы хотите!

{% endtest %}
```

</File>

### Примеры

Вот несколько дополнительных примеров пользовательских универсальных ("схемных") тестов от сообщества:
* [Создание пользовательского теста схемы с порогом ошибок](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966)
* [Использование пользовательских тестов схемы для запуска тестов только в производственной среде](https://discourse.getdbt.com/t/conditionally-running-dbt-tests-only-running-dbt-tests-in-production/322)
* [Дополнительные примеры пользовательских тестов схемы](https://discourse.getdbt.com/t/examples-of-custom-schema-tests/181)