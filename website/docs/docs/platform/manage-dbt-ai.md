---
title: "Управление функциями ИИ в dbt platform"
sidebar_label: "Управление функциями ИИ"
description: "Задачи администратора по работе с ИИ в dbt platform: включение и отключение доступа аккаунта к функциям ИИ, выбор провайдера ИИ и управление расходами."
availability: platform_login
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardConfigureAiProvider from '/snippets/_wizard-configure-ai-provider.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

<IntroText>
Управляйте функциями ИИ в <Constant name="dbt_platform" />: включайте и отключайте их, выбирайте провайдера ИИ и контролируйте расходы.
</IntroText>

Информация на этой странице в основном предназначена для выполнения задач администратора. Если вы хотите узнать, что делает <Constant name="wizard" /> и где его можно использовать, начните со страницы [О <Constant name="wizard" /> в <Constant name="dbt_platform" />](/docs/platform/wizard-platform).

<WizardTrialBilling/>

## Предварительные требования

- [Аккаунт <Constant name="dbt_platform" />](https://www.getdbt.com/pricing) с тарифным планом Developer, Starter, Enterprise или Enterprise+
  - [Устаревшие тарифные планы Team](/docs/platform/billing/plans-and-billing#legacy-plans) не предоставляют доступ к <Constant name="wizard" />. Рекомендуем перейти на [тарифный план Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing), чтобы использовать его и другие функции.
- Права администратора <Constant name="dbt" /> для изменения настроек аккаунта и настройки провайдеров.
- Среда разработки на поддерживаемом [канале релизов](/docs/dbt-versions/dbt-release-tracks) для регулярного получения обновлений.

## Управление доступом аккаунта к функциям ИИ {#manage-ai-features}

В аккаунтах, которым доступны функции ИИ, включая новые аккаунты, эти функции включены по умолчанию, поэтому большинство пользователей могут открыть <Constant name="wizard" /> без предварительных изменений со стороны администратора. Администраторы, которым необходимо соблюдать требования к управлению и нормативные требования, могут в любой момент отключить или снова включить ИИ, выполнив следующие действия:

1. Перейдите в **Account settings** в меню навигации.
2. В разделе **Settings** убедитесь, что выбран аккаунт, настройки которого вы хотите изменить.
3. Нажмите **Edit** в правом верхнем углу.
4. Выключите переключатель **Enable account access to AI features**, чтобы отключить доступ, или включите его, чтобы предоставить доступ.
5. Нажмите **Save**.

Отключение функций ИИ распространяется на весь аккаунт, включая <Constant name="wizard" /> и dbt Copilot. [dbt Support Assistant](/docs/dbt-support?version=2#ask-dbt-support-assistant) управляется отдельно компанией dbt Labs (за дополнительной информацией обратитесь в [службу поддержки dbt](mailto:support@dbtlabs.com)).

## Поддерживаемые провайдеры ИИ

<WizardSupportedProviders />

dbt Copilot поддерживает более ограниченный набор провайдеров. Список провайдеров и инструкции по настройке приведены на странице [dbt Copilot](/docs/dbt-ai/copilot-overview#configure-ai-provider-for-dbt-copilot).

## Настройка провайдера ИИ {#configure-ai-provider}

<WizardConfigureAiProvider />

Чтобы использовать собственный ключ вместо управляемой инфраструктуры dbt Labs, обратитесь к странице [Настройка BYOK для dbt Wizard в dbt platform](/docs/platform/wizard-byok-platform). BYOK доступен в тарифных планах Starter, Enterprise и Enterprise+.

## Управление расходами

<Constant name="wizard"/> доступен в тарифных планах Developer, Starter, Enterprise и Enterprise+ платформы <Constant name="dbt_platform"/>. Устаревшие тарифные планы Team не предоставляют доступ к <Constant name="wizard"/>, но вы можете [перейти](https://www.getdbt.com/pricing) на Starter или тарифные планы уровня Enterprise, чтобы получить доступ.

Аккаунтам Enterprise и Enterprise+ ежемесячно предоставляются кредиты на использование, а для всех остальных тарифных планов предусмотрен 30-дневный пробный период с кредитами на использование в размере 100 долларов США. Когда кредиты будут исчерпаны или пробный период завершится (в зависимости от того, что произойдёт раньше), установите лимит расходов, чтобы ваша команда могла продолжить работу с минимальными перерывами:

- [Управляйте лимитом расходов](/docs/dbt-ai/pricing-billing/trial-and-billing#manage-your-spend-limit), чтобы ограничить расходы аккаунта на использование ИИ.
- На странице [Модели и цены](/docs/dbt-ai/pricing-billing/overview) указана стоимость использования каждой модели.
- При использовании [BYOK](/docs/platform/wizard-byok-platform) провайдер ИИ выставляет счета напрямую вам, а использование не расходует ваш общий пул кредитов.

## Связанная документация

- [О <Constant name="wizard" /> в <Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [Настройка BYOK в <Constant name="dbt_platform" />](/docs/platform/wizard-byok-platform)
- [Пробный период и оплата](/docs/dbt-ai/pricing-billing/trial-and-billing)
- [Данные и конфиденциальность в <Constant name="dbt_platform" />](/docs/dbt-ai/dbt-ai-faqs#privacy-and-data)
