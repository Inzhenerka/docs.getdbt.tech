---
title: Настройка и использование dbt Cloud CLI
id: configure-cloud-cli
description: "Инструкции по настройке dbt Cloud CLI"
sidebar_label: "Настройка и использование"
pagination_next: null
---

Узнайте, как настроить dbt Cloud CLI для вашего проекта в dbt Cloud, чтобы выполнять команды dbt, такие как `dbt environment show` для просмотра конфигурации dbt Cloud или `dbt compile` для компиляции вашего проекта и проверки моделей и тестов. Вы также получите следующие преимущества:

- Безопасное хранение учетных данных на платформе dbt Cloud.
- [Автоматическая отсрочка](/docs/cloud/about-cloud-develop-defer) артефактов сборки в производственную среду вашего Cloud проекта.
- Более быстрые и менее затратные сборки.
- Поддержка dbt Mesh ([межпроектные ссылки](/docs/collaborate/govern/project-dependencies)) и многое другое.

## Предварительные условия

- Вы должны настроить проект в dbt Cloud.
  - **Примечание** &mdash; Если вы используете dbt Cloud CLI, вы можете подключиться к вашей [платформе данных](/docs/cloud/connect-data-platform/about-connections) напрямую в интерфейсе dbt Cloud и вам не нужен файл [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml).
- Вы должны иметь [учетные данные для личной разработки](/docs/dbt-cloud-environments#set-developer-credentials) для этого проекта. dbt Cloud CLI будет использовать эти учетные данные, хранящиеся безопасно в dbt Cloud, для связи с вашей платформой данных.
- Вы должны использовать dbt версии 1.5 или выше. Обратитесь к [версиям dbt Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud) для обновления.

## Настройка dbt Cloud CLI

После установки dbt Cloud CLI вам нужно настроить его для подключения к проекту в dbt Cloud.

1. В dbt Cloud перейдите в раздел **Develop** и нажмите **Configure dbt Cloud CLI**, чтобы скачать файл учетных данных `dbt_cloud.yml`.

    <details>
    <summary>URL-адреса регионов для загрузки учетных данных</summary>
    Вы также можете скачать учетные данные по ссылкам, предоставленным в зависимости от вашего региона:

    - Северная Америка: <a href="https://cloud.getdbt.com/cloud-cli">https://cloud.getdbt.com/cloud-cli</a>
    - EMEA: <a herf="https://emea.dbt.com/cloud-cli">https://emea.dbt.com/cloud-cli</a>
    - APAC: <a href="https://au.dbt.com/cloud-cli">https://au.dbt.com/cloud-cli</a>
    - Североамериканская ячейка 1: <code>https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli</code>
    - Однопользовательский: <code>https://YOUR_ACCESS_URL/cloud-cli</code>

    </details>

2. Сохраните файл `dbt_cloud.yml` в директории `.dbt`, которая хранит вашу конфигурацию dbt Cloud CLI. Храните его в безопасном месте, так как он содержит API-ключи. Ознакомьтесь с [Часто задаваемыми вопросами](#faqs), чтобы узнать, как создать директорию `.dbt` и переместить файл `dbt_cloud.yml`.

3. Следуйте инструкциям в баннере и скачайте файл конфигурации в:
   - Mac или Linux:  `~/.dbt/dbt_cloud.yml`
   - Windows:  `C:\Users\yourusername\.dbt\dbt_cloud.yml`  

  Файл конфигурации выглядит следующим образом:

  ```yaml
  version: "1"
  context:
    active-project: "<project id from the list below>"
    active-host: "<active host from the list>"
    defer-env-id: "<optional defer environment id>"
  projects:
    - project-name: "<project-name>"
      project-id: "<project-id>"
      account-name: "<account-name>"
      account-id: "<account-id>"
      account-host: "<account-host>" # например, "cloud.getdbt.com"
      token-name: "<pat-or-service-token-name>"
      token-value: "<pat-or-service-token-value>"
  
    - project-name: "<project-name>"
      project-id: "<project-id>"
      account-name: "<account-name>"
      account-id: "<account-id>"
      account-host: "<account-host>" # например, "cloud.getdbt.com"
      token-name: "<pat-or-service-token-name>"
      token-value: "<pat-or-service-token-value>"  
  ```

3. После загрузки файла конфигурации и создания директории перейдите к проекту dbt в вашем терминале:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

4. В вашем файле `dbt_project.yml` убедитесь, что у вас есть или добавьте секцию `dbt-cloud` с полем `project-id`. Поле `project-id` содержит ID проекта dbt Cloud, который вы хотите использовать.

    ```yaml
    # dbt_project.yml
    name:
    version:
    # Ваши конфигурации проекта...

    dbt-cloud: 
        project-id: PROJECT_ID
    ```

   - Чтобы найти ID вашего проекта, выберите **Develop** в навигационном меню dbt Cloud. Вы можете использовать URL-адрес, чтобы найти ID проекта. Например, в `https://YOUR_ACCESS_URL/develop/26228/projects/123456` ID проекта — `123456`.

5. Теперь вы должны быть в состоянии [использовать dbt Cloud CLI](#use-the-dbt-cloud-cli) и выполнять [команды dbt](/reference/dbt-commands), такие как [`dbt environment show`](/reference/commands/dbt-environment) для просмотра деталей конфигурации dbt Cloud или `dbt compile` для компиляции моделей в вашем проекте dbt.

С вашим репозиторием, клонированным заново, вы можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

## Установка переменных окружения

Чтобы установить переменные окружения в dbt Cloud CLI для вашего проекта dbt:

1. В dbt Cloud нажмите на имя вашего аккаунта в левом боковом меню и выберите **Account settings**.
2. В разделе **Your profile** выберите **Credentials**.
3. Нажмите на ваш проект и прокрутите до раздела **Environment variables**.
4. Нажмите **Edit** в правом нижнем углу и затем установите переменные окружения на уровне пользователя.  

## Использование dbt Cloud CLI

dbt Cloud CLI использует тот же набор [команд dbt](/reference/dbt-commands) и [команд MetricFlow](/docs/build/metricflow-commands), что и dbt Core, для выполнения предоставленных вами команд. Например, используйте команду [`dbt environment`](/reference/commands/dbt-environment) для просмотра деталей конфигурации dbt Cloud. С помощью dbt Cloud CLI вы можете:

- Выполнять [несколько вызовов параллельно](/reference/dbt-commands) и обеспечивать [безопасный параллелизм](/reference/dbt-commands#parallel-execution), который в настоящее время не гарантируется `dbt-core`.
- Автоматически откладывать артефакты сборки в производственную среду вашего Cloud проекта.
- Поддерживать [зависимости проектов](/docs/collaborate/govern/project-dependencies), что позволяет вам зависеть от другого проекта, используя сервис метаданных в dbt Cloud. 
  - Зависимости проектов мгновенно подключаются и ссылаются (или `ref`) на публичные модели, определенные в других проектах. Вам не нужно выполнять или анализировать эти модели самостоятельно. Вместо этого вы рассматриваете их как API, который возвращает набор данных.
 
:::tip Используйте флаг <code>--help</code>
Как совет, большинство инструментов командной строки имеют флаг `--help`, чтобы показать доступные команды и аргументы. Используйте флаг `--help` с dbt двумя способами:
- `dbt --help`: Показывает доступные команды для dbt<br />
- `dbt run --help`: Показывает доступные флаги для команды `run`
:::
 
### Линтинг SQL файлов 

С помощью dbt Cloud CLI вы можете вызвать [SQLFluff](https://sqlfluff.com/), который является модульным и настраиваемым линтером SQL, предупреждающим вас о сложных функциях, синтаксисе, форматировании и ошибках компиляции. Многие из тех же флагов, которые вы можете передать SQLFluff, доступны из dbt Cloud CLI.

Доступные команды SQLFluff:

- `lint` &mdash; Линтинг SQL файлов, передавая список файлов или из стандартного ввода (stdin).
- `fix` &mdash; Исправление SQL файлов.
- `format` &mdash; Автоформатирование SQL файлов.

Чтобы выполнить линтинг SQL файлов, выполните команду следующим образом:  

```shell
dbt sqlfluff lint [PATHS]... [flags]
```

Если путь не указан, dbt выполняет линтинг всех SQL файлов в текущем проекте. Чтобы выполнить линтинг конкретного SQL файла или директории, укажите `PATHS` как путь к SQL файлу(ам) или директории файлов. Чтобы выполнить линтинг нескольких файлов или директорий, передайте несколько флагов `PATHS`.  

Чтобы показать подробную информацию о всех поддерживаемых dbt командах и флагах, выполните команду `dbt sqlfluff -h`. 

#### Соображения

При выполнении `dbt sqlfluff` из dbt Cloud CLI важно учитывать следующие моменты:

- dbt читает файл `.sqlfluff`, если он существует, для любых пользовательских конфигураций, которые у вас могут быть.
- Для рабочих процессов непрерывной интеграции/непрерывной разработки (CI/CD) ваш проект должен иметь файл `dbt_cloud.yml`, и вы успешно выполнили команды из этого проекта dbt.
- Команда SQLFluff вернет код выхода 0, если она выполнена с любыми нарушениями в файлах. Это поведение dbt отличается от поведения SQLFluff, где нарушение линтинга возвращает ненулевой код выхода. dbt Labs планирует решить эту проблему в следующем выпуске.

## Часто задаваемые вопросы
<Expandable alt_header="Как создать директорию .dbt и переместить ваш файл">

Если у вас никогда не было директории `.dbt`, выполните следующие рекомендуемые шаги для ее создания. Если у вас уже есть директория `.dbt`, переместите в нее файл `dbt_cloud.yml`.

<Tabs>
<TabItem value="Создание директории .dbt">

  1. Клонируйте ваш репозиторий проекта dbt локально.
  2. Используйте команду `mkdir`, за которой следует имя папки, которую вы хотите создать. Добавьте префикс `~`, чтобы создать папку `.dbt` в корне вашей файловой системы:

     ```bash
     mkdir ~/.dbt
     ```

Это создаст папку `.dbt` в корневой директории.

Для пользователей Mac, так как это скрытая папка (из-за префикса точки), она не будет видна в Finder по умолчанию. Чтобы просмотреть скрытые файлы и папки, нажмите Command + Shift + G.

</TabItem>

<TabItem value="Перемещение файла dbt_cloud.yml">

### Mac или Linux
В командной строке используйте команду `mv`, чтобы переместить ваш файл `dbt_cloud.yml` в директорию `.dbt`. Если вы только что скачали файл `dbt_cloud.yml` и он находится в вашей папке Загрузки, команда может выглядеть следующим образом:

```bash
mv ~/Downloads/dbt_cloud.yml ~/.dbt/dbt_cloud.yml
```

### Windows
В командной строке используйте команду move. Предполагая, что ваш файл находится в папке Загрузки, команда может выглядеть следующим образом:

```bash
move %USERPROFILE%\Downloads\dbt_cloud.yml %USERPROFILE%\.dbt\dbt_cloud.yml
```

</TabItem>
</Tabs>

Эта команда перемещает `dbt_cloud.yml` из папки `Downloads` в папку `.dbt`. Если ваш файл `dbt_cloud.yml` находится в другом месте, скорректируйте путь соответственно.

</Expandable>

<Expandable alt_header="Как пропустить загрузку артефактов">

По умолчанию [все артефакты](/reference/artifacts/dbt-artifacts) загружаются при выполнении команд dbt из dbt Cloud CLI. Чтобы пропустить загрузку этих файлов, добавьте `--download-artifacts=false` к команде, которую вы хотите выполнить. Это может помочь улучшить производительность выполнения, но может нарушить рабочие процессы, которые зависят от таких активов, как [manifest](/reference/artifacts/manifest-json). 

</Expandable>