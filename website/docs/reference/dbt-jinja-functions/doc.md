---
title: " О функции doc"
sidebar_label: "doc"
id: "doc"
description: "Используйте `doc` для ссылки на блоки документации в полях описания."
---

Функция `doc` используется для ссылки на блоки документации в поле описания файлов schema.yml. Она аналогична функции `ref`. Для получения дополнительной информации обратитесь к [Руководству по документации](/docs/collaborate/build-and-view-your-docs).

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

version: 2
models:
  - name: orders
    description: "{{ doc('orders') }}"
```

</File>