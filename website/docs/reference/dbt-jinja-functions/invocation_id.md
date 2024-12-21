---
title: "О `invocation_id`"
sidebar_label: "invocation_id"
id: "invocation_id"
description: "`invocation_id` выводит UUID, сгенерированный для этой команды dbt."
---

`invocation_id` выводит UUID, сгенерированный для этой команды dbt. Это значение полезно при аудите или анализе метаданных вызова dbt.

Если доступно, `invocation_id`:
- доступен в контексте компиляции [`query-comment`](/reference/project-configs/query-comment)
- включен в словарь `info` в dbt [событиях и логах](/reference/events-logging#info)
- включен в словарь `metadata` в [артефактах dbt](/reference/artifacts/dbt-artifacts#common-metadata)
- включен как метка во всех заданиях BigQuery, инициированных dbt

**Пример использования**:
Вы можете использовать следующий пример кода для всех платформ данных. Не забудьте заменить `TABLE_NAME` на фактическое имя вашей целевой таблицы:

`select '{{ invocation_id }}' as test_id from TABLE_NAME`