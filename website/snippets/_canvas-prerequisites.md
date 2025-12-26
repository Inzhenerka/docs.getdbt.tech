## Предварительные требования для Canvas
Перед использованием <Constant name="visual_editor" /> убедитесь, что:

- У вас есть учетная запись [<Constant name="cloud" /> Enterprise или Enterprise+](https://www.getdbt.com/pricing).
- У вас есть [лицензия разработчика](/docs/cloud/manage-access/seats-and-users) с настроенными учетными данными разработчика.
- Вы используете один из следующих адаптеров:
    - Bigquery
    - Databricks
    - Redshift 
    - Snowflake
    - Trino
    - Вы можете получить доступ к <Constant name="visual_editor" /> и с адаптерами, не указанными в списке, однако на данный момент некоторые функции могут быть недоступны.
- В качестве провайдера <Constant name="git" /> вы используете [GitHub](/docs/cloud/git/connect-github), [GitLab](/docs/cloud/git/connect-gitlab) или [Azure DevOps](/docs/cloud/git/connect-azure-devops), подключенные к dbt по HTTPS. Подключения по SSH в настоящее время не поддерживаются для <Constant name="visual_editor" />.
- У вас уже создан проект <Constant name="cloud" />, в котором был выполнен как минимум один запуск в среде Staging или Production.
- Вы проверили, что ваша среда разработки использует поддерживаемый [release track](/docs/dbt-versions/cloud-release-tracks), чтобы получать регулярные обновления.
- У вас есть доступ только на чтение к [среде Staging](/docs/deploy/deploy-environments#staging-environment) с данными, чтобы иметь возможность выполнять команду `run` в <Constant name="visual_editor" />. Чтобы настроить необходимые уровни доступа для пользовательской группы <Constant name="visual_editor" />, см. [Настройка разрешений на уровне среды](/docs/cloud/manage-access/environment-permissions-setup).
- Включен переключатель функций на базе ИИ (для [интеграции с <Constant name="copilot" />](/docs/cloud/dbt-copilot)).
