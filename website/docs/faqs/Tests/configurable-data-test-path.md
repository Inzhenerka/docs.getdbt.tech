---
title: Могу ли я хранить data tests в директории, отличной от `tests` в моём проекте?
description: "Где хранить data tests в директории проекта"
sidebar_label: 'Как назвать директорию для data tests'
id: configurable-data-test-path

---
По умолчанию dbt ожидает, что файлы *singular data tests* будут находиться в поддиректории `tests` вашего проекта, а определения *generic data tests* — в `tests/generic` или в `macros`.

Чтобы изменить это, обновите конфигурацию [test-paths](reference/project-configs/test-paths.md) в вашем файле `dbt_project.yml`, следующим образом:

<File name='dbt_project.yml'>

```yml
test-paths: ["my_cool_tests"]
```

</File>

Затем вы можете определять обобщённые (generic) тесты данных в `my_cool_tests/generic/`, а одиночные (singular) тесты данных — во всех остальных местах внутри `my_cool_tests/`.
