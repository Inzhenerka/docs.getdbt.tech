---
title: "Как изменить тип лицензии пользователя dbt на доступ только для чтения?"
description: "Изменение типа лицензии пользователя на read-only в dbt"
sidebar_label: 'Как изменить тип лицензии пользователя на read-only'
id: change-user-license

---

Чтобы изменить тип лицензии пользователя с `developer` на `read-only` или `IT` в <Constant name="dbt" />, вы должны быть владельцем аккаунта или обладать правами администратора. Это может понадобиться, чтобы освободить оплачиваемое место, сохранив при этом пользователю доступ к просмотру информации в аккаунте <Constant name="dbt" />.

1. В <Constant name="dbt" /> нажмите на название своего аккаунта в левом боковом меню и выберите **Настройки аккаунта**.

<Lightbox src="/img/docs/dbt-platform/Navigate-to-account-settings.png" title="Переход к настройкам аккаунта" />

2. В **Account Settings** выберите **Users** в разделе **Teams**.
3. Выберите пользователя, которого хотите изменить, и нажмите **Edit** внизу его профиля.
4. Для опции **License** выберите **Read-only** или **IT** (вместо **Developer**) и нажмите **Save**.

<Lightbox src="/img/docs/dbt-platform/change_user_to_read_only_20221023.gif" title="Изменение типа лицензии пользователя" />

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />
