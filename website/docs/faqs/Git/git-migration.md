---
title: "Как мигрировать между git-провайдерами"
sidebar_label: "Как мигрировать между git-провайдерами"
id: "git-migration"
hide_table_of_contents: true
description: "Узнайте, как мигрировать git‑провайдеров в dbt с минимальными перебоями."
tags: [Git]
---

Чтобы мигрировать от одного git-провайдера к другому, следуйте следующим шагам, чтобы избежать минимальных перебоев:

1. За пределами <Constant name="dbt" /> вам потребуется импортировать существующий репозиторий в новый сервис хостинга репозиториев. По умолчанию подключение репозитория в одной учетной записи не приводит к его автоматическому отключению от другой учетной записи.
   
   Например, если вы мигрируете с GitHub на Azure DevOps, вам нужно импортировать существующий репозиторий (GitHub) в нового провайдера <Constant name="git" /> (Azure DevOps). Подробные инструкции по выполнению этой операции смотрите в документации вашего провайдера <Constant name="git" /> (например, [GitHub](https://docs.github.com/en/migrations/importing-source-code/using-github-importer/importing-a-repository-with-github-importer), [GitLab](https://docs.gitlab.com/ee/user/project/import/repo_by_url.html), [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/repos/git/import-git-repository?view=azure-devops)). 
   
2. Вернитесь в <Constant name="dbt" /> и при необходимости настройте [интеграцию с новым провайдером <Constant name="git" />](/docs/platform/git/configure-git). 
3. Отключите старый репозиторий в <Constant name="dbt" />, перейдя в **Account Settings**, а затем в **Projects**.
4. Нажмите ссылку **Repository**, затем нажмите **Edit** и **Disconnect**.
      <Lightbox src="/img/docs/dbt-platform/disconnect-repo.png" width="80%" title="Отключение и повторное подключение Git-репозитория на странице настроек аккаунта dbt."/>

5. Нажмите **Confirm Disconnect**.  
6. На той же странице подключите репозиторий нового провайдера <Constant name="git" />, нажав **Configure Repository**.
   - Если вы используете нативную интеграцию, может потребоваться пройти OAuth-авторизацию.
  
7. Готово! Теперь вы подключены к новому провайдеру <Constant name="git" />! 🎉

Примечание &mdash; Рекомендуем обновить страницу и <Constant name="studio_ide" /> перед выполнением любых действий.
