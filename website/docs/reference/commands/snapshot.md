---
title: "О команде dbt snapshot"
sidebar_label: "snapshot"
id: "snapshot"
---

Команда `dbt snapshot` выполняет [Снапшоты](/docs/build/snapshots), определенные в вашем проекте.

dbt будет искать снапшоты в путях, указанных в параметре `snapshot-paths` в вашем файле `dbt_project.yml`. По умолчанию значение `snapshot-paths` — это путь `snapshots/`.

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
                        Укажите снапшоты, которые нужно включить в выполнение.
  --exclude EXCLUDE [EXCLUDE ...]
                        Укажите снапшоты, которые нужно исключить из выполнения.
```