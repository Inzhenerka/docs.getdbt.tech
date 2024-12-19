---
title: "Конфигурации Microsoft SQL Server"
id: "mssql-configs"
---

## Материализации

Эфемерная материализация не поддерживается из-за того, что T-SQL не поддерживает вложенные CTE. В некоторых случаях это может работать, если вы работаете с очень простыми эфемерными моделями.

### Таблицы

По умолчанию таблицы будут материализованы как таблицы с колонками (columnstore).
Это требует SQL Server 2017 или новее для локальных экземпляров или уровня сервиса S2 или выше для Azure.

Это поведение можно отключить, установив параметр конфигурации `as_columnstore` в значение `False`.

<Tabs
defaultValue="model"
values={[
{label: 'Конфигурация модели', value: 'model'},
{label: 'Конфигурация проекта', value: 'project'}
]}
>

<TabItem value="model">

<File name="models/example.sql">

```sql
{{
    config(
        as_columnstore=false
        )
}}

select *
from ...
```

</File>

</TabItem>

<TabItem value="project">

<File name="dbt_project.yml">

```yaml
models:
  your_project_name:
    materialized: view
    staging:
      materialized: table
      as_columnstore: False
```

</File>

</TabItem>

</Tabs>

## Семена

По умолчанию `dbt-sqlserver` будет пытаться вставлять файлы семян партиями по 400 строк.
Если это превышает лимит параметров SQL Server в 2100, адаптер автоматически ограничит значение до максимально безопасного.

Чтобы установить другое значение по умолчанию для семян, вы можете установить переменную `max_batch_size` в конфигурации вашего проекта.

<File name="dbt_project.yml">

```yaml
vars:
  max_batch_size: 200 # Любое целое число, меньшее или равное 2100, подойдет.
```

</File>

## Снимки

Столбцы в исходных таблицах не могут иметь никаких ограничений.
Если, например, какой-либо столбец имеет ограничение `NOT NULL`, будет выдана ошибка.

## Индексы

Вы можете указать индексы, которые будут созданы для вашей таблицы, указав пост-хуки, вызывающие специально разработанные макросы.

Доступны следующие макросы:

* `create_clustered_index(columns, unique=False)`: columns — это список столбцов, unique — это необязательный булевый параметр (по умолчанию False).
* `create_nonclustered_index(columns, includes=columns)`: columns — это список столбцов, includes — это необязательный список столбцов, которые следует включить в индекс.
* `drop_all_indexes_on_table()`: удаляет текущие индексы на таблице. Имеет смысл только если модель инкрементальная.

Некоторые примеры:

<File name="models/example.sql">

```sql
{{
    config({
        "as_columnstore": false,
        "materialized": 'table',
        "post-hook": [
            "{{ create_clustered_index(columns = ['row_id', 'row_id_complement'], unique=True) }}",
            "{{ create_nonclustered_index(columns = ['modified_date']) }}",
            "{{ create_nonclustered_index(columns = ['row_id'], includes = ['modified_date']) }}",
        ]
    })

}}

select *
from ...
```

</File>

## Права с автоматическим предоставлением

dbt 1.2 представил возможность предоставления/отзыва доступа с использованием параметра конфигурации `grants` [опции конфигурации](/reference/resource-configs/grants).
В dbt-sqlserver вы также можете установить `auto_provision_aad_principals` в значение `true` в конфигурации вашей модели, если вы используете аутентификацию Microsoft Entra ID с Azure SQL Database или Azure Synapse Dedicated SQL Pool.

Это автоматически создаст принципал Microsoft Entra ID внутри вашей базы данных, если он еще не существует.
Обратите внимание, что принципалы должны существовать в вашей Microsoft Entra ID, это просто делает их доступными для использования в вашей базе данных.

Принципы не удаляются снова, когда они удаляются из конфигурации прав.

<File name="dbt_project.yml">

```yaml
models:
  your_project_name:
    auto_provision_aad_principals: true
```

</File>

## Разрешения

Для пользователя, выполняющего dbt, требуются следующие разрешения:

* `CREATE SCHEMA` на уровне базы данных (или вы можете создать схему заранее)
* `CREATE TABLE` на уровне базы данных (или в собственной схеме пользователя, если схема уже создана)
* `CREATE VIEW` на уровне базы данных (или в собственной схеме пользователя, если схема уже создана)
* `SELECT` на таблицах/представлениях, используемых в качестве источников dbt

Три вышеуказанных разрешения `CREATE` требуются на уровне базы данных, если вы хотите использовать тесты или снимки в dbt. Вы можете обойти это, создав схемы, используемые для тестирования и снимков, заранее и предоставив соответствующие роли.

## Макросы для межбаз данных

Следующие макросы в настоящее время не поддерживаются:

* `bool_or`
* `array_construct`
* `array_concat`
* `array_append`

## dbt-utils

Многие [`dbt-utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) поддерживаются,
но требуют установки пакета dbt [`tsql_utils`](https://hub.getdbt.com/dbt-msft/tsql_utils/latest/).