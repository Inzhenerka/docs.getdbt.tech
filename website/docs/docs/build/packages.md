---
title: "Пакеты"
id: "packages"
description: "Пакеты dbt помогают модульно организовывать код и эффективно трансформировать данные."
keywords: [dbt package, private package, dbt private package, dbt data transformation, dbt clone, add dbt package]
---

Программисты часто модульно организуют код в библиотеки. Эти библиотеки помогают программистам работать более эффективно: они могут тратить больше времени на уникальную бизнес-логику и меньше времени на реализацию кода, который кто-то другой уже довел до совершенства.

В dbt такие библиотеки называются _пакетами_. Пакеты dbt настолько мощные, потому что многие аналитические проблемы, с которыми мы сталкиваемся, общие для разных организаций, например:
* преобразование данных из структурированного SaaS-набора данных, например:
  * преобразование просмотров страниц [Snowplow](https://hub.getdbt.com/dbt-labs/snowplow/latest/) или [Segment](https://hub.getdbt.com/dbt-labs/segment/latest/) в сессии
  * преобразование данных о расходах [AdWords](https://hub.getdbt.com/dbt-labs/adwords/latest/) или [Facebook Ads](https://hub.getdbt.com/dbt-labs/facebook_ads/latest/) в единый формат.
* написание макросов dbt, выполняющих аналогичные функции, например:
  * [генерация SQL](https://github.com/dbt-labs/dbt-utils#sql-helpers) для объединения двух отношений, поворота столбцов или создания <Term id="surrogate-key" />
  * создание [пользовательских тестов схем](https://github.com/dbt-labs/dbt-utils#schema-tests)
  * написание [аудиторских запросов](https://hub.getdbt.com/dbt-labs/audit_helper/latest/)
* создание моделей и макросов для конкретного инструмента, используемого в вашем стеке данных, например:
  * Модели для понимания привилегий [Redshift](https://hub.getdbt.com/dbt-labs/redshift/latest/).
  * Макросы для работы с данными, загруженными [Stitch](https://hub.getdbt.com/dbt-labs/stitch_utils/latest/).

Пакеты dbt на самом деле являются автономными проектами dbt, с моделями, макросами и другими ресурсами, которые решают конкретную проблему. Как пользователь dbt, добавляя пакет в свой проект, все ресурсы пакета станут частью вашего собственного проекта. Это означает:
* Модели в пакете будут материализованы, когда вы выполните `dbt run`.
* Вы можете использовать `ref` в своих моделях для ссылки на модели из пакета.
* Вы можете использовать `source` для ссылки на источники в пакете.
* Вы можете использовать макросы из пакета в своем собственном проекте.
* Важно отметить, что определение и установка пакетов dbt отличается от [определения и установки пакетов Python](/docs/build/python-models#using-pypi-packages).

import UseCaseInfo from '/snippets/_packages_or_dependencies.md';

<UseCaseInfo/>

## Как создать пакет?

Создание пакетов — это продвинутый сценарий использования dbt, однако на практике это может быть относительно простой задачей. Единственное строгое требование — наличие файла [`dbt_project.yml`](/reference/dbt_project.yml).

Наиболее распространённые сценарии использования пакетов:

- Распространение [models](/docs/build/models) для повторного использования в нескольких проектах.
- Распространение [macros](/docs/build/jinja-macros) для повторного использования в нескольких проектах.

Обратите внимание, что пакеты могут быть [приватными](#private-packages) — их не обязательно публиковать в открытом доступе. Приватные пакеты можно размещать в собственном Git‑провайдере (например, GitHub или GitLab).

Инструкции по созданию пакетов dbt и дополнительную информацию вы найдёте в нашем руководстве [Building dbt packages](/guides/building-packages?step=1).


## Как добавить пакет в проект?
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

## Как указать пакет?
Вы можете указать пакет, используя один из следующих методов, в зависимости от того, где хранится ваш пакет.

### Hub-пакеты (рекомендуется)

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

Продвинутые пользователи могут выбрать размещение внутренней версии hub-пакета на основе [этого репозитория](https://github.com/dbt-labs/hub.getdbt.com) и установку переменной окружения `DBT_PACKAGE_HUB_URL`.

#### Предрелизные версии

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

### Git-пакеты
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

### URL tarball, размещённый во внутренней инфраструктуре

В некоторых организациях существуют требования безопасности, согласно которым загрузка ресурсов допускается только из внутренних сервисов. Чтобы удовлетворить потребность в установке пакетов из размещённых сред, таких как Artifactory или облачные хранилища (cloud storage buckets), <Constant name="core" /> позволяет устанавливать пакеты из tarball-файлов, доступных по URL и размещённых во внутренней инфраструктуре.

Некоторые организации имеют требования безопасности, чтобы загружать ресурсы только из внутренних сервисов. Чтобы удовлетворить необходимость установки пакетов из размещенных сред, таких как Artifactory или облачные хранилища, dbt Core позволяет устанавливать пакеты из внутренне размещенных URL-адресов tarball.

```yaml
packages:
  - tarball: https://codeload.github.com/dbt-labs/dbt-utils/tar.gz/0.9.6
    name: 'dbt_utils'
```

Где `name: 'dbt_utils'` указывает подпапку `dbt_packages`, которая создается для установки исходного кода пакета.

## Приватные пакеты

### Нативные приватные пакеты <Lifecycle status='beta'/>

<Constant name="cloud" /> поддерживает приватные пакеты из [поддерживаемых](#prerequisites) репозиториев <Constant name="git" />, используя уже существующую [конфигурацию](/docs/cloud/git/git-configuration-in-dbt-cloud) в вашем окружении. Ранее для получения пакетов из приватных репозиториев требовалось настраивать [токен](#git-token-method).

#### Предварительные условия

- У вас должен быть включён соответствующий feature flag. Чтобы запросить доступ, обратитесь к вашей аккаунт-команде.
- Для использования нативных приватных пакетов у вас должен быть настроен один из следующих провайдеров <Constant name="git" /> в разделе **Integrations** в **Account settings**:
  - [GitHub](/docs/cloud/git/connect-github)
  - [Azure DevOps](/docs/cloud/git/connect-azure-devops)
    - Приватные пакеты работают только в рамках одного проекта Azure DevOps. Если ваши репозитории находятся в разных проектах внутри одной организации, в настоящий момент вы не сможете ссылаться на них с помощью ключа `private`.
    - Для Azure DevOps используйте путь вида `org/repo` (а не `org_name/project_name/repo_name`), при этом уровень проекта наследуется от подключённого исходного репозитория.
  - [Gitlab](/docs/cloud/git/connect-gitlab)
    - Каждый репозиторий Gitlab с приватными пакетами также должен быть проектом <Constant name="cloud" />.

#### Configuration

Используйте ключ `private` в файле `packages.yml` или `dependencies.yml`, чтобы клонировать репозитории пакетов через уже настроенную интеграцию <Constant name="cloud" /> с Git — без необходимости создавать access token или настраивать переменную окружения <Constant name="cloud" />.

<File name="packages.yml">

```yaml
packages:
  - private: dbt-labs/awesome_repo # your-org/your-repo path
  - package: normal packages
  [...]
```
</File>

:::tip Azure DevOps considerations

- В настоящее время приватные пакеты работают только в том случае, если репозиторий пакета находится в том же проекте Azure DevOps, что и исходный репозиторий.
- В ключе `private` необходимо использовать путь формата `org/repo` (а не стандартный для ADO путь `org_name/project_name/repo_name`).
- Репозитории, расположенные в разных проектах Azure DevOps, в данный момент не поддерживаются и будут доступны только в одном из будущих обновлений.

Вы можете использовать приватные пакеты, указав `org/repo` в ключе `private`:

<File name="packages.yml">

```yaml
packages:
  - private: my-org/my-repo # Works if your ADO source repo and package repo are in the same project
```
</File>
:::

Вы можете закреплять версии приватных пакетов так же, как и у обычных пакетов dbt:

```yaml
packages:
  - private: dbt-labs/awesome_repo
    revision: "0.9.5" # Закрепить на теге, ветке или полном 40-символьном хэше коммита
```

Если вы используете несколько интеграций <Constant name="git" /> или используете движок dbt Fusion, добавьте ключ провайдера:

```yaml
packages:
  - private: dbt-labs/awesome_repo
    provider: "github" # В настоящее время поддерживаются GitHub и Azure. Поддержка GitLab скоро появится.
```

С помощью этого метода вы можете получать приватные пакеты из интегрированного провайдера <Constant name="git" /> без каких‑либо дополнительных шагов по подключению.

Использование `provider` вместе с Fusion предполагает, что на вашей машине настроен SSH‑ключ, который будет использоваться для клонирования репозиториев git.

### Метод SSH-ключа (только командная строка)
Если вы используете командную строку, приватные пакеты могут быть клонированы через SSH и SSH-ключ.

Когда вы используете SSH-ключи для аутентификации на вашем удаленном сервере git, вам не нужно вводить ваше имя пользователя и пароль каждый раз. Подробнее о SSH-ключах, как их сгенерировать и как добавить их в ваш git-провайдер, читайте здесь: [Github](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) и [GitLab](https://docs.gitlab.com/ee/user/ssh.html).

<File name='packages.yml'>

```yaml
packages:
  - git: "git@github.com:dbt-labs/dbt-utils.git" # git SSH URL
```

</File>

Если вы используете <Constant name="dbt_platform" />, метод с SSH‑ключом работать не будет, но вы можете использовать [метод HTTPS с <Constant name="git" />‑токеном](/docs/build/packages#git-token-method).

### Метод Git-токена

:::note

<Constant name="cloud" /> имеет [нативную поддержку](#native-private-packages) приватных пакетов <Constant name="git" />, размещённых в GitHub и Azure DevOps (поддержка GitLab появится в ближайшее время). Если вы используете поддерживаемую [интегрированную среду <Constant name="git" />](/docs/cloud/git/git-configuration-in-dbt-cloud), вам больше не нужно настраивать токены <Constant name="git" /> для получения приватных пакетов.

:::

Этот метод позволяет пользователю клонировать через HTTPS, передавая git-токен через переменную окружения. Будьте осторожны с датой истечения срока действия любого токена, который вы используете, так как истекший токен может привести к сбою запланированного запуска. Кроме того, пользовательские токены могут создать проблему, если пользователь когда-либо потеряет доступ к конкретному репозиторию.

:::info <Constant name="cloud" /> usage
Если вы используете <Constant name="cloud" />, необходимо соблюдать соглашения об именовании переменных окружения. Переменные окружения в <Constant name="cloud" /> должны иметь префикс `DBT_` или `DBT_ENV_SECRET`. Ключи переменных окружения пишутся в верхнем регистре и чувствительны к регистру. При обращении к `{{env_var('DBT_KEY')}}` в коде вашего проекта ключ должен **точно** совпадать с переменной, определённой в интерфейсе <Constant name="cloud" />.
:::
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

Подробнее о создании личного токена доступа GitHub читайте [здесь](https://docs.github.com/en/enterprise-server@3.1/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token). Вы также можете использовать токен установки приложения GitHub [здесь](https://docs.github.com/en/rest/reference/apps#create-an-installation-access-token-for-an-app).

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

## Настройка подкаталога для упакованных проектов

В общем случае, dbt ожидает, что `dbt_project.yml` будет расположен как файл верхнего уровня в пакете. Если упакованный проект вместо этого вложен в подкаталог — возможно, в рамках гораздо большего монорепозитория — вы можете опционально указать путь к папке как `subdirectory`. dbt попытается выполнить [разреженную проверку](https://git-scm.com/docs/git-sparse-checkout) только файлов, расположенных в этом подкаталоге. Обратите внимание, что вы должны использовать недавнюю версию `git` (`>=2.26.0`).

<File name='packages.yml'>

```yaml
packages:
  - git: "https://github.com/dbt-labs/dbt-labs-experimental-features" # git URL
    subdirectory: "materialized-views" # имя подкаталога, содержащего `dbt_project.yml`
```

</File>

### Local packages
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

## Какие пакеты доступны?
Чтобы посмотреть библиотеку опубликованных пакетов dbt, загляните в [dbt package hub](https://hub.getdbt.com)!

## Совместимость пакетов с Fusion

import FusionSupportedPackages from '/snippets/_fusion-supported-packages.md';

<FusionSupportedPackages />

### Удаление пакета
Когда вы удаляете пакет из вашего файла `packages.yml`, он не удаляется автоматически из вашего проекта dbt, так как он все еще существует в вашей директории `dbt_packages/`. Если вы хотите полностью удалить пакет, вам следует либо:
* удалить директорию пакета в `dbt_packages/`; или
* запустить `dbt clean`, чтобы удалить _все_ пакеты (и любые скомпилированные модели), а затем `dbt deps`.

### Закрепление пакетов

Начиная с версии v1.7, выполнение [`dbt deps`](/reference/commands/deps) "закрепляет" каждый пакет, создавая или обновляя файл `package-lock.yml` в _корне проекта_, где записан `packages.yml`.

Запуск [`dbt deps`](/reference/commands/deps) «закрепляет» каждую зависимость, создавая или обновляя файл `package-lock.yml` в _project_root_, где расположен `packages.yml`.

Например, если вы используете имя ветки, файл `package-lock.yml` закрепляет на коммите head. Если вы используете диапазон версий, он закрепляет на последнем релизе. В любом случае, последующие коммиты или версии **не** будут установлены. Чтобы получить новые коммиты или версии, выполните `dbt deps --upgrade` или добавьте `package-lock.yml` в ваш .gitignore файл.

Начиная с версии v0.14.0, dbt предупредит вас, если вы установите пакет, используя синтаксис `git`, без указания ревизии (см. ниже).

dbt выдаст предупреждение, если вы устанавливаете пакет, используя синтаксис `git`, не указав ревизию (см. ниже).

### Configuring packages
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

Конфигурации, сделанные в вашем файле `dbt_project.yml`, переопределят любые конфигурации в пакете (либо в файле `dbt_project.yml` пакета, либо в блоках конфигурации).

### Указание незафиксированных Git-пакетов
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
