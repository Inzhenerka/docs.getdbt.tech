---
datatype: [directorypath]
description: "Прочтите это руководство, чтобы понять конфигурацию analysis-paths в dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
analysis-paths: [directorypath]
```

</File>

## Определение {#definition}
Укажите пользовательский список директорий, где находятся [аналитические файлы](/docs/build/analyses).

## По умолчанию {#default}
Если не указать эту конфигурацию, dbt не будет компилировать файлы `.sql` как аналитические.

Однако, команда [`dbt init`](/reference/commands/init) заполняет это значение как `analyses` ([источник](https://github.com/dbt-labs/dbt-starter-project/blob/HEAD/dbt_project.yml#L15)).

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="analysis-paths"
absolute="/Users/username/project/analyses"
/>

- ✅ **Следует** 
  - Использовать относительный путь:
    ```yml
    analysis-paths: ["analyses"]
    ```

- ❌ **Не следует** 
  - Избегать абсолютных путей:
    ```yml
    analysis-paths: ["/Users/username/project/analyses"]
    ```

## Примеры {#examples}
### Использование поддиректории с именем `analyses` {#use-a-subdirectory-named-analyses}
Это значение заполняется командой [`dbt init`](/reference/commands/init).

<File name='dbt_project.yml'>

```yml
analysis-paths: ["analyses"]
```

</File>

### Использование поддиректории с именем `custom_analyses` {#use-a-subdirectory-named-custom_analyses}

<File name='dbt_project.yml'>

```yml
analysis-paths: ["custom_analyses"]
```

</File>