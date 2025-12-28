---
title: Могу ли я хранить свои модели в директории, отличной от `models`, в моем проекте?
description: "Как задать имя директории для моделей"
sidebar_label: 'Как задать имя директории для моделей'
id: configurable-model-path

---

По умолчанию dbt ожидает, что файлы, определяющие ваши модели, будут находиться в поддиректории `models` вашего проекта.

Чтобы изменить это поведение, обновите конфигурацию [model-paths](reference/project-configs/model-paths.md) в файле `dbt_project.yml`
следующим образом:

<File name='dbt_project.yml'>

```yml
model-paths: ["transformations"]
```

</File>
