---
title: "О команде dbt snapshot"
sidebar_label: "snapshot"
id: "snapshot"
---

Команда `dbt snapshot` выполняет [Снимки](/docs/build/snapshots), определенные в вашем проекте.

dbt будет искать Снимки в путях `snapshot-paths`, определенных в вашем файле `dbt_project.yml`. По умолчанию путь `snapshot-paths` — это `snapshots/`.

**Использование:**
```
$ dbt snapshot --help
usage: dbt snapshot [-h] [--profiles-dir PROFILES_DIR]
                                     [--profile PROFILE] [--target TARGET]
                                     [--vars VARS] [--bypass-cache]
                                     [--threads THREADS]
                                     [--select SELECTOR [SELECTOR ...]]
                                     [--exclude EXCLUDE [EXCLUDE ...]]

optional arguments:
  --select SELECTOR [SELECTOR ...]
                        Укажите снимки, которые следует включить в выполнение.
  --exclude EXCLUDE [EXCLUDE ...]
                        Укажите снимки, которые следует исключить из выполнения.
```