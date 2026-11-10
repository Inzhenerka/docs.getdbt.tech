---
title: "Подключение Dremio к dbt v1"
sidebar_label: "Dremio"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища данных Dremio в dbt."
meta:
  maintained_by: Dremio
  authors: 'Dremio'
  github_repo: 'dremio/dbt-dremio'
  pypi_package: 'dbt-dremio'
  min_core_version: 'v1.8.0'
  cloud_support: Not Supported
  min_supported_version: 'Dremio 22.0'
  slack_channel_name: 'db-dremio'
  slack_channel_link: 'https://getdbt.slack.com/archives/C049G61TKBK'
  platform_name: 'Dremio'
  config_page: '/reference/resource-configs/no-configs'
availability: local_free
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

Для описания конфигураций в этих профилях см. [Конфигурации](#profiles).

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
| `type` | Да | dremio | Заполняется автоматически при создании проекта Dremio. Не изменяйте это значение.  |
| `threads` | Да | 1 | Количество потоков, используемых для выполнения проекта dbt. |
| `object_storage_source` | Нет | $scratch | Имя файловой системы, в которой будут создаваться таблицы, материализованные представления, тесты и другие объекты. Псевдоним в dbt — `datalake`. Это имя соответствует имени источника в разделе **Object Storage** на странице Datasets в Dremio; на следующем изображении это "Samples":  <Lightbox src="/img/reference/dremio-setup/dbt-Samples.png" title="Путь к примерам dbt" /> |
| `object_storage_path` | Нет | `no_schema` | Путь в файловой системе, в котором будут создаваться объекты. По умолчанию используется корневой уровень файловой системы. Псевдоним в dbt — `root_path`. Вложенные папки в пути разделяются точками. Это значение соответствует пути в указанном месте на странице Datasets в Dremio; на следующем изображении это "samples.dremio.com.Dremio University": <Lightbox src="/img/reference/dremio-setup/dbt-SamplesPath.png" title="Путь к примерам dbt" /> |
| `dremio_space` | Нет | `@\<username>` | Имя пространства Dremio, в котором будут создаваться представления. Псевдоним в dbt — `database`. Это значение соответствует имени в указанном месте в разделе **Spaces** на странице Datasets в Dremio:  <Lightbox src="/img/reference/dremio-setup/dbt-Spaces.png" title="Пространства dbt" /> |
| `dremio_space_folder` | Нет | `no_schema` | Папка в пространстве Dremio, в которой будут создаваться представления. По умолчанию используется верхний уровень пространства. Псевдоним в dbt — `schema`. Вложенные папки разделяются точками. Это значение соответствует пути в указанном месте на странице Datasets в Dremio; на следующем изображении это `Folder1.Folder2`:  <Lightbox src="/img/reference/dremio-setup/dbt-SpacesPath.png" title="Folder1.Folder2" /> |

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
| `software_host` | Да | Нет | Имя хоста или IP-адрес узла-координатора кластера Dremio. | 
| `port` | Да | `9047` | Порт конечных точек API кластера Dremio Software. | 
| `user` | Да | Нет | Имя пользователя учётной записи для входа в кластер Dremio. | 
| `password` | Да, если не используется параметр pat. | Нет | Пароль учётной записи для входа в кластер Dremio. | 
| `pat` | Да, если не используются параметры user и password. | Нет | Персональный токен доступа для аутентификации в Dremio. Инструкции по получению токена см. в разделе [Персональные токены доступа](https://docs.dremio.com/software/security/personal-access-tokens/). Если указаны значения всех трёх параметров user, password и pat, приоритет имеет персональный токен доступа. | 
| `use_ssl` | Да | `true` | Допустимые значения: `true` и `false`. Если установлено значение true, убедитесь, что в кластере Dremio настроено полное шифрование передаваемых данных. См. раздел [Предварительные требования для Dremio Software](#prerequisites-for-dremio-software). |
