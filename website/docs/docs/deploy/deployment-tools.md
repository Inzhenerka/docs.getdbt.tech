---
title: "Интеграция с другими инструментами оркестрации"
id: "deployment-tools"
sidebar_label: "Интеграция с другими инструментами"
pagination_next: null
---

Помимо [dbt Cloud](/docs/deploy/jobs), узнайте о других способах планирования и выполнения ваших dbt задач с помощью инструментов, описанных на этой странице.

Создайте и установите эти инструменты для автоматизации ваших рабочих процессов с данными, запуска dbt задач (включая те, что размещены на dbt Cloud), и наслаждайтесь беспроблемным опытом, экономя время и повышая эффективность.

## Airflow

Если ваша организация использует [Airflow](https://airflow.apache.org/), существует несколько способов запуска ваших dbt задач, включая:

<Tabs>

<TabItem value="airflowcloud" label="dbt Cloud">

Установка [dbt Cloud Provider](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/index.html) для оркестрации задач dbt Cloud. Этот пакет содержит несколько Hooks, Operators и Sensors для выполнения различных действий в dbt Cloud.

<Lightbox src="/img/docs/running-a-dbt-project/airflow_dbt_connector.png" title="Airflow DAG с использованием DbtCloudRunJobOperator"/>
<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_airflow_trigger.png" title="Задача dbt Cloud, запущенная Airflow"/>

</TabItem>

<TabItem value="airflowcore" label="dbt Core">

Вызов задач dbt Core через [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator). В этом случае убедитесь, что вы установили dbt в виртуальной среде, чтобы избежать проблем с конфликтующими зависимостями между Airflow и dbt.

</TabItem>
</Tabs>

Для получения более подробной информации о каждом из этих методов, включая примеры реализации, ознакомьтесь с [этим руководством](https://docs.astronomer.io/learn/airflow-dbt-cloud).

## Серверы автоматизации

Серверы автоматизации (такие как CodeDeploy, GitLab CI/CD ([видео](https://youtu.be/-XBIIY2pFpc?t=1301)), Bamboo и Jenkins) могут использоваться для планирования bash команд для dbt. Они также предоставляют интерфейс для просмотра логов командной строки и интегрируются с вашим git репозиторием.

## Azure Data Factory

Интегрируйте dbt Cloud и [Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-factory/) (ADF) для плавного процесса обработки данных от их получения до трансформации. Вы можете без проблем запускать задачи dbt Cloud по завершении задач получения данных, используя [dbt API](/docs/dbt-cloud-apis/overview) в ADF.

Следующее видео предоставляет вам подробный обзор того, как запустить задачу dbt Cloud через API в Azure Data Factory.

<LoomVideo id="8dcc1d22a0bf43a1b89ecc6f6b6d0b18" /> 

Чтобы использовать dbt API для запуска задачи в dbt Cloud через ADF:

1. В dbt Cloud перейдите к настройкам задачи ежедневного производственного задания и отключите запланированный запуск в разделе **Trigger**.
2. Вам нужно создать конвейер в ADF для запуска задачи dbt Cloud.
3. Безопасно получите токен службы dbt Cloud из хранилища ключей в ADF, используя веб-вызов в качестве первого шага в конвейере.
4. Установите параметры в конвейере, включая идентификатор учетной записи dbt Cloud и идентификатор задачи, а также имя хранилища ключей и секрет, содержащий токен службы. 
    * Вы можете найти идентификатор задачи и учетной записи dbt Cloud в URL, например, если ваш URL `https://YOUR_ACCESS_URL/deploy/88888/projects/678910/jobs/123456`, идентификатор учетной записи — 88888, а идентификатор задачи — 123456.
5. Запустите конвейер в ADF, чтобы начать задачу dbt Cloud, и следите за статусом задачи dbt Cloud в ADF.
6. В dbt Cloud вы можете проверить статус задачи и то, как она была запущена в dbt Cloud.

## Cron

Cron — это неплохой способ планирования bash команд. Однако, хотя это может показаться простым способом запланировать задачу, написание кода для обработки всех дополнительных функций, связанных с производственным развертыванием, часто делает этот путь более сложным по сравнению с другими вариантами, перечисленными здесь.

## Dagster

Если ваша организация использует [Dagster](https://dagster.io/), вы можете использовать библиотеку [dagster_dbt](https://docs.dagster.io/_apidocs/libraries/dagster-dbt) для интеграции команд dbt в ваши конвейеры. Эта библиотека поддерживает выполнение dbt через dbt Cloud или dbt Core. Запуск dbt из Dagster автоматически агрегирует метаданные о ваших запусках dbt. Обратитесь к [примеру конвейера](https://dagster.io/blog/dagster-dbt) для получения подробной информации.

## Рабочие процессы Databricks 

Используйте рабочие процессы Databricks для вызова API задачи dbt Cloud, что имеет несколько преимуществ, таких как интеграция с другими ETL процессами, использование функций задач dbt Cloud, разделение обязанностей и пользовательский запуск задач на основе пользовательских условий или логики. Эти преимущества приводят к большей модульности, эффективной отладке и гибкости в планировании задач dbt Cloud.

Для получения дополнительной информации обратитесь к руководству по [рабочим процессам Databricks и задачам dbt Cloud](/guides/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs).

## Kestra

Если ваша организация использует [Kestra](http://kestra.io/), вы можете использовать [dbt плагин](https://kestra.io/plugins/plugin-dbt) для оркестрации задач dbt Cloud и dbt Core. Пользовательский интерфейс (UI) Kestra имеет встроенные [Blueprints](https://kestra.io/docs/user-interface-guide/blueprints), предоставляющие готовые к использованию рабочие процессы. Перейдите на страницу Blueprints в левом навигационном меню и [выберите тег dbt](https://demo.kestra.io/ui/blueprints/community?selectedTag=36), чтобы найти несколько примеров планирования команд dbt Core и задач dbt Cloud в рамках ваших рабочих процессов с данными. После каждого запланированного или разового выполнения рабочего процесса вкладка Outputs в интерфейсе Kestra позволяет вам загружать и просматривать все артефакты сборки dbt. Вид Gantt и Topology дополнительно отображает метаданные для визуализации зависимостей и времени выполнения ваших моделей и тестов dbt. Задача dbt Cloud предоставляет удобные ссылки для легкой навигации между Kestra и интерфейсом dbt Cloud.

## Orchestra

Если ваша организация использует [Orchestra](https://getorchestra.io), вы можете запускать задачи dbt, используя API dbt Cloud. Создайте токен API в вашей учетной записи dbt Cloud и используйте его для аутентификации Orchestra в [Orchestra Portal](https://app.getorchestra.io). Для получения подробной информации обратитесь к [документации Orchestra по dbt Cloud](https://orchestra-1.gitbook.io/orchestra-portal/integrations/transformation/dbt-cloud).

Orchestra автоматически собирает метаданные из ваших запусков, чтобы вы могли просматривать ваши dbt задачи в контексте остальной части вашего стека данных.

Следующее является примером деталей запуска в dbt Cloud для задачи, запущенной Orchestra:

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_orchestra_trigger.png" title="Пример запуска задачи dbt Orchestra"/>

Следующее является примером просмотра родословной в Orchestra для задач dbt:

<Lightbox src="/img/docs/running-a-dbt-project/orchestra_lineage_dbt_cloud.png" title="Пример просмотра родословной для задач dbt в Orchestra"/>

## Prefect

Если ваша организация использует [Prefect](https://www.prefect.io/), способ запуска ваших задач зависит от версии dbt, которую вы используете, и от того, оркестрируете ли вы задачи dbt Cloud или dbt Core. Ознакомьтесь с различными вариантами:

<Lightbox src="/img/docs/running-a-dbt-project/prefect_dag_dbt_cloud.jpg" width="75%" title="DAG Prefect с использованием запуска задачи dbt Cloud"/> 

### Prefect 2

<Tabs>

<TabItem value="prefect2cloud" label="dbt Cloud">

- Используйте поток [trigger_dbt_cloud_job_run_and_wait_for_completion](https://prefecthq.github.io/prefect-dbt/cloud/jobs/#prefect_dbt.cloud.jobs.trigger_dbt_cloud_job_run_and_wait_for_completion). 
- Пока задачи выполняются, вы можете опрашивать dbt, чтобы узнать, завершилась ли задача без ошибок, через [интерфейс пользователя (UI) Prefect](https://docs.prefect.io/ui/overview/).

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_job_prefect.jpg" title="Задача dbt Cloud, запущенная Prefect"/> 

</TabItem>

<TabItem value="prefect2core" label="dbt Core">

- Используйте задачу [trigger_dbt_cli_command](https://prefecthq.github.io/prefect-dbt/cli/commands/#prefect_dbt.cli.commands.trigger_dbt_cli_command). 
- Для получения подробной информации о каждом из этих методов смотрите [документацию prefect-dbt](https://prefecthq.github.io/prefect-dbt/).

</TabItem>
</Tabs>

### Prefect 1

<Tabs>

<TabItem value="prefect1cloud" label="dbt Cloud">

- Запускайте задачи dbt Cloud с помощью задачи [DbtCloudRunJob](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtcloudrunjob). 
- Запуск этой задачи создаст артефакт в формате markdown, доступный в интерфейсе Prefect. 
- Артефакт будет содержать ссылки на артефакты dbt, созданные в результате выполнения задачи.

</TabItem>

<TabItem value="prefect1core" label="dbt Core">

- Используйте [DbtShellTask](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtshelltask) для планирования, выполнения и мониторинга ваших запусков dbt. 
- Используйте поддерживаемую [ShellTask](https://docs.prefect.io/api/latest/tasks/shell.html#shelltask) для выполнения команд dbt через оболочку.

</TabItem>
</Tabs>

## Связанные документы

- [Планы и цены dbt Cloud](https://www.getdbt.com/pricing/)
- [Руководства по быстрому старту](/guides)
- [Webhooks для ваших задач](/docs/deploy/webhooks)
- [Руководства по оркестрации](https://docs.getdbt.com/guides/orchestration)
- [Команды для вашего производственного развертывания](https://discourse.getdbt.com/t/what-are-the-dbt-commands-you-run-in-your-production-deployment-of-dbt/366)