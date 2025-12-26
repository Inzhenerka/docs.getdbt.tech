---
title: Установка dbt CLI  
sidebar_label: "Установка"
id: cloud-cli-installation
description: "Инструкции по установке и настройке dbt CLI"
pagination_next: "docs/cloud/configure-cloud-cli"
---

<Constant name="cloud" /> нативно поддерживает разработку с использованием командной строки (CLI), предоставляя участникам команды больше гибкости и улучшая совместную работу. CLI для <Constant name="cloud" /> позволяет запускать команды dbt из локальной командной строки, обращаясь к вашей среде разработки в <Constant name="cloud" />.

Команды dbt выполняются на инфраструктуре <Constant name="cloud" /> и используют следующие преимущества:

* Безопасное хранение учетных данных на платформе <Constant name="cloud" />
* [Автоматическое отложенное использование (deferral)](/docs/cloud/about-cloud-develop-defer) артефактов сборки из продакшн‑среды вашего Cloud‑проекта  
* Более быстрые и менее затратные сборки
* Поддержка dbt Mesh ([межпроектный `ref`](/docs/mesh/govern/project-dependencies))
* Существенные улучшения платформы, которые будут выпускаться в ближайшие месяцы

<Lightbox src="/img/docs/dbt-cloud/cloud-cli-overview.jpg" title="Диаграмма, показывающая, как dbt CLI работает с инфраструктурой dbt для запуска команд dbt из локальной командной строки." />

## Предварительные требования 
CLI для <Constant name="cloud" /> доступен во всех [регионах развертывания](/docs/cloud/about-cloud/access-regions-ip-addresses) и поддерживается как для мультиарендных, так и для одноарендных аккаунтов.

## Установка dbt CLI

Вы можете установить CLI для <Constant name="cloud" /> из командной строки, используя один из следующих способов.

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

2. Установите <Constant name="cloud_cli" /> с помощью Homebrew:

   - Сначала удалите `dbt-labs` tap, отдельный репозиторий для пакетов, из Homebrew. Это предотвратит установку пакетов из этого репозитория:
      ```bash
      brew untap dbt-labs/dbt
- Затем добавьте и установите пакет <Constant name="cloud_cli" />:
      ```bash
      brew tap dbt-labs/dbt-cli
      brew install dbt
      ```
      Если у вас несколько tap, используйте `brew install dbt-labs/dbt-cli/dbt`.

3. Проверьте установку, выполнив `dbt --help` в командной строке. Если вы видите следующий вывод, ваша установка выполнена правильно:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и у вас не установлена глобальная версия dbt.
   
   * Обратите внимание, что вам больше не нужно выполнять команду `dbt deps` при запуске вашей среды. Этот шаг ранее требовался во время инициализации. Однако вы все равно должны выполнять `dbt deps`, если вносите изменения в ваш файл `packages.yml`.

4. Клонируйте ваш репозиторий на ваш локальный компьютер, используя `git clone`. Например, чтобы клонировать репозиторий GitHub в формате HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования вашего репозитория [настройте](/docs/cloud/configure-cloud-cli) <Constant name="cloud_cli" /> для вашего проекта <Constant name="cloud" />. Это позволит вам запускать команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment) для просмотра конфигурации <Constant name="cloud" /> или `dbt compile` — для компиляции проекта и проверки моделей и тестов. Также вы сможете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

</TabItem>

<TabItem value="windows" label="Windows (исполняемый файл)">

Обратитесь к [Часто задаваемым вопросам](#faqs), если ваша операционная система сталкивается с конфликтами путей.

1. Скачайте последнюю версию для Windows для вашей платформы с [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Извлеките исполняемый файл `dbt.exe` в ту же папку, что и ваш проект dbt.

:::info

Продвинутые пользователи могут настроить несколько проектов так, чтобы они использовали один и тот же CLI <Constant name="cloud" />, следующим образом:

 1. Поместите исполняемый файл (`.exe`) в папку "Program Files"
 2. [Добавьте его в переменную среды PATH Windows](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53)
 3. Сохраните его там, где это необходимо

Обратите внимание, что если вы используете VS Code, вам нужно перезапустить его, чтобы применить измененные переменные среды.
:::

4. Проверьте установку, выполнив команду `./dbt --help` в командной строке. Если вы видите следующий вывод, значит установка выполнена корректно:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и у вас не установлена глобальная версия dbt.

   * Обратите внимание, что вам больше не нужно выполнять команду `dbt deps` при запуске вашей среды. Этот шаг ранее требовался во время инициализации. Однако вы все равно должны выполнять `dbt deps`, если вносите изменения в ваш файл `packages.yml`.

5. Клонируйте ваш репозиторий на локальный компьютер с помощью `git clone`. Например, чтобы клонировать репозиторий GitHub с использованием формата HTTPS, выполните команду `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

6. После клонирования репозитория [настройте](/docs/cloud/configure-cloud-cli) <Constant name="cloud_cli" /> для вашего проекта <Constant name="cloud" />. Это позволит запускать команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment), чтобы просматривать конфигурацию <Constant name="cloud" />, или `dbt compile`, чтобы скомпилировать проект и проверить модели и тесты. Вы также сможете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

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

Опытные пользователи могут настроить несколько проектов на использование одного и того же исполняемого файла dbt CLI, добавив его в переменную окружения PATH в своём shell profile.

:::

3. Проверьте установку, выполнив `./dbt --help` в командной строке. Если вы видите следующий вывод, ваша установка выполнена правильно:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     Если вы не видите этот вывод, убедитесь, что вы деактивировали pyenv или venv и у вас не установлена глобальная версия dbt.
   
   * Обратите внимание, что вам больше не нужно выполнять команду `dbt deps` при запуске вашей среды. Этот шаг ранее требовался во время инициализации. Однако вы все равно должны выполнять `dbt deps`, если вносите изменения в ваш файл `packages.yml`.

4. Клонируйте ваш репозиторий на ваш локальный компьютер, используя `git clone`. Например, чтобы клонировать репозиторий GitHub в формате HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования вашего репозитория [настройте](/docs/cloud/configure-cloud-cli) <Constant name="cloud_cli" /> для вашего проекта <Constant name="cloud" />. Это позволит вам выполнять команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment), чтобы просматривать конфигурацию <Constant name="cloud" />, или `dbt compile`, чтобы скомпилировать проект и проверить модели и тесты. Вы также сможете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

</TabItem>

<TabItem value="pip" label="Существующие пользователи dbt Core (pip)">

Если у вас уже установлен dbt Core, <Constant name="cloud_cli" /> может конфликтовать с ним. Ниже приведены некоторые рекомендации:

- **Предотвращение конфликтов** <br /> Используйте и <Constant name="cloud_cli" />, и <Constant name="core" /> через `pip`, создав новое виртуальное окружение.<br /><br />
- **Использование <Constant name="cloud_cli" /> и <Constant name="core" /> с Homebrew или нативной установкой** <br /> Если вы используете Homebrew, рассмотрите возможность задать алиас для <Constant name="cloud_cli" /> как `dbt-cloud`, чтобы избежать конфликтов. Подробнее см. в разделе [FAQs](#faqs), если в вашей операционной системе возникают конфликты путей.<br /><br />
- **Возврат к dbt Core с <Constant name="cloud_cli" />** <br />
  Если вы уже установили <Constant name="cloud_cli" /> и вам нужно вернуться к dbt Core:<br />
  - Удалите <Constant name="cloud_cli" /> с помощью команды: `pip uninstall dbt`
  - Переустановите <Constant name="core" /> с помощью следующей команды, заменив `adapter_name` на соответствующее имя адаптера:
    ```shell
    python -m pip install dbt-adapter_name --force-reinstall
    ```
    Например, если я использовал Snowflake в качестве адаптера, я бы выполнил: `python -m pip install dbt-snowflake --force-reinstall`

--------

Перед установкой <Constant name="cloud_cli" /> убедитесь, что у вас установлен Python, а также настроено виртуальное окружение venv или pyenv. Если у вас уже есть сконфигурированное Python‑окружение, вы можете сразу перейти к шагу [установки через pip](#install-dbt-cloud-cli-in-pip).

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

### Установка dbt CLI через pip

1. (Необязательно) Если у вас уже установлен <Constant name="core" />, эта установка перезапишет данный пакет. Проверьте версию <Constant name="core" /> на случай, если вам потребуется переустановить его позже, выполнив следующую команду:

  ```bash
 dbt --version
  ```

2. Убедитесь, что вы находитесь в своём виртуальном окружении, и выполните следующую команду, чтобы установить CLI <Constant name="cloud" />:

  ```bash
  pip install dbt --no-cache-dir
  ```

  Если возникают проблемы с установкой, выполнение команды с аргументом `--force-reinstall` может помочь:
   ```bash
   pip install dbt --no-cache-dir --force-reinstall
   ``` 

3. (Необязательно) Чтобы вернуться к <Constant name="core" />, сначала удалите и <Constant name="cloud" /> CLI, и <Constant name="core" />. Затем переустановите <Constant name="core" />.

  ```bash
  pip uninstall dbt-core dbt
  pip install dbt-adapter_name --force-reinstall
  ```

4. Клонируйте ваш репозиторий на ваш локальный компьютер, используя `git clone`. Например, чтобы клонировать репозиторий GitHub в формате HTTPS, выполните `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. После клонирования вашего репозитория [настройте](/docs/cloud/configure-cloud-cli) <Constant name="cloud_cli" /> для вашего проекта <Constant name="cloud" />. Это позволит вам запускать команды dbt, такие как [`dbt environment show`](/reference/commands/dbt-environment), чтобы просматривать конфигурацию <Constant name="cloud" />, или `dbt compile`, чтобы скомпилировать проект и проверить модели и тесты. Вы также можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

</TabItem>

</Tabs>

## Обновление dbt CLI

Следующие инструкции объясняют, как обновить <Constant name="cloud_cli" /> до последней версии в зависимости от вашей операционной системы.

Следующие инструкции объясняют, как обновить dbt Cloud CLI до последней версии в зависимости от вашей операционной системы.

<Tabs>

<TabItem value="mac" label="macOS (brew)">

Чтобы обновить <Constant name="cloud_cli" />, выполните команду `brew update`, а затем `brew upgrade dbt`.

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
  
  
## К рассмотрению

import CloudCliRelativePath from '/snippets/_cloud-cli-relative-path.md';

<CloudCliRelativePath />

## Часто задаваемые вопросы

<DetailsToggle alt_header="В чем разница между dbt CLI и dbt Core?">

<Constant name="cloud_cli" /> и <a href="https://github.com/dbt-labs/dbt-core">dbt Core</a>, проект с открытым исходным кодом, — это оба инструмента командной строки, которые позволяют выполнять команды dbt.

Ключевое отличие заключается в том, что <Constant name="cloud_cli" /> адаптирован под инфраструктуру <Constant name="cloud" /> и интегрирован со всеми его <a href="https://docs.getdbt.tech/docs/cloud/about-cloud/dbt-cloud-features">возможностями</a>.

</DetailsToggle>

<DetailsToggle alt_header="Как использовать одновременно dbt CLI и dbt Core?">

Для совместимости и <Constant name="cloud_cli" />, и <Constant name="core" /> запускаются с помощью команды `dbt`. Это может приводить к конфликтам путей, если операционная система выбирает один из них на основе переменной окружения $PATH (настроек).

Если у вас локально установлен <Constant name="core" />, вы можете сделать одно из следующих действий:

1. Установить с помощью команды <code>pip3 install dbt</code> [pip](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli).
2. Установить нативно, убедившись, что вы либо деактивировали виртуальное окружение, содержащее <Constant name="core" />, либо создали алиас для <Constant name="cloud_cli" />.
3. (Для опытных пользователей) Установить нативно, но изменить переменную окружения $PATH так, чтобы она корректно указывала на бинарный файл <Constant name="cloud_cli" />, и тем самым использовать <Constant name="cloud_cli" /> и <Constant name="core" /> одновременно.

Вы всегда можете удалить <Constant name="cloud_cli" />, чтобы вернуться к использованию <Constant name="core" />.

</DetailsToggle>

<DetailsToggle alt_header="Как создать псевдоним?">

Чтобы создать псевдоним для <Constant name="cloud_cli" />: <br />

1. Откройте файл конфигурации профиля вашей оболочки. В зависимости от вашей оболочки и системы это может быть `~/.bashrc`, `~/.bash_profile`, `~/.zshrc` или другой файл.<br />

2. Добавьте алиас, который указывает на бинарный файл <Constant name="cloud_cli" />. Например:  
   <code>alias dbt-cloud="path_to_dbt_cloud_cli_binary</code>

   Замените <code>path_to_dbt_cloud_cli_binary</code> на фактический путь к бинарному файлу <Constant name="cloud_cli" />, который равен <code>/opt/homebrew/bin/dbt</code>.  
   С этим алиасом вы сможете использовать команду <code>dbt-cloud</code> для вызова <Constant name="cloud_cli" />.<br />

3. Сохраните файл, а затем либо перезапустите вашу оболочку, либо выполните <code>source</code> на файле профиля, чтобы применить изменения.
Как пример, в bash вы бы выполнили: <code>source ~/.bashrc</code><br />

4. Проверьте и используйте алиас для запуска команд:<br />
   - Чтобы запустить <Constant name="cloud_cli" />, используйте команду <code>dbt-cloud</code>: <code>dbt-cloud command_name</code>. Замените `command_name` на конкретную команду dbt, которую вы хотите выполнить.<br />
   - Чтобы запустить dbt Core, используйте команду <code>dbt</code>: <code>dbt command_name</code>. Замените `command_name` на конкретную команду dbt, которую вы хотите выполнить.<br />


Этот алиас позволит вам использовать команду <code>dbt-cloud</code> для вызова <Constant name="cloud_cli" />, при этом dbt Core будет установлен нативно.

</DetailsToggle>

<DetailsToggle alt_header="Почему я получаю ошибку `Stuck session`, пытаясь выполнить новую команду?">

<Constant name="cloud_cli" /> позволяет выполнять только одну команду, которая записывает данные в хранилище данных, в каждый момент времени. Если вы попытаетесь запустить несколько команд записи одновременно (например, `dbt run` и `dbt build`), вы столкнётесь с ошибкой `stuck session`. Чтобы решить эту проблему, отмените конкретный запуск, передав его ID в команду отмены. Подробнее см. в разделе [parallel execution](/reference/dbt-commands#parallel-execution).

</DetailsToggle>

<FAQ path="Troubleshooting/long-sessions-cloud-cli" />
  
