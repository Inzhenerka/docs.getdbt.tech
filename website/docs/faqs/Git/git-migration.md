---
title: "Как мигрировать провайдеры git"
sidebar_label: "Как мигрировать провайдеры git"
id: "git-migration"
hide_table_of_contents: true
description: "Узнайте, как мигрировать провайдеры git в dbt Cloud с минимальными перебоями."
tags: [Git]
---

Чтобы мигрировать с одного провайдера git на другой, выполните следующие шаги, чтобы минимизировать перебои:

1. Вне dbt Cloud вам нужно будет импортировать ваш существующий репозиторий в ваш новый провайдер. 

   Например, если вы мигрируете с GitHub на Azure DevOps, вам нужно будет импортировать ваш существующий репозиторий (GitHub) в ваш новый провайдер git (Azure DevOps). Для получения подробных шагов о том, как это сделать, обратитесь к документации вашего провайдера git (например, [GitHub](https://docs.github.com/en/migrations/importing-source-code/using-github-importer/importing-a-repository-with-github-importer), [GitLab](https://docs.gitlab.com/ee/user/project/import/repo_by_url.html), [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/repos/git/import-git-repository?view=azure-devops)) 

2. Вернитесь в dbt Cloud и настройте вашу [интеграцию с новым провайдером git](/docs/cloud/git/connect-github), если это необходимо. 
3. Отключите старый репозиторий в dbt Cloud, перейдя в **Настройки аккаунта**, а затем в **Проекты**. Нажмите на ссылку **Репозиторий**, затем нажмите **Изменить** и **Отключить**. 

   <Lightbox src="/img/docs/dbt-cloud/disconnect-repo.png" title="Отключите и повторно подключите ваш git репозиторий на страницах настроек вашего аккаунта dbt Cloud."/>

4. На той же странице подключитесь к новому репозиторию провайдера git, нажав **Настроить репозиторий**
   - Если вы используете нативную интеграцию, вам может потребоваться выполнить OAuth.

5. Вот и все, теперь вы должны быть подключены к новому провайдеру git! 🎉

Примечание &mdash; В качестве совета мы рекомендуем обновить страницу и IDE dbt Cloud перед выполнением любых действий.