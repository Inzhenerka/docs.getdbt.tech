---
title: "Практическое знакомство со Snowflake Horizon и Apache Iceberg"
id: "iceberg"
time_to_complete: '60 минут' 
level: 'Продвинутый'
icon: 'zap'
description: "Используйте открытый REST-каталог Iceberg в Snowflake Horizon для доступа к единому набору таблиц с централизованным управлением и их преобразования из Snowflake и DuckDB."
hide_table_of_contents: true
tags: ['dbt v2','Snowflake','Iceberg','DuckDB']
recently_updated: true
---

В этом руководстве вы узнаете, как выполнять преобразования dbt в двух движках (Snowflake и DuckDB), работая с единым общим набором таблиц Apache Iceberg. Вы создадите слои исходных и подготовленных данных в виде таблиц Iceberg под управлением Snowflake, а затем используете открытый REST-каталог Iceberg в Snowflake Horizon, чтобы DuckDB мог напрямую читать и записывать те же самые таблицы. В результате получится рабочий процесс с несколькими движками, в котором каждое преобразование выполняется на наиболее подходящем движке, данные никогда не копируются и не синхронизируются между системами, а управление данными и отслеживание их происхождения сохраняются на всех этапах.

## Доступ к одним и тем же таблицам Iceberg из Snowflake и DuckDB

К концу этого руководства ваш проект `fusion-jaffle-shop` будет преобразовывать данные в двух разных движках, используя единый общий набор таблиц:

- **Snowflake:** Создаёт слои исходных и подготовленных данных в виде таблиц Apache Iceberg под управлением Snowflake, зарегистрированных во встроенном каталоге Horizon.
- **DuckDB:** Читает те же самые таблицы Iceberg через открытый REST-каталог Iceberg в Horizon, создаёт нижестоящую модель (`orders`) и записывает результат *обратно* в виде таблицы Iceberg в том же каталоге.

Самое интересное — этап с DuckDB. Поскольку Iceberg — это открытый формат таблиц, а Horizon поддерживает открытый протокол Iceberg REST, внешний движок, такой как DuckDB, может работать напрямую с таблицами Snowflake, для которых действуют правила управления данными. Оба решения читают и записывают одни и те же файлы через один и тот же каталог, без отдельной копии данных.

Если точнее, преобразование выполняется в локальном процессе DuckDB (встроенном в <Constant name="fusion_engine" />); Horizon предоставляет метаданные каталога и выдаёт краткосрочные учётные данные для доступа к хранилищу, чтобы DuckDB мог обращаться к файлам, которые всё это время находятся в вашем собственном бакете S3.

Вычислительные кластеры Snowflake (warehouse) обладают высокой производительностью. Даже одноузловой XSMALL хорошо справляется с большинством преобразований в промышленной среде, и для основной части ваших рабочих нагрузок выполнение в Snowflake остаётся правильным выбором. Но иногда полезно обращаться к тем же таблицам с централизованным управлением откуда-то ещё: для быстрого исследовательского запроса с ноутбука, для этапа, который естественно вписывается в конвейер, уже работающий на другом движке, или для задачи, ради которой не хочется запускать warehouse. REST-каталог Iceberg в Horizon делает это возможным без дублирования данных и потери управления ими.

Почему это важно:

- **Одна копия с централизованным управлением, множество движков**: Существует единственная физическая копия данных в открытом формате Parquet с метаданными Iceberg, зарегистрированная в Horizon. Snowflake, DuckDB, Spark, Trino и другие движки могут напрямую читать и записывать её. Без синхронизации и ETL между системами.
- **Управление данными сохраняется**: Таблицы остаются полноценными объектами Snowflake. Они отображаются в каталоге, учитывают предоставленные права доступа и могут иметь политики маскирования, политики доступа к строкам и сведения о происхождении данных — даже если их записал DuckDB.
- **Гибкий выбор движка под задачу**: Поскольку Horizon предоставляет доступ к одним и тем же таблицам из разных сред, вы можете направлять каждое преобразование в наиболее подходящий движок, в том числе выполнять отдельный этап локально в DuckDB, без дублирования данных и перестройки архитектуры конвейера.

Это основа кроссплатформенного [dbt Mesh](https://docs.getdbt.com/docs/mesh/cross-platform-mesh): один проект, один каталог, множество движков.

## Примечания к руководству

Прежде чем начать, учтите несколько моментов:

- Это руководство для опытных пользователей. Предполагается, что у вас есть базовые знания dbt, Snowflake, DuckDB, связанных инструментов и способов их установки.
- Хотя dbt отлично справляется с SQL-преобразованиями, некоторые инструменты из этого руководства предъявляют строгие требования к синтаксису. Настоятельно рекомендуем удалять комментарии из примеров кода в этом руководстве, прежде чем использовать их в рабочей среде.
- Используемый демонстрационный проект — это расширенный вариант существующего проекта Jaffle Shop. Он позволяет показать некоторые аспекты, которые вам потребуется учитывать при внедрении таких рабочих процессов в собственных проектах. Чтобы всё прошло успешно, рекомендуем использовать проект по ссылке из этого руководства, а не другие существующие проекты Jaffle Shop. 
- Если вы используете аккаунт Snowflake, не настроенный для работы с Python (например, совершенно новый пробный аккаунт), в Python-моделях проекта dbt могут возникнуть ошибки. Удаление этих моделей на время прохождения руководства устранит ошибки (хотя некоторые предупреждения, не блокирующие работу, останутся).

## Предварительные требования

Для прохождения этого руководства вам потребуются определённые инструменты, аккаунты и права доступа. 

### Аккаунты и доступ

Для выполнения необходимых шагов настройки вам потребуются:

- **Аккаунт Snowflake**, в котором вы можете работать с ролью `ACCOUNTADMIN`. В этом руководстве всё создаётся с нуля, поэтому предполагается, что вы начинаете с нового аккаунта (подойдёт пробный).
- **Аккаунт AWS**, в котором вы можете создать бакет S3, а также роль и политику IAM.
- Локальная копия [**проекта `fusion-jaffle-shop`**](https://github.com/matthewshaver/jaffle-shop-multi-adapter) с CSV-файлами исходных данных в `seeds/`.
- Навыки выполнения SQL в Snowsight и базовых команд в терминале.

### Инструменты: установка и проверка

Перед началом установите и проверьте следующее:

| Требование | Для чего | Проверка |
|---|---|---|
| **<Constant name="fusion_engine" />** (v2, `preview.194`+) | Поддержка `catalogs.yml` v2 и подключения каталогов в DuckDB | `dbt --version` |
| **DuckDB 1.5.4+** | Совместимость с записью в Iceberg (`ATTACH`, выдача учётных данных) | `duckdb --version` |
| **Аккаунт AWS** | Размещение бакета S3, в котором хранятся данные и метаданные Iceberg | — |
| **Новый аккаунт Snowflake** | Размещение Horizon и управляемых таблиц Iceberg | — |
| **Проект `fusion-jaffle-shop`** | Локальная копия с CSV-файлами исходных данных в `seeds/` | `ls seeds/` выводит `raw_*.csv` |


### Заполнители, используемые в руководстве

Во всём руководстве заменяйте эти заполнители собственными значениями:

- `<ACCOUNT_IDENTIFIER>`: Идентификатор вашего аккаунта Snowflake в формате `ORG-ACCOUNT` (например, `ABCDEFG-HI12345`). Его можно найти в Snowsight: меню аккаунта → **Account** → **View account details**, или в URL аккаунта `https://<ORG>-<ACCOUNT>.snowflakecomputing.com`.
- `<AWS_ACCOUNT_ID>`: Ваш 12-значный номер аккаунта AWS.
- `<YOUR_USER>`: Ваше имя пользователя для входа в Snowflake.
- `<REGION>`: Регион AWS для вашего бакета. В этом руководстве используется `us-east-2`; выберите регион, ближайший к региону вашего аккаунта Snowflake.

Это руководство предназначено только для v2. Механизм `catalogs.yml`, на который оно опирается, недоступен в устаревшем Python-адаптере `dbt-duckdb`.

## Проект

В этом руководстве используется существенно расширенная копия традиционного проекта Jaffle Shop. Сам проект содержит больше возможностей, чем требуется для простой настройки рабочего процесса с Iceberg, поэтому вы можете использовать его для дополнительных экспериментов и наблюдения за результатами. 

Клонируйте [проект `fusion-jaffle-shop`](https://github.com/matthewshaver/jaffle-shop-multi-adapter) с GitHub:

```bash
git clone https://github.com/matthewshaver/jaffle-shop-multi-adapter.git
```

Затем перейдите в каталог проекта:

```bash
cd fusion-jaffle-shop
```


## Часть 1. Настройка аккаунта Snowflake {#set-up-snowflake}

Войдите в Snowsight (веб-интерфейс Snowflake) под пользователем с правами администратора. Откройте новый SQL-лист и выполните каждый из приведённых ниже блоков.

### 1.1 Создайте warehouse, базу данных и схему

```sql
USE ROLE ACCOUNTADMIN;

CREATE WAREHOUSE IF NOT EXISTS COMPUTE_WH
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;

CREATE DATABASE IF NOT EXISTS DBT_ICEBERG;
CREATE SCHEMA IF NOT EXISTS DBT_ICEBERG.RAW;
```

### 1.2 Создайте роль `TRANSFORMER` и предоставьте ей все необходимые права

Вы будете использовать одну роль, `TRANSFORMER`, для всех операций: как для построения в Snowflake, так и для выполнения задач в DuckDB. Поскольку `TRANSFORMER` будет *владеть* каждой создаваемой ею таблицей, она автоматически получит права на чтение и запись, и впоследствии вам не потребуются дополнительные разрешения `SELECT`.

```sql
USE ROLE ACCOUNTADMIN;

CREATE ROLE IF NOT EXISTS TRANSFORMER;

-- Let TRANSFORMER use compute and the database objects
GRANT USAGE ON WAREHOUSE COMPUTE_WH TO ROLE TRANSFORMER;
GRANT USAGE ON DATABASE DBT_ICEBERG TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;

-- Let TRANSFORMER create the tables dbt will build (seeds + Iceberg models)
GRANT CREATE TABLE ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;
GRANT CREATE ICEBERG TABLE ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;
GRANT CREATE VIEW ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;

-- Give the role to yourself so you can use it, and make it your default
GRANT ROLE TRANSFORMER TO USER <YOUR_USER>;
ALTER USER <YOUR_USER> SET DEFAULT_ROLE = TRANSFORMER;
```

В части 3, после создания внешнего тома, мы предоставим роли `TRANSFORMER` доступ к нему.


## Часть 2. Создание бакета S3 и роли IAM в AWS {#create-s3-and-iam}

Таблицы Iceberg под управлением Snowflake хранят файлы данных и метаданных в объектном хранилище, принадлежащем вам. Snowflake получает доступ к этому бакету, принимая созданную вами роль IAM. Это двустороннее согласование, поэтому порядок действий важен.

### 2.1 Создайте бакет S3

В консоли AWS:

1. Перейдите в **S3 → Create bucket**.
2. **Bucket name**: выберите глобально уникальное имя. Удобный шаблон — `iceberg-<AWS_ACCOUNT_ID>-<REGION>`, например `iceberg-1234567890-us-east-2`.
3. **Region**: выберите `<REGION>` (например, `us-east-2`).
4. Оставьте остальные настройки по умолчанию и нажмите **Create bucket**.
5. (Необязательно, но удобно для порядка) откройте бакет и создайте папку/префикс `jaffle-iceberg/` для хранения всех файлов Iceberg.

### 2.2 Создайте политику разрешений IAM

В консоли AWS:

1. Перейдите в **IAM → Policies → Create policy** и откройте вкладку **JSON**.
2. Вставьте следующий код, заменив имя бакета в обоих блоках `Resource`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:GetObjectVersion", "s3:DeleteObject", "s3:DeleteObjectVersion"],
      "Resource": "arn:aws:s3:::iceberg-<AWS_ACCOUNT_ID>-<REGION>/jaffle-iceberg/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::iceberg-<AWS_ACCOUNT_ID>-<REGION>",
      "Condition": { "StringLike": { "s3:prefix": ["jaffle-iceberg/*"] } }
    }
  ]
}
```

3. Нажмите **Next**, задайте имя `snowflake-iceberg-policy` и нажмите **Create policy**.

### 2.3 Создайте роль IAM (с временной политикой доверия)

Пока нельзя заполнить окончательную политику доверия: для неё нужны значения, которые Snowflake сгенерирует в части 3. Поэтому создайте роль с временной политикой доверия, а затем исправьте её.

В консоли AWS:

1. Перейдите в **IAM → Roles → Create role**.
2. **Trusted entity type**: выберите **AWS account**.
3. Выберите **This account (`<AWS_ACCOUNT_ID>`)**. Оставьте оба флажка, **"Require external ID"** и **"Require MFA"**, **снятыми**. (Это временная настройка доверия; вы замените её в части 3.)
4. Нажмите **Next**. На странице разрешений найдите и отметьте **`snowflake-iceberg-policy`**.
5. Нажмите **Next**, задайте роли имя **`snowflake-iceberg-role`** и нажмите **Create role**.
6. Откройте новую роль и скопируйте её **ARN** (`arn:aws:iam::<AWS_ACCOUNT_ID>:role/snowflake-iceberg-role`) — он понадобится на следующем этапе.

## Часть 3. Подключение Snowflake к S3 через внешний том

Внешний том — это защищённое подключение Snowflake к бакету S3, в котором хранятся ваши данные и метаданные Iceberg. В этой части вы создадите том, завершите настройку доверия между Snowflake и вашей ролью IAM и назначите этот том используемым по умолчанию для базы данных, чтобы каждая таблица Iceberg знала, где хранить свои файлы.


### 3.1 Создайте внешний том

Вернитесь в Snowsight (с ролью `ACCOUNTADMIN`), скопируйте и вставьте следующий код (замените `<PLACEHOLDERS>` своими данными):

```sql
USE ROLE ACCOUNTADMIN;

CREATE OR REPLACE EXTERNAL VOLUME ICEBERG_EXT_VOL
  STORAGE_LOCATIONS = ((
    NAME = 'iceberg-s3-<REGION>'
    STORAGE_PROVIDER = 'S3'
    STORAGE_BASE_URL = 's3://iceberg-<AWS_ACCOUNT_ID>-<REGION>/jaffle-iceberg/'
    STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::<AWS_ACCOUNT_ID>:role/snowflake-iceberg-role'
  ))
  ALLOW_WRITES = TRUE;
```

### 3.2 Получите идентификационные данные Snowflake и завершите настройку доверия IAM

```sql
DESCRIBE EXTERNAL VOLUME ICEBERG_EXT_VOL;
```

В выводе найдите строку `STORAGE_LOCATION_1` и извлеките из её JSON два значения:

- `STORAGE_AWS_IAM_USER_ARN` (выглядит как `arn:aws:iam::123456789012:user/abc1-s`)
- `STORAGE_AWS_EXTERNAL_ID` (выглядит как `ABC12345_SFCRole=...=`)

Теперь вернитесь в консоль AWS: **IAM → Roles → `snowflake-iceberg-role` → Trust relationships → Edit trust policy**, удалите текущее содержимое и вставьте следующий код (со своими двумя значениями):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "<STORAGE_AWS_IAM_USER_ARN>" },
    "Action": "sts:AssumeRole",
    "Condition": { "StringEquals": { "sts:ExternalId": "<STORAGE_AWS_EXTERNAL_ID>" } }
  }]
}
```

Нажмите **Update policy**. Скопируйте внешний идентификатор _в точности_, включая все завершающие `=` и символы `/` внутри строки. Регистр имеет значение.

### 3.3 Предоставьте доступ к тому и назначьте его используемым по умолчанию для базы данных

```sql
USE ROLE ACCOUNTADMIN;

-- TRANSFORMER needs USAGE on the volume (required for credential vending)
GRANT USAGE ON EXTERNAL VOLUME ICEBERG_EXT_VOL TO ROLE TRANSFORMER;

-- Make this volume the default for Iceberg tables in the database.
-- REQUIRED: when DuckDB creates a table through the REST catalog it can't
-- name a volume, so Snowflake falls back to this default.
ALTER DATABASE DBT_ICEBERG SET EXTERNAL_VOLUME = ICEBERG_EXT_VOL;
ALTER DATABASE DBT_ICEBERG SET CATALOG = 'SNOWFLAKE';
```

## Часть 4. Создание токена программного доступа для DuckDB {#create-pat-duckdb}

DuckDB проходит аутентификацию в REST-каталоге Horizon по OAuth2, используя токен программного доступа (Programmatic Access Token, PAT) в качестве учётных данных. Чтобы добавить PAT в Snowsight, выполните:

```sql
USE ROLE ACCOUNTADMIN;

ALTER USER <YOUR_USER> ADD PROGRAMMATIC ACCESS TOKEN duckdb_pat
  ROLE_RESTRICTION = 'TRANSFORMER'
  DAYS_TO_EXPIRY = 90;
```

Таблица результатов содержит два столбца. Скопируйте длинное значение `token_secret` (не `token_name`). Оно отображается только один раз; сохраните его в безопасном месте для части 6.

**Проверьте, что токен работает:** Прежде чем подключать его к dbt, выполните в терминале обмен OAuth2 (именно это DuckDB делает внутри). Обратите внимание на **пустое имя пользователя** перед двоеточием в `-u ":..."` — это обязательное условие (см. FAQ):

```bash
curl -s "https://<ACCOUNT_IDENTIFIER>.snowflakecomputing.com/polaris/api/catalog/v1/oauth/tokens" \
-u ":<TOKEN_SECRET>" \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=session:role:TRANSFORMER'
```

JSON-ответ, содержащий `"access_token"`, означает, что всё в порядке. Если вы видите `Programmatic access token is invalid`, скопируйте токен заново. **Если в сообщении об ошибке упоминается сетевая политика, см. [FAQ](/guides/iceberg?step=12#faq)**. Некоторые аккаунты Snowflake требуют наличия сетевой политики для создания или использования PAT.

## Часть 5. Загрузка исходных данных seed {#load-seed-data}

В этой части вы загрузите исходные CSV-данные seed из проекта dbt в Snowflake в виде обычных таблиц. Вы выполните загрузку seed для целевой конфигурации prod, чтобы получить полный исторический набор данных, а не для dev, где заказы ограничиваются последним годом.

### 5.1 Команды загрузки seed

Из корня проекта в dbt CLI установите пакеты и загрузите исходные таблицы в Snowflake. (Сначала убедитесь, что CSV-файлы seed присутствуют в `seeds/`.)

```bash
dbt deps
```
```bash
dbt seed --target prod
```

### 5.2 Первая загрузка seed

Хук проекта `on-run-start` (`insert_freshness_heartbeat()`) обращается к исходной таблице, которая не существует до загрузки seed, поэтому _первый_ запуск `dbt seed` может завершиться ошибкой `Object 'DBT_ICEBERG.RAW.RAW_STORES' does not exist`. Перед первой загрузкой seed закомментируйте блок `on-run-start` в `dbt_project.yml`:

```yaml
# on-run-start:
#   - "{{ insert_freshness_heartbeat() }}"
```

Уберите комментарии после создания таблиц seed.

При этом в `DBT_ICEBERG.RAW` загружаются следующие обычные таблицы Snowflake:
- `raw_customers`
- `raw_orders`
- `raw_items`
- `raw_products`
- `raw_stores`
- `raw_supplies`
- `raw_tweets`

Мы используем целевую конфигурацию `prod` — вы определите её в следующем разделе.

:::info Почему `prod`, а не `dev`?

Модель `stg_orders` в этом проекте применяет макрос `limit_in_dev`, который ограничивает заказы последним годом **всякий раз, когда целевая конфигурация называется `dev`**. Данные seed исторические, поэтому построение с `dev` даёт **пустую** таблицу `stg_orders` (а следовательно, и пустую `orders`). Построение с любой целевой конфигурацией, отличной от `dev`, пропускает этот фильтр и возвращает полный набор данных. Дополнительные сведения см. в [FAQ](/guides/iceberg?step=12#faq).

:::

## Часть 6. Настройка проекта {#configure-the-project}

### 6.1 `profiles.yml`

Создайте или отредактируйте `~/.dbt/profiles.yml`. Определите три целевые конфигурации: `dev` и `prod` (обе для Snowflake) и `duckdb` (для выполнения задач вне Snowflake). Вставьте свой PAT в `client_secret`.

_При желании вы можете выполнить `dbt init`, чтобы создать `profiles.yml` в нужном месте и настроить профиль Snowflake._

Если у вас уже есть `~/.dbt/profiles.yml`, добавьте приведённый ниже профиль `jaffle_shop` **до** выполнения любых команд. При существующей конфигурации `dbt init` может не добавить целевую конфигурацию `prod`, и на последующих этапах её не удастся найти.

```yaml
jaffle_shop:
  target: prod
  outputs:
    # Everyday Snowflake target. NOTE: stg_orders is limited to the last year here.
    dev:
      type: snowflake 
      account: "<ACCOUNT_IDENTIFIER>"
      user: "<YOUR_USER>"
      authenticator: externalbrowser # or your preferred auth
      role: TRANSFORMER
      database: DBT_ICEBERG
      schema: RAW
      warehouse: COMPUTE_WH
      threads: 8

    # Full-data Snowflake target used to build the Iceberg parents.
    prod:
      type: snowflake
      account: "<ACCOUNT_IDENTIFIER>"
      user: "<YOUR_USER>"
      authenticator: externalbrowser
      role: TRANSFORMER
      database: DBT_ICEBERG
      schema: RAW
      warehouse: COMPUTE_WH
      threads: 8

    # DuckDB target reads/writes Iceberg via Horizon with ZERO Snowflake compute.
    duckdb:
      type: duckdb
      path: ':memory:'
      schema: RAW
      secrets:
        - type: iceberg
          name: horizon_secret
          client_id: ""  # MUST be empty (see FAQ)
          client_secret: "<TOKEN_SECRET>" # your PAT from Part 4
          oauth2_server_uri: "https://<ACCOUNT_IDENTIFIER>.snowflakecomputing.com/polaris/api/catalog/v1/oauth/tokens"
          oauth2_scope: "session:role:TRANSFORMER"
```

В `dbt_project.yml` проекта v2 задано `profile: default`. Либо переименуйте ключ профиля выше в `default`, либо задайте `profile: jaffle_shop`. Эти значения должны совпадать.

:::note Если `externalbrowser` не работает

Например, при ошибке `390190 (08004) ... SAML Identity Provider account parameter` замените его аутентификацией по паролю для целевых конфигураций `dev` и `prod`, а сам пароль храните вне файла, используя переменную окружения:

```yaml
# authenticator: externalbrowser
password: "{{ env_var('SNOWFLAKE_PASSWORD') }}"
```

:::

### 6.2 `catalogs.yml`

Создайте `catalogs.yml` в корне проекта. Эта единственная запись описывает _один и тот же_ каталог Horizon для обоих движков.

```yaml
catalogs:
  - name: horizon_catalog
    type: horizon
    table_format: iceberg
    config:
      snowflake:
        external_volume: ICEBERG_EXT_VOL
      duckdb:
        warehouse: DBT_ICEBERG  # Horizon REST "warehouse" = the Snowflake database name
        endpoint: "https://<ACCOUNT_IDENTIFIER>.snowflakecomputing.com/polaris/api/catalog"
        secret: horizon_secret # references the profiles.yml secret above
        default_schema: RAW
        access_delegation_mode: VENDED_CREDENTIALS # Horizon vends temp S3 creds; no AWS keys needed
```

### 6.3 `dbt_project.yml`

Добавьте флаг поведения, включающий `catalogs.yml`, и удалите разрешения `marts` на уровне проекта (они не работают в DuckDB — см. раздел 6.4 и FAQ). Добавьте ближе к началу файла:

```yaml
flags:
  use_catalogs_v2: true
```

Затем в разделе `models: jaffle_shop: marts:` **удалите** блок `+grants`:

```yaml
# DELETE these two lines from the marts config:
   +grants:
     select: ["ACCOUNTADMIN"]
```

### 6.4 Изменения моделей

Эти правки обеспечивают материализацию трёх моделей в формате Iceberg и их работу на обоих движках.

- **`models/staging/stg_orders.sql`**: Добавьте блок конфигурации в начало файла и приведите временную метку к микросекундной точности (Iceberg не принимает наносекундную точность, используемую Snowflake по умолчанию):

    ```sql  
    {{ config(materialized='table', catalog_name='horizon_catalog', alias='STG_ORDERS') }}
    ```
    ...а строку с временной меткой замените на:

    ```sql
    cast({{ dbt.date_trunc('day','ordered_at') }} as timestamp_ntz(6)) as ordered_at
    ```

- **`models/marts/order_items.sql`**: добавьте в самое начало:

    ```sql
    {{ config(materialized='table', catalog_name='horizon_catalog', alias='ORDER_ITEMS') }}
    ```

- **`models/marts/orders.sql`**: замените начальный блок конфигурации следующим:

    ```sql
    {{ config(
        materialized='table',
        catalog_name='horizon_catalog',
        alias='ORDERS',
        grants={} if target.name == 'duckdb' else {'select': ['ACCOUNTADMIN']},
        persist_docs={'relation': false, 'columns': false} if target.name == 'duckdb' else {'relation': true, 'columns': true}
    ) }}
    ```

- **`models/marts/orders.yml`**: Отключите принудительное применение контракта (один контракт не может одновременно использовать имена типов Snowflake и DuckDB):

    ```yaml
          contract:
            enforced: false
    ```

- **`macros/insert_freshness_heartbeat.sql`**: Исключите целевую конфигурацию `duckdb` (heartbeat записывает данные в исходную таблицу Snowflake, которая не подключена в сеансе DuckDB):

    ```jinja
    {% if target.name not in ('ci', 'dev', 'duckdb') %}
    ```

- **Почему `alias` в верхнем регистре?** Snowflake хранит идентификаторы без кавычек в ВЕРХНЕМ РЕГИСТРЕ, а каталоги Iceberg чувствительны к регистру. DuckDB заключает имена моделей в нижнем регистре в кавычки, поэтому без псевдонима в верхнем регистре он будет искать `"stg_orders"` и не найдёт `STG_ORDERS`.

## Часть 7. Построение моделей {#build-it}

Здесь всё складывается воедино! Snowflake создаёт вышестоящие таблицы Iceberg для слоёв исходных и подготовленных данных, затем DuckDB читает эти же таблицы через Horizon, чтобы построить итоговую модель заказов и записать её обратно. Всё это — в одном общем каталоге.

### 7.1 Этап Snowflake: создание вышестоящих таблиц Iceberg {#snowflake-pass}

```bash
dbt run --target prod -s +orders --exclude orders
```

Эта команда создаёт `stg_orders` и `order_items` как таблицы Iceberg под управлением Snowflake в `DBT_ICEBERG.RAW`, зарегистрированные в Horizon. Поскольку вы выполняете команду с ролью `TRANSFORMER`, именно она владеет этими таблицами.

### 7.2 Этап DuckDB: чтение и запись через Horizon {#duckdb-pass}

```bash
dbt run --target duckdb -s orders
```

DuckDB подключает Horizon, читает `STG_ORDERS` и `ORDER_ITEMS` (получая временные учётные данные S3 от Horizon), строит `orders` локально и фиксирует результат в виде таблицы Iceberg через REST-каталог Horizon, не задействуя warehouse Snowflake.

### 7.3 Проверка

```bash
dbt show --target duckdb --inline "select count(*) from {{ ref('orders') }}"
```

Вы должны получить ненулевое количество строк (десятки тысяч). Кроме того, в Snowsight в `DBT_ICEBERG.RAW` появится `ORDERS` как **таблица Iceberg**, полностью записанная DuckDB.

**Подтвердите запись из другого движка:** в Snowsight откройте **Admin → Cost Management** (или выполните запрос к `snowflake.account_usage.warehouse_metering_history`). Вы увидите расход кредитов на построение с `prod` в разделе 7.1 и отсутствие расхода на запуск DuckDB в разделе 7.2 — это подтверждает, что DuckDB читал и записывал таблицы Iceberg напрямую через REST-каталог Horizon, а не через warehouse Snowflake.

## Поздравляем!

Вы только что создали единый набор таблиц Apache Iceberg и преобразовали их с помощью двух разных движков! Snowflake — для слоёв исходных и подготовленных данных, DuckDB — для итоговой модели заказов, и всё это с одним общим каталогом Horizon. Поскольку Horizon поддерживает открытый протокол Iceberg REST, DuckDB смог напрямую читать и записывать эти таблицы Snowflake с централизованным управлением. Без копирования данных и привязки к поставщику, с сохранением управления данными и отслеживания их происхождения независимо от того, какой движок выполняет работу. Это основа кроссплатформенного dbt Mesh: один проект, один каталог и свобода направлять каждую задачу в наиболее подходящий движок.

## Часто задаваемые вопросы {#faq}

<Expandable alt_header="Обмен токена OAuth возвращает `invalid_scope` для любой роли, даже `PUBLIC`.">

PAT необходимо отправлять с **пустым `client_id`** — как *пароль* HTTP Basic без имени пользователя (`curl -u ":<PAT>"`), что и обеспечивает `client_id: ""` в секрете DuckDB. Если передать реальное имя пользователя в качестве `client_id`, Snowflake попытается распознать его как зарегистрированный OAuth-клиент и отклонит область доступа. Решение — пустой client_id.

</Expandable>

<Expandable alt_header="Обмен возвращает `Programmatic access token is invalid`." >

Значение токена неверно — скорее всего, вы скопировали `token_name` вместо длинного `token_secret` или скопировали его не полностью. Создайте PAT заново и внимательно скопируйте `token_secret`.

</Expandable>

<Expandable alt_header="Создание или использование PAT завершается ошибкой, связанной с сетевой политикой.">

Некоторые аккаунты Snowflake требуют действующей сетевой политики для создания или использования PAT. Если вы столкнулись с этим, создайте сетевую политику, ограниченную диапазоном ваших внешних IP-адресов, назначьте её своему пользователю и повторите попытку. (Эта настройка намеренно не рассматривается в основной части руководства.)

</Expandable>

<Expandable alt_header="DuckDB получает `401 Unauthorized` от каталога.">

Проблема аутентификации. Проверьте: PAT действителен (используйте curl из части 4); `client_id` равен `""`; `oauth2_scope` равен `session:role:TRANSFORMER`, и вашему пользователю действительно назначена роль `TRANSFORMER`; аккаунт в `oauth2_server_uri`/`endpoint` совпадает с аккаунтом, в котором был создан PAT.

</Expandable>

<Expandable alt_header="DuckDB получает `404 Not Found` при обращении к `/v1/config`.">

Неверное значение `warehouse` в `catalogs.yml`. Для Horizon это **имя базы данных Snowflake** (`DBT_ICEBERG`), а не имя записи в `catalogs.yml`.

</Expandable>

<Expandable alt_header="Каталог возвращает пространство имён, но не показывает таблицы, или DuckDB не может найти таблицу, которая должна быть ему доступна.">

Две распространённые причины: (1) у роли недостаточно прав для просмотра объектов, но если вы создавали таблицы с ролью `TRANSFORMER` (как в этом руководстве), она владеет таблицами и видит их. Если вы создавали их с *другой* ролью, учтите, что `GRANT SELECT ON ALL TABLES` **не** распространяется на таблицы Iceberg; необходимо выполнить `GRANT SELECT ON ALL ICEBERG TABLES IN SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER` (а также выдать права на `FUTURE ICEBERG TABLES`). (2) Несовпадение регистра — см. примечание о псевдонимах в верхнем регистре ниже.

</Expandable>

<Expandable alt_header="`Catalog Error: Table with name raw.stg_orders does not exist`.">

Причина — чувствительность к регистру. Snowflake хранит `STG_ORDERS`; DuckDB использует `"stg_orders"` в кавычках. Задайте моделям Iceberg `alias` в верхнем регистре (`alias='STG_ORDERS'`). Для целого проекта лучше стандартизировать регистр идентификаторов, а не задавать псевдоним каждой модели.

</Expandable>

<Expandable alt_header="`SQL compilation error: Invalid time type scale ... TIMESTAMP_NTZ(9)`.">

Iceberg поддерживает временные метки только с микросекундной точностью. Выполните приведение к `timestamp_ntz(6)`.

</Expandable>

<Expandable alt_header="`403 Forbidden` при чтении `.metadata.json` из S3, с `region ''` / `No credentials provided`.">

DuckDB нужны учётные данные хранилища для чтения файлов данных. Задайте `access_delegation_mode: VENDED_CREDENTIALS` в блоке каталога `duckdb`, чтобы Horizon выдавал временные учётные данные S3 для нужного региона — ключи AWS не требуются. Если ошибка возникает периодически сразу после пересоздания таблицы, просто повторите запуск; новый процесс заново получит актуальные метаданные и учётные данные.

</Expandable>

<Expandable alt_header="`403 Authorization failed` при `POST .../namespaces/RAW/tables` (создание).">

Для базы данных не задан внешний том по умолчанию, поэтому REST-операция `createTable` не может определить, куда записывать данные. Выполните `ALTER DATABASE DBT_ICEBERG SET EXTERNAL_VOLUME = ICEBERG_EXT_VOL;` (а также `SET CATALOG = 'SNOWFLAKE';`). Также убедитесь, что у `TRANSFORMER` есть право `CREATE ICEBERG TABLE` для схемы и `USAGE` для тома.

</Expandable>

<Expandable alt_header="`500 ... Object 'ORDERS' already exists as TABLE`.">

Обычная таблица (не Iceberg) с таким именем уже существует в этом пространстве имён (например, после предыдущего полного запуска `dbt build`). Удалите её: `DROP TABLE IF EXISTS DBT_ICEBERG.RAW.ORDERS;` и повторите запуск, чтобы DuckDB мог создать версию в формате Iceberg.

</Expandable>

<Expandable alt_header="`unknown method: map has no method named warn_once` при назначении прав.">

Макрос `apply_grants` из dbt-duckdb сталкивается с несовместимостью с v2. В любом случае назначение прав не имеет смысла в DuckDB — сделайте `grant_config` пустым для целевой конфигурации DuckDB (`grants={} if target.name == 'duckdb' else {...}`) и удалите `+grants` из конфигурации `marts` на уровне проекта, чтобы эти настройки не добавлялись обратно при объединении.

</Expandable>

<Expandable alt_header="`Not implemented Error: Only ALTER TABLE is supported for Iceberg`.">

`persist_docs` генерирует операторы `COMMENT`, которые механизм записи Iceberg в DuckDB не поддерживает. Отключите его для целевой конфигурации DuckDB (`persist_docs={'relation': false, 'columns': false} if target.name == 'duckdb' else {...}`).

</Expandable>

<Expandable alt_header="`Type with name number does not exist` (DuckDB предлагает `numeric`).">

**Принудительно применяемый контракт модели** генерирует `CREATE TABLE` с указанием типов Snowflake (`number`, `timestamp_ntz`), которые DuckDB не распознаёт. Один контракт не может удовлетворять требованиям двух движков, поэтому задайте `contract: enforced: false` для моделей, которые вы строите в DuckDB.

</Expandable>

<Expandable alt_header="`orders` успешно создаётся, но содержит 0 строк.">

`stg_orders` оказалась пустой, потому что вы построили её с целевой конфигурацией `dev`, где `limit_in_dev` ограничивает заказы последним годом, а данные seed старше. Постройте вышестоящие модели с `prod` (или любой целевой конфигурацией, отличной от `dev`).

</Expandable>

<Expandable alt_header="`TRANSFORMER` не может выполнить `count(*)` / `must specify a warehouse`.">

Командам работы с метаданными (`show`, `describe`) не нужен warehouse, но запросам он необходим. Убедитесь, что выполнено `GRANT USAGE ON WAREHOUSE COMPUTE_WH TO ROLE TRANSFORMER`. Чтобы получить количество строк без warehouse, прочитайте `summary.total-records` из метаданных таблицы Iceberg через REST-эндпоинт `loadTable`.

</Expandable>

<Expandable alt_header="Как распространить этот подход на другие модели помимо `orders`?">

Перенесите переопределения для DuckDB (пустые `grants`, отключённый `persist_docs`) с уровня отдельных моделей в **конфигурацию `marts`, учитывающую целевую конфигурацию**, в `dbt_project.yml`, стандартизируйте регистр идентификаторов во всём проекте и добавьте `catalog_name`/`alias` каждой модели, которую хотите материализовать в формате Iceberg. Всё, что записывает Snowflake, DuckDB может прочитать, и наоборот.

</Expandable>
