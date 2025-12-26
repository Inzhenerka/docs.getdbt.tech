---
title: "О функции doc"
sidebar_label: "doc"
id: "doc"
description: "Используйте `doc` для ссылки на блоки документации в полях описания."
---

Функция `doc` используется для обращения к блокам документации в поле `description` файлов `schema.yml`. Она аналогична функции `ref`. Подробнее см. в разделе [Руководство по документации](/docs/explore/build-and-view-your-docs).

Использование:

<File name='orders.md'>

```jinja2

{% docs orders %}

# docs
- go
- here
 
{% enddocs %}
```

</File>



<File name='schema.yml'>

```yaml

models:
  - name: orders
    description: "{{ doc('orders') }}"
```

</File>