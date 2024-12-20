---
title: "Настройка Dremio"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Dremio в dbt."
meta:
  maintained_by: Dremio
  authors: 'Dremio (ранее Fabrice Etanchaud)'
  github_repo: 'dremio/dbt-dremio'
  pypi_package: 'dbt-dremio'
  min_core_version: 'v1.2.0'
  cloud_support: Не поддерживается
  min_supported_version: 'Dremio 22.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Dremio'
  config_page: '/reference/resource-configs/no-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Следуйте по ссылке репозитория для получения информации о зависимостях ОС.

:::note 
[Контракты моделей](/docs/collaborate/govern/model-contracts) не поддерживаются.
:::

## Предварительные условия для Dremio Cloud
Перед подключением проекта к Dremio Cloud выполните следующие предварительные шаги:
* Убедитесь, что у вас есть ID проекта Sonar, который вы хотите использовать. См. [Получение ID проекта](https://docs.dremio.com/cloud/cloud-entities/projects/#obtaining-the-id-of-a-project).
* Убедитесь, что у вас есть персональный токен доступа (PAT) для аутентификации в Dremio Cloud. См. [Создание токена](https://docs.dremio.com/cloud/security/authentication/personal-access-token/#creating-a-token).
* Убедитесь, что на системе, на которой вы запускаете dbt, установлена версия Python 3.9.x или более поздняя.


## Предварительные условия для Dremio Software

* Убедитесь, что вы используете версию 22.0 или более позднюю.
* Убедитесь, что на системе, на которой вы запускаете dbt, установлена версия Python 3.9.x или более поздняя.
* Включите эти ключи поддержки в вашем кластере Dremio:
  * `dremio.iceberg.enabled`
  * `dremio.iceberg.ctas.enabled`
  * `dremio.execution.support_unlimited_splits`

  См. <a target="_blank" rel="noopener noreferrer" href="https://docs.dremio.com/software/advanced-administration/support-settings/#support-keys">Ключи поддержки</a> в документации Dremio для получения инструкций.
* Если вы хотите использовать TLS для защиты соединения между dbt и Dremio Software, настройте полное шифрование канала в вашем кластере Dremio. Для инструкций см. <a target="_blank" rel="noopener noreferrer" href="https://docs.dremio.com/software/deployment/wire-encryption-config/">Настройка шифрования канала</a>.


## Инициализация проекта

1. Выполните команду `dbt init <project_name>`.
2. Выберите `dremio` в качестве используемой базы данных.
3. Выберите один из следующих вариантов для генерации профиля вашего проекта:
    * `dremio_cloud` для работы с Dremio Cloud
    * `software_with_username_password` для работы с кластером Dremio Software и аутентификации в кластере с использованием имени пользователя и пароля
    * `software_with_pat` для работы с кластером Dremio Software и аутентификации в кластере с использованием персонального токена доступа

Далее настройте профиль для вашего проекта.

## Профили

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
      cloud_host: https://api.dremio.cloud
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

## Общие конфигурации для профилей Dremio Cloud и Dremio Software

| Конфигурация | Обязательна? | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `type` | Да | dremio | Автоматически заполняется при создании проекта Dremio. Не изменяйте это значение.  |
| `threads` | Да | 1 | Количество потоков, на которых выполняется проект dbt. |
| `object_storage_source` | Нет | $scratch | Имя файловой системы, в которой создаются таблицы, материализованные представления, тесты и другие объекты. Псевдоним dbt — `datalake`. Это имя соответствует имени источника в разделе **Object Storage** на странице Datasets в Dremio, которое в следующем изображении называется "Samples":  ![dbt samples path](/img/reference/dremio-setup/dbt-Samples.png) |
| `object_storage_path` | Нет | `no_schema` | Путь в файловой системе, в котором создаются объекты. По умолчанию это корневой уровень файловой системы. Псевдоним dbt — `root_path`. Вложенные папки в пути разделяются точками. Это значение соответствует пути в этом месте на странице Datasets в Dremio, которое в следующем изображении называется "samples.dremio.com.Dremio University": ![dbt samples path](/img/reference/dremio-setup/dbt-SamplesPath.png) |
| `dremio_space` | Нет | `@\<username>` | Значение пространства Dremio, в котором создаются представления. Псевдоним dbt — `database`. Это значение соответствует имени в этом месте в разделе **Spaces** на странице Datasets в Dremio:  ![dbt spaces](/img/reference/dremio-setup/dbt-Spaces.png) |
| `dremio_space_folder` | Нет | `no_schema` | Папка в пространстве Dremio, в которой создаются представления. По умолчанию это верхний уровень в пространстве. Псевдоним dbt — `schema`. Вложенные папки разделяются точками. Это значение соответствует пути в этом месте на странице Datasets в Dremio, которое в следующем изображении называется `Folder1.Folder2`:  ![Folder1.Folder2](/img/reference/dremio-setup/dbt-SpacesPath.png) |

### Конфигурации в профилях для Dremio Cloud

| Конфигурация | Обязательна? | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `cloud_host` | Да | `https://api.dremio.cloud` | Контрольная плоскость США: `https://api.dremio.cloud`<br></br>Контрольная плоскость ЕС: `https://api.eu.dremio.cloud` |
| `user` | Да | Нет | Адрес электронной почты, используемый в качестве имени пользователя в Dremio Cloud | 
| `pat` | Да | Нет | Персональный токен доступа для аутентификации. См. [Персональные токены доступа](https://docs.dremio.com/cloud/security/authentication/personal-access-token/) для получения инструкций о получении токена. | 
| `cloud_project_id` | Да | Нет | ID проекта Sonar, в котором выполняются преобразования. | 
| `use_ssl` | Да | `true` | Значение должно быть `true`. |
    
### Конфигурации в профилях для Dremio Software
| Конфигурация | Обязательна? | Значение по умолчанию | Описание | 
| ---  | ---  | ---  | ---  | 
| `software_host` | Да | Нет | Имя хоста или IP-адрес координаторного узла кластера Dremio. | 
| `port` | Да | `9047` | Порт для конечных точек API кластера Dremio Software. | 
| `user` | Да | Нет | Имя пользователя учетной записи, используемой для входа в кластер Dremio. | 
| `password` | Да, если вы не используете конфигурацию pat. | Нет | Пароль учетной записи, используемой для входа в кластер Dremio. | 
| `pat` | Да, если вы не используете конфигурации user и password. | Нет | Персональный токен доступа для аутентификации в Dremio. См. [Персональные токены доступа](https://docs.dremio.com/software/security/personal-access-tokens/) для получения инструкций о получении токена. Использование персонального токена доступа имеет приоритет, если указаны значения для трех конфигураций user, password и pat. | 
| `use_ssl` | Да | `true` | Допустимые значения: `true` и `false`. Если значение установлено в true, убедитесь, что в вашем кластере Dremio настроено полное шифрование канала. См. [Предварительные условия для Dremio Software](#prerequisites-for-dremio-software). | 
