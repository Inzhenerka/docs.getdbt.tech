---
title: "О методе контекста fromjson"
sidebar_label: "fromjson"
id: "fromjson"
description: "Десериализует строку JSON в объект Python с помощью контекстного метода `fromjson`."
---

Контекстный метод `fromjson` можно использовать для десериализации строки JSON в примитивный объект Python, например `dict` или `list`.

__Args__:
 * `string`: Строка JSON, которую необходимо десериализовать (обязательно)
 * `default`: Значение по умолчанию, которое будет возвращено, если аргумент `string` не удалось десериализовать (необязательно)

### Использование: {#usage}
```
{% set my_json_str = '{"abc": 123}' %}
{% set my_dict = fromjson(my_json_str) %}

{% do log(my_dict['abc']) %}
```