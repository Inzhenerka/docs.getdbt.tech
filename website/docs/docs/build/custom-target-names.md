---
title: "Пользовательские имена целей"
id: "custom-target-names"
description: "Вы можете определить пользовательское имя цели для любой задачи в dbt Cloud, чтобы оно соответствовало настройкам в вашем проекте dbt."
pagination_next: null
---

## Планировщик dbt Cloud

Вы можете определить пользовательское имя цели для любой задачи в dbt Cloud, чтобы оно соответствовало настройкам в вашем проекте dbt. Это полезно, если в вашем проекте dbt есть логика, которая ведет себя по-разному в зависимости от указанной цели, например:

```sql
select *
from a_big_table

-- ограничить количество запрашиваемых данных в dev
{% if target.name != 'prod' %}
where created_at > date_trunc('month', current_date)
{% endif %}
```

Чтобы установить пользовательское имя цели для задачи в dbt Cloud, настройте поле **Target Name** для вашей задачи на странице настроек задачи.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/jobs-settings-target-name.png" title="Переопределение имени цели на 'prod'"/>

## IDE dbt Cloud
При разработке в dbt Cloud вы можете установить пользовательское имя цели в ваших учетных данных для разработки. Нажмите на ваше имя аккаунта над значком профиля в левой панели, выберите **Account settings**, затем перейдите в **Credentials**. Выберите проект, чтобы обновить имя цели.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/development-credentials.png" title="Переопределение имени цели на 'dev'"/>