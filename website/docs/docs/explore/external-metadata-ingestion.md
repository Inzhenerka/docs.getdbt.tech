---
title: "Импорт внешних метаданных"
sidebar_label: "Импорт внешних метаданных"
description: "Подключайтесь напрямую к вашему хранилищу данных, чтобы видеть таблицы, представления и другие ресурсы, которые не определены в dbt, с помощью dbt Catalog."
---

# Инджестинг внешних метаданных <Lifecycle status="managed,managed_plus" /> <Lifecycle status="preview" />

<IntroText>

С помощью ingestion внешних метаданных вы можете напрямую подключаться к своему хранилищу данных и получать видимость таблиц, представлений и других ресурсов, которые не определены в dbt, в <Constant name="explorer" />.

</IntroText>

:::info Поддержка ingestion внешних метаданных
В настоящее время ingestion внешних метаданных поддерживается только для Snowflake.
:::
  
Учетные данные для внешних метаданных позволяют загружать метаданные, которые существуют *вне* запусков dbt, например таблицы, представления или информацию о стоимости; как правило, на более высоком уровне, чем тот, к которому имеют доступ окружения dbt. Это полезно для обогащения <Constant name="explorer" /> нативными для хранилища инсайтами (например, представлениями Snowflake или паттернами доступа) и для создания единого интерфейса обнаружения данных.

Эти учетные данные настраиваются отдельно от учетных данных окружений dbt и имеют область действия на уровне аккаунта, а не проекта.

## Предварительные требования

- Наличие аккаунта <Constant name="cloud" /> на тарифе [Enterprise или Enterprise+](https://www.getdbt.com/pricing).
- Вы должны быть [администратором аккаунта с соответствующими правами](/docs/cloud/manage-access/enterprise-permissions#account-admin), чтобы редактировать подключения.
    - Учетные данные должны иметь [достаточный доступ на уровне чтения для получения метаданных](/docs/explore/external-metadata-ingestion#configuration-instructions).
- Включена [**глобальная навигация**](/docs/explore/explore-projects#catalog-overview).
- В качестве платформы данных используется Snowflake.
- Следите за обновлениями! В ближайшем будущем планируется поддержка других адаптеров.

## Инструкции по настройке

### Включение инджестинга внешних метаданных

1. Нажмите на имя аккаунта внизу левого меню и выберите **[Account settings](/docs/cloud/account-settings)**.
2. В разделе Account information перейдите в **Settings** и нажмите **Edit** в правом верхнем углу страницы.
3. Выберите опцию **Ingest external metadata in dbt <Constant name="explorer" /> (formerly dbt Explorer)** (если она еще не включена).

### Настройка подключения к хранилищу

1. Перейдите в **Account settings**.
2. В левой панели выберите **Connections**.
3. Выберите существующее подключение или создайте [**New connection**](/docs/cloud/connect-data-platform/connect-snowflake), из которого вы хотите загружать метаданные.
4. Прокрутите страницу вниз и нажмите **Add credentials** в разделе **Platform metadata credentials**.
    - Введите необходимые учетные данные. Они должны обеспечивать видимость на уровне хранилища для соответствующих баз данных и схем.
    - Если у вас несколько подключений, ссылающихся на один и тот же идентификатор аккаунта, вам будет предложено добавить учетные данные платформенных метаданных только для одного из них. Остальные подключения с тем же идентификатором аккаунта отобразят сообщение о том, что учетные данные уже настроены.
5. Выберите опцию **External metadata ingestion**.
    - Это позволяет метаданным из данного подключения заполнять <Constant name="explorer" />.
    - *Опционально*: включите дополнительные возможности, такие как **cost optimization**, в разделе **Features** внутри **Platform metadata credentials**.
6. В разделе **Catalog filters** примените фильтры, чтобы ограничить, какие метаданные будут загружаться:
    - Можно фильтровать по **database**, **schema**, **table** или **view**.
      - **Примечание:** чтобы включить все базы данных или схемы, укажите `.*` в поле **Allow**.
    - Настоятельно рекомендуется фильтровать по определенным схемам. Подробнее см. в разделе [Important considerations](/docs/explore/external-metadata-ingestion#important-considerations).
    - Эти поля принимают регулярные выражения в формате CSV:
        - Пример: `DIM` соответствует `DIM_ORDERS` и `DIMENSION_TABLE` (базовое совпадение «содержит»).
        - Поддерживаются подстановочные символы. Например: `DIM*` соответствует `DIM_ORDERS` и `DIM_PRODUCTS`.

## Требуемые учетные данные

В этом разделе настраивается базовый доступ dbt к Snowflake. Создается роль (`dbt_metadata_role`) с минимально необходимыми правами и пользователь (`dbt_metadata_user`), предназначенный исключительно для доступа dbt к метаданным. Это обеспечивает четкое и контролируемое разделение доступа, позволяя dbt читать метаданные без предоставления более широких прав. Такая настройка гарантирует, что dbt может читать метаданные для профилирования, документации и lineage, не имея возможности изменять данные или управлять ресурсами.

1. Создайте роль:

```sql
CREATE OR REPLACE ROLE dbt_metadata_role;
```

2. Предоставьте доступ к warehouse для выполнения запросов просмотра метаданных:

```sql
GRANT USAGE ON WAREHOUSE "<your-warehouse>" TO ROLE dbt_metadata_role;
```

Если для ingestion метаданных требуется перезапуск warehouse (и auto-resume не включен), может потребоваться также предоставить роли право `OPERATE`.  
Если у вас еще нет пользователя, создайте отдельного пользователя dbt для доступа к метаданным. Замените `<your-password>` на надежный пароль, а `<your-warehouse>` — на имя warehouse, указанное выше:

```sql
CREATE USER dbt_metadata_user
  DISPLAY_NAME = 'dbt Metadata Integration'
  PASSWORD = 'our-password>'
  DEFAULT_ROLE = dbt_metadata_role
  TYPE = 'LEGACY_SERVICE'
  DEFAULT_WAREHOUSE = '<your-warehouse>';
```

3. Назначьте роль пользователю:

```sql
GRANT ROLE dbt_metadata_role TO USER dbt_metadata_user;
```

Примечание: используйте сервисные учетные записи только для чтения, чтобы соблюдать принцип минимальных привилегий и улучшить аудит.

## Назначение прав доступа к метаданным

В этом разделе описаны минимально необходимые привилегии для чтения метаданных из каждой требуемой базы данных Snowflake. Они обеспечивают доступ к схемам, таблицам, представлениям и информации о lineage, позволяя dbt профилировать и документировать данные, при этом предотвращая любые изменения.

Замените `your-database` на имя базы данных Snowflake, для которой нужно предоставить доступ к метаданным. Повторите этот блок для каждой соответствующей базы данных:

```sql
SET db_var = '"<your-database>"';

-- Grant access to view the database and its schemas
GRANT USAGE ON DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT USAGE ON ALL SCHEMAS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT USAGE ON FUTURE SCHEMAS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Grant REFERENCES to enable lineage and dependency analysis
GRANT REFERENCES ON ALL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON ALL EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON ALL VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Recommended grant SELECT for privileges to enable metadata introspection and profiling
GRANT SELECT ON ALL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Grant MONITOR on dynamic tables (e.g., for freshness or status checks)
GRANT MONITOR ON ALL DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT MONITOR ON FUTURE DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
```

## Предоставление доступа к метаданным Snowflake

На этом шаге роли dbt (`dbt_metadata_role`) предоставляется доступ к системной базе данных Snowflake, что позволяет читать статистику использования, историю запросов и информацию о lineage, необходимую для комплексного анализа метаданных.

Предоставьте права для чтения статистики использования и lineage из системной базы данных Snowflake:

```sql
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE dbt_metadata_role;
```

## Важные соображения

Ниже приведены лучшие практики для ingestion внешних метаданных, направленные на обеспечение стабильной, надежной и масштабируемой интеграции метаданных из сторонних систем.

- <Constant name="explorer" /> объединяет общие ресурсы между dbt и Snowflake. Например, если таблица Snowflake представляет модель dbt, они отображаются как единый ресурс в <Constant name="explorer" />. Чтобы такое объединение происходило корректно, одно и то же подключение должно использоваться как [production environment](/docs/deploy/deploy-environments#set-as-production-environment), так и учетными данными для ingestion внешних метаданных.
- Избегайте дубликатов: по возможности используйте одно подключение для метаданных на каждую платформу (например, одно для Snowflake, одно для BigQuery).
    - Наличие нескольких подключений, указывающих на одно и то же хранилище, может приводить к дублированию метаданных.
- Синхронизация с окружениями dbt: для объединения lineage и метаданных убедитесь, что одно и то же подключение к хранилищу используется и окружением dbt, и ingestion внешних метаданных.
- Используйте фильтры, чтобы ограничить ingestion только релевантными активами:
    - Например, ограничьтесь только production-схемами или исключите transient/temporary схемы.

Ingestion внешних метаданных выполняется ежедневно в 17:00 UTC, а также запускается сразу после каждого обновления и сохранения учетных данных.
