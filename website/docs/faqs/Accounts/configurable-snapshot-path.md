---
title: Могу ли я хранить свои снимки в директории, отличной от директории `snapshot` в моем проекте?
description: "Вы можете узнать, как изменить директорию для снимков в вашем проекте"
sidebar_label: 'Хранение снимков в другой директории'
id: configurable-snapshot-path
---
По умолчанию dbt ожидает, что ваши файлы снимков будут находиться в подпапке `snapshots` вашего проекта.

Чтобы изменить это, обновите конфигурацию [snapshot-paths](reference/project-configs/snapshot-paths.md) в вашем файле `dbt_project.yml`, следующим образом:

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["snapshots"]
```

</File>

Обратите внимание, что вы не можете размещать снимки и модели в одной и той же директории.