---
title: "Контрольный список миграции в многосекционную архитектуру"
id: migration
sidebar_label: "Контрольный список миграции в многосекционную архитектуру"
description: "Подготовка к миграции аккаунта на архитектуру AWS с использованием секций."
pagination_next: null
pagination_prev: null
---

dbt Labs внедряет новую архитектуру с использованием секций для dbt Cloud. Эта архитектура станет основой для dbt Cloud на долгие годы и обеспечит улучшенную надежность, производительность и согласованность для пользователей dbt Cloud.

Мы планируем миграции по аккаунтам. Когда мы будем готовы мигрировать ваш аккаунт, вы получите уведомление в виде баннера или электронного письма с датой миграции. Если вы не получили это уведомление, то на данный момент вам не нужно предпринимать никаких действий. dbt Labs предоставит вам информацию о вашей миграции с соответствующим предварительным уведомлением, если это будет применимо к вашему аккаунту.

Ваш аккаунт будет автоматически мигрирован в назначенную дату или после нее. Однако, если вы используете определенные функции, вам необходимо предпринять действия до этой даты, чтобы избежать сбоев в работе сервиса.

## Рекомендуемые действия

:::info Перенос вашей миграции

Если вы используете тариф dbt Cloud Enterprise, вы можете отложить миграцию вашего аккаунта на срок до 45 дней. Чтобы перенести миграцию, перейдите в **Настройки аккаунта** → **Руководство по миграции**.

Для получения помощи свяжитесь с командой поддержки dbt по адресу [support@getdbt.com](mailto:support@getdbt.com).
:::

Мы настоятельно рекомендуем вам выполнить следующие действия:

- Убедитесь, что все ожидающие приглашения пользователей приняты, или отметьте невыполненные приглашения. Ожидающие приглашения пользователей могут быть аннулированы во время миграции. Вы можете повторно отправить приглашения пользователям после завершения миграции.
- Зафиксируйте несохраненные изменения в [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud). Несохраненные изменения могут быть утеряны во время миграции.
- Экспортируйте и скачайте [аудит-логи](/docs/cloud/manage-access/audit-log) старше 90 дней, так как они будут недоступны в dbt Cloud после завершения миграции. Логи старше 90 дней, находящиеся в пределах периода хранения данных, не удаляются, но вам придется работать с командой поддержки клиентов dbt Labs для их восстановления.

## Обязательные действия

Эти действия необходимы, чтобы предотвратить потерю доступа пользователей к dbt Cloud:

- Если вы еще не сделали этого, завершите [миграцию Auth0 для SSO](/docs/cloud/manage-access/auth0-migration) до назначенной даты миграции, чтобы избежать сбоев в работе сервиса. Если вы завершили миграцию Auth0, ваши конфигурации SSO аккаунта будут перенесены автоматически.
- Обновите списки разрешенных IP-адресов. dbt Cloud будет использовать новые IP-адреса для доступа к вашему хранилищу данных после миграции. Разрешите входящий трафик от всех следующих новых IP-адресов в вашем файрволе и включите их в любые предоставления доступа к базе данных:

    - `52.3.77.232`
    - `3.214.191.130`
    - `34.233.79.135`

    Сохраните старые IP-адреса dbt Cloud до завершения миграции.

## После миграции

Выполните все эти пункты, чтобы ваши ресурсы и задания dbt Cloud продолжали работать без перебоев.

Используйте один из следующих двух вариантов URL для входа:

- `us1.dbt.com.` Если вы ранее входили на `cloud.getdbt.com`, вам следует планировать вход на us1.dbt.com. Оригинальный URL все еще будет работать, но вам придется пройти перенаправление при входе.
- `ACCOUNT_PREFIX.us1.dbt.com`: Уникальный URL специально для вашего аккаунта. Если вы принадлежите к нескольким аккаунтам, у каждого будет уникальный URL, доступный после их миграции в многосекционную архитектуру.
Ознакомьтесь с [доступом, регионами и IP-адресами](/docs/cloud/about-cloud/access-regions-ip-addresses) для получения дополнительной информации.

Удалите следующие старые IP-адреса из вашего файрвола и предоставлений доступа к базе данных:

- `52.45.144.63`
- `54.81.134.249`
- `52.22.161.231`