---
title: "Пользователи и лицензии"
description: "Узнайте, как администраторы dbt могут использовать лицензии и места (seats) для управления доступом в аккаунте dbt."
id: "seats-and-users"
sidebar: "Users and licenses"
pagination_next: "docs/cloud/manage-access/enterprise-permissions"
pagination_prev: null
---

import LicenseTypes from '/snippets/_cloud-license-types.md';

В <Constant name="cloud" /> _лицензии_ используются для распределения пользователей в вашем аккаунте.

<LicenseTypes/>

Назначенная пользователю лицензия определяет, к каким конкретным возможностям он может получить доступ в <Constant name="cloud" />.

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
| Получение [уведомлений о Job’ах](/docs/deploy/job-notifications) |  ✅ |  ✅  |  ✅ |

*Доступно только на тарифах Starter, Enterprise и Enterprise+. IT‑лицензии ограничены 1 местом (seat) на аккаунт уровня Starter или Enterprise и не учитываются при подсчёте использования мест.

## Лицензии

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />

Каждый тариф <Constant name="cloud" /> включает базовое количество лицензий Developer, IT и Read-Only. Вы можете добавлять или удалять лицензии, изменяя количество пользователей в настройках аккаунта.

Если у вас аккаунт на тарифе Developer и вы хотите добавить больше людей в команду, вам потребуется перейти на тариф Starter. Подробнее о лицензиях, доступных в каждом тарифе, см. в разделе [dbt Pricing Plans](https://www.getdbt.com/pricing/).

В следующих вкладках описаны шаги по изменению количества пользовательских лицензий:

<Tabs>

<TabItem value="enterprise" label="Тарифы уровня Enterprise">

Если вы используете тариф уровня Enterprise и имеете соответствующие [права доступа](/docs/cloud/manage-access/enterprise-permissions), вы можете добавлять или удалять лицензии, изменяя количество пользовательских мест (seats). Обратите внимание: IT‑лицензия не учитывается при подсчёте используемых мест.

- Чтобы удалить пользователя, нажмите на имя аккаунта в левом меню, выберите **Account settings**, затем **Users**.
  - Выберите пользователя, которого хотите удалить, нажмите **Edit**, затем **Delete**.
  - Это действие невозможно отменить. Однако вы можете повторно пригласить пользователя с теми же данными, если удаление было выполнено по ошибке.<br />

- Чтобы добавить пользователя, перейдите в **Account Settings** и выберите **Users**.
  - Нажмите кнопку [**Invite Users**](/docs/cloud/manage-access/invite-users).
  - Для более детальной настройки прав доступа см. [Role based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control-).

</TabItem>

<TabItem value="starter" label="Тарифы Starter">

Если вы используете тариф Starter и имеете соответствующие [права доступа](/docs/cloud/manage-access/self-service-permissions), вы можете добавлять или удалять разработчиков.

Дополнительную информацию о количестве лицензий каждого типа, включённых в тариф Starter, см. в разделе [Self-service Starter account permissions](/docs/cloud/manage-access/self-service-permissions#licenses).

Вам потребуется внести два изменения:

- Изменить количество пользовательских мест для разработчиков, которое управляет пользователями, приглашёнными в ваш проект <Constant name="cloud" />.
- Изменить количество биллинговых мест для разработчиков, которое управляет числом оплачиваемых мест.

Вы можете добавлять или удалять разработчиков, увеличивая или уменьшая количество пользователей и биллинговых мест в настройках аккаунта:

<Tabs>
<TabItem value="addusers" label="Добавление пользователей">

Чтобы добавить пользователя в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора.

1. В <Constant name="cloud" /> нажмите на имя аккаунта в левом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" width="75%" title="Переход к Account settings" />

2. В **Account Settings** выберите **Billing**.
3. В разделе **Billing details** укажите нужное количество developer‑мест и убедитесь, что заполнены все платёжные данные, включая раздел **Billing address**. Если оставить эти поля пустыми, сохранить изменения не получится.
4. Нажмите **Update Payment Information**, чтобы сохранить изменения.

<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.png" width="75%" title="Переход в Account settings -> Billing для изменения количества биллинговых мест" />

После обновления биллинга вы можете [пригласить пользователей](/docs/cloud/manage-access/invite-users) в ваш аккаунт <Constant name="cloud" />:

Отличная работа! После выполнения этих шагов количество пользователей и количество биллинговых мест в <Constant name="cloud" /> должны совпадать.
</TabItem>

<TabItem value="deleteusers" label="Удаление пользователей">

Чтобы удалить пользователя в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора. Если у пользователя тип лицензии `developer`, это освободит его место для другого пользователя или позволит администраторам уменьшить общее количество мест.

1. В <Constant name="cloud" /> нажмите на имя аккаунта в левом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" width="85%" title="Переход к Account settings" />

2. В **Account settings** выберите **Users**.
3. Выберите пользователя, которого хотите удалить, затем нажмите **Edit**.
4. Нажмите **Delete** в левом нижнем углу. Нажмите **Confirm Delete**, чтобы немедленно удалить пользователя без дополнительных запросов пароля. Это действие невозможно отменить. Однако вы можете повторно пригласить пользователя с теми же данными, если удаление было выполнено по ошибке.

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

Лицензии могут назначаться пользователям индивидуально или через принадлежность к группам. Чтобы назначить лицензию через группу, вы можете вручную добавить пользователя в группу в процессе приглашения или назначить его в группу после того, как он зарегистрировался в <Constant name="cloud" />. В качестве альтернативы, при использовании [SSO configuration](/docs/cloud/manage-access/sso-overview) и [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control-) (только для тарифов Enterprise) пользователи могут автоматически назначаться в группы. По умолчанию новым пользователям аккаунта назначается лицензия Developer.

### Ручная настройка

Чтобы вручную назначить пользователю в вашей команде определённый тип лицензии, перейдите на страницу **Users** в **Account settings** и нажмите кнопку **Edit** у пользователя, которым вы хотите управлять. На этой странице вы можете выбрать тип лицензии и соответствующие группы для пользователя.

**Примечание:** у вас должна быть доступная лицензия для назначения пользователю. Если в аккаунте нет свободной лицензии, вам потребуется добавить лицензии в ваш тариф, чтобы завершить изменение типа лицензии.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-manual.png" width="55%" title="Ручное назначение лицензий"/>

### Настройка через маппинг <Lifecycle status="managed,managed_plus" />

Если ваш аккаунт подключён к провайдеру удостоверений (IdP) для [Single Sign On](/docs/cloud/manage-access/sso-overview), вы можете автоматически сопоставлять группы пользователей IdP с определёнными группами в <Constant name="cloud" /> и назначать типы лицензий этим группам. Для настройки маппинга лицензий перейдите в **Account Settings** > **Groups & Licenses** > **License Mappings**. Здесь вы можете создать или отредактировать SSO‑маппинги как для лицензий Read-Only, так и для Developer.

По умолчанию всем новым участникам аккаунта <Constant name="cloud" /> назначается лицензия Developer.
Чтобы назначать лицензии Read-Only определённым группам пользователей, создайте новый
License Mapping для типа лицензии Read-Only и укажите список
имён групп IdP, разделённых запятыми, которые должны получать лицензию Read-Only при входе в систему.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-mapping.png" width="65%" title="Настройка маппинга лицензий по группам IdP"/>

Примечания по использованию:
- Если группы IdP пользователя соответствуют маппингу как для Developer, так и для Read-Only,
  будет назначена лицензия Developer
- Если группы IdP пользователя не соответствуют _ни одному_ маппингу типов лицензий,
  будет назначена лицензия Developer
- Типы лицензий обновляются, когда пользователи входят в <Constant name="cloud" /> через Single Sign On.
  Изменения в маппингах типов лицензий вступят в силу при следующем входе пользователей
  в <Constant name="cloud" />.
- Маппинги типов лицензий основаны на _группах IdP_, а не на _группах <Constant name="cloud" />_, поэтому
  при настройке этой функции обязательно проверяйте членство в группах в вашем провайдере удостоверений.

## Детализированное управление правами

Тарифы уровня Enterprise в <Constant name="cloud" /> поддерживают ролевую модель доступа для настройки детализированных прав внутри приложения. Подробнее о правах доступа Enterprise см. в разделе [access control](/docs/cloud/manage-access/about-user-access).
