---
title: "Настройка Upsolver"
description: "Прочтите это руководство, чтобы узнать, как настроить Upsolver с dbt."
id: "upsolver-setup"
meta:
  maintained_by: Upsolver Team
  authors: Upsolver Team
  github_repo: 'Upsolver/dbt-upsolver'
  pypi_package: 'dbt-upsolver'
  min_core_version: 'v1.5.0'
  cloud_support: Не поддерживается
  min_supported_version: 'n/a'
  slack_channel_name: 'Upsolver Community'
  slack_channel_link: 'https://join.slack.com/t/upsolvercommunity/shared_invite/zt-1zo1dbyys-hj28WfaZvMh4Z4Id3OkkhA'
  platform_name: 'Upsolver'
  config_page: '/reference/resource-configs/upsolver-configs'
pagination_next: null
---

<h2> Обзор {frontMatter.meta.pypi_package} </h2>

<ul>
<li><strong>Поддерживается</strong>: {frontMatter.meta.maintained_by}</li>
<li><strong>Авторы</strong>: {frontMatter.meta.authors}</li>
<li><strong>GitHub‑репозиторий</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
<li><strong>Пакет PyPI</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
<li><strong>Канал в Slack</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
<li><strong>Поддерживаемая версия dbt Core</strong>: {frontMatter.meta.min_core_version} и новее</li>
<li><strong>Поддержка <Constant name="cloud" /></strong>: {frontMatter.meta.cloud_support}</li>
<li><strong>Минимальная версия платформы данных</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>
<h2> Установка {frontMatter.meta.pypi_package} </h2>

pip — это самый простой способ установить адаптер:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Установка <code>{frontMatter.meta.pypi_package}</code> также установит <code>dbt-core</code> и любые другие зависимости.</p>

<h2> Настройка {frontMatter.meta.pypi_package} </h2>

<p>Для конфигурации, специфичной для {frontMatter.meta.platform_name}, пожалуйста, обратитесь к <a href={frontMatter.meta.config_page}>Конфигурация {frontMatter.meta.platform_name}</a> </p>

<p>Для получения дополнительной информации обратитесь к репозиторию на GitHub: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Методы аутентификации

### Аутентификация пользователя / токена

Upsolver может быть настроен с использованием базовой аутентификации пользователя/токена, как показано ниже.

<File name='~/.dbt/profiles.yml'>

```yaml
my-upsolver-db:
  target: dev
  outputs:
    dev:
      type: upsolver
      api_url: https://mt-api-prod.upsolver.com

      user: [username]
      token: [token]

      database: [database name]
      schema: [schema name]
      threads: [1 or more]

  ```

</File>

## Конфигурации

Конфигурации для целей Upsolver показаны ниже.

### Все конфигурации

| Конфигурация | Обязательно? | Описание |
| ------ | --------- | ----------- |
| token | Да | Токен для подключения к Upsolver [Документация Upsolver](https://docs.upsolver.com/sqlake/api-integration) |
| user | Да | Пользователь для входа |
| database | Да | База данных, в которой dbt должен создавать модели |
| schema | Да | Схема, в которую по умолчанию будут строиться модели |
| api_url | Да | URL API для подключения. Обычное значение ```https://mt-api-prod.upsolver.com``` |
