---
title: "dbt Copilot: часто задаваемые вопросы"
sidebar_label: "dbt Copilot FAQs"
description: "Ответы на распространённые вопросы о dbt Copilot."
---

<IntroText>
Ознакомьтесь с распространёнными вопросами о <Constant name="copilot" />, чтобы понять, как он работает и как может вам помочь.
</IntroText>

<Constant name="copilot" /> — это AI‑ассистент, полностью интегрированный в вашу среду <Constant name="cloud" />, который берёт на себя рутинные задачи, ускоряет рабочие процессы и обеспечивает единообразие, помогая быстрее создавать качественные data‑продукты.

dbt Labs привержена защите вашей конфиденциальности и данных. На этой странице представлена информация о том, как <Constant name="copilot" /> обрабатывает ваши данные. Подробнее см. на странице [принципов разработки ИИ dbt Labs](https://www.getdbt.com/legal/ai-principles).

## Обзор

<Expandable alt_header="Что такое dbt Copilot?">

<Constant name="copilot" /> — это мощный AI‑ассистент, полностью интегрированный в вашу среду <Constant name="cloud" /> и предназначенный для ускорения аналитических рабочих процессов. <Constant name="copilot" /> встраивает AI‑поддержку на каждом этапе жизненного цикла разработки аналитики (ADLC), помогая специалистам по данным быстрее поставлять data‑продукты, повышать качество данных и улучшать их доступность.

Благодаря автоматической генерации кода вы можете позволить <Constant name="copilot" /> [генерировать код](/docs/cloud/use-dbt-copilot) на основе естественного языка, а также [создавать документацию](/docs/build/documentation), [data‑тесты](/docs/build/data-tests), [метрики](/docs/build/metrics-overview) и [семантические модели](/docs/build/semantic-models) одним нажатием кнопки в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-copilot), [<Constant name="visual_editor" />](/docs/cloud/use-canvas) и [<Constant name="query_page" />](/docs/explore/dbt-insights).

</Expandable>

<Expandable alt_header="Где можно найти dbt Copilot?">

<Constant name="copilot" /> доступен в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-copilot), [<Constant name="visual_editor" />](/docs/cloud/use-canvas) и [<Constant name="query_page" />](/docs/explore/dbt-insights). В будущих релизах <Constant name="copilot" /> появится и в других частях приложения <Constant name="cloud" />.

Чтобы использовать <Constant name="copilot" />, у вас должен быть аккаунт <Constant name="cloud" /> уровня [Starter, Enterprise или Enterprise+](https://www.getdbt.com/contact), а также административные права для включения этой функции для вашей команды.

Некоторые возможности, такие как [BYOK](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok), [естественные запросы в Canvas](/docs/cloud/build-canvas-copilot) и другие, доступны только на планах Enterprise и Enterprise+.

</Expandable>

<Expandable alt_header="Какие преимущества даёт использование dbt Copilot?">

Используйте <Constant name="copilot" />, чтобы:

- Генерировать код с нуля или редактировать существующий код с помощью естественного языка.
- Создавать документацию, тесты, метрики и семантические модели для ваших моделей.
- Ускорять процесс разработки благодаря AI‑поддержке.

— всё это одним нажатием кнопки при сохранении конфиденциальности и безопасности данных.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Пример использования dbt Copilot для генерации документации в IDE" />

</Expandable>

## Доступность

<Expandable alt_header="Кто имеет доступ к dbt Copilot?">

После включения администратором <Constant name="copilot" /> становится доступен в аккаунтах <Constant name="cloud" /> уровня [Starter, Enterprise или Enterprise+](https://www.getdbt.com/contact) для всех пользователей с лицензией разработчика <Constant name="cloud" /> ([developer license users](/docs/cloud/manage-access/seats-and-users)).

</Expandable>

<Expandable alt_header="Доступен ли dbt Copilot для всех типов развертывания?">

Да, <Constant name="copilot" /> работает на базе ai-codegen-api, который развернут во всех средах, включая [мультиарендные и выделенные развертывания](/docs/cloud/about-cloud/access-regions-ip-addresses).

</Expandable>

## Как это работает

<Expandable alt_header="Какие данные или код используются для обучения модели, поддерживающей dbt Copilot?">

<Constant name="copilot" /> не используется для обучения больших языковых моделей (LLM). dbt Labs вообще не обучает собственные модели. В настоящее время мы используем модели OpenAI, и наше соглашение с OpenAI запрещает им длительное хранение наших данных. Дополнительную информацию см. на странице [принципов ИИ dbt Labs](https://www.getdbt.com/legal/ai-principles).

</Expandable>

<Expandable alt_header="Каких провайдеров моделей использует dbt Copilot?">

dbt Labs сотрудничает с OpenAI для создания и эксплуатации <Constant name="copilot" />. Аккаунты уровня Enterprise могут [использовать собственные ключи OpenAI](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok).

</Expandable>

<Expandable alt_header="Поддерживается ли BYOK (bring your own key) на уровне проекта?">

В настоящее время опция BYOK для <Constant name="copilot" /> настраивается только на уровне аккаунта. Однако в будущем возможно появление настройки на уровне проекта.

</Expandable>

## Конфиденциальность и данные

<Expandable alt_header="Хранит или использует ли dbt Copilot персональные данные?">

Пользователь нажимает кнопку <Constant name="copilot" />. За исключением аутентификации, работа происходит без использования персональных данных, при этом пользователь сам контролирует, какие данные передаются в <Constant name="copilot" />.

</Expandable>

<Expandable alt_header="Могут ли данные dbt Copilot быть удалены по письменному запросу клиента?">

В той мере, в какой клиент укажет на персональную или чувствительную информацию, загруженную пользователем в системы dbt Labs по ошибке, такие данные могут быть удалены в течение 30 дней с момента получения письменного запроса.

</Expandable>

<Expandable alt_header="Принадлежит ли dbt Labs результат, сгенерированный dbt Copilot?">

Нет, dbt Labs не оспаривает ваше право собственности на любой код или артефакты, уникальные для вашей компании, которые были сгенерированы при использовании <Constant name="copilot" />. Ваш код не будет использоваться для обучения AI‑моделей в интересах dbt Labs или третьих лиц, включая других клиентов dbt Labs.

</Expandable>

<Expandable alt_header="Есть ли у dbt Labs отдельные условия использования для dbt Copilot?">

Клиентам, подписавшим договоры после января 2024 года, не требуются дополнительные условия перед включением <Constant name="copilot" />. Клиенты с более ранними договорами также защищают свои данные за счёт обязательств по конфиденциальности и удалению данных. Если клиенту потребуются дополнительные условия, он может подписать предварительно согласованное AI & Beta Addendum, доступное [здесь](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=85817ff4-9ce5-4fae-8e34-20b854fdb52a&env=na2&acct=858db9e4-4a6d-48df-954f-84ece3303aac&v=2) (подпись dbt Labs будет датирована датой подписания клиентом).

</Expandable>

## Ограничения и особенности

<Expandable alt_header="Какие моменты стоит учитывать при использовании dbt Copilot?">

При использовании <Constant name="copilot" /> следует учитывать следующее:

- <Constant name="copilot" /> недоступен в <Constant name="cloud_cli" />.
- <Constant name="copilot" /> недоступен через API <Constant name="cloud" />.

В будущих релизах планируется расширить доступность <Constant name="copilot" /> в других частях приложения <Constant name="cloud" />.

</Expandable>

## Allowlisting URL для Copilot

<Expandable alt_header="Allowlisting URLs">

<Constant name="copilot" /> не блокирует AI‑URL напрямую. Однако если в вашей организации используются платформы защиты конечных точек, файрволы или сетевые прокси (например, Zscaler), при работе с <Constant name="copilot" /> могут возникать следующие проблемы:

- Блокировка неизвестных или AI‑связанных доменов.
- Разрыв TLS/SSL‑трафика для его инспекции.
- Запрет определённых портов или сервисов.

Мы рекомендуем добавить следующие URL в allowlist:

**Для <Constant name="copilot" /> в IDE**:

- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_generic_tests/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_documentation/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_semantic_model/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_inline`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_metrics/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/track_response`

**Для <Constant name="copilot" /> в Canvas**:

- `/api/private/visual-editor/v1/ai/llm-generate`
- `/api/private/visual-editor/v1/ai/track-response`
- `/api/private/visual-editor/v1/files/${fileId}/llm-generate-dag-through-chat`

</Expandable>
