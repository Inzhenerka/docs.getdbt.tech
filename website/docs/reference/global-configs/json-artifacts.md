---
title: "JSON артефакты"
id: "json-artifacts"
sidebar: "JSON артефакты"
---

### Запись JSON артефактов {#write-json-artifacts}

Конфигурация `WRITE_JSON` определяет, будет ли dbt записывать [JSON артефакты](/reference/artifacts/dbt-artifacts) (например, `manifest.json`, `run_results.json`) в директорию `target/`. Сериализация в JSON может быть медленной, и отключение этого флага _может_ ускорить выполнение dbt. Кроме того, вы можете отключить эту настройку, чтобы выполнить операцию dbt и избежать перезаписи артефактов от предыдущего шага выполнения.

<File name='Usage'>

```text
dbt run --no-write-json 
```

</File>

### Путь к целевой директории {#target-path}

По умолчанию dbt записывает JSON-артефакты и скомпилированные SQL-файлы в каталог с именем `target/`. Путь к этому каталогу определяется относительно расположения файла `dbt_project.yml` активного проекта.

Как и другие глобальные настройки, эти значения можно переопределить для вашей среды или отдельного запуска с помощью параметра командной строки (`--target-path`) или переменных окружения (<VersionBlock lastVersion="1.10">`DBT_TARGET_PATH`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_TARGET_PATH`</VersionBlock>).
