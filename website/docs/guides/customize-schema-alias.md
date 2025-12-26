---
title: Настройка базы данных, схемы и псевдонима моделей dbt
id: customize-schema-alias
description: "Узнайте, как правильно настроить макросы generate_schema_name() и generate_alias_name()."
displayText: Узнайте, как настроить генерацию имени схемы и псевдонима.
hoverSnippet: Узнайте, как настроить генерацию имени схемы и псевдонима.
icon: 'guides'
hide_table_of_contents: true
level: 'Advanced'
keywords: ["generate", "schema name", "guide", "dbt", "schema customization", "custom schema"]
---

<div style={{maxWidth: '900px'}}>

## Introduction
В этом руководстве объясняется, как настроить соглашения об именовании для [schema](/docs/build/custom-schemas), [database](/docs/build/custom-databases) и [alias](/docs/build/custom-aliases) в dbt в соответствии с требованиями управления данными и архитектурой вашего хранилища данных.

Когда мы разрабатываем модели dbt и выполняем определённые [commands](/reference/dbt-commands) (такие как `dbt run` или `dbt build`), объекты (например, таблицы и представления) создаются в хранилище данных на основе этих соглашений об именовании.

:::info Несколько слов об именовании

Разные хранилища данных имеют разные названия для _логических баз данных_. Информация в этом документе охватывает "базы данных" в Snowflake, Redshift и Postgres; "проекты" в BigQuery; и "каталоги" в Databricks Unity Catalog.

:::

Следующее поведение является стандартным для dbt:

- База данных, в которой создается объект, определяется базой данных, настроенной на [уровне окружения в dbt Cloud](/docs/dbt-cloud-environments) или в файле [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) в dbt Core.

- База данных, в которой создаётся объект, определяется базой данных, настроенной:
  - на [уровне окружения в <Constant name="cloud" />](/docs/dbt-cloud-environments), или  
  - в [файле `profiles.yml`](/docs/core/connect-data-platform/profiles.yml) в dbt Core.

- Схема зависит от того, определили ли вы [пользовательскую схему](/docs/build/custom-schemas) для модели:
    - Если пользовательская схема не определена, dbt создаёт объект в схеме по умолчанию. В <Constant name="cloud" /> это обычно `dbt_username` для среды разработки и схема по умолчанию для сред деплоя. В dbt Core используется схема, указанная в файле `profiles.yml`.
    - Если вы определяете пользовательскую схему, dbt конкатенирует ранее упомянутую схему с пользовательской.
    - Например, если настроенная схема — `dbt_myschema`, а пользовательская — `marketing`, объекты будут созданы в схеме `dbt_myschema_marketing`.
    - Обратите внимание, что для автоматизированных CI-задач имя схемы формируется на основе номера задачи и номера PR: `dbt_cloud_pr_<job_id>_<pr_id>`.

Эти стандартные правила являются отличной отправной точкой, и многие организации предпочитают придерживаться их без необходимости в настройке.

- Имя объекта зависит от того, задан ли для модели [alias](/reference/resource-configs/alias):
    - Если alias не задан, объект будет создан с тем же именем, что и модель, без расширения `.sql` или `.py` в конце.
        - Например, предположим, что у нас есть модель, где SQL‑файл называется `fct_orders_complete.sql`, пользовательская схема — `marketing`, и пользовательский alias не настроен. В результате модель будет создана как `dbt_myschema_marketing.fct_orders_complete` в dev‑окружении.
    - Если alias задан, объект будет создан с использованием настроенного alias.
    - Например, предположим, что у нас есть модель, где SQL‑файл называется `fct_orders_complete.sql`, пользовательская схема — `marketing`, и alias настроен как `fct_orders`. В результате модель будет создана как `dbt_myschema_marketing.fct_orders`.

## Как настроить это поведение

Хотя стандартное поведение удовлетворит потребности большинства организаций, бывают случаи, когда этот подход не сработает.

Например, dbt ожидает, что у него есть разрешение на создание схем по мере необходимости (и мы рекомендуем, чтобы пользователи, запускающие dbt, имели такую возможность), но это может быть не разрешено в вашей компании.

Или, в зависимости от того, как вы спроектировали свое хранилище, вы можете захотеть минимизировать количество схем в вашей среде разработки (и избежать разрастания схем, не создавая комбинацию всех схем разработчиков и пользовательских схем).

Кроме того, вы можете даже захотеть, чтобы ваши схемы разработки назывались в честь веток функций, а не имени разработчика.

По этой причине dbt предлагает три макроса для настройки того, какие объекты создаются в хранилище данных:

- [`generate_database_name()`](/docs/build/custom-databases#generate_database_name)
- [`generate_schema_name()`](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name)
- [`generate_alias_name()`](/docs/build/custom-aliases#generate_alias_name)

Переопределяя один или несколько из этих макросов, мы можем настроить, где создаются объекты dbt в хранилище данных, и согласовать это с любыми существующими требованиями.

:::note Ключевая концепция

Модели, запускаемые из двух разных контекстов, должны приводить к уникальным объектам в хранилище данных. Например, разработчик по имени Сьюзи работает над улучшениями `fct_player_stats`, но Даррен разрабатывает тот же самый объект.

Чтобы предотвратить перезапись работы друг друга, и Сьюзи, и Даррен должны иметь свои уникальные версии `fct_player_stats` в среде разработки.

Кроме того, промежуточная версия `fct_player_stats` должна существовать в уникальном месте, отдельно от версий разработки и производства.

:::

Мы часто используем следующее при настройке этих макросов:

Мы часто используем следующие подходы при кастомизации этих макросов:

- В <Constant name="cloud" /> мы рекомендуем использовать [environment variables](/docs/build/environment-variables), чтобы определить, где именно выполняется запуск dbt (dev/stg/prod).
    - Их можно задать на уровне окружения, и все задания автоматически унаследуют значения по умолчанию. Далее мы добавляем Jinja‑логику (`if/else/endif`), чтобы определить, выполняется ли запуск в dev, prod, CI и других окружениях.
    
- Или в качестве альтернативы переменным окружения вы можете использовать `target.name`. Для получения дополнительной информации вы можете обратиться к [О переменных target](/reference/dbt-jinja-functions/target).

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/custom-schema-env-var.png" title="Пользовательские переменные окружения схемы target name." />

Чтобы позволить имени базы данных/схемы/объекта зависеть от текущей ветки, вы можете использовать встроенную переменную окружения `DBT_CLOUD_GIT_BRANCH` в dbt Cloud [специальные переменные окружения](/docs/build/environment-variables#special-environment-variables).

Чтобы имя базы данных/схемы/объекта зависело от текущей ветки, вы можете использовать готовую переменную окружения `DBT_CLOUD_GIT_BRANCH` в <Constant name="cloud" /> [специальных переменных окружения](/docs/build/environment-variables#special-environment-variables).

## Примеры использования

Ниже приведены некоторые типичные примеры, с которыми мы сталкивались у пользователей dbt, использующих эти 3 макроса и различную логику.

Вот некоторые типичные примеры, с которыми мы сталкивались у пользователей dbt, использующих эти 3 макроса и различную логику.

:::note

Обратите внимание, что следующие примеры не являются исчерпывающими и не охватывают все доступные варианты. Эти примеры предназначены для того, чтобы служить шаблонами для разработки вашего собственного поведения.

:::

- [Использование пользовательской схемы без объединения целевой схемы в производстве](/guides/customize-schema-alias?step=3#1-custom-schemas-without-target-schema-concatenation-in-production)
- [Добавление идентификаторов разработчиков к таблицам](/guides/customize-schema-alias?step=3#2-static-schemas-add-developer-identities-to-tables)
- [Использование имени ветки в качестве префикса схемы](/guides/customize-schema-alias?step=3#3-use-branch-name-as-schema-prefix)
- [Использование статической схемы для CI](/guides/customize-schema-alias?step=3#4-use-a-static-schema-for-ci)

### 1. Пользовательские схемы без объединения целевой схемы в производстве

Наиболее распространенный случай использования — это использование пользовательской схемы без объединения ее с именем схемы по умолчанию в производственной среде.

Для этого вы можете создать новый файл с именем `generate_schema_name.sql` в вашей папке макросов со следующим кодом:

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

Это создаст следующие выходные данные для модели с именем `my_model` с пользовательской схемой `marketing`, предотвращая любое пересечение объектов между запусками dbt из разных контекстов.

| Контекст    |Целевая база данных| Целевая схема | Результирующий объект               |
|-------------|:-----------------:|:-------------:|:-----------------------------------:|
| Разработчик 1 | dev           | dbt_dev1      |dev.dbt_dev1_marketing.my_model  |
| Разработчик 2 | dev           | dbt_dev2      |dev.dbt_dev2_marketing.my_model  |
| CI PR 123   | ci            | dbt_pr_123    |ci.dbt_pr_123_marketing.my_model|
| CI PR 234   | ci            | dbt_pr_234    |ci.dbt_pr_234_marketing.my_model|
| Производство  | prod          | analytics     |prod.marketing.my_model         |

:::note

Мы добавили логику для проверки, происходит ли текущий запуск dbt в производственной среде или нет. Это важно, и мы объясняем, почему в разделе [Чего не следует делать](/guides/customize-schema-alias?step=3#what-not-to-do).

:::

### 2. Статические схемы: добавление идентификаторов разработчиков к таблицам

Иногда мы сталкиваемся с ситуациями, когда политика безопасности организации не позволяет разработчикам создавать схемы, и все разработчики должны разрабатывать в одной схеме.

В этом случае мы можем:

- Создать новый файл с именем generate_schema_name.sql в вашей папке макросов со следующим кодом:

- Изменить `generate_schema_name()`, чтобы использовать одну схему для всех разработчиков, даже если установлена пользовательская схема.
- Обновить `generate_alias_name()`, чтобы добавить псевдоним разработчика и пользовательскую схему в начало имени таблицы в среде разработки.
    - Этот метод не идеален, так как может привести к длинным именам таблиц, но он позволит разработчикам увидеть, в какой схеме модель будет создана в производственной среде.

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

Это создаст следующие выходные данные для модели с именем `my_model` с пользовательской схемой `marketing`, предотвращая любое пересечение объектов между запусками dbt из разных контекстов.

| Контекст    |Целевая база данных| Целевая схема | Результирующий объект               |
|-------------|:-----------------:|:-------------:|:-----------------------------------:|
| Разработчик 1 | dev           | dbt_dev1      |dev.marketing.dbt_dev1_my_model |
| Разработчик 2 | dev           | dbt_dev2      |dev.marketing.dbt_dev2_my_model  |
| CI PR 123   | ci            | dbt_pr_123    |ci.dbt_pr_123_marketing.my_model|
| CI PR 234   | ci            | dbt_pr_234    |ci.dbt_pr_234_marketing.my_model|
| Производство  | prod          | analytics     |prod.marketing.my_model         |

### 3. Использование имени ветки в качестве префикса схемы

Для команд, которые предпочитают изолировать работу на основе ветки функции, вы можете воспользоваться специальной переменной окружения `DBT_CLOUD_GIT_BRANCH`. Обратите внимание, что разработчики будут записывать в одну и ту же схему, когда они находятся в одной и той же ветке функции.

:::note

Переменная `DBT_CLOUD_GIT_BRANCH` доступна только в <Constant name="cloud_ide" /> и недоступна в <Constant name="cloud_cli" />.

:::

Мы также видели, что некоторые организации предпочитают организовывать свои базы данных разработки по имени ветки. Это требует реализации аналогичной логики в `generate_database_name()` вместо макроса `generate_schema_name()`. По умолчанию dbt не будет автоматически создавать базы данных.

Мы также видели, что некоторые организации предпочитают организовывать dev-базы данных по имени ветки (branch name). Для этого требуется реализовать аналогичную логику в макросе `generate_database_name()`, а не в макросе `generate_schema_name()`. По умолчанию dbt не создаёт базы данных автоматически.

Обратитесь к разделу [Tips and tricks](/guides/customize-schema-alias?step=5), чтобы узнать больше.

<File name='macros/generate_schema_name.sql'>

```jinja

{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if  env_var('DBT_ENV_TYPE','DEV') == 'DEV' -%}
    
        {#- мы заменяем символы, не разрешенные в именах схем, на "_" -#}
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

Это создаст следующие выходные данные для модели с именем `my_model` с пользовательской схемой `marketing`, предотвращая любое пересечение объектов между запусками dbt из разных контекстов.

| Контекст    |Ветка      |Целевая база данных| Целевая схема | Результирующий объект                  |
|-------------|:---------:|:-----------------:|:-------------:|:--------------------------------------:|
| Разработчик 1 |`featureABC`|dev            | dbt_dev1      |dev.featureABC_marketing.my_model  |
| Разработчик 2 |`featureABC`|dev            | dbt_dev2      |dev.featureABC_marketing.my_model  |
| Разработчик 1 |`feature123`|dev            | dbt_dev1      |dev.feature123_marketing.my_model  |
| CI PR 123   |            |ci             | dbt_pr_123    |ci.dbt_pr_123_marketing.my_model   |
| CI PR 234   |            |ci             | dbt_pr_234    |ci.dbt_pr_234_marketing.my_model   |
| Производство  |            |prod           | analytics     |prod.marketing.my_model           |

Когда разработчик 1 и разработчик 2 находятся в одной и той же ветке, они будут генерировать один и тот же объект в хранилище данных. Это не должно быть проблемой, так как нахождение в одной и той же ветке означает, что код модели будет одинаковым для обоих разработчиков.

### 4. Использование статической схемы для CI

Некоторые организации предпочитают записывать свои CI задачи в одну схему с идентификатором PR, добавленным в начало имени таблицы. Важно отметить, что это приведет к длинным именам таблиц.

Для этого вы можете создать новый файл с именем `generate_schema_name.sql` в вашей папке макросов со следующим кодом:

<File name='macros/generate_schema_name.sql'>

```jinja

{% macro generate_schema_name(custom_schema_name=none, node=none) -%}

    {%- set default_schema = target.schema -%}
    
    {# Если задача CI не существует в своей собственной среде, используйте переменную target.name внутри задачи #}
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

    {# Если задача CI не существует в своей собственной среде, используйте переменную target.name внутри задачи #}
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

Это создаст следующие выходные данные для модели с именем `my_model` с пользовательской схемой `marketing`, предотвращая любое пересечение объектов между запусками dbt из разных контекстов.

| Контекст    |Целевая база данных| Целевая схема | Результирующий объект                          |
|-------------|:-----------------:|:-------------:|:----------------------------------------------:|
| Разработчик 1 | dev           | dbt_dev1      |dev.dbt_dev1_marketing.my_model            |
| Разработчик 2 | dev           | dbt_dev2      |dev.dbt_dev2_marketing.my_model            |
| CI PR 123   | ci            | dbt_pr_123    |ci.ci_schema.dbt_pr_123_marketing_my_model |
| CI PR 234   | ci            | dbt_pr_234    |ci.ci_schema.dbt_pr_234_marketing_my_model |
| Производство  | prod          | analytics     |prod.marketing.my_model                    |

## Чего не следует делать

Этот раздел предоставит обзор того, чего пользователям следует избегать при настройке своих схем и псевдонимов из-за проблем, которые могут возникнуть.

### Обновление generate_schema_name() для использования только пользовательской схемы

Некоторые предпочитают использовать только пользовательскую схему, когда она установлена, вместо объединения схемы по умолчанию с пользовательской, как это происходит в стандартном поведении.

### Проблема

При изменении стандартного макроса для `generate_schema_name()` это может привести к созданию этой новой версии.

<File name='macros/generate_schema_name.sql'>

```jinja

{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- else -%}
    # Следующее неверно, так как опущено {{ default_schema }} перед {{ custom_schema_name | trim }}. 
        {{ custom_schema_name | trim }} 

    {%- endif -%}

{%- endmacro %}

```
</File>

Хотя это может дать ожидаемый результат для производства, где используется выделенная база данных, это приведет к конфликтам везде, где люди делятся базой данных.

Рассмотрим пример модели с именем `my_model` с пользовательской схемой `marketing`.

| Контекст    |Целевая база данных| Целевая схема | Результирующий объект               |
|-------------|:-----------------:|:-------------:|:-----------------------------------:|
| Производство  | prod          | analytics     |prod.marketing.my_model         |
| Разработчик 1 | dev           | dbt_dev1      |dev.marketing.my_model          |
| Разработчик 2 | dev           | dbt_dev2      |dev.marketing.my_model          |
| CI PR 123   | ci            | dbt_pr_123    |ci.marketing.my_model           |
| CI PR 234   | ci            | dbt_pr_234    |ci.marketing.my_model           |

Мы видим, что и разработчик 1, и разработчик 2 получают один и тот же объект для `my_model`. Это означает, что если они оба работают над этой моделью одновременно, будет невозможно узнать, какая версия в данный момент находится в хранилище данных — от разработчика 1 или разработчика 2.

Аналогично, разные PR приведут к созданию одного и того же объекта в хранилище данных. Если разные PR открыты одновременно и изменяют одни и те же модели, очень вероятно, что возникнут проблемы, замедляющие весь процесс разработки и продвижения кода.

### Решение

Как описано в предыдущем примере, обновите макрос, чтобы проверить, выполняется ли dbt в производственной среде. Только в производственной среде мы должны удалить объединение и использовать только пользовательскую схему.

## Советы и рекомендации

Этот раздел предоставит полезные советы о том, как правильно настроить ваши макросы `generate_database_name()` и `generate_alias_name()`.

### Создание несуществующих баз данных из dbt

dbt автоматически попытается создать схему, если она не существует и если в ней нужно создать объект, но он не будет автоматически пытаться создать базу данных, которая не существует.

Таким образом, если ваша конфигурация `generate_database_name()` указывает на разные базы данных, которые могут не существовать, dbt завершится с ошибкой, если вы выполните простую команду `dbt build`.

Тем не менее, это все еще можно сделать в dbt, создав несколько макросов, которые будут проверять, существует ли база данных, и если нет, dbt создаст ее. Вы можете вызвать эти макросы либо в [шаге `dbt run-operation ...`](/reference/commands/run-operation) в ваших задачах, либо в качестве [хука `on-run-start`](/reference/project-configs/on-run-start-on-run-end).

### Предположение контекста с использованием переменных окружения вместо `target.name`

Мы предпочитаем использовать [переменные окружения](/docs/build/environment-variables) вместо `target.name`. Для дальнейшего чтения ознакомьтесь с ([О переменных target](/reference/dbt-jinja-functions/target)), чтобы расшифровать контекст вызова dbt.

- `target.name` не может быть установлен на уровне окружения. Поэтому каждая задача в среде должна явно указывать переопределение `target.name`. Если задача не имеет установленного соответствующего значения `target.name`, база данных/схема/псевдоним могут быть разрешены неправильно. В качестве альтернативы, значения переменных окружения наследуются задачами в их соответствующей среде. Значения переменных окружения также могут быть переопределены в задачах, если это необходимо.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/custom-schema-env-var-targetname.png" title="Настройка псевдонима схемы env var."/>

- `target.name` требует, чтобы каждый разработчик вводил одно и то же значение (часто 'dev') в разделе имени цели своих учетных данных проекта разработки. Если у разработчика не установлено соответствующее значение имени цели, его база данных/схема/псевдоним могут быть разрешены неправильно.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/development-credentials.png" title="Учетные данные разработки." width="60%" />

### Всегда применять пользовательские схемы

Некоторые пользователи предпочитают применять пользовательские схемы ко всем объектам в своих проектах. Это позволяет избежать записи в непреднамеренные "стандартные" местоположения. Вы можете добавить эту логику в ваш макрос `generate_schema_name()`, чтобы [вызывать ошибку компиляции](/reference/dbt-jinja-functions/exceptions), если для объекта не определена пользовательская схема.

<File name='macros/generate_schema_name.sql'>

```jinja

 {% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none and node.resource_type == 'model' -%}
        
        {{ exceptions.raise_compiler_error("Ошибка: не определена пользовательская схема для модели " ~ node.name ) }}
    
    {%- endif -%}

```
</File>

</div>