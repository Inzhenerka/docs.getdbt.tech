---
title: "О переменной dbt_version"
sidebar_label: "dbt_version"
id: "dbt_version"
description: "Прочитайте это руководство, чтобы понять, как работает Jinja-функция dbt_version в dbt."
---

Переменная `dbt_version` возвращает установленную версию dbt, которая в данный момент используется. Она может применяться для целей отладки или аудита. Подробнее о версионировании релизов см. в разделе [Versioning](/reference/commands/version#versioning).

## Примеры использования {#example-usages}

<File name="macros/get_version.sql">

```sql
{% macro get_version() %}

  {% do log("The installed version of dbt is: " ~ dbt_version, info=true) %}

{% endmacro %}
```

</File>

```
$ dbt run-operation get_version
The installed version of dbt is 1.6.0
```
