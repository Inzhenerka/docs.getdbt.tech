---
title: "Конфигурации переменных окружения"
id: "environment-variable-configs"
sidebar: "Конфигурации переменных окружения"
---

Переменные окружения содержат префикс `DBT_`. Для получения списка всех переменных окружения dbt, которые вы можете установить, обратитесь к [Доступные флаги](/reference/global-configs/about-global-configs#available-flags).

<File name='Env var'>

```text

$ export DBT_<THIS-CONFIG>=True
dbt run

```

</File>

Для получения более подробной информации ознакомьтесь с нашей страницей [environment variables page](/docs/build/environment-variables).

## Приоритет конфигурации

import SettingFlags from '/snippets/_setting-flags.md';

<SettingFlags />
