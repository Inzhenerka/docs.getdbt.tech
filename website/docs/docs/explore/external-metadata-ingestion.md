---
title: "Загрузка внешних метаданных"
sidebar_label: "Загрузка внешних метаданных"
description: "Подключайтесь напрямую к своему хранилищу данных, чтобы просматривать таблицы, представления и другие ресурсы, не определённые в dbt, с помощью dbt Catalog."
unlisted: true
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Загрузка внешних метаданных <Lifecycle status="preview" />

<IntroText>

Загрузка внешних метаданных позволяет подключаться напрямую к вашему хранилищу данных и просматривать таблицы, представления и другие ресурсы, не определённые в dbt, с помощью <Constant name="catalog" />.

</IntroText>

:::info Поддержка ingestion внешних метаданных
В настоящее время ingestion внешних метаданных поддерживается только для Snowflake.
:::
  
Учетные данные для внешних метаданных позволяют загружать метаданные, существующие *за пределами* запусков dbt, например сведения о таблицах, представлениях или затратах; как правило, для этого требуется более высокий уровень доступа, чем у сред dbt. Это полезно для обогащения <Constant name="catalog" /> сведениями из самого хранилища (например, о представлениях Snowflake или характере доступа к данным) и создания единого интерфейса для поиска и изучения данных.

Эти учетные данные настраиваются отдельно от учетных данных окружений dbt и имеют область действия на уровне аккаунта, а не проекта.

## Предварительные требования {#prerequisites}

- У вас должна быть учетная запись <Constant name="dbt" /> на тарифном плане [Enterprise или Enterprise+](https://www.getdbt.com/pricing).
- Вы должны быть [администратором учетной записи с правом](/docs/platform/manage-access/enterprise-permissions#account-admin) редактировать подключения.
    - Учетные данные должны обеспечивать [достаточные права на чтение для получения метаданных](/docs/explore/external-metadata-ingestion#configuration-instructions).
- У вас должна быть включена [**глобальная навигация**](/docs/explore/explore-projects#catalog-overview).
- Используйте Snowflake в качестве платформы данных.
- Поддержка дополнительных адаптеров появится в ближайшее время!

## Инструкции по настройке {#configuration-instructions}

:::note Изменения переключателя загрузки внешних метаданных
Переключатель **Ingest external metadata in dbt <Constant name="catalog" /> (formerly dbt Explorer)** удалён из раздела **Account settings**.

Теперь загрузка внешних метаданных настраивается отдельно для каждого подключения в разделе **Platform metadata credentials** настроек **Connections**. Флажок **External metadata ingestion** отображается только для подключений, для которых загрузка уже была включена.
:::

### Настройка подключения к хранилищу {#configure-the-warehouse-connection}

1. Перейдите в **Account settings**.
2. Нажмите **Connections** на левой боковой панели.
3. Выберите существующее подключение или создайте [**New connection**](/docs/platform/connect-data-platform/connect-snowflake), из которого хотите загружать метаданные.
4. Прокрутите страницу до раздела **Platform metadata credentials**. В зависимости от текущей конфигурации вы можете увидеть один из следующих вариантов:
    - Если загрузка метаданных платформы еще не настроена, форма учетных данных сразу откроется в режиме редактирования.
    - Если вы ранее отменили настройку и видите **Add credentials**, нажмите эту кнопку, чтобы снова открыть форму.
    - Если у вас несколько подключений с одним и тем же идентификатором учетной записи, вам будет предложено настроить загрузку метаданных платформы только для одного из них. Для остальных подключений с тем же идентификатором учетной записи отобразится сообщение о том, что загрузка метаданных платформы уже настроена.
5. Введите необходимые учетные данные. Они должны обеспечивать доступ к метаданным на уровне хранилища во всех соответствующих базах данных и схемах.
6. В разделе **Features** выберите, какие функции будут использовать эти учетные данные:
  - External metadata ingestion: загружает таблицы, представления и другие метаданные, не относящиеся к dbt, в <Constant name="catalog"/>. Этот параметр отображается, только если для подключения уже была включена загрузка метаданных.
  - Cost insights (необязательно): отображает данные о затратах и производительности хранилища в <Constant name="dbt_platform"/>.
7. В разделе **Catalog filters** примените фильтры, чтобы ограничить набор загружаемых метаданных:
    - Можно фильтровать по **database**, **schema**, **table** или **view**.
      - **Примечание:** чтобы включить все базы данных или схемы, введите `.*`  в поле **Allow**.
    - Настоятельно рекомендуется ограничить загрузку определенными схемами с помощью фильтров. Дополнительную информацию см. в разделе [Важные замечания](/docs/explore/external-metadata-ingestion#important-considerations).
    - Эти поля принимают регулярные выражения в формате CSV:
        - Пример: `DIM` соответствует `DIM_ORDERS` и `DIMENSION_TABLE` (простое совпадение по вхождению подстроки).
        - Поддерживаются подстановочные знаки. Например: `DIM*` соответствует `DIM_ORDERS` и `DIM_PRODUCTS`.

## Требуемые учетные данные {#required-credentials}

В этом разделе настраивается базовый доступ dbt к Snowflake. Создается роль (`dbt_metadata_role`) с минимально необходимыми правами и пользователь (`dbt_metadata_user`), предназначенный исключительно для доступа dbt к метаданным. Это обеспечивает четкое и контролируемое разделение доступа, позволяя dbt читать метаданные без предоставления более широких прав. Такая настройка гарантирует, что dbt может читать метаданные для профилирования, документации и lineage, не имея возможности изменять данные или управлять ресурсами.

1. Создайте роль:

```sql
CREATE OR REPLACE ROLE dbt_metadata_role;
```

2. Предоставьте доступ к warehouse для выполнения запросов просмотра метаданных:

```sql
GRANT USAGE ON WAREHOUSE "<your-warehouse>" TO ROLE dbt_metadata_role;
```

Если для загрузки метаданных ваше хранилище необходимо запускать повторно (автоматическое возобновление работы не включено), вам также может потребоваться предоставить роли права `OPERATE`. 
Если у вас ещё нет пользователя, создайте отдельного пользователя для dbt, предназначенного для доступа к метаданным. Замените `<your-password>` надёжным паролем, а `<your-warehouse>` — именем хранилища, использованным выше:

```sql
CREATE USER dbt_metadata_user
  DISPLAY_NAME = 'dbt Metadata Integration'
  PASSWORD = '<your-password>'
  DEFAULT_ROLE = dbt_metadata_role
  TYPE = 'LEGACY_SERVICE'
  DEFAULT_WAREHOUSE = '<your-warehouse>';
```

3. Назначьте роль пользователю:

```sql
GRANT ROLE dbt_metadata_role TO USER dbt_metadata_user;
```

Примечание: используйте сервисные учетные записи только для чтения, чтобы соблюдать принцип минимальных привилегий и улучшить аудит.

## Назначение прав доступа к метаданным {#assign-metadata-access-privileges}

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

## Предоставление доступа к метаданным Snowflake {#grant-access-to-snowflake-metadata}

На этом шаге роли dbt (`dbt_metadata_role`) предоставляется доступ к системной базе данных Snowflake, что позволяет читать статистику использования, историю запросов и информацию о lineage, необходимую для комплексного анализа метаданных.

Предоставьте права для чтения статистики использования и lineage из системной базы данных Snowflake:

```sql
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE dbt_metadata_role;
```

## Важные рекомендации {#important-considerations}

Ниже приведены рекомендации по загрузке внешних метаданных, которые помогут обеспечить согласованную, надежную и масштабируемую интеграцию метаданных из сторонних систем.

- <Constant name="catalog" /> объединяет общие ресурсы dbt и Snowflake. Например, если таблица Snowflake представляет модель dbt, они отображаются как единый ресурс в <Constant name="catalog" />. Для корректного объединения [производственная среда](/docs/deploy/deploy-environments#set-as-production-environment) и учетные данные для загрузки внешних метаданных должны использовать одно и то же подключение.
- Избегайте дубликатов: по возможности используйте одно подключение для загрузки метаданных на каждую платформу (например, одно для Snowflake, одно для BigQuery).
    - Несколько подключений к одному и тому же хранилищу данных могут привести к дублированию метаданных.
- Согласуйте подключение со средой dbt: чтобы объединить информацию о происхождении ресурсов и метаданные, убедитесь, что среда dbt и механизм загрузки внешних метаданных используют одно и то же подключение к хранилищу данных.
- Используйте фильтры, чтобы загружать метаданные только нужных ресурсов:
    - Например, ограничьте загрузку только производственными схемами или исключите схемы для непостоянных и временных объектов.

Загрузка внешних метаданных выполняется ежедневно в 17:00 UTC, а также запускается немедленно при каждом обновлении и сохранении учетных данных.

Ниже приведены лучшие практики для ingestion внешних метаданных, направленные на обеспечение стабильной, надежной и масштабируемой интеграции метаданных из сторонних систем.

- <Constant name="explorer" /> объединяет общие ресурсы между dbt и Snowflake. Например, если таблица Snowflake представляет модель dbt, они отображаются как единый ресурс в <Constant name="explorer" />. Чтобы такое объединение происходило корректно, одно и то же подключение должно использоваться как [production environment](/docs/deploy/deploy-environments#set-as-production-environment), так и учетными данными для ingestion внешних метаданных.
- Избегайте дубликатов: по возможности используйте одно подключение для метаданных на каждую платформу (например, одно для Snowflake, одно для BigQuery).
    - Наличие нескольких подключений, указывающих на одно и то же хранилище, может приводить к дублированию метаданных.
- Синхронизация с окружениями dbt: для объединения lineage и метаданных убедитесь, что одно и то же подключение к хранилищу используется и окружением dbt, и ingestion внешних метаданных.
- Используйте фильтры, чтобы ограничить ingestion только релевантными активами:
    - Например, ограничьтесь только production-схемами или исключите transient/temporary схемы.

Ingestion внешних метаданных выполняется ежедневно в 17:00 UTC, а также запускается сразу после каждого обновления и сохранения учетных данных.
