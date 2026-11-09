В <Constant name="dbt" /> есть четыре типа лицензий:

- **Analyst**\* &mdash; Доступна [только на тарифах Enterprise и Enterprise+](https://www.getdbt.com/pricing).
  - Пользователю можно назначить _любые_ наборы разрешений.
  - \* [Лицензия типа Analyst](/docs/platform/manage-access/about-user-access?version=1.12#licenses) недоступна для новых покупок.
- **Developer** &mdash; Пользователю можно назначить _любые_ наборы разрешений.
- **IT** &mdash; Доступна [только на тарифах Starter, Enterprise и Enterprise+](https://www.getdbt.com/pricing). Пользователю назначаются [разрешения](/docs/platform/manage-access/enterprise-permissions#permission-sets) Security Admin и Billing Admin, а также разрешения на редактирование **Connections** на странице **Account settings**.
  - Среди прочего, пользователь может управлять пользователями, группами, подключениями и лицензиями.
  - _Пользователи с лицензией IT не наследуют права из каких-либо наборов разрешений_.
  - У всех пользователей с лицензией IT одинаковый доступ ко всему аккаунту, независимо от назначенных разрешений групп.
- **Read-Only** &mdash; Доступна [только на тарифах Starter, Enterprise и Enterprise+](https://www.getdbt.com/pricing).
  - Пользователю предоставляются разрешения только на чтение для всех ресурсов <Constant name="dbt" />.
  - Предназначена для просмотра [артефактов](/docs/deploy/artifacts) и раздела [развёртывания](/docs/deploy/deployments) (задания, запуски, расписания) в аккаунте <Constant name="dbt" />, но не позволяет вносить изменения.
  - _Пользователи с лицензией Read-Only не наследуют права из каких-либо наборов разрешений_.
  - У всех пользователей с лицензией Read-Only одинаковый доступ ко всему аккаунту, независимо от назначенных разрешений групп.

\* [Лицензия типа Analyst](/docs/platform/manage-access/about-user-access?version=1.12#licenses) недоступна для новых покупок.
