---
title: "Конфигурация Salesforce Data Cloud"
description: "Конфигурация Salesforce Data Cloud — прочитайте этот подробный гайд, чтобы узнать о конфигурациях в dbt."
id: "data-cloud-configs"
---

:::warning Предупреждение
Этот адаптер находится на стадии Alpha и не готов для использования в production. Его следует использовать только в sandbox или тестовых окружениях.  

По мере дальнейшей разработки и учёта вашего фидбэка опыт использования может меняться &mdash; команды, конфигурация и рабочие процессы могут быть обновлены или удалены в будущих релизах.
:::

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

### Источники данных (sources)

Для моделей, которые запрашивают сырые данные Data Cloud, необходимо ссылаться на таблицу через dbt source. Прямой выбор DLO не поддерживается.

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

### Материализация таблиц

dbt <Constant name="fusion" /> поддерживает материализацию Table в Salesforce Data Cloud. Выполнение такой материализации приводит к созданию [batch data transform](https://help.salesforce.com/s/articleView?id=data.c360_a_batch_transform_overview.htm&language=en_US&type=5) и [Data Lake Object (DLO)](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_concepts_data_cloud_objects.htm), который используется для запросов.

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

## Правила именования и обязательные конфигурации

- Все имена dbt‑моделей должны оканчиваться на `__dll`. Если этот суффикс отсутствует в имени файла, он будет автоматически добавлен при выполнении (например, `model_name` станет `model_name__dll`). Это приведёт к поломке downstream‑ссылок dbt, поскольку dbt будет искать DLO с именем `model_name`, тогда как в Data Cloud он будет называться `model_name__dll`.
- Имена колонок должны оканчиваться на `__c`. Отсутствие этого суффикса приводит к ошибке Data Cloud «unknown syntax».
- Имена моделей не могут содержать двойные подчёркивания (`__`) за пределами финального суффикса `__dll`. Например, модель `supplies__agg__dll` будет собрана как `agg__dll`, что может вызвать путаницу в downstream‑refs.
- Все dbt‑модели должны быть сконфигурированы с `primary_key` и `category='Profile'` в конфигурации модели. Эти настройки также можно задать в `resources.yml` и `dbt_project.yml`.

## Известные ограничения

- **Повторные запуски dbt‑моделей**: из‑за архитектуры Data Cloud, связанной с управлением метаданными и зависимостями, dbt не может повторно запустить одну и ту же модель, если преобразование данных и DLO уже существуют. Это связано с тем, что dbt не может удалить DLO при последующих запусках table‑материализаций, как это обычно происходит в дата‑вейрхаусах. Если вы изменили логику между запусками, необходимо вручную удалить зависимости преобразования данных и DLO в UI перед выполнением `dbtf run`. Исправление находится в разработке.
- **Статический анализ в VS Code**: затрагиваются линейдж на уровне колонок и кнопки dbt (`Build` и `Test`). Вы можете либо временно отключить статический анализ, запуская команды с флагом `--static-analysis off`, либо настроить переменные окружения, установив `DBT_STATIC_ANALYSIS=off`.
- **Произвольные запросы** (например, `SELECT 1 AS foo`): все запросы должны быть привязаны к определённому dbt source перед созданием dbt‑модели.
- **`select *`**: запросы к метаданным могут завершаться ошибкой, так как Data Cloud добавляет системные колонки в каждый DLO. Исправление бага находится в разработке.
