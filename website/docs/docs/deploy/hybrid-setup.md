---
title: "Гибридная настройка"
sidebar_label: "Гибридная настройка"
description: "Узнайте, как настраивать гибридные проекты в dbt platform."
pagination_next: "docs/deploy/deployment-tools"
pagination_prev: "docs/deploy/hybrid-projects"
---

# Гибридная настройка <Lifecycle status='managed_plus'/>

<IntroText>
Настройте Hybrid‑проекты, чтобы загружать артефакты <Constant name="core" /> в <Constant name="cloud" /> и получить лучшую совместную работу и прозрачность.
</IntroText>

:::tip Доступно в public preview
Hybrid‑проекты доступны в режиме публичного превью для [Enterprise‑аккаунтов <Constant name="cloud" />](https://www.getdbt.com/pricing).
:::

## Настройка гибридных проектов

В Hybrid‑проекте вы используете <Constant name="core" /> локально и можете загружать артефакты этого проекта <Constant name="core" /> в <Constant name="cloud" /> для централизованной видимости, кросс‑проектных ссылок и более удобного сотрудничества.

Такая конфигурация требует подключения вашего проекта <Constant name="core" /> к проекту <Constant name="cloud" />, а также настройки нескольких переменных окружения и параметров доступа.

Следуйте этим шагам, чтобы настроить Hybrid‑проект в <Constant name="cloud" /> и загрузить артефакты <Constant name="core" /> в <Constant name="cloud" />:

<!--no toc --> 
- [Сделать модели <Constant name="core" /> публичными](#make-dbt-core-models-public) (опционально)
- [Создать hybrid‑проект](#create-hybrid-project)
- [Сгенерировать service token и значения для загрузки артефактов](#generate-service-token-and-artifact-upload-values)
- [Настроить проект <Constant name="core" /> и загрузить артефакты](#configure-dbt-core-project-and-upload-artifacts)
- [Просмотреть артефакты в <Constant name="cloud" />](#review-artifacts-in-dbt-cloud)

Убедитесь, что в <Constant name="cloud" /> на странице **Account settings** включён переключатель hybrid‑проектов.

### Сделайте модели dbt Core публичными (необязательно) {#make-dbt-core-models-public}

Этот шаг является необязательным и нужен только в том случае, если вы хотите делиться своими моделями <Constant name="core" /> с другими проектами <Constant name="cloud" /> с помощью функции [cross-project referencing](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref).

Перед подключением проекта dbt Core к проекту <Constant name="cloud" /> убедитесь, что модели, которыми вы хотите делиться, имеют `access: public` в конфигурации модели. Эта настройка делает такие модели видимыми для других проектов <Constant name="cloud" /> и упрощает совместную работу, например при использовании [cross-project referencing](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref).

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

2. После задания `access: public` повторно запустите выполнение dbt в интерфейсе командной строки dbt Core (CLI), например `dbt run`, чтобы применить изменения.

3. Подробнее о настройке читайте в разделах [access modifier](/docs/mesh/govern/model-access#access-modifiers) и [`access` config](/reference/resource-configs/access).

### Создайте гибридный проект {#create-hybrid-project}

Создайте hybrid‑проект в <Constant name="cloud" />, чтобы иметь возможность загружать артефакты <Constant name="core" /> в <Constant name="cloud" />.

[Администратор аккаунта <Constant name="cloud" />](/docs/cloud/manage-access/enterprise-permissions#permission-sets) должен выполнить следующие шаги и передать информацию об артефактах пользователю <Constant name="core" />:

1. Чтобы создать новый проект в <Constant name="cloud" />, перейдите на страницу **Account home**.
2. Нажмите **+New project**.
3. Заполните поле **Project name**. Назовите проект так, чтобы было понятно, что это проект <Constant name="core" />.
   - Вам не нужно настраивать [хранилище данных](/docs/supported-data-platforms) или [подключение <Constant name="git" />](/docs/cloud/git/git-configuration-in-dbt-cloud), однако для обновления hybrid‑проекта до полноценного проекта <Constant name="cloud" /> эти настройки понадобятся.
4. Включите переключатель **Advanced settings**, затем отметьте чекбокс **Hybrid development** и нажмите **Continue**.
   - В списке проектов hybrid‑проект будет помечен индикатором **Hybrid**, чтобы его было легко отличить.
<Lightbox src="/img/docs/deploy/hp-new-project.jpg" title="Hybrid project new project" />

5. После создания проекта создайте соответствующую [production‑среду](/docs/deploy/deploy-environments#create-a-deployment-environment) и нажмите **Save**. Обратите внимание, что поле **Connection** можно оставить пустым.
6. (Опционально) Чтобы обновить существующий dbt‑проект до hybrid‑проекта, перейдите в **Account settings**, выберите **Project**, нажмите **Edit** и отметьте чекбокс **Hybrid development**.
<Lightbox src="/img/docs/deploy/hp-existing-project.jpg" width="80%" title="Hybrid‑проект для существующего проекта" />

### Сгенерируйте service token и значения для загрузки артефактов

Администратор <Constant name="cloud" /> должен выполнить эти шаги, чтобы сгенерировать [service token](/docs/dbt-cloud-apis/service-tokens#enterprise-plans-using-service-account-tokens) (с правами **Job Runner** и **Job Viewer**) и скопировать значения, необходимые для настройки проекта <Constant name="core" /> для загрузки артефактов в <Constant name="cloud" />.

Администратор <Constant name="cloud" /> должен передать эти значения пользователю <Constant name="core" />.

1. Перейдите в среду hybrid‑проекта, созданную на предыдущем шаге: **Deploy** > **Environments**, затем выберите нужную среду.
2. Нажмите кнопку **Artifact upload** и скопируйте следующие значения, которые пользователю dbt Core понадобятся для настройки `dbt_project.yml`:
   - **[Tenant URL](/docs/cloud/about-cloud/access-regions-ip-addresses)**
   - **Account ID**
   - **Environment ID**
   - **Create a service token**
     - <Constant name="cloud" /> создаёт service token с правами **Job Runner** и **Job Viewer**.
     - Если вы не видите кнопку **Create service token**, скорее всего, у вас нет необходимых прав. Обратитесь к администратору <Constant name="cloud" />, чтобы получить доступ или чтобы он создал token за вас.
<Lightbox src="/img/docs/deploy/hp-artifact-upload.png" title="Сгенерируйте service token для hybrid‑проекта" />

3. Обязательно скопируйте и сохраните эти значения — они понадобятся для настройки проекта <Constant name="core" /> на следующем шаге. После создания service token получить его повторно невозможно.

### Настройте dbt Core‑проект и загрузку артефактов

Получив значения с предыдущего шага, вы можете подготовить проект <Constant name="core" /> к загрузке артефактов, выполнив следующие действия:

1. Проверьте версию dbt, выполнив `dbt --version`. Вы должны увидеть примерно следующее:
   ```bash
      Core:
      - installed: 1.10.0-b1
      - latest:    1.9.3     - Ahead of latest version!
   ```
2. Если у вас не установлена последняя версия (1.10 или выше), [обновите](/docs/core/pip-install#change-dbt-core-versions) dbt Core, выполнив `python -m pip install --upgrade dbt-core`.
3. Задайте следующие переменные окружения в проекте dbt Core, выполнив команды в CLI. Замените `your_account_id`, `your_environment_id` и `your_token` реальными значениями с [предыдущего шага](#generate-service-token-and-artifact-upload-values).

   ```bash
   export DBT_CLOUD_ACCOUNT_ID=your_account_id
   export DBT_CLOUD_ENVIRONMENT_ID=your_environment_id
   export DBT_CLOUD_TOKEN=your_token
   export DBT_UPLOAD_TO_ARTIFACTS_INGEST_API=True
   ```

   - Задавайте переменные окружения тем способом, который используется в вашем проекте.
   - Чтобы удалить переменную окружения, выполните `unset environment_variable_name`, заменив `environment_variable_name` на имя переменной.

4. В локальном проекте dbt Core добавьте в файл `dbt_project.yml` элемент, скопированный на [предыдущем шаге](/docs/deploy/hybrid-setup#enable-artifact-upload):
   - `tenant_hostname`
   ```yaml
   name: "jaffle_shop"
   version: "3.0.0"
   require-dbt-version: ">=1.5.0"
   ....rest of dbt_project.yml configuration...

   dbt-cloud:
     tenant_hostname: cloud.getdbt.com # Replace with your Tenant URL
   ```
5. После того как переменные окружения заданы с помощью `export` в той же сессии CLI dbt Core, выполните `dbt run`:
   ```bash
    dbt run
    ```

   Чтобы переопределить заданные переменные окружения, выполните `dbt run` с префиксом переменных окружения. Например, чтобы использовать другой Account ID и Environment ID:
   ```bash
    DBT_CLOUD_ACCOUNT_ID=1 DBT_CLOUD_ENVIRONMENT_ID=123 dbt run
   ```

6. После завершения выполнения вы должны увидеть сообщение `Artifacts uploaded successfully to artifact ingestion API: command run completed successfully`, а также запуск в <Constant name="cloud" /> в вашей production‑среде.

### Просмотрите артефакты в dbt platform

После загрузки артефактов dbt Core в <Constant name="dbt_platform" /> и выполнения `dbt run` вы можете просмотреть запуск job с артефактами:

1. Перейдите в **Deploy**
2. Нажмите **Jobs**, затем откройте вкладку **Runs**
3. Вы должны увидеть запуск со статусом **Success** и индикатором `</> Artifact ingestion`
4. Откройте этот запуск, чтобы просмотреть логи и убедиться, что загрузка артефактов прошла успешно. Если есть ошибки, изучите debug‑логи для их устранения.

<Lightbox src="/img/docs/deploy/hp-artifact-job.jpg" width="70%" title="Запуск job в hybrid‑проекте с импортом артефактов" />

## Преимущества использования hybrid‑проектов

Теперь, когда вы интегрировали артефакты <Constant name="core" /> с проектом <Constant name="cloud" />, вы можете:

- Совместно работать с пользователями <Constant name="cloud" />, позволяя им визуализировать и использовать [cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) для dbt‑моделей, которые находятся в Core‑проектах.
- (Скоро) Новые пользователи, заинтересованные в [<Constant name="visual_editor" />](/docs/cloud/canvas), смогут строить решения на основе dbt‑моделей, уже созданных центральной командой данных в <Constant name="core" />, вместо того чтобы начинать с нуля.
- Пользователи <Constant name="core" /> смогут перейти в [<Constant name="explorer" />](/docs/explore/explore-projects) и просматривать свои модели и ассеты. Для доступа к <Constant name="explorer" /> требуется [read‑only seat](/docs/cloud/manage-access/seats-and-users).
