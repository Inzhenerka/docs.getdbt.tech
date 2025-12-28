---
title: "Включение dbt Copilot"
sidebar_label: "Включение dbt Copilot"
description: "Включение dbt Copilot — AI‑ассистента в dbt, который ускоряет разработку."
---

# Включение dbt Copilot <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>
Включите <Constant name="copilot" />, AI‑ассистента, в <Constant name="cloud" />, чтобы ускорить разработку и сосредоточиться на создании качественных данных.
</IntroText>

На этой странице объясняется, как включить <Constant name="copilot" /> в <Constant name="cloud" />, чтобы ускорить разработку и дать вам возможность сосредоточиться на предоставлении качественных данных.

## Предварительные условия

- Доступно только в <Constant name="dbt_platform" />.
- Необходимо иметь аккаунт [<Constant name="cloud" /> Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing).
  - Некоторые функции, такие как [BYOK](#bringing-your-own-openai-api-key-byok), [natural prompts in Canvas](/docs/cloud/build-canvas-copilot) и другие, доступны только на тарифах Enterprise и Enterprise+.
- Среда разработки должна находиться на поддерживаемом [release track](/docs/dbt-versions/cloud-release-tracks), чтобы получать регулярные обновления.
- По умолчанию деплойменты <Constant name="copilot" /> используют централизованный OpenAI API key, управляемый dbt Labs. В качестве альтернативы вы можете [указать собственный OpenAI API key](#bringing-your-own-openai-api-key-byok).
  - При использовании [BYOK](#bringing-your-own-openai-api-key-byok) убедитесь, что включены последние модели генерации текста, а также модель `text-embedding-3-small`.
- Включите AI‑функции, следуя шагам в следующем разделе в **Account settings**.

## Включение dbt Copilot

Чтобы подключить <Constant name="copilot" />, администратор <Constant name="cloud" /> может выполнить следующие шаги:

1. Перейдите в **Account settings** в навигационном меню.
2. В разделе **Settings** убедитесь, что выбрана учетная запись, для которой вы включаете функцию.
3. Нажмите **Edit** в правом верхнем углу.
4. Включите опцию **Enable account access to dbt Copilot features**.
5. Нажмите **Save**. После этого <Constant name="copilot" /> AI будет включен и готов к использованию.

Примечание: Чтобы отключить (только после включения), повторите шаги с 1 по 3, отключите на шаге 4 и повторите шаг 5.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="90%" title="Пример опции «Enable account access to dbt Copilot features» в настройках аккаунта" />

## Использование собственного OpenAI API key (BYOK) <Lifecycle status="managed_plus,managed" /> 

После включения AI‑функций вы можете указать OpenAI API key вашей организации. В этом случае <Constant name="cloud" /> будет использовать ваш аккаунт OpenAI и соответствующие условия для работы <Constant name="copilot" />. Это приведёт к начислению платежей вашей организации со стороны OpenAI за запросы, выполняемые <Constant name="copilot" />.

Настроить AI‑ключи можно с использованием:
- OpenAI API key, управляемого dbt Labs
- собственного OpenAI API key
- Azure OpenAI

## AI‑интеграции

После того как AI‑функции были [включены](/docs/cloud/enable-dbt-copilot#enable-dbt-copilot), вы можете использовать AI‑интеграцию от dbt Labs или подключить собственного провайдера для поддержки AI‑возможностей <Constant name="cloud" />, таких как [<Constant name="copilot" />](/docs/cloud/dbt-copilot) и [Ask dbt](/docs/cloud-integrations/snowflake-native-app).

<Constant name="cloud" /> поддерживает AI‑интеграции с использованием OpenAI key, управляемых dbt Labs, самостоятельно управляемых OpenAI key или самостоятельно управляемых Azure OpenAI key.

Обратите внимание: при использовании собственного провайдера все API‑вызовы и связанные с ними расходы за функции, используемые в <Constant name="cloud" />, оплачиваются вами. Возможность подключения собственного провайдера доступна для тарифных планов Enterprise и Enterprise+.

Чтобы настроить AI‑интеграцию в вашем аккаунте <Constant name="cloud" />, администратор <Constant name="cloud" /> может выполнить следующие шаги:
1. Перейдите в **Account settings** в боковом меню.
2. Выберите **Integrations** и прокрутите страницу до раздела **AI**.
3. Нажмите на иконку **Pencil** справа от **OpenAI**, чтобы настроить AI‑интеграцию.
   <Lightbox src="/img/docs/dbt-cloud/account-integration-ai.png" width="85%" title="Пример страницы AI‑интеграции" />
4. Настройте AI‑интеграцию, выбрав **dbt Labs OpenAI**, **OpenAI** или **Azure OpenAI**.

  <Tabs queryString="ai-integration"> 
  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Включите переключатель **dbt Labs**, чтобы использовать OpenAI key, управляемый dbt Labs.
  2. Нажмите **Save**.

  <Lightbox src="/img/docs/dbt-cloud/account-integration-dbtlabs.png" width="85%" title="Пример страницы интеграции dbt Labs" />
  </TabItem>

  <TabItem value="openai" label="OpenAI">
  Использование собственного OpenAI key доступно для тарифных планов Enterprise и Enterprise+.

  1. Включите переключатель **OpenAI**, чтобы использовать собственный OpenAI key.
  2. Введите API key.
  3. Нажмите **Save**.
    <Lightbox src="/img/docs/dbt-cloud/account-integration-openai.png" width="85%" title="Пример страницы интеграции OpenAI" />

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI">
  Использование собственного Azure OpenAI key доступно для тарифных планов Enterprise и Enterprise+.

  Чтобы узнать больше о развёртывании собственной модели OpenAI в Azure, см. [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai). Настроить учётные данные для вашего развёртывания Azure OpenAI в <Constant name="cloud" /> можно двумя способами:
    - [С использованием Target URI](#from-a-target-uri)
    - [Путём ручного ввода учётных данных](#manually-providing-the-credentials)

  #### From a Target URI

  1. Найдите URI вашего развёртывания Azure OpenAI на странице сведений о развёртывании в Azure.
  2. В разделе **Azure OpenAI** в <Constant name="cloud" /> выберите вкладку **From Target URI**.
  3. Вставьте URI в поле **Target URI**.
  4. Введите ваш Azure OpenAI API key.
  5. Убедитесь, что значения **Endpoint**, **API Version** и **Deployment Name** указаны корректно.
  6. Нажмите **Save**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-target.png" width="85%" title="Пример раздела интеграции Azure OpenAI" />

  #### Manually providing the credentials

  1. Найдите конфигурацию Azure OpenAI на странице сведений о развёртывании в Azure.
  2. В разделе **Azure OpenAI** в <Constant name="cloud" /> выберите вкладку **Manual Input**.
  2. Введите ваш Azure OpenAI API key.
  3. Укажите **Endpoint**, **API Version** и **Deployment Name**.
  4. Нажмите **Save**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-manual.png" width="85%" title="Пример раздела интеграции Azure OpenAI" />

  </TabItem>
  </Tabs>
