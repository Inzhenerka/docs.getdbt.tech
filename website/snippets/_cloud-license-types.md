В <Constant name="cloud" /> существует четыре типа лицензий:

- **Analyst** &mdash; доступна только на тарифах [Enterprise и Enterprise+](https://www.getdbt.com/pricing). Требует приобретения лицензии developer seat.
  - Пользователю могут быть назначены _любые_ permission sets.
- **Developer** &mdash; пользователю могут быть назначены _любые_ permission sets.
- **IT** &mdash; доступна только на тарифах [Starter, Enterprise и Enterprise+](https://www.getdbt.com/pricing). Пользователь получает permission sets Security Admin и Billing Admin. См. [permissions](/docs/cloud/manage-access/enterprise-permissions#permission-sets).
  - Может управлять пользователями, группами, подключениями и лицензиями, а также выполнять другие действия.
  - _Пользователи с лицензией IT не наследуют права из каких-либо permission sets_.
  - Каждый пользователь с лицензией IT имеет одинаковый уровень доступа ко всему аккаунту, независимо от назначенных group permissions.
- **Read-Only** &mdash; доступна только на тарифах [Starter, Enterprise и Enterprise+](https://www.getdbt.com/pricing).
  - Пользователь получает права только на чтение для всех ресурсов <Constant name="cloud" />.
  - Предназначена для просмотра [artifacts](/docs/deploy/artifacts) и раздела [deploy](/docs/deploy/deployments) (jobs, runs, schedules) в аккаунте <Constant name="cloud" />, без возможности вносить изменения.
  - _Пользователи с лицензией Read-only не наследуют права из каких-либо permission sets_.
  - Каждый пользователь с лицензией Read-only имеет одинаковый уровень доступа ко всему аккаунту, независимо от назначенных group permissions.
