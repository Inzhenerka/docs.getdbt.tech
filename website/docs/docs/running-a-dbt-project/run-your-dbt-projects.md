---
title: "Запуск ваших dbt проектов"
id: "run-your-dbt-projects"
pagination_prev: null
---
Вы можете запускать свои dbt‑проекты с помощью [<Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features) или [<Constant name="core" />](https://github.com/dbt-labs/dbt-core):

- **<Constant name="cloud" />**: размещённое приложение, в котором вы можете разрабатывать напрямую в веб‑браузере, используя [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio). Также оно нативно поддерживает разработку с использованием интерфейса командной строки — [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation). Помимо прочего, <Constant name="cloud" /> предоставляет:

  - Среду разработки, которая помогает быстрее создавать, тестировать, запускать и вести [контроль версий](/docs/cloud/git/git-version-control) вашего проекта.
  - Возможность делиться [документацией вашего dbt‑проекта](/docs/build/documentation) с командой.
  - Интеграцию с <Constant name="cloud_ide" />, позволяющую выполнять задачи разработки и работать со средой прямо в интерфейсе <Constant name="cloud" /> для более бесшовного опыта.
  - <Constant name="cloud" /> CLI для разработки и выполнения команд dbt в вашей среде разработки <Constant name="cloud" /> из локальной командной строки.
  - Подробнее см. [Develop dbt](/docs/cloud/about-develop-dbt).

- **<Constant name="core" />**: проект с открытым исходным кодом, в котором вы можете разрабатывать, работая из [командной строки](/docs/core/installation-overview).

<Constant name="cloud" /> CLI и <Constant name="core" /> — это инструменты командной строки, которые позволяют запускать команды dbt. Ключевое отличие заключается в том, что <Constant name="cloud" /> CLI адаптирован под инфраструктуру <Constant name="cloud" /> и интегрируется со всеми её [возможностями](/docs/cloud/about-cloud/dbt-cloud-features).

Командная строка доступна из терминального приложения вашего компьютера, такого как Terminal и iTerm. С помощью командной строки вы можете выполнять команды и выполнять другую работу из текущего рабочего каталога на вашем компьютере. Перед запуском dbt проекта из командной строки убедитесь, что вы работаете в каталоге вашего dbt проекта. Изучение команд терминала, таких как `cd` (смена каталога), `ls` (список содержимого каталога) и `pwd` (текущий рабочий каталог), может помочь вам ориентироваться в структуре каталогов на вашей системе.

В <Constant name="cloud" /> или <Constant name="core" /> вы чаще всего используете следующие команды:

- [dbt run](/reference/commands/run) &mdash; Запускает модели, которые вы определили в вашем проекте
- [dbt build](/reference/commands/build) &mdash; Создает и тестирует выбранные вами ресурсы, такие как модели, семена, снимки и тесты
- [dbt test](/reference/commands/test) &mdash; Выполняет тесты, которые вы определили для вашего проекта

Для получения информации обо всех dbt командах и их аргументах (флагах) см. [Справочник команд dbt](/reference/dbt-commands). Если вы хотите перечислить все dbt команды из командной строки, выполните `dbt --help`. Чтобы перечислить конкретные аргументы dbt команды, выполните `dbt COMMAND_NAME --help`.

## Связанные документы

- [Как мы настраиваем наши компьютеры для работы над проектами dbt](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243)
- [Синтаксис выбора моделей](/reference/node-selection/syntax)
- [CLI <Constant name="cloud" />](/docs/cloud/cloud-cli-installation)
- [Возможности Cloud <Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio#ide-features)
- [Предоставляет ли dbt функциональность извлечения и загрузки данных?](/faqs/Project/transformation-tool)
- [Почему для dbt compile требуется подключение к платформе данных](/faqs/Warehouse/db-connection-dbt-compile)
