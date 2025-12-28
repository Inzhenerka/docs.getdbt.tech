---
title: Могу ли я хранить seed-файлы в каталоге, отличном от `seeds`, в моем проекте?
description: "Где хранить seed-файлы в каталоге"
sidebar_label: 'Как назвать каталог для seed-файлов'
id: configurable-data-path

---

По умолчанию dbt ожидает, что ваши seed-файлы будут располагаться в подкаталоге `seeds`
вашего проекта.

Чтобы изменить это поведение, обновите конфигурацию [seed-paths](reference/project-configs/seed-paths.md) в файле `dbt_project.yml`
следующим образом:

<File name='dbt_project.yml'>

```yml
seed-paths: ["custom_seeds"]
```

</File>
