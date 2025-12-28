---
title: Могу ли я хранить snapshot’ы в директории, отличной от директории `snapshot` в моем проекте?
description: "Здесь показано, как изменить директорию для snapshot’ов в вашем проекте"
sidebar_label: 'Хранение snapshot’ов в другой директории'
id: configurable-snapshot-path
---
По умолчанию dbt ожидает, что файлы snapshot’ов будут находиться в поддиректории `snapshots` вашего проекта.

Чтобы изменить это поведение, обновите конфигурацию [snapshot-paths](reference/project-configs/snapshot-paths.md) 
в файле `dbt_project.yml`, например, так:

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["snapshots"]
```

</File>

Обратите внимание, что нельзя размещать snapshot’ы и модели в одной и той же директории.
