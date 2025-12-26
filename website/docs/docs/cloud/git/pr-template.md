---
title: "Шаблон PR"
id: "pr-template"
---
## Настройка URL шаблона pull request (PR)

Когда вы коммитите изменения в ветку в <Constant name="cloud_ide" />, <Constant name="cloud" /> может предложить пользователям открыть новый Pull Request для этих изменений кода. Чтобы включить эту функциональность, убедитесь, что на странице **Repository details** в ваших **Account Settings** настроен PR Template URL. Если это поле оставлено пустым, <Constant name="cloud_ide" /> будет предлагать пользователям сразу слить изменения напрямую в их ветку по умолчанию.

<Lightbox src="/img/docs/collaborate/repo-details.jpg" width="90%" title="Настройка шаблона PR на странице 'Детали репозитория'." />

### URL шаблона PR в зависимости от провайдера git

Настройка URL шаблона PR будет автоматически установлена для большинства репозиториев в зависимости от метода подключения.

- Если вы подключаетесь к репозиторию через встроенные интеграции с вашим git‑провайдером или с помощью метода "<Constant name="git" /> Clone" по SSH, это значение URL будет автоматически заполнено и доступно для редактирования.
  - Для AWS CodeCommit это значение URL не заполняется автоматически и должно быть [настроено вручную](/docs/cloud/git/import-a-project-by-git-url#step-5-configure-pull-request-template-urls-optional).
- Если вы подключаетесь через <Constant name="cloud" /> [Managed repository](/docs/cloud/git/managed-repository), этот URL задан не будет, и <Constant name="cloud_ide" /> предложит пользователям выполнить слияние изменений напрямую в их ветку по умолчанию.

URL шаблона PR поддерживает две переменные, которые могут быть использованы для построения строки URL. Эти переменные, `{{source}}` и `{{destination}}`, возвращают имена веток на основе состояния настроенной среды и активной ветки, открытой в IDE. Переменная `{{source}}` представляет активную ветку разработки, а переменная `{{destination}}` представляет настроенную базовую ветку для среды, например, `master`.

Типичный URL для создания PR выглядит следующим образом:

<Tabs
  defaultValue="template"
  values={[
    { label: 'Шаблон', value: 'template', },
    { label: 'Отображенный', value: 'rendered', },
  ]
}>
<TabItem value="template">

```
https://github.com/dbt-labs/jaffle_shop/compare/{{destination}}..{{source}}
```

</TabItem>
<TabItem value="rendered">

```
https://github.com/dbt-labs/jaffle_shop/compare/master..my-branch
```

</TabItem>
</Tabs>

## Примеры шаблонов

Ниже приведены некоторые общие шаблоны URL, но обратите внимание, что точное значение может варьироваться в зависимости от вашего настроенного git-провайдера.

### GitHub
```
https://github.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

Если вы используете Github Enterprise, ваш шаблон может выглядеть следующим образом:

```
https://git.<mycompany>.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

### GitLab
```
https://gitlab.com/<org>/<repo>/-/merge_requests/new?merge_request[source_branch]={{source}}&merge_request[target_branch]={{destination}}
```

### BitBucket
```
https://bitbucket.org/<org>/<repo>/pull-requests/new?source={{source}}&dest={{destination}}
```

If you're using BitBucket Server or Data Center your template may look something like:

```
https://<bitbucket-server>/projects/<proj>/repos/<repo>/pull-requests?create&sourceBranch={{source}}&targetBranch={{destination}}
```

### AWS CodeCommit
```
https://console.aws.amazon.com/codesuite/codecommit/repositories/<repo>/pull-requests/new/refs/heads/{{destination}}/.../refs/heads/{{source}}
```

### Azure DevOps
```
https://dev.azure.com/<org>/<project>/_git/<repo>/pullrequestcreate?sourceRef={{source}}&targetRef={{destination}}
```