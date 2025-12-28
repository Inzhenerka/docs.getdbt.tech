---
title: "Пользователи и лицензии"
description: "Узнайте, как администраторы dbt могут использовать лицензии и места (seats) для управления доступом в аккаунте dbt."
id: "seats-and-users"
sidebar: "Users and licenses"
pagination_next: "docs/cloud/manage-access/enterprise-permissions"
pagination_prev: null
---

import LicenseTypes from '/snippets/_cloud-license-types.md';

В <Constant name="cloud" /> _лицензии_ используются для распределения пользователей в рамках вашего аккаунта.

<LicenseTypes/>

Назначенная пользователю лицензия определяет, к каким возможностям он имеет доступ в <Constant name="cloud" />.

| Функциональность | <div style={{width:'125px'}}>Пользователи Developer или Analyst</div> | <div style={{width:'125px'}}>Пользователи Read-Only</div> |<div style={{width:'125px'}}> IT-пользователи*</div> |
| ------------- | -------------- | --------------- | -------- |
| Использование <Constant name="cloud_ide" /> | ✅ | ❌ | ❌ |
| Использование <Constant name="cloud" /> CLI | ✅ | ❌ | ❌ |
| Использование Jobs | ✅ | ❌ | ❌ |
| Управление аккаунтом | ✅ | ❌ | ✅ |
| Доступ к API | ✅ | ✅ | ❌ |
| Использование [<Constant name="explorer" />](/docs/explore/explore-projects) | ✅  | ✅ | ❌  |
| Использование [Source Freshness](/docs/deploy/source-freshness) | ✅ | ✅ | ❌ |
| Использование [Docs](/docs/explore/build-and-view-your-docs) | ✅ | ✅ | ❌ |
| Получение [уведомлений о Job](/docs/deploy/job-notifications) |  ✅ |  ✅  |  ✅ | 

\*Доступно только на планах Starter, Enterprise и Enterprise+. IT‑места ограничены 1 местом на аккаунт уровня Starter или Enterprise и не учитываются в общем количестве используемых мест.

## Лицензии

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />

Каждый план <Constant name="cloud" /> включает базовое количество лицензий Developer, IT и Read-Only. Вы можете добавлять или удалять лицензии, изменяя количество пользователей в настройках аккаунта.

Если у вас аккаунт с планом Developer и вы хотите добавить больше участников в команду, потребуется обновиться до плана Starter. Подробнее о лицензиях, доступных в каждом плане, см. [dbt Pricing Plans](https://www.getdbt.com/pricing/).

Ниже приведены вкладки с шагами по изменению количества пользовательских лицензий:

<Tabs>

<TabItem value="enterprise" label="Планы уровня Enterprise">

Если вы используете план уровня Enterprise и обладаете необходимыми [разрешениями](/docs/cloud/manage-access/enterprise-permissions), вы можете добавлять или удалять лицензии, изменяя количество пользовательских мест. Обратите внимание: IT‑лицензия не учитывается в использовании мест.

- Чтобы удалить пользователя, нажмите на имя аккаунта в левом меню, выберите **Account settings** и затем **Users**.
  - Выберите пользователя, которого хотите удалить, нажмите **Edit**, затем **Delete**.
  - Это действие нельзя отменить. Однако вы можете повторно пригласить пользователя с теми же данными, если удаление было выполнено по ошибке.<br />

- Чтобы добавить пользователя, перейдите в **Account Settings** и выберите **Users**.
  - Нажмите кнопку [**Invite Users**](/docs/cloud/manage-access/invite-users).
  - Для более тонкой настройки разрешений см. [Role based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control-).

</TabItem>

<TabItem value="starter" label="Планы Starter">

Если вы используете план Starter и обладаете необходимыми [разрешениями](/docs/cloud/manage-access/self-service-permissions), вы можете добавлять или удалять разработчиков.

Подробнее о количестве лицензий каждого типа, включённых в план Starter, см. [Self-service Starter account permissions](/docs/cloud/manage-access/self-service-permissions#licenses).

Вам потребуется внести два изменения:

- Изменить количество пользовательских мест разработчиков, которое управляет пользователями, приглашёнными в ваш проект <Constant name="cloud" />.
- Изменить количество биллинговых мест разработчиков, которое определяет число оплачиваемых мест.

Вы можете добавлять или удалять разработчиков, увеличивая или уменьшая количество пользователей и оплачиваемых мест в настройках аккаунта:

<Tabs>
<TabItem value="addusers" label="Добавление пользователей">

Чтобы добавить пользователя в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора.

1. В <Constant name="cloud" /> нажмите на имя аккаунта в левом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" width="75%" title="Переход в Account settings" />

2. В **Account Settings** выберите **Billing**.
3. В разделе **Billing details** укажите нужное количество developer‑мест и убедитесь, что заполнены все платёжные данные, включая раздел **Billing address**. Если оставить их пустыми, сохранить изменения не получится.
4. Нажмите **Update Payment Information**, чтобы сохранить изменения.

<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.png" width="75%" title="Переход в Account settings -> Billing для изменения количества биллинговых мест" />

После обновления биллинга вы можете [пригласить пользователей](/docs/cloud/manage-access/invite-users) в ваш аккаунт <Constant name="cloud" />:

Отличная работа! После выполнения этих шагов количество пользователей и количество биллинговых мест в <Constant name="cloud" /> должны совпадать.
</TabItem>

<TabItem value="deleteusers" label="Удаление пользователей">

Чтобы удалить пользователя в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора. Если у пользователя тип лицензии `developer`, его место станет доступным для другого пользователя или позволит администраторам уменьшить общее количество мест.

1. В <Constant name="cloud" /> нажмите на имя аккаунта в левом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" width="85%" title="Переход в Account settings" />

2. В **Account settings** выберите **Users**.
3. Выберите пользователя, которого хотите удалить, затем нажмите **Edit**.
4. Нажмите **Delete** в левом нижнем углу. Нажмите **Confirm Delete**, чтобы немедленно удалить пользователя без дополнительных запросов пароля. Это действие нельзя отменить. Однако вы можете повторно пригласить пользователя с теми же данными, если удаление было выполнено по ошибке.

<Lightbox src="/img/docs/dbt-cloud/delete_user_20221023.gif" width="75%" title="Удаление пользователя" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>
        
<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.png" width="75%" title="Страница Billing в Account settings" />

Отличная работа! После выполнения этих шагов количество пользователей и количество биллинговых мест в <Constant name="cloud" /> должны совпадать.

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Управление типами лицензий

Лицензии могут назначаться пользователям индивидуально или через членство в группах. Чтобы назначить лицензию через группу, вы можете вручную добавить пользователя в группу в процессе приглашения или назначить его в группу после того, как он зарегистрируется в <Constant name="cloud" />. Кроме того, при использовании [SSO configuration](/docs/cloud/manage-access/sso-overview) и [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control-) (только для планов уровня Enterprise) пользователи могут автоматически назначаться в группы. По умолчанию всем новым пользователям в аккаунте назначается лицензия Developer.

### Ручная настройка

Чтобы вручную назначить пользователю в вашей команде определённый тип лицензии, перейдите на страницу **Users** в **Account settings** и нажмите кнопку **Edit** у нужного пользователя. На этой странице вы можете выбрать тип лицензии и соответствующие группы для пользователя.

**Примечание:** У вас должна быть доступная лицензия для назначения пользователю. Если в аккаунте нет свободных лицензий, потребуется добавить дополнительные лицензии в ваш план, чтобы завершить изменение типа лицензии.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-manual.png" width="55%" title="Ручное назначение лицензий"/>

### Настройка через сопоставление <Lifecycle status="managed,managed_plus" /> 

Если ваш аккаунт подключён к провайдеру удостоверений (IdP) для [Single Sign On](/docs/cloud/manage-access/sso-overview), вы можете автоматически сопоставлять группы пользователей IdP с определёнными группами в <Constant name="cloud" /> и назначать типы лицензий этим группам. Для настройки сопоставлений лицензий перейдите в **Account Settings** > **Groups & Licenses** > **License Mappings**. Здесь вы можете создавать или редактировать SSO‑сопоставления как для лицензий Read-Only, так и для Developer.

По умолчанию всем новым участникам аккаунта <Constant name="cloud" /> назначается лицензия Developer. Чтобы назначать лицензии Read-Only определённым группам пользователей, создайте новое сопоставление лицензий для типа Read-Only и укажите список имён групп IdP, разделённых запятыми, которые должны получать лицензию Read-Only при входе в систему.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-mapping.png" width="65%" title="Настройка сопоставления лицензий с группами IdP"/>

Примечания по использованию:
- Если группы IdP пользователя соответствуют сопоставлениям как для лицензии Developer, так и для Read-Only, будет назначена лицензия Developer.
- Если группы IdP пользователя не соответствуют _ни одному_ сопоставлению типов лицензий, будет назначена лицензия Developer.
- Типы лицензий обновляются, когда пользователи входят в <Constant name="cloud" /> через Single Sign On. Изменения в сопоставлениях типов лицензий вступят в силу при следующем входе пользователей в <Constant name="cloud" />.
- Сопоставления типов лицензий основаны на _группах IdP_, а не на _группах <Constant name="cloud" />_, поэтому при настройке этой функции обязательно проверяйте членство в группах у вашего провайдера удостоверений.

## Гранулярные разрешения

Планы <Constant name="cloud" /> уровня Enterprise поддерживают ролевую модель доступа для настройки детальных разрешений внутри приложения. Подробнее о разрешениях Enterprise см. в разделе [access control](/docs/cloud/manage-access/about-user-access).
