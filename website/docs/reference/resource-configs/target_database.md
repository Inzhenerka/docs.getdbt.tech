---
resource_types: [snapshots]
description: "Target_database - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: string
---

:::note

Начиная с dbt Core версии 1.9+, эта функциональность больше не используется. Используйте конфигурацию [database](/reference/resource-configs/database) в качестве альтернативы для определения пользовательской базы данных, при этом соблюдая макрос `generate_database_name`.

Попробуйте это сейчас в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks).

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
База данных, в которую dbt должен построить [снимок](/docs/build/snapshots) <Term id="table" />.

Примечания:
- Указанная база данных должна уже существовать
- В **BigQuery** это аналогично `проекту`.
- В **Redshift** кросс-базовые запросы невозможны. Если вы используете этот параметр, вы получите следующую ошибку. Таким образом, **не используйте** этот параметр в Redshift:
```
Обнаружена ошибка:
Ошибка выполнения
  Кросс-базовые ссылки не разрешены в redshift (raw vs analytics)
```

## По умолчанию
По умолчанию dbt будет использовать [target](/reference/dbt-jinja-functions/target) базу данных, связанную с вашим профилем/соединением.

## Примеры
### Построение всех снимков в базе данных с именем `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_database: snapshots

```

</File>

### Использование базы данных с учетом цели
Используйте переменную [`{{ target }}`](/reference/dbt-jinja-functions/target), чтобы изменить, в какой базе данных будет построена таблица снимков.

Примечание: подумайте, подходит ли вам этот вариант использования, так как последующие `refs` будут выбирать из `dev` версии снимка, что может затруднить проверку моделей, зависящих от снимков.

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_database: "{% if target.name == 'dev' %}dev{% else %}{{ target.database }}{% endif %}"

```

</File>

### Использование того же поведения именования баз данных, что и у моделей

Используйте макрос [`generate_database_name`](/docs/build/custom-databases), чтобы строить снимки в базах данных, которые следуют тому же поведению именования, что и ваши модели.

Примечания:
* Этот макрос недоступен при настройке из файла `dbt_project.yml`, поэтому он должен быть настроен в блоке конфигурации снимка.
* Подумайте, подходит ли вам этот вариант использования, так как последующие `refs` будут выбирать из `dev` версии снимка, что может затруднить проверку моделей, зависящих от снимков.

<File name='snapshots/orders_snaphot.sql'>

```sql
{{
    config(
      target_database=generate_database_name('snapshots')
    )
}}
```

</File>