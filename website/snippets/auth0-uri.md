The URI used for SSO connections will vary based on your <Constant name="dbt" /> hosted region. To find the Auth0 URI (also called the **Single sign-on URL**, **Authorization URL**, or **Callback URI**) for your environment:

1. Перейдите в **Account settings** и нажмите **SSO & SCIM** в меню слева.
2. На панели **Single sign-on** нажмите **Get started** (если SSO ещё не настроен) или **Edit** (если он уже настроен).
3. Выберите подходящего поставщика удостоверений (**Identity provider**) в раскрывающемся списке **Provider type**.
4. URI Auth0 отображается в разделе **Identity provider values**. Название поля зависит от выбранного поставщика:

   | Поставщик удостоверений | Название поля | Пример URI |
   |---|---|---|
   | SAML 2.0 | **Single sign-on URL** | `https://YOUR_AUTH0_URI/login/callback` |
   | Okta | **Single sign-on URL** | `https://YOUR_AUTH0_URI/login/callback?connection=ACCOUNT_NAME` |
   | Google Workspace | **Authorized Redirect URI** | `https://YOUR_AUTH0_URI/login/callback` |
   | Microsoft Entra ID | **Callback URI** | `https://YOUR_AUTH0_URI/login/callback` |

   *Замените `YOUR_AUTH0_URI` и `ACCOUNT_NAME` значениями вашей учётной записи.*

<Lightbox src="/img/docs/dbt-platform/access-control/sso-uri.png" width="80%" title="Пример значений поставщика удостоверений для SAML 2.0" />

:::info URI Auth0
URI Auth0 всегда содержит YOUR_AUTH0_URI (например, auth.cloud.getdbt.com), а не URL с префиксом вашей учётной записи (например, ks123.us1.dbt.com). Это связано с тем, что <Constant name="dbt" /> использует Auth0 как централизованный сервис аутентификации для всех регионов и учётных записей. Заменять это значение URL-адресом вашей ячейки (cell) не нужно.
:::

1. Перейдите в **Account settings** и в левом меню нажмите **Single sign-on**.
1. Нажмите **Edit** в панели **Single sign-on**.
1. Выберите подходящий **Identity provider** в выпадающем списке — поля **Login URL slug** и **Identity provider values** заполнятся для выбранного провайдера.

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-uri.png" title="Пример значений identity provider для провайдера SAML 2.0" />
