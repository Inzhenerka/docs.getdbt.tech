---
title: Как удалить пользователя в dbt?
description: "Удаление пользователя в dbt"
sidebar_label: 'Как удалить пользователя'
id: delete-users

---

Чтобы удалить пользователя в <Constant name="dbt" />, необходимо быть владельцем аккаунта или обладать правами администратора. Если у пользователя тип лицензии `developer`, его удаление освободит место для другого пользователя или позволит администраторам уменьшить общее количество мест. 

1. В <Constant name="dbt" /> нажмите на название своего аккаунта в левом боковом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-platform/Navigate-to-account-settings.png" title="Переход к настройкам аккаунта" />

2. В разделе **Account settings** выберите **Users** в подразделе **Teams**.
3. Выберите пользователя, которого хотите удалить, затем нажмите **Edit**.
4. Нажмите **Delete** в левом нижнем углу. Затем нажмите **Confirm Delete**, чтобы немедленно удалить пользователя без дополнительных запросов пароля. Это действие нельзя отменить. Однако вы можете повторно пригласить пользователя с теми же данными, если удаление было выполнено по ошибке.

<Lightbox src="/img/docs/dbt-platform/delete_user.png" width="85%" title="Удаление пользователя" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>


<Lightbox src="/img/docs/dbt-platform/faq-account-settings-billing.png" width="85%" title="Перейдите в настройки аккаунта -> Пользователи, чтобы изменить пользователей dbt" />

## Связанные документы {#related-docs}

- [Лицензии <Constant name="dbt" />](/docs/platform/manage-access/seats-and-users#licenses)
