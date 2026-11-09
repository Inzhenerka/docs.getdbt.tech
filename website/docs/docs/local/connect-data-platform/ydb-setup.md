---
title: "Подключение YDB к dbt v1"
sidebar_label: "YDB"
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
availability: local_free
---

<h2> Обзор {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Сопровождение</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Авторы</strong>: {frontMatter.meta.authors}</li>
    <li><strong>Репозиторий GitHub</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>Пакет PyPI</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Канал Slack</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Поддерживаемая версия <Constant name="core" /></strong>: {frontMatter.meta.min_core_version} и новее</li>
    <li><strong>Поддержка <Constant name="dbt" /></strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Минимальная версия платформы данных</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

<h2> Установка {frontMatter.meta.pypi_package} </h2>

Самый простой способ установить адаптер — использовать pip:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>При установке <code>{frontMatter.meta.pypi_package}</code> также будут установлены <code>dbt-core</code> и все необходимые зависимости.</p>

<h2> Настройка {frontMatter.meta.pypi_package} </h2>

<p>Для специфичной для {frontMatter.meta.platform_name} конфигурации, пожалуйста, обратитесь к разделу <a href={frontMatter.meta.config_page}>Конфигурация {frontMatter.meta.platform_name}</a> </p>

<p>Для получения дополнительной информации см. GitHub-репозиторий: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Подключение к YDB {#connecting-to-ydb}

Чтобы подключиться к YDB из dbt, необходимо добавить [профиль](/docs/local/profiles.yml) в файл `profiles.yml`. Профиль YDB имеет следующий синтаксис:

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

### Все параметры конфигурации {#all-configurations}

| Config | Required? | Default | Description |
| ------ | --------- | ------- | ----------- |
| host | Да | | Хост YDB |
| port | Да | | Порт YDB |
| database | Да | | База данных YDB |
| schema | Нет | `empty_string` | Необязательная подпапка для моделей dbt. Используйте пустую строку или `/` для использования корневой папки |
| secure | Нет | False | Если включено, будет использоваться протокол `grpcs` |
| root_certificates_path | Нет | `empty_string`| Необязательный путь к файлу корневых сертификатов |
| username | Нет | `empty_string` | Имя пользователя YDB для аутентификации со статическими учетными данными |
| password | Нет | `empty_string` | Пароль YDB для аутентификации со статическими учетными данными |
| token | Нет | `empty_string` | Токен YDB для аутентификации с токеном доступа |
| service_account_credentials_file | Нет | `empty_string` | Путь к файлу учетных данных сервисного аккаунта для аутентификации с учетными данными сервисного аккаунта |
