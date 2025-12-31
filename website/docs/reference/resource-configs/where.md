---
resource_types: [tests]
datatype: string
---

### Определение {#definition}

Фильтрует ресурс, который тестируется (модель, источник, сид или снимок).

Условие `where` вставляется в тестовый запрос, заменяя ссылку на ресурс на <Term id="subquery" />. Например, тест `not_null` может выглядеть так:
```sql
select *
from my_model
where my_column is null
```
Если конфигурация `where` установлена на `where date_column = current_date`, то тестовый запрос будет обновлен до:
```sql
select *
from (select * from my_model where date_column = current_date) dbt_subquery
where my_column is null
```

### Примеры {#examples}

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Специфический тест', value: 'specific', },
    { label: 'Одноразовый тест', value: 'one_off', },
    { label: 'Общий тестовый блок', value: 'generic', },
    { label: 'Уровень проекта', value: 'project', },
  ]
}>

<TabItem value="specific">

Настройте конкретный экземпляр общего (схемного) теста:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: large_table
    columns:
      - name: my_column
        data_tests:
          - accepted_values:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ["a", "b", "c"]
              config:
                where: "date_column = current_date"
      - name: other_column
        data_tests:
          - not_null:
              config: 
                where: "date_column < current_date"
```

</File>

</TabItem>

<TabItem value="one_off">

Эта конфигурация игнорируется для одноразовых тестов.

</TabItem>

<TabItem value="generic">

Установите значение по умолчанию для всех экземпляров общего (схемного) теста, задав конфигурацию внутри его тестового блока (определения):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(where = "date_column = current_date") }}

select ...

{% endtest %}
```

</File>

</TabItem>

<TabItem value="project">

Установите значение по умолчанию для всех тестов в пакете или проекте:

<File name='dbt_project.yml'>

```yaml
data_tests:
  +where: "date_column = current_date"
  
  <package_name>:
    +where: >
        date_column = current_date
        and another_column is not null
```

</File>

</TabItem>

</Tabs>

### Пользовательская логика {#custom-logic}

Контекст рендеринга для конфигурации `where` такой же, как и для всех конфигураций, определенных в файлах `.yml`. У вас есть доступ к `{{ var() }}` и `{{ env_var() }}`, но у вас **нет** доступа к пользовательским макросам для установки этой конфигурации. Если вы хотите использовать пользовательские макросы для шаблонизации фильтра `where` для определенных тестов, существует обходной путь.

dbt определяет макрос `get_where_subquery`.

dbt заменяет `{{ model }}` в определениях общих тестов на `{{ get_where_subquery(relation) }}`, где `relation` — это `ref()` или `source()` для тестируемого ресурса. Стандартная реализация этого макроса возвращает:
- `{{ relation }}`, когда конфигурация `where` не определена (`ref()` или `source()`)
- `(select * from {{ relation }} where {{ where }}) dbt_subquery`, когда конфигурация `where` определена

Вы можете переопределить это поведение, выполнив следующие действия:
- Определив пользовательский `get_where_subquery` в вашем корневом проекте
- Определив пользовательский `<adapter>__get_where_subquery` [кандидат на диспетчеризацию](/reference/dbt-jinja-functions/dispatch) в вашем пакете или адаптере

Внутри определения этого макроса вы можете ссылаться на любые пользовательские макросы, которые вам нужны, опираясь на статические входные данные из конфигурации. В самом простом случае это позволяет вам соблюдать принцип DRY и не дублировать код, который иначе пришлось бы повторять во множестве разных `.yml`‑файлов. Поскольку макрос `get_where_subquery` вычисляется во время выполнения, ваши пользовательские макросы также могут включать [получение результатов интроспективных запросов к базе данных](/reference/dbt-jinja-functions/run_query).

#### Пример {#example}

Отфильтруйте тест так, чтобы он учитывал только данные за последние N дней, используя кросс‑платформенный макрос dbt [`dateadd()`](/reference/dbt-jinja-functions/cross-database-macros#dateadd). Количество дней можно задать в строке‑шаблоне.

<File name='models/config.yml'>

```yml
models:
  - name: my_model
    columns:
      - name: id
        data_tests:
          - unique:
              config:
                where: "date_column > __3_days_ago__"  # строка-заглушка для статической конфигурации
```

</File>

<File name='macros/custom_get_where_subquery.sql'>

```sql
{% macro get_where_subquery(relation) -%}
    {% set where = config.get('where') %}
    {% if where %}
      {% if "_days_ago__" in where %}
          {# заменить строку-заглушку результатом пользовательского макроса #}
          {% set where = replace_days_ago(where) %}
        {% endif %}
        {%- set filtered -%}
            (select * from {{ relation }} where {{ where }}) dbt_subquery
        {%- endset -%}
        {% do return(filtered) %}
    {%- else -%}
        {% do return(relation) %}
    {%- endif -%}
{%- endmacro %}

{% macro replace_days_ago(where_string) %}
    {# Use regex to search the pattern for the number days #}
    {# Default to 3 days when no number found #}
    {% set re = modules.re %}
    {% set days = 3 %}
    {% set pattern = '__(\d+)_days_ago__' %}
    {% set match = re.search(pattern, where_string) %}
    {% if match %}
        {% set days = match.group(1) | int %}        
    {% endif %}
    {% set n_days_ago = dbt.dateadd('day', -days, current_timestamp()) %}
    {% set result = re.sub(pattern, n_days_ago, where_string) %}
    {{ return(result) }}
{% endmacro %}
```

</File>