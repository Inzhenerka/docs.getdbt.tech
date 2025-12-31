---
title: "Вызовы API dbt Cloud с использованием dbt-cloud-cli"
description: "Симо Тумелиус делится, как использовать его dbt-cloud-cli для более читаемых и упрощенных вызовов API dbt Cloud."
slug: making-dbt-cloud-api-calls-using-dbt-cloud-cli

authors: [simo_tumelius]

tags: [data ecosystem]
hide_table_of_contents: false

date: 2022-05-03
is_featured: true
---

:::info Отличие от dbt Cloud CLI
Этот блог объясняет, как использовать библиотеку Python `dbt-cloud-cli` для создания приложения каталога данных с артефактами dbt Cloud. Это отличается от [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), инструмента, который позволяет запускать команды dbt в вашей среде разработки dbt Cloud с локальной командной строки.
:::

dbt Cloud — это хостинговый сервис, который многие организации используют для своих развертываний dbt. Среди прочего, он предоставляет интерфейс для создания и управления заданиями развертывания. Когда задания запускаются (например, по расписанию cron или через API), они генерируют различные артефакты, содержащие ценную метадату, связанную с проектом dbt и результатами выполнения.

dbt Cloud предоставляет REST API для управления заданиями, артефактами выполнения и другими ресурсами dbt Cloud. Инженеры по данным/аналитике часто пишут пользовательские скрипты для автоматизированных вызовов API, используя инструменты [cURL](https://curl.se/) или [Python Requests](https://requests.readthedocs.io/en/latest/). В некоторых случаях инженеры копируют/переписывают их между проектами, которым нужно взаимодействовать с API. Теперь у них есть куча скриптов, которые нужно поддерживать и развивать, если изменяются бизнес-требования. Если бы только существовал специальный инструмент для взаимодействия с API dbt Cloud, который абстрагировал бы сложности вызовов API за простым в использовании интерфейсом... О, подождите, он есть: [dbt-cloud-cli](https://github.com/data-mie/dbt-cloud-cli)!

<!--truncate-->

В этом посте я расскажу, как появился проект dbt-cloud-cli и как он может облегчить работу инженера по данным/аналитике. Я также проведу вас через пример использования, где мы загружаем артефакт catalog.json выполнения задания dbt Cloud и реализуем простое приложение каталога данных, используя те же инструменты, которые использовались при создании dbt-cloud-cli.

## Что такое dbt-cloud-cli и почему вам стоит его использовать? {#what-is-dbt-cloud-cli-and-why-should-you-use-it}

Проект начался с того, что на данный момент нет простого в использовании интерфейса для API dbt Cloud. Чтобы делать вызовы к API, вам нужно писать пользовательские скрипты, использующие такие инструменты, как cURL или Python Requests. В пользовательских скриптах нет ничего плохого, но есть накладные расходы на их написание и поддержку.

Читаемость также является фактором, важность которого трудно переоценить. В большинстве языков программирования [соотношение времени чтения к написанию кода превышает 10:1](https://app.works/the-importance-of-code-readability/#:~:text=What%20is%20code%20readability%3F,or%20add%20a%20new%20feature.). Хороший код легко читается и понимается нами и другими разработчиками, и он минимизирует когнитивную нагрузку на расшифровку первоначального намерения автора.

dbt-cloud-cli — это интерфейс командной строки (CLI), который абстрагирует вызовы API dbt Cloud за удобным и элегантным интерфейсом. CLI написан на Python с использованием [pydantic](https://pydantic-docs.helpmanual.io/) и [click](https://click.palletsprojects.com/en/8.0.x/). Позвольте мне продемонстрировать разницу в сложности и читаемости между cURL и dbt-cloud-cli для запуска выполнения задания dbt Cloud:

<Tabs
  defaultValue="cURL"
  values={[
    { label: 'Запуск задания с помощью cURL', value: 'cURL', },
    { label: 'Запуск задания с помощью dbt-cloud-cli', value: 'dbt-cloud-cli', },
  ]
}>
<TabItem value="cURL">

```bash
curl -H "Authorization:Token $DBT_CLOUD_API_TOKEN" -H "Content-Type:application/json" -d '{"cause":"Triggered using cURL"}' https://cloud.getdbt.com/api/v2/accounts/$DBT_CLOUD_ACCOUNT_ID/jobs/43167/run/
```

</TabItem>
<TabItem value="dbt-cloud-cli">

```
dbt-cloud job run --job-id 43167
```

</TabItem>
</Tabs>

Вы, вероятно, согласитесь, что последний пример определенно более элегантен и легче читается. `dbt-cloud` обрабатывает шаблон запроса (например, токен API в заголовке, URL конечной точки), так что вам не нужно беспокоиться об аутентификации или помнить, какую конечную точку использовать. Также CLI реализует дополнительную функциональность (например, `--wait`) для некоторых конечных точек; например, `dbt cloud job run --wait` выполнит запуск задания, подождет, пока задание не завершится, не провалится или не будет отменено, и затем выведет ответ о статусе задания.

В дополнение к командам CLI, которые взаимодействуют с одной конечной точкой API dbt Cloud, существуют составные вспомогательные команды, которые вызывают одну или несколько конечных точек API и выполняют более сложные операции. Один из примеров составных команд — это `dbt-cloud job export` и `dbt-cloud job import`, где, под капотом, команда экспорта выполняет `dbt-cloud job get` и записывает метаданные задания в файл <Term id="json" />, а команда импорта читает параметры задания из JSON-файла и вызывает `dbt-cloud job create`. Команды экспорта и импорта могут использоваться вместе для перемещения заданий dbt Cloud между проектами. Другой пример — это `dbt-cloud job delete-all`, который получает список всех заданий с помощью `dbt-cloud job list`, а затем перебирает список, предлагая пользователю удалить задание. Для каждого задания, которое пользователь соглашается удалить, выполняется `dbt-cloud job delete`.

Чтобы установить CLI в вашу среду Python, выполните `python -m pip install dbt-cloud-cli`, и вы готовы. Вы можете использовать его локально в вашей среде разработки или, например, в рабочем процессе GitHub actions.

## Как появился проект {#how-the-project-came-to-be}

Я фрилансер, инженер по данным и аналитике, и почти все проекты, с которыми я работаю, так или иначе связаны с dbt Cloud. В типичном проекте мы настраиваем простое задание "запуск и тестирование" в dbt Cloud, которое запланировано на выполнение один или два раза в день. Часто также есть [задание непрерывной интеграции](https://docs.getdbt.tech/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration), которое запускается на Pull Requests в GitHub.

Эти два метода запуска заданий (т.е. cron и триггер PR) достаточны в большинстве проектов, но есть случаи, когда требуется дополнительный контроль над тем, когда задание выполняется или что еще выполняется в контексте задания. Например, вам может понадобиться загрузить данные в вашу базу данных перед выполнением задания или загрузить артефакты после завершения выполнения.

В моем случае у нас еще не было конвейера EL для внешнего источника данных. Поэтому мы собрали простой скрипт на Python для загрузки данных и запускали скрипт как часть нашего рабочего процесса CI в GitHub Actions перед запуском задания dbt Cloud. Это гарантировало, что данные в нашей базе данных были актуальными перед выполнением задания.

Изначально мы выполняли запросы API dbt Cloud для запуска заданий с помощью cURL, и это работало прекрасно, пока нам не понадобилось реализовать цикл ожидания, который периодически проверял статус задания и возвращался, когда задание было завершено. К счастью, я нашел скрипт на Python от Шона МакИнтайра ([см. пост на dbt Discourse](https://discourse.getdbt.com/t/triggering-a-dbt-cloud-job-in-your-automated-workflow-with-python/2573)), который делает именно это.

Я модифицировал скрипт в соответствии с нашими потребностями и обернул его в команду CLI `dbt-cloud job run` с использованием click (на самом деле, точка входа тогда не была `dbt-cloud`, но вы поняли идею). Click ("Command Line Interface Creation Kit") — это библиотека Python для создания CLI с минимальным количеством кода. Реализация простого CLI с использованием click требует лишь добавления нескольких декораторов (например, `group`, `command` и `option`) к функциям в вашем коде, и вы готовы.

Теперь у нас было именно то, что мы хотели, и наш рабочий процесс CI в GitHub actions выглядел круто:

```
- name: Запуск задания dbt Cloud
  run: |
    ./cool_script_bro.sh
    dbt-cloud job run --job-id $DBT_CLOUD_JOB_ID
```

Прошло месяц или два, и у другого клиента возникла похожая потребность. Я почувствовал, что это возможность открыть проект с открытым исходным кодом не только для меня и моих клиентов, но и для [широкого сообщества dbt](https://www.getdbt.com/community/) (❤️). Поэтому я переместил проект в публичный репозиторий на GitHub с целью в конечном итоге охватить все конечные точки API dbt Cloud.

Работая с начальным выпуском 0.1.0, который включал только команду `dbt-cloud job run`, я решил повеселиться и попробовать, насколько хорошо pydantic (Python dataclasses на стероидах!) и `click` работают вместе. Я большой поклонник `pydantic`, и я использовал его в самых разных проектах, включая модели машинного обучения и программное обеспечение для автоматизированного тестирования медицинского устройства. Хотя в Python есть встроенные dataclasses с версии 3.7, они не дотягивают, когда дело доходит до проверки данных и общей эргономики для разработчиков (на мой взгляд), и здесь на помощь приходит `pydantic`; среди прочего, `pydantic` реализует декоратор валидатора, который используется для определения пользовательских проверок для полей модели (например, аргументов CLI).

Я переработал код `dbt-cloud-cli`, так что команды CLI теперь реализованы как модели pydantic, где поля модели являются аргументами конечных точек API dbt Cloud. Поля модели `pydantic` теперь можно было перевести в аргументы `click`, что привело к следующему шаблону реализации команды CLI:

```python
import click
from dbt_cloud.command import DbtCloudJobGetCommand

@click.group()
def dbt_cloud():
    pass

@dbt_cloud.group()
def job():
    pass

@job.command(help=DbtCloudJobGetCommand.get_description())
@DbtCloudJobGetCommand.click_options
def get(**kwargs):
    command = DbtCloudJobGetCommand.from_click_options(**kwargs)
    execute_and_print(command)
```

После первоначального выпуска я начал расширять проект, чтобы охватить остальные конечные точки API dbt Cloud. Для списка всех охваченных конечных точек API и реализованных команд CLI, см. https://github.com/data-mie/dbt-cloud-cli.

## Создание приложения каталога данных с использованием артефактов dbt Cloud {#creating-a-data-catalog-app-using-dbt-cloud-artifacts}

В этом примере мы загрузим артефакт `catalog.json` из последнего выполнения задания dbt Cloud, используя `dbt-cloud run list` и `dbt-cloud get-artifact`, а затем напишем простое CLI-приложение каталога данных, используя те же инструменты, которые используются в `dbt-cloud-cli` (т.е. `click` и `pydantic`). Давайте начнем!

Первая команда, которая нам нужна, это `dbt-cloud run list`, которая использует [конечную точку API](https://docs.getdbt.tech/dbt-cloud/api-v2#/operations/List%20Runs), возвращающую выполнения, отсортированные по дате создания, с самым последним выполнением, появляющимся первым. Команда возвращает JSON-ответ, который имеет один атрибут верхнего уровня `data`, содержащий список выполнений. Нам нужно извлечь атрибут `id` первого из них, и для этого мы используем [jq](https://stedolan.github.io/jq/):

```
latest_run_id=$(dbt-cloud run list --job-id $DBT_CLOUD_JOB_ID | jq .data[0].id -r)
```

Далее мы используем команду `dbt-cloud get-artifact` для загрузки артефакта `catalog.json`:

```
dbt-cloud run get-artifact --run-id $latest_run_id --path catalog.json -f catalog.json
```

Чтобы исследовать загруженный файл каталога, мы напишем простое CLI-приложение. [catalog.json](https://schemas.getdbt.com/dbt/catalog/v1.json) имеет четыре свойства верхнего уровня: metadata, nodes, sources и errors. В этом примере мы исследуем только nodes и sources, оставляя metadata и errors в стороне.

Сначала нам нужна абстракция `Catalog`, отражающая схему JSON каталога:

```py
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class Stats(BaseModel):
    """Представляет статистику узла в каталоге."""

    id: str
    label: str
    value: Any
    include: bool
    description: str

    def __str__(self):
        return f"{self.label}: {self.value}"


class Column(BaseModel):
    """Представляет столбец в каталоге."""

    type: str
    index: int
    name: str
    comment: Optional[str]

    def __str__(self):
        return f"{self.name} (type: {self.type}, index: {self.index}, comment: {self.comment})"


class Node(BaseModel):
    """Представляет узел в каталоге."""

    unique_id: str
    metadata: Dict[str, Optional[str]]
    columns: Dict[str, Column]
    stats: Dict[str, Stats]

    @property
    def name(self):
        return self.metadata["name"]

    @property
    def database(self):
        return self.metadata["database"]

    @property
    def schema(self):
        return self.metadata["schema"]

    @property
    def type(self):
        return self.metadata["type"]

    def __gt__(self, other):
        return self.name > other.name

    def __lt__(self, other):
        return self.name < other.name

    def __str__(self):
        return f"{self.name} (type: {self.type}, schema: {self.schema}, database: {self.database})"


class Catalog(BaseModel):
    """Представляет артефакт dbt catalog.json."""

    metadata: Dict
    nodes: Dict[str, Node]
    sources: Dict[str, Node]
    errors: Optional[Dict]
```

Четыре абстракции (`Stats`, `Column`, `Node` и `Catalog`) все наследуют [модель pydantic BaseModel](https://pydantic-docs.helpmanual.io/usage/models/), которая реализует различные методы для парсинга файлов и других объектов Python в экземпляры моделей. Мы оставим парсинг pydantic (т.е. метод класса `BaseModel.parse_file`), чтобы мы могли сосредоточиться исключительно на логике приложения.

Абстракция `CatalogExploreCommand` реализует CLI-приложение, которое затем оборачивается в `click.command`, реализующий точку входа CLI. Класс `CatalogExploreCommand` наследует `ClickBaseModel`, который реализует метод класса `click_options`, который мы будем использовать для декорирования точки входа. Этот метод — это место, где происходит магия перевода pydantic в click (т.е. поля модели pydantic переводятся [в параметры click](https://click.palletsprojects.com/en/8.0.x/options/)). Обратите внимание, что приложение [использует inquirer](https://github.com/magmax/python-inquirer) в дополнение к `click` для создания интерактивных CLI-подсказок "выберите опцию из списка".

```py
import click
from enum import Enum
from pathlib import Path
from pydantic import Field
from dbt_cloud.command.command import ClickBaseModel

class NodeType(Enum):
    SOURCE = "source"
    NODE = "node"


class CatalogExploreCommand(ClickBaseModel):
    """Интерактивное приложение для исследования артефактов каталога."""

    file: Path = Field(default="catalog.json", description="Путь к файлу каталога.")
    title: str = Field(
        default="Data Catalog", description="ASCII art заголовок для приложения."
    )
    title_font: str = Field(
        default="rand-large",
        description="Шрифт ASCII art заголовка (см. https://github.com/sepandhaghighi/art#try-art-in-your-browser для списка доступных шрифтов)",
    )

    def get_catalog(self) -> Catalog:
        return Catalog.parse_file(self.file)

    def print_title(self):
        from art import tprint

        tprint(self.title, font=self.title_font)

    def execute(self):
        import inquirer

        self.print_title()

        while True:
            node_type_options = [
                inquirer.List(
                    "node_type",
                    message="Выберите тип узла для исследования",
                    choices=[node_type.value for node_type in NodeType],
                )
            ]
            node_type = NodeType(inquirer.prompt(node_type_options)["node_type"])
            self.explore(node_type=node_type)
            if not click.confirm("Исследовать другой тип узла?"):
                break

    def explore(self, node_type: NodeType):
        """Интерактивное исследование узлов для изучения и отображения их метаданных"""
        import inquirer

        catalog = self.get_catalog()
        if node_type == NodeType.SOURCE:
            nodes = list(catalog.sources.values())
        else:
            nodes = list(catalog.nodes.values())

        while True:
            databases = sorted(set(map(lambda x: x.database, nodes)))
            database_options = [
                inquirer.List("database", message="Выберите базу данных", choices=databases)
            ]
            database = inquirer.prompt(database_options)["database"]
            nodes_filtered = list(filter(lambda x: x.database == database, nodes))

            schemas = sorted(set(map(lambda x: x.schema, nodes_filtered)))
            schema_options = [
                inquirer.List("schema", message="Выберите схему", choices=schemas)
            ]
            schema = inquirer.prompt(schema_options)["schema"]
            nodes_filtered = list(filter(lambda x: x.schema == schema, nodes_filtered))

            node_options = [
                inquirer.List(
                    "node", message="Выберите узел", choices=sorted(nodes_filtered)
                )
            ]
            node = inquirer.prompt(node_options)["node"]
            click.echo(f"Столбцы {node.name}:")
            for column in node.columns.values():
                click.echo(f"- {column}")
            click.echo("")
            for stats in node.stats.values():
                if stats.id == "has_stats":
                    continue
                click.echo(stats)
            if not click.confirm(f"Исследовать другой {node_type.value}?"):
                break


@click.command(help=CatalogExploreCommand.get_description())
@CatalogExploreCommand.click_options
def data_catalog(**kwargs):
    command = CatalogExploreCommand.from_click_options(**kwargs)
    command.execute()
```

Метод `CatalogExploreCommand.execute` реализует логику интерактивного исследования. Сначала приложение предлагает выбрать тип узла для исследования (`source` или `node`), а затем просит пользователя выбрать базу данных, схему в выбранной базе данных и, наконец, модель в выбранной схеме. Затем приложение выводит столбцы модели и статистику (если она есть). Все это обернуто в цикл с подсказками "Исследовать другой узел? [y/N]" и "Исследовать другой тип узла? [y/N]" для продолжения цикла или выхода из него.

Я включил приложение в последнюю версию dbt-cloud-cli, так что вы можете протестировать его сами! Чтобы использовать приложение, вам нужно установить dbt-cloud-cli с дополнительными зависимостями:

```bash
python -m pip install dbt-cloud-cli[demo]
```

Теперь вы можете запустить приложение:

```bash
dbt-cloud demo data-catalog --file catalog.json
```

## Заключительные мысли {#parting-thoughts}

В заключение, `dbt-cloud-cli` реализует простой в использовании интерфейс командной строки для API dbt Cloud, который абстрагирует сложности вызовов API. CLI имеет интерфейсы для многих конечных точек API, и охват всех конечных точек находится в дорожной карте проекта. Для списка всех охваченных конечных точек API и реализованных команд CLI, см. https://github.com/data-mie/dbt-cloud-cli.

В дополнение к командам, которые взаимодействуют с одной конечной точкой API dbt Cloud, существуют составные вспомогательные команды, которые вызывают одну или несколько конечных точек API и выполняют более сложные операции (например, `dbt-cloud job export` и `dbt-cloud job import`).

`dbt-cloud-cli` делает взаимодействие с API dbt Cloud легким по сравнению с использованием и поддержкой пользовательских скриптов cURL/Python Requests. Более того, команды `dbt-cloud-cli` обрабатывают все шаблоны вызовов API под капотом, так что вам не нужно гуглить или запоминать, как взаимодействовать с API. И если вы сомневаетесь, просто добавьте флаг `--help` к команде `dbt-cloud-cli`, и вы получите список всех доступных команд или аргументов.

P.S. Все еще есть конечные точки API, которые не были реализованы в CLI. Если есть конечная точка, для которой вы хотели бы команду CLI, вы можете открыть проблему в репозитории GitHub. Все вклады в проект (будь то документация в README или новые команды CLI) приветствуются! Если у вас есть вопросы по проекту или как внести вклад, не стесняйтесь написать мне в личные сообщения в dbt Slack.