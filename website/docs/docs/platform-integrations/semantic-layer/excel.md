---
title: "Microsoft Excel"
id: excel
description: "Интеграция с Excel для выполнения запросов к вашим метрикам в электронной таблице."
tags: [Semantic Layer]
sidebar_label: "Microsoft Excel"
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

# Microsoft Excel

<Constant name="semantic_layer" /> предоставляет бесшовную интеграцию с Excel Online и Excel Desktop через пользовательское меню. Это дополнение позволяет создавать запросы к <Constant name="semantic_layer" /> и получать данные по вашим метрикам напрямую в Excel.

## Предварительные требования {#prerequisites}

- Вы [настроили <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) и используете dbt версии 1.6 или выше.
- Вам нужна учетная запись Microsoft Excel с разрешением на установку надстроек.
- У вас есть [идентификатор среды <Constant name="dbt" />](/docs/use-dbt-semantic-layer/setup-sl#administer-the-semantic-layer-1).
- У вас есть [служебный токен](/docs/dbt-apis/service-tokens) или [персональный токен доступа](/docs/dbt-apis/user-tokens) для аутентификации с использованием учетной записи <Constant name="dbt" />.
- У вас должна быть [учетная запись](https://www.getdbt.com/pricing) <Constant name="dbt" /> с тарифным планом Starter, Enterprise или Enterprise+. Подходит как для многопользовательского (Multi-tenant), так и для однопользовательского (Single-tenant) развертывания.

:::tip

📹 Для обучения в удобное время посмотрите курс [Querying the <Constant name="semantic_layer" /> with Excel](https://learn.getdbt.com/courses/querying-the-semantic-layer-with-excel), чтобы узнать, как выполнять запросы к метрикам с помощью Excel.

:::

## Установка аддона {#installing-the-add-on}

Интеграцию Microsoft Excel для <Constant name="semantic_layer" /> можно скачать напрямую из [Microsoft AppSource](https://appsource.microsoft.com/en-us/product/office/WA200007100?tab=Overview). Вы можете установить это дополнение как для [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26), так и для [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True).

1. В Excel выполните аутентификацию, используя Host, ID окружения <Constant name="dbt" /> и служебный токен.
   - Найдите ID окружения, Host и URL-адреса в настройках <Constant name="semantic_layer" />. Создайте служебный токен в настройках <Constant name="semantic_layer" /> или в разделе **API tokens**. Также можно создать персональный токен доступа, перейдя в **API tokens** > **Personal tokens**. 
   <Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-and-gsheets.png" width="70%" title="Найдите ID окружения, Host и URL-адреса в настройках dbt Semantic Layer. Создайте служебный токен в настройках Semantic Layer или API tokens" />

2. Начните выполнять запросы к вашим метрикам, используя **Конструктор запросов**. Для получения дополнительной информации о функциях меню обратитесь к [функциям Конструктора запросов](#query-builder-functions). Чтобы отменить выполнение запроса, нажмите кнопку **Отмена**.

import Tools from '/snippets/_sl-excel-gsheets.md';

<Tools 
type="Microsoft Excel"
bullet_1="Результаты, загрузка которых в Excel занимает больше одной минуты, не будут загружены. Это ограничение распространяется только на процесс загрузки, а не на время выполнения запроса на платформе данных."
bullet_2="Если вы используете это расширение, убедитесь, что вы вошли в Microsoft с тем же профилем Excel, который использовали для настройки надстройки. Используйте только один профиль за раз, поскольку одновременное использование нескольких профилей может вызвать проблемы."
bullet_3="Обратите внимание: в настоящее время доступны только стандартные уровни детализации по времени. Пользовательские уровни детализации по времени в этой интеграции пока не поддерживаются."
queryBuilder="/img/docs/dbt-platform/semantic-layer/query-builder.png"
/>

## Часто задаваемые вопросы {#faqs}
<FAQ path="Troubleshooting/sl-alpn-error" />
