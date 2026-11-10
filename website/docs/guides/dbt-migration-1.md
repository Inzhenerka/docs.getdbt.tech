---
title: 'Переход на платформу dbt: начало работы'
id: dbt-migration-1
description: "Узнайте, как перейти на платформу dbt и что понадобится для начала работы."
hoverSnippet: "Узнайте, как перейти на платформу dbt."
icon: 'guides'
time_to_complete: 'Общее расчетное время: 3–4 часа'
hide_table_of_contents: true
tags: ['Migration', 'dbt platform']
keywords: ['dbt v1','dbt platform','Migration', 'Move dbt', 'Migrate dbt']
level: 'Средний'
---

<div style={{maxWidth: '900px'}}>

## Введение

Переход с самостоятельно развернутого dbt на <Constant name="dbt_platform" /> упрощает рабочие процессы аналитической инженерии, позволяя командам разрабатывать, тестировать, развертывать и исследовать продукты данных в едином полностью управляемом программном сервисе. Слой данных — основа надежной аналитики и ИИ; <Constant name="dbt_platform" /> предоставляет средства управления, общие определения и надежность для масштабирования обоих направлений &mdash; без скрытых затрат самостоятельного размещения в виде рабочего времени инженеров и неэффективного использования вычислительных ресурсов.

Изучите нашу серию руководств из трех частей о переходе с самостоятельно развернутого dbt на <Constant name="dbt_platform" />. Эта серия идеально подходит пользователям, которые стремятся упростить рабочие процессы и расширить возможности аналитики:

import CoreMigrationTable from '/snippets/_core-migration-table.md';

<CoreMigrationTable/>

<Expandable alt_header="Что такое dbt?">

   - <Constant name="dbt_platform" /> — самый быстрый и надежный способ развертывания dbt. Платформа позволяет разрабатывать, тестировать, развертывать и исследовать продукты данных в едином полностью управляемом сервисе. Управление инфраструктурой берет на себя платформа &mdash; без самописных скриптов и ненадежной оркестрации. Оркестрация с учетом состояния обрабатывает только то, что изменилось, сокращая расход вычислительных ресурсов и времени. Разработка в браузере и dbt Wizard позволяют аналитикам участвовать в разработке, поэтому вам больше не приходится лично заниматься каждым изменением. Благодаря сквозной информации о происхождении данных, общим определениям метрик и CI, выявляющей регрессии до развертывания в рабочей среде, вы тратите меньше времени на отладку и больше — на разработку.
   <Constant name="dbt_platform" /> также поддерживает:
     - Инструменты разработки для разных ролей ([<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) или [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation))
     - Готовые [рабочие процессы CI/CD](/docs/deploy/ci-jobs)
     - [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) для согласованного определения метрик
     - Владение данными на уровне доменов с помощью многопроектных конфигураций [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro)
     - [<Constant name="catalog" />](/docs/explore/explore-projects) для упрощения поиска и понимания данных

   Подробнее о [возможностях <Constant name="dbt_platform" />](/docs/platform/about-platform/dbt-platform-features).
- <Constant name="dbt" /> — инструмент с открытым исходным кодом, который позволяет командам по работе с данными определять и выполнять преобразования данных в облачном хранилище, следуя лучшим практикам аналитической инженерии. Такой подход может хорошо работать для отдельных специалистов и небольших технических команд, однако вся разработка ведется через интерфейс командной строки (CLI), а развертывание и сопровождение в рабочей среде необходимо обеспечивать самостоятельно.

Вы берете на себя затраты на каждое обновление, каждый сбой запуска CI и каждый запрос, который отвлекает вас от основной работы: обслуживание инфраструктуры, отладку конвейера CI и обработку каждого изменения, требующего доступа к CLI. Использование вычислительных ресурсов остается без контроля, обновления сопряжены с рисками, а простого способа выяснить, что сломалось и почему, нет. Все это требует значительных и дорогостоящих усилий по сопровождению и масштабированию, которые со временем только растут &mdash; при этом отсутствуют средства управления, общие определения и надежное тестирование.

</Expandable>

## Чему вы научитесь

В этом руководстве описаны шаги для перехода с самостоятельно развернутого dbt на <Constant name="dbt_platform" /> и основные необходимые технические изменения:

- [Настройка учетной записи](/guides/dbt-migration-1?step=4): узнайте, как создать учетную запись <Constant name="dbt_platform" />, пригласить участников команды и настроить ее для совместной работы.
- [Настройка платформы данных](/guides/dbt-migration-1?step=5): узнайте, как подключить вашу платформу данных к <Constant name="dbt_platform" />.
- [Настройка <Constant name="git" />](/guides/dbt-migration-1?step=6): научитесь связывать репозиторий <Constant name="git" /> вашего проекта dbt с <Constant name="dbt_platform" />.
- [Настройка для разработчиков:](/guides/dbt-migration-1?step=7) разберитесь, какие настройки необходимы для разработки в <Constant name="dbt_platform" />.
- [Переменные окружения](/guides/dbt-migration-1?step=8): узнайте, как управлять переменными окружения в <Constant name="dbt_platform" />, включая их приоритет.
- [Настройка оркестрации](/guides/dbt-migration-1?step=9): узнайте, как подготовить среду и задания <Constant name="dbt_platform" /> для оркестрации.
- [Настройка моделей](/guides/dbt-migration-1?step=10): узнайте, как проверять и запускать модели в <Constant name="dbt_platform" /> с помощью <Constant name="studio_ide" /> или CLI <Constant name="dbt_platform" />.
- [Что дальше?](/guides/dbt-migration-1?step=11): подведите итоги и узнайте, что вас ждет в следующих руководствах.

### Связанная документация
- [Изучение <Constant name="dbt" />](https://learn.getdbt.com) — видеообучение в удобное время.
- Запишитесь на [демонстрации с экспертами](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts), чтобы получить полезные рекомендации
- Обратитесь к команде [профессиональных услуг dbt Labs](https://www.getdbt.com/dbt-labs/services) за поддержкой вашей команды по работе с данными и помощью при миграции.

## Предварительные требования

- У вас есть существующий проект <Constant name="dbt" />, подключенный к репозиторию <Constant name="git" /> и платформе данных, которую поддерживает [<Constant name="dbt_platform" />](/docs/platform/connect-data-platform/about-connections).
- У вас есть учетная запись <Constant name="dbt_platform" />. **[Еще нет? Начните бесплатный пробный период сегодня](https://www.getdbt.com/signup)**!

## Настройка учетной записи

В этом разделе описаны шаги по созданию учетной записи <Constant name="dbt_platform" /> и ее настройке для вашей команды.

1. [Создайте учетную запись <Constant name="dbt_platform" />](https://www.getdbt.com/signup).

2. Предоставьте пользователям [доступ](/docs/platform/manage-access/about-user-access) и [пригласите их](/docs/platform/manage-access/about-user-access) в свою учетную запись и проект <Constant name="dbt_platform" />.

3. Настройте [единый вход (SSO)](/docs/platform/manage-access/sso-overview) или [управление доступом на основе ролей (RBAC)](/docs/platform/manage-access/about-user-access#role-based-access-control) для удобного и безопасного доступа. <Lifecycle status="managed,managed_plus" />
   - Это устраняет необходимость хранить пароли и секретные переменные окружения локально.

### Дополнительная настройка
Рассмотрите эти дополнительные настройки для повышения производительности и надежности:

1. В разделе **Account settings** включите [частичный разбор](/docs/platform/account-settings#partial-parsing), чтобы повторно разбирать только измененные файлы и экономить время.

2. В разделе **Account settings** включите [кэширование репозитория Git](/docs/platform/account-settings#git-repository-caching) для повышения надежности заданий и защиты от сбоев сторонних сервисов. <Lifecycle status="managed,managed_plus" />

## Настройка платформы данных

В этом разделе описаны особенности и способы подключения вашей платформы данных к <Constant name="dbt_platform" />.

1. В <Constant name="dbt_platform" /> настройте [подключения к платформе данных](/docs/platform/connect-data-platform/about-connections) и [переменные окружения](/docs/build/environment-variables). <Constant name="dbt_platform" /> поддерживает подключение к платформам данных различных поставщиков, включая:
   - [AlloyDB](/docs/platform/connect-data-platform/connect-postgresql-alloydb)
   - [Amazon Athena](/docs/platform/connect-data-platform/connect-amazon-athena)
   - [Amazon Redshift](/docs/platform/connect-data-platform/connect-redshift)
   - [Apache Spark](/docs/platform/connect-data-platform/connect-apache-spark)
   - [Azure Synapse Analytics](/docs/platform/connect-data-platform/connect-azure-synapse-analytics)
   - [Databricks](/docs/platform/connect-data-platform/connect-databricks)
   - [Google BigQuery](/docs/platform/connect-data-platform/connect-bigquery)
   - [Microsoft Fabric](/docs/platform/connect-data-platform/connect-microsoft-fabric)
   - [PostgreSQL](/docs/platform/connect-data-platform/connect-postgresql-alloydb)
   - [Snowflake](/docs/platform/connect-data-platform/connect-snowflake)
   - [Starburst или Trino](/docs/platform/connect-data-platform/connect-starburst-trino)
   - [Teradata](/docs/platform/connect-data-platform/connect-teradata)

2. Вы можете проверить подключения к платформе данных, нажав кнопку **Test connection** в настройках учетных данных для развертывания и пользователя.

### Дополнительная настройка

Рассмотрите эти дополнительные настройки для дальнейшей оптимизации подключения к платформе данных:

1. Используйте [подключения OAuth](/docs/platform/manage-access/set-up-snowflake-oauth), обеспечивающие безопасную аутентификацию через SSO вашей платформы данных.  <Lifecycle status="managed,managed_plus" />

## Настройка Git

Исходный код вашего существующего проекта dbt должен храниться в репозитории <Constant name="git" />. В этом разделе вы подключите исходный код существующего проекта dbt из <Constant name="git" /> к <Constant name="dbt_platform" />.

1. Убедитесь, что ваш проект dbt находится в репозитории <Constant name="git" />.

2. В разделе **Account settings** выберите **Integrations**, чтобы [подключить репозиторий <Constant name="git" />](/docs/platform/git/configure-git) к <Constant name="dbt_platform" />:
   - (**Рекомендуется**) Подключитесь с помощью одной из [встроенных интеграций](/docs/platform/git/configure-git) в <Constant name="dbt_platform" /> (например, с GitHub, GitLab или Azure DevOps).

     Этот способ предпочтителен благодаря своей простоте, средствам безопасности (включая безопасный вход через OAuth и автоматизированные рабочие процессы, такие как сборки CI для пул-реквестов) и общему удобству использования.
   - [Импортируйте репозиторий <Constant name="git" />](/docs/platform/git/import-a-project-by-git-url), используя любой допустимый URL <Constant name="git" />, который указывает на проект dbt.

## Настройка для разработчиков

В этом разделе описаны настройки, необходимые для разработки проекта <Constant name="dbt" />. Рассматриваются следующие темы:

- [Среды <Constant name="dbt_platform" />](/guides/dbt-migration-1?step=7#dbt-cloud-environments)
- [Шаги первоначальной настройки](/guides/dbt-migration-1?step=7#initial-setup-steps)
- [Дополнительная настройка](/guides/dbt-migration-1?step=7#additional-configuration-2)
- [Команды <Constant name="dbt_platform" />](/guides/dbt-migration-1?step=7#dbt-cloud-commands)

### Среды dbt {#dbt-cloud-environments}

Наиболее распространенные среды работы с данными — рабочая среда (production), промежуточная среда (staging) и среда разработки (development). В самостоятельно развернутом dbt управление [средами](/docs/environments-in-dbt) осуществляется через `target` — различные наборы параметров подключения.

[Среды <Constant name="dbt_platform" />](/docs/dbt-platform-environments) предоставляют дополнительные возможности:
- Интеграция с такими функциями, как планирование заданий и управление версиями, упрощает управление полным жизненным циклом проектов dbt в рамках одной платформы.
- Упрощение переключения между контекстами разработки, промежуточной и рабочей сред.
- Удобная настройка сред через интерфейс <Constant name="dbt_platform" /> вместо ручного редактирования файла `profiles.yml`. Вы также можете [задать](/reference/dbt-jinja-functions/target) или [настроить](/docs/build/custom-target-names) имена целевых подключений в <Constant name="dbt_platform" />.
- Добавление атрибутов `profiles.yml` с помощью [расширенных атрибутов](/docs/dbt-platform-environments#extended-attributes); по ссылке описано, где настраивать их для сред развертывания и разработки.
- Использование [кэширования репозитория Git](/docs/platform/account-settings#git-repository-caching) для защиты от сбоев сторонних сервисов, ошибок аутентификации Git и других проблем. <Lifecycle status="managed,managed_plus" />

### Шаги первоначальной настройки {#initial-setup-steps}
1. **Настройте среду разработки** &mdash; Настройте [среду разработки](/docs/dbt-platform-environments#create-a-development-environment) и [учетные данные пользователя](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide). Это необходимо для доступа к проекту dbt и начала разработки.

2. **Версия <Constant name="dbt" />** &mdash; В среде <Constant name="dbt_platform" /> выберите [канал выпусков](/docs/dbt-versions/dbt-release-tracks) для регулярного обновления версии dbt. Если ваша команда планирует использовать и самостоятельно развернутый dbt, и <Constant name="dbt_platform" /> для разработки или развертывания проекта dbt, выполните `dbt --version` в командной строке, чтобы узнать используемую версию <Constant name="dbt" />.
   - При использовании самостоятельно развернутого dbt вам необходимо следить за используемой версией и самостоятельно управлять обновлениями. В <Constant name="dbt_platform" /> используйте [каналы выпусков](/docs/dbt-versions/dbt-release-tracks), чтобы не заниматься этим вручную.

3. **Подключитесь к платформе данных** &mdash; В <Constant name="dbt_platform" /> вы можете [подключиться к платформе данных](/docs/platform/connect-data-platform/about-connections) непосредственно через пользовательский интерфейс.
   - Каждая среда примерно соответствует записи в файле `profiles.yml`. Это означает, что файл `profiles.yml` в вашем проекте не нужен.

4. **Инструменты разработки** &mdash; Настройте рабочее пространство разработки с помощью [CLI <Constant name="dbt_platform" />](/docs/platform/dbt-cli-installation) (интерфейс командной строки или редактор кода) либо [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) (в браузере), чтобы выполнять сборку, тестирование, запуск и управление версиями кода dbt в удобном для вас инструменте.
   - Если вы ранее установили <Constant name="dbt" />, в [документации по установке CLI <Constant name="dbt_platform" />](/docs/platform/dbt-cli-installation?install=pip#install-dbt-cloud-cli) вы найдете дополнительные сведения об установке CLI <Constant name="dbt_platform" />, создании псевдонимов команд и удалении <Constant name="dbt" /> для плавного перехода.

### Дополнительная настройка {#additional-configuration-2}
Рассмотрите эти дополнительные настройки для дальнейшей оптимизации среды разработчика:

1. **Пользовательские имена целевых подключений** &mdash; Использование [`custom target.names`](/docs/build/custom-target-names) в проектах dbt помогает различать среды (например, среду разработки, промежуточную и рабочую среды). Хотя значения `custom target.name` можно указать в учетных данных для разработки или в настройках оркестрации, мы рекомендуем использовать [переменные окружения](/docs/build/environment-variables). Они обеспечивают более понятный способ работы с различными средами и лучше поддерживаются функцией частичного разбора dbt, в отличие от [логики `{{ target }}`](/reference/dbt-jinja-functions/target), предназначенной для определения подключения к хранилищу данных.

### Команды dbt {#dbt-cloud-commands}
1. Ознакомьтесь с [командами dbt](/reference/dbt-commands), поддерживаемыми при разработке в <Constant name="dbt_platform" />. Например, `dbt init` в <Constant name="dbt_platform" /> не требуется, поскольку новый проект можно создать непосредственно в <Constant name="dbt_platform" />.

## Переменные окружения
Этот раздел поможет вам разобраться, как настраивать переменные окружения <Constant name="dbt_platform" /> для вашего проекта и управлять ими. Рассматриваются следующие темы:
- [Переменные окружения в <Constant name="dbt_platform" />](/guides/dbt-migration-1?step=7#environment-variables-in-dbt-cloud)
- [Порядок приоритета переменных окружения <Constant name="dbt_platform" />](/guides/dbt-migration-1?step=7#dbt-cloud-environment-variables-order-of-precedence)
- [Настройка переменных окружения в <Constant name="dbt_platform" />](/guides/dbt-migration-1?step=7#set-environment-variables-in-dbt-cloud)

В <Constant name="dbt_platform" /> можно задавать [переменные окружения](/docs/build/environment-variables) через пользовательский интерфейс (UI) <Constant name="dbt_platform" />. Подробнее см. в разделе [Настройка переменных окружения](#set-environment-variables-in-dbt-cloud).

В самостоятельно развернутом dbt переменные окружения, используемые в том числе [функцией `env_var`](/reference/dbt-jinja-functions/env_var), определяются вручную разработчиком или во внешнем приложении, запускающем dbt.

### Переменные окружения в dbt {#environment-variables-in-dbt-cloud}
  - Переменные окружения <Constant name="dbt_platform" /> должны начинаться с префикса `DBT_` (включая `DBT_ENV_CUSTOM_ENV_` или `DBT_ENV_SECRET`).
  - Если переменные окружения вашего самостоятельно развернутого dbt не соответствуют этому соглашению об именовании, выполните [поиск и замену](/docs/platform/studio-ide/develop-in-studio#studio-ide-features) в проекте, чтобы все ссылки на эти переменные окружения соответствовали требуемому соглашению.
- <Constant name="dbt_platform" /> защищает переменные окружения, позволяющие более гибко настраивать подключения к хранилищам данных или интеграции с поставщиками Git, и предоставляет дополнительные меры защиты конфиденциальных значений, например добавление к именам переменных префикса `DBT_ENV_SECRET` для их скрытия в журналах и пользовательском интерфейсе.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/Environment Variables/project-environment-view.png" title="Настройка значений на уровне проекта и среды"/>

### Порядок приоритета переменных окружения dbt {#dbt-cloud-environment-variables-order-of-precedence}
Переменные окружения в <Constant name="dbt_platform" /> управляются в соответствии с четким [порядком приоритета](/docs/build/environment-variables#setting-and-overriding-environment-variables), позволяющим задавать значения на четырех уровнях (от высшего приоритета к низшему):
   - Уровень задания (переопределение для задания) или уровень отдельного разработчика в <Constant name="studio_ide" /> (персональное переопределение). _Высший приоритет_
   - Уровень среды, который может быть переопределен на уровне задания или персональным переопределением.
   - Значение по умолчанию для всего проекта, которое может быть переопределено на уровне среды, задания или персональным переопределением.
   - Необязательный аргумент со значением по умолчанию, передаваемый функции Jinja `env_var` в коде. _Низший приоритет_
  
<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/Environment Variables/env-var-precdence.png" title="Порядок приоритета переменных окружения"/>

### Настройка переменных окружения в dbt {#set-environment-variables-in-dbt-cloud}

- Чтобы задать эти переменные для всего проекта или отдельных сред, перейдите на вкладку **Deploy** > **Environments** > **Environment variables**.
- Чтобы задать эти переменные на уровне задания, перейдите в **Deploy** > **Jobs** > **выберите задание** > **Settings** > **Advanced settings**.
- Чтобы задать эти переменные на уровне персонального переопределения, перейдите в **Your profile** > **Credentials** > **выберите проект** > **Environment variables**.

## Настройка оркестрации

В этом разделе описаны особенности и способы настройки сред и заданий <Constant name="dbt_platform" /> для оркестрации. Рассматриваются следующие темы:

- [Среды <Constant name="dbt_platform" />](/guides/dbt-migration-1?step=8#dbt-cloud-environments-1)
- [Шаги первоначальной настройки](/guides/dbt-migration-1?step=8#initial-setup-steps-1)
- [Дополнительная настройка](/guides/dbt-migration-1?step=8#additional-configuration-3)
- [Настройка CI/CD](/guides/dbt-migration-1?step=8#cicd-setup)

### Среды dbt {#dbt-cloud-environments-1}
Чтобы использовать [планировщик заданий <Constant name="dbt_platform" />](/docs/deploy/job-scheduler), настройте одну из сред как рабочую. Это [среда развертывания](/docs/deploy/deploy-environments). Вы можете настроить несколько сред для разных этапов конвейера развертывания, например разработку, промежуточную среду/проверку качества (staging/QA) и рабочую среду.

### Шаги первоначальной настройки {#initial-setup-steps-1}
1. **Версия <Constant name="dbt" />** &mdash; В настройках среды укажите для <Constant name="dbt_platform" /> ту же версию <Constant name="dbt" />, которую используете сейчас.
   - После завершения миграции мы рекомендуем перевести ваши среды на [каналы выпусков](/docs/dbt-versions/dbt-release-tracks), чтобы всегда получать новейшие возможности и другие улучшения. Это нужно сделать только один раз.

2. **Настройте задания** &mdash; [Создайте задания](/docs/deploy/deploy-jobs#create-and-schedule-jobs) dbt для запуска по расписанию или событиям. Можно использовать запуск по cron, вручную, по пул-реквестам или по завершении другого задания.
   - Помимо [заданий в <Constant name="dbt_platform" />](/docs/deploy/jobs), ознакомьтесь с другими способами планирования и запуска заданий dbt с помощью сторонних инструментов. Подробнее см. в разделе [Интеграция с другими инструментами](/docs/deploy/deployment-tools).

### Дополнительная настройка {#additional-configuration-3}
Рассмотрите эти дополнительные настройки для дальнейшей оптимизации оркестрации в <Constant name="dbt_platform" />:

1. **Пользовательские имена целевых подключений** &mdash; Используйте переменные окружения, чтобы задать `custom target.name` на уровне среды для каждого [соответствующего задания <Constant name="dbt_platform" />](/docs/build/custom-target-names).

2. **Команды dbt** &mdash; Добавьте необходимые [команды dbt](/docs/deploy/job-commands) для выполнения заданий <Constant name="dbt_platform" />.

3. **Уведомления** &mdash; Настройте [уведомления](/docs/deploy/job-notifications) по электронной почте и в Slack, чтобы отслеживать выполнение заданий.

4. **Инструменты мониторинга** &mdash; Используйте [инструменты мониторинга](/docs/deploy/monitor-jobs), такие как история запусков, повторные попытки выполнения заданий, цепочки заданий, плитки состояния на панелях мониторинга и другие, для бесперебойной оркестрации.

5. **Доступ к API** &mdash; При необходимости создайте [токены аутентификации API](/docs/dbt-apis/authentication) и настройте доступ к [API <Constant name="dbt_platform" />](/docs/dbt-apis/overview).  <Lifecycle status="self_service,managed" />

6. **<Constant name="catalog" />** &mdash; Если вы используете [<Constant name="catalog" />](/docs/explore/explore-projects) и запускаете задания рабочей среды через внешний оркестратор, убедитесь, что эти задания выполняют `dbt run` или `dbt build` для обновления и просмотра моделей и их [метаданных](/docs/explore/explore-projects#generate-metadata) в <Constant name="catalog" />. Выполнение только `dbt compile` не обновляет метаданные моделей. Кроме того, таким функциям, как отслеживание происхождения данных на уровне столбцов, необходимы метаданные каталога, создаваемые при выполнении `dbt docs generate`. <Lifecycle status="self_service,managed" />

### Настройка CI/CD {#cicd-setup}

Создать собственное решение для эффективной проверки кода при поступлении пул-реквестов непросто. В <Constant name="dbt_platform" /> можно включить [непрерывную интеграцию / непрерывное развертывание (CI/CD)](/docs/deploy/continuous-integration) и настроить запуск проектов dbt во временной схеме при отправке новых коммитов в открытые пул-реквесты.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/ci-workflow.png" width="90%" title="Рабочий процесс непрерывной интеграции в dbt"/>

Эта функция сборки по пул-реквесту — отличный способ выявлять ошибки до развертывания в рабочей среде и важнейший инструмент для специалистов по работе с данными.

1. Настройте встроенную интеграцию с приложением <Constant name="git" /> (например, Azure DevOps, GitHub или GitLab) и среду CI в <Constant name="dbt_platform" />.
2. Создайте [задание CI/CD](/docs/deploy/ci-jobs), чтобы автоматизировать проверки качества до развертывания кода в рабочей среде.
3. Запустите задания в рабочей среде, чтобы полностью реализовать CI/CD. В дальнейшем при обработке пул-реквестов для сравнения также будут использоваться последние запуски в рабочей среде.

## Разработка и исследование моделей

В этом разделе вы сможете проверить, корректно ли выполняются и компилируются ваши модели в выбранном инструменте разработки: [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) или [CLI <Constant name="dbt_platform" />](/docs/platform/dbt-cli-installation).

Убедитесь, что вы настроили [среду разработки и учетные данные](/docs/dbt-platform-environments#set-developer-credentials).

1. В выбранном [инструменте разработки](/docs/platform/about-develop-dbt) просмотрите проект dbt, убедитесь в правильности его настройки и выполните несколько [команд dbt](/reference/dbt-commands):
   - Выполните `dbt compile`, чтобы убедиться, что проект компилируется корректно.
   - Запустите несколько моделей в <Constant name="studio_ide" /> или CLI <Constant name="dbt_platform" />, чтобы убедиться в корректности результатов в среде разработки.

2. После первого успешного выполнения задания в рабочей среде используйте [<Constant name="catalog" />](/docs/explore/explore-projects), чтобы просмотреть [ресурсы](/docs/build/projects) проекта (например, модели, тесты и метрики) и их <Term id="data-lineage" />, чтобы лучше понять последнее состояние проекта в рабочей среде. <Lifecycle status="self_service,managed" />

## Что дальше?

<ConfettiTrigger>

Поздравляем с завершением первой части перехода на <Constant name="dbt_platform" /> 🎉!

Вы узнали:
- Как настроить учетную запись <Constant name="dbt_platform" />
- Как подключить платформу данных и репозиторий <Constant name="git" />
- Как настроить среды разработки, оркестрации и CI/CD
- Как настроить переменные окружения и проверить модели


В качестве следующих шагов продолжите изучение нашей серии руководств из трех частей о переходе с самостоятельно развернутого dbt на <Constant name="dbt_platform" />:


<CoreMigrationTable anchorId="why-move-to-the-dbt-platform-recap" />

### Связанная документация
- [Изучение <Constant name="dbt" />](https://learn.getdbt.com) — видеокурсы для обучения в удобное время.
- Запишитесь на [демонстрации с экспертами](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts), чтобы получить полезные рекомендации.
- Обратитесь к команде [профессиональных услуг dbt Labs](https://www.getdbt.com/dbt-labs/services) за поддержкой вашей команды по работе с данными и помощью при миграции.
- [Сравнение <Constant name="dbt_platform" /> с самостоятельно развернутым dbt](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud) — подробное сопоставление самостоятельно развернутого dbt и <Constant name="dbt_platform" />.
- Подпишитесь на [RSS-уведомления <Constant name="dbt_platform" />](https://status.getdbt.com/)

</ConfettiTrigger>

</div>
