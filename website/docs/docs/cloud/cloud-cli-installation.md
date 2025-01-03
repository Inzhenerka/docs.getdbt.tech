---
title: Установка dbt Cloud CLI
sidebar_label: "Установка"
id: cloud-cli-installation
description: "Инструкции по установке и настройке dbt Cloud CLI"
pagination_next: "docs/cloud/configure-cloud-cli"
---

dbt Cloud поддерживает разработку с использованием командной строки (CLI), что позволяет членам команды вносить вклад с большей гибкостью и сотрудничеством. dbt Cloud CLI позволяет вам выполнять команды dbt в вашей среде разработки dbt Cloud с локальной командной строки.

Команды dbt выполняются на инфраструктуре dbt Cloud и имеют следующие преимущества:

* Безопасное хранение учетных данных на платформе dbt Cloud
* [Автоматическая отсрочка](/docs/cloud/about-cloud-develop-defer) артефактов сборки в производственную среду вашего Cloud проекта
* Более быстрые и экономичные сборки
* Поддержка dbt Mesh ([межпроектные `ref`](/docs/collaborate/govern/project-dependencies))
* Значительные улучшения платформы, которые будут выпущены в ближайшие месяцы

<Lightbox src="/img/docs/dbt-cloud/cloud-cli-overview.jpg" title="Диаграмма, показывающая, как dbt Cloud CLI работает с инфраструктурой dbt Cloud для выполнения команд dbt с вашей локальной командной строки." />

## Предварительные требования
dbt Cloud CLI доступен во всех [регионах развертывания](/docs/cloud/about-cloud/access-regions-ip-addresses) и для учетных записей с несколькими арендаторами и одним арендатором.

## Установка dbt Cloud CLI

Вы можете установить dbt Cloud CLI в командной строке, используя один из следующих методов.

<details>
<summary>Посмотреть видеоурок с пошаговым руководством по установке.</summary>

<LoomVideo id="dd80828306c5432a996d4580135041b6?sid=fe1895b7-1281-4e42-9968-5f7d11768000"/>

</details>

<Tabs queryString="install">

<TabItem value="brew" label="macOS (brew)">

Прежде чем начать, убедитесь, что у вас установлен [Homebrew](http://brew.sh/) в вашем редакторе кода или терминале командной строки. Обратитесь к [Часто задаваемым вопросам](#faqs), если ваша операционная система сталкивается с конфликтами путей.

1. Убедитесь, что у вас не установлен dbt Core, выполнив следующую команду:
  
  ```bash
  which dbt
  ```
  
  Если вывод `dbt not found`, это подтверждает, что он не установлен.

:::tip Выполните `pip uninstall dbt`, чтобы удалить dbt Core

Если вы установили dbt Core глобально каким-либо другим способом, сначала удалите его перед продолжением:

```bash
pip uninstall dbt
```

:::

2. Установите dbt Cloud CLI с помощью Homebrew:

   - Сначала удалите `dbt-labs` tap, отдельный репозиторий для пакетов, из Homebrew. Это предотвратит установку пакетов из этого репозитория:
      ```bash
      brew untap dbt-labs/dbt
   -  Затем добавьте и установите dbt Cloud CLI как пакет:
      ```bash
      brew tap dbt-labs/dbt-cli
      brew install dbt
      ```
      Если у вас несколько tap, используйте `brew install dbt-labs/dbt-cli/dbt`.

3. Проверьте установку, выполнив `dbt --help` в командной строке. Если вы видите следующий вывод, ваша установка выполнена правильно:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и у вас не установлена глобальная версия dbt.
   
   * Обратите внимание, что вам больше не нужно выполнять команду `dbt deps` при запуске вашей среды. Этот шаг ранее требовался во время инициализации. Однако вы все равно должны выполнять `dbt deps`, если вносите изменения в ваш файл `packages.yml`.

4. Клонируйте ваш репозиторий на ваш локальный компьютер, используя `git clone`. Например, чтобы клонировать репозиторий GitHub в формате HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования вашего репозитория [настройте](/docs/cloud/configure-cloud-cli) dbt Cloud CLI для вашего проекта dbt Cloud. Это позволит вам выполнять команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment) для просмотра вашей конфигурации dbt Cloud или `dbt compile` для компиляции вашего проекта и проверки моделей и тестов. Вы также можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

</TabItem>

<TabItem value="windows" label="Windows (исполняемый файл)">

Обратитесь к [Часто задаваемым вопросам](#faqs), если ваша операционная система сталкивается с конфликтами путей.

1. Скачайте последнюю версию для Windows для вашей платформы с [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Извлеките исполняемый файл `dbt.exe` в ту же папку, что и ваш проект dbt.

:::info

Продвинутые пользователи могут настроить несколько проектов для использования одного и того же dbt Cloud CLI, выполнив следующие действия:

 1. Поместите исполняемый файл (`.exe`) в папку "Program Files"
 2. [Добавьте его в переменную среды PATH Windows](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53)
 3. Сохраните его там, где это необходимо

Обратите внимание, что если вы используете VS Code, вам нужно перезапустить его, чтобы применить измененные переменные среды.
:::

3. Проверьте установку, выполнив `./dbt --help` в командной строке. Если вы видите следующий вывод, ваша установка выполнена правильно:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и у вас не установлена глобальная версия dbt.

   * Обратите внимание, что вам больше не нужно выполнять команду `dbt deps` при запуске вашей среды. Этот шаг ранее требовался во время инициализации. Однако вы все равно должны выполнять `dbt deps`, если вносите изменения в ваш файл `packages.yml`.

4. Клонируйте ваш репозиторий на ваш локальный компьютер, используя `git clone`. Например, чтобы клонировать репозиторий GitHub в формате HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования вашего репозитория [настройте](/docs/cloud/configure-cloud-cli) dbt Cloud CLI для вашего проекта dbt Cloud. Это позволит вам выполнять команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment) для просмотра вашей конфигурации dbt Cloud или `dbt compile` для компиляции вашего проекта и проверки моделей и тестов. Вы также можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

</TabItem>

<TabItem value="linux" label="Linux (исполняемый файл)">

Обратитесь к [Часто задаваемым вопросам](#faqs), если ваша операционная система сталкивается с конфликтами путей.

1. Скачайте последнюю версию для Linux для вашей платформы с [GitHub](https://github.com/dbt-labs/dbt-cli/releases). (Выберите файл в зависимости от архитектуры вашего процессора)

2. Извлеките бинарный файл `dbt-cloud-cli` в ту же папку, что и ваш проект dbt.

  ```bash
  tar -xf dbt_0.29.9_linux_amd64.tar.gz
  ./dbt --version
  ```

:::info

Продвинутые пользователи могут настроить несколько проектов для использования одного и того же исполняемого файла Cloud CLI, добавив его в переменную среды PATH в профиле своей оболочки.

:::

3. Проверьте установку, выполнив `./dbt --help` в командной строке. Если вы видите следующий вывод, ваша установка выполнена правильно:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и у вас не установлена глобальная версия dbt.
   
   * Обратите внимание, что вам больше не нужно выполнять команду `dbt deps` при запуске вашей среды. Этот шаг ранее требовался во время инициализации. Однако вы все равно должны выполнять `dbt deps`, если вносите изменения в ваш файл `packages.yml`.

4. Клонируйте ваш репозиторий на ваш локальный компьютер, используя `git clone`. Например, чтобы клонировать репозиторий GitHub в формате HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования вашего репозитория [настройте](/docs/cloud/configure-cloud-cli) dbt Cloud CLI для вашего проекта dbt Cloud. Это позволит вам выполнять команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment) для просмотра вашей конфигурации dbt Cloud или `dbt compile` для компиляции вашего проекта и проверки моделей и тестов. Вы также можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

</TabItem>

<TabItem value="pip" label="Существующие пользователи dbt Core (pip)">

Если у вас уже установлен dbt Core, dbt Cloud CLI может вызвать конфликт. Вот некоторые соображения:

- **Предотвращение конфликтов** <br /> Используйте как dbt Cloud CLI, так и dbt Core с `pip` и создайте новую виртуальную среду.<br /><br />
- **Использование dbt Cloud CLI и dbt Core с brew или нативными установками** <br /> Если вы используете Homebrew, рассмотрите возможность создания псевдонима для dbt Cloud CLI как "dbt-cloud", чтобы избежать конфликта. Для получения более подробной информации обратитесь к [Часто задаваемым вопросам](#faqs), если ваша операционная система сталкивается с конфликтами путей.<br /><br />
- **Возврат к dbt Core из dbt Cloud CLI** <br />
  Если вы уже установили dbt Cloud CLI и вам нужно вернуться к dbt Core:<br />
  - Удалите dbt Cloud CLI с помощью команды: `pip uninstall dbt`
  - Переустановите dbt Core, используя следующую команду, заменив "adapter_name" на соответствующее имя адаптера:
    ```shell
    python -m pip install dbt-adapter_name --force-reinstall
    ```
    Например, если я использовал Snowflake в качестве адаптера, я бы выполнил: `python -m pip install dbt-snowflake --force-reinstall`

--------

Перед установкой dbt Cloud CLI убедитесь, что у вас установлен Python и ваша виртуальная среда venv или pyenv. Если у вас уже настроена среда Python, вы можете перейти к [шагу установки pip](#install-dbt-cloud-cli-in-pip).

### Установка виртуальной среды

Мы рекомендуем использовать виртуальные среды (venv) для изоляции `cloud-cli`.

1. Создайте новую виртуальную среду с именем "dbt-cloud" с помощью этой команды:
   ```shell
   python3 -m venv dbt-cloud
    ```

2. Активируйте виртуальную среду каждый раз, когда создаете окно или сеанс оболочки, в зависимости от вашей операционной системы:

   - Для Mac и Linux используйте: `source dbt-cloud/bin/activate`<br/>
   - Для Windows используйте: `dbt-env\Scripts\activate` 

3. (Только для Mac и Linux) Создайте псевдоним для активации вашей среды dbt с каждым новым окном или сеансом оболочки. Вы можете добавить следующее в файл конфигурации вашей оболочки (например, `$HOME/.bashrc, $HOME/.zshrc`), заменив `<PATH_TO_VIRTUAL_ENV_CONFIG>` на путь к вашей конфигурации виртуальной среды:
   ```shell
   alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
   ```

### Установка dbt Cloud CLI в pip

1. (Необязательно) Если у вас уже установлен dbt Core, эта установка перезапишет этот пакет. Проверьте вашу версию dbt Core на случай, если вам нужно будет переустановить его позже, выполнив следующую команду:

  ```bash
  dbt --version
  ```

2. Убедитесь, что вы находитесь в вашей виртуальной среде, и выполните следующую команду для установки dbt Cloud CLI:

  ```bash
  pip install dbt --no-cache-dir
  ```

  Если возникают проблемы с установкой, выполнение команды с аргументом `--force-reinstall` может помочь:
   ```bash
   pip install dbt --no-cache-dir --force-reinstall
   ``` 

3. (Необязательно) Чтобы вернуться к dbt Core, сначала удалите как dbt Cloud CLI, так и dbt Core. Затем переустановите dbt Core.

  ```bash
  pip uninstall dbt-core dbt
  pip install dbt-adapter_name --force-reinstall
  ```

4. Клонируйте ваш репозиторий на ваш локальный компьютер, используя `git clone`. Например, чтобы клонировать репозиторий GitHub в формате HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования вашего репозитория [настройте](/docs/cloud/configure-cloud-cli) dbt Cloud CLI для вашего проекта dbt Cloud. Это позволит вам выполнять команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment) для просмотра вашей конфигурации dbt Cloud или `dbt compile` для компиляции вашего проекта и проверки моделей и тестов. Вы также можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

</TabItem>

</Tabs>

## Обновление dbt Cloud CLI

Следующие инструкции объясняют, как обновить dbt Cloud CLI до последней версии в зависимости от вашей операционной системы.

<Tabs>

<TabItem value="mac" label="macOS (brew)">

Чтобы обновить dbt Cloud CLI, выполните `brew update`, а затем `brew upgrade dbt`.

</TabItem>

<TabItem value="windows" label="Windows (исполняемый файл)">

Чтобы обновить, следуйте тому же процессу, описанному в [Windows](/docs/cloud/cloud-cli-installation?install=windows#install-dbt-cloud-cli), и замените существующий исполняемый файл `dbt.exe` на новый.

</TabItem>

<TabItem value="linux" label="Linux (исполняемый файл)">

Чтобы обновить, следуйте тому же процессу, описанному в [Linux](/docs/cloud/cloud-cli-installation?install=linux#install-dbt-cloud-cli), и замените существующий исполняемый файл `dbt` на новый.

</TabItem>

<TabItem value="existing" label="Существующие пользователи dbt Core (pip)">

Чтобы обновить:
- Убедитесь, что вы находитесь в вашей виртуальной среде
- Выполните `python -m pip install --upgrade dbt`.
	
</TabItem>

</Tabs>

## Расширение для VS Code <Lifecycle status="beta"/>

Расширения для Visual Studio (VS) Code улучшают инструменты командной строки, добавляя дополнительные функции. [Power user для dbt Core и dbt Cloud](https://marketplace.visualstudio.com/items?itemName=innoverio.vscode-dbt-power-user) — это распространенное расширение, используемое для улучшения вашей разработки dbt с помощью VS Code.

Вы можете использовать dbt Cloud CLI с Power User для dbt Core и dbt Cloud, следуя инструкциям [здесь](https://docs.myaltimate.com/setup/reqdConfigCloud/).

Расширение Power User будет управлять установкой Cloud CLI от вашего имени.

## Часто задаваемые вопросы

<DetailsToggle alt_header="В чем разница между dbt Cloud CLI и dbt Core?">

dbt Cloud CLI и <a href="https://github.com/dbt-labs/dbt-core">dbt Core</a>, проект с открытым исходным кодом, оба являются инструментами командной строки, которые позволяют вам выполнять команды dbt.

Ключевое отличие заключается в том, что dbt Cloud CLI адаптирован для инфраструктуры dbt Cloud и интегрируется со всеми его <a href="https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features">функциями</a>.

</DetailsToggle>

<DetailsToggle alt_header="Как я могу использовать dbt Cloud CLI и dbt Core одновременно?">

Для совместимости как dbt Cloud CLI, так и dbt Core вызываются с помощью команды `dbt`. Это может создать конфликты путей, если ваша операционная система выбирает один из них на основе переменной среды $PATH (настройки).

Если у вас локально установлен dbt Core, выполните одно из следующих действий:

1. Установите с помощью команды <code>pip3 install dbt</code> [pip](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli).
2. Установите нативно, убедившись, что вы либо деактивировали виртуальную среду, содержащую dbt Core, либо создали псевдоним для dbt Cloud CLI.
3. (Для продвинутых пользователей) Установите нативно, но измените переменную среды $PATH, чтобы правильно указывать на бинарный файл dbt Cloud CLI, чтобы использовать dbt Cloud CLI и dbt Core вместе.

Вы всегда можете удалить dbt Cloud CLI, чтобы вернуться к использованию dbt Core.

</DetailsToggle>

<DetailsToggle alt_header="Как создать псевдоним?">

Чтобы создать псевдоним для dbt Cloud CLI: <br />

1. Откройте файл конфигурации профиля вашей оболочки. В зависимости от вашей оболочки и системы это может быть `~/.bashrc`, `~/.bash_profile`, `~/.zshrc` или другой файл.<br />

2. Добавьте псевдоним, который указывает на бинарный файл dbt Cloud CLI. Например:<code>alias dbt-cloud="path_to_dbt_cloud_cli_binary</code>
   
   Замените <code>path_to_dbt_cloud_cli_binary</code> на фактический путь к бинарному файлу dbt Cloud CLI, который находится по адресу <code>/opt/homebrew/bin/dbt</code>. С этим псевдонимом вы можете использовать команду <code>dbt-cloud</code> для вызова dbt Cloud CLI.<br />

3. Сохраните файл, а затем либо перезапустите вашу оболочку, либо выполните <code>source</code> на файле профиля, чтобы применить изменения.
Как пример, в bash вы бы выполнили: <code>source ~/.bashrc</code><br />

1. Проверьте и используйте псевдоним для выполнения команд:<br />
   - Чтобы выполнить dbt Cloud CLI, используйте команду <code>dbt-cloud</code>: <code>dbt-cloud command_name</code>. Замените 'command_name' на конкретную команду dbt, которую вы хотите выполнить.<br />
   - Чтобы выполнить dbt Core, используйте команду <code>dbt</code>: <code>dbt command_name</code>. Замените 'command_name' на конкретную команду dbt, которую вы хотите выполнить.<br />

Этот псевдоним позволит вам использовать команду <code>dbt-cloud</code> для вызова dbt Cloud CLI, имея при этом dbt Core, установленный нативно.

</DetailsToggle>

<DetailsToggle alt_header="Почему я получаю ошибку `Session occupied`?">

Если вы выполнили команду dbt и получили ошибку <code>Session occupied</code>, вы можете повторно подключиться к вашей существующей сессии с помощью <code>dbt reattach</code>, а затем нажать <code>Control-C</code> и выбрать отмену вызова.

</DetailsToggle>

<DetailsToggle alt_header="Почему я получаю ошибку `Stuck session`, пытаясь выполнить новую команду?">

Cloud CLI позволяет выполнять только одну команду, записывающую в хранилище данных, за раз. Если вы попытаетесь выполнить несколько команд записи одновременно (например, `dbt run` и `dbt build`), вы столкнетесь с ошибкой `stuck session`. Чтобы решить эту проблему, отмените конкретный вызов, передав его ID в команду отмены. Для получения дополнительной информации обратитесь к [параллельному выполнению](/reference/dbt-commands#parallel-execution).

</DetailsToggle>