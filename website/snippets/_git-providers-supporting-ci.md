## Доступность функций в зависимости от Git‑провайдера {#availability-of-features-by-git-provider}

- Если ваш git‑провайдер имеет [нативную интеграцию с <Constant name="cloud" />](/docs/cloud/git/git-configuration-in-dbt-cloud), вы можете без лишних усилий настраивать задания [continuous integration (CI)](/docs/deploy/ci-jobs) прямо в <Constant name="cloud" />. 

- Для провайдеров без нативной интеграции вы всё равно можете использовать [метод Git clone](/docs/cloud/git/import-a-project-by-git-url), чтобы импортировать git URL, и задействовать [Administrative API <Constant name="cloud" />](/docs/dbt-cloud-apis/admin-cloud-api) для запуска CI‑заданий.

В следующей таблице приведены доступные варианты интеграции и соответствующие им возможности.

| **Git‑провайдер** | **Нативная интеграция с <Constant name="cloud" />** | **Автоматизированное CI‑задание** | **Git clone** | **Информация** | **Поддерживаемые планы** |
| ------------------ | --------------------------------- | -------------------- | ------------- | -------------- | -------- |
|[Azure DevOps](/docs/cloud/git/connect-azure-devops)<br /> | ✅ | ✅ | ✅ | Организации на планах Starter и Developer могут подключаться к Azure DevOps с использованием deploy key. Обратите внимание: вы не сможете настраивать автоматизированные CI‑задания, но при этом сможете вести разработку. | Enterprise, Enterprise+ |
|[GitHub](/docs/cloud/git/connect-github)<br /> | ✅ | ✅ |  |  | Все планы <Constant name="cloud" /> |
|[GitLab](/docs/cloud/git/connect-gitlab)<br /> | ✅ | ✅ | ✅ |  | Все планы <Constant name="cloud" /> |
|Все остальные git‑провайдеры при использовании [Git clone](/docs/cloud/git/import-a-project-by-git-url) ([BitBucket](/docs/cloud/git/import-a-project-by-git-url#bitbucket), [AWS CodeCommit](/docs/cloud/git/import-a-project-by-git-url#aws-codecommit) и другие) | ❌ | ❌ | ✅ | См. руководство [Customizing CI/CD with custom pipelines](/guides/custom-cicd-pipelines?step=1) для настройки continuous integration и continuous deployment (CI/CD). |
