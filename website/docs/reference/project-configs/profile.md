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
* Если вы ведёте разработку в <Constant name="dbt" />: эта настройка не применяется
* Если вы ведёте разработку локально: эта настройка обязательна, если не указан параметр командной строки, например [`--profile`](/docs/local/profiles.yml#%D0%BF%D0%B5%D1%80%D0%B5%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5%D0%B9-%D0%B8-%D1%86%D0%B5%D0%BB%D0%B5%D0%B2%D1%8B%D1%85-%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9). Флаг `--profile` переопределяет профиль, заданный в `dbt_project.yml`.

## Связанные руководства
* [Подключение к хранилищу данных с помощью командной строки](/docs/local/profiles.yml#create-and-configure-the-profilesyml-file)

## Рекомендация {#recommendation}
Часто в организации есть только одно <Term id="data-warehouse" />, поэтому разумно использовать название вашей организации в качестве имени профиля, в формате `snake_case`. Например:
* `profile: acme`
* `profile: jaffle_shop`

Также имеет смысл включить название технологии вашего хранилища в имя профиля, особенно если у вас несколько хранилищ. Например:
* `profile: acme_snowflake`
* `profile: jaffle_shop_bigquery`
* `profile: jaffle_shop_redshift`