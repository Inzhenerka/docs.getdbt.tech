---
title: "Обновление до 0.13.0"
id: "upgrading-to-0-13-0"
displayed_sidebar: "docs"
---

## Ломающие изменения

### on-run-start и on-run-end

Специальная переменная Jinja `{{this}}` больше не поддерживается в хуках `on-run-start` и `on-run-end`.

Вместо этого используйте переменную из контекста [`{{ target }}`](/reference/dbt-jinja-functions/target) или [`on-run-end` контекста](/reference/dbt-jinja-functions/on-run-end-context).

### Методы адаптера

Некоторые методы адаптера, специфичные для материализации, изменились ломающе. Если вы используете эти методы адаптера в своих макросах или <Term id="materialization">материализациях</Term>, вам может потребоваться обновить ваш код соответствующим образом.
  - query_for_existing - **удален**, используйте [get_relation](/reference/dbt-jinja-functions/adapter#get_relation) вместо этого.
  - [get_missing_columns](/reference/dbt-jinja-functions/adapter#get_missing_columns) - изменен для работы с `Relation` вместо схем и идентификаторов
  - [expand_target_column_types](/reference/dbt-jinja-functions/adapter#expand_target_column_types) - изменен для работы с `Relation` вместо схемы, идентификатора
  - [get_relation](/reference/dbt-jinja-functions/adapter#get_relation) - добавлен аргумент `database`
  - [create_schema](/reference/dbt-jinja-functions/adapter#create_schema) - добавлен аргумент `database`
  - [drop_schema](/reference/dbt-jinja-functions/adapter#drop_schema) - добавлен аргумент `database`

## Окончание поддержки

Спецификации schema.yml версии 1 (устаревшие в 0.11.0) больше не поддерживаются. Пожалуйста, используйте спецификацию версии 2 вместо этого.

Смотрите [руководство по миграции 0.11.0](upgrading-to-0-11-0.md#schemayml-v2-syntax) для получения подробной информации.