---
datatype: string
description: "Прочитайте это руководство, чтобы понять конфигурацию профиля в dbt."
---
<File name='dbt_project.yml'>

```yml
profile: string
```

</File>

## Определение
Профиль, который должен использовать ваш проект dbt для подключения к вашему <Term id="data-warehouse" />.
* Если вы разрабатываете в dbt Cloud: Эта конфигурация не применима.
* Если вы разрабатываете локально: Эта конфигурация обязательна, если не указан параметр командной строки (т.е. `--profile`).

## Связанные руководства
* [Подключение к вашему хранилищу данных с помощью командной строки](/docs/core/connect-data-platform/connection-profiles#connecting-to-your-warehouse-using-the-command-line)

## Рекомендация
Часто в организации есть только одно <Term id="data-warehouse" />, поэтому разумно использовать название вашей организации в качестве имени профиля, в формате `snake_case`. Например:
* `profile: acme`
* `profile: jaffle_shop`

Также разумно включить название технологии вашего хранилища в имя профиля, особенно если у вас несколько хранилищ. Например:
* `profile: acme_snowflake`
* `profile: jaffle_shop_bigquery`
* `profile: jaffle_shop_redshift`