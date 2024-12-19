---
title: Отладка имен схем
id: debug-schema-names
description: Узнайте, как отлаживать имена схем, когда модели создаются в неожиданных схемах.
displayText: Отладка имен схем
hoverSnippet: Узнайте, как отлаживать имена схем в dbt.
# time_to_complete: '30 minutes' закомментировано до тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Core','Устранение неполадок']
level: 'Продвинутый'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Если модель использует [`schema` config](/reference/resource-properties/schema), но создается в неожиданной схеме, вот несколько шагов для отладки проблемы. Полное объяснение пользовательских схем можно найти [здесь](/docs/build/custom-schemas).

Вы также можете следить за процессом через это видео:

<LoomVideo id="1c6e33b504da432dbd07c4cb7f35478e" />

## Поиск макроса с именем `generate_schema_name`
Проведите поиск по файлам, чтобы проверить, есть ли у вас макрос с именем `generate_schema_name` в директории `macros` вашего проекта.

### У вас нет макроса с именем `generate_schema_name` в вашем проекте
Это означает, что вы используете стандартную реализацию макроса dbt, как определено [здесь](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/get_custom_name/get_custom_schema.sql).

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- else -%}

        {{ default_schema }}_{{ custom_schema_name | trim }}

    {%- endif -%}

{%- endmacro %}
```

Обратите внимание, что эта логика разработана так, чтобы два пользователя dbt случайно не перезаписывали работу друг друга, записывая в одну и ту же схему.

### У вас есть макрос `generate_schema_name` в проекте, который вызывает другой макрос
Если ваш макрос `generate_schema_name` выглядит следующим образом:
```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {{ generate_schema_name_for_env(custom_schema_name, node) }}
{%- endmacro %}
```
Ваш проект заменяет макрос `generate_schema_name` на другой макрос, `generate_schema_name_for_env`. Подобно приведенному выше примеру, это макрос, который определен в глобальном проекте dbt, [здесь](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt/include/global_project/macros/get_custom_name/get_custom_schema.sql).
```sql
{% macro generate_schema_name_for_env(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if target.name == 'prod' and custom_schema_name is not none -%}

        {{ custom_schema_name | trim }}

    {%- else -%}

        {{ default_schema }}

    {%- endif -%}

{%- endmacro %}
```
### У вас есть макрос `generate_schema_name` с пользовательской логикой

Если это так — возможно, стоит обратиться к человеку, который добавил этот макрос в ваш проект, так как у него будет контекст по этому вопросу — вы можете использовать [функцию blame на GitHub](https://docs.github.com/en/free-pro-team@latest/github/managing-files-in-a-repository/tracking-changes-in-a-file), чтобы сделать это.

Во всех случаях уделите время, чтобы прочитать Jinja и попытаться понять логику.


## Подтвердите вашу конфигурацию `schema`
Проверьте, используете ли вы [`schema` config](/reference/resource-properties/schema) в вашей модели, либо через блок `{{ config() }}`, либо из `dbt_project.yml`. В обоих случаях dbt передает это значение как параметр `custom_schema_name` макроса `generate_schema_name`.


## Подтвердите ваши целевые значения
Большинство макросов `generate_schema_name` включают логику из переменной [`target` variable](/reference/dbt-jinja-functions/target), в частности `target.schema` и `target.name`. Используйте документацию [здесь](/reference/dbt-jinja-functions/target), чтобы помочь вам найти значения каждого ключа в этом словаре.


## Соедините два элемента

Теперь еще раз прочитайте логику вашего макроса `generate_schema_name` и мысленно подставьте ваши значения `custom_schema_name` и `target`.

Вы должны обнаружить, что схема, которую dbt создает для вашей модели, соответствует результату вашего макроса `generate_schema_name`.

Будьте осторожны. Снимки не следуют этому поведению, если установлен target_schema. Чтобы иметь осведомленные о среде снимки в v1.9+ или dbt Cloud, удалите [target_schema config](/reference/resource-configs/target_schema) из ваших снимков. Если вы все еще хотите иметь пользовательскую схему для ваших снимков, используйте вместо этого [`schema`](/reference/resource-configs/schema) config.

## Настройте по мере необходимости

Теперь, когда вы понимаете, как генерируется схема модели, вы можете настроить по мере необходимости:
- Вы можете изменить логику в вашем макросе `generate_schema_name` (или добавить этот макрос в ваш проект, если у вас его еще нет, и настроить его оттуда)
- Вы также можете изменить детали вашего `target` (например, изменить имя целевого объекта)

Если вы измените логику в `generate_schema_name`, важно учитывать, будут ли два пользователя в конечном итоге записывать в одну и ту же схему при разработке моделей dbt. Это соображение является причиной, по которой стандартная реализация макроса объединяет вашу целевую схему и пользовательскую схему — мы обещаем, что старались быть полезными, реализуя это поведение, но признаем, что полученное имя схемы неинтуитивно.

</div>