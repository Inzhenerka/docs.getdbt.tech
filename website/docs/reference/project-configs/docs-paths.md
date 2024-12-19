---
datatype: [directorypath]
description: "Прочитайте это руководство, чтобы понять конфигурацию docs-paths в dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
docs-paths: [directorypath]
```

</File>

## Определение
Необязательно указывать пользовательский список директорий, в которых находятся [docs blocks](/docs/build/documentation#docs-blocks).

## По умолчанию

<VersionBlock firstVersion="1.9">

По умолчанию dbt будет искать docs blocks во всех ресурсных путях (например, в объединенном списке [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [test-paths](/reference/project-configs/test-paths), [macro-paths](/reference/project-configs/macro-paths) и [snapshot-paths](/reference/project-configs/snapshot-paths)). Если эта опция настроена, dbt будет _только_ искать в указанной директории для docs blocks.

</VersionBlock>

<VersionBlock lastVersion="1.8">

По умолчанию dbt будет искать docs blocks во всех ресурсных путях (т.е. в объединенном списке [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [macro-paths](/reference/project-configs/macro-paths) и [snapshot-paths](/reference/project-configs/snapshot-paths)). Если эта опция настроена, dbt будет _только_ искать в указанной директории для docs blocks.

</VersionBlock>

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="docs-paths"
absolute="/Users/username/project/docs"
/>

- ✅ **Делайте**
  - Используйте относительный путь:
    ```yml
    docs-paths: ["docs"]
    ```

- ❌ **Не делайте**
  - Избегайте абсолютных путей:
    ```yml
    docs-paths: ["/Users/username/project/docs"]
    ```

## Пример

Используйте подкаталог с именем `docs` для docs blocks:

<File name='dbt_project.yml'>

```yml
docs-paths: ["docs"]
```

</File>

**Примечание:** Обычно мы опускаем эту конфигурацию, так как предпочитаем поведение по умолчанию от dbt.