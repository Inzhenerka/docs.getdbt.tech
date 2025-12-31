---
title: "Обновление до v1.10"
id: upgrading-to-v1.10
description: Новые возможности и изменения в dbt Core v1.10
displayed_sidebar: "docs"
---
 
## Ресурсы {#resources}

- <Constant name="core" /> [v1.10 changelog](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## Что нужно знать перед обновлением {#what-to-know-before-upgrading}

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x. Любые изменения в поведении будут сопровождаться [флагом изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags), который предоставляет окно для миграции существующих проектов. Если после обновления вы столкнулись с ошибкой, пожалуйста, сообщите нам, [открыв issue](https://github.com/dbt-labs/dbt-core/issues/new).

Начиная с 2024 года, <Constant name="cloud" /> предоставляет функциональность новых версий <Constant name="core" /> через [release tracks](/docs/dbt-versions/cloud-release-tracks) с автоматическими обновлениями. Если в <Constant name="cloud" /> у вас выбран release track **Latest**, у вас уже есть доступ ко всем возможностям, исправлениям и прочему функционалу, включённому в <Constant name="core" /> v1.10! Если выбран release track **Compatible**, доступ появится в следующем ежемесячном выпуске **Compatible** после финального релиза <Constant name="core" /> v1.10.

Для пользователей dbt Core, начиная с v1.8, мы рекомендуем явно устанавливать как `dbt-core`, так и `dbt-<youradapter>`. В будущих версиях dbt это может стать обязательным требованием. Например:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## Новые и измененные возможности и функциональность {#new-and-changed-features-and-functionality}

Новые возможности и изменения, доступные в <Constant name="core" /> v1.10

### Флаг `--sample` {#the-sample-flag}

Большие наборы данных могут существенно замедлять время выполнения сборок dbt, усложняя эффективное тестирование нового кода. Флаг [`--sample`](/docs/build/sample-flag), доступный для команд `run` и `build`, помогает сократить время сборки и затраты на хранилище данных, запуская dbt в режиме выборки. Он генерирует отфильтрованные refs и sources с использованием временной выборки, позволяя разработчикам проверять результаты без построения моделей целиком.

### Перемещение независимых якорей под ключ `anchors:` {#move-standalone-anchors-under-anchors-key}

В рамках продолжающейся работы по повышению точности языка описания dbt, dbt Core v1.10 выводит предупреждение при обнаружении неожиданного ключа верхнего уровня в properties YAML-файле. Распространённый сценарий появления таких ключей — это отдельные определения anchors на верхнем уровне YAML-файла свойств. Для таких повторно используемых блоков конфигурации теперь можно использовать новый ключ верхнего уровня `anchors:`.

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

dbt Core теперь умеет парсить файл `catalogs.yml`. Это важная веха на пути к поддержке внешних каталогов для таблиц Iceberg, так как она позволяет реализовывать write-интеграции. Теперь можно задать конфигурацию, указывающую интеграцию каталога для producer-модели:

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

Уже сейчас ознакомьтесь с нашей [документацией по поддержке внешних каталогов](/docs/mesh/iceberg/about-catalogs)! В ближайшие недели мы поделимся дополнительной информацией, но уже сейчас это важный шаг на пути к кросс-платформенной поддержке.

### Интеграция артефактов dbt Core с dbt‑проектами {#integrating-dbt-core-artifacts-with-dbt-projects}

С использованием [гибридных проектов](/docs/deploy/hybrid-projects) пользователи <Constant name="core"/> при работе в командной строке (CLI) могут выполнять запуски, которые автоматически загружают [артефакты](/reference/artifacts/dbt-artifacts) в <Constant name="cloud"/>. Это расширяет возможности гибридных развёртываний <Constant name="core"/> / <Constant name="cloud"/> за счёт:

- Улучшения совместной работы между пользователями <Constant name="cloud"/> и <Constant name="core"/> за счёт возможности визуализации и использования [cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) к моделям, определённым в проектах <Constant name="core"/>. Эта функция объединяет рабочие процессы <Constant name="cloud"/> и <Constant name="core"/> в единый, более связный опыт работы с dbt.
- Предоставления пользователям <Constant name="cloud"/> и <Constant name="core"/> информации о моделях и активах в [<Constant name="explorer"/>](/docs/explore/explore-projects). Для доступа к <Constant name="explorer"/> необходима [лицензия developer или read-only](/docs/cloud/manage-access/seats-and-users).
- (Скоро) Возможности для пользователей, работающих в [<Constant name="visual_editor"/>](/docs/cloud/canvas), развивать модели, уже созданные центральной командой данных в <Constant name="core"/>, без необходимости начинать с нуля.

Hybrid projects доступны в рамках закрытой беты для [<Constant name="cloud"/> Enterprise-аккаунтов](https://www.getdbt.com/pricing). Чтобы зарегистрировать интерес к бете, свяжитесь с вашим аккаунт-менеджером.

### Управление изменениями в устаревших поведениях {#managing-changes-to-legacy-behaviors}

dbt Core v1.10 вводит новые флаги для [управления изменениями устаревшего поведения](/reference/global-configs/behavior-changes). Вы можете включать недавно добавленные изменения (по умолчанию отключены) или, наоборот, отключать зрелые изменения (по умолчанию включены), задавая значения `True` / `False` для `flags` в `dbt_project.yml`.

Подробнее о каждом изменении поведения можно прочитать по следующим ссылкам:

- (Добавлено, отключено по умолчанию) [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation). Если флаг установлен в `True`, dbt выдаст предупреждение, если имена аргументов `type`, указанные в YAML для макросов, не совпадают с именами аргументов в самом макросе или если типы аргументов не соответствуют [поддерживаемым типам](/reference/resource-properties/arguments#supported-types).
- (Добавлено, отключено по умолчанию) [`require_all_warnings_handled_by_warn_error`](/reference/global-configs/behavior-changes#warn-error-handler-for-all-warnings). Если этот флаг установлен в `True`, все предупреждения, возникающие во время выполнения, будут обрабатываться через механизм `--warn-error` / `--warn-error-options`. Это обеспечивает единообразное поведение при повышении предупреждений до ошибок или их подавлении. Когда флаг равен `False` (текущее значение по умолчанию), только часть предупреждений проходит через этот механизм — остальные могут его обходить. Включение этого флага в проектах, использующих `--warn-error` (или `--warn-error-options='{"error":"all"}'`), может привести к падению сборок из‑за предупреждений, которые ранее игнорировались, поэтому мы рекомендуем включать его постепенно, по одному проекту за раз.

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

#### Пользовательские входные данные {#custom-inputs}

Исторически dbt позволял настраивать входные данные практически без ограничений. Типичный пример — задание пользовательских свойств в YAML:

```yml

models:
  - name: my_model
    description: A model in my project.
    dbt_is_awesome: true # пользовательское свойство

```

dbt обнаруживает нераспознанное пользовательское свойство (`dbt_is_awesome`) и молча продолжает работу. При отсутствии строго определённого набора входных данных становится сложно валидировать конфигурацию проекта. Это приводит к непреднамеренным проблемам, таким как:
- Тихое игнорирование опечаток в свойствах и конфигурациях (например, `desciption:` вместо `description:`).
- Непреднамеренные конфликты с пользовательским кодом, когда dbt вводит новое «зарезервированное» свойство или конфигурацию.

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

### Snowflake {#snowflake}
- Вы можете использовать параметр `platform_detection_timeout_seconds`, чтобы управлять временем ожидания коннектора Snowflake при определении облачной платформы, с которой устанавливается соединение. Подробнее см. в разделе [Snowflake setup](/docs/core/connect-data-platform/snowflake-setup#platform_detection_timeout_seconds).

### BigQuery {#bigquery}

- `dbt-bigquery` отменяет задания BigQuery, превышающие настроенный таймаут, отправляя запрос на отмену. Если запрос выполнен успешно, dbt останавливает задание. Если запрос не удался, задание BigQuery может продолжать выполняться в фоне до завершения или до его ручной отмены. Подробнее см. в разделе [Timeout and retries](/docs/core/connect-data-platform/bigquery-setup#timeouts-and-retries).

## Коротко о главном {#quick-hits}

- Используйте свойство [`loaded_at_query`](/reference/resource-properties/freshness#loaded_at_query) для source freshness, чтобы задать собственный SQL для вычисления временной метки `maxLoadedAt` источника (в отличие от [встроенного запроса](https://github.com/dbt-labs/dbt-adapters/blob/6c41bedf27063eda64375845db6ce5f7535ef6aa/dbt/include/global_project/macros/adapters/freshness.sql#L4-L16), который использует `loaded_at_field`). Нельзя определять `loaded_at_query`, если также задана конфигурация `loaded_at_field`.

- Используйте валидацию аргументов макросов с помощью флага [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation), который по умолчанию отключён. При включении этот флаг проверяет, что имена аргументов, задокументированные для макроса, совпадают с определением макроса, а их типы соответствуют поддерживаемому формату. Ранее dbt не обеспечивал строгую проверку типов аргументов, рассматривая поле типа исключительно как документацию. Если аргументы не задокументированы, dbt выводит их из определения макроса и включает в файл `manifest.json`. Подробнее см. раздел [supported types](/reference/resource-properties/arguments#supported-types).
