Войдите через [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html) и задайте для `method` значение `browser_identity_center`. dbt откроет окно браузера для аутентификации без необходимости указывать пароль или профиль IAM в файле `profiles.yml`.

:::note Только локально
Этот метод работает при локальном запуске dbt из командной строки. В <Constant name="dbt_platform" /> он пока не поддерживается.
:::

Перед началом убедитесь, что ваш кластер или рабочая группа Redshift настроены для [интеграции с IAM Identity Center](https://docs.aws.amazon.com/redshift/latest/mgmt/redshift-iam-access-control-idp-connect.html). Вам понадобятся следующие поля:

<SimpleTable>

| Поле профиля | Обязательное | По умолчанию | Описание |
| ------------- | -------- | ------- | ----------- |
| `method` | Да | &mdash; | Задайте значение `browser_identity_center`. |
| `idc_region`* | Да | &mdash; | Регион AWS, в котором находится ваш экземпляр IAM Identity Center (например, `us-east-1`). |
| `issuer_url` | Да | &mdash; | URL издателя вашего экземпляра IAM Identity Center (например, `https://identitycenter.amazonaws.com/ssoins-1234567890abcdef`). |
| `idp_listen_port` | Нет | `7890` | Локальный порт, на котором dbt ожидает перенаправление из браузера после входа. |
| `idc_client_display_name` | Нет | `Amazon Redshift driver` | Имя приложения, отображаемое в запросе согласия в браузере. |
| `idp_response_timeout` | Нет | `60` | Время в секундах, в течение которого dbt ожидает завершения входа до истечения времени ожидания. |

</SimpleTable>

*`idc_region` — это не то же самое, что регион вашей учетной записи AWS. dbt пока не поддерживает указание `region` вместе с `browser_identity_center` в `profiles.yml`, поэтому считывает регион AWS из файла конфигурации AWS (`~/.aws/config`). Убедитесь, что в нем задан регион по умолчанию (например, выполнив `aws configure`).

#### Пример конфигурации IAM Identity Center {#example-iam-identity-center-configuration}

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      method: browser_identity_center
      host: hostname.region.redshift.amazonaws.com
      port: 5439
      dbname: analytics
      schema: analytics
      idc_region: us-east-1
      issuer_url: https://identitycenter.amazonaws.com/ssoins-1234567890abcdef

      # Необязательные параметры
      idp_listen_port: 7890
      idc_client_display_name: Amazon Redshift driver
      idp_response_timeout: 60
      threads: 4
```

</File>
