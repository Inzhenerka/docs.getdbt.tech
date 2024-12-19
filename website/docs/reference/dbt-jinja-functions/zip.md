---
title: "О методе контекста zip"
id: "zip"
sidebar_label: "zip"
description: "Используйте этот метод контекста для возврата итератора кортежей."
---

Метод контекста `zip` может быть использован для возврата итератора кортежей, где i-й кортеж содержит i-й элемент из каждого из переданных итераторов. ([Документация Python](https://docs.python.org/3/library/functions.html#zip))
        :param 
        :param 
        
__Аргументы__:
- `*args`: Любое количество итераторов
- `default`: Значение по умолчанию, которое будет возвращено, если `*args` не является итератором

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

Метод контекста `zip_strict` может быть использован для возврата итератора кортежей, так же как и `zip`. Разница между методом `zip` и методом `zip_strict` заключается в том, что метод `zip_strict` вызовет исключение при `TypeError`, если одно из переданных значений не является допустимым итератором.

__Аргументы__:
- `value`: Итератор для преобразования (например, список)

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
  'int' объект не является итератором
```