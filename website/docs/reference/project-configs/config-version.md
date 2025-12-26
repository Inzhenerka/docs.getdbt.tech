---
datatype: integer
description: "Прочтите это руководство, чтобы понять конфигурацию config-version в dbt."
---

Тег `config-version:` является необязательным.

<File name='dbt_project.yml'>

```yml
config-version: 2
```

</File>

## Определение

Укажите, что ваш `dbt_project.yml` использует структуру версии v2.

## По умолчанию

Без этой конфигурации dbt будет считать, что ваш файл `dbt_project.yml` использует синтаксис версии 2. Версия 1 была объявлена устаревшей.
