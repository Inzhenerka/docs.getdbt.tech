---
resource_types: [seeds]
datatype: {column_name: datatype}
---

## Описание {#description}
Позволяет при необходимости явно указать типы данных столбцов в [seed](/docs/build/seeds), передав словарь, где ключами являются имена столбцов, а значениями — допустимые типы данных (они различаются в зависимости от используемой базы данных).

Если этого не сделать, dbt попытается автоматически определить типы данных на основе значений столбцов в seed-файле.

## Использование {#usage}
Укажите типы столбцов в файле `dbt_project.yml`:

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

Если вы ранее уже запускали `dbt seed`, необходимо выполнить `dbt seed --full-refresh`, чтобы изменения вступили в силу.

Обратите внимание: при настройке `column_types` необходимо использовать полный путь к seed-файлу относительно директории `seeds`. Например, для seed-файла `seeds/marketing/utm_mappings.csv` конфигурация будет выглядеть так:

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

## Примеры {#examples}

### Использование типа varchar для сохранения ведущих нулей в почтовом индексе {#use-a-varchar-column-type-to-preserve-leading-zeros-in-a-zipcode}

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # необходимо указать имя проекта
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>

## Рекомендации {#recommendation}
Используйте эту настройку только в тех случаях, когда это действительно необходимо — например, если автоматическое определение типов работает некорректно. В остальных случаях конфигурацию можно опустить.

## Устранение неполадок {#troubleshooting}
Примечание: конфигурация `column_types` чувствительна к регистру, независимо от настроек кавычек. Если в seed-файле столбец указан как `Country_Name`, то и в конфигурации его необходимо указывать как `Country_Name`, а не `country_name`.
