---
title: Как удалить пользователя в dbt?
description: "Удаление пользователя в dbt"
sidebar_label: 'Как удалить пользователя'
id: delete-users

---

Чтобы удалить пользователя в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора. Если у пользователя тип лицензии `developer`, его место станет доступно для другого пользователя, либо администраторы смогут уменьшить общее количество лицензий (seats).

1. В <Constant name="cloud" /> нажмите на название вашего аккаунта в левом боковом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" title="Navigate to account settings" />

2. В разделе **Account settings** выберите **Users** в подразделе **Teams**.
3. Выберите пользователя, которого хотите удалить, затем нажмите **Edit**.
4. Нажмите **Delete** в левом нижнем углу. Затем нажмите **Confirm Delete**, чтобы немедленно удалить пользователя без дополнительных запросов пароля. Это действие нельзя отменить. Однако вы можете повторно пригласить пользователя с теми же данными, если удаление было выполнено по ошибке.

<Lightbox src="/img/docs/dbt-cloud/delete_user.png" width="85%" title="Удаление пользователя" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>


<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.png" width="85%" title="Перейдите в Account settings → Users, чтобы изменить пользователей dbt" />

## Связанные документы

- [<Constant name="cloud" /> лицензии](/docs/cloud/manage-access/seats-and-users#licenses)
