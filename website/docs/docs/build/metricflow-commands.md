---
title: Команды MetricFlow
id: metricflow-commands
description: "Запрашивайте метрики и метаданные в вашем проекте dbt с помощью команд MetricFlow."
sidebar_label: "Команды MetricFlow"
tags: [Метрики, Семантический уровень]
---

После определения метрик в вашем проекте dbt вы можете запрашивать метрики, измерения и значения измерений, а также проверять свои конфигурации с помощью команд MetricFlow.

MetricFlow позволяет вам определять и запрашивать метрики в вашем проекте dbt в [dbt Cloud](/docs/cloud/about-develop-dbt) или [dbt Core](/docs/core/installation-overview). Чтобы испытать мощь универсального [семантического уровня dbt](/docs/use-dbt-semantic-layer/dbt-sl) и динамически запрашивать эти метрики в инструментах нижнего уровня, вам понадобится учетная запись dbt Cloud [Team или Enterprise](https://www.getdbt.com/pricing/).

MetricFlow совместим с версиями Python 3.8, 3.9, 3.10 и 3.11.

## MetricFlow

MetricFlow — это пакет dbt, который позволяет вам определять и запрашивать метрики в вашем проекте dbt. Вы можете использовать MetricFlow для запроса метрик в вашем проекте dbt в dbt Cloud CLI, dbt Cloud IDE или dbt Core.

Использование MetricFlow с dbt Cloud означает, что вам не нужно управлять версиями — ваша учетная запись dbt Cloud будет автоматически управлять версиями.

Задания dbt Cloud поддерживают команду `dbt sl validate` для [автоматического тестирования ваших семантических узлов](/docs/deploy/ci-jobs#semantic-validations-in-ci). Вы также можете добавить проверки MetricFlow с вашим поставщиком git (например, GitHub Actions), установив MetricFlow (`python -m pip install metricflow`). Это позволяет вам выполнять команды MetricFlow как часть ваших проверок непрерывной интеграции на PR.

<Tabs>

<TabItem value="cloud" label="MetricFlow с dbt Cloud">

В dbt Cloud выполняйте команды MetricFlow непосредственно в [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) или в [dbt Cloud CLI](/docs/cloud/cloud-cli-installation).

Для пользователей dbt Cloud CLI команды MetricFlow встроены в dbt Cloud CLI, что означает, что вы можете сразу же их выполнять после установки dbt Cloud CLI и не нужно устанавливать MetricFlow отдельно. Вам не нужно управлять версиями, потому что ваша учетная запись dbt Cloud будет автоматически управлять версиями за вас.

</TabItem>

<TabItem value="core" label="MetricFlow с dbt Core">  

Вы можете установить [MetricFlow](https://github.com/dbt-labs/metricflow#getting-started) из [PyPI](https://pypi.org/project/dbt-metricflow/). Вам нужно использовать `pip` для установки MetricFlow на операционных системах Windows или Linux:

<VersionBlock lastVersion="1.7">
 
1. Создайте или активируйте вашу виртуальную среду `python -m venv venv`
2. Выполните `pip install dbt-metricflow`
  * Вы можете установить MetricFlow, используя PyPI в качестве расширения вашего адаптера dbt в командной строке. Чтобы установить адаптер, выполните `python -m pip install "dbt-metricflow[your_adapter_name]"` и добавьте имя адаптера в конце команды. Например, для адаптера Snowflake выполните `python -m pip install "dbt-metricflow[snowflake]"`

</VersionBlock>

<VersionBlock firstVersion="1.8">
 
1. Создайте или активируйте вашу виртуальную среду `python -m venv venv`
2. Выполните `pip install dbt-metricflow`
  * Вы можете установить MetricFlow, используя PyPI в качестве расширения вашего адаптера dbt в командной строке. Чтобы установить адаптер, выполните `python -m pip install "dbt-metricflow[adapter_package_name]"` и добавьте имя адаптера в конце команды. Например, для адаптера Snowflake выполните `python -m pip install "dbt-metricflow[dbt-snowflake]"`

</VersionBlock>

**Примечание**, вам нужно будет управлять версиями между dbt Core, вашим адаптером и MetricFlow.

Обратите внимание, что команды MetricFlow `mf` возвращают ошибку, если у вас установлен пакет Metafont latex. Чтобы выполнять команды `mf`, удалите пакет.

</TabItem>
</Tabs>

## Команды MetricFlow

MetricFlow предоставляет следующие команды для получения метаданных и запроса метрик.

<Tabs>
<TabItem value="cloudcommands" label="Команды для dbt Cloud">

Вы можете использовать префикс `dbt sl` перед именем команды, чтобы выполнить их в dbt Cloud IDE или dbt Cloud CLI. Например, чтобы перечислить все метрики, выполните `dbt sl list metrics`.

Пользователи dbt Cloud CLI могут выполнить `dbt sl --help` в терминале для получения полного списка команд и флагов MetricFlow.

Следующая таблица перечисляет команды, совместимые с dbt Cloud IDE и dbt Cloud CLI:

| <div style={{width:'250px'}}>Команда</div>  | <div style={{width:'100px'}}>Описание</div> | dbt Cloud IDE | dbt Cloud CLI |
|---------|-------------|---------------|---------------|
| [`list metrics`](#list-metrics) | Перечисляет метрики с измерениями. |  ✅ | ✅ |
| [`list dimensions`](#list) | Перечисляет уникальные измерения для метрик. |  ✅  | ✅ |
| [`list dimension-values`](#list-dimension-values) | Перечисляет измерения с метриками. | ✅ | ✅ |
| [`list entities`](#list-entities) | Перечисляет все уникальные сущности.  |  ✅  | ✅ |
| [`list saved-queries`](#list-saved-queries) | Перечисляет доступные сохраненные запросы. Используйте флаг `--show-exports`, чтобы отобразить каждый экспорт, указанный под сохраненным запросом, или `--show-parameters`, чтобы показать полные параметры запроса, используемые каждым сохраненным запросом. |  ✅ | ✅ |
| [`query`](#query) | Запрашивает метрики, сохраненные запросы и измерения, которые вы хотите видеть в интерфейсе командной строки. Обратитесь к [примеру запросов](#query-examples), чтобы помочь вам начать.  |  ✅ | ✅ |
| [`validate`](#validate) | Проверяет конфигурации семантической модели. |  ✅ | ✅ |
| [`export`](#export) |  Выполняет экспорт для одного сохраненного запроса для тестирования и генерации экспортов в вашей среде разработки. Вы также можете использовать флаг `--select`, чтобы указать конкретные экспорты из сохраненного запроса. |  ❌ | ✅ |
| [`export-all`](#export-all) | Выполняет экспорт для нескольких сохраненных запросов одновременно, экономя время и усилия. |  ❌ | ✅ |


<!--ниже команды пока не поддерживаются в dbt cloud
- [`health-checks`](#health-checks) &mdash; Выполняет проверку состояния платформы данных.
- [`tutorial`](#tutorial) &mdash; Специальный учебник по MetricFlow, чтобы помочь вам начать.
-->

:::tip Выполните dbt parse, чтобы отразить изменения метрик
Когда вы вносите изменения в метрики, обязательно выполните `dbt parse` как минимум, чтобы обновить семантический уровень dbt. Это обновляет файл `semantic_manifest.json`, отражая ваши изменения при запросе метрик. Выполняя `dbt parse`, вам не нужно будет перестраивать все модели.
::: 

<Expandable alt_header="Как я могу запрашивать или предварительно просматривать метрики с помощью dbt Cloud CLI?">

Посмотрите следующее видео для короткой демонстрации того, как запрашивать или предварительно просматривать метрики с помощью dbt Cloud CLI:

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
- [`tutorial`](#tutorial) &mdash; Специальный учебник по MetricFlow, чтобы помочь вам начать.
- [`query`](#query) &mdash; Запрашивает метрики и измерения, которые вы хотите видеть в интерфейсе командной строки. Обратитесь к [примеру запросов](#query-examples), чтобы помочь вам начать.
  
</TabItem>
</Tabs>

### Перечислить метрики
Эта команда перечисляет метрики с их доступными измерениями:

```bash
dbt sl list metrics <metric_name> # В dbt Cloud

mf list metrics <metric_name> # В dbt Core

Options:
  --search TEXT          Фильтровать доступные метрики по этому поисковому термину
  --show-all-dimensions  Показать все измерения, связанные с метрикой.
  --help                 Показать это сообщение и выйти.
```

### Перечислить измерения

Эта команда перечисляет все уникальные измерения для метрики или нескольких метрик. Она отображает только общие измерения при запросе нескольких метрик:

```bash
dbt sl list dimensions --metrics <metric_name> # В dbt Cloud

mf list dimensions --metrics <metric_name> # В dbt Core

Options:
  --metrics SEQUENCE  Перечислить измерения по заданным метрикам (пересечение). Пример: --metrics bookings,messages
  --help              Показать это сообщение и выйти.
```

### Перечислить значения измерений

Эта команда перечисляет все значения измерений с соответствующей метрикой:

```bash
dbt sl list dimension-values --metrics <metric_name> --dimension <dimension_name> # В dbt Cloud

mf list dimension-values --metrics <metric_name> --dimension <dimension_name> # В dbt Core

Options:
  --dimension TEXT    Измерение, из которого запрашиваются значения  [обязательно]
  --metrics SEQUENCE  Метрики, связанные с измерением
                      [обязательно]
  --end-time TEXT     Необязательная метка времени iso8601, чтобы ограничить конечное время
                      данных (включительно)
                      *Пока не доступно в dbt Cloud
  --start-time TEXT   Необязательная метка времени iso8601, чтобы ограничить начальное время
                      данных (включительно)
                      *Пока не доступно в dbt Cloud
  --help              Показать это сообщение и выйти.
```

### Перечислить сущности

Эта команда перечисляет все уникальные сущности:

```bash
dbt sl list entities --metrics <metric_name> # В dbt Cloud 

mf list entities --metrics <metric_name> # В dbt Core

Options:
  --metrics SEQUENCE  Перечислить сущности по заданным метрикам (пересечение). Пример: --metrics bookings,messages
  --help              Показать это сообщение и выйти.
```

### Перечислить сохраненные запросы

Эта команда перечисляет все доступные сохраненные запросы:

```bash
dbt sl list saved-queries
```

Вы также можете добавить флаг (или опцию) `--show-exports`, чтобы показать каждый экспорт, указанный под сохраненным запросом:

```bash
dbt sl list saved-queries --show-exports
```

**Вывод**

```bash
dbt sl list saved-queries --show-exports

Список доступных сохраненных запросов:
- new_customer_orders
  exports:
       - Export(new_customer_orders_table, exportAs=TABLE)
       - Export(new_customer_orders_view, exportAs=VIEW)
       - Export(new_customer_orders, alias=orders, schemas=customer_schema, exportAs=TABLE)
```

### Проверка

Следующая команда выполняет проверки по определенным конфигурациям семантической модели.

```bash
dbt sl validate # Для пользователей dbt Cloud
mf validate-configs # Для пользователей dbt Core

Options:
  --timeout                       # только dbt Cloud
                                  Необязательный тайм-аут для проверки данных в облаке dbt.
  --dw-timeout INTEGER            # только dbt Core
                                  Необязательный тайм-аут для шагов проверки данных. По умолчанию None.
  --skip-dw                       # только dbt Core
                                  Пропускает проверки данных.
  --show-all                      # только dbt Core
                                  Печатает предупреждения и будущие ошибки.
  --verbose-issues                # только dbt Core
                                  Печатает дополнительные детали о проблемах.
  --semantic-validation-workers INTEGER  # только dbt Core
                                  Использует указанное количество рабочих процессов для больших конфигураций.
  --help                          Показать это сообщение и выйти.
```

### Проверка состояния

Следующая команда выполняет проверку состояния платформы данных, которую вы указали в конфигурациях.

Обратите внимание, что в dbt Cloud команда `health-checks` не требуется, так как она использует учетные данные dbt Cloud для выполнения проверки состояния.

```bash
mf health-checks # В dbt Core
```

### Учебник

Следуйте специальному учебнику по MetricFlow, чтобы помочь вам начать:
<!--dbt sl tutorial # В dbt Cloud-->

```bash
mf tutorial # В dbt Core
```

### Запрос

Создайте новый запрос с помощью MetricFlow и выполните его против вашей платформы данных. Запрос возвращает следующий результат:

```bash
dbt sl query --metrics <metric_name> --group-by <dimension_name> # В dbt Cloud 
dbt sl query --saved-query <name> # В dbt Cloud

mf query --metrics <metric_name> --group-by <dimension_name> # В dbt Core

Options:

  --metrics SEQUENCE       Синтаксис для запроса одной метрики: --metrics metric_name
                           Например, --metrics bookings
                           Чтобы запросить несколько метрик, используйте --metrics, за которым следуют имена метрик, разделенные запятыми без пробелов.
                           Например,  --metrics bookings,messages

  --group-by SEQUENCE      Синтаксис для группировки по одному измерению/сущности: --group-by dimension_name
                           Например, --group-by ds
                           Для нескольких измерений/сущностей используйте --group-by, за которым следуют имена измерений/сущностей, разделенные запятыми без пробелов.
                           Например, --group-by ds,org
                           

  --end-time TEXT          Необязательная метка времени iso8601, чтобы ограничить конечное
                           время данных (включительно).
                           *Пока не доступно в dbt Cloud 

  --start-time TEXT        Необязательная метка времени iso8601, чтобы ограничить начальное
                           время данных (включительно)
                           *Пока не доступно в dbt Cloud

  --where TEXT             SQL-подобное условие where, предоставленное в виде строки и заключенное в кавычки: --where "condition_statement"
                           Например, чтобы запросить одно условие: --where "revenue > 100"
                           Чтобы запросить несколько условий: --where "revenue > 100 and user_count < 1000"
                           Чтобы добавить фильтр измерения к условию where, убедитесь, что элемент фильтра является частью вашей модели. 
                           Обратитесь к [Часто задаваемым вопросам](#faqs) для получения дополнительной информации о том, как это сделать с помощью обертки шаблона.

  --limit TEXT             Ограничьте количество строк, выводимых с помощью целого числа, или оставьте пустым для отсутствия ограничения. Например: --limit 100

  --order-by SEQUENCE     Укажите метрики, измерения или группировки для сортировки.
                          Добавьте префикс `-`, чтобы отсортировать запрос в порядке убывания (DESC). 
                          Оставьте пустым для сортировки по возрастанию (ASC).
                          Например, чтобы отсортировать metric_time в порядке убывания: --order-by -metric_time 
                          Чтобы отсортировать metric_time в порядке возрастания и revenue в порядке убывания:  --order-by metric_time,-revenue

  --csv FILENAME           Укажите путь к файлу для вывода данных в csv

 --compile (dbt Cloud)    В выводе запроса покажите запрос, который был
 --explain (dbt Core)     выполнен против платформы данных         

  --show-dataflow-plan     Отобразить план потока данных в выводе explain

  --display-plans          Отобразить планы (такие как поток данных метрик) в браузере

  --decimals INTEGER       Выберите количество десятичных знаков для округления числовых значений

  --show-sql-descriptions  Показывает встроенные описания узлов в отображаемом SQL

  --help                   Показать это сообщение и выйти.
  ```


### Примеры запросов

Следующие вкладки представляют различные типы примеров запросов, которые вы можете использовать для запроса метрик и измерений. Выберите вкладку, которая лучше всего соответствует вашим потребностям:

<Tabs>

<TabItem value="eg1" label="Метрики">

Используйте пример, чтобы запросить несколько метрик по измерению и вернуть метрики `order_total` и `users_active` по `metric_time.` 

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

<TabItem value="eg3" label="Порядок/лимит">

Вы можете добавить функции порядка и лимита, чтобы отфильтровать и представить данные в удобочитаемом формате. Следующий запрос ограничивает набор данных до 10 записей и сортирует их по `metric_time`, в порядке убывания. Обратите внимание, что использование префикса `-` отсортирует запрос в порядке убывания. Без префикса `-` сортирует запрос в порядке возрастания.

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

Вы можете дополнительно отфильтровать набор данных, добавив условие `where` к вашему запросу. Следующий пример показывает, как запросить метрику `order_total`, сгруппированную по `is_food_order` с несколькими условиями where (заказы, которые являются заказами еды и заказы с начала недели, начиная с 1 февраля 2024 года). Обратите внимание, что при запросе измерения вам нужно указать основную сущность для этого измерения. В следующем примере основной сущностью является `order_id`.

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

Чтобы отфильтровать по времени, существуют специальные параметры начального и конечного времени. Использование этих параметров для фильтрации по времени позволяет MetricFlow дополнительно оптимизировать производительность запроса, когда это возможно, путем снижения фильтра where.

Обратите внимание, что при запросе измерения вам нужно указать основную сущность для этого измерения. В следующем примере основной сущностью является `order_id`.
<!--
bash не поддерживается в облаке пока
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

:::info Примечание о запросах сохраненных запросов
При запросе [сохраненных запросов](/docs/build/saved-queries) вы можете использовать параметры, такие как `where`, `limit`, `order`, `compile` и т. д. Однако имейте в виду, что вы не можете получить доступ к параметрам `metric` или `group_by` в этом контексте. Это связано с тем, что они являются предопределенными и фиксированными параметрами для сохраненных запросов, и вы не можете изменять их во время запроса. Если вы хотите запросить больше метрик или измерений, вы можете построить запрос, используя стандартный формат.
:::

</TabItem>
</Tabs>

### Дополнительные примеры запросов

Следующие вкладки представляют дополнительные примеры запросов, такие как экспорт в CSV. Выберите вкладку, которая лучше всего соответствует вашим потребностям:

<Tabs>

<TabItem value="eg6" label="--compile/--explain флаг">

Добавьте `--compile` (или `--explain` для пользователей dbt Core) к вашему запросу, чтобы увидеть SQL, сгенерированный MetricFlow. 

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

### Временная гранулярность

При желании вы можете указать временную гранулярность, на которой вы хотите агрегировать ваши данные, добавив два подчеркивания и единицу гранулярности к `metric_time`, глобальному временно́му измерению. Вы можете группировать гранулярность по: `day`, `week`, `month`, `quarter` и `year`. 

Ниже приведен пример запроса данных метрик с месячной гранулярностью:

```bash
dbt sl query --metrics revenue --group-by metric_time__month # В dbt Cloud

mf query --metrics revenue --group-by metric_time__month # В dbt Core
```

### Экспорт

Выполните [экспорт для конкретного сохраненного запроса](/docs/use-dbt-semantic-layer/exports#exports-for-single-saved-query). Используйте эту команду для тестирования и генерации экспортов в вашей среде разработки. Вы также можете использовать флаг `--select`, чтобы указать конкретные экспорты из сохраненного запроса. Обратитесь к [экспортам в разработке](/docs/use-dbt-semantic-layer/exports#exports-in-development) для получения дополнительной информации. 

Экспорт доступен в dbt Cloud.

```bash
dbt sl export 
```

### Экспорт-все

Выполните [экспорт для нескольких сохраненных запросов](/docs/use-dbt-semantic-layer/exports#exports-for-multiple-saved-queries) одновременно. Эта команда предоставляет удобный способ управления и выполнения экспортов для нескольких запросов одновременно, экономя время и усилия. Обратитесь к [экспортам в разработке](/docs/use-dbt-semantic-layer/exports#exports-in-development) для получения дополнительной информации. 

Экспорт доступен в dbt Cloud.

```bash
dbt sl export-all 
```


## Часто задаваемые вопросы

<DetailsToggle alt_header="Как я могу добавить фильтр измерения к фильтру where?">

Чтобы добавить фильтр измерения к фильтру where, вам нужно указать, что элемент фильтра является частью вашей модели, и использовать обертку шаблона: `{{Dimension('primary_entity__dimension_name')}}`.

Вот пример запроса: `dbt sl query --metrics order_total --group-by metric_time --where "{{Dimension('order_id__is_food_order')}} = True"`.

Перед использованием обертки шаблона, однако, настройте ваш терминал для экранирования фигурных скобок, чтобы фильтр шаблона работал. 

<details> 
<summary>Как настроить ваш терминал для экранирования фигурных скобок? </summary>
 Чтобы настроить ваш <code>.zshrc</code> профиль для экранирования фигурных скобок, вы можете использовать команду <code>setopt</code>, чтобы включить опцию <code>BRACECCL</code>. Эта опция заставит оболочку рассматривать фигурные скобки как литералы и предотвратит расширение фигурных скобок. Следуйте следующим шагам, чтобы настроить это: <br />

1. Откройте ваш терминал.
2. Откройте ваш <code>.zshrc</code> файл с помощью текстового редактора, такого как <code>nano</code>, <code>vim</code> или любого другого текстового редактора, который вы предпочитаете. Вы можете использовать следующую команду, чтобы открыть его с <code>nano</code>:

```bash
nano ~/.zshrc
```
3. Добавьте следующую строку в файл:

```bash
setopt BRACECCL
```
4. Сохраните и выйдите из текстового редактора (в `nano`, нажмите Ctrl + O, чтобы сохранить, и Ctrl + X, чтобы выйти).

5. Примените изменения, выполнив ваш <code>.zshrc</code> файл:

```bash
source ~/.zshrc
```

6. После внесения этих изменений ваша оболочка Zsh будет рассматривать фигурные скобки как литеральные символы и не будет выполнять расширение фигурных скобок. Это означает, что вы можете использовать фигурные скобки, не беспокоясь о непреднамеренных расширениях.

Имейте в виду, что изменение ваших файлов конфигурации оболочки может повлиять на то, как ведет себя ваша оболочка. Если вы не знакомы с конфигурацией оболочки, разумно сделать резервную копию вашего <code>.zshrc</code> файла перед внесением каких-либо изменений. Если вы столкнетесь с какими-либо проблемами или неожиданным поведением, вы можете вернуться к резервной копии.

</details>

</DetailsToggle>

<DetailsToggle alt_header="Почему мой запрос ограничен 100 строками в dbt Cloud CLI?">

По умолчанию `limit` для запросов из dbt Cloud CLI составляет 100 строк. Мы установили этот предел, чтобы предотвратить возврат ненужных больших наборов данных, так как dbt Cloud CLI обычно используется для запроса семантического уровня dbt в процессе разработки, а не для отчетности в производстве или доступа к большим наборам данных. Для большинства рабочих процессов вам нужно вернуть только подмножество данных.

Тем не менее, вы можете изменить этот предел, если это необходимо, установив параметр `--limit` в вашем запросе. Например, чтобы вернуть 1000 строк, вы можете выполнить `dbt sl list metrics --limit 1000`.

</DetailsToggle>

<DetailsToggle alt_header="Как я могу запрашивать несколько метрик, группировок или условий where?">

Чтобы запросить несколько метрик, группировок или условий where в вашей команде, следуйте этим рекомендациям:

- Чтобы запросить несколько метрик и группировок, используйте синтаксис `--metrics` или `--group-by`, за которым следуют имена метрик или измерений/сущностей, разделенные запятыми без пробелов:
  - Пример нескольких метрик: `dbt sl query --metrics accounts_active,users_active`
  - Пример нескольких измерений/сущностей: `dbt sl query --metrics accounts_active,users_active --group-by metric_time__week,accounts__plan_tier`
 
- Чтобы запросить несколько условий where, используйте синтаксис `--where` и заключите условие в кавычки:
  - Пример нескольких условий where: `dbt sl query --metrics accounts_active,users_active --group-by metric_time__week,accounts__plan_tier --where "metric_time__week >= '2024-02-01' and accounts__plan_tier = 'coco'"`

</DetailsToggle>

<DetailsToggle alt_header="Как я могу отсортировать свой запрос в порядке возрастания или убывания?">

При запросе метрик используйте `--order-by`, чтобы указать метрики или группировки для сортировки. Опция `order_by` применяется к метрикам, измерениям и группировкам. 

Добавьте префикс `-`, чтобы отсортировать ваш запрос в порядке убывания (DESC). Оставьте пустым для сортировки по возрастанию (ASC):

- Например, чтобы запросить метрику и отсортировать `metric_time` в порядке убывания, выполните `dbt sl query --metrics order_total --group-by metric_time --order-by -metric_time`. Обратите внимание, что префикс `-` в `-metric_time` сортирует запрос в порядке убывания.
- Чтобы запросить метрику и отсортировать `metric_time` в порядке возрастания и `revenue` в порядке убывания, выполните `dbt sl query --metrics order_total --order-by metric_time,-revenue`. Обратите внимание, что `metric_time` без префикса сортируется в порядке возрастания, а `-revenue` с префиксом `-` сортирует запрос в порядке убывания.

</DetailsToggle>