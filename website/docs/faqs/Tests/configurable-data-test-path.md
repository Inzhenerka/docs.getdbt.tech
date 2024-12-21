---
title: Могу ли я хранить свои тесты в каталоге, отличном от каталога `tests` в моем проекте?
description: "Где хранить тесты в каталоге"
sidebar_label: 'Как назвать каталог с тестами'
id: configurable-data-test-path

---
По умолчанию dbt ожидает, что ваши файлы с одиночными тестами будут находиться в подкаталоге `tests` вашего проекта, а определения общих тестов будут находиться в `tests/generic` или `macros`.

Чтобы изменить это, обновите конфигурацию [test-paths](reference/project-configs/test-paths.md) в вашем файле `dbt_project.yml`, следующим образом:

<File name='dbt_project.yml'>

```yml
test-paths: ["my_cool_tests"]
```

</File>

Затем вы можете определять общие тесты в `my_cool_tests/generic/`, а одиночные тесты в любом другом месте в `my_cool_tests/`.