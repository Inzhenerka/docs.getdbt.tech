---
title: "Установка с помощью Docker"
description: "Вы можете использовать Docker для установки dbt и адаптеров из командной строки."
---

<Constant name="core" /> и все плагины‑адаптеры, поддерживаемые dbt Labs, доступны в виде образов [Docker](https://docs.docker.com/) и распространяются через [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages) в [публичном реестре](https://github.com/dbt-labs/dbt-core/pkgs/container/dbt-core).

Использование заранее собранного Docker-образа для установки dbt Core в производственной среде имеет несколько преимуществ: он уже включает dbt-core, один или несколько адаптеров баз данных и зафиксированные версии всех их зависимостей. В отличие от этого, `python -m pip install dbt-core dbt-<adapter>` занимает больше времени и всегда устанавливает последние совместимые версии каждой зависимости.

Вы также можете использовать Docker для установки и локальной разработки, если у вас не настроено окружение Python. Обратите внимание, что запуск dbt таким способом может быть значительно медленнее, если ваша операционная система отличается от системы, на которой был собран Docker-образ. Если вы часто разрабатываете локально, мы рекомендуем установить <Constant name="core" /> с помощью [pip](/docs/core/pip-install).

### Предварительные требования {#prerequisites}

* У вас установлен Docker. Подробнее см. на сайте [Docker](https://docs.docker.com/).
* Вы понимаете, какой адаптер(ы) базы данных вам нужен. Подробнее см. [About dbt adapters](/docs/core/installation-overview#about-dbt-data-platforms-and-adapters).
* Вы понимаете, как версионируется <Constant name="core" />. Подробнее см. [About <Constant name="core" /> versions](/docs/dbt-versions/core).
* У вас есть общее понимание dbt, рабочего процесса dbt и локальной разработки с использованием интерфейса командной строки (CLI). Подробнее см. [About dbt](/docs/introduction#how-do-i-use-dbt).

### Установка Docker-образа dbt из Github Packages {#install-a-dbt-docker-image-from-github-packages}

Официальные Docker-образы dbt размещены как [пакеты в организации `dbt-labs` на GitHub](https://github.com/orgs/dbt-labs/packages?visibility=public). Мы поддерживаем образы и теги для каждой версии каждого адаптера баз данных, а также два тега, которые обновляются по мере выпуска новых версий:
- `latest`: Последняя общая версия dbt-core + этот адаптер
- `<Major>.<Minor>.latest`: Последний патч dbt-core + этот адаптер для семейства версий `<Major>.<Minor>`. Например, `1.1.latest` включает последние патчи для dbt Core v1.1.

Установите образ с помощью команды `docker pull`:
```
docker pull ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>
```

### Запуск Docker-образа dbt в контейнере {#running-a-dbt-docker-image-in-a-container}

`ENTRYPOINT` для Docker-образов dbt — это команда `dbt`. Вы можете примонтировать ваш проект в `/usr/app` и использовать dbt как обычно:

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
* Источники примонтирования _должны_ быть абсолютным путем
* Возможно, вам потребуется внести изменения в настройки сетевого взаимодействия Docker в зависимости от особенностей вашего хранилища данных или хоста базы данных.

### Создание собственного Docker-образа dbt {#building-your-own-dbt-docker-image}

Если готовые образы не подходят для вашего случая, мы также предоставляем [`Dockerfile`](https://github.com/dbt-labs/dbt-core/blob/main/docker/Dockerfile) и [`README`](https://github.com/dbt-labs/dbt-core/blob/main/docker/README.md), которые можно использовать для создания пользовательских образов различными способами.

В частности, Dockerfile поддерживает создание образов:
- Образы, которые включают все адаптеры, поддерживаемые dbt Labs
- Образы, которые устанавливают один или несколько сторонних адаптеров
- Образы для другой системной архитектуры

Обратите внимание: если вы решите пойти по пути сборки собственных Docker-образов, мы не сможем предоставить выделенную поддержку для таких пользовательских сценариев. Если у вас возникнут проблемы, вы можете [обратиться за помощью к сообществу](/community/resources/getting-help) или [открыть issue](/community/resources/contributor-expectations#issues) в репозитории `dbt-core`. Если многие пользователи будут запрашивать одно и то же улучшение, мы пометим issue тегом `help_wanted` и пригласим сообщество к участию.
