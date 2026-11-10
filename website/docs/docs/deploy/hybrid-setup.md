---
title: "Гибридная настройка"
sidebar_label: "Гибридная настройка"
description: "Узнайте, как настраивать гибридные проекты в dbt platform."
pagination_next: "docs/deploy/deployment-tools"
pagination_prev: "docs/deploy/hybrid-projects"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка Hybrid

<IntroText>
Настройте проекты Hybrid для загрузки артефактов <Constant name="core" /> в <Constant name="dbt" />, чтобы улучшить совместную работу и прозрачность.
</IntroText>

:::tip Доступно в рамках публичного предварительного тестирования
Проекты Hybrid доступны в рамках публичного предварительного тестирования для [аккаунтов <Constant name="dbt" /> Enterprise](https://www.getdbt.com/pricing).
:::

## Настройка гибридных проектов {#set-up-hybrid-projects}

В гибридном проекте вы используете <Constant name="core" /> локально и можете загружать артефакты этого проекта <Constant name="core" /> в <Constant name="dbt" /> для централизованного просмотра, ссылок между проектами и более удобной совместной работы. 

Для такой настройки необходимо связать проект <Constant name="core" /> с проектом <Constant name="dbt" />, а также настроить несколько переменных окружения и параметров доступа. 

Выполните следующие шаги, чтобы настроить гибридный проект <Constant name="dbt" /> и загрузить артефакты <Constant name="core" /> в <Constant name="dbt" />:

<!--no toc --> 
    - [Сделайте модели <Constant name="dbt" /> общедоступными](#make-dbt-models-public) (необязательно)
    - [Создайте гибридный проект](#create-hybrid-project)
    - [Создайте сервисный токен и получите значения для загрузки артефактов](#generate-service-token-and-artifact-upload-values)
    - [Настройте проект <Constant name="core" /> и загрузите артефакты](#configure-dbt-project-and-upload-artifacts)
    - [Просмотрите артефакты в <Constant name="dbt" />](#configure-dbt-project-and-upload-artifacts)

Обязательно включите переключатель гибридных проектов на странице **Настройки аккаунта** в <Constant name="dbt" />.

### Сделайте модели <Constant name="dbt" /> общедоступными (необязательно) {#make-dbt-models-public}

Этот шаг необязателен и нужен только в том случае, если вы хотите предоставить другим проектам <Constant name="dbt" /> доступ к моделям <Constant name="core" /> с помощью функции [ссылок между проектами](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref).

Прежде чем связать проект <Constant name="core" /> с проектом <Constant name="dbt" />, убедитесь, что в конфигурации моделей, к которым вы хотите предоставить доступ, указано `access: public`. Эта настройка делает такие модели видимыми для других проектов <Constant name="dbt" />, упрощая совместную работу, например использование [ссылок между проектами](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref).

1. Самый простой способ задать это — через файл `dbt_project.yml`, однако вы также можете указать настройку в следующих местах:
   - `dbt_project.yml` (на уровне проекта)
   - `properties.yml` (для отдельных моделей)
   - `.sql`‑файл модели с использованием блока `config`

   Ниже приведён пример `dbt_project.yml`, в котором каталог marts объявлен публичным, чтобы его могли использовать downstream‑инструменты:

   <File name='dbt_project.yml'>

   ```yaml
   models:
     define_public_models: # This is my project name, remember it must be specified
       marts:
         +access: public
   ```
   </File>

2. После определения `access: public` повторно выполните команду dbt в интерфейсе командной строки (CLI) <Constant name="core" /> (например, `dbt run`), чтобы применить изменение.

3. Подробнее о настройке читайте в разделах [access modifier](/docs/mesh/govern/model-access#access-modifiers) и [`access` config](/reference/resource-configs/access).

### Создайте гибридный проект {#create-hybrid-project}

Создайте гибридный проект в <Constant name="dbt" />, чтобы загружать артефакты <Constant name="core" /> в <Constant name="dbt" />. 

[Администратор аккаунта <Constant name="dbt" />](/docs/platform/manage-access/enterprise-permissions#permission-sets) должен выполнить следующие действия и передать пользователю <Constant name="core" /> сведения для загрузки артефактов:

1. Чтобы создать новый проект в <Constant name="dbt" />, перейдите в **Account home**.
2. Нажмите **+New project**. 
3. Заполните поле **Project name**. Выберите название, по которому будет понятно, что это проект <Constant name="core" />. 
   - Настраивать [хранилище данных](/docs/supported-data-platforms) или [подключение к <Constant name="git" />](/docs/platform/git/configure-git) не требуется. Однако для преобразования гибридного проекта в полноценный проект <Constant name="dbt" /> потребуется настроить хранилище данных и подключение к <Constant name="git" />.
4. Раскройте **Advanced settings**, а затем установите флажок **Hybrid development**. Нажмите **Continue**.
   - В списке проектов гибридный проект будет отмечен индикатором **Hybrid**, чтобы его было проще найти.
<Lightbox src="/img/docs/deploy/hp-new-project.jpg" title="Создание нового гибридного проекта" />

5. После создания проекта создайте для него [производственную среду](/docs/deploy/deploy-environments#create-a-deployment-environment) и нажмите **Save**. Для сохранения потребуется создать временный [профиль](/docs/platform/about-profiles) и назначить его среде. 
6. (Необязательно) Чтобы преобразовать существующий проект dbt в гибридный, перейдите в **Account settings**, а затем выберите **Project**. Нажмите **Edit** и установите флажок **Hybrid development**.
<Lightbox src="/img/docs/deploy/hp-existing-project.jpg" width="80%" title="Преобразование существующего проекта в гибридный" />

### Создание служебного токена и получение значений для загрузки артефактов {#generate-service-token-and-artifact-upload-values}
Администратор <Constant name="dbt" /> должен выполнить следующие действия, чтобы создать [служебный токен](/docs/dbt-apis/service-tokens#enterprise-plans-using-service-account-tokens) (с разрешениями **Job Runner** _и_ **Job Viewer**) и скопировать значения, необходимые для настройки проекта <Constant name="core" /> для загрузки сгенерированных артефактов в <Constant name="dbt" />.

Администратор <Constant name="dbt" /> должен передать эти значения пользователю <Constant name="core" />.

1. Перейдите в среду гибридного проекта, созданную на предыдущем шаге: откройте **Deploy** > **Environments** и выберите нужную среду.
2. Нажмите кнопку **Artifact upload** и скопируйте следующие значения, которые пользователю <Constant name="core" /> потребуется указать в файле конфигурации `dbt_project.yml` своего проекта <Constant name="core" />:
   - **[Tenant URL](/docs/platform/about-platform/access-regions-ip-addresses)**
   - **Account ID**
   - **Environment ID**
   - **Create a service token**
     - <Constant name="dbt" /> создаёт служебный токен с разрешениями **Job Runner** _и_ **Job Viewer**.
     - Обратите внимание: если кнопка **Create service token** не отображается, скорее всего, у вас нет необходимых разрешений для создания служебного токена. Обратитесь к администратору <Constant name="dbt" />, чтобы получить необходимые разрешения или попросить его создать служебный токен для вас.
<Lightbox src="/img/docs/deploy/hp-artifact-upload.png" title="Создание служебного токена для гибридного проекта" />

3. Обязательно скопируйте и сохраните эти значения — они понадобятся для настройки проекта <Constant name="core" /> на следующем шаге. После создания service token получить его повторно невозможно.

### Настройте проект dbt и загрузите артефакты {#configure-dbt-project-and-upload-artifacts}

Получив значения с предыдущего шага, вы можете подготовить проект <Constant name="core" /> к загрузке артефактов, выполнив следующие действия:

1. Проверьте версию dbt, выполнив `dbt --version`. Вы должны увидеть примерно следующее:
   ```bash
      Core:
      - installed: 1.11.0
      - latest:    1.11.0 - Up to date!
   ```
2. Если у вас не установлена [последняя поддерживаемая версия](/docs/dbt-versions), [обновите](/docs/local/install-dbt?version=1#upgrade) свой проект <Constant name="core" />, выполнив `python -m pip install --upgrade dbt-core`.
3. Задайте следующие переменные окружения в своём проекте <Constant name="core" />, выполнив следующие команды в CLI. Замените `your_account_id`, `your_environment_id` и `your_token` фактическими значениями из [предыдущего шага](#generate-service-token-and-artifact-upload-values).

   ```bash
   export DBT_CLOUD_ACCOUNT_ID=your_account_id
   export DBT_CLOUD_ENVIRONMENT_ID=your_environment_id
   export DBT_CLOUD_TOKEN=your_token
   export DBT_ENGINE_UPLOAD_TO_ARTIFACTS_INGEST_API=True
   ```

   - Задавайте переменные окружения тем способом, который используется в вашем проекте.
   - Чтобы удалить переменную окружения, выполните `unset environment_variable_name`, заменив `environment_variable_name` на имя переменной.

4. В локальном проекте <Constant name="core" /> добавьте следующие элементы, скопированные в [предыдущем разделе](/docs/deploy/hybrid-setup#generate-service-token-and-artifact-upload-values), в файл `dbt_project.yml` проекта <Constant name="core" />:
   - `tenant_hostname`
   ```yaml
   name: "jaffle_shop"
   version: "3.0.0"
   require-dbt-version: ">=1.5.0"
   ....rest of dbt_project.yml configuration...

   dbt-cloud:
     tenant_hostname: cloud.getdbt.com # Replace with your Tenant URL
   ```
5. После того как вы зададите переменные окружения с помощью команды `export` в том же сеансе dbt CLI, вы можете выполнить команду `dbt run` в CLI.
   ```bash
    dbt run
    ```

   Чтобы переопределить заданные переменные окружения, выполните `dbt run` с префиксом переменных окружения. Например, чтобы использовать другой Account ID и Environment ID:
   ```bash
    DBT_CLOUD_ACCOUNT_ID=1 DBT_CLOUD_ENVIRONMENT_ID=123 dbt run
   ```

6. После завершения запуска вы должны увидеть сообщение `Artifacts uploaded successfully to artifact ingestion API: command run completed successfully` и запуск в <Constant name="dbt" /> в вашей производственной среде.

### Просмотр артефактов на платформе dbt {#review-artifacts-in-the-dbt-platform}
Теперь, когда вы загрузили артефакты <Constant name="core" /> на <Constant name="dbt_platform" /> и выполнили `dbt run`, вы можете просмотреть запуск задания по загрузке артефактов:
1. Перейдите в раздел **Deploy**
2. Нажмите **Jobs**, а затем откройте вкладку **Runs**.
3. Вы должны увидеть запуск задания со статусом **Success** и индикатором `</> Artifact ingestion`.
4. Нажмите на запуск задания, чтобы просмотреть журналы и убедиться, что в них есть сообщение об успешной загрузке артефактов. Если возникли ошибки, изучите отладочные журналы и устраните их.

<Lightbox src="/img/docs/deploy/hp-artifact-job.jpg" width="70%" title="Запуск job в hybrid‑проекте с импортом артефактов" />

## Преимущества гибридных проектов {#benefits-of-using-hybrid-projects}

Теперь, когда вы интегрировали артефакты <Constant name="core" /> в свой проект <Constant name="dbt" />, вы можете:

- Сотрудничайте с пользователями <Constant name="dbt" />, предоставляя им возможность визуализировать модели dbt из проектов <Constant name="core" /> и создавать [межпроектные ссылки](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) на эти модели.
- Пользователи <Constant name="core" /> могут перейти в [<Constant name="catalog" />](/docs/explore/explore-projects) и просматривать свои модели и ресурсы. Для просмотра <Constant name="catalog" /> необходимо иметь [место с доступом только для чтения](/docs/platform/manage-access/seats-and-users).
