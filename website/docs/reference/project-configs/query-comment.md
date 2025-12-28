---
datatype: "string | {comment: string, append: true | false }"
default: >
  /* {"app": "dbt", "dbt_version": "1.5.0rc2", "profile_name": "debug", "target_name": "dev", "node_id": "model.dbt2.my_model"} */
---

<File name='dbt_project.yml'>

```yml
query-comment: string
```

</File>

Конфигурация `query-comment` также принимает ввод в виде словаря, например так:

<File name='dbt_project.yml'>

```yml
models:
  my_dbt_project:
    +materialized: table

query-comment:
  comment: string
  append: true | false
  job-label: true | false  # только BigQuery
```

</File>

## Определение

Строка, которая добавляется как комментарий в каждый запрос, который dbt выполняет к вашей базе данных. Этот комментарий может использоваться для атрибуции SQL-выражений конкретным ресурсам dbt, таким как модели и тесты.

Конфигурация `query-comment` также может вызывать макрос, который возвращает строку.

## Значение по умолчанию

По умолчанию dbt автоматически вставляет комментарий в формате <Term id="json" /> в каждый выполняемый запрос. Этот комментарий включает метаданные, такие как версия dbt, имя профиля и таргета, а также `node_id` ресурса, который сгенерировал запрос.

- Для Snowflake комментарий добавляется в *конец* запроса. Это предотвращает его удаление в процессе обработки.

- Для остальных адаптеров комментарий добавляется в *начало* запроса. Например:

  ```sql
  /* {"app": "dbt", "dbt_version": "1.10.0rc2", "profile_name": "debug",
      "target_name": "dev", "node_id": "model.dbt2.my_model"} */

  create view analytics.analytics.orders as (
      select ...
    );
  ```

## Использование синтаксиса словаря

Синтаксис словаря включает два ключа:
  * `comment` (необязательный, подробнее см. раздел [Значение по умолчанию](#default)): строка, которая будет добавлена в запрос как комментарий.
  * `append` (необязательный, по умолчанию `false`): определяет, должен ли комментарий добавляться в конец запроса (внизу) или нет (то есть добавляться в начало запроса). По умолчанию комментарии добавляются в начало запросов (то есть `append: false`).

Этот синтаксис полезен для баз данных, таких как Snowflake, которые [удаляют ведущие SQL-комментарии](https://docs.snowflake.com/en/release-notes/2017-04.html#queries-leading-comments-removed-during-execution).

## Примеры

### Добавить статический комментарий в начало

В следующем примере в заголовок SQL-запросов, которые выполняет dbt, добавляется комментарий `/* executed by dbt */`.

<File name='dbt_project.yml'>

```yml
query-comment: "executed by dbt"

```

</File>

**Пример результата:**

```sql
/* executed by dbt */

select ...
```

### Отключить комментарии запросов

<File name='dbt_project.yml'>

```yml
query-comment:

```

</File>

Или:

<File name='dbt_project.yml'>

```yml
query-comment: null

```

</File>

### Добавить динамический комментарий в начало

В следующем примере добавляется комментарий, значение которого зависит от настроенного `user`, указанного в активном таргете dbt.

<File name='dbt_project.yml'>

```yml
query-comment: "run by {{ target.user }} in dbt"

```

</File>

**Пример результата:**

```sql
/* run by drew in dbt */

select ...
```

### Добавить комментарий по умолчанию в конец

В следующем примере используется синтаксис словаря, чтобы добавить (а не предварять) комментарий по умолчанию.

Обратите внимание, что поле `comment:` опущено, чтобы позволить добавить комментарий по умолчанию.

<File name='dbt_project.yml'>

```yaml

query-comment:
  append: True
```

</File>

**Пример результата:**

```sql
select ...
/* {"app": "dbt", "dbt_version": "1.6.0rc2", "profile_name": "debug", "target_name": "dev", "node_id": "model.dbt2.my_model"} */
;
```

### BigQuery: включение элементов комментария запроса в job labels

Если `query-comment.job-label` установлен в `true`, dbt добавит элементы комментария запроса (если используется словарь) или строку комментария в job labels выполняемого запроса. Эти метки будут добавлены дополнительно к меткам, указанным в [BigQuery-специфичной конфигурации](/reference/project-configs/query-comment#bigquery-include-query-comment-items-as-job-labels).

<File name='dbt_project.yml'>

```yaml

query-comment:
  job-label: True
```

</File>

### Добавить пользовательский комментарий в конец

В следующем примере используется синтаксис словаря, чтобы добавить (а не предварять) комментарий, значение которого зависит от настроенного `user`, указанного в активном таргете dbt.

<File name='dbt_project.yml'>

```yaml

query-comment:
  comment: "run by {{ target.user }} in dbt"
  append: True
```

</File>

**Пример результата:**

```sql
select ...
/* run by drew in dbt */
;
```

### Средний уровень: использование макроса для генерации комментария

Конфигурация `query-comment` может ссылаться на макросы в вашем dbt-проекте. Просто создайте макрос с любым именем (`query_comment` — хороший вариант для начала!) в директории `macros`, например так:

<File name='macros/query_comment.sql'>

```jinja2

{% macro query_comment() %}

  dbt {{ dbt_version }}: running {{ node.unique_id }} for target {{ target.name }}

{% endmacro %}
```

</File>

Затем вызовите этот макрос в файле `dbt_project.yml`. Обязательно заключите вызов макроса в кавычки, чтобы YAML-парсер не попытался интерпретировать `{` как начало словаря.

<File name='dbt_project.yml'>

```yaml
query-comment: "{{ query_comment() }}"

```

</File>

### Продвинутый уровень: использование макроса для генерации комментария

В следующем примере показан JSON-комментарий запроса, который можно парсить для анализа характеристик производительности вашего dbt-проекта.

<File name='macros/query_comment.sql'>

```jinja2
{% macro query_comment(node) %}
    {%- set comment_dict = {} -%}
    {%- do comment_dict.update(
        app='dbt',
        dbt_version=dbt_version,
        profile_name=target.get('profile_name'),
        target_name=target.get('target_name'),
    ) -%}
    {%- if node is not none -%}
      {%- do comment_dict.update(
        file=node.original_file_path,
        node_id=node.unique_id,
        node_name=node.name,
        resource_type=node.resource_type,
        package_name=node.package_name,
        relation={
            "database": node.database,
            "schema": node.schema,
            "identifier": node.identifier
        }
      ) -%}
    {% else %}
      {%- do comment_dict.update(node_id='internal') -%}
    {%- endif -%}
    {% do return(tojson(comment_dict)) %}
{% endmacro %}
```

</File>

Как и выше, вызовите этот макрос следующим образом:

<File name='dbt_project.yml'>

```yaml
query-comment: "{{ query_comment(node) }}"

```

</File>

## Контекст компиляции

При генерации комментария запроса доступны следующие переменные контекста:

| Context Variable | Описание |
| ---------------- | -------- |
| dbt_version      | Версия используемого dbt. Подробнее о версионировании релизов см. [Versioning](/reference/commands/version#versioning). |
| env_var          | См. [env_var](/reference/dbt-jinja-functions/env_var) |
| modules          | См. [modules](/reference/dbt-jinja-functions/modules) |
| run_started_at   | Момент начала запуска dbt |
| invocation_id    | Уникальный идентификатор запуска dbt |
| fromjson         | См. [fromjson](/reference/dbt-jinja-functions/fromjson) |
| tojson           | См. [tojson](/reference/dbt-jinja-functions/tojson) |
| log              | См. [log](/reference/dbt-jinja-functions/log) |
| var              | См. [var](/reference/dbt-jinja-functions/var) |
| target           | См. [target](/reference/dbt-jinja-functions/target) |
| connection_name  | Строка, представляющая внутреннее имя соединения. Эта строка генерируется dbt. |
| node             | Словарное представление разобранного объекта node. Используйте `node.unique_id`, `node.database`, `node.schema` и т. д. |

Примечание: функция `var()` в макросах `query-comment` имеет доступ только к переменным, переданным через аргумент CLI `--vars`. Переменные, определённые в блоке `vars` вашего `dbt_project.yml`, недоступны при генерации комментариев запросов.
