---
resource_types: [tests]
datatype: string
---

Тестовые запросы написаны для возврата набора неудачных записей, то есть тех, которые не соответствуют ожиданиям или утверждениям, заявленным в этом тесте: дублирующиеся записи, значения null и т.д.

Чаще всего это количество строк, возвращаемых тестовым запросом: значение по умолчанию для `fail_calc` — `count(*)`. Однако это также может быть пользовательское вычисление, будь то агрегатное вычисление или просто имя столбца, который нужно выбрать из тестового запроса.

Большинство тестов не используют конфигурацию `fail_calc`, предпочитая возвращать количество неудачных строк. Для тестов, которые это делают, наиболее распространенное место для установки конфигурации `fail_calc` — это непосредственно в блоке общего теста, рядом с определением его запроса. Тем не менее, `fail_calc` можно установить во всех тех же местах, что и другие конфигурации.

Например, вы можете настроить тест `unique`, чтобы он возвращал `sum(n_records)` вместо `count(*)` в качестве вычисления неудачи: то есть количество строк в модели, содержащих дублированное значение столбца, а не количество уникальных значений столбца, которые дублируются.

:::tip Совет
Будьте осторожны при использовании функций, таких как `sum()`, для `fail_calc` в любом тесте, который может не вернуть ни одной строки.

Если не будет возвращено ни одной строки, тест не пройдет и не провалится, но вернет следующую ошибку:

```
None is not of type 'integer'

Failed validating 'type' in schema['properties']['failures']:
    {'type': 'integer'}

On instance['failures']:
    None
```

Чтобы избежать этой проблемы, используйте оператор case, чтобы гарантировать, что будет возвращено `0`, когда строк не существует:

```yaml
fail_calc: "case when count(*) > 0 then sum(n_records) else 0 end"
```

:::

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Конкретный тест', value: 'specific', },
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
  - name: my_model
    columns:
      - name: my_columns
        tests:
          - unique:
              config:
                fail_calc: "case when count(*) > 0 then sum(n_records) else 0 end"
```

</File>

</TabItem>

<TabItem value="one_off">

Настройте одноразовый (данные) тест:

<File name='tests/<filename>.sql'>

```sql
{{ config(fail_calc = "sum(total_revenue) - sum(revenue_accounted_for)") }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Установите значение по умолчанию для всех экземпляров общего (схемного) теста, установив конфигурацию внутри его тестового блока (определения):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(fail_calc = "missing_in_a + missing_in_b") }}

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
  +fail_calc: count(*)  # все тесты
  
  <package_name>:
    +fail_calc: count(distinct id) # тесты в <package_name>
```

</File>

</TabItem>

</Tabs>