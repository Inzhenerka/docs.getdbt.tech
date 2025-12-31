---
title: "Конфигурации DeltaStream"
description: "Конфигурации DeltaStream — прочитайте этот подробный гайд, чтобы узнать о конфигурациях в dbt."
id: "deltastream-configs"
---

# Конфигурации ресурсов DeltaStream {#deltastream-resource-configurations}

## Поддерживаемые материализации {#supported-materializations}

DeltaStream поддерживает несколько специализированных типов материализации, которые соответствуют его возможностям потоковой обработки:

### Стандартные материализации {#standard-materializations}

| Материализация      | Описание                                                                                                  |
|---------------------|-----------------------------------------------------------------------------------------------------------|
| `ephemeral`         | Эта материализация использует common table expressions (CTE) в DeltaStream «под капотом».               |
| `table`             | Классическая пакетная материализация в виде таблицы                                                       |
| `materialized_view` | Непрерывно обновляемое представление, которое автоматически обновляется при изменении исходных данных   |

### Потоковые материализации {#streaming-materializations}

| Материализация | Описание                                                                                                  |
|----------------|-----------------------------------------------------------------------------------------------------------|
| `stream`       | Чисто потоковая трансформация, обрабатывающая данные в реальном времени                                  |
| `changelog`    | Поток change data capture (CDC), отслеживающий изменения в данных                                         |

### Инфраструктурные материализации {#infrastructure-materializations}

| Материализация       | Описание                                                                                                  |
|----------------------|-----------------------------------------------------------------------------------------------------------|
| `store`              | Подключение к внешней системе (Kafka, PostgreSQL и т.д.)                                                  |
| `entity`             | Определение сущности внутри хранилища                                                                     |
| `database`           | Определение базы данных                                                                                   |
| `compute_pool`       | Определение пула вычислительных ресурсов                                                                  |
| `function`           | Пользовательские функции (UDF) на Java                                                                    |
| `function_source`    | Источники JAR-файлов для UDF                                                                              |
| `descriptor_source`  | Источники схем protocol buffer                                                                            |
| `schema_registry`    | Подключения к schema registry (Confluent и т.п.)                                                          |

## Конфигурации SQL-моделей {#sql-model-configurations}

### Материализация `table` {#table-materialization}

Создаёт классическую пакетную таблицу для агрегированных данных:

**Конфигурация в project YAML-файле:**
```yaml
models:
  <resource-path>:
    +materialized: table
```

**SQL-конфигурация:**
```sql
{{ config(materialized = "table") }}

SELECT 
    date,
    SUM(amount) as daily_total
FROM {{ ref('transactions') }}
GROUP BY date
```

### Материализация `stream` {#stream-materialization}

Создаёт непрерывную потоковую трансформацию:

**Конфигурация в project YAML-файле:**
```yaml
models:
  <resource-path>:
    +materialized: stream
    +parameters:
      topic: 'stream_topic'
      value.format: 'json'
      key.format: 'primitive'
      key.type: 'VARCHAR'
      timestamp: 'event_time'
```

**SQL-конфигурация:**
```sql
{{ config(
    materialized='stream',
    parameters={
        'topic': 'purchase_events',
        'value.format': 'json',
        'key.format': 'primitive',
        'key.type': 'VARCHAR',
        'timestamp': 'event_time'
    }
) }}

SELECT 
    event_time,
    user_id,
    action
FROM {{ ref('source_stream') }}
WHERE action = 'purchase'
```

#### Параметры конфигурации `stream` {#stream-configuration-options}

| Параметр       | Описание                                                                                      | Обязательный |
|----------------|-----------------------------------------------------------------------------------------------|--------------|
| `materialized` | Способ материализации модели. Для потоковой модели должен быть `stream`.                     | Да           |
| `topic`        | Имя топика для выходного потока.                                                              | Да           |
| `value.format` | Формат значений потока (например, `json`, `avro`).                                            | Да           |
| `key.format`   | Формат ключей потока (например, `primitive`, `json`).                                         | Нет          |
| `key.type`     | Тип данных ключей потока (например, `VARCHAR`, `BIGINT`).                                     | Нет          |
| `timestamp`    | Имя колонки, используемой как временная метка события.                                        | Нет          |

### Материализация `changelog` {#changelog-materialization}

Фиксирует изменения в потоке данных:

**Конфигурация в project YAML-файле:**
```yaml
models:
  <resource-path>:
    +materialized: changelog
    +parameters:
      topic: 'changelog_topic'
      value.format: 'json'
    +primary_key: [column_name]
```

**SQL-конфигурация:**
```sql
{{ config(
    materialized='changelog',
    parameters={
        'topic': 'order_updates',
        'value.format': 'json'
    },
    primary_key=['order_id']
) }}

SELECT 
    order_id,
    status,
    updated_at
FROM {{ ref('orders_stream') }}
```

#### Параметры конфигурации `changelog` {#changelog-configuration-options}

| Параметр       | Описание                                                                                      | Обязательный |
|----------------|-----------------------------------------------------------------------------------------------|--------------|
| `materialized` | Способ материализации модели. Для changelog должен быть `changelog`.                          | Да           |
| `topic`        | Имя топика для выходного changelog-потока.                                                    | Да           |
| `value.format` | Формат значений changelog (например, `json`, `avro`).                                         | Да           |
| `primary_key`  | Список колонок, однозначно идентифицирующих строки для отслеживания изменений.                | Да           |

### Материализованное представление {#materialized-view}

Создаёт непрерывно обновляемое представление:

**SQL-конфигурация:**
```sql
{{ config(materialized='materialized_view') }}

SELECT 
    product_id,
    COUNT(*) as purchase_count
FROM {{ ref('purchase_events') }}
GROUP BY product_id
```

## Ресурсы, определяемые только в YAML {#yaml-only-resource-configurations}

DeltaStream поддерживает два типа определений моделей для инфраструктурных компонентов:

1. **Управляемые ресурсы (Models)** — автоматически включаются в dbt <Term id="dag"/>
2. **Неуправляемые ресурсы (Sources)** — создаются по требованию с помощью специальных макросов

### Когда использовать управляемые или неуправляемые ресурсы? {#should-you-use-managed-or-unmanaged-resources}

- Используйте управляемые ресурсы, если вы планируете пересоздавать всю инфраструктуру в разных окружениях и/или применять операторы графа для выполнения только создания конкретных ресурсов и зависимых трансформаций.
- В противном случае может быть проще использовать неуправляемые ресурсы, чтобы избежать файлов-заглушек.

### Управляемые ресурсы (models) {#managed-resources-models}

Управляемые ресурсы автоматически включаются в dbt DAG и описываются как модели:

```yaml
version: 2
models:
  - name: my_kafka_store
    config:
      materialized: store
      parameters:
        type: KAFKA
        access_region: "AWS us-east-1"
        uris: "kafka.broker1.url:9092,kafka.broker2.url:9092"
        tls.ca_cert_file: "@/certs/us-east-1/self-signed-kafka-ca.crt"
  
  - name: ps_store
    config:
      materialized: store
      parameters:
        type: POSTGRESQL
        access_region: "AWS us-east-1"
        uris: "postgresql://mystore.com:5432/demo"
        postgres.username: "user"
        postgres.password: "password"
  
  - name: user_events_stream
    config:
      materialized: stream
      columns:
        event_time:
          type: TIMESTAMP
          not_null: true
        user_id:
          type: VARCHAR
        action:
          type: VARCHAR
      parameters:
        topic: 'user_events'
        value.format: 'json'
        key.format: 'primitive'
        key.type: 'VARCHAR'
        timestamp: 'event_time'
  
  - name: order_changes
    config:
      materialized: changelog
      columns:
        order_id:
          type: VARCHAR
          not_null: true
        status:
          type: VARCHAR
        updated_at:
          type: TIMESTAMP
      primary_key:
        - order_id
      parameters:
        topic: 'order_updates'
        value.format: 'json'
  
  - name: pv_kinesis
    config:
      materialized: entity
      store: kinesis_store
      parameters:
        'kinesis.shards': 3
  
  - name: my_compute_pool
    config:
      materialized: compute_pool
      parameters:
        'compute_pool.size': 'small'
        'compute_pool.timeout_min': 5
  
  - name: my_function_source
    config:
      materialized: function_source
      parameters:
        file: '@/path/to/my-functions.jar'
        description: 'Custom utility functions'
  
  - name: my_descriptor_source
    config:
      materialized: descriptor_source
      parameters:
        file: '@/path/to/schemas.desc'
        description: 'Protocol buffer schemas for data structures'
  
  - name: my_custom_function
    config:
      materialized: function
      parameters:
        args:
          - name: input_text
            type: VARCHAR
        returns: VARCHAR
        language: JAVA
        source.name: 'my_function_source'
        class.name: 'com.example.TextProcessor'
  
  - name: my_schema_registry
    config:
      materialized: schema_registry
      parameters:
        type: "CONFLUENT"
        access_region: "AWS us-east-1"
        uris: "https://url.to.schema.registry.listener:8081"
        'confluent.username': 'fake_username'
        'confluent.password': 'fake_password'
        'tls.client.cert_file': '@/path/to/tls/client_cert_file'
        'tls.client.key_file': '@/path/to/tls_key'
```

**Примечание:** Из‑за текущих ограничений dbt управляемые YAML-only ресурсы требуют наличия `.sql` файла-заглушки без оператора SELECT. Например, создайте `my_kafka_store.sql` со следующим содержимым:

```sql
-- Placeholder
```

### Неуправляемые ресурсы (sources) {#unmanaged-resources-sources}

Неуправляемые ресурсы определяются как sources и создаются по требованию с помощью специальных макросов:

```yaml
version: 2
sources:
  - name: infrastructure
    tables:
      - name: my_kafka_store
        config:
          materialized: store
          parameters:
            type: KAFKA
            access_region: "AWS us-east-1"
            uris: "kafka.broker1.url:9092,kafka.broker2.url:9092"
            tls.ca_cert_file: "@/certs/us-east-1/self-signed-kafka-ca.crt"
      
      - name: ps_store
        config:
          materialized: store
          parameters:
            type: POSTGRESQL
            access_region: "AWS us-east-1"
            uris: "postgresql://mystore.com:5432/demo"
            postgres.username: "user"
            postgres.password: "password"
      
      - name: user_events_stream
        config:
          materialized: stream
          columns:
            event_time:
              type: TIMESTAMP
              not_null: true
            user_id:
              type: VARCHAR
            action:
              type: VARCHAR
          parameters:
            topic: 'user_events'
            value.format: 'json'
            key.format: 'primitive'
            key.type: 'VARCHAR'
            timestamp: 'event_time'
      
      - name: order_changes
        config:
          materialized: changelog
          columns:
            order_id:
              type: VARCHAR
              not_null: true
            status:
              type: VARCHAR
            updated_at:
              type: TIMESTAMP
          primary_key:
            - order_id
          parameters:
            topic: 'order_updates'
            value.format: 'json'
      
      - name: pv_kinesis
        config:
          materialized: entity
          store: kinesis_store
          parameters:
            'kinesis.shards': 3
      
      - name: compute_pool_small
        config:
          materialized: compute_pool
          parameters:
            'compute_pool.size': 'small'
            'compute_pool.timeout_min': 5
      
      - name: my_function_source
        config:
          materialized: function_source
          parameters:
            file: '@/path/to/my-functions.jar'
            description: 'Custom utility functions'
      
      - name: my_descriptor_source
        config:
          materialized: descriptor_source
          parameters:
            file: '@/path/to/schemas.desc'
            description: 'Protocol buffer schemas for data structures'
      
      - name: my_custom_function
        config:
          materialized: function
          parameters:
            args:
              - name: input_text
                type: VARCHAR
            returns: VARCHAR
            language: JAVA
            source.name: 'my_function_source'
            class.name: 'com.example.TextProcessor'
      
      - name: my_schema_registry
        config:
          materialized: schema_registry
          parameters:
            type: "CONFLUENT"
            access_region: "AWS us-east-1"
            uris: "https://url.to.schema.registry.listener:8081"
            'confluent.username': 'fake_username'
            'confluent.password': 'fake_password'
            'tls.client.cert_file': '@/path/to/tls/client_cert_file'
            'tls.client.key_file': '@/path/to/tls_key'
```

Для создания неуправляемых ресурсов:

```bash
# Создать все источники
dbt run-operation create_sources

# Создать конкретный источник
dbt run-operation create_source_by_name --args '{source_name: infrastructure}'
```

## Конфигурации Store {#store-configurations}

### Kafka store {#kafka-store}

```yaml
- name: my_kafka_store
  config:
    materialized: store
    parameters:
      type: KAFKA
      access_region: "AWS us-east-1"
      uris: "kafka.broker1.url:9092,kafka.broker2.url:9092"
      tls.ca_cert_file: "@/certs/us-east-1/self-signed-kafka-ca.crt"
```

### PostgreSQL store {#postgresql-store}

```yaml
- name: postgres_store
  config:
    materialized: store
    parameters:
      type: POSTGRESQL
      access_region: "AWS us-east-1"
      uris: "postgresql://mystore.com:5432/demo"
      postgres.username: "user"
      postgres.password: "password"
```

## Конфигурация Entity {#entity-configuration}

```yaml
- name: kinesis_entity
  config:
    materialized: entity
    store: kinesis_store
    parameters:
      'kinesis.shards': 3
```

## Конфигурация Compute pool {#compute-pool-configuration}

```yaml
- name: processing_pool
  config:
    materialized: compute_pool
    parameters:
      'compute_pool.size': 'small'
      'compute_pool.timeout_min': 5
```

## Ссылки на ресурсы {#referencing-resources}

### Управляемые ресурсы {#managed-resources}

Используйте стандартную функцию `ref()`:

```sql
select * from {{ ref('my_kafka_stream') }}
```

### Неуправляемые ресурсы {#unmanaged-resources}

Используйте функцию `source()`:

```sql
SELECT * FROM {{ source('infrastructure', 'user_events_stream') }}
```

## Сиды (Seeds) {#seeds}

Загружайте CSV-данные в существующие сущности DeltaStream с помощью материализации `seed`. В отличие от классических dbt seeds, которые создают новые таблицы, seeds в DeltaStream вставляют данные в уже существующие сущности.

### Конфигурация {#configuration}

Seeds настраиваются в YAML и поддерживают следующие параметры:

**Обязательные:**

- `entity` — имя целевой сущности, в которую будут вставляться данные

**Необязательные:**

- `store` — имя store, содержащего сущность (можно опустить, если сущность не находится в store)
- `with_params` — словарь параметров для секции WITH
- `quote_columns` — управление экранированием имён колонок. Значение по умолчанию: `false`. Возможные варианты:
  - `true` — экранировать все колонки
  - `false` — не экранировать колонки (по умолчанию)
  - `string` — если указано `'*'`, экранировать все колонки
  - `list` — список имён колонок для экранирования

### Пример конфигурации {#example-configuration}

**Со Store (экранирование включено):**

```yaml
# seeds.yml
version: 2

seeds:
  - name: user_data_with_store_quoted
    config:
      entity: 'user_events'
      store: 'kafka_store'
      with_params:
        kafka.topic.retention.ms: '86400000'
        partitioned: true
      quote_columns: true
```

### Использование {#usage}

1. Поместите CSV-файлы в каталог `seeds/`
2. Настройте seeds в YAML, указав обязательный параметр `entity`
3. При необходимости укажите `store`
4. Выполните `dbt seed` для загрузки данных

:::info Важно
Целевая сущность должна уже существовать в DeltaStream до запуска seeds. Seeds только вставляют данные и не создают сущности.
:::

## Материализации функций и источников {#function-and-source-materializations}

DeltaStream поддерживает пользовательские функции (UDF) и их зависимости через специализированные материализации.

### Поддержка прикрепления файлов {#file-attachment-support}

Адаптер предоставляет единый механизм работы с файлами для function source и descriptor source:

- **Стандартизированный интерфейс** — общая логика работы с файлами
- **Разрешение путей** — поддержка абсолютных и относительных путей (включая синтаксис `@`)
- **Автоматическая валидация** — проверка существования и доступности файлов перед прикреплением

### Источник функций (function_source) {#function-source}

Создаёт источник функций из JAR-файла с Java-функциями:

**SQL-конфигурация:**
```sql
{{ config(
    materialized='function_source',
    parameters={
        'file': '@/path/to/my-functions.jar',
        'description': 'Custom utility functions'
    }
) }}

SELECT 1 as placeholder
```

### Источник дескрипторов (descriptor_source) {#descriptor-source}

Создаёт источник дескрипторов из скомпилированных файлов protocol buffer:

**SQL-конфигурация:**
```sql
{{ config(
    materialized='descriptor_source',
    parameters={
        'file': '@/path/to/schemas.desc',
        'description': 'Protocol buffer schemas for data structures'
    }
) }}

SELECT 1 as placeholder
```

:::info Примечание
Для descriptor source требуются скомпилированные `.desc` файлы, а не исходные `.proto`. Скомпилируйте схемы protobuf следующим образом:

```bash
protoc --descriptor_set_out=schemas/my_schemas.desc schemas/my_schemas.proto
```
:::

### Функция (function) {#function}

Создаёт пользовательскую функцию, ссылающуюся на function source:

**SQL-конфигурация:**
```sql
{{ config(
    materialized='function',
    parameters={
        'args': [
            {'name': 'input_text', 'type': 'VARCHAR'}
        ],
        'returns': 'VARCHAR',
        'language': 'JAVA',
        'source.name': 'my_function_source',
        'class.name': 'com.example.TextProcessor'
    }
) }}

SELECT 1 as placeholder
```

### Материализация Schema registry {#schema-registry}

Создаёт подключение к schema registry:

**SQL-конфигурация:**
```sql
{{ config(
    materialized='schema_registry',
    parameters={
        'type': 'CONFLUENT',
        'access_region': 'AWS us-east-1',
        'uris': 'https://url.to.schema.registry.listener:8081',
        'confluent.username': 'fake_username',
        'confluent.password': 'fake_password',
        'tls.client.cert_file': '@/path/to/tls/client_cert_file',
        'tls.client.key_file': '@/path/to/tls_key'
    }
) }}

SELECT 1 as placeholder
```

## Макросы управления запросами {#query-management-macros}

Адаптер DeltaStream для dbt предоставляет макросы для просмотра и управления выполняемыми запросами.

### Список всех запросов {#list-all-queries}

Макрос `list_all_queries` выводит все запросы, известные DeltaStream, включая их состояние, владельца и SQL:

```bash
dbt run-operation list_all_queries
```

### Описание запроса {#describe-query}

Макрос `describe_query` позволяет посмотреть логи и детали конкретного запроса:

```bash
dbt run-operation describe_query --args '{query_id: "<QUERY_ID>"}'
```

### Остановка конкретного запроса {#terminate-a-specific-query}

Макрос `terminate_query` завершает запрос по его ID:

```bash
dbt run-operation terminate_query --args '{query_id: "<QUERY_ID>"}'
```

### Остановка всех выполняющихся запросов {#terminate-all-running-queries}

Макрос `terminate_all_queries` завершает все текущие запросы:

```bash
dbt run-operation terminate_all_queries
```

### Перезапуск запроса {#restart-a-query}

Макрос `restart_query` позволяет перезапустить упавший запрос по его ID:

```bash
dbt run-operation restart_query --args '{query_id: "<QUERY_ID>"}'
```

## Макрос application {#application-macro}

### Выполнение нескольких операторов как одной операции {#execute-multiple-statements-as-a-unit}

Макрос `application` позволяет выполнить несколько SQL-операторов DeltaStream как единую транзакционную единицу с семантикой «всё или ничего»:

```bash
dbt run-operation application --args '{
  application_name: "my_data_pipeline",
  statements: [
    "USE DATABASE my_db",
    "CREATE STREAM user_events WITH (topic='"'"'events'"'"', value.format='"'"'json'"'"')",
    "CREATE MATERIALIZED VIEW user_counts AS SELECT user_id, COUNT(*) FROM user_events GROUP BY user_id"
  ]
}'
```

## Устранение неполадок {#troubleshooting}

### Готовность function source {#function-source-readiness}

Если при создании функций возникает ошибка «function source is not ready»:

1. **Автоматические повторы** — адаптер автоматически повторяет попытки с экспоненциальной задержкой
2. **Настройка таймаута** — стандартный таймаут 30 секунд можно увеличить для больших JAR-файлов
3. **Порядок зависимостей** — убедитесь, что function source создаётся до зависящих от него функций
4. **Ручной повтор** — если автоматические попытки не помогли, подождите несколько минут и повторите операцию

### Проблемы с прикреплением файлов {#file-attachment-issues}

При проблемах с прикреплением файлов в function source и descriptor source:

1. **Пути к файлам** — используйте синтаксис `@/path/to/file` для путей относительно проекта
2. **Типы файлов**:
   - function source требует `.jar` файлы
   - descriptor source требует скомпилированные `.desc` файлы (не `.proto`)
3. **Валидация файлов** — адаптер проверяет существование файлов перед прикреплением
4. **Компиляция** — для descriptor source убедитесь, что protobuf-файлы скомпилированы:

   ```bash
   protoc --descriptor_set_out=output.desc input.proto
   ```
