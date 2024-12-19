---
title: "О методе контекста fromjson"
sidebar_label: "fromjson"
id: "fromjson"
description: "Десериализация json-строки в Python с помощью метода контекста `fromjson`."
---

Метод контекста `fromjson` может быть использован для десериализации json-строки в примитивный объект Python, например, в `dict` или `list`.

__Аргументы__:
 * `string`: Json-строка для десериализации (обязательный)
 * `default`: Значение по умолчанию, которое будет возвращено, если аргумент `string` не может быть десериализован (необязательный)

### Пример использования:
```
{% set my_json_str = '{"abc": 123}' %}
{% set my_dict = fromjson(my_json_str) %}

{% do log(my_dict['abc']) %}
```