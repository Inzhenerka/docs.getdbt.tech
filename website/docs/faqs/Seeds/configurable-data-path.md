---
title: Могу ли я хранить свои seed-файлы в другой директории, отличной от директории `seeds` в моем проекте?
description: "Где хранить seed-файлы в директории"
sidebar_label: 'Как назвать директорию для seed-файлов'
id: configurable-data-path

---

По умолчанию dbt ожидает, что ваши seed-файлы будут находиться в поддиректории `seeds` вашего проекта.

Чтобы изменить это, обновите конфигурацию [seed-paths](reference/project-configs/seed-paths.md) в вашем файле `dbt_project.yml`, следующим образом:

<File name='dbt_project.yml'>

```yml
seed-paths: ["custom_seeds"]
```

</File>