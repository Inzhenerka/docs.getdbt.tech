---
title: "Jinja и макросы"
description: "Расширяйте возможности вашего SQL с помощью Jinja и макросов при разработке в dbt, чтобы создавать переиспользуемую и модульную логику."
id: "jinja-macros"
availability: all_users
---

## Связанная справочная документация
* [Поддержка Jinja по типам файлов](/reference/jinja-file-support)
* [Документация по разработке шаблонов Jinja](https://jinja.palletsprojects.com/page/templates/) (внешняя ссылка)
* [Контекст Jinja в dbt](/reference/dbt-jinja-functions-context-variables)
* [Свойства макросов](/reference/macro-properties)

## Обзор {#overview}
В dbt вы можете комбинировать SQL с [Jinja](https://jinja.palletsprojects.com), языком шаблонов.

Использование Jinja превращает ваш проект dbt в программную среду для SQL, предоставляя вам возможность делать то, что обычно невозможно в SQL. Важно отметить, что Jinja сам по себе не является языком программирования; вместо этого он выступает как инструмент для расширения возможностей SQL в ваших проектах dbt.

Например, с помощью Jinja вы можете:

- Использовать управляющие конструкции (например, операторы `if` и циклы `for`) в SQL
- Использовать [переменные окружения](/reference/dbt-jinja-functions/env_var) в вашем dbt‑проекте для production‑развертываний
- Менять способ сборки проекта в зависимости от текущего target
- Работать с результатами одного запроса для генерации другого запроса, например:
  - Возвращать список способов оплаты, чтобы создать столбец с подытогами для каждого способа оплаты (pivot)
  - Возвращать список столбцов из двух relations и выбирать их в одном и том же порядке, чтобы упростить их объединение через union
- Выносить фрагменты SQL в переиспользуемые [**macros**](#macros) — они аналогичны функциям в большинстве языков программирования

Если вы использовали функцию [`{{ ref() }}`](/reference/dbt-jinja-functions/ref), вы уже используете Jinja!

Jinja можно использовать в любом SQL-коде внутри проекта dbt, включая [models](/docs/build/sql-models), [analyses](/docs/build/analyses), [data tests](/docs/build/data-tests) и даже [hooks](/docs/build/hooks-operations).

:::info Готовы начать с Jinja и макросов?

Посмотрите [руководство по использованию Jinja](/guides/using-jinja) для пошагового примера использования Jinja в модели и превращения его в макрос!

:::

## Начало работы {#getting-started}
### Jinja {#jinja}
Вот пример модели dbt, использующей Jinja:

<File name='/models/order_payment_method_amounts.sql'>

```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

select
    order_id,
    {% for payment_method in payment_methods %}
    sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount,
    {% endfor %}
    sum(amount) as total_amount
from app_data.payments
group by 1
```

</File>

Этот запрос будет скомпилирован в:

<File name='/models/order_payment_method_amounts.sql'>

```sql
select
    order_id,
    sum(case when payment_method = 'bank_transfer' then amount end) as bank_transfer_amount,
    sum(case when payment_method = 'credit_card' then amount end) as credit_card_amount,
    sum(case when payment_method = 'gift_card' then amount end) as gift_card_amount,
    sum(amount) as total_amount
from app_data.payments
group by 1
```

</File>

Jinja можно распознать по разделителям, которые используются в этом языке и которые мы называем «фигурными скобками»:
- **Выражения `{{ ... }}`**: выражения используются, когда нужно вывести строку. С помощью выражений можно обращаться к [переменным](/reference/dbt-jinja-functions/var) и вызывать [макросы](/docs/build/jinja-macros#macros).
- **Инструкции `{% ... %}`**: инструкции не выводят строку. Они используются для управления потоком выполнения: например, для создания циклов `for` и условных конструкций `if`, для [присваивания значений](https://jinja.palletsprojects.com/en/3.1.x/templates/#assignments) переменным или их [изменения](https://jinja.palletsprojects.com/en/3.1.x/templates/#expression-statement), а также для определения макросов.
-  **Комментарии `{# ... #}`**: комментарии Jinja позволяют предотвратить выполнение текста внутри комментария или его вывод в виде строки. Не используйте `--` для комментариев.

При использовании в модели dbt код Jinja должен компилироваться в корректный SQL-запрос. Чтобы проверить, в какой SQL компилируется ваш код Jinja:
* **При использовании <Constant name="dbt" />:** нажмите кнопку компиляции, чтобы увидеть скомпилированный SQL на панели Compiled SQL
* **При использовании <Constant name="core" />:** выполните `dbt compile` в командной строке. Затем откройте файл со скомпилированным SQL в каталоге `target/compiled/{project name}/`. Разделите окно редактора кода, чтобы оба файла были открыты одновременно.

* **При использовании <Constant name="cloud" />:** нажмите кнопку compile, чтобы увидеть скомпилированный SQL в панели Compiled SQL
* **При использовании dbt Core:** выполните команду `dbt compile` в командной строке. Затем откройте файл со скомпилированным SQL в директории `target/compiled/{project name}/`. Используйте режим разделённого экрана в вашем редакторе кода, чтобы держать оба файла открытыми одновременно.

### Макросы {#macros}
[Макросы](/docs/build/jinja-macros) в Jinja — это фрагменты кода, которые можно использовать многократно — они аналогичны "функциям" в других языках программирования и чрезвычайно полезны, если вы обнаруживаете, что повторяете код в нескольких моделях. Макросы определяются в `.sql` файлах, обычно в вашем каталоге `macros` ([документация](/reference/project-configs/macro-paths)).

Файлы макросов могут содержать один или несколько макросов — вот пример:

<File name='macros/cents_to_dollars.sql'>

```sql

{% macro cents_to_dollars(column_name, scale=2) %}
    ({{ column_name }} / 100)::numeric(16, {{ scale }})
{% endmacro %}

```

</File>

Модель, использующая этот макрос, может выглядеть так:

<File name='models/stg_payments.sql'>

```sql
select
  id as payment_id,
  {{ cents_to_dollars('amount') }} as amount_usd,
  ...
from app_data.payments

```

</File>

Это будет _скомпилировано_ в:

<File name='target/compiled/models/stg_payments.sql'>

```sql
select
  id as payment_id,
  (amount / 100)::numeric(16, 2) as amount_usd,
  ...
from app_data.payments
```

</File>

import WhitespaceControl from '/snippets/_whitespace-control.md';

<WhitespaceControl/>

### Использование макроса из пакета {#using-a-macro-from-a-package}
Ряд полезных макросов также был сгруппирован в [пакеты](/docs/build/packages) — наш самый популярный пакет — [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/).

После установки пакета в ваш проект, вы можете использовать любой из макросов в вашем собственном проекте — убедитесь, что вы квалифицируете макрос, добавляя префикс с [именем пакета](/reference/dbt-jinja-functions/project_name):

```sql

select
  field_1,
  field_2,
  field_3,
  field_4,
  field_5,
  count(*)
from my_table
{{ dbt_utils.dimensions(5) }}

```

Вы также можете квалифицировать макрос в вашем собственном проекте, добавляя префикс с вашим [именем пакета](/reference/dbt-jinja-functions/project_name) (это в основном полезно для авторов пакетов).

## Часто задаваемые вопросы

<FAQ path="Accounts/dbt-specific-jinja" />
<FAQ path="Jinja/which-jinja-docs" />
<FAQ path="Jinja/quoting-column-names" />
<FAQ path="Jinja/jinja-whitespace" />
<FAQ path="Project/debugging-jinja" />
<FAQ path="Docs/documenting-macros" />
<FAQ path="Project/why-so-many-macros" />

## dbtonic Jinja {#dbtonic-jinja}

Как хорошо написанный код на Python называют "pythonic", так и хорошо написанный код dbt называют "dbtonic".

### Предпочитайте читаемость вместо <Term id="dry" />-ности {#favor-readability-over-dry-ness}

Как только вы узнаете о возможностях Jinja, часто возникает желание абстрагировать каждую повторяющуюся строку в макрос! Помните, что использование Jinja может сделать ваши модели трудными для интерпретации другими пользователями — мы рекомендуем отдавать предпочтение читаемости при смешивании Jinja с SQL, даже если это означает повторение некоторых строк SQL в нескольких местах. Если все ваши модели — это макросы, возможно, стоит пересмотреть подход.

### Используйте макросы из пакетов {#leverage-package-macros}
Пишете макрос в первый раз? Проверьте, не открыли ли мы исходный код в [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), который вы можете использовать, и сэкономьте себе время!

### Устанавливайте переменные в начале модели {#set-variables-at-the-top-of-a-model}
`{% set ... %}` может использоваться для создания новой переменной или обновления существующей. Мы рекомендуем устанавливать переменные в начале модели, а не жестко кодировать их в строке. Это практика, заимствованная из многих других языков программирования, так как она помогает с читаемостью и пригодится, если вам нужно будет ссылаться на переменную в двух местах:

```sql
-- 🙅 Это работает, но может быть трудно поддерживать по мере роста вашего кода
{% for payment_method in ["bank_transfer", "credit_card", "gift_card"] %}
...
{% endfor %}


-- ✅ Это наш предпочтительный метод установки переменных
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

{% for payment_method in payment_methods %}
...
{% endfor %}
```

