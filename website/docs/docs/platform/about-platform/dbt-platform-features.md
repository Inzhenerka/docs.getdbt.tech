---
title: "Возможности платформы dbt"
id: "dbt-platform-features"
sidebar_label: "Возможности платформы dbt"
description: "Ознакомьтесь с возможностями dbt и узнайте, почему платформа dbt — самый быстрый способ развернуть dbt"
hide_table_of_contents: true
pagination_next: "docs/platform/about-platform/architecture"
pagination_prev: null
availability:
  surface: platform
  access: login_required
---

<Constant name="dbt_platform" /> — самый быстрый и надёжный способ развёртывания dbt. Разрабатывайте, тестируйте, запускайте по расписанию, документируйте и исследуйте модели данных в едином браузерном интерфейсе.

Помимо размещённой в облаке инфраструктуры для запуска dbt во всей организации, <Constant name="dbt" /> предоставляет готовые возможности для запуска заданий по расписанию, CI/CD, размещения документации, мониторинга и оповещений, интегрированную среду разработки (<Constant name="studio_ide" />), а также позволяет разрабатывать проекты и выполнять команды dbt в локальном интерфейсе командной строки (CLI) или редакторе кода.

[Гибкие тарифные планы](https://www.getdbt.com/pricing/) и возможности <Constant name="dbt" /> делают платформу подходящим решением для команд по работе с данными любого размера &mdash; зарегистрируйтесь, чтобы воспользоваться [бесплатным пробным периодом на 14 дней](https://www.getdbt.com/signup/)!

<div className="grid--3-col">

<Card
title="CLI платформы dbt"
    body="Используйте CLI платформы dbt для разработки, тестирования, запуска и управления версиями проектов dbt, а также выполнения команд dbt непосредственно из командной строки."
    link="/docs/platform/dbt-cli-installation"
    icon="dbt-bit"/>

<Card
    title="dbt Studio IDE"
body="IDE — самый простой и эффективный способ разработки моделей dbt, позволяющий выполнять сборку, тестирование и запуск проектов dbt, а также управлять их версиями прямо в браузере."
    link="/docs/platform/studio-ide/develop-in-studio"
    icon="dbt-bit"/>

<Card
    title="dbt Wizard*"
    body="dbt Wizard — это ИИ-агент, который помогает командам быстрее вносить более качественные изменения в dbt с меньшими рисками. Созданный для разработки данных в dbt с соблюдением правил управления, dbt Wizard располагает полным контекстом проекта и оценивает влияние изменений на проекты."
    link="/docs/platform/wizard-overview"
    icon="wizard"/>

<Card
    title="Manage environments"
    body="Настраивайте и управляйте отдельными production‑ и development‑окружениями в dbt, чтобы инженеры могли эффективнее разрабатывать и тестировать код, не влияя на пользователей и данные."
    link="/docs/environments-in-dbt"
    icon="dbt-bit"/>

<Card
    title="Планирование и запуск задач dbt"
    body="Создавайте пользовательские расписания для запуска ваших производственных задач. Планируйте задачи по дням недели, времени суток или с регулярным интервалом. Снижайте операционные расходы, используя вебхуки для запуска CI задач и API для старта задач."
    link="/docs/deploy/job-scheduler"
    icon="dbt-bit"/>

<Card
    title="Уведомления"
    body="Настройте и кастомизируйте уведомления о заданиях в dbt, чтобы получать оповещения по email или в Slack, когда выполнение задания завершается успешно, с ошибкой или отменяется. Уведомления помогают вовремя оповестить нужных людей о проблемах, вместо того чтобы ждать, пока пользователь сообщит о них."
    link="/docs/deploy/job-notifications"
    icon="dbt-bit"/>

<Card
    title="Видимость выполнения"
    body="Просматривайте историю ваших запусков и панель времени выполнения моделей, чтобы помочь определить, где можно улучшить запланированные задачи."
    link="/docs/deploy/run-visibility"
    icon="dbt-bit"/>
    
<Card
    title="Хостинг и совместное использование документации"
    body="dbt размещает документацию dbt‑проекта и управляет доступом к ней, позволяя вам генерировать документацию по данным по расписанию для вашего проекта. Приглашайте коллег на платформу dbt для совместной работы и обмена документацией вашего проекта."
    link="/docs/explore/build-and-view-your-docs"
    icon="dbt-bit"/>

<Card
    title="Поддержка GitHub, GitLab, AzureDevOps"
    body="Легко подключите свою учетную запись Git к платформе dbt и обеспечьте дополнительный уровень безопасности dbt. Импортируйте новые репозитории, запускайте непрерывную интеграцию, клонируйте репозитории по HTTPS и пользуйтесь другими возможностями!"
    link="/docs/platform/git/connect-github"
    icon="dbt-bit"/>

<Card
    title="Включить непрерывную интеграцию"
    body="Настройте dbt так, чтобы он запускал ваши проекты dbt во временной схеме при отправке новых коммитов в открытые pull request’ы. Эта функциональность сборки при PR — отличный способ обнаруживать ошибки до деплоя в продакшн и незаменимый инструмент в арсенале любого аналитика."
    link="/docs/deploy/continuous-integration"
    icon="dbt-bit"/>

<Card
    title="Безопасность"
    body="Управляйте рисками с помощью соответствия SOC-2, развертывания CI/CD, RBAC и архитектуры ELT."
    link="https://www.getdbt.com/security/"
    icon="dbt-bit"/>

<Card
   title="Визуализация и оркестрация exposures*"
   body="Автоматически настраивайте downstream exposures на основе дашбордов и анализируйте, как модели используются в инструментах, расположенных ниже по потоку данных. Заблаговременно обновляйте базовые источники данных во время выполнения заданий dbt по расписанию."
   link="/docs/platform-integrations/downstream-exposures"
   icon="dbt-bit"/>

<Card
    title="Семантический слой dbt*"
    body="Используйте семантический слой dbt для определения метрик вместе с вашими моделями dbt и их запроса из любого интегрированного аналитического инструмента. Получайте одинаковые ответы везде и всегда."
    link="/docs/use-dbt-semantic-layer/dbt-sl"
    icon="dbt-bit"/>

<Card
    title="Discovery API*"
body="Улучшите свой рабочий процесс: выполняйте разовые запросы, просматривайте схему или обращайтесь с запросами к dbt Semantic Layer. dbt предоставляет GraphQL API, который поддерживает произвольные запросы."
    link="/docs/dbt-apis/discovery-api"
    icon="dbt-bit"/>

<Card
    title="Каталог dbt*"
    body="Узнайте о Каталоге dbt и о том, как работать с ним, чтобы понимать, улучшать и эффективно использовать ваши конвейеры данных."
    link="/docs/explore/explore-projects"
    icon="dbt-bit"/>

<Card
    title="dbt Insights*"
    body="Узнайте, как выполнять запросы к данным и проводить разведочный анализ данных с помощью dbt Insights."
    link="/docs/explore/dbt-insights"
    icon="dbt-bit"/>

  <Card
    title="Cost Insights*"
    body="Track warehouse compute costs and understand the impact of optimizations across your dbt projects and models."
    link="/docs/explore/cost-insights"
    icon="dbt-bit"
    lifecycle="beta"/>

</div> <br />

*Эти возможности доступны на [выбранных тарифных планах](https://www.getdbt.com/pricing/).*

## Связанные документы {#related-docs}

- [Тарифные планы и цены <Constant name="dbt" />](https://www.getdbt.com/pricing/)
- [Руководства по быстрому старту](/docs/get-started-dbt)
- [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)
