---
title: Настройка базы данных, схемы и алиаса моделей dbt
id: customize-schema-alias
description: "Узнайте, как правильно настраивать макросы generate_schema_name() и generate_alias_name()."
displayText: Узнайте, как настраивать generate schema name и generate alias name.
hoverSnippet: Узнайте, как настраивать generate schema name и generate alias name.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
level: 'Advanced'
keywords: ["generate", "schema name", "guide", "dbt", "schema customization", "custom schema"]
---

<div style={{maxWidth: '900px'}}>

## Введение
Это руководство объясняет, как настраивать соглашения об именовании [схем](/docs/build/custom-schemas), [баз данных](/docs/build/custom-databases) и [алиасов](/docs/build/custom-aliases) в dbt, чтобы они соответствовали требованиям управления и дизайна вашего хранилища данных.  
Когда мы разрабатываем модели dbt и выполняем определённые [команды](/reference/dbt-commands) (например, `dbt run` или `dbt build`), объекты (такие как таблицы и представления) создаются в хранилище данных в соответствии с этими соглашениями об именовании.

:::info Немного о терминологии

Разные хранилища данных используют разные названия для _логических баз данных_. Информация в этом документе относится к «databases» в Snowflake, Redshift и Postgres; «projects» в BigQuery; и «catalogs» в Databricks Unity Catalog.

:::

Ниже описано поведение dbt «из коробки» по умолчанию:

- База данных, в которой создаётся объект, определяется настройкой database, заданной на [уровне окружения в <Constant name="cloud" />](/docs/dbt-cloud-environments) или в [файле `profiles.yml`](/docs/core/connect-data-platform/profiles.yml) в dbt Core.

- Схема зависит от того, определена ли для модели [кастомная схема](/docs/build/custom-schemas):
    - Если кастомная схема не определена, dbt создаёт объект в схеме по умолчанию. В <Constant name="cloud" /> это обычно `dbt_username` для разработки и схема по умолчанию для окружений деплоя. В dbt Core используется схема, указанная в файле `profiles.yml`.
    - Если кастомная схема определена, dbt конкатенирует ранее упомянутую схему с кастомной.
    - Например, если сконфигурированная схема — `dbt_myschema`, а кастомная — `marketing`, объекты будут созданы в `dbt_myschema_marketing`.
    - Обратите внимание, что для автоматизированных CI-задач имя схемы формируется на основе номера джобы и номера PR: `dbt_cloud_pr_<job_id>_<pr_id>`.

- Имя объекта зависит от того, задан ли [алиас](/reference/resource-configs/alias) для модели:
    - Если алиас не задан, объект будет создан с тем же именем, что и модель, без суффикса `.sql` или `.py`.
        - Например, если у нас есть модель с SQL-файлом `fct_orders_complete.sql`, кастомной схемой `marketing` и без кастомного алиаса, итоговая модель будет создана как `dbt_myschema_marketing.fct_orders_complete` в dev-окружении.
    - Если алиас задан, объект будет создан с указанным алиасом.
    - Например, если SQL-файл называется `fct_orders_complete.sql`, кастомная схема — `marketing`, а алиас задан как `fct_orders`, итоговая модель будет создана как `dbt_myschema_marketing.fct_orders`.

Эти правила по умолчанию являются отличной отправной точкой, и многие организации выбирают использовать их без какой-либо дополнительной кастомизации.

Значения по умолчанию позволяют разработчикам работать в изолированных схемах (sandbox) и не перезаписывать работу друг друга — даже если они работают с одними и теми же таблицами.

## Как настроить это поведение

Хотя поведение по умолчанию подходит большинству организаций, бывают случаи, когда такой подход не работает.

Например, dbt предполагает, что у него есть права на создание схем по мере необходимости (и мы рекомендуем, чтобы пользователи, запускающие dbt, имели такие права), но в вашей компании это может быть запрещено.

Или, в зависимости от архитектуры вашего хранилища, вы можете захотеть минимизировать количество схем в dev-окружении (и избежать разрастания схем за счёт отказа от создания комбинаций всех пользовательских схем и кастомных схем).

В качестве альтернативы, вы можете захотеть, чтобы dev-схемы назывались по имени feature-ветки, а не по имени разработчика.

По этой причине dbt предоставляет три макроса для настройки того, где именно объекты создаются в хранилище данных:

- [`generate_database_name()`](/docs/build/custom-databases#generate_database_name)
- [`generate_schema_name()`](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name)
- [`generate_alias_name()`](/docs/build/custom-aliases#generate_alias_name)

Переопределяя один или несколько из этих макросов, мы можем настроить размещение объектов dbt в хранилище данных и привести его в соответствие с любыми существующими требованиями.

:::note Ключевая концепция

Модели, запускаемые из разных контекстов, должны приводить к созданию уникальных объектов в хранилище данных.  
Например, разработчик Suzie работает над улучшениями `fct_player_stats`, а Darren разрабатывает тот же самый объект.

Чтобы предотвратить перезапись работы друг друга, и Suzie, и Darren должны иметь собственные уникальные версии `fct_player_stats` в dev-окружении.

Кроме того, staging-версия `fct_player_stats` должна существовать в уникальном месте, отличном от dev-версий и production-версии.

:::

При кастомизации этих макросов мы часто используем следующее:

- В <Constant name="cloud" /> мы рекомендуем использовать [переменные окружения](/docs/build/environment-variables) для определения того, где именно выполняется вызов dbt (dev/stg/prod).
    - Их можно задавать на уровне окружения, и все джобы автоматически унаследуют значения по умолчанию. Мы добавим Jinja-логику (`if/else/endif`) для определения, происходит ли запуск в dev, prod, CI и т.д.
- В качестве альтернативы переменным окружения можно использовать `target.name`. Подробнее см. [About target variables](/reference/dbt-jinja-functions/target).

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/custom-schema-env-var.png" title="Переменные окружения для кастомной схемы и target name." />

Чтобы имя базы данных / схемы / объекта зависело от текущей ветки, можно использовать готовую переменную окружения `DBT_CLOUD_GIT_BRANCH` из [специальных переменных окружения](/docs/build/environment-variables#special-environment-variables) в <Constant name="cloud" />.

## Примеры сценариев использования

Ниже приведены типичные примеры, с которыми мы сталкивались у пользователей dbt, применяющих эти 3 макроса с различной логикой.

:::note

Обратите внимание, что следующие примеры не являются исчерпывающими и не покрывают все возможные варианты. Они предназначены как шаблоны для разработки собственных правил.

:::

- [Использование кастомной схемы без конкатенации target-схемы в production](/guides/customize-schema-alias?step=3#1-custom-schemas-without-target-schema-concatenation-in-production)
- [Добавление идентификаторов разработчиков к таблицам](/guides/customize-schema-alias?step=3#2-static-schemas-add-developer-identities-to-tables)
- [Использование имени ветки в качестве префикса схемы](/guides/customize-schema-alias?step=3#3-use-branch-name-as-schema-prefix)
- [Использование статической схемы для CI](/guides/customize-schema-alias?step=3#4-use-a-static-schema-for-ci)

### 1. Кастомные схемы без конкатенации target-схемы в production

Наиболее распространённый сценарий — использование кастомной схемы без конкатенации с именем схемы по умолчанию в production.

Для этого можно создать новый файл `generate_schema_name.sql` в папке macros со следующим кодом:

<File name='macros/generate_schema_name.sql'>

```jinja
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- elif  env_var('DBT_ENV_TYPE','DEV') == 'PROD' -%}
        
        {{ custom_schema_name | trim }}

    {%- else -%}

        {{ default_schema }}_{{ custom_schema_name | trim }}

    {%- endif -%}

{%- endmacro %}
```
</File>

Данный подход сгенерирует следующие результаты для модели `my_model` с кастомной схемой `marketing`, предотвращая пересечения объектов между запусками dbt из разных контекстов.

| Context     |Target database| Target schema | Resulting object               |
|-------------|:-------------:|:-------------:|:------------------------------:|
| Developer 1 | dev           | dbt_dev1      |dev.dbt_dev1_marketing.my_model  |
| Developer 2 | dev           | dbt_dev2      |dev.dbt_dev2_marketing.my_model  |
| CI PR 123   | ci            | dbt_pr_123    |ci.dbt_pr_123_marketing.my_model|
| CI PR 234   | ci            | dbt_pr_234    |ci.dbt_pr_234_marketing.my_model|
| Production  | prod          | analytics     |prod.marketing.my_model         |

:::note

Мы добавили логику проверки, выполняется ли текущий запуск dbt в production. Это важно, и мы объясняем почему в разделе [What not to do](/guides/customize-schema-alias?step=3#what-not-to-do).

:::

### 2. Статические схемы: добавление идентификаторов разработчиков к таблицам

Иногда мы сталкиваемся с ситуациями, когда политика безопасности организации запрещает разработчикам создавать схемы, и все разработчики вынуждены работать в одной общей схеме.

В этом случае можно:

- Создать новый файл `generate_schema_name.sql` в папке macros со следующим кодом.
- Изменить `generate_schema_name()` так, чтобы использовалась одна схема для всех разработчиков, даже если задана кастомная схема.
- Обновить `generate_alias_name()`, чтобы в dev-окружении добавлять алиас разработчика и кастомную схему в начало имени таблицы.
    - Этот метод не идеален, так как приводит к длинным именам таблиц, но позволяет разработчикам видеть, в какой схеме модель будет создана в production.

<File name='macros/generate_schema_name.sql'>

```jinja
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- elif  env_var('DBT_ENV_TYPE','DEV') != 'CI' -%}
        
        {{ custom_schema_name | trim }}

    {%- else -%}

        {{ default_schema }}_{{ custom_schema_name | trim }}

    {%- endif -%}

{%- endmacro %}
```
</File>

<File name='macros/generate_alias_name.sql'>

```jinja
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}

    {%- if  env_var('DBT_ENV_TYPE','DEV') == 'DEV' -%}

        {%- if custom_alias_name -%}

            {{ target.schema }}__{{ custom_alias_name | trim }}

        {%- elif node.version -%}

            {{ target.schema }}__{{ node.name ~ "_v" ~ (node.version | replace(".", "_")) }}

        {%- else -%}

            {{ target.schema }}__{{ node.name }}

        {%- endif -%}
    
    {%- else -%}

        {%- if custom_alias_name -%}

            {{ custom_alias_name | trim }}

        {%- elif node.version -%}

            {{ return(node.name ~ "_v" ~ (node.version | replace(".", "_"))) }}

        {%- else -%}

            {{ node.name }}

        {%- endif -%}

    {%- endif -%}

{%- endmacro %}
```
</File>

Данный подход сгенерирует следующие результаты для модели `my_model` с кастомной схемой `marketing`, предотвращая пересечения объектов между запусками dbt из разных контекстов.

| Context     |Target database| Target schema | Resulting object               |
|-------------|:-------------:|:-------------:|:------------------------------:|
| Developer 1 | dev           | dbt_dev1      |dev.marketing.dbt_dev1_my_model |
| Developer 2 | dev           | dbt_dev2      |dev.marketing.dbt_dev2_my_model  |
| CI PR 123   | ci            | dbt_pr_123    |ci.dbt_pr_123_marketing.my_model|
| CI PR 234   | ci            | dbt_pr_234    |ci.dbt_pr_234_marketing.my_model|
| Production  | prod          | analytics     |prod.marketing.my_model         |

### 3. Использование имени ветки в качестве префикса схемы

Для команд, которые предпочитают изолировать работу по feature-веткам, можно воспользоваться специальной переменной окружения `DBT_CLOUD_GIT_BRANCH`. Обратите внимание, что разработчики будут писать в одну и ту же схему, если они находятся в одной и той же feature-ветке.

:::note

Переменная `DBT_CLOUD_GIT_BRANCH` доступна только в <Constant name="cloud_ide" />, но не в <Constant name="cloud_cli" />.

:::

Мы также встречали организации, которые предпочитают организовывать dev-базы данных по имени ветки. Для этого требуется реализовать аналогичную логику в `generate_database_name()`, а не в макросе `generate_schema_name()`. По умолчанию dbt не создаёт базы данных автоматически.

Подробнее см. в разделе [Tips and tricks](/guides/customize-schema-alias?step=5).

<File name='macros/generate_schema_name.sql'>

```jinja
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if  env_var('DBT_ENV_TYPE','DEV') == 'DEV' -%}
    
        {#- we replace characters not allowed in the schema names by "_" -#}
        {%- set re = modules.re -%}
        {%- set cleaned_branch = re.sub("\W", "_", env_var('DBT_CLOUD_GIT_BRANCH')) -%}
        
        {%- if custom_schema_name is none -%}

            {{ cleaned_branch }}

        {%- else -%}

             {{ cleaned_branch }}_{{ custom_schema_name | trim }}

        {%- endif -%}
        
    {%- else -%}

        {{ default_schema }}_{{ custom_schema_name | trim }}

    {%- endif -%}

{%- endmacro %}
```
</File>

Данный подход сгенерирует следующие результаты для модели `my_model` с кастомной схемой `marketing`, предотвращая пересечения объектов между запусками dbt из разных контекстов.

| Context     |Branch      |Target database| Target schema | Resulting object                  |
|-------------|:----------:|:-------------:|:-------------:|:---------------------------------:|
| Developer 1 |`featureABC`|dev            | dbt_dev1      |dev.featureABC_marketing.my_model  |
| Developer 2 |`featureABC`|dev            | dbt_dev2      |dev.featureABC_marketing.my_model  |
| Developer 1 |`feature123`|dev            | dbt_dev1      |dev.feature123_marketing.my_model  |
| CI PR 123   |            |ci             | dbt_pr_123    |ci.dbt_pr_123_marketing.my_model   |
| CI PR 234   |            |ci             | dbt_pr_234    |ci.dbt_pr_234_marketing.my_model   |
| Production  |            |prod           | analytics     |prod.marketing.my_model           |

Когда developer 1 и developer 2 находятся на одной и той же ветке, они будут генерировать один и тот же объект в хранилище данных. Это не является проблемой, так как нахождение на одной ветке означает, что код модели будет одинаковым для обоих разработчиков.

### 4. Использование статической схемы для CI

Некоторые организации предпочитают писать результаты CI-задач в одну статическую схему, добавляя идентификатор PR в начало имени таблицы. Важно отметить, что это приводит к длинным именам таблиц.

Для этого можно создать новый файл `generate_schema_name.sql` в папке macros со следующим кодом:

<File name='macros/generate_schema_name.sql'>

```jinja
{% macro generate_schema_name(custom_schema_name=none, node=none) -%}

    {%- set default_schema = target.schema -%}
    
    {# If the CI Job does not exist in its own environment, use the target.name variable inside the job instead #}
    {# {%- if target.name == 'CI' -%} #} 
    
    {%- if env_var('DBT_ENV_TYPE','DEV') == 'CI' -%}
        
        ci_schema
        
    {%- elif custom_schema_name is none -%}
        
        {{ default_schema }}
    
    {%- else -%}
        
        {{ default_schema }}_{{ custom_schema_name | trim }}
    
    {%- endif -%}    

{%- endmacro %}
```
</File>

<File name='macros/generate_alias_name.sql'>

```jinja
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}

    {# If the CI Job does not exist in its own environment, use the target.name variable inside the job instead #}
    {# {%- if target.name == 'CI' -%} #}   
    {%- if  env_var('DBT_ENV_TYPE','DEV') == 'CI' -%}

        {%- if custom_alias_name -%}

            {{ target.schema }}__{{ node.config.schema }}__{{ custom_alias_name | trim }}

        {%- elif node.version -%}

            {{ target.schema }}__{{ node.config.schema }}__{{ node.name ~ "_v" ~ (node.version | replace(".", "_")) }}

        {%- else -%}

            {{ target.schema }}__{{ node.config.schema }}__{{ node.name }}

        {%- endif -%}
    
    {%- else -%}

        {%- if custom_alias_name -%}

            {{ custom_alias_name | trim }}

        {%- elif node.version -%}

            {{ return(node.name ~ "_v" ~ (node.version | replace(".", "_"))) }}

        {%- else -%}

            {{ node.name }}

        {%- endif -%}

    {%- endif -%}

{%- endmacro %}
```
</File>

Данный подход сгенерирует следующие результаты для модели `my_model` с кастомной схемой `marketing`, предотвращая пересечения объектов между запусками dbt из разных контекстов.

| Context     |Target database| Target schema | Resulting object                          |
|-------------|:-------------:|:-------------:|:----------------------------------------: |
| Developer 1 | dev           | dbt_dev1      |dev.dbt_dev1_marketing.my_model            |
| Developer 2 | dev           | dbt_dev2      |dev.dbt_dev2_marketing.my_model            |
| CI PR 123   | ci            | dbt_pr_123    |ci.ci_schema.dbt_pr_123_marketing_my_model |
| CI PR 234   | ci            | dbt_pr_234    |ci.ci_schema.dbt_pr_234_marketing_my_model |
| Production  | prod          | analytics     |prod.marketing.my_model                    |

## Чего делать не стоит

В этом разделе описано, каких действий следует избегать при настройке схем и алиасов из‑за возможных проблем.

### Обновление generate_schema_name() так, чтобы всегда использовать кастомную схему

Некоторые предпочитают использовать только кастомную схему, если она задана, вместо конкатенации схемы по умолчанию с кастомной, как это происходит в поведении «из коробки».

### Проблема

При изменении стандартного макроса `generate_schema_name()` это может привести к созданию следующей версии:

<File name='macros/generate_schema_name.sql'>

```jinja
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- else -%}
    # The following is incorrect as it omits {{ default_schema }} before {{ custom_schema_name | trim }}. 
        {{ custom_schema_name | trim }} 

    {%- endif -%}

{%- endmacro %}
```
</File>

Хотя это может давать ожидаемый результат в production, где используется выделенная база данных, такое решение приведёт к конфликтам везде, где несколько людей используют одну и ту же базу данных.

Рассмотрим пример модели `my_model` с кастомной схемой `marketing`.

| Context     |Target database| Target schema | Resulting object               |
|-------------|:-------------:|:-------------:|:------------------------------:|
| Production  | prod          | analytics     |prod.marketing.my_model         |
| Developer 1 | dev           | dbt_dev1      |dev.marketing.my_model          |
| Developer 2 | dev           | dbt_dev2      |dev.marketing.my_model          |
| CI PR 123   | ci            | dbt_pr_123    |ci.marketing.my_model           |
| CI PR 234   | ci            | dbt_pr_234    |ci.marketing.my_model           |

Мы видим, что и developer 1, и developer 2 получают один и тот же объект `my_model`. Это означает, что при одновременной работе над моделью невозможно понять, чья версия сейчас находится в хранилище данных.

Аналогично, разные PR будут приводить к созданию одного и того же объекта в хранилище данных. Если несколько PR открыты одновременно и изменяют одни и те же модели, с высокой вероятностью возникнут проблемы, замедляющие разработку и продвижение кода.

### Решение

Как описано в предыдущем примере, необходимо обновить макрос так, чтобы он проверял, выполняется ли dbt в production. Только в production следует убирать конкатенацию и использовать одну лишь кастомную схему.

## Советы и рекомендации

В этом разделе приведены полезные советы по корректной настройке макросов `generate_database_name()` и `generate_alias_name()`.

### Создание несуществующих баз данных из dbt

dbt автоматически пытается создать схему, если она не существует и если в неё нужно создать объект, но он не пытается автоматически создавать базу данных, если она не существует.

Поэтому, если ваша конфигурация `generate_database_name()` указывает на разные базы данных, которые могут отсутствовать, dbt завершится ошибкой при выполнении простого `dbt build`.

Тем не менее, это можно реализовать, создав макросы, которые будут проверять существование базы данных и создавать её при необходимости. Такие макросы можно вызывать либо в шаге [`dbt run-operation ...`](/reference/commands/run-operation) в джобах, либо как [`on-run-start` hook](/reference/project-configs/on-run-start-on-run-end).

### Определение контекста через переменные окружения, а не через `target.name`

Мы предпочитаем использовать [переменные окружения](/docs/build/environment-variables) вместо `target.name`. Для более детального понимания см. [About target variables](/reference/dbt-jinja-functions/target).

- `target.name` нельзя задать на уровне окружения. Поэтому каждая джоба внутри окружения должна явно указывать переопределение `target.name`. Если в джобе не задано корректное значение `target.name`, база данных / схема / алиас могут быть вычислены неверно. В отличие от этого, значения переменных окружения наследуются всеми джобами в соответствующем окружении и при необходимости могут быть переопределены на уровне джобы.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/custom-schema-env-var-targetname.png" title="Настройка алиаса схемы через env var."/>

- `target.name` требует, чтобы каждый разработчик вводил одно и то же значение (часто `dev`) в поле target name в своих credentials для разработки. Если разработчик не задал корректное значение, база данных / схема / алиас могут быть вычислены неправильно.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/development-credentials.png" title="Учётные данные для разработки." width="60%" />

### Всегда требовать указания кастомных схем

Некоторые пользователи предпочитают принудительно задавать кастомные схемы для всех объектов в проекте. Это позволяет избежать записи в нежелательные «дефолтные» локации. Вы можете добавить соответствующую логику в макрос `generate_schema_name()`, чтобы [вызывать ошибку компиляции](/reference/dbt-jinja-functions/exceptions), если кастомная схема для объекта не определена.

<File name='macros/generate_schema_name.sql'>

```jinja
 {% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- set node_custom_schema = node.config.get('schema') -%}
    
    {%- if custom_schema_name is none and node_custom_schema is none and node.resource_type == 'model' -%}
        
        {{ exceptions.raise_compiler_error("Error: No Custom Schema Defined for the model " ~ node.name ) }}
    
    {%- elif custom_schema_name is none -%}

        {{ default_schema }}

    {%- elif env_var('DBT_ENV_TYPE','DEV') == 'PROD' -%}
        
        {{ custom_schema_name | trim }}

    {%- else -%}

        {{ default_schema }}_{{ custom_schema_name | trim }}

    {%- endif -%}

{%- endmacro %}
```
</File>

</div>
