---
title: "О переменной dbt_version"
sidebar_label: "dbt_version"
id: "dbt_version"
description: "Прочтите это руководство, чтобы понять функцию dbt_version в Jinja в dbt."
---

Переменная `dbt_version` возвращает установленную версию dbt, которая в данный момент запущена. Она может быть использована для отладки или аудита. Для получения подробной информации о версионировании релизов, обратитесь к разделу [Версионирование](/reference/commands/version#versioning).

## Примеры использования

<File name="macros/get_version.sql">

```sql
{% macro get_version() %}

  {% do log("The installed version of dbt is: " ~ dbt_version, info=true) %}

{% endmacro %}
```

</File>


```
$ dbt run-operation get_version
Установленная версия dbt — 1.6.0
