---
title: "Настройка YDB"
description: "Прочитайте это руководство, чтобы узнать, как настроить YDB для работы с dbt."
id: "ydb-setup"
meta:
  maintained_by: YDB Team
  authors: YDB Team
  github_repo: 'ydb-platform/dbt-ydb'
  pypi_package: 'dbt-ydb'
  min_core_version: 'v1.8.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'n/a'
  slack_channel_link:
  platform_name: 'YDB'
  config_page: '/reference/resource-configs/no-configs'
---

<h2> Обзор {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Поддерживается</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Авторы</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub репозиторий</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI пакет</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack-канал</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Поддерживаемая версия dbt Core</strong>: {frontMatter.meta.min_core_version} и новее</li>
    <li><strong>Поддержка <Constant name="cloud" /></strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Минимальная версия платформы данных</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

<h2> Установка {frontMatter.meta.pypi_package} </h2>

Самый простой способ установить адаптер — использовать pip:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>При установке <code>{frontMatter.meta.pypi_package}</code> также будут установлены <code>dbt-core</code> и все необходимые зависимости.</p>

<h2> Настройка {frontMatter.meta.pypi_package} </h2>

<p>Для специфичной для {frontMatter.meta.platform_name} конфигурации, пожалуйста, обратитесь к разделу <a href={frontMatter.meta.config_page}>Конфигурация {frontMatter.meta.platform_name}</a> </p>

<p>Для получения дополнительной информации см. GitHub-репозиторий: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Подключение к YDB

Чтобы подключиться к YDB из dbt, вам необходимо добавить [профиль](/docs/core/connect-data-platform/connection-profiles) в файл `profiles.yml`. Профиль YDB должен соответствовать следующему синтаксису:

<File name='profiles.yml'>

```yaml
profile-name:
  target: dev
  outputs:
    dev:
      type: ydb
      host: localhost
      port: 2136
      database: /local
      schema: empty_string
      secure: False
      root_certificates_path: empty_string

      # Static credentials
      username: empty_string
      password: empty_string

      # Access token credentials
      token: empty_string

      # Service account credentials
      service_account_credentials_file: empty_string

  ```

</File>

### Все параметры конфигурации

| Config | Required? | Default | Description |
| ------ | --------- | ------- | ----------- |
| host | Yes | | Хост YDB |
| port | Yes | | Порт YDB |
| database | Yes | | База данных YDB |
| schema | No | `empty_string` | Необязательная подпапка для dbt-моделей. Используйте пустую строку или `/`, чтобы использовать корневую папку |
| secure | No | False | Если включено, будет использоваться протокол `grpcs` |
| root_certificates_path | No | `empty_string`| Необязательный путь к файлу корневых сертификатов |
| username | No | `empty_string` | Имя пользователя YDB для использования статических учетных данных |
| password | No | `empty_string` | Пароль YDB для использования статических учетных данных |
| token | No | `empty_string` | Токен YDB для использования учетных данных Access Token |
| service_account_credentials_file | No | `empty_string` | Путь к файлу учетных данных сервисного аккаунта для использования сервисного аккаунта |
