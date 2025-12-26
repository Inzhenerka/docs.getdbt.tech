---
datatype: string
description: "Прочтите это руководство, чтобы понять конфигурацию профиля в dbt."
---
<File name='dbt_project.yml'>

```yml
profile: string
```

</File>

## Определение
Профиль, который ваш проект dbt должен использовать для подключения к вашему <Term id="data-warehouse" />.
* Если вы разрабатываете в <Constant name="cloud" />: эта конфигурация не применяется.
* Если вы разрабатываете локально: эта конфигурация обязательна, если только не используется опция командной строки, такая как [`--profile`](/docs/core/connect-data-platform/connection-profiles#overriding-profiles-and-targets). Флаг `--profile` переопределяет профиль, заданный в `dbt_project.yml`.

## Связанные руководства
* [Подключение к вашему хранилищу данных с использованием командной строки](/docs/core/connect-data-platform/connection-profiles#connecting-to-your-warehouse-using-the-command-line)

## Рекомендация
Часто в организации есть только одно <Term id="data-warehouse" />, поэтому разумно использовать название вашей организации в качестве имени профиля, в формате `snake_case`. Например:
* `profile: acme`
* `profile: jaffle_shop`

Также имеет смысл включить название технологии вашего хранилища в имя профиля, особенно если у вас несколько хранилищ. Например:
* `profile: acme_snowflake`
* `profile: jaffle_shop_bigquery`
* `profile: jaffle_shop_redshift`