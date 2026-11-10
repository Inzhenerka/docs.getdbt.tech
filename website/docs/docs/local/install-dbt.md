---
title: Установка dbt
id: install-dbt
description: "Узнайте, как установить dbt CLI и другие инструменты в среде Windows, macOS или Linux"
sidebar_label: "Установка dbt"
availability: local_free
---

import AboutFusion from '/snippets/_about-v2.md';

<VersionBlock firstVersion="2.0">

Запустите <Constant name="dbt" /> на своём компьютере за несколько минут. При установке dbt по умолчанию вы получаете <Constant name="fusion" /> — актуальное бесплатное решение для работы с v2. Выберите удобный способ установки:

## Установка dbt

<Tabs groupId="install-method" queryString>

<TabItem value="pip" label="pip">

```shell
python -m pip install dbt
```

Для последующего обновления выполните `python -m pip install --upgrade dbt`.

</TabItem>

<TabItem value="homebrew" label="Homebrew (macOS)">

```shell
brew tap dbt-labs/dbt
brew install dbt-labs/dbt/dbt
```

Для последующего обновления выполните `brew upgrade dbt`.

</TabItem>

<TabItem value="curl" label="curl (macOS/Linux)">

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

Эта команда устанавливает исполняемый файл dbt в `~/.local/bin/dbt` и добавляет этот каталог в `$PATH`. Если потребуется удалить его, см. [инструкцию по удалению после установки через curl](#faqs).

Закройте и снова откройте терминал (или выполните `exec $SHELL`), чтобы изменения `$PATH` вступили в силу. 

Для последующего обновления выполните `dbt system update`.

</TabItem>

<TabItem value="winget" label="winget (Windows)">

```shell
winget install --id dbtLabs.dbt --exact
```

Чтобы установить определённую версию, выполните `winget install --id dbtLabs.dbt --exact --version <version>`.

</TabItem>

<TabItem value="windows" label="Windows (PowerShell)">

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

Закройте и снова откройте командную оболочку (или выполните `Start-Process powershell`), чтобы изменения `Path` вступили в силу. 

Для последующего обновления выполните `dbt system update`.

</TabItem>

</Tabs>

- Проверьте установку:

  ```shell
  dbt --version
  ```

- Вы можете начать работать с <Constant name="dbt" /> v2 сразу после установки. Для максимально удобной работы с v2 в редакторе установите расширение dbt для VS Code: оно предоставляет автодополнение, отображение ошибок прямо в коде и граф зависимостей данных.

  Чтобы получить полный набор возможностей <Term id="lsp" /> и другие функции на базе платформы dbt, выполните `dbt login` и войдите с помощью бесплатной учётной записи <Constant name="dbt_platform" />:

  ```shell
  dbt login
  ```

Подробнее см. в [документации расширения dbt для VS Code](/docs/about-dbt-extension).

Если вам или вашей организации строго необходимо использовать среду выполнения с открытым исходным кодом, см. [Установка dbt OSS](/docs/local/install-dbt-v2). Обратите внимание: `dbt-oss` и `dbt` нельзя устанавливать в одну среду Python.

## Устранение неполадок

Распространённые проблемы и способы их решения:

- **Команда dbt не найдена:** добавьте каталог установки в `$PATH`.
- **Конфликты версий:** убедитесь, что на вашем компьютере не установлены и не активны другие версии локально развёрнутого dbt или <Constant name="platform_cli" />.
- **Конфликт с `dbt-oss`:** `dbt-oss` и `dbt` нельзя устанавливать в одну среду Python. Если вам нужны оба инструмента, создайте псевдоним, как описано в разделе [Запуск dbt-oss параллельно с другими установками dbt](/docs/local/install-dbt-v2#run-dbt-oss-alongside-other-dbt-installs).
- **Разрешения на установку:** убедитесь, что у вашей учётной записи есть права на локальную установку программного обеспечения.

## Часто задаваемые вопросы {#faqs}

- <Expandable alt_header="Можно ли вернуться к предыдущей установке dbt?">
    Да. Чтобы протестировать новую установку, не затрагивая существующие рабочие процессы, используйте отдельную среду или виртуальную машину.
  </Expandable>
- <Expandable alt_header="Можно ли скачать только среду выполнения с лицензией Apache 2.0?">
    Да, если вам нужна среда выполнения с лицензией Apache 2.0, вы можете [установить dbt v2 с открытым исходным кодом](/docs/local/install-dbt-v2) — проект с открытым исходным кодом, лежащий в основе <Constant name="fusion" />.
  </Expandable>
- <Expandable alt_header="Как удалить dbt после установки через curl (install.sh)?">

  Эти действия применимы только в том случае, если вы установили <Constant name="fusion" /> с помощью скрипта curl (`install.sh`). Если вы использовали pip, Homebrew или winget, удалите <Constant name="dbt" /> с помощью соответствующего инструмента (например, `pip uninstall dbt` или `brew uninstall dbt`).

  1. **Удалите dbt.** Выполните встроенную команду удаления, чтобы очистить кешированные файлы и сохранённое состояние. Она также удалит исполняемый файл:

     ```shell
     dbt system uninstall
     ```

  2. **Очистите профиль командной оболочки.** Установщик добавляет команду экспорта `$PATH` и псевдоним `dbtf` в `~/.zshrc` или `~/.bashrc`, каждый под отдельным комментарием. Откройте этот файл и удалите следующие строки:

     ```shell
     # Added by dbt installer
     export PATH="$PATH:$HOME/.local/bin"

     # dbt aliases
     alias dbtf=$HOME/.local/bin/dbt
     ```

     Затем перезагрузите профиль:

     ```shell
     source ~/.zshrc   # or source ~/.bashrc
     ```
  </Expandable>

<AboutFusion hideInstallLink/>

</VersionBlock>

<VersionBlock lastVersion="1.99">

:::tip Хотите ускорить dbt?
Обновитесь до v2, чтобы получить <Constant name="fusion" /> &mdash; до 30 раз более высокую производительность, возможности <Term id="lsp" />, такие как автодополнение и отображение ошибок прямо в коде, и многое другое. [Обновиться до v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2).
:::

## Установка CLI <Constant name="core_v1" />

<Constant name="core_v1" /> — исходный движок dbt с открытым исходным кодом. Установите его с помощью `pip`, Docker или из исходного кода.

<Expandable alt_header="Установка через pip" >

### Предварительные требования

- [Python](https://www.python.org/downloads/) (`python --version` или `python3 --version`)
- [pip](https://pip.pypa.io/en/stable/installation/) (`pip --version` или `pip3 --version`)

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />

### Создание виртуальной среды

<Tabs>
  <TabItem value="Unix/macOS" label="Unix/macOS">

  ```shell
  python3 -m venv .venv
  source .venv/bin/activate
  ```

  </TabItem>
  <TabItem value="Windows" label="Windows">

  ```shell
  py -m venv .venv
  .venv\Scripts\activate
  ```

  </TabItem>
</Tabs>

Для деактивации выполните `deactivate`. Чтобы автоматически активировать среду в новых сеансах командной оболочки, добавьте псевдоним в `~/.bashrc` или `~/.zshrc`:

```shell
alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
```

### Установка адаптера {#install-your-adapter}

При установке адаптера автоматически устанавливается `dbt-core`. Выберите адаптер в разделе [Поддерживаемые платформы данных](/docs/supported-data-platforms):

```shell
python -m pip install dbt-ADAPTER_NAME
```

Чтобы установить `dbt-core` без адаптера (только для интеграций с инструментами):

```shell
python -m pip install dbt-core
```

### Обновление {#upgrade}

```shell
# Upgrade v1 pip installations
python -m pip install --upgrade dbt-ADAPTER_NAME

# Downgrade to a specific version
python -m pip install --upgrade dbt-core==1.11
```

### Установка предварительной версии

Используйте `--pre` для установки предварительных версий. При этом также могут быть установлены предварительные версии других зависимостей.

```shell
python3 -m pip install --pre dbt
```

</Expandable>

<Expandable alt_header="Docker">

Образы <Constant name="core" /> распространяются через [GitHub Packages](https://github.com/dbt-labs/dbt/pkgs/container/dbt-core) и включают закреплённые версии dbt-core, одного или нескольких адаптеров и всех зависимостей.

### Предварительные требования

- Установленный [Docker](https://docs.docker.com/)
- Знакомство с [адаптерами](/docs/supported-data-platforms) и [управлением версиями <Constant name="core" />](/docs/dbt-versions)

### Загрузка образа

Имена образов соответствуют шаблону `ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>`. Доступные теги:
- `latest` — самый последний выпуск
- `<Major>.<Minor>.latest` — последний выпуск исправлений для семейства версий (например, `1.9.latest`)

```shell
docker pull ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>
```

### Запуск dbt в контейнере

Подключите проект и профили с помощью bind-монтирования, затем выполните любую команду dbt:

```shell
docker run \
--network=host \
--mount type=bind,source=/absolute/path/to/project,target=/usr/app \
--mount type=bind,source=/absolute/path/to/profiles.yml,target=/root/.dbt/profiles.yml \
<dbt_image_name> \
<dbt_command>
```

Примечание: исходные пути для bind-монтирования должны быть абсолютными. Возможно, вам потребуется изменить настройки `--network` в зависимости от хоста вашего хранилища данных.

### Сборка собственного образа

Если готовые образы не подходят для вашей задачи, используйте [`Dockerfile`](https://github.com/dbt-labs/dbt/blob/1.latest/docker/Dockerfile) и [`README`](https://github.com/dbt-labs/dbt/blob/1.latest/docker/README.md), чтобы собрать образы с несколькими адаптерами, сторонними адаптерами или для других системных архитектур. Поддержку сборки собственных образов оказывает сообщество — [создайте issue](https://github.com/dbt-labs/dbt/issues) или [обратитесь к сообществу](/community/resources/getting-help), если возникнут трудности.

</Expandable>

<Expandable alt_header="Исходный код">

Установите dbt из исходного кода, чтобы получить ещё не выпущенный код или определённый коммит. Клонируйте репозиторий и выполните установку с помощью `pip`:

```shell
git clone -b 1.latest https://github.com/dbt-labs/dbt.git
cd dbt
python -m pip install -r requirements.txt
```

Для установки в режиме редактирования (изменения вступают в силу немедленно):

```shell
python -m pip install -e editable-requirements.txt
```

### Установка адаптера из исходного кода

Сначала установите `dbt-core`, затем клонируйте и установите адаптер. Например, для Redshift:

```shell
git clone https://github.com/dbt-labs/dbt-redshift.git
cd dbt-redshift
python -m pip install .
```

Для установки в режиме редактирования: `python -m pip install -e .`

Подробнее см. в [руководстве по участию в разработке](https://github.com/dbt-labs/dbt/blob/1.latest/CONTRIBUTING.md).

</Expandable>

:::tip Полезный совет: использование флага --help

Большинство инструментов командной строки, включая dbt, поддерживают флаг `--help`, который показывает доступные команды и аргументы. В dbt можно использовать `--help` двумя способами:<br /><br />
&mdash; `dbt --help`: показывает доступные команды dbt<br />
&mdash; `dbt run --help`: показывает доступные флаги для команды `run`

:::

## Часто задаваемые вопросы
- <Expandable alt_header="Как удалить dbt v1?">
    Удалите dbt с помощью того же инструмента, который использовался для установки:

    ```shell
    python -m pip uninstall dbt-core dbt-ADAPTER_NAME
    ```
    ```shell
    brew uninstall dbt
    ```

    Если после удаления команда `dbt --version` по-прежнему находит какую-либо версию, возможно, в другом месте вашего `$PATH` есть ещё одна установка <Constant name="core" /> или <Constant name="platform_cli" /> (например, глобальная установка или установка через pipx наряду с виртуальной средой). Выполните `which dbt`, чтобы определить, какая установка используется, а затем удалите и её.
  
  </Expandable>

</VersionBlock>

## Следующие шаги

- Настройте [переменные среды](/docs/local/configure-environment-variables) для управления учётными данными.
- Настройте файл [profiles.yml](/docs/local/profiles.yml#location-of-profilesyml).
- Настройте [подключение к платформе данных](/docs/local/connect-data-platform/about-dbt-connections).
- Создайте свой первый [проект dbt](/docs/build/projects) с помощью команды [`dbt init`](/reference/commands/init).
