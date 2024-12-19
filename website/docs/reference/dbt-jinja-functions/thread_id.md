---
title: "О thread_id"
sidebar_label: "thread_id"
id: "thread_id"
description: "Параметр `thread_id` выводит идентификатор текущего потока Python."
---

Параметр `thread_id` выводит идентификатор текущего потока Python, который выполняет узел, например `Thread-1`.

Это значение полезно при аудите или анализе метаданных вызова dbt. Оно соответствует `thread_id` в [`объекте Result`](/reference/dbt-classes#result-objects) и [`run_results.json`](/reference/artifacts/run-results-json).

Если доступно, `thread_id`:
- доступен в контексте компиляции [`query-comment`](/reference/project-configs/query-comment)
- включен в словарь `info` в [событиях и логах dbt](/reference/events-logging#info)
- включен в словарь `metadata` в [артефактах dbt](/reference/artifacts/dbt-artifacts#common-metadata)
- включен в качестве метки во всех заданиях BigQuery, которые инициирует dbt