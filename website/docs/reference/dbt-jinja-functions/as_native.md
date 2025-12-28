---
title: "О фильтре as_native"
sidebar_label: "as_native"
id: "as_native"
description: "Используйте этот фильтр, чтобы привести результат, скомпилированный Jinja, к его нативному Python-представлению."
---

Jinja-фильтр `as_native` приводит результат, скомпилированный Jinja,  
к его нативному представлению в Python в соответствии с [`ast.literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval).  
Результатом может быть любой нативный тип Python (set, list, tuple, dict и т.д.).

Для рендеринга логических и числовых значений рекомендуется использовать [`as_bool`](/reference/dbt-jinja-functions/as_bool)  
и [`as_number`](/reference/dbt-jinja-functions/as_number).

:::danger Используйте с осторожностью
В отличие от `as_bool` и `as_number`, `as_native` вернёт отрендеренное значение
независимо от типа входных данных. Убедитесь, что входные значения соответствуют ожидаемым.
:::
