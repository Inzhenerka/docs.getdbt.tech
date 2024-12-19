---
datatype: [directorypath]
description: "Прочитайте это руководство, чтобы понять конфигурацию asset-paths в dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
asset-paths: [directorypath]
```

</File>

## Определение
Опционально укажите пользовательский список каталогов для копирования в каталог `target` в рамках команды `docs generate`. Это полезно для отображения изображений из вашего репозитория в документации проекта.

## По умолчанию

По умолчанию dbt не будет копировать дополнительные файлы в рамках генерации документации. Например, `asset-paths: []`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="asset-paths"
absolute="/Users/username/project/assets"
/>

- ✅ **Делайте**
  - Используйте относительный путь:
    ```yml
    asset-paths: ["assets"]
    ```

- ❌ **Не делайте**
  - Избегайте абсолютных путей:
    ```yml
    asset-paths: ["/Users/username/project/assets"]
    ```

## Примеры
### Компиляция файлов в подкаталоге `assets` в рамках `docs generate`

<File name='dbt_project.yml'>

```yml
asset-paths: ["assets"]
```

</File>

Любые файлы, включенные в этот каталог, будут скопированы в каталог `target/` в рамках `dbt docs generate`, что сделает их доступными в качестве изображений в вашей документации проекта.

Посмотрите полное описание о том, как включать изображения в ваши описания [здесь](/reference/resource-properties/description/#include-an-image-from-your-repo-in-your-descriptions).