---
title: "Конфигурации Teradata"
id: "teradata-configs"
---

## Общие

* *Установите `quote_columns`* - чтобы избежать предупреждения, убедитесь, что вы явно задали значение для `quote_columns` в вашем `dbt_project.yml`. Подробнее см. в [документации по quote_columns](https://docs.getdbt.com/reference/resource-configs/quote_columns).

  ```yaml
  seeds:
    +quote_columns: false  #или `true`, если у вас есть заголовки столбцов csv с пробелами
  ```

* *Включите типы столбцов представлений в документации* - Teradata Vantage имеет флаг конфигурации dbscontrol под названием `DisableQVCI`. Этот флаг инструктирует базу данных создавать `DBC.ColumnsJQV` с определениями типов столбцов представлений. Чтобы включить эту функциональность, вам нужно:
  1. Включить режим QVCI в Vantage. Используйте утилиту `dbscontrol`, а затем перезапустите Teradata. Выполните эти команды от имени привилегированного пользователя на узле Teradata:
      ```bash
      # опция 551 - это DisableQVCI. Установка в false включает QVCI.
      dbscontrol << EOF
      M internal 551=false
      W
      EOF

      # перезапустите Teradata
      tpareset -y Enable QVCI
      ```
  2. Инструктируйте `dbt` использовать режим `QVCI`. Включите следующую переменную в ваш `dbt_project.yml`:
      ```yaml
      vars:
        use_qvci: true
      ```
      Пример конфигурации см. в [dbt_project.yml](https://github.com/Teradata/dbt-teradata/blob/main/test/catalog/with_qvci/dbt_project.yml) в тестах QVCI `dbt-teradata`.

## Модели

### <Term id="table" />
* `table_kind` - определяет тип таблицы. Допустимые значения: `MULTISET` (по умолчанию для режима транзакций ANSI, требуемого `dbt-teradata`) и `SET`, например:
    * в файле определения материализации sql:
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
    * в файле определения материализации sql:
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

* `with_statistics` - следует ли копировать статистику из базовой таблицы, например:
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

  Примеры:
    * в файле определения материализации sql:
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
## Seeds

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

## Снимки

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

#### Права доступа

Права доступа поддерживаются в адаптере dbt-teradata с версии 1.2.0 и выше. Вы можете использовать права доступа для управления доступом к наборам данных, которые вы создаете с помощью dbt. Чтобы реализовать эти разрешения, определите права доступа как конфигурации ресурсов для каждой модели, seed или снимка. Определите права доступа по умолчанию, которые применяются ко всему проекту, в вашем `dbt_project.yml`, и определите права доступа для конкретной модели в каждом SQL или YAML файле модели.

например:
  models/schema.yml
  ```yaml
  models:
    - name: model_name
      config:
        grants:
          select: ['user_a', 'user_b']
  ```

Другой пример для добавления нескольких прав доступа:

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

## Query Band
Query Band в dbt-teradata может быть установлен на трех уровнях:
1. Уровень профилей: В файле `profiles.yml` пользователь может указать `query_band`, используя следующий пример:

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

## Стратегия инкрементальной материализации valid_history
_Это доступно в раннем доступе_
    
Эта стратегия предназначена для эффективного управления историческими данными в среде Teradata, используя возможности dbt для обеспечения качества данных и оптимального использования ресурсов.
В временных базах данных действительное время имеет решающее значение для таких приложений, как историческая отчетность, наборы данных для обучения ML и судебный анализ.

```yaml
  {{
      config(
          materialized='incremental',
          unique_key='id',
          on_schema_change='fail',
          incremental_strategy='valid_history',
          valid_from='valid_from_column',
          history_column_in_target='history_period_column'
  )
  }}
  ```

Инкрементальная стратегия `valid_history` требует следующих параметров:
* `valid_from` &mdash; Столбец в исходной таблице типа **timestamp**, указывающий, когда каждая запись стала действительной.
* `history_column_in_target` &mdash; Столбец в целевой таблице типа **period**, который отслеживает историю.

Стратегия valid_history в dbt-teradata включает несколько критически важных шагов для обеспечения целостности и точности управления историческими данными:
* Удаление дубликатов и конфликтующих значений из исходных данных:
  * Этот шаг гарантирует, что данные очищены и готовы к дальнейшей обработке, устраняя любые избыточные или конфликтующие записи.
  * Процесс удаления дубликатов и конфликтующих значений из исходных данных включает использование механизма ранжирования для обеспечения сохранения только записей с наивысшим приоритетом. Это достигается с помощью функции SQL RANK().
* Определение и корректировка перекрывающихся временных интервалов:
  * Перекрывающиеся временные периоды в данных обнаруживаются и корректируются для поддержания последовательной и неперекрывающейся временной шкалы.
* Управление записями, которые необходимо перезаписать или разделить на основе исходных и целевых данных:
  * Это включает обработку сценариев, когда записи в исходных данных перекрываются или должны заменить записи в целевых данных, обеспечивая точность исторической временной шкалы.
* Использование функции TD_NORMALIZE_MEET для уплотнения истории:
  * Эта функция помогает нормализовать и уплотнить историю, объединяя смежные временные периоды, улучшая эффективность и производительность базы данных.
* Удаление существующих перекрывающихся записей из целевой таблицы:
  * Перед вставкой новых или обновленных записей любые существующие записи в целевой таблице, которые перекрываются с новыми данными, удаляются для предотвращения конфликтов.
* Вставка обработанных данных в целевую таблицу:
  * Наконец, очищенные и скорректированные данные вставляются в целевую таблицу, обеспечивая актуальность и точность исторических данных.

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
  

:::info
Целевая таблица должна существовать до запуска модели. Убедитесь, что целевая таблица создана и правильно структурирована с необходимыми столбцами, включая столбец, который отслеживает историю с типом данных period, до запуска модели dbt.
:::

## Общие задачи, специфичные для Teradata
* *сбор статистики* - когда таблица создается или значительно изменяется, может возникнуть необходимость сообщить Teradata о необходимости сбора статистики для оптимизатора. Это можно сделать с помощью команды `COLLECT STATISTICS`. Вы можете выполнить этот шаг, используя `post-hooks` dbt, например:

  ```yaml
  {{ config(
    post_hook=[
      "COLLECT STATISTICS ON  {{ this }} COLUMN (column_1,  column_2  ...);"
      ]
  )}}
  ```
  Подробнее см. в [документации по сбору статистики](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/RAyUdGfvREwbO9J0DMNpLw).