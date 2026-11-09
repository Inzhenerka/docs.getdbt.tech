---
title: "Интеграция с другими инструментами оркестрации"
id: "deployment-tools"
sidebar_label: "Интеграция с другими инструментами"
pagination_next: null
---

Помимо [<Constant name="dbt" />](/docs/deploy/jobs), узнайте о других способах планирования и запуска заданий dbt с помощью инструментов, подобных описанным на этой странице.

Создавайте и устанавливайте эти инструменты, чтобы автоматизировать рабочие процессы обработки данных, запускать задания dbt (включая задания, размещённые в <Constant name="dbt" />) и работать без лишних хлопот, экономя время и повышая эффективность.

## Airflow {#airflow}

Если ваша организация использует [Airflow](https://airflow.apache.org/), существует несколько способов запуска dbt задач, включая:

<Tabs>

<TabItem value="airflowcloud" label="dbt platform">

Установка [провайдера <Constant name="dbt" />](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/index.html) для оркестрации заданий <Constant name="dbt" />. Этот пакет содержит различные хуки (Hooks), операторы (Operators) и сенсоры (Sensors) для выполнения различных действий в <Constant name="dbt" />.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/running-a-dbt-project/airflow_dbt_connector.png" title="DAG Airflow с использованием DbtCloudRunJobOperator"/>

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_airflow_trigger.png" title="Задание dbt, запущенное из Airflow"/>

</DocCarousel>

</TabItem>

<TabItem value="airflowcore" label="dbt v1">

Запуск задач <Constant name="core" /> через [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator). В этом случае обязательно установите dbt в виртуальное окружение, чтобы избежать проблем с конфликтующими зависимостями между Airflow и dbt.

</TabItem>
</Tabs>

Для получения более подробной информации о каждом из этих методов, включая примеры реализации, ознакомьтесь с [этим руководством](https://docs.astronomer.io/learn/airflow-dbt-cloud).

## Серверы автоматизации {#automation-servers}

Серверы автоматизации (такие как CodeDeploy, GitLab CI/CD ([видео](https://youtu.be/-XBIIY2pFpc?t=1301)), Bamboo и Jenkins) могут использоваться для планирования bash команд для dbt. Они также предоставляют интерфейс для просмотра логов в командной строке и интеграции с вашим git-репозиторием.

## Azure Data Factory {#azure-data-factory}

Интегрируйте <Constant name="dbt" /> и [Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-factory/) (ADF), чтобы обеспечить непрерывный процесс работы с данными — от загрузки до преобразования. Используя [dbt API](/docs/dbt-apis/overview) в ADF, вы можете автоматически запускать задания <Constant name="dbt" /> после завершения заданий загрузки данных.

Ниже подробно описано, как запустить задание <Constant name="dbt" /> с помощью API в Azure Data Factory. Чтобы использовать dbt API для запуска задания в <Constant name="dbt" /> через ADF:

1. В <Constant name="dbt" /> перейдите к настройкам ежедневного задания для производственной среды и отключите запуск по расписанию в разделе **Trigger**.
2. Создайте конвейер в ADF для запуска задания <Constant name="dbt" />.
3. Настройте безопасное получение служебного токена <Constant name="dbt" /> из хранилища ключей в ADF, используя веб-вызов в качестве первого шага конвейера.
4. Задайте параметры конвейера, включая идентификатор аккаунта и идентификатор задания <Constant name="dbt" />, а также имя хранилища ключей и имя секрета, содержащего служебный токен.
    * Идентификаторы задания и аккаунта <Constant name="dbt" /> можно найти в URL. Например, если URL — `https://YOUR_ACCESS_URL/deploy/88888/projects/678910/jobs/123456`, то идентификатор аккаунта — 88888, а идентификатор задания — 123456
5. Запустите конвейер в ADF, чтобы запустить задание <Constant name="dbt" />, и отслеживайте статус задания <Constant name="dbt" /> в ADF.
6. В <Constant name="dbt" /> вы можете проверить статус задания и узнать, каким способом оно было запущено в <Constant name="dbt" />.

## Cron {#cron}

Cron — это неплохой способ планирования bash команд. Однако, хотя это может показаться простым способом планирования задачи, написание кода для учета всех дополнительных функций, связанных с производственным развертыванием, часто делает этот путь более сложным по сравнению с другими вариантами, перечисленными здесь.

## Dagster {#dagster}

Если ваша организация использует [Dagster](https://dagster.io/), вы можете использовать библиотеку [dagster_dbt](https://docs.dagster.io/_apidocs/libraries/dagster-dbt), чтобы интегрировать команды dbt в свои пайплайны. Эта библиотека поддерживает выполнение dbt через <Constant name="dbt" /> или <Constant name="core" />. При запуске dbt из Dagster автоматически собираются метаданные о запусках dbt. Подробности см. в [примере пайплайна](https://dagster.io/blog/dagster-dbt).

## Рабочие процессы Databricks {#databricks-workflows}

Используйте рабочие процессы Databricks для вызова API заданий <Constant name="dbt" />. Такой подход дает ряд преимуществ: интеграцию с другими ETL-процессами, использование возможностей заданий <Constant name="dbt" />, разделение ответственности и запуск заданий на основе пользовательских условий или логики. Эти преимущества обеспечивают большую модульность, эффективную отладку и гибкость при планировании заданий <Constant name="dbt" />.

Подробнее см. в руководстве [Рабочие процессы Databricks и задания <Constant name="dbt" />](/guides/databricks-workflows).

## Kestra {#kestra}

Если ваша организация использует [Kestra](http://kestra.io/), вы можете воспользоваться [плагином dbt](https://kestra.io/plugins/plugin-dbt) для оркестрации заданий <Constant name="dbt" /> и <Constant name="core" />. Пользовательский интерфейс (UI) Kestra содержит встроенные [Blueprints](https://kestra.io/docs/user-interface-guide/blueprints) — готовые к использованию рабочие процессы. Перейдите на страницу Blueprints через левое меню навигации и [выберите тег dbt](https://demo.kestra.io/ui/blueprints/community?selectedTag=36), чтобы найти примеры запуска команд <Constant name="core" /> и заданий <Constant name="dbt" /> по расписанию в составе ваших конвейеров данных. После каждого выполнения рабочего процесса по расписанию или по запросу вкладка Outputs в интерфейсе Kestra позволяет скачать и предварительно просмотреть все артефакты сборки dbt. Представления Gantt и Topology дополнительно отображают метаданные, визуализируя зависимости и время выполнения ваших моделей и тестов dbt. Задача <Constant name="dbt" /> предоставляет удобные ссылки для быстрого перехода между интерфейсами Kestra и <Constant name="dbt" />.

## Orchestra {#orchestra}

Если ваша организация использует [Orchestra](https://getorchestra.io), вы можете запускать задания dbt через API <Constant name="dbt" />. Создайте API-токен в своей учетной записи <Constant name="dbt" /> и используйте его для аутентификации Orchestra в [Orchestra Portal](https://app.getorchestra.io). Подробнее см. в [документации Orchestra по интеграции с <Constant name="dbt" />](https://orchestra-1.gitbook.io/orchestra-portal/integrations/transformation/dbt-cloud).

Orchestra автоматически собирает метаданные из ваших запусков, чтобы вы могли просматривать ваши задачи dbt в контексте остальной части вашего стека данных.

Ниже приведён пример сведений о запуске в <Constant name="dbt" /> для задания, запущенного через Orchestra:

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_orchestra_trigger.png" title="Пример запуска задачи dbt с помощью Orchestra"/>

Ниже приведен пример просмотра родословной в Orchestra для задач dbt:

<Lightbox src="/img/docs/running-a-dbt-project/orchestra_lineage_dbt_cloud.png" title="Пример просмотра родословной для задач dbt в Orchestra"/>

## Prefect {#prefect}

Если в вашей организации используется [Prefect](https://www.prefect.io/), то способ запуска заданий будет зависеть от версии dbt, которую вы используете, а также от того, оркестрируете ли вы задания <Constant name="cloud" /> или <Constant name="core" />. Ниже приведены различные возможные варианты:

Если ваша организация использует [Prefect](https://www.prefect.io/), способ запуска заданий зависит от используемой версии dbt и от того, для каких заданий вы настраиваете оркестрацию: <Constant name="dbt" /> или <Constant name="core" />. Ознакомьтесь со следующими вариантами:

<Lightbox src="/img/docs/running-a-dbt-project/prefect_dag_dbt_cloud.jpg" width="75%" title="Prefect DAG с использованием потока выполнения задачи dbt Cloud"/> 

### Prefect 2 {#prefect-2}

<Tabs>

<TabItem value="prefect2cloud" label="dbt platform">

- Используйте поток [trigger_dbt_cloud_job_run_and_wait_for_completion](https://prefecthq.github.io/prefect-dbt/cloud/jobs/#prefect_dbt.cloud.jobs.trigger_dbt_cloud_job_run_and_wait_for_completion).
- По мере выполнения задач вы можете опрашивать dbt, чтобы узнать, завершилась ли задача без ошибок, через [пользовательский интерфейс Prefect (UI)](https://docs.prefect.io/ui/overview/).


</TabItem>

<TabItem value="prefect2core" label="dbt v1">

- Используйте задачу [trigger_dbt_cli_command](https://prefecthq.github.io/prefect-dbt/cli/commands/#prefect_dbt.cli.commands.trigger_dbt_cli_command).
- Для получения подробной информации о каждом из этих методов см. [документацию prefect-dbt](https://prefecthq.github.io/prefect-dbt/).

</TabItem>
</Tabs>

### Prefect 1 {#prefect-1}

<Tabs>

<TabItem value="prefect1cloud" label="dbt platform">

- Запускайте задания <Constant name="dbt" /> с помощью задачи [DbtCloudRunJob](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtcloudrunjob). 
- При выполнении этой задачи создаётся артефакт в формате Markdown, доступный для просмотра в интерфейсе Prefect. 
- Артефакт будет содержать ссылки на артефакты dbt, созданные в результате выполнения задания.

</TabItem>

<TabItem value="prefect1core" label="dbt v1">

- Используйте [DbtShellTask](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtshelltask) для планирования, выполнения и мониторинга ваших запусков dbt.
- Используйте поддерживаемую [ShellTask](https://docs.prefect.io/api/latest/tasks/shell.html#shelltask) для выполнения команд dbt через оболочку.

</TabItem>
</Tabs>

## Связанные документы {#related-docs}

## Связанные материалы

- [Тарифы и цены <Constant name="dbt" />](https://www.getdbt.com/pricing/)
- [Руководства по быстрому старту](/guides)
- [Вебхуки для ваших заданий](/docs/deploy/webhooks)
- [Руководства по оркестрации](/guides)
- [Команды для развертывания в производственной среде](https://discourse.getdbt.com/t/what-are-the-dbt-commands-you-run-in-your-production-deployment-of-dbt/366)
