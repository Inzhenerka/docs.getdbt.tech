---
title: "Шаблон PR"
id: "pr-template"
---
## Настройка URL шаблона Pull Request (PR)

Когда вы коммитите изменения в ветку в <Constant name="cloud_ide" />, <Constant name="cloud" /> может предложить пользователям открыть новый Pull Request для внесённых изменений кода. Чтобы включить эту функциональность, убедитесь, что URL шаблона PR настроен на странице **Repository details** в разделе **Account Settings**. Если это поле пустое, <Constant name="cloud_ide" /> будет предлагать пользователям сразу сливать изменения напрямую в их ветку по умолчанию.

<Lightbox src="/img/docs/collaborate/repo-details.jpg" width="90%" title="Настройка шаблона PR на странице «Repository details»." />

### URL шаблона PR в зависимости от git‑провайдера

Параметр URL шаблона PR автоматически задаётся для большинства репозиториев в зависимости от способа подключения.

- Если вы подключаетесь к репозиторию через встроенные интеграции с вашим git‑провайдером или с помощью метода "<Constant name="git" /> Clone" по SSH, этот URL будет автоматически заполнен и доступен для редактирования.
  - Для AWS CodeCommit этот URL не заполняется автоматически и должен быть [настроен вручную](/docs/cloud/git/import-a-project-by-git-url#step-5-configure-pull-request-template-urls-optional).
- Если вы подключаетесь через <Constant name="cloud" /> [Managed repository](/docs/cloud/git/managed-repository), этот URL задан не будет, и <Constant name="cloud_ide" /> будет предлагать пользователям сливать изменения напрямую в ветку по умолчанию.

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

## Примеры шаблонов

Ниже приведены некоторые распространённые шаблоны URL, однако обратите внимание, что
конкретное значение может отличаться в зависимости от используемого git‑провайдера.

### GitHub
```
https://github.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

Если вы используете GitHub Enterprise, ваш шаблон может выглядеть примерно так:

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

Если вы используете BitBucket Server или Data Center, ваш шаблон может выглядеть примерно так:

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
