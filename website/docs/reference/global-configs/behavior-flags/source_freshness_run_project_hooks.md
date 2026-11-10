---
title: "Хуки проекта при проверке актуальности источников"
id: "source_freshness_run_project_hooks"
sidebar_label: "Хуки проекта при проверке актуальности источников"
---

:::caution Удалён в v2

Этот флаг удалён в v2. Новое поведение теперь включено всегда. При обновлении удалите этот флаг из файла `dbt_project.yml`.

:::

| source_freshness_run_project_hooks | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Впервые доступен | 2024.03 | 1.8.0 |
| Стабилизирован (по умолчанию → `true`) | 2025.05 | 1.10.0 |
| Удалён | — | v2.0 |

Хуки проекта ([`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end)) теперь по умолчанию выполняются при запуске команды `dbt source freshness`. Ранее хуки не выполнялись при запуске `dbt source freshness`.

Если у вас есть хуки, которые не должны выполняться до или после `dbt source freshness`, добавьте проверку условия:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - "{{ ... if flags.WHICH != 'freshness' }}"
```

</File>
