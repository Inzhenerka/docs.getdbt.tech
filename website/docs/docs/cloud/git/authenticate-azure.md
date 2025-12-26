---
title: "Аутентификация с Azure DevOps"
id: "authenticate-azure"
description: "Разработчикам dbt необходимо аутентифицироваться в Azure DevOps."
sidebar_label: "Аутентификация в Azure DevOps"
pagination_next: null
---

Если вы используете dbt Cloud IDE или dbt Cloud CLI для совместной работы над репозиторием dbt вашей команды в Azure DevOps, вам необходимо [связать ваш профиль dbt Cloud с Azure DevOps](#link-your-dbt-cloud-profile-to-azure-devops), что обеспечивает дополнительный уровень аутентификации.

Если вы используете CLI <Constant name="cloud_ide" /> или <Constant name="cloud" /> для совместной работы с репозиторием dbt вашей команды в Azure DevOps, вам необходимо [связать профиль <Constant name="cloud" /> с Azure DevOps](#link-your-dbt-cloud-profile-to-azure-devops). Это обеспечивает дополнительный уровень аутентификации.

## Свяжите профиль dbt с Azure DevOps

Подключите профиль <Constant name="cloud" /> к Azure DevOps с помощью OAuth:

4. После перенаправления в Azure DevOps войдите в свою учетную запись.
5. Когда вы увидите экран запроса разрешений от приложения Azure DevOps, нажмите **Принять**.
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Экран авторизации Azure DevOps"/>

Вы будете перенаправлены обратно в dbt Cloud, и ваш профиль должен быть связан. Теперь вы готовы к разработке в dbt Cloud!

Вы будете перенаправлены обратно в <Constant name="cloud" />, и ваш профиль должен быть привязан. Теперь вы готовы разрабатывать в <Constant name="cloud" />!

## FAQs

<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>