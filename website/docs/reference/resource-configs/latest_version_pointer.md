---
title: latest_version_pointer
description: "Используйте latest_version_pointer для автоматического создания представления, указывающего на последнюю версию модели с версионированием."
id: "latest_version_pointer"
resource_types: [models]
datatype: "{<dictionary>}"
---

import LatestVersionPointerCollision from '/snippets/_latest-version-pointer-collision.md';

<VersionCallout version="1.12" />

# latest_version_pointer

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация SQL', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)latest_version_pointer:
      enabled: true | false
      alias: <string>
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/schema.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      latest_version_pointer:
        enabled: true | false
        alias: <string>
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```sql
{{ config(
    latest_version_pointer={
        "enabled": true | false,
        "alias": "<string>"
    }
) }}
```

</File>

</TabItem>

</Tabs>

## Определение

:::note Платформа dbt на базе <Constant name="fusion" />

В <Constant name="fusion" /> параметр `latest_version_pointer` включён по умолчанию для всех моделей с версионированием. Если у модели с версионированием явно задан `alias`, совпадающий с базовым именем модели, может возникнуть ошибка конфликта имён `dbt1005`. Способы её устранения описаны ниже в разделе [Конфликты имён](#naming-collisions).

:::

Параметр `latest_version_pointer` создаёт представление с базовым именем [модели с версионированием](/docs/mesh/govern/model-versions) (например, `dim_customers`), которое всегда указывает на объект базы данных, соответствующий последней версии (например, `dim_customers_v2`). Представление создаётся после успешной материализации модели с `is_latest_version = true`; для всех остальных версий его создание пропускается.

Вы также можете включить эту функцию глобально для всех моделей с версионированием, установив флаг [`latest_version_pointer_enabled_by_default`](/reference/global-configs/behavior-flags/latest_version_pointer_enabled_by_default) в значение `true` в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  latest_version_pointer_enabled_by_default: true
```

</File>

`latest_version_pointer` принимает два необязательных вложенных ключа для настройки отдельных моделей:

| Ключ | Тип | Значение по умолчанию | Описание |
|-----|------|---------|-------------|
| `enabled` | boolean | — | Включает или отключает представление-указатель для этой модели. Если задан, переопределяет флаг проекта `latest_version_pointer_enabled_by_default`; если не задан, используется значение этого флага. |
| `alias` | string | Базовое имя модели | Пользовательское имя представления-указателя. Переопределяет базовое имя, используемое по умолчанию. Подробнее см. в разделе [Настройка псевдонима](#alias-customization).|

## Настройка псевдонима {#alias-customization}

По умолчанию представление-указатель использует базовое имя модели (например, `dim_customers`). Это можно изменить двумя способами:

- **Для отдельной модели**: задайте `latest_version_pointer.alias` в конфигурации модели.
- **Глобально**: переопределите макрос [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias) в своём проекте. Этот макрос работает по тому же принципу, что и [`generate_alias_name`](/docs/build/custom-aliases#generate_alias_name).

## Конфликты имён {#naming-collisions}

<LatestVersionPointerCollision />

## Связанная документация

- [Версии моделей](/docs/mesh/govern/model-versions)
- [Указание на последнюю версию](/docs/mesh/govern/model-versions#pointing-to-the-latest-version)
- [Флаг `latest_version_pointer_enabled_by_default`](/reference/global-configs/behavior-flags/latest_version_pointer_enabled_by_default)
- [`versions`](/reference/resource-properties/versions)
- [`latest_version`](/reference/resource-properties/latest_version)
