---
title: "Оплата"
id: billing 
description: "Информация о выставлении счетов в dbt Cloud." 
sidebar_label: Оплата
pagination_next: null
pagination_prev: null
---

dbt Cloud предлагает различные [планы и цены](https://www.getdbt.com/pricing/), которые соответствуют потребностям вашей организации. С гибкими вариантами оплаты, которые подходят как для крупных предприятий, так и для малого бизнеса, и [доступностью серверов](/docs/cloud/about-cloud/access-regions-ip-addresses) по всему миру, dbt Cloud является самым быстрым и простым способом начать преобразование ваших данных.

## Как работает ценообразование в dbt Cloud?

Как клиент, вы платите за количество мест и объем использования, потребленный каждый месяц. Места оплачиваются в основном на основе количества приобретенных лицензий Developer и Read.

Использование основано на количестве [успешно построенных моделей](#what-counts-as-a-successful-model-built) и, если приобретено и используется, метрик Semantic Layer [запрошенных метрик](#what-counts-as-a-queried-metric) в пределах разумного использования. Все расчеты по выставлению счетов проводятся по всемирному координированному времени (UTC).

### Что считается лицензией на место?

Существует три типа возможных лицензий на место:

* **Developer** &mdash; для ролей и разрешений, требующих ежедневного взаимодействия с окружением dbt Cloud.
* **Read-Only** &mdash; для доступа к просмотру определенных документов и отчетов.
* **IT** &mdash; для доступа к определенным функциям, связанным с управлением учетной записью (например, настройка интеграции с git).

### Что считается успешно построенной моделью?

dbt Cloud считает успешно построенной моделью любую <Term id="model">модель</Term>, которая успешно построена через запуск с использованием функциональности оркестрации dbt Cloud в окружении развертывания dbt Cloud. Модели учитываются при их построении и запуске. Это включает любые задания, запущенные через планировщик dbt Cloud, CI-сборки (задания, запускаемые через pull-запросы), запуски, инициированные через API dbt Cloud, и любые последующие инструменты dbt Cloud с аналогичной функциональностью. Это также включает модели, которые успешно построены, даже если запуск может завершиться неудачей. Например, у вас может быть задание, содержащее 100 моделей, и в одном из его запусков 51 модель успешно построена, а затем задание завершается с ошибкой. В этой ситуации будет учтено только 51 модель.

Любые модели, построенные в среде разработки dbt Cloud (например, через IDE), не учитываются в вашем использовании. Тесты, семена, эфемерные модели и снимки также не учитываются.

| Что учитывается в успешно построенных моделях |                     |
|---------------------------------------------|---------------------|
| View                                        | ✅                  |
| Table                                       | ✅                  |
| Incremental                                 | ✅                  |
| Ephemeral Models                            | ❌                  |
| Tests                                       | ❌                  |
| Seeds                                       | ❌                  |
| Snapshots                                   | ❌                  |

### Что считается запрошенной метрикой?

Семантический слой dbt, работающий на базе MetricFlow, измеряет использование в уникальных запрошенных метриках.

- Каждый успешный запрос на рендеринг или выполнение SQL в API семантического слоя считается как минимум одной запрошенной метрикой, даже если данные не возвращаются.
- Если запрос вычисляет или рендерит SQL для нескольких метрик, каждая вычисленная метрика будет считаться запрошенной метрикой.
- Если запрос на выполнение не выполнен успешно в платформе данных или если запрос приводит к ошибке без завершения, он не учитывается как запрошенная метрика.
- Запросы метаданных из семантического слоя также не учитываются как запрошенные метрики.

Примеры запрошенных метрик включают:

- Запрос одной метрики с группировкой по одному измерению → 1 запрошенная метрика 

  ```shell
  dbt sl query --metrics revenue --group-by metric_time
  ```

- Запрос одной метрики с группировкой по двум измерениям → 1 запрошенная метрика 

  ```shell
  dbt sl query --metrics revenue --group-by metric_time,user__country
  ```

- Запрос двух метрик с группировкой по двум измерениям → 2 запрошенные метрики 

  ```shell
  dbt sl query --metrics revenue,gross_sales --group-by metric_time,user__country
  ```

- Выполнение объяснения для одной метрики → 1 запрошенная метрика

  ```shell
  dbt sl query --metrics revenue --group-by metric_time --explain
  ```

- Выполнение объяснения для двух метрик → 2 запрошенные метрики

  ```shell
  dbt sl query --metrics revenue,gross_sales --group-by metric_time --explain
  ```

### Просмотр использования в продукте

Просмотр использования в продукте ограничен определенными ролями:

* План Team &mdash; группа владельцев
* План Enterprise &mdash; роли администратора учетной записи и выставления счетов

Для просмотра использования на уровне учетной записи, если у вас есть доступ к страницам **Billing** и **Usage**, вы можете увидеть оценку использования за месяц. На странице Billing в **Account Settings** вы можете увидеть, как ваша учетная запись отслеживает свое использование. Вы также можете увидеть, какие проекты строят больше всего моделей.

<Lightbox src="/img/docs/building-a-dbt-project/billing-usage-page.jpg" width="80%" title="Чтобы просмотреть оценочное использование на уровне учетной записи, перейдите в 'Account settings', а затем выберите 'Billing'."/>

Как пользователь планов Team и Developer, вы можете увидеть, как учетная запись отслеживает включенные построенные модели. Как пользователь плана Enterprise, вы можете увидеть, сколько вы использовали из вашего годового обязательства и сколько осталось.

На каждой странице **Project Home** любой пользователь с доступом к этому проекту может увидеть, сколько моделей строится каждый месяц. Оттуда дополнительные детали о лучших заданиях по построенным моделям можно найти на каждой странице **Environment**.

<Lightbox src="/img/docs/building-a-dbt-project/billing-project-page.jpg" width="80%" title="На вашей домашней странице проекта отображается, сколько моделей строится каждый месяц."/>

Кроме того, вы можете посмотреть вкладку **Insights** на странице **Job Details**, чтобы увидеть, сколько моделей строится в месяц для конкретного задания и какие модели занимают больше всего времени на построение.

<Lightbox src="/img/docs/building-a-dbt-project/billing-job-page.jpg" width="80%" title="Просмотрите, сколько моделей строится в месяц для конкретного задания, перейдя на вкладку 'Insights' на странице 'Job details'."/>

Информация об использовании доступна клиентам на планах, основанных на потреблении, и некоторые визуализации использования могут быть недоступны клиентам на устаревших планах. Любые данные об использовании, показанные в dbt Cloud, являются только оценкой вашего использования, и может быть задержка в отображении данных об использовании в продукте. Ваше окончательное использование за месяц будет видно в ваших ежемесячных отчетах (отчеты применимы к планам Team и Enterprise).

## Планы и выставление счетов

dbt Cloud предлагает несколько [планов](https://www.getdbt.com/pricing) с различными функциями, которые соответствуют вашим потребностям. Мы можем вносить изменения в детали наших планов время от времени. Мы всегда сообщим вам об этом заранее, чтобы вы могли подготовиться. Следующий раздел объясняет, как работает выставление счетов в каждом плане.

### Выставление счетов по плану Developer

Планы Developer бесплатны и включают одну лицензию Developer и 3000 моделей каждый месяц. Модели обновляются в начале каждого календарного месяца. Если вы превысите 3000 моделей, любые последующие запуски будут отменены до обновления моделей или до обновления на платный план. Остальная часть платформы dbt Cloud остается доступной, и никакая работа не будет потеряна.

Все включенные успешные построенные модели, указанные выше, отражают наше самое актуальное ценообразование и упаковку. В зависимости от условий использования, когда вы подписались на план Developer, включенные права на модели могут отличаться от указанных выше.

### Выставление счетов по плану Team

Клиенты плана Team платят ежемесячно с помощью кредитной карты за места и использование, и учетные записи включают 15 000 моделей ежемесячно. Места оплачиваются заранее в начале месяца. Если вы добавите места в течение месяца, они будут пропорционально рассчитаны и оплачены в тот же день. Места, удаленные в течение месяца, будут отражены в следующем счете и не подлежат возврату. Вы можете изменить информацию о кредитной карте и количество мест в разделе выставления счетов в любое время. Учетные записи будут получать один ежемесячный счет, который включает авансовый платеж за места и использование, начисленное за предыдущий месяц.

Использование рассчитывается и оплачивается за предыдущий месяц. Если вы превысите 15 000 моделей в любом месяце, вам будет выставлен счет за дополнительное использование в следующем счете. Дополнительное использование оплачивается по ставкам, указанным на нашей [странице ценообразования](https://www.getdbt.com/pricing).

Неиспользованные включенные модели не переносятся на будущие месяцы. Вы можете оценить свой счет с помощью простой формулы:

`($100 x количество мест для разработчиков) + ((построенные модели - 15,000) x $0.01)`

Все включенные успешные построенные модели, указанные выше, отражают наше самое актуальное ценообразование и упаковку. В зависимости от условий использования, когда вы подписались на план Team, включенные права на модели могут отличаться от указанных выше.

### Выставление счетов по плану Enterprise

Как клиент Enterprise, вы платите ежегодно по счету, ежемесячно за дополнительное использование (если применимо) и можете воспользоваться согласованными ставками использования. Пожалуйста, обратитесь к вашему заказу или контракту для получения конкретных деталей ценообразования или [свяжитесь с командой аккаунта](https://www.getdbt.com/contact-demo) с любыми вопросами.

Информация о выставлении счетов по плану Enterprise недоступна в интерфейсе dbt Cloud. Изменения обрабатываются через вашего архитектора решений dbt Labs или менеджера команды аккаунта.

### Устаревшие планы

Клиенты, которые приобрели план dbt Cloud Team до 11 августа 2023 года, остаются на устаревшем плане ценообразования, пока ваша учетная запись находится в хорошем состоянии. Устаревший план ценообразования основан на местах и включает неограниченные модели, при условии разумного использования.

:::note Устаревший семантический слой

Для клиентов, использующих устаревший семантический слой с пакетом dbt_metrics, этот продукт будет снят с производства в декабре 2023 года. Устаревшие пользователи могут в любое время перейти на обновленную версию, семантический слой на базе MetricFlow. Обновленная версия доступна большинству клиентов (см. [предварительные условия](/guides/sl-snowflake-qs#prerequisites)) на ограниченное время на бесплатной пробной основе, при условии разумного использования.

:::

dbt Labs может установить ограничения на использование, если разумное использование превышено. Дополнительные функции, обновления или обновления могут быть предметом отдельных сборов. Любые изменения в текущем ценообразовании вашего плана будут сообщены заранее в соответствии с нашими Условиями использования.

## Управление использованием

В dbt Cloud нажмите на имя вашей учетной записи в левом меню и выберите **Account settings**. Опция **Billing** будет в левом меню под заголовком **Settings**. Здесь вы можете просмотреть доступные индивидуальные планы и предоставляемые для каждого из них функции.

### Уведомления об использовании

Каждый план автоматически отправляет уведомления по электронной почте, когда достигнуто 75%, 90% и 100% оценок использования. В плане Team все пользователи в группе владельцев будут получать уведомления. В планах Enterprise все пользователи с разрешениями администратора учетной записи и администратора выставления счетов будут получать уведомления. Пользователи не могут отказаться от этих писем. Если вы хотите, чтобы дополнительные пользователи получали эти уведомления по электронной почте, предоставьте им соответствующие разрешения, упомянутые выше. Обратите внимание, что ваше использование может уже быть выше, чем процент, указанный в уведомлении, из-за вашего шаблона использования и незначительных задержек.

### Как остановить накопление использования?

Есть 2 варианта отключения построения и начисления моделей:

1. Откройте **Job Settings** каждого задания и перейдите в раздел **Triggers**. Отключите **Run on Schedule** и установите функцию **Continuous Integration** **Run on Pull Requests?** в **No**. Проверьте свои рабочие процессы, чтобы убедиться, что вы не запускаете никакие запуски через API dbt Cloud. Этот вариант позволит вам сохранить ваши задания dbt Cloud без построения дополнительных моделей.
2. В качестве альтернативы, вы можете удалить некоторые или все ваши задания dbt Cloud. Это гарантирует, что никакие запуски не будут инициированы, но вы навсегда потеряете свои задания.

## Оптимизация затрат в dbt Cloud

dbt Cloud предлагает способы оптимизации использования построенных моделей и затрат на хранилище.

### Лучшие практики для оптимизации успешно построенных моделей

При обдумывании способов оптимизации ваших затрат на успешно построенные модели существуют методы, которые позволяют снизить эти затраты, при этом соблюдая лучшие практики. Чтобы гарантировать, что вы все еще используете тесты и перестраиваете представления при изменении логики, рекомендуется реализовать комбинацию лучших практик, которые соответствуют вашим потребностям. Более конкретно, если вы решите исключить представления из ваших регулярно запланированных запусков заданий dbt Cloud, важно настроить задание слияния (с ссылкой на раздел), чтобы развернуть обновленную логику представлений при обнаружении изменений.

#### Исключение представлений в задании dbt Cloud

Многие пользователи dbt Cloud используют представления, которые не всегда нужно перестраивать каждый раз при запуске задания. Для любых заданий, содержащих представления, которые _не_ включают макросы, динамически генерирующие код (например, операторы case) на основе вышестоящих таблиц, и также _не_ имеют тестов, вы можете выполнить следующие шаги:

1. Перейдите к вашему текущему заданию развертывания в dbt Cloud.
2. Измените вашу команду, добавив: `--exclude config.materialized:view`.
3. Сохраните изменения задания.

Если у вас есть представления, содержащие макросы с операторами case на основе вышестоящих таблиц, их нужно будет запускать каждый раз, чтобы учитывать новые значения. Если вам все еще нужно тестировать ваши представления при каждом запуске, следуйте лучшей практике [Исключение представлений при запуске тестов](#exclude-views-while-running-tests), чтобы создать пользовательский селектор.

#### Исключение представлений при запуске тестов

Запуск тестов для представлений в каждом запуске задания может помочь поддерживать качество данных и избавить вас от необходимости повторного запуска неудачных заданий. Чтобы исключить представления из вашего запуска задания при запуске тестов, вы можете выполнить следующие шаги, чтобы создать пользовательский [селектор](https://docs.getdbt.com/reference/node-selection/yaml-selectors) для вашей команды задания.

1. Откройте ваш проект dbt в IDE dbt Cloud.
2. Добавьте файл с именем `selectors.yml` в вашу папку верхнего уровня проекта.
3. В файле добавьте следующий код:

   ```yaml 
    selectors:
      - name: skip_views_but_test_views
        description: >
          A default selector that will exclude materializing views
          without skipping tests on views.
        default: true
        definition:
          union:
            - union: 
              - method: path
                value: "*"
              - exclude: 
                - method: config.materialized
                  value: view
            - method: resource_type
              value: test

    ```
    
4. Сохраните файл и зафиксируйте его в вашем проекте.
5. Измените ваши задания dbt Cloud, чтобы включить `--selector skip_views_but_test_views`.

#### Построение только измененных представлений

Если вы хотите убедиться, что вы строите представления всякий раз, когда логика изменяется, создайте задание слияния, которое запускается при слиянии кода в основную ветку:

1. Убедитесь, что у вас настроено [CI-задание](/docs/deploy/ci-jobs) в вашем окружении.
2. Создайте новое [задание развертывания](/docs/deploy/deploy-jobs#create-and-schedule-jobs) и назовите его "Merge Job".
3. Установите **Environment** в ваше CI-окружение. Обратитесь к [Типы окружений](/docs/deploy/deploy-environments#types-of-environments) для получения более подробной информации.
4. Установите **Commands** на: `dbt run -s state:modified+`.
    Выполнение `dbt build` в этом контексте не требуется, так как CI-задание использовалось для запуска и тестирования кода, который только что был объединен в основную ветку.
5. В разделе **Execution Settings** выберите задание по умолчанию для сравнения изменений:
    - **Defer to a previous run state** &mdash; Выберите "Merge Job", который вы создали, чтобы задание сравнивало и определяло, что изменилось с момента последнего слияния.
6. В вашем проекте dbt следуйте шагам в разделе Запуск задания dbt Cloud при слиянии в руководстве [Настройка CI/CD с помощью пользовательских конвейеров](/guides/custom-cicd-pipelines), чтобы создать скрипт для запуска API dbt Cloud для выполнения вашего задания после слияния в вашем репозитории git или посмотрите это [видео](https://www.loom.com/share/e7035c61dbed47d2b9b36b5effd5ee78?sid=bcf4dd2e-b249-4e5d-b173-8ca204d9becb).

Цель задания слияния:

- Немедленно развернуть любые изменения из PR в производство.
- Обеспечить, чтобы ваши производственные представления оставались актуальными в соответствии с тем, как они определены в вашем коде, при этом оставаясь экономически эффективными при запуске заданий в производстве.

Действие слияния оптимизирует ваши расходы на облачную платформу данных и сокращает время выполнения заданий, но вам нужно будет решить, подходит ли это изменение для вашего проекта dbt.

### Переработка неэффективных моделей

#### Вкладка Job Insights

Чтобы сократить ваши расходы на хранилище, вы можете определить, какие модели в среднем занимают больше всего времени на построение на странице **Job** во вкладке **Insights**. Этот график рассматривает среднее время выполнения для каждой модели на основе последних 20 запусков. Любые модели, которые занимают больше времени, чем ожидалось, на построение, могут быть основными кандидатами на оптимизацию, что в конечном итоге сократит расходы на облачное хранилище.

#### Вкладка Model Timing

Чтобы лучше понять, сколько времени занимает выполнение каждой модели в контексте конкретного запуска, вы можете посмотреть вкладку **Model Timing**. Выберите интересующий вас запуск на странице **Run History**, чтобы найти вкладку. На этой странице **Run** нажмите **Model Timing**.

После того как вы определили, какие модели можно оптимизировать, ознакомьтесь с этими другими ресурсами, которые объясняют, как оптимизировать вашу работу:
* [Создание масштабируемых и надежных конвейеров данных с dbt и BigQuery](https://services.google.com/fh/files/misc/dbt_bigquery_whitepaper.pdf)
* [Лучшие практики для оптимизации вашего развертывания dbt и Snowflake](https://www.snowflake.com/wp-content/uploads/2021/10/Best-Practices-for-Optimizing-Your-dbt-and-Snowflake-Deployment.pdf)
* [Как оптимизировать и устранять неполадки моделей dbt на Databricks](/guides/optimize-dbt-models-on-databricks)

## Часто задаваемые вопросы

* Что произойдет, если мне нужно больше 8 мест в плане Team?
_Если вам нужно больше 8 мест для разработчиков, выберите опцию "Связаться с отделом продаж" в настройках выставления счетов, чтобы поговорить с нашей командой продаж о плане Enterprise._

* Что если я значительно превышу включенные бесплатные модели в плане Team или Developer?
_Рассмотрите возможность обновления до плана Team или Enterprise. Планы Team включают больше моделей и позволяют превышать месячный лимит использования. Учетные записи Enterprise поддерживаются выделенной командой управления учетными записями и предлагают годовые планы, индивидуальные конфигурации и согласованные ставки использования._

* Я хочу обновить свой план. Перенесется ли вся моя работа?
_Да. Ваша учетная запись dbt Cloud будет обновлена без влияния на ваши существующие проекты и настройки учетной записи._

* Как мне определить, какой план подходит для меня?
_Лучший вариант - проконсультироваться с нашей командой продаж. Они помогут вам определить, что подходит для ваших нужд. Мы также предлагаем бесплатную двухнедельную пробную версию плана Team._

* Каковы условия пробной версии семантического слоя?
_Клиенты планов Team и Enterprise могут подписаться на бесплатную пробную версию семантического слоя dbt, работающего на базе MetricFlow, для использования до 1000 запрошенных метрик в месяц. Пробная версия будет доступна как минимум до января 2024 года. dbt Labs может продлить пробный период по своему усмотрению. В течение пробного периода мы можем связаться с вами, чтобы обсудить варианты ценообразования или попросить отзыв. В конце пробного периода бесплатный доступ может быть удален, и для продолжения использования может потребоваться покупка. dbt Labs оставляет за собой право изменять лимиты в бесплатной пробной версии или вводить ценообразование, когда это требуется или в любое время по своему усмотрению._

* Каково ограничение на разумное использование семантического слоя dbt, работающего на базе MetricFlow, в течение пробного периода?
_Каждая учетная запись будет ограничена 1000 запрошенных метрик в месяц в течение пробного периода, и это может быть изменено по усмотрению dbt Labs._