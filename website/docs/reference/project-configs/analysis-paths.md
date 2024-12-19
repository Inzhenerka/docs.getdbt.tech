---
datatype: [directorypath]
description: "Прочитайте это руководство, чтобы понять конфигурацию analysis-paths в dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
analysis-paths: [directorypath]
```

</File>

## Определение
Укажите пользовательский список директорий, в которых находятся [анализы](/docs/build/analyses).

## По умолчанию
Если не указать эту конфигурацию, dbt не будет компилировать файлы `.sql` как анализы.

Тем не менее, команда [`dbt init`](/reference/commands/init) заполняет это значение как `analyses` ([источник](https://github.com/dbt-labs/dbt-starter-project/blob/HEAD/dbt_project.yml#L15)).

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="analysis-paths"
absolute="/Users/username/project/analyses"
/>

- ✅ **Делайте** 
  - Используйте относительный путь:
    ```yml
    analysis-paths: ["analyses"]
    ```

- ❌ **Не делайте** 
  - Избегайте абсолютных путей:
    ```yml
    analysis-paths: ["/Users/username/project/analyses"]
    ```

## Примеры
### Используйте подкаталог с именем `analyses`
Это значение, заполненное командой [`dbt init`](/reference/commands/init).

<File name='dbt_project.yml'>

```yml
analysis-paths: ["analyses"]
```

</File>

### Используйте подкаталог с именем `custom_analyses`

<File name='dbt_project.yml'>

```yml
analysis-paths: ["custom_analyses"]
```

</File>