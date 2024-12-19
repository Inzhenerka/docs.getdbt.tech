---
resource_types: [tests]
datatype: string
---

### Определение

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

### Примеры

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
version: 2

models:
  - name: large_table
    columns:
      - name: my_column
        tests:
          - accepted_values:
              values: ["a", "b", "c"]
              config:
                where: "date_column = current_date"
      - name: other_column
        tests:
          - not_null:
              where: "date_column < current_date"
```

</File>

</TabItem>

<TabItem value="one_off">

Настройте одноразовый (данные) тест:

<File name='tests/<filename>.sql'>

```sql
{{ config(where = "date_column = current_date") }}

select ...
```

</File>

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
tests:
  +where: "date_column = current_date"
  
  <package_name>:
    +where: >
        date_column = current_date
        and another_column is not null
```

</File>

</TabItem>

</Tabs>

### Пользовательская логика

Контекст рендеринга для конфигурации `where` такой же, как и для всех конфигураций, определенных в файлах `.yml`. У вас есть доступ к `{{ var() }}` и `{{ env_var() }}`, но у вас **нет** доступа к пользовательским макросам для установки этой конфигурации. Если вы хотите использовать пользовательские макросы для шаблонизации фильтра `where` для определенных тестов, существует обходной путь.

Начиная с версии v0.21, dbt определяет [`get_where_subquery` макрос](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt/include/global_project/macros/materializations/tests/where_subquery.sql).

dbt заменяет `{{ model }}` в определениях общих тестов на `{{ get_where_subquery(relation) }}`, где `relation` — это `ref()` или `source()` для тестируемого ресурса. Стандартная реализация этого макроса возвращает:
- `{{ relation }}`, когда конфигурация `where` не определена (`ref()` или `source()`)
- `(select * from {{ relation }} where {{ where }}) dbt_subquery`, когда конфигурация `where` определена

Вы можете переопределить это поведение, выполнив следующие действия:
- Определив пользовательский `get_where_subquery` в вашем корневом проекте
- Определив пользовательский `<adapter>__get_where_subquery` [кандидат на диспетчеризацию](/reference/dbt-jinja-functions/dispatch) в вашем пакете или адаптере

Внутри этого определения макроса вы можете ссылаться на любые пользовательские макросы, основываясь на статических входных данных из конфигурации. В самом простом виде это позволяет вам избежать дублирования кода, который вам в противном случае пришлось бы повторять в различных файлах `.yml`. Поскольку макрос `get_where_subquery` разрешается во время выполнения, ваши пользовательские макросы также могут включать [получение результатов интроспективных запросов к базе данных](https://docs.getdbt.com/reference/dbt-jinja-functions/run_query).

**Пример:** Отфильтруйте ваш тест по данным за последние три дня, используя кроссплатформенный макрос [`dateadd()`](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros#dateadd) от dbt.

<File name='models/config.yml'>

```yml
version: 2
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - unique:
              config:
                where: "date_column > __three_days_ago__"  # строка-заполнитель для статической конфигурации
```

</File>

<File name='macros/custom_get_where_subquery.sql'>

```sql
{% macro get_where_subquery(relation) -%}
    {% set where = config.get('where') %}
    {% if where %}
        {% if "__three_days_ago__" in where %}
            {# замените строку-заполнитель на результат пользовательского макроса #}
            {% set three_days_ago = dbt.dateadd('day', -3, current_timestamp()) %}
            {% set where = where | replace("__three_days_ago__", three_days_ago) %}
        {% endif %}
        {%- set filtered -%}
            (select * from {{ relation }} where {{ where }}) dbt_subquery
        {%- endset -%}
        {% do return(filtered) %}
    {%- else -%}
        {% do return(relation) %}
    {%- endif -%}
{%- endmacro %}
```

</File>