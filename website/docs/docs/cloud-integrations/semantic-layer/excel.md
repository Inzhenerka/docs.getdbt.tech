---
title: "Microsoft Excel"
id: excel
description: "Интеграция с Excel для выполнения запросов к вашим метрикам в электронной таблице."
tags: [Semantic Layer]
sidebar_label: "Microsoft Excel"
---

# Microsoft Excel <Lifecycle status="self_service,managed,managed_plus" /> {#microsoft-excel}

<Constant name="semantic_layer" /> предоставляет бесшовную интеграцию с Excel Online и Excel Desktop через пользовательское меню. Это дополнение позволяет создавать запросы к <Constant name="semantic_layer" /> и получать данные по вашим метрикам напрямую в Excel.

## Предварительные требования {#prerequisites}

- У вас [настроен <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl), и вы используете dbt версии 1.6 или выше.
- Вам нужна учетная запись Microsoft Excel с возможностью устанавливать надстройки.
- У вас есть [Environment ID в <Constant name="cloud" />](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).
- У вас есть [service token](/docs/dbt-cloud-apis/service-tokens) или [personal access token](/docs/dbt-cloud-apis/user-tokens) для аутентификации в учетной записи <Constant name="cloud" />.
- У вас должна быть учетная запись <Constant name="cloud" /> уровня Starter, Enterprise или Enterprise+ [account](https://www.getdbt.com/pricing). Подходит как для Multi-tenant, так и для Single-tenant развертывания.

:::tip

📹 Для обучения в удобное время посмотрите курс [Querying the <Constant name="semantic_layer" /> with Excel](https://learn.getdbt.com/courses/querying-the-semantic-layer-with-excel), чтобы узнать, как выполнять запросы к метрикам с помощью Excel.

:::

## Установка аддона {#installing-the-add-on}

Интеграцию Microsoft Excel для <Constant name="semantic_layer" /> можно скачать напрямую из [Microsoft AppSource](https://appsource.microsoft.com/en-us/product/office/WA200007100?tab=Overview). Вы можете установить это дополнение как для [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26), так и для [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True).

1. В Excel выполните аутентификацию, указав ваш Host, <Constant name="cloud" /> Environment ID и service token.
   - Найти Environment ID, Host и URL‑адреса можно в настройках <Constant name="semantic_layer" />. Service token можно сгенерировать в настройках <Constant name="semantic_layer" /> или в разделе **API tokens**. В качестве альтернативы вы также можете создать персональный токен доступа, перейдя в **API tokens** > **Personal tokens**.  
   <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-and-gheets.png" width="70%" title="Access your Environment ID, Host, and URLs in your dbt Semantic Layer settings. Generate a service token in the Semantic Layer settings or API tokens settings" />

2. Начните выполнять запросы к вашим метрикам, используя **Конструктор запросов**. Для получения дополнительной информации о функциях меню обратитесь к [функциям Конструктора запросов](#query-builder-functions). Чтобы отменить выполнение запроса, нажмите кнопку **Отмена**.

import Tools from '/snippets/_sl-excel-gsheets.md';

<Tools 
type="Microsoft Excel"
bullet_1="Результаты, загрузка которых в Excel занимает более одной минуты, завершатся с ошибкой. Это ограничение относится только к процессу загрузки, а не ко времени, которое требуется платформе данных для выполнения запроса."
bullet_2="Если вы используете это расширение, убедитесь, что вы вошли в Microsoft под тем же профилем Excel, который использовали при настройке надстройки. Входите только под одним профилем одновременно, так как одновременное использование нескольких профилей может привести к проблемам."
bullet_3="Обратите внимание, что в настоящее время доступны только стандартные уровни детализации времени; пользовательские временные гранулярности пока не поддерживаются для этой интеграции."
queryBuilder="/img/docs/dbt-cloud/semantic-layer/query-builder.png"
/>

## Часто задаваемые вопросы {#faqs}
<FAQ path="Troubleshooting/sl-alpn-error" />
