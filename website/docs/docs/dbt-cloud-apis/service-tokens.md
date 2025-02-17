---
title: "Токены сервисных аккаунтов"
id: "service-tokens"
description: "Токены сервисных аккаунтов помогают определить разрешения для обеспечения доступа к вашему аккаунту dbt Cloud и его проектам."
---

# Токены сервисных аккаунтов <Lifecycle status="team,enterprise"/>

:::info Важное обновление токенов сервисных аккаунтов

Если у вас есть токены, созданные до 18 июля 2023 года, пожалуйста, прочитайте [это важное обновление](/docs/dbt-cloud-apis/service-tokens#service-token-update).

:::

Токены сервисных аккаунтов позволяют безопасно аутентифицироваться с помощью API dbt Cloud, назначая каждому токену узкий набор разрешений, которые более точно управляют доступом к API. Хотя они похожи на [персональные токены доступа](user-tokens), токены сервисных аккаунтов принадлежат аккаунту, а не пользователю.

Вы можете использовать токены сервисных аккаунтов для интеграций на уровне системы, которые не выполняются от имени какого-либо одного пользователя. Назначьте любые наборы разрешений, доступные в dbt Cloud, вашему токену сервисного аккаунта, которые могут немного различаться в зависимости от вашего плана:

* Корпоративные планы могут применять любые наборы разрешений, доступные для токенов сервисных аккаунтов.
* Планы для команд могут применять наборы разрешений Администратора аккаунта, Участника, Администратора заданий, Только для чтения, Метаданные и Семантический слой к токенам сервисных аккаунтов.

Вы можете назначить столько наборов разрешений, сколько необходимо, одному токену. Для получения дополнительной информации о наборах разрешений см. "[Корпоративные разрешения](/docs/cloud/manage-access/enterprise-permissions)."

## Генерация токенов сервисных аккаунтов

Вы можете генерировать токены сервисных аккаунтов, если у вас есть лицензия [разработчика](/docs/cloud/manage-access/seats-and-users) и права администратора аккаунта [разрешения](/docs/cloud/manage-access/about-user-access#permission-sets). Чтобы создать токен сервисного аккаунта в dbt Cloud, выполните следующие шаги:

1. В dbt Cloud нажмите на имя вашего аккаунта в левом меню и выберите **Настройки аккаунта**.
2. В левой боковой панели нажмите на **Токены сервисных аккаунтов**.
3. Нажмите кнопку **+ Новый токен**, чтобы сгенерировать новый токен.
4. После генерации токена вы не сможете просмотреть его снова, поэтому обязательно сохраните его в безопасном месте.

## Разрешения для токенов сервисных аккаунтов

Вы можете назначить токены сервисных аккаунтов любому набору разрешений, доступному в dbt Cloud. Когда вы назначаете набор разрешений токену, вы также сможете выбрать, предоставлять ли эти разрешения для всех проектов в аккаунте или для конкретных проектов.

### Планы для команд, использующие токены сервисных аккаунтов

Следующие разрешения могут быть назначены токену сервисного аккаунта в плане для команд. Обратитесь к [Корпоративным разрешениям](/docs/cloud/manage-access/enterprise-permissions) для получения дополнительной информации об этих ролях.

- Администратор аккаунта &mdash; Токены сервисных аккаунтов администратора аккаунта имеют полный доступ `чтение + запись` к аккаунту, поэтому используйте их с осторожностью. В плане для команд этот набор разрешений называется "Роль владельца."
- Администратор по выставлению счетов
- Администратор заданий
- Только метаданные
- Участник
- Только для чтения
- Только семантический слой

### Корпоративные планы, использующие токены сервисных аккаунтов

Обратитесь к [Корпоративным разрешениям](/docs/cloud/manage-access/enterprise-permissions) для получения дополнительной информации об этих ролях.

- Администратор аккаунта &mdash; Токены сервисных аккаунтов администратора аккаунта имеют полный доступ `чтение + запись` к аккаунту, поэтому используйте их с осторожностью.
- Наблюдатель аккаунта
- Администратор
- Аналитик
- Администратор по выставлению счетов
- Администратор базы данных
- Разработчик
- Администратор Git
- Администратор заданий
- Исполнитель заданий
- Наблюдатель заданий
- Управление приложениями на рынке
- Только метаданные
- Только семантический слой
- Администратор безопасности
- Заинтересованное лицо
- Администратор команды

## Обновление токенов сервисных аккаунтов

18 июля 2023 года dbt Labs внесла критические изменения в инфраструктуру токенов сервисных аккаунтов. Эти улучшения повышают безопасность и производительность всех токенов, созданных после 18 июля 2023 года. Чтобы обеспечить соблюдение лучших практик безопасности, мы рекомендуем вам обновить ваши токены сервисных аккаунтов, созданные до этой даты.

Чтобы обновить ваш токен:
1. Перейдите в **Настройки аккаунта** и нажмите **Токены сервисных аккаунтов** на левой панели.
2. Убедитесь, что дата **Создания** токена _до или на_ 18 июля 2023 года.
    <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/service-token-date.png" title="Дата создания токена сервисного аккаунта"/>
3. Нажмите **+ Новый токен** в правом верхнем углу экрана. Убедитесь, что новый токен имеет те же разрешения, что и старый.
4. Скопируйте новый токен и замените старый в ваших системах. Сохраните его в безопасном месте, так как он не будет доступен снова после закрытия экрана создания.
5. Удалите старый токен в dbt Cloud, нажав на **значок корзины**. _Выполните это действие только после того, как новый токен будет установлен, чтобы избежать сбоев в работе сервиса_.

## Часто задаваемые вопросы
<FAQ path="Troubleshooting/ip-restrictions" />