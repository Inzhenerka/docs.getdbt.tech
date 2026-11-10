---
title: "Подключение с помощью Git clone"
description: "Узнайте, как подключиться к репозиторию git с помощью git URL."
availability:
  surface: platform
  access: login_required
---

В <Constant name="dbt" /> можно импортировать репозиторий git по любому корректному git URL, который указывает на проект dbt. При этом следует учитывать несколько важных моментов.

## Протоколы Git

Используйте SSH URL для клонирования репозитория. dbt поддерживает оба распространённых формата SSH:

- `git@github.com:organization/repo-name.git`
- `ssh://git@github.com/organization/repo-name.git`

Не используйте `https://...` и другие HTTP URL. dbt клонирует репозитории по SSH и не может клонировать репозитории, использующие протокол HTTP.

### Преобразование SSH URL в ssh:// {#converting-ssh-urls-to-ssh}

Git-провайдеры часто показывают SSH URL для клонирования в формате SCP — с двоеточием между хостом и путём к репозиторию (обычно в разделе **Code** -> **Clone** -> **SSH**).

Пример формата SCP с двоеточием:

```
git@github.com:organization/repo-name.git
user@custom-host.example.com:organization/repo-name.git
```

Если вы предпочитаете URL вида `ssh://`, его можно преобразовать следующим образом. В эквивалентном формате ssh:// после хоста используется косая черта:

```
ssh://git@github.com/organization/repo-name.git
ssh://user@custom-host.example.com/organization/repo-name.git
```

import GitProvidersCI from '/snippets/_git-providers-supporting-ci.md';

<GitProvidersCI />

## Управление ключами развёртывания

После импорта проекта по URL <Constant name="git" /> платформа <Constant name="dbt" /> создаст ключ развёртывания (Deploy Key) для вашего репозитория. Чтобы найти ключ развёртывания в <Constant name="dbt" />:

1. В <Constant name="dbt" /> нажмите на название своей учётной записи в левом боковом меню и выберите **Account settings**.
2. Перейдите в раздел **Projects** и выберите проект.
3. Нажмите ссылку **Repository**, чтобы открыть страницу сведений о репозитории.
4. Скопируйте ключ из раздела **Deploy Key**.

Этот ключ развёртывания необходимо добавить в настройки репозитория у вашего <Constant name="git" />-провайдера. Настройте для этого ключа _доступ на чтение и запись_ к указанным репозиториям.

**Примечание**: Для каждого проекта <Constant name="dbt" /> при подключении к репозиторию создаётся отдельный ключ развёртывания, даже если два проекта подключены к одному репозиторию. Вам потребуется добавить оба ключа развёртывания у вашего <Constant name="git" />-провайдера.

## Устранение ошибок клонирования {#troubleshooting-clone-errors}
Если <Constant name="dbt" /> не может клонировать репозиторий после его подключения по git URL, обычно причина в одном из следующих обстоятельств:

- **Некорректный URL**: Убедитесь, что путь к репозиторию указан верно, репозиторий существует и вы используете SSH URL для клонирования (`git@...` или `ssh://...`). Не используйте `https://...` и другие HTTP URL.
- **Ваш git-провайдер недоступен**: Проверьте страницу состояния вашего провайдера (например, GitHub, GitLab, Bitbucket, Azure DevOps) и повторите попытку после восстановления работы сервиса.
- **Неверно настроен доступ по SSH**: Убедитесь, что ключ развёртывания, созданный <Constant name="dbt" />, добавлен в репозиторий с необходимыми правами доступа (включая доступ на запись, если он требуется). Если ваша организация ограничивает использование SSH-ключей, согласуйте с администраторами разрешение на использование ключей развёртывания для репозитория.

Если подключиться по-прежнему не удаётся, [обратитесь в службу поддержки dbt](mailto:support@getdbt.com) и укажите URL репозитория, который вы используете, а также время возникновения ошибки.

## GitHub

:::info Используете GitHub?

Если вы используете GitHub, можно импортировать репозиторий напрямую с помощью [приложения GitHub для <Constant name="dbt" />](/docs/platform/git/connect-github). Подключение репозитория через приложение GitHub [позволяет использовать непрерывную интеграцию](/docs/deploy/continuous-integration).

:::

### Найдите свой SSH URL

1. Перейдите в свой репозиторий на GitHub.
2. Нажмите кнопку **Code**.
3. Выберите вкладку **SSH**, чтобы увидеть SSH URL для клонирования.
4. Скопируйте URL со вкладки **SSH**. Поддерживаются URL как в формате SCP (`git@...`), так и в формате `ssh://...`. Если вам нужен формат `ssh://`, см. раздел [Преобразование SSH URL в ssh://](#converting-ssh-urls-to-ssh).

### Добавьте ключ развёртывания

Чтобы добавить ключ развёртывания в учётную запись GitHub, перейдите на вкладку Deploy keys на странице настроек вашего репозитория GitHub.
- Укажите имя ключа развёртывания и вставьте ключ, созданный <Constant name="dbt" />, затем обязательно установите флажок **Allow write access**.
- После добавления этого ключа <Constant name="dbt" /> сможет читать и записывать файлы в вашем проекте dbt.
- См. [Добавление ключа развёртывания в GitHub](https://github.blog/2015-06-16-read-only-deploy-keys/)

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/cd7351c-Screen_Shot_2019-10-16_at_1.09.41_PM.png" title="Настройка ключа развёртывания GitHub"/>

## GitLab

:::info Используете GitLab?

Если вы используете GitLab, можно импортировать репозиторий напрямую с помощью [приложения GitLab для <Constant name="dbt" />](/docs/platform/git/connect-gitlab). Подключение репозитория через приложение GitLab [позволяет использовать непрерывную интеграцию](/docs/deploy/continuous-integration).

:::

- Чтобы добавить ключ развёртывания в учётную запись GitLab, перейдите на вкладку [SSH keys](https://gitlab.com/profile/keys) на странице User Settings вашей учётной записи GitLab.
- Затем вставьте ключ развёртывания, созданный <Constant name="dbt" /> для вашего репозитория.
- После сохранения этого SSH-ключа <Constant name="dbt" /> сможет читать и записывать файлы в вашем репозитории GitLab.
- См. [Добавление ключа развёртывания только для чтения в GitLab](https://docs.gitlab.com/ee/user/project/deploy_keys/)

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/f3ea88d-Screen_Shot_2019-10-16_at_4.45.50_PM.png" title="Настройка SSH-ключа GitLab"/>

## BitBucket

Используйте ключ развёртывания для импорта репозитория BitBucket в <Constant name="dbt" />. Для обеспечения безопасности учётной записи используйте служебную учётную запись, чтобы добавить ключ развёртывания BitBucket и поддерживать соединение между вашим репозиторием BitBucket и <Constant name="dbt" />.

BitBucket связывает каждый коммит в репозитории и другие действия <Constant name="git" /> (например, создание пул-реквеста) с адресом электронной почты, указанным в учётной записи пользователя BitBucket.

Чтобы добавить ключ развёртывания в учётную запись BitBucket:

- Перейдите на вкладку **SSH keys** на странице Personal Settings вашей учётной записи BitBucket.
- Затем нажмите кнопку **Add key** и вставьте ключ развёртывания, созданный <Constant name="dbt" /> для вашего репозитория.
- После сохранения этого SSH-ключа <Constant name="dbt" /> сможет читать и записывать файлы в вашем репозитории BitBucket.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/bitbucket-ssh-key.png" title="Настройка SSH-ключа BitBucket"/>

## AWS CodeCommit

<Constant name="dbt" /> может работать с проектами dbt, размещёнными в AWS CodeCommit, но по сравнению с GitHub или другими git-провайдерами потребуется выполнить несколько дополнительных шагов. Это руководство поможет подключить ваш проект dbt, размещённый в CodeCommit, к <Constant name="dbt" />.

#### Шаг 1: Создайте пользователя AWS для dbt
- Чтобы предоставить <Constant name="dbt" /> доступ к вашему репозиторию, сначала необходимо создать пользователя AWS IAM для <Constant name="dbt" />.
- Войдите в консоль AWS и перейдите в раздел IAM.
- Нажмите **Add User** и создайте нового пользователя, указав уникальное и понятное имя.
- Пользователю потребуется право клонировать ваш репозиторий. Для этого во время настройки можно добавить разрешение **AWSCodeCommitPowerUser**.

#### Шаг 2: Импортируйте репозиторий по имени
- Откройте консоль AWS CodeCommit и выберите свой репозиторий.
- Скопируйте SSH URL с этой страницы.
- Затем перейдите на страницу **New Repository** в <Constant name="dbt" />.
- Выберите вкладку **<Constant name="git" /> Clone** и вставьте SSH URL, скопированный из консоли.
- На открывшейся странице сведений о созданном репозитории вы увидите поле **Deploy Key**.
- Скопируйте содержимое этого поля: оно понадобится на [шаге 3](#step-3-grant-dbt-cloud-aws-user-access).

**Примечание:** На следующем шаге можно использовать только открытый ключ, созданный <Constant name="dbt" />. Любой другой ключ, созданный вне <Constant name="dbt" />, не подойдёт.

#### Шаг 3: Предоставьте доступ пользователю AWS для dbt {#step-3-grant-dbt-cloud-aws-user-access}
- Откройте только что созданного пользователя <Constant name="dbt" /> в консоли AWS IAM.
- Выберите вкладку **Security Credentials**, затем нажмите **Upload SSH public key**.
- Вставьте содержимое поля **Public Key** со страницы Repository в <Constant name="dbt" />.
- После создания ключа вы увидите его **SSH key ID**.
- **[Обратитесь в службу поддержки dbt](mailto:support@getdbt.com)** и передайте значение этого поля, чтобы специалисты службы поддержки dbt могли завершить настройку.

#### Шаг 4: Укажите пользовательскую ветку в dbt

CodeCommit использует `master` в качестве ветки по умолчанию. Для инициализации проекта необходимо указать ветку `master` как [пользовательскую ветку](/faqs/Environments/custom-branch-settings#development) в <Constant name="dbt" />.

- Перейдите в **Deploy** -> **Environments** -> **Development**.
- Выберите **Settings** -> **Edit** и в разделе **General Settings** установите флажок **Default to a custom branch**.
- Укажите `master` в качестве пользовательской ветки и нажмите **Save**.

#### Шаг 5: Настройте URL шаблона пул-реквеста (необязательно) {#step-5-configure-pull-request-template-urls-optional}

Чтобы пользователи не могли напрямую сливать изменения кода в ветку по умолчанию, настройте [PR Template URL](/docs/platform/git/pr-template) на странице **Repository details** вашего проекта. После настройки <Constant name="dbt" /> будет предлагать пользователям открыть новый пул-реквест после коммита и синхронизации изменений кода в ветке в <Constant name="studio_ide" />, прежде чем сливать какие-либо изменения в ветку по умолчанию.

- Перейдите в **Account Settings** -> **Projects** -> выберите проект.
- Нажмите ссылку на репозиторий в разделе **Repository**.
- На странице **Repository details** нажмите **Edit** в правом нижнем углу.
  <Lightbox src="/img/docs/collaborate/repo-details.jpg" width="80%" title="Настройка шаблона пул-реквеста на странице 'Repository details'." />
- В поле **Pull request URL** укажите URL в соответствии с предложенным [форматом шаблона пул-реквеста](/docs/platform/git/pr-template#aws-codecommit).
- Замените `<repo>` именем вашего репозитория (обратите внимание, что регистр имеет значение). В следующем примере репозиторий называется `New_Repo`.
  <Lightbox src="/img/docs/collaborate/pr-template-example.jpg" width="60%" title="В примере поля Pull request URL имя репозитория — 'New_Repo'." />
- Заполнив поле **Pull request URL**, нажмите **Save**.

🎉 **Всё готово!** Когда служба поддержки dbt обработает ваш запрос и вы зададите пользовательскую ветку, ваш проект будет готов к выполнению запусков dbt в <Constant name="dbt" />.

## Azure DevOps
:::info Используете Azure DevOps?

Если вы используете Azure DevOps и тариф <Constant name="dbt" /> Enterprise или Enterprise+, можно импортировать репозиторий напрямую с помощью [интеграции Azure DevOps для <Constant name="dbt" />](/docs/platform/git/connect-azure-devops). Подключение репозитория через приложение Azure DevOps [позволяет использовать непрерывную интеграцию](/docs/deploy/continuous-integration).

:::

1. Чтобы добавить ключ развёртывания в учётную запись Azure DevOps, перейдите на страницу **SSH public keys** в разделе User Settings вашей пользовательской или служебной учётной записи Azure DevOps.

2. Рекомендуем использовать для интеграции отдельную служебную учётную запись, чтобы изменения прав пользователей не прерывали соединение <Constant name="dbt" /> с Azure DevOps.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/52bfdaa-Screen_Shot_2020-03-09_at_4.13.20_PM.png" title="Перейдите на страницу настроек 'SSH public keys'" />

3. Затем нажмите кнопку **+ New Key**, чтобы создать новый SSH-ключ для репозитория.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/6d8e980-Screen_Shot_2020-03-09_at_4.13.27_PM.png" title="Нажмите кнопку '+ New Key', чтобы создать новый SSH-ключ для репозитория." />

4. Выберите понятное имя для ключа, затем вставьте ключ развёртывания, созданный <Constant name="dbt" /> для вашего репозитория.

5. После сохранения этого SSH-ключа <Constant name="dbt" /> сможет читать и записывать файлы в вашем репозитории Azure DevOps.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/d19f199-Screen_Shot_2020-03-09_at_4.13.50_PM.png" title="Введите и сохраните открытый ключ, созданный dbt для вашего репозитория" />

## Другие git-провайдеры

Не нашли здесь своего git-провайдера? [Обратитесь в службу поддержки dbt](mailto:support@getdbt.com). Мы будем рады помочь вам настроить <Constant name="dbt" /> для работы с любым поддерживаемым git-провайдером.

## Ограниченная интеграция {#limited-integration}
Для некоторых функций <Constant name="dbt" /> требуется тесная интеграция с вашим git-хостингом, например для обновления пул-реквестов GitHub статусами запусков <Constant name="dbt" />. При импорте проекта по URL эти функции недоступны. После предоставления <Constant name="dbt" /> доступа к репозиторию можно продолжить настройку проекта: добавить подключение, создать и запустить своё первое задание <Constant name="dbt" />.

## Часто задаваемые вопросы
<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>
