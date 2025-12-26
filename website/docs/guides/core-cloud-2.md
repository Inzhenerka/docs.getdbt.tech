---
title: 'Переход с dbt Core на платформу dbt: что нужно знать'
id: core-cloud-2
description: "Используйте это руководство, чтобы понять, какие аспекты и подходы нужно учесть при переходе с dbt Core на платформу dbt."
hoverSnippet: "Используйте это руководство, чтобы понять, какие аспекты и подходы нужно учесть при переходе с dbt Core на платформу dbt."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt platform']
keywords: ['dbt Core','dbt platform','Migration', 'Move dbt', 'Migrate dbt']
level: 'Intermediate'
---

## Введение
Переход с <Constant name="core" /> на <Constant name="cloud" /> упрощает workflows в analytics engineering, позволяя командам разрабатывать, тестировать, деплоить и исследовать data products в рамках единого полностью управляемого сервиса.

Изучите нашу серию руководств из трех частей о переходе с <Constant name="core" /> на <Constant name="cloud" />. Серия идеально подходит пользователям, которые хотят упростить процессы и усилить аналитику:

import CoretoCloudTable from '/snippets/_core-to-cloud-guide-table.md';

<CoretoCloudTable/>

<Expandable alt_header="Что такое dbt и dbt Core?">

   - <Constant name="cloud" /> — самый быстрый и надежный способ деплоить dbt. Он позволяет разрабатывать, тестировать, деплоить и исследовать data products в рамках единого полностью управляемого сервиса. Также он поддерживает:
     - инструменты разработки, адаптированные под разные роли ([<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) или [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation))
     - готовые [CI/CD workflows](/docs/deploy/ci-jobs)
     - [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) для консистентных метрик
     - доменное владение данными с multi-project настройкой [<Constant name="mesh" />](/best-practices/how-we-mesh/mesh-1-intro)
     - [<Constant name="explorer" />](/docs/explore/explore-projects) для более простого поиска и понимания данных

   Подробнее о [возможностях <Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features).
- <Constant name="core" /> — open-source инструмент, который позволяет командам данных определять и выполнять трансформации данных в облачном data warehouse, следуя best practices analytics engineering. Хотя это может хорошо работать для «одиночек» и небольших технических команд, вся разработка происходит через командную строку, а production-деплойменты нужно хостить и обслуживать самостоятельно. Это требует значительной (и со временем нарастающей) работы и затрат на поддержку и масштабирование.

</Expandable>

## Чему вы научитесь
Сегодня тысячи компаний с командами данных от 2 до 2 000 человек полагаются на <Constant name="cloud" />, чтобы ускорять работу с данными, усиливать коллаборацию и завоевывать доверие бизнеса. Понимание того, что нужно сделать для перехода между <Constant name="cloud" /> и текущим deployment на Core, поможет вам выстроить стратегию и план миграции.

В руководстве описаны следующие шаги:

- [Важные аспекты](/guides/core-cloud-2?step=3): узнайте о самых важных вещах, которые нужно учесть при переходе с Core на Cloud.
- [Спланируйте переход](/guides/core-cloud-2?step=4): учитывайте такие вопросы, как роли и права пользователей, порядок онбординга, текущие workflows и т. д.
- [Перейдите на <Constant name="cloud" />](/guides/core-cloud-2?step=5): изучите шаги перехода вашего проекта <Constant name="core" /> в <Constant name="cloud" />, включая настройку аккаунта, data platform и репозитория <Constant name="git" />.
- [Тестирование и валидация](/guides/core-cloud-2?step=6): узнайте, как обеспечить корректность моделей и производительность после перехода.
- [Переход и обучение](/guides/core-cloud-2?step=7): узнайте, как полностью перейти на <Constant name="cloud" /> и какое обучение и поддержку может потребоваться организовать.
- [Итоги](/guides/core-cloud-2?step=8): краткое резюме ключевых выводов и того, чему вы научились в этом руководстве.
- [Что дальше?](/guides/core-cloud-2?step=9): что ожидать в следующих руководствах.

## Важные аспекты

Если ваша команда сегодня использует <Constant name="core" />, вы могли открыть это руководство, потому что:
- вы осознали нагрузку по поддержке такого deployment;
- человек, который его настраивал, уже ушел;
- вам интересно, как <Constant name="cloud" /> может лучше управлять сложностью вашего dbt deployment, дать доступ большему числу контрибьюторов или улучшить практики безопасности и governance.

В этом руководстве собраны технические изменения и стратегии командной работы, которые важно знать при переходе проекта с <Constant name="core" /> на <Constant name="cloud" />. Каждый self-managed deployment <Constant name="core" /> выглядит немного по‑разному, но после сотен миграций у команд встречается много общего.

Самые важные вещи, которые нужно учесть при переходе с <Constant name="core" /> на <Constant name="cloud" />:

- Как устроена ваша команда? Есть ли естественное разделение по доменам?
- Должен быть один проект или несколько? Какие dbt-ресурсы вы хотите стандартизировать и держать централизованно?
- У кого должны быть права на просмотр, разработку и администрирование?
- Как вы планируете запуск dbt-моделей в production?
- Как сейчас вы управляете Continuous integration/Continuous deployment (CI/CD) логических изменений (если вообще управляете)?
- Как вашим разработчикам данных удобнее работать?
- Как вы управляете разными data environments и разным поведением в этих окружениях?

<Constant name="cloud" /> предоставляет стандартные механизмы для решения этих задач, которые дают вашей организации долгосрочные преимущества:
- коллаборация между командами
- контроль доступа
- оркестрация
- изолированные data environments

Если вы разворачивали <Constant name="core" /> самостоятельно, у вас, вероятно, сложились другие ответы.

## Спланируйте переход

Планируя переход, оцените ваш workflow и структуру команды, чтобы обеспечить плавный процесс. Ниже — ключевые моменты, которые стоит учесть:

<Expandable alt_header="Начните с малого, чтобы снизить риски и быстрее учиться">

Вам не нужно переносить сразу все команды и все workflows всех разработчиков. Многие клиенты с крупными dbt deployment начинают с переноса одной команды и одного проекта.

Когда преимущества консолидированной платформы станут очевидны, переносите остальные команды и workflows. Долгосрочные «гибридные» deployment могут быть сложными, но как временный этап это может быть разумным вариантом.
</Expandable>

<Expandable alt_header="Роли пользователей и ответственность"> 

Оцените пользователей и роли (personas) до перехода, во время и после него.
- **Администраторы**: спланируйте новые [механизмы контроля доступа](/docs/cloud/manage-access/about-user-access) в <Constant name="cloud" /> — например, какие команды могут управлять собой сами, а что должно быть стандартизировано. Определите, кто будет отвечать за настройку и поддержку проектов, подключений к data platform и environments.
- **Разработчики данных** (data analysts, data engineers, analytics engineers, business analysts): определите порядок онбординга, адаптацию workflow в <Constant name="cloud" />, обучение работе с [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) или [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), а также изменения ролей.
- **Потребители данных:** исследуйте данные с помощью [<Constant name="explorer" />](/docs/explore/explore-projects), чтобы просматривать ресурсы проекта (например модели, тесты и метрики) и их lineage, лучше понимая текущее production-состояние. <Lifecycle status="self_service,managed" />

</Expandable>

<Expandable alt_header="Порядок онбординга"> 

Если у вас несколько команд dbt‑разработчиков, подумайте, с кого начинать онбординг в <Constant name="cloud" />:
- Начните с downstream‑команд (например, команд внутри бизнеса), которым может быть удобнее разрабатывать в <Constant name="cloud_ide" /> (менее техническим пользователям) и использовать функции шеринга (например auto‑deferral и <Constant name="explorer" />) для стейкхолдеров; а затем переходите к более техническим командам.
- Подумайте о настройке [CI job](/docs/deploy/ci-jobs) в <Constant name="cloud" /> (даже до development или production jobs), чтобы упростить workflow разработки. Это особенно полезно, если CI‑процесса сейчас нет.

</Expandable>

<Expandable alt_header="Проанализируйте текущие workflows, процессы ревью и структуру команды">

Оцените, как <Constant name="cloud" /> может упростить разработку, оркестрацию и тестирование:
- **Разработка**: разрабатывайте dbt‑модели, собирайте, тестируйте, запускайте и ведите version control, используя <Constant name="cloud_cli" /> (CLI или code editor) или <Constant name="cloud_ide" /> (в браузере).
- **Оркестрация**: создавайте кастомные расписания для production jobs — по дням недели, времени суток или с заданным интервалом.
  - Настройте [CI job](/docs/deploy/ci-jobs) для повышения эффективности разработчиков и CD jobs для деплоя изменений сразу после merge.
  - Связывайте deploy jobs, [триггеря job](/docs/deploy/deploy-jobs#trigger-on-job-completion), когда другой завершился.
  - Для максимальной гибкости используйте [<Constant name="cloud" /> API](/dbt-cloud/api-v2#/), чтобы триггерить jobs. Это уместно, когда вы хотите интегрировать выполнение dbt с другими data workflows.
- **Continuous integration (CI)**: используйте [CI jobs](/docs/deploy/ci-jobs), чтобы запускать dbt‑проект во временной схеме, когда новые коммиты пушатся в открытые pull requests. Такой build‑on‑PR отлично помогает ловить баги до деплоя в production.
  - Для многих команд CI в <Constant name="cloud" /> — большое улучшение по сравнению с прежними workflows разработки.
- **Как вы сейчас определяете тесты?**: хотя тестирование production‑данных важно, это не самый эффективный способ ловить логические ошибки, которые разработчики вносят в изменения. Вы можете использовать [unit testing](/docs/build/unit-tests), чтобы валидировать логику SQL‑моделей на небольшом наборе статических входных данных *до* материализации полной модели в production.

</Expandable>

<Expandable alt_header="Разберитесь с контролем доступа">

Переходите на механизмы [access control](/docs/cloud/manage-access/about-user-access) в <Constant name="cloud" />, чтобы обеспечить безопасность и корректное управление доступами. Администраторы <Constant name="cloud" /> могут использовать модель прав доступа <Constant name="cloud" /> для управления доступом пользователей внутри аккаунта <Constant name="cloud" />:
- **License-based access controls:** пользователям назначаются типы лицензий на уровне аккаунта. Эти лицензии определяют, что пользователь может делать в приложении: просматривать метаданные проекта, разрабатывать изменения в проектах или администрировать доступ к проектам.
- **Role-based Access Control (RBAC):** пользователи добавляются в *groups* с конкретными правами на конкретные проекты или на все проекты в аккаунте. Пользователь может состоять в нескольких groups, и эти groups могут иметь права на несколько проектов. <Lifecycle status="managed,managed_plus" />

</Expandable>

<Expandable alt_header="Управляйте окружениями"> 

Если вам требуется изоляция между production и pre-production окружениями данных из‑за чувствительных данных, <Constant name="cloud" /> поддерживает Development, Staging и Production [environments](/docs/dbt-cloud-environments).

Это дает разработчикам преимущества улучшенного workflow и при этом обеспечивает изоляцию между Staging и Production, а также блокирует права на Prod.

</Expandable>

## Переход на dbt

Это руководство — ваш roadmap для продумывания стратегий миграции и того, как может выглядеть переход с <Constant name="core" /> на <Constant name="cloud" />.

После того как вы оценили аспекты и спланировали переход, вы можете начать перенос проекта <Constant name="core" /> в <Constant name="cloud" />:
- Изучите подробное руководство [Переход на <Constant name="cloud" />: начало работы](/guides/core-to-cloud-1?step=1) — там есть полезные задачи и советы для плавного перехода с <Constant name="core" /> на <Constant name="cloud" />.

Для более детального сравнения <Constant name="core" /> и <Constant name="cloud" /> см. [How <Constant name="cloud" /> compares with <Constant name="core" />](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud).

## Тестирование и валидация

После [закладки основ в <Constant name="cloud" />](/guides/core-to-cloud-1?step=1) важно провалидировать миграцию, чтобы обеспечить корректную работу и целостность данных:

- **Проверьте dbt‑проект:** убедитесь, что проект компилируется корректно и вы можете запускать команды. Проверьте корректность моделей и мониторьте производительность после перехода.
- **Начните cutover:** вы можете начать cutover на <Constant name="cloud" />, создав job в <Constant name="cloud" /> с командами, которые запускают только небольшой поднабор DAG. Проверьте, что таблицы заполняются в ожидаемых database/schema. Затем постепенно расширяйте область запуска, включая больше частей DAG, по мере роста уверенности в результатах.
- **Точное тестирование:** используйте [unit testing](/docs/build/unit-tests), чтобы валидировать логику SQL‑моделей на небольшом наборе статических входных данных *до* материализации полной модели в production.
- **Доступы и права**: пересмотрите и при необходимости скорректируйте [access controls и permissions](/docs/cloud/manage-access/about-user-access) в <Constant name="cloud" />, чтобы соблюдать требования безопасности и защищать данные.

## Переход и обучение

Когда вы убедились, что оркестрация и CI/CD в <Constant name="cloud" /> работают как ожидается, следует поставить на паузу текущий orchestration tool и остановить или обновить текущий CI/CD процесс. Это не относится к случаям, когда вы продолжаете использовать внешний оркестратор (например Airflow) и заменили выполнение `dbt-core` на выполнение через <Constant name="cloud" /> (через [API](/docs/dbt-cloud-apis/overview)).

Познакомьте команду с [возможностями <Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features) и оптимизируйте процессы разработки и деплоя. Вот несколько ключевых возможностей:

- **Release tracks:** выберите [release track](/docs/dbt-versions/cloud-release-tracks) для автоматических обновлений версии dbt с подходящей для команды частотой — это избавляет от ручных обновлений и снижает риск расхождения версий. Также это дает ранний доступ к новой функциональности, раньше, чем в <Constant name="core" />.
- **Инструменты разработки**: используйте [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) или [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), чтобы собирать, тестировать, запускать и вести version control dbt‑проектов.
- **Документация и Source freshness:** автоматизируйте хранение [документации](/docs/build/documentation) и отслеживайте [source freshness](/docs/deploy/source-freshness) в <Constant name="cloud" />, что упрощает поддержку проекта.
- **Уведомления и логи:** получайте мгновенные [уведомления](/docs/deploy/monitor-jobs) о падениях jobs со ссылками на детали job. Используйте подробные логи всех запусков для диагностики.
- **CI/CD:** используйте функцию [CI/CD](/docs/deploy/ci-jobs) в <Constant name="cloud" />, чтобы запускать dbt‑проект во временной схеме каждый раз, когда новые коммиты пушатся в открытые pull requests. Это помогает ловить ошибки до деплоя в production.

### После перехода

Теперь, когда вы выбрали <Constant name="cloud" /> как платформу, у вас открываются возможности для упрощения коллаборации, повышения эффективности workflow и использования мощных [возможностей](/docs/cloud/about-cloud/dbt-cloud-features) для команд analytics engineering. Вот дополнительные возможности, которые помогут раскрыть потенциал <Constant name="cloud" />:

- **Audit logs:** используйте [audit logs](/docs/cloud/manage-access/audit-log), чтобы просматривать действия людей в организации. Audit logs содержат аудитированные события пользователей и системы в реальном времени. Вы также можете [экспортировать](/docs/cloud/manage-access/audit-log#exporting-logs) *всю* активность (за пределами 90 дней, доступных для просмотра в <Constant name="cloud" />). <Lifecycle status="managed,managed_plus" />
- **API <Constant name="cloud" />:** используйте мощные [API](/docs/dbt-cloud-apis/overview) <Constant name="cloud" />, чтобы программно создавать, читать, обновлять и удалять (CRUD) проекты/jobs/environments. [<Constant name="cloud" /> Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) и [Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/resources/job) помогают хранить конфигурации и управлять ими программно. [Discovery API](/docs/dbt-cloud-apis/discovery-api) предоставляет широкие возможности запросов к метаданным — например данные о jobs, конфигурации моделей, использование и общее состояние проекта. <Lifecycle status="self_service,managed" />
- **<Constant name="explorer" />**: используйте [<Constant name="explorer" />](/docs/explore/explore-projects), чтобы смотреть [resources](/docs/build/projects) проекта (например модели, тесты и метрики) и их [lineage](https://docs.getdbt.com/terms/data-lineage), чтобы лучше понимать текущее production‑состояние (после успешного job в Production environment). <Lifecycle status="self_service,managed" />
- **dbt Semantic Layer:** [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) позволяет определять универсальные метрики поверх ваших моделей, а затем выполнять запросы к ним в [BI‑инструменте](/docs/cloud-integrations/avail-sl-integrations). Это устраняет проблему несовпадающих метрик — появляется централизованный способ определять метрики и создавать видимость на каждом этапе data flow. <Lifecycle status="self_service,managed" />
- **dbt Mesh:** используйте [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro), чтобы шарить data models внутри организации, позволяя командам данных сотрудничать над общими моделями и переиспользовать работу других команд. <Lifecycle status="managed,managed_plus" />

### Дополнительная помощь

- **Курсы dbt Learn**: получите доступ к бесплатным видео‑курсам [Learn <Constant name="cloud" />](https://learn.getdbt.com) для обучения в удобном темпе.
- **dbt Community:** присоединяйтесь к [dbt Community](https://community.getdbt.com/), чтобы общаться с другими пользователями dbt, задавать вопросы и делиться best practices.
- **Команда поддержки dbt:** наша [команда поддержки dbt](/docs/dbt-support) всегда готова помочь с проблемами <Constant name="cloud" />. Создайте тикет поддержки в <Constant name="cloud" />, и мы поможем!
- **Account management:** для Enterprise‑аккаунтов доступна команда account management, которая помогает с troubleshooting и поддержкой управления аккаунтом. [Book a demo](https://www.getdbt.com/contact), чтобы узнать больше. <Lifecycle status="managed,managed_plus" />

## Итоги

Это руководство должно было дать вам понимание и рамку для перехода с <Constant name="core" /> на <Constant name="cloud" />. Оно охватило следующие ключевые области:

- **Важные аспекты:** понимание базовых шагов для успешной миграции, включая оценку текущей настройки и выявление ключевых факторов, связанных со структурой команды и потребностями workflow.

- **Планирование перехода**: акцент на важности переработки workflow, ответственности по ролям и внедрения новых процессов, чтобы использовать коллаборативную и эффективную среду <Constant name="cloud" />.

- **Переход на <Constant name="cloud" />**: ссылка на [руководство](/guides/core-to-cloud-1?step=1), где описаны технические шаги перехода проекта <Constant name="core" /> в <Constant name="cloud" />, включая настройку аккаунта, data platform и репозитория <Constant name="git" />.

- **Тестирование и валидация**: акцент на технической стороне перехода, включая тестирование и валидацию dbt‑проектов в экосистеме <Constant name="cloud" />, чтобы обеспечить целостность данных и производительность.

- **Переход и обучение**: полезные рекомендации по переходу, обучению и онбордингу команды. Используйте возможности <Constant name="cloud" /> — от инструментов разработки (<Constant name="cloud" /> CLI и <Constant name="cloud_ide" />) до продвинутых функций, таких как <Constant name="explorer" />, <Constant name="semantic_layer" /> и <Constant name="mesh" />.

## Что дальше?

<ConfettiTrigger>


Поздравляем с завершением этого руководства — надеемся, оно помогло вам понять, какие аспекты важно учесть, чтобы лучше спланировать переход на <Constant name="cloud" />.

В качестве следующих шагов вы можете продолжить изучать нашу серию руководств из трех частей о переходе с <Constant name="core" /> на <Constant name="cloud" />:

<CoretoCloudTable/>

### Связанные материалы
- Курсы [Learn <Constant name="cloud" />](https://learn.getdbt.com)
- Запишитесь на [демо от экспертов](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) и получите инсайты
- Работайте с командой [Professional Services dbt Labs](https://www.getdbt.com/dbt-labs/services), чтобы поддержать миграцию и развитие вашей data организации.
- [How <Constant name="cloud" /> compares with <Constant name="core" />](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud) — детальное сравнение <Constant name="core" /> и <Constant name="cloud" />.
- Подпишитесь на [RSS‑уведомления <Constant name="cloud" />](https://status.getdbt.com/)

</ConfettiTrigger>
