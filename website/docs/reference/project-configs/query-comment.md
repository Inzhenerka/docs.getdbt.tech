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

Конфигурация `query-comment` также принимает словарь, как показано ниже:

<File name='dbt_project.yml'>

```yml
models:
  my_dbt_project:
    +materialized: table

query-comment:
  comment: string
  append: true | false
  job-label: true | false  # Только для BigQuery
```

</File>

## Definition

Строка, которая будет добавляться в виде комментария к каждому запросу, который dbt выполняет к вашей базе данных. Этот комментарий позволяет связывать SQL‑выражения с конкретными ресурсами dbt, такими как модели и тесты.

Конфигурация `query-comment` также может вызывать макрос, который возвращает строку.

## По умолчанию

By default, dbt automatically inserts a <Term id="json" /> comment in each query it runs. This comment includes metadata such as the dbt version, profile and target names, and node ID for the resource generating the query.

- For Snowflake, the comment appears at the *end* of the query. This prevents the comment from being stripped during processing.

- Для других адаптеров комментарий добавляется в *начале* запроса. Например:

  ```sql
  /* {"app": "dbt", "dbt_version": "1.10.0rc2", "profile_name": "debug",
      "target_name": "dev", "node_id": "model.dbt2.my_model"} */

  create view analytics.analytics.orders as (
      select ...
    );
  ```

### Добавление статического комментария в начало
Следующий пример вставляет комментарий `/* executed by dbt */` в заголовок SQL-запросов, которые выполняет dbt.

<File name='dbt_project.yml'>

```yml
query-comment: "executed by dbt"

```

</File>

**Пример вывода:**

```sql
/* executed by dbt */

select ...
```

### Отключение комментариев в запросах

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

### Добавление динамического комментария в начало
Следующий пример вставляет комментарий, который изменяется в зависимости от настроенного `user`, указанного в активной цели dbt.

<File name='dbt_project.yml'>

```yml
query-comment: "run by {{ target.user }} in dbt"

```

</File>

**Пример вывода:**

```sql
/* run by drew in dbt */

select ...
```

### Добавление комментария по умолчанию в конец
Следующий пример использует синтаксис словаря для добавления (вместо добавления в начало) комментария по умолчанию.

Обратите внимание, что поле `comment:` опущено, чтобы позволить добавление комментария по умолчанию.

<File name='dbt_project.yml'>

```yaml

query-comment:
  append: True
```

</File>

**Пример вывода:**

```sql
select ...
/* {"app": "dbt", "dbt_version": "1.6.0rc2", "profile_name": "debug", "target_name": "dev", "node_id": "model.dbt2.my_model"} */
;
```

### BigQuery: включение элементов комментария запроса как меток задания

Если `query-comment.job-label` установлено в true, dbt будет включать элементы комментария запроса, если это словарь, или строку комментария, как метки задания в запросе, который он выполняет. Они будут включены в дополнение к меткам, указанным в [конфигурации, специфичной для BigQuery](/reference/project-configs/query-comment#bigquery-include-query-comment-items-as-job-labels).

<File name='dbt_project.yml'>

```yaml

query-comment:
  job-label: True
```

</File>

### Добавление пользовательского комментария в конец
Следующий пример использует синтаксис словаря для добавления (вместо добавления в начало) комментария, который изменяется в зависимости от настроенного `user`, указанного в активной цели dbt.

<File name='dbt_project.yml'>

```yaml

query-comment:
  comment: "run by {{ target.user }} in dbt"
  append: True
```

</File>

**Пример вывода:**

```sql
select ...
/* run by drew in dbt */
;
```

### Intermediate: Использование макроса для генерации комментария

Конфигурация `query-comment` может ссылаться на макросы в вашем dbt‑проекте. Для этого достаточно создать макрос с любым именем (хорошим вариантом будет `query_comment`) в директории `macros`, например так:

<File name='macros/query_comment.sql'>

```jinja2

{% macro query_comment() %}

  dbt {{ dbt_version }}: running {{ node.unique_id }} for target {{ target.name }}

{% endmacro %}
```

</File>

Затем вызовите макрос в вашем файле `dbt_project.yml`. Убедитесь, что вы заключили макрос в кавычки, чтобы избежать попыток парсера YAML интерпретировать `{` как начало словаря.

<File name='dbt_project.yml'>

```yaml
query-comment: "{{ query_comment() }}"

```

</File>

### Продвинутый уровень: Использование макроса для генерации комментария

Следующий пример показывает JSON-комментарий к запросу, который может быть проанализирован для понимания характеристик производительности вашего проекта dbt.

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

Следующие переменные контекста доступны при генерации комментария к запросу:

| Переменная контекста | Описание |
| -------------------- | ----------- |
| dbt_version          | Версия dbt, которая используется. Для получения подробной информации о версионировании релизов см. [Версионирование](/reference/commands/version#versioning). |
| env_var              | См. [env_var](/reference/dbt-jinja-functions/env_var) |
| modules              | См. [modules](/reference/dbt-jinja-functions/modules) |
| run_started_at       | Когда начался вызов dbt |
| invocation_id        | Уникальный идентификатор для вызова dbt |
| fromjson             | См. [fromjson](/reference/dbt-jinja-functions/fromjson) |
| tojson               | См. [tojson](/reference/dbt-jinja-functions/tojson) |
| log                  | См. [log](/reference/dbt-jinja-functions/log) |
| var                  | См. [var](/reference/dbt-jinja-functions/var) |
| target               | См. [target](/reference/dbt-jinja-functions/target) |
| connection_name      | Строка, представляющая внутреннее имя для соединения. Эта строка генерируется dbt. |
| node                 | Представление узла в виде словаря. Используйте `node.unique_id`, `node.database`, `node.schema` и так далее. |

Примечание: функция `var()` в макросах `query-comment` имеет доступ только к переменным, переданным через аргумент `--vars` в CLI. Переменные, определённые в блоке `vars` вашего файла `dbt_project.yml`, недоступны при генерации комментариев к запросам.
