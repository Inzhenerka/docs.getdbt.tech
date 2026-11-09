---
title: "Конфигурации Salesforce Data 360"
description: "Конфигурации Salesforce Data 360 — прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "data-cloud-configs"
unlisted: true
---

# Конфигурации Salesforce Data 360<Lifecycle status="beta"/>

## Поддерживаемые материализации

| Materialization | Supported | Notes |
| --- | --- | --- |
| View | ❌ |  |
| Table | ✅ |Создаёт пакетное преобразование данных (batch data transform) и объект Data Lake Object (DLO) |
| Incremental | ❌ | Coming soon |
| Ephemeral | ❌ |  |
| Seeds | ❌ |  |
| Sources | ✅ | Обязательно |
| Custom data tests | ❌ |  |
| Snapshots | ❌ |  |

### Источники данных (sources) {#sources}

Для моделей, которые запрашивают сырые данные Data Cloud, необходимо ссылаться на таблицу через dbt source. Прямой выбор DLO не поддерживается.

В моделях, которые запрашивают необработанные данные Data 360, ссылайтесь на таблицу через источник dbt. Прямое обращение к DLO не поддерживается.

Например:

```yml
sources:
  - name: default
    tables:
      - name: raw_customers__dll
        description: "Customers raw table stored in default dataspace"   
        columns:
          - name: id__c 
            description: "Customer ID"
            data_tests:
              - not_null
              - unique
          - name: first_name__c
            description: "Customer first name"
          - name: last_name__c
            description: "Customer last name"
          - name: email__c
            description: "Customer email address"
            data_tests:
              - not_null
              - unique
```

### Материализация таблиц {#table-materialization}

<Constant name="fusion" /> поддерживает материализацию Table в Salesforce Data 360. В результате выполнения материализации создаются [пакетное преобразование данных](https://help.salesforce.com/s/articleView?id=data.c360_a_batch_transform_overview.htm&language=en_US&type=5) и [объект озера данных (Data Lake Object, DLO)](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_concepts_data_cloud_objects.htm) для выполнения запросов.

В настоящее время поддерживается только DLO типа `profile`. Поддержка DLO типа `engagement` появится в ближайшее время. Для Profile DLO в конфигурации модели обязательно должен быть указан `primary_key`. Например:

```sql
{{ config(
    materialized='table',
    primary_key='customer_id__c',
    category='Profile'
) }}

   select

        id__c as customer_id__c,
        first_name__c,
        last_name__c,
        email__c as customer_email__c

    from {{ source('default', 'raw_customers__dll') }}

```

## Правила именования и обязательные конфигурации {#naming-rules-and-required-configs}

- Имена всех моделей dbt должны заканчиваться на `__dll`. Если вы не укажете этот суффикс в имени файла, он будет добавлен автоматически при выполнении (например, `model_name` станет `model_name__dll`). Это нарушит ссылки dbt в нижестоящих моделях, поскольку dbt будет искать DLO с именем `model_name`, тогда как в Data 360 он будет называться `model_name__dll`. 
- Имена столбцов должны заканчиваться на `__c`. Отсутствие этого суффикса приводит к ошибке Data 360 «unknown syntax».
- Имена моделей не могут содержать двойные подчёркивания (`__`), кроме завершающего суффикса `__dll`. Например, модель `supplies__agg__dll` будет создана с именем `agg__dll`, что может привести к путанице со ссылками в нижестоящих моделях.
- Для всех моделей dbt в конфигурации модели должны быть заданы `primary_key` и `category='Profile'`. Эти настройки также можно задать в файлах `resources.yml` и `dbt_project.yml`.

## Известные ограничения {#known-limitations}

- **Повторные запуски моделей dbt**: Из-за архитектуры управления метаданными и зависимостями в Data 360 dbt не может повторно запустить ту же модель, если преобразование данных и DLO уже существуют. Это связано с тем, что при последующих запусках материализаций table dbt не может удалить DLO, как это обычно происходит в хранилищах данных. Если вы изменили логику между запусками, перед выполнением `dbtf run` необходимо вручную удалить зависимости преобразования данных и DLO в пользовательском интерфейсе. Исправление находится в разработке. 
- **Статический анализ в VS Code**: Затронуты отслеживание происхождения данных на уровне столбцов и кнопки dbt (`Build` и `Test`). Вы можете временно отключить статический анализ, выполняя все команды с параметром `--static-analysis off`, или задать переменную окружения `DBT_STATIC_ANALYSIS=off`.
- **Произвольные запросы** (например, `SELECT 1 AS foo`): Все запросы должны быть связаны с определённым источником dbt, прежде чем на их основе можно будет построить модель dbt.
- **`select *`** Запросы метаданных могут завершаться ошибкой, поскольку Data 360 добавляет системные столбцы в каждый DLO. Исправление ошибки находится в разработке.
