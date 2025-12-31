---
title: "О встроенной переменной Jinja builtins"
sidebar_label: "builtins"
id: "builtins"
description: "Прочтите это руководство, чтобы понять встроенную переменную Jinja builtins в dbt."
---

Переменная `builtins` существует для предоставления ссылок на встроенные методы контекста dbt. Это позволяет создавать макросы с именами, которые _маскируют_ встроенные методы контекста dbt, при этом сохраняя доступ к этим методам в контексте компиляции dbt.

Переменная `builtins` — это словарь, содержащий следующие ключи:

- [ref](/reference/dbt-jinja-functions/ref)
- [source](/reference/dbt-jinja-functions/source)
- [config](/reference/dbt-jinja-functions/config)

## Использование {#usage}

:::important

Использование переменной `builtins` таким образом является продвинутым рабочим процессом разработки. Пользователи должны быть готовы поддерживать и обновлять эти переопределения при обновлении в будущем.
:::

Начиная с dbt версии 1.5 и выше, используйте следующий макрос для переопределения метода `ref`, доступного в контексте компиляции модели, чтобы возвращать [Relation](/reference/dbt-classes#relation) с переопределенным именем базы данных на `dev`.

Он включает логику для извлечения предоставленных пользователем аргументов, включая <code>version</code>, и вызова функции <code>builtins.ref()</code> с одним аргументом <code>modelname</code> или с обоими аргументами <code>packagename</code> и <code>modelname</code>, в зависимости от количества позиционных аргументов в <code>varargs</code>.

Обратите внимание, что функции `ref`, `source` и `config` не могут быть переопределены с помощью пакета. Это связано с тем, что `ref`, `source` и `config` являются свойствами контекста в dbt и не передаются как глобальные макросы. Обратитесь к [этому обсуждению на GitHub](https://github.com/dbt-labs/dbt-core/issues/4491#issuecomment-994709916) для получения дополнительной информации.

<br />

```
{% macro ref() %}

-- извлечение предоставленных пользователем позиционных и именованных аргументов
{% set version = kwargs.get('version') or kwargs.get('v') %}
{% set packagename = none %}
{%- if (varargs | length) == 1 -%}
    {% set modelname = varargs[0] %}
{%- else -%}
    {% set packagename = varargs[0] %}
    {% set modelname = varargs[1] %}
{% endif %}

-- вызов builtins.ref на основе предоставленных позиционных аргументов
{% set rel = None %}
{% if packagename is not none %}
    {% set rel = builtins.ref(packagename, modelname, version=version) %}
{% else %}
    {% set rel = builtins.ref(modelname, version=version) %}
{% endif %}

-- наконец, переопределение имени базы данных на "dev"
{% set newrel = rel.replace_path(database="dev") %}
{% do return(newrel) %}

{% endmacro %}
```

Логика внутри макроса ref также может использоваться для управления тем, какие элементы пути модели отображаются при выполнении. Например, следующая логика отображает только схему и идентификатор объекта, но не ссылку на базу данных, т.е. `my_schema.my_model` вместо `my_database.my_schema.my_model`. Это особенно полезно при использовании Snowflake в качестве хранилища, если вы намерены изменить имя базы данных после сборки и хотите, чтобы ссылки оставались точными.

```

  -- отображение идентификаторов без базы данных
  {% do return(rel.include(database=false)) %}
```