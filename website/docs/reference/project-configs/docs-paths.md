---
datatype: [directorypath]
description: "Прочтите это руководство, чтобы понять конфигурацию docs-paths в dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
docs-paths: [directorypath]
```

</File>

## Определение
При необходимости укажите пользовательский список директорий, где расположены [блоки документации](/docs/build/documentation#docs-blocks).

## Значение по умолчанию

<VersionBlock firstVersion="1.9">

По умолчанию dbt будет искать блоки документации во всех путях ресурсов (например, в объединенном списке [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [test-paths](/reference/project-configs/test-paths), [macro-paths](/reference/project-configs/macro-paths) и [snapshot-paths](/reference/project-configs/snapshot-paths)). Если эта опция настроена, dbt будет искать блоки документации _только_ в указанной директории.

</VersionBlock>

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="docs-paths"
absolute="/Users/username/project/docs"
/>

- ✅ **Следует**
  - Использовать относительный путь:
    ```yml
    docs-paths: ["docs"]
    ```

- ❌ **Не следует**
  - Избегать абсолютных путей:
    ```yml
    docs-paths: ["/Users/username/project/docs"]
    ```

## Пример

Используйте поддиректорию с именем `docs` для блоков документации:

<File name='dbt_project.yml'>

```yml
docs-paths: ["docs"]
```

</File>

**Примечание:** Обычно мы опускаем эту конфигурацию, так как предпочитаем поведение dbt по умолчанию.