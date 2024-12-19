---
title: "О переменной dbt_version"
sidebar_label: "dbt_version"
id: "dbt_version"
description: "Прочитайте это руководство, чтобы понять функцию Jinja dbt_version в dbt."
---

Переменная `dbt_version` возвращает установленную версию dbt, которая в данный момент используется. Она может быть использована для отладки или аудита. Для получения информации о версиях релизов обратитесь к разделу [Версионирование](/reference/commands/version#versioning).

## Примеры использования

<File name="macros/get_version.sql">

```sql
{% macro get_version() %}

  {% do log("Установленная версия dbt: " ~ dbt_version, info=true) %}

{% endmacro %}
```

</File>


```
$ dbt run-operation get_version
Установленная версия dbt: 0.16.0
```