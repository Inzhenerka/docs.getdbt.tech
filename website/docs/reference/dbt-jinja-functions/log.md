---
title: "log"
sibebar_label: "О функции log"
id: "log"
description: "Узнайте больше о функции log в Jinja для dbt."
---

__Аргументы__:

 * `msg`: Сообщение (строка) для записи в лог
 * `info`: Если False, записать в лог-файл. Если True, записать как в лог-файл, так и в stdout (по умолчанию=False)

Записывает строку либо в лог-файл, либо в stdout.

<details>
	<summary>Исходный код</summary>
	Обратитесь к <a href="https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/context/base.py#L549-L566">GitHub</a> или к следующему коду в качестве источника: <br /><br />

```python
    def log(msg: str, info: bool = False) -> str: 
        """Записывает строку либо в лог-файл, либо в stdout.

        :param msg: Сообщение для записи в лог
        :param info: Если `False`, записать в лог-файл. Если `True`, записать
            как в лог-файл, так и в stdout.

        > macros/my_log_macro.sql

            {% macro some_macro(arg1, arg2) %}
              {{ log("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}
            {% endmacro %}"
        """
        if info:
            fire_event(JinjaLogInfo(msg=msg, node_info=get_node_info()))
        else:
            fire_event(JinjaLogDebug(msg=msg, node_info=get_node_info()))
        return ""
```
	


</details>

```sql

{% macro some_macro(arg1, arg2) %}

	{{ log("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}

{% endmacro %}
```