---
title: "Начало работы с Wizard Desktop"
id: "wizard-desktop"
description: "Скачайте Wizard Desktop и начните первый сеанс с наглядными визуализациями данных, сравнением данных и графом зависимостей."
sidebar_label: "Начало работы с Desktop"
image: /img/wizard/desktop/wizard-desktop-ui.png
tags: [AI, Agents, dbt Wizard]
availability: local_all
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

# Начало работы с Wizard Desktop <Lifecycle status="beta"/>

<IntroText>
Wizard Desktop — это <Constant name="wizard" /> в виде нативного приложения. Просматривайте наглядные визуализации данных, различия в данных, граф зависимостей и многое другое, чтобы получать результаты быстрее, чем когда-либо.
</IntroText>

На этой странице описано, как установить приложение, подключить его к необходимым сервисам и начать первый сеанс. Подробнее обо всех возможностях приложения см. в разделе [Использование Wizard Desktop](/docs/dbt-ai/wizard-desktop-use). Но будьте осторожны: известно, что волшебник умеет <WizardPopcorn>творить заклинания</WizardPopcorn>.

<DownloadCard />

Wizard Desktop использует ту же технологию, что и [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli), и предлагает визуальный интерфейс, который помогает следить за работой, направлять её и управлять несколькими задачами одновременно:

- **Параллельные чаты:** каждый чат получает собственное рабочее дерево (<Term id="git-worktree" />) <Constant name="git" />, поэтому несколько задач могут выполняться одновременно без конфликтов.
- **Наглядная проверка:** просматривайте структурированные результаты, включая представление `dbt-compare`, показывающее, как ваши изменения повлияли на данные.
- **Контекстные комментарии:** наведите указатель практически на любой элемент, чтобы прокомментировать именно его, а затем отправьте несколько комментариев вместе.
- **Диаграммы и таблицы:** задайте вопрос о данных и увидите ответ прямо в чате.
- **Влияние изменений прямо в интерфейсе:** смотрите, какие модели затронуты изменениями <Constant name="wizard" />, и открывайте сравнение версий, не покидая текущего представления.
- **Просмотр графа зависимостей, файлов и метрик:** изучайте проект прямо рядом с чатом.



<DocCarousel slidesPerView={1}>

<Lightbox src="/img/wizard/desktop/wizard-desktop-intro.png" width="95%" title="Главный экран dbt Wizard"/>
<Lightbox src="/img/wizard/desktop/wizard-desktop-validation.png" width="95%" title="Активный сеанс с диаграммой в чате и результатами проверки на боковой панели" />
</DocCarousel>


## Предварительные требования

Для использования Wizard Desktop вам понадобятся:
- Компьютер с macOS, Linux или Windows.
- Учётная запись dbt, если вы хотите использовать ключи, управляемые dbt. Вы можете создать бесплатную учётную запись при входе или использовать существующую. При использовании [BYOK](/docs/dbt-ai/wizard-byok) можно работать с Wizard Desktop без учётной записи dbt.
- Локальная копия проекта dbt на вашем компьютере, если вы хотите, чтобы <Constant name="wizard" /> работал с файлами проекта. Приложение ищет существующие проекты, но вы также можете выбрать папку проекта самостоятельно.
- Учётные данные для хранилища данных, если вы хотите, чтобы <Constant name="wizard" /> запускал ваш проект или выполнял запросы к данным. Настраивать их до открытия приложения не требуется.


<a id="install-and-open-wizard-desktop" />

## Установка Wizard Desktop {#install-wizard-desktop}

1. Скачайте установщик для вашей операционной системы:
   - [macOS, Apple silicon (.dmg)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-aarch64-apple-darwin.dmg) или [macOS, Intel (.dmg)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-x86_64-apple-darwin.dmg)
   - [Windows, x64 (.exe)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-x86_64-pc-windows-msvc.exe)
   - [Linux, x86_64 (.deb)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-x86_64-unknown-linux-gnu.deb) или [Linux, ARM64 (.deb)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-aarch64-unknown-linux-gnu.deb) — для дистрибутивов на основе Debian, таких как Ubuntu

   В других дистрибутивах Linux установите приложение через [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli): выполните `wizard app`.
2. Откройте Wizard Desktop и выберите **Get started** на экране приветствия.
3. Следуйте инструкциям первоначальной настройки. При появлении запроса создайте бесплатную учётную запись dbt или войдите в существующую. Если вы используете собственные учётные данные провайдера ИИ ([BYOK](/docs/dbt-ai/wizard-byok)), вход можно пропустить.

## Добавление проектов dbt

На экране **Scan for your dbt projects** выберите, как <Constant name="wizard" /> будет находить проекты:

- **Scan for projects**: <Constant name="wizard" /> ищет локальные репозитории <Constant name="git" /> и добавляет все найденные проекты dbt. При появлении запроса разрешите доступ к папкам macOS, чтобы приложение могло обнаружить проекты.
- **Add from <Constant name="dbt_platform" />**: подключите свою учётную запись <Constant name="dbt_platform" />. <Constant name="wizard" /> выполнит аутентификацию и покажет список ваших проектов на платформе; по умолчанию будут выбраны все проекты. Выберите проекты для добавления и, при необходимости, папку для их клонирования, затем нажмите **Clone**. <Constant name="wizard" /> клонирует проекты локально, чтобы вы могли работать с файлами.
- **Add a folder instead**: выберите папку проекта на своём компьютере.
- **Start chatting without one**: пропустите настройку проекта. Чат без проекта не использует файлы проекта или подключение к хранилищу данных, поэтому переходите к разделу [Начало первого сеанса](#start-your-first-session).
- Когда закончите, нажмите **Continue**.

## Выбор способа доступа к модели ИИ

На экране **Connect an AI model provider** выберите, как <Constant name="wizard" /> будет получать доступ к модели ИИ:

- **Start free trial with dbt-managed keys**: dbt Labs управляет ключами и предоставляет доступ к актуальным моделям OpenAI, Anthropic и моделям с открытым исходным кодом. Использование учитывается в рамках ваших кредитов dbt.
- **Use my own API key**: используйте собственные учётные данные провайдера с помощью [BYOK](/docs/dbt-ai/wizard-byok) для OpenAI, Anthropic, AWS Bedrock, Azure, Snowflake Cortex, Google Gemini, Databricks и других сервисов. Оплату взимает непосредственно ваш провайдер; этот вариант работает без тарифного плана dbt platform.
- **Skip, I'll do this later**: продолжите без выбора провайдера. Чтобы настроить его позже, перейдите в **Settings** &rarr; **AI providers**.

<WizardTrialBilling />

## Настройка подключения к хранилищу данных {#set-up-your-warehouse-connection}

Для запуска проекта или выполнения запросов к его данным <Constant name="wizard" /> необходимо подключение к хранилищу данных. На главном экране выберите **Set a connection**. По умолчанию <Constant name="wizard" /> подключается через ваш `profiles.yml`, который может быть ещё не настроен для проекта. Выберите один из вариантов:

- **Set warehouse credentials**: введите свои учётные данные, и <Constant name="wizard" /> сохранит их локально в [`profiles.yml`](/docs/local/profiles.yml) и подключится напрямую. Используйте те же учётные данные разработчика, которые вы использовали бы для разработки в <Constant name="dbt_platform" />. Сведения о том, какие данные вводить, см. в разделах [Начало работы со Studio IDE](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) и [Окружения dbt platform](/docs/dbt-platform-environments).
- **Use the dbt platform CLI**: <Constant name="wizard" /> работает через вашу учётную запись <Constant name="dbt_platform" />, поэтому учётные данные остаются на платформе. Требуется отдельная установка [<Constant name="dbt_platform" /> CLI](/docs/platform/dbt-cli-installation).

Если подключение уже существует — через активный сеанс <Constant name="dbt_platform" /> или локальный `profiles.yml`, — <Constant name="wizard" /> воспользуется им, и вы сможете перейти к разделу [Начало первого сеанса](#start-your-first-session).


## Начало первого сеанса {#start-your-first-session}

Прежде чем отправить первый запрос, проверьте настройки сеанса в области ввода запроса:

1. Убедитесь, что выбран нужный проект, или оставьте поле пустым для чата без проекта.
2. Для сеанса с проектом выберите, где <Constant name="wizard" /> должен запускать проект, например `default · dev`. Если доступных вариантов нет, [настройте подключение к хранилищу данных](#set-up-your-warehouse-connection).
3. Выберите модель и глубину её рассуждений. Если доступных моделей нет, настройте провайдера в **Settings** &rarr; **AI providers**.
4. Выберите, какие действия <Constant name="wizard" /> может выполнять без вашего одобрения. Доступные режимы разрешений, описанные в [следующем разделе](#review-and-accept-changes): **Plan changes**, **Ask for approval** и **Auto**.
5. Опишите, что вы хотите поручить <Constant name="wizard" />, или выберите вариант быстрого старта, например **Audit for test coverage**, **Tell me about this project** или **Help me refactor a model**.

Вот несколько запросов, которые стоит попробовать при первом запуске:

- `Tell me about this project`
- `Which models have no tests?`
- `Refactor stg_orders and show me what changes in the data`

Чат — это отдельная беседа о вашем проекте. Каждый чат с проектом работает в собственной копии репозитория и отдельной ветке, используя рабочее дерево <Constant name="git" /> (worktree), поэтому вы можете одновременно вести несколько задач, не мешая одной другой.

Каждый чат получает имя, например `docs-fox`, которое также используется для его ветки и схемы. Подробнее о значении этих имён см. в разделе [Имена рабочих деревьев и схем](/docs/dbt-ai/wizard-desktop-use#worktree-and-schema-names).

## Проверка и принятие изменений {#review-and-accept-changes}

<Constant name="wizard" /> изучает граф зависимостей, тесты и метаданные вашего проекта, запускает инструменты и <WizardPopcorn>создаёт по волшебству</WizardPopcorn> изменения в виде сравнения версий. Дальнейшие действия зависят от выбранного [режима разрешений](/docs/dbt-ai/wizard-desktop-use#permission-modes):

- **Plan changes**: <Constant name="wizard" /> предлагает подход, ничего не редактируя.
- **Ask for approval**: <Constant name="wizard" /> предлагает каждое изменение и ждёт. Ничего не записывается, пока вы не одобрите изменение.
- **Auto**: <Constant name="wizard" /> применяет правки и показывает индикатор изменений, который можно открыть для их проверки.

Каждое изменение представлено в виде сравнения версий, доступного для проверки. Вы можете прокомментировать конкретную строку, ячейку таблицы или диаграмму, чтобы отправить обратную связь в чат. См. раздел [Проверка изменений](/docs/dbt-ai/wizard-desktop-use#review-what-changed).

## Обновление приложения {#update-the-app}

Когда появляется новая версия Wizard Desktop, приложение обычно сообщает об этом через несколько секунд после запуска. Нажмите **Install**, чтобы обновить приложение, или **Dismiss**, чтобы отложить обновление до следующего запуска. 

Чтобы проверить наличие обновлений в любое время:

1. Перейдите в **Settings** &rarr; **General** &rarr; **Application updates**. Здесь отображается текущая версия приложения.
2. Нажмите **Check for updates**.
3. Если доступна новая версия, нажмите **Install version** и дождитесь завершения установки.
4. Нажмите **Restart to finish update**. Приложение не перезапустится автоматически.

Вы также можете включить автоматические обновления с помощью переключателя **Automatic updates** в том же разделе.

## Переходите с CLI?

Это тот же знакомый вам <Constant name="wizard" />, работающий на том же движке, что и [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli). В приложении есть встроенный терминал, поэтому вы можете запускать команды dbt привычным способом, а также в любой момент выбрать **Open in**, чтобы открыть ту же ветку в iTerm, Terminal, VS Code, Cursor или Finder.

[Скачайте Wizard Desktop](#install-and-open-wizard-desktop) и установите приложение.

Сведения о файлах конфигурации, используемых CLI, см. в [справочнике по конфигурации](/docs/dbt-ai/wizard-config).


<SimpleTable>

| | [Wizard Desktop](/docs/dbt-ai/wizard-desktop) | [CLI](/docs/dbt-ai/wizard-cli) | [dbt platform](/docs/platform/wizard-platform) |
|---|---|---|---|
| Где работает | Нативное приложение на вашем компьютере | Ваш терминал | Браузер |
| Лучше всего подходит для | Наблюдения за работой и управления ею, ведения нескольких задач одновременно | Написания скриптов и рабочих процессов в терминале | Полноценной разработки и аналитики для бизнес-пользователей |
| Визуальное представление таблиц, диаграмм и различий | Да | Обычный текст в терминале | Да |
| Параллельная работа | Да, каждый чат получает собственное рабочее дерево | Один сеанс на терминал | Да |
| История чатов | Хранится в приложении | Возобновление предыдущего сеанса с помощью `wizard resume` | Хранится в вашей учётной записи dbt |
| Доступность | Публичная бета-версия, скачайте приложение | Публичная бета-версия, установите CLI | Публичная предварительная версия, в вашей учётной записи dbt |

</SimpleTable>

## Что дальше

- [Использование Wizard Desktop](/docs/dbt-ai/wizard-desktop-use): параллельные чаты, проверка результатов, комментарии, сравнение версий и устранение неполадок
- [Настройки Wizard Desktop](/docs/dbt-ai/wizard-desktop-settings): провайдеры, коннекторы, внешний вид, сочетания клавиш и GitHub
- [Сценарии использования и примеры](/docs/dbt-ai/wizard-use-cases)
- [Как использовать <Constant name="wizard" /> в проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro)
- [Настройка BYOK](/docs/dbt-ai/wizard-byok)

<WizardFeedbackCallout />
