---
title: 'Переход с dbt Core на dbt Cloud: Начало работы'
id: core-to-cloud-1
description: "Узнайте, как перейти с dbt Core на dbt Cloud и что для этого нужно."
hoverSnippet: "Узнайте, как перейти с dbt Core на dbt Cloud."
icon: 'guides'
time_to_complete: 'Общее время выполнения: 3-4 часа'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt Cloud']
keywords: ['dbt Core','dbt Cloud','Migration', 'Move dbt', 'Migrate dbt']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Переход с dbt Core на dbt Cloud упрощает рабочие процессы аналитической инженерии, позволяя командам разрабатывать, тестировать, развертывать и исследовать продукты данных с помощью единого полностью управляемого программного сервиса.

Изучите нашу серию из 3-х частей о переходе с dbt Core на dbt Cloud. Эта серия идеально подходит для пользователей, стремящихся к упрощенным рабочим процессам и улучшенной аналитике:

import CoretoCloudTable from '/snippets/_core-to-cloud-guide-table.md';

<CoretoCloudTable/>

<Expandable alt_header="Что такое dbt Cloud и dbt Core?">

   - dbt Cloud — это самый быстрый и надежный способ развертывания dbt. Он позволяет разрабатывать, тестировать, развертывать и исследовать продукты данных с помощью единого полностью управляемого сервиса. Он также поддерживает:
     - Опыт разработки, адаптированный для различных ролей ([dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) или [dbt Cloud CLI](/docs/cloud/cloud-cli-installation))
     - Готовые [CI/CD рабочие процессы](/docs/deploy/ci-jobs)
     - [Семантический слой dbt](/docs/use-dbt-semantic-layer/dbt-sl) для согласованных метрик
     - Владение данными на уровне домена с многопроектными настройками [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro)
     - [dbt Explorer](/docs/collaborate/explore-projects) для упрощенного поиска и понимания данных

   Узнайте больше о [функциях dbt Cloud](/docs/cloud/about-cloud/dbt-cloud-features).
- dbt Core — это инструмент с открытым исходным кодом, который позволяет командам данных определять и выполнять преобразования данных в облачном хранилище данных, следуя лучшим практикам аналитической инженерии. Хотя это может хорошо работать для «одиночных игроков» и небольших технических команд, вся разработка происходит в интерфейсе командной строки, а производственные развертывания должны быть самостоятельно размещены и поддерживаться. Это требует значительных затрат времени и ресурсов на поддержание и масштабирование.

</Expandable>

## Чему вы научитесь

Это руководство описывает шаги, которые необходимо предпринять для перехода с dbt Core на dbt Cloud, и подчеркивает необходимые технические изменения:

- [Настройка аккаунта](https://docs.getdbt.com/guides/core-to-cloud-1?step=4): Узнайте, как создать аккаунт dbt Cloud, пригласить членов команды и настроить его для вашей команды.
- [Настройка платформы данных](https://docs.getdbt.com/guides/core-to-cloud-1?step=5): Узнайте, как подключить вашу платформу данных к dbt Cloud.
- [Настройка Git](https://docs.getdbt.com/guides/core-to-cloud-1?step=6): Узнайте, как связать репозиторий Git вашего проекта dbt с dbt Cloud.
- [Настройка разработчика](https://docs.getdbt.com/guides/core-to-cloud-1?step=7): Поймите, какая настройка необходима для разработки в dbt Cloud.
- [Переменные окружения](https://docs.getdbt.com/guides/core-to-cloud-1?step=8): Узнайте, как управлять переменными окружения в dbt Cloud, включая их приоритет.
- [Настройка оркестрации](https://docs.getdbt.com/guides/core-to-cloud-1?step=9): Узнайте, как подготовить вашу среду и задания dbt Cloud для оркестрации.
- [Конфигурация моделей](https://docs.getdbt.com/guides/core-to-cloud-1?step=10): Получите представление о проверке и запуске ваших моделей в dbt Cloud, используя либо dbt Cloud IDE, либо dbt Cloud CLI.
- [Что дальше?](https://docs.getdbt.com/guides/core-to-cloud-1?step=11): Подводит итоги ключевых выводов и вводит в курс того, чего ожидать в следующих руководствах.

### Связанные документы
- [Изучите dbt Cloud](https://learn.getdbt.com) с помощью видеоуроков по запросу.
- Забронируйте [демонстрации с экспертами](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) и получите инсайты.
- Работайте с командой [Профессиональных услуг dbt Labs](https://www.getdbt.com/dbt-labs/services) для поддержки вашей организации данных и миграции.

## Предварительные требования

- У вас есть существующий проект dbt Core, подключенный к репозиторию Git и платформе данных, поддерживаемой в [dbt Cloud](/docs/cloud/connect-data-platform/about-connections).
- У вас есть аккаунт dbt Cloud. **[Нет аккаунта? Начните бесплатную пробную версию сегодня](https://www.getdbt.com/signup)**!

## Настройка аккаунта

Этот раздел описывает шаги по настройке вашего аккаунта dbt Cloud и его конфигурации для вашей команды.

1. [Создайте ваш аккаунт dbt Cloud](https://www.getdbt.com/signup).

2. Предоставьте [доступ пользователям](/docs/cloud/manage-access/about-user-access) и [пригласите пользователей](/docs/cloud/manage-access/about-user-access) в ваш аккаунт и проект dbt Cloud.

3. Настройте [Единый вход (SSO)](/docs/cloud/manage-access/sso-overview) или [Контроль доступа на основе ролей (RBAC)](/docs/cloud/manage-access/about-user-access#role-based-access-control) для легкого и безопасного доступа. <Lifecycle status='enterprise' />
   - Это устраняет необходимость сохранять пароли и секретные переменные окружения локально.

### Дополнительная конфигурация
Изучите эти дополнительные конфигурации для улучшения производительности и надежности:

1. В **Настройках аккаунта** включите [частичный парсинг](/docs/cloud/account-settings#partial-parsing), чтобы перепарсить только измененные файлы, экономя время.

2. В **Настройках аккаунта** включите [кэширование репозитория Git](/docs/cloud/account-settings#git-repository-caching) для надежности работы и защиты от сбоев сторонних сервисов. <Lifecycle status='enterprise' />

## Настройка платформы данных

Этот раздел описывает соображения и методы подключения вашей платформы данных к dbt Cloud.

1. В dbt Cloud настройте ваши [подключения платформы данных](/docs/cloud/connect-data-platform/about-connections) и [переменные окружения](/docs/build/environment-variables). dbt Cloud может подключаться к различным поставщикам платформ данных, включая:
   - [AlloyDB](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
   - [Amazon Athena](/docs/cloud/connect-data-platform/connect-amazon-athena) (бета)
   - [Amazon Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
   - [Apache Spark](/docs/cloud/connect-data-platform/connect-apache-spark) 
   - [Azure Synapse Analytics](/docs/cloud/connect-data-platform/connect-azure-synapse-analytics)
   - [Databricks](/docs/cloud/connect-data-platform/connect-databricks) 
   - [Google BigQuery](/docs/cloud/connect-data-platform/connect-bigquery)
   - [Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric)
   - [PostgreSQL](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)
   - [Snowflake](/docs/cloud/connect-data-platform/connect-snowflake)
   - [Starburst или Trino](/docs/cloud/connect-data-platform/connect-starburst-trino)

2. Вы можете проверить ваши подключения к платформе данных, нажав кнопку **Тестировать подключение** в настройках ваших учетных данных для развертывания и разработки.

### Дополнительная конфигурация

Изучите эти дополнительные конфигурации для дальнейшей оптимизации настройки вашей платформы данных:

1. Используйте [OAuth-подключения](/docs/cloud/manage-access/set-up-snowflake-oauth), которые позволяют безопасную аутентификацию с использованием SSO вашей платформы данных. <Lifecycle status='enterprise' />

## Настройка Git

Исходный код вашего существующего проекта dbt должен находиться в репозитории Git. В этом разделе вы подключите исходный код вашего существующего проекта dbt из Git к dbt Cloud.

1. Убедитесь, что ваш проект dbt находится в репозитории Git.

2. В **Настройках аккаунта** выберите **Интеграции**, чтобы [подключить ваш репозиторий Git](/docs/cloud/git/git-configuration-in-dbt-cloud) к dbt Cloud:
   - (**Рекомендуется**) Подключитесь с помощью одной из [встроенных интеграций](/docs/cloud/git/git-configuration-in-dbt-cloud) в dbt Cloud (таких как GitHub, GitLab и Azure DevOps).

     Этот метод предпочтителен из-за его простоты, функций безопасности (включая безопасные входы через OAuth и автоматизированные рабочие процессы, такие как сборки CI при запросах на слияние), и общей легкости использования.
   - [Импортируйте репозиторий Git](/docs/cloud/git/import-a-project-by-git-url) из любого действительного URL Git, который указывает на проект dbt.

### Дополнительная конфигурация
Изучите эти дополнительные конфигурации для дальнейшей оптимизации настройки Git:

1. Войдите в dbt Cloud, используя [OAuth-подключения](/docs/cloud/git/connect-github) для интеграции с вашей платформой исходного кода. Это автоматически связывает с репозиторием, используя одну из встроенных интеграций, установленных на уровне аккаунта. <Lifecycle status='enterprise' />
  
  Настройте группы для доступа к проекту dbt с теми, которые настроены для доступа к репозиторию, чтобы упростить управление разрешениями.

## Настройка разработчика

Этот раздел подчеркивает конфигурации разработки, которые вам понадобятся для вашего проекта dbt Cloud. В этом разделе рассматриваются следующие категории:

- [Среды dbt Cloud](/guides/core-to-cloud-1?step=7#dbt-cloud-environments)
- [Начальные шаги настройки](/guides/core-to-cloud-1?step=7#initial-setup-steps)
- [Дополнительная конфигурация](/guides/core-to-cloud-1?step=7#additional-configuration-2)
- [Команды dbt Cloud](/guides/core-to-cloud-1?step=7#dbt-cloud-commands)

### Среды dbt Cloud

Наиболее распространенные среды данных — это производственная, промежуточная и среда разработки. Способ, которым dbt Core управляет [средами](/docs/environments-in-dbt), заключается в использовании `target`, которые представляют собой различные наборы деталей подключения. 

[Среды dbt Cloud](/docs/dbt-cloud-environments) идут дальше, предоставляя:
- Интеграцию с такими функциями, как планирование заданий или контроль версий, что упрощает управление полным жизненным циклом ваших проектов dbt в рамках одной платформы.
- Упрощение процесса переключения между контекстами разработки, промежуточной и производственной среды.
- Упрощение настройки сред через интерфейс dbt Cloud вместо ручного редактирования файла `profiles.yml`. Вы также можете [настроить](/reference/dbt-jinja-functions/target) или [кастомизировать](/docs/build/custom-target-names) имена целей в dbt Cloud.
- Добавление атрибутов `profiles.yml` к настройкам среды dbt Cloud с помощью [Расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes).
- Использование [кэширования репозитория Git](/docs/cloud/account-settings#git-repository-caching) для защиты от сбоев сторонних сервисов, сбоев аутентификации Git и других проблем. <Lifecycle status="enterprise"/>

### Начальные шаги настройки
1. **Настройка среды разработки** &mdash; Настройте вашу [среду разработки](/docs/dbt-cloud-environments#create-a-development-environment) и [учетные данные для разработки](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#access-the-cloud-ide). Вам это понадобится для доступа к вашему проекту dbt и начала разработки.

2. **Версия dbt Core** &mdash; В вашей среде dbt Cloud выберите [трассу релизов](/docs/dbt-versions/cloud-release-tracks) для постоянных обновлений версии dbt. Если ваша команда планирует использовать как dbt Core, так и dbt Cloud для разработки или развертывания вашего проекта dbt, вы можете выполнить `dbt --version` в командной строке, чтобы узнать, какую версию dbt Core вы используете.
   - При использовании dbt Core вам нужно думать о том, какую версию вы используете, и управлять своими собственными обновлениями. При использовании dbt Cloud используйте [трассы релизов](/docs/dbt-versions/cloud-release-tracks), чтобы вам не приходилось это делать.

3. **Подключение к вашей платформе данных** &mdash; При использовании dbt Cloud вы можете [подключиться к вашей платформе данных](/docs/cloud/connect-data-platform/about-connections) напрямую в интерфейсе.
   - Каждая среда примерно эквивалентна записи в вашем файле `profiles.yml`. Это означает, что вам не нужен файл `profiles.yml` в вашем проекте.

4. **Инструменты разработки** &mdash; Настройте ваше рабочее пространство разработки с помощью [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) (интерфейс командной строки или редактор кода) или [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) (на основе браузера) для создания, тестирования, запуска и контроля версий вашего кода dbt в выбранном вами инструменте.
   - Если вы ранее устанавливали dbt Core, в [документации по установке dbt Cloud CLI](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli) есть больше информации о том, как установить dbt Cloud CLI, создать псевдонимы или удалить dbt Core для плавного перехода.

### Дополнительная конфигурация
Изучите эти дополнительные конфигурации для дальнейшей оптимизации вашей настройки разработчика:

1. **Кастомные имена целей** &mdash; Использование [`custom target.names`](/docs/build/custom-target-names) в ваших проектах dbt помогает идентифицировать различные среды (например, разработка, промежуточная и производственная). Хотя вы можете указать значения `custom target.name` в ваших учетных данных разработчика или настройке оркестрации, мы рекомендуем использовать [переменные окружения](/docs/build/environment-variables) как предпочтительный метод. Они предлагают более ясный способ управления различными средами и лучше поддерживаются функцией частичного парсинга dbt, в отличие от использования логики [`{{ target }}`](/reference/dbt-jinja-functions/target), которая предназначена для определения подключения к хранилищу данных.

### Команды dbt Cloud
1. Ознакомьтесь с [командами dbt](/reference/dbt-commands), поддерживаемыми для разработки в dbt Cloud. Например, `dbt init` не требуется в dbt Cloud, так как вы можете создать новый проект напрямую в dbt Cloud.

## Переменные окружения
Этот раздел поможет вам понять, как настроить и управлять переменными окружения dbt Cloud для вашего проекта. В этом разделе рассматриваются следующие категории:
- [Переменные окружения в dbt Cloud](/guides/core-to-cloud-1?step=7#environment-variables-in-dbt-cloud)
- [Порядок приоритета переменных окружения dbt Cloud](/guides/core-to-cloud-1?step=7#dbt-cloud-environment-variables-order-of-precedence)
- [Настройка переменных окружения в dbt Cloud](/guides/core-to-cloud-1?step=7#set-environment-variables-in-dbt-cloud)

В dbt Cloud вы можете установить [переменные окружения](/docs/build/environment-variables) в пользовательском интерфейсе dbt Cloud. Прочтите [Настройка переменных окружения](#set-environment-variables-in-dbt-cloud) для получения дополнительной информации.

В dbt Core переменные окружения или функция [`env_var`](/reference/dbt-jinja-functions/env_var) определяются вручную разработчиком или в внешнем приложении, выполняющем dbt.

### Переменные окружения в dbt Cloud
  - Переменные окружения dbt Cloud должны иметь префикс `DBT_` (включая `DBT_ENV_CUSTOM_ENV_` или `DBT_ENV_SECRET`).
  - Если ваши переменные окружения dbt Core не следуют этой конвенции именования, выполните [«поиск и замену»](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#dbt-cloud-ide-features) в вашем проекте, чтобы убедиться, что все ссылки на эти переменные окружения содержат правильные соглашения об именах.
- dbt Cloud защищает переменные окружения, которые позволяют более гибкую конфигурацию подключений к хранилищу данных или интеграций с поставщиками git, предлагая дополнительные меры для чувствительных значений, такие как префикс ключей с `DBT_ENV_SECRET` для их сокрытия в логах и интерфейсе.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/project-environment-view.png" title="Установка значений на уровне проекта и среды"/>

### Порядок приоритета переменных окружения dbt Cloud
Переменные окружения в dbt Cloud управляются с четким [порядком приоритета](/docs/build/environment-variables#setting-and-overriding-environment-variables), позволяя пользователям определять значения на четырех уровнях (от высшего к низшему порядку приоритета):
   - На уровне задания (переопределение задания) или в IDE для отдельного разработчика (личное переопределение). _Высший приоритет_
   - На уровне среды, который может быть переопределен уровнем задания или личным переопределением.
   - Проектное значение по умолчанию, которое может быть переопределено уровнем среды, уровнем задания или личным переопределением.
   - Необязательный аргумент по умолчанию, переданный функции Jinja `env_var` в коде. _Низший приоритет_
  
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/env-var-precdence.png" title="Порядок приоритета переменных окружения"/>

### Настройка переменных окружения в dbt Cloud

- Чтобы установить эти переменные для всего проекта или конкретных сред, перейдите в **Развертывание** > **Среды** > вкладка **Переменные окружения**.
- Чтобы установить эти переменные на уровне задания, перейдите в **Развертывание** > **Задания** > **Выберите ваше задание** > **Настройки** > **Расширенные настройки**.
- Чтобы установить эти переменные на уровне личного переопределения, перейдите в **Настройки профиля** > **Учетные данные** > **Выберите ваш проект** > **Переменные окружения**.

## Настройка оркестрации

Этот раздел описывает соображения и методы настройки ваших сред и заданий dbt Cloud для оркестрации. В этом разделе рассматриваются следующие категории:

- [Среды dbt Cloud](/guides/core-to-cloud-1?step=8#dbt-cloud-environments-1)
- [Начальные шаги настройки](/guides/core-to-cloud-1?step=8#initial-setup-steps-1)
- [Дополнительная конфигурация](/guides/core-to-cloud-1?step=8#additional-configuration-3)
- [Настройка CI/CD](/guides/core-to-cloud-1?step=8#cicd-setup)

### Среды dbt Cloud
Чтобы использовать [планировщик заданий dbt Cloud](/docs/deploy/job-scheduler), настройте одну среду как производственную среду. Это [среда развертывания](/docs/deploy/deploy-environments). Вы можете настроить несколько сред для различных этапов вашего конвейера развертывания, таких как разработка, промежуточная/QA и производство.

### Начальные шаги настройки
1. **Версия dbt Core** &mdash; В настройках вашей среды настройте dbt Cloud с той же версией dbt Core.
   - После завершения полной миграции мы рекомендуем обновить ваши среды до [трасс релизов](/docs/dbt-versions/cloud-release-tracks), чтобы всегда получать последние функции и многое другое. Вам нужно сделать это только один раз.

2. **Настройка ваших заданий** &mdash; [Создайте задания](/docs/deploy/deploy-jobs#create-and-schedule-jobs) для запланированных или событийных заданий dbt. Вы можете использовать выполнение по cron, вручную, по запросам на слияние или запускать по завершении другого задания.
   - Обратите внимание, что наряду с [заданиями в dbt Cloud](/docs/deploy/jobs), вы можете узнать о других способах планирования и выполнения ваших заданий dbt с помощью других инструментов. Обратитесь к [Интеграция с другими инструментами](/docs/deploy/deployment-tools) для получения дополнительной информации.

### Дополнительная конфигурация
Изучите эти дополнительные конфигурации для дальнейшей оптимизации вашей настройки оркестрации dbt Cloud:

1. **Кастомные имена целей** &mdash; Используйте переменные окружения для установки `custom target.name` для каждого [соответствующего задания dbt Cloud](/docs/build/custom-target-names) на уровне среды.

2. **Команды dbt** &mdash; Добавьте любые соответствующие [команды dbt](/docs/deploy/job-commands) для выполнения ваших запусков заданий dbt Cloud.

3. **Уведомления** &mdash; Настройте [уведомления](/docs/deploy/job-notifications), настроив оповещения по электронной почте и Slack для мониторинга ваших заданий.

4. **Инструменты мониторинга** &mdash; Используйте [инструменты мониторинга](/docs/deploy/monitor-jobs), такие как история запусков, повторные попытки заданий, цепочка заданий, плитки статуса на панели и многое другое для бесшовного опыта оркестрации.

5. **Доступ к API** &mdash; Создайте [токены аутентификации API](/docs/dbt-cloud-apis/authentication) и доступ к [API dbt Cloud](/docs/dbt-cloud-apis/overview) по мере необходимости. <Lifecycle status="team,enterprise" />

6. **dbt Explorer** &mdash; Если вы используете [dbt Explorer](/docs/collaborate/explore-projects) и запускаете производственные задания с внешним оркестратором, убедитесь, что ваши производственные задания выполняют `dbt run` или `dbt build`, чтобы обновить и просмотреть модели и их [метаданные](/docs/collaborate/explore-projects#generate-metadata) в dbt Explorer. Запуск `dbt compile` сам по себе не обновит метаданные модели. Кроме того, такие функции, как родословная на уровне столбцов, также требуют метаданных каталога, создаваемых при запуске `dbt docs generate`. <Lifecycle status="team,enterprise" />

### Настройка CI/CD

Создание пользовательского решения для эффективной проверки кода при запросах на слияние является сложной задачей. С dbt Cloud вы можете включить [непрерывную интеграцию / непрерывное развертывание (CI/CD)](/docs/deploy/continuous-integration) и настроить dbt Cloud для выполнения ваших проектов dbt во временной схеме, когда новые коммиты отправляются в открытые запросы на слияние.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-workflow.png" width="90%" title="Рабочий процесс непрерывной интеграции в dbt Cloud"/>

Эта функция сборки при запросе на слияние — отличный способ поймать ошибки до развертывания в производственной среде и важный инструмент для специалистов по данным.

1. Настройте интеграцию с нативным приложением Git (таким как Azure DevOps, GitHub, GitLab) и средой CI в dbt Cloud.
2. Создайте [задание CI/CD](/docs/deploy/ci-jobs) для автоматизации проверок качества перед развертыванием кода в производственной среде.
3. Запустите ваши задания в производственной среде, чтобы полностью реализовать CI/CD. Будущие запросы на слияние также будут использовать последние производственные запуски для сравнения.

## Разработка и исследование моделей

В этом разделе вы сможете проверить, правильно ли выполняются или компилируются ваши модели в выбранном вами инструменте разработки: [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) или [dbt Cloud CLI](/docs/cloud/cloud-cli-installation).

Вы захотите убедиться, что настроили вашу [среду разработки и учетные данные](/docs/dbt-cloud-environments#set-developer-credentials).

1. В вашем [инструменте разработки](/docs/cloud/about-develop-dbt) на ваш выбор вы можете просмотреть ваш проект dbt, убедиться, что он настроен правильно, и выполнить некоторые [команды dbt](/reference/dbt-commands):
   - Выполните `dbt compile`, чтобы убедиться, что ваш проект компилируется правильно.
   - Запустите несколько моделей в dbt Cloud IDE или dbt Cloud CLI, чтобы убедиться, что вы получаете точные результаты в разработке.

2. После успешного выполнения вашего первого задания в производственной среде используйте [dbt Explorer](/docs/collaborate/explore-projects), чтобы просмотреть [ресурсы](/docs/build/projects) вашего проекта (такие как модели, тесты и метрики) и их <Term id="data-lineage" />, чтобы лучше понять его текущее состояние в производственной среде. <Lifecycle status="team,enterprise" />

## Что дальше?

<ConfettiTrigger>

Поздравляем с завершением первой части вашего перехода на dbt Cloud 🎉!

Вы узнали:
- Как настроить ваш аккаунт dbt Cloud
- Как подключить вашу платформу данных и репозиторий Git
- Как настроить ваши среды разработки, оркестрации и CI/CD
- Как настроить переменные окружения и проверить ваши модели


Для следующих шагов вы можете продолжить изучение нашей серии из 3-х частей о переходе с dbt Core на dbt Cloud:


<CoretoCloudTable/>

### Связанные документы
- [Изучите dbt Cloud](https://learn.getdbt.com) с помощью видеоуроков по запросу.
- Забронируйте [демонстрации с экспертами](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) и получите инсайты.
- Работайте с командой [Профессиональных услуг dbt Labs](https://www.getdbt.com/dbt-labs/services) для поддержки вашей организации данных и миграции.
- [Как dbt Cloud сравнивается с dbt Core](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud) для детального сравнения dbt Core и dbt Cloud.
- Подпишитесь на [RSS-уведомления dbt Cloud](https://status.getdbt.com/)

</ConfettiTrigger>

</div>