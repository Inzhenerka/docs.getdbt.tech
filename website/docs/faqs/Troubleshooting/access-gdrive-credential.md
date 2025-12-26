---
title: Я получаю ошибку "Permission denied while getting Drive credential" при попытке выполнить запрос из Google Drive?
description: "Предоставьте доступ сервисному аккаунту BigQuery"
sidebar_label: 'Ошибка при попытке выполнить запрос из Google Drive'
id: access-gdrive-credential

---

Если при попытке выполнить запрос к датасету из документа Google Drive в <Constant name="cloud_ide" /> вы видите приведённую ниже ошибку, и <Constant name="cloud_ide" /> сообщает об этом сообщении об ошибке, мы постараемся помочь вам разобраться с проблемой с помощью шагов, описанных ниже!

```
Access denied: BigQuery BigQuery: Permission denied while getting Drive credentials
```

Обычно эта ошибка означает, что вы не предоставили сервисному аккаунту BigQuery доступ к конкретному документу Google Drive. Если вы видите эту ошибку, попробуйте выдать сервисному аккаунту (значение из поля Client email, показанное [здесь](/docs/cloud/connect-data-platform/connect-bigquery)), который вы используете для подключения BigQuery в <Constant name="cloud" />, разрешение на доступ к вашему Google Drive или Google Sheet. Сделать это нужно непосредственно в документе Google: нажмите кнопку **Share** и укажите client email.

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