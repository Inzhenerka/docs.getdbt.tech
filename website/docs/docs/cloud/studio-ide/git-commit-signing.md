---
title: "Подписание Git-коммитов"
description: "Узнайте, как подписывать Git-коммиты при использовании IDE для разработки."
sidebar_label: Git commit signing
---

# Подписание Git-коммитов <Lifecycle status="managed,managed_plus" /> {#git-commit-signing}

Чтобы предотвратить подмену личности и повысить безопасность, вы можете подписывать свои <Constant name="git" />-коммиты перед отправкой их в репозиторий. С помощью подписи <Constant name="git" />-провайдер может криптографически проверить коммит и пометить его как «verified», обеспечивая большую уверенность в его происхождении.

Вы можете настроить <Constant name="cloud" /> на подписание <Constant name="git" />-коммитов при использовании <Constant name="cloud_ide" /> для разработки. Для этого включите функцию в <Constant name="cloud" />, пройдите процесс генерации пары ключей и загрузите публичный ключ в ваш <Constant name="git" />-провайдер для проверки подписи.  


## Предварительные требования {#prerequisites}

- В качестве <Constant name="git" />-провайдера используется GitHub или GitLab. В настоящее время Azure DevOps не поддерживается.
- У вас есть аккаунт <Constant name="cloud" /> на тарифе [Enterprise или Enterprise+](https://www.getdbt.com/pricing/).

## Генерация пары ключей GPG в dbt {#generate-gpg-keypair-in-dbt}

Чтобы сгенерировать пару ключей GPG в <Constant name="cloud" />, выполните следующие шаги:
1. Перейдите на страницу **Personal profile** в <Constant name="cloud" />.
2. Откройте раздел **Signed Commits**.
3. Включите переключатель **Sign commits originating from this user**.
4. В результате будет сгенерирована пара ключей GPG. Приватный ключ будет использоваться для подписи всех будущих <Constant name="git" />-коммитов. Публичный ключ будет отображён, и вы сможете загрузить его в ваш <Constant name="git" />-провайдер.

<Lightbox src="/img/docs/dbt-cloud/example-git-signed-commits-setting.png" width="95%" title="Пример настройки профиля Signed commits" />

## Загрузка публичного ключа в Git-провайдер {#upload-public-key-to-git-provider}

Чтобы загрузить публичный ключ в ваш <Constant name="git" />-провайдер, следуйте подробной документации поддерживаемого <Constant name="git" />-провайдера:

- [Инструкции GitHub](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account) 
- [Инструкции GitLab](https://docs.gitlab.com/ee/user/project/repository/signed_commits/gpg.html) 

После загрузки публичного ключа в <Constant name="git" />-провайдер ваши <Constant name="git" />-коммиты будут помечаться как «Verified» после отправки изменений в репозиторий.

<Lightbox src="/img/docs/dbt-cloud/git-sign-verified.png" width="95%" title="Пример подтверждённого Git-коммита в Git-провайдере." />

## Важные моменты {#considerations}

- Пара ключей GPG привязана к пользователю, а не к конкретному аккаунту. Между пользователем и парой ключей существует отношение 1:1. Один и тот же ключ используется для подписи коммитов во всех аккаунтах, участником которых является пользователь.
- Пара ключей GPG, сгенерированная в <Constant name="cloud" />, связана с адресом электронной почты, указанным в вашем аккаунте на момент создания ключей. Этот email используется для идентификации автора подписанных коммитов.
- Чтобы <Constant name="git" />-коммиты помечались как «verified», адрес электронной почты <Constant name="cloud" /> должен быть подтверждённым адресом в вашем <Constant name="git" />-провайдере. <Constant name="git" />-провайдер (например, GitHub или GitLab) проверяет, совпадает ли email, указанный в подписи коммита, с подтверждённым email в аккаунте провайдера. Если они не совпадают, коммит не будет помечен как «verified».
- Поддерживайте синхронизацию email-адреса в <Constant name="cloud" /> и подтверждённого email в <Constant name="git" />-провайдере, чтобы избежать проблем с проверкой. Если вы меняете email в <Constant name="cloud" />:
  - Сгенерируйте новую пару ключей GPG с обновлённым email, следуя [описанным ранее шагам](/docs/cloud/studio-ide/git-commit-signing#generate-gpg-keypair-in-dbt-cloud).
  - Добавьте и подтвердите новый email в вашем <Constant name="git" />-провайдере.

<!-- vale off -->

## Часто задаваемые вопросы {#faqs}

<!-- vale on -->

<DetailsToggle alt_header="Что произойдёт, если я удалю свою пару ключей GPG в dbt?">

Если вы удалите пару ключей GPG в <Constant name="cloud" />, ваши Git-коммиты больше не будут подписываться. Вы можете сгенерировать новую пару ключей GPG, следуя [описанным ранее шагам](/docs/cloud/studio-ide/git-commit-signing#generate-gpg-keypair-in-dbt-cloud).
</DetailsToggle>

<DetailsToggle alt_header="Какие Git-провайдеры поддерживают GPG-ключи?">

GitHub и GitLab поддерживают подписание коммитов, в то время как Azure DevOps — нет. Подписание коммитов — это [функция git](https://git-scm.com/book/ms/v2/Git-Tools-Signing-Your-Work), независимая от конкретного провайдера. Однако не все провайдеры поддерживают загрузку публичных ключей или отображение значков проверки для коммитов.

</DetailsToggle>

<DetailsToggle alt_header="Что делать, если мой Git-провайдер не поддерживает GPG-ключи?">

Если ваш Git-провайдер явно не поддерживает загрузку публичных GPG-ключей, 
коммиты всё равно будут подписываться с использованием приватного ключа, 
но информация о проверке не будет отображаться у провайдера.

</DetailsToggle>

<DetailsToggle alt_header="Что делать, если Git-провайдер требует, чтобы все коммиты были подписаны?">

Если ваш Git-провайдер настроен на обязательную проверку коммитов, 
неподписанные коммиты будут отклоняться. Чтобы избежать этого, убедитесь, что вы выполнили все предыдущие шаги по генерации пары ключей 
и загрузили публичный ключ в провайдера.

</DetailsToggle>
