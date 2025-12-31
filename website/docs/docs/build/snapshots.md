---
title: "Добавление снапшотов в ваш DAG"
sidebar_label: "Снапшоты"
description: "Настройка снапшотов в dbt для отслеживания изменений ваших данных со временем."
id: "snapshots"
---

## Связанная документация {#related-documentation}

- [Конфигурации снапшотов](/reference/snapshot-configs)
- [Свойства снапшотов](/reference/snapshot-properties)
- [Команда `snapshot`](/reference/commands/snapshot)

import CourseCallout from '/snippets/_materialization-video-callout.md';

<CourseCallout resource="Snapshots" 
url="https://learn.getdbt.com/courses/snapshots"
course="Snapshots"
/>

## Что такое снимки? {#what-are-snapshots}
Аналитикам часто нужно "оглядываться назад" на предыдущие состояния данных в изменяемых таблицах. Хотя некоторые системы исходных данных построены таким образом, что доступ к историческим данным возможен, это не всегда так. dbt предоставляет механизм, **снимки**, который фиксирует изменения в изменяемой <Term id="table" /> с течением времени.

Снимки реализуют [тип-2 медленно изменяющихся измерений](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row) в изменяемых исходных таблицах. Эти медленно изменяющиеся измерения (или SCD) определяют, как строка в таблице изменяется с течением времени. Представьте, что у вас есть таблица `orders`, где поле `status` может быть перезаписано по мере обработки заказа.

| id | status | updated_at |
| -- | ------ | ---------- |
| 1 | pending | 2024-01-01 |

Теперь представьте, что заказ переходит из состояния "pending" в "shipped". Эта же запись теперь будет выглядеть так:

| id | status | updated_at |
| -- | ------ | ---------- |
| 1 | shipped | 2024-01-02 |

Этот заказ теперь в состоянии "shipped", но мы потеряли информацию о том, когда заказ в последний раз находился в состоянии "pending". Это затрудняет (или делает невозможным) анализ того, сколько времени потребовалось для отправки заказа. dbt может "сделать снимок" этих изменений, чтобы помочь вам понять, как значения в строке изменяются с течением времени. Вот пример таблицы снимков для предыдущего примера:

| id | status | updated_at | dbt_valid_from | dbt_valid_to |
| -- | ------ | ---------- | -------------- | ------------ |
| 1 | pending | 2024-01-01 | 2024-01-01 | 2024-01-02 |
| 1 | shipped | 2024-01-02 | 2024-01-02 | `null` |

## Конфигурирование снимков {#configuring-snapshots}

<VersionBlock firstVersion="1.9">

Настраивайте свои snapshots в YAML-файлах, чтобы указать dbt, как обнаруживать изменения записей. Определяйте конфигурации snapshots в YAML-файлах рядом с вашими моделями — это обеспечивает более чистую, быструю и согласованную настройку. Размещайте YAML-файлы snapshots в директории models или в директории snapshots.

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: string
    relation: relation # source('my_source', 'my_table') или ref('my_model')
    [description](/reference/resource-properties/description):  markdown_string
    config:
      [database](/reference/resource-configs/database): string
      [schema](/reference/resource-configs/schema): string
      [alias](/reference/resource-configs/alias): string
      [strategy](/reference/resource-configs/strategy): timestamp | check
      [unique_key](/reference/resource-configs/unique_key): column_name_or_expression
      [check_cols](/reference/resource-configs/check_cols): [column_name] | all
      [updated_at](/reference/resource-configs/updated_at): column_name
      [snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names): dictionary
      [dbt_valid_to_current](/reference/resource-configs/dbt_valid_to_current): string
      [hard_deletes](/reference/resource-configs/hard-deletes): ignore | invalidate | new_record 
```

</File>

Следующая таблица описывает доступные конфигурации для снимков:

| Конфигурация | Описание | Обязательно? | Пример |
| ------ | ----------- | --------- | ------- |
| [database](/reference/resource-configs/database) | Указать пользовательскую базу данных для snapshot | No | analytics |
| [schema](/reference/resource-configs/schema) | Указать пользовательскую схему для snapshot | No | snapshots |
| [alias](/reference/resource-configs/alias)   | Указать алиас для snapshot | No | your_custom_snapshot |
| [strategy](/reference/resource-configs/strategy) | Стратегия snapshot, которую следует использовать. Допустимые значения: `timestamp` или `check` | Yes | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | Колонка(и) <Term id="primary-key" /> (строка или массив) либо выражение, которое однозначно идентифицирует запись | Yes | `id` или `[order_id, product_id]` |
| [check_cols](/reference/resource-configs/check_cols) | При использовании стратегии `check` — колонки, которые нужно проверять | Only if using the `check` strategy | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | Колонка в результатах snapshot‑запроса, которая указывает, когда каждая запись была обновлена в последний раз. Используется в стратегии `timestamp`. В зависимости от используемой платформы данных может поддерживать строки с датами в формате ISO и целочисленные значения unix epoch. | Only if using the `timestamp` strategy | updated_at |
| [dbt_valid_to_current](/reference/resource-configs/dbt_valid_to_current) | Задать пользовательское значение для поля `dbt_valid_to` в актуальных записях snapshot (например, дату в будущем). По умолчанию это значение равно `NULL`. Если настройка задана, dbt будет использовать указанное значение вместо `NULL` для `dbt_valid_to` у текущих записей в таблице snapshot. | No | string |
| [snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names) | Настроить имена мета‑полей snapshot | No | dictionary |
| [hard_deletes](/reference/resource-configs/hard-deletes) | Указать, как обрабатывать удалённые строки из источника. Поддерживаемые варианты: `ignore` (по умолчанию), `invalidate` (заменяет устаревший `invalidate_hard_deletes=true`) и `new_record`. | No | string |

- В версии v1.9 параметр `target_schema` стал необязательным, что позволило snapshot‑ам учитывать окружение. По умолчанию, если `target_schema` или `target_database` не определены, snapshot‑ы используют макросы `generate_schema_name` или `generate_database_name`, чтобы определить, где выполняться.
- Разработчики по‑прежнему могут задать пользовательское расположение с помощью конфигураций [`schema`](/reference/resource-configs/schema) и [`database`](/reference/resource-configs/database), аналогично другим типам ресурсов.
- Также поддерживается ряд других конфигураций (например, `tags` и `post-hook`). Полный список см. в разделе [Snapshot configurations](/reference/snapshot-configs).
- Вы можете настраивать snapshot‑ы как в файле `dbt_project.yml`, так и в блоке `config`. Подробнее см. в [документации по конфигурации](/reference/snapshot-configs).

Чтобы добавить снимок в ваш проект, выполните следующие шаги. Для пользователей версий 1.8 и ранее обратитесь к [Настройка снимков в версиях 1.8 и ранее](#configure-snapshots-in-versions-18-and-earlier).

Чтобы добавить snapshot в ваш проект, выполните следующие шаги. Для пользователей версий 1.8 и ниже см. раздел [Legacy snapshot configurations](/reference/resource-configs/snapshots-jinja-legacy).

1. Создайте YAML-файл с настройками в каталоге `snapshots`: `snapshots/orders_snapshot.yml` и добавьте в него параметры конфигурации. Также вы можете настроить snapshot из YAML-файла проекта (`dbt_project.yml`) ([docs](/reference/snapshot-configs)).

    <File name='snapshots/orders_snapshot.yml'>

    ```yaml
    snapshots:
      - name: orders_snapshot
        relation: source('jaffle_shop', 'orders')
        config:
          schema: snapshots
          database: analytics
          unique_key: id
          strategy: timestamp
          updated_at: updated_at
          dbt_valid_to_current: "to_date('9999-12-31')" # Указывает, что текущие записи должны иметь `dbt_valid_to`, установленное в `'9999-12-31'` вместо `NULL`.

    ```
    </File>

2. Поскольку снимки сосредоточены на конфигурации, логика трансформации минимальна. Обычно вы выбираете все данные из источника. Если вам нужно применить трансформации (например, фильтры, удаление дубликатов), лучше всего определить эфемерную модель и ссылаться на нее в вашей конфигурации снимка.

    <File name="models/ephemeral_orders.sql" >

    ```yaml
    {{ config(materialized='ephemeral') }}

    select * from {{ source('jaffle_shop', 'orders') }}
    ```
    </File>

3. Проверьте, включает ли результирующий набор вашего запроса надежную колонку с временной меткой, которая указывает, когда запись была в последний раз обновлена. В нашем примере колонка `updated_at` надежно указывает изменения записей, поэтому мы можем использовать стратегию `timestamp`. Если в результирующем наборе вашего запроса нет надежной временной метки, вам нужно будет использовать стратегию `check` — подробнее об этом ниже.

4. Запустите команду `dbt snapshot` [command](/reference/commands/snapshot) — в нашем примере будет создана новая таблица в `analytics.snapshots.orders_snapshot`. Конфигурация [`schema`](/reference/resource-configs/schema) будет использовать макрос `generate_schema_name`.

    ```
    $ dbt snapshot
    Running with dbt=1.9.0

    15:07:36 | Concurrency: 8 threads (target='dev')
    15:07:36 |
    15:07:36 | 1 of 1 START snapshot snapshots.orders_snapshot...... [RUN]
    15:07:36 | 1 of 1 OK snapshot snapshots.orders_snapshot..........[SELECT 3 in 1.82s]
    15:07:36 |
    15:07:36 | Finished running 1 snapshots in 0.68s.

    Completed successfully

    Done. PASS=2 ERROR=0 SKIP=0 TOTAL=1
    ```

5. Проверьте результаты, выбрав из таблицы, созданной dbt (`analytics.snapshots.orders_snapshot`). После первого запуска вы должны увидеть результаты вашего запроса, плюс [мета-поля снимков](#snapshot-meta-fields), описанные далее.

6. Запустите команду `dbt snapshot` снова и проверьте результаты. Если какие-либо записи были обновлены, снимок должен это отразить.

7. Выберите из `snapshot` в последующих моделях, используя функцию `ref`.

    <File name='models/changed_orders.sql'>

    ```sql
    select * from {{ ref('orders_snapshot') }}
    ```
    </File>

8. Снимки полезны только в том случае, если вы запускаете их часто — запланируйте регулярный запуск команды `dbt snapshot`.

</VersionBlock>

### Лучшие практики конфигурации {#add-a-snapshot-to-your-project}

<Expandable alt_header="Используйте стратегию timestamp, где это возможно">

Стратегия `timestamp` рекомендуется, потому что она более эффективно обрабатывает добавление и удаление колонок по сравнению со стратегией `check`. Это связано с тем, что она более устойчива к изменениям схемы, особенно когда со временем в таблице появляются новые колонки или удаляются существующие.

Стратегия `timestamp` опирается на одно поле `updated_at`, что позволяет избежать необходимости постоянно обновлять конфигурацию snapshot’а по мере эволюции исходной таблицы.

Почему `timestamp` — предпочтительная стратегия:

- Требуется отслеживать только одну колонку (`updated_at`)
- Автоматически обрабатывает появление новых или удаление существующих колонок в исходной таблице
- Меньше подвержена ошибкам при изменении схемы таблицы со временем (например, при использовании стратегии `check` может потребоваться обновлять параметр `check_cols`)

</Expandable>

<Expandable alt_header="Используйте dbt_valid_to_current для упрощения запросов по диапазону дат">

По умолчанию `dbt_valid_to` равно `NULL` для текущих записей. Однако, если вы установите [конфигурацию `dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current) (доступно в dbt Core v1.9+), `dbt_valid_to` будет установлено в указанное вами значение (например, `9999-12-31`) для текущих записей.

Это позволяет легко фильтровать по диапазону дат.

</Expandable>

<Expandable alt_header="Убедитесь, что ваш уникальный ключ действительно уникален">

Уникальный ключ используется dbt для сопоставления строк, поэтому крайне важно убедиться, что этот ключ действительно уникален! Если вы делаете снимок источника, я рекомендую добавить тест на уникальность в ваш источник ([пример](https://github.com/dbt-labs/jaffle_shop/blob/8e7c853c858018180bef1756ec93e193d9958c5b/models/staging/schema.yml#L26)).
</Expandable>

<VersionBlock firstVersion="1.9">

<Expandable alt_header="Используйте схему, отличную от схемы ваших моделей">

Снимки не могут быть перестроены. Поэтому, хорошей идеей будет поместить снимки в отдельную схему, чтобы конечные пользователи знали, что они особенные. Оттуда вы можете установить разные привилегии на ваши снимки по сравнению с вашими моделями, и даже запускать их как другой пользователь (или роль, в зависимости от вашего хранилища данных), чтобы сделать очень сложным удаление снимка, если вы действительно этого не хотите.

</Expandable>

<Expandable alt_header="Используйте эфемерную модель для очистки или трансформации данных перед созданием снимка">

Если вам нужно очистить или трансформировать ваши данные перед созданием снимка, создайте эфемерную модель или модель стадии, которая применяет необходимые трансформации. Затем, ссылайтесь на эту модель в вашей конфигурации снимка. Этот подход позволяет держать ваши определения снимков чистыми и позволяет тестировать и запускать трансформации отдельно.

</Expandable>
</VersionBlock>

### Как работают снимки {#configuration-best-practices}

Когда вы запускаете команду [`dbt snapshot`](/reference/commands/snapshot):

- **При первом запуске:** dbt создаст исходную таблицу снапшота — это будет результат выполнения вашего `select`‑запроса с добавленными колонками, включая `dbt_valid_from` и `dbt_valid_to`. Для всех записей значение `dbt_valid_to` будет равно `null` либо значению, заданному в [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current) (доступно начиная с dbt Core 1.9+), если эта настройка сконфигурирована.
- **При последующих запусках:** dbt проверит, какие записи изменились, а также появились ли новые записи:
  - Колонка `dbt_valid_to` будет обновлена для всех существующих записей, которые изменились.
  - Обновлённые записи и все новые записи будут вставлены в таблицу снапшота. Для этих записей значение `dbt_valid_to` будет равно `null` либо значению, заданному в `dbt_valid_to_current` (доступно в dbt Core v1.9+).

<VersionBlock firstVersion="1.9">

#### Примечание {#note}
- Эти имена колонок могут быть настроены в соответствии с вашими командными или организационными соглашениями, используя конфигурацию [snapshot_meta_column_names](#snapshot-meta-fields).
- Используйте конфигурацию `dbt_valid_to_current`, чтобы установить пользовательский индикатор для значения `dbt_valid_to` в текущих записях снимков (например, будущая дата, такая как `9999-12-31`). По умолчанию это значение `NULL`. Когда установлено, dbt будет использовать это указанное значение вместо `NULL` для `dbt_valid_to` для текущих записей в таблице снимков.
- Используйте конфигурацию [`hard_deletes`](/reference/resource-configs/hard-deletes), чтобы отслеживать жесткие удаления, добавляя новую запись, когда строка становится "удаленной" в источнике. Поддерживаемые опции: `ignore`, `invalidate` и `new_record`.
</VersionBlock>

Снимки могут быть использованы в последующих моделях так же, как и модели — с помощью функции [ref](/reference/dbt-jinja-functions/ref).

## Обнаружение изменений строк {#detecting-row-changes}
Стратегии снимков определяют, как dbt узнает, изменилась ли строка. В dbt встроены две стратегии:
- [Timestamp](#timestamp-strategy-recommended) &mdash; Использует колонку `updated_at`, чтобы определить, изменилась ли строка.
- [Check](#check-strategy) &mdash; Сравнивает список колонок между их текущими и историческими значениями, чтобы определить, изменилась ли строка.

### Стратегия Timestamp (рекомендуется) {#timestamp-strategy-recommended}
Стратегия `timestamp` использует поле `updated_at`, чтобы определить, изменилась ли строка. Если настроенная колонка `updated_at` для строки более новая, чем в последний раз, когда снимок запускался, то dbt аннулирует старую запись и запишет новую. Если временные метки не изменились, то dbt не предпримет никаких действий.

Почему рекомендуется использовать `timestamp`?

- Требуется отслеживать только одну колонку (`updated_at`)
- Автоматически обрабатывает появление новых или удаление существующих колонок в исходной таблице
- Меньше подвержен ошибкам при эволюции схемы таблицы со временем (например, при использовании стратегии `check` может потребоваться обновлять конфигурацию `check_cols`)

Стратегия `timestamp` требует следующих настроек:

| Конфигурация | Описание | Пример |
| ------ | ----------- | ------- |
| updated_at | Столбец, который отражает момент последнего обновления строки источника. В зависимости от используемой платформы данных может поддерживать строки дат в формате ISO и целые числа unix epoch. | `updated_at` |

**Пример использования:**

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot_timestamp
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
```
</File>
</VersionBlock>

### Стратегия Check {#check-strategy}
Стратегия `check` полезна для таблиц, которые не имеют надежной колонки `updated_at`. Эта стратегия работает, сравнивая список колонок между их текущими и историческими значениями. Если какая-либо из этих колонок изменилась, то dbt аннулирует старую запись и запишет новую. Если значения колонок идентичны, то dbt не предпримет никаких действий.

Стратегия `check` требует следующих конфигураций:

| Конфигурация | Описание | Пример |
| ------ | ----------- | ------- |
| check_cols | Список колонок для проверки изменений или `all` для проверки всех колонок | `["name", "email"]` |

:::caution check_cols = 'all'

Стратегия снимков `check` может быть настроена для отслеживания изменений _всех_ колонок, указав `check_cols = 'all'`. Лучше явно перечислить колонки, которые вы хотите проверить. Рассмотрите возможность использования <Term id="surrogate-key" /> для конденсации многих колонок в одну.

:::

#### Пример использования {#example-usage}

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols:
        - status
        - is_cancelled
```

</File>

</VersionBlock>

#### Пример использования с `updated_at` {#example-usage-with-updated_at}

При использовании стратегии `check` dbt отслеживает изменения, сравнивая значения в `check_cols`. По умолчанию dbt использует текущее время выполнения, чтобы заполнять поля `dbt_updated_at`, `dbt_valid_from` и `dbt_valid_to`. При этом вы можете дополнительно указать колонку `updated_at`:

- Если `updated_at` настроена, стратегия `check` будет использовать эту колонку вместо времени выполнения, аналогично стратегии `timestamp`.
- Если значение `updated_at` равно null, dbt по умолчанию использует текущее время.

Рассмотрим следующий пример, который показывает, как использовать стратегию `check` с `updated_at`:

```yaml
snapshots:
  - name: orders_snapshot
    relation: ref('stg_orders')
    config:
      schema: snapshots
      unique_key: order_id
      strategy: check
      check_cols:
        - status
        - is_cancelled
      updated_at: updated_at
```

В этом примере:

- Если изменяется хотя бы одно из указанных значений в `check_cols`, снапшот создаёт новую строку. Если колонка `updated_at` содержит значение (не равна null), снапшот использует его; в противном случае используется текущее время.
- Если `updated_at` не задана, dbt автоматически возвращается к [использованию текущего времени](#sample-results-for-the-check-strategy) для отслеживания изменений.
- Используйте этот подход, если ваша колонка `updated_at` не всегда надёжна для отслеживания обновлений записей, но вы всё равно хотите применять её — вместо времени выполнения снапшота — когда изменения строк всё же обнаружены.

### Жёсткие удаления (opt-in) {#hard-deletes-opt-in}

<VersionBlock firstVersion="1.9">

В dbt v1.9 и выше конфигурация [`hard_deletes`](/reference/resource-configs/hard-deletes) заменяет конфигурацию `invalidate_hard_deletes`, чтобы дать вам больше контроля над тем, как обрабатывать удаленные строки из источника. Конфигурация `hard_deletes` не является отдельной стратегией, а дополнительной опцией, которую можно использовать с любой стратегией снимков.

Конфигурация `hard_deletes` имеет три опции/поля:
| Поле | Описание |
| --------- | ----------- |
| `ignore` (по умолчанию) | Нет действий для удаленных записей. |
| `invalidate` | Ведет себя так же, как существующий `invalidate_hard_deletes=true`, где удаленные записи аннулируются, устанавливая `dbt_valid_to`. |
| `new_record` | Отслеживает удаленные записи как новые строки, используя мета-поле `dbt_is_deleted`, когда записи удаляются.|

import HardDeletes from '/snippets/_hard-deletes.md';

<HardDeletes />

#### Пример использования {#example-usage-1}

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot_hard_delete
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
      hard_deletes: new_record  # опции: 'ignore', 'invalidate' или 'new_record'
```

</File>

В этом примере конфигурация `hard_deletes: new_record` добавит новую строку для удаленных записей с колонкой `dbt_is_deleted`, установленной в `True`.
Любые восстановленные записи добавляются как новые строки с полем `dbt_is_deleted`, установленным в `False`.

Результирующая таблица будет выглядеть так:

| id | status | updated_at | dbt_valid_from | dbt_valid_to | dbt_is_deleted |
| -- | ------ | ---------- | -------------- | ------------ | -------------- |
| 1  | pending | 2024-01-01 10:47 | 2024-01-01 10:47 | 2024-01-01 11:05 | False          |
| 1  | shipped | 2024-01-01 11:05 | 2024-01-01 11:05 | 2024-01-01 11:20 | False          |
| 1  | deleted | 2024-01-01 11:20 | 2024-01-01 11:20 |                  | True           |
| 1  | restored | 2024-01-01 12:00 | 2024-01-01 12:00 |                 | False        |

</VersionBlock>

## Метаполя snapshot {#snapshot-meta-fields}

Снимки <Term id="table">таблицы</Term> будут созданы как клон вашего исходного набора данных, плюс некоторые дополнительные мета-поля*.

В <Constant name="core" /> версии 1.9+ (или доступно раньше в [треке релизов «Latest» для <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks)):

- Эти имена колонок можно настроить в соответствии с командными или организационными соглашениями с помощью конфига [`snapshot_meta_column_names`](/reference/resource-configs/snapshot_meta_column_names).
- Используйте конфиг [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current), чтобы задать пользовательский индикатор значения `dbt_valid_to` для текущих записей снапшота (например, будущую дату вроде `9999-12-31`). По умолчанию это значение равно `NULL`. Если оно задано, dbt будет использовать указанное значение вместо `NULL` для `dbt_valid_to` у текущих записей в таблице снапшота.
- Используйте конфиг [`hard_deletes`](/reference/resource-configs/hard-deletes) для отслеживания удалённых записей как новых строк с мета-полем `dbt_is_deleted` при использовании значения `hard_deletes='new_record'`.


| Field          | <div style={{width:'250px'}}>Значение</div> | Примечания | Пример |
| -------------- | ------- | ----- | ------- |
| `dbt_valid_from` | Временная метка, когда эта строка снапшота была впервые вставлена и стала валидной. | Эту колонку можно использовать для упорядочивания различных «версий» записи. | `snapshot_meta_column_names: {dbt_valid_from: start_date}` |
| `dbt_valid_to`   | Временная метка, когда эта строка стала невалидной. Для текущих записей по умолчанию это `NULL` или значение, указанное в `dbt_valid_to_current`. | Самая последняя запись снапшота будет иметь `dbt_valid_to`, равное `NULL` или указанному значению. | `snapshot_meta_column_names: {dbt_valid_to: end_date}` |
| `dbt_scd_id`     | Уникальный ключ, сгенерированный для каждой строки снапшота. | Используется внутри dbt. | `snapshot_meta_column_names: {dbt_scd_id: scd_id}` |
| `dbt_updated_at` | Временная метка `updated_at` исходной записи на момент вставки этой строки снапшота. | Используется внутри dbt. | `snapshot_meta_column_names: {dbt_updated_at: modified_date}` |
| `dbt_is_deleted` | Строковое значение, указывающее, была ли запись удалена (`True` — удалена, `False` — не удалена). | Добавляется, когда сконфигурирован `hard_deletes='new_record'`. | `snapshot_meta_column_names: {dbt_is_deleted: is_deleted}` |

Все эти имена колонок можно настроить с помощью конфига `snapshot_meta_column_names`. Подробнее см. в этом [примере](/reference/resource-configs/snapshot_meta_column_names#example).

*Временные метки, используемые для каждой колонки, немного различаются в зависимости от используемой стратегии:

- Для стратегии `timestamp` настроенная колонка `updated_at` используется для заполнения колонок `dbt_valid_from`, `dbt_valid_to` и `dbt_updated_at`.

  <Expandable alt_header="Sample results for the timestamp strategy">

  Результаты snapshot‑запроса на момент `2024-01-01 11:00`

  | id | status  | updated_at       |
  | -- | ------- | ---------------- |
  | 1        | pending | 2024-01-01 10:47 |

  Результаты снапшота (обратите внимание, что `11:00` нигде не используется):

  | id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
  | -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
  | 1        | pending | 2024-01-01 10:47 | 2024-01-01 10:47 |                  | 2024-01-01 10:47 |

  Результаты запроса на момент `2024-01-01 11:30`:

  | id | status  | updated_at       |
  | -- | ------- | ---------------- |
  | 1  | shipped | 2024-01-01 11:05 |

  Результаты snapshot (обратите внимание, что `11:30` нигде не используется):

  | id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
  | -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
  | 1  | pending | 2024-01-01 10:47 | 2024-01-01 10:47 | 2024-01-01 11:05 | 2024-01-01 10:47 |
  | 1  | shipped | 2024-01-01 11:05 | 2024-01-01 11:05 |                  | 2024-01-01 11:05 |

  Результаты snapshot при `hard_deletes='new_record'`:

  | id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   | dbt_is_deleted |
  |----|---------|------------------|------------------|------------------|------------------|----------------|
  | 1  | pending | 2024-01-01 10:47 | 2024-01-01 10:47 | 2024-01-01 11:05 | 2024-01-01 10:47 | False          |
  | 1  | shipped | 2024-01-01 11:05 | 2024-01-01 11:05 | 2024-01-01 11:20 | 2024-01-01 11:05 | False          |
  | 1  | deleted | 2024-01-01 11:20 | 2024-01-01 11:20 |                  | 2024-01-01 11:20 | True           |


  </Expandable>

 - Для стратегии `check` текущая временная метка используется для заполнения каждого столбца. Если настроено, стратегия `check` вместо этого использует столбец `updated_at`, как и стратегия временных меток.

<Expandable alt_header="Пример результатов для стратегии check">

  Результаты snapshot-запроса на момент `2024-01-01 11:00`

  | id | status  |
  | -- | ------- |
  | 1  | pending |

  Snapshot results:

  | id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
  | -- | ------- | ---------------- | ---------------- | ---------------- |
  | 1  | pending | 2024-01-01 11:00 |                  | 2024-01-01 11:00 |

  Query results at `2024-01-01 11:30`:

  | id | status  |
  | -- | ------- |
  | 1  | shipped |

  Snapshot results:

  | id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
  | --- | ------- | ---------------- | ---------------- | ---------------- |
  | 1   | pending | 2024-01-01 11:00 | 2024-01-01 11:30 | 2024-01-01 11:00 |
  | 1   | shipped | 2024-01-01 11:30 |                  | 2024-01-01 11:30 |

  Snapshot results with `hard_deletes='new_record'`:

  | id | status  |  dbt_valid_from   | dbt_valid_to     | dbt_updated_at   | dbt_is_deleted |
  |----|---------|------------------|------------------|------------------|----------------|
  | 1  | pending |  2024-01-01 11:00 | 2024-01-01 11:30 | 2024-01-01 11:00 | False          |
  | 1  | shipped | 2024-01-01 11:30 | 2024-01-01 11:40 | 2024-01-01 11:30 | False          |
  | 1  | deleted |  2024-01-01 11:40 |                  | 2024-01-01 11:40 | True           |

  </Expandable>


## Часто задаваемые вопросы {#faqs}
<FAQ path="Runs/run-one-snapshot" />
<FAQ path="Runs/snapshot-frequency" />
<FAQ path="Snapshots/snapshot-schema-changes" />
<FAQ path="Snapshots/snapshot-hooks" />
<FAQ path="Accounts/configurable-snapshot-path" />
<FAQ path="Snapshots/snapshot-target-is-not-a-snapshot-table" />
