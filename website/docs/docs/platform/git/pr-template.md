---
title: "Шаблон PR"
id: "pr-template"
availability:
  surface: platform
  access: login_required
---
## Настройка URL шаблона Pull Request (PR) {#configure-pull-request-pr-template-urls}

Когда вы фиксируете изменения в ветке в <Constant name="studio_ide" />, <Constant name="dbt" /> может предложить пользователям создать новый pull request для внесённых изменений кода. Чтобы включить эту возможность, убедитесь, что на странице **Сведения о репозитории** в **Настройках учётной записи** указан URL шаблона PR. Если это поле не заполнено, <Constant name="studio_ide" /> предложит пользователям слить изменения непосредственно в ветку по умолчанию.

<Lightbox src="/img/docs/collaborate/repo-details.jpg" width="90%" title="Настройка шаблона PR на странице «Repository details»." />

### URL шаблона PR в зависимости от git‑провайдера {#pr-template-url-by-git-provider}

Параметр URL шаблона PR автоматически задаётся для большинства репозиториев в зависимости от способа подключения.

- Если вы подключаетесь к своему репозиторию через встроенные интеграции с вашим Git-провайдером или методом «<Constant name="git" /> Clone» через SSH, это поле URL будет заполнено автоматически и доступно для редактирования.
  - Для AWS CodeCommit это поле URL не заполняется автоматически, и его необходимо [настроить вручную](/docs/platform/git/import-a-project-by-git-url#step-5-configure-pull-request-template-urls-optional).
- Если вы подключаетесь через [управляемый репозиторий](/docs/platform/git/managed-repository) <Constant name="dbt" />, этот URL не будет задан, и <Constant name="studio_ide" /> предложит пользователям слить изменения непосредственно в их ветку по умолчанию.

URL шаблона PR поддерживает две переменные, которые можно использовать для построения строки URL.
Эти переменные — `{{source}}` и `{{destination}}` — возвращают имена веток на основе
настроенного Environment и активной ветки, открытой в IDE. Переменная `{{source}}`
представляет активную ветку разработки, а переменная `{{destination}}` —
настроенную базовую ветку для окружения, например `master`.

Типичный URL для создания PR выглядит так:

<Tabs
  defaultValue="template"
  values={[
    { label: 'Template', value: 'template', },
    { label: 'Rendered', value: 'rendered', },
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

## Примеры шаблонов {#example-templates}

Ниже приведены некоторые распространённые шаблоны URL, однако обратите внимание, что
конкретное значение может отличаться в зависимости от используемого git‑провайдера.

### GitHub {#github}
```
https://github.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

Если вы используете GitHub Enterprise, ваш шаблон может выглядеть примерно так:

```
https://git.<mycompany>.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

### GitLab {#gitlab}
```
https://gitlab.com/<org>/<repo>/-/merge_requests/new?merge_request[source_branch]={{source}}&merge_request[target_branch]={{destination}}
```

### BitBucket {#bitbucket}
```
https://bitbucket.org/<org>/<repo>/pull-requests/new?source={{source}}&dest={{destination}}
```

Если вы используете BitBucket Server или Data Center, ваш шаблон может выглядеть примерно так:

```
https://<bitbucket-server>/projects/<proj>/repos/<repo>/pull-requests?create&sourceBranch={{source}}&targetBranch={{destination}}
```

### AWS CodeCommit {#aws-codecommit}
```
https://console.aws.amazon.com/codesuite/codecommit/repositories/<repo>/pull-requests/new/refs/heads/{{destination}}/.../refs/heads/{{source}}
```

### Azure DevOps {#azure-devops}
```
https://dev.azure.com/<org>/<project>/_git/<repo>/pullrequestcreate?sourceRef={{source}}&targetRef={{destination}}
```
