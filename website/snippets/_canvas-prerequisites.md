## Предварительные требования для Canvas
Перед использованием <Constant name="canvas" /> необходимо:
- Иметь учетную запись [<Constant name="dbt" /> Enterprise или Enterprise+](https://www.getdbt.com/pricing).
- Иметь [лицензию разработчика](/docs/platform/manage-access/seats-and-users) с настроенными учетными данными пользователя.
- Использовать один из следующих адаптеров:
    - Bigquery
    - Databricks
    - Redshift 
    - Snowflake
    - Trino
- Вы можете использовать <Constant name="canvas" /> с адаптерами, не указанными в списке, но некоторые функции могут быть пока недоступны.
- Используйте [GitHub](/docs/platform/git/connect-github), [GitLab](/docs/platform/git/connect-gitlab) или [Azure DevOps](/docs/platform/git/connect-azure-devops) в качестве провайдера <Constant name="git" />, подключённого к dbt через HTTPS.
  - Подключения по SSH пока не поддерживаются.
  - Использование <Constant name="canvas"/> с самостоятельно размещёнными или локальными развёртываниями любого Git-провайдера пока не поддерживается.
- У вас должен быть уже созданный проект <Constant name="dbt" />, в котором завершён запуск в среде Staging или Production.
- Убедитесь, что ваша среда разработки использует поддерживаемый [канал выпуска](/docs/dbt-versions/dbt-release-tracks), чтобы регулярно получать обновления.
- У вас должен быть доступ только для чтения к [среде Staging](/docs/deploy/deploy-environments#staging-environment) с данными, чтобы выполнять `run` в <Constant name="canvas" />. Подробнее о настройке необходимого доступа для группы пользователей <Constant name="canvas" /> см. в разделе [Настройка разрешений на уровне среды](/docs/platform/manage-access/environment-permissions-setup).
