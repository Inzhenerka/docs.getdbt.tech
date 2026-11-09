:::success Вход в систему

Пользователи могут войти в систему по адресу [https://login.dbt.com](https://login.dbt.com), чтобы просмотреть аккаунты, к которым у них есть доступ в разных экземплярах, и выбрать, где открыть <Constant name="dbt_platform" />. Это рекомендуемая точка входа для большинства пользователей.

Для единого входа (SSO) через вашего поставщика удостоверений также можно использовать следующий формат URL со слагом URL входа в ваш аккаунт. Замените `LOGIN_SLUG` значением из предыдущих шагов, а `YOUR_ACCESS_URL` — [соответствующим URL доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана:

`https://YOUR_ACCESS_URL/enterprise-login/LOGIN-SLUG`

Администраторы аккаунта могут включать и отключать обнаружение аккаунта с помощью параметра **Enable global account discovery** в разделе [настроек аккаунта](/docs/platform/account-settings#enable-global-account-discovery).

:::
