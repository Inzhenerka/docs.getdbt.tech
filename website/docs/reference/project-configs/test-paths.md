---
datatype: [directorypath]
default_value: [test]
---

<File name='dbt_project.yml'>

```yml
test-paths: [directorypath]
```

</File>

## Определение {#definition}

При необходимости укажите пользовательский список директорий, где находятся [единичные тесты](/docs/build/data-tests#singular-data-tests) и [пользовательские общие тесты](/docs/build/data-tests#generic-data-tests).

## По умолчанию {#default}
Если не указывать эту настройку, dbt будет искать тесты в директории `tests`, то есть `test-paths: ["tests"]`. В частности, он будет искать файлы `.sql`, содержащие:
- Определения общих тестов в поддиректории `tests/generic`
- Единичные тесты (все остальные файлы)

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="test-paths"
absolute="/Users/username/project/test"
/>

- ✅ **Рекомендуется**
  - Использовать относительный путь:
    ```yml
    test-paths: ["test"]
    ```

- ❌ **Не рекомендуется:**
  - Избегать абсолютных путей:
    ```yml
    test-paths: ["/Users/username/project/test"]
    ```

## Примеры {#examples}
### Используйте поддиректорию с именем `custom_tests` вместо `tests` для тестов данных {#use-a-subdirectory-named-custom_tests-instead-of-tests-for-data-tests}

<File name='dbt_project.yml'>

```yml
test-paths: ["custom_tests"]
```

</File>