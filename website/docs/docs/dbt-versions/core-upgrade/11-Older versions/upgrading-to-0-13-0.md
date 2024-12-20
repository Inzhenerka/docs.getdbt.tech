---
title: "Обновление до 0.13.0"
id: "upgrading-to-0-13-0"
displayed_sidebar: "docs"
---

## Изменения, нарушающие совместимость

### on-run-start и on-run-end

Специальная переменная Jinja `{{this}}` больше не поддерживается для хуков `on-run-start` и `on-run-end`.

Вместо этого используйте переменную из [контекста `{{ target }}`](/reference/dbt-jinja-functions/target) или [контекста `on-run-end`](/reference/dbt-jinja-functions/on-run-end-context).

### Методы адаптера

Некоторые методы адаптера, специфичные для материализации, изменились таким образом, что это нарушает совместимость. Если вы используете эти методы адаптера в своих макросах или <Term id="materialization">материализациях</Term>, возможно, вам потребуется обновить ваш код.
  - query_for_existing - **удален**, вместо него используйте [get_relation](/reference/dbt-jinja-functions/adapter#get_relation).
  - [get_missing_columns](/reference/dbt-jinja-functions/adapter#get_missing_columns) - изменен, теперь принимает `Relation` вместо схем и идентификаторов
  - [expand_target_column_types](/reference/dbt-jinja-functions/adapter#expand_target_column_types) - изменен, теперь принимает `Relation` вместо схемы, идентификатора
  - [get_relation](/reference/dbt-jinja-functions/adapter#get_relation) - добавлен аргумент `database`
  - [create_schema](/reference/dbt-jinja-functions/adapter#create_schema) - добавлен аргумент `database`
  - [drop_schema](/reference/dbt-jinja-functions/adapter#drop_schema) - добавлен аргумент `database`

## Конец поддержки

Спецификации schema.yml версии 1 (устаревшие с 0.11.0) больше не поддерживаются. Пожалуйста, используйте спецификацию версии 2.

См. [руководство по миграции 0.11.0](upgrading-to-0-11-0.md#schemayml-v2-syntax) для получения подробностей.