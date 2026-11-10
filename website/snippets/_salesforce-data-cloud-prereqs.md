## Предварительные требования {#prerequisites}

Для подключения dbt к Salesforce Data 360 вам потребуется следующее:

- Экземпляр Data 360.
- Файл закрытого ключа `server.key`. Дополнительные сведения см. в разделе [Создание закрытого ключа и сертификата](#generating-a-private-key-and-certificate).
- Внешнее клиентское приложение, настроенное для потока аутентификации JSON Web Token (JWT) Bearer. Дополнительные сведения см. в разделе [Настройка внешнего клиентского приложения](#setting-up-the-external-client-app).
- Разрешения `Data Cloud Architect` и `Data Cloud User`.

### Создание закрытого ключа и сертификата {#generating-a-private-key-and-certificate}

Прежде чем создавать внешнее клиентское приложение, создайте закрытый ключ (`server.key`) и самоподписанный сертификат (`server.crt`) в Salesforce. Salesforce использует сертификат для проверки токена JWT Bearer, отправляемого dbt. Инструкции см. в разделе [Создание закрытого ключа и самоподписанного цифрового сертификата](https://developer.salesforce.com/docs/atlas.en-us.252.0.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm).

:::note
Рекомендуется создавать эти учётные данные под **служебной учётной записью**, а не под личной учётной записью пользователя, чтобы упростить управление учётными данными.
:::

<a id="setting-up-the-external-client-app"></a>

### Создание внешнего клиентского приложения {#creating-the-external-client-app}

Для аутентификации dbt с использованием потока JWT Bearer необходимо создать и настроить внешнее клиентское приложение в Salesforce Data 360.

Следуйте инструкциям в разделе [Создание локального внешнего клиентского приложения](https://help.salesforce.com/s/articleView?id=xcloud.create_a_local_external_client_app.htm&type=5), чтобы создать внешнее клиентское приложение. На шаге 6 обязательно выберите **Packaged**.

Затем настройте параметры OAuth для приложения:

1. В разделе **API (Enable OAuth Settings)** выберите **Enable OAuth**.
2. Установите для **Callback URL** значение `https://login.salesforce.com/services/oauth2/callback`.
3. В разделе **OAuth Scopes** добавьте в список **Selected OAuth Scopes** следующие области доступа:
   - `api` — для управления пользовательскими данными через API
   - `refresh_token`, `offline_access` — для выполнения запросов в любое время, даже когда пользователь не в сети или срок действия токенов истёк
   - `cdp_query_api` — для выполнения SQL-запросов к данным Data 360
4. В разделе **Flow Enablement** выберите **Enable JWT Bearer Flow**.
5. Нажмите **Upload Files** и загрузите файл `server.crt`, созданный в разделе [Создание закрытого ключа и сертификата](#generating-a-private-key-and-certificate).
6. Нажмите **Create**.
7. На вкладке **Policies** выберите **Edit**.
8. В разделе **OAuth Policies** > **Plugin Policies** > **Permitted Users** выберите **Admin approved users are pre-authorized**.
   Появится список **Select Profiles and Select Permission Sets**.
9. Выберите профили и наборы разрешений, которым следует предоставить доступ к внешнему клиентскому приложению.
10. В разделе **App Authorization** установите для **IP Relaxation** значение **Relax IP Restrictions**.
11. Нажмите **Save**.
