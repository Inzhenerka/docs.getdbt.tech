---
resource_types: [tests]
datatype: string
---

Тестовые запросы пишутся для возврата набора записей, которые не соответствуют ожиданиям или утверждениям, заявленным в этом тесте: дублирующиеся записи, значения null и т.д.

Чаще всего это количество строк, возвращаемых тестовым запросом: значение по умолчанию для `fail_calc` — это `count(*)`. Но это также может быть пользовательское вычисление, будь то агрегатное вычисление или просто имя столбца, который нужно выбрать из тестового запроса.

Большинство тестов не используют конфигурацию `fail_calc`, предпочитая возвращать количество неудачных строк. Для тестов, которые это делают, наиболее распространенное место для установки конфигурации `fail_calc` — это прямо внутри блока общего теста, рядом с определением его запроса. Тем не менее, `fail_calc` можно установить во всех тех же местах, что и другие конфигурации.

Например, вы можете настроить тест `unique`, чтобы он возвращал `sum(n_records)` вместо `count(*)` в качестве вычисления неудачи: то есть количество строк в модели, содержащих дублированное значение столбца, а не количество различных значений столбца, которые дублируются.

:::tip Совет
Будьте осторожны, используя функции, такие как `sum()`, для `fail_calc` в любом тесте, который может не вернуть ни одной строки.

Если строки не возвращаются, тест не пройдет и не провалится, но вернет следующую ошибку:

```
None is not of type 'integer'

Failed validating 'type' in schema['properties']['failures']:
    {'type': 'integer'}

On instance['failures']:
    None
```

Чтобы избежать этой проблемы, используйте оператор case, чтобы гарантировать, что возвращается `0`, когда строки отсутствуют:

```yaml
fail_calc: "case when count(*) > 0 then sum(n_records) else 0 end"
```

:::

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Конкретный тест', value: 'specific', },
    { label: 'Разовый тест', value: 'one_off', },
    { label: 'Блок общего теста', value: 'generic', },
    { label: 'Уровень проекта', value: 'project', },
  ]
}>

<TabItem value="specific">

Настройка конкретного экземпляра общего (схемного) теста:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: my_model
    columns:
      - name: my_columns
        data_tests:
          - unique:
              config:
                fail_calc: "case when count(*) > 0 then sum(n_records) else 0 end"
```

</File>

</TabItem>

<TabItem value="one_off">

Настройка разового (данного) теста:

<File name='tests/<filename>.sql'>

```sql
{{ config(fail_calc = "sum(total_revenue) - sum(revenue_accounted_for)") }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Установка значения по умолчанию для всех экземпляров общего (схемного) теста, путем установки конфигурации внутри его блока теста (определение):

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

Установка значения по умолчанию для всех тестов в пакете или проекте:

<File name='dbt_project.yml'>

```yaml
data_tests:
  +fail_calc: count(*)  # all tests

  <package_name>:
    +fail_calc: count(distinct id) # тесты в <package_name>
```

</File>

</TabItem>

</Tabs>