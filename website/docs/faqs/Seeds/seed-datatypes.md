---
title: Как задать тип данных для столбца в seed?
description: "Используйте column_types для задания типа данных"
sidebar_label: 'Задать тип данных для столбца в seed'
id: seed-datatypes

---
dbt будет определять тип данных для каждого столбца на основе данных в вашем CSV.

Вы также можете явно задать тип данных с помощью [конфигурации](/reference/resource-configs/column_types) `column_types`, как показано ниже:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # необходимо указать имя проекта
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>