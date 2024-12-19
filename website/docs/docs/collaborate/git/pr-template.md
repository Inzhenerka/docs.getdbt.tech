---
title: "Шаблон PR"
id: "pr-template"
---
## Настройка URL шаблона Pull Request (PR)

Когда вы вносите изменения в ветку в IDE, dbt Cloud может предложить пользователям открыть новый Pull Request для внесенных изменений в код. Чтобы включить эту функциональность, убедитесь, что URL шаблона PR настроен на странице **Детали репозитория** в ваших **Настройках аккаунта**. Если эта настройка пуста, IDE предложит пользователям объединить изменения непосредственно в их основную ветку.

<Lightbox src="/img/docs/collaborate/repo-details.jpg" width="90%" title="Настройка шаблона PR на странице 'Детали репозитория'." />

### URL шаблона PR по провайдеру git

Настройка URL шаблона PR будет автоматически установлена для большинства репозиториев в зависимости от метода подключения.

- Если вы подключаетесь к своему репозиторию через интеграции в приложении с вашим провайдером git или методом "Git Clone" через SSH, эта настройка URL будет автоматически заполнена и редактируемой.
  - Для AWS CodeCommit эта настройка URL не заполняется автоматически и должна быть [настроена вручную](/docs/cloud/git/import-a-project-by-git-url#step-5-configure-pull-request-template-urls-optional).
- Если вы подключаетесь через [Управляемый репозиторий dbt Cloud](/docs/collaborate/git/managed-repository), этот URL не будет установлен, и IDE предложит пользователям объединить изменения непосредственно в их основную ветку.

URL шаблона PR поддерживает две переменные, которые можно использовать для построения строки URL. Эти переменные, `{{source}}` и `{{destination}}`, возвращают имена веток в зависимости от состояния настроенной среды и активной ветки, открытой в IDE. Переменная `{{source}}` представляет активную ветку разработки, а переменная `{{destination}}` представляет настроенную базовую ветку для среды, например, `master`.

Типичный URL для сборки PR выглядит следующим образом:

<Tabs
  defaultValue="template"
  values={[
    { label: 'Шаблон', value: 'template', },
    { label: 'Сформированный', value: 'rendered', },
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

Ниже приведены некоторые общие шаблоны URL, но обратите внимание, что точное значение может варьироваться в зависимости от вашего настроенного провайдера git.

### GitHub
```
https://github.com/<org>/<repo>/compare/{{destination}}..{{source}}
```

Если вы используете Github Enterprise, ваш шаблон может выглядеть примерно так:

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

### AWS CodeCommit
```
https://console.aws.amazon.com/codesuite/codecommit/repositories/<repo>/pull-requests/new/refs/heads/{{destination}}/.../refs/heads/{{source}}
```

### Azure DevOps
```
https://dev.azure.com/<org>/<project>/_git/<repo>/pullrequestcreate?sourceRef={{source}}&targetRef={{destination}}
```