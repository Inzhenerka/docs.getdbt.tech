---
datatype: [directorypath]
description: "Прочитайте это руководство, чтобы разобраться в настройке skill-paths в dbt."
default_value: [skills]
---

<File name='dbt_project.yml'>

```yml
skill-paths: [directorypath]
```

</File>

## Определение

При необходимости укажите собственный список каталогов, в которых находятся [навыки агентов](/docs/dbt-ai/package-skills).

Каждый подкаталог, содержащий файл `SKILL.md`, считается отдельным навыком. При установке пакетов dbt сканирует каталоги, указанные в `skill-paths`, в корневом проекте и в каждом установленном пакете.

## Значение по умолчанию

По умолчанию dbt ищет навыки в каталоге с именем `skills` в корне вашего проекта.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="skill-paths"
absolute="/Users/username/project/skills"
/>

- ✅ **Правильно**
  - Используйте относительный путь:
    ```yml
    skill-paths: ["skills"]
    ```

- ❌ **Неправильно**
  - Избегайте абсолютных путей:
    ```yml
    skill-paths: ["/Users/username/project/skills"]
    ```

## Примеры

### Использование подкаталога с именем `agent-skills` для навыков

<File name='dbt_project.yml'>

```yml
skill-paths: ["agent-skills"]
```

</File>

### Использование нескольких каталогов для навыков

<File name='dbt_project.yml'>

```yml
skill-paths: ["skills", "team-skills"]
```

</File>
