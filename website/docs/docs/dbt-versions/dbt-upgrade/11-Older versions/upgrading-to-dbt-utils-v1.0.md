---
title: "Обновление до dbt utils v1.0"
description: Новые возможности и несовместимые изменения, которые следует учитывать при обновлении до dbt utils v1.0.
---

# Обновление до dbt utils v1.0

Впервые [dbt utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) переходит на новую мажорную версию. Из [публикации в блоге за прошлый месяц](https://www.getdbt.com/blog/announcing-dbt-v1.3-and-utils/): 

> Пришло время официально закрепить то, что уже было негласным правилом: вы можете полагаться на dbt utils так же, как и на <Constant name="core" />, благодаря стабильным интерфейсам и последовательным, интуитивно понятным названиям.

Как и при переходе на <Constant name="dbt" /> 1.0 в прошлом году, стандартизация и подготовка к будущему привели к некоторым несовместимым изменениям. Большинство изменений можно внести с помощью поиска и замены. Если вам нужна помощь, напишите на [форуме сообщества](https://discourse.getdbt.com) или в канале [#package-ecosystem](https://getdbt.slack.com/archives/CU4MRJ7QB) в Slack. 

## Новые возможности

- `get_single_value()` &mdash; Простой способ получить одно значение из SQL-запроса вместо обращения к элементу `[0][0]` результата `run_query`.
- `safe_divide()` &mdash; Возвращает null, когда знаменатель равен 0, вместо возникновения ошибки деления на ноль.
- Новый тест `not_empty_string` &mdash; Более простая обёртка для проверки длины значений в столбце, чем использование `expression_is_true`.

## Улучшения

- Многие тесты становятся более полезными, если запускать их для подгрупп строк таблицы. Например, может потребоваться проверить наличие свежих данных для каждого турникета, а не довольствоваться их наличием хотя бы для одного источника данных. Для этого добавьте в тесты новый аргумент `group_by_columns`. Подробнее об этом читайте в [статье](https://www.emilyriederer.com/post/grouping-data-quality/), написанной автором теста.
- Благодаря добавлению в макрос `star()` аргумента `quote_identifiers`, включённого по умолчанию, теперь при необходимости можно отключить заключение идентификаторов в кавычки.
- У теста `recency` теперь есть необязательный аргумент `ignore_time_component`, который можно использовать при проверке столбца с датами. Это позволяет избежать ложноположительных и ложноотрицательных результатов, вызванных временем суток, в которое запускается тест.

## Исправления

- `union()` теперь включает и исключает столбцы без учёта регистра
- `slugify()` добавляет в начало символ подчёркивания, если первый символ — цифра
- Тест `expression_is_true` больше не выводит `*`, если сохранение не прошедших проверку строк не включено, что снижает затраты в BigQuery.

## Несовместимые изменения
### Изменения в `surrogate_key()`: {#changes-to-surrogate_key}

- `surrogate_key()` заменён на `generate_surrogate_key()`. Исходный макрос обрабатывал значения null и пустые строки одинаково, что могло приводить к созданию дублирующихся ключей. У `generate_surrogate_key()` этого недостатка нет. Сравните [суррогатные ключи, вычисленные для этих столбцов](https://docs.google.com/spreadsheets/d/1qWfdbieUOSgkzdY0kmJ9iCgdqyWccA0R-6EW0EgaMQc/edit#gid=0):

<Lightbox src="/img/guides/migration/versions/surrogate_key_behaviour.png" title="Таблица со сравнением поведения surrogate_key и generate_surrogate_key" />

Изменение способа вычисления суррогатных ключей, даже в лучшую сторону, может иметь существенные последствия для их дальнейшего использования (например, в снимках и инкрементальных моделях, которые используют этот столбец в качестве `unique_key`). Поэтому можно включить прежнее поведение, задав следующую переменную в проекте dbt:

```yaml
#dbt_project.yml
vars:
  surrogate_key_treat_nulls_as_empty_strings: true #turn on legacy behavior
```

Создавая новый макрос вместо изменения поведения старого, мы требуем, чтобы во всех проектах, использующих этот макрос, было принято явное решение о том, какой подход лучше подходит для их задач. 

**Мы рекомендуем текущим пользователям включить прежнее поведение**, если только вы не уверены в одном из следующих условий:

- ваши суррогатные ключи никогда не содержали null, или 
- ваши суррогатные ключи не используются в инкрементальных моделях, снимках и других артефактах, сохраняющих состояние, и поэтому могут быть без проблем пересозданы с новыми значениями.

:::caution Предупреждение для сопровождающих пакетов

Нельзя рассчитывать на какое-либо одно поведение, поскольку каждый проект может настроить его по-своему.

:::

### Функциональность, теперь встроенная в <Constant name="core" />:
- У теста `expression_is_true` больше нет отдельного аргумента `condition`. Вместо него используйте `where`, который [теперь доступен во всех тестах на уровне ядра](/reference/resource-configs/where):

```yaml

models:
  - name: old_syntax
    tests:
      - dbt_utils.expression_is_true:
          expression: "col_a + col_b = total"
          #replace this...
          condition: "created_at > '2018-12-31'" 

  - name: new_syntax
    tests:
      - dbt_utils.expression_is_true:
          expression: "col_a + col_b = total"
          # ...with this...
          where: "created_at > '2018-12-31'"
```
**Примечание** &mdash; Из-за этого некоторые тесты могут получить одинаковые автоматически сгенерированные имена. Чтобы устранить проблему, можно [задать собственное имя для теста](/reference/resource-properties/data-tests#custom-data-test-name).
- Устаревшие тесты `unique_where` и `not_null_where` удалены, поскольку [where теперь доступен во всех тестах на уровне ядра](/reference/resource-configs/where). Для перехода найдите и замените `dbt_utils.unique_where` на `unique`, а `dbt_utils.not_null_where` — на `not_null`.
- `dbt_utils.current_timestamp()` заменён на `dbt.current_timestamp()`. 
  - Обратите внимание, что реализация `dbt.current_timestamp()` для Postgres и Snowflake отличается от прежней реализации в `dbt_utils` ([подробности здесь](https://github.com/dbt-labs/dbt-utils/pull/597#issuecomment-1231074577)). Если вы используете Postgres или Snowflake и вам нужно полностью сохранить прежнее поведение для обратной совместимости, используйте `dbt.current_timestamp_backcompat()`. Мы надеемся устранить это расхождение в одной из будущих версий dbt.
- Все остальные кросс-платформенные макросы перенесены в пространство имён dbt; никаких изменений, кроме замены `dbt_utils.` на `dbt.`, не требуется. Полный список приведён в [документации по кросс-платформенным макросам](/reference/dbt-jinja-functions/cross-database-macros).
    - В редакторе кода можно выполнить глобальный поиск и замену с помощью регулярного выражения: `\{\{\s*dbt_utils\.(any_value|bool_or|cast_bool_to_text|concat|dateadd|datediff|date_trunc|escape_single_quotes|except|hash|intersect|last_day|length|listagg|position|replace|right|safe_cast|split_part|string_literal|type_bigint|type_float|type_int|type_numeric|type_string|type_timestamp|type_bigint|type_float|type_int|type_numeric|type_string|type_timestamp|except|intersect|concat|hash|length|position|replace|right|split_part|escape_single_quotes|string_literal|any_value|bool_or|listagg|cast_bool_to_text|safe_cast|dateadd|datediff|date_trunc|last_day)` → `{{ dbt.$1`
### Удаление материализации `insert_by_period` {#removal-of-insert_by_period-materialization}
- Материализация `insert_by_period` перенесена в [репозиторий experimental-features](https://github.com/dbt-labs/dbt-labs-experimental-features/tree/main/insert_by_period). Чтобы продолжить её использование, добавьте следующее в файл packages.yml:

```yaml
packages:
  - git: https://github.com/dbt-labs/dbt-labs-experimental-features
    subdirectory: insert_by_period
    revision: XXXX #optional but highly recommended. Provide a full git sha hash, e.g. 1c0bfacc49551b2e67d8579cf8ed459d68546e00. If not provided, uses the current HEAD.
```
### Удаление устаревшего поведения:
- `safe_add()` работает только со списком аргументов; используйте `{{ dbt_utils.safe_add(['column_1', 'column_2']) }}` вместо передачи отдельных аргументов `{{ dbt_utils.safe_add('column_1', 'column_2') }}`.
- Реализован ряд давно обещанных изменений, связанных с удалением устаревших возможностей `deduplicate()`:
    - Аргумент `group_by` заменён на `partition_by`.
    - Аргумент `relation_alias` удалён. Если нужен псевдоним, его можно передать непосредственно в аргументе `relation`.
    - Аргумент `order_by` теперь обязателен. Передайте постоянное значение, например `1`, если вам неважно, каким образом удаляются дубликаты.
- Устаревший аргумент `table` удалён из `unpivot()`. Вместо него используйте `relation`.


## Устранение ошибок
Ниже приведены распространённые сообщения об ошибках, с которыми можно столкнуться после обновления, и способы их устранения.
<details>
	<summary><code>dict object has no attribute MACRO_NAME</code></summary>
	<div>
		<p><b>Причина</b>: Макрос с именем <code>MACRO_NAME</code> не существует. Скорее всего, это связано с тем, что макрос перенесён в пространство имён <code>dbt</code> (см. выше). Также причиной может быть то, что вы не выполнили dbt deps или допустили опечатку в имени макроса.</p>
		<p><b>Решение</b>: Для <a href="/reference/dbt-jinja-functions/cross-database-macros">кросс-платформенных макросов</a> замените <code>dbt_utils.MACRO_NAME()</code> на <code>dbt.MACRO_NAME()</code>.</p>
	</div>
</details>
<details>
	<summary><code>macro 'dbt_macro__generate_surrogate_key' takes not more than 1 argument(s)</code> </summary>
	<div>
		<p><b>Причина</b>: <code>generate_surrogate_key()</code> требует один аргумент, содержащий список столбцов, а не набор отдельных аргументов.</p>
		<p><b>Решение</b>: Замените вызов на <code>dbt_utils.generate_surrogate_key(['column_1', 'column_2'])</code> — обратите внимание на квадратные скобки. </p>
	</div>
</details>
<details>
	<summary><code>The dbt_utils.surrogate_key has been replaced by dbt_utils.generate_surrogate_key</code></summary>
	<div>
		<p>
      <b>Причина</b>: Макрос <code>surrogate_key()</code> был заменён. 
    </p>
		<p>
      <b>Решение</b>:
			<ol>
				<li>Решите, нужно ли включить обратную совместимость, <a href="#changes-to-surrogate_key">как описано выше</a>.</li>
				<li>Найдите и замените <code>dbt_utils.surrogate_key</code> на <code>dbt_utils.generate_surrogate_key</code>.</li>
			</ol>
		</p>
	</div>
</details>
<details>
	<summary><code>macro dbt_macro__test_expression_is_true takes no keyword argument condition</code></summary>
	<div>
		<p><b>Причина</b>: Аргумент <code>condition</code> удалён из теста <code>expression_is_true</code>, поскольку <code>where</code> теперь автоматически доступен для всех тестов.</p>
		<p><b>Решение</b>: Замените <code>condition</code> на <code>where</code>. </p>
	</div>
</details>
<details>
	<summary><code>No materialization insert_by_period was found for adapter</code></summary>
	<div>
		<p><b>Причина</b>: Материализация <code>insert_by_period</code> перенесена в репозиторий экспериментальных возможностей (см. выше).</p>
		<p><b>Решение</b>: Установите пакет, как <a href="#removal-of-insert_by_period-materialization">описано выше</a>. </p>
	</div>
</details>
<details>
	<summary><code>dbt found two tests with the name "XXX".</code></summary>
	<div>
		<p><b>Причина</b>: Замена <code>condition</code> на <code>where</code> в тесте <code>expression_is_true</code>, поскольку параметры конфигурации не входят в уникальное имя теста.</p>
		<p><b>Решение</b>: Задайте <a href="https://docs.getdbt.com/reference/resource-properties/tests#define-a-custom-name-for-one-test">собственное имя для теста</a>.</p>
	</div>
</details>
