---
title: "Continuous integration in dbt"
sidebar_label: "Continuous integration"
description: "You can set up continuous integration (CI) checks to test every single change prior to deploying the code to production just like in a software development workflow."
pagination_next: "docs/deploy/advanced-ci"
---

Чтобы реализовать процесс непрерывной интеграции (CI) в <Constant name="cloud" />, вы можете настроить автоматизацию, которая проверяет изменения кода, запуская [CI jobs](/docs/deploy/ci-jobs) перед слиянием изменений в production. <Constant name="cloud" /> отслеживает состояние того, что выполняется в вашем production‑окружении, поэтому при запуске CI job собираются и тестируются только изменённые data assets из вашего pull request (PR) и их downstream‑зависимости — в staging‑схеме.  

Вы также можете просматривать статус CI‑проверок (тестов) прямо из PR; эта информация публикуется в вашем провайдере <Constant name="git" /> сразу после завершения CI job. Кроме того, вы можете включить настройки в вашем провайдере <Constant name="git" />, которые разрешают одобрение PR для слияния только при успешном прохождении CI‑проверок.  

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-workflow.png" width="90%" title="Workflow of continuous integration in dbt"/>

Использование CI помогает:

- Обеспечить повышенную уверенность и гарантии, что изменения в проекте будут работать в производственной среде, как ожидалось.
- Сократить время, необходимое для внедрения изменений в код в производственную среду, благодаря автоматизации сборки и тестирования, что приводит к лучшим бизнес-результатам.
- Позволить организациям вносить изменения в код стандартизированным и управляемым образом, который обеспечивает качество кода без ущерба для скорости.

## Как работает CI {#how-ci-works}

Когда вы [настраиваете CI jobs](/docs/deploy/ci-jobs#set-up-ci-jobs), <Constant name="cloud" /> ожидает уведомление от вашего провайдера <Constant name="git" /> о том, что был открыт новый PR или в существующий PR были добавлены новые коммиты. Когда <Constant name="cloud" /> получает такое уведомление, он ставит в очередь новый запуск CI job.

<Constant name="cloud" /> собирает и тестирует модели, семантические модели, метрики и сохранённые запросы, на которые повлияло изменение кода, во временной схеме, уникальной для конкретного PR. Этот процесс гарантирует, что код собирается без ошибок и соответствует ожиданиям, определённым dbt‑тестами проекта. Уникальное имя схемы формируется по соглашению `dbt_cloud_pr_<job_id>_<pr_id>` (например, `dbt_cloud_pr_1862_1704`) и может быть найдено в деталях запуска соответствующего run, как показано на изображении ниже:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" width="90%" title="Просмотр имени временной схемы для запуска, вызванного PR"/>

Когда выполнение CI завершится, вы сможете посмотреть статус запуска прямо в рамках pull request. <Constant name="cloud" /> обновляет pull request в GitHub, GitLab или Azure DevOps, добавляя статусное сообщение с результатами запуска. В этом сообщении указывается, были ли модели и тесты выполнены успешно или нет.

<Constant name="cloud" /> удаляет временную схему из вашего <Term id="data-warehouse" /> при закрытии или слиянии pull request. Если в вашем проекте используется кастомизация схем с помощью макроса [generate_schema_name](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name), <Constant name="cloud" /> может не удалить временную схему из вашего хранилища данных. Подробнее см. в разделе [Troubleshooting](/docs/deploy/ci-jobs#troubleshooting).

import GitProvidersCI from '/snippets/_git-providers-supporting-ci.md';

<GitProvidersCI />

## Различия между CI задачами и другими задачами развертывания {#differences-between-ci-jobs-and-other-deployment-jobs}

Планировщик [<Constant name="cloud" />](/docs/deploy/job-scheduler) выполняет CI‑задачи иначе, чем другие задачи деплоя, по следующим важным причинам:

- [**Параллельные CI‑проверки**](#concurrent-ci-checks) &mdash; CI‑запуски, инициированные одной и той же CI‑задачей <Constant name="cloud" />, при необходимости выполняются одновременно (параллельно).
- [**Умная отмена устаревших сборок**](#smart-cancellation-of-stale-builds) &mdash; Автоматически отменяет устаревшие, уже запущенные CI‑запуски, когда в PR появляются новые коммиты.
- [**Использование run slot**](#run-slot-treatment) &mdash; CI‑запуски не занимают run slot.
- [**SQL‑линтинг**](#sql-linting) &mdash; При включении автоматически выполняет линтинг всех SQL‑файлов в вашем проекте как шаг запуска перед сборкой CI‑задачи.

### Параллельные CI‑проверки <Lifecycle status="self_service,managed,managed_plus" /> {#concurrent-ci-checks}

Когда несколько участников команды работают над одним и тем же dbt‑проектом и создают pull request’ы в одном репозитории dbt, будет запускаться одна и та же CI‑задача. Поскольку каждый запуск выполняет сборку в выделенной временной схеме, привязанной к конкретному pull request’у, <Constant name="cloud" /> может безопасно выполнять CI‑запуски _параллельно_, а не _последовательно_ (в отличие от deployment‑задач <Constant name="cloud" />). Так как нет необходимости ждать завершения одного CI‑запуска перед началом другого, параллельные CI‑проверки позволяют всей команде быстрее тестировать и интегрировать dbt‑код.

Ниже описаны условия, при которых проверки CI выполняются параллельно и когда они не выполняются:

- CI-запуски с разными номерами PR выполняются параллельно.  
- CI-запуски с _одинаковым_ номером PR и _разными_ commit SHA выполняются последовательно, потому что они собираются в одну и ту же схему. <Constant name="cloud" /> запустит сборку для последнего коммита и отменит все более старые, устаревшие коммиты. Подробности см. в разделе [Smart cancellation of stale builds](#smart-cancellation).  
- CI-запуски с одинаковым номером PR и одинаковым commit SHA, запущенные из разных проектов <Constant name="cloud" />, будут выполнять задания параллельно. Такая ситуация возможна, если два CI-задания настроены в разных проектах <Constant name="cloud" />, которые используют один и тот же репозиторий dbt.

### Умная отмена устаревших сборок <Lifecycle status="self_service,managed,managed_plus" /> {#smart-cancellation-of-stale-builds}

Когда вы отправляете новый коммит в PR, <Constant name="cloud" /> ставит в очередь новый CI-запуск для последнего коммита и отменяет любой CI-запуск, который стал (к этому моменту) устаревшим и всё ещё выполняется. Это может происходить, если вы отправляете новые коммиты, пока предыдущая CI-сборка ещё находится в процессе выполнения и не завершилась. Отменяя такие запуски безопасным и контролируемым образом, <Constant name="cloud" /> помогает повысить продуктивность и сократить затраты на платформу данных за счёт уменьшения числа бесполезных CI-запусков.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-smart-cancel-job.png" width="70%" title="Пример автоматически отмененного запуска"/>

### Обработка run slot <Lifecycle status="self_service,managed,managed_plus" /> {#run-slot-treatment}

CI запуски не занимают слоты запуска. Это гарантирует, что проверка CI никогда не заблокирует производственный запуск.

### SQL‑линтинг <Lifecycle status="self_service,managed,managed_plus" /> {#sql-linting}

Доступно для [треков релизов <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks) и аккаунтов <Constant name="cloud" /> уровней Starter или Enterprise.

Когда [включено для вашего CI‑задания](/docs/deploy/ci-jobs#set-up-ci-jobs), dbt вызывает [SQLFluff](https://sqlfluff.com/) — модульный и настраиваемый SQL‑линтер, который предупреждает о сложных функциях, ошибках синтаксиса, форматирования и компиляции.

По умолчанию SQL‑линтинг проверяет все изменённые SQL‑файлы в вашем проекте (по сравнению с последним отложенным состоянием production). Обратите внимание, что [snapshots](/docs/build/snapshots) могут быть определены как в YAML, так и в `.sql` файлах, однако их SQL не подлежит линтингу и может вызывать ошибки во время проверки. Чтобы SQLFluff не проверял файлы snapshots, добавьте директорию snapshots в файл `.sqlfluffignore` (например, `snapshots/`). Подробнее см. в разделе [линтинг snapshots](/docs/cloud/studio-ide/lint-format#snapshot-linting).

Если линтер обнаруживает ошибки, вы можете указать, должен ли dbt остановить выполнение задачи при ошибке или продолжить выполнение при ошибке. При отказе от задач это помогает снизить затраты на вычисления, избегая сборок для pull requests, которые не соответствуют вашему CI проверке качества SQL кода.

#### Чтобы настроить линтинг SQLFluff: {#to-configure-sqlfluff-linting}
Вы можете при необходимости настроить правила линтинга SQLFluff, чтобы переопределить поведение линтинга по умолчанию.

- Используйте [файлы конфигурации SQLFluff](https://docs.sqlfluff.com/en/stable/configuration/setting_configuration.html#configuration-files), чтобы переопределить поведение линтера по умолчанию в dbt.
- Создайте файл конфигурации `.sqlfluff` в своём проекте, добавьте в него правила линтинга, и <Constant name="cloud" /> будет использовать их при проверке.
    - При настройке вы можете указать `dbt` в качестве шаблонизатора (например, `templater = dbt`)
    - Если вы используете <Constant name="cloud_ide" />, CLI <Constant name="cloud" /> или любой другой редактор, обратитесь к разделу [Customize linting](/docs/cloud/studio-ide/lint-format#customize-linting), где описано, как добавить специфичные для dbt (или dbtonic) правила линтинга, которые мы используем в собственных проектах.
- Подробную информацию см. в разделе [Custom Usage](https://docs.sqlfluff.com/en/stable/gettingstarted.html#custom-usage) документации SQLFluff.
