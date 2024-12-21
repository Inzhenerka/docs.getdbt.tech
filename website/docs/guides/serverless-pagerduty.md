---
title: "Настройка тревог PagerDuty при сбоях в dbt Cloud"
id: serverless-pagerduty 
description: Используйте вебхуки для настройки серверного приложения, чтобы вызывать тревоги PagerDuty.
hoverSnippet: Узнайте, как настроить серверное приложение, использующее вебхуки для вызова тревог PagerDuty.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Это руководство научит вас создавать и размещать базовое приложение на Python, которое будет отслеживать задания dbt Cloud и создавать тревоги PagerDuty в случае сбоя. Для этого, когда задание dbt Cloud завершится, оно будет:
 - Проверять наличие любых неудачных узлов (например, не пройденных тестов или моделей с ошибками), и
 - создавать тревогу PagerDuty на основе этих узлов, вызывая API событий PagerDuty. События дублируются по ID запуска.

![Скриншот интерфейса PagerDuty, показывающий тревогу, созданную из-за некорректного SQL в модели dbt](/img/guides/orchestration/webhooks/serverless-pagerduty/pagerduty-example-alarm.png)

В этом примере мы будем использовать fly.io для размещения/запуска сервиса. fly.io — это платформа для запуска полнофункциональных приложений без необходимости настройки серверов и т.д. Этот уровень использования должен комфортно вписываться в бесплатный тариф. Вы также можете использовать альтернативные инструменты, такие как [AWS Lambda](https://adem.sh/blog/tutorial-fastapi-aws-lambda-serverless) или [Google Cloud Run](https://github.com/sekR4/FastAPI-on-Google-Cloud-Run).

### Предварительные требования

Это руководство предполагает, что вы знакомы с:
- [Вебхуками dbt Cloud](/docs/deploy/webhooks)
- CLI приложениями
- Размещением кода на серверных платформах, таких как fly.io или AWS Lambda


## Клонирование репозитория `dbt-cloud-webhooks-pagerduty`

[Этот репозиторий](https://github.com/dpguthrie/dbt-cloud-webhooks-pagerduty) содержит пример кода для проверки вебхука и создания событий в PagerDuty.


## Установка `flyctl` и регистрация на fly.io

Следуйте инструкциям для вашей операционной системы в [документации fly.io](https://fly.io/docs/hands-on/install-flyctl/), затем выполните следующие команды в командной строке:

Перейдите в каталог, содержащий клонированный вами репозиторий на шаге 1:
```shell
#пример: замените на ваш фактический путь
cd ~/Documents/GitHub/dbt-cloud-webhooks-pagerduty
```

Зарегистрируйтесь на fly.io:
```shell
flyctl auth signup
```

Ваша консоль должна показать `successfully logged in as YOUR_EMAIL` после завершения, но если этого не произошло, войдите в fly.io из командной строки:
```shell
flyctl auth login
```

## Запуск вашего приложения на fly.io
Запуск вашего приложения публикует его в интернете и делает его готовым к обработке событий вебхуков:
```shell
flyctl launch
```

Вы увидите сообщение о том, что найден существующий файл `fly.toml`. Введите `y`, чтобы скопировать его конфигурацию в ваше новое приложение.

Выберите имя приложения по вашему выбору, например, `YOUR_COMPANY-dbt-cloud-webhook-pagerduty`, или оставьте поле пустым, и оно будет сгенерировано автоматически. Обратите внимание, что ваше имя может содержать только цифры, строчные буквы и дефисы.

Выберите регион для развертывания и запомните сгенерированное имя хоста (обычно `APP_NAME.fly.dev`).

Когда вас спросят, хотите ли вы настроить базы данных Postgresql или Redis, введите `n` для каждого.

Введите `y`, когда вас спросят, хотите ли вы развернуть приложение сейчас.

<details>
<summary>Пример вывода мастера настройки:</summary>
<code>
joel@Joel-Labes dbt-cloud-webhooks-pagerduty % flyctl launch<br/>
An existing fly.toml file was found for app dbt-cloud-webhooks-pagerduty<br/>
? Would you like to copy its configuration to the new app? Yes<br/>
Creating app in /Users/joel/Documents/GitHub/dbt-cloud-webhooks-pagerduty<br/>
Scanning source code<br/>
Detected a Dockerfile app<br/>
? Choose an app name (leave blank to generate one): demo-dbt-cloud-webhook-pagerduty<br/>
automatically selected personal organization: Joel Labes<br/>
Some regions require a paid plan (fra, maa).<br/>
See https://fly.io/plans to set up a plan.<br/>
? Choose a region for deployment:  [Use arrows to move, type to filter]<br/>
? Choose a region for deployment: Sydney, Australia (syd)<br/>
Created app dbtlabs-dbt-cloud-webhook-pagerduty in organization personal<br/>
Admin URL: https://fly.io/apps/demo-dbt-cloud-webhook-pagerduty<br/>
Hostname: demo-dbt-cloud-webhook-pagerduty.fly.dev<br/>
? Would you like to set up a Postgresql database now? No<br/>
? Would you like to set up an Upstash Redis database now? No<br/>
Wrote config file fly.toml<br/>
? Would you like to deploy now? Yes
</code>
</details>

## Создание интеграционного приложения PagerDuty
См. [руководство PagerDuty](https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTgw-events-api-v2-overview#getting-started) для получения полных инструкций.

Запомните ключ интеграции для дальнейшего использования.

## Настройка нового вебхука в dbt Cloud
См. [Создание подписки на вебхук](/docs/deploy/webhooks#create-a-webhook-subscription) для получения полных инструкций. Ваше событие должно быть **Run completed**.

Установите URL вебхука на имя хоста, которое вы создали ранее (`APP_NAME.fly.dev`).

Запомните секретный ключ вебхука для дальнейшего использования.

*Не тестируйте конечную точку*; это не сработает, пока вы не сохраните ключи аутентификации (следующий шаг).

## Хранение секретов
Приложение требует установки трех секретов с использованием следующих имен:
- `DBT_CLOUD_SERVICE_TOKEN`: [персональный токен доступа](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) или [токен учетной записи сервиса](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens) dbt Cloud с как минимум разрешением `Metdata Only`.
- `DBT_CLOUD_AUTH_TOKEN`: секретный ключ для вебхука dbt Cloud, который вы создали ранее.
- `PD_ROUTING_KEY`: ключ интеграции для интеграции PagerDuty, которую вы создали ранее.

Установите эти секреты следующим образом, заменив `abc123` и т.д. на фактические значения:
```shell
flyctl secrets set DBT_CLOUD_SERVICE_TOKEN=abc123 DBT_CLOUD_AUTH_TOKEN=def456 PD_ROUTING_KEY=ghi789
```

## Развертывание вашего приложения

После установки секретов, fly.io повторно развернет ваше приложение. Когда это будет успешно завершено, вернитесь к настройкам вебхука dbt Cloud и нажмите **Test Endpoint**.

</div>