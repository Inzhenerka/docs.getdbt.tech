---
title: "Подключение к управляемому репозиторию"
id: "managed-repository"
description: "Узнайте, как настроить проект с управляемым репозиторием."
pagination_next: "docs/cloud/git/import-a-project-by-git-url"
pagination_prev: "docs/cloud/git/git-configuration-in-dbt-cloud"
---

Управляемые репозитории — это отличный способ попробовать dbt без необходимости создавать новый репозиторий. Если у вас ещё нет репозитория <Constant name="git" /> для вашего dbt‑проекта, вы можете позволить <Constant name="cloud" /> разместить и управлять репозиторием за вас. 

Если в будущем вы решите разместить этот репозиторий в другом месте, вы в любой момент сможете экспортировать данные из <Constant name="cloud" />. Подробнее о том, как это сделать, см. [Move from a managed repository to a self-hosted repository](/faqs/Git/managed-repo).

:::info
dbt Labs не рекомендует использовать управляемый репозиторий в production‑окружении. Вы не сможете использовать возможности <Constant name="git" />, такие как pull request’ы, которые являются частью рекомендуемых лучших практик управления версиями.
:::

Чтобы настроить проект с управляемым репозиторием:

1. В **Account settings** в <Constant name="cloud" /> выберите проект, для которого вы хотите настроить управляемый репозиторий. Если для проекта уже настроен репозиторий, необходимо отредактировать настройки репозитория и отключить существующий репозиторий.
2. Нажмите **Edit** для проекта.
3. В разделе Repository нажмите **Configure repository**.
4. Выберите **Managed**.
5. Введите имя репозитория. Например, "analytics" или "dbt-models".
6. Нажмите **Create**.
   <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/managed-repo.png" title="Добавление управляемого репозитория"/>

## Загрузка управляемого репозитория

Чтобы скачать копию вашего управляемого репозитория из <Constant name="cloud" /> на локальный компьютер:

1. Используйте селектор **Project** в главном левом меню, чтобы перейти к проекту, использующему управляемый репозиторий.
2. В главном левом меню нажмите **Dashboard**.
3. На дашборде нажмите **Settings**.
4. Найдите поле **Repository** и нажмите на гиперссылку репозитория.
5. Под полем **Deploy key** вы найдёте опцию **Download repository**. Нажмите кнопку, чтобы скачать репозиторий. Если вы не видите эту опцию, значит, вам либо не назначен [permission set](/docs/cloud/manage-access/enterprise-permissions#account-permissions) с доступом `write` к Git‑репозиториям, либо у вашего проекта нет управляемого репозитория.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/download-managed-repo.png" size="60%" title="Кнопка загрузки для управляемого репозитория." />
