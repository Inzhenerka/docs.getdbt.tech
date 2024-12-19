---
title: "О методе контекста fromyaml"
sidebar_label: "fromyaml"
id: "fromyaml"
description: "Десериализация строки YAML в Python с помощью метода контекста `fromyaml`."
---

Метод контекста `fromyaml` может быть использован для десериализации строки YAML в примитивный объект Python, например, в `dict` или `list`.

__Аргументы__:
 * `string`: Строка YAML для десериализации (обязательный)
 * `default`: Значение по умолчанию, которое будет возвращено, если аргумент `string` не может быть десериализован (необязательный)

### Использование:
```
{% set my_yml_str -%}

dogs:
 - good
 - bad

{%- endset %}

{% set my_dict = fromyaml(my_yml_str) %}

{% do log(my_dict['dogs'], info=true) %}
-- ["good", "bad"]

{% do my_dict['dogs'].pop() %}
{% do log(my_dict['dogs'], info=true) %}
-- ["good"]
```