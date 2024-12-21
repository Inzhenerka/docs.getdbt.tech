---
title: "Запуск ваших dbt проектов"
id: "run-your-dbt-projects"
pagination_prev: null
---
Вы можете запускать свои dbt проекты с помощью [dbt Cloud](/docs/cloud/about-cloud/dbt-cloud-features) или [dbt Core](https://github.com/dbt-labs/dbt-core):

- **dbt Cloud**: Хостинг-приложение, в котором вы можете разрабатывать проекты прямо из веб-браузера, используя [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud). Оно также поддерживает разработку с использованием интерфейса командной строки, [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). Среди прочих функций, dbt Cloud предоставляет:

  - Среду разработки, которая помогает быстрее создавать, тестировать, запускать и [управлять версиями](/docs/collaborate/git-version-control) вашего проекта.
  - Возможность делиться [документацией вашего dbt проекта](/docs/build/documentation) с вашей командой.
  - Интеграцию с dbt Cloud IDE, позволяющую выполнять задачи разработки и управлять средой в интерфейсе dbt Cloud для бесшовного опыта.
  - dbt Cloud CLI для разработки и выполнения dbt команд в вашей среде разработки dbt Cloud с локальной командной строки.
  - Для получения более подробной информации обратитесь к [Разработка dbt](/docs/cloud/about-develop-dbt).

- **dbt Core**: Открытый проект, в котором вы можете разрабатывать из [командной строки](/docs/core/installation-overview).

dbt Cloud CLI и dbt Core — это инструменты командной строки, которые позволяют выполнять dbt команды. Основное различие заключается в том, что dbt Cloud CLI адаптирован для инфраструктуры dbt Cloud и интегрируется со всеми его [функциями](/docs/cloud/about-cloud/dbt-cloud-features).

Командная строка доступна из терминального приложения вашего компьютера, такого как Terminal и iTerm. С помощью командной строки вы можете выполнять команды и выполнять другую работу из текущего рабочего каталога на вашем компьютере. Перед запуском dbt проекта из командной строки убедитесь, что вы работаете в каталоге вашего dbt проекта. Изучение команд терминала, таких как `cd` (смена каталога), `ls` (список содержимого каталога) и `pwd` (текущий рабочий каталог), может помочь вам ориентироваться в структуре каталогов на вашей системе.

В dbt Cloud или dbt Core команды, которые вы часто используете, это:

- [dbt run](/reference/commands/run) &mdash; Запускает модели, которые вы определили в вашем проекте
- [dbt build](/reference/commands/build) &mdash; Создает и тестирует выбранные вами ресурсы, такие как модели, семена, снимки и тесты
- [dbt test](/reference/commands/test) &mdash; Выполняет тесты, которые вы определили для вашего проекта

Для получения информации обо всех dbt командах и их аргументах (флагах) см. [Справочник команд dbt](/reference/dbt-commands). Если вы хотите перечислить все dbt команды из командной строки, выполните `dbt --help`. Чтобы перечислить конкретные аргументы dbt команды, выполните `dbt COMMAND_NAME --help`.

## Связанные документы

- [Как мы настраиваем наши компьютеры для работы с dbt проектами](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243)
- [Синтаксис выбора моделей](/reference/node-selection/syntax)
- [dbt Cloud CLI](/docs/cloud/cloud-cli-installation)
- [Функции Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#ide-features)
- [Предоставляет ли dbt функции извлечения и загрузки?](/faqs/Project/transformation-tool)
- [Почему для компиляции dbt требуется подключение к платформе данных](/faqs/Warehouse/db-connection-dbt-compile)