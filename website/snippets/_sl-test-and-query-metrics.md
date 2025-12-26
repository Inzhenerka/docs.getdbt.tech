Для работы с метриками в dbt у вас есть несколько инструментов для валидации или выполнения команд. Вот как вы можете тестировать и запрашивать метрики в зависимости от вашей настройки:

- [**Пользователи <Constant name="cloud_ide" />**](#dbt-cloud-ide-users) &mdash; Запускайте [команды MetricFlow](/docs/build/metricflow-commands#metricflow-commands) напрямую в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), чтобы выполнять запросы и предварительный просмотр метрик. Визуально просматривайте метрики на вкладке **Lineage**.
- [**Пользователи <Constant name="cloud_cli" />**](#dbt-cloud-cli-users) &mdash; [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) позволяет запускать [команды MetricFlow](/docs/build/metricflow-commands#metricflow-commands) для выполнения запросов и предварительного просмотра метрик прямо в интерфейсе командной строки.
- **Пользователи <Constant name="core" />** &mdash; Используйте MetricFlow CLI для выполнения команд. Хотя это руководство ориентировано на пользователей <Constant name="cloud" />, пользователи <Constant name="core" /> могут найти подробные инструкции по настройке MetricFlow CLI на странице [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commands). Обратите внимание: для использования <Constant name="semantic_layer" /> у вас должен быть аккаунт уровня Starter или Enterprise ([подробнее](https://www.getdbt.com/)).

Кроме того, вы можете выполнять команды с помощью SQL-клиентов, таких как DataGrip, DBeaver или RazorSQL.

### Пользователи Studio IDE

Вы можете использовать префикс `dbt sl` перед именем команды, чтобы выполнять их в <Constant name="cloud" />. Например, чтобы вывести список всех метрик, выполните `dbt sl list metrics`. Полный список команд MetricFlow, доступных в <Constant name="cloud_ide" />, см. на странице [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commandss).

Кнопка **Status** в <Constant name="cloud_ide" /> (расположена в правом нижнем углу редактора) отображает статус **Error**, если в определении метрики или семантической модели есть ошибка. Вы можете нажать на эту кнопку, чтобы увидеть конкретную проблему и устранить её.

После просмотра убедитесь, что вы зафиксировали и объединили свои изменения в вашем проекте.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-ide-dag.png" title="Проверяйте свои метрики с помощью вкладки Lineage в IDE." />

### Пользователи Cloud CLI

Этот раздел предназначен для пользователей <Constant name="cloud_cli" />. Команды MetricFlow интегрированы с <Constant name="cloud" />, что означает, что вы можете запускать команды MetricFlow сразу после установки <Constant name="cloud_cli" />. Ваша учетная запись будет автоматически управлять контролем версий.

Следуйте следующим шагам, чтобы начать:

1. Установите [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) (если вы ещё этого не сделали). Затем перейдите в директорию вашего проекта dbt.
2. Выполните команду dbt, например `dbt parse`, `dbt run`, `dbt compile` или `dbt build`. Если этого не сделать, вы получите сообщение об ошибке, которое начинается с: «ensure that you've ran an artifacts....».
3. MetricFlow строит семантический граф и генерирует файл `semantic_manifest.json` в <Constant name="cloud" />, который сохраняется в директории `/target`. Если вы используете пример Jaffle Shop, выполните `dbt seed && dbt run`, чтобы убедиться, что необходимые данные загружены в вашу платформу данных перед продолжением.

:::tip Запускайте dbt parse, чтобы отразить изменения метрик
Когда вы вносите изменения в метрики, обязательно как минимум выполните `dbt parse`, чтобы обновить <Constant name="semantic_layer" />. Это обновляет файл `semantic_manifest.json`, отражая ваши изменения при запросах метрик. При запуске `dbt parse` вам не потребуется пересобирать все модели.
:::

4. Выполните `dbt sl --help`, чтобы подтвердить, что у вас установлен MetricFlow и что вы можете просмотреть доступные команды.
5. Выполните `dbt sl query --metrics <metric_name> --group-by <dimension_name>`, чтобы запросить метрики и измерения. Например, чтобы запросить `order_total` и `order_count` (обе метрики), а затем сгруппировать их по `order_date` (измерение), выполните:

   ```sql
   dbt sl query --metrics order_total,order_count --group-by order_date
   ```
6. Убедитесь, что значения метрик соответствуют вашим ожиданиям. Чтобы лучше понять, как генерируется метрика, вы можете просмотреть сгенерированный SQL, если введете `--compile` в командной строке.
7. Зафиксируйте и объедините изменения в коде, содержащие определения метрик.