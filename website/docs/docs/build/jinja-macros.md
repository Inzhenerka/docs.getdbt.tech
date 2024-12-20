---
title: "Jinja и макросы"
description: "Прочтите это руководство, чтобы узнать, как использовать jinja и макросы при разработке в dbt."
id: "jinja-macros"
---

## Связанные справочные документы
* [Документация по Jinja Template Designer](https://jinja.palletsprojects.com/page/templates/) (внешняя ссылка)
* [Контекст Jinja в dbt](/reference/dbt-jinja-functions)
* [Свойства макросов](/reference/macro-properties)

## Обзор
В dbt вы можете комбинировать SQL с [Jinja](https://jinja.palletsprojects.com), языком шаблонов.

Использование Jinja превращает ваш проект dbt в программную среду для SQL, предоставляя вам возможность делать то, что обычно невозможно в SQL. Важно отметить, что Jinja сам по себе не является языком программирования; вместо этого он выступает как инструмент для расширения возможностей SQL в ваших проектах dbt.

Например, с помощью Jinja вы можете:
* Использовать управляющие структуры (например, операторы `if` и циклы `for`) в SQL
* Использовать [переменные окружения](/reference/dbt-jinja-functions/env_var) в вашем проекте dbt для производственных развертываний
* Изменять способ сборки вашего проекта в зависимости от текущей цели.
* Работать с результатами одного запроса для генерации другого запроса, например:
  * Возвращать список методов оплаты, чтобы создать столбец с подытогами по каждому методу оплаты (поворот)
  * Возвращать список столбцов в двух отношениях и выбирать их в том же порядке, чтобы упростить их объединение
* Абстрагировать фрагменты SQL в переиспользуемые [**макросы**](#macros) — они аналогичны функциям в большинстве языков программирования.

Если вы использовали функцию [`{{ ref() }}`](/reference/dbt-jinja-functions/ref), вы уже используете Jinja!

Jinja может использоваться в любом SQL в проекте dbt, включая [модели](/docs/build/sql-models), [анализы](/docs/build/analyses), [тесты](/docs/build/data-tests) и даже [хуки](/docs/build/hooks-operations).

:::info Готовы начать с Jinja и макросов?

Посмотрите [руководство по использованию Jinja](/guides/using-jinja) для пошагового примера использования Jinja в модели и превращения его в макрос!

:::

## Начало работы
### Jinja
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

Вы можете распознать Jinja по разделителям, которые использует язык, которые мы называем "фигурными скобками":
- **Выражения `{{ ... }}`**: Выражения используются, когда вы хотите вывести строку. Вы можете использовать выражения для ссылки на [переменные](/reference/dbt-jinja-functions/var) и вызова [макросов](/docs/build/jinja-macros#macros).
- **Операторы `{% ... %}`**: Операторы не выводят строку. Они используются для управления потоком, например, для настройки циклов `for` и операторов `if`, для [установки](https://jinja.palletsprojects.com/en/3.1.x/templates/#assignments) или [изменения](https://jinja.palletsprojects.com/en/3.1.x/templates/#expression-statement) переменных или для определения макросов.
- **Комментарии `{# ... #}`**: Комментарии Jinja используются для предотвращения выполнения текста внутри комментария или вывода строки. Не используйте `--` для комментариев.

Когда используется в модели dbt, ваш Jinja должен компилироваться в допустимый запрос. Чтобы проверить, в какой SQL компилируется ваш Jinja:
* **Используя dbt Cloud:** Нажмите кнопку компиляции, чтобы увидеть скомпилированный SQL в панели Compiled SQL
* **Используя dbt Core:** Запустите `dbt compile` из командной строки. Затем откройте скомпилированный SQL файл в каталоге `target/compiled/{project name}/`. Используйте разделение экрана в вашем редакторе кода, чтобы держать оба файла открытыми одновременно.

### Макросы
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

### Использование макроса из пакета
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

## dbtonic Jinja

Как хорошо написанный код на Python называют "pythonic", так и хорошо написанный код dbt называют "dbtonic".

### Предпочитайте читаемость вместо <Term id="dry" />-ности {#favor-readability-over-dry-ness}

Как только вы узнаете о возможностях Jinja, часто возникает желание абстрагировать каждую повторяющуюся строку в макрос! Помните, что использование Jinja может сделать ваши модели трудными для интерпретации другими пользователями — мы рекомендуем отдавать предпочтение читаемости при смешивании Jinja с SQL, даже если это означает повторение некоторых строк SQL в нескольких местах. Если все ваши модели — это макросы, возможно, стоит пересмотреть подход.

### Используйте макросы из пакетов
Пишете макрос в первый раз? Проверьте, не открыли ли мы исходный код в [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), который вы можете использовать, и сэкономьте себе время!

### Устанавливайте переменные в начале модели
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

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="wee"/>