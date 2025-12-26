---
title: Настройка вашего dbt проекта с Databricks
id: set-up-your-databricks-dbt-project
description: "Узнайте больше о настройке вашего dbt проекта с Databricks."
displayText: Настройка вашего dbt проекта с Databricks
hoverSnippet: Узнайте, как настроить ваш dbt проект с Databricks.
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt Core', 'dbt platform']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Введение

Databricks и dbt Labs сотрудничают, чтобы помочь командам по работе с данными мыслить как команды разработчиков программного обеспечения и быстрее предоставлять надежные данные. Адаптер dbt-databricks позволяет пользователям dbt использовать последние функции Databricks в своем dbt проекте. Сотни клиентов уже используют dbt и Databricks для создания выразительных и надежных конвейеров данных на Lakehouse, создавая активы данных, которые позволяют использовать аналитику, ML и AI в бизнесе.

В этом руководстве мы обсудим, как настроить ваш dbt проект на платформе Databricks Lakehouse, чтобы он масштабировался от небольшой команды до крупной организации.

## Настройка окружений Databricks

Для начала мы будем использовать **Unity Catalog** в Databricks. Без него мы не смогли бы спроектировать отдельные [окружения](/docs/environments-in-dbt) для разработки и продакшена в соответствии с нашими [лучшими практиками](/best-practices/how-we-structure/1-guide-overview). Кроме того, он позволяет нам с помощью SQL убедиться, что применены корректные настройки контроля доступа. Для работы с ним вам потребуется использовать адаптер **dbt-databricks** (а не **dbt-spark**).

Мы создадим два разных *каталога* в Unity Catalog: **dev** и **prod**. Каталог — это контейнер верхнего уровня для *схем* (ранее известных как базы данных в Databricks), которые, в свою очередь, содержат таблицы и представления.

Наш dev catalog будет средой разработки, с которой аналитические инженеры взаимодействуют через свой <Constant name="cloud_ide" />. У разработчиков должна быть собственная песочница для создания и тестирования объектов без риска перезаписать или удалить работу коллег; для этого мы рекомендуем создавать персональные схемы. С точки зрения прав доступа, у них должен быть доступ только к каталогу **dev**.

Только производственные запуски будут иметь доступ к данным в каталоге **prod**. В будущем руководстве мы обсудим каталог **test**, где наша система непрерывной интеграции/непрерывного развертывания (CI/CD) сможет запускать `dbt test`.

На данный момент давайте упростим задачу и [создадим два каталога](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-ddl-create-catalog.html) — либо с помощью **Data <Constant name="explorer" />**, либо в SQL‑редакторе, используя следующие команды:

```sql
create catalog if not exists dev;
create catalog if not exists prod;
```

Пока вашему разработчику предоставлен доступ на запись в каталог данных dev, нет необходимости заранее создавать песочницы-схемы.

## Настройка сервисных принципалов

Когда аналитический инженер запускает проект dbt из своего <Constant name="cloud_ide" />, совершенно нормально, что итоговые запросы выполняются от имени этого пользователя. Однако для продакшен‑запусков мы хотим, чтобы выполнение происходило от имени *service principal*. Напомним, что service principal — это безличная учётная запись, не принадлежащая конкретному человеку.

Сервисные принципалы используются для исключения людей из процесса развертывания в производственной среде для удобства и безопасности. Личные идентичности не должны использоваться для создания производственных конвейеров, так как они могут сломаться, если пользователь покинет компанию или изменит свои учетные данные. Также не должно быть произвольных команд, изменяющих производственные данные. Только запланированные задания и код, прошедший тесты CI и код-ревью, должны иметь возможность изменять производственные данные. Если что-то ломается, есть аудируемый след изменений, чтобы найти коренную причину, легко вернуться к последней рабочей версии кода и минимизировать влияние на конечных пользователей.

[Давайте создадим сервисный принципал](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-your-databricks-account) в Databricks:

1. Попросите администратора вашего аккаунта Databricks [добавить сервисный принципал](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-your-databricks-account) в ваш аккаунт. Имя сервисного принципала должно отличаться от идентификатора пользователя и четко указывать на его назначение (например, dbt_prod_sp).
2. Добавьте сервисный принципал в любые группы, членом которых он должен быть на данный момент. Более подробная информация о разрешениях содержится в нашем руководстве ["Лучшие практики Unity Catalog"](/best-practices/dbt-unity-catalog-best-practices).
3. [Добавьте сервисный принципал в ваше рабочее пространство](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-a-workspace) и примените все [необходимые права](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-a-workspace-using-the-admin-console), такие как доступ к Databricks SQL и доступ к рабочему пространству.

## Настройка вычислительных ресурсов Databricks

Когда вы запускаете проект dbt, он генерирует SQL, который может выполняться на All Purpose Clusters или SQL warehouses. Мы настоятельно рекомендуем запускать SQL, сгенерированный dbt, в Databricks SQL warehouse. Поскольку SQL warehouses оптимизированы для выполнения SQL‑запросов, вы можете снизить затраты за счёт меньшего времени работы, необходимого для выполнения запросов. Кроме того, при отладке у вас будет доступ к Query Profile.

Мы рекомендуем использовать serverless‑кластер, если вы хотите минимизировать время, затрачиваемое на запуск кластера, и избавиться от необходимости менять размеры кластера в зависимости от рабочих процессов. Если вы используете Databricks serverless SQL warehouse, вам всё равно необходимо выбрать [размер кластера](https://docs.databricks.com/aws/en/compute/sql-warehouse/create#configure-sql-warehouse-settings) (например, 2X-Small, X-Small, Small, Medium, Large). Подробнее о serverless SQL warehouses см. в [документации Databricks](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior#sizing-a-serverless-sql-warehouse).

Давайте [создадим SQL склад Databricks](https://docs.databricks.com/sql/admin/sql-endpoints.html#create-a-sql-warehouse):

1. Нажмите **SQL Warehouses** в боковой панели.
2. Нажмите **Create SQL Warehouse**.
3. Введите имя для warehouse.
4. Если вы используете serverless SQL warehouse, выберите [размер кластера](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior#sizing-a-serverless-sql-warehouse) (от 2X-Small до 4X-Large) или оставьте значение по умолчанию, убедившись, что оно подходит для вашей нагрузки.
5. Примите настройки warehouse по умолчанию или измените их при необходимости.
6. Нажмите **Create**.
7. Настройте права доступа к warehouse, чтобы наш service principal и разработчик имели необходимый уровень доступа.

В этом материале мы не рассматриваем Python, но если вы хотите узнать больше, ознакомьтесь с этой [документацией](/docs/build/python-models#specific-data-platforms). В зависимости от вашей нагрузки, вы можете создать более крупный SQL Warehouse для production‑процессов и использовать меньший SQL Warehouse для разработки (если вы не используете Serverless SQL Warehouses). По мере роста проекта вам также может понадобиться применять [настройки compute на уровне отдельных моделей](/reference/resource-configs/databricks-configs#specifying-the-compute-for-models).

## Настройка вашего dbt проекта

Теперь, когда компоненты Databricks настроены, мы можем настроить наш dbt проект. Это включает в себя подключение dbt к нашему SQL складу Databricks для выполнения SQL запросов и использование системы контроля версий, такой как GitHub, для хранения нашего кода трансформации.

Если вы мигрируете существующий dbt проект с адаптера dbt-spark на dbt-databricks, следуйте этому [руководству по миграции](/guides/migrate-from-spark-to-databricks), чтобы переключить адаптеры без необходимости обновления учетных данных разработчика и других существующих конфигураций.

Если вы начинаете новый dbt проект, следуйте приведенным ниже шагам. Для более подробного процесса настройки ознакомьтесь с нашим [руководством по быстрому старту.](/guides/databricks)

### Подключение dbt к Databricks

Сначала вам нужно подключить проект dbt к Databricks, чтобы он мог отправлять инструкции по трансформации и создавать объекты в Unity Catalog. Следуйте инструкциям для [<Constant name="cloud" />](/guides/databricks?step=4) или [Core](/docs/core/connect-data-platform/databricks-setup), чтобы настроить учетные данные для подключения вашего проекта.

Каждый разработчик должен сгенерировать свой Databricks PAT и использовать этот токен в своих учетных данных для разработки. Также необходимо указать уникальную схему разработчика, в которой будут храниться таблицы и представления, создаваемые запусками dbt, выполненными из их <Constant name="cloud_ide" />. Это обеспечивает изолированные среды для разработчиков и гарантирует, что доступ к данным соответствует назначению.

Давайте сгенерируем [персональный токен доступа Databricks (PAT)](https://docs.databricks.com/sql/user/security/personal-access-tokens.html) для разработки:

1. В Databricks нажмите на ваше имя пользователя в верхней панели и выберите User Settings в выпадающем меню.
2. На вкладке Access token нажмите Generate new token.
3. Нажмите Generate.
4. Скопируйте отображаемый токен и нажмите Done. (не потеряйте его!)

Для ваших учетных данных разработки/profiles.yml:

1. Установите ваш каталог по умолчанию на dev.
2. Ваша схема разработчика должна быть названа в честь вас. Мы рекомендуем dbt_&lt;первая_буква_имени&gt;&lt;фамилия&gt;.

Во время первого вызова `dbt run`, dbt создаст схему разработчика, если она еще не существует в каталоге dev.

## Определение среды развертывания dbt

Нам нужно дать dbt способ развертывания кода вне сред разработки. Для этого мы будем использовать [окружения](https://docs.getdbt.com/docs/collaborate/environments) dbt, чтобы определить производственные цели, с которыми будут взаимодействовать конечные пользователи.

Нам нужно дать dbt способ деплоить код за пределами сред разработки. Для этого мы будем использовать [окружения dbt](/docs/environments-in-dbt), чтобы определить production-цели, с которыми будут взаимодействовать конечные пользователи.

В core‑проектах можно использовать [targets в profiles](/docs/core/connect-data-platform/connection-profiles#understanding-targets-in-profiles) для разделения окружений. Окружения [<Constant name="cloud" />](/docs/cloud/studio-ide/develop-in-studio#set-up-and-access-the-cloud-ide) позволяют определять окружения через UI и [планировать задания](/guides/databricks#create-and-run-a-job) для конкретных окружений.

1. Следуйте инструкциям Databricks, чтобы [настроить токен вашего сервисного принципала](https://docs.databricks.com/dev-tools/service-principals.html#use-curl-or-postman). Обратите внимание, что `lifetime_seconds` определит, как долго эти учетные данные будут оставаться действительными. Вы должны использовать большое число здесь, чтобы избежать частого регенерирования токенов и сбоев производственных заданий.
2. Теперь давайте вернемся к dbt Cloud, чтобы заполнить поля окружения. Нажмите на окружения в интерфейсе dbt Cloud или определите новую цель в вашем profiles.yml.
3. Установите *каталог* производственной среды на **prod** каталог, созданный выше. Предоставьте [сервисный токен](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#manage-access-tokens-for-a-service-principal) для вашего **prod** сервисного принципала и установите его как *токен* в учетных данных развертывания вашей производственной среды.
4. Установите схему по умолчанию для вашей prod среды. Это может быть переопределено [пользовательскими схемами](https://docs.getdbt.com/docs/build/custom-schemas#what-is-a-custom-schema), если вам нужно использовать более одной.
5. Предоставьте токен вашего сервисного принципала.

1. Следуйте инструкциям Databricks, чтобы [настроить токен вашего service principal](https://docs.databricks.com/dev-tools/service-principals.html#use-curl-or-postman). Обратите внимание, что параметр `lifetime_seconds` определяет, как долго этот учетный данные будут оставаться действительными. Рекомендуется указать большое значение, чтобы избежать частой регенерации токенов и сбоев production‑задач.
2. Теперь вернитесь в <Constant name="cloud" />, чтобы заполнить поля окружения. Нажмите **environments** в UI <Constant name="cloud" /> или определите новый target в вашем `profiles.yml`.
3. Установите для production‑окружения значение *catalog* равным каталогу **prod**, созданному выше. Укажите [service token](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#manage-access-tokens-for-a-service-principal) для вашего **prod** service principal и задайте его в качестве *token* в deployment credentials вашего production‑окружения.
4. Установите schema в значение по умолчанию для вашего prod‑окружения. При необходимости это можно переопределить с помощью [custom schemas](/docs/build/custom-schemas#what-is-a-custom-schema), если вам нужно использовать более одной схемы.
5. Укажите токен вашего Service Principal.

Далее вам понадобится место для хранения и контроля версий вашего кода, которое позволит вам сотрудничать с коллегами. Подключите ваш dbt проект к git репозиторию с помощью [dbt Cloud](/guides/databricks#set-up-a-dbt-cloud-managed-repository). [Core](/guides/manual-install#create-a-repository) проекты будут использовать git CLI.

Далее вам понадобится место для хранения кода и управления его версиями, которое также позволит вам совместно работать с коллегами. Подключите свой проект dbt к git-репозиторию с помощью [<Constant name="cloud" />](/guides/databricks#set-up-a-dbt-cloud-managed-repository). Проекты [Core](/guides/manual-install#create-a-repository) будут использовать git CLI.

Теперь, когда ваш проект настроен, вы можете начать трансформировать ваши данные в Databricks с помощью dbt. Чтобы помочь вам масштабироваться эффективно, мы рекомендуем следовать нашим лучшим практикам, начиная с [лучших практик Unity Catalog](/best-practices/dbt-unity-catalog-best-practices), затем вы можете [оптимизировать модели dbt на Databricks](/guides/optimize-dbt-models-on-databricks).

</div>