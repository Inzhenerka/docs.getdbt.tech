---
title: Airflow и dbt Cloud
id: airflow-and-dbt-cloud
# time_to_complete: '30 minutes' комментируем до тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Cloud', 'Оркестрация']
level: 'Средний'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Многие организации уже используют [Airflow](https://airflow.apache.org/) для оркестрации своих рабочих процессов с данными. dbt Cloud отлично работает с Airflow, позволяя вам выполнять ваш dbt код в dbt Cloud, сохраняя при этом обязанности по оркестрации за Airflow. Это гарантирует, что метаданные вашего проекта (важные для таких инструментов, как dbt Explorer) доступны и актуальны, при этом позволяя вам использовать Airflow для общих задач, таких как:

- Планирование других процессов вне выполнения dbt
- Обеспечение запуска [dbt job](/docs/deploy/job-scheduler) до или после другого процесса вне dbt Cloud
- Запуск dbt job только после завершения другого

В этом руководстве вы узнаете, как:

1. Создать рабочую локальную среду Airflow
2. Вызвать dbt Cloud job с помощью Airflow
3. Повторно использовать протестированный и надежный код Airflow для ваших конкретных случаев использования

Вы также получите лучшее понимание того, как это поможет:

- Уменьшить когнитивную нагрузку при создании и поддержке пайплайнов
- Избежать "ад зависимости" (подумайте о конфликтах `pip install`)
- Определить более четкую передачу рабочих процессов между инженерами данных и аналитическими инженерами

## Предварительные требования

- [Учетная запись dbt Cloud Teams или Enterprise](https://www.getdbt.com/pricing/) (с [административным доступом](/docs/cloud/manage-access/enterprise-permissions)) для создания токена службы. Права для токенов службы можно найти [здесь](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- [Бесплатная учетная запись Docker](https://hub.docker.com/signup) для входа в Docker Desktop, который будет установлен в процессе начальной настройки.
- Локальный цифровой блокнот для временного копирования и вставки API ключей и URL-адресов

🙌 Давайте начнем! 🙌

## Установите Astro CLI

Astro — это управляемый программный сервис, который включает ключевые функции для команд, работающих с Airflow. Чтобы использовать Astro, мы установим Astro CLI, который предоставит нам доступ к полезным командам для работы с Airflow локально. Вы можете узнать больше об Astro [здесь](https://docs.astronomer.io/astro/).

В этом примере мы используем Homebrew для установки Astro CLI. Следуйте инструкциям для установки Astro CLI для вашей операционной системы [здесь](https://docs.astronomer.io/astro/install-cli).

```bash
brew install astro
```

<WistiaVideo id="uosszw1qul" paddingTweak="62.25%" />

## Установите и запустите Docker Desktop

Docker позволяет нам создать среду со всеми приложениями и зависимостями, необходимыми для этого руководства.

Следуйте инструкциям [здесь](https://docs.docker.com/desktop/) для установки Docker Desktop для вашей операционной системы. После установки Docker убедитесь, что он запущен для следующих шагов.

<WistiaVideo id="qr84pa8k9f" paddingTweak="62.25%" />

## Клонируйте репозиторий airflow-dbt-cloud

Откройте терминал и клонируйте [репозиторий airflow-dbt-cloud](https://github.com/dbt-labs/airflow-dbt-cloud). Он содержит примеры Airflow DAG, которые вы будете использовать для оркестрации вашего dbt Cloud job. После клонирования перейдите в проект `airflow-dbt-cloud`.

```bash
git clone https://github.com/dbt-labs/airflow-dbt-cloud.git
cd airflow-dbt-cloud
```

Для получения дополнительной информации о клонировании репозиториев GitHub обратитесь к разделу "[Клонирование репозитория](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)" в документации GitHub.

## Запустите контейнер Docker

1. Из директории `airflow-dbt-cloud`, которую вы клонировали и открыли на предыдущем шаге, выполните следующую команду, чтобы запустить вашу локальную установку Airflow:

   ```bash
   astro dev start
   ```

   Когда это завершится, вы должны увидеть сообщение, похожее на следующее:

   ```bash
   Airflow запускается! Это может занять несколько минут…

   Проект запущен! Все компоненты теперь доступны.

   Airflow Webserver: http://localhost:8080
   Postgres Database: localhost:5432/postgres
   Учетные данные по умолчанию для Airflow UI: admin:admin
   Учетные данные по умолчанию для Postgres DB: postgres:postgres
   ```

2. Откройте интерфейс Airflow. Запустите ваш веб-браузер и перейдите по адресу **Airflow Webserver** из вашего вывода выше (в нашем случае `http://localhost:8080`).

   Это перенаправит вас на вашу локальную инстанцию Airflow. Вам нужно будет войти с **учетными данными по умолчанию**:

   - Имя пользователя: admin
   - Пароль: admin

   ![Экран входа в Airflow](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-login.png)

<WistiaVideo id="2rzsjo0uml" paddingTweak="62.25%" />

## Создайте токен службы dbt Cloud

[Создайте токен службы](/docs/dbt-cloud-apis/service-tokens) с правами `Job Admin` в dbt Cloud. Убедитесь, что вы сохранили копию токена, так как вы не сможете получить к нему доступ позже.

<WistiaVideo id="amubh6qmwq" paddingTweak="62.25%" />

## Создайте dbt Cloud job

[Создайте job в вашей учетной записи dbt Cloud](/docs/deploy/deploy-jobs#create-and-schedule-jobs), уделяя особое внимание информации в следующих пунктах.

- Настройте job с полными командами, которые вы хотите включить, когда этот job запускается. Этот пример кода имеет Airflow, который запускает dbt Cloud job и все его команды, вместо того чтобы явно указывать отдельные модели для выполнения из Airflow.
- Убедитесь, что расписание отключено, так как мы будем использовать Airflow для запуска.
- После нажатия `сохранить` на job убедитесь, что вы скопировали URL и сохранили его для дальнейшего использования. URL будет выглядеть примерно так:

```html
https://YOUR_ACCESS_URL/#/accounts/{account_id}/projects/{project_id}/jobs/{job_id}/
```

<WistiaVideo id="qiife5rzlp" paddingTweak="62.25%" />

## Подключите dbt Cloud к Airflow

Теперь у вас есть все рабочие элементы, чтобы начать работу с Airflow + dbt Cloud. Пора **настроить соединение** и **запустить DAG в Airflow**, который запускает dbt Cloud job.

1. В интерфейсе Airflow перейдите в раздел Admin и нажмите на **Connections**

    ![Меню соединений Airflow](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-connections-menu.png)

2. Нажмите на знак `+`, чтобы добавить новое соединение, затем нажмите на выпадающее меню, чтобы найти тип соединения dbt Cloud

    ![Тип соединения](/img/guides/orchestration/airflow-and-dbt-cloud/connection-type.png)

3. Введите ваши данные соединения и ваш идентификатор учетной записи dbt Cloud по умолчанию. Это можно найти в вашем URL dbt Cloud после раздела маршрута учетных записей (`/accounts/{YOUR_ACCOUNT_ID}`), например, учетная запись с идентификатором 16173 увидит это в своем URL: `https://YOUR_ACCESS_URL/#/accounts/16173/projects/36467/jobs/65767/`

    ![Тип соединения](/img/guides/orchestration/airflow-and-dbt-cloud/connection-type-configured.png)

## Обновите заполнители в примере кода

Добавьте ваш `account_id` и `job_id` в файл python [dbt_cloud_run_job.py](https://github.com/dbt-labs/airflow-dbt-cloud/blob/main/dags/dbt_cloud_run_job.py).

Оба идентификатора включены в URL dbt Cloud job, как показано в следующих фрагментах:

```python
# Для URL dbt Cloud Job https://YOUR_ACCESS_URL/#/accounts/16173/projects/36467/jobs/65767/
# account_id равен 16173, а job_id равен 65767
# Обновите строки 34 и 35
ACCOUNT_ID = "16173"
JOB_ID = "65767"
```

<WistiaVideo id="wgy7wvgqof" paddingTweak="62.25%" />

## Запустите Airflow DAG

Включите DAG и запустите его. Проверьте, что job завершилась успешно после выполнения.

![Airflow DAG](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-dag.png)

Нажмите "Monitor Job Run", чтобы открыть детали выполнения в dbt Cloud.
![Экземпляр выполнения задачи](/img/guides/orchestration/airflow-and-dbt-cloud/task-run-instance.png)

## Очистка

В конце этого руководства убедитесь, что вы остановили ваш контейнер Docker. Когда вы закончите использовать Airflow, используйте следующую команду, чтобы остановить контейнер:

```bash
$ astrocloud dev stop

[+] Запуск 3/3
 ⠿ Контейнер airflow-dbt-cloud_e3fe3c-webserver-1  Остановлен    7.5s
 ⠿ Контейнер airflow-dbt-cloud_e3fe3c-scheduler-1  Остановлен    3.3s
 ⠿ Контейнер airflow-dbt-cloud_e3fe3c-postgres-1   Остановлен    0.3s
```

Чтобы убедиться, что развертывание остановлено, используйте следующую команду:

```bash
astrocloud dev ps
```

Это должно дать вам вывод, похожий на этот:

```bash
Name                                    State   Ports
airflow-dbt-cloud_e3fe3c-webserver-1    exited
airflow-dbt-cloud_e3fe3c-scheduler-1    exited
airflow-dbt-cloud_e3fe3c-postgres-1     exited
```

<WistiaVideo id="u83nuqegn9" paddingTweak="62.25%"/>

## Часто задаваемые вопросы

### Как мы можем запускать конкретные подсекции dbt DAG в Airflow?

Поскольку Airflow DAG ссылается на dbt Cloud jobs, ваши аналитические инженеры могут взять на себя ответственность за настройку jobs в dbt Cloud.

Например, чтобы запускать некоторые модели каждый час, а другие ежедневно, будут jobs, такие как `Hourly Run` или `Daily Run`, использующие команды `dbt run --select tag:hourly` и `dbt run --select tag:daily` соответственно. После настройки в dbt Cloud их можно добавить как шаги в Airflow DAG, как показано в этом руководстве. Обратитесь к нашей полной [документации по синтаксису выбора узлов здесь](/reference/node-selection/syntax).

### Как я могу перезапустить модели с точки сбоя?  

Вы можете инициировать перезапуск с точки сбоя с помощью конечной точки API `rerun`. См. документацию по [повторным запускам jobs](/docs/deploy/retry-jobs) для получения дополнительной информации.

### Должен ли Airflow запускать один большой dbt job или много dbt jobs?

dbt jobs наиболее эффективны, когда команда сборки содержит как можно больше моделей одновременно. Это связано с тем, что dbt управляет зависимостями между моделями и координирует их выполнение в порядке, что обеспечивает возможность высокопараллельного выполнения ваших jobs. Это также упрощает процесс отладки, когда модель не проходит, и позволяет перезапускать с точки сбоя.

Как явный пример, не рекомендуется иметь dbt job для каждого отдельного узла в вашем DAG. Попробуйте объединить ваши шаги в зависимости от желаемой частоты выполнения или группировать по отделам (финансы, маркетинг, успех клиентов...) вместо этого.

### Мы хотим запускать наши dbt jobs после того, как наш инструмент загрузки (например, Fivetran) / конвейеры данных завершат загрузку данных. Есть ли лучшие практики по этому поводу?

Реестр DAG Astronomer содержит пример рабочего процесса, объединяющего Fivetran, dbt Cloud и Census [здесь](https://registry.astronomer.io/dags/fivetran-dbt_cloud-census/versions/3.0.0).
  
### Как настроить CI/CD рабочий процесс с Airflow?

Посмотрите на эти два ресурса для создания вашего собственного CI/CD пайплайна:

- [Непрерывная интеграция с dbt Cloud](/docs/deploy/continuous-integration)
- [Пример CI/CD от Astronomer](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

### Может ли dbt динамически создавать задачи в DAG, как это делает Airflow?

Как обсуждалось выше, мы предпочитаем держать jobs вместе и содержать столько узлов, сколько необходимо. Если вам необходимо запускать узлы по одному по какой-то причине, то ознакомьтесь с [этой статьей](https://www.astronomer.io/blog/airflow-dbt-1/) для получения некоторых советов.

### Можете ли вы инициировать уведомления, если dbt job не проходит с помощью Airflow?

Да, либо через функциональность [Airflow по электронной почте/Slack](https://www.astronomer.io/guides/error-notifications-in-airflow/), либо через [уведомления dbt Cloud](/docs/deploy/job-notifications), которые поддерживают уведомления по электронной почте и Slack. Вы также можете создать [вебхук](/docs/deploy/webhooks).

### Как мне спланировать реализацию dbt Cloud + Airflow?

Посмотрите [эту запись](https://www.youtube.com/watch?v=n7IIThR8hGk) встречи dbt для получения некоторых советов.

</div>