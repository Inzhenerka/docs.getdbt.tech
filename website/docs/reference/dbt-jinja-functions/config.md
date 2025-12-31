---
title: "О переменной config"
sidebar_label: "config"
id: "config"
description: "Прочтите это руководство, чтобы понять функцию config в dbt."
---

Переменная `config` существует для обработки конфигурации конечного пользователя для пользовательских <Term id="materialization">материализаций</Term>. Конфигурации, такие как `unique_key`, могут быть реализованы с использованием переменной `config` в ваших собственных материализациях.

Например, код в материализации `incremental`, такой как этот:
```
{% materialization incremental, default -%}
  {%- set unique_key = config.get('unique_key') -%}
  ...
```

отвечает за обработку кода модели, который выглядит так:
```
{{
  config(
    materialized='incremental',
    unique_key='id'
  )
}}
```

Просмотрите [Конфигурации моделей](/reference/model-configs) для примеров и дополнительной информации о допустимых аргументах.

## config.get {#configget}
__Аргументы__:

 * `name`: Имя конфигурационной переменной (обязательно)
 * `default`: Значение по умолчанию, которое будет использоваться, если эта конфигурация не предоставлена (необязательно)

Функция `config.get` используется для получения конфигураций для модели от конечного пользователя. Конфигурации, определенные таким образом, являются необязательными, и может быть предоставлено значение по умолчанию.

Существует 3 случая:
1. Конфигурационная переменная существует, она не `None`
2. Конфигурационная переменная существует, она `None`
3. Конфигурационная переменная не существует

:::info Доступ к пользовательским конфигурациям в `meta`
`config.get()` не возвращает значения из `config.meta`. Если ключ существует только в `meta`, `config.get()` вернёт значение по умолчанию и выдаст предупреждение. Чтобы получить доступ к пользовательским конфигурациям, сохранённым в `meta`, используйте [`config.meta_get()`](#configmeta_get).
:::

Пример использования:
```sql
{% materialization incremental, default -%}
  -- Пример без значения по умолчанию. unique_key будет None, если пользователь не предоставит эту конфигурацию
  {%- set unique_key = config.get('unique_key') -%}

  -- Пример с альтернативным значением. Используйте альтернативу 'id', если конфигурация 'unique_key' предоставлена, но она None
  {%- set unique_key = config.get('unique_key') or 'id' -%}

  -- Пример со значением по умолчанию. По умолчанию 'id', если конфигурация 'unique_key' не существует
  {%- set unique_key = config.get('unique_key', default='id') -%}

  -- For custom configs under `meta`, use config.meta_get()
  {% set my_custom_config = config.meta_get('custom_config_key') %}
  ...
```

## config.require {#configrequire}
__Аргументы__:

 * `name`: Имя конфигурационной переменной (обязательно)

Функция `config.require` используется для получения конфигураций для модели от конечного пользователя. Конфигурации, определенные с использованием этой функции, являются обязательными, и их отсутствие приведет к ошибке компиляции.

:::info Доступ к пользовательским конфигурациям в `meta`
`config.require()` не возвращает значения из `config.meta`. Если ключ существует только в `meta`, `config.require()` вызывает ошибку и выводит предупреждение. Чтобы получить обязательные пользовательские конфигурации, сохранённые в `meta`, используйте [`config.meta_require()`](#configmeta_require).
:::

Пример использования:
```sql
{% materialization incremental, default -%}
  {%- set unique_key = config.require('unique_key') -%}
  ...
```
## config.meta_get {#configmeta_get}

<VersionBlock lastVersion="1.10">

Эта функциональность появилась в <Constant name="core" /> v1.11 и <Constant name="fusion_engine" />.

</VersionBlock>

__Args__:

 - `name`: имя переменной конфигурации, которую нужно получить из `meta` (обязательно)
 - `default`: значение по умолчанию, которое будет использовано, если эта конфигурация не задана (опционально)

Функция `config.meta_get` извлекает пользовательские конфигурации, сохранённые в словаре `meta`. В отличие от `config.get()`, эта функция проверяет **только** `config.meta` и не приводит к появлению предупреждений о депрекейте.

Используйте эту функцию, когда обращаетесь к пользовательским конфигурациям, которые вы определили в `meta` в конфигурации модели или ресурса — по сути, это эквивалент вызова `config.get('meta').get()`.

Note that `config.meta_get` is not yet supported in Python models. In the meantime, Python models should continue using `dbt.config.get("meta").get("<key>")` to access custom meta configurations. `dbt.config.get_meta("<key>")` is an alias for `dbt.config.get("meta").get("<key>")`.

Пример использования:
```sql
{% materialization custom_materialization, default -%}
  -- Retrieve a custom config from meta, returns None if not found
  {%- set custom_setting = config.meta_get('custom_setting') -%}

  -- Retrieve with a default value
  {%- set custom_setting = config.meta_get('custom_setting', default='default_value') -%}
  ...
```

Пример конфигурации модели:
```yaml
models:
  - name: my_model
    config:
      meta:
        custom_setting: "my_value"
```

## config.meta_require {#configmeta_require}

<VersionBlock lastVersion="1.10">

Эта функциональность появилась в <Constant name="core" /> v1.11 и <Constant name="fusion_engine" />.

</VersionBlock>

__Args__:

 - `name`: имя переменной конфигурации, которую нужно получить из `meta` (обязательно)

Функция `config.meta_require` извлекает пользовательские конфигурации, сохранённые в словаре `meta`. В отличие от `config.require()`, эта функция проверяет **только** `config.meta` и не приводит к предупреждениям о депрекейте. Если конфигурация не найдена, dbt выбрасывает ошибку компиляции.

Используйте эту функцию, когда необходимо гарантировать наличие пользовательской конфигурации в `meta`.

Обратите внимание, что `config.meta_require` пока не поддерживается в Python-моделях.

Пример использования:
```sql
{% materialization custom_materialization, default -%}
  -- Require a custom config from meta, throws error if not found
  {%- set required_setting = config.meta_require('required_setting') -%}
  ...
```

Пример конфигурации модели:
```yaml
models:
  - name: my_model
    config:
      meta:
        required_setting: "my_value"
```
