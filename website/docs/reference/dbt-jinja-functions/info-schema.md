---
title: "О макросе info_schema"
sidebar_label: "info_schema"
id: "info-schema-macro"
description: "Используйте макрос `info_schema()` для обращения к таблицам dbt Information Schema в проверках или с помощью dbt show --inline."
availability:
  engine: v2
---

`{{ info_schema('<view_name>') }}` — поддерживаемый способ обращения к таблицам [dbt Information Schema](/docs/build/dbt-information-schema) в [проверке](/docs/build/checks) или с помощью [`dbt show --inline`](/docs/build/dbt-information-schema#querying-with-dbt-show).

Когда вы передаёте имя представления, к которому хотите выполнить запрос (например, `{{ info_schema('models') }}`), макрос считывает данные из слоя логических представлений, созданного на этапе разбора.

Например, чтобы найти модели без описания:

```sql
select name
from {{ info_schema('models') }}
where description = ''
```

Полный список столбцов, доступных для каждого представления, см. в разделе [Столбцы, доступные для проверок](/reference/info-schema#columns-available-for-checks).

:::note
Проверки могут обращаться только к метаданным проекта, доступным на этапе разбора. Доступны только представления, все столбцы которых полностью заполнены на этом этапе. Если передать имя представления, которое не существует или недоступно на этапе разбора, проверка завершится ошибкой с сообщением, в котором перечислены доступные представления.
:::
