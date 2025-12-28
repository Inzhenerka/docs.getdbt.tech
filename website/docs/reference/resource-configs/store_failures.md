---
resource_types: [tests]
datatype: boolean
---

Настроенные тесты будут сохранять свои ошибки при вызове `dbt test --store-failures`. Если вы установите эту конфигурацию как `false`, но [`store_failures_as`](/reference/resource-configs/store_failures_as) настроен, она будет переопределена.

## Описание
Позволяет опционально задать, должен ли тест **всегда** или **никогда** сохранять свои ошибки (failures) в базе данных.

- Если указано значение `true` или `false`, конфигурация `store_failures` имеет приоритет над наличием или отсутствием флага `--store-failures`.
- Если конфигурация `store_failures` имеет значение `none` или не указана, ресурс будет использовать значение флага `--store-failures`.
- При значении `true` параметр `store_failures` сохраняет все записи (в пределах [limit](/reference/resource-configs/limit)), которые не прошли тест. Ошибки сохраняются в новой таблице с именем теста.
- Результаты теста всегда **заменяют** предыдущие ошибки для этого же теста, даже если текущий запуск теста не выявил ни одной ошибки.
- По умолчанию `store_failures` использует схему с именем `{{ profile.schema }}_dbt_test__audit`, однако вы можете [настроить](/reference/resource-configs/schema#tests) схему на другое значение. Убедитесь, что у вас есть права на создание или доступ к схемам, необходимым для вашей работы. Подробнее см. в разделе [FAQ](#faqs).

Эта логика реализована в макросе [`should_store_failures()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql#L15).

Эта логика закодирована в макросе [`should_store_failures()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql#L15).

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Конкретный тест', value: 'specific', },
    { label: 'Единичный тест', value: 'singular', },
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
      - name: my_column
        data_tests:
          - unique:
              config:
                store_failures: true  # всегда сохранять ошибки
          - not_null:
              config:
                store_failures: false  # никогда не сохранять ошибки
```

</File>

</TabItem>

<TabItem value="singular">

Настройка единичного (данного) теста:

<File name='tests/<filename>.sql'>

```sql
{{ config(store_failures = true) }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Установка значения по умолчанию для всех экземпляров общего (схемного) теста, путем установки конфигурации внутри его блока теста (определения):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(store_failures = false) }}

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
  +store_failures: true  # all tests
  
  <package_name>:
    +store_failures: false # тесты в <package_name>
```

</File>

</TabItem>

</Tabs>

## Часто задаваемые вопросы

<DetailsToggle alt_header="Получение ошибки 'отказано в разрешении для схемы'">

Если вы получаете ошибку `Adapter name adapter: Adapter_name error: permission denied for schema dev_username_dbt_test__audit`, это, скорее всего, связано с тем, что у вашего пользователя нет разрешения на создание новых схем, несмотря на наличие прав владельца на вашу собственную схему разработки.

Чтобы решить эту проблему, вам необходимо иметь соответствующие разрешения для создания или доступа к пользовательским схемам. Выполните следующую SQL-команду в вашей соответствующей среде платформы данных. Обратите внимание, что точный запрос на авторизацию может отличаться в зависимости от платформы данных:

```sql
create schema if not exists dev_username_dbt_test__audit authorization username;
```
_Замените `dev_username` на имя вашей конкретной схемы разработки и `username` на соответствующего пользователя, которому должны быть предоставлены разрешения._

Эта команда предоставляет соответствующие разрешения для создания и доступа к схеме `dbt_test__audit`, которая часто используется с конфигурацией `store_failures`.

</DetailsToggle>
