---
title: Airflow и dbt Cloud
id: airflow-and-dbt-cloud
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Cloud', 'Orchestration']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Многие организации уже используют [Airflow](https://airflow.apache.org/) для оркестрации своих рабочих процессов с данными. dbt Cloud отлично работает с Airflow, позволяя вам выполнять ваш dbt код в dbt Cloud, сохраняя при этом обязанности по оркестрации за Airflow. Это гарантирует, что метаданные вашего проекта (важные для таких инструментов, как dbt Explorer) доступны и актуальны, при этом вы можете использовать Airflow для общих задач, таких как:

- Планирование других процессов вне выполнения dbt
- Обеспечение запуска [dbt задания](/docs/deploy/job-scheduler) до или после другого процесса вне dbt Cloud
- Запуск dbt задания только после завершения другого

В этом руководстве вы узнаете, как:

1. Создать рабочую локальную среду Airflow
2. Запустить dbt Cloud задание с помощью Airflow
3. Повторно использовать проверенный и надежный код Airflow для ваших конкретных случаев использования

Вы также лучше поймете, как это поможет:

- Снизить когнитивную нагрузку при создании и поддержке конвейеров
- Избежать проблем с зависимостями (например, конфликтов `pip install`)
- Определить более четкую передачу рабочих процессов между инженерами данных и аналитическими инженерами

## Предварительные требования

- [Аккаунт dbt Cloud Teams или Enterprise](https://www.getdbt.com/pricing/) (с [административным доступом](/docs/cloud/manage-access/enterprise-permissions)) для создания сервисного токена. Разрешения для сервисных токенов можно найти [здесь](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- [Бесплатный аккаунт Docker](https://hub.docker.com/signup) для входа в Docker Desktop, который будет установлен на начальном этапе.
- Локальный цифровой блокнот для временного копирования и вставки API ключей и URL-адресов

🙌 Давайте начнем! 🙌

## Установка Astro CLI

Astro — это управляемый программный сервис, который включает ключевые функции для команд, работающих с Airflow. Чтобы использовать Astro, мы установим Astro CLI, который предоставит нам доступ к полезным командам для работы с Airflow локально. Подробнее об Astro можно прочитать [здесь](https://docs.astronomer.io/astro/).

В этом примере мы используем Homebrew для установки Astro CLI. Следуйте инструкциям по установке Astro CLI для вашей операционной системы [здесь](https://docs.astronomer.io/astro/install-cli).

```bash
brew install astro
```

<WistiaVideo id="uosszw1qul" paddingTweak="62.25%" />

## Установка и запуск Docker Desktop

Docker позволяет нам развернуть среду со всеми приложениями и зависимостями, необходимыми для этого руководства.

Следуйте инструкциям [здесь](https://docs.docker.com/desktop/), чтобы установить Docker Desktop для вашей операционной системы. После установки Docker убедитесь, что он запущен для выполнения следующих шагов.

<WistiaVideo id="qr84pa8k9f" paddingTweak="62.25%" />

## Клонирование репозитория airflow-dbt-cloud

Откройте ваш терминал и клонируйте [репозиторий airflow-dbt-cloud](https://github.com/dbt-labs/airflow-dbt-cloud). Он содержит пример DAGs для Airflow, которые вы будете использовать для оркестрации вашего dbt Cloud задания. После клонирования перейдите в проект `airflow-dbt-cloud`.

```bash
git clone https://github.com/dbt-labs/airflow-dbt-cloud.git
cd airflow-dbt-cloud
```

Для получения дополнительной информации о клонировании репозиториев GitHub, обратитесь к разделу "[Клонирование репозитория](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)" в документации GitHub.

## Запуск контейнера Docker

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

   ![Экран входа в Airflow](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-login.png)

<WistiaVideo id="2rzsjo0uml" paddingTweak="62.25%" />

## Создание сервисного токена dbt Cloud

[Создайте сервисный токен](/docs/dbt-cloud-apis/service-tokens) с привилегиями `Job Admin` в dbt Cloud. Убедитесь, что вы сохранили копию токена, так как позже вы не сможете получить к нему доступ.

<WistiaVideo id="amubh6qmwq" paddingTweak="62.25%" />

## Создание задания в dbt Cloud

[Создайте задание в вашем аккаунте dbt Cloud](/docs/deploy/deploy-jobs#create-and-schedule-jobs), уделяя особое внимание информации в следующих пунктах.

- Настройте задание с полными командами, которые вы хотите включить при запуске этого задания. Этот пример кода предполагает, что Airflow запускает dbt Cloud задание и все его команды, вместо явного указания отдельных моделей для запуска изнутри Airflow.
- Убедитесь, что расписание выключено, так как мы будем использовать Airflow для запуска.
- После того как вы нажмете `сохранить` на задании, убедитесь, что вы скопировали URL и сохранили его для дальнейшего использования. URL будет выглядеть примерно так:

```html
https://YOUR_ACCESS_URL/#/accounts/{account_id}/projects/{project_id}/jobs/{job_id}/
```

<WistiaVideo id="qiife5rzlp" paddingTweak="62.25%" />

## Подключение dbt Cloud к Airflow

Теперь у вас есть все рабочие элементы для запуска Airflow + dbt Cloud. Пора **настроить подключение** и **запустить DAG в Airflow**, который запускает dbt Cloud задание.

1. В интерфейсе Airflow перейдите в раздел Admin и нажмите на **Connections**

    ![Меню подключений Airflow](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-connections-menu.png)

2. Нажмите на знак `+`, чтобы добавить новое подключение, затем выберите тип подключения dbt Cloud из выпадающего списка

    ![Тип подключения](/img/guides/orchestration/airflow-and-dbt-cloud/connection-type.png)

3. Введите данные вашего подключения и ваш идентификатор аккаунта dbt Cloud по умолчанию. Это можно найти в URL вашего dbt Cloud после раздела accounts (`/accounts/{YOUR_ACCOUNT_ID}`), например, аккаунт с идентификатором 16173 увидит это в своем URL: `https://YOUR_ACCESS_URL/#/accounts/16173/projects/36467/jobs/65767/`

    ![Тип подключения](/img/guides/orchestration/airflow-and-dbt-cloud/connection-type-configured.png)

## Обновление заполнителей в примере кода

Добавьте ваш `account_id` и `job_id` в файл python [dbt_cloud_run_job.py](https://github.com/dbt-labs/airflow-dbt-cloud/blob/main/dags/dbt_cloud_run_job.py).

Оба идентификатора включены в URL задания dbt Cloud, как показано в следующих фрагментах:

```python
# Для URL задания dbt Cloud https://YOUR_ACCESS_URL/#/accounts/16173/projects/36467/jobs/65767/
# account_id это 16173, а job_id это 65767
# Обновите строки 34 и 35
ACCOUNT_ID = "16173"
JOB_ID = "65767"
```

<WistiaVideo id="wgy7wvgqof" paddingTweak="62.25%" />

## Запуск DAG в Airflow

Включите DAG и запустите его. Убедитесь, что задание успешно выполнено после запуска.

![DAG в Airflow](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-dag.png)

Нажмите "Monitor Job Run", чтобы открыть детали выполнения в dbt Cloud.
![Экземпляр выполнения задачи](/img/guides/orchestration/airflow-and-dbt-cloud/task-run-instance.png)

## Очистка

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

## Часто задаваемые вопросы

### Как мы можем запускать конкретные подмножества DAG dbt в Airflow?

Поскольку DAG Airflow ссылается на задания dbt Cloud, ваши аналитические инженеры могут взять на себя ответственность за настройку заданий в dbt Cloud.

Например, чтобы запускать некоторые модели ежечасно, а другие ежедневно, будут задания, такие как `Hourly Run` или `Daily Run`, использующие команды `dbt run --select tag:hourly` и `dbt run --select tag:daily` соответственно. После настройки в dbt Cloud их можно добавить как шаги в DAG Airflow, как показано в этом руководстве. Обратитесь к нашей полной [документации по синтаксису выбора узлов здесь](/reference/node-selection/syntax).

### Как я могу повторно запустить модели с точки сбоя?

Вы можете инициировать повторный запуск с точки сбоя с помощью конечной точки API `rerun`. См. документацию по [повторному запуску заданий](/docs/deploy/retry-jobs) для получения дополнительной информации.

### Должен ли Airflow запускать одно большое задание dbt или много заданий dbt?

Задания dbt наиболее эффективны, когда команда сборки содержит как можно больше моделей одновременно. Это связано с тем, что dbt управляет зависимостями между моделями и координирует их выполнение в порядке, что обеспечивает возможность выполнения ваших заданий в высоко параллельном режиме. Это также упрощает процесс отладки, когда модель не удается, и позволяет повторно запускать с точки сбоя.

Как явный пример, не рекомендуется иметь задание dbt для каждого отдельного узла в вашем DAG. Попробуйте объединить ваши шаги в соответствии с желаемой частотой выполнения или сгруппировать по отделам (финансы, маркетинг, успех клиентов и т.д.).

### Мы хотим запускать наши задания dbt после того, как наш инструмент загрузки данных (например, Fivetran) / конвейеры данных завершат загрузку данных. Есть ли какие-либо лучшие практики по этому поводу?

Реестр DAG Astronomer имеет пример рабочего процесса, объединяющего Fivetran, dbt Cloud и Census [здесь](https://registry.astronomer.io/dags/fivetran-dbt_cloud-census/versions/3.0.0).

### Как настроить рабочий процесс CI/CD с Airflow?

Ознакомьтесь с этими двумя ресурсами для создания вашего собственного конвейера CI/CD:

- [Непрерывная интеграция с dbt Cloud](/docs/deploy/continuous-integration)
- [Пример CI/CD от Astronomer](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

### Может ли dbt динамически создавать задачи в DAG, как это делает Airflow?

Как обсуждалось выше, мы предпочитаем держать задания объединенными и содержащими столько узлов, сколько необходимо. Если вам по какой-то причине нужно запускать узлы по одному, ознакомьтесь с [этой статьей](https://www.astronomer.io/blog/airflow-dbt-1/) для получения некоторых советов.

### Могу ли я настроить уведомления, если задание dbt завершится с ошибкой в Airflow?

Да, либо через [функциональность email/slack Airflow](https://www.astronomer.io/guides/error-notifications-in-airflow/), либо [уведомления dbt Cloud](/docs/deploy/job-notifications), которые поддерживают уведомления по email и Slack. Вы также можете создать [вебхук](/docs/deploy/webhooks).

### Как мне планировать реализацию dbt Cloud + Airflow?

Посмотрите [эту запись](https://www.youtube.com/watch?v=n7IIThR8hGk) встречи dbt для получения некоторых советов.

</div>