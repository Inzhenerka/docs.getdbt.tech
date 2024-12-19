---
title: "Настройка Rockset"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Rockset в dbt."
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
---

:::info Плагин с поддержкой поставщика

Некоторые основные функции могут различаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете ознакомиться с указанным репозиторием и открыть проблему.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Rockset с помощью **dbt-rockset**

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

### Материализации

Тип | Поддерживается? | Подробности
-----|----------------|----------------
view | ДА | Создает [представление](https://rockset.com/docs/views/#gatsby-focus-wrapper).
table | ДА | Создает [коллекцию](https://rockset.com/docs/collections/#gatsby-focus-wrapper).
ephemeral | ДА | Выполняет запросы с использованием CTE.
incremental | ДА | Создает [коллекцию](https://rockset.com/docs/collections/#gatsby-focus-wrapper), если она не существует, а затем записывает результаты в нее.

## Предостережения
1. `unique_key` не поддерживается для инкрементальных загрузок, если он не установлен на [_id](https://rockset.com/docs/special-fields/#the-_id-field), который в любом случае действует как естественный `unique_key` в Rockset.
2. Материализация `table` <Term id="materialization" /> медленнее в Rockset, чем в большинстве случаев, из-за архитектуры Rockset как базы данных с низкой задержкой и реального времени. Создание новых коллекций требует выделения горячего хранилища для индексации и обслуживания свежих данных, что занимает около минуты.
3. Запросы в Rockset имеют тайм-аут в две минуты. Любая модель, которая выполняет запрос, занимающий больше двух минут, завершится с ошибкой.