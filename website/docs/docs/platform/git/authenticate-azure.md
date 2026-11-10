---
title: "Аутентификация в Azure DevOps"
id: "authenticate-azure"
description: "Разработчикам dbt необходимо пройти аутентификацию в Azure DevOps."
sidebar_label: "Аутентификация в Azure DevOps"
pagination_next: null
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---


Если вы используете <Constant name="studio_ide" /> или <Constant name="dbt" /> CLI для совместной работы с dbt-репозиторием вашей команды в Azure DevOps, вам необходимо [связать свой профиль <Constant name="dbt" /> с Azure DevOps](#link-your-dbt-profile-to-azure-devops). Это обеспечивает дополнительный уровень аутентификации.

## Связывание профиля dbt с Azure DevOps {#link-your-dbt-profile-to-azure-devops}

Подключите свой профиль <Constant name="dbt" /> к Azure DevOps с помощью OAuth:

1. Нажмите на имя своей учётной записи в нижней части левого меню и выберите **Account settings**.
2. Прокрутите страницу до раздела **Your profile** и выберите **Personal profile**.
3. Перейдите в раздел **Linked accounts** в середине страницы.
   <Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/LinktoAzure.png" title="Экран авторизации Azure DevOps"/>

4. После перенаправления в Azure DevOps войдите в свою учётную запись.
5. Когда появится экран запроса разрешений от приложения Azure DevOps, нажмите **Accept**. 
   <Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/OAuth Acceptance.png" title="Экран авторизации Azure DevOps"/>

Вы будете перенаправлены обратно в <Constant name="dbt" />, и ваш профиль должен быть связан с Azure DevOps. Теперь вы готовы к разработке в <Constant name="dbt" />!

## Устранение неполадок {#troubleshooting}

Используйте эти инструкции для устранения распространённых проблем при аутентификации в Azure DevOps.

<Expandable alt_header="Ошибка Missing Azure user при запуске Studio">

Если <Constant name="studio_ide" /> не запускается и отображает следующую ошибку, ваша личная учётная запись Azure DevOps не связана с <Constant name="dbt" />:

`Missing Azure user; link your Azure DevOps account in your personal profile`

Чтобы устранить проблему, [свяжите свой профиль dbt с Azure DevOps](#link-your-dbt-profile-to-azure-devops).

</Expandable>

<Expandable alt_header="Ошибка Azure Service User not found при запуске Studio">

Если <Constant name="studio_ide" /> не запускается и отображает следующую ошибку, служебный пользователь на уровне учётной записи не подключён:

`Failed to start server. The project is not fully set up: Azure Service User not found`

Это относится к учётным записям, использующим устаревший способ аутентификации через служебного пользователя. Администратору учётной записи необходимо повторно подключить служебного пользователя. Это также требуется, если в учётной записи более 90 дней не было запусков по расписанию, через API или в рамках CI. Подробнее см. в разделе [Подключение служебного пользователя](/docs/platform/git/setup-service-user#connect-a-service-user).

</Expandable>

## Часто задаваемые вопросы

<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>
