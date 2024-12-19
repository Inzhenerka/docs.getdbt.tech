---
title: "Установка с помощью Docker"
description: "Вы можете использовать Docker для установки dbt и адаптеров плагинов из командной строки."
---

dbt Core и все адаптеры плагинов, поддерживаемые dbt Labs, доступны в виде [Docker](https://docs.docker.com/) образов и распространяются через [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages) в [публичном реестре](https://github.com/dbt-labs/dbt-core/pkgs/container/dbt-core).

Использование предварительно собранного Docker образа для установки dbt Core в производственной среде имеет несколько преимуществ: он уже включает dbt-core, один или несколько адаптеров баз данных и зафиксированные версии всех их зависимостей. В отличие от этого, команда `python -m pip install dbt-core dbt-<adapter>` выполняется дольше и всегда устанавливает последние совместимые версии каждой зависимости.

Вы также можете использовать Docker для установки и разработки локально, если у вас не настроена среда Python. Обратите внимание, что запуск dbt таким образом может быть значительно медленнее, если ваша операционная система отличается от системы, на которой был собран Docker образ. Если вы часто разрабатываете локально, мы рекомендуем установить dbt Core с помощью [pip](/docs/core/pip-install).

### Предварительные требования

* Вы установили Docker. Для получения дополнительной информации смотрите сайт [Docker](https://docs.docker.com/).
* Вы понимаете, какие адаптеры баз данных вам нужны. Для получения дополнительной информации смотрите [О адаптерах dbt](/docs/core/installation-overview#about-dbt-data-platforms-and-adapters).
* Вы понимаете, как версионируется dbt Core. Для получения дополнительной информации смотрите [О версиях dbt Core](/docs/dbt-versions/core).
* У вас есть общее представление о dbt, рабочем процессе dbt, разработке локально в интерфейсе командной строки (CLI). Для получения дополнительной информации смотрите [О dbt](/docs/introduction#how-do-i-use-dbt).

### Установка образа dbt Docker из GitHub Packages

Официальные образы dbt Docker размещены в виде [пакетов в организации `dbt-labs` на GitHub](https://github.com/orgs/dbt-labs/packages?visibility=public). Мы поддерживаем образы и теги для каждой версии каждого адаптера баз данных, а также два тега, которые обновляются по мере выхода новых версий:
- `latest`: Последняя общая версия dbt-core + этот адаптер
- `<Major>.<Minor>.latest`: Последний патч dbt-core + этот адаптер для версии `<Major>.<Minor>`. Например, `1.1.latest` включает последние патчи для dbt Core v1.1.

Установите образ с помощью команды `docker pull`:
```
docker pull ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>
```

### Запуск образа dbt Docker в контейнере

`ENTRYPOINT` для образов dbt Docker — это команда `dbt`. Вы можете смонтировать ваш проект в `/usr/app` и использовать dbt как обычно:

```
docker run \
--network=host \
--mount type=bind,source=path/to/project,target=/usr/app \
--mount type=bind,source=path/to/profiles.yml,target=/root/.dbt/profiles.yml \
<dbt_image_name> \
ls
```

Или 

```
docker run \
--network=host \
--mount type=bind,source=path/to/project,target=/usr/app \
--mount type=bind,source=path/to/profiles.yml.dbt,target=/root/.dbt/ \
<dbt_image_name> \
ls
```

Примечания:
* Исходные пути для монтирования _должны_ быть абсолютными
* Вам может потребоваться внести изменения в настройки сетевого взаимодействия Docker в зависимости от особенностей вашего хранилища данных или хоста базы данных.

### Создание собственного образа dbt Docker

Если готовые образы не подходят для вашего случая, мы также предоставляем [`Dockerfile`](https://github.com/dbt-labs/dbt-core/blob/main/docker/Dockerfile) и [`README`](https://github.com/dbt-labs/dbt-core/blob/main/docker/README.md), которые можно использовать для создания пользовательских образов различными способами.

В частности, Dockerfile поддерживает создание образов:
- Образы, которые включают все адаптеры, поддерживаемые dbt Labs
- Образы, которые устанавливают один или несколько сторонних адаптеров
- Образы для другой архитектуры системы

Обратите внимание, что если вы решите создать собственные образы Docker, мы не можем предложить специализированную поддержку для пользовательских случаев. Если у вас возникнут проблемы, вы можете [попросить сообщество о помощи](/community/resources/getting-help) или [открыть проблему](/community/resources/oss-expectations#issues) в репозитории `dbt-core`. Если многие пользователи запрашивают одно и то же улучшение, мы пометим проблему тегом `help_wanted` и пригласим к участию в сообществе.