---
datatype: [directorypath]
description: "Прочитайте это руководство, чтобы понять конфигурацию snapshot-paths в dbt."
default_value: [snapshots]
---
<File name='dbt_project.yml'>

```yml
snapshot-paths: [directorypath]
```

</File>

## Определение

Опционально укажите пользовательский список директорий, в которых находятся [snapshots](/docs/build/snapshots).

<VersionBlock firstVersion="1.9">
В dbt Core v1.9+ вы можете размещать ваши snapshots вместе с моделями, если они [определены с использованием последнего синтаксиса YAML](/docs/build/snapshots).
</VersionBlock>

<VersionBlock lastVersion="1.8">
Обратите внимание, что вы не можете размещать модели и snapshots вместе. Однако в dbt Core v1.9+ вы можете размещать ваши snapshots вместе с моделями, если они [определены с использованием последнего синтаксиса YAML](/docs/build/snapshots).
</VersionBlock>

## Значение по умолчанию
По умолчанию dbt будет искать snapshots в директории `snapshots`. Например, `snapshot-paths: ["snapshots"]`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="snapshot-paths"
absolute="/Users/username/project/snapshots"
/>

- ✅ **Делайте**
  - Используйте относительный путь:
    ```yml
    snapshot-paths: ["snapshots"]
    ```

- ❌ **Не делайте:**
  - Избегайте абсолютных путей:
    ```yml
    snapshot-paths: ["/Users/username/project/snapshots"]
    ```

## Примеры
### Используйте подкаталог с именем `archives` вместо `snapshots`

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["archives"]
```

</File>