---
title: Переменные окружения
id: "environment-variables"
description: "Используйте переменные окружения для настройки поведения вашего dbt‑проекта."
---

Переменные окружения можно использовать для настройки поведения dbt‑проекта в зависимости от того, где именно он выполняется. Подробнее о том, как вызывать Jinja‑функцию `{{env_var('DBT_KEY','OPTIONAL_DEFAULT')}}` в коде проекта, см. документацию по
[env_var](/reference/dbt-jinja-functions/env_var).

:::info Именование и префиксы переменных окружения

Переменные окружения в <Constant name="cloud" /> должны иметь префикс `DBT_`, `DBT_ENV_SECRET_` или `DBT_ENV_CUSTOM_ENV_`. Ключи переменных окружения приводятся к верхнему регистру и являются чувствительными к регистру. При использовании `{{env_var('DBT_KEY')}}` в коде проекта ключ должен **точно** совпадать с именем переменной, заданной в интерфейсе <Constant name="cloud" />.

:::

### Установка и переопределение переменных окружения
В этом разделе описано, как задавать и переопределять переменные окружения в <Constant name="cloud" />.

<!-- no toc -->
- [Порядок приоритета](#order-of-precedence)
- [Задание переменных окружения](#setting-environment-variables)
- [Переопределение переменных окружения на уровне job](#overriding-environment-variables-at-the-job-level)
- [Переопределение переменных окружения на персональном уровне](#overriding-environment-variables-at-the-personal-level)
- [Локальные переменные окружения](#local-environment-variables)

#### Порядок приоритета

Значения переменных окружения могут быть заданы в нескольких местах внутри <Constant name="cloud" />. В результате <Constant name="cloud" /> интерпретирует переменные окружения в следующем порядке приоритета (от низшего к высшему):

 <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/env-var-precdence.png" title="Порядок приоритета переменных окружения"/>

Существует четыре уровня задания переменных окружения:

 1. Необязательный аргумент значения по умолчанию, переданный в Jinja‑функцию `env_var` в коде ( _самый низкий приоритет_ )
 2. Значение по умолчанию на уровне проекта, которое может быть переопределено
 3. Значение на уровне окружения, которое, в свою очередь, тоже может быть переопределено
 4. Значение на уровне job (job override) или в <Constant name="cloud_ide" /> для конкретного разработчика (personal override) ( _самый высокий приоритет_ )

#### Задание переменных окружения

Чтобы задать переменные окружения на уровне проекта и окружения, нажмите **Orchestration** в левом меню, затем выберите **Environments**. Нажмите **Environment variables**, чтобы добавить или обновить переменные окружения.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/navigate-to-env-vars.png" title="Вкладка Environment variables"/>

Обратите внимание на колонку **Project default**. Это удобное место для задания значения, которое будет применяться ко всему проекту независимо от того, где выполняется код. Мы рекомендуем использовать это поле, если вам нужен универсальный дефолт или если вы хотите добавить токен или секрет на уровне всего проекта.

Справа от колонки **Project default** находятся все ваши окружения. Значения, заданные на уровне окружения, имеют более высокий приоритет, чем значения по умолчанию на уровне проекта. Здесь, например, можно указать, что <Constant name="cloud" /> должен по‑разному интерпретировать значение переменной в окружениях Staging и Production.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/project-environment-view.png" title="Задание значений на уровне проекта и окружения"/>

#### Переопределение переменных окружения на уровне job

У вас может быть несколько job, которые выполняются в одном и том же окружении, и при этом вы хотите, чтобы переменная окружения интерпретировалась по‑разному в зависимости от job.

При создании или редактировании job вы увидите раздел, в котором можно переопределить значения переменных окружения, заданные на уровне проекта или окружения.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/job-override.gif" title="Переход к настройкам переопределения переменных окружения для job"/>

Каждый job выполняется в конкретном deployment‑окружении и по умолчанию наследует значения, заданные на уровне этого окружения (или на самом высоком доступном уровне приоритета). Если вы хотите задать другое значение на уровне job, просто отредактируйте его — оно переопределит унаследованное значение.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/job-override.png" title="Задание значения переопределения для job"/>

#### Переопределение переменных окружения на персональном уровне

Вы также можете задать персональное переопределение значения переменной окружения при разработке в интегрированной среде разработчика dbt (<Constant name="cloud_ide" />). По умолчанию <Constant name="cloud" /> использует значения переменных окружения, заданные в development‑окружении проекта. Чтобы просмотреть и переопределить эти значения, в <Constant name="cloud" /> выполните следующие шаги:
- Нажмите на имя вашей учетной записи в левом меню и выберите **Account settings**.
- В разделе **Your profile** нажмите **Credentials**, затем выберите ваш проект.
- Прокрутите до секции **Environment variables** и нажмите **Edit**, чтобы внести необходимые изменения.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/personal-override.gif" title="Переход к настройкам персонального переопределения переменных окружения"/>

Чтобы задать переопределение, разработчики могут указать другое значение для использования. Эти значения будут применяться в <Constant name="cloud_ide" /> как на вкладке Results, так и на вкладке Compiled SQL.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/personal-override.png" width="60%" title="Задание персонального значения переопределения"/>

:::info Достаточное покрытие
Если вы не задали значение по умолчанию на уровне проекта для каждой переменной окружения, может возникнуть ситуация, когда <Constant name="cloud" /> не сможет корректно интерпретировать значение переменной во всех контекстах. В таких случаях dbt выдаст ошибку компиляции: `Env var required but not provided`.
:::

:::info Изменение переменных окружения в середине сессии в <Constant name="cloud_ide" />
Если вы измените значение переменной окружения во время активной сессии в <Constant name="cloud_ide" />, может потребоваться обновить <Constant name="cloud_ide" />, чтобы изменения вступили в силу.
:::

Чтобы обновить <Constant name="cloud_ide" /> во время разработки, нажмите либо на зеленый индикатор `ready`, либо на красное сообщение `compilation error` в правом нижнем углу <Constant name="cloud_ide" />. Появится модальное окно — в нем выберите кнопку **Restart IDE**. Это загрузит актуальные значения переменных окружения в вашу среду разработки.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/refresh-ide.png" title="Обновление IDE во время сессии"/>

Существуют известные проблемы, связанные с частичным парсингом проекта и изменением переменных окружения в середине сессии IDE. Если вы обнаружили, что ваш dbt‑проект компилируется не с теми значениями, которые вы задали, попробуйте удалить файл `target/partial_parse.msgpack` в проекте dbt — это заставит dbt перекомпилировать весь проект целиком.

#### Локальные переменные окружения

Если вы используете расширение dbt для VS Code, вы можете задать переменные окружения локально — в профиле shell (`~/.zshrc` или `~/.bashrc`) либо в файле `.env` в корне вашего dbt‑проекта.

Подробнее см. страницу [Configure the dbt VS Code extension](/docs/configure-dbt-extension#set-environment-variables-locally).

### Работа с секретами

Хотя все переменные окружения в <Constant name="cloud" /> хранятся в зашифрованном виде, <Constant name="cloud" /> предоставляет дополнительные возможности для управления переменными, содержащими секреты или чувствительные данные. Если вы хотите, чтобы определенная переменная окружения была удалена (scrubbed) из всех логов и сообщений об ошибках, а также чтобы ее значение было скрыто в UI, вы можете добавить к ключу префикс `DBT_ENV_SECRET`. Эта функциональность поддерживается начиная с `dbt v1.0`.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/DBT_ENV_SECRET.png" title="Обфускация с префиксом DBT_ENV_SECRET"/>

**Примечание**: Переменную окружения можно использовать для хранения [git‑токена для клонирования репозитория](/docs/build/environment-variables#clone-private-packages). Мы рекомендуем выдавать git‑токену права только на чтение и рассмотреть использование machine‑account или PAT сервисного пользователя с ограниченным доступом к репозиториям — это поможет соблюдать хорошие практики безопасности.

### Специальные переменные окружения

В <Constant name="cloud" /> есть ряд предопределенных переменных окружения. Эти переменные задаются автоматически и не могут быть изменены.

#### Детали Studio IDE

Следующая переменная окружения автоматически задается для <Constant name="cloud_ide" />:

- `DBT_CLOUD_GIT_BRANCH` &mdash; Содержит имя Git‑ветки разработки в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).
  - Значение переменной меняется при смене ветки.
  - Не требует перезапуска <Constant name="cloud_ide" /> после смены ветки.
  - В настоящее время недоступна в [CLI <Constant name="cloud" />](/docs/cloud/cloud-cli-installation).

Сценарий использования &mdash; Полезно в случаях, когда нужно динамически использовать имя Git‑ветки в качестве префикса для [схемы разработки](/docs/build/custom-schemas) ( `{{ env_var ('DBT_CLOUD_GIT_BRANCH') }}` ).

#### Контекст платформы dbt

Следующие переменные окружения задаются автоматически:

- `DBT_ENV` &mdash; Этот ключ зарезервирован для приложения <Constant name="cloud" /> и всегда имеет значение `prod`. Используется только для deployment‑запусков.
- `DBT_CLOUD_ENVIRONMENT_NAME` &mdash; Имя окружения <Constant name="cloud" />, в котором выполняется `dbt`.
- `DBT_CLOUD_ENVIRONMENT_TYPE` &mdash; Тип окружения <Constant name="cloud" />, в котором выполняется `dbt`. Допустимые значения: `dev`, `staging` или `prod`. Для [General deployment environments](/docs/dbt-cloud-environments#types-of-environments) значение будет пустым, поэтому используйте значение по умолчанию, например `{{ env_var('DBT_CLOUD_ENVIRONMENT_TYPE', '') }}`.
- `DBT_CLOUD_INVOCATION_CONTEXT` &mdash; Тип контекста, в котором был запущен `dbt`. Возможные значения: `dev`, `staging`, `prod` или `ci`.
    - Дополнительно, используйте `DBT_CLOUD_INVOCATION_CONTEXT` в макросе `generate_schema_name()`, чтобы задать явные правила использования схемы по умолчанию (с префиксом `dbt_cloud_pr`) в CI‑job, даже если эти CI‑job выполняются в том же окружении, что и production‑job.

#### Детали запуска

- `DBT_CLOUD_PROJECT_ID` &mdash; ID проекта <Constant name="cloud" /> для данного запуска
- `DBT_CLOUD_JOB_ID` &mdash; ID job <Constant name="cloud" /> для данного запуска
- `DBT_CLOUD_RUN_ID` &mdash; ID конкретного запуска
- `DBT_CLOUD_RUN_REASON_CATEGORY` &mdash; «Категория» триггера запуска (одно из значений: `scheduled`, `github_pull_request`, `gitlab_merge_request`, `azure_pull_request`, `other`)
- `DBT_CLOUD_RUN_REASON` &mdash; Конкретный триггер запуска (например, `Scheduled`, `Kicked off by <email>` или пользовательский триггер через `API`)
- `DBT_CLOUD_ENVIRONMENT_ID` &mdash; ID окружения для данного запуска
- `DBT_CLOUD_ACCOUNT_ID` &mdash; ID аккаунта <Constant name="cloud" /> для данного запуска

#### Детали Git

_Следующие переменные в настоящее время доступны только для сборок Pull Request в GitHub, GitLab и Azure DevOps, запущенных через webhook_

- `DBT_CLOUD_PR_ID` &mdash; ID Pull Request в подключенной системе контроля версий
- `DBT_CLOUD_GIT_SHA` &mdash; SHA git‑коммита, который выполняется для этой сборки Pull Request

### Примеры использования

Переменные окружения можно использовать множеством способов — они дают вам гибкость и упрощают реализацию нужных сценариев в <Constant name="cloud" />.

<Expandable alt_header="Клонирование приватных пакетов">

Теперь, когда вы можете задавать секреты в виде переменных окружения, вы можете передавать git‑токены в HTTPS‑URL пакетов, чтобы динамически клонировать приватные репозитории. Подробнее см. раздел о [клонировании приватных пакетов](/docs/build/packages#private-packages).

</Expandable>

<Expandable alt_header="Динамическая настройка warehouse в подключении Snowflake">

Переменные окружения позволяют динамически изменять размер виртуального warehouse Snowflake в зависимости от job. Вместо прямого указания имени warehouse в настройках подключения проекта вы можете сослаться на переменную окружения, значение которой будет задано во время выполнения.

Например, вы хотите запускать job с `full-refresh` в XL‑warehouse, а инкрементальный job — в warehouse среднего размера. Оба job настроены в одном и том же окружении <Constant name="cloud" />. В конфигурации подключения вы можете использовать переменную окружения и указать имя warehouse как `{{env_var('DBT_WAREHOUSE')}}`. Затем в настройках job задать разные значения переменной `DBT_WAREHOUSE` в зависимости от нагрузки job.

В настоящее время невозможно динамически менять значения переменных окружения между моделями в рамках одного запуска. Это связано с тем, что каждая `env_var` может иметь только одно значение на всю продолжительность run.

**Примечание** &mdash; Этот метод также можно использовать с Databricks SQL Warehouse.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/warehouse-override.png" width="60%" title="Добавление переменных окружения в учетные данные подключения"/>

:::info Ограничения Snowflake OAuth и переменных окружения
Переменные окружения корректно работают с аутентификацией по имени пользователя/паролю и keypair, включая запланированные job, поскольку dbt Core обрабатывает Jinja, подставленный в автоматически сгенерированный `profiles.yml`, и выполняет `env_var`‑lookup.

Однако при использовании Snowflake OAuth Connection существуют ограничения:

- Нельзя использовать переменные окружения в поле account/host, но их можно использовать для database, warehouse и role. Для этих полей используйте [extended attributes](/docs/deploy/deploy-environments#deployment-connection).

Важно отметить: если вы укажете переменную окружения в поле account/host, Snowflake OAuth Connection **не сможет подключиться**. Это происходит потому, что это поле не проходит через Jinja‑рендеринг, и <Constant name="cloud" /> передает буквальный код `env_var` в URL, например `{{ env_var("DBT_ACCOUNT_HOST_NAME") }}.snowflakecomputing.com`, что является некорректным hostname. Вместо этого используйте [extended attributes](/docs/deploy/deploy-environments#deployment-credentials).
:::

</Expandable>

<Expandable alt_header="Аудит метаданных запуска">

Вот еще один пример использования автоматически заданного ID запуска <Constant name="cloud" />. Это дополнительное поле данных можно использовать для аудита и отладки:

```sql

{{ config(materialized='incremental', unique_key='user_id') }}

with users_aggregated as (

    select
        user_id,
        min(event_time) as first_event_time,
        max(event_time) as last_event_time,
        count(*) as count_total_events

    from {{ ref('users') }}
    group by 1

)

select *,
    -- Inject the run id if present, otherwise use "manual"
    '{{ env_var("DBT_CLOUD_RUN_ID", "manual") }}' as _audit_run_id

from users_aggregated
```

</Expandable>

<Expandable alt_header="Настройка учетных данных Semantic Layer">

import SLEnvVars from '/snippets/_sl-env-vars.md';

<SLEnvVars/>

</Expandable>
