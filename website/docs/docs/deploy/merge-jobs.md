---
title: "Merge jobs в dbt"
sidebar_label: "Merge jobs"
description: "Узнайте, как запускать выполнение dbt‑джоба при слиянии pull request в Git."
---

# Merge jobs в dbt <Lifecycle status="self_service,managed" /> {#merge-jobs-in-dbt}

Вы можете настроить merge job для реализации workflow непрерывного развертывания (continuous deployment, CD) в <Constant name="cloud" />. Merge job запускает dbt‑джоб в момент, когда кто‑то сливает Git pull request в production. Такой workflow создаёт бесшовный процесс разработки, при котором изменения в коде автоматически обновляют production‑данные. Кроме того, этот workflow можно использовать для запуска `dbt compile`, чтобы обновлять manifest окружения — это делает последующие запуски CI‑джобов более производительными.

Используя CD в <Constant name="cloud" />, вы можете воспользоваться deferral, чтобы собирать только изменённую модель и все downstream‑изменения. При использовании merge jobs состояние обновляется практически мгновенно, что позволяет всегда иметь самую актуальную информацию о состоянии в [<Constant name="explorer" />](/docs/explore/explore-projects).

:::note Запуск задач слияния в монорепозиториях
Если у вас monorepo с несколькими dbt‑проектами, слияние одного pull request в одном из проектов приведёт к запуску джобов для всех проектов, подключённых к этому monorepo. Чтобы избежать этого, вы можете использовать отдельные target‑ветки для каждого проекта (например, `main-project-a`, `main-project-b`) и тем самым разделить CI‑триггеры.
:::

## Предварительные требования {#prerequisites}

- У вас есть учетная запись <Constant name="cloud" />.
- Вы настроили [подключение к вашему провайдеру <Constant name="git" />](/docs/cloud/git/git-configuration-in-dbt-cloud). Эта интеграция позволяет <Constant name="cloud" /> запускать задания от вашего имени при их триггере.
  - Если вы используете нативную интеграцию [GitLab](/docs/cloud/git/connect-gitlab), вам нужен платный или self-hosted аккаунт с поддержкой GitLab webhooks и [project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html). Если вы используете GitLab Free, merge requests будут запускать CI jobs, но обновления статуса CI job (успешное завершение или ошибка) не будут передаваться обратно в GitLab.
- Для deferral (по умолчанию) убедитесь, что в окружении, на которое вы ссылаетесь при deferral, был как минимум один успешный запуск задания.

## Настройка триггера задания при merge в Git {#set-up-merge-jobs}

1. На странице вашего окружения для деплоя нажмите **Create job** > **Merge job**.
1. Параметры в разделе **Job settings**:
    - **Job name** &mdash; Укажите имя merge job.
    - **Description** &mdash; Добавьте описание задания.
    - **Environment** &mdash; По умолчанию установлено окружение, из которого вы создавали задание.
1. В разделе **<Constant name="git" /> trigger** опция **Run on merge** включена по умолчанию. Каждый раз, когда PR выполняет merge (в базовую ветку, настроенную в окружении) в вашем репозитории <Constant name="git" />, это задание будет запускаться.
1. Параметры в разделе **Execution settings**:
    - **Commands** &mdash; По умолчанию включает команду `dbt build --select state:modified+`. Это сообщает <Constant name="cloud" />, что нужно собирать только новые или измененные модели и их downstream-зависимости. Важно: сравнение состояния возможно только когда выбрано deferred-окружение, с которым сравнивается state. Нажмите **Add command**, чтобы добавить другие [команды](/docs/deploy/job-commands), которые должны выполняться при запуске этого задания.
    - **Compare changes against** &mdash; По умолчанию настроено сравнение изменений с окружением, из которого вы создали задание. Эта опция позволяет <Constant name="cloud" /> сравнить состояние кода в PR с кодом, выполняющимся в deferred-окружении, чтобы проверять только измененный код, вместо сборки полной таблицы или всего DAG. Чтобы изменить настройки по умолчанию, вы можете выбрать **No deferral**, **This job** для self-deferral или выбрать другое окружение.
1. (опционально) Параметры в разделе **Advanced settings**:
    - **Environment variables** &mdash; Определите [переменные окружения](/docs/build/environment-variables), чтобы настроить поведение проекта при запуске этого задания.
    - **Target name** &mdash; Определите [имя target](/docs/build/custom-target-names). Аналогично переменным окружения, эта опция позволяет настроить поведение проекта.
    - **Run timeout** &mdash; Отменить это задание, если время выполнения превышает значение таймаута.
    - **dbt version** &mdash; По умолчанию наследуется [версия dbt](/docs/dbt-versions/core) из окружения. dbt Labs настоятельно рекомендует не менять настройку по умолчанию. Возможность менять версию на уровне задания полезна только при обновлении проекта до следующей версии dbt; в противном случае несовпадение версий окружения и задания может приводить к непредсказуемому поведению.
    - **Threads** &mdash; По умолчанию установлено 4 [потока](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Увеличьте количество потоков, чтобы повысить параллельность выполнения моделей.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-create-merge-job.png" title="Пример создания merge job"/>

## Проверьте push-события в Git {#verify-push-events-in-git}

Merge-задания требуют push-событий, поэтому убедитесь, что они включены у вашего провайдера <Constant name="git" />, особенно если интеграция с <Constant name="git" /> была настроена ранее. Для новой интеграции этот шаг можно пропустить, так как push-события обычно включены по умолчанию.

<Expandable alt_header="Пример для GitHub" >

Ниже приведён пример для GitHub, когда push-события уже настроены:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-github-push-events.png" title="Пример включённой опции Pushes в настройках GitHub"/>

</Expandable>

<Expandable alt_header="Пример для GitLab" >

Ниже приведён пример для GitLab, когда push-события уже настроены:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-gitlab-push-events.png" title="Пример включённой опции Push events в настройках GitLab"/>

</Expandable>

<Expandable alt_header="Пример для Azure DevOps" >

Ниже показан пример создания нового триггера **Code pushed** в Azure DevOps. Если push-события ещё не настроены, создайте новую подписку service hooks для событий отправки кода:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-azuredevops-new-event.png" title="Пример создания нового триггера push-событий в Azure DevOps"/>

</Expandable>
