---
title: Установка CLI платформы dbt
sidebar_label: "Установка"
id: dbt-cli-installation
description: "Инструкции по установке и настройке инструмента CLI платформы dbt."
pagination_next: "docs/platform/configure-dbt-cli"
availability:
  surface: platform
  access: login_required
---

import LongSession from '/snippets/_long-sessions-cli.md';

<Constant name="dbt_platform" /> поддерживает разработку с помощью интерфейса командной строки (CLI), предоставляя участникам команды больше гибкости и возможностей для совместной работы. <Constant name="platform_cli" /> позволяет выполнять команды dbt в среде разработки <Constant name="dbt_platform" /> из локальной командной строки.

:::note Совместимость CLI

<Constant name="platform_cli" /> — это инструмент <Constant name="dbt_platform" />, доступный пользователям на любом [тарифном плане](https://www.getdbt.com/pricing). Он предназначен исключительно для работы с <Constant name="dbt_platform" /> и может конфликтовать с локальными установками CLI <Constant name="core" /> или <Constant name="fusion_engine" />. Подробнее см. в разделе [FAQs](#faqs).

:::

Команды dbt выполняются в инфраструктуре платформы, что обеспечивает следующие преимущества:

* Безопасное хранение учетных данных в <Constant name="dbt_platform" />
* [Автоматическое использование артефактов сборки](/docs/platform/about-defer) из производственной среды вашего проекта
* Более быстрые сборки с меньшими затратами
* Поддержка dbt Mesh ([межпроектные ссылки `ref`](/docs/mesh/govern/project-dependencies))

<Lightbox src="/img/docs/dbt-platform/dbt-cli-overview.png" title="Схема взаимодействия CLI платформы dbt с инфраструктурой dbt для выполнения команд dbt из локальной командной строки." />

## Предварительные требования

<Constant name="platform_cli" /> доступен во всех [регионах развертывания](/docs/platform/about-platform/access-regions-ip-addresses) как для мультитенантных, так и для однотенантных учетных записей.
- Если вы установили CLI <Constant name="core" /> в виртуальной среде, деактивируйте ее или создайте псевдоним для CLI платформы, прежде чем выполнять команды CLI платформы.
- Если вы установили dbt локально, создайте псевдоним для CLI платформы, прежде чем выполнять команды CLI платформы.

Подробнее об управлении несколькими инструментами <Constant name="platform_cli" /> и создании псевдонима см. в разделе [FAQs](#faqs).

:::tip Используете CLI <Constant name="dbt_platform"/> для гибридной разработки с <Constant name="fusion"/>?
См. руководство [Гибридная разработка с <Constant name="dbt_platform"/> и <Constant name="fusion"/>](/guides/dbt-platform-local-workflow), чтобы синхронизировать учетные данные, переменные окружения и версии <Constant name="fusion"/> между локальным CLI и <Constant name="dbt_platform"/>.
:::


## Установка CLI платформы dbt {#install-dbt-cloud-cli}

Вы можете установить <Constant name="platform_cli" /> через командную строку одним из следующих способов:

<Tabs queryString="install">

<TabItem value="brew" label="macOS (brew)">

Перед началом убедитесь, что [Homebrew установлен](http://brew.sh/) и доступен в вашем редакторе кода или терминале командной строки. Если в вашей операционной системе возникают конфликты путей, см. раздел [FAQs](#faqs).

1. Убедитесь, что <Constant name="dbt" /> еще не установлен, выполнив следующую команду:
  
  ```bash
  which dbt
  ```
  
  Если выводится `dbt not found`, это подтверждает, что он не установлен.

:::tip Выполните `pip uninstall dbt`, чтобы удалить <Constant name="core" />

Если вы установили <Constant name="core" /> глобально каким-либо другим способом, удалите его, прежде чем продолжить:

```bash
pip uninstall dbt
```

:::

2. Установите <Constant name="platform_cli" /> с помощью Homebrew:

   - Сначала удалите из Homebrew tap `dbt-labs` — отдельный репозиторий пакетов. Это предотвратит установку пакетов из этого репозитория через Homebrew:
      ```bash
      brew untap dbt-labs/dbt
      ```
   - Затем добавьте и установите <Constant name="platform_cli" /> как пакет:
      ```bash
      brew tap dbt-labs/dbt-cli
      brew install dbt
      ```
      Если у вас подключено несколько tap-репозиториев, используйте `brew install dbt-labs/dbt-cli/dbt`.

3. Проверьте установку, выполнив `dbt --help` в командной строке. Если вы видите следующий вывод, установка выполнена правильно:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и что у вас нет глобально установленной версии dbt.
   
   * Обратите внимание: при запуске среды больше не нужно выполнять команду `dbt deps`. Раньше этот шаг требовался для инициализации. Однако при любых изменениях в файле `packages.yml` по-прежнему необходимо выполнять `dbt deps`.

4. Клонируйте репозиторий на локальный компьютер с помощью `git clone`. Например, чтобы клонировать репозиторий GitHub по HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования репозитория [настройте](/docs/platform/configure-dbt-cli) <Constant name="platform_cli" /> для своего проекта <Constant name="dbt" />. Это позволит выполнять команды dbt, например [`dbt environment show`](/reference/commands/dbt-environment?version=2.0) для просмотра конфигурации <Constant name="dbt" /> или `dbt compile` для компиляции проекта и проверки моделей и тестов. Вы также сможете добавлять, редактировать и синхронизировать файлы с репозиторием.

</TabItem>

<TabItem value="windows" label="Windows (нативный исполняемый файл)">

Если в вашей операционной системе возникают конфликты путей, см. раздел [FAQs](#faqs).

1. Загрузите последнюю версию для Windows, соответствующую вашей платформе, с [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Извлеките исполняемый файл `dbt.exe` в ту же папку, где находится ваш проект dbt.

:::info

Опытные пользователи могут настроить несколько проектов для работы с одним и тем же <Constant name="platform_cli" /> следующим образом:

 1. Поместите исполняемый файл (`.exe`) в папку "Program Files"
 2. [Добавьте его в переменную окружения PATH в Windows](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53)
 3. Сохраните его там, где необходимо

Обратите внимание: если вы используете VS Code, его необходимо перезапустить, чтобы изменения переменных окружения вступили в силу.
:::

4. Проверьте установку, выполнив `./dbt --help` в командной строке. Если вы видите следующий вывод, установка выполнена правильно:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и что у вас нет глобально установленной версии dbt.

   * Обратите внимание: при запуске среды больше не нужно выполнять команду `dbt deps`. Раньше этот шаг требовался для инициализации. Однако при любых изменениях в файле `packages.yml` по-прежнему необходимо выполнять `dbt deps`.

5. Клонируйте репозиторий на локальный компьютер с помощью `git clone`. Например, чтобы клонировать репозиторий GitHub по HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

6. После клонирования репозитория [настройте](/docs/platform/configure-dbt-cli) <Constant name="platform_cli" /> для своего проекта <Constant name="dbt" />. Это позволит выполнять команды dbt, например [`dbt environment show`](/reference/commands/dbt-environment?version=2.0) для просмотра конфигурации <Constant name="dbt" /> или `dbt compile` для компиляции проекта и проверки моделей и тестов. Вы также сможете добавлять, редактировать и синхронизировать файлы с репозиторием.

</TabItem>

<TabItem value="linux" label="Linux (нативный исполняемый файл)">

Если в вашей операционной системе возникают конфликты путей, см. раздел [FAQs](#faqs).

1. Загрузите последнюю версию для Linux, соответствующую вашей платформе, с [GitHub](https://github.com/dbt-labs/dbt-cli/releases). (Выберите файл в соответствии с архитектурой процессора)

2. Извлеките бинарный файл `dbt-cli` в ту же папку, где находится ваш проект dbt.

  ```bash
  tar -xf dbt_0.29.9_linux_amd64.tar.gz
  ./dbt --version
  ```

:::info

Опытные пользователи могут настроить несколько проектов для работы с одним и тем же исполняемым файлом <Constant name="platform_cli" />, добавив его в переменную окружения PATH в файле профиля командной оболочки.

:::

3. Проверьте установку, выполнив `./dbt --help` в командной строке. Если вы видите следующий вывод, установка выполнена правильно:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и что у вас нет глобально установленной версии dbt.
   
   * Обратите внимание: при запуске среды больше не нужно выполнять команду `dbt deps`. Раньше этот шаг требовался для инициализации. Однако при любых изменениях в файле `packages.yml` по-прежнему необходимо выполнять `dbt deps`.

4. Клонируйте репозиторий на локальный компьютер с помощью `git clone`. Например, чтобы клонировать репозиторий GitHub по HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования репозитория [настройте](/docs/platform/configure-dbt-cli) <Constant name="platform_cli" /> для своего проекта <Constant name="dbt" />. Это позволит выполнять команды dbt, например [`dbt environment show`](/reference/commands/dbt-environment?version=2.0) для просмотра конфигурации <Constant name="dbt" /> или `dbt compile` для компиляции проекта и проверки моделей и тестов. Вы также сможете добавлять, редактировать и синхронизировать файлы с репозиторием.

</TabItem>

</Tabs>

## Обновление CLI платформы dbt

Ниже приведены инструкции по обновлению <Constant name="platform_cli" /> до последней версии в зависимости от вашей операционной системы.


<Tabs>

<TabItem value="mac" label="macOS (brew)">

Чтобы обновить <Constant name="platform_cli" />, выполните `brew update`, а затем `brew upgrade dbt`.

</TabItem>

<TabItem value="windows" label="Windows (исполняемый файл)">

Для обновления следуйте [инструкциям по установке для Windows](/docs/platform/dbt-cli-installation?install=windows#install-dbt-cloud-cli) и замените существующий исполняемый файл `dbt.exe` новым.

</TabItem>

<TabItem value="linux" label="Linux (исполняемый файл)">

Для обновления следуйте [инструкциям по установке для Linux](/docs/platform/dbt-cli-installation?install=linux#install-dbt-cloud-cli) и замените существующий исполняемый файл `dbt` новым.

</TabItem>

</Tabs>
  
  
## Особенности использования

import CloudCliRelativePath from '/snippets/_cloud-cli-relative-path.md';

<CloudCliRelativePath />

## FAQs

<DetailsToggle alt_header="В чем разница между CLI платформы dbt и dbt?">

<Constant name="platform_cli" /> и <a href="https://github.com/dbt-labs/dbt"><Constant name="dbt" /></a>, проект с открытым исходным кодом, — это инструменты командной строки, позволяющие выполнять команды dbt.

Ключевое отличие заключается в том, что <Constant name="platform_cli" /> разработан специально для инфраструктуры <Constant name="dbt_platform" /> и интегрирован со всеми ее <a href="https://docs.getdbt.com/docs/platform/about-platform/dbt-platform-features">возможностями</a>.

</DetailsToggle>

<DetailsToggle alt_header="Как использовать и CLI платформы dbt, и dbt?">

Для совместимости и <Constant name="platform_cli" />, и <Constant name="dbt" /> запускаются командой `dbt`. Это может приводить к конфликтам путей, если операционная система выбирает один из инструментов на основе настроек переменной окружения $PATH.

Если у вас локально установлен <Constant name="dbt" />, выберите один из вариантов:

1. Выполните нативную установку, предварительно деактивировав виртуальную среду с <Constant name="core" /> или создав псевдоним для <Constant name="platform_cli" />.
2. (Для опытных пользователей) Выполните нативную установку, но измените переменную окружения $PATH так, чтобы она корректно указывала на бинарный файл <Constant name="platform_cli" /> и позволяла использовать <Constant name="platform_cli" /> и <Constant name="dbt" /> вместе.

Вы всегда можете удалить <Constant name="platform_cli" />, чтобы вернуться к использованию <Constant name="dbt" />.

</DetailsToggle>

<DetailsToggle alt_header="Как создать псевдоним?">

Чтобы создать псевдоним для <Constant name="platform_cli" />: <br />

1. Откройте файл конфигурации профиля вашей командной оболочки. В зависимости от оболочки и системы это может быть `~/.bashrc`, `~/.bash_profile`, `~/.zshrc` или другой файл.<br />

2. Добавьте псевдоним, указывающий на бинарный файл <Constant name="platform_cli" />. Например: <code>alias dbt-cli="path_to_dbt_cli_binary"</code>
   
   Замените <code>path_to_dbt_cli_binary</code> фактическим путем к бинарному файлу <Constant name="platform_cli" /> — <code>/opt/homebrew/bin/dbt</code>. С этим псевдонимом вы сможете использовать команду <code>dbt-cli</code> для запуска <Constant name="platform_cli" />.<br />

3. Сохраните файл, а затем перезапустите командную оболочку или выполните <code>source</code> для файла профиля, чтобы применить изменения.
   Например, в bash нужно выполнить: <code>source ~/.bashrc</code><br />

4. Проверьте псевдоним и используйте его для выполнения команд:<br />
   - Для запуска <Constant name="platform_cli" /> используйте команду <code>dbt-cli</code>: <code>dbt-cli command_name</code>. Замените 'command_name' конкретной командой dbt, которую хотите выполнить.<br />
   - Для запуска <Constant name="dbt" /> используйте команду <code>dbt</code>: <code>dbt command_name</code>. Замените 'command_name' конкретной командой dbt, которую хотите выполнить.<br />


После этого вы сможете использовать команду <code>dbt-cli</code> для запуска <Constant name="platform_cli" />, сохраняя нативную установку <Constant name="dbt" />.

</DetailsToggle>

<DetailsToggle alt_header="Почему при попытке выполнить новую команду возникает ошибка `Stuck session`?">

<Constant name="platform_cli" /> позволяет одновременно выполнять только одну команду, записывающую данные в хранилище данных. Если вы попытаетесь одновременно выполнить несколько команд записи (например, `dbt run` и `dbt build`), возникнет ошибка `stuck session`. Чтобы устранить ее, отмените конкретный запуск, передав его идентификатор команде отмены. Подробнее см. в разделе [Параллельное выполнение](/reference/dbt-commands#parallel-execution).

</DetailsToggle>

<DetailsToggle alt_header="Что делать, если в CLI платформы dbt возникает ошибка `Session occupied`?">

<LongSession />

</DetailsToggle>
