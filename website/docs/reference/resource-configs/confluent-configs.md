---
title: "Конфигурации Confluent Cloud"
id: "confluent-configs"
description: "Справочник по конфигурациям моделей dbt для Apache Flink в Confluent Cloud."
---

Адаптер `dbt-confluent` поддерживает следующие материализации и конфигурации для создания моделей в [Confluent Cloud for Apache Flink](https://docs.confluent.io/cloud/current/flink/overview.html). Более подробные инструкции по началу работы приведены в [документации по dbt в Confluent Cloud](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/deploy-flink-dbt.html).

## Материализации

| Материализация | Описание |
|---|---|
| `view` | Представление Flink SQL, которое удаляется и создаётся заново. |
| `streaming_table` | Создаёт таблицу Flink SQL и отдельный длительно выполняющийся оператор `INSERT INTO`, который непрерывно записывает результаты запроса в таблицу. Если таблица уже существует, адаптер проверяет наличие расхождений в схеме и пропускает создание; используйте `--full-refresh`, чтобы удалить и заново создать таблицу. |
| `streaming_source` | Создаёт таблицу Flink SQL на основе коннектора (например, `faker` для генерации тестовых данных). Требует настройки `connector`. SQL-код модели задаёт определения столбцов. Если таблица уже существует, адаптер проверяет наличие расхождений в схеме и пропускает создание; используйте `--full-refresh`, чтобы удалить и заново создать таблицу. |
| `ephemeral` | Стандартный фрагмент запроса dbt на основе CTE, который не материализуется во Flink. |

### Неподдерживаемые материализации

- **`table`**: Официально не поддерживается. Поддержка появится в ближайшее время.
- **`materialized_view`**: Не поддерживается. Вместо неё используйте `streaming_table`.
- **`incremental`**: Не поддерживается. Семантика пакетной инкрементальной обработки dbt не соответствует модели непрерывной обработки Flink. Вместо неё используйте `streaming_table`.
- **`snapshot`**: Не поддерживается. Во Flink SQL отсутствуют пакетные операции (`MERGE`, `UPDATE`), необходимые для снимков dbt.

## Конфигурации для отдельных материализаций

### `streaming_table`

Материализация `streaming_table` создаёт таблицу на основе топика Kafka и непрерывно выполняющийся оператор `INSERT INTO`.

<File name='models/my_streaming_model.sql'>

```sql
{{
  config(
    materialized='streaming_table',
    with={
      'changelog.mode': 'upsert',
      'kafka.retention.time': '7 d'
    }
  )
}}

SELECT
  order_id,
  customer_id,
  total_amount
FROM {{ ref('raw_orders') }}
WHERE status = 'completed'
```

</File>

#### Настройка `with`

| Настройка | Тип | Описание |
|---|---|---|
| `with` | `dict` | Словарь параметров таблицы Flink SQL в Confluent Cloud, передаваемых в предложение `WITH` оператора `CREATE TABLE`. Часто используемые параметры: `changelog.mode` (`append`, `upsert`, `retract`), `kafka.retention.time`, `key.format`, `value.format`, `scan.startup.mode` и другие. Полный список приведён в [справочнике по параметрам CREATE TABLE WITH](https://docs.confluent.io/cloud/current/flink/reference/statements/create-table.html#with-options). |

### `streaming_source`

Материализация `streaming_source` создаёт таблицу на основе коннектора. Настройка `connector` **обязательна**. SQL-код модели задаёт определения столбцов (а не запрос `SELECT`). В Confluent Cloud допустимые значения коннектора включают `faker` (генерация тестовых данных) и коннекторы внешних таблиц для поиска с использованием ИИ. Доступные коннекторы и параметры описаны в [каталоге коннекторов Confluent](https://docs.confluent.io/cloud/current/connectors/index.html) и [документации по CREATE TABLE во Flink](https://docs.confluent.io/cloud/current/flink/reference/statements/create-table.html).

<File name='models/my_fake_orders.sql'>

```sql
{{
  config(
    materialized='streaming_source',
    connector='faker',
    with={
      'rows-per-second': '1',
      'number-of-rows': '100',
      'changelog.mode': 'append',
    }
  )
}}

order_id BIGINT,
price DECIMAL(10, 2),
order_time TIMESTAMP(3),
WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND,
PRIMARY KEY(order_id) NOT ENFORCED
```

</File>

#### Настройка `connector`

| Настройка | Тип | Обязательность | Описание |
|---|---|---|---|
| `connector` | `string` | Да | Тип коннектора для исходной таблицы. Допустимые значения в Confluent Cloud включают `faker` (тестовые данные) и внешние коннекторы для поиска с использованием ИИ. |
| `with` | `dict` | Нет | Дополнительные параметры таблицы, передаваемые в предложение `WITH` вместе с коннектором. Допустимые параметры зависят от типа коннектора. |

## Сохранение состояния и `--full-refresh`

Таблицы Flink SQL в Confluent Cloud — это долгоживущие ресурсы с сохранением состояния. Материализации `streaming_table` и `streaming_source` ведут себя иначе, чем традиционные материализации dbt, ориентированные на пакетную обработку:

- **Первый запуск**: Создаётся таблица, и (для `streaming_table`) непрерывно выполняющийся оператор `INSERT INTO` начинает заполнять её.
- **Последующие запуски без `--full-refresh`**: Если таблица уже существует, адаптер сравнивает имена столбцов, типы данных и параметры `WITH` существующей таблицы с моделью. Если расхождений нет, модель пропускается, чтобы избежать удаления таблицы, в которой накоплено состояние или от которой зависят другие потребители данных. Если обнаружены расхождения, запуск завершается ошибкой компиляции. Проверку расхождений можно отключить для отдельной модели с помощью `config(on_schema_drift='ignore')`.
- **Запуски с `--full-refresh`**: Существующая таблица удаляется и создаётся заново с нуля, при этом все данные обрабатываются повторно.

Используйте `--full-refresh`, если нужно изменить схему таблицы, параметры `WITH` или повторно обработать данные с самого начала:

```bash
dbt run --full-refresh --select my_streaming_model
```

## Известные ограничения

- **Нет управления схемами**: Адаптер не может создавать или удалять схемы (кластеры Kafka) и базы данных (окружения). Ими необходимо управлять в Confluent Cloud.
- **Нет переименования таблиц**: Оператор `ALTER TABLE RENAME` не поддерживается во Flink SQL.
- **Нет поддержки транзакций**: Flink SQL в Confluent Cloud не поддерживает транзакции. Операторы `BEGIN` и `COMMIT` не выполняют никаких действий.
- **Для seed-файлов требуется `full_refresh`**: Адаптер по умолчанию устанавливает `full_refresh: true` для seed-файлов.
