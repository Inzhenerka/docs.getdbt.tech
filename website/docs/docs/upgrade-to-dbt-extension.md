---
title: Переход на dbt v2
id: upgrade-to-dbt-extension
description: "Переведите свой проект dbt на dbt v2 с помощью расширения для VS Code."
sidebar_label: "Переход на dbt v2"
availability: local_all
---

# Переход на <Constant name="fusion" /> {#upgrade-to}

После [установки расширения dbt для VS Code](/docs/install-dbt-extension) используйте панель **Get started**, чтобы перевести свой проект на <Constant name="fusion_engine" />, если вы еще этого не сделали.

:::note

Если вы уже используете <Constant name="fusion_engine" />, для работы с инструментом перехода требуется версия `2.0.0-beta.66` или выше.

:::

Расширение dbt предлагает два способа перевести проект на <Constant name="fusion" /> через панель **Get started**:

- [**Миграция с помощью агентов**:](#agentic-migration) Выполняет миграцию с <Constant name="core" /> на <Constant name="fusion" /> с помощью <Constant name="copilot" /> или ИИ-агентов. Выберите этот вариант на шаге **Check dbt v2 compatibility**. Требуется <Constant name="copilot" /> или ИИ-агенты.
- [**Ручной переход через CLI**:](#manual-cli-onboarding) Пошагово проводит вас через процесс перехода в терминале. Используйте этот вариант, если предпочитаете CLI или не используете <Constant name="copilot" /> или ИИ-агентов.

## Миграция с помощью агентов {#agentic-migration}

1. Выберите **Start with an agent** на шаге **Check dbt v2 compatibility**.
2. Расширение устанавливает навык агента **Migrate <Constant name="core" /> to <Constant name="fusion" />** в папку навыков вашего редактора, а затем открывает ИИ-чат с запросом на миграцию.
3. Нажмите **Install & open chat**, чтобы продолжить. Чат откроется с уже загруженным запросом на миграцию, поэтому вы сможете запустить его прямо из редактора. Выполнять команды CLI не требуется.

## Ручной переход через CLI {#manual-cli-onboarding}

На панели **Get started** есть помощник, который пошагово проводит вас через процесс перехода в терминале.

    <Lightbox src="/img/docs/extension/vsce-manual-upgrade.png" width="100%" title="Панель Get started и помощник перехода в расширении dbt." />

Вы можете начать ручной переход любым из следующих способов:

<Tabs>
<TabItem value="panel" label="Через панель Get started">

- На панели **Get started** выберите **Start manually in CLI** на шаге **Check dbt v2 compatibility**.
- Следуйте указаниям помощника, чтобы завершить переход.
- Выполните ` dbtf compile`, чтобы убедиться, что ваш проект готов к работе с <Constant name="fusion" />.

<Lightbox src="/img/docs/extension/v2-onboarding-complete.png" width="70%" title="Сообщение, которое появляется после завершения перехода проекта на v2." />

После завершения перехода вы можете приступить к изучению всех возможностей <Constant name="fusion_engine" />!

Затем [войдите](/docs/sign-in-dbt-extension) в учетную запись <Constant name="dbt_platform" />, если хотите использовать возможности <Constant name="dbt_platform" /> в расширении.

</TabItem>
<TabItem value="terminal" label="Через терминал">
- Выполните в терминале:

    ```shell
    dbt init --v2-upgrade
    ```

Инструмент перехода проведет вас через последовательность запросов:

<Expandable alt_header="У вас уже есть учетная запись dbt platform?">

Если вы ответите `Y`, инструмент предоставит инструкции по скачиванию профиля dbt platform или аутентификации. Если вы ответите `N`, процесс продолжится настройкой локального проекта.

</Expandable>

<Expandable alt_header="Готовы запустить dbt init?">

Если файл `profiles.yml` отсутствует, инструмент поможет вам создать его и подключиться к хранилищу данных.
</Expandable>

<Expandable alt_header="Готовы запустить dbt debug?">

Если файл `profiles.yml` существует, инструмент проверит, что ваш проект настроен правильно и может подключиться к хранилищу данных.

</Expandable>

<Expandable alt_header="Готовы запустить dbt parse?">

Инструмент выполняет разбор вашего проекта dbt, чтобы проверить совместимость с <Constant name="fusion" />.
  - Если разбор завершится с ошибкой, инструмент может запустить [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation), чтобы помочь устранить ошибки.
  - Если вы пропустите запуск dbt-autofix, его можно будет запустить позже или исправить ошибки вручную. Инструмент перехода не сможет продолжить работу, пока ошибки разбора не будут устранены.

</Expandable>

<Expandable alt_header="Готовы запустить dbt compile с отключенным статическим анализом?">

После успешного разбора инструмент компилирует ваш проект без статического анализа. Это воспроизводит поведение <Constant name="core" />: Jinja преобразуется в SQL, а расширенные возможности <Constant name="fusion" /> по анализу SQL временно отключаются.

</Expandable>

    :::tip ИИ-агенты

    В некоторых случаях dbt-autofix не может устранить все ошибки и требуется ручное вмешательство. Для таких случаев инструмент dbt-autofix предоставляет файл [AI Agents.md](https://github.com/dbt-labs/dbt-autofix/blob/main/AGENTS.md), который помогает ИИ-агентам продолжить миграцию после того, как dbt-autofix выполнит свою часть работы.

    :::

<Expandable alt_header="Готовы запустить dbt compile?" anchor_id="dbt-compile-details-2">

Инструмент компилирует ваш проект с полным статическим анализом <Constant name="fusion" />. Это позволяет проверить корректность вашего SQL-кода с учетом таблиц и столбцов в хранилище данных.

    <Lightbox src="/img/docs/extension/v2-onboarding-complete.png" width="70%" title="Сообщение, которое появляется после завершения перехода проекта на v2." />

</Expandable>

После завершения перехода вы можете приступить к изучению всех возможностей <Constant name="fusion_engine" />!

Затем [войдите](/docs/sign-in-dbt-extension) в учетную запись <Constant name="dbt_platform" />, если хотите использовать возможности <Constant name="dbt_platform" /> в расширении.

</TabItem>
</Tabs>

## Дальнейшие шаги {#next-steps}

После перевода проекта на <Constant name="fusion" /> вы можете:

- [Войти](/docs/sign-in-dbt-extension) в учетную запись <Constant name="dbt_platform" />, если хотите использовать возможности <Constant name="dbt_platform" /> в расширении, например вкладку **Catalog**.
- [Настроить локальное окружение](/docs/configure-dbt-extension) в соответствии с вашим окружением <Constant name="dbt_platform" /> и [задать переменные окружения](/docs/configure-dbt-extension#set-environment-variables-locally), необходимые для проекта.
- [Сравнить изменения локально](/docs/dbt/vs-compare-changes), чтобы предварительно оценить изменения данных, вызванные вашими локальными правками.
- [Оптимизировать статический анализ для разработки и развертывания](/best-practices/optimize-static-analysis-for-development-and-deployment), чтобы выполнять более тщательную локальную проверку, не замедляя задания развертывания.
- Ознакомиться с [ограничениями и неподдерживаемыми возможностями](/docs/dbt/supported-features#limitations).
