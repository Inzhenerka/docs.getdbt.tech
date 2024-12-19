---
title: "Интеграции аккаунта в dbt Cloud"
sidebar_label: "Интеграции аккаунта" 
description: "Узнайте, как настроить интеграции аккаунта для вашего аккаунта dbt Cloud."
---

В следующих разделах описаны различные **интеграции аккаунта**, доступные в вашем аккаунте dbt Cloud в разделе **Настройки**.

<Lightbox src="/img/docs/dbt-cloud/account-integrations.jpg" title="Пример интеграций аккаунта из бокового меню" /> 

## Интеграции Git

Подключите свой аккаунт dbt Cloud к вашему Git-провайдеру, чтобы пользователи dbt Cloud могли аутентифицировать ваши личные аккаунты. dbt Cloud будет выполнять действия Git от вашего имени в репозиториях, к которым у вас есть доступ в соответствии с разрешениями вашего Git-провайдера.

Чтобы настроить интеграцию с Git:
1. Перейдите в **Настройки аккаунта** в боковом меню.
2. В разделе **Настройки** нажмите на **Интеграции**.
3. Выберите Git-провайдер из списка и нажмите на иконку **Карандаш** справа от провайдера.
4. dbt Cloud [нативно подключается](/docs/cloud/git/git-configuration-in-dbt-cloud) к следующим Git-провайдерам:

   - [GitHub](/docs/cloud/git/connect-github)
   - [GitLab](/docs/cloud/git/connect-gitlab)
   - [Azure DevOps](/docs/cloud/git/connect-azure-devops) <Lifecycle status="enterprise" />

Вы можете подключить свой аккаунт dbt Cloud к дополнительным Git-провайдерам, импортировав git-репозиторий из любого действительного git URL. Смотрите [Импорт git-репозитория](/docs/cloud/git/import-a-project-by-git-url) для получения дополнительной информации.

<Lightbox src="/img/docs/dbt-cloud/account-integration-git.jpg" width="85%" title="Пример страницы интеграции Git" />

## Интеграции OAuth

Подключите свой аккаунт dbt Cloud к провайдеру OAuth, который интегрирован с dbt Cloud.

Чтобы настроить интеграцию с OAuth:
1. Перейдите в **Настройки аккаунта** в боковом меню.
2. В разделе **Настройки** нажмите на **Интеграции**.
3. В разделе **OAuth** нажмите на **Связать**, чтобы подключить свой аккаунт Slack.
4. Для пользовательских провайдеров OAuth в разделе **Пользовательские интеграции OAuth** нажмите на **Добавить интеграцию** и выберите провайдера OAuth из списка. Заполните обязательные поля и нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-cloud/account-integration-oauth.jpg" width="85%" title="Пример страницы интеграции OAuth" />

## Интеграции AI

После того как функции AI были [включены](/docs/cloud/enable-dbt-copilot#enable-dbt-copilot), вы можете использовать интеграцию AI от dbt Labs или подключить своего провайдера для поддержки функций dbt Cloud с использованием AI, таких как [dbt Copilot](/docs/cloud/dbt-copilot) и [Ask dbt](/docs/cloud-integrations/snowflake-native-app) (обе доступны в [планах dbt Cloud Enterprise](https://www.getdbt.com/pricing)).

dbt Cloud поддерживает интеграции AI для управляемых ключей OpenAI от dbt Labs, самоуправляемых ключей OpenAI или самоуправляемых ключей Azure OpenAI <Lifecycle status="beta" />.

Обратите внимание, что если вы подключаете своего провайдера, вы понесете расходы на API-вызовы и связанные с ними сборы за функции, используемые в dbt Cloud.

:::info
AI dbt Cloud оптимизирован для gpt-4o от OpenAI. Использование других моделей может повлиять на производительность и точность, и функциональность с другими моделями не гарантируется.
:::

Чтобы настроить интеграцию AI в вашем аккаунте dbt Cloud, администратор dbt Cloud может выполнить следующие шаги:
1. Перейдите в **Настройки аккаунта** в боковом меню.
2. Выберите **Интеграции** и прокрутите до раздела **AI**.
3. Нажмите на иконку **Карандаш** справа от **OpenAI**, чтобы настроить интеграцию AI.
   <Lightbox src="/img/docs/dbt-cloud/account-integration-ai.jpg" width="85%" title="Пример страницы интеграции AI" />
4. Настройте интеграцию AI для **dbt Labs OpenAI**, **OpenAI** или **Azure OpenAI**.

  <Tabs queryString="ai-integration"> 
  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Выберите переключатель для **dbt Labs**, чтобы использовать управляемый ключ OpenAI от dbt Labs.
  2. Нажмите **Сохранить**.

  <Lightbox src="/img/docs/dbt-cloud/account-integration-dbtlabs.jpg" width="85%" title="Пример страницы интеграции dbt Labs" />
  </TabItem>

  <TabItem value="openai" label="OpenAI">

  1. Выберите переключатель для **OpenAI**, чтобы использовать свой собственный ключ OpenAI.
  2. Введите API-ключ.
  3. Нажмите **Сохранить**.
    <Lightbox src="/img/docs/dbt-cloud/account-integration-openai.jpg" width="85%" title="Пример страницы интеграции OpenAI" />

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI (beta)">
  Чтобы узнать о развертывании своей модели OpenAI на Azure, смотрите [Развертывание моделей на Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai). Настройте учетные данные для вашего развертывания Azure OpenAI в dbt Cloud следующими двумя способами:
    - [Из целевого URI](#from-a-target-uri)
    - [Вручную предоставив учетные данные](#manually-providing-the-credentials)

  #### Из целевого URI

  1. Найдите URI вашего развертывания Azure OpenAI на странице деталей развертывания Azure.
  2. В разделе **Azure OpenAI** в dbt Cloud выберите вкладку **Из целевого URI**.
  3. Вставьте URI в поле **Целевой URI**.
  4. Введите свой API-ключ Azure OpenAI.
  5. Убедитесь, что **Конечная точка**, **Версия API** и **Имя развертывания** указаны правильно.
  6. Нажмите **Сохранить**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-target.jpg" width="85%" title="Пример раздела интеграции Azure OpenAI" />

  #### Вручную предоставив учетные данные

  1. Найдите свою конфигурацию Azure OpenAI на странице деталей развертывания Azure.
  2. В разделе **Azure OpenAI** в dbt Cloud выберите вкладку **Ручной ввод**.
  2. Введите свой API-ключ Azure OpenAI.
  3. Введите **Конечную точку**, **Версию API** и **Имя развертывания**.
  4. Нажмите **Сохранить**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-manual.jpg" width="85%" title="Пример раздела интеграции Azure OpenAI" />

  </TabItem>
  </Tabs>