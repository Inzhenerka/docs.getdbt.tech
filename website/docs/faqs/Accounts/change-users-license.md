---
title: How do I change a user license type to read-only in dbt?
description: "Изменение типа лицензии пользователя на read-only в dbt"
sidebar_label: 'Как изменить тип лицензии пользователя на read-only'
id: change-user-license

---

Чтобы изменить тип лицензии пользователя с `developer` на `read-only` или `IT` в <Constant name="cloud" />, вы должны быть владельцем аккаунта или иметь права администратора. Обычно это делают, чтобы освободить платное место, сохранив при этом пользователю доступ к просмотру информации в аккаунте <Constant name="cloud" />.

1. В <Constant name="cloud" /> нажмите на имя вашего аккаунта в левом боковом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" title="Перейдите в настройки аккаунта" />

2. В **Account Settings** выберите **Users** в разделе **Teams**.
3. Выберите пользователя, которого хотите изменить, и нажмите **Edit** внизу его профиля.
4. Для опции **License** выберите **Read-only** или **IT** (вместо **Developer**) и нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/change_user_to_read_only_20221023.gif" title="Изменение типа лицензии пользователя" />

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />
