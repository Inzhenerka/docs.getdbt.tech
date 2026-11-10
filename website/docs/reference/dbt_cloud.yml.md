---
title: "Файл dbt_cloud.yml"
id: dbt_cloud.yml
sidebar_label: "dbt_cloud.yml"
description: "Справочная информация о файле учётных данных dbt_cloud.yml, который используется CLI платформы dbt и расширением dbt для VS Code для подключения к платформе dbt."
pagination_next: null
availability: platform_login
---

Файл `dbt_cloud.yml` хранит учётные данные, которые инструменты dbt &mdash; такие как [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation), [расширение dbt для VS Code](/docs/about-dbt-extension) и другие &mdash; используют для аутентификации в <Constant name="dbt_platform" />. Вы можете скачать его из <Constant name="dbt_platform" /> и сохранить локально в каталоге `.dbt`.

На этой странице описаны:

- [Скачивание файла и настройка каталога `.dbt`](#download-dbt_cloudyml) для <Constant name="platform_cli" /> или расширения для VS Code
- [Обновление или переключение проектов](#update-or-switch-projects)
- [Структура файла](#file-structure) и справочник полей
- [Сопутствующий блок `dbt-cloud`](#the-dbt-cloud-block-in-dbt_projectyml) в `dbt_project.yml`

:::tip Храните этот файл в безопасности
Файл `dbt_cloud.yml` содержит ключи API. Храните его в безопасном месте и убедитесь, что вы _не добавляете_ его в систему контроля версий.
:::

## Скачивание dbt_cloud.yml {#download-dbt_cloudyml}
import DbtDirectoryFaq from '/snippets/_dbt-directory-faq.md';

Способ скачивания файла зависит от того, настраиваете ли вы [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) или [расширение dbt для VS Code](/docs/about-dbt-extension). Скачанный файл `dbt_cloud.yml` содержит ваш [персональный токен доступа (PAT)](/docs/dbt-apis/user-tokens).

1. В <Constant name="dbt_platform" /> выберите проект, с которым хотите работать. Для проекта уже должна быть настроена [среда разработки](/docs/dbt-platform-environments#create-a-development-environment).
2. Перейдите в **Account settings** → **Your profile**, затем выполните действия для своего инструмента:
  - <Constant name="platform_cli" />: перейдите в **CLI** → **Configure Cloud authentication** и нажмите **Download CLI configuration file**.
  - Расширение dbt для VS Code: перейдите в **VS Code Extension** → **Set up your credentials** и нажмите **Download credentials**.
3. Переместите файл в каталог `.dbt`. Если у вас ещё нет такого каталога, воспользуйтесь одним из следующих вариантов быстрой настройки (одной командой):
    <Tabs>
    <TabItem value="mac-linux" label="Mac / Linux">

    ```bash
    mkdir -p ~/.dbt && mv ~/Downloads/dbt_cloud.yml ~/.dbt/dbt_cloud.yml
    ```

    </TabItem>
    <TabItem value="windows" label="Windows">

    ```powershell
    mkdir %USERPROFILE%\.dbt 2>nul & move %USERPROFILE%\Downloads\dbt_cloud.yml %USERPROFILE%\.dbt\dbt_cloud.yml
    ```

    </TabItem>
    </Tabs>

   <Expandable alt_header="Создание и перемещение каталога .dbt вручную">

   <DbtDirectoryFaq />
    
   </Expandable>

    Если имя скачанного файла содержит числовой суффикс (например, `dbt_cloud(2).yml`), переименуйте его в `dbt_cloud.yml` перед перемещением. <Constant name="platform_cli" /> и расширение ищут файл только с этим точным именем.

4. Убедитесь, что `project-id` в [блоке `dbt-cloud` файла `dbt_project.yml`](#the-dbt-cloud-block-in-dbt_projectyml) соответствует проекту, с которым вы работаете. Это регистрирует ваш инструмент, подключает его к <Constant name="dbt_platform" /> и позволяет использовать такие возможности платформы, как <Constant name="mesh" /> и отложенное разрешение ссылок (deferral).

## Обновление или переключение проектов {#update-or-switch-projects}

Файл `dbt_cloud.yml` хранится локально на вашем компьютере и не обновляется автоматически. Обязательно скачивайте его заново в следующих случаях:

- Вы получили доступ к новому проекту и хотите работать с ним локально
- Проект удалён из вашей учётной записи или ваши права доступа к проекту изменились
- Ваш токен изменён или заменён в рамках ротации
- Хост вашей учётной записи изменился, например при переносе учётной записи в другой регион

Файл может содержать несколько проектов из одной учётной записи <Constant name="dbt_platform" />. Чтобы переключиться на другой проект, укажите в `context.active-project` значение `project-id` нужного проекта. Активный проект должен соответствовать одному из проектов, перечисленных в `projects`.

Если вы работаете с несколькими учётными записями <Constant name="dbt_platform" />, храните отдельный файл `dbt_cloud.yml` для каждой учётной записи и перемещайте нужный файл в каталог `.dbt`.

## Структура файла {#file-structure}

Файл `dbt_cloud.yml` имеет следующую структуру:

<File name="dbt_cloud.yml">

```yaml
version: "1"
context:
  active-host: your_active_host       # for example, "abc123.us1.dbt.com"
  active-project: your_project_id     # for example, "123456"
projects:
  - project-name: your_project_name
    project-id: your_project_id
    account-name: your_account_name
    account-id: your_account_id
    account-host: your_account_host   # for example, "abc123.us1.dbt.com"
    token-name: your_token_name       # for example, "cloud-cli-1234"
    token-value: your_token_value

  - project-name: your_project_name
    project-id: your_project_id
    account-name: your_account_name
    account-id: your_account_id
    account-host: your_account_host
    token-name: your_token_name
    token-value: your_token_value
```

</File>

Например, если у вас есть учётная запись Jaffle and wizard shop, ваш файл `dbt_cloud.yml` будет выглядеть следующим образом:

<File name="dbt_cloud.yml">

```yaml
version: "1"
context:
  active-host: "abc123.us1.dbt.com"
  active-project: "123456"
projects:
  - project-name: "Project 1"
    project-id: "123"
    account-name: "Jaffle and wizard shop" 
    account-id: "1"
    account-host: "abc123.us1.dbt.com"
    token-name: "cloud-cli-1091"
    token-value: "dbtu_token_value"            # this would be a longer token value
  - project-name: "Project 2"
    project-id: "456"
    account-name: "Jaffle and wizard shop"
    account-id: "1"
    account-host: "abc123.us1.dbt.com"
    token-name: "cloud-cli-1091"
    token-value: "dbtu_token_value"
  - project-name: "Project 3"
    project-id: "789"
    account-name: "Jaffle and wizard shop"
    account-id: "1"
    account-host: "abc123.us1.dbt.com"
    token-name: "cloud-cli-1091"
    token-value: "dbtu_token_value"
```
</File>

### Справочник полей

<SimpleTable>
  
| Поле | Обязательное | Описание |
|-------|----------|-------------|
| `version` | Да | Версия схемы файла. В настоящее время — `"1"`. |
| `context.active-host` | Да | Значение `account-host`, используемое по умолчанию. Его можно найти на странице **Account settings**. |
| `context.active-project` | Да | Значение `project-id` проекта, используемого по умолчанию при выполнении команд. Должно совпадать с одним из значений `project-id`, перечисленных в `projects`. |
| `context.defer-env-id` | Нет | Идентификатор среды, из которой следует использовать артефакты сборки при отложенном разрешении ссылок. Необязательное переопределение среды отложенного разрешения ссылок, заданной для проекта по умолчанию. Только для <Constant name="platform_cli" />. См. [Настройка отложенного разрешения ссылок](/docs/platform/about-defer#configure-deferral-environment-id). |
| `projects.project-name` | Да | Понятное человеку название проекта. |
| `projects.project-id` | Да | Идентификатор проекта в <Constant name="dbt_platform" />. Его можно найти в URL при просмотре проекта (например, `…/projects/123456`). |
| `projects.account-name` | Да | Понятное человеку название учётной записи. |
| `projects.account-id` | Да | Идентификатор учётной записи в <Constant name="dbt_platform" />. |
| `projects.account-host` | Да | Хост вашей учётной записи, например `cloud.getdbt.com`, `emea.dbt.com` или URL доступа к вашему однопользовательскому экземпляру (single-tenant). |
| `projects.token-name` | Да | Имя [персонального токена доступа (PAT)](/docs/dbt-apis/user-tokens). |
| `projects.token-value` | Да | Значение PAT. Обращайтесь с ним как с секретом. |

</SimpleTable>

## Блок dbt-cloud в dbt_project.yml {#the-dbt-cloud-block-in-dbt_projectyml}

Блок `dbt-cloud` — это сопутствующая конфигурация, которая находится в файле `dbt_project.yml` вашего проекта (а не в `dbt_cloud.yml`). Он сообщает <Constant name="platform_cli" />, <Constant name="studio_ide" /> и <Constant name="fusion" />, какому проекту в <Constant name="dbt_platform" /> соответствует ваш локальный проект.

<File name="dbt_project.yml">

```yaml
name:
version:
# Your project configs...

dbt-cloud:
  project-id: your_project_id
  defer-env-id: '123456'  # optional
```

</File>

<SimpleTable>

| Поле | Обязательное | Описание |
|-------|----------|-------------|
| `project-id` | Да | Идентификатор проекта в <Constant name="dbt_platform" />, которому соответствует этот локальный проект. Его можно найти в URL при просмотре проекта (например, `https://YOUR_ACCESS_URL/develop/26228/projects/123456` → `123456`). |
| `defer-env-id` | Нет | Идентификатор среды, из которой следует использовать артефакты сборки при отложенном разрешении ссылок. Используется для [автоматического отложенного разрешения ссылок](/docs/platform/about-defer) в <Constant name="fusion" /> и переопределения настроек отложенного разрешения ссылок в <Constant name="platform_cli" />. |
| `account_id` | Нет | Только для <Constant name="fusion" />. Идентификатор учётной записи <Constant name="dbt_platform" />, которой принадлежит этот локальный проект. Обратите внимание на символ подчёркивания &mdash; в отличие от других полей в этом блоке, здесь не используется дефис. |
</SimpleTable>

## Связанная документация
- [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation)
- [Расширение dbt для VS Code](/docs/about-dbt-extension)
- [`dbt_project.yml`](/reference/dbt_project.yml)
