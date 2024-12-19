---
title: "log"
sibebar_label: "О функции log"
id: "log"
description: "Узнайте больше о функции log Jinja в dbt."
---

__Аргументы__:

 * `msg`: Сообщение (строка) для записи в лог
 * `info`: Если False, записать в файл лога. Если True, записать как в файл лога, так и в stdout (по умолчанию=False)

Записывает строку либо в файл лога, либо в stdout.

<details>
	<summary>Исходный код</summary>
	Смотрите на <a href="https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/context/base.py#L549-L566">GitHub</a> или следующий код в качестве источника: <br /><br />

```python
    def log(msg: str, info: bool = False) -> str: 
        """Logs a line to either the log file or stdout.

        :param msg: The message to log
        :param info: If `False`, write to the log file. If `True`, write to
            both the log file and stdout.

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