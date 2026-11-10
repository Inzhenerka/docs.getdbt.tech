---
title: "Имена ресурсов без пробелов"
id: "require_resource_names_without_spaces"
sidebar_label: "Имена ресурсов без пробелов"
---

:::caution Удалён в v2

Этот флаг удалён в v2. Новое поведение теперь включено всегда. При обновлении удалите этот флаг из файла `dbt_project.yml`.

:::

| require_resource_names_without_spaces | <Constant name="dbt" /> **Последняя версия v1** | <Constant name="core" /> |
|---|---|---|
| Добавлен | 2024.05 | 1.8.0 |
| Включён по умолчанию (значение по умолчанию → `true`) | 2025.05 | 1.10.0 |
| Удалён | — | v2.0 |

dbt выдаёт ошибку, если обнаруживает пробел в имени ресурса. Имена ресурсов должны содержать только буквы, цифры и символы подчёркивания.

dbt выдаёт предупреждение [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation), если обнаруживает пробел в имени ресурса. Когда этот флаг установлен в `true` (в v2 это поведение теперь включено всегда), dbt выдаёт ошибку вместо предупреждения.

<File name='models/model name with spaces.sql'>

```sql
-- This model file should be renamed to model_name_with_underscores.sql
```

</File>

См. также [`require_source_and_semantic_model_names_without_spaces`](/reference/global-configs/behavior-flags/require_source_and_semantic_model_names_without_spaces), который распространяет это поведение на имена источников и семантических моделей.
