---
title: Могу ли я хранить свои тесты в директории, отличной от директории `tests` в моем проекте?
description: "Где хранить тесты в директории"
sidebar_label: 'Как назвать директорию с тестами'
id: configurable-data-test-path

---
По умолчанию dbt ожидает, что ваши отдельные файлы тестов будут находиться в подпапке `tests` вашего проекта, а определения общих тестов — в `tests/generic` или `macros`.

Чтобы изменить это, обновите конфигурацию [test-paths](reference/project-configs/test-paths.md) в вашем файле `dbt_project.yml`, как показано ниже:

<File name='dbt_project.yml'>

```yml
test-paths: ["my_cool_tests"]
```

</File>

После этого вы можете определять общие тесты в `my_cool_tests/generic/`, а отдельные тесты — в любой другой папке внутри `my_cool_tests/`.