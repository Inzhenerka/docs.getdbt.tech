---
title: "Начало работы с Lake Compute"
description: "Шаги по подготовке сред MDLS и Snowflake перед вводным звонком для участия в закрытом предварительном тестировании Lake Compute."
id: compute-onboarding
---

# Начало работы с Lake Compute <Lifecycle status="private_beta" />

:::info Lake Compute находится в стадии закрытого бета-тестирования

Чтобы запросить доступ, заполните [форму регистрации Lake Compute](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform). Lake Compute активно разрабатывается и, вероятно, будет меняться. Возможны изменения, нарушающие обратную совместимость; документация может быть неполной, а техническая поддержка — ограниченной. На период бета-тестирования соглашение об уровне обслуживания не распространяется. Ознакомьтесь с [ограничениями закрытого бета-тестирования](/docs/lake-compute#private-beta-limitations), прежде чем планировать использование Lake Compute для реальных задач.

:::

## Настройка MDLS

MDLS — это управляемое озеро данных от Fivetran, включающее размещённый в облаке каталог Iceberg и вычислительный сервис (Lake Compute). Чтобы начать использовать Lake Compute, вам понадобятся аккаунт Fivetran и экземпляр MDLS.

### 1. Создайте аккаунт Fivetran (если у вас его ещё нет)

Сам аккаунт Fivetran можно создать и использовать бесплатно неограниченное время, даже после окончания пробного периода, при условии, что вы не создаёте коннекторы: плата взимается только за коннекторы, а использование MDLS и Lake Compute пока не тарифицируется. Если вы также хотите попробовать коннекторы, вам предоставляется 14-дневный пробный период с полным набором функций.

### 2. Создайте назначение MDLS (если у вас его ещё нет) {#create-mdls-destination}

Следуйте [руководству по настройке Managed Data Lake Service для AWS](https://fivetran.com/docs/managed-data-lake-service/setup-guide#setupinstructionsforaws) на сайте документации Fivetran.

:::info На что обратить внимание

- Укажите бакет S3 в регионе `us-east-1`, чтобы снизить задержки и затраты на исходящий трафик.
- Убедитесь, что имя и префикс бакета не содержат следующих символов: `['#', '%', '^', '{', '}', '[', ']', '"', '?', '|', '', ' ']`.
- После создания назначения MDLS Fivetran предоставит необходимый `External ID` (также известный как `group_id`). Укажите его вместе с аккаунтом AWS Fivetran (`834469178297`) в политике доверия IAM.

:::

### 3. Включите Lake Compute и сгенерируйте токен

Прежде чем включать Lake Compute, нажмите **Save & Test** в настройках назначения MDLS и убедитесь, что все тесты проходят успешно. Включайте Lake Compute и генерируйте токен только после успешного прохождения всех тестов подключения MDLS. Генерировать токен в рамках самой настройки подключения MDLS не требуется.

На странице назначения для вашего экземпляра MDLS перейдите на вкладку **Compute** и включите **Enable Lake Compute**.

<Lightbox src="/img/docs/lake-compute/enable-lake-compute.png" title="Включение Lake Compute" width="80%" />

Затем сгенерируйте токен (пользовательский или для сервисного аккаунта). Сохраните этот токен в менеджере паролей: он понадобится для профиля подключения dbt.

<Lightbox src="/img/docs/lake-compute/generate-token.png" title="Генерация токена Lake Compute" width="80%" />

## Настройка Snowflake

Для выполнения этих шагов требуются права `ACCOUNTADMIN`.

### Поддерживаемые методы аутентификации

Lake Compute поддерживает следующие методы аутентификации:
- `sso` (с `authenticator: externalbrowser` для локальной разработки)
- `keypair` (с `private_key`)
- `self_signed_jwt`
- `workload_identity`

В настоящее время поддерживаются только эти методы. Следующие методы аутентификации позволяют создать PAT Snowflake, но Lake Compute пока их не поддерживает — поддержка появится в ближайшее время:
- `user`/`password`
- `user`/`password` с MFA
- OAuth

Lake Compute использует ваш профиль подключения Snowflake для генерации токена, предоставляющего доступ к таблицам Iceberg в Snowflake Horizon. Этот токен обладает теми же правами доступа, что и пользователь/роль, указанные в вашем профиле подключения Snowflake. По умолчанию это [персональный токен доступа (PAT)](https://docs.snowflake.com/en/user-guide/programmatic-access-tokens) со сроком действия 1 месяц; при необходимости вы можете задать другое значение `pat_duration` в соответствии с политиками безопасности вашей организации.

Чтобы использовать аутентификацию по паре ключей, следуйте руководству Snowflake по [аутентификации с помощью пары ключей и ротации ключей](https://docs.snowflake.com/en/user-guide/key-pair-auth): создайте для своего пользователя пару закрытого и открытого ключей в формате Privacy Enhanced Mail (PEM), а затем задайте открытый ключ для пользователя:

```sql
ALTER USER USER_NAME SET RSA_PUBLIC_KEY='PUBLIC_KEY_BODY';
```

Замените `USER_NAME` на имя пользователя Snowflake, от имени которого подключается dbt, а `PUBLIC_KEY_BODY` — на содержимое сгенерированного открытого ключа. Сохраните закрытый ключ, чтобы позже указать его в `profiles.yml`.

Lake Compute подключается к Snowflake одним из двух способов:

- **Вариант 1 (PAT)** — совместим с любым из перечисленных выше методов. Lake Compute создаёт персональный токен доступа (PAT) Snowflake с помощью вашего профиля подключения; для этого требуется сетевая политика (см. раздел [Разрешение исходящего трафика Lake Compute с помощью сетевой политики](#allow-lake-computes-egress-through-a-network-policy-pat-only) ниже).
- **Вариант 2 (JWT)** — совместим с аутентификацией `keypair` (по закрытому ключу). Lake Compute выполняет аутентификацию напрямую с помощью JWT вместо создания PAT, поэтому сетевая политика не требуется.

Название `self_signed_jwt` похоже на `keypair`, но этот метод всё равно создаёт PAT за кулисами — он лишь кэширует этот PAT локально, чтобы повторно использовать его между запусками. Он соответствует варианту 1, а не варианту 2, и по-прежнему требует сетевой политики.

### Создание интеграции каталога Snowflake для MDLS

Создайте интеграцию каталога в Snowflake, используя предварительно сгенерированный SQL из раздела **Catalog integration > Snowflake** в интерфейсе Fivetran. Внесите в этот SQL следующие изменения:

| Старое значение | Новое значение |
|-----------|-----------|
| `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` | Введите существующие учётные данные или нажмите **Regenerate client secret**, если вы их забыли. |

Lake Compute использует интеграцию каталога MDLS для передачи метаданных таблиц Iceberg из MDLS в Snowflake после построения каждой модели. Поэтому необходимо выполнить `grant usage on integration CATALOG_INTEGRATION_NAME to role ROLE_NAME` для всех ролей, которые запускают dbt с Lake Compute.

### Разрешение исходящего трафика Lake Compute с помощью сетевой политики (только для PAT) {#allow-lake-computes-egress-through-a-network-policy-pat-only}

:::info Этот раздел относится только к варианту 1 (PAT)

Snowflake требует наличия действующей сетевой политики перед созданием PAT, даже если в остальных случаях ваш аккаунт её не требует. Если вы используете вариант 2 (аутентификацию `keypair` с JWT), Lake Compute не создаёт PAT, и вы можете **полностью пропустить этот раздел.**

:::

Сначала проверьте, назначена ли уже сетевая политика вашему аккаунту или пользователю:

```sql
SHOW PARAMETERS LIKE 'NETWORK_POLICY' IN ACCOUNT;
SHOW PARAMETERS LIKE 'NETWORK_POLICY' IN USER USER_NAME;
```

- **Если ни один запрос не возвращает политику:** по умолчанию Snowflake не ограничивает исходящий трафик, и никаких дополнительных действий не требуется — пропустите оставшуюся часть этого раздела.
- **Если хотя бы один запрос возвращает политику:** продолжайте настройку ниже. В Snowflake сетевая политика, назначенная пользователю, *заменяет* политику уровня аккаунта для этого пользователя, а не дополняет её. Поэтому существующая политика уже учитывает ваш IP-адрес или диапазон VPN — вам нужно лишь добавить в неё IP-адреса исходящего трафика Lake Compute.

1. Создайте сетевое правило с IP-адресами исходящего трафика Lake Compute:

```sql
CREATE NETWORK RULE lakecompute_ipv4
  TYPE = IPV4
  MODE = INGRESS
  VALUE_LIST = (
    '34.85.252.27/32',
    '35.197.105.90/32',
    '3.239.194.48/29', -- AWS us-east-1
    '35.80.36.104/29' -- AWS us-west-2
  );
```

2. Добавьте `lakecompute_ipv4` в список разрешённых правил существующей политики. Команда `ALTER NETWORK POLICY ... SET ALLOWED_NETWORK_RULE_LIST` заменяет весь список, поэтому включите в него как существующие правила, так и новое. Замените `EXISTING_POLICY_NAME` на существующую политику аккаунта или пользователя, а `EXISTING_RULE_NAME` — на правила, уже указанные в этой политике (проверьте их с помощью `DESC NETWORK POLICY EXISTING_POLICY_NAME;`):

```sql
ALTER NETWORK POLICY EXISTING_POLICY_NAME SET ALLOWED_NETWORK_RULE_LIST = (
  'EXISTING_RULE_NAME',
  'lakecompute_ipv4'
);
```

:::note

Создавать сетевые правила или изменять сетевые политики могут только администраторы безопасности (то есть пользователи с ролью `SECURITYADMIN`) и выше, а также роли с глобальной привилегией `CREATE NETWORK POLICY`.

:::

В некоторых аккаунтах также ограничены методы аутентификации, доступные пользователю или аккаунту. Если ваш аккаунт блокирует аутентификацию с помощью PAT, перед созданием PAT для Lake Compute в Snowflake необходимо настроить [политику аутентификации](https://docs.snowflake.com/en/sql-reference/sql/create-authentication-policy), которая явно её разрешает.

## Настройка профиля подключения

Вы можете использовать Lake Compute одним из двух способов:

1. Как вспомогательный вычислительный сервис («sidecar») для существующего хранилища данных, например Snowflake. Lake Compute читает вышестоящие модели из управляемого каталога Iceberg этого хранилища данных, например Snowflake Horizon.
2. Как адаптер по умолчанию: Lake Compute используется для вычислений, а Fivetran MDLS — для хранения.

Прежде чем продолжить, обновите клиент dbt до последней версии: `dbt system update --version VERSION`. Для поддержки Lake Compute требуется один из последних выпусков dbt v2.

### Включение запусков с несколькими адаптерами

В dbt использование Lake Compute требует явного включения экспериментальной функции. Задайте следующую переменную перед любым запуском для **любого** из двух описанных выше вариантов:

```bash
export DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true
```

Эта переменная разрешает использование `type: lakecompute` в `profiles.yml`, настройки `adapter` для узла и флага `--adapter`. Пока она отключена, dbt завершает работу с ошибкой на этапе разбора и выводит сообщение с именем переменной вместо того, чтобы использовать адаптер по умолчанию; переменная `DBT_ALLOW_EXPERIMENTAL_ADAPTERS` её не заменяет. Полное описание поведения см. в разделе [Обязательная переменная окружения](/docs/lake-compute#required-environment-variable).

Добавьте её в профиль терминала, чтобы она сохранялась между сеансами.

### Локальный `profiles.yml`

#### Использование Lake Compute как вспомогательного сервиса («sidecar»)

Замените `YOUR_ACCOUNT` на идентификатор вашего аккаунта Snowflake, `DATABASE_NAME` и `SCHEMA_NAME` — на базу данных и схему, в которые dbt записывает данные, а `LAKE_COMPUTE_TOKEN` — на токен, сгенерированный на шаге 3:

```yaml
my_profile:
  target: default
  outputs:
    default:
      - name: snowflake
        type: snowflake
        default: true
        account: YOUR_ACCOUNT
        database: DATABASE_NAME
        schema: SCHEMA_NAME
        ...
      - name: lakecompute
        type: lakecompute
        method: fivetran
        fivetran_credential: LAKE_COMPUTE_TOKEN
        # database + schema are inherited from default adapter config 
```

При использовании этого профиля Lake Compute:

- Использует конфигурацию адаптера Snowflake по умолчанию для создания PAT для управляемого каталога Snowflake Horizon
- Читает все вышестоящие таблицы Iceberg из каталога Horizon
- Записывает модели как таблицы Iceberg в MDLS и передаёт их в каталог Horizon, используя `database` и `schema` из конфигурации адаптера Snowflake по умолчанию в качестве расположения для записи по умолчанию

#### Использование Lake Compute как адаптера по умолчанию

При таком подходе весь проект выполняется в Lake Compute, и Lake Compute материализует каждую модель как таблицу Iceberg в вашем экземпляре каталога MDLS. Замените `MDLS_INSTANCE_NAME` на имя вашего экземпляра MDLS, `SCHEMA_NAME` — на схему, в которую dbt записывает данные, а `LAKE_COMPUTE_TOKEN` — на токен, сгенерированный на шаге 3:

```yaml
# new spec
my_profile:
  target: default
  outputs:
    default:
      - name: lakecompute
        type: lakecompute
        method: fivetran
        fivetran_credential: LAKE_COMPUTE_TOKEN
        # database + schema are required when lakecompute is default
        database: MDLS_INSTANCE_NAME
        schema: SCHEMA_NAME
```

Это означает следующее:

- **Для каждой модели в проекте по умолчанию задана настройка `compute: 'lakecompute'`.**
- Каждая модель также получает значения по умолчанию `materialized: table` и `table_format: 'iceberg'`.

### Платформа dbt {#dbt-platform}

#### Использование Lake Compute как вспомогательного сервиса («sidecar»)

В качестве временного обходного решения на период закрытого бета-тестирования можно задать настройки Lake Compute через [расширенные атрибуты (Extended Attributes)](/docs/dbt-platform-environments#extended-attributes), добавив ключ с именем `lakecompute`:

```yaml
lakecompute:
  method: fivetran
  fivetran_credential: "{{ env_var('DBT_ENV_SECRET_LAKE_COMPUTE_TOKEN') }}"
method: self_signed_jwt
```

:::caution Не размещайте токен в Extended Attributes
Extended Attributes не являются безопасным местом для секретов, поэтому никогда не вставляйте сам токен в это поле. Ссылайтесь на него через `env_var()`, как показано выше, а сам токен храните в [секретной переменной окружения](/docs/build/environment-variables#handling-secrets).
:::

Затем задайте следующие переменные окружения:
- `DBT_ALLOW_EXPERIMENTAL_ADAPTERS`: `true`
- `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER`: `true`
- `DBT_ENV_SECRET_LAKE_COMPUTE_TOKEN`: токен, сгенерированный на шаге 3

Это отличается от локального запуска, при котором вы задаёте и `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER`, и `DBT_ALLOW_EXPERIMENTAL_ADAPTERS`. См. раздел [Обязательная переменная окружения](/docs/lake-compute#required-environment-variable).

### Проверка настройки

Запустите `dbt debug`, чтобы убедиться, что профиль настроен правильно. Обычно `debug` лишь проверяет возможность подключения к платформе данных, но для Lake Compute выполняет более подробную проверку, чтобы при неверной настройке предоставить информацию, на основе которой можно устранить проблему. Ошибка может указывать на проблемы с учётными данными, некорректный профиль, отсутствие `database`/`schema` (см. выше) или сетевую политику, блокирующую исходящий трафик (см. раздел [Разрешение исходящего трафика Lake Compute с помощью сетевой политики](#allow-lake-computes-egress-through-a-network-policy-pat-only)).


В общих чертах команда выполняет следующие действия:
1. Разбирает `profiles.yml` и `dbt_project.yml`.
2. Проверяет аутентификацию для каждого настроенного адаптера в выходной конфигурации, включая `lakecompute`, с помощью теста записи и последующего чтения. 
3. Проверяет «передачу»: для таблицы, записанной в MDLS, должна создаваться соответствующая таблица в каталоге Horizon, чтобы нижестоящие узлы Snowflake могли ссылаться на неё через `ref`.


## Настройка моделей для выполнения в Lake Compute

### Использование Lake Compute как вспомогательного сервиса («sidecar»)

Для DAG dbt вида `model_a -> model_b -> model_c` можно настроить:

- `model_a` для выполнения в Snowflake и материализации таблицы Iceberg в Snowflake Horizon с использованием хранилища, управляемого Snowflake
- `model_b` для выполнения в Lake Compute
- `model_c` для выполнения в Snowflake

```sql
-- models/model_a.sql
{{ config(
    table_format = 'iceberg',
    materialized = 'table'
) }}

select 1 as id
```

```sql
-- models/model_b.sql
{{ config(
    adapter = 'lakecompute'
) }}

select * from {{ ref('model_a') }}
```

```sql
-- models/model_c.sql
select * from {{ ref('model_b') }}
```

### Использование Lake Compute как адаптера по умолчанию

Все ваши модели по умолчанию выполняются в Lake Compute и записывают данные в таблицы Iceberg в MDLS. Также проверьте наличие существующих настроек `materialized: view`: Lake Compute не поддерживает представления (см. [Ограничения закрытого бета-тестирования](/docs/lake-compute#private-beta-limitations)), поэтому перед переносом проекта переключите все представления на `table` или `ephemeral`.

Для существующего проекта переносите модели в два этапа, а не все сразу:

1. Определите модель, которую хотите выполнять в Lake Compute, и её непосредственные вышестоящие зависимости.
2. Добавьте `{{ config(materialized='table', table_format='iceberg') }}` в целевую модель и её вышестоящие зависимости. Запустите проект и убедитесь, что он работает. Любые ошибки выполнения на этом этапе связаны с несовместимостью типов Iceberg/Snowflake и требуют приведения типов.
3. В целевую модель добавьте `{{ config(adapter='lakecompute') }}` и проверьте наличие функций, специфичных для Snowflake. Если такие функции есть, перепишите запрос, используя соответствующие функции DuckDB. Снова запустите проект для проверки.
