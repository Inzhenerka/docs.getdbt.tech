---
title: Как указать типы столбцов?
description: "Укажите типы столбцов в моделях"
sidebar_label: 'Укажите типы столбцов в моделях'
id: specifying-column-types

---
Просто приведите столбец к правильному типу в вашей модели:

```sql
select
    id,
    created::timestamp as created
from some_other_table
```

Вы можете задаться этим вопросом, если привыкли выполнять такие операторы:

```sql
create table dbt_alice.my_table
  id integer,
  created timestamp;

insert into dbt_alice.my_table (
  select id, created from some_other_table
)
```

В сравнении, dbt создаст эту <Term id="table" /> с помощью оператора `create table as`:

```sql
create table dbt_alice.my_table as (
  select id, created from some_other_table
)
```

При условии, что ваши запросы модели возвращают правильный тип столбца, создаваемая вами таблица также будет иметь правильный тип столбца.

Чтобы определить дополнительные параметры столбца:

* Вместо того чтобы накладывать ограничения уникальности и NOT NULL на ваш столбец, используйте функциональность [тестирования данных](/docs/build/data-tests) в dbt, чтобы проверить, что ваши утверждения о модели верны.
* Вместо создания значений по умолчанию для столбца используйте SQL для выражения значений по умолчанию (например, `coalesce(updated_at, current_timestamp()) as updated_at`)
* В крайних случаях, когда вам действительно нужно изменить столбец (например, кодирование на уровне столбца в Redshift), рассмотрите возможность реализации этого через [post-hook](/reference/resource-configs/pre-hook-post-hook).