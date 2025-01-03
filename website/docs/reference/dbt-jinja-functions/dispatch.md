---
sidebar_label: "dispatch"
title: "О конфигурации dispatch"
id: "dispatch"
description: "dbt расширяет функциональность на различных платформах данных с помощью множественной диспетчеризации."
---

dbt может расширять функциональность на [поддерживаемых платформах данных](/docs/supported-data-platforms) через систему [множественной диспетчеризации](https://en.wikipedia.org/wiki/Multiple_dispatch). Поскольку синтаксис SQL, типы данных и поддержка <Term id="ddl" />/<Term id="dml" /> различаются в зависимости от адаптеров, dbt может определять и вызывать универсальные функциональные макросы, а затем "диспетчеризировать" этот макрос к соответствующей реализации для текущего адаптера.

## Синтаксис

__Аргументы__:

  * `macro_name` [обязательный]: Имя макроса для диспетчеризации. Должно быть строковым литералом.
  * `macro_namespace` [необязательный]: Пространство имен (пакет) макроса для диспетчеризации. Должно быть строковым литералом.

__Использование__:

```sql
{% macro my_macro(arg1, arg2) -%}
  {{ return(adapter.dispatch('my_macro')(arg1, arg2)) }}
{%- endmacro %}
```

dbt использует два критерия при поиске подходящего макроса-кандидата:
- Префикс адаптера
- Пространство имен (пакет)

**Префикс адаптера:** Макросы, специфичные для адаптера, имеют префикс с именем адаптера в нижнем регистре и двумя подчеркиваниями. Учитывая макрос с именем `my_macro`, dbt будет искать:
* Postgres: `postgres__my_macro`
* Redshift: `redshift__my_macro`
* Snowflake: `snowflake__my_macro`
* BigQuery: `bigquery__my_macro`
* OtherAdapter: `otheradapter__my_macro`
* _по умолчанию:_ `default__my_macro`

Если dbt не найдет реализацию, специфичную для адаптера, он диспетчеризирует к реализации по умолчанию.

**Пространство имен:** Обычно dbt будет искать реализации в корневом проекте и внутренних проектах (например, `dbt`, `dbt_postgres`). Если аргумент `macro_namespace` предоставлен, он вместо этого ищет в указанном пространстве имен (пакете) подходящие реализации. Также возможно динамически маршрутизировать поиск по пространствам имен, определяя [конфигурацию проекта `dispatch`](/reference/project-configs/dispatch-config); см. примеры ниже для подробностей.

## Примеры

### Простой пример

Предположим, я хочу определить макрос `concat`, который компилируется в SQL-функцию `concat()` как его поведение по умолчанию. Однако на Redshift и Snowflake я хочу использовать оператор `||`.

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
    {{ return(adapter.dispatch('concat')(fields)) }}
{%- endmacro %}


{% macro default__concat(fields) -%}
    concat({{ fields|join(', ') }})
{%- endmacro %}


{% macro redshift__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}


{% macro snowflake__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}
```

</File>

Верхний макрос `concat` следует специальной, жесткой формуле: он назван с "основным именем" макроса, `concat`, которое будет использоваться для вызова макроса в других местах. Он принимает один аргумент, названный `fields`. Единственная функция этого макроса — диспетчеризация, то есть поиск и возврат, используя основное имя макроса (`concat`) в качестве поискового термина. Он также хочет передать, в свою конечную реализацию, все переданные ему аргументы. В данном случае есть только один аргумент, названный `fields`.

Ниже этого макроса я определил три возможные реализации макроса `concat`: одну для Redshift, одну для Snowflake и одну для использования по умолчанию на всех других адаптерах. В зависимости от адаптера, с которым я работаю, будет выбран один из этих макросов, ему будут переданы указанные аргументы в качестве входных данных, он выполнит операции над этими аргументами и вернет результат исходному диспетчеризующему макросу.

### Более сложный пример

Я нашел существующую реализацию макроса `concat` в пакете dbt-utils. Однако я хочу переопределить его реализацию макроса `concat` на Redshift в частности. Во всех других случаях, включая реализацию по умолчанию, я полностью доволен использованием реализаций, определенных в `dbt_utils.concat`.

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
    {{ return(adapter.dispatch('concat')(fields)) }}
{%- endmacro %}

{% macro default__concat(fields) -%}
    {{ return(dbt_utils.concat(fields)) }}
{%- endmacro %}

{% macro redshift__concat(fields) %}
    {% for field in fields %}
        nullif({{ field }},'') {{ ' || ' if not loop.last }}
    {% endfor %}
{% endmacro %}
```

</File>

Если я работаю на Redshift, dbt будет использовать мою версию; если я работаю на любой другой базе данных, макрос `concat()` будет использовать версию, определенную в `dbt_utils`.

## Для поддерживающих пакеты

Диспетчеризируемые макросы из [пакетов](/docs/build/packages) _должны_ предоставлять аргумент `macro_namespace`, так как это указывает пространство имен (пакет), где планируется искать кандидатов. Чаще всего это совпадает с именем вашего пакета, например, `dbt_utils`. (Возможно, хотя и редко желательно, определить диспетчеризируемый макрос _не_ в пакете `dbt_utils` и диспетчеризировать его в пространство имен `dbt_utils`.)

Здесь у нас есть определение макроса `dbt_utils.concat`, который указывает как `macro_name`, так и `macro_namespace` для диспетчеризации:

```sql
{% macro concat(fields) -%}
  {{ return(adapter.dispatch('concat', 'dbt_utils')(fields)) }}
{%- endmacro %}
```

### Переопределение макросов пакета

Следуя второму примеру выше: Всякий раз, когда я вызываю свою версию макроса `concat` в своем собственном проекте, он будет использовать мою специальную версию с обработкой null на Redshift. Но версия макроса `concat` _внутри_ пакета dbt-utils не будет использовать мою версию.

Почему это важно? Другие макросы в dbt-utils, такие как `surrogate_key`, вызывают макрос `dbt_utils.concat` напрямую. Что если я хочу, чтобы `dbt_utils.surrogate_key` использовал _мою_ версию `concat`, включая мою пользовательскую логику на Redshift?

Как пользователь, я могу достичь этого через [конфигурацию `dispatch` на уровне проекта](/reference/project-configs/dispatch-config). Когда dbt идет диспетчеризировать `dbt_utils.concat`, он знает из аргумента `macro_namespace`, что нужно искать в пространстве имен `dbt_utils`. Конфигурация ниже определяет динамическую маршрутизацию для этого пространства имен, указывая dbt искать через упорядоченную последовательность пакетов, вместо того чтобы просто искать в пакете `dbt_utils`.

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_project', 'dbt_utils']
```

</File>

Обратите внимание, что эта конфигурация _должна_ быть указана в корневом `dbt_project.yml` пользователя. dbt проигнорирует любые конфигурации `dispatch`, определенные в файлах проекта установленных пакетов.

Префиксы адаптеров все еще имеют значение: dbt будет искать только реализации, совместимые с текущим адаптером. Но dbt будет отдавать приоритет специфичности пакета над специфичностью адаптера. Если я вызываю макрос `concat`, работая на Postgres, с конфигурацией выше, dbt будет искать следующие макросы в порядке:

1. `my_project.postgres__concat` (не найден)
2. `my_project.default__concat` (не найден)
3. `dbt_utils.postgres__concat` (не найден)
4. `dbt_utils.default__concat` (найден! используем его)

Как человек, устанавливающий пакет, эта функциональность позволяет мне изменить поведение другого, более сложного макроса (`dbt_utils.surrogate_key`), переопределив один из его модульных компонентов.

Как поддерживающий пакет, эта функциональность позволяет пользователям моего пакета расширять, переопределять или изменять поведение по умолчанию, не нуждаясь в форке исходного кода пакета.

### Переопределение глобальных макросов

:::tip
Некоторые функции, такие как [`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source) и [`config`](/reference/dbt-jinja-functions/config), не могут быть переопределены с помощью пакета, используя конфигурацию dispatch. Это потому, что `ref`, `source` и `config` являются свойствами контекста в dbt и не диспетчеризируются как глобальные макросы. Обратитесь к [этому обсуждению на GitHub](https://github.com/dbt-labs/dbt-core/issues/4491#issuecomment-994709916) для получения дополнительной информации.
:::

Я поддерживаю внутренний пакет утилит в моей организации, названный `my_org_dbt_helpers`. Я использую этот пакет для переопределения встроенных макросов dbt от имени всех моих коллег, использующих dbt, которые работают в ряде проектов dbt.

Мой пакет может определять пользовательские версии любых диспетчеризируемых глобальных макросов, которые я выберу, от `generate_schema_name` до `test_unique`. Я могу определить новую версию этого макроса по умолчанию (например, `default__generate_schema_name`) или пользовательские версии для конкретных <Term id="data-warehouse" /> адаптеров (например, `spark__generate_schema_name`).

Каждый корневой проект, устанавливающий мой пакет, просто должен включать [конфигурацию `dispatch` на уровне проекта](/reference/project-configs/dispatch-config), которая ищет мой пакет перед `dbt` для глобального пространства имен `dbt`:

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt
    search_order: ['my_project', 'my_org_dbt_helpers', 'dbt']
```

</File>

### Управление различными глобальными переопределениями в разных пакетах

Вы можете переопределять глобальные поведения различными способами для каждого проекта, который установлен как пакет. Это верно для всех глобальных макросов: `generate_schema_name`, `create_table_as` и т.д. При разборе или запуске ресурса, определенного в пакете, определение глобального макроса в этом пакете имеет приоритет над определением в корневом проекте, потому что оно более специфично для этих ресурсов.

Комбинируя переопределения на уровне пакета и `dispatch`, можно достичь трех различных шаблонов:

1. **Пакет всегда выигрывает** &mdash; Как разработчик моделей dbt в проекте, который будет развернут в другом месте как пакет, вы хотите полный контроль над макросами, используемыми для определения и материализации моих моделей. Ваши макросы всегда должны иметь приоритет для ваших моделей, и не должно быть никакого способа их переопределить.

    - _Механизм:_ Каждый проект/пакет полностью переопределяет макрос по его имени, например, `generate_schema_name` или `create_table_as`. Не используйте dispatch.

2. **Условное применение (корневой проект выигрывает)** &mdash; Как поддерживающий один проект dbt в сети из нескольких, ваша команда хочет условного применения этих правил. При запуске вашего проекта отдельно (в разработке) вы хотите применять пользовательское поведение; но при установке в качестве пакета и развертывании вместе с несколькими другими проектами (в производстве) вы хотите, чтобы применялись правила корневого проекта.

    - _Механизм:_ Каждый пакет реализует свое "локальное" переопределение, регистрируя кандидата для диспетчеризации с префиксом адаптера, например, `default__generate_schema_name` или `default__create_table_as`. Корневой проект может затем зарегистрировать своего собственного кандидата для диспетчеризации (`default__generate_schema_name`), выигрывая порядок поиска по умолчанию или явно переопределяя макрос по имени (`generate_schema_name`).

3. **Одни и те же правила везде и всегда** &mdash; Как член команды платформы данных, ответственный за согласованность между командами в вашей организации, вы хотите создать "пакет макросов", который каждая команда может установить и использовать.

    - _Механизм:_ Создайте отдельный пакет только с кандидатами макросов, например, `default__generate_schema_name` или `default__create_table_as`. Добавьте [конфигурацию `dispatch` на уровне проекта](/reference/project-configs/dispatch-config) в `dbt_project.yml` каждого проекта.

## Для поддерживающих адаптеры

Большинство пакетов изначально были разработаны для работы на четырех оригинальных адаптерах dbt. Используя макрос `dispatch` и конфигурацию проекта, можно "подогнать" существующие пакеты для работы на других адаптерах с помощью пакетов совместимости от третьих сторон.

Например, если я хочу использовать `dbt_utils.concat` на Apache Spark, я могу установить пакет совместимости, spark-utils, вместе с dbt-utils:

<File name='packages.yml'>

```yml
packages:
  - package: dbt-labs/dbt_utils
    version: ...
  - package: dbt-labs/spark_utils
    version: ...
```

</File>

Затем я включаю `spark_utils` в порядок поиска для диспетчеризируемых макросов в пространстве имен `dbt_utils`. (Я все еще включаю свой собственный проект первым, на случай, если я захочу переопределить какие-либо макросы с моей собственной пользовательской логикой.)

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_project', 'spark_utils', 'dbt_utils']
```

</File>

При диспетчеризации `dbt_utils.concat`, dbt будет искать:

1. `my_project.spark__concat` (не найден)
2. `my_project.default__concat` (не найден)
3. `spark_utils.spark__concat` (найден! используем его)
4. `spark_utils.default__concat`
5. `dbt_utils.postgres__concat`
6. `dbt_utils.default__concat`

Как поддерживающий пакет совместимости, мне нужно только переопределить основные строительные блоки макросов, которые инкапсулируют низкоуровневые синтаксические различия. Переопределяя низкоуровневые макросы, такие как `spark__dateadd` и `spark__datediff`, пакет `spark_utils` предоставляет доступ к более сложным макросам (`dbt_utils.date_spine`) "бесплатно".

Как пользователь `dbt-spark`, устанавливая `dbt_utils` и `spark_utils` вместе, я не только получаю доступ к более высоким уровням утилитных макросов. Я даже могу установить и использовать пакеты без специфической для Spark логики, которые никогда не тестировались на Spark, при условии, что они полагаются на макросы `dbt_utils` для совместимости между адаптерами.

### Наследование адаптеров

Некоторые адаптеры "наследуются" от других адаптеров (например, `dbt-postgres` &rarr; `dbt-redshift`, и `dbt-spark` &rarr; `dbt-databricks`). Если используется дочерний адаптер, dbt также включит любые реализации родительского адаптера в свой порядок поиска. Вместо того чтобы просто искать `redshift__` и возвращаться к `default__`, dbt будет искать `redshift__`, `postgres__` и `default__`, в этом порядке.

Дочерние адаптеры, как правило, имеют очень похожий синтаксис SQL с их родителями, поэтому это позволяет им пропустить переопределение макроса, который уже был переопределен родительским адаптером.

Следуя примеру выше с `dbt_utils.concat`, полный порядок поиска на Redshift фактически:

1. `my_project.redshift__concat`
2. `my_project.postgres__concat`
3. `my_project.default__concat`
4. `dbt_utils.redshift__concat`
5. `dbt_utils.postgres__concat`
6. `dbt_utils.default__concat`

В редких случаях дочерний адаптер может предпочесть реализацию по умолчанию специфической реализации родительского адаптера. В этом случае дочерний адаптер должен определить макрос, специфичный для адаптера, который вызывает реализацию по умолчанию. Например, синтаксис PostgreSQL для добавления дат должен работать и на Redshift, но я могу предпочесть простоту `dateadd`:

```sql
{% macro dateadd(datepart, interval, from_date_or_timestamp) %}
    {{ return(adapter.dispatch('dateadd')(datepart, interval, from_date_or_timestamp)) }}
{% endmacro %}

{% macro default__dateadd(datepart, interval, from_date_or_timestamp) %}
    dateadd({{ datepart }}, {{ interval }}, {{ from_date_or_timestamp }})
{% endmacro %}

{% macro postgres__dateadd(datepart, interval, from_date_or_timestamp) %}
    {{ from_date_or_timestamp }} + ((interval '1 {{ datepart }}') * ({{ interval }}))
{% endmacro %}

{# Используйте синтаксис по умолчанию вместо синтаксиса postgres #}
{% macro redshift__dateadd(datepart, interval, from_date_or_timestamp) %}
    {{ return(default__dateadd(datepart, interval, from_date_or_timestamp) }}
{% endmacro %}
```

## Часто задаваемые вопросы

<FAQ path="Troubleshooting/dispatch-could-not-find-package" />