---
title: Airflow и dbt
id: airflow-and-dbt-cloud
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt platform', 'Orchestration']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

Многие организации уже используют [Airflow](https://airflow.apache.org/) для оркестрации рабочих процессов обработки данных. <Constant name="dbt" /> отлично работает с Airflow, позволяя выполнять код dbt в <Constant name="dbt" />, оставляя задачи оркестрации за Airflow. Это обеспечивает доступность и актуальность метаданных вашего проекта (важных для таких инструментов, как <Constant name="catalog" />), при этом сохраняя возможность использовать Airflow для общих задач, таких как:

- Планирование других процессов вне запусков dbt
- Обеспечение запуска [задания dbt](/docs/deploy/job-scheduler) до или после другого процесса вне <Constant name="dbt" />
- Запуск задания dbt только после завершения другого задания

В этом руководстве вы узнаете, как:

1. Создать рабочее локальное окружение Airflow
2. Запустить задание <Constant name="dbt" /> с помощью Airflow
3. Повторно использовать проверенный и надёжный код Airflow для ваших конкретных сценариев использования

Вы также лучше поймете, как это поможет:

- Снизить когнитивную нагрузку при создании и поддержке конвейеров
- Избежать проблем с зависимостями (например, конфликтов `pip install`)
- Определить более четкую передачу рабочих процессов между инженерами данных и аналитическими инженерами

## Предварительные требования {#prerequisites}

- [Учетная запись <Constant name="dbt_platform" /> Enterprise или Enterprise+](https://www.getdbt.com/pricing/) (с [правами администратора](/docs/platform/manage-access/enterprise-permissions)) для создания служебного токена. Сведения о разрешениях для служебных токенов доступны [здесь](/docs/dbt-apis/service-tokens#permissions-for-service-account-tokens).
- Токен служебной учетной записи, если у вас есть [лицензия Developer (с правами администратора)](/docs/platform/manage-access/enterprise-permissions)). Сведения о разрешениях для служебных токенов доступны [здесь](/docs/dbt-apis/service-tokens#permissions-for-service-account-tokens) и [здесь](/docs/platform/manage-access/seats-and-users?version=2.0).
- [Персональный токен доступа (PAT)](https://docs.getdbt.com/docs/dbt-apis/user-tokens#create-a-personal-access-token), если у вас есть лицензия Developer, IT или Read-only.
- [Бесплатная учетная запись Docker](https://hub.docker.com/signup) для входа в Docker Desktop, который будет установлен в ходе первоначальной настройки.
- Локальный электронный блокнот для временного копирования и вставки ключей API и URL-адресов

🙌 Давайте начнем! 🙌

## Установка Astro CLI {#install-the-astro-cli}

Astro — это управляемый программный сервис, который включает ключевые функции для команд, работающих с Airflow. Чтобы использовать Astro, мы установим Astro CLI, который предоставит нам доступ к полезным командам для работы с Airflow локально. Подробнее об Astro можно прочитать [здесь](https://docs.astronomer.io/astro/).

В этом примере мы используем Homebrew для установки Astro CLI. Следуйте инструкциям по установке Astro CLI для вашей операционной системы [здесь](https://docs.astronomer.io/astro/install-cli).

```bash
brew install astro
```

<WistiaVideo id="uosszw1qul" paddingTweak="62.25%" />

## Установка и запуск Docker Desktop {#install-and-start-docker-desktop}

Docker позволяет нам развернуть среду со всеми приложениями и зависимостями, необходимыми для этого руководства.

Следуйте инструкциям [здесь](https://docs.docker.com/desktop/), чтобы установить Docker Desktop для вашей операционной системы. После установки Docker убедитесь, что он запущен для выполнения следующих шагов.

<WistiaVideo id="qr84pa8k9f" paddingTweak="62.25%" />

## Клонирование репозитория airflow-dbt-cloud {#clone-the-airflow-dbt-cloud-repository}

Откройте терминал и клонируйте [репозиторий airflow-dbt-cloud](https://github.com/dbt-labs/airflow-dbt-cloud). Он содержит примеры DAG для Airflow, которые вы будете использовать для оркестрации задания <Constant name="dbt" />. После клонирования перейдите в каталог проекта `airflow-dbt-cloud`.

```bash
git clone https://github.com/dbt-labs/airflow-dbt-cloud.git
cd airflow-dbt-cloud
```

Для получения дополнительной информации о клонировании репозиториев GitHub, обратитесь к разделу "[Клонирование репозитория](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)" в документации GitHub.

## Запуск контейнера Docker {#start-the-docker-container}

1. Из директории `airflow-dbt-cloud`, которую вы клонировали и открыли на предыдущем шаге, выполните следующую команду, чтобы запустить ваше локальное развертывание Airflow:

   ```bash
   astro dev start
   ```

   Когда это завершится, вы должны увидеть сообщение, похожее на следующее:

   ```bash
   Airflow запускается! Это может занять несколько минут…

   Проект запущен! Все компоненты теперь доступны.

   Веб-сервер Airflow: http://localhost:8080
   База данных Postgres: localhost:5432/postgres
   Учетные данные по умолчанию для интерфейса Airflow: admin:admin
   Учетные данные по умолчанию для базы данных Postgres: postgres:postgres
   ```

2. Откройте интерфейс Airflow. Запустите ваш веб-браузер и перейдите по адресу для **веб-сервера Airflow** из вашего вывода выше (для нас это `http://localhost:8080`).

   Это приведет вас к вашей локальной инстанции Airflow. Вам нужно будет войти с **учетными данными по умолчанию**:

   - Имя пользователя: admin
   - Пароль: admin

<Lightbox src="/img/guides/orchestration/airflow-and-dbt-platform/airflow-login.png" title="Экран входа в Airflow" />

<WistiaVideo id="2rzsjo0uml" paddingTweak="62.25%" />

## Создайте сервисный токен dbt {#create-a-dbt-service-token}

[Создайте сервисный токен](/docs/dbt-apis/service-tokens) с правами `Job Admin` в <Constant name="dbt" />. Обязательно сохраните копию токена, так как позже вы не сможете получить к нему доступ.

В качестве альтернативы вы можете [создать PAT](/docs/dbt-apis/user-tokens#create-a-personal-access-token), если у вас есть лицензия Developer, IT или Read-only.

<WistiaVideo id="amubh6qmwq" paddingTweak="62.25%" />

## Создайте задание dbt {#create-a-dbt-job}

[Создайте задание в своей учетной записи <Constant name="dbt" />](/docs/deploy/deploy-jobs#create-and-schedule-jobs), уделив особое внимание приведенным ниже пунктам.

- Настройте задание, указав все команды, которые нужно выполнить при его запуске. В этом примере кода Airflow запускает задание <Constant name="dbt" /> и все его команды, а не указывает явно отдельные модели для запуска из Airflow.
- Убедитесь, что расписание **отключено**, поскольку для запуска мы будем использовать Airflow.
- После нажатия `save` в настройках задания обязательно скопируйте URL и сохраните его для дальнейшего использования. URL будет выглядеть примерно так:

```html
https://YOUR_ACCESS_URL/#/accounts/{account_id}/projects/{project_id}/jobs/{job_id}/
```

<WistiaVideo id="qiife5rzlp" paddingTweak="62.25%" />

## Подключение dbt к Airflow {#connect-dbt-to-airflow}

Теперь у вас есть всё необходимое для начала работы с Airflow + <Constant name="dbt" />. Пора **настроить подключение** и **запустить DAG в Airflow**, который запустит задание <Constant name="dbt" />.

1. В интерфейсе Airflow перейдите в раздел Admin и нажмите на **Connections**

<Lightbox src="/img/guides/orchestration/airflow-and-dbt-platform/airflow-connections-menu.png" title="Меню подключений Airflow" />

2. Нажмите на значок `+`, чтобы добавить новое подключение, затем откройте раскрывающийся список и найдите тип подключения <Constant name="dbt" />.

    <Lightbox src="/img/guides/orchestration/airflow-and-dbt-platform/connection-type.png" title="Тип подключения" />

3. Укажите данные подключения и идентификатор аккаунта <Constant name="dbt" /> по умолчанию. Этот идентификатор находится в URL вашего аккаунта <Constant name="dbt" /> после сегмента пути accounts (`/accounts/{YOUR_ACCOUNT_ID}`). Например, для аккаунта с идентификатором 16173 URL будет выглядеть так: `https://YOUR_ACCESS_URL/#/accounts/16173/projects/36467/jobs/65767/`

    <Lightbox src="/img/guides/orchestration/airflow-and-dbt-platform/connection-type-configured.png" title="Тип подключения" />

## Обновление заполнителей в примере кода {#update-the-placeholders-in-the-sample-code}

Добавьте свои `account_id` и `job_id` в файл Python [run_dbt_cloud_job.py](https://github.com/dbt-labs/airflow-dbt-cloud/blob/main/dags/run_dbt_cloud_job.py).

Оба идентификатора содержатся в URL задания <Constant name="dbt" />, как показано в следующих фрагментах:

```python
# For the dbt Job URL https://YOUR_ACCESS_URL/#/accounts/16173/projects/36467/jobs/65767/
# The account_id is 16173 and the job_id is 65767
# Update lines 34 and 35
ACCOUNT_ID = "16173"
JOB_ID = "65767"
```

<WistiaVideo id="wgy7wvgqof" paddingTweak="62.25%" />

## Запуск DAG в Airflow {#run-the-airflow-dag}

Включите DAG и запустите его. Убедитесь, что задание успешно выполнено после запуска.

<Lightbox src="/img/guides/orchestration/airflow-and-dbt-platform/airflow-dag.png" title="DAG в Airflow" />

Нажмите **Monitor Job Run**, чтобы открыть сведения о запуске в <Constant name="dbt" />.
<Lightbox src="/img/guides/orchestration/airflow-and-dbt-platform/task-run-instance.png" title="Экземпляр запуска задачи" />

## Очистка {#cleaning-up}

В конце этого руководства убедитесь, что вы остановили ваш контейнер Docker. Когда вы закончите использовать Airflow, используйте следующую команду, чтобы остановить контейнер:

```bash
$ astrocloud dev stop

[+] Running 3/3
 ⠿ Container airflow-dbt-cloud_e3fe3c-webserver-1  Stopped    7.5s
 ⠿ Container airflow-dbt-cloud_e3fe3c-scheduler-1  Stopped    3.3s
 ⠿ Container airflow-dbt-cloud_e3fe3c-postgres-1   Stopped    0.3s
```

Чтобы убедиться, что развертывание остановлено, используйте следующую команду:

```bash
astrocloud dev ps
```

Это должно дать вам вывод, подобный этому:

```bash
Name                                    State   Ports
airflow-dbt-cloud_e3fe3c-webserver-1    exited
airflow-dbt-cloud_e3fe3c-scheduler-1    exited
airflow-dbt-cloud_e3fe3c-postgres-1     exited
```

<WistiaVideo id="u83nuqegn9" paddingTweak="62.25%"/>

## Часто задаваемые вопросы {#frequently-asked-questions}

### Как мы можем запускать конкретные подмножества DAG dbt в Airflow? {#how-can-we-run-specific-subsections-of-the-dbt-dag-in-airflow}

Поскольку DAG Airflow ссылается на задания <Constant name="dbt" />, ваши инженеры по аналитике могут взять на себя ответственность за настройку заданий в <Constant name="dbt" />.

Например, чтобы запускать одни модели ежечасно, а другие ежедневно, можно создать задания `Hourly Run` и `Daily Run`, использующие команды `dbt run --select tag:hourly` и `dbt run --select tag:daily` соответственно. После настройки в <Constant name="dbt" /> эти задания можно добавить в качестве шагов в DAG Airflow, как показано в этом руководстве. Подробнее см. в нашей полной [документации по синтаксису выбора узлов](/reference/node-selection/syntax).

### Как я могу повторно запустить модели с точки сбоя? {#how-can-i-re-run-models-from-the-point-of-failure}

Вы можете инициировать повторный запуск с точки сбоя с помощью конечной точки API `rerun`. См. документацию по [повторному запуску заданий](/docs/deploy/retry-jobs) для получения дополнительной информации.

### Должен ли Airflow запускать одно большое задание dbt или много заданий dbt? {#should-airflow-run-one-big-dbt-job-or-many-dbt-jobs}

Задания dbt наиболее эффективны, когда команда сборки содержит как можно больше моделей одновременно. Это связано с тем, что dbt управляет зависимостями между моделями и координирует их выполнение в порядке, что обеспечивает возможность выполнения ваших заданий в высоко параллельном режиме. Это также упрощает процесс отладки, когда модель не удается, и позволяет повторно запускать с точки сбоя.

Как явный пример, не рекомендуется иметь задание dbt для каждого отдельного узла в вашем DAG. Попробуйте объединить ваши шаги в соответствии с желаемой частотой выполнения или сгруппировать по отделам (финансы, маркетинг, успех клиентов и т.д.).

### Мы хотим запускать наши задания dbt после того, как наш инструмент загрузки данных (например, Fivetran) / конвейеры данных завершат загрузку данных. Есть ли какие-либо лучшие практики по этому поводу? {#we-want-to-kick-off-our-dbt-jobs-after-our-ingestion-tool-such-as-fivetran-data-pipelines-are-done-loading-data-any-best-practices-around-that}

В реестре DAG Astronomer представлен пример рабочего процесса, объединяющего Fivetran, <Constant name="dbt" /> и Census, [по этой ссылке](https://registry.astronomer.io/dags/fivetran-dbt_cloud-census/versions/3.0.0).
  
### Как настроить рабочий процесс CI/CD с Airflow?

### Как настроить CI/CD‑процесс с Airflow? {#how-do-you-set-up-a-cicd-workflow-with-airflow}

- [Непрерывная интеграция с <Constant name="dbt" />](/docs/deploy/continuous-integration)
- [Пример CI/CD от Astronomer](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

- [Непрерывная интеграция с <Constant name="cloud" />](/docs/deploy/continuous-integration)
- [Пример CI/CD от Astronomer](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

- [Непрерывная интеграция с dbt Cloud](/docs/deploy/continuous-integration)
- [Пример CI/CD от Astronomer](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

### Может ли dbt динамически создавать задачи в DAG, как это делает Airflow? {#can-you-trigger-notifications-if-a-dbt-job-fails-with-airflow}

Да, с помощью [функциональности Airflow для уведомлений по электронной почте и в Slack](https://www.astronomer.io/guides/error-notifications-in-airflow/) или [уведомлений <Constant name="dbt" />](/docs/deploy/job-notifications), которые поддерживают отправку по электронной почте и в Slack. Вы также можете создать [вебхук](/docs/deploy/webhooks).

Да — либо с помощью функциональности [email/Slack в Airflow](https://www.astronomer.io/guides/error-notifications-in-airflow/), либо с помощью [уведомлений <Constant name="cloud" />](/docs/deploy/job-notifications), которые поддерживают отправку уведомлений по email и в Slack. Также вы можете создать [webhook](/docs/deploy/webhooks).

### Как следует планировать внедрение dbt + Airflow? {#how-should-i-plan-my-dbt-airflow-implementation}

### Как мне планировать реализацию dbt Cloud + Airflow?

Посмотрите [эту запись](https://www.youtube.com/watch?v=n7IIThR8hGk) встречи dbt для получения некоторых советов.

</div>
