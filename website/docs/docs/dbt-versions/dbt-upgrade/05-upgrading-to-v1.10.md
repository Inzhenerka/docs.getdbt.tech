---
title: "Обновление до v1.10"
id: upgrading-to-v1.10
description: Новые возможности и изменения в dbt v1.10
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---
 
## Ресурсы {#resources}

- <Constant name="dbt" /> [v1.10 changelog](https://github.com/dbt-labs/dbt/blob/1.10.latest/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/local/install-dbt)
- [dbt platform upgrade guide](/docs/dbt-versions/upgrade-dbt-platform-version)

## Что нужно знать перед обновлением {#what-to-know-before-upgrading}

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x. Любые изменения поведения будут сопровождаться [флагом изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags), чтобы предоставить время для миграции существующих проектов. Если после обновления вы столкнётесь с ошибкой, сообщите нам об этом, [создав issue](https://github.com/dbt-labs/dbt/issues/new).

<Constant name="dbt" /> предоставляет функциональность новых версий <Constant name="core" /> через [каналы выпусков](/docs/dbt-versions/dbt-release-tracks) с автоматическими обновлениями. Если вы выбрали канал выпусков **v1 Latest** в <Constant name="dbt" />, у вас уже есть доступ ко всем возможностям, исправлениям и другим функциям, включённым в <Constant name="dbt" /> v1.10! Если вы выбрали канал выпусков **v1 Compatible**, вы получите доступ к ним в следующем ежемесячном выпуске **v1 Compatible** после выхода финальной версии <Constant name="dbt" /> v1.10.

## Новые и измененные возможности и функциональность {#new-and-changed-features-and-functionality}

Новые возможности и функции, доступные в <Constant name="dbt" /> v1.10

### Флаг `--sample` {#the-sample-flag}

Большие наборы данных могут существенно замедлять время выполнения сборок dbt, усложняя эффективное тестирование нового кода. Флаг [`--sample`](/docs/build/sample-flag), доступный для команд `run` и `build`, помогает сократить время сборки и затраты на хранилище данных, запуская dbt в режиме выборки. Он генерирует отфильтрованные refs и sources с использованием временной выборки, позволяя разработчикам проверять результаты без построения моделей целиком.

### Перемещение независимых якорей под ключ `anchors:` {#move-standalone-anchors-under-anchors-key}

В рамках непрерывной работы над повышением строгости языка описания dbt <Constant name="dbt" /> v1.10 выводит предупреждение при обнаружении непредусмотренного ключа верхнего уровня в YAML-файле свойств. Часто такие ключи используются для отдельных определений якорей на верхнем уровне YAML-файла свойств. Теперь для размещения этих повторно используемых блоков конфигурации можно использовать новый ключ верхнего уровня `anchors:`.

Например, вместо следующей конфигурации:

<File name='models/_models.yml'>

```yml
id_column: &id_column_alias
  name: id
  description: This is a unique identifier.
  data_type: int
  data_tests:
    - not_null
    - unique

models:
  - name: my_first_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_a
        description: This column is not repeated in other models.
  - name: my_second_model
    columns: 
      - *id_column_alias
```

</File>

Следует переместить anchor под ключ `anchors:`:

<File name='models/_models.yml'>

```yml
anchors: 
  - &id_column_alias
      name: id
      description: This is a unique identifier.
      data_type: int
      data_tests:
        - not_null
        - unique

models:
  - name: my_first_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_a
        description: This column is not repeated in other models
  - name: my_second_model
    columns: 
      - *id_column_alias
```

</File>

Это перемещение необходимо только для фрагментов, определённых вне основной структуры YAML. Подробнее о новом ключе см. в разделе [anchors](/reference/resource-properties/anchors).

### Парсинг `catalogs.yml` {#parsing-catalogsyml}

<Constant name="core" /> теперь поддерживает разбор файла `catalogs.yml`. Это важный этап на пути к поддержке внешних каталогов для таблиц Iceberg, поскольку он открывает возможность интеграции для записи данных. Вы сможете указать в конфигурации интеграцию с каталогом для модели, создающей данные:

Например:

```yml

catalogs:
  - name: catalog_dave
    # materializing the data to an external location, and metadata to that data catalog
    write_integrations: 
      - name: databricks_glue_write_integration
          external_volume: databricks_external_volume_prod
          table_format: iceberg
          catalog_type: unity 

```

Реализация на стороне модели будет выглядеть так:

<File name='models/schemas.yml'>

```yaml

models:
  - name: my_second_public_model
    config:
      catalog_name: catalog_dave

```

</File>

Уже сейчас ознакомьтесь с нашей [документацией по поддержке внешних каталогов](/docs/build/iceberg/about-catalogs)! В ближайшие недели мы расскажем об этом подробнее, но уже сейчас это важный шаг на пути к кроссплатформенной поддержке. 

### Интеграция артефактов <Constant name="core" /> с проектами dbt

Благодаря [гибридным проектам](/docs/deploy/hybrid-projects) пользователи <Constant name="core"/>, работающие в интерфейсе командной строки (CLI), могут выполнять запуски с автоматической загрузкой [артефактов](/reference/artifacts/dbt-artifacts) в <Constant name="dbt"/>. Это расширяет возможности гибридных развертываний <Constant name="core"/>/<Constant name="dbt"/> следующим образом:

- Улучшает совместную работу пользователей <Constant name="dbt"/> и <Constant name="core"/>, позволяя им визуализировать модели, определенные в проектах <Constant name="core"/>, и создавать [межпроектные ссылки](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) на них. Эта функция объединяет рабочие процессы <Constant name="dbt"/> и <Constant name="core"/>, обеспечивая более тесную интеграцию при работе с dbt.
- Предоставляет пользователям <Constant name="dbt"/> и <Constant name="core"/> информацию об их моделях и ресурсах в [<Constant name="catalog"/>](/docs/explore/explore-projects). Для просмотра <Constant name="catalog"/> необходима [лицензия разработчика или лицензия с доступом только для чтения](/docs/platform/manage-access/seats-and-users).

Гибридные проекты доступны в рамках закрытого бета-тестирования для [аккаунтов <Constant name="dbt"/> Enterprise](https://www.getdbt.com/pricing). Свяжитесь с представителем, который ведет ваш аккаунт, чтобы сообщить о своем интересе к участию в бета-тестировании.

### Управление изменениями в устаревших поведениях {#managing-changes-to-legacy-behaviors}

В <Constant name="dbt" /> v1.10 появились новые флаги для [управления изменениями прежнего поведения](/reference/global-configs/behavior-changes). Вы можете включить недавно добавленные изменения (по умолчанию отключены) или отключить устоявшиеся изменения (по умолчанию включены), задав соответствующим флагам в разделе `flags` файла `dbt_project.yml` значения `true` или `false` соответственно.

Подробнее о каждом изменении поведения можно прочитать по следующим ссылкам:

- (Добавлен, отключён по умолчанию) [`validate_macro_args`](/reference/global-configs/behavior-flags/validate_macro_args). Если установлено значение `true`, dbt выдаёт предупреждение, если имена или типы аргументов в YAML-описании макроса не соответствуют определению макроса на Jinja или используются неподдерживаемые значения типов. Обратите внимание: в проектах, использующих `--warn-error`, сборка может завершиться ошибкой на этапе разбора, если объявления аргументов макроса в YAML не согласованы с сигнатурой макроса на Jinja.
- (Добавлен, отключён по умолчанию) [`require_all_warnings_handled_by_warn_error`](/reference/global-configs/behavior-flags/require_all_warnings_handled_by_warn_error). Если для этого флага установлено значение `true`, все предупреждения, возникающие во время выполнения, будут направляться в обработчик `--warn-error` / `--warn-error-options`. Это обеспечивает единообразное поведение при преобразовании предупреждений в ошибки или их подавлении. Когда флаг имеет значение `false` (текущее значение по умолчанию), обработчик обрабатывает только часть предупреждений &mdash; остальные могут его обходить. Включение этого флага в проектах, использующих `--warn-error` (или `--warn-error-options='{"error":"all"}'`), может привести к сбоям сборки из-за предупреждений, которые ранее игнорировались, поэтому мы рекомендуем включать его постепенно, по одному проекту за раз.

### Предупреждения об устаревании {#deprecation-warnings}

Начиная с версии `v1.10`, вы будете получать предупреждения об устаревании (deprecation warnings) для dbt-кода, который станет недопустимым в будущем, включая:

- Пользовательские входные данные (например, нераспознанные свойства ресурсов, конфигурации и ключи верхнего уровня)
- Дублирующиеся ключи YAML в одном файле
- Неожиданные Jinja-блоки (например, теги `{% endmacro %}` без соответствующего тега `{% macro %}`)
- Перемещение некоторых `properties` в `configs`
- И другое

dbt начнёт выдавать эти предупреждения в версии `1.10`, однако внесение изменений не является обязательным условием для её использования. В dbt Labs мы понимаем, что существующим пользователям потребуется время на миграцию проектов, и наша цель — не нарушить вашу работу этим обновлением. Основная цель — дать вам больше безопасности, обратной связи и уверенности в дальнейшей работе.

Что это значит для вас?

1. Если в вашем проекте (или пакете dbt) появляется новое предупреждение об устаревании в `v1.10`, запланируйте обновление некорректного кода в ближайшее время. Пока это всего лишь предупреждение, но в будущих версиях dbt будет применяться более строгая валидация входных данных проекта. Обратите внимание на инструмент [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix), который может автоматически исправить многие из этих проблем.
2. В будущем конфигурация [`meta`](/reference/resource-configs/meta) станет единственным местом для пользовательских атрибутов. Всё остальное будет строго типизировано и валидировано. Если у вас есть дополнительный атрибут, который вы хотите включить в проект, или конфигурация модели, к которой нужно обращаться в кастомной материализации, в дальнейшем её необходимо размещать внутри `meta`.
3. Если вы используете флаг [`—-warn-error`](/reference/global-configs/warnings) (или `--warn-error-options '{"error": "all"}'`) для повышения всех предупреждений до уровня ошибок, это будет включать и новые предупреждения об устаревании, появившиеся в dbt Core. Если вы не хотите, чтобы они становились ошибками, флаг `--warn-error-options` позволяет более гибко управлять тем, какие типы предупреждений считаются ошибками. Вы можете задать `"warn": ["Deprecations"]` (новое в `v1.10`), чтобы продолжать обрабатывать предупреждения об устаревании как предупреждения.
4. Флаг `--models` / `--model` / `-m` был переименован в `--select` / `--s` ещё в dbt Core v0.21 (октябрь 2021). Тихое игнорирование этого флага означает игнорирование критериев выбора в команде, что может привести к сборке всего DAG вместо небольшой подмножества моделей. По этой причине флаг `--models` / `--model` / `-m` **будет выдавать предупреждение** в dbt Core v1.10 и ошибку в Fusion. Пожалуйста, обновите определения ваших job’ов соответствующим образом.

1. Если в вашем проекте (или пакете dbt) появляется новое предупреждение об устаревании в `v1.10`, запланируйте в ближайшее время исправление кода, не соответствующего требованиям. Хотя пока это лишь предупреждение, в будущей версии dbt будет строже проверять входные данные вашего проекта. Воспользуйтесь [инструментом `dbt-autofix`](https://github.com/dbt-labs/dbt-autofix), чтобы автоматически исправить многие из этих проблем!
2. В будущем [конфигурация `meta`](/reference/resource-configs/meta) станет единственным местом для пользовательских атрибутов. Все остальные атрибуты будут строго типизированы и будут проходить строгую проверку. Если вы хотите добавить в проект дополнительный атрибут или параметр конфигурации модели, к которому нужно обращаться в пользовательской материализации, впредь его необходимо размещать внутри `meta`.
3. Если вы используете [флаг `—-warn-error`](/reference/global-configs/warnings) (или `--warn-error-options '{"error": "all"}'`), чтобы считать все предупреждения ошибками, это коснётся и новых предупреждений об устаревании, которые появятся в <Constant name="core" />. Если вы не хотите считать их ошибками, флаг `--warn-error-options` позволяет точнее настроить, какие именно типы предупреждений будут обрабатываться как ошибки. Можно задать `"warn": ["Deprecations"]` (новая возможность в `v1.10`), чтобы предупреждения об устаревании по-прежнему обрабатывались как предупреждения.
4. Флаг `--models` / `--model` / `-m` был переименован в `--select` / `--s` ещё в <Constant name="dbt" /> v0.21 (октябрь 2021 года). Если молча пропускать этот флаг, критерии выбора в вашей команде будут игнорироваться: в результате может быть построен весь DAG, хотя вы хотели выбрать лишь небольшое подмножество. По этой причине флаг `--models` / `--model` / `-m` **будет вызывать предупреждение** в <Constant name="dbt" /> v1.10 и ошибку в <Constant name="fusion" />. Обновите определения заданий соответствующим образом.

Исторически dbt позволял настраивать входные данные практически без ограничений. Типичный пример — задание пользовательских свойств в YAML:

```yml

models:
  - name: my_model
    description: A model in my project.
    dbt_is_awesome: true # пользовательское свойство

```

dbt обнаруживает неизвестное пользовательское свойство (`dbt_is_awesome`) и продолжает работу без предупреждений. Без строго определённого набора входных параметров проверять конфигурацию проекта становится сложно. Это приводит к непредвиденным проблемам, таким как:
- Игнорирование свойств и параметров конфигурации с опечатками без предупреждений (например, `description:` вместо `description:`).
- Непреднамеренные конфликты с пользовательским кодом, когда dbt вводит новое «зарезервированное» свойство или параметр конфигурации.

Если у вас есть нераспознанное пользовательское свойство, вы получите предупреждение, а в будущей версии dbt поддержка таких свойств будет прекращена. В дальнейшем их следует размещать внутри конфигурации [`meta`](/reference/resource-configs/meta), которая станет единственным местом для пользовательских атрибутов:

```yml

models:
  - name: my_model
    description: A model in my project.
    config:
      meta:
        dbt_is_awesome: true 

```

#### Пользовательские ключи не вложенные под meta {#custom-keys-not-nested-under-meta}

Ранее возможность определять любые дополнительные поля напрямую под `config` могла приводить к конфликтам между пользовательскими конфигурациями и официальными конфигурациями фреймворка dbt.

В будущем конфигурация `meta` станет единственным допустимым местом для пользовательских атрибутов. Всё остальное будет строго типизировано и валидировано. Если у вас есть дополнительный атрибут, который вы хотите включить в проект, или конфигурация модели, к которой требуется доступ в кастомной материализации, её необходимо размещать под `meta`:

```yaml
models:
  - name: my_model
    config:
      meta:
        custom_config_key: value
    columns:
      - name: my_column
        config:
          meta:
            some_key: some_value
```

#### Дублирующиеся ключи в одном YAML‑файле {#duplicate-keys-in-the-same-yaml-file}

Если в одном properties YAML-файле присутствуют два одинаковых ключа, вы получите предупреждение, а в будущей версии dbt поддержка дублирующихся ключей будет прекращена. Ранее при наличии одинаковых ключей dbt молча перезаписывал значение, используя последнюю конфигурацию в файле.

<File name='profiles.yml'>

```yml

my_profile:
  target: my_target
  outputs:
...

my_profile: # dbt would use only this profile key
  target: my_other_target
  outputs:
...

```

</File>

В дальнейшем следует удалить неиспользуемые ключи или перенести их в отдельный properties YAML-файл.

#### Неожиданные Jinja-блоки {#unexpected-jinja-blocks}

Если у вас есть «осиротевший» Jinja-блок, вы получите предупреждение, а в будущей версии dbt поддержка неожиданных Jinja-блоков будет прекращена. Ранее такие блоки молча игнорировались.

<File name='macros/my_macro.sql'>

```sql

{% endmacro %} # orphaned endmacro jinja block

{% macro hello() %}
hello!
{% endmacro %}

```
</File>

В дальнейшем следует удалить такие осиротевшие Jinja-блоки.

#### Свойства, перемещённые в конфигурацию {#properties-moving-to-configs}

Некоторые исторические properties полностью перемещаются в configs.

К ним относятся: `freshness`, `meta`, `tags`, `docs`, `group` и `access`.

Если ранее вы задавали одно из затронутых свойств, например `freshness`:

```yaml

sources: 
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    freshness:
      warn_after:
        count: 24
        period: hour

```

Теперь его следует задавать внутри `config`:

```yaml

sources: 
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    config:
      freshness:
        warn_after:
          count: 24
          period: hour

```

#### Пользовательский путь вывода для свежести источника {#custom-output-path-for-source-freshness}

Возможность переопределять путь по умолчанию для `sources.json` с помощью флагов `--output` или `-o` была признана устаревшей. Вы по-прежнему можете задавать путь для всех artifacts с помощью `--target-path`, но при попытке указать путь только для source freshness будет выдаваться предупреждение.

#### Опции warn/error {#warn-error-options}

Опции `warn_error_option` для `include` и `exclude` были признаны устаревшими и заменены на `error` и `warn` соответственно.

  ```yaml
...
  flags:
    warn_error_options:
      error: # Previously called "include"
      warn: # Previously called "exclude"
      silence: # To silence or ignore warnings
        - NoNodesForSelectionCriteria
  ```

## Адаптер-специфичные возможности и функциональность {#adapter-specific-features-and-functionalities}

import SnowflakeColumn from '/snippets/_snowflake-column-size.md';

<SnowflakeColumn />

### Snowflake
- С помощью параметра `platform_detection_timeout_seconds` можно задать время ожидания коннектора Snowflake при определении облачной платформы, из которой устанавливается подключение. Подробнее см. в разделе [Настройка Snowflake](/docs/local/connect-data-platform/snowflake-setup?version=1.12#platformdetectiontimeout_seconds).

### BigQuery {#bigquery}

- `dbt-bigquery` отменяет задания BigQuery, превышающие настроенный таймаут, отправляя запрос на отмену. Если запрос выполнен успешно, dbt останавливает задание. Если запрос не удался, задание BigQuery может продолжать выполняться в фоне до завершения или до его ручной отмены. Подробнее см. в разделе [Timeout and retries](/docs/local/connect-data-platform/bigquery-setup?version=1.12#timeouts-and-retries).

- `dbt-bigquery` отправляет запрос на отмену заданий BigQuery, время выполнения которых превышает настроенный тайм-аут. Если запрос выполнен успешно, dbt останавливает задание. Если запрос не выполнен, задание BigQuery может продолжать выполняться в фоновом режиме, пока не завершится или вы не отмените его вручную. Подробнее см. в разделе [Тайм-ауты и повторные попытки](/docs/local/connect-data-platform/bigquery-setup?version=1.12#timeouts-and-retries).

- Используйте свойство [`loaded_at_query`](/reference/resource-configs/freshness#using-loaded_at_query) для source freshness, чтобы задать собственный SQL для вычисления временной метки `maxLoadedAt` источника (в отличие от [встроенного запроса](https://github.com/dbt-labs/dbt-adapters/blob/6c41bedf27063eda64375845db6ce5f7535ef6aa/dbt/include/global_project/macros/adapters/freshness.sql#L4-L16), который использует `loaded_at_field`). Нельзя определять `loaded_at_query`, если также задана конфигурация `loaded_at_field`.

## Коротко о главном

- Используйте флаг [`--use-fast-test-edges`](/reference/global-configs/fast-test-edges) с командой `dbt build`, чтобы уменьшить количество рёбер тестов, которые dbt добавляет в граф выполнения. В крупных проектах это может значительно сократить время выполнения и потребление памяти.

- Укажите свойство [`loaded_at_query`](/reference/resource-configs/freshness) для проверки актуальности источника, чтобы задать пользовательский SQL-запрос для получения временной метки `maxLoadedAt` в источнике (вместо [встроенного запроса](https://github.com/dbt-labs/dbt-adapters/blob/6c41bedf27063eda64375845db6ce5f7535ef6aa/dbt/include/global_project/macros/adapters/freshness.sql#L4-L16), который использует `loaded_at_field`). Нельзя задавать `loaded_at_query`, если также указан параметр конфигурации `loaded_at_field`.

- Включите проверку аргументов макросов с помощью флага [`validate_macro_args`](/reference/global-configs/behavior-flags/validate_macro_args), который по умолчанию отключён. Когда этот флаг включён, он проверяет, совпадают ли имена аргументов макроса в документации с именами в определении макроса, а также соответствуют ли их типы поддерживаемому формату. Ранее dbt не требовал соблюдения стандартных типов аргументов и рассматривал поле типа исключительно как документацию. Если ни один аргумент не описан в документации, dbt определяет аргументы по определению макроса и включает их в файл manifest.json. Подробнее см. в разделе [Поддерживаемые типы](/reference/resource-properties/arguments#supported-types). 

- Вы можете использовать функции [`config.meta_get()`](/reference/dbt-jinja-functions/config#configmeta_get) и [`config.meta_require()`](/reference/dbt-jinja-functions/config#configmeta_require) для доступа к пользовательским настройкам, хранящимся в `meta`.
