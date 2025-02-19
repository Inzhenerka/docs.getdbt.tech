---
title: "Программные вызовы"
---

В версии 1.5 dbt-core добавлена поддержка программных вызовов. Цель состоит в том, чтобы предоставить доступ к существующему интерфейсу командной строки dbt Core через точку входа на Python, так чтобы команды верхнего уровня можно было вызывать из Python-скрипта или приложения.

Точка входа — это класс `dbtRunner`, который позволяет вам `invoke` те же команды, что и в командной строке.

```python
from dbt.cli.main import dbtRunner, dbtRunnerResult

# инициализация
dbt = dbtRunner()

# создание аргументов CLI в виде списка строк
cli_args = ["run", "--select", "tag:my_tag"]

# выполнение команды
res: dbtRunnerResult = dbt.invoke(cli_args)

# проверка результатов
for r in res.result:
    print(f"{r.node.name}: {r.status}")
```

## Параллельное выполнение не поддерживается

[`dbt-core`](https://pypi.org/project/dbt-core/) не поддерживает [безопасное параллельное выполнение](/reference/dbt-commands#parallel-execution) для нескольких вызовов в одном процессе. Это означает, что небезопасно запускать несколько команд dbt одновременно. Это официально не рекомендуется и требует обертки процесса для управления подпроцессами. Это связано с тем, что:

- Запуск параллельных команд может неожиданно взаимодействовать с платформой данных. Например, одновременный запуск `dbt run` и `dbt build` для одних и тех же моделей может привести к непредсказуемым результатам.
- Каждая команда `dbt-core` взаимодействует с глобальными переменными Python. Для обеспечения безопасной работы команды должны выполняться в отдельных процессах, что можно достичь с помощью методов, таких как создание процессов или использование инструментов, таких как Celery.

Для выполнения [безопасного параллельного выполнения](/reference/dbt-commands#available-commands) вы можете использовать [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) или [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), которые выполняют дополнительную работу по управлению параллелизмом (несколькими процессами) за вас.

## `dbtRunnerResult`

Каждая команда возвращает объект `dbtRunnerResult`, который имеет три атрибута:
- `success` (bool): Успешно ли выполнена команда.
- `result`: Если команда завершилась (успешно или с обработанными ошибками), ее результат(ы). Тип возвращаемого значения зависит от команды.
- `exception`: Если при вызове dbt возникла необработанная ошибка и команда не завершилась, то исключение, которое она вызвала.

Существует 1:1 соответствие между [кодами выхода CLI](/reference/exit-codes) и `dbtRunnerResult`, возвращаемым программным вызовом:

| Сценарий                                                                                     | Код выхода CLI | `success` | `result`         | `exception` |
|----------------------------------------------------------------------------------------------|---------------:|-----------|------------------|-------------|
| Вызов завершен без ошибок                                                                    | 0              | `True`    | зависит от команды | `None`      |
| Вызов завершен с по крайней мере одной обработанной ошибкой (например, ошибка теста, ошибка сборки модели) | 1              | `False`   | зависит от команды | `None`      |
| Необработанная ошибка. Вызов не завершен и не возвращает результатов.                        | 2              | `False`   | `None`           | Exception   |

## Обязательства и оговорки

Начиная с dbt Core v1.5, мы берем на себя обязательство предоставлять точку входа на Python с функциональным паритетом с CLI dbt-core. Мы оставляем за собой право изменять основную реализацию, используемую для достижения этой цели. Мы ожидаем, что текущая реализация откроет реальные случаи использования в краткосрочной и среднесрочной перспективе, пока мы работаем над набором стабильных, долгосрочных интерфейсов, которые в конечном итоге заменят ее.

В частности, объекты, возвращаемые каждой командой в `dbtRunnerResult.result`, не имеют полного контракта и, следовательно, могут изменяться. Некоторые из возвращаемых объектов частично документированы, потому что они частично пересекаются с содержимым [артефактов dbt](/reference/artifacts/dbt-artifacts). Как объекты Python, они содержат гораздо больше полей и методов, чем доступно в сериализованных JSON-артефактах. Эти дополнительные поля и методы следует считать **внутренними и подверженными изменениям в будущих версиях dbt-core.**

## Расширенные шаблоны использования

:::caution
Синтаксис и поддержка этих шаблонов могут измениться в будущих версиях `dbt-core`.
:::

Цель `dbtRunner` — предложить паритет с рабочими процессами CLI в программной среде. Существуют несколько расширенных шаблонов использования, которые расширяют возможности CLI.

### Повторное использование объектов

Передавайте заранее созданные объекты в `dbtRunner`, чтобы избежать их повторного создания путем чтения файлов с диска. В настоящее время поддерживается только объект `Manifest` (содержимое проекта).

```python
from dbt.cli.main import dbtRunner, dbtRunnerResult
from dbt.contracts.graph.manifest import Manifest

# используйте команду 'parse' для загрузки Manifest
res: dbtRunnerResult = dbtRunner().invoke(["parse"])
manifest: Manifest = res.result

# исследуйте manifest
# например, убедитесь, что у каждой публичной модели есть описание
for node in manifest.nodes.values():
    if node.resource_type == "model" and node.access == "public":
        assert node.description != "", f"{node.name} не имеет описания"

# повторно используйте этот manifest в последующих командах, чтобы пропустить разбор
dbt = dbtRunner(manifest=manifest)
cli_args = ["run", "--select", "tag:my_tag"]
res = dbt.invoke(cli_args)
```

### Регистрация обратных вызовов

Регистрируйте `callbacks` в `EventManager` dbt, чтобы получить доступ к структурированным событиям и включить пользовательский логгинг. Текущее поведение обратных вызовов заключается в блокировке последующих шагов; эта функциональность не гарантируется в будущих версиях.

<VersionBlock firstVersion="1.8">

```python
from dbt.cli.main import dbtRunner
from dbt_common.events.base_types import EventMsg

def print_version_callback(event: EventMsg):
    if event.info.name == "MainReportVersion":
        print(f"Мы рады использовать dbt{event.data.version}")

dbt = dbtRunner(callbacks=[print_version_callback])
dbt.invoke(["list"])
```

</VersionBlock>

<VersionBlock lastVersion="1.7">

```python
from dbt.cli.main import dbtRunner
from dbt.events.base_types import EventMsg

def print_version_callback(event: EventMsg):
    if event.info.name == "MainReportVersion":
        print(f"Мы рады использовать dbt{event.data.version}")

dbt = dbtRunner(callbacks=[print_version_callback])
dbt.invoke(["list"])
```

</VersionBlock>

### Переопределение параметров

Передавайте параметры в виде именованных аргументов, вместо списка строк в стиле CLI. В настоящее время dbt не будет выполнять никакую проверку или приведение типов для ваших входных данных. Подкоманда должна быть указана в списке в качестве первого позиционного аргумента.
```python
from dbt.cli.main import dbtRunner
dbt = dbtRunner()

# эти команды эквивалентны
dbt.invoke(["--fail-fast", "run", "--select", "tag:my_tag"])
dbt.invoke(["run"], select=["tag:my_tag"], fail_fast=True)
```