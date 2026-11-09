---
title: "Continuous integration in dbt"
sidebar_label: "Continuous integration"
description: "Learn how CI checks validate changes before you deploy code to production."
pagination_next: "docs/deploy/advanced-ci"
availability: platform_login
---

Чтобы реализовать рабочий процесс непрерывной интеграции (CI) в <Constant name="dbt" />, можно настроить автоматическую проверку изменений кода с помощью [заданий CI](/docs/deploy/ci-jobs) перед слиянием изменений для развертывания в производственной среде. <Constant name="dbt" /> отслеживает состояние объектов, работающих в вашей производственной среде. При запуске задания CI в промежуточной схеме создаются и тестируются только те объекты данных, которые были изменены в вашем pull request (PR), а также зависящие от них объекты.

You can also view the status of the CI checks (tests) directly from within the PR; this information is posted to your <Constant name="git" /> provider as soon as a CI job completes. Additionally, you can enable settings in your <Constant name="git" /> provider that allow PRs only with successful CI checks to be approved for merging.

For workflows that promote changes after a PR merges (merge jobs or other deployment triggers, including triggering jobs manually or through APIs), refer to [Continuous deployment in <Constant name="dbt" />](/docs/deploy/continuous-deployment), including [merge jobs](/docs/deploy/merge-jobs).

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/ci-workflow.png" width="90%" title="Workflow of continuous integration in dbt"/>

Использование CI помогает:

- Обеспечить повышенную уверенность и гарантии, что изменения в проекте будут работать в производственной среде, как ожидалось.
- Сократить время, необходимое для внедрения изменений в код в производственную среду, благодаря автоматизации сборки и тестирования, что приводит к лучшим бизнес-результатам.
- Позволить организациям вносить изменения в код стандартизированным и управляемым образом, который обеспечивает качество кода без ущерба для скорости.

## Как работает CI {#how-ci-works}

Когда вы [настраиваете задания CI](/docs/deploy/ci-jobs#set-up-ci-jobs), <Constant name="dbt" /> ожидает уведомления от вашего провайдера <Constant name="git" /> об открытии нового PR или добавлении новых коммитов в существующий PR. Получив такое уведомление, <Constant name="dbt" /> ставит в очередь новый запуск задания CI.

<Constant name="dbt" /> собирает и тестирует модели, семантические модели, метрики и сохранённые запросы, затронутые изменением кода, во временной схеме, уникальной для каждого PR. Этот процесс позволяет убедиться, что код собирается без ошибок и соответствует ожиданиям, заданным тестами dbt в проекте. Уникальное имя схемы формируется по шаблону `dbt_cloud_pr_<job_id>_<pr_id>` (например, `dbt_cloud_pr_1862_1704`), и его можно найти в сведениях о соответствующем запуске, как показано на следующем изображении:

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/using_ci_dbt_cloud.png" width="90%" title="Просмотр имени временной схемы для запуска, инициированного PR"/>

После завершения запуска CI его статус можно просмотреть непосредственно в пул-реквесте. <Constant name="dbt" /> обновляет пул-реквест в GitHub, GitLab или Azure DevOps, добавляя сообщение о статусе с результатами запуска. В этом сообщении указывается, успешно ли выполнены модели и тесты.

<Constant name="dbt" /> удаляет временную схему из вашего хранилища данных (<Term id="data-warehouse" />), когда вы закрываете или сливаете пул-реквест. Если в вашем проекте настроены пользовательские имена схем с помощью макроса [generate_schema_name](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name), <Constant name="dbt" /> может не удалить временную схему из вашего хранилища данных. Дополнительные сведения см. в разделе [Устранение неполадок](/docs/deploy/ci-jobs#troubleshooting).

import GitProvidersCI from '/snippets/_git-providers-supporting-ci.md';

<GitProvidersCI />

## Различия между CI задачами и другими задачами развертывания {#differences-between-ci-jobs-and-other-deployment-jobs}

[Планировщик <Constant name="dbt" />](/docs/deploy/job-scheduler) выполняет задания CI иначе, чем другие задания развертывания. Вот основные отличия:

- [**Параллельные проверки CI**](#concurrent-ci-checks) &mdash; Планировщик может при необходимости выполнять несколько запусков одного и того же задания CI в <Constant name="dbt" /> одновременно (параллельно).
- [**Интеллектуальная отмена устаревших сборок**](#smart-cancellation-of-stale-builds) &mdash; Планировщик отменяет устаревшие выполняющиеся запуски CI, когда вы отправляете новые коммиты в PR.
- [**Использование слотов запуска**](#run-slot-treatment) &mdash; Запуски CI не занимают слот запуска.
- [**Линтинг SQL**](#sql-linting) &mdash; Если линтинг включен, он выполняется для всех SQL-файлов в вашем проекте отдельным шагом перед сборкой в рамках задания CI.

### Параллельные CI‑проверки <Lifecycle status="self_service,managed,managed_plus" /> {#concurrent-ci-checks}

Когда вы вместе с командой работаете над проектом dbt и открываете пул-реквесты в одном репозитории dbt, одно и то же задание CI может запускаться при каждом событии, соответствующем условиям запуска.

Каждый запуск CI записывает данные в отдельную временную схему, связанную с его пул-реквестом. Такая изоляция позволяет <Constant name="dbt" /> выполнять запуски CI _параллельно_, а не _последовательно_. Этим они отличаются от заданий развертывания <Constant name="dbt" />.

Вам не нужно ждать завершения чужого запуска CI, чтобы началась ваша проверка. Параллельные проверки CI помогают всей команде быстрее тестировать и интегрировать код dbt.

Ниже описаны условия, при которых проверки CI выполняются параллельно, и условия, при которых этого не происходит:

- Запуски CI с разными номерами PR выполняются параллельно.
- Запуски CI с _одинаковым_ номером PR и _разными_ SHA коммитов выполняются последовательно, поскольку они создают объекты в одной и той же схеме. <Constant name="dbt" /> выполнит запуск для последнего коммита и отменит запуски для всех более ранних, устаревших коммитов. Подробнее см. в разделе [Интеллектуальная отмена устаревших сборок](#smart-cancellation-of-stale-builds).
- Запуски CI с одинаковым номером PR и одинаковым SHA коммита по-прежнему могут выполняться параллельно, если они запускаются из разных проектов <Constant name="dbt" />. Это возможно, когда два задания CI настроены в разных проектах <Constant name="dbt" />, использующих один и тот же репозиторий dbt.

### Умная отмена устаревших сборок <Lifecycle status="self_service,managed,managed_plus" /> {#smart-cancellation-of-stale-builds}

Когда вы отправляете новый коммит в PR, <Constant name="dbt" /> ставит в очередь новый запуск CI для последнего коммита и отменяет все ещё выполняющиеся запуски CI, которые к этому моменту устарели. Это может произойти, если вы отправляете новые коммиты, пока сборка CI ещё выполняется и не завершена. Безопасно и целенаправленно отменяя такие запуски, <Constant name="dbt" /> помогает повысить продуктивность и сократить расходы на ненужные запуски CI в платформе данных.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/example-smart-cancel-job.png" width="70%" title="Пример автоматически отменённого запуска"/>

### Обработка run slot <Lifecycle status="self_service,managed,managed_plus" /> {#run-slot-treatment}

CI запуски не занимают слоты запуска. Это гарантирует, что проверка CI никогда не заблокирует производственный запуск.

### SQL‑линтинг <Lifecycle status="self_service,managed,managed_plus" /> {#sql-linting}

Доступно в [каналах выпусков <Constant name="dbt" />](/docs/dbt-versions/dbt-release-tracks) и для учетных записей <Constant name="dbt" /> на тарифах Starter или Enterprise.

Если [линтинг включен для вашего задания CI](/docs/deploy/ci-jobs#set-up-ci-jobs), dbt проверяет измененные SQL-файлы в вашем проекте. При запусках v1 dbt вызывает [SQLFluff](https://sqlfluff.com/) — модульный настраиваемый SQL-линтер. При запусках v2 dbt вместо этого использует встроенную команду `dbt lint` (см. ниже). Линтинг предупреждает о сложных функциях, ошибках синтаксиса, форматирования и компиляции.

import V2CILintingNote from '/snippets/_v2-ci-linting-note.md';

<V2CILintingNote />

Сведения об ожидаемом соответствии правил `dbt lint` и SQLFluff см. в разделе [Соответствие правил SQLFluff](/reference/commands/lint?version=2.0#rule-parity-with-sqlfluff).

По умолчанию SQL-линтинг проверяет все SQL-файлы в вашем проекте, измененные по сравнению с последним состоянием производственной среды, используемым для defer.

Если dbt не может найти коммит для этого состояния defer, запуск не завершается с ошибкой из-за линтинга. dbt выводит предупреждение с SHA коммита, который не удалось найти, и вместо этого проверяет весь проект. Чтобы обновить базовое состояние для сравнения, повторно запустите задание, на которое ссылается defer.

Обратите внимание, что [снимки (snapshots)](/docs/build/snapshots) можно определять в YAML-файлах _и_ в файлах `.sql`. Их SQL-код не поддерживает проверку линтером и может вызывать ошибки при линтинге.

Чтобы SQLFluff не проверял файлы снимков, добавьте каталог снимков в файл `.sqlfluffignore` (например, `snapshots/`). Дополнительные сведения см. в разделе [Линтинг снимков](/docs/platform/studio-ide/lint-format#snapshot-linting).

Если линтер обнаруживает ошибки, вы можете указать, должен ли dbt остановить выполнение задачи при ошибке или продолжить выполнение при ошибке. При отказе от задач это помогает снизить затраты на вычисления, избегая сборок для pull requests, которые не соответствуют вашему CI проверке качества SQL кода.

#### Настройка линтинга SQLFluff {#to-configure-sqlfluff-linting}

При необходимости вы можете настроить правила линтинга SQLFluff, чтобы переопределить поведение линтинга по умолчанию.

- Используйте [файлы конфигурации SQLFluff](https://docs.sqlfluff.com/en/stable/configuration/setting_configuration.html#configuration-files), чтобы переопределить поведение линтинга по умолчанию в dbt.
- Создайте в проекте файл конфигурации `.sqlfluff`, добавьте в него правила линтинга, и <Constant name="dbt" /> будет использовать их при проверке.
    - При настройке можно использовать `dbt` в качестве шаблонизатора (например, `templater = dbt`)
    - Если вы используете <Constant name="studio_ide" />, <Constant name="dbt" /> CLI или любой другой редактор, обратитесь к разделу [Настройка линтинга](/docs/platform/studio-ide/lint-format#customize-linting), чтобы узнать, как добавить специфичные для dbt (или dbtonic) правила линтинга, которые мы используем в собственном проекте.
- Подробную информацию см. в разделе [Нестандартное использование](https://docs.sqlfluff.com/en/stable/gettingstarted.html#custom-usage) документации SQLFluff.
