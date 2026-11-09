---
title: "Запуск ваших dbt проектов"
id: "run-your-dbt-projects"
pagination_prev: null
availability: all_users
---
Вы можете запускать свои проекты dbt локально или с помощью [<Constant name="dbt_platform" />](/docs/platform/about-platform/dbt-platform-features), используя фреймворк dbt.

## Основные команды

В dbt чаще всего используются следующие команды:

- [dbt run](/reference/commands/run) &mdash; Запускает модели, определённые в вашем проекте
- [dbt build](/reference/commands/build) &mdash; Создаёт и тестирует выбранные ресурсы, такие как модели, seeds, снимки и тесты
- [dbt test](/reference/commands/test) &mdash; Выполняет тесты, определённые для вашего проекта

Все команды dbt и их аргументы (флаги) приведены в [справочнике команд dbt](/reference/dbt-commands). Чтобы вывести список всех команд dbt в командной строке, выполните `dbt --help`. Чтобы вывести аргументы конкретной команды, выполните `dbt COMMAND_NAME --help`.

<Expandable alt_header="Впервые работаете с командной строкой?">

Если вы впервые работаете с командной строкой:
1. Откройте приложение терминала на своём компьютере (например, Terminal или iTerm), чтобы получить доступ к командной строке. 
2. Прежде чем выполнять любые команды dbt, убедитесь, что вы перешли в каталог своего проекта dbt. 
3. Эти команды терминала помогут вам перемещаться по файловой системе: `cd` (сменить каталог), `ls` (вывести содержимое каталога) и `pwd` (показать текущий рабочий каталог).

</Expandable>

## Где запускать dbt

import DbtFramework from '/snippets/_dbt-framework.md';

<DbtFramework />

### Платформа dbt

<Constant name="dbt_platform" /> — это полностью управляемый сервис, предоставляющий полноценную среду для разработки, тестирования, развёртывания проектов dbt и совместной работы над ними. Вы можете вести разработку в браузере или использовать самостоятельно установленный dbt.

- [Разрабатывайте в браузере с помощью <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)
- [Запускайте команды dbt из локальной командной строки](#dbt-local-development) с помощью расширения dbt для VS Code или <Constant name="platform_cli" /> (оба инструмента легко интегрируются с проектами <Constant name="dbt_platform" />).

Подробнее см. в разделе [О тарифных планах dbt](https://www.getdbt.com/pricing).

### Разработка с самостоятельно установленным dbt {#dbt-local-development}

Вы можете запускать dbt локально с движком <Constant name="fusion_engine" /> или <Constant name="core" />:
- [Установите dbt](/docs/local/install-dbt) &mdash; Установите <Constant name="fusion" /> из командной строки
- [Установите расширение dbt для VS Code](/docs/about-dbt-extension) &mdash; Сочетает производительность <Constant name="fusion_engine" /> с визуальными возможностями, такими как автодополнение, отображение ошибок прямо в коде и граф зависимостей данных. Включает [возможности <Term id="lsp" />](/docs/about-dbt-lsp) и подходит как пользователям с проектами <Constant name="dbt_platform"/>, так и тем, кто запускает dbt локально без проекта <Constant name="dbt_platform" />. _Рекомендуется для локальной разработки._
- [Установите <Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) &mdash; Интерфейс командной строки <Constant name="dbt_platform" />, позволяющий выполнять команды dbt в вашей среде разработки <Constant name="dbt_platform" /> из локальной командной строки. Требуется проект <Constant name="dbt_platform" />.

## Связанные документы {#related-docs}

- [О расширении dbt для VS Code](/docs/about-dbt-extension)
- [Возможности <Constant name="dbt" />](/docs/platform/about-platform/dbt-platform-features)
- [Синтаксис выбора моделей](/reference/node-selection/syntax)
- [CLI <Constant name="dbt" />](/docs/platform/dbt-cli-installation)
- [Возможности <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio#studio-ide-features)
- [Предоставляет ли dbt функции извлечения и загрузки данных?](/faqs/Project/transformation-tool)
- [Почему dbt compile требуется подключение к платформе данных](/faqs/Warehouse/db-connection-dbt-compile)
