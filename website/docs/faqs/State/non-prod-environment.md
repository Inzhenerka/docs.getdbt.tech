---
title: Что делать, если моя среда prod называется не prod?
description: "Узнайте, как указать пользовательскую среду для перенаправления ссылок в dbt State."
sidebar_label: "Что делать, если моя среда prod называется не prod?"
id: non-prod-environment
---

Вы можете указать среду для перенаправления ссылок с помощью настройки [`defer_to_target`](/reference/resource-configs/defer-to-target) в `profiles.yml`:

```yaml
my_project:
  outputs:
    prod:
      type: snowflake
      defer_to_target: production
```

`defer_to_target` применяется только к самостоятельно управляемым развертываниям. Если вы используете платформу dbt, перенаправление ссылок настраивается в параметрах среды в пользовательском интерфейсе. Подробнее см. в разделе [Настройка перенаправления ссылок](/docs/deploy/dbt-state-deferral).
