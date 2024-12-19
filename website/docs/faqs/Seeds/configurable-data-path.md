---
title: Могу ли я хранить свои семена в директории, отличной от директории `seeds` в моем проекте?
description: "Где хранить семена в директории"
sidebar_label: 'Как назвать директорию семян'
id: configurable-data-path

---

По умолчанию dbt ожидает, что ваши файлы семян будут находиться в подпапке `seeds` вашего проекта.

Чтобы изменить это, обновите конфигурацию [seed-paths](reference/project-configs/seed-paths.md) в вашем файле `dbt_project.yml`, как показано ниже:

<File name='dbt_project.yml'>

```yml
seed-paths: ["custom_seeds"]
```

</File>