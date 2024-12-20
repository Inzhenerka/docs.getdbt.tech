---
title: "Обновление до dbt utils v1.0"
description: Новые функции и критические изменения, которые следует учитывать при обновлении до dbt utils v1.0.
---

# Обновление до dbt utils v1.0

Впервые [dbt utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) пересекает границу основной версии. Из [прошломесячного поста в блоге](https://www.getdbt.com/blog/announcing-dbt-v1.3-and-utils/):

> Пришло время формализовать то, что уже было неофициальной политикой: вы можете полагаться на dbt utils так же, как и на dbt Core, с устойчивыми интерфейсами и последовательными и интуитивно понятными именами.

Как и при переходе на dbt Core 1.0 в прошлом году, есть некоторые критические изменения, так как мы стандартизировали и подготовились к будущему. Большинство изменений можно обработать с помощью поиска и замены. Если вам нужна помощь, опубликуйте сообщение на [Форуме сообщества](https://discourse.getdbt.com) или в канале [#package-ecosystem](https://getdbt.slack.com/archives/CU4MRJ7QB) в Slack.

## Новые функции

- `get_single_value()` &mdash; Легкий способ извлечь одно значение из SQL-запроса, вместо доступа к элементу `[0][0]` результата `run_query`.
- `safe_divide()` &mdash; Возвращает null, когда знаменатель равен 0, вместо того чтобы вызывать ошибку деления на ноль.
- Новый тест `not_empty_string` &mdash; Более простой обертка, чем использование `expression_is_true` для проверки длины столбца.

## Улучшения

- Многие тесты более значимы, когда вы запускаете их для подгрупп таблицы. Например, вам может понадобиться проверить, что недавние данные существуют для каждого турникета, а не только для одного источника данных. Добавьте новый аргумент `group_by_columns` к вашим тестам, чтобы сделать это. Ознакомьтесь с [этой статьей](https://www.emilyriederer.com/post/grouping-data-quality/) автора теста для получения дополнительной информации.
- С добавлением аргумента `quote_identifiers`, включенного по умолчанию, в макросе `star()`, теперь вы можете отключить кавычки, если это необходимо.
- Тест `recency` теперь имеет необязательный аргумент `ignore_time_component`, который можно использовать при тестировании столбца даты. Это предотвращает возникновение ложных отрицательных/положительных результатов из-за времени суток, когда выполняется тест.

## Исправления

- `union()` теперь включает/исключает столбцы без учета регистра
- `slugify()` добавляет префикс подчеркивания, когда первый символ является цифрой
- Тест `expression_is_true` не выводит `*`, если не сохраняет ошибки, что является улучшением затрат для BigQuery.

## Критические изменения
### Изменения в `surrogate_key()`:

- `surrogate_key()` был заменен на `generate_surrogate_key()`. Оригинальный обрабатывал null-значения и пустые строки одинаково, что могло привести к созданию дублирующихся ключей. `generate_surrogate_key()` не имеет этого недостатка. Сравните [суррогатные ключи, рассчитанные для этих столбцов](https://docs.google.com/spreadsheets/d/1qWfdbieUOSgkzdY0kmJ9iCgdqyWccA0R-6EW0EgaMQc/edit#gid=0):

![Таблица, сравнивающая поведение surrogate_key и generate_surrogate_key](/img/guides/migration/versions/surrogate_key_behaviour.png)

Изменение метода расчета суррогатных ключей, даже в лучшую сторону, может иметь значительные последствия в последующих использованиях (например, в снимках и инкрементальных моделях, которые используют этот столбец в качестве `unique_key`). В результате, возможно включить поведение по умолчанию, установив следующую переменную в вашем проекте dbt:

```yaml
#dbt_project.yml
vars:
  surrogate_key_treat_nulls_as_empty_strings: true #включить поведение по умолчанию
```

Создавая новый макрос вместо обновления поведения старого, мы требуем от всех проектов, использующих этот макрос, принять явное решение о том, какой подход лучше для их контекста.

**Наша рекомендация заключается в том, что существующие пользователи должны включить поведение по умолчанию**, если вы не уверены, что:

- ваши суррогатные ключи никогда не содержали null-значений, или
- ваши суррогатные ключи не используются для инкрементальных моделей, снимков или других артефактов с состоянием и могут быть пересчитаны с новыми значениями без проблем.

:::caution Предупреждение для поддерживающих пакеты

Вы не можете предполагать одно поведение или другое, так как каждый проект может настроить свое поведение.

:::

### Функциональность теперь встроена в dbt Core:
- Тест `expression_is_true` больше не имеет выделенного аргумента `condition`. Вместо этого используйте `where`, который [теперь доступен нативно для всех тестов](https://docs.getdbt.com/reference/resource-configs/where):

```yaml
version: 2

models:
  - name: old_syntax
    tests:
      - dbt_utils.expression_is_true:
          expression: "col_a + col_b = total"
          #замените это...
          condition: "created_at > '2018-12-31'" 

  - name: new_syntax
    tests:
      - dbt_utils.expression_is_true:
          expression: "col_a + col_b = total"
          # ...на это...
          where: "created_at > '2018-12-31'"
```
**Примечание** &mdash; Это может привести к тому, что некоторые тесты получат одинаковые автоматически сгенерированные имена. Чтобы решить эту проблему, вы можете [определить пользовательское имя для теста](/reference/resource-properties/data-tests#define-a-custom-name-for-one-test).
- Устаревшие тесты `unique_where` и `not_null_where` были удалены, потому что [where теперь доступен нативно для всех тестов](https://docs.getdbt.com/reference/resource-configs/where). Чтобы мигрировать, найдите и замените `dbt_utils.unique_where` на `unique` и `dbt_utils.not_null_where` на `not_null`.
- `dbt_utils.current_timestamp()` заменен на `dbt.current_timestamp()`.
  - Обратите внимание, что реализация `dbt.current_timestamp()` в Postgres и Snowflake отличается от старой `dbt_utils` ([подробности здесь](https://github.com/dbt-labs/dbt-utils/pull/597#issuecomment-1231074577)). Если вы используете Postgres или Snowflake и нуждаетесь в идентичном обратном совместимом поведении, используйте `dbt.current_timestamp_backcompat()`. Эта разница, надеемся, будет устранена в будущей версии dbt Core.
- Все остальные кросс-базовые макросы перемещены в пространство имен dbt, без необходимости в изменениях, кроме замены `dbt_utils.` на `dbt.`. Ознакомьтесь с [документацией по кросс-базовым макросам](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros) для полного списка.
    - В вашем редакторе кода вы можете выполнить глобальный поиск и замену с использованием регулярных выражений: `\{\{\s*dbt_utils\.(any_value|bool_or|cast_bool_to_text|concat|dateadd|datediff|date_trunc|escape_single_quotes|except|hash|intersect|last_day|length|listagg|position|replace|right|safe_cast|split_part|string_literal|type_bigint|type_float|type_int|type_numeric|type_string|type_timestamp|type_bigint|type_float|type_int|type_numeric|type_string|type_timestamp|except|intersect|concat|hash|length|position|replace|right|split_part|escape_single_quotes|string_literal|any_value|bool_or|listagg|cast_bool_to_text|safe_cast|dateadd|datediff|date_trunc|last_day)` → `{{ dbt.$1`
### Удаление материализации `insert_by_period`
- Материализация `insert_by_period` была перемещена в [репозиторий экспериментальных функций](https://github.com/dbt-labs/dbt-labs-experimental-features/tree/main/insert_by_period). Чтобы продолжить ее использование, добавьте следующее в ваш файл packages.yml:

```yaml
packages:
  - git: https://github.com/dbt-labs/dbt-labs-experimental-features
    subdirectory: insert_by_period
    revision: XXXX #необязательно, но настоятельно рекомендуется. Укажите полный хеш git sha, например 1c0bfacc49551b2e67d8579cf8ed459d68546e00. Если не указано, используется текущий HEAD.
```
### Удаление устаревшего поведения:
- `safe_add()` работает только со списком аргументов; используйте `{{ dbt_utils.safe_add(['column_1', 'column_2']) }}` вместо varargs `{{ dbt_utils.safe_add('column_1', 'column_2') }}`.
- Несколько давно обещанных устареваний в `deduplicate()` были применены:
    - Аргумент `group_by` заменен на `partition_by`.
    - `relation_alias` удален. Если вам нужен псевдоним, вы можете передать его напрямую в аргумент `relation`.
    - `order_by` теперь обязателен. Передайте статическое значение, например `1`, если вам не важно, как они будут дублироваться.
- Устаревший аргумент `table` был удален из `unpivot()`. Используйте `relation` вместо него.

## Решение сообщений об ошибках
После обновления это распространенные сообщения об ошибках, с которыми вы можете столкнуться, и их решения.
<details>
	<summary><code>dict object has no attribute MACRO_NAME</code></summary>
	<div>
		<p><b>Причина</b>: Макрос с именем <code>MACRO_NAME</code> не существует. Скорее всего, это связано с тем, что макрос был перемещен в пространство имен <code>dbt</code> (см. выше). Это также может быть связано с тем, что вы не запустили dbt deps или неправильно написали имя макроса.</p>
		<p><b>Решение</b>: Для <a href="/reference/dbt-jinja-functions/cross-database-macros">кросс-базовых макросов</a> измените <code>dbt_utils.MACRO_NAME()</code> на <code>dbt.MACRO_NAME()</code>.</p>
	</div>
</details>
<details>
	<summary><code>macro 'dbt_macro__generate_surrogate_key' takes not more than 1 argument(s)</code> </summary>
	<div>
		<p><b>Причина</b>: <code>generate_surrogate_key()</code> требует одного аргумента, содержащего список столбцов, а не набора varargs.</p>
		<p><b>Решение</b>: Измените на <code>dbt_utils.generate_surrogate_key(['column_1', 'column_2'])</code> - обратите внимание на квадратные скобки. </p>
	</div>
</details>
<details>
	<summary><code>The dbt_utils.surrogate_key has been replaced by dbt_utils.generate_surrogate_key</code></summary>
	<div>
		<p>
      <b>Причина</b>: <code>surrogate_key()</code> был заменен. 
    </p>
		<p>
      <b>Решение</b>:
			<ol>
				<li>Решите, нужно ли вам включить обратную совместимость <a href="#changes-to-surrogate_key">как описано выше</a>.</li>
				<li>Найдите и замените <code>dbt_utils.surrogate_key</code> на <code>dbt_utils.generate_surrogate_key</code>.</li>
			</ol>
		</p>
	</div>
</details>
<details>
	<summary><code>macro dbt_macro__test_expression_is_true takes no keyword argument condition</code></summary>
	<div>
		<p><b>Причина</b>: <code>condition</code> был удален из теста <code>expression_is_true</code>, теперь, когда <code>where</code> доступен на всех тестах автоматически.</p>
		<p><b>Решение</b>: Замените <code>condition</code> на <code>where</code>. </p>
	</div>
</details>
<details>
	<summary><code>No materialization insert_by_period was found for adapter</code></summary>
	<div>
		<p><b>Причина</b>: <code>insert_by_period</code> был перемещен в репозиторий экспериментальных функций (см. выше).</p>
		<p><b>Решение</b>: Установите пакет, как <a href="#removal-of-insert_by_period-materialization">описано выше</a>. </p>
	</div>
</details>
<details>
	<summary><code>dbt found two tests with the name "XXX".</code></summary>
	<div>
		<p><b>Причина</b>: Изменение с <code>condition</code> на <code>where</code> в тесте <code>expression_is_true</code>, так как конфигурации не являются частью уникального имени теста.</p>
		<p><b>Решение</b>: Определите <a href="https://docs.getdbt.com/reference/resource-properties/tests#define-a-custom-name-for-one-test">пользовательское имя для вашего теста</a>.</p>
	</div>
</details>