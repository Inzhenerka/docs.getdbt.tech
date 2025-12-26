---
title: Как построить один seed за раз?
description: "Используйте флаг select, чтобы построить один seed за раз"
sidebar_label: "Построить один seed за раз"
id: build-one-seed
---

Вы можете использовать опцию `--select` с командой `dbt seed`, например так:

```shell

$ dbt seed --select country_codes

```

Также доступна опция `--exclude`.

Больше информации можно найти в документации по [синтаксису выбора моделей](/reference/node-selection/syntax).

