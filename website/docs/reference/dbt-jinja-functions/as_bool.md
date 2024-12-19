---
title: "О фильтре as_bool"
sidebar_label: "as_bool"
id: "as_bool"
description: "Используйте этот фильтр для приведения вывода Jinja к булевому значению."
---

Фильтр `as_bool` в Jinja приведет скомпилированный вывод Jinja к булевому
значению (`True` или `False`), или вернет ошибку, если его нельзя представить
в виде булевого значения.

### Использование:

В приведенном ниже примере фильтр `as_bool` используется для приведения выражения Jinja, чтобы включить или отключить набор моделей в зависимости от `target`.

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    for_export:
      enabled: "{{ (target.name == 'prod') | as_bool }}"
```

</File>