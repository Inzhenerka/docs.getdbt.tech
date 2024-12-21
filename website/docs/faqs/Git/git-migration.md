---
title: "Как мигрировать между git-провайдерами"
sidebar_label: "Как мигрировать между git-провайдерами"
id: "git-migration"
hide_table_of_contents: true
description: "Узнайте, как мигрировать между git-провайдерами в dbt Cloud с минимальными перебоями."
tags: [Git]
---

Чтобы мигрировать от одного git-провайдера к другому, следуйте следующим шагам, чтобы избежать минимальных перебоев:

1. Вне dbt Cloud вам нужно будет импортировать ваш существующий репозиторий в нового провайдера.

   Например, если вы мигрируете с GitHub на Azure DevOps, вам нужно будет импортировать ваш существующий репозиторий (GitHub) в нового git-провайдера (Azure DevOps). Для получения подробных шагов о том, как это сделать, обратитесь к документации вашего git-провайдера (например, [GitHub](https://docs.github.com/en/migrations/importing-source-code/using-github-importer/importing-a-repository-with-github-importer), [GitLab](https://docs.gitlab.com/ee/user/project/import/repo_by_url.html), [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/repos/git/import-git-repository?view=azure-devops)).

2. Вернитесь в dbt Cloud и настройте [интеграцию для нового git-провайдера](/docs/cloud/git/connect-github), если это необходимо.
3. Отключите старый репозиторий в dbt Cloud, перейдя в **Настройки аккаунта**, затем **Проекты**. Нажмите на ссылку **Репозиторий**, затем нажмите **Редактировать** и **Отключить**.

   <Lightbox src="/img/docs/dbt-cloud/disconnect-repo.png" title="Отключите и подключите ваш git-репозиторий на страницах настроек аккаунта dbt Cloud."/>

4. На той же странице подключитесь к новому репозиторию git-провайдера, нажав **Настроить репозиторий**.
   - Если вы используете нативную интеграцию, возможно, вам потребуется выполнить OAuth.

5. Готово, теперь вы должны быть подключены к новому git-провайдеру! 🎉

Примечание &mdash; В качестве совета, мы рекомендуем обновить вашу страницу и dbt Cloud IDE перед выполнением любых действий.