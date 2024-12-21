---
title: "О методе контекста fromjson"
sidebar_label: "fromjson"
id: "fromjson"
description: "Десериализация строки json в Python с помощью метода контекста `fromjson`."
---

Метод контекста `fromjson` может использоваться для десериализации строки json в примитивный объект Python, например, `dict` или `list`.

__Аргументы__:
 * `string`: Строка json для десериализации (обязательный)
 * `default`: Значение по умолчанию, которое возвращается, если аргумент `string` не может быть десериализован (необязательный)

### Использование:
```
{% set my_json_str = '{"abc": 123}' %}
{% set my_dict = fromjson(my_json_str) %}

{% do log(my_dict['abc']) %}
```