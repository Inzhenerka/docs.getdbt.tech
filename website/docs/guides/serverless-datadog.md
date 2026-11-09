---
title: "Создание событий Datadog из результатов dbt"
id: serverless-datadog
description: Настройте serverless‑приложение для добавления событий dbt в логи Datadog.
hoverSnippet: Узнайте, как настроить serverless‑приложение для добавления событий dbt в логи Datadog.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом руководстве вы узнаете, как создать и разместить простое приложение на Python, которое будет добавлять события заданий <Constant name="dbt" /> в Datadog. Для этого после завершения задания <Constant name="dbt" /> приложение будет создавать запись в журнале для каждого выполненного узла, содержащую всю информацию об этом узле, предоставляемую [Discovery API](/docs/dbt-apis/discovery-schema-job-models).

В этом примере мы будем использовать [fly.io](https://fly.io) для хостинга и запуска сервиса. fly.io — это платформа для запуска полнофункциональных приложений без необходимости настраивать серверы и сопутствующую инфраструктуру. Такой уровень использования без проблем укладывается в рамки бесплатного тарифа. Вы также можете использовать альтернативные инструменты, такие как [AWS Lambda](https://ademoverflow.com/en/posts/tutorial-fastapi-aws-lambda-serverless/) или [Google Cloud Run](https://github.com/sekR4/FastAPI-on-Google-Cloud-Run).

### Предварительные требования {#prerequisites}

В этом руководстве предполагается, что вы уже знакомы со следующим:

В этом руководстве предполагается, что вы уже знакомы с:
- [Вебхуками <Constant name="dbt" />](/docs/deploy/webhooks)
- Приложениями командной строки
- Развертыванием кода в бессерверной среде выполнения, такой как fly.io или AWS Lambda

## Клонирование репозитория `dbt-cloud-webhooks-datadog` {#clone-the-dbt-cloud-webhooks-datadog-repo}

[Этот репозиторий](https://github.com/dpguthrie/dbt-cloud-webhooks-datadog) содержит пример кода для проверки вебхука и создания логов в Datadog.

## Установка `flyctl` и регистрация на fly.io {#install-flyctl-and-sign-up-for-flyio}

Следуйте инструкциям для вашей операционной системы в [документации fly.io](https://fly.io/docs/hands-on/install-flyctl/), затем выполните следующие команды в командной строке:

Перейдите в директорию, содержащую клонированный вами репозиторий на шаге 1:

    ```shell
    #пример: замените на ваш фактический путь
    cd ~/Documents/GitHub/dbt-cloud-webhooks-datadog
    ```

Зарегистрируйтесь на fly.io:
    ```shell
    flyctl auth signup
    ```

Ваша консоль должна показать `successfully logged in as YOUR_EMAIL`, когда вы закончите, но если этого не произошло, войдите в fly.io из командной строки:
    ```shell
    flyctl auth login
    ```

## Запуск вашего приложения на fly.io {#launch-your-flyio-app}

Запуск вашего приложения публикует его в интернете и делает готовым к приему событий вебхуков:
    ```shell
    flyctl launch
    ```

1. Вы увидите сообщение о том, что найден существующий файл `fly.toml`. Введите `y`, чтобы скопировать его конфигурацию в ваше новое приложение.

2. Выберите имя приложения по вашему выбору, например, `YOUR_COMPANY-dbt-cloud-webhook-datadog`, или оставьте поле пустым, и имя будет сгенерировано автоматически. Обратите внимание, что имя может содержать только цифры, строчные буквы и дефисы.

3. Выберите регион для развертывания и запомните сгенерированное имя хоста (обычно `APP_NAME.fly.dev`).

4. Когда вас спросят, хотите ли вы настроить базы данных Postgresql или Redis, введите `n` для каждого.

5. Введите `y`, когда вас спросят, хотите ли вы развернуть приложение сейчас.

<details>
<summary>Пример вывода мастера настройки:</summary>
<code>
joel@Joel-Labes dbt-cloud-webhooks-datadog % flyctl launch<br/>
An existing fly.toml file was found for app dbt-cloud-webhooks-datadog<br/>
? Would you like to copy its configuration to the new app? Yes<br/>
Creating app in /Users/joel/Documents/GitHub/dbt-cloud-webhooks-datadog<br/>
Scanning source code<br/>
Detected a Dockerfile app<br/>
? Choose an app name (leave blank to generate one): demo-dbt-cloud-webhook-datadog<br/>
automatically selected personal organization: Joel Labes<br/>
Some regions require a paid plan (fra, maa).<br/>
See https://fly.io/plans to set up a plan.<br/>
? Choose a region for deployment:  [Use arrows to move, type to filter]<br/>
? Choose a region for deployment: Sydney, Australia (syd)<br/>
Created app dbtlabs-dbt-cloud-webhook-datadog in organization personal<br/>
Admin URL: https://fly.io/apps/demo-dbt-cloud-webhook-datadog<br/>
Hostname: demo-dbt-cloud-webhook-datadog.fly.dev<br/>
? Would you like to set up a Postgresql database now? No<br/>
? Would you like to set up an Upstash Redis database now? No<br/>
Wrote config file fly.toml<br/>
? Would you like to deploy now? Yes
</code>
</details>

### 4. Создание API-ключа Datadog {#4-create-a-datadog-api-key}
[Создайте API-ключ для вашего аккаунта Datadog](https://docs.datadoghq.com/account_management/api-app-keys/) и запомните его и ваш сайт Datadog (например, `datadoghq.com`) для дальнейшего использования.

## Настройка нового вебхука в dbt {#configure-a-new-webhook-in-dbt}

1. См. [Создание подписки на вебхук](/docs/deploy/webhooks#create-a-webhook-subscription) для получения полных инструкций. Ваше событие должно быть **Run completed**.
2. Установите URL вебхука на имя хоста, которое вы создали ранее (`APP_NAME.fly.dev`).
3. Запомните секретный ключ вебхука для дальнейшего использования.

*Не тестируйте конечную точку*; она не будет работать, пока вы не сохраните ключи аутентификации (следующий шаг).

## Хранение секретов {#store-secrets}

Для работы приложения необходимо задать четыре секрета со следующими именами:
- `DBT_CLOUD_SERVICE_TOKEN`: <Constant name="dbt" /> [токен персонального доступа](/docs/dbt-apis/user-tokens) или [токен сервисной учётной записи](/docs/dbt-apis/service-tokens) как минимум с разрешением `Metadata Only`.
- `DBT_CLOUD_AUTH_TOKEN`: секретный ключ вебхука <Constant name="dbt" />, созданного ранее.
- `DD_API_KEY`: ключ API, созданный ранее.
- `DD_SITE`: сайт Datadog для вашей организации, например `datadoghq.com`.

Установите эти секреты следующим образом, заменив `abc123` и т.д. на фактические значения:
    ```shell
    flyctl secrets set DBT_CLOUD_SERVICE_TOKEN=abc123 DBT_CLOUD_AUTH_TOKEN=def456 DD_API_KEY=ghi789 DD_SITE=datadoghq.com
    ```

## Развертывание вашего приложения {#deploy-your-app}

После того как вы зададите секреты, fly.io повторно развернёт ваше приложение. Когда развёртывание успешно завершится, вернитесь к настройкам вебхука <Constant name="dbt" /> и нажмите **Test Endpoint**.

</div>
