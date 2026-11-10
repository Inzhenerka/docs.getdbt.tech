---
datatype: [directorypath]
default_value: [OSI]
---

<VersionCallout version="1.12" />

<File name='dbt_project.yml'>

```yml
osi-paths: [directorypath]
```

</File>

## Определение

При необходимости укажите собственный список каталогов, в которых находятся [документы семантического слоя Apache Ossie](/docs/build/ossie-semantic-models).

## Значение по умолчанию

По умолчанию dbt ищет документы Ossie в каталоге `OSI`, например: `osi-paths: ["OSI"]`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath
path="osi-paths"
absolute="/Users/username/project/OSI"
/>

- ✅ **Правильно**
  - Используйте относительный путь:
    ```yml
    osi-paths: ["OSI"]
    ```

- ❌ **Неправильно:**
  - Избегайте абсолютных путей:
    ```yml
    osi-paths: ["/Users/username/project/OSI"]
    ```

## Примеры

Используйте подкаталог с именем `semantic_interchange` вместо `OSI`:

<File name='dbt_project.yml'>

```yml
osi-paths: ["semantic_interchange"]
```

</File>

Используйте несколько каталогов для организации документов Ossie:

<File name='dbt_project.yml'>

```yml
osi-paths: ["OSI", "external_osi"]
```

</File>
