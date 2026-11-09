## Доступность функций в зависимости от Git‑провайдера {#availability-of-features-by-git-provider}

- Если ваш Git-провайдер поддерживает [встроенную интеграцию с <Constant name="dbt" />](/docs/platform/git/configure-git), вы можете легко настроить задания [непрерывной интеграции (CI)](/docs/deploy/ci-jobs) непосредственно в <Constant name="dbt" />. 

- Для провайдеров без встроенной интеграции вы по-прежнему можете использовать [метод Git clone](/docs/platform/git/import-a-project-by-git-url), чтобы импортировать проект по URL Git-репозитория, и [административный API <Constant name="dbt" />](/docs/dbt-apis/admin-api), чтобы запускать задание CI.

В следующей таблице представлены доступные варианты интеграции и соответствующие им возможности.

| **Git-провайдер** | **Встроенная интеграция с <Constant name="dbt" />** | **Автоматизированное задание CI**|**Git clone**| **Информация**| **Поддерживаемые тарифные планы**|
| -----------------| ---------------------------------| --------------------|-------------|----------------| --------|
|[Azure DevOps](/docs/platform/git/connect-azure-devops)<br /> |  ✅|  ✅ |  ✅  | Организации на тарифных планах Starter и Developer могут подключаться к Azure DevOps с помощью ключа развертывания. Обратите внимание: вы не сможете настроить автоматизированные задания CI, но по-прежнему сможете вести разработку.| Enterprise, Enterprise+ |
|[GitHub](/docs/platform/git/connect-github)<br />  | ✅ | ✅ | ✅ |  | Все тарифные планы <Constant name="dbt" /> |
|[GitLab](/docs/platform/git/connect-gitlab)<br /> | ✅ | ✅ |  ✅  | | Все тарифные планы <Constant name="dbt" /> |
|Все остальные Git-провайдеры, подключаемые с помощью [Git clone](/docs/platform/git/import-a-project-by-git-url) ([BitBucket](/docs/platform/git/import-a-project-by-git-url#bitbucket), [AWS CodeCommit](/docs/platform/git/import-a-project-by-git-url#aws-codecommit) и другие)| ❌    | ❌    | ✅   | Чтобы настроить непрерывную интеграцию и непрерывное развертывание (CI/CD), обратитесь к руководству [Настройка CI/CD с использованием собственных конвейеров](/guides/custom-cicd-pipelines?step=1).|
