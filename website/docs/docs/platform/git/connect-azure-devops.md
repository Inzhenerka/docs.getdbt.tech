---
title: "Подключение к Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/platform/git/setup-service-principal"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Подключение к Azure DevOps

<Snippet path="available-enterprise-tier-only" />


## Об Azure DevOps и dbt

Подключите свою облачную учетную запись Azure DevOps к <Constant name="dbt" />, чтобы воспользоваться новыми возможностями:

- Импортируйте новые репозитории Azure DevOps в несколько кликов при настройке проекта <Constant name="dbt" />.
- Клонируйте репозитории по HTTPS вместо SSH
- Обеспечивайте авторизацию пользователей с помощью OAuth 2.0.
- Применяйте права пользователей Azure DevOps на доступ к репозиториям (чтение / запись) при выполнении операций git в <Constant name="studio_ide" /> или CLI <Constant name="dbt" />.
- Запускайте сборки непрерывной интеграции (CI) при открытии запросов на слияние (pull request) в Azure DevOps.


В настоящее время существует несколько способов интеграции Azure DevOps с <Constant name="dbt" />. Следующие способы доступны для всех учетных записей: 

- [**Субъект-служба (рекомендуется)**](/docs/platform/git/setup-service-principal)
- [**Служебный пользователь (устаревший способ)**](/docs/platform/git/setup-service-user)
- [**Переход со служебного пользователя на субъект-службу**](/docs/platform/git/setup-service-principal#migrate-to-service-principal)

Независимо от выбранного подхода для завершения интеграции потребуется участие администраторов <Constant name="dbt" />, Azure Entra ID и Azure DevOps. Подробные сведения см. в подходящем вам руководстве по настройке. 

## Устранение неполадок

<Expandable alt_header="Задания CI не запускаются при открытии запросов на слияние" >

Если задания непрерывной интеграции (CI) не запускаются при открытии запросов на слияние в Azure DevOps, а в <Constant name="dbt" /> и Azure DevOps не отображаются ошибки, выполните следующие проверки:

- Убедитесь, что сервисные хуки Azure DevOps для репозитория по-прежнему существуют и указывают на вашу учетную запись <Constant name="dbt" />.
- Убедитесь, что субъект-служба или служебный пользователь по-прежнему имеет доступ к репозиторию.

Если все в порядке, отключите репозиторий и подключите его заново:

1. В разделе **Account settings** выберите **Projects**, затем выберите проект.
2. Выберите ссылку **Repository**, затем **Edit**, затем **Disconnect**.
3. Выберите **Confirm Disconnect**.
4. Выберите **Configure Repository** и подключите тот же репозиторий Azure DevOps.

</Expandable>
