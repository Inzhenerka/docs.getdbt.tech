---
title: "Интеграция с другими инструментами оркестрации"
id: "deployment-tools"
sidebar_label: "Интеграция с другими инструментами"
pagination_next: null
---

Наряду с [<Constant name="cloud" />](/docs/deploy/jobs) существуют и другие способы планирования и запуска ваших dbt‑задач с помощью инструментов, подобных тем, которые описаны на этой странице.

Создавайте и устанавливайте эти инструменты, чтобы автоматизировать ваши data‑workflow, запускать dbt‑задачи (в том числе размещённые в <Constant name="cloud" />) и получать удобный, не требующий лишних усилий опыт, экономя время и повышая эффективность.

## Airflow

Если ваша организация использует [Airflow](https://airflow.apache.org/), существует несколько способов запуска dbt задач, включая:

<Tabs>

<TabItem value="airflowcloud" label="dbt platform">

Установка [провайдера <Constant name="cloud" />](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/index.html) для оркестрации заданий <Constant name="cloud" />. Этот пакет содержит несколько Hooks, Operators и Sensors для выполнения различных действий внутри <Constant name="cloud" />.

<Lightbox src="/img/docs/running-a-dbt-project/airflow_dbt_connector.png" title="DAG Airflow с использованием DbtCloudRunJobOperator"/>
<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_airflow_trigger.png" title="Задание dbt, запущенное из Airflow"/>

</TabItem>

<TabItem value="airflowcore" label="dbt Core">

Запуск задач <Constant name="core" /> через [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator). В этом случае обязательно установите dbt в виртуальное окружение, чтобы избежать проблем с конфликтующими зависимостями между Airflow и dbt.

</TabItem>
</Tabs>

Для получения более подробной информации о каждом из этих методов, включая примеры реализации, ознакомьтесь с [этим руководством](https://docs.astronomer.io/learn/airflow-dbt-cloud).

## Серверы автоматизации

Серверы автоматизации (такие как CodeDeploy, GitLab CI/CD ([видео](https://youtu.be/-XBIIY2pFpc?t=1301)), Bamboo и Jenkins) могут использоваться для планирования bash команд для dbt. Они также предоставляют интерфейс для просмотра логов в командной строке и интеграции с вашим git-репозиторием.

## Azure Data Factory

Интегрируйте <Constant name="cloud" /> и [Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-factory/) (ADF), чтобы обеспечить плавный процесс работы с данными — от их загрузки до трансформации. Вы можете автоматически запускать задания <Constant name="cloud" /> после завершения задач по загрузке данных, используя [dbt API](/docs/dbt-cloud-apis/overview) в ADF.

Следующее видео предоставляет подробный обзор того, как запускать задание <Constant name="cloud" /> через API в Azure Data Factory.

<LoomVideo id="8dcc1d22a0bf43a1b89ecc6f6b6d0b18" /> 

Чтобы использовать API dbt для запуска задачи в dbt Cloud через ADF:

Чтобы использовать API dbt для запуска задания в <Constant name="cloud" /> через ADF:

1. В <Constant name="cloud" /> перейдите в настройки задания для ежедневного продакшн‑задания и отключите запланированный запуск в разделе **Trigger**.
2. Создайте пайплайн в ADF, который будет запускать задание <Constant name="cloud" />.
3. Безопасно получите сервисный токен <Constant name="cloud" /> из хранилища ключей (key vault) в ADF, используя web‑вызов в качестве первого шага пайплайна.
4. Задайте параметры пайплайна, включая ID аккаунта <Constant name="cloud" /> и ID задания, а также имя key vault и секрета, в котором хранится сервисный токен.
    * Вы можете найти ID задания и ID аккаунта <Constant name="cloud" /> в URL. Например, если ваш URL — `https://YOUR_ACCESS_URL/deploy/88888/projects/678910/jobs/123456`, то ID аккаунта — 88888, а ID задания — 123456.
5. Запустите пайплайн в ADF, чтобы стартовать задание <Constant name="cloud" />, и отслеживайте статус выполнения задания <Constant name="cloud" /> в ADF.
6. В <Constant name="cloud" /> вы можете проверить статус задания и посмотреть, каким образом оно было запущено.

## Cron

Cron — это неплохой способ планирования bash команд. Однако, хотя это может показаться простым способом планирования задачи, написание кода для учета всех дополнительных функций, связанных с производственным развертыванием, часто делает этот путь более сложным по сравнению с другими вариантами, перечисленными здесь.

## Dagster

Если в вашей организации используется [Dagster](https://dagster.io/), вы можете применять библиотеку [dagster_dbt](https://docs.dagster.io/_apidocs/libraries/dagster-dbt) для интеграции команд dbt в ваши пайплайны. Эта библиотека поддерживает выполнение dbt через <Constant name="cloud" /> или <Constant name="core" />. Запуск dbt из Dagster автоматически агрегирует метаданные о запусках dbt. Подробнее см. в [примере пайплайна](https://dagster.io/blog/dagster-dbt).

## Рабочие процессы Databricks

Используйте Databricks Workflows для вызова API заданий <Constant name="cloud" />, что дает несколько преимуществ: интеграцию с другими ETL‑процессами, использование возможностей заданий <Constant name="cloud" />, разделение ответственности, а также возможность пользовательского запуска заданий на основе собственных условий или логики. Эти преимущества обеспечивают большую модульность, более эффективную отладку и гибкость при планировании заданий <Constant name="cloud" />.

Дополнительную информацию см. в руководстве [Databricks workflows and <Constant name="cloud" /> jobs](/guides/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs).

## Kestra

Если в вашей организации используется [Kestra](http://kestra.io/), вы можете воспользоваться [dbt plugin](https://kestra.io/plugins/plugin-dbt) для оркестрации заданий <Constant name="cloud" /> и <Constant name="core" />. Пользовательский интерфейс (UI) Kestra содержит встроенные [Blueprints](https://kestra.io/docs/user-interface-guide/blueprints) — готовые к использованию рабочие процессы. Перейдите на страницу Blueprints в левом навигационном меню и [выберите тег dbt](https://demo.kestra.io/ui/blueprints/community?selectedTag=36), чтобы найти несколько примеров планирования команд <Constant name="core" /> и заданий <Constant name="cloud" /> в составе ваших конвейеров данных. После каждого запланированного или ad‑hoc выполнения workflow вкладка Outputs в UI Kestra позволяет скачать и просмотреть все артефакты сборки dbt. Представления Gantt и Topology дополнительно визуализируют метаданные, чтобы показать зависимости и время выполнения ваших моделей и тестов dbt. Задача <Constant name="cloud" /> предоставляет удобные ссылки для быстрого перехода между интерфейсами Kestra и <Constant name="cloud" />.

## Orchestra

Если в вашей организации используется [Orchestra](https://getorchestra.io), вы можете запускать задания dbt с помощью API <Constant name="cloud" />. Создайте API‑токен в своей учетной записи <Constant name="cloud" /> и используйте его для аутентификации Orchestra в [Orchestra Portal](https://app.getorchestra.io). Подробности см. в [документации Orchestra по <Constant name="cloud" />](https://orchestra-1.gitbook.io/orchestra-portal/integrations/transformation/dbt-cloud).

Orchestra автоматически собирает метаданные из ваших запусков, чтобы вы могли просматривать ваши задачи dbt в контексте остальной части вашего стека данных.

Ниже приведён пример деталей выполнения в <Constant name="cloud" /> для задания, запущенного с помощью Orchestra:

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_orchestra_trigger.png" title="Пример запуска задачи dbt с помощью Orchestra"/>

Ниже приведен пример просмотра родословной в Orchestra для задач dbt:

<Lightbox src="/img/docs/running-a-dbt-project/orchestra_lineage_dbt_cloud.png" title="Пример просмотра родословной для задач dbt в Orchestra"/>

## Prefect

Если в вашей организации используется [Prefect](https://www.prefect.io/), то способ запуска заданий будет зависеть от версии dbt, которую вы используете, а также от того, оркестрируете ли вы задания <Constant name="cloud" /> или <Constant name="core" />. Ниже приведены различные возможные варианты:

<Lightbox src="/img/docs/running-a-dbt-project/prefect_dag_dbt_cloud.jpg" width="75%" title="Prefect DAG using a dbt job run flow"/>

<Lightbox src="/img/docs/running-a-dbt-project/prefect_dag_dbt_cloud.jpg" width="75%" title="Prefect DAG с использованием потока выполнения задачи dbt Cloud"/> 

### Prefect 2

<Tabs>

<TabItem value="prefect2cloud" label="dbt platform">

- Используйте поток [trigger_dbt_cloud_job_run_and_wait_for_completion](https://prefecthq.github.io/prefect-dbt/cloud/jobs/#prefect_dbt.cloud.jobs.trigger_dbt_cloud_job_run_and_wait_for_completion).
- По мере выполнения задач вы можете опрашивать dbt, чтобы узнать, завершилась ли задача без ошибок, через [пользовательский интерфейс Prefect (UI)](https://docs.prefect.io/ui/overview/).

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_job_prefect.jpg" title="dbt job triggered by Prefect"/>

</TabItem>

<TabItem value="prefect2core" label="dbt Core">

- Используйте задачу [trigger_dbt_cli_command](https://prefecthq.github.io/prefect-dbt/cli/commands/#prefect_dbt.cli.commands.trigger_dbt_cli_command).
- Для получения подробной информации о каждом из этих методов см. [документацию prefect-dbt](https://prefecthq.github.io/prefect-dbt/).

</TabItem>
</Tabs>

### Prefect 1

<Tabs>

<TabItem value="prefect1cloud" label="dbt platform">

- Запускайте задания <Constant name="cloud" /> с помощью задачи [DbtCloudRunJob](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtcloudrunjob).  
- При выполнении этой задачи будет сгенерирован markdown‑артефакт, доступный для просмотра в интерфейсе Prefect UI.  
- Артефакт будет содержать ссылки на dbt‑артефакты, созданные в результате выполнения задания.

</TabItem>

<TabItem value="prefect1core" label="dbt Core">

- Используйте [DbtShellTask](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtshelltask) для планирования, выполнения и мониторинга ваших запусков dbt.
- Используйте поддерживаемую [ShellTask](https://docs.prefect.io/api/latest/tasks/shell.html#shelltask) для выполнения команд dbt через оболочку.

</TabItem>
</Tabs>

## Связанные документы

## Связанные материалы

- [Тарифы и планы <Constant name="cloud" />](https://www.getdbt.com/pricing/)
- [Руководства по быстрому старту](/guides)
- [Вебхуки для ваших jobs](/docs/deploy/webhooks)
- [Руководства по оркестрации](/guides)
- [Команды для вашего production‑развёртывания](https://discourse.getdbt.com/t/what-are-the-dbt-commands-you-run-in-your-production-deployment-of-dbt/366)
