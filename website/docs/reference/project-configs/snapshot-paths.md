---
datatype: [directorypath]
description: "Прочтите это руководство, чтобы понять конфигурацию snapshot-paths в dbt."
default_value: [snapshots]
---
<File name='dbt_project.yml'>

```yml
snapshot-paths: [directorypath]
```

</File>

## Определение {#definition}

При необходимости укажите пользовательский список директорий, где находятся [снимки](/docs/build/snapshots).

<VersionBlock firstVersion="1.9">
В <Constant name="core" /> v1.9+ вы можете размещать снапшоты вместе с моделями, если они [определены с использованием последнего синтаксиса YAML](/docs/build/snapshots). 
</VersionBlock>

## По умолчанию {#default}
По умолчанию dbt будет искать снимки в директории `snapshots`. Например, `snapshot-paths: ["snapshots"]`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="snapshot-paths"
absolute="/Users/username/project/snapshots"
/>

- ✅ **Рекомендуется**
  - Использовать относительный путь:
    ```yml
    snapshot-paths: ["snapshots"]
    ```

- ❌ **Не рекомендуется:**
  - Избегать абсолютных путей:
    ```yml
    snapshot-paths: ["/Users/username/project/snapshots"]
    ```

## Примеры {#examples}
### Использование поддиректории с именем `archives` вместо `snapshots` {#use-a-subdirectory-named-archives-instead-of-snapshots}

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["archives"]
```

</File>