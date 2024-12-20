---
title: "Интеграция с другими инструментами оркестрации"
id: "deployment-tools"
sidebar_label: "Интеграция с другими инструментами"
pagination_next: null
---

Помимо [dbt Cloud](/docs/deploy/jobs), узнайте о других способах планирования и запуска ваших dbt задач с помощью инструментов, описанных на этой странице.

Установите и настройте эти инструменты для автоматизации ваших рабочих процессов с данными, запускайте dbt задачи (включая те, которые размещены в dbt Cloud) и наслаждайтесь беспроблемной работой, экономя время и повышая эффективность.

## Airflow

Если ваша организация использует [Airflow](https://airflow.apache.org/), существует несколько способов запуска dbt задач, включая:

<Tabs>

<TabItem value="airflowcloud" label="dbt Cloud">

Установка [провайдера dbt Cloud](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/index.html) для оркестрации задач dbt Cloud. Этот пакет содержит множество Hooks, Operators и Sensors для выполнения различных действий в dbt Cloud.

<Lightbox src="/img/docs/running-a-dbt-project/airflow_dbt_connector.png" title="Airflow DAG с использованием DbtCloudRunJobOperator"/>
<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_airflow_trigger.png" title="Задача dbt Cloud, запущенная Airflow"/>

</TabItem>

<TabItem value="airflowcore" label="dbt Core">

Запуск задач dbt Core через [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator). В этом случае обязательно установите dbt в виртуальную среду, чтобы избежать проблем с конфликтующими зависимостями между Airflow и dbt.

</TabItem>
</Tabs>

Для получения более подробной информации о каждом из этих методов, включая примеры реализации, ознакомьтесь с [этим руководством](https://docs.astronomer.io/learn/airflow-dbt-cloud).

## Серверы автоматизации

Серверы автоматизации (такие как CodeDeploy, GitLab CI/CD ([видео](https://youtu.be/-XBIIY2pFpc?t=1301)), Bamboo и Jenkins) могут использоваться для планирования bash команд для dbt. Они также предоставляют интерфейс для просмотра логов в командной строке и интеграции с вашим git-репозиторием.

## Azure Data Factory

Интегрируйте dbt Cloud и [Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-factory/) (ADF) для плавного процесса обработки данных от их загрузки до трансформации. Вы можете без проблем запускать задачи dbt Cloud после завершения задач загрузки данных, используя [API dbt](/docs/dbt-cloud-apis/overview) в ADF.

Следующее видео предоставляет подробный обзор того, как запускать задачу dbt Cloud через API в Azure Data Factory.

<LoomVideo id="8dcc1d22a0bf43a1b89ecc6f6b6d0b18" /> 

Чтобы использовать API dbt для запуска задачи в dbt Cloud через ADF:

1. В dbt Cloud перейдите в настройки задачи ежедневного производства и отключите запланированный запуск в разделе **Trigger**.
2. Создайте конвейер в ADF для запуска задачи dbt Cloud.
3. Безопасно получите токен сервиса dbt Cloud из хранилища ключей в ADF, используя веб-вызов в качестве первого шага в конвейере.
4. Установите параметры в конвейере, включая ID аккаунта dbt Cloud и ID задачи, а также имя хранилища ключей и секрет, содержащий токен сервиса.
    * Вы можете найти ID задачи и аккаунта dbt Cloud в URL, например, если ваш URL `https://YOUR_ACCESS_URL/deploy/88888/projects/678910/jobs/123456`, то ID аккаунта 88888, а ID задачи 123456.
5. Запустите конвейер в ADF, чтобы начать задачу dbt Cloud и отслеживать статус задачи dbt Cloud в ADF.
6. В dbt Cloud вы можете проверить статус задачи и как она была запущена в dbt Cloud.

## Cron

Cron — это неплохой способ планирования bash команд. Однако, хотя это может показаться простым способом планирования задачи, написание кода для учета всех дополнительных функций, связанных с производственным развертыванием, часто делает этот путь более сложным по сравнению с другими вариантами, перечисленными здесь.

## Dagster

Если ваша организация использует [Dagster](https://dagster.io/), вы можете использовать библиотеку [dagster_dbt](https://docs.dagster.io/_apidocs/libraries/dagster-dbt) для интеграции команд dbt в ваши конвейеры. Эта библиотека поддерживает выполнение dbt через dbt Cloud или dbt Core. Запуск dbt из Dagster автоматически агрегирует метаданные о ваших запусках dbt. Обратитесь к [примеру конвейера](https://dagster.io/blog/dagster-dbt) для получения подробной информации.

## Рабочие процессы Databricks

Используйте рабочие процессы Databricks для вызова API задач dbt Cloud, что имеет несколько преимуществ, таких как интеграция с другими процессами ETL, использование функций задач dbt Cloud, разделение обязанностей и пользовательский запуск задач на основе пользовательских условий или логики. Эти преимущества приводят к большей модульности, эффективной отладке и гибкости в планировании задач dbt Cloud.

Для получения дополнительной информации обратитесь к руководству по [рабочим процессам Databricks и задачам dbt Cloud](/guides/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs).

## Kestra

Если ваша организация использует [Kestra](http://kestra.io/), вы можете использовать [плагин dbt](https://kestra.io/plugins/plugin-dbt) для оркестрации задач dbt Cloud и dbt Core. Пользовательский интерфейс (UI) Kestra имеет встроенные [Blueprints](https://kestra.io/docs/user-interface-guide/blueprints), предоставляющие готовые к использованию рабочие процессы. Перейдите на страницу Blueprints в левом меню навигации и [выберите тег dbt](https://demo.kestra.io/ui/blueprints/community?selectedTag=36), чтобы найти несколько примеров планирования команд dbt Core и задач dbt Cloud в рамках ваших конвейеров данных. После каждого запланированного или разового выполнения рабочего процесса вкладка Outputs в UI Kestra позволяет загружать и просматривать все артефакты сборки dbt. Вид Gantt и Topology дополнительно отображает метаданные для визуализации зависимостей и времени выполнения ваших моделей и тестов dbt. Задача dbt Cloud предоставляет удобные ссылки для легкой навигации между Kestra и UI dbt Cloud.

## Orchestra

Если ваша организация использует [Orchestra](https://getorchestra.io), вы можете запускать задачи dbt, используя API dbt Cloud. Создайте API токен из вашего аккаунта dbt Cloud и используйте его для аутентификации Orchestra в [портале Orchestra](https://app.getorchestra.io). Для получения подробной информации обратитесь к [документации Orchestra о dbt Cloud](https://orchestra-1.gitbook.io/orchestra-portal/integrations/transformation/dbt-cloud).

Orchestra автоматически собирает метаданные из ваших запусков, чтобы вы могли просматривать ваши задачи dbt в контексте остальной части вашего стека данных.

Ниже приведен пример деталей запуска в dbt Cloud для задачи, запущенной Orchestra:

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_orchestra_trigger.png" title="Пример запуска задачи dbt с помощью Orchestra"/>

Ниже приведен пример просмотра родословной в Orchestra для задач dbt:

<Lightbox src="/img/docs/running-a-dbt-project/orchestra_lineage_dbt_cloud.png" title="Пример просмотра родословной для задач dbt в Orchestra"/>

## Prefect

Если ваша организация использует [Prefect](https://www.prefect.io/), способ запуска ваших задач зависит от версии dbt, которую вы используете, и от того, оркестрируете ли вы задачи dbt Cloud или dbt Core. Ознакомьтесь с различными вариантами:

<Lightbox src="/img/docs/running-a-dbt-project/prefect_dag_dbt_cloud.jpg" width="75%" title="Prefect DAG с использованием потока выполнения задачи dbt Cloud"/> 

### Prefect 2

<Tabs>

<TabItem value="prefect2cloud" label="dbt Cloud">

- Используйте поток [trigger_dbt_cloud_job_run_and_wait_for_completion](https://prefecthq.github.io/prefect-dbt/cloud/jobs/#prefect_dbt.cloud.jobs.trigger_dbt_cloud_job_run_and_wait_for_completion).
- По мере выполнения задач вы можете опрашивать dbt, чтобы узнать, завершилась ли задача без ошибок, через [пользовательский интерфейс Prefect (UI)](https://docs.prefect.io/ui/overview/).

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_job_prefect.jpg" title="Задача dbt Cloud, запущенная Prefect"/> 

</TabItem>

<TabItem value="prefect2core" label="dbt Core">

- Используйте задачу [trigger_dbt_cli_command](https://prefecthq.github.io/prefect-dbt/cli/commands/#prefect_dbt.cli.commands.trigger_dbt_cli_command).
- Для получения подробной информации о каждом из этих методов см. [документацию prefect-dbt](https://prefecthq.github.io/prefect-dbt/).

</TabItem>
</Tabs>

### Prefect 1

<Tabs>

<TabItem value="prefect1cloud" label="dbt Cloud">

- Запускайте задачи dbt Cloud с помощью задачи [DbtCloudRunJob](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtcloudrunjob).
- Запуск этой задачи создаст артефакт в формате markdown, доступный для просмотра в UI Prefect.
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
- [Вебхуки для ваших задач](/docs/deploy/webhooks)
- [Руководства по оркестрации](https://docs.getdbt.com/guides/orchestration)
- [Команды для вашего производственного развертывания](https://discourse.getdbt.com/t/what-are-the-dbt-commands-you-run-in-your-production-deployment-of-dbt/366)