---
title: "Конфигурации Amazon Athena"
description: "Справочная статья по адаптеру Amazon Athena для dbt Core и платформы dbt."
id: "athena-configs"
---

## Модели

### Конфигурация таблицы

| Параметр | По умолчанию | Описание |
|-----------|---------|-------------|
| `external_location` | None | Полный путь S3, где сохраняется таблица. Работает только с инкрементальными моделями. Не работает с таблицами Hive, если `ha` установлено в `true`. |
| `partitioned_by` | None | Список столбцов, по которым будет разбита таблица. В настоящее время ограничено 100 разделами. |
| `bucketed_by` | None | Список столбцов для распределения данных по корзинам. Игнорируется при использовании Iceberg. |
| `bucket_count` | None | Количество корзин для распределения данных. Этот параметр игнорируется при использовании Iceberg. |
| `table_type` | Hive | Тип таблицы. Поддерживает `hive` или `iceberg`. |
| `ha` | False | Создание таблицы с использованием метода высокой доступности. Доступно только для таблиц Hive. |
| `format` | Parquet | Формат данных для таблицы. Поддерживает `ORC`, `PARQUET`, `AVRO`, `JSON` и `TEXTFILE`. |
| `write_compression` | None | Тип сжатия для любого формата хранения, который поддерживает сжатие. |
| `field_delimeter` | None | Укажите пользовательский разделитель полей, который будет использоваться, когда формат установлен в `TEXTFILE`. |
| `table_properties` | N/A | Свойства таблицы, которые нужно добавить к таблице. Это только для Iceberg. |
| `native_drop` | N/A | Операции удаления отношений будут выполняться с помощью SQL, а не прямых вызовов API Glue. Вызовы S3 не будут выполняться для управления данными в S3. Данные в S3 будут очищены только для таблиц Iceberg. Подробнее см. в [документации AWS](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-managing-tables.html). Операции DROP TABLE в Iceberg могут завершиться по тайм-ауту, если они длятся более 60 секунд.|
| `seed_by_insert` | False | Создает начальные данные с использованием SQL-оператора вставки. Большие файлы начальных данных не могут превышать лимит Athena в 262144 байт. |
| `force_batch` | False | Запуск создания таблицы напрямую в режиме пакетной вставки. Полезно, когда стандартное создание таблицы не удается из-за ограничения на разделы. |
| `unique_tmp_table_suffix` | False | Заменяет суффикс "__dbt_tmp table" на уникальный UUID для инкрементальных моделей, использующих вставку с перезаписью в таблицах Hive. |
| `temp_schema` | None | Определяет схему для хранения временных операторов создания, используемых в инкрементальных запусках моделей. Схема будет создана в целевой базе данных моделей, если она не существует. |
| `lf_tags_config` | None | Теги [AWS Lake Formation](#aws-lake-formation-integration), которые нужно связать с таблицей и столбцами. Существующие теги будут удалены. <br />* `enabled` (`default=False`) указывает, включено ли управление тегами LF для модели <br />* `tags` словарь с тегами и их значениями для назначения модели <br /> * `tags_columns` словарь с ключом тега, значением и списком столбцов, к которым они должны быть назначены |
| `lf_inherited_tags` | None | Список ключей тегов Lake Formation, которые должны быть унаследованы на уровне базы данных и не должны удаляться при назначении тех, что определены в `ls_tags_config`. |
| `lf_grants` | None | Конфигурация грантов Lake Formation для фильтров `data_cell`. |

#### Примеры конфигурации

<Tabs>

<TabItem value="schema.yml">

<File name="models/schema.yml">

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='append',
    on_schema_change='append_new_columns',
    table_type='iceberg',
    schema='test_schema',
    lf_tags_config={
          'enabled': true,
          'tags': {
            'tag1': 'value1',
            'tag2': 'value2'
          },
          'tags_columns': {
            'tag1': {
              'value1': ['column1', 'column2'],
              'value2': ['column3', 'column4']
            }
          },
          'inherited_tags': ['tag1', 'tag2']
    }
  )
}}
```
</File>

</TabItem>

<TabItem value="dbt_project.yml" >

<File name='dbt_project.yml' >

```yaml
  +lf_tags_config:
    enabled: true
    tags:
      tag1: value1
      tag2: value2
    tags_columns:
      tag1:
        value1: [ column1, column2 ]
    inherited_tags: [ tag1, tag2 ]
```

</File>

</TabItem>

<TabItem value="Lake formation grants" >

```python
lf_grants={
        'data_cell_filters': {
            'enabled': True | False,
            'filters': {
                'filter_name': {
                    'row_filter': '<filter_condition>',
                    'principals': ['principal_arn1', 'principal_arn2']
                }
            }
        }
    }
```

</TabItem>

</Tabs>

Рассмотрите следующие ограничения и рекомендации:

- Конфигурации `lf_tags` и `lf_tags_columns` поддерживают только привязку LF Tags к соответствующим ресурсам.
- Мы рекомендуем управлять разрешениями LF Tags вне dbt. Например, с помощью [terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_permissions) или [aws cdk](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lakeformation-readme.html).
- Управление `data_cell_filters` невозможно автоматизировать вне dbt, потому что фильтр не может быть привязан к таблице, которая ещё не существует. После того как вы `enable` эту конфигурацию, dbt будет на каждом запуске dbt устанавливать все фильтры и их разрешения. Такой подход позволяет поддерживать актуальное состояние конфигурации безопасности на уровне строк после каждого запуска dbt и применять изменения при их появлении: удаление, создание и обновление фильтров и их разрешений.
- Любые теги, указанные в `lf_inherited_tags`, должны строго наследоваться с уровня базы данных и никогда не переопределяться на уровне таблиц и колонок.
- В настоящее время `dbt-athena` не различает унаследованную привязку тега и переопределение, которое оно сделало ранее.
  - Например, если значение `lf_tags_config` переопределяет унаследованный тег в одном запуске, а затем это переопределение удаляется перед следующим запуском, предыдущее переопределение сохранится и больше нигде не будет зафиксировано (например, ни в Terraform, где настроено унаследованное значение, ни в проекте dbt, где переопределение ранее существовало, но теперь удалено).

### Расположение таблицы

1. Если `external_location` определено, используется это значение.
2. Если `s3_data_dir` определено, путь определяется этим значением и `s3_data_naming`.
3. Если `s3_data_dir` не определено, данные хранятся в `s3_staging_dir/tables/`.

1. Если определён `external_location`, используется это значение.
2. Если определён `s3_data_dir`, путь определяется на основе него и параметра `s3_data_naming`.
3. Если `s3_data_dir` не определён, данные сохраняются в `{s3_staging_dir}/tables/`.

Для параметра `s3_data_naming` доступны следующие варианты:

- `unique`: `{s3_data_dir}/{uuid4()}/`
- `table`: `{s3_data_dir}/{table}/`
- `table_unique`: `{s3_data_dir}/{table}/{uuid4()}/`
- `schema_table`: `{s3_data_dir}/{schema}/{table}/`
- `schema_table_unique`: `{s3_data_dir}/{schema}/{table}/{uuid4()}/`

Чтобы установить `s3_data_naming` глобально в целевом профиле, перезапишите значение в конфигурации таблицы или установите значение для групп моделей в dbt_project.yml.

Примечание: Если вы используете рабочую группу с настроенным местоположением по умолчанию, `s3_data_naming` игнорирует любые настроенные корзины и использует местоположение, настроенное в рабочей группе.

### Инкрементальные модели

Поддерживаются следующие стратегии [incremental models](/docs/build/incremental-models):

- `insert_overwrite` (по умолчанию): Стратегия вставки с перезаписью удаляет пересекающиеся разделы из целевой таблицы, а затем вставляет новые записи из источника. Эта стратегия зависит от ключевого слова `partitioned_by`! dbt вернется к стратегии `append`, если разделы не определены.
- `append`: Вставка новых записей без обновления, удаления или перезаписи существующих данных. Может быть дублирование данных (отлично подходит для логов или исторических данных).
- `merge`: Условное обновление, удаление или вставка строк в таблицу Iceberg. Используется в сочетании с `unique_key`. Доступно только при использовании Iceberg.

Учитывайте это ограничение при использовании моделей Iceberg:

- **Incremental Iceberg models** — при изменении схемы синхронизируются все столбцы. Вы не можете удалить столбцы, используемые для партиционирования, с помощью инкрементального обновления; для этого необходимо выполнить полный refresh модели.

Опция `on_schema_change` отражает изменения схемы в инкрементальных моделях. Значения, которые можно установить:

- `ignore` (по умолчанию)
- `fail`
- `append_new_columns`
- `sync_all_columns`

Чтобы узнать больше, обратитесь к [Что делать, если столбцы моей инкрементальной модели изменяются](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change).

### Iceberg

Адаптер поддерживает материализацию таблиц для Iceberg.

Например:

```sql
{{ config(
    materialized='table',
    table_type='iceberg',
    format='parquet',
    partitioned_by=['bucket(user_id, 5)'],
    table_properties={
     'optimize_rewrite_delete_file_threshold': '2'
     }
) }}

select 'A'          as user_id,
       'pi'         as name,
       'active'     as status,
       17.89        as cost,
       1            as quantity,
       100000000    as quantity_big,
       current_date as my_date
```

Iceberg поддерживает распределение по корзинам как скрытые разделы. Используйте конфигурацию `partitioned_by`, чтобы добавить конкретные условия распределения по корзинам.

Iceberg поддерживает форматы таблиц `PARQUET`, `AVRO` и `ORC` для данных.

Поддерживаются следующие стратегии для использования Iceberg инкрементально:

- `append`: Новые записи добавляются в таблицу (это может привести к дублированию).
- `merge`: Выполняет обновление и вставку (и, возможно, удаление), где добавляются новые и существующие записи. Это доступно только с версией движка Athena 3.
  - `unique_key`(обязательно): Столбцы, которые определяют уникальную запись в исходной и целевой таблице.
  - `incremental_predicates` (необязательно): SQL-условия, которые позволяют настраивать соединительные условия в операторе слияния. Это помогает улучшить производительность за счет проталкивания предикатов в целевые таблицы.
  - `delete_condition` (необязательно): SQL-условие, которое определяет записи, которые должны быть удалены.
  - `update_condition` (необязательно): SQL-условие, которое определяет записи, которые должны быть обновлены.
  - `insert_condition` (необязательно): SQL-условие, которое определяет записи, которые должны быть вставлены.

`incremental_predicates`, `delete_condition`, `update_condition` и `insert_condition` могут включать любой столбец инкрементальной таблицы (`src`) или конечной таблицы (`target`). Имена столбцов должны иметь префикс `src` или `target`, чтобы избежать ошибки `Column is ambiguous`.

<Tabs>

<TabItem value="delete_condition">

```sql
{{ config(
    materialized='incremental',
    table_type='iceberg',
    incremental_strategy='merge',
    unique_key='user_id',
    incremental_predicates=["src.quantity > 1", "target.my_date >= now() - interval '4' year"],
    delete_condition="src.status != 'active' and target.my_date < now() - interval '2' year",
    format='parquet'
) }}

select 'A' as user_id,
       'pi' as name,
       'active' as status,
       17.89 as cost,
       1 as quantity,
       100000000 as quantity_big,
       current_date as my_date
```

</TabItem>

<TabItem value="update_condition" >

```sql
{{ config(
        materialized='incremental',
        incremental_strategy='merge',
        unique_key=['id'],
        update_condition='target.id > 1',
        schema='sandbox'
    )
}}

{% if is_incremental() %}

select * from (
    values
    (1, 'v1-updated')
    , (2, 'v2-updated')
) as t (id, value)

{% else %}

select * from (
    values
    (-1, 'v-1')
    , (0, 'v0')
    , (1, 'v1')
    , (2, 'v2')
) as t (id, value)

{% endif %}
```

</TabItem>

<TabItem value="insert_condition" >

```sql
{{ config(
        materialized='incremental',
        incremental_strategy='merge',
        unique_key=['id'],
        insert_condition='target.status != 0',
        schema='sandbox'
    )
}}

select * from (
    values
    (1, 0)
    , (2, 1)
) as t (id, status)

```

</TabItem>

</Tabs>

### Таблица высокой доступности (HA)

Текущая реализация материализации таблицы может привести к простоям, так как целевая таблица удаляется и создается заново. Для менее разрушительного поведения вы можете использовать конфигурацию `ha` в своих моделях с материализацией `table`. Она использует функцию версий таблиц каталога Glue, которая создает временную таблицу и меняет местами целевую таблицу с местоположением временной таблицы. Эта материализация доступна только для `table_type=hive` и требует использования уникальных местоположений. Для Iceberg высокая доступность является настройкой по умолчанию.

По умолчанию материализация сохраняет последние 4 версии таблицы, но вы можете изменить это, установив `versions_to_keep`.

```sql
{{ config(
    materialized='table',
    ha=true,
    format='parquet',
    table_type='hive',
    partitioned_by=['status'],
    s3_data_naming='table_unique'
) }}

select 'a' as user_id,
       'pi'     as user_name,
       'active' as status
union all
select 'b'        as user_id,
       'sh'       as user_name,
       'disabled' as status
```

#### Известные проблемы HA

### Известные проблемы HA

### Обновление каталога данных Glue

### Избегайте удаления parquet‑файлов

Если модель dbt имеет то же имя, что и существующая таблица в каталоге AWS Glue, адаптер `dbt-athena` удаляет файлы в S3‑локации этой таблицы перед тем, как пересоздать таблицу на основе SQL из модели.

Адаптер также может удалить данные, если модель настроена на использование той же S3‑локации, что и существующая таблица. В этом случае он очищает папку перед созданием новой таблицы, чтобы избежать конфликтов в процессе настройки.

При удалении модели адаптер `dbt-athena` выполняет два шага очистки как для таблиц Iceberg, так и для Hive:

- Удаляет таблицу из каталога AWS Glue с помощью Glue API.
- Удаляет связанные с таблицей файлы данных в S3 с помощью операции удаления.

Однако для таблиц Iceberg использование стандартного SQL, например [`DROP TABLE`](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-drop-table.html), может не удалить все связанные объекты в S3. Чтобы обеспечить корректную очистку в рамках dbt‑workflow, адаптер включает обходное решение, которое явно удаляет эти объекты S3. В качестве альтернативы пользователи могут включить [`native_drop`](/reference/resource-configs/athena-configs#table-configuration), чтобы поручить очистку Iceberg на нативном уровне.

### Обновить каталог данных Glue

Например:

```yaml
models:
  - name: test_deduplicate
    description: another value
    config:
      persist_docs:
        relation: true
        columns: true
      meta:
        test: value
    columns:
      - name: id
        config:
          meta: # changed to config in v1.10 and backported to 1.9
            primary_key: true
```

Подробнее см. в разделе [persist_docs](/reference/resource-configs/persist_docs).

## Снимки

Адаптер поддерживает материализацию снимков. Он поддерживает как стратегию временных меток, так и стратегию проверки. Чтобы создать снимок, создайте файл снимка в каталоге `snapshots`. Вам нужно будет создать этот каталог, если он еще не существует.

### Стратегия временных меток

Обратитесь к [Стратегия временных меток](/docs/build/snapshots#timestamp-strategy-recommended) для получения подробной информации о том, как ее использовать.

### Стратегия проверки

Обратитесь к [Стратегия проверки](/docs/build/snapshots#check-strategy) для получения подробной информации о том, как ее использовать.

### Жесткие удаления

Материализация также поддерживает аннулирование жестких удалений. Для получения информации о использовании обратитесь к [Жесткие удаления](/docs/build/snapshots#hard-deletes-opt-in).

### Известные проблемы со снимками

- Инкрементальные модели Iceberg - Синхронизация всех столбцов при изменении схемы. Столбцы, используемые для разделения, не могут быть удалены. С точки зрения dbt, единственный способ - это полное обновление инкрементальной модели.
- Имена таблиц, схем и баз данных должны быть только в нижнем регистре.
- Чтобы избежать потенциальных конфликтов, убедитесь, что [`dbt-athena-adapter`](https://github.com/Tomme/dbt-athena) не установлен в целевой среде.
- Снимок не поддерживает удаление столбцов из исходной таблицы. Если вы удаляете столбец, убедитесь, что вы также удалили столбец из снимка. Другой обходной путь - это установить значение NULL для столбца в определении снимка, чтобы сохранить историю.

## Интеграция AWS Lake Formation

- Имена таблиц, схем и баз данных должны быть только в нижнем регистре.
- Чтобы избежать возможных конфликтов, убедитесь, что [`dbt-athena-adapter`](https://github.com/Tomme/dbt-athena) не установлен в целевой среде.
- Snapshot не поддерживает удаление колонок из исходной таблицы. Если вы удаляете колонку, убедитесь, что вы также удалили её из snapshot. В качестве альтернативного обходного пути можно присвоить колонке значение `NULL` в определении snapshot, чтобы сохранить историю.

- [Включите](#table-configuration) управление тегами LF с помощью параметра `lf_tags_config`. По умолчанию оно отключено.
- После включения теги LF обновляются при каждом запуске dbt.
- Сначала все теги LF для столбцов удаляются, чтобы избежать проблем с наследованием.
- Затем все избыточные теги LF удаляются из таблиц, и актуальные теги из конфигураций таблиц применяются.
- Наконец, теги LF для столбцов применяются.

Важно понимать следующие моменты:

- dbt не управляет `lf-tags` для баз данных
- dbt не управляет разрешениями Lake Formation

Поэтому важно позаботиться об этом самостоятельно или использовать инструмент автоматизации, такой как terraform и AWS CDK. Для получения более подробной информации обратитесь к:

* [terraform aws_lakeformation_permissions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_permissions)
* [terraform aws_lakeformation_resource_lf_tags](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_resource_lf_tags)

## Модели на Python

Адаптер поддерживает модели на Python с использованием [`spark`](https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark.html).

### Предварительные требования

- Рабочая группа с поддержкой Spark, созданная в Athena.
- Роль выполнения Spark, предоставляющая доступ к Athena, Glue и S3.
- Рабочая группа Spark добавлена в файл `~/.dbt/profiles.yml`, и профиль, который будет использоваться, указан в `dbt_project.yml`.

### Конфигурация таблицы, специфичная для Spark

| Конфигурация | По умолчанию |  Описание |
|---------------|---------|--------------|
| `timeout`     | 43200   | Тайм-аут в секундах для каждого выполнения модели на Python. По умолчанию 12 часов/43200 секунд. |
| `spark_encryption` | False | При установке в `true` шифрует данные, хранящиеся локально Spark, и в транзите между узлами Spark. |
| `spark_cross_account_catalog` | False | При использовании рабочей группы Spark Athena запросы по умолчанию могут выполняться только в каталогах на том же аккаунте AWS. Установка этого параметра в true позволит выполнять запросы к внешним каталогам, если вы хотите выполнить запрос к другому каталогу на внешнем аккаунте AWS. <br></br> Используйте синтаксис `external_catalog_id/database.table`, чтобы получить доступ к внешней таблице во внешнем каталоге (например, `999999999999/mydatabase.cloudfront_logs`, где 999999999999 - это идентификатор внешнего каталога).|
| `spark_requester_pays` | False | При установке в true, если корзина Amazon S3 настроена как `requester pays`, учетная запись пользователя, выполняющего запрос, оплачивает доступ к данным и сборы за передачу данных, связанные с запросом. |

### Заметки по Spark

- Сессия создается для каждой уникальной конфигурации движка, определенной в моделях, которые являются частью вызова.
Тайм-аут бездействия сессии установлен на 10 минут. В течение периода тайм-аута, если новый расчет (модель на Python для Spark) готов к выполнению и конфигурация движка совпадает, процесс будет повторно использовать ту же сессию.
- Количество моделей на Python, выполняющихся одновременно, зависит от `threads`. Количество сессий, созданных для всего запуска, зависит от количества уникальных конфигураций движка и доступности сессий для поддержания параллельности потоков.
- Для таблиц Iceberg рекомендуется использовать конфигурацию `table_properties`, чтобы установить `format_version` в `2`. Это помогает поддерживать совместимость между таблицами Iceberg, созданными Trino, и теми, что созданы Spark.

### Примеры моделей

<Tabs>

<TabItem value="Простой pandas">

```python
import pandas as pd


def model(dbt, session):
    dbt.config(materialized="table")

    model_df = pd.DataFrame({"A": [1, 2, 3, 4]})

    return model_df
```

</TabItem>

<TabItem value="Простой Spark" >

```python
def model(dbt, spark_session):
    dbt.config(materialized="table")

    data = [(1,), (2,), (3,), (4,)]

    df = spark_session.createDataFrame(data, ["A"])

    return df
```
</TabItem>

<TabItem value="Инкрементальный Spark" >

```python
def model(dbt, spark_session):
    dbt.config(materialized="incremental")
    df = dbt.ref("model")

    if dbt.is_incremental:
        max_from_this = (
            f"select max(run_date) from {dbt.this.schema}.{dbt.this.identifier}"
        )
        df = df.filter(df.run_date >= spark_session.sql(max_from_this).collect()[0][0])

    return df
```

</TabItem>

<TabItem value="Конфигурация модели Spark">

```python
def model(dbt, spark_session):
    dbt.config(
        materialized="table",
        engine_config={
            "CoordinatorDpuSize": 1,
            "MaxConcurrentDpus": 3,
            "DefaultExecutorDpuSize": 1
        },
        spark_encryption=True,
        spark_cross_account_catalog=True,
        spark_requester_pays=True
        polling_interval=15,
        timeout=120,
    )

    data = [(1,), (2,), (3,), (4,)]

    df = spark_session.createDataFrame(data, ["A"])

    return df
```

</TabItem>

<TabItem value="PySpark UDF" >

Использование импортированных внешних файлов Python:

```python
def model(dbt, spark_session):
    dbt.config(
        materialized="incremental",
        incremental_strategy="merge",
        unique_key="num",
    )
    sc = spark_session.sparkContext
    sc.addPyFile("s3://athena-dbt/test/file1.py")
    sc.addPyFile("s3://athena-dbt/test/file2.py")

    def func(iterator):
        from file2 import transform

        return [transform(i) for i in iterator]

    from pyspark.sql.functions import udf
    from pyspark.sql.functions import col

    udf_with_import = udf(func)

    data = [(1, "a"), (2, "b"), (3, "c")]
    cols = ["num", "alpha"]
    df = spark_session.createDataFrame(data, cols)

    return df.withColumn("udf_test_col", udf_with_import(col("alpha")))
```

</TabItem>

</Tabs>

### Известные проблемы в моделях на Python

- Модели на Python не могут [ссылаться на представления SQL Athena](https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark.html).
- Вы можете использовать сторонние библиотеки Python; однако они должны быть [включены в предустановленный список][pre-installed list] или [импортированы вручную][imported manually].
- Модели на Python могут ссылаться или записывать только в таблицы с именами, соответствующими регулярному выражению: `^[0-9a-zA-Z_]+$`. Spark не поддерживает дефисы или специальные символы, хотя Athena их поддерживает.
- Инкрементальные модели не полностью используют возможности Spark. Они частично зависят от существующей логики на основе SQL, которая выполняется на Trino.
- Материализации снимков не поддерживаются.
- Spark может ссылаться только на таблицы в том же каталоге.
- Для таблиц, созданных вне инструмента dbt, убедитесь, что поле местоположения заполнено, иначе dbt выдаст ошибку при создании таблицы.

[pre-installed list]: https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark-preinstalled-python-libraries.html
[imported manually]: https://docs.aws.amazon.com/athena/latest/ug/notebooks-import-files-libraries.html

## Контракты

Адаптер частично поддерживает определения контрактов:

- `data_type` поддерживается, но нуждается в корректировке для сложных типов. Типы должны быть указаны полностью (например, `array<int>`), хотя они не будут проверяться. Действительно, как рекомендует dbt, мы сравниваем только более широкий тип (array, map, int, varchar). Полное определение используется для проверки того, что типы данных, определенные в Athena, в порядке (предварительная проверка).
- Адаптер не поддерживает ограничения, так как в Athena нет концепции ограничений.
