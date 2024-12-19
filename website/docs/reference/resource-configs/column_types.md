---
resource_types: [seeds]
datatype: {column_name: datatype}
---

## Описание
Опционально укажите тип базы данных для столбцов в [seed](/docs/build/seeds), предоставив словарь, где ключи — это имена столбцов, а значения — допустимые типы данных (они различаются в зависимости от баз данных).

Если это не указано, dbt будет выводить тип данных на основе значений столбцов в вашем seed файле.

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
version: 2

seeds:
  - name: country_codes
    config:
      column_types:
        country_code: varchar(2)
        country_name: varchar(32)
```

</File>

Если вы ранее запускали `dbt seed`, вам нужно будет выполнить `dbt seed --full-refresh`, чтобы изменения вступили в силу.

Обратите внимание, что вам нужно использовать полный путь к директории seed при настройке `column_types`. Например, для seed файла по пути `seeds/marketing/utm_mappings.csv`, вам нужно будет настроить его следующим образом:

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

### Используйте тип столбца varchar для сохранения ведущих нулей в почтовом индексе
(Примечание: сохранение ведущих нулей работает с версии 0.16.0 и выше)
<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # вы должны указать имя проекта
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>

## Рекомендация
Используйте эту конфигурацию только в случае необходимости, т.е. когда вывод типа не работает так, как ожидалось. В противном случае вы можете пропустить эту конфигурацию.

## Устранение неполадок
Примечание: Конфигурация `column_types` чувствительна к регистру, независимо от конфигурации кавычек. Если вы указываете столбец как `Country_Name` в вашем Seed, вы должны ссылаться на него как `Country_Name`, а не `country_name`.