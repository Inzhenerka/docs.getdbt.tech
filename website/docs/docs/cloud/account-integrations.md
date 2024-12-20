---
title: "Интеграции аккаунта в dbt Cloud"
sidebar_label: "Интеграции аккаунта"
description: "Узнайте, как настроить интеграции аккаунта для вашего аккаунта dbt Cloud."
---

Следующие разделы описывают различные **Интеграции аккаунта**, доступные в вашем аккаунте dbt Cloud в разделе **Настройки** аккаунта.

<Lightbox src="/img/docs/dbt-cloud/account-integrations.jpg" title="Пример интеграций аккаунта из бокового меню" />

## Интеграции с Git

Подключите ваш аккаунт dbt Cloud к вашему провайдеру Git, чтобы пользователи dbt Cloud могли аутентифицировать ваши личные аккаунты. dbt Cloud будет выполнять действия с Git от вашего имени в репозиториях, к которым у вас есть доступ в соответствии с разрешениями вашего провайдера Git.

Чтобы настроить интеграцию с аккаунтом Git:
1. Перейдите в **Настройки аккаунта** в боковом меню.
2. В разделе **Настройки** нажмите на **Интеграции**.
3. Нажмите на провайдера Git из списка и выберите значок **Карандаш** справа от провайдера.
4. dbt Cloud [подключается нативно](/docs/cloud/git/git-configuration-in-dbt-cloud) к следующим провайдерам Git:

   - [GitHub](/docs/cloud/git/connect-github)
   - [GitLab](/docs/cloud/git/connect-gitlab)
   - [Azure DevOps](/docs/cloud/git/connect-azure-devops) <Lifecycle status="enterprise" />

Вы можете подключить ваш аккаунт dbt Cloud к дополнительным провайдерам Git, импортировав git-репозиторий из любого действительного git URL. Обратитесь к [Импортировать git-репозиторий](/docs/cloud/git/import-a-project-by-git-url) для получения дополнительной информации.

<Lightbox src="/img/docs/dbt-cloud/account-integration-git.jpg" width="85%" title="Пример страницы интеграции с Git" />

## Интеграции с OAuth

Подключите ваш аккаунт dbt Cloud к провайдеру OAuth, который интегрирован с dbt Cloud.

Чтобы настроить интеграцию с аккаунтом OAuth:
1. Перейдите в **Настройки аккаунта** в боковом меню.
2. В разделе **Настройки** нажмите на **Интеграции**.
3. В разделе **OAuth** нажмите на **Связать**, чтобы подключить ваш аккаунт Slack.
4. Для пользовательских провайдеров OAuth в разделе **Пользовательские интеграции OAuth** нажмите на **Добавить интеграцию** и выберите провайдера OAuth из списка. Заполните необходимые поля и нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-cloud/account-integration-oauth.jpg" width="85%" title="Пример страницы интеграции с OAuth" />

## Интеграции с AI

После того как функции AI были [включены](/docs/cloud/enable-dbt-copilot#enable-dbt-copilot), вы можете использовать интеграцию AI от dbt Labs или собственного провайдера для поддержки функций dbt Cloud с использованием AI, таких как [dbt Copilot](/docs/cloud/dbt-copilot) и [Ask dbt](/docs/cloud-integrations/snowflake-native-app) (обе доступны в [планах dbt Cloud Enterprise](https://www.getdbt.com/pricing)).

dbt Cloud поддерживает интеграции AI для ключей OpenAI, управляемых dbt Labs, ключей OpenAI, управляемых самостоятельно, или ключей Azure OpenAI, управляемых самостоятельно <Lifecycle status="beta" />.

Обратите внимание, если вы используете собственного провайдера, вы понесете расходы на API-вызовы и связанные с ними сборы за используемые функции в dbt Cloud.

:::info
AI в dbt Cloud оптимизирован для OpenAIs gpt-4o. Использование других моделей может повлиять на производительность и точность, и функциональность с другими моделями не гарантируется.
:::

Чтобы настроить интеграцию AI в вашем аккаунте dbt Cloud, администратор dbt Cloud может выполнить следующие шаги:
1. Перейдите в **Настройки аккаунта** в боковом меню.
2. Выберите **Интеграции** и прокрутите до раздела **AI**.
3. Нажмите на значок **Карандаш** справа от **OpenAI**, чтобы настроить интеграцию AI.
   <Lightbox src="/img/docs/dbt-cloud/account-integration-ai.jpg" width="85%" title="Пример страницы интеграции AI" />
4. Настройте интеграцию AI для **dbt Labs OpenAI**, **OpenAI** или **Azure OpenAI**.

  <Tabs queryString="ai-integration"> 
  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Выберите переключатель для **dbt Labs**, чтобы использовать управляемый dbt Labs ключ OpenAI.
  2. Нажмите **Сохранить**.

  <Lightbox src="/img/docs/dbt-cloud/account-integration-dbtlabs.jpg" width="85%" title="Пример страницы интеграции dbt Labs" />
  </TabItem>

  <TabItem value="openai" label="OpenAI">

  1. Выберите переключатель для **OpenAI**, чтобы использовать ваш собственный ключ OpenAI.
  2. Введите API-ключ.
  3. Нажмите **Сохранить**.
    <Lightbox src="/img/docs/dbt-cloud/account-integration-openai.jpg" width="85%" title="Пример страницы интеграции OpenAI" />

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI (beta)">
  Чтобы узнать о развертывании вашей собственной модели OpenAI на Azure, обратитесь к [Развертывание моделей на Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai). Настройте учетные данные для вашего развертывания Azure OpenAI в dbt Cloud двумя способами:
    - [Из целевого URI](#from-a-target-uri)
    - [Вручную предоставляя учетные данные](#manually-providing-the-credentials)

  #### Из целевого URI

  1. Найдите ваш URI развертывания Azure OpenAI на странице деталей развертывания Azure.
  2. В разделе dbt Cloud **Azure OpenAI** выберите вкладку **Из целевого URI**.
  3. Вставьте URI в поле **Целевой URI**.
  4. Введите ваш API-ключ Azure OpenAI.
  5. Убедитесь, что **Endpoint**, **Версия API** и **Имя развертывания** указаны правильно.
  6. Нажмите **Сохранить**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-target.jpg" width="85%" title="Пример раздела интеграции Azure OpenAI" />

  #### Вручную предоставляя учетные данные

  1. Найдите вашу конфигурацию Azure OpenAI на странице деталей развертывания Azure.
  2. В разделе dbt Cloud **Azure OpenAI** выберите вкладку **Ввод вручную**.
  2. Введите ваш API-ключ Azure OpenAI.
  3. Введите **Endpoint**, **Версию API** и **Имя развертывания**.
  4. Нажмите **Сохранить**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-manual.jpg" width="85%" title="Пример раздела интеграции Azure OpenAI" />

  </TabItem>
  </Tabs>