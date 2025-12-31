Разрешения:

* Разрешения на уровне аккаунта &mdash; Разрешения, связанные с управлением аккаунтом dbt Cloud. Например, выставление счетов и настройки аккаунта.
* Разрешения на уровне проекта &mdash; Разрешения, связанные с проектами в dbt Cloud. Например, репозитории и доступ к dbt Cloud IDE или dbt Cloud CLI.

* **Разрешения уровня аккаунта** &mdash; Разрешения, связанные с управлением аккаунтом <Constant name="cloud" />. Например, биллинг и настройки аккаунта.
* **Разрешения уровня проекта** &mdash; Разрешения, связанные с проектами в <Constant name="cloud" />. Например, репозитории и доступ к <Constant name="cloud_ide" /> или <Constant name="cloud_cli" />. 

:::note

Некоторые наборы разрешений имеют доступ только для чтения к настройкам окружений. Этот доступ может быть переопределён более привилегированным доступом, если пользователь назначен в группу с настроенным [Environment write access](/docs/cloud/manage-access/about-user-access#environment-write-access).

:::

### Разрешения аккаунта {#account-permissions}

Наборы разрешений уровня аккаунта позволяют управлять аккаунтом <Constant name="cloud" /> и его настройками (например, создавать service tokens, приглашать пользователей и настраивать SSO). Они также предоставляют разрешения на уровне проектов. Набор разрешений **Account Admin** является наивысшим уровнем доступа, который можно назначить.

* (W)rite &mdash; Создание нового или изменение существующего. Включает `отправку`, `создание`, `удаление`, `распределение`, `изменение` и `разработку`.
* (R)ead &mdash; Может просматривать, но не может создавать или изменять какие-либо поля.

* **(W)rite** &mdash; Создание новых или изменение существующих. Включает `send`, `create`, `delete`, `allocate`, `modify` и `develop`.
* **(R)ead** &mdash; Можно просматривать, но нельзя создавать или изменять какие‑либо поля.

#### Доступ к аккаунту для разрешений аккаунта {#account-access-for-account-permissions}

<FilterableTable>

| Разрешение на уровне аккаунта | Администратор аккаунта | Администратор биллинга | Управление приложениями маркетплейса | Создатель проектов | Администратор безопасности | Наблюдатель |
|:------------------------------|:----------------------:|:----------------------:|:------------------------------------:|:------------------:|:--------------------------:|:-----------:|
| Настройки аккаунта*           | W                      | -                      | -                                    | R                  | R                          | R           |
| Журналы аудита                | R                      | -                      | -                                    | -                  | R                          | R           |
| Провайдер аутентификации      | W                      | -                      | -                                    | -                  | W                          | R           |
| Биллинг                       | W                      | W                      | -                                    | -                  | -                          | R           |
| Подключения                   | W                      | -                      | -                                    | W                  | -                          | -           |
| Группы                        | W                      | -                      | -                                    | R                  | W                          | R           |
| Приглашения                   | W                      | -                      | -                                    | W                  | W                          | R           |
| Ограничения по IP             | W                      | -                      | -                                    | -                  | W                          | R           |
| Лицензии                      | W                      | -                      | -                                    | W                  | W                          | R           |
| Приложение маркетплейса       | -                      | -                      | W                                    | -                  | -                          | -           |
| Участники                     | W                      | -                      | -                                    | W                  | W                          | R           |
| Проект (создание)             | W                      | -                      | -                                    | W                  | -                          | -           |
| Публичные модели              | R                      | R                      | -                                    | R                  | R                          | R           |
| Сервисные токены              | W                      | -                      | -                                    | -                  | R                          | R           |
| Вебхуки                       | W                      | -                      | -                                    | -                  | -                          | -           |
</FilterableTable>

\* Наборы разрешений с правом записи (**W**) к настройкам учетной записи могут изменять настройки уровня учетной записи, включая [настройку уведомлений Slack](/docs/deploy/job-notifications#slack-notifications).

#### Доступ к проекту для разрешений уровня аккаунта {#project-access-for-account-permissions}

<FilterableTable>
| Разрешение уровня проекта    | Account Admin | Billing admin | Project creator | Security admin | Viewer |
|:-----------------------------|:-------------:|:-------------:|:---------------:|:--------------:|:------:|
| Environment credentials      | W             | -             | W               | -              | R      |
| Custom env. variables        | W             | -             | W               | -              | R      |
| Data platform configurations | W             | -             | W               | -              | R      |
| Develop (IDE or CLI)         | W             | -             | W               | -              | -      |
| Environments                 | W             | -             | W               | -              | R      |
| Jobs                         | W             | -             | W               | -              | R      |
| Metadata GraphQL API access  | R             | -             | R               | -              | R      |
| Permissions                  | W             | -             | W               | W              | R      |
| Projects                     | W             | -             | W               | R              | R      |
| Repositories                 | W             | -             | W               | -              | R      |
| Runs                         | W             | -             | W               | -              | R      |
| Semantic Layer config        | W             | -             | W               | v              | R      |
</FilterableTable>

### Разрешения проекта {#project-permissions}

Наборы разрешений проекта позволяют вам работать с проектами в разных ролях. В первую очередь они предоставляют доступ к разрешениям уровня проекта, таким как репозитории и <Constant name="cloud_ide" /> или <Constant name="cloud_cli" />, но также могут включать некоторые разрешения уровня аккаунта.

Ключ:

* **(W)rite** — создание новых или изменение существующих объектов. Включает `send`, `create`, `delete`, `allocate`, `modify` и `develop`.
* **(R)ead** — можно просматривать, но нельзя создавать или изменять какие‑либо поля.

#### Доступ уровня аккаунта для разрешений проекта {#account-access-for-project-permissions}

<FilterableTable>
| Разрешение уровня аккаунта | Admin | Analyst | Database admin | Developer | Git Admin | Job admin | Job runner  | Job viewer  | Metadata (Discovery API only) | Semantic Layer | Stakeholder/Read-Only | Team admin |
|----------------------------|:-----:|:-------:|:--------------:|:---------:|:---------:|:---------:|:-----------:|:-----------:|:--------:|:--------------:|:-----------:|:----------:| 
| Account settings           |   R   |    -    |      R         |     -     |     R     |     -     |     -       |      -      |    -     |        -       |      -      |     R      |
| Auth provider              |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Billing                    |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Connections                |   R   |    R    |      R         |     R     |     R     |     R     |     -       |      -      |    -     |        -       |      R      |     R      |
| Groups                     |   R   |    -    |      R         |     R     |     R     |     -     |     -       |      -      |    -     |        -       |      R      |     R      |
| Invitations                |   W   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |    -     |        -       |      R      |     R      |
| Licenses                   |   W   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |    -     |        -       |      -      |     R      |
| Members                    |   W   |    -    |      R         |     R     |     R     |     -     |     -       |      -      |    -     |        -       |      R      |     R      |
| Project (create)           |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Public models              |   R   |    R    |      R         |     R     |     R     |     R     |     -       |      R      |     R    |        R       |      R      |     R      |
| Service tokens             |   -   |    -    |      -         |     -     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Webhooks                   |   W   |    -    |      -         |     W     |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
</FilterableTable>

#### Доступ к проекту для разрешений проекта {#project-access-for-project-permissions}

<FilterableTable> 
|Project-level permission  | Admin | Analyst | Database admin | Developer | Fusion admin | Git Admin | Job admin | Job runner  | Job viewer  | Metadata (Discovery API only) | Semantic Layer | Stakeholder/Read-Only | Team admin |
|--------------------------|:-----:|:-------:|:--------------:|:---------:|:------------:|:---------:|:---------:|:-----------:|:-----------:|:---------------------------------------:|:--------------:|:-----------:|:----------:| 
| Environment credentials  |   W   |    R    |       W        |     R     |      -       |     R     |     W     |    -        |      -      |                  -                      |        -       |     R       |     R      |
| Custom env. variables    |   W   |    W#  |       W         |     W#    |      -       |     W     |     W     |     -       |      R      |                  -                      |        -       |     R       |     W      |
| Data platform configs    |   W   |    W    |       W        |     W     |      -       |     R     |     W     |     -       |      -      |                  -                      |       -        |     R       |     R      |
| Develop (IDE or CLI)     |   W   |    W    |       -        |     W     |      -       |     -     |     -     |     -       |      -      |                  -                      |       -        |     -       |      -     |
| Environments             |   W   |    R    |       R        |     R     |      -       |     R     |     W     |      -      |      R      |                  -                      |       -        |     R       |     R      |
| Fusion upgrade           |   -   |    -    |      -         |     -     |      W       |     -     |     -     |     -       |      -      |    -     |        -       |      -      |     -      |
| Jobs                     |   W   |    R*   |       R*       |     R*    |      -       |     R*    |     W     |      R      |      R      |                  -                      |       -        |     R       |     R*     |
| Metadata GraphQL API access| R   |    R    |       R        |     R     |      -       |     R     |     R     |      -      |      R      |                  R                      |       -        |     R       |     R      |
| Permissions              |   W   |    -    |       R        |     R     |      -       |     R     |     -     |      -      |      -      |                  -                      |       -        |     -       |     R      |
| Projects                 |   W   |    R    |       W        |     R     |      -       |     W     |     R     |      -      |      R      |                  -                      |       -        |     R       |     W      |
| Repositories             |   W   |   -     |       R        |     R     |      -       |     W     |     -     |      -      |      -      |                  -                      |       -        |     R       |     R      |
| Runs                     |   W   |    R*   |       R*       |     R*    |      -       |     R*    |     W     |      W      |      R      |                  -                      |       -        |     R       |     R*     |
| Semantic Layer config    |   W   |    R    |       W        |     R     |      -       |     R     |     R     |      -      |      -      |                  -                      |        W       |     R       |     R      |

</FilterableTable>

\* Эти разрешения по умолчанию являются `R`ead-only (только чтение), но могут быть изменены на `W`rite (запись) с помощью [environment permissions](/docs/cloud/manage-access/environment-permissions#environments-and-roles).

\# Пользовательские переменные окружения для ролей `Developer` и `Analyst` настраиваются в разделе **Credentials** в **Account settings**.
