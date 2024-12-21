---
title: "О команде dbt run-operation"
sidebar_label: "run-operation"
description: "Прочтите это руководство, чтобы узнать, как команда dbt run-operation может быть использована для вызова макроса."
id: "run-operation"
---

### Обзор

Команда `dbt run-operation` используется для вызова макроса. Для получения информации о использовании, обратитесь к документации по [операциям](/docs/build/hooks-operations#operations).

### Использование
```
$ dbt run-operation {macro} --args '{args}'
  {macro}        Укажите макрос для вызова. dbt вызовет этот макрос
                        с предоставленными аргументами и затем завершит работу
  --args ARGS           Передайте аргументы макросу. Этот словарь будет
                        сопоставлен с именованными аргументами, определенными в
                        выбранном макросе. Этот аргумент должен быть строкой в формате YAML,
                        например, '{my_variable: my_value}'
```
### Примеры командной строки

Пример 1:

`$ dbt run-operation grant_select --args '{role: reporter}'`

Пример 2:

`$ dbt run-operation clean_stale_models --args '{days: 7, dry_run: True}'`