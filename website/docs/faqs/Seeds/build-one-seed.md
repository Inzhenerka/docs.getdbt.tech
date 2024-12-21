---
title: Как построить один seed за раз?
description: "Используйте флаг select, чтобы построить один seed за раз"
sidebar_label: "Построить один seed за раз"
id: build-one-seed
---

Начиная с версии v0.16.0, вы можете использовать опцию `--select` с командой `dbt seed`, вот так:

```shell

$ dbt seed --select country_codes

```

Также доступна опция `--exclude`.

Больше информации можно найти в документации по [синтаксису выбора моделей](/reference/node-selection/syntax).

До версии v0.16.0 не было возможности построить один seed за раз.