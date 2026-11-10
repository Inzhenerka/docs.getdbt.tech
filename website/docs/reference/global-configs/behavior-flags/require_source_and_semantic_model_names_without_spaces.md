---
title: "Отсутствие пробелов в именах источников и семантических моделей"
id: "require_source_and_semantic_model_names_without_spaces"
sidebar_label: "требовать имена источников и семантических моделей без пробелов"
---

| require_source_and_semantic_model_names_without_spaces | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Добавлен | 2026.4 | 1.12.0 |
| Переведён в стабильный статус (по умолчанию → `true`) | — | — |
| Удалён | — | — |

По умолчанию флаг `require_source_and_semantic_model_names_without_spaces` установлен в `false`.

Имена источников и семантических моделей должны содержать буквы, цифры и символы подчёркивания, но _не_ пробелы. dbt выдаёт предупреждение [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation), если обнаруживает пробел в имени источника или семантической модели. Если флаг `require_source_and_semantic_model_names_without_spaces` установлен в `true`, dbt выдаёт ошибку.

Этот флаг расширяет действие [`require_resource_names_without_spaces`](/reference/global-configs/behavior-flags/require_resource_names_without_spaces), распространяя его на имена источников и семантических моделей.
