---
title: "О методе контекста zip"
id: "zip"
sidebar_label: "zip"
description: "Используйте этот метод контекста для возврата итератора кортежей."
---

Контекстный метод `zip` можно использовать для получения итератора кортежей, где i-й кортеж содержит i-й элемент из каждого из переданных итерируемых объектов. Подробнее см. в [документации Python](https://docs.python.org/3/library/functions.html#zip).

__Args__:
- `*args`: Любое количество итерируемых объектов
- `default`: Значение по умолчанию, которое будет возвращено, если `*args` не является итерируемым

__Аргументы__:
- `*args`: Любое количество итерируемых объектов
- `default`: Значение по умолчанию, которое возвращается, если `*args` не является итерируемым

### Использование

```
{% set my_list_a = [1, 2] %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip(my_list_a, my_list_b) | list %}
{% do log(my_zip) %}  {# [(1, 'alice'), (2, 'bob')] #}
```

```
{% set my_list_a = 12 %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip(my_list_a, my_list_b, default = []) | list %}
{% do log(my_zip) %}  {# [] #}
```

### zip_strict

Метод контекста `zip_strict` может быть использован для возврата итератора кортежей, так же как и `zip`. Разница с методом контекста `zip` заключается в том, что метод `zip_strict` вызовет исключение `TypeError`, если одно из предоставленных значений не является допустимым итерируемым объектом.

__Аргументы__:
- `value`: Итерируемый объект для преобразования (например, список)

```
{% set my_list_a = [1, 2] %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip_strict(my_list_a, my_list_b) | list %}
{% do log(my_zip) %}  {# [(1, 'alice'), (2, 'bob')] #}
```

```
{% set my_list_a = 12 %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip_strict(my_list_a, my_list_b) %}

Ошибка компиляции в ... (...)
  'int' object is not iterable
```