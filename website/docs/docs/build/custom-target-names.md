---
title: "Пользовательские имена целей"
id: "custom-target-names"
description: "Вы можете определить пользовательское имя target для любой задачи <Constant name=\"cloud\" />, чтобы оно соответствовало настройкам в вашем dbt‑проекте."
pagination_next: null
availability: all_users
---

## dbt Scheduler {#dbt-scheduler}

Вы можете задать собственное имя целевого окружения (target) для любого задания <Constant name="dbt" />, чтобы оно соответствовало настройкам вашего проекта dbt. Это полезно, если в вашем проекте dbt есть логика, которая работает по-разному в зависимости от указанного целевого окружения, например:

```sql
select *
from a_big_table

-- ограничить количество запрашиваемых данных в dev
{% if target.name != 'prod' %}
where created_at > date_trunc('month', current_date)
{% endif %}
```

Чтобы задать пользовательское имя целевого окружения для задания в <Constant name="dbt" />, настройте поле **Target Name** для этого задания на странице настроек задания (Job Settings).

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/jobs-settings-target-name.png" title="Переопределение имени целевого окружения на 'prod'"/>

## IDE dbt Studio
При разработке в <Constant name="dbt" /> вы можете задать пользовательское имя целевого окружения в своих учётных данных. Нажмите на имя своей учётной записи над значком профиля на левой панели, выберите **Account settings**, затем перейдите в раздел **Credentials**. Выберите проект, для которого нужно обновить имя целевого окружения.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/development-credentials.png" title="Переопределение имени целевого окружения на 'dev'"/>
