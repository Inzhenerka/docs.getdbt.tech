---
title: "Подключение Rockset к dbt v1"
sidebar_label: "Rockset"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища данных Rockset в dbt."
id: "rockset-setup"
meta:
  maintained_by: Rockset, Inc.
  authors: 'Rockset, Inc.'
  github_repo: 'rockset/dbt-rockset'
  pypi_package: 'dbt-rockset'
  min_core_version: 'v0.19.2'
  cloud_support: Not Supported
  min_supported_version: '?'
  slack_channel_name: '#dbt-rockset'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02J7AZUAMN'
  platform_name: 'Rockset'
  config_page: '/reference/resource-configs/no-configs'
availability: local_free
---

:::info Плагин, поддерживаемый поставщиком

Некоторые основные функции могут отличаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете посетить связанный репозиторий и открыть задачу.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Rockset с помощью **dbt-rockset** {#connecting-to-rockset-with-dbt-rockset}

Профиль dbt для Rockset очень прост и содержит следующие поля:

<File name='profiles.yml'>

```yaml
rockset:
  target: dev
  outputs:
    dev:
      type: rockset
      workspace: [schema]
      api_key: [api_key]
      api_server: [api_server] # (По умолчанию api.rs2.usw2.rockset.com)
```

</File>

### Материализации {#materializations}

Тип | Поддерживается? | Подробности
-----|----------------|----------------
view | ДА | Создает [представление](https://rockset.com/docs/views/#gatsby-focus-wrapper).
table | ДА | Создает [коллекцию](https://rockset.com/docs/collections/#gatsby-focus-wrapper).
ephemeral | ДА | Выполняет запросы с использованием CTE.
incremental | ДА | Создает [коллекцию](https://rockset.com/docs/collections/#gatsby-focus-wrapper), если она не существует, и затем записывает в нее результаты.

## Ограничения
1. `unique_key` не поддерживается при инкрементальной материализации, если только для него не задано значение [_id](https://rockset.com/docs/special-fields/#the-_id-field), которое в Rockset и так выступает в качестве естественного `unique_key`.
2. Материализация `table` (<Term id="materialization" />) в Rockset работает медленнее, чем в большинстве других систем, из-за архитектуры Rockset как базы данных реального времени с низкой задержкой. Создание новых коллекций требует выделения ресурсов горячего хранилища для индексирования и предоставления доступа к свежим данным, что занимает около минуты.
3. В Rockset время выполнения запросов ограничено двумя минутами. Любая модель, выполняющая запрос, на который требуется больше двух минут, завершится с ошибкой.
