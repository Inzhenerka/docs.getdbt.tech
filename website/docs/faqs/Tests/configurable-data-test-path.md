---
title: Могу ли я хранить data tests в каталоге, отличном от `tests` в моём проекте?
description: "Где хранить data tests в каталоге проекта"
sidebar_label: 'Как назвать каталог для data tests'
id: configurable-data-test-path

---
По умолчанию dbt ожидает, что файлы **singular data tests** будут располагаться в подкаталоге `tests` вашего проекта, а определения **generic data tests** — в `tests/generic` или в `macros`.

Чтобы изменить это поведение, обновите конфигурацию [test-paths](reference/project-configs/test-paths.md) 
в файле `dbt_project.yml`, например, так:

<File name='dbt_project.yml'>

```yml
test-paths: ["my_cool_tests"]
```

</File>

После этого вы сможете определять **generic data tests** в каталоге `my_cool_tests/generic/`, а **singular data tests** — в любом другом месте внутри `my_cool_tests/`.
