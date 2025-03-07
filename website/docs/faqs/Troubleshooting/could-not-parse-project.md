---
title: Ошибка 'Could not parse dbt_project.yml' в задании dbt Cloud
description: "Получаете ошибку 'Could not parse dbt_project.yml' в dbt Cloud? Эта ошибка обычно вызвана табуляцией в вашем файле dbt_project.yml."
sidebar_label: 'Ошибка Could not parse dbt_project.yml в dbt Cloud'
---

Сообщение об ошибке `Could not parse dbt_project.yml: while scanning for...` в вашем задании dbt Cloud или в процессе разработки обычно возникает по нескольким причинам:

- Ошибка разбора в YAML файле (например, табуляция или символы Unicode).
- В вашем файле `dbt_project.yml` отсутствуют поля или он имеет неправильное форматирование.
- Файл `dbt_project.yml` отсутствует в репозитории вашего dbt проекта.

Чтобы решить эту проблему, рассмотрите следующие шаги:
- Используйте онлайн-парсер или валидатор YAML, чтобы проверить наличие ошибок разбора в вашем YAML файле. Известные ошибки разбора включают отсутствующие поля, неправильное форматирование или табуляцию.
- Или убедитесь, что ваш файл `dbt_project.yml` существует.

После того как вы выявите проблему, вы сможете исправить ошибку и повторно запустить задание в dbt Cloud.