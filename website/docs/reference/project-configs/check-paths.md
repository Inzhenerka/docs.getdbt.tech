---
datatype: [directorypath]
default_value: [checks]
availability:
  engine: v2
---

<File name='dbt_project.yml'>

```yml
check-paths: [directorypath]
```

</File>

## Определение

Укажите пользовательские каталоги, в которых dbt ищет [проверки](/docs/build/checks).

## Значение по умолчанию

По умолчанию dbt ищет проверки в каталоге `checks`.

<File name='dbt_project.yml'>

```yml
check-paths: ["checks"]
```

</File>

## Примеры

Используйте подкаталог с именем `project_rules` вместо `checks`:

<File name='dbt_project.yml'>

```yml
check-paths: ["project_rules"]
```

</File>

Используйте несколько каталогов:

<File name='dbt_project.yml'>

```yml
check-paths: ["checks", "shared_checks"]
```

</File>
