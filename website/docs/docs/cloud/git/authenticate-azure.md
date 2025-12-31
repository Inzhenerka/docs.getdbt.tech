---
title: "Аутентификация с помощью Azure DevOps"
id: "authenticate-azure"
description: "Разработчикам dbt необходимо аутентифицироваться с помощью Azure DevOps."
sidebar_label: "Аутентификация с Azure DevOps"
pagination_next: null
---


Если вы используете <Constant name="cloud_ide" /> или CLI <Constant name="cloud" /> для совместной работы с репозиторием dbt вашей команды в Azure DevOps, вам необходимо [связать ваш профиль <Constant name="cloud" /> с Azure DevOps](#link-your-dbt-profile-to-azure-devops). Это обеспечивает дополнительный уровень аутентификации.

## Связь профиля dbt с Azure DevOps {#link-your-dbt-profile-to-azure-devops}

Подключите ваш профиль <Constant name="cloud" /> к Azure DevOps с помощью OAuth:

1. Нажмите на имя вашей учетной записи внизу левого меню и выберите **Account settings**
2. Прокрутите страницу вниз до раздела **Your profile** и выберите **Personal profile**.
3. Перейдите в раздел **Linked accounts** в середине страницы.
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/LinktoAzure.png" title="Экран авторизации Azure DevOps"/>

4. После перенаправления в Azure DevOps войдите в свою учетную запись.
5. Когда вы увидите экран запроса разрешений от приложения Azure DevOps, нажмите **Accept**.
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Экран авторизации Azure DevOps"/>

После этого вы будете перенаправлены обратно в <Constant name="cloud" />, и ваш профиль будет связан. Теперь вы готовы к разработке в <Constant name="cloud" />!

## Часто задаваемые вопросы (FAQ) {#faqs}

<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>
