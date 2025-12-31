---
title: "О методе контекста zip"
id: "zip"
sidebar_label: "zip"
description: "Используйте этот метод контекста, чтобы получить итератор кортежей."
---

Метод контекста `zip` можно использовать для получения итератора кортежей, где i-й кортеж содержит i-й элемент из каждого переданного итерируемого аргумента. Подробнее см. в [документации Python](https://docs.python.org/3/library/functions.html#zip).
        
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

Метод контекста `zip_strict` можно использовать для получения итератора кортежей, так же как и `zip`. Отличие от метода контекста `zip` заключается в том, что метод `zip_strict` выбрасывает исключение `TypeError`, если одно из переданных значений не является корректным итерируемым объектом.

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
