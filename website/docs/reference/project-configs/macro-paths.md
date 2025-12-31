---
datatype: directorypath
description: "Прочтите это руководство, чтобы понять конфигурацию macro-paths в dbt."
default_value: [macros]
---

<File name='dbt_project.yml'>

```yml
macro-paths: [directorypath]
```

</File>

## Определение {#definition}
При необходимости укажите пользовательский список директорий, в которых находятся [макросы](/docs/build/jinja-macros#macros). Обратите внимание, что вы не можете размещать модели и макросы в одной и той же директории.

## Значение по умолчанию {#default}
По умолчанию dbt будет искать макросы в директории с именем `macros`. Например, `macro-paths: ["macros"]`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="macro-paths"
absolute="/Users/username/project/macros"
/>

- ✅ **Рекомендуется**
  - Использовать относительный путь:
    ```yml
    macro-paths: ["macros"]
    ```

- ❌ **Не рекомендуется:**
  - Избегать абсолютных путей:
    ```yml
    macro-paths: ["/Users/username/project/macros"]
    ```

## Примеры {#examples}
### Использование поддиректории с именем `custom_macros` вместо `macros` {#use-a-subdirectory-named-custom_macros-instead-of-macros}

<File name='dbt_project.yml'>

```yml
macro-paths: ["custom_macros"]
```

</File>