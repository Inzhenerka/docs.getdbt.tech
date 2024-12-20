---
title: "Установка с помощью pip"
description: "Вы можете использовать pip для установки dbt Core и плагинов адаптеров из командной строки."
---

Вам нужно использовать `pip` для установки dbt Core на операционных системах Windows, Linux или MacOS.

Вы можете установить dbt Core и плагины с помощью `pip`, потому что они являются модулями Python, распространяемыми на [PyPI](https://pypi.org/project/dbt-core/).

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />

### Использование виртуальных окружений

Мы рекомендуем использовать виртуальные окружения (venv) для изоляции модулей pip.

1. Создайте новое виртуальное окружение:

```shell
python -m venv dbt-env				# создайте окружение
```

2. Активируйте это же виртуальное окружение каждый раз, когда создаете окно или сессию оболочки:

```shell
source dbt-env/bin/activate			# активируйте окружение для Mac и Linux ИЛИ
dbt-env\Scripts\activate			# активируйте окружение для Windows
```

#### Создание алиаса

Чтобы активировать ваше окружение dbt с каждым новым окном или сессией оболочки, вы можете создать алиас для команды source в вашем $HOME/.bashrc, $HOME/.zshrc или любом другом конфигурационном файле, который использует ваша оболочка.

Например, добавьте следующее в ваш rc файл, заменив &lt;PATH_TO_VIRTUAL_ENV_CONFIG&gt; на путь к вашей конфигурации виртуального окружения.

```shell
alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
```

### Установка адаптера

Как только вы решите, [какой адаптер](/docs/supported-data-platforms) вы используете, вы можете установить его с помощью командной строки. Начиная с версии 1.8, установка адаптера не устанавливает автоматически `dbt-core`. Это связано с тем, что версии адаптеров и dbt Core были разделены, и мы больше не хотим перезаписывать существующие установки dbt-core.

<VersionBlock firstVersion="1.8">

```shell
python -m pip install dbt-core dbt-ADAPTER_NAME
```

</VersionBlock>

<VersionBlock lastVersion="1.7">

```shell
python -m pip install dbt-ADAPTER_NAME
```

</VersionBlock>

Например, если вы используете Postgres:

<VersionBlock firstVersion="1.8">

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

Все адаптеры строятся поверх `dbt-core`. Некоторые также зависят от других адаптеров: например, `dbt-redshift` строится поверх `dbt-postgres`. В этом случае вы также увидите эти адаптеры, включенные в вашу конкретную установку.
</VersionBlock>

<VersionBlock lastVersion="1.7">

```shell
python -m pip install dbt-postgres
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

Некоторые адаптеры зависят от других адаптеров. Например, `dbt-redshift` строится поверх `dbt-postgres`. В этом случае вы также увидите эти адаптеры, включенные в вашу конкретную установку.
</VersionBlock>

### Обновление адаптеров

Чтобы обновить конкретный плагин адаптера:

```shell
python -m pip install --upgrade dbt-ADAPTER_NAME
```

### Установка только dbt-core

Если вы создаете инструмент, который интегрируется с dbt Core, вы можете установить только основную библиотеку без адаптера базы данных. Обратите внимание, что вы не сможете использовать dbt как инструмент командной строки.

```shell
python -m pip install dbt-core
```

### Изменение версий dbt Core

Вы можете обновить или понизить версии dbt Core, используя опцию `--upgrade` в командной строке (CLI). Для получения дополнительной информации см. [Лучшие практики обновления версий Core](/docs/dbt-versions/core#best-practices-for-upgrading).

Чтобы обновить dbt до последней версии:

```
python -m pip install --upgrade dbt-core
```

Чтобы понизить до более старой версии, укажите версию, которую вы хотите использовать. Эта команда может быть полезна, когда вы решаете проблемы с зависимостями пакетов. Например:

```
python -m pip install --upgrade dbt-core==0.19.0
```

### `pip install dbt`

Обратите внимание, что начиная с версии 1.0.0, `pip install dbt` больше не поддерживается, вызовет явную ошибку, и пакет `dbt` на PyPI перестал получать обновления. С версии 0.13 пакет PyPI с именем `dbt` был простым "переходником" для dbt-core и четырех оригинальных плагинов адаптеров баз данных.

Осенью 2023 года пакет `dbt` на PyPI стал поддерживаемым методом установки [dbt Cloud CLI](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli-in-pip).

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

Или, что еще лучше, просто установите нужный(е) вам пакет(ы)!