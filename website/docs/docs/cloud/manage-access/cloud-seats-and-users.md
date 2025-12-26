---
title: "Пользователи и лицензии"
description: "Узнайте, как администраторы dbt могут использовать лицензии и места (seats) для управления доступом в аккаунте dbt."
id: "seats-and-users"
sidebar: "Пользователи и лицензии"
pagination_next: "docs/cloud/manage-access/enterprise-permissions"
pagination_prev: null
---

import LicenseTypes from '/snippets/_cloud-license-types.md';

В <Constant name="cloud" /> _лицензии_ используются для распределения пользователей в вашей учетной записи.

<LicenseTypes/>

Назначенная пользователю лицензия определяет, к каким именно возможностям он может получить доступ в <Constant name="cloud" />.

| Functionality | <div style={{width:'125px'}}>Developer or Analyst Users</div> | <div style={{width:'125px'}}>Read-Only Users</div> |<div style={{width:'125px'}}> IT Users*</div> |
| ------------- | -------------- | --------------- | -------- |
| Use the <Constant name="cloud_ide" /> | ✅ | ❌ | ❌ |
| Use the <Constant name="cloud" /> CLI | ✅ | ❌ | ❌ |
| Use Jobs | ✅ | ❌ | ❌ |
| Manage Account | ✅ | ❌ | ✅ |
| API Access | ✅ | ✅ | ❌ |
| Use [<Constant name="explorer" />](/docs/explore/explore-projects) | ✅  | ✅ | ❌  |
| Use [Source Freshness](/docs/deploy/source-freshness) | ✅ | ✅ | ❌ |
| Use [Docs](/docs/explore/build-and-view-your-docs) | ✅ | ✅ | ❌ |
| Receive [Job notifications](/docs/deploy/job-notifications) |  ✅ |  ✅  |  ✅ | 

\*Доступно только в планах Starter, Enterprise и Enterprise+. IT‑лицензии ограничены одной лицензией на учетную запись уровня Starter или Enterprise и не учитываются при подсчете используемых лицензий.

## Лицензии

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />

Each <Constant name="cloud" /> plan comes with a base number of Developer, IT, and Read-Only licenses. You can add or remove licenses by modifying the number of users in your account settings. 

Если у вас есть аккаунт с планом Developer и вы хотите добавить больше людей в команду, вам потребуется перейти на план Starter. Подробнее о лицензиях, доступных в каждом плане, см. в разделе [dbt Pricing Plans](https://www.getdbt.com/pricing/).

Следующие вкладки подробно описывают шаги по изменению количества пользовательских лицензий:

<Tabs>

<TabItem value="enterprise" label="Enterprise-tier plans">

Если у вас план уровня Enterprise и есть соответствующие [permissions](/docs/cloud/manage-access/enterprise-permissions), вы можете добавлять или удалять лицензии, изменяя количество пользовательских мест (user seats). Обратите внимание: лицензия IT не учитывается при подсчёте использования мест.

- Чтобы удалить пользователя, нажмите на имя вашего аккаунта в левом меню, выберите **Account settings** и выберите **Users**.
  - Выберите пользователя, которого хотите удалить, нажмите **Edit**, а затем **Delete**.
  - Это действие нельзя отменить. Однако вы можете повторно пригласить пользователя с той же информацией, если удалили его по ошибке.<br />

- Чтобы добавить пользователя, перейдите в **Account Settings** и выберите **Users**.
  - Нажмите кнопку [**Invite Users**](/docs/cloud/manage-access/invite-users).
  - Для тонкой настройки разрешений обратитесь к [управлению доступом на основе ролей](/docs/cloud/manage-access/about-user-access#role-based-access-control-).

</TabItem>

<TabItem value="starter" label="Starter plans">

Если вы используете тариф Starter и у вас есть соответствующие [permissions](/docs/cloud/manage-access/self-service-permissions), вы можете добавлять или удалять разработчиков.

Подробную информацию о количестве лицензий каждого типа, включённых в тариф Starter, см. в разделе [Self-service Starter account permissions](/docs/cloud/manage-access/self-service-permissions#licenses).

Вам потребуется внести два изменения:

- Скорректировать количество developer user seats, которое управляет пользователями, приглашёнными в ваш проект <Constant name="cloud" />.  
- Скорректировать количество developer billing seats, которое управляет числом оплачиваемых мест.

Вы можете добавлять или удалять разработчиков, увеличивая или уменьшая количество пользователей и оплачиваемых мест в настройках вашей учётной записи:

<Tabs>
<TabItem value="addusers" label="Добавление пользователей">

Чтобы добавить пользователя в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора.

1. В <Constant name="cloud" /> нажмите на название вашего аккаунта в левом боковом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" width="75%" title="Navigate to Account settings" />

2. В разделе **Account Settings** выберите **Billing**.  
3. В разделе **Billing details** укажите необходимое количество developer seats и убедитесь, что вы заполнили все платёжные данные, включая раздел **Billing address**. Если оставить эти поля пустыми, вы не сможете сохранить изменения.  
4. Нажмите **Update Payment Information**, чтобы сохранить изменения.

<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.png" width="75%" title="Navigate to Account settings -> Billing to modify billing seat count" />

Теперь, когда вы обновили биллинг, вы можете [пригласить пользователей](/docs/cloud/manage-access/invite-users) присоединиться к вашему аккаунту dbt Cloud:

Теперь, когда вы обновили биллинг, вы можете [пригласить пользователей](/docs/cloud/manage-access/invite-users) присоединиться к вашему аккаунту <Constant name="cloud" />:

Отличная работа! После выполнения этих шагов количество пользователей <Constant name="cloud" /> и количество пользователей, учитываемых для биллинга, теперь должны совпадать.
</TabItem>

<TabItem value="deleteusers" label="Удаление пользователей">

Чтобы удалить пользователя в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора. Если у пользователя тип лицензии `developer`, его место станет доступным для другого пользователя, либо администраторы смогут уменьшить общее количество лицензий (seats).

1. В <Constant name="cloud" /> нажмите на имя вашего аккаунта в левом боковом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" width="85%" title="Navigate to Account settings" />

2. В разделе **Account settings** выберите **Users**.  
3. Выберите пользователя, которого хотите удалить, затем нажмите **Edit**.  
4. Нажмите **Delete** в левом нижнем углу. Затем нажмите **Confirm Delete**, чтобы немедленно удалить пользователя без дополнительных запросов пароля. Это действие нельзя отменить. Однако вы можете повторно пригласить пользователя с теми же данными, если удаление было выполнено по ошибке.

<Lightbox src="/img/docs/dbt-cloud/delete_user_20221023.gif" width="75%" title="Удаление пользователя" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>
        
<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.png" width="75%" title="Страница **Billing** в разделе **Account settings**" />

Отличная работа! После выполнения этих шагов количество пользователей <Constant name="cloud" /> и количество лицензий для биллинга теперь должны совпадать.

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Управление типами лицензий

Лицензии могут назначаться пользователям индивидуально или через членство в группах. Чтобы назначить лицензию через группу, вы можете вручную добавить пользователя в группу в процессе приглашения или назначить его в группу после того, как он зарегистрируется в <Constant name="cloud" />. В качестве альтернативы, при использовании [настройки SSO](/docs/cloud/manage-access/sso-overview) и [ролевой модели управления доступом](/docs/cloud/manage-access/about-user-access#role-based-access-control-) (только для Enterprise‑тарифа), пользователи могут автоматически назначаться в группы. По умолчанию новым пользователям в аккаунте назначается лицензия Developer.

### Ручная конфигурация

Чтобы вручную назначить конкретный тип лицензии пользователю в вашей команде, перейдите на страницу **Users** в разделе **Account settings** и нажмите кнопку **Edit** рядом с пользователем, которым вы хотите управлять. На этой странице вы сможете выбрать тип лицензии и соответствующие группы для пользователя.

**Примечание:** у вас должна быть доступная лицензия, которую можно выделить для пользователя. Если в вашем аккаунте нет доступных лицензий для распределения, вам потребуется добавить дополнительные лицензии в ваш план, чтобы завершить изменение лицензии.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-manual.png" width="55%" title="Ручное назначение лицензий"/>

### Сопоставление конфигураций <Lifecycle status="managed,managed_plus" /> 

Если ваша учетная запись подключена к провайдеру идентификации (IdP) для [Single Sign On](/docs/cloud/manage-access/sso-overview), вы можете автоматически сопоставлять группы пользователей IdP с определенными группами в <Constant name="cloud" /> и назначать этим группам типы лицензий. Для настройки сопоставлений лицензий перейдите на страницу **Account Settings** > **Groups & Licenses** > **License Mappings**. Здесь вы можете создавать или редактировать SSO-сопоставления как для лицензий типа Read-Only, так и для Developer.

По умолчанию всем новым участникам учетной записи <Constant name="cloud" /> назначается лицензия Developer. Чтобы назначать лицензии Read-Only определенным группам пользователей, создайте новое License Mapping для типа лицензии Read-Only и укажите список имен групп IdP, разделенных запятыми, которые должны получать лицензию Read-Only в момент входа в систему.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-mapping.png" width="65%" title="Настройка сопоставления лицензий для групп IdP"/>

Примечания по использованию:
- Если группы IdP пользователя совпадают **и** с маппингом лицензии Developer, **и** с маппингом лицензии Read-Only, будет назначен тип лицензии Developer.
- Если группы IdP пользователя **не совпадают ни с одним** маппингом типа лицензии, будет назначена лицензия Developer.
- Типы лицензий обновляются, когда пользователи входят в <Constant name="cloud" /> через Single Sign On.
  Изменения, внесённые в маппинги типов лицензий, вступят в силу при следующем входе пользователей в <Constant name="cloud" />.
- Маппинги типов лицензий основаны на _группах IdP_, а не на _группах <Constant name="cloud" />_, поэтому при настройке этой функции обязательно проверяйте членство в группах в вашем провайдере идентификации.

## Гранулярное управление доступом

Планы <Constant name="cloud" /> уровня Enterprise поддерживают управление доступом на основе ролей для настройки детальных разрешений внутри приложения. Подробнее о разрешениях уровня Enterprise см. в разделе [access control](/docs/cloud/manage-access/about-user-access).
