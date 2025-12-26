URI, используемый для SSO-подключений на многопользовательских экземплярах dbt Cloud, будет различаться в зависимости от региона, в котором размещен ваш dbt Cloud. Чтобы найти URI для вашей среды в dbt Cloud:

URI, используемый для SSO‑подключений в мультиарендных инстансах <Constant name="cloud" />, зависит от региона хостинга вашего <Constant name="cloud" />. Чтобы найти URI для вашей среды в <Constant name="cloud" />:

1. Перейдите в **Account settings** и в левом меню нажмите **Single sign-on**.
1. В панели **Single sign-on** нажмите **Edit**.
1. Выберите подходящий **Identity provider** из выпадающего списка — после этого для данного провайдера автоматически заполнятся поля **Login URL slug** и **Identity provider values**.

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-uri.png" title="Пример значений провайдера идентификации для провайдера SAML 2.0" />

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-uri.png" title="Пример значений поставщика удостоверений для провайдера SAML 2.0" />