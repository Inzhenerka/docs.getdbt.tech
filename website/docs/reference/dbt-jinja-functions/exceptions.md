---
title: "О пространстве имен exceptions"
sidebar_label: "exceptions"
id: "exceptions"
description: "Выводите предупреждения и вызывайте ошибки с помощью пространства имён `exceptions`."
---

Используйте пространство имён `exceptions`, чтобы выводить собственные предупреждения или вызывать ошибки из кода Jinja в моделях и макросах dbt во время компиляции и выполнения.

Это полезно, когда вашему макросу или модели нужно проверить наличие проблемы и указать dbt, как на неё реагировать. Например, вы можете захотеть вывести предупреждение или вызвать ошибку, когда:

- отсутствует обязательный входной параметр
- значение не поддерживается
- зависимость недоступна
- пользовательская проверка завершается неудачно

Это ошибки или предупреждения, которые вы сами решаете вызывать в своём коде Jinja. Они отличаются от ошибок, автоматически возникающих в dbt или Jinja, таких как синтаксические ошибки или неопределённые переменные.

Если вы не пишете собственный код Jinja, а пытаетесь устранить ошибку dbt, обратитесь к разделу [Отладка ошибок](/guides/debug-errors).

При вызове этих функций во время `dbt run` или `dbt run-operation` оборачивайте их в `{% if execute %}`. Это гарантирует, что функция будет вызвана только при выполнении вашего кода в dbt, а не при разборе проекта.

Узнайте больше о переменной [`execute`](/reference/dbt-jinja-functions/execute).

## raise_compiler_error {#raisecompilererror}

Метод `exceptions.raise_compiler_error` вызывает ошибку компиляции с указанным сообщением. Обычно он полезен только в макросах или <Term id="materialization">материализациях</Term>, когда вызывающая модель передаёт недопустимые аргументы. Исключение приводит к сбою модели, поэтому используйте этот метод с осторожностью.

__Пример использования__:

<File name='exceptions.sql'>

```sql
{% if execute %}
  {% if number < 0 or number > 100 %}
    {{ exceptions.raise_compiler_error("Invalid `number`. Got: " ~ number) }}
  {% endif %}
{% endif %}
```

</File>

<VersionBlock lastVersion="1.99">

## raise_database_error

Используйте `exceptions.raise_database_error`, чтобы остановить выполнение dbt из кода Jinja с сообщением об ошибке базы данных.

Это полезно в пользовательских макросах, когда нужно, чтобы dbt отобразил ошибку как `Database Error`. При вызове этого метода выполнение завершается с ошибкой, и dbt отображает ваше сообщение.

__Пример использования__:

<File name='macros/validate_relation.sql'>

```sql
{% macro validate_relation(relation) %}
  {% if execute and not relation %}
    {{ exceptions.raise_database_error('Expected a valid relation but none was provided') }}
  {% endif %}
{% endmacro %}
```

</File>

## raise_dependency_error

Метод `exceptions.raise_dependency_error` вызывает ошибку, если не выполнены требования к пакету или зависимости. Для защиты конфиденциальной информации dbt автоматически удаляет секреты из сообщения об ошибке.

Выполнение завершается с ошибкой `Runtime Error` и вашим сообщением.

__Пример использования__:

<File name='macros/check_package.sql'>

```sql
{% macro check_package() %}
  {% if execute and 'my_package' not in installed_packages %}
    {{ exceptions.raise_dependency_error('Missing required package: my_package') }}
  {% endif %}
{% endmacro %}
```

</File>

</VersionBlock>

## raise_fail_fast_error

Используйте `exceptions.raise_fail_fast_error`, чтобы немедленно остановить dbt, когда дальнейшее выполнение недопустимо.

Обычно этот метод используется, когда dbt обнаруживает изменение конфигурации, а для `on_configuration_change` задано значение `fail`.

Выполнение завершается с ошибкой `FailFast Error` и вашим сообщением.

__Пример использования__:

<File name='macros/materialized_view.sql'>

```sql
{% if on_configuration_change == 'fail' %}
  {{ exceptions.raise_fail_fast_error(
    "Configuration changes were identified and `on_configuration_change` was set to `fail` for `" ~ target_relation.render() ~ "`"
  ) }}
{% endif %}
```

</File>

## raise_not_implemented

Используйте `exceptions.raise_not_implemented`, чтобы остановить выполнение dbt, если текущий адаптер не поддерживает макрос или функциональную возможность.

Этот метод часто используется авторами адаптеров и пакетов, когда функциональная возможность ещё не реализована.

Выполнение завершается с ошибкой `Runtime Error` и вашим сообщением.

__Пример использования__:

<File name='macros/get_columns_in_relation.sql'>

```sql
{% macro default__get_columns_in_relation(relation) -%}
  {{ exceptions.raise_not_implemented(
    'get_columns_in_relation macro not implemented for adapter ' ~ adapter.type()) }}
{% endmacro %}
```

</File>

## warn

Используйте метод `exceptions.warn`, чтобы выдать предупреждение компилятора с указанным сообщением. Выполнение модели по-прежнему будет успешным и получит статус PASS. По умолчанию предупреждения не приводят к завершению выполнения dbt с ошибкой. Однако:

- Если использовать флаг `--warn-error`, все предупреждения будут преобразованы в ошибки.
- Чтобы преобразовать в ошибки только предупреждения Jinja (не затрагивая остальные предупреждения), используйте `--warn-error-options`. Например, `--warn-error-options '{"error": ["JinjaLogWarning"]}'`.

Подробнее см. в разделе [Warnings](/reference/global-configs/warnings).

__Пример использования__:

<File name='warn.sql'>

```sql
{% if execute %}
  {% if number < 0 or number > 100 %}
    {% do exceptions.warn("Invalid `number`. Got: " ~ number) %}
  {% endif %}
{% endif %}
```

</File>