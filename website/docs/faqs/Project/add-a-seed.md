---
title: Добавление seed-файла
id: add-a-seed
description: Узнайте, как добавить seed-файл в ваш проект
---

1. Добавьте seed-файл:

<File name='seeds/country_codes.csv'>

```text
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
...
```

</File>

2. Выполните команду `dbt seed`
3. Ссылайтесь на модель в последующей модели

<File name='models/something.sql'>

```sql
select * from {{ ref('country_codes') }}
```

</File>