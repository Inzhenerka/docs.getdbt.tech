---
title: Я получаю ошибку "Permission denied while getting Drive credential" при попытке выполнить запрос из Google Drive?
description: "Предоставьте доступ сервисному аккаунту BigQuery"
sidebar_label: 'Ошибка при попытке выполнить запрос из Google Drive'
id: access-gdrive-credential

---

Если при попытке выполнить запрос к набору данных из документа Google Диска в <Constant name="studio_ide" /> вы видите приведённое ниже сообщение об ошибке, мы постараемся помочь вам решить проблему с помощью описанных ниже шагов!

```
Access denied: BigQuery BigQuery: Permission denied while getting Drive credentials
```

Обычно эта ошибка означает, что вы не предоставили сервисному аккаунту BigQuery доступ к конкретному документу Google Диска. Если вы столкнулись с этой ошибкой, попробуйте предоставить сервисному аккаунту, который вы используете для подключения к BigQuery в <Constant name="dbt" />, доступ к вашему документу на Google Диске или таблице Google Sheets (адрес электронной почты сервисного аккаунта указан в поле Client email, показанном [здесь](/docs/platform/connect-data-platform/connect-bigquery)). Для этого непосредственно в документе Google нажмите кнопку **Поделиться** и введите адрес электронной почты сервисного аккаунта.

Если вы сталкиваетесь с этой ошибкой при использовании OAuth и уже проверили ваш доступ к Google Sheet, возможно, вам нужно предоставить разрешения для gcloud на доступ к Google Drive:

```
gcloud auth application-default login --disable-quota-project
```
Для получения дополнительной информации смотрите [документацию по gcloud auth application-default](https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login).

Если вы попробовали предыдущие шаги и все еще сталкиваетесь с этой проблемой, попробуйте использовать следующую команду для входа в Google Cloud и включения доступа к Google Drive. Это также обновляет файл Application Default Credentials (ADC), который многие библиотеки Google Cloud используют для аутентификации API вызовов.

```
gcloud auth login --enable-gdrive-access --update-adc
```

Для получения дополнительной информации обратитесь к [документации по gcloud auth login](https://cloud.google.com/sdk/gcloud/reference/auth/login#--enable-gdrive-access).

Если вы попробовали вышеуказанные шаги и все еще сталкиваетесь с этой проблемой, свяжитесь с командой поддержки по адресу support@getdbt.com, и мы будем рады помочь!