---
title: "Добавление снимков в ваш DAG"
sidebar_label: "Снимки"
description: "Прочтите это руководство, чтобы узнать, как использовать снимки при работе с dbt."
id: "snapshots"
---

## Связанная документация
* [Конфигурации снимков](/reference/snapshot-configs)
* [Свойства снимков](/reference/snapshot-properties)
* [Команда `snapshot`](/reference/commands/snapshot)

## Что такое снимки?
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

## Конфигурирование снимков

<VersionBlock lastVersion="1.8" >

- Чтобы настроить снимки в версиях 1.8 и ранее, обратитесь к [Настройка снимков в версиях 1.8 и ранее](#configure-snapshots-in-versions-18-and-earlier). Эти версии используют более старый синтаксис, где снимки определяются в блоке снимков в файле `.sql`, который обычно находится в вашем каталоге `snapshots`.
- Обратите внимание, что определение нескольких ресурсов в одном файле может значительно замедлить разбор и компиляцию. Для более быстрого и эффективного управления рассмотрите обновленный синтаксис YAML для снимков, [доступный сейчас в "Latest" релизном треке в dbt Cloud](/docs/dbt-versions/cloud-release-tracks) или [dbt Core v1.9 и позже](/docs/dbt-versions/core).
  - Для получения дополнительной информации о миграции с устаревших конфигураций снимков на обновленный синтаксис YAML для снимков, обратитесь к [Миграция конфигурации снимков](/reference/snapshot-configs#snapshot-configuration-migration).

</VersionBlock>

<VersionBlock firstVersion="1.9">

Настройте ваши снимки в YAML-файлах, чтобы указать dbt, как обнаруживать изменения записей. Определите конфигурации снимков в YAML-файлах, рядом с вашими моделями, для более чистой, быстрой и согласованной настройки.

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
| [database](/reference/resource-configs/database) | Укажите пользовательскую базу данных для снимка | Нет | analytics |
| [schema](/reference/resource-configs/schema) | Укажите пользовательскую схему для снимка | Нет | snapshots |
| [alias](/reference/resource-configs/alias)   | Укажите псевдоним для снимка | Нет | your_custom_snapshot |
| [strategy](/reference/resource-configs/strategy) | Стратегия снимка для использования. Допустимые значения: `timestamp` или `check` | Да | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | <Term id="primary-key" /> колонка(и) (строка или массив) или выражение для записи | Да |  `id` или `[order_id, product_id]` |
| [check_cols](/reference/resource-configs/check_cols) | Если используется стратегия `check`, то колонки для проверки | Только если используется стратегия `check` | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | Если используется стратегия `timestamp`, колонка с временной меткой для сравнения | Только если используется стратегия `timestamp` | updated_at |
| [dbt_valid_to_current](/reference/resource-configs/dbt_valid_to_current) | Установите пользовательский индикатор для значения `dbt_valid_to` в текущих записях снимков (например, будущая дата). По умолчанию это значение `NULL`. При настройке dbt будет использовать указанное значение вместо `NULL` для `dbt_valid_to` для текущих записей в таблице снимков.| Нет | string |
| [snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names) | Настройте имена мета-полей снимков | Нет | dictionary |
| [hard_deletes](/reference/resource-configs/hard-deletes) | Укажите, как обрабатывать удаленные строки из источника. Поддерживаемые опции: `ignore` (по умолчанию), `invalidate` (заменяет устаревший `invalidate_hard_deletes=true`), и `new_record`.| Нет | string |

- В версиях до v1.9 конфигурации `target_schema` (обязательная) и `target_database` (необязательная) определяли единую схему или базу данных для создания снимка для всех пользователей и окружений. Это создавало проблемы при тестировании или разработке снимка, так как не было четкого разделения между средами разработки и производства. В v1.9 `target_schema` стало необязательным, позволяя снимкам быть осведомленными об окружении. По умолчанию, без определения `target_schema` или `target_database`, снимки теперь используют макросы `generate_schema_name` или `generate_database_name` для определения места создания. Разработчики все еще могут установить пользовательское местоположение с помощью конфигураций [`schema`](/reference/resource-configs/schema) и [`database`](/reference/resource-configs/database), что соответствует другим типам ресурсов.
- Поддерживается ряд других конфигураций (например, `tags` и `post-hook`). Для полного списка обратитесь к [Конфигурации снимков](/reference/snapshot-configs).
- Вы можете настроить снимки как из файла `dbt_project.yml`, так и из блока `config`. Для получения дополнительной информации обратитесь к [документации по конфигурации](/reference/snapshot-configs).

### Добавление снимка в ваш проект

Чтобы добавить снимок в ваш проект, выполните следующие шаги. Для пользователей версий 1.8 и ранее обратитесь к [Настройка снимков в версиях 1.8 и ранее](#configure-snapshots-in-versions-18-and-earlier).

1. Создайте YAML-файл в вашем каталоге `snapshots`: `snapshots/orders_snapshot.yml` и добавьте ваши детали конфигурации. Вы также можете настроить ваш снимок из файла `dbt_project.yml` ([документация](/reference/snapshot-configs)).

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

### Лучшие практики конфигурации

<Expandable alt_header="Используйте стратегию timestamp, где это возможно">

Эта стратегия лучше обрабатывает добавление и удаление колонок, чем стратегия `check`.

</Expandable>

<Expandable alt_header="Используйте dbt_valid_to_current для упрощения запросов по диапазону дат">

По умолчанию `dbt_valid_to` равно `NULL` для текущих записей. Однако, если вы установите [конфигурацию `dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current) (доступно в dbt Core v1.9+), `dbt_valid_to` будет установлено в указанное вами значение (например, `9999-12-31`) для текущих записей.

Это позволяет легко фильтровать по диапазону дат.

</Expandable>

<Expandable alt_header="Убедитесь, что ваш уникальный ключ действительно уникален">

Уникальный ключ используется dbt для сопоставления строк, поэтому крайне важно убедиться, что этот ключ действительно уникален! Если вы делаете снимок источника, я рекомендую добавить тест на уникальность в ваш источник ([пример](https://github.com/dbt-labs/jaffle_shop/blob/8e7c853c858018180bef1756ec93e193d9958c5b/models/staging/schema.yml#L26)).
</Expandable>

<VersionBlock lastVersion="1.8">

<Expandable alt_header="Используйте target_schema, отличную от вашей аналитической схемы">

Снимки не могут быть перестроены. Поэтому, хорошей идеей будет поместить снимки в отдельную схему, чтобы конечные пользователи знали, что они особенные. Оттуда вы можете установить разные привилегии на ваши снимки по сравнению с вашими моделями, и даже запускать их как другой пользователь (или роль, в зависимости от вашего хранилища данных), чтобы сделать очень сложным удаление снимка, если вы действительно этого не хотите.

</Expandable>
</VersionBlock>

<VersionBlock firstVersion="1.9">

<Expandable alt_header="Используйте схему, отличную от схемы ваших моделей">

Снимки не могут быть перестроены. Поэтому, хорошей идеей будет поместить снимки в отдельную схему, чтобы конечные пользователи знали, что они особенные. Оттуда вы можете установить разные привилегии на ваши снимки по сравнению с вашими моделями, и даже запускать их как другой пользователь (или роль, в зависимости от вашего хранилища данных), чтобы сделать очень сложным удаление снимка, если вы действительно этого не хотите.

</Expandable>

<Expandable alt_header="Используйте эфемерную модель для очистки или трансформации данных перед созданием снимка">

Если вам нужно очистить или трансформировать ваши данные перед созданием снимка, создайте эфемерную модель или модель стадии, которая применяет необходимые трансформации. Затем, ссылайтесь на эту модель в вашей конфигурации снимка. Этот подход позволяет держать ваши определения снимков чистыми и позволяет тестировать и запускать трансформации отдельно.

</Expandable>
</VersionBlock>

### Как работают снимки

Когда вы запускаете [команду `dbt snapshot`](/reference/commands/snapshot):
* **При первом запуске:** dbt создаст начальную таблицу снимков — это будет результирующий набор вашего `select` запроса с дополнительными колонками, включая `dbt_valid_from` и `dbt_valid_to`. Все записи будут иметь `dbt_valid_to = null` или значение, указанное в [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current) (доступно в dbt Core 1.9+), если настроено.
* **При последующих запусках:** dbt проверит, какие записи изменились или были созданы новые записи:
  - Колонка `dbt_valid_to` будет обновлена для всех существующих записей, которые изменились.
  - Обновленная запись и любые новые записи будут вставлены в таблицу снимков. Эти записи теперь будут иметь `dbt_valid_to = null` или значение, настроенное в `dbt_valid_to_current` (доступно в dbt Core v1.9+).

<VersionBlock firstVersion="1.9">

#### Примечание 
- Эти имена колонок могут быть настроены в соответствии с вашими командными или организационными соглашениями, используя конфигурацию [snapshot_meta_column_names](#snapshot-meta-fields).
- Используйте конфигурацию `dbt_valid_to_current`, чтобы установить пользовательский индикатор для значения `dbt_valid_to` в текущих записях снимков (например, будущая дата, такая как `9999-12-31`). По умолчанию это значение `NULL`. Когда установлено, dbt будет использовать это указанное значение вместо `NULL` для `dbt_valid_to` для текущих записей в таблице снимков.
- Используйте конфигурацию [`hard_deletes`](/reference/resource-configs/hard-deletes), чтобы отслеживать жесткие удаления, добавляя новую запись, когда строка становится "удаленной" в источнике. Поддерживаемые опции: `ignore`, `invalidate` и `new_record`.
</VersionBlock>

Снимки могут быть использованы в последующих моделях так же, как и модели — с помощью функции [ref](/reference/dbt-jinja-functions/ref).

## Обнаружение изменений строк
Стратегии снимков определяют, как dbt узнает, изменилась ли строка. В dbt встроены две стратегии:
- [Timestamp](#timestamp-strategy-recommended) &mdash; Использует колонку `updated_at`, чтобы определить, изменилась ли строка.
- [Check](#check-strategy) &mdash; Сравнивает список колонок между их текущими и историческими значениями, чтобы определить, изменилась ли строка.

### Стратегия Timestamp (рекомендуется)
Стратегия `timestamp` использует поле `updated_at`, чтобы определить, изменилась ли строка. Если настроенная колонка `updated_at` для строки более новая, чем в последний раз, когда снимок запускался, то dbt аннулирует старую запись и запишет новую. Если временные метки не изменились, то dbt не предпримет никаких действий.

Стратегия `timestamp` требует следующих конфигураций:

| Конфигурация | Описание | Пример |
| ------ | ----------- | ------- |
| updated_at | Колонка, которая представляет, когда исходная строка была в последний раз обновлена | `updated_at` |

**Пример использования:**

<VersionBlock lastVersion="1.8">

<File name='snapshots/orders_snapshot_timestamp.sql'>

```sql
{% snapshot orders_snapshot_timestamp %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

</VersionBlock>

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

### Стратегия Check
Стратегия `check` полезна для таблиц, которые не имеют надежной колонки `updated_at`. Эта стратегия работает, сравнивая список колонок между их текущими и историческими значениями. Если какая-либо из этих колонок изменилась, то dbt аннулирует старую запись и запишет новую. Если значения колонок идентичны, то dbt не предпримет никаких действий.

Стратегия `check` требует следующих конфигураций:

| Конфигурация | Описание | Пример |
| ------ | ----------- | ------- |
| check_cols | Список колонок для проверки изменений или `all` для проверки всех колонок | `["name", "email"]` |

:::caution check_cols = 'all'

Стратегия снимков `check` может быть настроена для отслеживания изменений _всех_ колонок, указав `check_cols = 'all'`. Лучше явно перечислить колонки, которые вы хотите проверить. Рассмотрите возможность использования <Term id="surrogate-key" /> для конденсации многих колонок в одну.

:::

**Пример использования**

<VersionBlock lastVersion="1.8">

<File name='snapshots/orders_snapshot_check.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          target_schema='snapshots',
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

</VersionBlock>

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

### Жесткие удаления (опционально)

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

#### Пример использования

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

<VersionBlock lastVersion="1.8">

Строки, которые удалены из исходного запроса, по умолчанию не аннулируются. С помощью опции конфигурации `invalidate_hard_deletes` dbt может отслеживать строки, которые больше не существуют. Это делается путем левого соединения таблицы снимков с исходной таблицей и фильтрации строк, которые все еще действительны на тот момент, но больше не могут быть найдены в исходной таблице. `dbt_valid_to` будет установлено на текущее время снимка.

Эта конфигурация не является другой стратегией, как описано выше, но является дополнительной опцией. Она не включена по умолчанию, так как изменяет предыдущее поведение.

Для этой конфигурации, чтобы работать со стратегией `timestamp`, настроенная колонка `updated_at` должна быть типа временной метки. В противном случае запросы будут завершаться с ошибкой из-за смешивания типов данных.

Примечание: в v1.9 и выше конфигурация [`hard_deletes`](/reference/resource-configs/hard-deletes) заменяет конфигурацию `invalidate_hard_deletes` для лучшего контроля над тем, как обрабатывать удаленные строки из источника.

#### Пример использования

<File name='snapshots/orders_snapshot_hard_delete.sql'>

```sql
{% snapshot orders_snapshot_hard_delete %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
          invalidate_hard_deletes=True,
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

</VersionBlock>

## Мета-поля снимков

Снимки <Term id="table">таблицы</Term> будут созданы как клон вашего исходного набора данных, плюс некоторые дополнительные мета-поля*.

В dbt Core v1.9+ (или доступно раньше в [релизном треке "Latest" в dbt Cloud](/docs/dbt-versions/cloud-release-tracks)):
- Эти имена колонок могут быть настроены в соответствии с вашими командными или организационными соглашениями, используя конфигурацию [`snapshot_meta_column_names`](/reference/resource-configs/snapshot_meta_column_names).
- Используйте конфигурацию [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current), чтобы установить пользовательский индикатор для значения `dbt_valid_to` в текущих записях снимков (например, будущая дата, такая как `9999-12-31`). По умолчанию это значение `NULL`. Когда установлено, dbt будет использовать это указанное значение вместо `NULL` для `dbt_valid_to` для текущих записей в таблице снимков.
- Используйте конфигурацию [`hard_deletes`](/reference/resource-configs/hard-deletes), чтобы отслеживать удаленные записи как новые строки с мета-полем `dbt_is_deleted`, когда используется поле `hard_deletes='new_record'`.

| Поле          | Значение | Использование |
| -------------- | ------- | ----- |
| dbt_valid_from | Временная метка, когда эта строка снимка была впервые вставлена | Эта колонка может быть использована для упорядочивания различных "версий" записи. |
| dbt_valid_to   | Временная метка, когда эта строка стала недействительной. <br /> Для текущих записей это `NULL` по умолчанию <VersionBlock firstVersion="1.9"> или значение, указанное в `dbt_valid_to_current`.</VersionBlock> | Самая последняя запись снимка будет иметь `dbt_valid_to`, установленное в `NULL` <VersionBlock firstVersion="1.9"> или указанное значение. </VersionBlock> |
| dbt_scd_id     | Уникальный ключ, сгенерированный для каждой записи снимка. | Это используется внутренне dbt |
| dbt_updated_at | Временная метка `updated_at` исходной записи, когда эта строка снимка была вставлена. | Это используется внутренне dbt |
| dbt_is_deleted | Логическое значение, указывающее, была ли запись удалена. `True`, если удалена, `False` в противном случае. | Добавляется, когда настроено `hard_deletes='new_record'`. Это используется внутренне dbt |

*Временные метки, используемые для каждой колонки, немного различаются в зависимости от используемой стратегии:

Для стратегии `timestamp` настроенная колонка `updated_at` используется для заполнения колонок `dbt_valid_from`, `dbt_valid_to` и `dbt_updated_at`.

<details>
<summary>  Подробности для стратегии timestamp </summary>

Результаты запроса снимка на `2024-01-01 11:00`

| id | status  | updated_at       |
| -- | ------- | ---------------- |
| 1        | pending | 2024-01-01 10:47 |

Результаты снимка (обратите внимание, что `11:00` нигде не используется):

| id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
| 1        | pending | 2024-01-01 10:47 | 2024-01-01 10:47 |                  | 2024-01-01 10:47 |

Результаты запроса на `2024-01-01 11:30`:

| id | status  | updated_at       |
| -- | ------- | ---------------- |
| 1  | shipped | 2024-01-01 11:05 |

Результаты снимка (обратите внимание, что `11:30` нигде не используется):

| id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
| 1  | pending | 2024-01-01 10:47 | 2024-01-01 10:47 | 2024-01-01 11:05 | 2024-01-01 10:47 |
| 1  | shipped | 2024-01-01 11:05 | 2024-01-01 11:05 |                  | 2024-01-01 11:05 |

Результаты снимка с `hard_deletes='new_record'`:

| id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   | dbt_is_deleted |
|----|---------|------------------|------------------|------------------|------------------|----------------|
| 1  | pending | 2024-01-01 10:47 | 2024-01-01 10:47 | 2024-01-01 11:05 | 2024-01-01 10:47 | False          |
| 1  | shipped | 2024-01-01 11:05 | 2024-01-01 11:05 | 2024-01-01 11:20 | 2024-01-01 11:05 | False          |
| 1  | deleted | 2024-01-01 11:20 | 2024-01-01 11:20 |                  | 2024-01-01 11:20 | True           |

</details>

<br/>

Для стратегии `check` используется текущая временная метка для заполнения каждой колонки. Если настроено, стратегия `check` использует колонку `updated_at` вместо этого, как и в стратегии timestamp.

<details>
<summary>  Подробности для стратегии check </summary>

Результаты запроса снимка на `2024-01-01 11:00`

| id | status  |
| -- | ------- |
| 1  | pending |

Результаты снимка:

| id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- |
| 1  | pending | 2024-01-01 11:00 |                  | 2024-01-01 11:00 |

Результаты запроса на `2024-01-01 11:30`:

| id | status  |
| -- | ------- |
| 1  | shipped |

Результаты снимка:

| id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| --- | ------- | ---------------- | ---------------- | ---------------- |
| 1   | pending | 2024-01-01 11:00 | 2024-01-01 11:30 | 2024-01-01 11:00 |
| 1   | shipped | 2024-01-01 11:30 |                  | 2024-01-01 11:30 |

Результаты снимка с `hard_deletes='new_record'`:

| id | status  |  dbt_valid_from   | dbt_valid_to     | dbt_updated_at   | dbt_is_deleted |
|----|---------|------------------|------------------|------------------|----------------|
| 1  | pending |  2024-01-01 11:00 | 2024-01-01 11:30 | 2024-01-01 11:00 | False          |
| 1  | shipped | 2024-01-01 11:30 | 2024-01-01 11:40 | 2024-01-01 11:30 | False          |
| 1  | deleted |  2024-01-01 11:40 |                  | 2024-01-01 11:40 | True           |

</details>

## Настройка снимков в версиях 1.8 и ранее

<VersionBlock firstVersion="1.9">

Для информации о настройке снимков в версиях dbt 1.8 и ранее выберите **1.8** в селекторе версии документации, и она появится в этом разделе.

Чтобы настроить снимки в версиях 1.9 и позже, обратитесь к [Конфигурирование снимков](#configuring-snapshots). Последние версии используют обновленный синтаксис конфигурации снимков, который оптимизирует производительность.

</VersionBlock>

<VersionBlock lastVersion="1.8">

- В версиях dbt 1.8 и ранее снимки представляют собой `select` запросы, определенные в блоке снимков в файле `.sql` (обычно в вашем каталоге `snapshots`). Вам также нужно будет настроить ваш снимок, чтобы указать dbt, как обнаруживать изменения записей.
- Более ранние версии dbt используют более старый синтаксис, который позволяет определять несколько ресурсов в одном файле. Этот синтаксис может значительно замедлить разбор и компиляцию.
- Для более быстрого и эффективного управления рассмотрите [выбор "Latest" релизного трека в dbt Cloud](/docs/dbt-versions/cloud-release-tracks) или последнюю версию dbt Core, которая вводит обновленный синтаксис конфигурации снимков, оптимизирующий производительность.
  - Для получения дополнительной информации о миграции с устаревших конфигураций снимков на обновленный синтаксис YAML для снимков, обратитесь к [Миграция конфигурации снимков](/reference/snapshot-configs#snapshot-configuration-migration).

Следующий пример показывает, как настроить снимок:

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      target_database='analytics',
      target_schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

Следующая таблица описывает доступные конфигурации для снимков в версиях 1.8 и ранее:

| Конфигурация | Описание | Обязательно? | Пример |
| ------ | ----------- | --------- | ------- |
| [target_database](/reference/resource-configs/target_database) | База данных, в которую dbt должен отобразить таблицу снимков | Нет | analytics |
| [target_schema](/reference/resource-configs/target_schema) | Схема, в которую dbt должен отобразить таблицу снимков | Да | snapshots |
| [strategy](/reference/resource-configs/strategy) | Стратегия снимка для использования. Одна из `timestamp` или `check` | Да | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | <Term id="primary-key" /> колонка или выражение для записи | Да | id |
| [check_cols](/reference/resource-configs/check_cols) | Если используется стратегия `check`, то колонки для проверки | Только если используется стратегия `check` | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | Если используется стратегия `timestamp`, колонка с временной меткой для сравнения | Только если используется стратегия `timestamp` | updated_at |
| [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) | Найти жестко удаленные записи в источнике и установить `dbt_valid_to` на текущее время, если больше не существует | Нет | True |

- Поддерживается ряд других конфигураций (например, `tags` и `post-hook`), ознакомьтесь с полным списком [здесь](/reference/snapshot-configs).
- Снимки могут быть настроены как из файла `dbt_project.yml`, так и из блока `config`, ознакомьтесь с [документацией по конфигурации](/reference/snapshot-configs) для получения дополнительной информации.
- Примечание: пользователи BigQuery могут использовать `target_project` и `target_dataset` как псевдонимы для `target_database` и `target_schema` соответственно.

### Пример конфигурации

Чтобы добавить снимок в ваш проект:

1. Создайте файл в вашем каталоге `snapshots` с расширением `.sql`, например, `snapshots/orders.sql`
2. Используйте блок `snapshot`, чтобы определить начало и конец снимка:

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{% endsnapshot %}
```

</File>

3. Напишите `select` запрос внутри блока снимка (советы по написанию хорошего запроса для снимка приведены ниже). Этот запрос select определяет результаты, которые вы хотите снимать с течением времени. Вы можете использовать `sources` и `refs` здесь.

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

4. Проверьте, включает ли результирующий набор вашего запроса надежную колонку с временной меткой, которая указывает, когда запись была в последний раз обновлена. В нашем примере колонка `updated_at` надежно указывает изменения записей, поэтому мы можем использовать стратегию `timestamp`. Если в результирующем наборе вашего запроса нет надежной временной метки, вам нужно будет использовать стратегию `check` — подробнее об этом ниже.

5. Добавьте конфигурации к вашему снимку, используя блок `config` (подробнее об этом ниже). Вы также можете настроить ваш снимок из файла `dbt_project.yml` ([документация](/reference/snapshot-configs)).

<VersionBlock lastVersion="1.8">

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      target_database='analytics',
      target_schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

6. Запустите команду `dbt snapshot` [command](/reference/commands/snapshot) — в нашем примере будет создана новая таблица в `analytics.snapshots.orders_snapshot`. Вы можете изменить конфигурацию `target_database`, конфигурацию `target_schema` и имя снимка (как определено в `{% snapshot .. %}`), чтобы изменить, как dbt называет эту таблицу.

</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      schema='snapshots',
      unique_key='id',
      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

6. Запустите команду `dbt snapshot` [command](/reference/commands/snapshot)  &mdash; в нашем примере будет создана новая таблица в `analytics.snapshots.orders_snapshot`. Конфигурация [`schema`](/reference/resource-configs/schema) будет использовать макрос `generate_schema_name`.

</VersionBlock>

```
$ dbt snapshot
Running with dbt=1.8.0

15:07:36 | Concurrency: 8 threads (target='dev')
15:07:36 |
15:07:36 | 1 of 1 START snapshot snapshots.orders_snapshot...... [RUN]
15:07:36 | 1 of 1 OK snapshot snapshots.orders_snapshot..........[SELECT 3 in 1.82s]
15:07:36 |
15:07:36 | Finished running 1 snapshots in 0.68s.

Completed successfully

Done. PASS=2 ERROR=0 SKIP=0 TOTAL=1
```

7. Проверьте результаты, выбрав из таблицы, созданной dbt. После первого запуска вы должны увидеть результаты вашего запроса, плюс [мета-поля снимков](#snapshot-meta-fields), описанные ранее.

8. Запустите команду `dbt snapshot` снова и проверьте результаты. Если какие-либо записи были обновлены, снимок должен это отразить.

9. Выберите из `snapshot` в последующих моделях, используя функцию `ref`.

<File name='models/changed_orders.sql'>

```sql
select * from {{ ref('orders_snapshot') }}
```

</File>

10. Снимки полезны только в том случае, если вы запускаете их часто — запланируйте регулярный запуск команды `snapshot`.

</VersionBlock>

## Часто задаваемые вопросы
<FAQ path="Runs/run-one-snapshot" />
<FAQ path="Runs/snapshot-frequency" />
<FAQ path="Snapshots/snapshot-schema-changes" />
<FAQ path="Snapshots/snapshot-hooks" />
<FAQ path="Accounts/configurable-snapshot-path" />
<FAQ path="Snapshots/snapshot-target-is-not-a-snapshot-table" />