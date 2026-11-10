---
title: "Вставка полных URL вместо идентификаторов"
sidebar_label: "Вставка полных URL вместо идентификаторов"
description: "Устранение неполадок: вставка полных URL вместо идентификаторов"
id: mcp-troubleshoot-urls-vs-ids
---

**Симптомы:** Ошибки аутентификации, непредвиденное поведение или невозможность подключения сервера к нужной среде.

**Причина:** Переменные среды, такие как `DBT_PROD_ENV_ID`, `DBT_USER_ID` и `DBT_ACCOUNT_ID`, принимают целые числа, а не полные URL из браузера.

**Решение:**

```bash
# ✅ Правильно
DBT_HOST=cloud.getdbt.com            # https://cloud.getdbt.com тоже работает
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Неправильно — идентификаторы должны быть числами, а не полными URL
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```

Пошаговые инструкции приведены в разделе [Как найти свои идентификаторы](/docs/dbt-ai/mcp-find-ids).
