---
title: Как задать тип данных для столбца в моем seed?
description: "Используйте column_types для задания типа данных"
sidebar_label: 'Задать тип данных для столбца в seed'
id: seed-datatypes

---
dbt будет автоматически определять тип данных для каждого столбца на основе данных в вашем CSV.

Вы также можете явно задать тип данных, используя `column_types` [конфигурацию](reference/resource-configs/column_types.md) следующим образом:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # вы должны указать имя проекта
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>