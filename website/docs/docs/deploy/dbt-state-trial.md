---
title: "Пробный период и оплата dbt State"
sidebar_label: "Пробный период и оплата"
description: "Узнайте о пробном периоде и оплате dbt State."
id: "dbt-state-trial"
tags: ['dbt State']
availability: everywhere_usage
---

import DbtStatePricing from '/snippets/_dbt-state-pricing.md';
import DbtStateTrialHowItWorks from '/snippets/_dbt-state-trial-how-it-works.md';
import DbtStateFreePlan from '/snippets/_dbt-state-free-plan.md';

# Пробный период и оплата dbt State

<IntroText>

Начните пробный период dbt State, продолжайте работу в пределах бесплатного ежемесячного лимита DATT вашего тарифного плана или управляйте платным доступом на панели **Billing & Usage** в <Constant name="dbt_platform" />.

</IntroText>

## Как работает пробный период

<DbtStateTrialHowItWorks />


## Как работает оплата

<DbtStatePricing />

## Бесплатный ежемесячный лимит DATT {#free-monthly-datt-allowance}

<DbtStateFreePlan />

## Настройка оплаты по мере использования {#setting-up-usage-based-billing}

Стоимость dbt State зависит от объема использования: плата взимается за каждую целевую таблицу, которую dbt State повторно использует в течение дня, а _не_ за каждое пользовательское место в <Constant name="dbt_platform" />.

Вы можете настроить оплату во время пробного периода или в любое время после его окончания. Следуйте инструкциям для вашего типа аккаунта:

#### Управляемые аккаунты

Если в договоре для вашего аккаунта предусмотрена оплата потребления, перейдите на вкладку **State** на странице **Usage-based features** и нажмите **Allow**, чтобы списывать плату в счет суммы, предусмотренной договором. В противном случае [свяжитесь с отделом продаж dbt Labs](https://www.getdbt.com/contact).

#### Аккаунты Self-hosted и Developer

1. Перейдите в **Billing & Usage** > **Usage-based features**.
2. Нажмите **Set up billing** (если пробный период еще действует) или **Add billing info** (если пробный период завершился).
3. В разделе **Add a payment method** введите данные карты и платежный адрес.
4. Нажмите **Save card**.
5. На вкладке **State** отобразится добавленная карта. Нажмите **Confirm and activate**.

После настройки оплаты вы также можете [настроить оповещение о расходах](#setting-spend-alerts), чтобы получать уведомления, когда ваши ежемесячные расходы достигают порогового значения.

## Настройка оповещений о расходах {#setting-spend-alerts}

Вы можете настроить оповещение о расходах, чтобы получать уведомления, когда ваши ежемесячные расходы на dbt State достигают заданного порогового значения.

1. В своем аккаунте <Constant name="dbt_platform" /> нажмите название аккаунта в левом нижнем углу над именем пользователя и выберите **Account settings**.
2. Перейдите в **Billing & Usage** > **Usage-based features**.
3. В разделе **Spend alert** нажмите **Set a spend alert**.
4. Включите переключатель, чтобы получать уведомления по электронной почте, когда ежемесячные расходы достигают заданного порогового значения.
5. В поле **Alert threshold** введите сумму в долларах США, при достижении которой будет отправлено оповещение.
6. Нажмите **Save**.


## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
- [Использование и стоимость dbt State](/docs/platform/billing/dbt-state-usage)
