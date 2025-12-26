---
resource_types: [tests]
datatype: integer
---

Ограничьте количество ошибок, которые будут возвращены запросом теста. Мы рекомендуем использовать эту настройку при работе с большими наборами данных и [сохранении ошибок в базе данных](/reference/resource-configs/store_failures).

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

Настройте конкретный экземпляр общего (схемного) теста:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: large_table
    columns:
      - name: very_unreliable_column
        data_tests:
          - accepted_values:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                values: ["a", "b", "c"]
              config:
                limit: 1000  # будет включать только первые 1000 ошибок
```

</File>

</TabItem>

<TabItem value="one_off">

Настройте разовый (данный) тест:

<File name='tests/<filename>.sql'>

```sql
{{ config(limit = 1000) }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Установите значение по умолчанию для всех экземпляров общего (схемного) теста, задав конфигурацию внутри его блока теста (определение):

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
data_tests:
  +limit: 1000  # все тесты
  
  <package_name>:
    +limit: 50 # тесты в <package_name>
```

</File>

</TabItem>

</Tabs>