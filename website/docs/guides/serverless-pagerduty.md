---
title: "Запуск оповещений PagerDuty при сбоях заданий dbt"
id: serverless-pagerduty 
description: Используйте вебхуки для настройки серверного приложения, чтобы вызывать тревоги PagerDuty.
hoverSnippet: Узнайте, как настроить серверное приложение, использующее вебхуки для вызова тревог PagerDuty.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

## Введение

Это руководство научит вас, как создать и разместить простой Python‑приложение, которое будет отслеживать задания <Constant name="cloud" /> и создавать оповещения PagerDuty при сбоях. Для этого, когда задание <Constant name="cloud" /> завершается, приложение будет:

- проверять наличие неуспешных узлов (например, тестов, не прошедших проверку, или моделей с ошибками), и  
- создавать оповещение PagerDuty на основе этих узлов, вызывая PagerDuty Events API. События дедуплицируются для каждого ID запуска.

![Скриншот интерфейса PagerDuty, показывающий тревогу, созданную из-за некорректного SQL в модели dbt](/img/guides/orchestration/webhooks/serverless-pagerduty/pagerduty-example-alarm.png)

В этом примере мы будем использовать fly.io для хостинга и запуска сервиса. fly.io — это платформа для запуска full stack‑приложений без необходимости настраивать серверы и управлять ими. Такой уровень использования должен без проблем укладываться в рамки бесплатного тарифа (Free tier).  

Вы также можете использовать альтернативные инструменты, например [AWS Lambda](https://ademoverflow.com/en/posts/tutorial-fastapi-aws-lambda-serverless/) или [Google Cloud Run](https://github.com/sekR4/FastAPI-on-Google-Cloud-Run).

### Предварительные требования

Это руководство предполагает, что вы уже знакомы со следующим:

- [<Constant name="cloud" /> Webhooks](/docs/deploy/webhooks)
- CLI‑приложения
- Развёртывание кода в serverless‑среде выполнения, такой как fly.io или AWS Lambda


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

## Настройка нового вебхука в dbt
См. [Create a webhook subscription](/docs/deploy/webhooks#create-a-webhook-subscription) для получения подробных инструкций. В качестве события укажите **Run completed**.

Установите URL вебхука на имя хоста, которое вы создали ранее (`APP_NAME.fly.dev`).

Запомните секретный ключ вебхука для дальнейшего использования.

*Не тестируйте конечную точку*; это не сработает, пока вы не сохраните ключи аутентификации (следующий шаг).

## Хранение секретов
Приложению необходимо задать три секрета со следующими именами:
- `DBT_CLOUD_SERVICE_TOKEN`: [personal access token](/docs/dbt-cloud-apis/user-tokens) или [service account token](/docs/dbt-cloud-apis/service-tokens) для <Constant name="cloud" />, с как минимум разрешением `Metdata Only`.
- `DBT_CLOUD_AUTH_TOKEN`: Secret Key для вебхука <Constant name="cloud" />, который вы создали ранее.
- `PD_ROUTING_KEY`: ключ интеграции для интеграции PagerDuty, которую вы создали ранее.

Установите эти секреты следующим образом, заменив `abc123` и т.д. на фактические значения:
```shell
flyctl secrets set DBT_CLOUD_SERVICE_TOKEN=abc123 DBT_CLOUD_AUTH_TOKEN=def456 PD_ROUTING_KEY=ghi789
```

## Развертывание вашего приложения

После того как вы зададите свои секреты, fly.io выполнит повторное развертывание вашего приложения. Когда оно успешно завершится, вернитесь в настройки вебхука <Constant name="cloud" /> и нажмите **Test Endpoint**.

</div>