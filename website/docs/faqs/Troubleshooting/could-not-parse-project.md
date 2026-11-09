---
title: Receiving a 'Could not parse dbt_project.yml' error in dbt job
description: "Receiving a 'Could not parse dbt_project.yml' error in dbt? This error is typically caused by a tab indentation in your dbt_project.yml file."
sidebar_label: 'Could not parse dbt_project.yml error in dbt'
---

Сообщение об ошибке `Could not parse dbt_project.yml: while scanning for...` при запуске задания или во время разработки в <Constant name="dbt" /> обычно возникает по нескольким причинам:

- Ошибка разбора в YAML файле (например, табуляция или символы Unicode).
- В вашем файле `dbt_project.yml` отсутствуют поля или он имеет неправильное форматирование.
- Файл `dbt_project.yml` отсутствует в репозитории вашего dbt проекта.

Чтобы решить эту проблему, рассмотрите следующие шаги:
- Используйте онлайн-парсер или валидатор YAML, чтобы проверить наличие ошибок разбора в вашем YAML файле. Известные ошибки разбора включают отсутствующие поля, неправильное форматирование или табуляцию.
- Или убедитесь, что ваш файл `dbt_project.yml` существует.

Определив причину проблемы, вы можете исправить ошибку и повторно запустить задание <Constant name="dbt" />.
