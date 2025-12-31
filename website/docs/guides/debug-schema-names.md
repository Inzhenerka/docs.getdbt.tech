---
title: Отладка имен схем
id: debug-schema-names
description: Узнайте, как отлаживать имена схем, когда модели создаются в неожиданных схемах.
displayText: Отладка имен схем
hoverSnippet: Узнайте, как отлаживать имена схем в dbt.
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Core','Troubleshooting']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

Если модель использует [конфигурацию `schema`](/reference/resource-properties/schema), но создается в неожиданной схеме, вот несколько шагов для отладки этой проблемы. Полное объяснение пользовательских схем можно найти [здесь](/docs/build/custom-schemas).

Вы также можете следовать за видео:

<LoomVideo id="1c6e33b504da432dbd07c4cb7f35478e" />

## Поиск макроса с именем `generate_schema_name` {#search-for-a-macro-named-generateschemaname}
Выполните поиск файлов, чтобы проверить, есть ли у вас макрос с именем `generate_schema_name` в каталоге `macros` вашего проекта.

### У вас нет макроса с именем `generate_schema_name` в вашем проекте {#you-do-not-have-a-macro-named-generateschemaname-in-your-project}
Это означает, что вы используете реализацию макроса по умолчанию от dbt, как определено [здесь](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/get_custom_name/get_custom_schema.sql)

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

Обратите внимание, что эта логика разработана так, чтобы два пользователя dbt случайно не перезаписали работу друг друга, записывая в одну и ту же схему.

### У вас есть макрос `generate_schema_name` в проекте, который вызывает другой макрос {#you-have-a-generateschemaname-macro-in-a-project-that-calls-another-macro}
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
### У вас есть макрос `generate_schema_name` с пользовательской логикой {#you-have-a-generateschemaname-macro-with-custom-logic}

Если это так — возможно, стоит обратиться к человеку, который добавил этот макрос в ваш проект, так как у него будет контекст — вы можете использовать [функцию blame на GitHub](https://docs.github.com/en/free-pro-team@latest/github/managing-files-in-a-repository/tracking-changes-in-a-file) для этого.

Во всех случаях уделите время, чтобы прочитать Jinja и попытаться следовать логике.


## Подтвердите вашу конфигурацию `schema` {#confirm-your-schema-config}
Проверьте, используете ли вы [конфигурацию `schema`](/reference/resource-properties/schema) в вашей модели, либо через блок `{{ config() }}`, либо из `dbt_project.yml`. В обоих случаях dbt передает это значение как параметр `custom_schema_name` макроса `generate_schema_name`.


## Подтвердите ваши значения target {#confirm-your-target-values}
Большинство макросов `generate_schema_name` включают логику из [переменной `target`](/reference/dbt-jinja-functions/target), в частности `target.schema` и `target.name`. Используйте документацию [здесь](/reference/dbt-jinja-functions/target), чтобы помочь вам найти значения каждого ключа в этом словаре.


## Объедините все вместе {#put-the-two-together}

Теперь перечитайте логику вашего макроса `generate_schema_name` и мысленно подставьте ваши значения `customer_schema_name` и `target`.

Вы должны обнаружить, что схема, которую dbt создает для вашей модели, соответствует выходным данным вашего макроса `generate_schema_name`.

Будьте внимательны. Снэпшоты **не** следуют этому поведению, если задан параметр `target_schema`. Чтобы снэпшоты учитывали окружение в версии v1.9+ или <Constant name="cloud" />, удалите конфигурацию [`target_schema`](/reference/resource-configs/target_schema) из ваших снэпшотов. Если вам всё же нужна собственная схема для снэпшотов, используйте вместо этого параметр [`schema`](/reference/resource-configs/schema).

## Настройте по мере необходимости {#adjust-as-necessary}

Теперь, когда вы понимаете, как генерируется схема модели, вы можете настроить ее по мере необходимости:
- Вы можете настроить логику в вашем макросе `generate_schema_name` (или добавить этот макрос в ваш проект, если у вас его еще нет, и настроить оттуда)
- Вы также можете настроить детали вашего `target` (например, изменить имя цели)

Если вы измените логику в `generate_schema_name`, важно учитывать, не будут ли два пользователя записывать в одну и ту же схему при разработке моделей dbt. Это соображение является причиной, по которой реализация макроса по умолчанию объединяет вашу целевую схему и пользовательскую схему вместе — мы обещаем, что пытались быть полезными, реализуя это поведение, но признаем, что полученное имя схемы неинтуитивно.

</div>