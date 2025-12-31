---
title: "Настройка Dremio"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Dremio в dbt."
meta:
  maintained_by: Dremio
  authors: 'Dremio'
  github_repo: 'dremio/dbt-dremio'
  pypi_package: 'dbt-dremio'
  min_core_version: 'v1.8.0'
  cloud_support: Not Supported
  min_supported_version: 'Dremio 22.0'
  slack_channel_name: 'db-dremio'
  slack_channel_link: '[https://www.getdbt.com/community](https://getdbt.slack.com/archives/C049G61TKBK)'
  platform_name: 'Dremio'
  config_page: '/reference/resource-configs/no-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Следуйте по ссылке репозитория для получения информации о зависимостях ОС.

:::note 
[Model contracts](/docs/mesh/govern/model-contracts) не поддерживаются.
:::

## Предварительные условия для Dremio Cloud {#prerequisites-for-dremio-cloud}
Перед подключением проекта к Dremio Cloud выполните следующие предварительные шаги:
* Убедитесь, что у вас есть ID проекта Sonar, который вы хотите использовать. См. [Получение ID проекта](https://docs.dremio.com/cloud/cloud-entities/projects/#obtaining-the-id-of-a-project).
* Убедитесь, что у вас есть персональный токен доступа (PAT) для аутентификации в Dremio Cloud. См. [Создание токена](https://docs.dremio.com/cloud/security/authentication/personal-access-token/#creating-a-token).
* Убедитесь, что на системе, на которой вы запускаете dbt, установлена версия Python 3.9.x или более поздняя.


## Предварительные условия для Dremio Software {#prerequisites-for-dremio-software}

* Убедитесь, что вы используете версию 22.0 или более позднюю.
* Убедитесь, что на системе, на которой вы запускаете dbt, установлена версия Python 3.9.x или более поздняя.

* Если вы хотите использовать TLS для защиты соединения между dbt и Dremio Software, настройте полное шифрование сетевого трафика (full wire encryption) в вашем кластере Dremio. Инструкции см. в разделе <a target="_blank" rel="noopener noreferrer" href="https://docs.dremio.com/software/deployment/wire-encryption-config/">Configuring Wire Encryption</a>.


## Инициализация проекта {#initializing-a-project}

1. Выполните команду `dbt init <project_name>`.
2. Выберите `dremio` в качестве используемой базы данных.
3. Выберите один из следующих вариантов для генерации профиля вашего проекта:
    * `dremio_cloud` для работы с Dremio Cloud
    * `software_with_username_password` для работы с кластером Dremio Software и аутентификации в кластере с использованием имени пользователя и пароля
    * `software_with_pat` для работы с кластером Dremio Software и аутентификации в кластере с использованием персонального токена доступа

Далее настройте профиль для вашего проекта.

## Профили {#profiles}

Когда вы инициализируете проект, вы создаете один из этих трех профилей. Вы должны настроить его перед попыткой подключения к Dremio Cloud или Dremio Software.

* Профиль для Dremio Cloud
* Профиль для Dremio Software с аутентификацией по имени пользователя/паролю
* Профиль для Dremio Software с аутентификацией через персональный токен доступа

Для описания конфигураций в этих профилях см. [Конфигурации](#configurations).

<Tabs
  defaultValue="cloud"
  values={[
    {label: 'Cloud',
  value: 'cloud'},
    {label: 'Software (Имя пользователя/Пароль)',
  value: 'software1'},
    {label: 'Software (Персональный токен доступа)',
  value: 'software2'}
    ]}
>

<TabItem value="cloud">

```yaml
[project name]:
  outputs:
    dev:
      cloud_host: api.dremio.cloud
      cloud_project_id: [project ID]
      object_storage_source: [name]
      object_storage_path: [path]
      dremio_space: [name]
      dremio_space_folder: [path]
      pat: [personal access token]
      threads: [integer >= 1]
      type: dremio
      use_ssl: true
      user: [email address]
  target: dev
```

</TabItem>

<TabItem value="software1">

```yaml
[project name]:
  outputs:
    dev:
      password: [password]
      port: [port]
      software_host: [hostname or IP address]
      object_storage_source: [name
      object_storage_path: [path]
      dremio_space: [name]
      dremio_space_folder: [path]
      threads: [integer >= 1]
      type: dremio
      use_ssl: [true|false]
      user: [username]
  target: dev
```

</TabItem>

<TabItem value="software2">

```yaml
[project name]:
  outputs:
    dev:
      pat: [personal access token]
      port: [port]
      software_host: [hostname or IP address]
      object_storage_source: [name
      object_storage_path: [path]
      dremio_space: [name]
      dremio_space_folder: [path]
      threads: [integer >= 1]
      type: dremio
      use_ssl: [true|false]
      user: [username]
  target: dev
```

</TabItem>
</Tabs>

## Общие конфигурации для профилей Dremio Cloud и Dremio Software {#configurations-common-to-profiles-for-dremio-cloud-and-dremio-software}

| Конфигурация | Обязательна? | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `type` | Да | dremio | Автоматически заполняется при создании проекта Dremio. Не изменяйте это значение.  |
| `threads` | Да | 1 | Количество потоков, на которых выполняется проект dbt. |
| `object_storage_source` | Нет | $scratch | Имя файловой системы, в которой создаются таблицы, материализованные представления, тесты и другие объекты. Псевдоним dbt — `datalake`. Это имя соответствует имени источника в разделе **Object Storage** на странице Datasets в Dremio, которое в следующем изображении называется "Samples":  ![dbt samples path](/img/reference/dremio-setup/dbt-Samples.png) |
| `object_storage_path` | Нет | `no_schema` | Путь в файловой системе, в котором создаются объекты. По умолчанию это корневой уровень файловой системы. Псевдоним dbt — `root_path`. Вложенные папки в пути разделяются точками. Это значение соответствует пути в этом месте на странице Datasets в Dremio, которое в следующем изображении называется "samples.dremio.com.Dremio University": ![dbt samples path](/img/reference/dremio-setup/dbt-SamplesPath.png) |
| `dremio_space` | Нет | `@\<username>` | Значение пространства Dremio, в котором создаются представления. Псевдоним dbt — `database`. Это значение соответствует имени в этом месте в разделе **Spaces** на странице Datasets в Dremio:  ![dbt spaces](/img/reference/dremio-setup/dbt-Spaces.png) |
| `dremio_space_folder` | Нет | `no_schema` | Папка в пространстве Dremio, в которой создаются представления. По умолчанию это верхний уровень в пространстве. Псевдоним dbt — `schema`. Вложенные папки разделяются точками. Это значение соответствует пути в этом месте на странице Datasets в Dremio, которое в следующем изображении называется `Folder1.Folder2`:  ![Folder1.Folder2](/img/reference/dremio-setup/dbt-SpacesPath.png) |

### Конфигурации в профилях для Dremio Cloud {#configurations-in-profiles-for-dremio-cloud}

| Конфигурация | Обязательна? | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `cloud_host` | Да | `api.dremio.cloud` | Контрольная плоскость США: `api.dremio.cloud`<br></br>Контрольная плоскость ЕС: `api.eu.dremio.cloud` |
| `user` | Да | Нет | Адрес электронной почты, используемый в качестве имени пользователя в Dremio Cloud | 
| `pat` | Да | Нет | Персональный токен доступа для аутентификации. См. [Персональные токены доступа](https://docs.dremio.com/cloud/security/authentication/personal-access-token/) для получения инструкций о получении токена. | 
| `cloud_project_id` | Да | Нет | ID проекта Sonar, в котором выполняются преобразования. | 
| `use_ssl` | Да | `true` | Значение должно быть `true`. |
    
### Конфигурации в профилях для Dremio Software {#configurations-in-profiles-for-dremio-software}
| Конфигурация | Обязательна? | Значение по умолчанию | Описание | 
| ---  | ---  | ---  | ---  | 
| `software_host` | Yes | None | Имя хоста или IP-адрес координаторного узла кластера Dremio. | 
| `port` | Yes | `9047` | Порт для API‑эндпоинтов кластера Dremio Software. | 
| `user` | Yes | None | Имя пользователя учетной записи, которая используется для входа в кластер Dremio. | 
170 | | `password` | Да, если вы не используете конфигурацию pat. | Нет. | Пароль учетной записи, которая используется для входа в кластер Dremio. | 
171 | | `pat` | Да, если вы не используете конфигурации user и password. | Нет. | Персональный токен доступа, используемый для аутентификации в Dremio. Инструкции по получению токена см. в разделе [Personal Access Tokens](https://docs.dremio.com/software/security/personal-access-tokens/). Использование персонального токена доступа имеет приоритет, если указаны значения для трех параметров `user`, `password` и `pat`. | 
| `use_ssl` | Yes | `true` | Допустимые значения — `true` и `false`. Если значение установлено в `true`, убедитесь, что в вашем кластере Dremio настроено полное шифрование соединения. См. раздел [Prerequisites for Dremio Software](#prerequisites-for-dremio-software). |
