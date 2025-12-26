---
title: "Установка с помощью pip"
description: "Установка dbt Core и плагинов-адаптеров из командной строки с помощью pip."
---

Вам нужно использовать `pip` для установки dbt Core на операционных системах Windows, Linux или MacOS.

Вы можете установить dbt Core и плагины с помощью `pip`, потому что они являются модулями Python, распространяемыми на [PyPI](https://pypi.org/project/dbt-core/).

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />

## Что такое виртуальное окружение Python?

Виртуальное окружение Python создаёт изолированное рабочее пространство для Python‑проектов, предотвращая конфликты между зависимостями разных проектов и их версиями.

Вы можете создавать виртуальные окружения с помощью таких инструментов, как [conda](https://anaconda.org/anaconda/conda), [poetry](https://python-poetry.org/docs/managing-environments/) или `venv`. В этом руководстве используется `venv`, так как он лёгкий, имеет минимальное количество дополнительных зависимостей и входит в стандартную поставку Python.

Пользователям, которые хотят запускать dbt локально, например в [<Constant name="core" />](/docs/core/installation-overview) или через [CLI <Constant name="cloud" />](/docs/cloud/cloud-cli-installation#install-a-virtual-environment), может потребоваться установка виртуального окружения Python.

### Предварительные требования

- Доступ к терминалу или командной строке.
- Установленный [Python](https://www.python.org/downloads/). Вы можете проверить наличие Python, выполнив `python --version` или `python3 --version` в терминале или командной строке.
- Установленный [pip](https://pip.pypa.io/en/stable/installation/). Вы можете проверить наличие pip, выполнив `pip --version` или `pip3 --version`.
- Необходимые права для создания директорий и установки пакетов на вашем компьютере.
- После выполнения всех предварительных требований следуйте шагам ниже, чтобы настроить виртуальное окружение.

### Настройка виртуального окружения Python

`venv` создаст виртуальное окружение Python внутри папки `env`.

В зависимости от используемой операционной системы вам потребуется выполнить определённые шаги для настройки виртуального окружения.

Чтобы создать виртуальное окружение Python, перейдите в каталог вашего проекта и выполните соответствующую команду. В результате будет создано новое виртуальное окружение в локальной папке, которую можно назвать как угодно. В соответствии с [нашей конвенцией](https://github.com/dbt-labs/dbt-core/blob/main/CONTRIBUTING.md#virtual-environments) обычно используется имя `env` или `env-anything-you-want`.

<Tabs>
  <TabItem value="Unix/macOS" label="Unix/macOS">
    1. Создайте виртуальное окружение:

    ```shell
    python3 -m venv env
    ```

    2. Активируйте виртуальное окружение:

    ```shell
    source env/bin/activate
    ```

    3. Проверьте путь к Python:

    ```shell
    which python
    ```

    4. Запустите Python:

    ```shell
    env/bin/python
    ```
  </TabItem>

  <TabItem value="Windows" label="Windows">

    Примечание: синтаксис может немного отличаться в зависимости от используемой программы. Например, для bash это будет `source env/Scripts/activate`. В следующих примерах используется PowerShell:
    
    1. Создайте виртуальное окружение:

    ```shell
    py -m venv env
    ```

    2. Активируйте виртуальное окружение:

    ```shell
    .env\Scripts\activate
    ```

    3. Проверьте путь к Python:

    ```shell
    where python
    ```

    4. Запустите Python:

    ```shell
    env\Scripts\python
    ```
  </TabItem>
</Tabs>

Если вы используете <Constant name="core" />, после создания виртуального окружения ознакомьтесь с разделом [What are the best practices for installing <Constant name="core" /> with pip?](/faqs/Core/install-pip-best-practices.md#using-virtual-environments).

Если вы используете CLI <Constant name="cloud" />, после создания виртуального окружения вы можете [установить CLI <Constant name="cloud" /> с помощью pip](/docs/cloud/cloud-cli-installation#install-dbt-cloud-cli-in-pip).

### Деактивация виртуального окружения

Чтобы переключиться на другой проект или выйти из виртуального окружения, выполните команду `deactivate`, пока виртуальное окружение активно:

```shell
deactivate
```

### Создание alias

Чтобы активировать ваше окружение dbt с каждым новым окном или сессией оболочки, вы можете создать алиас для команды source в вашем `$HOME/.bashrc`, `$HOME/.zshrc` или любом другом конфигурационном файле, который использует ваша оболочка.

Например, добавьте следующее в ваш rc файл, заменив &lt;PATH_TO_VIRTUAL_ENV_CONFIG&gt; на путь к вашей конфигурации виртуального окружения.

```shell
alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
```

## Установка адаптера

После того как вы определились, [какой адаптер](/docs/supported-data-platforms) будете использовать, его можно установить через командную строку. Установка адаптера **не** устанавливает автоматически `dbt-core`. Это сделано потому, что версии адаптеров и dbt Core были разделены между собой, и теперь мы не хотим перезаписывать уже существующие установки `dbt-core`.

```shell
python -m pip install dbt-core dbt-ADAPTER_NAME
```


Например, если вы используете Postgres:


```shell
python -m pip install dbt-core dbt-postgres
```

Это установит _только_ `dbt-core` и `dbt-postgres`:

```shell
$ dbt --version
installed version: 1.0.0
   latest version: 1.0.0

Up to date!

Plugins:
  - postgres: 1.0.0
```

Все адаптеры строятся поверх `dbt-core`. Некоторые из них также зависят от других адаптеров: например, `dbt-redshift` строится поверх `dbt-postgres`. В таком случае вы также увидите эти адаптеры среди зависимостей, установленных в вашей конкретной конфигурации.

### Обновление адаптеров

Чтобы обновить конкретный плагин адаптера:

```shell
python -m pip install --upgrade dbt-ADAPTER_NAME
```

### Установка только dbt-core

Если вы разрабатываете инструмент, который интегрируется с <Constant name="core" />, вам может понадобиться установить только core‑библиотеку, без адаптера базы данных. Обратите внимание, что в этом случае вы не сможете использовать dbt как CLI‑инструмент.

```shell
python -m pip install dbt-core
```

## Изменение версий dbt Core

Вы можете обновить или понизить версии dbt Core, используя опцию `--upgrade` в командной строке (CLI). Для получения дополнительной информации см. [Лучшие практики обновления версий Core](/docs/dbt-versions/core#best-practices-for-upgrading).

Чтобы обновить dbt до последней версии:

```
python -m pip install --upgrade dbt-core
```

Чтобы понизить до более старой версии, укажите версию, которую вы хотите использовать. Эта команда может быть полезна, когда вы решаете проблемы с зависимостями пакетов. Например:

```
python -m pip install --upgrade dbt-core==1.9
```

## `pip install dbt`

Осенью 2023 года пакет `dbt` на PyPI стал поддерживаемым способом установки [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli-in-pip).

Если у вас есть рабочие процессы или интеграции, которые зависят от установки пакета с именем `dbt`, вы можете добиться того же поведения, установив те же пять пакетов, которые он использовал:

```shell
python -m pip install \
  dbt-core \
  dbt-postgres \
  dbt-redshift \
  dbt-snowflake \
  dbt-bigquery \
  dbt-trino
```

Или, что ещё лучше, просто установите нужный пакет (или пакеты)!

## Установка prerelease-версий

Prerelease‑версия адаптера — это версия, выпущенная до финального стабильного релиза. Она позволяет пользователям тестировать новые возможности, оставлять обратную связь и получать ранний доступ к будущему функционалу — чтобы ваша система была готова к финальному выпуску.

Использование prerelease‑версии адаптера даёт множество преимуществ, например, ранний доступ к новым возможностям и улучшениям до выхода стабильной версии. Также это полезно для проверки совместимости: вы можете протестировать адаптер в своей среде и заранее выявить интеграционные проблемы, чтобы система была готова к финальному релизу.

При этом важно учитывать, что использование prerelease‑версии до финального стабильного выпуска означает, что версия может быть не полностью оптимизирована и иногда приводить к неожиданному поведению. Кроме того, частые обновления и патчи на этапе prerelease могут требовать дополнительного времени и усилий на сопровождение. Также флаг `--pre` может установить совместимые prerelease‑версии других зависимостей, что потенциально увеличивает нестабильность.

Чтобы установить prerelease‑версии dbt Core и вашего адаптера, используйте следующую команду (замените `dbt-adapter-name` на имя вашего адаптера):

```shell
python3 -m pip install --pre dbt-core dbt-adapter-name
```

Например, если вы используете Snowflake, команда будет выглядеть так:

```shell
python3 -m pip install --pre dbt-core dbt-snowflake
```

Мы рекомендуем устанавливать prerelease‑версии в [виртуальной среде Python](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/). Например, чтобы установить prerelease‑версию в виртуальной среде Python для `POSIX bash`/`zsh`, выполните следующие команды:

```shell
dbt --version
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install --pre dbt-core dbt-adapter-name
source .venv/bin/activate
dbt --version
```

Обратите внимание: это также установит prerelease‑версии всех зависимостей.

## Активация виртуальной среды

Чтобы устанавливать или использовать пакеты внутри виртуальной среды:

- Активируйте виртуальную среду, чтобы добавить её собственные исполняемые файлы Python и `pip` в PATH вашей оболочки. Это гарантирует, что вы используете изолированное окружение.

Подробнее см. в разделе [Create and use virtual environments](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/#create-and-use-virtual-environments).

Выберите вашу операционную систему и выполните соответствующую команду для активации:

<Expandable alt_header="Unix/macOS" >

1. Активируйте виртуальную среду:

```shell
source .venv/bin/activate
which python
.venv/bin/python
```

2. Установите prerelease‑версию с помощью следующей команды:

```shell
python3 -m pip install --pre dbt-core dbt-adapter-name
source .venv/bin/activate
dbt --version
```

</Expandable>

<Expandable alt_header="Windows" >

1. Активируйте виртуальную среду:

```shell
.venv\Scripts\activate
where python
.venv\Scripts\python
```

2. Установите prerelease‑версию с помощью следующей команды:

```shell
py -m pip install --pre dbt-core dbt-adapter-name
.venv\Scripts\activate
dbt --version
```

</Expandable>
