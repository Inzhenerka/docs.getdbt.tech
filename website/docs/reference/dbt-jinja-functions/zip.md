---
title: "О методе контекста zip"
id: "zip"
sidebar_label: "zip"
description: "Используйте этот метод контекста, чтобы получить итератор кортежей."
---

Вы можете использовать метод контекста `zip`, чтобы получить итератор кортежей, в котором i-й кортеж содержит i-й элемент каждого из переданных итерируемых объектов. Подробнее см. в [документации Python](https://docs.python.org/3/library/functions.html#zip).
        
__Аргументы__:
- `*args`: Любое количество итерируемых объектов
- `default`: Значение по умолчанию, которое будет возвращено, если `*args` не является итерируемым объектом

### Использование {#usage}

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

### zip_strict {#zip_strict}

Вы можете использовать контекстный метод `zip_strict`, чтобы получить итератор кортежей, как и при использовании `zip`. Отличие от контекстного метода `zip` заключается в том, что метод `zip_strict` вызовет исключение `TypeError`, если одно из переданных значений не является допустимым итерируемым объектом.

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

Compilation Error in ... (...)
  'int' object is not iterable
```
