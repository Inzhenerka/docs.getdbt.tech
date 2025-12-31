---
datatype: [directorypath]
description: "Прочтите это руководство, чтобы понять конфигурацию asset-paths в dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
asset-paths: [directorypath]
```

</File>

## Определение {#definition}
При необходимости укажите пользовательский список директорий, которые нужно скопировать в директорию `target` как часть команды `docs generate`. Это полезно для отображения изображений из вашего репозитория в документации вашего проекта.

## По умолчанию {#default}

По умолчанию dbt не будет копировать дополнительные файлы как часть docs generate. Например, `asset-paths: []`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="asset-paths"
absolute="/Users/username/project/assets"
/>

- ✅ **Рекомендуется**
  - Используйте относительный путь:
    ```yml
    asset-paths: ["assets"]
    ```

- ❌ **Не рекомендуется**
  - Избегайте абсолютных путей:
    ```yml
    asset-paths: ["/Users/username/project/assets"]
    ```

## Примеры {#examples}
### Компиляция файлов в поддиректории `assets` как часть `docs generate` {#compile-files-in-the-assets-subdirectory-as-part-of-docs-generate}

<File name='dbt_project.yml'>

```yml
asset-paths: ["assets"]
```

</File>

Любые файлы, включенные в эту директорию, будут скопированы в директорию `target/` как часть `dbt docs generate`, что сделает их доступными как изображения в документации вашего проекта.

Ознакомьтесь с полным описанием включения изображений в ваши описания [здесь](/reference/resource-properties/description/#include-an-image-from-your-repo-in-your-descriptions).