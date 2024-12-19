---
title: Настройка и использование dbt Cloud CLI
id: configure-cloud-cli
description: "Инструкции по настройке dbt Cloud CLI"
sidebar_label: "Настройка и использование"
pagination_next: null
---

Узнайте, как настроить dbt Cloud CLI для вашего проекта dbt Cloud, чтобы выполнять команды dbt, такие как `dbt environment show` для просмотра вашей конфигурации dbt Cloud или `dbt compile` для компиляции вашего проекта и проверки моделей и тестов. Вы также получите преимущества от:

- Безопасного хранения учетных данных на платформе dbt Cloud.
- [Автоматического откладывания](/docs/cloud/about-cloud-develop-defer) артефактов сборки в производственной среде вашего проекта Cloud.
- Более быстрых и экономичных сборок.
- Поддержки dbt Mesh ([межпроектные ссылки](/docs/collaborate/govern/project-dependencies)) и многого другого.

## Предварительные требования

- Вы должны настроить проект в dbt Cloud.
  - **Примечание** &mdash; Если вы используете dbt Cloud CLI, вы можете подключиться к вашей [платформе данных](/docs/cloud/connect-data-platform/about-connections) напрямую в интерфейсе dbt Cloud и не нуждаетесь в файле [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml).
- Вы должны установить свои [учетные данные для разработки](/docs/dbt-cloud-environments#set-developer-credentials) для этого проекта. dbt Cloud CLI будет использовать эти учетные данные, которые хранятся безопасно в dbt Cloud, для связи с вашей платформой данных.
- Вы должны использовать версию dbt 1.5 или выше. Обратитесь к [версиям dbt Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud) для обновления.

## Настройка dbt Cloud CLI

После установки dbt Cloud CLI вам необходимо настроить его для подключения к проекту dbt Cloud.

1. В dbt Cloud перейдите в раздел **Разработка** и нажмите **Настроить dbt Cloud CLI**, чтобы скачать файл учетных данных `dbt_cloud.yml`.

    <details>
    <summary>URL-адреса регионов для загрузки учетных данных</summary>
    Вы также можете загрузить учетные данные по предоставленным ссылкам в зависимости от вашего региона:

    - Северная Америка: <a href="https://cloud.getdbt.com/cloud-cli">https://cloud.getdbt.com/cloud-cli</a>
    - EMEA: <a href="https://emea.dbt.com/cloud-cli">https://emea.dbt.com/cloud-cli</a>
    - APAC: <a href="https://au.dbt.com/cloud-cli">https://au.dbt.com/cloud-cli</a>
    - Североамериканская ячейка 1: <code>https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli</code>
    - Одноарендный: <code>https://YOUR_ACCESS_URL/cloud-cli</code>

    </details>

2. Сохраните файл `dbt_cloud.yml` в директории `.dbt`, которая хранит вашу конфигурацию dbt Cloud CLI. Храните его в безопасном месте, так как он содержит API-ключи. Ознакомьтесь с [Часто задаваемыми вопросами](#faqs), чтобы узнать, как создать директорию `.dbt` и переместить файл `dbt_cloud.yml`.
   
    - Северная Америка: https://YOUR_ACCESS_URL/cloud-cli
    - EMEA: https://emea.dbt.com/cloud-cli
    - APAC: https://au.dbt.com/cloud-cli
    - Североамериканская ячейка 1: `https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli`
    - Одноарендный: `https://YOUR_ACCESS_URL/cloud-cli`
  
3. Следуйте инструкциям на баннере и загрузите файл конфигурации в:
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

3. После загрузки файла конфигурации и создания вашей директории перейдите в проект dbt в вашем терминале:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

4. В вашем файле `dbt_project.yml` убедитесь, что у вас есть или добавьте раздел `dbt-cloud` с полем `project-id`. Поле `project-id` содержит идентификатор проекта dbt Cloud, который вы хотите использовать.

    ```yaml
    # dbt_project.yml
    name:
    version:
    # Конфигурации вашего проекта...

    dbt-cloud: 
        project-id: PROJECT_ID
    ```

   - Чтобы найти ваш идентификатор проекта, выберите **Разработка** в меню навигации dbt Cloud. Вы можете использовать URL для нахождения идентификатора проекта. Например, в `https://YOUR_ACCESS_URL/develop/26228/projects/123456` идентификатор проекта — `123456`.

5. Теперь вы должны иметь возможность [использовать dbt Cloud CLI](#use-the-dbt-cloud-cli) и выполнять [команды dbt](/reference/dbt-commands), такие как [`dbt environment show`](/reference/commands/dbt-environment) для просмотра деталей конфигурации dbt Cloud или `dbt compile` для компиляции моделей в вашем проекте dbt.

С вашим репозиторием, клонированным заново, вы можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

## Установка переменных окружения

Чтобы установить переменные окружения в dbt Cloud CLI для вашего проекта dbt:

1. В dbt Cloud нажмите на ваше имя аккаунта в левом боковом меню и выберите **Настройки аккаунта**.
2. В разделе **Ваш профиль** выберите **Учетные данные**.
3. Нажмите на ваш проект и прокрутите до раздела **Переменные окружения**.
4. Нажмите **Редактировать** в правом нижнем углу и затем установите переменные окружения на уровне пользователя.  

## Использование dbt Cloud CLI

dbt Cloud CLI использует тот же набор [команд dbt](/reference/dbt-commands) и [команд MetricFlow](/docs/build/metricflow-commands), что и dbt Core, для выполнения предоставленных вами команд. Например, используйте команду [`dbt environment`](/reference/commands/dbt-environment) для просмотра деталей конфигурации dbt Cloud. С помощью dbt Cloud CLI вы можете:

- Выполнять [несколько вызовов параллельно](/reference/dbt-commands) и обеспечивать [безопасную параллельность](/reference/dbt-commands#parallel-execution), что в настоящее время не гарантируется `dbt-core`.
- Автоматически откладывать артефакты сборки в производственной среде вашего проекта Cloud.
- Поддерживать [зависимости проектов](/docs/collaborate/govern/project-dependencies), что позволяет вам зависеть от другого проекта, используя сервис метаданных в dbt Cloud. 
  - Зависимости проектов мгновенно подключаются и ссылаются (или `ref`) на публичные модели, определенные в других проектах. Вам не нужно выполнять или анализировать эти модели самостоятельно. Вместо этого вы рассматриваете их как API, который возвращает набор данных.
 
:::tip Используйте флаг <code>--help</code>
В качестве совета, большинство инструментов командной строки имеют флаг `--help`, чтобы показать доступные команды и аргументы. Используйте флаг `--help` с dbt двумя способами:
- `dbt --help`: перечисляет доступные команды для dbt<br />
- `dbt run --help`: перечисляет доступные флаги для команды `run`
:::
 
### Проверка SQL файлов 

С помощью dbt Cloud CLI вы можете вызывать [SQLFluff](https://sqlfluff.com/), который является модульным и настраиваемым линтером SQL, который предупреждает вас о сложных функциях, синтаксисе, форматировании и ошибках компиляции. Многие из тех же флагов, которые вы можете передать SQLFluff, доступны из dbt Cloud CLI.

Доступные команды SQLFluff:

- `lint` &mdash; Проверка SQL файлов, передавая список файлов или из стандартного ввода (stdin).
- `fix` &mdash; Исправление SQL файлов.
- `format` &mdash; Автоформатирование SQL файлов.


Чтобы проверить SQL файлы, выполните команду следующим образом:  

```shell
dbt sqlfluff lint [PATHS]... [flags]
```

Когда путь не установлен, dbt проверяет все SQL файлы в текущем проекте. Чтобы проверить конкретный SQL файл или директорию, установите `PATHS` на путь к SQL файлу(ам) или директории файлов. Чтобы проверить несколько файлов или директорий, передайте несколько флагов `PATHS`.  

Чтобы показать подробную информацию о всех поддерживаемых командах и флагах dbt, выполните команду `dbt sqlfluff -h`. 

#### Условия

При выполнении `dbt sqlfluff` из dbt Cloud CLI важно учитывать следующие моменты:

- dbt читает файл `.sqlfluff`, если он существует, для любых пользовательских конфигураций, которые вы могли установить.
- Для рабочих процессов непрерывной интеграции/непрерывной разработки (CI/CD) ваш проект должен иметь файл `dbt_cloud.yml`, и вы успешно выполнили команды из этого проекта dbt.
- Команда SQLFluff вернет код выхода 0, если она была выполнена с любыми нарушениями файлов. Это поведение dbt отличается от поведения SQLFluff, где нарушение линтинга возвращает ненулевой код выхода. dbt Labs планирует решить эту проблему в следующем релизе.

## Часто задаваемые вопросы
<Expandable alt_header="Как создать директорию .dbt и переместить ваш файл">

Если у вас никогда не было директории `.dbt`, вам следует выполнить следующие рекомендуемые шаги для ее создания. Если у вас уже есть директория `.dbt`, переместите файл `dbt_cloud.yml` в нее.

<Tabs>
<TabItem value="Создать директорию .dbt">

  1. Клонируйте репозиторий вашего проекта dbt локально.
  2. Используйте команду `mkdir`, за которой следует имя папки, которую вы хотите создать. Добавьте префикс `~`, чтобы создать папку `.dbt` в корне вашей файловой системы:

     ```bash
     mkdir ~/.dbt
     ```

Это создаст папку `.dbt` в корневом каталоге.

Для пользователей Mac, поскольку это скрытая папка (из-за префикса точки), она не будет видна в Finder по умолчанию. Чтобы увидеть скрытые файлы и папки, нажмите Command + Shift + G.

</TabItem>

<TabItem value="Переместить файл dbt_cloud.yml">

### Mac или Linux
В вашей командной строке используйте команду `mv`, чтобы переместить файл `dbt_cloud.yml` в директорию `.dbt`. Если вы только что загрузили файл `dbt_cloud.yml` и он находится в вашей папке Загрузки, команда может выглядеть следующим образом:

```bash
mv ~/Downloads/dbt_cloud.yml ~/.dbt/dbt_cloud.yml
```

### Windows
В вашей командной строке используйте команду move. Предполагая, что ваш файл находится в папке Загрузки, команда может выглядеть следующим образом:

```bash
move %USERPROFILE%\Downloads\dbt_cloud.yml %USERPROFILE%\.dbt\dbt_cloud.yml
```

</TabItem>
</Tabs>

Эта команда перемещает `dbt_cloud.yml` из папки `Загрузки` в папку `.dbt`. Если ваш файл `dbt_cloud.yml` находится в другом месте, скорректируйте путь соответственно.

</Expandable>

<Expandable alt_header="Как пропустить загрузку артефактов">

По умолчанию [все артефакты](/reference/artifacts/dbt-artifacts) загружаются, когда вы выполняете команды dbt из dbt Cloud CLI. Чтобы пропустить загрузку этих файлов, добавьте `--download-artifacts=false` к команде, которую вы хотите выполнить. Это может помочь улучшить производительность выполнения, но может нарушить рабочие процессы, которые зависят от таких активов, как [манифест](/reference/artifacts/manifest-json). 

</Expandable>