---
datatype: [directorypath]
default_value: [test]
---

<File name='dbt_project.yml'>

```yml
test-paths: [directorypath]
```

</File>

## Определение

При желании можно указать собственный список директорий, в которых находятся [сингл-тесты](/docs/build/data-tests#singular-data-tests) и [пользовательские общие тесты](/docs/build/data-tests#generic-data-tests).

## По умолчанию
Если эта конфигурация не указана, dbt будет искать тесты в директории `tests`, т.е. `test-paths: ["tests"]`. В частности, он будет искать файлы с расширением `.sql`, содержащие:
- Определения общих тестов в поддиректории `tests/generic`
- Сингл-тесты (все остальные файлы)

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="test-paths"
absolute="/Users/username/project/test"
/>

- ✅ **Делайте**
  - Используйте относительный путь:
    ```yml
    test-paths: ["test"]
    ```

- ❌ **Не делайте:**
  - Избегайте абсолютных путей:
    ```yml
    test-paths: ["/Users/username/project/test"]
    ```

## Примеры
### Используйте поддиректорию с именем `custom_tests` вместо `tests` для тестов данных

<File name='dbt_project.yml'>

```yml
test-paths: ["custom_tests"]
```

</File>