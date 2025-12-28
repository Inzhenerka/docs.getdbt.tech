---
title: Как настроить правильные разрешения в BigQuery?
description: "Использование service account для настройки разрешений в BigQuery"
sidebar_label: 'Настройка разрешений в BigQuery'
id: bq-impersonate-service-account-setup

---

Чтобы использовать эту функциональность, сначала создайте service account, который вы 
хотите использовать для impersonation. Затем предоставьте пользователям, которым вы 
хотите разрешить impersonation этого service account, роль `roles/iam.serviceAccountTokenCreator` 
на ресурсе service account. Кроме того, необходимо предоставить этому service account ту 
же самую роль на самом себе. Это позволяет ему создавать краткоживущие токены, 
идентифицирующие самого себя, а также позволяет вашим пользователям (или другим service 
account) делать то же самое. Более подробная информация об этом сценарии доступна 
[здесь](https://cloud.google.com/iam/docs/understanding-service-accounts#directly_impersonating_a_service_account).

После того как вы предоставили необходимые разрешения, вам нужно включить 
[IAM Service Account Credentials API](https://console.cloud.google.com/apis/library/iamcredentials.googleapis.com). 
Включение API и предоставление роли являются операциями с eventual consistency — на их 
полное применение может потребоваться до 7 минут, хотя обычно изменения распространяются 
в течение 60 секунд. Подождите несколько минут, а затем добавьте параметр 
`impersonate_service_account` в конфигурацию вашего профиля BigQuery.
