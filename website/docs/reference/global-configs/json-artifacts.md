---
title: "JSON артефакты"
id: "json-artifacts"
sidebar: "JSON артефакты"
---

### Запись JSON артефактов

Конфигурация `WRITE_JSON` определяет, будет ли dbt записывать [JSON артефакты](/reference/artifacts/dbt-artifacts) (например, `manifest.json`, `run_results.json`) в директорию `target/`. Сериализация в JSON может быть медленной, и отключение этого флага _может_ ускорить выполнение dbt. Кроме того, вы можете отключить эту настройку, чтобы выполнить операцию dbt и избежать перезаписи артефактов от предыдущего шага выполнения.

<File name='Usage'>

```text
dbt run --no-write-json 
```

</File>

### Путь к целевой директории

По умолчанию, dbt будет записывать JSON артефакты и скомпилированные SQL файлы в директорию с именем `target/`. Эта директория расположена относительно `dbt_project.yml` активного проекта.

Как и другие глобальные конфигурации, эти значения можно переопределить для вашей среды или вызова, используя опцию CLI (`--target-path`) или переменные окружения (`DBT_TARGET_PATH`).