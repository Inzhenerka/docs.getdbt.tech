---
title: "Analyses"
description: "Настройка SQL-файлов в dbt для создания скомпилированного кода, используемого для аналитических задач."
id: "analyses"
pagination_next: null
---

## Обзор

Концепция `models` в dbt упрощает для команд работы с данными контроль версий и совместную работу над преобразованиями данных. Однако иногда определенное SQL-выражение не совсем вписывается в структуру модели dbt. Эти более "аналитические" SQL-файлы могут быть версионированы внутри вашего проекта dbt с использованием функциональности `analysis`.

Любые `.sql` файлы, найденные в директории `analyses/` проекта dbt, будут скомпилированы, но не выполнены. Это означает, что аналитики могут использовать функциональность dbt, такую как `{{ ref(...) }}`, для выбора моделей в независимой от окружения манере.

На практике файл анализа может выглядеть следующим образом (на примере [моделей Quickbooks с открытым исходным кодом](https://github.com/dbt-labs/quickbooks)):

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

Затем найдите скомпилированный SQL‑файл в `target/compiled/{project name}/analyses/running_total_by_account.sql`. Этот SQL, например, можно вставить в инструмент визуализации данных. Обратите внимание, что в базе данных не будет материализовано никакое отношение `running_total_by_account`, поскольку это `analysis`, а не `model`.
