---
resource_types: [tests]
datatype: integer
---

Ограничьте количество сбоев, которые будут возвращены запросом теста. Мы рекомендуем использовать эту конфигурацию при работе с большими наборами данных и [хранении сбоев в базе данных](/reference/resource-configs/store_failures).

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Конкретный тест', value: 'specific', },
    { label: 'Одноразовый тест', value: 'one_off', },
    { label: 'Общий блок тестов', value: 'generic', },
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
      - name: very_unreliable_column
        tests:
          - accepted_values:
              values: ["a", "b", "c"]
              config:
                limit: 1000  # будет включать только первые 1000 сбоев
```

</File>

</TabItem>

<TabItem value="one_off">

Настройте одноразовый (данные) тест:

<File name='tests/<filename>.sql'>

```sql
{{ config(limit = 1000) }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Установите значение по умолчанию для всех экземпляров общего (схемного) теста, задав конфигурацию внутри его блока теста (определения):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(limit = 500) }}

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
  +limit: 1000  # все тесты
  
  <package_name>:
    +limit: 50 # тесты в <package_name>
```

</File>

</TabItem>

</Tabs>