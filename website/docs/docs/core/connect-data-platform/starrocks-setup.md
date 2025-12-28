---
title: "Настройка Starrocks"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Starrocks в dbt."
id: "starrocks-setup"
meta:
  maintained_by: Starrocks
  authors: Astralidea
  github_repo: 'StarRocks/dbt-starrocks'
  pypi_package: 'dbt-starrocks'
  min_core_version: 'v1.6.2'
  min_supported_version: 'Starrocks 2.5'
  cloud_support: Не поддерживается
  slack_channel_name: '#db-starrocks'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Starrocks'
  config_page: '/reference/resource-configs/starrocks-configs'
---

<h2> Обзор {frontMatter.meta.pypi_package} </h2>

<ul>
<li><strong>Поддерживается</strong>: {frontMatter.meta.maintained_by}</li>
<li><strong>Авторы</strong>: {frontMatter.meta.authors}</li>
<li><strong>GitHub-репозиторий</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
<li><strong>Пакет PyPI</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
<li><strong>Slack-канал</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
<li><strong>Поддерживаемая версия dbt Core</strong>: {frontMatter.meta.min_core_version} и новее</li>
<li><strong>Поддержка <Constant name="cloud" /></strong>: {frontMatter.meta.cloud_support}</li>
<li><strong>Минимальная версия платформы данных</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

<h2> Установка {frontMatter.meta.pypi_package} </h2>

pip — это самый простой способ установить адаптер:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Установка <code>{frontMatter.meta.pypi_package}</code> также установит <code>dbt-core</code> и любые другие зависимости.</p>

<h2> Конфигурация {frontMatter.meta.pypi_package} </h2>

<p>Для конфигурации, специфичной для {frontMatter.meta.platform_name}, пожалуйста, обратитесь к <a href={frontMatter.meta.config_page}>Конфигурация {frontMatter.meta.platform_name}</a> </p>

<p>Для получения дополнительной информации обратитесь к репозиторию на GitHub: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Методы аутентификации

### Аутентификация с использованием имени пользователя и пароля

Starrocks можно настроить, используя базовую аутентификацию с именем пользователя и паролем, как показано ниже.

<File name='~/.dbt/profiles.yml'>

```yaml
my-starrocks-db:
  target: dev
  outputs:
    dev:
      type: starrocks
      host: localhost
      port: 9030
      schema: analytics
      
      # Аутентификация с использованием имени пользователя и пароля
      username: your_starrocks_username
      password: your_starrocks_password
```

</File>

#### Описание полей профиля
| Опция    | Описание                                                | Обязательно? | Пример                         |
|----------|---------------------------------------------------------|--------------|--------------------------------|
| type     | Конкретный адаптер для использования                    | Обязательно  | `starrocks`                    |
| host     | Имя хоста для подключения                               | Обязательно  | `192.168.100.28`               |
| port     | Порт для использования                                  | Обязательно  | `9030`                         |
| schema   | Укажите схему (базу данных) для построения моделей      | Обязательно  | `analytics`                    |
| username | Имя пользователя для подключения к серверу              | Обязательно  | `dbt_admin`                    |
| password | Пароль для аутентификации на сервере                    | Обязательно  | `correct-horse-battery-staple` |
| version  | Позволяет плагину попытаться перейти на совместимую версию starrocks | Необязательно | `3.1.0`                        |

## Поддерживаемые функции

| Starrocks &lt;= 2.5 | Starrocks 2.5 ~ 3.1  | Starrocks &gt;= 3.1  |              Функция              |
|:----------------:|:--------------------:|:-----------------:|:---------------------------------:|
|        ✅         |          ✅           |         ✅         |       Материализация таблиц       |
|        ✅         |          ✅           |         ✅         |       Материализация представлений        |
|        ❌         |          ❌           |         ✅         | Материализация материализованных представлений |
|        ❌         |          ✅           |         ✅         |    Инкрементальная материализация    |
|        ❌         |          ✅           |         ✅         |         Модель первичного ключа         |
|        ✅         |          ✅           |         ✅         |              Источники              |
|        ✅         |          ✅           |         ✅         |         Пользовательские тесты данных         |
|        ✅         |          ✅           |         ✅         |           Генерация документации           |
|        ❌         |          ❌           |         ❌         |               Kafka               |

### Примечание
1. Когда версия StarRocks < 2.5, `Create table as` может установить только engine='OLAP' и table_type='DUPLICATE'
2. Когда версия StarRocks >= 2.5, `Create table as` поддерживает table_type='PRIMARY'
3. Когда версия StarRocks < 3.1, требуется distributed_by

Рекомендуется использовать последнюю версию starrocks и dbt-starrocks для наилучшего опыта.
