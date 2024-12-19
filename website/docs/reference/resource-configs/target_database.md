---
resource_types: [snapshots]
description: "Target_database - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: string
---

:::note

Начиная с версии dbt Core v1.9+, эта функциональность больше не используется. Используйте конфигурацию [database](/reference/resource-configs/database) в качестве альтернативы для определения пользовательской базы данных, при этом уважая макрос `generate_database_name`. 

Попробуйте это сейчас в [последнем релизе dbt Cloud](/docs/dbt-versions/cloud-release-tracks).

:::

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +target_database: string

```

</File>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  target_database="string"
) }}

```

</File>

## Описание
База данных, в которую dbt должен создать [снимок](/docs/build/snapshots) <Term id="table" />.

Примечания:
- Указанная база данных должна уже существовать.
- В **BigQuery** это аналогично `project`.
- В **Redshift** кросс-базовые запросы невозможны. Если вы используете этот параметр, вы получите следующую ошибку. Поэтому **не используйте** этот параметр в Redshift:
```
Encountered an error:
Runtime Error
  Cross-db references not allowed in redshift (raw vs analytics)
```

## По умолчанию
По умолчанию dbt будет использовать базу данных [target](/reference/dbt-jinja-functions/target), связанную с вашим профилем/соединением.

## Примеры
### Создание всех снимков в базе данных с именем `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_database: snapshots

```

</File>

### Использование базы данных с учетом целевого окружения
Используйте [`{{ target }}` переменную](/reference/dbt-jinja-functions/target), чтобы изменить, в какой базе данных создается таблица снимка.

Примечание: подумайте, подходит ли вам этот случай использования, так как последующие `refs` будут выбирать из версии `dev` снимка, что может затруднить проверку моделей, которые зависят от снимков.

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_database: "{% if target.name == 'dev' %}dev{% else %}{{ target.database }}{% endif %}"

```

</File>

### Использование того же поведения именования базы данных, что и у моделей

Используйте макрос [`generate_database_name` ](/docs/build/custom-databases), чтобы создавать снимки в базах данных, которые следуют тому же поведению именования, что и ваши модели.

Примечания:
* Этот макрос недоступен при конфигурации из файла `dbt_project.yml`, поэтому его необходимо настраивать в блоке конфигурации снимка.
* Подумайте, подходит ли вам этот случай использования, так как последующие `refs` будут выбирать из версии `dev` снимка, что может затруднить проверку моделей, которые зависят от снимков.

<File name='snapshots/orders_snaphot.sql'>

```sql
{{
    config(
      target_database=generate_database_name('snapshots')
    )
}}
```

</File>