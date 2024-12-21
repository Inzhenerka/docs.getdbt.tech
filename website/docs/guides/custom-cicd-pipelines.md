---
title: Настройка CI/CD с помощью пользовательских конвейеров
id: custom-cicd-pipelines
description: "Узнайте о преимуществах версионированного аналитического кода и пользовательских конвейеров в dbt для улучшенного тестирования кода и автоматизации рабочих процессов в процессе разработки."
displayText: Изучите версионированный код, пользовательские конвейеры и улучшенное тестирование кода.
hoverSnippet: Изучите версионированный код, пользовательские конвейеры и улучшенное тестирование кода.
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Cloud', 'Оркестрация', 'CI']
level: 'Intermediate'
recently_updated: true
search_weight: "heavy"
keywords:
  - bitbucket pipeline, custom pipelines, github, gitlab, azure devops, ci/cd custom pipeline
---
<div style={{maxWidth: '900px'}}>

## Введение

Один из основных принципов dbt заключается в том, что аналитический код должен быть под версионным контролем. Это приносит вашей организации множество преимуществ в плане сотрудничества, согласованности кода, стабильности и возможности отката к предыдущей версии. Существует дополнительное преимущество, предоставляемое вашей платформой хостинга кода, которое часто упускается из виду или недооценивается. Некоторые из вас могут иметь опыт использования [вебхуков dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration) для запуска задания при создании PR. Это замечательная возможность, и она удовлетворяет большинство случаев использования для тестирования вашего кода перед слиянием в продакшн. Однако бывают случаи, когда организации требуется дополнительная функциональность, например, запуск рабочих процессов при каждом коммите (линтинг) или запуск рабочих процессов после завершения слияния. В этой статье мы покажем вам, как настроить пользовательские конвейеры для линтинга вашего проекта и запуска задания dbt Cloud через API.

Примечание о терминологии в этой статье, так как каждая платформа хостинга кода использует разные термины для схожих концепций. Термины `pull request` (PR) и `merge request` (MR) используются взаимозаменяемо, чтобы обозначить процесс слияния одной ветки с другой.

### Что такое конвейеры?

Конвейеры (которые известны под многими именами, такими как рабочие процессы, действия или шаги сборки) — это серия предопределенных заданий, которые запускаются определенными событиями в вашем репозитории (создание PR, отправка коммита, слияние ветки и т.д.). Эти задания могут выполнять практически все, что вы пожелаете, при условии, что у вас есть соответствующий доступ к безопасности и навыки программирования.

Задания выполняются на [раннерах](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#runners), которые являются виртуальными серверами. Раннеры предварительно настроены с Ubuntu Linux, macOS или Windows. Это означает, что команды, которые вы выполняете, определяются операционной системой вашего раннера. Вы увидите, как это будет использоваться позже в настройке, но пока просто помните, что ваш код выполняется на виртуальных серверах, которые, как правило, размещаются платформой хостинга кода.

![Диаграмма работы конвейеров](/img/guides/orchestration/custom-cicd-pipelines/pipeline-diagram.png)

Обратите внимание, что раннеры, размещенные вашей платформой хостинга кода, предоставляют определенное количество бесплатного времени. После этого могут применяться платежные сборы в зависимости от того, как настроена ваша учетная запись. Вы также можете разместить свои собственные раннеры. Это выходит за рамки данной статьи, но ознакомьтесь с приведенными ниже ссылками, если вам интересно настроить это:

- Информация о биллинге для раннеров, размещенных в репозитории:
  - [GitHub](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
  - [GitLab](https://docs.gitlab.com/ee/ci/pipelines/cicd_minutes.html)
  - [Bitbucket](https://bitbucket.org/product/features/pipelines#)
- Информация о самостоятелных раннерах:
  - [GitHub](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
  - [GitLab](https://docs.gitlab.com/runner/)
  - [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/runners/)

Кроме того, если вы используете бесплатный тарифный план GitLab, вы все равно можете следовать этому руководству, но вас могут попросить предоставить кредитную карту для подтверждения вашей учетной записи. Вы увидите что-то подобное, когда впервые попытаетесь запустить конвейер:

![Предупреждение от GitLab о необходимости предоставления платежной информации](/img/guides/orchestration/custom-cicd-pipelines/gitlab-cicd-payment-warning.png)

### Как настроить конвейеры

Это руководство предоставляет подробности для нескольких платформ хостинга кода. Где шаги уникальны, они представлены без опции выбора. Если код специфичен для платформы (например, GitHub, GitLab, Bitbucket), вы увидите опцию выбора для каждой.

Конвейеры могут быть запущены различными событиями. Процесс [вебхука dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration) уже запускает выполнение, если вы хотите запускать свои задания на запрос слияния, поэтому это руководство сосредоточено на запуске конвейеров для каждого пуша и при слиянии PR. Поскольку пуши происходят часто в проекте, мы сделаем это задание супер простым и быстрым, используя линтинг с SQLFluff. Конвейер, который запускается на запросах слияния, будет запускаться реже и может быть использован для вызова API dbt Cloud для запуска конкретного задания. Это может быть полезно, если у вас есть специфические требования, которые должны выполняться при обновлении кода в продакшене, например, выполнение `--full-refresh` на всех затронутых инкрементальных моделях.

Вот краткий обзор того, что этот конвейер будет выполнять:

![Диаграмма, показывающая создаваемые конвейеры и задействованные программы](/img/guides/orchestration/custom-cicd-pipelines/pipeline-programs-diagram.png)

## Запуск задания dbt Cloud при слиянии

Это задание потребует немного больше настройки, но является хорошим примером того, как вызвать API dbt Cloud из конвейера CI/CD. Представленные здесь концепции могут быть обобщены и использованы в любом виде, который лучше всего подходит для вашего случая использования.

:::tip Запуск при слиянии

Если ваш поставщик Git имеет нативную интеграцию с dbt Cloud, вы можете воспользоваться настройкой [Merge jobs](/docs/deploy/merge-jobs) в интерфейсе.

:::

Настройка ниже показывает, как вызвать API dbt Cloud для запуска задания каждый раз, когда происходит пуш в вашу основную ветку (ветка, в которую обычно сливаются pull requests. Обычно называется основной, первичной или мастер-веткой, но может быть названа иначе).

### 1. Получите ваш API-ключ dbt Cloud

При запуске конвейера CI/CD вы захотите использовать сервисный токен вместо API-ключа любого отдельного пользователя. Существуют [подробные документы](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens) на эту тему, но ниже приведен краткий обзор (это должен выполнить администратор учетной записи):

- Войдите в свою учетную запись dbt Cloud
- В левом верхнем углу нажмите кнопку меню, затем *Настройки учетной записи*
- Нажмите *Сервисные токены* слева
- Нажмите *Новый токен*, чтобы создать новый токен специально для вызовов API CI/CD
- Назовите ваш токен, например, “CICD Token”
- Нажмите кнопку *+Добавить* в разделе *Доступ* и предоставьте этому токену разрешение *Администратор заданий*
- Нажмите *Сохранить*, и вы увидите серую рамку с вашим токеном. Скопируйте его и сохраните в безопасном месте (это пароль, и с ним следует обращаться соответствующим образом).

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-service-token-page.png" title="Вид страницы dbt Cloud, где создаются сервисные токены" width="85%" />

Вот видео, показывающее эти шаги:

<WistiaVideo id="iub17te9ir" />

### 2. Поместите ваш API-ключ dbt Cloud в ваш репозиторий

Следующая часть будет происходить на вашей платформе хостинга кода. Нам нужно сохранить ваш API-ключ из предыдущего шага в секрет репозитория, чтобы задание, которое мы создаем, могло получить к нему доступ. **Не рекомендуется** когда-либо сохранять пароли или API-ключи в вашем коде, поэтому этот шаг гарантирует, что ваш ключ останется безопасным, но все еще будет доступен для ваших конвейеров.

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Azure DevOps', value: 'ado', },  
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

- Откройте ваш репозиторий, в котором вы хотите запустить конвейер (тот же, в котором находится ваш проект dbt)
- Нажмите *Настройки*, чтобы открыть параметры репозитория
- Слева нажмите на раскрывающееся меню *Секреты и переменные* в разделе *Безопасность*
- Из этого списка выберите *Действия*
- В середине экрана нажмите кнопку *Новый секрет репозитория*
- Вас попросят ввести имя, поэтому давайте назовем его `DBT_API_KEY`
  - **Очень важно, чтобы вы скопировали/вставили это имя точно, так как оно используется в скриптах ниже.**
- В разделе *Секрет* вставьте ключ, который вы скопировали из dbt Cloud
- Нажмите *Добавить секрет*, и все готово!

** Быстрая заметка о безопасности: хотя использование секрета репозитория является самым простым способом настройки этого секрета, в GitHub доступны и другие опции. Они выходят за рамки этого руководства, но могут быть полезны, если вам нужно создать более безопасную среду для выполнения действий. Ознакомьтесь с документацией GitHub о секретах [здесь](https://docs.github.com/en/actions/security-guides/encrypted-secrets).*

Вот видео, показывающее эти шаги:

<WistiaVideo id="u7mo30puql" />

</TabItem>

<TabItem value="gitlab">

- Откройте ваш репозиторий, в котором вы хотите запустить конвейер (тот же, в котором находится ваш проект dbt)
- Нажмите *Настройки* > *CI/CD*
- В разделе *Переменные* нажмите *Развернуть*, затем нажмите *Добавить переменную*
- Вас попросят ввести имя, поэтому давайте назовем его `DBT_API_KEY`
  - **Очень важно, чтобы вы скопировали/вставили это имя точно, так как оно используется в скриптах ниже.**
- В разделе *Значение* вставьте ключ, который вы скопировали из dbt Cloud
- Убедитесь, что флажок рядом с *Защитить переменную* не установлен, а флажок рядом с *Маскировать переменную* установлен (см. ниже)
  - "Защищенный" означает, что переменная доступна только в конвейерах, которые запускаются на защищенных ветках или защищенных тегах - это не подойдет нам, потому что мы хотим запускать этот конвейер на нескольких ветках. "Маскированный" означает, что он будет доступен вашему раннеру конвейера, но будет замаскирован в логах.

  <Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-api-key-gitlab.png" title="[Вид окна GitLab для ввода DBT_API_KEY" width="80%" />

    Вот видео, показывающее эти шаги:
    <WistiaVideo id="rgqs14f816" />

</TabItem>
<TabItem value="ado">

В Azure:

- Откройте ваш проект Azure DevOps, в котором вы хотите запустить конвейер (тот же, в котором находится ваш проект dbt)
- Нажмите на *Конвейеры* и затем *Создать конвейер*
- Выберите, где находится ваш код git. Это должно быть *Azure Repos Git*
  - Выберите ваш git-репозиторий из списка
- Выберите *Стартовый конвейер* (это будет обновлено позже на Шаге 4)
- Нажмите на *Переменные* и затем *Новая переменная*
- В поле *Имя* введите `DBT_API_KEY`
  - **Очень важно, чтобы вы скопировали/вставили это имя точно, так как оно используется в скриптах ниже.**
- В разделе *Значение* вставьте ключ, который вы скопировали из dbt Cloud
- Убедитесь, что флажок рядом с *Сохранить это значение в секрете* установлен. Это замаскирует значение в логах, и вы не сможете увидеть значение переменной в интерфейсе.
- Нажмите *ОК* и затем *Сохранить*, чтобы сохранить переменную
- Сохраните ваш новый конвейер Azure

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-api-key-azure.png" title="Вид окна конвейеров Azure для ввода DBT_API_KEY"/>

</TabItem>
<TabItem value="bitbucket">

В Bitbucket:

- Откройте ваш репозиторий, в котором вы хотите запустить конвейер (тот же, в котором находится ваш проект dbt)
- В левом меню нажмите *Настройки репозитория*
- Прокрутите до конца левого меню и выберите *Переменные репозитория*
- В поле *Имя* введите `DBT_API_KEY`
  - **Очень важно, чтобы вы скопировали/вставили это имя точно, так как оно используется в скриптах ниже.**
- В разделе *Значение* вставьте ключ, который вы скопировали из dbt Cloud
- Убедитесь, что флажок рядом с *Защищено* установлен. Это замаскирует значение в логах, и вы не сможете увидеть значение переменной в интерфейсе.
- Нажмите *Добавить*, чтобы сохранить переменную

    ![Вид окна Bitbucket для ввода DBT_API_KEY](/img/guides/orchestration/custom-cicd-pipelines/dbt-api-key-bitbucket.png)

    Вот видео, показывающее эти шаги:
    <WistiaVideo id="1fddpsqpfv" />

</TabItem>
</Tabs>

### 3. Создайте скрипт для запуска задания dbt Cloud через вызов API

В вашем проекте dbt Cloud создайте новую папку на корневом уровне с именем `python`. В этой папке создайте файл с именем `run_and_monitor_dbt_job.py`. Вы скопируете/вставите содержимое из этого [gist](https://gist.github.com/b-per/f4942acb8584638e3be363cb87769b48) в этот файл.

```yaml
my_awesome_project
├── python
│   └── run_and_monitor_dbt_job.py
```

Этот файл Python содержит все, что вам нужно для вызова API dbt Cloud, но требует нескольких входных данных (см. фрагмент ниже). Эти входные данные передаются этому скрипту через переменные окружения, которые будут определены на следующем шаге.

```python
#------------------------------------------------------------------------------
# получение переменных окружения
#------------------------------------------------------------------------------
api_base        = os.getenv('DBT_URL', 'https://cloud.getdbt.com/') # по умолчанию используется URL многопользовательской версии
job_cause       = os.getenv('DBT_JOB_CAUSE', 'API-triggered job') # по умолчанию используется общее сообщение
git_branch      = os.getenv('DBT_JOB_BRANCH', None) # по умолчанию None
schema_override = os.getenv('DBT_JOB_SCHEMA_OVERRIDE', None) # по умолчанию None
api_key         = os.environ['DBT_API_KEY']  # здесь нет значения по умолчанию, просто выбросьте ошибку, если ключ не предоставлен
account_id      = os.environ['DBT_ACCOUNT_ID'] # здесь нет значения по умолчанию, просто выбросьте ошибку, если id не предоставлен
project_id      = os.environ['DBT_PROJECT_ID'] # здесь нет значения по умолчанию, просто выбросьте ошибку, если id не предоставлен
job_id          = os.environ['DBT_PR_JOB_ID'] # здесь нет значения по умолчанию, просто выбросьте ошибку, если id не предоставлен
```

**Требуемый ввод:**

Для вызова API dbt Cloud скрипту необходимо несколько данных. Самый простой способ получить эти значения — открыть задание, которое вы хотите запустить в dbt Cloud. URL, когда вы находитесь внутри задания, содержит все необходимые значения:

- `DBT_ACCOUNT_ID` - это число сразу после `accounts/` в URL
- `DBT_PROJECT_ID` - это число сразу после `projects/` в URL
- `DBT_PR_JOB_ID` - это число сразу после `jobs/` в URL

![Изображение URL задания dbt Cloud с выделенными частями для учетной записи, проекта и задания](/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-url.png)

### 4. Обновите ваш проект, чтобы включить новый вызов API

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Azure DevOps', value: 'ado', },
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

Для этого нового задания мы добавим файл для вызова API dbt Cloud с именем `dbt_run_on_merge.yml`.

```yaml
my_awesome_project
├── python
│   └── run_and_monitor_dbt_job.py
├── .github
│   ├── workflows
│   │   └── dbt_run_on_merge.yml
│   │   └── lint_on_push.yml
```

Файл YAML будет выглядеть довольно похоже на наше предыдущее задание, но есть новый раздел под названием `env`, который мы будем использовать для передачи необходимых переменных. Обновите переменные ниже, чтобы они соответствовали вашей настройке на основе комментариев в файле.

Стоит отметить, что мы изменили раздел `on:`, чтобы теперь запускать **только** при пушах в ветку с именем `main` (т.е. когда PR сливается). Ознакомьтесь с [документацией GitHub](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) по этим фильтрам для дополнительных случаев использования.

```yaml
name: run dbt Cloud job on push

# Этот фильтр говорит запускать это задание только при пуше в основную ветку
# Это работает на предположении, что вы ограничили эту ветку только для PR, чтобы пушить в ветку по умолчанию
# Обновите имя, чтобы оно соответствовало имени вашей ветки по умолчанию
on:
  push:
    branches:
      - 'main'

jobs:

  # задание вызывает API dbt Cloud для запуска задания
  run_dbt_cloud_job:
    name: Run dbt Cloud Job
    runs-on: ubuntu-latest

  # Установите переменные окружения, необходимые для выполнения
    env:
      DBT_ACCOUNT_ID: 00000 # введите ваш id учетной записи
      DBT_PROJECT_ID: 00000 # введите ваш id проекта
      DBT_PR_JOB_ID:  00000 # введите ваш id задания
      DBT_API_KEY: ${{ secrets.DBT_API_KEY }}
      DBT_JOB_CAUSE: 'GitHub Pipeline CI Job' 
      DBT_JOB_BRANCH: ${{ github.ref_name }}

    steps:
      - uses: "actions/checkout@v4"
      - uses: "actions/setup-python@v5"
        with:
          python-version: "3.9"
      - name: Run dbt Cloud job
        run: "python python/run_and_monitor_dbt_job.py"
```

</TabItem>
<TabItem value="gitlab">

Для этого задания мы настроим его с использованием файла `gitlab-ci.yml`, как в предыдущем шаге (см. Шаг 1 настройки линтинга для получения дополнительной информации). Файл YAML будет выглядеть довольно похоже на наше предыдущее задание, но есть новый раздел под названием `variables`, который мы будем использовать для передачи необходимых переменных в скрипт Python. Обновите этот раздел, чтобы он соответствовал вашей настройке на основе комментариев в файле.

Обратите внимание, что раздел `rules:` теперь говорит запускать **только** при пушах в ветку с именем `main`, например, когда PR сливается. Ознакомьтесь с [документацией GitLab](https://docs.gitlab.com/ee/ci/yaml/#rules) по этим фильтрам для дополнительных случаев использования.

<Tabs
  defaultValue="single-job"
  values={[
    { label: 'Только задание dbt Cloud', value: 'single-job', },
    {label: 'Линтинг и задание dbt Cloud', value: 'multi-job', },
  ]
}>
<TabItem value="single-job">

```yaml
image: python:3.9

variables:
  DBT_ACCOUNT_ID: 00000 # введите ваш id учетной записи
  DBT_PROJECT_ID: 00000 # введите ваш id проекта
  DBT_PR_JOB_ID:  00000 # введите ваш id задания
  DBT_API_KEY: $DBT_API_KEY # секретная переменная в учетной записи gitlab
  DBT_URL: https://cloud.getdbt.com 
  DBT_JOB_CAUSE: 'GitLab Pipeline CI Job' 
  DBT_JOB_BRANCH: $CI_COMMIT_BRANCH

stages:
  - build

# это задание вызывает API dbt Cloud для запуска задания
run-dbt-cloud-job:
  stage: build
  rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH == 'main'
  script:
    - python python/run_and_monitor_dbt_job.py
```

</TabItem>
<TabItem value="multi-job">

```yaml
image: python:3.9

variables:
  DBT_ACCOUNT_ID: 00000 # введите ваш id учетной записи
  DBT_PROJECT_ID: 00000 # введите ваш id проекта
  DBT_PR_JOB_ID:  00000 # введите ваш id задания
  DBT_API_KEY: $DBT_API_KEY # секретная переменная в учетной записи gitlab
  DBT_URL: https://cloud.getdbt.com 
  DBT_JOB_CAUSE: 'GitLab Pipeline CI Job' 
  DBT_JOB_BRANCH: $CI_COMMIT_BRANCH

stages:
  - pre-build
  - build

# это задание выполняет SQLFluff с определенным набором правил
# обратите внимание, что диалект установлен на Snowflake, поэтому сделайте это специфичным для вашей настройки
# подробности о правилах линтера: https://docs.sqlfluff.com/en/stable/rules.html
lint-project:
  stage: pre-build
  rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH != 'main'
  script:
    - python -m pip install sqlfluff==0.13.1
    - sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022

# это задание вызывает API dbt Cloud для запуска задания
run-dbt-cloud-job:
  stage: build
  rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH == 'main'
  script:
    - python python/run_and_monitor_dbt_job.py
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="ado">

Для этого нового задания откройте существующий конвейер Azure, который вы создали выше, и выберите кнопку *Редактировать*. Мы хотим отредактировать соответствующий YAML-файл конвейера Azure с соответствующей конфигурацией, вместо стартового кода, а также включить раздел `variables` для передачи необходимых переменных.

Скопируйте приведенный ниже YAML-файл в ваш конвейер Azure и обновите переменные ниже, чтобы они соответствовали вашей настройке на основе комментариев в файле. Стоит отметить, что мы изменили раздел `trigger`, чтобы он запускался **только** при пушах в ветку с именем `main` (например, когда PR сливается в вашу основную ветку).

Ознакомьтесь с [документацией Azure](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/triggers?view=azure-devops) по этим фильтрам для дополнительных случаев использования.

```yaml
name: Run dbt Cloud Job

trigger: [ main ] # запускается при пушах в main

variables:
  DBT_URL:                 https://cloud.getdbt.com # без завершающего слэша, настройте это соответствующим образом для однопользовательских развертываний
  DBT_JOB_CAUSE:           'Azure Pipeline CI Job' # предоставьте описательную причину задания здесь для более легкой отладки в будущем
  DBT_ACCOUNT_ID:          00000 # введите ваш id учетной записи
  DBT_PROJECT_ID:          00000 # введите ваш id проекта
  DBT_PR_JOB_ID:           00000 # введите ваш id задания

steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.7'
    displayName: 'Use Python 3.7'

  - script: |
      python -m pip install requests
    displayName: 'Install python dependencies'

  - script: |
      python -u ./python/run_and_monitor_dbt_job.py
    displayName: 'Run dbt job '
    env:
      DBT_API_KEY: $(DBT_API_KEY) # Установите эти значения как секреты в веб-интерфейсе Azure pipelines
```

</TabItem>
<TabItem value="bitbucket">

Для этого задания мы настроим его с использованием файла `bitbucket-pipelines.yml`, как в предыдущем шаге (см. Шаг 1 настройки линтинга для получения дополнительной информации). Файл YAML будет выглядеть довольно похоже на наше предыдущее задание, но мы передадим необходимые переменные в скрипт Python с помощью операторов `export`. Обновите этот раздел, чтобы он соответствовал вашей настройке на основе комментариев в файле.

<Tabs
  defaultValue="single-job"
  values={[
    { label: 'Только задание dbt Cloud', value: 'single-job', },
    {label: 'Линтинг и задание dbt Cloud', value: 'multi-job', },
  ]
}>
<TabItem value="single-job">

```yaml
image: python:3.11.1


pipelines:
  branches:
    'main': # переопределите, если ваша ветка по умолчанию не запускается на ветке с именем "main"
      - step:
          name: 'Run dbt Cloud Job'
          script:
            - export DBT_URL="https://cloud.getdbt.com" # если у вас однопользовательское развертывание, настройте это соответствующим образом
            - export DBT_JOB_CAUSE="Bitbucket Pipeline CI Job"
            - export DBT_ACCOUNT_ID=00000 # введите ваш id учетной записи здесь
            - export DBT_PROJECT_ID=00000 # введите ваш id проекта здесь
            - export DBT_PR_JOB_ID=00000 # введите ваш id задания здесь
            - python python/run_and_monitor_dbt_job.py
```

</TabItem>
<TabItem value="multi-job">

```yaml
image: python:3.11.1


pipelines:
  branches:
    '**': # это устанавливает подстановочный знак для запуска на каждой ветке, если не указано имя ниже
      - step:
          name: Lint dbt project
          script:
            - python -m pip install sqlfluff==0.13.1
            - sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022

    'main': # переопределите, если ваша ветка по умолчанию не запускается на ветке с именем "main"
      - step:
          name: 'Run dbt Cloud Job'
          script:
            - export DBT_URL="https://cloud.getdbt.com" # если у вас однопользовательское развертывание, настройте это соответствующим образом
            - export DBT_JOB_CAUSE="Bitbucket Pipeline CI Job"
            - export DBT_ACCOUNT_ID=00000 # введите ваш id учетной записи здесь
            - export DBT_PROJECT_ID=00000 # введите ваш id проекта здесь
            - export DBT_PR_JOB_ID=00000 # введите ваш id задания здесь
            - python python/run_and_monitor_dbt_job.py
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

### 5. Протестируйте ваше новое действие

Теперь, когда у вас есть новое действие, пришло время протестировать его! Поскольку это изменение настроено на запуск только при слияниях в вашу ветку по умолчанию, вам нужно будет создать и слить это изменение в вашу основную ветку. Как только вы это сделаете, вы увидите, что было запущено новое задание конвейера для выполнения задания dbt Cloud, которое вы назначили в разделе переменных.

Кроме того, вы увидите задание в истории выполнения dbt Cloud. Его должно быть довольно легко заметить, потому что оно будет отмечено как вызванное API, и в разделе *INFO* будет указана ветка, которую вы использовали для этого руководства.

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Azure DevOps', value: 'ado', },
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-github.png" title="dbt run on merge job in GitHub" width="80%" />

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-github-triggered.png" title="dbt Cloud job showing it was triggered by GitHub" width="80%" />

</TabItem>
<TabItem value="gitlab">

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-gitlab.png" title="dbt run on merge job in GitLab" width="80%" />

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-gitlab-triggered.png" title="dbt Cloud job showing it was triggered by GitLab" width="80%" />

</TabItem>
<TabItem value="ado">

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-azure.png" width="85%" title="dbt run on merge job in ADO"/>

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-azure-triggered.png" width="80" title="ADO-triggered job in dbt Cloud"/>

</TabItem>
<TabItem value="bitbucket">

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-bitbucket.png" title="dbt run on merge job in Bitbucket" width="80%" />

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-bitbucket-triggered.png" title="dbt Cloud job showing it was triggered by Bitbucket" width="80%" />

</TabItem>
</Tabs>

## Запуск задания dbt Cloud при pull request

Если ваш поставщик git не имеет нативной интеграции с dbt Cloud, но вы все равно хотите воспользоваться преимуществами CI-сборок, вы пришли в нужное место! С небольшими усилиями можно настроить задание, которое будет запускать задание dbt Cloud при создании pull request (PR).

:::tip Запуск на PR

Если ваш поставщик git имеет нативную интеграцию с dbt Cloud, вы можете воспользоваться инструкциями по настройке [здесь](/docs/deploy/ci-jobs).
Этот раздел предназначен только для тех проектов, которые подключаются к своему git-репозиторию с использованием SSH-ключа.

:::

Настройка этого конвейера будет использовать те же шаги, что и на предыдущей странице. Перед тем как продолжить, выполните шаги 1-5 с [предыдущей страницы](https://docs.getdbt.com/guides/custom-cicd-pipelines?step=2).

### 1. Создайте задание конвейера, которое запускается при создании PR

<Tabs
  defaultValue="bitbucket"
  values={[
    { label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="bitbucket">

Для этого задания мы настроим его с использованием файла `bitbucket-pipelines.yml`, как в предыдущем шаге. Файл YAML будет выглядеть довольно похоже на наше предыдущее задание, но мы передадим необходимые переменные в скрипт Python с помощью операторов `export`. Обновите этот раздел, чтобы он соответствовал вашей настройке на основе комментариев в файле.

**Что будет делать этот конвейер?**  
Настройка ниже запустит задание dbt Cloud каждый раз, когда в этом репозитории создается PR. Она также будет запускать свежую версию конвейера для каждого коммита, который делается в PR, пока он не будет слит.
Например: Если вы откроете PR, он запустит конвейер. Если вы затем решите, что нужны дополнительные изменения, и сделаете коммит/пуш в ветку PR, новый конвейер будет запущен с обновленным кодом.  

Следующие переменные управляют этим заданием:

- `DBT_JOB_BRANCH`: Указывает заданию dbt Cloud запускать код в ветке, которая создала этот PR
- `DBT_JOB_SCHEMA_OVERRIDE`: Указывает заданию dbt Cloud запускать это в пользовательской целевой схеме
  - Формат этого будет выглядеть как: `DBT_CLOUD_PR_{REPO_KEY}_{PR_NUMBER}`

```yaml
image: python:3.11.1


pipelines:
  # Это задание будет запускаться, когда в репозитории создаются pull requests
  pull-requests:
    '**':
      - step:
          name: 'Run dbt Cloud PR Job'
          script:
            # Проверьте, чтобы строить только если назначение PR - master (или другая ветка). 
            # Закомментируйте или удалите строку ниже, если хотите запускать на всех PR, независимо от ветки назначения.
            - if [ "${BITBUCKET_PR_DESTINATION_BRANCH}" != "main" ]; then printf 'PR Destination is not master, exiting.'; exit; fi
            - export DBT_URL="https://cloud.getdbt.com"
            - export DBT_JOB_CAUSE="Bitbucket Pipeline CI Job"
            - export DBT_JOB_BRANCH=$BITBUCKET_BRANCH
            - export DBT_JOB_SCHEMA_OVERRIDE="DBT_CLOUD_PR_"$BITBUCKET_PROJECT_KEY"_"$BITBUCKET_PR_ID
            - export DBT_ACCOUNT_ID=00000 # введите ваш id учетной записи здесь
            - export DBT_PROJECT_ID=00000 # введите ваш id проекта здесь
            - export DBT_PR_JOB_ID=00000 # введите ваш id задания здесь
            - python python/run_and_monitor_dbt_job.py
```

</TabItem>
</Tabs>

### 2. Подтвердите, что конвейер запускается

Теперь, когда у вас есть новый конвейер, пришло время запустить его и убедиться, что он работает. Поскольку он запускается только при создании PR, вам нужно будет создать новый PR на ветке, содержащей приведенный выше код. Как только вы это сделаете, вы должны увидеть конвейер, который выглядит следующим образом:

<Tabs
  defaultValue="bitbucket"
  values={[
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="bitbucket">

Конвейер Bitbucket:
![dbt run on PR job in Bitbucket](/img/guides/orchestration/custom-cicd-pipelines/bitbucket-run-on-pr.png)

Задание dbt Cloud:
![dbt Cloud job showing it was triggered by Bitbucket](/img/guides/orchestration/custom-cicd-pipelines/bitbucket-dbt-cloud-pr.png)

</TabItem>
</Tabs>

### 3. Обработка этих дополнительных схем в вашей базе данных

Как отмечено выше, когда задание PR выполняется, оно создаст новую схему на основе PR. Чтобы избежать перегрузки вашей базы данных схемами PR, рассмотрите возможность добавления задания "очистки" в вашу учетную запись dbt Cloud. Это задание может выполняться по расписанию для очистки любых схем PR, которые не были обновлены/использованы недавно.

Добавьте это как макрос в ваш проект. Он принимает 2 аргумента, которые позволяют контролировать, какие схемы будут удалены:

- `age_in_days`: Количество дней с момента последнего изменения схемы, после которого она должна быть удалена (по умолчанию 10 дней)
- `database_to_clean`: Имя базы данных, из которой нужно удалить схемы
  
```sql
{# 
    Этот макрос находит схемы PR старше установленной даты и удаляет их 
    Макрос по умолчанию удаляет схемы старше 10 дней, но может быть настроен с помощью входного аргумента age_in_days
    Пример использования с другой датой:
        dbt run-operation pr_schema_cleanup --args "{'database_to_clean': 'analytics','age_in_days':'15'}"
#}
{% macro pr_schema_cleanup(database_to_clean, age_in_days=10) %}

    {% set find_old_schemas %}
        select 
            'drop schema {{ database_to_clean }}.'||schema_name||';'
        from {{ database_to_clean }}.information_schema.schemata
        where
            catalog_name = '{{ database_to_clean | upper }}'
            and schema_name ilike 'DBT_CLOUD_PR%'
            and last_altered <= (current_date() - interval '{{ age_in_days }} days')
    {% endset %}

    {% if execute %}

        {{ log('Schema drop statements:' ,True) }}

        {% set schema_drop_list = run_query(find_old_schemas).columns[0].values() %}

        {% for schema_to_drop in schema_drop_list %}
            {% do run_query(schema_to_drop) %}
            {{ log(schema_to_drop ,True) }}
        {% endfor %}

    {% endif %}

{% endmacro %}
```

Этот макрос входит в задание dbt Cloud, которое выполняется по расписанию. Команда будет выглядеть следующим образом (текст ниже для копирования/вставки):
![dbt Cloud job showing the run operation command for the cleanup macro](/img/guides/orchestration/custom-cicd-pipelines/dbt-macro-cleanup-pr.png)
`dbt run-operation pr_schema_cleanup --args "{ 'database_to_clean': 'development','age_in_days':15}"`

## Учитывайте риск конфликтов при использовании нескольких инструментов оркестрации

Запуск заданий dbt Cloud через конвейер CI/CD является формой оркестрации заданий. Если вы также запускаете задания с использованием встроенного планировщика dbt Cloud, у вас теперь есть 2 инструмента оркестрации, запускающих задания. Риск в этом заключается в том, что вы можете столкнуться с конфликтами - вы можете представить случай, когда вы запускаете конвейер по определенным действиям и запускаете запланированные задания в dbt Cloud, вы, вероятно, столкнетесь с конфликтами заданий. Чем больше у вас инструментов, тем больше вам нужно убедиться, что все они взаимодействуют друг с другом.

Тем не менее, если **единственная причина, по которой вы хотите использовать конвейеры, это добавление проверки линтинга или запуск при слиянии**, вы можете решить, что плюсы перевешивают минусы, и, таким образом, вы хотите использовать гибридный подход. Просто имейте в виду, что если два процесса попытаются запустить одно и то же задание одновременно, dbt Cloud поставит задания в очередь и выполнит одно за другим. Это балансирующий акт, но его можно достичь с помощью тщательности, чтобы гарантировать, что вы оркестрируете задания таким образом, чтобы они не конфликтовали.

</div>