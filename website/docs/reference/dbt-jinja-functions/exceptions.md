---
title: "О пространстве имен exceptions"
sidebar_label: "exceptions"
id: "exceptions"
description: "Вызывайте предупреждения/ошибки с помощью пространства имен `exceptions`."
---

Пространство имен `exceptions` может использоваться для вызова предупреждений и ошибок в пользовательской среде dbt.

## raise_compiler_error

Метод `exceptions.raise_compiler_error` вызывает ошибку компилятора с предоставленным сообщением. Это обычно полезно только в макросах или <Term id="materialization">материализациях</Term>, когда вызывающая модель предоставляет недопустимые аргументы. Обратите внимание, что выброс исключения приведет к сбою модели, поэтому используйте эту переменную с осторожностью!

__Пример использования__:

<File name='exceptions.sql'>

```sql
{% if number < 0 or number > 100 %}
  {{ exceptions.raise_compiler_error("Invalid `number`. Got: " ~ number) }}
{% endif %}
```

</File>

## warn

Используйте метод `exceptions.warn`, чтобы сгенерировать предупреждение компилятора с указанным сообщением. При этом любая модель всё равно будет выполнена успешно и будет считаться со статусом PASS. По умолчанию предупреждения не приводят к падению запусков dbt. Однако:

* Если вы используете флаг `--warn-error`, все предупреждения будут повышены до ошибок.
* Чтобы повышать до ошибок только Jinja‑предупреждения (и оставить остальные предупреждения без изменений), используйте `--warn-error-options`. Например, `--warn-error-options '{"error": ["JinjaLogWarning"]}'`.

Подробнее см. в разделе [Warnings](/reference/global-configs/warnings).

__Пример использования__:

<File name='warn.sql'>

```sql
{% if number < 0 or number > 100 %}
  {% do exceptions.warn("Invalid `number`. Got: " ~ number) %}
{% endif %}
```

</File>