---
title: Могу ли я хранить свои снимки в каталоге, отличном от каталога `snapshot` в моем проекте?
description: "Вы можете узнать, как изменить каталог для снимков в вашем проекте"
sidebar_label: 'Хранение снимков в другом каталоге'
id: configurable-snapshot-path
---
По умолчанию dbt ожидает, что ваши файлы снимков будут находиться в подкаталоге `snapshots` вашего проекта.

Чтобы изменить это, обновите конфигурацию [snapshot-paths](reference/project-configs/snapshot-paths.md) в вашем файле `dbt_project.yml`, следующим образом:

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["snapshots"]
```

</File>

Обратите внимание, что вы не можете размещать снимки и модели в одном и том же каталоге.