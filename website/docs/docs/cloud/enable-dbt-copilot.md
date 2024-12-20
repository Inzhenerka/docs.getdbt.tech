---
title: "Включение dbt Copilot"
sidebar_label: "Включение dbt Copilot"
description: "Включите AI-движок dbt Copilot в dbt Cloud, чтобы ускорить разработку."
---

# Включение dbt Copilot <Lifecycle status='beta'/>

На этой странице объясняется, как включить движок dbt Copilot в dbt Cloud, используя возможности AI для ускорения разработки и позволяя сосредоточиться на предоставлении качественных данных.

## Предварительные условия

- Доступно только в dbt Cloud IDE.
- Необходим активный [dbt Cloud Enterprise аккаунт](https://www.getdbt.com/pricing).
- Среда разработки должна находиться на поддерживаемой [версии](/docs/dbt-versions/cloud-release-tracks) для получения обновлений.
- По умолчанию, развертывания dbt Copilot используют центральный ключ API OpenAI, управляемый dbt Labs. В качестве альтернативы, вы можете [предоставить свой собственный ключ API OpenAI](#bringing-your-own-openai-api-key-byok).
- Примите и подпишите юридические соглашения. Свяжитесь с вашей командой аккаунта, чтобы начать этот процесс.

## Включение dbt Copilot

dbt Copilot доступен вашему аккаунту только после того, как ваша организация подпишет необходимые юридические документы. По умолчанию он отключен. Администратор dbt Cloud может включить его, следуя этим шагам:

1. Перейдите в **Настройки аккаунта** в меню навигации.

2. В разделе **Настройки** подтвердите аккаунт, который вы включаете.

3. Нажмите **Редактировать** в правом верхнем углу.

4. Включите опцию **Включить доступ аккаунта к функциям на базе AI**.

5. Нажмите **Сохранить**. Теперь у вас должен быть включен AI-движок dbt Copilot для использования.

Примечание: Чтобы отключить (только после включения), повторите шаги с 1 по 3, отключите на шаге 4 и повторите шаг 5.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="90%" title="Пример опции 'Включить доступ аккаунта к функциям на базе AI' в настройках аккаунта" />

## Использование собственного ключа API OpenAI (BYOK)

После включения AI-функций вы можете предоставить ключ API OpenAI вашей организации. dbt Cloud будет использовать ваш аккаунт OpenAI и условия для работы dbt Copilot. Это приведет к выставлению счетов вашей организации от OpenAI за запросы, сделанные dbt Copilot.

Настройте ключи AI, используя:
- [Ключ API OpenAI, управляемый dbt Labs](/docs/cloud/account-integrations?ai-integration=dbtlabs#ai-integrations)
- Ваш собственный [ключ API OpenAI](/docs/cloud/account-integrations?ai-integration=openai#ai-integrations)
- [Azure OpenAI](/docs/cloud/account-integrations?ai-integration=azure#ai-integrations) <Lifecycle status="beta" />

Для получения деталей конфигурации смотрите [Интеграции аккаунта](/docs/cloud/account-integrations#ai-integrations).