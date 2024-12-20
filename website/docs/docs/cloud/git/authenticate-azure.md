---
title: "Аутентификация с Azure DevOps"
id: "authenticate-azure"
description: "Разработчикам dbt Cloud необходимо аутентифицироваться с Azure DevOps."
sidebar_label: "Аутентификация с Azure DevOps"
pagination_next: null
---

Если вы используете dbt Cloud IDE или dbt Cloud CLI для совместной работы над репозиторием dbt вашей команды в Azure DevOps, вам необходимо [связать ваш профиль dbt Cloud с Azure DevOps](#link-your-dbt-cloud-profile-to-azure-devops), что обеспечивает дополнительный уровень аутентификации.

## Свяжите ваш профиль dbt Cloud с Azure DevOps

Подключите ваш профиль dbt Cloud к Azure DevOps с помощью OAuth:

1. Нажмите на имя вашей учетной записи в нижней части левого меню и выберите **Настройки учетной записи**.
2. Прокрутите вниз до **Ваш профиль** и выберите **Личный профиль**.
3. Перейдите в раздел **Связанные учетные записи** в середине страницы.
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/LinktoAzure.png" title="Экран авторизации Azure DevOps"/>

4. После перенаправления в Azure DevOps войдите в свою учетную запись.
5. Когда вы увидите экран запроса разрешений от приложения Azure DevOps, нажмите **Принять**.
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Экран авторизации Azure DevOps"/>

Вы будете перенаправлены обратно в dbt Cloud, и ваш профиль должен быть связан. Теперь вы готовы к разработке в dbt Cloud!

## Часто задаваемые вопросы

<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>