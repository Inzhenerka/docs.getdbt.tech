---
title: Как задать типы столбцов?
description: "Задание типов столбцов в моделях"
sidebar_label: 'Задание типов столбцов в моделях'
id: specifying-column-types

---
Просто приведите столбец к нужному типу в вашей модели:

```sql
select
    id,
    created::timestamp as created
from some_other_table
```

Этот вопрос может возникнуть, если вы привыкли выполнять такие запросы:

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

Пока ваши запросы в модели возвращают столбцы с правильным типом, создаваемая таблица также будет иметь правильный тип столбцов.

Для определения дополнительных параметров столбцов:

* Вместо того чтобы применять ограничения уникальности и not-null к вашим столбцам, используйте функциональность [тестирования данных](/docs/build/data-tests) в dbt, чтобы проверить, что ваши утверждения о модели верны.
* Вместо создания значений по умолчанию для столбца, используйте SQL для выражения значений по умолчанию (например, `coalesce(updated_at, current_timestamp()) as updated_at`)
* В редких случаях, когда вам _действительно_ нужно изменить столбец (например, кодирование на уровне столбца в Redshift), рассмотрите возможность реализации этого через [post-hook](/reference/resource-configs/pre-hook-post-hook).