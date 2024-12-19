---
title: "Microsoft Excel"
id: excel
description: "Интеграция с Excel для запроса ваших метрик в таблице."
tags: [Семантический уровень]
sidebar_label: "Microsoft Excel"
---

Семантический уровень dbt предлагает бесшовную интеграцию с Excel Online и Desktop через пользовательское меню. Этот аддон позволяет вам создавать запросы к семантическому уровню dbt и возвращать данные о ваших метриках непосредственно в Excel.

## Предварительные требования

- Вы [настроили семантический уровень dbt](/docs/use-dbt-semantic-layer/setup-sl) и используете dbt версии 1.6 или выше.
- У вас есть учетная запись Microsoft Excel с доступом для установки аддонов.
- У вас есть [ID окружения dbt Cloud](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) и [токен сервиса](/docs/dbt-cloud-apis/service-tokens) для аутентификации из учетной записи dbt Cloud.
- У вас должна быть учетная запись dbt Cloud Team или Enterprise [аккаунт](https://www.getdbt.com/pricing). Подходит как для многопользовательского, так и для однопользовательского развертывания.
  - Учетные записи с однопользовательским доступом должны связаться со своим представителем для необходимой настройки и активации.

:::tip

📹 Для обучения по запросу видео, изучите курс [Запросы к семантическому уровню с помощью Excel](https://learn.getdbt.com/courses/querying-the-semantic-layer-with-excel), чтобы узнать, как запрашивать метрики с помощью Excel.

:::

## Установка аддона

Интеграция семантического уровня dbt с Microsoft Excel доступна для загрузки непосредственно на [Microsoft AppSource](https://appsource.microsoft.com/en-us/product/office/WA200007100?tab=Overview). Вы можете выбрать загрузку этого аддона как для [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26), так и для [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True).

1. В Excel выполните аутентификацию с вашим хостом, ID окружения dbt Cloud и токеном сервиса.
   - Получите ваш ID окружения, хост и URL в настройках семантического уровня dbt Cloud. Сгенерируйте токен сервиса в настройках семантического уровня или настройках API токенов.
   <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-and-gsheets.jpg" width="70%" title="Получите ваш ID окружения, хост и URL в настройках семантического уровня dbt Cloud. Сгенерируйте токен сервиса в настройках семантического уровня или настройках API токенов." />

2. Начните запрашивать ваши метрики, используя **Конструктор запросов**. Для получения дополнительной информации о функциях меню обратитесь к [функциям конструктора запросов](#query-builder-functions). Чтобы отменить запрос во время выполнения, нажмите кнопку **Отмена**.

import Tools from '/snippets/_sl-excel-gsheets.md';

<Tools 
type="Microsoft Excel"
bullet_1="Существует тайм-аут в 1 минуту для запросов."
bullet_2="Если вы используете это расширение, убедитесь, что вы вошли в Microsoft с тем же профилем Excel, который вы использовали для настройки аддона. Входите с одним профилем за раз, так как использование нескольких профилей одновременно может вызвать проблемы."
queryBuilder="/img/docs/dbt-cloud/semantic-layer/query-builder.png"
/>

## Часто задаваемые вопросы
<FAQ path="Troubleshooting/sl-alpn-error" />