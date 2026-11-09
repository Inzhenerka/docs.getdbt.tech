Для работы с метриками в dbt у вас есть несколько инструментов для валидации или выполнения команд. Вот как вы можете тестировать и запрашивать метрики в зависимости от вашей настройки:

- [**Пользователи <Constant name="studio_ide" />**](#studio-ide-users) &mdash; Выполняйте [команды MetricFlow](/docs/build/metricflow-commands#metricflow-commands) непосредственно в [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), чтобы запрашивать и просматривать метрики. Просматривайте визуальное представление метрик на вкладке **Lineage**.
- [**Пользователи <Constant name="platform_cli" />**](#dbt-cli-users) &mdash; [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) позволяет выполнять [команды MetricFlow](/docs/build/metricflow-commands#metricflow-commands) для запроса и предварительного просмотра метрик непосредственно в интерфейсе командной строки.
- **Пользователи <Constant name="core" />** &mdash; Используйте MetricFlow CLI для выполнения команд. Хотя это руководство предназначено прежде всего для пользователей <Constant name="dbt" />, пользователи <Constant name="core" /> могут найти подробные инструкции по настройке MetricFlow CLI на странице [«Команды MetricFlow»](/docs/build/metricflow-commands#metricflow-commands). Обратите внимание: для использования <Constant name="semantic_layer" /> необходима [учётная запись с тарифом Starter или Enterprise](https://www.getdbt.com/).

Кроме того, вы можете выполнять команды с помощью SQL-клиентов, таких как DataGrip, DBeaver или RazorSQL.

### Пользователи Studio IDE {#studio-ide-users}

Вы можете использовать префикс `dbt sl` перед именем команды, чтобы выполнять команды в <Constant name="dbt" />. Например, чтобы вывести список всех метрик, выполните `dbt sl list metrics`. Полный список команд MetricFlow, доступных в <Constant name="studio_ide" />, приведён на странице [Команды MetricFlow](/docs/build/metricflow-commands#metricflow-commands).

**Кнопка статуса** в <Constant name="studio_ide" /> (расположенная в правом нижнем углу редактора) отображает статус **Error**, если в определении метрики или семантической модели есть ошибка. Нажмите эту кнопку, чтобы узнать, в чём именно заключается проблема, и устранить её.

После просмотра убедитесь, что вы зафиксировали и объединили свои изменения в вашем проекте.

### Пользователи <Constant name="platform_cli" /> {#dbt-cli-users}

Этот раздел предназначен для пользователей <Constant name="platform_cli" />. Команды MetricFlow интегрированы с <Constant name="dbt" />, поэтому вы можете выполнять команды MetricFlow сразу после установки <Constant name="platform_cli" />. Управление версиями будет осуществляться автоматически в вашей учетной записи.

Следуйте следующим шагам, чтобы начать:

1. Установите [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) (если вы ещё этого не сделали). Затем перейдите в каталог вашего проекта dbt.
2. Выполните команду dbt, например `dbt parse`, `dbt run`, `dbt compile` или `dbt build`. Если этого не сделать, вы получите сообщение об ошибке, которое начинается с: "ensure that you've ran an artifacts....".
3. MetricFlow строит семантический граф и создаёт в <Constant name="dbt" /> файл `semantic_manifest.json`, который сохраняется в каталоге `/target`. <VersionBlock firstVersion="1.12">Начиная с <Constant name="dbt" /> v1.12, dbt также записывает файл `osi_document.json` в каталог `target/` на этапе разбора. Подробнее см. в разделе [Семантический манифест](/reference/artifacts/sl-manifest#apache-ossie-document).</VersionBlock> Если вы используете пример Jaffle Shop, выполните `dbt seed && dbt run`, чтобы перед продолжением убедиться, что необходимые данные есть на вашей платформе данных.

:::tip Выполняйте dbt parse, чтобы отразить изменения метрик
При изменении метрик обязательно выполняйте как минимум `dbt parse`, чтобы обновить <Constant name="semantic_layer" />. Эта команда обновляет файл `semantic_manifest.json`<VersionBlock firstVersion="1.12"> и `osi_document.json`</VersionBlock>, чтобы ваши изменения учитывались при запросах к метрикам. Выполняя `dbt parse`, вы избавляетесь от необходимости заново собирать все модели.
:::

4. Выполните `dbt sl --help`, чтобы подтвердить, что у вас установлен MetricFlow и что вы можете просмотреть доступные команды.
5. Выполните `dbt sl query --metrics <metric_name> --group-by <dimension_name>`, чтобы запросить метрики и измерения. Например, чтобы запросить `order_total` и `order_count` (обе метрики), а затем сгруппировать их по `order_date` (измерение), выполните:

   ```sql
   dbt sl query --metrics order_total,order_count --group-by order_id__order_date
   ```
6. Убедитесь, что значения метрик соответствуют вашим ожиданиям. Чтобы лучше понять, как генерируется метрика, вы можете просмотреть сгенерированный SQL, если введете `--compile` в командной строке.
7. Зафиксируйте и объедините изменения в коде, содержащие определения метрик.