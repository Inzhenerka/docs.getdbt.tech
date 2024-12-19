---
title: "Анализы"
description: "Прочитайте этот учебник, чтобы узнать, как использовать пользовательские анализы при работе с dbt."
id: "analyses"
pagination_next: null
---

## Обзор

Понятие `models` в dbt упрощает командам по работе с данными контроль версий и совместную работу над преобразованиями данных. Однако иногда определенное SQL-выражение не совсем подходит под определение модели dbt. Эти более "аналитические" SQL-файлы могут быть версионированы внутри вашего проекта dbt с помощью функциональности `analysis`.

Любые `.sql` файлы, найденные в директории `analyses/` проекта dbt, будут скомпилированы, но не выполнены. Это означает, что аналитики могут использовать функциональность dbt, такую как `{{ ref(...) }}`, для выбора из моделей независимо от среды.

На практике файл анализа может выглядеть следующим образом (по материалам [open source моделей Quickbooks](https://github.com/dbt-labs/quickbooks)):

<File name='analyses/running_total_by_account.sql'>

```sql
-- analyses/running_total_by_account.sql

with journal_entries as (

  select *
  from {{ ref('quickbooks_adjusted_journal_entries') }}

), accounts as (

  select *
  from {{ ref('quickbooks_accounts_transformed') }}

)

select
  txn_date,
  account_id,
  adjusted_amount,
  description,
  account_name,
  sum(adjusted_amount) over (partition by account_id order by id rows unbounded preceding)
from journal_entries
order by account_id, id
```

</File>

Чтобы скомпилировать этот анализ в исполняемый SQL, выполните:
```
dbt compile
```

Затем найдите скомпилированный SQL-файл в `target/compiled/{project name}/analyses/running_total_by_account.sql`. Этот SQL затем можно вставить в инструмент визуализации данных, например. Обратите внимание, что никакая связь `running_total_by_account` не будет материализована в базе данных, так как это `analysis`, а не `model`.