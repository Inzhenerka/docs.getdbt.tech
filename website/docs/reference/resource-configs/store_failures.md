---
resource_types: [tests]
datatype: boolean
---

Настроенные тесты будут сохранять свои ошибки, когда будет вызвана команда `dbt test --store-failures`. Если вы установите эту конфигурацию как `false`, но [`store_failures_as`](/reference/resource-configs/store_failures_as) настроен, это значение будет переопределено.

## Описание
Опционально установите тест так, чтобы он всегда или никогда не сохранял свои ошибки в базе данных.
- Если указано как `true` или `false`, конфигурация `store_failures` будет иметь приоритет над наличием или отсутствием флага `--store-failures`.
- Если конфигурация `store_failures` равна `none` или опущена, ресурс будет использовать значение флага `--store-failures`.
- Когда установлено в `true`, `store_failures` сохраняет все записи (до [limit](/reference/resource-configs/limit)), которые не прошли тест. Ошибки сохраняются в новой таблице с именем теста. По умолчанию `store_failures` использует схему `{{ profile.schema }}_dbt_test__audit`, но вы можете [настроить](/reference/resource-configs/schema#tests) суффикс схемы на другое значение.
- Результаты теста всегда **заменяют** предыдущие ошибки для того же теста, даже если этот тест не приводит к ошибкам.
- По умолчанию `store_failures` использует схему с именем `dbt_test__audit`, но вы можете [настроить](/reference/resource-configs/schema#tests) схему на другое значение. Убедитесь, что у вас есть разрешение на создание или доступ к схемам для вашей работы. Для получения дополнительной информации обратитесь к [Часто задаваемым вопросам](#faqs).

Эта логика закодирована в макросе [`should_store_failures()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql#L15).

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Конкретный тест', value: 'specific', },
    { label: 'Единичный тест', value: 'singular', },
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
      - name: my_column
        tests:
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

Настройте единичный (данные) тест:

<File name='tests/<filename>.sql'>

```sql
{{ config(store_failures = true) }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Установите значение по умолчанию для всех экземпляров общего (схемного) теста, установив конфигурацию внутри его тестового блока (определения):

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

Установите значение по умолчанию для всех тестов в пакете или проекте:

<File name='dbt_project.yml'>

```yaml
tests:
  +store_failures: true  # все тесты
  
  <package_name>:
    +store_failures: false # тесты в <package_name>
```

</File>

</TabItem>

</Tabs>

## Часто задаваемые вопросы

<DetailsToggle alt_header="Получение ошибки 'permission denied for schema'">

Если вы получаете ошибку `Adapter name adapter: Adapter_name error: permission denied for schema dev_username_dbt_test__audit`, это, скорее всего, связано с тем, что у вашего пользователя нет разрешения на создание новых схем, несмотря на наличие прав владельца на вашу собственную схему разработки.

Чтобы решить эту проблему, вам нужно получить соответствующее разрешение на создание или доступ к пользовательским схемам. Выполните следующую SQL-команду в вашей среде платформы данных. Обратите внимание, что точный запрос на авторизацию может отличаться в зависимости от платформы данных:

```sql
create schema if not exists dev_username_dbt_test__audit authorization username;
```
_Замените `dev_username` на имя вашей конкретной схемы разработки и `username` на соответствующего пользователя, который должен иметь разрешения._

Эта команда предоставляет соответствующие разрешения для создания и доступа к схеме `dbt_test__audit`, которая часто используется с конфигурацией `store_failures`.

</DetailsToggle>