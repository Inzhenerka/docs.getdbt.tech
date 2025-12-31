---
datatype: [directorypath]
default_value: [models]
---

<File name='dbt_project.yml'>

```yml
model-paths: [directorypath]
```

</File>

## Определение {#definition}
При необходимости укажите пользовательский список директорий, где находятся [модели](/docs/build/models), [источники](/docs/build/sources) и [модульные тесты](/docs/build/unit-tests).

## По умолчанию {#default}
По умолчанию dbt будет искать модели и источники в директории `models`. Например, `model-paths: ["models"]`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="model-paths"
absolute="/Users/username/project/models"
/>

- ✅ **Рекомендуется**
  - Использовать относительный путь:
    ```yml
    model-paths: ["models"]
    ```

- ❌ **Не рекомендуется:**
  - Избегать абсолютных путей:
    ```yml
    model-paths: ["/Users/username/project/models"]
    ```

## Примеры {#examples}
### Использование поддиректории с именем `transformations` вместо `models` {#use-a-subdirectory-named-transformations-instead-of-models}

<File name='dbt_project.yml'>

```yml
model-paths: ["transformations"]
```

</File>