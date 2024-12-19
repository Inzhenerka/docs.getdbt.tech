---
title: Как запустить модели, зависящие от seed?
description: "Вы запускаете модели, зависящие от seed, используя синтаксис выбора моделей"
sidebar_label: 'Запуск моделей, зависящих от seed'
id: run-downstream-of-seed

---

Вы можете запустить модели, зависящие от seed, используя [синтаксис выбора моделей](/reference/node-selection/syntax) и рассматривая seed как модель.

Например, следующее запустит все модели, зависящие от seed с именем `country_codes`:

```shell
$ dbt run --select country_codes+
```