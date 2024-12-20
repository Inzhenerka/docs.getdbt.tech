---
title: Команды MetricFlow
id: metricflow-commands
description: "Запрос метрик и метаданных в вашем проекте dbt с помощью команд MetricFlow."
sidebar_label: "Команды MetricFlow"
tags: [Метрики, Семантический слой]
---

После того как вы определите метрики в вашем проекте dbt, вы сможете запрашивать метрики, измерения и значения измерений, а также проверять ваши конфигурации с помощью команд MetricFlow.

MetricFlow позволяет вам определять и запрашивать метрики в вашем проекте dbt в [dbt Cloud](/docs/cloud/about-develop-dbt) или [dbt Core](/docs/core/installation-overview). Чтобы испытать мощь универсального [Семантического слоя dbt](/docs/use-dbt-semantic-layer/dbt-sl) и динамически запрашивать эти метрики в инструментах нижнего уровня, вам понадобится аккаунт dbt Cloud [Team или Enterprise](https://www.getdbt.com/pricing/).

MetricFlow совместим с версиями Python 3.8, 3.9, 3.10 и 3.11.

## MetricFlow

MetricFlow — это пакет dbt, который позволяет вам определять и запрашивать метрики в вашем проекте dbt. Вы можете использовать MetricFlow для запроса метрик в вашем проекте dbt в dbt Cloud CLI, dbt Cloud IDE или dbt Core.

Использование MetricFlow с dbt Cloud означает, что вам не нужно управлять версиями &mdash; ваш аккаунт dbt Cloud будет автоматически управлять версиями.

Задания dbt Cloud поддерживают команду `dbt sl validate` для [автоматического тестирования ваших семантических узлов](/docs/deploy/ci-jobs#semantic-validations-in-ci). Вы также можете добавить проверки MetricFlow с вашим git-провайдером (например, GitHub Actions), установив MetricFlow (`python -m pip install metricflow`). Это позволяет вам запускать команды MetricFlow как часть ваших проверок непрерывной интеграции на PR.

<Tabs>

<TabItem value="cloud" label="MetricFlow с dbt Cloud">

В dbt Cloud запускайте команды MetricFlow непосредственно в [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) или в [dbt Cloud CLI](/docs/cloud/cloud-cli-installation).

Для пользователей dbt Cloud CLI команды MetricFlow встроены в dbt Cloud CLI, что означает, что вы можете сразу их запускать после установки dbt Cloud CLI и не нужно устанавливать MetricFlow отдельно. Вам не нужно управлять версиями, потому что ваш аккаунт dbt Cloud будет автоматически управлять версиями за вас.

</TabItem>

<TabItem value="core" label="MetricFlow с dbt Core">

Вы можете установить [MetricFlow](https://github.com/dbt-labs/metricflow#getting-started) из [PyPI](https://pypi.org/project/dbt-metricflow/). Вам нужно использовать `pip` для установки MetricFlow на операционных системах Windows или Linux:

<VersionBlock lastVersion="1.7">

1. Создайте или активируйте ваше виртуальное окружение `python -m venv venv`
2. Выполните `pip install dbt-metricflow`
  * Вы можете установить MetricFlow, используя PyPI как расширение вашего адаптера dbt в командной строке. Чтобы установить адаптер, выполните `python -m pip install "dbt-metricflow[your_adapter_name]"` и добавьте имя адаптера в конце команды. Например, для адаптера Snowflake выполните `python -m pip install "dbt-metricflow[snowflake]"`

</VersionBlock>

<VersionBlock firstVersion="1.8">

1. Создайте или активируйте ваше виртуальное окружение `python -m venv venv`
2. Выполните `pip install dbt-metricflow`
  * Вы можете установить MetricFlow, используя PyPI как расширение вашего адаптера dbt в командной строке. Чтобы установить адаптер, выполните `python -m pip install "dbt-metricflow[adapter_package_name]"` и добавьте имя адаптера в конце команды. Например, для адаптера Snowflake выполните `python -m pip install "dbt-metricflow[dbt-snowflake]"`

</VersionBlock>

**Примечание**, вам нужно будет управлять версиями между dbt Core, вашим адаптером и MetricFlow.

Обратите внимание, команды MetricFlow `mf` возвращают ошибку, если у вас установлен пакет Metafont latex. Чтобы запустить команды `mf`, удалите этот пакет.

</TabItem>
</Tabs>

## Команды MetricFlow

MetricFlow предоставляет следующие команды для получения метаданных и запроса метрик.

<Tabs>
<TabItem value="cloudcommands" label="Команды для dbt Cloud">

Вы можете использовать префикс `dbt sl` перед именем команды, чтобы выполнить их в dbt Cloud IDE или dbt Cloud CLI. Например, чтобы перечислить все метрики, выполните `dbt sl list metrics`.

Пользователи dbt Cloud CLI могут выполнить `dbt sl --help` в терминале для полного списка команд и флагов MetricFlow.

Следующая таблица перечисляет команды, совместимые с dbt Cloud IDE и dbt Cloud CLI:

| <div style={{width:'250px'}}>Команда</div>  | <div style={{width:'100px'}}>Описание</div> | dbt Cloud IDE | dbt Cloud CLI |
|---------|-------------|---------------|---------------|
| [`list metrics`](#list-metrics) | Перечисляет метрики с измерениями. |  ✅ | ✅ |
| [`list dimensions`](#list) | Перечисляет уникальные измерения для метрик. |  ✅  | ✅ |
| [`list dimension-values`](#list-dimension-values) | Перечисляет измерения с метриками. | ✅ | ✅ |
| [`list entities`](#list-entities) | Перечисляет все уникальные сущности.  |  ✅  | ✅ |
| [`list saved-queries`](#list-saved-queries) | Перечисляет доступные сохраненные запросы. Используйте флаг `--show-exports`, чтобы отобразить каждый экспорт, перечисленный под сохраненным запросом, или `--show-parameters`, чтобы показать полные параметры запроса, которые использует каждый сохраненный запрос. |  ✅ | ✅ |
| [`query`](#query) | Запрос метрик, сохраненных запросов и измерений, которые вы хотите увидеть в интерфейсе командной строки. Обратитесь к [примерам запросов](#query-examples), чтобы помочь вам начать.  |  ✅ | ✅ |
| [`validate`](#validate) | Проверяет конфигурации семантической модели. |  ✅ | ✅ |
| [`export`](#export) | Запускает экспорты для одного сохраненного запроса для тестирования и генерации экспортов в вашей среде разработки. Вы также можете использовать флаг `--select`, чтобы указать конкретные экспорты из сохраненного запроса. |  ❌ | ✅ |
| [`export-all`](#export-all) | Запускает экспорты для нескольких сохраненных запросов одновременно, экономя время и усилия. |  ❌ | ✅ |

<!--ниже команды еще не поддерживаются в dbt cloud
- [`health-checks`](#health-checks) &mdash; Выполняет проверку состояния платформы данных.
- [`tutorial`](#tutorial) &mdash; Посвященный учебник MetricFlow, чтобы помочь вам начать.
-->

:::tip Запустите dbt parse, чтобы отразить изменения метрик
Когда вы вносите изменения в метрики, убедитесь, что вы запускаете `dbt parse` как минимум, чтобы обновить Семантический слой dbt. Это обновляет файл `semantic_manifest.json`, отражая ваши изменения при запросе метрик. Запустив `dbt parse`, вам не нужно будет перестраивать все модели.
:::

<Expandable alt_header="Как я могу запросить или предварительно просмотреть метрики с помощью dbt Cloud CLI?">

Посмотрите следующее видео для короткой демонстрации того, как запросить или предварительно просмотреть метрики с помощью dbt Cloud CLI:

<LoomVideo id='09e2b287f063497d888f4bed91469d79' />

</Expandable>

</TabItem>

<TabItem value="corecommands" label="Команды для dbt Core">

Используйте префикс `mf` перед именем команды, чтобы выполнить их в dbt Core. Например, чтобы перечислить все метрики, выполните `mf list metrics`.

- [`list metrics`](#list-metrics) &mdash; Перечисляет метрики с измерениями.
- [`list dimensions`](#list) &mdash; Перечисляет уникальные измерения для метрик.
- [`list dimension-values`](#list-dimension-values) &mdash; Перечисляет измерения с метриками.
- [`list entities`](#list-entities) &mdash; Перечисляет все уникальные сущности.
- [`validate-configs`](#validate-configs) &mdash; Проверяет конфигурации семантической модели.
- [`health-checks`](#health-checks) &mdash; Выполняет проверку состояния платформы данных.
- [`tutorial`](#tutorial) &mdash; Посвященный учебник MetricFlow, чтобы помочь вам начать.
- [`query`](#query) &mdash; Запрос метрик и измерений, которые вы хотите увидеть в интерфейсе командной строки. Обратитесь к [примерам запросов](#query-examples), чтобы помочь вам начать.

</TabItem>
</Tabs>

### List metrics
Эта команда перечисляет метрики с их доступными измерениями:

```bash
dbt sl list metrics <metric_name> # В dbt Cloud

mf list metrics <metric_name> # В dbt Core

Опции:
  --search TEXT          Фильтровать доступные метрики по этому поисковому запросу
  --show-all-dimensions  Показать все измерения, связанные с метрикой.
  --help                 Показать это сообщение и выйти.
```

### List dimensions

Эта команда перечисляет все уникальные измерения для метрики или нескольких метрик. Она отображает только общие измерения при запросе нескольких метрик:

```bash
dbt sl list dimensions --metrics <metric_name> # В dbt Cloud

mf list dimensions --metrics <metric_name> # В dbt Core

Опции:
  --metrics SEQUENCE  Перечислить измерения по заданным метрикам (пересечение). Например, --metrics bookings,messages
  --help              Показать это сообщение и выйти.
```

### List dimension-values

Эта команда перечисляет все значения измерений с соответствующей метрикой:

```bash
dbt sl list dimension-values --metrics <metric_name> --dimension <dimension_name> # В dbt Cloud

mf list dimension-values --metrics <metric_name> --dimension <dimension_name> # В dbt Core

Опции:
  --dimension TEXT    Измерение для запроса значений  [обязательно]
  --metrics SEQUENCE  Метрики, связанные с измерением
                      [обязательно]
  --end-time TEXT     Необязательная метка времени iso8601 для ограничения конечного времени
                      данных (включительно)
                      *Пока недоступно в dbt Cloud
  --start-time TEXT   Необязательная метка времени iso8601 для ограничения начального времени
                      данных (включительно)
                      *Пока недоступно в dbt Cloud
  --help              Показать это сообщение и выйти.
```

### List entities

Эта команда перечисляет все уникальные сущности:

```bash
dbt sl list entities --metrics <metric_name> # В dbt Cloud 

mf list entities --metrics <metric_name> # В dbt Core

Опции:
  --metrics SEQUENCE  Перечислить сущности по заданным метрикам (пересечение). Например, --metrics bookings,messages
  --help              Показать это сообщение и выйти.
```

### List saved queries

Эта команда перечисляет все доступные сохраненные запросы:

```bash
dbt sl list saved-queries
```

Вы также можете добавить флаг (или опцию) `--show-exports`, чтобы показать каждый экспорт, перечисленный под сохраненным запросом:

```bash
dbt sl list saved-queries --show-exports
```

**Вывод**

```bash
dbt sl list saved-queries --show-exports

Список доступных сохраненных запросов:
- new_customer_orders
  экспорты:
       - Export(new_customer_orders_table, exportAs=TABLE)
       - Export(new_customer_orders_view, exportAs=VIEW)
       - Export(new_customer_orders, alias=orders, schemas=customer_schema, exportAs=TABLE)
```

### Validate

Следующая команда выполняет проверки против определенных конфигураций семантической модели.

```bash
dbt sl validate # Для пользователей dbt Cloud
mf validate-configs # Для пользователей dbt Core

Опции:
  --timeout                       # Только для dbt Cloud
                                  Необязательное время ожидания для проверки в хранилище данных в dbt Cloud.
  --dw-timeout INTEGER            # Только для dbt Core
                                  Необязательное время ожидания для шагов проверки в хранилище данных. По умолчанию None.
  --skip-dw                       # Только для dbt Core
                                  Пропустить проверки в хранилище данных.
  --show-all                      # Только для dbt Core
                                  Показать предупреждения и будущие ошибки.
  --verbose-issues                # Только для dbt Core
                                  Показать дополнительные детали о проблемах.
  --semantic-validation-workers INTEGER  # Только для dbt Core
                                  Использовать указанное количество рабочих для больших конфигураций.
  --help                          Показать это сообщение и выйти.
```

### Health checks

Следующая команда выполняет проверку состояния платформы данных, которую вы указали в конфигурациях.

Обратите внимание, в dbt Cloud команда `health-checks` не требуется, так как она использует учетные данные dbt Cloud для выполнения проверки состояния.

```bash
mf health-checks # В dbt Core
```

### Tutorial

Следуйте посвященному учебнику MetricFlow, чтобы помочь вам начать:
<!--dbt sl tutorial # В dbt Cloud-->

```bash
mf tutorial # В dbt Core
```

### Query

Создайте новый запрос с помощью MetricFlow и выполните его на вашей платформе данных. Запрос возвращает следующий результат:

```bash
dbt sl query --metrics <metric_name> --group-by <dimension_name> # В dbt Cloud 
dbt sl query --saved-query <name> # В dbt Cloud

mf query --metrics <metric_name> --group-by <dimension_name> # В dbt Core

Опции:

  --metrics SEQUENCE       Синтаксис для запроса одной метрики: --metrics metric_name
                           Например, --metrics bookings
                           Чтобы запросить несколько метрик, используйте --metrics, за которым следуют имена метрик, разделенные запятыми без пробелов.
                           Например,  --metrics bookings,messages

  --group-by SEQUENCE      Синтаксис для группировки по одному измерению/сущности: --group-by dimension_name
                           Например, --group-by ds
                           Для нескольких измерений/сущностей используйте --group-by, за которым следуют имена измерений/сущностей, разделенные запятыми без пробелов.
                           Например, --group-by ds,org
                           

  --end-time TEXT          Необязательная метка времени iso8601 для ограничения конечного
                           времени данных (включительно).
                           *Пока недоступно в dbt Cloud 

  --start-time TEXT        Необязательная метка времени iso8601 для ограничения начального
                           времени данных (включительно)
                           *Пока недоступно в dbt Cloud

  --where TEXT             SQL-подобное условие where, предоставленное в виде строки и заключенное в кавычки: --where "condition_statement"
                           Например, чтобы запросить одно условие: --where "revenue > 100"
                           Чтобы запросить несколько условий: --where "revenue > 100 and user_count < 1000"
                           Чтобы добавить фильтр измерения к фильтру where, убедитесь, что элемент фильтра является частью вашей модели. 
                           Обратитесь к [FAQ](#faqs) для получения дополнительной информации о том, как это сделать с помощью обертки шаблона.

  --limit TEXT             Ограничить количество строк, используя int, или оставить
                           пустым для отсутствия ограничения. Например: --limit 100

  --order-by SEQUENCE     Укажите метрики, измерения или группировки для сортировки.
                          Добавьте префикс `-`, чтобы отсортировать запрос в порядке убывания (DESC). 
                          Оставьте пустым для сортировки в порядке возрастания (ASC).
                          Например, чтобы отсортировать metric_time в порядке убывания: --order-by -metric_time 
                          Чтобы отсортировать metric_time в порядке возрастания и revenue в порядке убывания:  --order-by metric_time,-revenue

  --csv FILENAME           Укажите путь к файлу для вывода фрейма данных в csv

 --compile (dbt Cloud)    В выводе запроса показать запрос, который был
 --explain (dbt Core)     выполнен против хранилища данных         
                           

  --show-dataflow-plan     Показать план потока данных в выводе объяснения

  --display-plans          Показать планы (например, поток данных метрик) в браузере

  --decimals INTEGER       Выберите количество десятичных знаков для округления
                           числовых значений

  --show-sql-descriptions  Показать встроенные описания узлов в отображаемом SQL

  --help                   Показать это сообщение и выйти.
  ```

### Примеры запросов

Следующие вкладки представляют различные типы примеров запросов, которые вы можете использовать для запроса метрик и измерений. Выберите вкладку, которая лучше всего соответствует вашим потребностям:

<Tabs>

<TabItem value="eg1" label="Метрики">

Используйте этот пример, чтобы запросить несколько метрик по измерению и вернуть метрики `order_total` и `users_active` по `metric_time.`

**Запрос**
```bash
dbt sl query --metrics order_total,users_active --group-by metric_time # В dbt Cloud

mf query --metrics order_total,users_active --group-by metric_time # В dbt Core
```

**Результат**
```bash
✔ Успех 🦄 - запрос завершен через 1.24 секунды
| METRIC_TIME   |   ORDER_TOTAL |
|:--------------|---------------:|
| 2017-06-16    |         792.17 |
| 2017-06-17    |         458.35 |
| 2017-06-18    |         490.69 |
| 2017-06-19    |         749.09 |
| 2017-06-20    |         712.51 |
| 2017-06-21    |         541.65 |
```
</TabItem>

<TabItem value="eg2" label="Измерения">

Вы можете включить несколько измерений в запрос. Например, вы можете сгруппировать по измерению `is_food_order`, чтобы подтвердить, были ли заказы на еду или нет. Обратите внимание, что при запросе измерения вам нужно указать основную сущность для этого измерения. В следующем примере основной сущностью является `order_id`.

**Запрос**
```bash
dbt sl query --metrics order_total --group-by order_id__is_food_order # В dbt Cloud

mf query --metrics order_total --group-by order_id__is_food_order # В dbt Core
```

**Результат**
```bash
 Успех 🦄 - запрос завершен через 1.70 секунды
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-06-16    | True            |         499.27 |
| 2017-06-16    | False           |         292.90 |
| 2017-06-17    | True            |         431.24 |
| 2017-06-17    | False           |          27.11 |
| 2017-06-18    | True            |         466.45 |
| 2017-06-18    | False           |          24.24 |
| 2017-06-19    | False           |         300.98 |
| 2017-06-19    | True            |         448.11 |
```

</TabItem>

<TabItem value="eg3" label="Порядок/ограничение">

Вы можете добавить функции порядка и ограничения, чтобы отфильтровать и представить данные в читаемом формате. Следующий запрос ограничивает набор данных до 10 записей и упорядочивает их по `metric_time` в порядке убывания. Обратите внимание, что использование префикса `-` отсортирует запрос в порядке убывания. Без префикса `-` запрос сортируется в порядке возрастания.

Обратите внимание, что при запросе измерения вам нужно указать основную сущность для этого измерения. В следующем примере основной сущностью является `order_id`.

**Запрос**
```bash
# В dbt Cloud 
dbt sl query --metrics order_total --group-by order_id__is_food_order --limit 10 --order-by -metric_time 

# В dbt Core
mf query --metrics order_total --group-by order_id__is_food_order --limit 10 --order-by -metric_time 
```

**Результат**
```bash
✔ Успех 🦄 - запрос завершен через 1.41 секунды
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-08-31    | True            |         459.90 |
| 2017-08-31    | False           |         327.08 |
| 2017-08-30    | False           |         348.90 |
| 2017-08-30    | True            |         448.18 |
| 2017-08-29    | True            |         479.94 |
| 2017-08-29    | False           |         333.65 |
| 2017-08-28    | False           |         334.73 |
```
</TabItem>

<TabItem value="eg4" label="условие where">

Вы можете дополнительно отфильтровать набор данных, добавив условие `where` в ваш запрос. Следующий пример показывает, как запросить метрику `order_total`, сгруппированную по `is_food_order` с несколькими условиями where (заказы, которые являются заказами на еду, и заказы с недели, начинающейся с 1 февраля 2024 года или позже). Обратите внимание, что при запросе измерения вам нужно указать основную сущность для этого измерения. В следующем примере основной сущностью является `order_id`.

**Запрос**
```bash
# В dbt Cloud 
dbt sl query --metrics order_total --group-by order_id__is_food_order --where "{{ Dimension('order_id__is_food_order') }} = True and metric_time__week >= '2024-02-01'"

# В dbt Core
mf query --metrics order_total --group-by order_id__is_food_order --where "{{ Dimension('order_id__is_food_order') }} = True and metric_time__week >= '2024-02-01'" 
```

**Результат**
```bash
 ✔ Успех 🦄 - запрос завершен через 1.06 секунды
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-08-31    | True            |         459.90 |
| 2017-08-30    | True            |         448.18 |
| 2017-08-29    | True            |         479.94 |
| 2017-08-28    | True            |         513.48 |
| 2017-08-27    | True            |         568.92 |
| 2017-08-26    | True            |         471.95 |
| 2017-08-25    | True            |         452.93 |
| 2017-08-24    | True            |         384.40 |
| 2017-08-23    | True            |         423.61 |
| 2017-08-22    | True            |         401.91 |
```

</TabItem>

<TabItem value="eg5" label="Фильтр по времени">

Для фильтрации по времени существуют специальные опции начала и конца времени. Использование этих опций для фильтрации по времени позволяет MetricFlow дополнительно оптимизировать производительность запроса, когда это уместно.

Обратите внимание, что при запросе измерения вам нужно указать основную сущность для этого измерения. В следующем примере основной сущностью является `order_id`.
<!--
bash пока не поддерживается в cloud
# В dbt Cloud
dbt sl query --metrics order_total --group-by order_id__is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' 
-->
**Запрос**
```bash
# В dbt Core
mf query --metrics order_total --group-by order_id__is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' 
```

 **Результат**
```bash
✔ Успех 🦄 - запрос завершен через 1.53 секунды
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-08-27    | True            |         568.92 |
| 2017-08-26    | True            |         471.95 |
| 2017-08-25    | True            |         452.93 |
| 2017-08-24    | True            |         384.40 |
| 2017-08-23    | True            |         423.61 |
| 2017-08-22    | True            |         401.91 |
```

</TabItem>

<TabItem value="eg6" label="Сохраненные запросы">

Вы можете использовать это для часто используемых запросов. Замените `<name>` на имя вашего [сохраненного запроса](/docs/build/saved-queries).

**Запрос**
```bash
dbt sl query --saved-query <name> # В dbt Cloud

mf query --saved-query <name> # В dbt Core
```

Например, если вы используете dbt Cloud и у вас есть сохраненный запрос с именем `new_customer_orders`, вы бы выполнили `dbt sl query --saved-query new_customer_orders`.

:::info Примечание о запросе сохраненных запросов
При запросе [сохраненных запросов](/docs/build/saved-queries) вы можете использовать такие параметры, как `where`, `limit`, `order`, `compile` и так далее. Однако имейте в виду, что вы не можете получить доступ к параметрам `metric` или `group_by` в этом контексте. Это связано с тем, что они являются предопределенными и фиксированными параметрами для сохраненных запросов, и вы не можете изменить их во время запроса. Если вы хотите запросить больше метрик или измерений, вы можете построить запрос, используя стандартный формат.
:::

</TabItem>
</Tabs>

### Дополнительные примеры запросов

Следующие вкладки представляют дополнительные примеры запросов, такие как экспорт в CSV. Выберите вкладку, которая лучше всего соответствует вашим потребностям:

<Tabs>

<TabItem value="eg6" label="Флаг --compile/--explain">

Добавьте `--compile` (или `--explain` для пользователей dbt Core) в ваш запрос, чтобы увидеть SQL, сгенерированный MetricFlow.

**Запрос**

```bash
# В dbt Cloud
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --compile

# В dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --explain
```

 **Результат**
 ```bash
 ✔ Успех 🦄 - запрос завершен через 0.28 секунды
🔎 SQL (удалите --compile, чтобы увидеть данные, или добавьте --show-dataflow-plan, чтобы увидеть сгенерированный план потока данных):
select
  metric_time
  , is_food_order
  , sum(order_cost) as order_total
from (
  select
    cast(ordered_at as date) as metric_time
    , is_food_order
    , order_cost
  from analytics.js_dbt_sl_demo.orders orders_src_1
  where cast(ordered_at as date) between cast('2017-08-22' as timestamp) and cast('2017-08-27' as timestamp)
) subq_3
where is_food_order = True
group by
  metric_time
  , is_food_order
order by metric_time desc
limit 10
```

</TabItem>

<TabItem value="eg7" label="Экспорт в CSV">

Добавьте флаг `--csv file_name.csv`, чтобы экспортировать результаты вашего запроса в csv.

**Запрос**

```bash
# В dbt Cloud
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv

# В dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv
```

**Результат**
```bash
✔ Успех 🦄 - запрос завершен через 0.83 секунды
🖨 Успешно записан вывод запроса в query_example.csv
```

</TabItem>
</Tabs>

### Гранулярность времени

При желании вы можете указать гранулярность времени, на которую вы хотите агрегировать ваши данные, добавив два подчеркивания и единицу гранулярности к `metric_time`, глобальному временному измерению. Вы можете группировать гранулярность по: `day`, `week`, `month`, `quarter` и `year`.

Ниже приведен пример запроса данных метрики на месячной основе:

```bash
dbt sl query --metrics revenue --group-by metric_time__month # В dbt Cloud

mf query --metrics revenue --group-by metric_time__month # В dbt Core
```

### Export

Запустите [экспорты для конкретного сохраненного запроса](/docs/use-dbt-semantic-layer/exports#exports-for-single-saved-query). Используйте эту команду для тестирования и генерации экспортов в вашей среде разработки. Вы также можете использовать флаг `--select`, чтобы указать конкретные экспорты из сохраненного запроса. Обратитесь к [экспортам в разработке](/docs/use-dbt-semantic-layer/exports#exports-in-development) для получения дополнительной информации.

Экспорт доступен в dbt Cloud.

```bash
dbt sl export 
```

### Export-all

Запустите [экспорты для нескольких сохраненных запросов](/docs/use-dbt-semantic-layer/exports#exports-for-multiple-saved-queries) одновременно. Эта команда предоставляет удобный способ управления и выполнения экспортов для нескольких запросов одновременно, экономя время и усилия. Обратитесь к [экспортам в разработке](/docs/use-dbt-semantic-layer/exports#exports-in-development) для получения дополнительной информации.

Экспорт доступен в dbt Cloud.

```bash
dbt sl export-all 
```

## Часто задаваемые вопросы

<DetailsToggle alt_header="Как я могу добавить фильтр измерения к фильтру where?">

Чтобы добавить фильтр измерения к фильтру where, вы должны указать, что элемент фильтра является частью вашей модели, и использовать обертку шаблона: `{{Dimension('primary_entity__dimension_name')}}`.

Вот пример запроса: `dbt sl query --metrics order_total --group-by metric_time --where "{{Dimension('order_id__is_food_order')}} = True"`.

Прежде чем использовать обертку шаблона, настройте ваш терминал для экранирования фигурных скобок, чтобы фильтр шаблона работал.

<details> 
<summary>Как настроить ваш терминал для экранирования фигурных скобок?</summary>
 Чтобы настроить ваш профиль <code>.zshrc</code> для экранирования фигурных скобок, вы можете использовать команду <code>setopt</code>, чтобы включить опцию <code>BRACECCL</code>. Эта опция заставит оболочку рассматривать фигурные скобки как литералы и предотвратит расширение скобок. Обратитесь к следующим шагам, чтобы настроить это: <br />

1. Откройте ваш терминал.
2. Откройте ваш файл <code>.zshrc</code> с помощью текстового редактора, такого как <code>nano</code>, <code>vim</code> или любого другого текстового редактора, который вы предпочитаете. Вы можете использовать следующую команду, чтобы открыть его с помощью <code>nano</code>:

```bash
nano ~/.zshrc
```
3. Добавьте следующую строку в файл:

```bash
setopt BRACECCL
```
4. Сохраните и выйдите из текстового редактора (в `nano` нажмите Ctrl + O, чтобы сохранить, и Ctrl + X, чтобы выйти).

5. Источник вашего файла <code>.zshrc</code>, чтобы применить изменения:

```bash
source ~/.zshrc
```

6. После внесения этих изменений ваша оболочка Zsh будет рассматривать фигурные скобки как буквальные символы и не будет выполнять расширение скобок. Это означает, что вы можете использовать фигурные скобки без опасения непреднамеренных расширений.

Имейте в виду, что изменение файлов конфигурации вашей оболочки может повлиять на то, как ваша оболочка ведет себя. Если вы не знакомы с конфигурацией оболочки, рекомендуется сделать резервную копию вашего файла <code>.zshrc</code> перед внесением каких-либо изменений. Если вы столкнетесь с какими-либо проблемами или неожиданным поведением, вы можете вернуться к резервной копии.

</details>

</DetailsToggle>

<DetailsToggle alt_header="Почему мой запрос ограничен 100 строками в dbt Cloud CLI?">

По умолчанию `limit` для запросов из dbt Cloud CLI составляет 100 строк. Мы установили это значение по умолчанию, чтобы предотвратить возврат ненужных больших наборов данных, так как dbt Cloud CLI обычно используется для запроса Семантического слоя dbt в процессе разработки, а не для производственной отчетности или доступа к большим наборам данных. Для большинства рабочих процессов вам нужно вернуть только подмножество данных.

Однако вы можете изменить это ограничение, если необходимо, установив опцию `--limit` в вашем запросе. Например, чтобы вернуть 1000 строк, вы можете выполнить `dbt sl list metrics --limit 1000`.

</DetailsToggle>

<DetailsToggle alt_header="Как я могу запросить несколько метрик, группировок или условий where?">

Чтобы запросить несколько метрик, группировок или условий where в вашей команде, следуйте этим рекомендациям:

- Чтобы запросить несколько метрик и группировок, используйте синтаксис `--metrics` или `--group-by`, за которым следуют имена метрик или измерений/сущностей, разделенные запятыми без пробелов:
  - Пример нескольких метрик: `dbt sl query --metrics accounts_active,users_active`
  - Пример нескольких измерений/сущностей: `dbt sl query --metrics accounts_active,users_active --group-by metric_time__week,accounts__plan_tier`
 
- Чтобы запросить несколько условий where, используйте синтаксис `--where` и заключите условие в кавычки:
  - Пример нескольких условий where: `dbt sl query --metrics accounts_active,users_active --group-by metric_time__week,accounts__plan_tier --where "metric_time__week >= '2024-02-01' and accounts__plan_tier = 'coco'"`

</DetailsToggle>

<DetailsToggle alt_header="Как я могу отсортировать мой запрос в порядке возрастания или убывания?">

Когда вы запрашиваете метрики, используйте `--order-by`, чтобы указать метрики или группировки для сортировки. Опция `order_by` применяется к метрикам, измерениям и группировкам.

Добавьте префикс `-`, чтобы отсортировать ваш запрос в порядке убывания (DESC). Оставьте пустым для сортировки в порядке возрастания (ASC):

- Например, чтобы запросить метрику и отсортировать `metric_time` в порядке убывания, выполните `dbt sl query --metrics order_total --group-by metric_time --order-by -metric_time`. Обратите внимание, что префикс `-` в `-metric_time` сортирует запрос в порядке убывания.
- Чтобы запросить метрику и отсортировать `metric_time` в порядке возрастания и `revenue` в порядке убывания, выполните `dbt sl query --metrics order_total --order-by metric_time,-revenue`. Обратите внимание, что `metric_time` без префикса сортируется в порядке возрастания, а `-revenue` с префиксом `-` сортирует запрос в порядке убывания.

</DetailsToggle>