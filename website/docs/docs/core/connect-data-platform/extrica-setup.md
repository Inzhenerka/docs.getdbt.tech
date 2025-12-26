---
title: "Настройка Extrica"
description: "Прочтите это руководство, чтобы узнать о настройке Extrica Trino Query Engine в dbt."
id: "extrica-setup"
meta:
  maintained_by: Extrica, Trianz 
  authors: Gaurav Mittal, Viney Kumar, Mohammed Feroz, and Mrinal Mayank
  github_repo: 'extricatrianz/dbt-extrica'
  pypi_package: 'dbt-extrica'
  min_core_version: 'v1.7.2'
  cloud_support: 'Not Supported'
  min_supported_version: 'n/a'
  platform_name: 'Extrica'
---
<h2> Обзор {frontMatter.meta.pypi_package} </h2>

<ul>
<li><strong>Поддерживается</strong>: {frontMatter.meta.maintained_by}</li>
<li><strong>Авторы</strong>: {frontMatter.meta.authors}</li>
<li><strong>Репозиторий GitHub</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></li>
<li><strong>Пакет PyPI</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
<li><strong>Поддерживаемая версия dbt Core</strong>: {frontMatter.meta.min_core_version} и новее</li>
<li><strong>Поддержка <Constant name="cloud" /></strong>: {frontMatter.meta.cloud_support}</li>
<li><strong>Минимальная версия платформы данных</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>
<h2> Установка {frontMatter.meta.pypi_package} </h2>

Используйте `pip` для установки адаптера, который автоматически установит `dbt-core` и любые дополнительные зависимости. Используйте следующую команду для установки:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>


<h2> Подключение к {frontMatter.meta.platform_name} </h2>

#### Пример profiles.yml 
Вот пример профилей dbt-extrica. Минимально необходимо указать `type`, `method`, `username`, `password`, `host`, `port`, `schema`, `catalog` и `threads`. 
<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  outputs:
    dev:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]

    prod:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]
  target: dev

```
</File>

#### Описание полей профиля Extrica

| Параметр  | Тип     | Описание                              |
|------------|----------|------------------------------------------|
| type       | string  | Указывает тип адаптера dbt (Extrica). |
| method     | jwt      | Метод аутентификации для JWT-аутентификации. |
| username   | string   | Имя пользователя для JWT-аутентификации. Полученный JWT-токен используется для инициализации объекта trino.auth.JWTAuthentication.      |
| password   | string   | Пароль для JWT-аутентификации. Полученный JWT-токен используется для инициализации объекта trino.auth.JWTAuthentication.      |
| host       | string   | Параметр host указывает имя хоста или IP-адрес сервера Trino от Extrica.           |
| port       | integer  | Параметр port указывает номер порта, на котором сервер Trino от Extrica принимает подключения.        |
| schema     | string   | Имя схемы или базы данных для подключения. |
| catalog    | string   | Имя каталога, представляющего источник данных. |
| threads    | integer  | Количество потоков для параллельного выполнения запросов. (1 или более) |