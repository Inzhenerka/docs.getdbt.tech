---
title: .dbtignore
---

Вы можете создать файл `.dbtignore` в корневой директории вашего [проекта dbt](/docs/build/projects), чтобы указать файлы, которые должны быть **полностью** проигнорированы dbt. Этот файл ведет себя как [файл `.gitignore`, используя тот же синтаксис](https://git-scm.com/docs/gitignore). Файлы и подкаталоги, соответствующие шаблону, не будут читаться, анализироваться или каким-либо образом обнаруживаться dbt — как будто их не существует.

**Примеры**

<File name=".dbtignore">

```md
# .dbtignore

# игнорировать отдельные .py файлы
not-a-dbt-model.py
another-non-dbt-model.py

# игнорировать все .py файлы
**.py

# игнорировать все .py файлы с "codegen" в названии
*codegen*.py

# игнорировать все папки в директории
path/to/folders/**

# игнорировать некоторые папки в директории
path/to/folders/subfolder/**

```

</File>