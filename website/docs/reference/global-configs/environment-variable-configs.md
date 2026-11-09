---
title: "Конфигурации переменных окружения"
id: "environment-variable-configs"
sidebar: "Конфигурации переменных окружения"
---

<VersionBlock lastVersion="1.10">

Переменные окружения содержат префикс `DBT_`. Список всех переменных окружения dbt, которые можно задать, приведён в разделе [Доступные флаги](/reference/global-configs/about-global-configs#available-flags).

<File name='Env var'>

```text

$ export DBT_<THIS-CONFIG>=True
dbt run

```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.11">

Переменные окружения используют префикс `DBT_ENGINE_`. Список всех переменных окружения dbt, которые можно задать, приведён в разделе [Доступные флаги](/reference/global-configs/about-global-configs#available-flags).

<File name='Переменная окружения'>

```text

$ export DBT_ENGINE_<THIS-CONFIG>=True
dbt run

```

</File>

</VersionBlock>

Более подробную информацию см. на нашей [странице о переменных окружения](/docs/build/environment-variables).

## Приоритет конфигурации {#config-precedence}

import SettingFlags from '/snippets/_setting-flags.md';

<SettingFlags />
