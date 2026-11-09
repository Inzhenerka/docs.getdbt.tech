---
title: "Пакеты"
id: "packages"
description: "Пакеты dbt помогают модульно организовывать код и эффективно трансформировать данные."
keywords: [dbt package, private package, dbt private package, dbt data transformation, dbt clone, add dbt package]
availability: all_users
---

Программисты часто модульно организуют код в библиотеки. Эти библиотеки помогают программистам работать более эффективно: они могут тратить больше времени на уникальную бизнес-логику и меньше времени на реализацию кода, который кто-то другой уже довел до совершенства.

Разработчики программного обеспечения часто организуют код в виде библиотек. Эти библиотеки помогают программистам работать эффективнее: уделять больше времени своей уникальной бизнес-логике и меньше — реализации кода, на совершенствование которого кто-то другой уже потратил время.

В dbt такие библиотеки называются _пакетами_. Пакеты dbt настолько полезны потому, что многие аналитические задачи, с которыми мы сталкиваемся, общие для разных организаций, например:
* преобразование данных из наборов данных SaaS с единообразной структурой, например:
  * объединение просмотров страниц из [Snowplow](https://hub.getdbt.com/dbt-labs/snowplow/latest/) или [Segment](https://hub.getdbt.com/dbt-labs/segment/latest/) в сеансы
  * приведение данных о расходах из [AdWords](https://hub.getdbt.com/dbt-labs/adwords/latest/) или [Facebook Ads](https://hub.getdbt.com/dbt-labs/facebook_ads/latest/) к единому формату.
* написание макросов dbt, выполняющих схожие функции, например:
  * [генерация SQL](https://github.com/dbt-labs/dbt-utils#sql-helpers) для объединения двух отношений, разворота столбцов или создания суррогатного ключа (<Term id="surrogate-key" />)
  * создание [пользовательских тестов схемы](https://github.com/dbt-labs/dbt-utils#schema-tests)
  * написание [аудиторских запросов](https://hub.getdbt.com/dbt-labs/audit_helper/latest/)
* создание моделей и макросов для конкретного инструмента из вашего стека обработки данных, например:
  * Модели для анализа прав доступа в [Redshift](https://hub.getdbt.com/dbt-labs/redshift/latest/).
  * Макросы для работы с данными, загруженными с помощью [Stitch](https://hub.getdbt.com/dbt-labs/stitch_utils/latest/).
* подготовка неструктурированных данных, чтобы ИИ-агенты могли находить их, доверять им и ссылаться на них, например:
  * разбиение расшифровок звонков или обращений в службу поддержки на фрагменты, создание эмбеддингов и семантический поиск с помощью пакета [dbt_context_engineering](https://hub.getdbt.com/dbt-labs/dbt_context_engineering/latest/). Подробнее см. в [статье блога о dbt_context_engineering](https://docs.getdbt.com/blog/dbt-context-engineering).

_Пакеты_ dbt — это, по сути, самостоятельные проекты dbt с моделями, макросами и другими ресурсами, предназначенными для решения определённого круга задач. Когда вы как пользователь dbt добавляете пакет в свой проект, все ресурсы пакета становятся частью вашего проекта. Это означает следующее:
* Модели из пакета будут материализованы при выполнении `dbt run`.
* Вы можете использовать `ref` в собственных моделях, чтобы ссылаться на модели из пакета.
* Вы можете использовать `source`, чтобы ссылаться на источники из пакета.
* Вы можете использовать макросы из пакета в собственном проекте.
* Важно отметить, что определение и установка пакетов dbt отличаются от [определения и установки пакетов Python](/docs/build/python-models#using-pypi-packages)

Пакеты dbt на самом деле являются автономными проектами dbt, с моделями, макросами и другими ресурсами, которые решают конкретную проблему. Как пользователь dbt, добавляя пакет в свой проект, все ресурсы пакета станут частью вашего собственного проекта. Это означает:
* Модели в пакете будут материализованы, когда вы выполните `dbt run`.
* Вы можете использовать `ref` в своих моделях для ссылки на модели из пакета.
* Вы можете использовать `source` для ссылки на источники в пакете.
* Вы можете использовать макросы из пакета в своем собственном проекте.
* Важно отметить, что определение и установка пакетов dbt отличается от [определения и установки пакетов Python](/docs/build/python-models#using-pypi-packages).

import UseCaseInfo from '/snippets/_packages_or_dependencies.md';

<UseCaseInfo/>

## Как создать пакет? {#how-do-i-create-a-package}

Создание пакетов — это продвинутый сценарий использования dbt, однако на практике это может быть относительно простой задачей. Единственное строгое требование — наличие файла [`dbt_project.yml`](/reference/dbt_project.yml).

Наиболее распространённые сценарии использования пакетов:

- Распространение [models](/docs/build/models) для повторного использования в нескольких проектах.
- Распространение [macros](/docs/build/jinja-macros) для повторного использования в нескольких проектах.

Обратите внимание, что пакеты могут быть [приватными](#private-packages) — их не обязательно публиковать в открытом доступе. Приватные пакеты можно размещать в собственном Git‑провайдере (например, GitHub или GitLab).

Инструкции по созданию пакетов dbt и дополнительную информацию вы найдёте в нашем руководстве [Building dbt packages](/guides/building-packages?step=1).


## Как добавить пакет в проект? {#how-do-i-add-a-package-to-my-project}
1. Добавьте в ваш dbt‑проект файл с именем `dependencies.yml` или `packages.yml`. Он должен находиться на том же уровне, что и файл `dbt_project.yml`.
2. Укажите пакет(ы), которые вы хотите добавить, используя один из поддерживаемых синтаксисов, например:

<File>

```yaml
packages:
  - package: dbt-labs/snowplow
    version: 0.7.0

  - git: "https://github.com/dbt-labs/dbt-utils.git"
    revision: 0.9.2

  - local: /opt/dbt/redshift
```

</File>

По умолчанию [`packages-install-path`](/reference/project-configs/packages-install-path) — это `dbt_packages`.

3. Запустите `dbt deps`, чтобы установить пакет(ы). Пакеты устанавливаются в директорию `dbt_packages` — по умолчанию эта директория игнорируется git, чтобы избежать дублирования исходного кода пакета.

## Как указать пакет? {#how-do-i-specify-a-package}
Вы можете указать пакет, используя один из следующих методов, в зависимости от того, где хранится ваш пакет.

### Hub-пакеты (рекомендуется) {#hub-packages-recommended}

dbt Labs предоставляет [Package hub](https://hub.getdbt.com), реестр для пакетов dbt, в качестве услуги для сообщества dbt, но не сертифицирует и не подтверждает целостность, работоспособность, эффективность или безопасность любых пакетов. Пожалуйста, прочитайте [отказ от ответственности dbt Labs Package](https://hub.getdbt.com/disclaimer/) перед установкой hub-пакетов.

Вы можете установить доступные hub-пакеты следующим образом:

<File name='packages.yml'>

```yaml
packages:
  - package: dbt-labs/snowplow
    version: 0.7.3 # номер версии
```

</File>

Для hub-пакетов требуется указание версии — вы можете найти последний номер релиза на dbt Hub. Поскольку hub-пакеты используют [семантическое версионирование](https://semver.org/), мы рекомендуем закрепить ваш пакет на последней патч-версии из конкретного минорного релиза, например:

```yaml
packages:
  - package: dbt-labs/snowplow
    version: [">=0.7.0", "<0.8.0"]
```

`dbt deps` "закрепляет" каждый пакет по умолчанию. Подробности см. в разделе ["Закрепление пакетов"](#pinning-packages).

По возможности, мы рекомендуем устанавливать пакеты через dbt Hub, так как это позволяет dbt обрабатывать дублирующиеся зависимости. Это полезно в таких ситуациях, как:
* Ваш проект использует как пакеты dbt-utils, так и Snowplow, и пакет Snowplow _также_ использует пакет dbt-utils.
* Ваш проект использует как пакеты Snowplow, так и Stripe, оба из которых используют пакет dbt-utils.

В сравнении, другие методы установки пакетов не могут обрабатывать дублирующийся пакет dbt-utils.

Опытные пользователи могут разместить внутреннюю версию хаба пакетов на основе [этого репозитория](https://github.com/dbt-labs/hub.getdbt.com), задав переменную окружения <VersionBlock lastVersion="1.10">`DBT_PACKAGE_HUB_URL`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PACKAGE_HUB_URL`</VersionBlock>.

#### Предрелизные версии {#prerelease-versions}

Некоторые поддерживающие пакеты могут захотеть выложить предрелизные версии пакетов на dbt Hub, чтобы протестировать новую функциональность или совместимость с новой версией dbt. Предрелизная версия обозначается суффиксом, таким как `a1` (первая альфа), `b2` (вторая бета) или `rc3` (третий кандидат на релиз).

По умолчанию, `dbt deps` не будет включать предрелизные версии при разрешении зависимостей пакетов. Вы можете включить установку предрелизов одним из двух способов:
- Явно указав предрелизную версию в ваших критериях `version`
- Установив `install_prerelease` в `true` и предоставив совместимый диапазон версий

Например, обе следующие конфигурации успешно установят `0.4.5-a2` для [`dbt_artifacts` пакета](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest/):

```yaml
packages:
  - package: brooklyn-data/dbt_artifacts
    version: 0.4.5-a2
```

```yaml
packages:
  - package: brooklyn-data/dbt_artifacts
    version: [">=0.4.4", "<0.4.6"]
    install_prerelease: true
```

### Git-пакеты {#git-packages}
Пакеты, хранящиеся на Git-сервере, могут быть установлены с использованием синтаксиса `git`, например:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://github.com/dbt-labs/dbt-utils.git" # git URL
    revision: 0.9.2 # имя тега или ветки
```

</File>

Добавьте URL для пакета с помощью `<Constant name="git" />` и при необходимости укажите ревизию. Ревизией может быть:
- имя ветки
- тег релиза
- конкретный коммит (полный 40-символьный хэш)

Пример ревизии, указывающей 40-символьный хэш:

```yaml
packages:
  - git: "https://github.com/dbt-labs/dbt-utils.git"
    revision: 4e28d6da126e2940d17f697de783a717f2503188
```

По умолчанию, `dbt deps` "закрепляет" каждый пакет. Подробности см. в разделе ["Закрепление пакетов"](#pinning-packages).

### URL tarball, размещённый во внутренней инфраструктуре {#internally-hosted-tarball-url}

В некоторых организациях действуют требования безопасности, согласно которым ресурсы можно загружать только из внутренних сервисов. Чтобы обеспечить установку пакетов из таких сред размещения, как Artifactory или бакеты облачных хранилищ, dbt позволяет устанавливать пакеты по URL-адресам tarball-архивов, размещённых во внутренней инфраструктуре.

Некоторые организации имеют требования безопасности, чтобы загружать ресурсы только из внутренних сервисов. Чтобы удовлетворить необходимость установки пакетов из размещенных сред, таких как Artifactory или облачные хранилища, dbt Core позволяет устанавливать пакеты из внутренне размещенных URL-адресов tarball.

```yaml
packages:
  - tarball: https://codeload.github.com/dbt-labs/dbt-utils/tar.gz/0.9.6
    name: 'dbt_utils'
```

Где `name: 'dbt_utils'` указывает подпапку `dbt_packages`, которая создается для установки исходного кода пакета.

## Приватные пакеты {#private-packages}

### Встроенная поддержка приватных пакетов {#native-private-packages}

Встроенная поддержка приватных пакетов позволяет устанавливать пакеты из [поддерживаемых](#prerequisites) приватных репозиториев <Constant name="git" /> с помощью ключа `private`, без настройки [токена](#git-token-method) или указания полного Git URL. Это упрощает настройку и сокращает объём работы по управлению учётными данными.

- <Constant name="dbt_platform" />: использует существующую [интеграцию](/docs/platform/git/configure-git) с <Constant name="git" /> для аутентификации.
- При локальном использовании <Constant name="fusion" /> или <Constant name="dbt" /> v1.12+: используется конфигурация SSH вашей системы. Требуется [`provider`](#using-the-provider-key).

#### Предварительные условия {#prerequisites}

- **<Constant name="dbt_platform" />**: В разделе **Integrations** ваших **Account settings** должен быть настроен один из следующих провайдеров <Constant name="git" />:
  - **[GitHub](/docs/platform/git/connect-github)**
  - **[Azure DevOps](/docs/platform/git/connect-azure-devops)**
    - Используйте путь `org/project/repo` с провайдером `ado`.
  - **[GitLab](/docs/platform/git/connect-gitlab)**
    - Каждый репозиторий GitLab с приватными пакетами также должен быть проектом <Constant name="dbt_platform" />.
- **Локальное использование <Constant name="fusion" /> или <Constant name="dbt" /> v1.12+**: На вашем компьютере должен быть настроен SSH-ключ для соответствующего Git-провайдера, а в конфигурацию пакетов необходимо включить [ключ `provider`](#using-the-provider-key).

#### Конфигурация

Используйте ключ `private` в файле `packages.yml` или `dependencies.yml`, чтобы клонировать репозитории пакетов с помощью существующей Git-интеграции <Constant name="dbt" /> без необходимости выпускать токен доступа или создавать переменную окружения <Constant name="dbt" />.

<File name="packages.yml">

```yaml
packages:
  - private: dbt-labs/awesome_repo # your-org/your-repo path
    provider: "github" # Supported values: "github", "gitlab", "ado"
  - package: normal packages
  [...]
```
</File>

<File name="dependencies.yml">

```yaml
packages:
  - private: dbt-labs/awesome_repo # your-org/your-repo path
    provider: "github" # Supported values: "github", "gitlab", "ado"
```
</File>


:::info Azure DevOps considerations and limitations
There are some considerations and limitations when using native private packages from Azure DevOps. Open the expandable section to learn more.

<Expandable alt_header="Native private packages and Azure DevOps limitations">

1. Use the `ado` provider and specify the `org/project/repo` path in the `private` key.

    <File name="packages.yml">

    ```yaml
    packages:
      - private: my-org/my-project/my-repo
        provider: "ado"
    ```
    </File>


2. On <Constant name="dbt_platform" />, native private packages from Azure DevOps can fail when the package is in a different Azure DevOps project than the job that installs it, especially if your account is connected to many Azure DevOps projects:

    - This happens because <Constant name="dbt_platform" /> has a 32 KB limit for the Azure DevOps authentication details it can use at job runtime. If your connected Azure DevOps projects exceed that limit, <Constant name="dbt_platform" /> can only use the current project's connection. As a result, packages in other Azure DevOps projects can't be accessed and `dbt deps` fails.

    - As a workaround, reduce the number of Azure DevOps projects connected to your account, then rerun `dbt deps`. The number of projects you can connect depends on your Azure DevOps organization structure and repo count.
    
    This limitation doesn't affect local development with <Constant name="core" /> or <Constant name="fusion" /> when cloning private packages over SSH.

    We're currently working to address this, and if you're running into issues, please contact your dbt Labs account team.

</Expandable>
:::

Вы можете закреплять версии приватных пакетов так же, как и у обычных пакетов dbt:

```yaml
packages:
  - private: dbt-labs/awesome_repo
    revision: "0.9.5" # Закрепить на теге, ветке или полном 40-символьном хэше коммита
```

#### Использование ключа `provider` {#using-the-provider-key}

Добавьте ключ `provider`, если:
- Вы используете несколько интеграций с <Constant name="git" /> или используете <Constant name="fusion_engine" />.
- Вы используете <Constant name="fusion" /> локально (через [CLI <Constant name="fusion" />](/docs/local/install-dbt?version=2) или [расширение для VS Code](/docs/local/install-dbt?version=2)) (обязательно).
- Вы используете <Constant name="dbt" /> версии 1.12 или новее для клонирования по SSH (обязательно).

```yaml
packages:
  - private: dbt-labs/awesome_repo
provider: "github" # Поддерживаемые значения: "github", "gitlab", "ado"
```

<Constant name="core" /> и <Constant name="fusion" /> используют значение `provider`, чтобы сформировать правильный SSH URL для клонирования в зависимости от провайдера:

| Провайдер | Формат SSH URL |
| --- | --- |
| `github` | `git@github.com:org/repo.git` |
| `gitlab` | `git@gitlab.com:org/repo.git` |
| `ado` | `git@ssh.dev.azure.com:v3/org/project/repo` |

<Constant name="core" /> и <Constant name="fusion" /> используют конфигурацию SSH вашей системы для аутентификации и клонирования приватного репозитория. Если команда `git clone` для приватного репозитория пакета работает в вашей системе, установка приватного пакета также должна работать.

### Метод с использованием SSH-ключа (только CLI)

:::note
В этом методе используется ключ `git:` с полным SSH URL, в отличие от [встроенного механизма приватных пакетов](#native-private-packages), в котором используется ключ `private:`. Для большинства сценариев рекомендуется встроенный механизм приватных пакетов, поскольку он упрощает настройку.
:::

Если вы используете командную строку, приватные пакеты можно клонировать по SSH с помощью SSH-ключа.

При использовании SSH-ключей для аутентификации на удалённом git-сервере вам не нужно каждый раз вводить имя пользователя и пароль. Подробнее об SSH-ключах, их создании и добавлении у вашего git-провайдера читайте здесь: [Github](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) и [GitLab](https://docs.gitlab.com/ee/user/ssh.html).

Когда вы используете SSH-ключи для аутентификации на вашем удаленном сервере git, вам не нужно вводить ваше имя пользователя и пароль каждый раз. Подробнее о SSH-ключах, как их сгенерировать и как добавить их в ваш git-провайдер, читайте здесь: [Github](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) и [GitLab](https://docs.gitlab.com/ee/user/ssh.html).

<File name='packages.yml'>

```yaml
packages:
  - git: "git@github.com:dbt-labs/dbt-utils.git" # git SSH URL
```

</File>

Если вы используете <Constant name="dbt_platform" />, метод с SSH-ключом не будет работать, но вы можете использовать [встроенную поддержку приватных пакетов](#native-private-packages) или [метод с токеном <Constant name="git" /> по HTTPS](/docs/build/packages#git-token-method).

### Метод Git-токена {#git-token-method}

:::note

[Нативная поддержка приватных пакетов](#native-private-packages) — рекомендуемый подход для GitHub, GitLab и Azure DevOps. Метод с использованием токена Git по-прежнему работает в <Constant name="core" />, <Constant name="fusion" /> и <Constant name="dbt_platform" />, но требует создания персонального токена доступа. Он остаётся поддерживаемым способом для пользователей <Constant name="core" />, которым необходимо клонирование по HTTPS.

:::

Этот метод позволяет пользователю клонировать через HTTPS, передавая git-токен через переменную окружения. Будьте осторожны с датой истечения срока действия любого токена, который вы используете, так как истекший токен может привести к сбою запланированного запуска. Кроме того, пользовательские токены могут создать проблему, если пользователь когда-либо потеряет доступ к конкретному репозиторию.

:::info Использование <Constant name="dbt" />
Если вы используете <Constant name="dbt" />, необходимо соблюдать соглашения об именовании переменных окружения. Переменные окружения в <Constant name="dbt" /> должны иметь префикс `DBT_` или `DBT_ENV_SECRET`. Имена переменных окружения записываются в верхнем регистре и чувствительны к регистру. При обращении к `{{env_var('DBT_KEY')}}` в коде вашего проекта имя должно в точности совпадать с именем переменной, заданным в пользовательском интерфейсе <Constant name="dbt" />.
:::

В GitHub:

<File name='packages.yml'>

```yaml
packages:
  # используйте этот формат при доступе к вашему репозиторию через токен приложения github
  - git: "https://{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git" # git HTTPS URL

  # используйте этот формат при доступе к вашему репозиторию через классический личный токен доступа
  - git: "https://{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git" # git HTTPS URL
 
   # используйте этот формат при доступе к вашему репозиторию через личный токен доступа с тонкой настройкой (иногда требуется имя пользователя)
  - git: "https://GITHUB_USERNAME:{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git" # git HTTPS URL
```

</File>

Подробнее о создании персонального токена доступа GitHub читайте [здесь](https://docs.github.com/en/enterprise-server@3.1/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token). Вы также можете использовать [токен](https://docs.github.com/en/rest/reference/apps#create-an-installation-access-token-for-an-app) установки приложения GitHub App.

В GitLab:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://{{env_var('DBT_USER_NAME')}}:{{env_var('DBT_ENV_SECRET_DEPLOY_TOKEN')}}@gitlab.example.com/dbt-labs/awesome_project.git" # git HTTPS URL
```

</File>

Подробнее о создании токена развертывания GitLab читайте [здесь](https://docs.gitlab.com/ee/user/project/deploy_tokens/#creating-a-deploy-token) и о том, как правильно построить ваш HTTPS URL [здесь](https://docs.gitlab.com/ee/user/project/deploy_tokens/#git-clone-a-repository). Токены развертывания могут управляться только Мейнтейнерами.

В Azure DevOps:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://{{env_var('DBT_ENV_SECRET_PERSONAL_ACCESS_TOKEN')}}@dev.azure.com/dbt-labs/awesome_project/_git/awesome_repo" # git HTTPS URL
```

</File>

Подробнее о создании личного токена доступа читайте [здесь](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat).

В Bitbucket:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://{{env_var('DBT_USER_NAME')}}:{{env_var('DBT_ENV_SECRET_PERSONAL_ACCESS_TOKEN')}}@bitbucketserver.com/scm/awesome_project/awesome_repo.git" # для Bitbucket Server
```

</File>

Подробнее о создании личного токена доступа читайте [здесь](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html).

## Настройка подкаталога для упакованных проектов {#configure-subdirectory-for-packaged-projects}

В общем случае, dbt ожидает, что `dbt_project.yml` будет расположен как файл верхнего уровня в пакете. Если упакованный проект вместо этого вложен в подкаталог — возможно, в рамках гораздо большего монорепозитория — вы можете опционально указать путь к папке как `subdirectory`. dbt попытается выполнить [разреженную проверку](https://git-scm.com/docs/git-sparse-checkout) только файлов, расположенных в этом подкаталоге. Обратите внимание, что вы должны использовать недавнюю версию `git` (`>=2.26.0`).

<File name='packages.yml'>

```yaml
packages:
  - git: "https://github.com/dbt-labs/dbt-labs-experimental-features" # git URL
    subdirectory: "materialized-views" # имя подкаталога, содержащего `dbt_project.yml`
```

</File>

### Local packages {#local-packages}
«Локальный» пакет — это dbt‑проект, доступный из вашей локальной файловой системы. Такие пакеты лучше всего подходят для случаев, когда у вас есть общий набор моделей и макросов, который вы хотите использовать в нескольких downstream‑проектах dbt (при этом каждый downstream‑проект всё равно имеет свои собственные уникальные модели, макросы и т.д.).

Вы можете устанавливать локальные пакеты, указав путь к проекту. Лучше всего это работает, когда проект размещён во вложенном подкаталоге относительно директории вашего текущего проекта.

<File name='packages.yml'>

```yaml
packages:
  - local: relative/path/to/subdirectory
```

</File>

Другие шаблоны могут работать в некоторых случаях, но не всегда. Например, если вы установите этот проект как пакет в другом месте или попытаетесь запустить его на другой системе, относительные и абсолютные пути дадут одинаковые результаты.

<File name='packages.yml'>

```yaml
packages:
  # не рекомендуется - поддержка этих шаблонов варьируется
  - local: /../../redshift   # относительный путь к родительскому каталогу
  - local: /opt/dbt/redshift # абсолютный путь на системе
```

</File>

Существуют несколько конкретных случаев использования, когда мы рекомендуем использовать "локальный" пакет:
1. **Монорепозиторий** &mdash; Когда у вас есть несколько проектов, каждый вложен в подкаталог, в рамках монорепозитория. "Локальные" пакеты позволяют объединять проекты для координированной разработки и развертывания.
2. **Тестирование изменений** &mdash; Чтобы протестировать изменения в одном проекте или пакете в контексте нисходящего проекта или пакета, который его использует. Временно переключив установку на "локальный" пакет, вы можете вносить изменения в первый и сразу тестировать их во втором для более быстрой итерации. Это похоже на [редактируемые установки](https://pip.pypa.io/en/stable/topics/local-project-installs/) в Python.
3. **Вложенный проект** &mdash; Когда у вас есть вложенный проект, который определяет фикстуры и тесты для проекта утилитарных макросов, как [интеграционные тесты в пакете `dbt-utils`](https://github.com/dbt-labs/dbt-utils/tree/main/integration_tests).

## Какие пакеты доступны? {#what-packages-are-available}
Чтобы посмотреть библиотеку опубликованных пакетов dbt, загляните в [dbt package hub](https://hub.getdbt.com)!

## Совместимость пакетов с dbt v2

import FusionSupportedPackages from '/snippets/_v2-supported-packages.md';

<FusionSupportedPackages />

<VersionBlock firstVersion="2.0">

## Поставка навыков агента в составе пакета

Пакет может предоставлять не только модели и макросы &mdash; он также может включать [навыки агента](/docs/dbt-ai/package-skills): многократно используемые инструкции, которые агент для работы с кодом читает из файла `SKILL.md`. Агент не знает, что ваши модели слоя staging используют префикс `stg_`, поэтому команды вынуждены копировать такие соглашения между репозиториями, где они со временем начинают различаться. Использование пакета делает навыки агента версионируемой зависимостью, как и всё остальное.

Добавьте в пакет каталог `skills`, и каждый проект, который устанавливает этот пакет, получит эти навыки при выполнении `dbt deps`, при условии что в устанавливающем проекте задан флаг `ai_provider`. Инструкции по настройке см. в разделе [Установка навыков агента из пакетов dbt](/docs/dbt-ai/package-skills).

</VersionBlock>

## Расширенная настройка пакетов
### Обновление пакета
Когда вы изменяете версию или ревизию в файле `packages.yml`, пакет в вашем проекте dbt не обновляется автоматически. Чтобы обновить пакет, выполните `dbt deps`. Также может потребоваться выполнить [полное обновление](/reference/commands/run) моделей из этого пакета.

### Закрепление пакетов {#uninstalling-a-package}

Начиная с версии v1.7, выполнение [`dbt deps`](/reference/commands/deps) "закрепляет" каждый пакет, создавая или обновляя файл `package-lock.yml` в _корне проекта_, где записан `packages.yml`.

Запуск [`dbt deps`](/reference/commands/deps) «закрепляет» каждую зависимость, создавая или обновляя файл `package-lock.yml` в _project_root_, где расположен `packages.yml`.

- Файл `package-lock.yml` содержит сведения обо всех установленных пакетах.
- Если при последующих запусках `dbt deps` файлы `dependencies.yml` или `packages.yml` не изменились, dbt устанавливает пакеты из `package-lock.yml`.

Начиная с версии v0.14.0, dbt предупредит вас, если вы установите пакет, используя синтаксис `git`, без указания ревизии (см. ниже).

dbt выдаст предупреждение, если вы устанавливаете пакет, используя синтаксис `git`, не указав ревизию (см. ниже).

### Configuring packages {#pinning-packages}
Вы можете настраивать модели и seeds в пакете из файла `dbt_project.yml`, например:

<File name='dbt_project.yml'>

```yml

vars:
  snowplow:
    'snowplow:timezone': 'America/New_York'
    'snowplow:page_ping_frequency': 10
    'snowplow:events': "{{ ref('sp_base_events') }}"
    'snowplow:context:web_page': "{{ ref('sp_base_web_page_context') }}"
    'snowplow:context:performance_timing': false
    'snowplow:context:useragent': false
    'snowplow:pass_through_columns': []

models:
  snowplow:
    +schema: snowplow

seeds:
  snowplow:
    +schema: snowplow_seeds
```

</File>

Например, при использовании пакета, специфичного для набора данных, вам может потребоваться настроить переменные для имен таблиц, содержащих ваши необработанные данные.

Конфигурации, заданные в YAML-файле вашего проекта (`dbt_project.yml`), будут переопределять любые конфигурации в пакете (как в YAML-файле проекта самого пакета, так и в блоках `config`).

### Указание незафиксированных Git-пакетов {#configuring-packages}
Если в вашем проекте указан «незафиксированный» пакет <Constant name="git" />, вы можете увидеть предупреждение вида:
```
Git-пакет "https://github.com/dbt-labs/dbt-utils.git" не закреплен.
Это может привести к внесению изменений, нарушающих работу вашего проекта, без предупреждения!
```

Это предупреждение можно отключить, установив `warn-unpinned: false` в спецификации пакета. **Примечание:** Это не рекомендуется.

<File name='packages.yml'>

```yaml
packages:
  - git: https://github.com/dbt-labs/dbt-utils.git
    warn-unpinned: false
```

</File>

## Troubleshooting

If you encounter errors while working with dbt packages, see the following FAQs:

<FAQ path="Troubleshooting/runtime-packages.yml" />
<FAQ path="Troubleshooting/dispatch-could-not-find-package" />


