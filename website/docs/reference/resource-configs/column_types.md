## Описание
При необходимости укажите тип данных столбцов в [seed](/docs/build/seeds), предоставив словарь, где ключи — это имена столбцов, а значения — допустимый тип данных (это может различаться в зависимости от базы данных).

Если не указывать это, dbt определит тип данных на основе значений столбцов в вашем seed-файле.

## Использование
Укажите типы столбцов в вашем файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    country_codes:
      +column_types:
        country_code: varchar(2)
        country_name: varchar(32)
```

</File>

Или:

<File name='seeds/properties.yml'>

```yml

seeds:
  - name: country_codes
    config:
      column_types:
        country_code: varchar(2)
        country_name: varchar(32)
```

</File>

Если вы ранее запускали `dbt seed`, вам нужно будет выполнить `dbt seed --full-refresh`, чтобы изменения вступили в силу.

Обратите внимание, что вам нужно будет использовать полный путь к директории seed при настройке `column_types`. Например, для seed-файла в `seeds/marketing/utm_mappings.csv` вам нужно будет настроить его следующим образом:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    marketing:
      utm_mappings:
        +column_types:
          ...

```

</File>

## Примеры

### Используйте тип столбца varchar, чтобы сохранить ведущие нули в zipcode
<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # необходимо указать имя проекта
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>

## Рекомендация
Используйте эту настройку только при необходимости, то есть когда определение типа не работает должным образом. В противном случае вы можете опустить эту настройку.

## Устранение неполадок
Примечание: Настройка `column_types` чувствительна к регистру, независимо от конфигурации кавычек. Если вы указываете столбец как `Country_Name` в вашем Seed, вы должны ссылаться на него как `Country_Name`, а не `country_name`.  
