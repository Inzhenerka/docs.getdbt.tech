---
title: "О методе контекста fromyaml"
sidebar_label: "fromyaml"
id: "fromyaml"
description: "Десериализация YAML-строки в Python с помощью метода контекста `fromyaml`."
---

Метод контекста `fromyaml` может использоваться для десериализации YAML-строки в примитивный объект Python, например, `dict` или `list`.

__Аргументы__:
 * `string`: YAML-строка для десериализации (обязательный)
 * `default`: Значение по умолчанию, которое возвращается, если аргумент `string` не может быть десериализован (необязательный)

### Использование: {#usage}
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