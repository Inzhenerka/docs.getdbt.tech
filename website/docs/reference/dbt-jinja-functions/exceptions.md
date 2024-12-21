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

Метод `exceptions.warn` вызывает предупреждение компилятора с предоставленным сообщением, но любая модель все равно будет успешной и будет считаться пройденной. Если флаг `--warn-error` передан в dbt, то это предупреждение будет повышено до исключения, которое будет вызвано.

__Пример использования__:

<File name='warn.sql'>

```sql
{% if number < 0 or number > 100 %}
  {% do exceptions.warn("Invalid `number`. Got: " ~ number) %}
{% endif %}
```

</File>