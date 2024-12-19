---
title: Я получаю ошибку "Permission denied while getting Drive credential" при попытке выполнить запрос из Google Drive?
description: "Предоставьте доступ учетной записи службы BigQuery"
sidebar_label: 'Ошибка при попытке выполнить запрос из Google Drive'
id: access-gdrive-credential

---

Если вы видите приведенную ниже ошибку, когда пытаетесь выполнить запрос к набору данных из документа Google Drive в IDE, мы постараемся помочь вам с решением этой проблемы с помощью следующих шагов!

```
Access denied: BigQuery BigQuery: Permission denied while getting Drive credentials
```

Обычно эта ошибка указывает на то, что вы не предоставили учетной записи службы BigQuery доступ к конкретному документу Google Drive. Если вы видите эту ошибку, попробуйте предоставить учетной записи службы (поле Client email, которое можно увидеть [здесь](/docs/cloud/connect-data-platform/connect-bigquery)), которую вы используете для подключения к BigQuery в dbt Cloud, разрешение на доступ к вашему Google Drive или Google Sheet. Вам нужно сделать это непосредственно в вашем документе Google, нажав кнопку **Share** и введя адрес электронной почты клиента.

Если вы сталкиваетесь с этой ошибкой при использовании OAuth и подтвердили свой доступ к Google Sheet, вам может потребоваться предоставить разрешения для gcloud для доступа к Google Drive:

```
gcloud auth application-default login --disable-quota-project
```
Для получения дополнительной информации смотрите [документацию gcloud auth application-default](https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login).

Если вы попробовали предыдущие шаги и все еще сталкиваетесь с этой проблемой, попробуйте использовать следующую команду для входа в Google Cloud и включения доступа к Google Drive. Она также обновляет файл учетных данных по умолчанию (ADC), который многие библиотеки Google Cloud используют для аутентификации API-вызовов.

```
gcloud auth login --enable-gdrive-access --update-adc
```

Для получения дополнительной информации обратитесь к [документации gcloud auth login](https://cloud.google.com/sdk/gcloud/reference/auth/login#--enable-gdrive-access).

Если вы попробовали указанные выше шаги и все еще сталкиваетесь с этой проблемой, свяжитесь с командой поддержки по адресу support@getdbt.com, и мы будем рады помочь!