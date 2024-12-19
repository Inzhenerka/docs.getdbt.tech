---
title: "О фильтре as_native"
sidebar_label: "as_native"
id: "as_native"
description: "Используйте этот фильтр для приведения вывода, скомпилированного Jinja, к его родному представлению в Python."
---

Фильтр `as_native` Jinja приведет вывод, скомпилированный Jinja, к его родному представлению в Python в соответствии с [`ast.literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval). Результат может быть любым родным типом Python (множество, список, кортеж, словарь и т.д.).

Для отображения булевых и числовых значений рекомендуется использовать [`as_bool`](/reference/dbt-jinja-functions/as_bool) и [`as_number`](/reference/dbt-jinja-functions/as_number) вместо этого.

:::danger Будьте осторожны
В отличие от `as_bool` и `as_number`, `as_native` вернет скомпилированное значение независимо от типа входных данных. Убедитесь, что ваши входные данные соответствуют ожиданиям.
:::