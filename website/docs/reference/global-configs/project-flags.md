---
title: "Флаги проекта"
id: "project-flags"
sidebar: "Флаги проекта"
---

<File name='dbt_project.yml'>

```yaml

flags:
  <global_config>: <value>

```

</File>

Обратитесь к [таблице всех флагов](/reference/global-configs/about-global-configs#available-flags), чтобы увидеть, какие глобальные конфигурации доступны для установки в [`dbt_project.yml`](/reference/dbt_project.yml).

Словарь `flags` — это _единственное_ место, где вы можете отказаться от [изменений поведения](/reference/global-configs/behavior-changes), пока поддерживается устаревшее поведение.

## Config precedence

import SettingFlags from '/snippets/_setting-flags.md';

<SettingFlags />
