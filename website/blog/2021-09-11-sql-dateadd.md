---
title: "Функция DATEADD в SQL для различных хранилищ данных"
description: "Синтаксис функции DATEADD варьируется в зависимости от хранилища данных. Узнайте, как стандартизировать ваш синтаксис независимо от платформы."
slug: sql-dateadd
canonical_url: https://docs.getdbt.tech/sql-reference/dateadd

authors: david_krevitt

tags: [sql magic]
hide_table_of_contents: false

date: 2021-11-15
is_featured: true
---

Я использовал функцию dateadd в SQL тысячи раз.

Я гуглил синтаксис функции dateadd в SQL все эти разы, кроме одного, когда решил нажать кнопку "Мне повезет" и попробовать.

При переключении между диалектами SQL (BigQuery, Postgres и Snowflake — мои основные), я буквально никогда не могу запомнить порядок аргументов (или точное название функции) dateadd.

Эта статья расскажет, как работает функция DATEADD, о нюансах ее использования в основных облачных хранилищах и о том, как стандартизировать различия в синтаксисе с помощью макроса dbt.

<!--truncate-->

## Что такое функция DATEADD в SQL? {#what-is-the-dateadd-sql-function}

Функция DATEADD в SQL добавляет временной/датный интервал к дате и затем возвращает дату. Это позволяет вам добавлять или вычитать определенный период времени от заданной начальной даты.

Звучит достаточно просто, но эта функция позволяет делать довольно полезные вещи, такие как расчет предполагаемой даты доставки на основе даты заказа.

## Различия в синтаксисе DATEADD на различных платформах хранилищ данных {#differences-in-dateadd-syntax-across-data-warehouse-platforms}

Все они принимают примерно одинаковые параметры, но в немного различном синтаксисе и порядке:

* Начальная/исходная дата
* Часть даты (день, неделя, месяц, год)
* Интервал (целое число для увеличения)

*Сами функции* называются немного по-разному, что является обычным для диалектов SQL.

### Например, функция DATEADD в Snowflake… {#for-example-the-dateadd-function-in-snowflake}

```sql
dateadd( {{ datepart }}, {{ interval }}, {{ from_date }} )
```

*Час, минута и секунда поддерживаются!*

### Функция DATEADD в Databricks {#the-dateadd-function-in-databricks}

```sql
date_add( {{ startDate }}, {{ numDays }} )
```

### Функция DATEADD в BigQuery… {#the-dateadd-function-in-bigquery}

```sql
date_add( {{ from_date }}, INTERVAL {{ interval }} {{ datepart }} )
```

*Части даты менее одного дня (час / минута / секунда) не поддерживаются.*

### Функция DATEADD в Postgres... {#the-dateadd-function-in-postgres}

Postgres не предоставляет функцию dateadd из коробки, поэтому вам придется справляться самостоятельно - но синтаксис выглядит очень похоже на функцию BigQuery…

```sql
{{ from_date }} + (interval '{{ interval }} {{ datepart }}')
```

Переключение между этими синтаксисами SQL, по крайней мере для меня, обычно требует быстрого просмотра документации хранилища, чтобы вернуться в строй.

Поэтому я сделал эту удобную матрицу 2x2, чтобы помочь разобраться в различиях:

![пустая матрица 2x2](/img/blog/dateadd_matrix.png)

Извините - это просто пустая матрица 2x2. Я сдался и просто ищу документацию.

## Стандартизация вашего синтаксиса DATEADD в SQL с помощью макроса dbt {#standardizing-your-dateadd-sql-syntax-with-a-dbt-macro}

Но разве мы не могли бы делать что-то лучше с этими нажатиями клавиш, например, печатать и затем удалять твит?

dbt (и пакет макросов [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/#dateadd-source-macros-cross_db_utils-dateadd-sql-)) помогает нам сгладить эти шероховатости при написании SQL для <Term id="data-warehouse">хранилищ данных</Term>.

Вместо того чтобы каждый раз искать синтаксис, вы можете просто писать его одинаково каждый раз, и макрос скомпилирует его для выполнения в выбранном вами хранилище:

```sql
{{ dbt_utils.dateadd(datepart, interval, from_date_or_timestamp) }}
```

Добавление 1 месяца к сегодняшнему дню выглядело бы так...

```sql
{{ dbt_utils.dateadd(month, 1, '2021-08-12' }}
```

> *Новичок в dbt? Ознакомьтесь с [введением в dbt](https://docs.getdbt.tech/docs/introduction) для получения дополнительной информации о dbt и рабочем процессе аналитической инженерии, который он облегчает.*
>
> *Кратко: dbt позволяет специалистам по данным писать код как инженеры-программисты, что в данном случае означает не повторять себя без необходимости.*

### Компиляция ваших проблем с DATEADD {#compiling-away-your-dateadd-troubles}

Когда мы запускаем dbt, макрос dateadd компилирует вашу функцию в SQL-диалект адаптера хранилища, на котором вы работаете — он выполняет тот же SQL, который вы бы написали сами в своем родном браузере запросов.

И это на самом деле довольно простой макрос из 31 строки ([исходный код здесь](https://github.com/dbt-labs/dbt-utils/blob/0.1.20/macros/cross_db_utils/dateadd.sql) и снимок ниже) - если вы захотите его расширить (например, чтобы поддержать другой адаптер хранилища), я верю, что почти любой пользователь SQL квалифицирован для отправки PR в репозиторий:

```sql
{% macro dateadd(datepart, interval, from_date_or_timestamp) %}
  {{ adapter_macro('dbt_utils.dateadd', datepart, interval, from_date_or_timestamp) }}
{% endmacro %}


{% macro default__dateadd(datepart, interval, from_date_or_timestamp) %}

    dateadd(
        {{ datepart }},
        {{ interval }},
        {{ from_date_or_timestamp }}
        )

{% endmacro %}


{% macro bigquery__dateadd(datepart, interval, from_date_or_timestamp) %}

        datetime_add(
            cast( {{ from_date_or_timestamp }} as datetime),
        interval {{ interval }} {{ datepart }}
        )

{% endmacro %}


{% macro postgres__dateadd(datepart, interval, from_date_or_timestamp) %}

    {{ from_date_or_timestamp }} + ((interval '1 {{ datepart }}') * ({{ interval }}))

{% endmacro %}
```

Наслаждайтесь! К вашему сведению, я использовал макрос dateadd в dbt-utils на BigQuery, Postgres, Redshift и Snowflake, но он, вероятно, работает и в большинстве других хранилищ.

*Примечание: Хотя `dbt_utils` не поддерживает Databricks по умолчанию, вы можете использовать другие пакеты, которые [реализуют переопределения](/reference/dbt-jinja-functions/dispatch#overriding-package-macros) в качестве обходного пути.*

*Этот [пакет spark_utils](https://github.com/dbt-labs/spark-utils/blob/0.3.0/macros/dbt_utils/cross_db_utils/dateadd.sql) может помочь вам реализовать необходимое переопределение для добавления поддержки функции dateadd в Databricks.*