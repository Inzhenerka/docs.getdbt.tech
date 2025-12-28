---
title: "Конфигурации Microsoft SQL Server"
id: "mssql-configs"
---

## Материализации

Эфемерная материализация не поддерживается, так как T-SQL не поддерживает вложенные CTE. Она может работать в некоторых случаях, когда вы работаете с очень простыми эфемерными моделями.

### Таблицы

Таблицы по умолчанию будут материализованы как таблицы с колонковым хранилищем.
Это требует SQL Server 2017 или новее для локальных экземпляров или уровня обслуживания S2 или выше для Azure.

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

## Сиды

По умолчанию, `dbt-sqlserver` будет пытаться вставлять seed файлы пакетами по 400 строк.
Если это превышает лимит в 2100 параметров SQL Server, адаптер автоматически ограничит до максимально безопасного значения.

Чтобы установить другое значение по умолчанию для seed, вы можете установить переменную `max_batch_size` в конфигурации вашего проекта.

<File name="dbt_project.yml">

```yaml
vars:
  max_batch_size: 200 # Любое целое число, меньшее или равное 2100, подойдет.
```

</File>

## Снимки

Столбцы в исходных таблицах не могут иметь никаких ограничений.
Если, например, любой столбец имеет ограничение `NOT NULL`, будет выдана ошибка.

## Индексы

Вы можете указать индексы, которые будут созданы для вашей таблицы, указав post-hooks, вызывающие специально разработанные макросы.

Доступны следующие макросы:

* `create_clustered_index(columns, unique=False)`: columns — это список столбцов, unique — это необязательный булевый параметр (по умолчанию False).
* `create_nonclustered_index(columns, includes=columns)`: columns — это список столбцов, includes — это необязательный список столбцов для включения в индекс.
* `drop_all_indexes_on_table()`: удаляет текущие индексы на таблице. Имеет смысл только если модель инкрементная.

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

## Гранты с автоматическим предоставлением

В dbt 1.2 была введена возможность предоставления/отзыва доступа с использованием [параметра конфигурации](/reference/resource-configs/grants) `grants`.
В dbt-sqlserver вы можете дополнительно установить `auto_provision_aad_principals` в значение `true` в конфигурации вашей модели, если вы используете аутентификацию Microsoft Entra ID с базой данных Azure SQL или Azure Synapse Dedicated SQL Pool.

Это автоматически создаст принципала Microsoft Entra ID в вашей базе данных, если он еще не существует.
Обратите внимание, что принципалы должны существовать в вашем Microsoft Entra ID, это просто делает их доступными для использования в вашей базе данных.

Принципы не удаляются, когда они удаляются из конфигурации грантов.

<File name="dbt_project.yml">

```yaml
models:
  your_project_name:
    auto_provision_aad_principals: true
```

</File>

## Разрешения

Следующие разрешения требуются для пользователя, выполняющего dbt:

* `CREATE SCHEMA` на уровне базы данных (или вы можете создать схему заранее)
* `CREATE TABLE` на уровне базы данных (или в собственной схеме пользователя, если схема уже создана)
* `CREATE VIEW` на уровне базы данных (или в собственной схеме пользователя, если схема уже создана)
* `SELECT` на таблицах/представлениях, используемых в качестве источников dbt

Три вышеуказанных разрешения `CREATE` требуются на уровне базы данных, если вы хотите использовать тесты или снимки в dbt. Вы можете обойти это, создав схемы, используемые для тестирования и снимков, заранее и предоставив правильные роли.

## Макросы для работы с несколькими базами данных

Следующие макросы в настоящее время не поддерживаются:

* `bool_or`
* `array_construct`
* `array_concat`
* `array_append`

## dbt-utils

Многие [`dbt-utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) поддерживаются,
но требуют установки пакета dbt [`tsql_utils`](https://hub.getdbt.com/dbt-msft/tsql_utils/latest/).
