---
title: "Пользовательские имена целей"
id: "custom-target-names"
description: "Вы можете определить пользовательское имя target для любой задачи <Constant name=\"cloud\" />, чтобы оно соответствовало настройкам в вашем dbt‑проекте."
pagination_next: null
---

## dbt Scheduler

Вы можете определить пользовательское имя target для любой задачи <Constant name="cloud" />, чтобы оно соответствовало настройкам в вашем dbt‑проекте. Это полезно, если в вашем dbt‑проекте есть логика, которая ведёт себя по‑разному в зависимости от указанного target, например:

```sql
select *
from a_big_table

-- ограничить количество запрашиваемых данных в dev
{% if target.name != 'prod' %}
where created_at > date_trunc('month', current_date)
{% endif %}
```

Чтобы задать собственное имя таргета для задания в <Constant name="cloud" />, настройте поле **Target Name** для вашего задания на странице настроек Job Settings.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/jobs-settings-target-name.png" title="Переопределение имени цели на 'prod'"/>

## dbt Studio IDE
При разработке в <Constant name="cloud" /> вы можете задать собственное имя target в своих учетных данных для разработки. Для этого нажмите на имя своей учетной записи над иконкой профиля в левой панели, выберите **Account settings**, затем перейдите в раздел **Credentials**. Выберите проект, для которого нужно обновить имя target.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/development-credentials.png" title="Переопределение имени цели на 'dev'"/>