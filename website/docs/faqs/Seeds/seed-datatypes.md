---
title: Как задать тип данных для столбца в seed?
description: "Используйте column_types для задания типа данных"
sidebar_label: 'Задать тип данных для столбца в seed'
id: seed-datatypes

---
dbt будет определять тип данных для каждого столбца на основе данных в вашем CSV.

Вы также можете явно задать тип данных, используя [конфигурацию](reference/resource-configs/column_types.md) `column_types`, следующим образом:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # необходимо указать имя проекта
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>