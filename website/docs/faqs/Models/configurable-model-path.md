---
title: Могу ли я хранить свои модели в каталоге, отличном от каталога `models` в моем проекте?
description: "Как назвать каталог моделей"
sidebar_label: 'Как назвать каталог моделей'
id: configurable-model-path

---

По умолчанию dbt ожидает, что файлы, определяющие ваши модели, будут находиться в подкаталоге `models` вашего проекта.

Чтобы изменить это, обновите конфигурацию [model-paths](reference/project-configs/model-paths.md) в вашем файле `dbt_project.yml`, как показано ниже:

<File name='dbt_project.yml'>

```yml
model-paths: ["transformations"]
```

</File>