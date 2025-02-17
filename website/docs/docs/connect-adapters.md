---
title: "Как подключиться к адаптерам"
id: "connect-adapters"
---

Адаптеры являются важной частью dbt. На базовом уровне они обеспечивают подключение dbt к различным поддерживаемым платформам данных. На более высоком уровне адаптеры стремятся предоставить аналитическим инженерам более универсальные навыки, а также стандартизировать структуру аналитических проектов. Больше не нужно изучать новый язык или диалект SQL при переходе на новую работу с другой платформой данных. Это сила адаптеров в dbt &mdash; для получения более подробной информации обратитесь к руководству [Создание, тестирование, документирование и продвижение адаптеров](/guides/adapter-creation).

Этот раздел предоставляет более подробную информацию о различных способах подключения dbt к адаптеру и объясняет, кто такой мейнтейнер.

### Настройка в dbt Cloud

Изучите самый быстрый и надежный способ развертывания dbt с использованием dbt Cloud, размещенной архитектуры, которая запускает dbt Core по всей вашей организации. dbt Cloud позволяет вам без проблем [подключаться](/docs/cloud/about-cloud-setup) к различным [доверенным](/docs/supported-data-platforms) поставщикам платформ данных непосредственно в интерфейсе dbt Cloud.

### Установка с dbt Core

Установите dbt Core, инструмент с открытым исходным кодом, локально с помощью командной строки. dbt взаимодействует с различными платформами данных, используя специальный плагин адаптера для каждой из них. При установке dbt Core вам также потребуется установить конкретный адаптер для вашей базы данных, [подключиться к dbt Core](/docs/core/about-core-setup) и настроить файл `profiles.yml`.

С несколькими исключениями [^1], вы можете установить все [адаптеры](/docs/supported-data-platforms) из PyPI, используя `python -m pip install adapter-name`. Например, чтобы установить Snowflake, используйте команду `python -m pip install dbt-snowflake`. Установка включит `dbt-core` и любые другие необходимые зависимости, которые могут включать как другие зависимости, так и другие плагины адаптеров. Подробнее о [установке dbt](/docs/core/installation-overview).

[^1]: Используйте имя пакета PyPI при установке с помощью `pip`

    | Имя репозитория адаптера | Имя пакета PyPI       |
    | ------------------------ | --------------------- |
    | `dbt-layer`              | `dbt-layer-bigquery`  |