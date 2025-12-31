---
title: "Конфигурации Teradata"
id: "teradata-configs"
---

## Общие {#general}

* *Установите `quote_columns`* — чтобы избежать предупреждения, обязательно явно задайте значение `quote_columns` в вашем `dbt_project.yml`. Подробнее см. [документацию по quote_columns](/reference/resource-configs/quote_columns).

  ```yaml
  seeds:
    +quote_columns: false  #or `true` if you have CSV column headers with spaces
  ```

## Models {#models}

### <Term id="table" />
* `table_kind` — определяет тип таблицы. Допустимые значения: `MULTISET` (значение по умолчанию для режима ANSI transaction, требуемого `dbt-teradata`) и `SET`, например:
    * в файле определения SQL-материализации:
      ```yaml
      {{
        config(
            materialized="table",
            table_kind="SET"
        )
      }}
      ```
    * в конфигурации seed:
      ```yaml
      seeds:
        <project-name>:
          table_kind: "SET"
      ```
  Подробнее см. в [документации CREATE TABLE](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).
* `table_option` - определяет опции таблицы. Конфигурация поддерживает несколько операторов. Определение ниже использует синтаксис Teradata для объяснения допустимых операторов. Квадратные скобки `[]` обозначают необязательные параметры. Символ вертикальной черты `|` разделяет операторы. Используйте запятые для объединения нескольких операторов, как показано в примерах ниже:
    ```
    { MAP = map_name [COLOCATE USING colocation_name] |
      [NO] FALLBACK [PROTECTION] |
      WITH JOURNAL TABLE = table_specification |
      [NO] LOG |
      [ NO | DUAL ] [BEFORE] JOURNAL |
      [ NO | DUAL | LOCAL | NOT LOCAL ] AFTER JOURNAL |
      CHECKSUM = { DEFAULT | ON | OFF } |
      FREESPACE = integer [PERCENT] |
      mergeblockratio |
      datablocksize |
      blockcompression |
      isolated_loading
    }
    ```
    где:
    * mergeblockratio:
      ```
      { DEFAULT MERGEBLOCKRATIO |
        MERGEBLOCKRATIO = integer [PERCENT] |
        NO MERGEBLOCKRATIO
      }
      ```
    * datablocksize:
      ```
      DATABLOCKSIZE = {
        data_block_size [ BYTES | KBYTES | KILOBYTES ] |
        { MINIMUM | MAXIMUM | DEFAULT } DATABLOCKSIZE
      }
      ```
    * blockcompression:
      ```
      BLOCKCOMPRESSION = { AUTOTEMP | MANUAL | ALWAYS | NEVER | DEFAULT }
        [, BLOCKCOMPRESSIONALGORITHM = { ZLIB | ELZS_H | DEFAULT } ]
        [, BLOCKCOMPRESSIONLEVEL = { value | DEFAULT } ]
      ```
    * isolated_loading:
      ```
      WITH [NO] [CONCURRENT] ISOLATED LOADING [ FOR { ALL | INSERT | NONE } ]
      ```

Примеры:
  * В файле определения SQL-материализации:
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK, NO JOURNAL"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK, NO JOURNAL, CHECKSUM = ON,
              NO MERGEBLOCKRATIO,
              WITH CONCURRENT ISOLATED LOADING FOR ALL"
        )
      }}
      ```
    * в конфигурации seed:
      ```yaml
      seeds:
        <project-name>:
          table_option:"NO FALLBACK"
      ```
      ```yaml
      seeds:
        <project-name>:
          table_option:"NO FALLBACK, NO JOURNAL"
      ```
      ```yaml
      seeds:
        <project-name>:
          table_option: "NO FALLBACK, NO JOURNAL, CHECKSUM = ON,
            NO MERGEBLOCKRATIO,
            WITH CONCURRENT ISOLATED LOADING FOR ALL"
      ```

  Подробнее см. в [документации CREATE TABLE](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).

* `with_statistics` — нужно ли копировать статистику из базовой таблицы. Например:
    ```yaml
    {{
      config(
          materialized="table",
          with_statistics="true"
      )
    }}
    ```
    Подробнее см. в [документации CREATE TABLE](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).

* `index` - определяет индексы таблицы:
    ```
    [UNIQUE] PRIMARY INDEX [index_name] ( index_column_name [,...] ) |
    NO PRIMARY INDEX |
    PRIMARY AMP [INDEX] [index_name] ( index_column_name [,...] ) |
    PARTITION BY { partitioning_level | ( partitioning_level [,...] ) } |
    UNIQUE INDEX [ index_name ] [ ( index_column_name [,...] ) ] [loading] |
    INDEX [index_name] [ALL] ( index_column_name [,...] ) [ordering] [loading]
    [,...]
    ```
    где:
    * partitioning_level:
      ```
      { partitioning_expression |
        COLUMN [ [NO] AUTO COMPRESS |
        COLUMN [ [NO] AUTO COMPRESS ] [ ALL BUT ] column_partition ]
      } [ ADD constant ]
      ```
    * ordering:
      ```
      ORDER BY [ VALUES | HASH ] [ ( order_column_name ) ]
      ```
    * loading:
      ```
      WITH [NO] LOAD IDENTITY
      ```

Examples:
* В файле определения материализации SQL:

Перевод:

Примеры:
* В файле определения материализации SQL:
      ```yaml
      {{
        config(
            materialized="table",
            index="UNIQUE PRIMARY INDEX ( GlobalID )"
        )
      }}
      ```
      > :information_source: Обратите внимание, в отличие от `table_option`, между операторами индекса нет запятых!
      ```yaml
      {{
        config(
            materialized="table",
            index="PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            index="PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)
            INDEX index_attrA (attrA) WITH LOAD IDENTITY"
        )
      }}
      ```
    * в конфигурации seed:
      ```yaml
      seeds:
        <project-name>:
          index: "UNIQUE PRIMARY INDEX ( GlobalID )"
      ```
      > :information_source: Обратите внимание, в отличие от `table_option`, между операторами индекса нет запятых!
      ```yaml
      seeds:
        <project-name>:
          index: "PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)"
      ```
      ```yaml
      seeds:
        <project-name>:
          index: "PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)
            INDEX index_attrA (attrA) WITH LOAD IDENTITY"
      ```
## Seeds {#seeds}

:::info Использование seeds для загрузки необработанных данных

Как объясняется в [документации dbt seeds](/docs/build/seeds), seeds не следует использовать для загрузки необработанных данных (например, больших CSV-экспортов из производственной базы данных).

Поскольку seeds находятся под версионным контролем, они лучше всего подходят для файлов, содержащих бизнес-специфичную логику, например, список кодов стран или идентификаторов пользователей сотрудников.

Загрузка CSV с использованием функциональности seed dbt неэффективна для больших файлов. Рассмотрите возможность использования другого инструмента для загрузки этих CSV в ваш <Term id="data-warehouse" />.

:::

* `use_fastload` - используйте [fastload](https://github.com/Teradata/python-driver#FastLoad) при выполнении команды `dbt seed`. Эта опция, вероятно, ускорит загрузку, если ваши файлы seed содержат сотни тысяч строк. Вы можете установить эту опцию конфигурации seed в вашем файле `project.yml`, например:

    ```yaml
    seeds:
      <project-name>:
        +use_fastload: true
    ```

## Снимки {#snapshots}

Снимки используют [функцию HASHROW](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Functions-Expressions-and-Predicates/Hash-Related-Functions/HASHROW/HASHROW-Function-Syntax) базы данных Teradata для генерации уникального хэш-значения для столбца `dbt_scd_id`.

Чтобы использовать собственную хэш-функцию UDF, в модели снимка есть опция конфигурации `snapshot_hash_udf`, которая по умолчанию равна HASHROW. Вы можете указать значение, например `<database_name.hash_udf_name>`. Если вы укажете только `hash_udf_name`, будет использоваться та же схема, что и для выполнения модели.

Например, в файле `snapshots/snapshot_example.sql`:

  ```sql
  {% snapshot snapshot_example %}
  {{
    config(
      target_schema='snapshots',
      unique_key='id',
      strategy='check',
      check_cols=["c2"],
      snapshot_hash_udf='GLOBAL_FUNCTIONS.hash_md5'
    )
  }}
  select * from {{ ref('order_payments') }}
  {% endsnapshot %}
  ```

#### Права доступа {#grants}

Гранты поддерживаются в адаптере dbt-teradata, начиная с версии 1.2.0 и выше. Вы можете использовать гранты для управления доступом к наборам данных, которые вы создаёте с помощью dbt. Чтобы реализовать эти разрешения, определите гранты как конфигурации ресурсов для каждой модели, seed или snapshot. Гранты по умолчанию, которые применяются ко всему проекту, задаются в файле `dbt_project.yml`, а гранты, специфичные для отдельных моделей, определяются внутри SQL-файлов моделей или в их property-файлах.

Например:
  models/schema.yml
  ```yaml
  models:
    - name: model_name
      config:
        grants:
          select: ['user_a', 'user_b']
  ```

Еще один пример добавления нескольких прав доступа:

  ```yaml
  models:
  - name: model_name
    config:
      materialized: table
      grants:
        select: ["user_b"]
        insert: ["user_c"]
  ```
> :information_source: `copy_grants` не поддерживается в Teradata.

Обратитесь к [grants](/reference/resource-configs/grants) для получения дополнительной информации о правах доступа.

## Query band {#query-band}
Query band в dbt-teradata можно задавать на трёх уровнях:
1. Уровень profiles: в файле `profiles.yml` пользователь может указать `query_band`, используя следующий пример:

    ```yaml 
    query_band: 'application=dbt;'
   ```

2. Уровень проекта: В файле `dbt_project.yml` пользователь может указать `query_band`, используя следующий пример:

   ```yaml
     models:
     Project_name:
        +query_band: "app=dbt;model={model};"
   ```
4. Уровень модели: Он может быть установлен в SQL файле модели или на уровне конфигурации модели в YAML файлах:

   ```sql
   {{ config( query_band='sql={model};' ) }}
   ```

Пользователи могут установить `query_band` на любом уровне или на всех уровнях. С `query_band` на уровне профилей, dbt-teradata установит `query_band` в первый раз для сессии, а затем для модели и проекта `query_band` будет обновлен с соответствующей конфигурацией.

Если пользователь устанавливает пару ключ-значение с значением `'{model}'`, внутренне это `'{model}'` будет заменено на имя модели, что может быть полезно для телеметрического отслеживания sql/ dbql логирования.

  ```yaml
  models:
  Project_name:
    +query_band: "app=dbt;model={model};"
  ````

- Например, если модель, которую запускает пользователь, это `stg_orders`, `{model}` будет заменено на `stg_orders` во время выполнения.
- Если `query_band` не установлен пользователем, будет использоваться следующий query_band по умолчанию: ```org=teradata-internal-telem;appname=dbt;```

## Модульное тестирование {#unit-testing}
* Модульное тестирование поддерживается в dbt-teradata и позволяет пользователям писать и выполнять unit-тесты с помощью команды `dbt test`.
  * Подробные инструкции см. в [документации по unit-тестам dbt](/docs/build/documentation).
> В Teradata повторное использование одного и того же алиаса в нескольких common table expressions (CTE) или подзапросах в рамках одной модели не допускается, так как это приводит к ошибкам парсинга; поэтому необходимо назначать уникальные алиасы для каждого CTE или подзапроса, чтобы обеспечить корректное выполнение запроса.

## Инкрементальная стратегия материализации valid_history {#valid_history-incremental-materialization-strategy}
_Доступно в режиме раннего доступа_
    
Эта стратегия предназначена для эффективного управления историческими данными в среде Teradata, используя возможности dbt для обеспечения качества данных и оптимального использования ресурсов.
В временных базах данных действительное время имеет решающее значение для таких приложений, как историческая отчетность, наборы данных для обучения ML и судебный анализ.

```yaml
  {{
      config(
          materialized='incremental',
          unique_key='id',
          on_schema_change='fail',
          incremental_strategy='valid_history',
          valid_period='valid_period_col',
          use_valid_to_time='no',
  )
  }}
  ```

Инкрементальная стратегия `valid_history` требует задания следующих параметров:
* `unique_key`: первичный ключ модели (без компонентов времени валидности), указывается как имя одного столбца или список столбцов.
* `valid_period`: имя столбца модели, указывающего период, в течение которого запись считается валидной. Тип данных должен быть `PERIOD(DATE)` или `PERIOD(TIMESTAMP)`.
* `use_valid_to_time`: определяет, учитывается ли конечная граница периода валидности во входных данных при построении временной шкалы валидности. Используйте `no`, если вы считаете, что запись валидна до момента изменения (и в этом случае передавайте в качестве конечной границы любое значение, большее начальной границы периода; типичная конвенция — `9999-12-31` или `9999-12-31 23:59:59.999999`). Используйте `yes`, если вы точно знаете, до какого момента запись валидна (как правило, это используется для корректировок в исторической временной шкале).

Стратегия `valid_history` в dbt-teradata включает несколько критически важных шагов, направленных на обеспечение целостности и точности управления историческими данными:
* Удаление дубликатов и конфликтующих значений из исходных данных:
  * Этот шаг гарантирует, что данные очищены и готовы к дальнейшей обработке за счёт устранения избыточных или конфликтующих записей.
  * Выполняется удаление дубликатов по первичному ключу (две или более записи с одинаковыми значениями `unique_key` и начальной границы `BEGIN()` поля `valid_period`) в наборе данных, сформированном моделью. Если такие дубликаты существуют, сохраняется строка с наименьшим значением для всех неключевых полей (в порядке, заданном в модели). Полные дубликаты строк всегда дедуплицируются.
* Выявление и корректировка перекрывающихся временных интервалов:
  * Перекрывающиеся или смежные периоды времени в данных исправляются для поддержания согласованной и неперекрывающейся временной шкалы. Для этого макрос корректирует конечную границу периода валидности записи, выравнивая её по начальной границе следующей записи (если периоды перекрываются или являются смежными) в рамках одной группы `unique_key`. Если `use_valid_to_time = 'yes'`, используется конечная граница периода валидности, указанная в исходных данных. В противном случае для отсутствующих границ применяется дата окончания по умолчанию, и соответствующие корректировки выполняются автоматически.
* Управление записями, которые необходимо скорректировать, удалить или разделить на основе данных источника и целевой таблицы:
  * На этом этапе обрабатываются сценарии, в которых записи из исходных данных перекрываются с записями в целевой таблице или должны их заменить, чтобы историческая временная шкала оставалась корректной.
* Компактизация истории:
  * Нормализация и уплотнение истории путём объединения записей смежных периодов времени с одинаковыми значениями, что оптимизирует использование хранилища и повышает производительность базы данных. Для этого используется функция `TD_NORMALIZE_MEET`.
* Удаление существующих перекрывающихся записей из целевой таблицы:
  * Перед вставкой новых или обновлённых записей все существующие записи в целевой таблице, которые перекрываются с новыми данными, удаляются, чтобы избежать конфликтов.
* Вставка обработанных данных в целевую таблицу:
  * На завершающем этапе очищенные и скорректированные данные вставляются в целевую таблицу, обеспечивая актуальность исторических данных и точное соответствие ожидаемой временной шкале.

Эти шаги в совокупности обеспечивают, что стратегия valid_history эффективно управляет историческими данными, поддерживая их целостность и точность, оптимизируя при этом производительность.

  ```sql
    Иллюстрация, демонстрирующая пример исходных данных и соответствующих целевых данных:  
  
    -- Исходные данные
        pk |       valid_from          | value_txt1 | value_txt2
        ======================================================================
        1  | 2024-03-01 00:00:00.0000  | A          | x1
        1  | 2024-03-12 00:00:00.0000  | B          | x1
        1  | 2024-03-12 00:00:00.0000  | B          | x2
        1  | 2024-03-25 00:00:00.0000  | A          | x2
        2  | 2024-03-01 00:00:00.0000  | A          | x1
        2  | 2024-03-12 00:00:00.0000  | C          | x1
        2  | 2024-03-12 00:00:00.0000  | D          | x1
        2  | 2024-03-13 00:00:00.0000  | C          | x1
        2  | 2024-03-14 00:00:00.0000  | C          | x1
    
    -- Целевые данные
        pk | valid_period                                                       | value_txt1 | value_txt2
        ===================================================================================================
        1  | PERIOD(TIMESTAMP)[2024-03-01 00:00:00.0, 2024-03-12 00:00:00.0]    | A          | x1
        1  | PERIOD(TIMESTAMP)[2024-03-12 00:00:00.0, 2024-03-25 00:00:00.0]    | B          | x1
        1  | PERIOD(TIMESTAMP)[2024-03-25 00:00:00.0, 9999-12-31 23:59:59.9999] | A          | x2
        2  | PERIOD(TIMESTAMP)[2024-03-01 00:00:00.0, 2024-03-12 00:00:00.0]    | A          | x1
        2  | PERIOD(TIMESTAMP)[2024-03-12 00:00:00.0, 9999-12-31 23:59:59.9999] | C          | x1
  ```

## Общие задачи, специфичные для Teradata {#common-teradata-specific-tasks}
* *сбор статистики* - когда таблица создается или значительно изменяется, может возникнуть необходимость сообщить Teradata о необходимости сбора статистики для оптимизатора. Это можно сделать с помощью команды `COLLECT STATISTICS`. Вы можете выполнить этот шаг, используя `post-hooks` dbt, например:

  ```yaml
  {{ config(
    post_hook=[
      "COLLECT STATISTICS ON  {{ this }} COLUMN (column_1,  column_2  ...);"
      ]
  )}}
  ```
См. [документацию по сбору статистики](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/RAyUdGfvREwbO9J0DMNpLw) для получения дополнительной информации.

## Пакет external tables {#the-external-tables-package}

Пакет [dbt-external-tables](https://github.com/dbt-labs/dbt-external-tables) поддерживается адаптером dbt-teradata, начиная с версии v1.9.3. Под капотом dbt-teradata использует концепцию foreign tables для создания таблиц из внешних источников. Дополнительную информацию можно найти в [документации Teradata](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Data-Definition-Language-Syntax-and-Examples/Table-Statements/CREATE-FOREIGN-TABLE).

Вам необходимо добавить пакет `dbt-external-tables` как зависимость:

```yaml
packages:
  - package: dbt-labs/dbt_external_tables
    version: [">=0.9.0", "<1.0.0"]
```

Также необходимо добавить конфигурацию dispatch, чтобы проект выбирал переопределённые макросы из пакета dbt-teradata:

```yaml
dispatch:
  - macro_namespace: dbt_external_tables
    search_order: ['dbt', 'dbt_external_tables']
```

Для задания `STOREDAS` и `ROWFORMAT` для внешних таблиц можно использовать один из следующих вариантов:
- Использовать стандартные настройки dbt-external-tables `file_format` и `row_format` соответственно.
- Либо задать их в конфигурации `USING`, как описано в [документации Teradata](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Data-Definition-Language-Syntax-and-Examples/Table-Statements/CREATE-FOREIGN-TABLE/CREATE-FOREIGN-TABLE-Syntax-Elements/USING-Clause).

Для внешних источников, которые требуют аутентификации, необходимо создать объект аутентификации и передать его в `tbl_properties` как объект `EXTERNAL SECURITY`. Подробнее об объектах аутентификации см. в [документации Teradata](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Data-Definition-Language-Syntax-and-Examples/Authorization-Statements-for-External-Routines/CREATE-AUTHORIZATION-and-REPLACE-AUTHORIZATION).

Ниже приведены примеры конфигурации внешних источников для Teradata:

```yaml
sources:
  - name: teradata_external
    schema: "{{ target.schema }}"
    loader: S3

    tables:
      - name: people_csv_partitioned
        external: 
          location: "/s3/s3.amazonaws.com/dbt-external-tables-testing/csv/"
          file_format: "TEXTFILE"
          row_format: '{"field_delimiter":",","record_delimiter":"\n","character_set":"LATIN"}'
          using: |
            PATHPATTERN  ('$var1/$section/$var3')
          tbl_properties: |
            MAP = TD_MAP1
            ,EXTERNAL SECURITY  MyAuthObj
          partitions:
            - name: section
              data_type: CHAR(1)
        columns:
          - name: id
            data_type: int
          - name: first_name
            data_type: varchar(64)
          - name: last_name
            data_type: varchar(64)
          - name: email
            data_type: varchar(64)
```

```yaml
sources:
  - name: teradata_external
    schema: "{{ target.schema }}"
    loader: S3

    tables:
      - name: people_json_partitioned
        external:
          location: '/s3/s3.amazonaws.com/dbt-external-tables-testing/json/'
          using: |
            STOREDAS('TEXTFILE')
            ROWFORMAT('{"record_delimiter":"\n", "character_set":"cs_value"}')
            PATHPATTERN  ('$var1/$section/$var3')
          tbl_properties: |
            MAP = TD_MAP1
            ,EXTERNAL SECURITY  MyAuthObj
          partitions:
            - name: section
              data_type: CHAR(1)
```

### `temporary_metadata_generation_schema` (ранее `fallback_schema`) {#temporarymetadatagenerationschema-previously-fallbackschema}
Адаптер dbt-teradata внутренне создаёт временные таблицы для получения метаданных представлений при формировании manifest и catalog. Если у вас нет прав на создание таблиц в схеме, с которой вы работаете, вы можете определить переменную `temporary_metadata_generation_schema` (в схеме, где у вас есть необходимые права `create`/`drop`) в файле `dbt_project.yml`.

```yaml
vars:
  temporary_metadata_generation_schema: <schema-name>
```
