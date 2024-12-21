---
title: "Использование dbt Cloud для создания аналитических и ML-готовых конвейеров с SQL и Python в Snowflake"
id: "dbt-python-snowpark"
description: "Использование dbt Cloud для создания аналитических и ML-готовых конвейеров с SQL и Python в Snowflake"
hoverSnippet: Узнайте, как использовать dbt Cloud для создания аналитических и ML-готовых конвейеров с SQL и Python в Snowflake.
icon: 'guides'
hide_table_of_contents: true
tags: ['Snowflake']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Цель этого воркшопа — продемонстрировать, как можно использовать *SQL и Python вместе* в одном рабочем процессе для запуска *аналитических и моделей машинного обучения* в dbt Cloud.

Весь код сегодняшнего воркшопа можно найти на [GitHub](https://github.com/dbt-labs/python-snowpark-formula1/tree/python-formula1).

### Что вы будете использовать во время лабораторной работы

- Аккаунт [Snowflake](https://trial.snowflake.com/) с доступом ACCOUNTADMIN
- Аккаунт [dbt Cloud](https://www.getdbt.com/signup/)

### Чему вы научитесь

- Как строить масштабируемые конвейеры преобразования данных с использованием dbt и Snowflake с помощью SQL и Python
- Как использовать копирование данных в Snowflake из публичного S3-бакета

### Что вам нужно знать

- Базовые и средние знания SQL и Python.
- Базовое понимание основ dbt. Мы рекомендуем [курс dbt Fundamentals](https://learn.getdbt.com), если вам интересно.
- Общий процесс машинного обучения (кодирование, обучение, тестирование)
- Простые алгоритмы ML &mdash; мы будем использовать логистическую регрессию, чтобы сосредоточиться на *рабочем процессе*, а не на алгоритмах!

### Что вы создадите

- Набор аналитических и предсказательных конвейеров данных, используя данные Формулы 1, с использованием dbt и Snowflake, применяя лучшие практики, такие как тесты качества данных и продвижение кода между средами
- Мы создадим инсайты для:
    1. Поиск среднего времени круга и скользящего среднего за годы (в целом оно увеличивается или уменьшается)?
    2. Какой конструктор имеет самые быстрые пит-стопы в 2021 году?
    3. Прогнозирование позиции каждого водителя, используя данные за десятилетие (2010 - 2020)

В качестве входных данных мы будем использовать наборы данных Формулы 1, размещенные в публичном S3-бакете dbt Labs. Мы создадим Snowflake Stage для наших CSV-файлов, а затем используем функцию Snowflake `COPY INTO`, чтобы скопировать данные из наших CSV-файлов в таблицы. Данные Формулы 1 доступны на [Kaggle](https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020). Данные изначально собраны из [Ergast Developer API](http://ergast.com/mrd/).

В целом, мы настроим среды, построим масштабируемые конвейеры в dbt, установим тесты данных и продвинем код в производство.

## Настройка Snowflake

1. Войдите в свой пробный аккаунт Snowflake. Вы можете [зарегистрироваться для пробного аккаунта Snowflake, используя эту форму](https://signup.snowflake.com/), если у вас его нет.
2. Убедитесь, что ваш аккаунт настроен с использованием **AWS** в **US East (N. Virginia)**. Мы будем копировать данные из публичного AWS S3-бакета, размещенного dbt Labs в регионе us-east-1. Убедившись, что наша настройка среды Snowflake соответствует региону нашего бакета, мы избегаем любых задержек при копировании и извлечении данных между регионами.

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/1-snowflake-trial-AWS-setup.png" title="Пробная версия Snowflake"/>

3. После создания вашего аккаунта и его подтверждения из письма для регистрации, Snowflake перенаправит вас обратно в интерфейс, называемый Snowsight.

4. Когда Snowsight впервые открывается, ваше окно должно выглядеть следующим образом, с вами, вошедшим в систему как ACCOUNTADMIN с открытыми демонстрационными листами:

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/2-new-snowflake-account.png" title="Демонстрационные листы пробной версии Snowflake"/>

5. Перейдите в **Admin > Billing & Terms**. Нажмите **Enable > Acknowledge & Continue**, чтобы включить пакеты Anaconda Python для работы в Snowflake.

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/3-accept-anaconda-terms.jpeg" title="Условия Anaconda"/>

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration/4-enable-anaconda.jpeg" title="Включить Anaconda"/>

6. Наконец, создайте новый лист, выбрав **+ Worksheet** в правом верхнем углу.

## Подключение к источнику данных

Нам нужно получить наш источник данных, скопировав наши данные Формулы 1 в таблицы Snowflake из публичного S3-бакета, который размещает dbt Labs.

1. Когда создается новый аккаунт Snowflake, в вашем аккаунте должен быть предварительно настроенный склад с именем `COMPUTE_WH`.
2. Если по какой-либо причине в вашем аккаунте нет этого склада, мы можем создать склад, используя следующий скрипт:

    ```sql
    create or replace warehouse COMPUTE_WH with warehouse_size=XSMALL
    ```

3. Переименуйте лист в `data setup script`, так как мы будем размещать код в этом листе для загрузки данных Формулы 1. Убедитесь, что вы все еще вошли в систему как **ACCOUNTADMIN** и выберите склад **COMPUTE_WH**.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/3-connect-to-data-source/1-rename-worksheet-and-select-warehouse.png" title="Переименовать лист и выбрать склад"/>

4. Скопируйте следующий код в основное тело листа Snowflake. Вы также можете найти этот скрипт настройки в папке `setup` в [Git-репозитории](https://github.com/dbt-labs/python-snowpark-formula1/blob/main/setup/setup_script_s3_to_snowflake.sql). Скрипт длинный, так как он загружает все данные, которые нам понадобятся сегодня!

    ```sql
    -- create and define our formula1 database
    create or replace database formula1;
    use database formula1; 
    create or replace schema raw; 
    use schema raw; 

    -- define our file format for reading in the csvs 
    create or replace file format csvformat
    type = csv
    field_delimiter =','
    field_optionally_enclosed_by = '"', 
    skip_header=1; 

    --
    create or replace stage formula1_stage
    file_format = csvformat 
    url = 's3://formula1-dbt-cloud-python-demo/formula1-kaggle-data/';

    -- load in the 8 tables we need for our demo 
    -- we are first creating the table then copying our data in from s3
    -- think of this as an empty container or shell that we are then filling
    create or replace table formula1.raw.circuits (
        CIRCUITID NUMBER(38,0),
        CIRCUITREF VARCHAR(16777216),
        NAME VARCHAR(16777216),
        LOCATION VARCHAR(16777216),
        COUNTRY VARCHAR(16777216),
        LAT FLOAT,
        LNG FLOAT,
        ALT NUMBER(38,0),
        URL VARCHAR(16777216)
    );
    -- copy our data from public s3 bucket into our tables 
    copy into circuits 
    from @formula1_stage/circuits.csv
    on_error='continue';

    create or replace table formula1.raw.constructors (
        CONSTRUCTORID NUMBER(38,0),
        CONSTRUCTORREF VARCHAR(16777216),
        NAME VARCHAR(16777216),
        NATIONALITY VARCHAR(16777216),
        URL VARCHAR(16777216)
    );
    copy into constructors 
    from @formula1_stage/constructors.csv
    on_error='continue';

    create or replace table formula1.raw.drivers (
        DRIVERID NUMBER(38,0),
        DRIVERREF VARCHAR(16777216),
        NUMBER VARCHAR(16777216),
        CODE VARCHAR(16777216),
        FORENAME VARCHAR(16777216),
        SURNAME VARCHAR(16777216),
        DOB DATE,
        NATIONALITY VARCHAR(16777216),
        URL VARCHAR(16777216)
    );
    copy into drivers 
    from @formula1_stage/drivers.csv
    on_error='continue';

    create or replace table formula1.raw.lap_times (
        RACEID NUMBER(38,0),
        DRIVERID NUMBER(38,0),
        LAP NUMBER(38,0),
        POSITION FLOAT,
        TIME VARCHAR(16777216),
        MILLISECONDS NUMBER(38,0)
    );
    copy into lap_times 
    from @formula1_stage/lap_times.csv
    on_error='continue';

    create or replace table formula1.raw.pit_stops (
        RACEID NUMBER(38,0),
        DRIVERID NUMBER(38,0),
        STOP NUMBER(38,0),
        LAP NUMBER(38,0),
        TIME VARCHAR(16777216),
        DURATION VARCHAR(16777216),
        MILLISECONDS NUMBER(38,0)
    );
    copy into pit_stops 
    from @formula1_stage/pit_stops.csv
    on_error='continue';

    create or replace table formula1.raw.races (
        RACEID NUMBER(38,0),
        YEAR NUMBER(38,0),
        ROUND NUMBER(38,0),
        CIRCUITID NUMBER(38,0),
        NAME VARCHAR(16777216),
        DATE DATE,
        TIME VARCHAR(16777216),
        URL VARCHAR(16777216),
        FP1_DATE VARCHAR(16777216),
        FP1_TIME VARCHAR(16777216),
        FP2_DATE VARCHAR(16777216),
        FP2_TIME VARCHAR(16777216),
        FP3_DATE VARCHAR(16777216),
        FP3_TIME VARCHAR(16777216),
        QUALI_DATE VARCHAR(16777216),
        QUALI_TIME VARCHAR(16777216),
        SPRINT_DATE VARCHAR(16777216),
        SPRINT_TIME VARCHAR(16777216)
    );
    copy into races 
    from @formula1_stage/races.csv
    on_error='continue';

    create or replace table formula1.raw.results (
        RESULTID NUMBER(38,0),
        RACEID NUMBER(38,0),
        DRIVERID NUMBER(38,0),
        CONSTRUCTORID NUMBER(38,0),
        NUMBER NUMBER(38,0),
        GRID NUMBER(38,0),
        POSITION FLOAT,
        POSITIONTEXT VARCHAR(16777216),
        POSITIONORDER NUMBER(38,0),
        POINTS NUMBER(38,0),
        LAPS NUMBER(38,0),
        TIME VARCHAR(16777216),
        MILLISECONDS NUMBER(38,0),
        FASTESTLAP NUMBER(38,0),
        RANK NUMBER(38,0),
        FASTESTLAPTIME VARCHAR(16777216),
        FASTESTLAPSPEED FLOAT,
        STATUSID NUMBER(38,0)
    );
    copy into results 
    from @formula1_stage/results.csv
    on_error='continue';

    create or replace table formula1.raw.status (
        STATUSID NUMBER(38,0),
        STATUS VARCHAR(16777216)
    );
    copy into status 
    from @formula1_stage/status.csv
    on_error='continue';

    ```

5. Убедитесь, что все команды выбраны перед выполнением запроса &mdash; простой способ сделать это — использовать Ctrl-a, чтобы выделить весь код в листе. Выберите **run** (синий треугольник). Обратите внимание, как точка рядом с вашим **COMPUTE_WH** меняется с серого на зеленый, когда вы выполняете запрос. Таблица **status** является последней из всех 8 загруженных таблиц.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/3-connect-to-data-source/2-load-data-from-s3.png" title="Загрузка данных из S3-бакета"/>

6. Давайте разберем этот довольно длинный запрос на составные части. Мы выполнили этот запрос, чтобы загрузить наши 8 таблиц Формулы 1 из публичного S3-бакета. Для этого мы:
    - Создали новую базу данных с именем `formula1` и схему с именем `raw`, чтобы разместить наши необработанные (непреобразованные) данные.
    - Определили формат файла для наших CSV-файлов. Важно, что здесь мы используем параметр `field_optionally_enclosed_by =`, так как строковые столбцы в наших CSV-файлах Формулы 1 используют кавычки. Кавычки используются вокруг строковых значений, чтобы избежать проблем с разбором, когда запятые `,` и новые строки `/n` в значениях данных могут вызвать ошибки загрузки данных.
    - Создали stage для размещения наших данных, которые мы собираемся загрузить. Snowflake Stages — это места, где хранятся файлы данных. Stages используются как для загрузки, так и для выгрузки данных в и из местоположений Snowflake. Здесь мы используем внешний stage, ссылаясь на S3-бакет.
    - Создали наши таблицы для копирования данных. Это пустые таблицы с именем столбца и типом данных. Подумайте об этом как о создании пустого контейнера, который затем будет заполнен данными.
    - Использовали оператор `copy into` для каждой из наших таблиц. Мы ссылаемся на наше staged местоположение, которое мы создали, и при ошибках загрузки продолжаем загружать остальные данные. У вас не должно быть ошибок загрузки данных, но если они возникнут, эти строки будут пропущены, и Snowflake сообщит вам, какие строки вызвали ошибки.

7. Теперь давайте посмотрим на некоторые из наших крутых данных Формулы 1, которые мы только что загрузили!
    1. Создайте новый лист, выбрав **+** затем **New Worksheet**.
        <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/3-connect-to-data-source/3-create-new-worksheet-to-query-data.png" title="Создать новый лист для запроса данных"/>
    2. Перейдите в **Database > Formula1 > RAW > Tables**.
    3. Запросите данные, используя следующий код. В таблице circuits всего 76 строк, поэтому нам не нужно беспокоиться об ограничении количества запрашиваемых данных.

        ```sql
        select * from formula1.raw.circuits
        ```

    4. Выполните запрос. С этого момента мы будем использовать сочетания клавиш Command-Enter или Control-Enter для выполнения запросов и не будем явно указывать этот шаг.
    5. Просмотрите результаты запроса, вы должны увидеть информацию о трассах Формулы 1, начиная с Альберт-Парка в Австралии!
    6. Наконец, убедитесь, что у вас есть все 8 таблиц, начиная с `CIRCUITS` и заканчивая `STATUS`. Теперь мы готовы подключиться к dbt Cloud!

        <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/3-connect-to-data-source/4-query-circuits-data.png" title="Запрос данных о трассах"/>

## Настройка dbt Cloud

1. Мы будем использовать [Snowflake Partner Connect](https://docs.snowflake.com/en/user-guide/ecosystem-partner-connect.html) для настройки аккаунта dbt Cloud. Использование этого метода позволит вам развернуть полноценный аккаунт dbt с вашим [подключением Snowflake](/docs/cloud/connect-data-platform/connect-snowflake), [управляемым репозиторием](/docs/collaborate/git/managed-repository), средами и учетными данными, уже установленными.
2. Выйдите из своего листа, выбрав **home**.
3. В Snowsight убедитесь, что вы используете роль **ACCOUNTADMIN**.
4. Перейдите в **Data Products** **> Partner Connect**. Найдите **dbt**, используя строку поиска или перейдя в **Data Integration**. Выберите плитку **dbt**.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/4-configure-dbt/1-open-partner-connect.png" title="Открыть Partner Connect"/>
5. Теперь вы должны увидеть новое окно с надписью **Connect to dbt**. Выберите **Optional Grant** и добавьте базу данных `FORMULA1`. Это предоставит доступ вашей новой роли пользователя dbt к базе данных FORMULA1.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/4-configure-dbt/2-partner-connect-optional-grant.png" title="Optional Grant в Partner Connect"/>

6. Убедитесь, что `FORMULA1` присутствует в вашем optional grant перед нажатием **Connect**. Это создаст выделенного пользователя dbt, базу данных, склад и роль для вашей пробной версии dbt Cloud.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/4-configure-dbt/3-connect-to-dbt.png" title="Подключение к dbt"/>

7. Когда вы увидите окно **Your partner account has been created**, нажмите **Activate**.

8. Вы должны быть перенаправлены на страницу регистрации dbt Cloud. Заполните форму. Обязательно сохраните пароль где-нибудь для входа в будущем.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/4-configure-dbt/4-dbt-cloud-sign-up.png" title="Регистрация в dbt Cloud"/>

9. Выберите **Complete Registration**. Теперь вы должны быть перенаправлены на ваш аккаунт dbt Cloud, с подключением к вашему аккаунту Snowflake, развертыванием и средой разработки, а также примером задания.

10. Чтобы помочь вам с управлением версиями вашего проекта dbt, мы подключили его к [управляемому репозиторию](/docs/collaborate/git/managed-repository), что означает, что dbt Labs будет размещать ваш репозиторий для вас. Это даст вам доступ к рабочему процессу Git без необходимости создавать и размещать репозиторий самостоятельно. Вам не нужно будет знать Git для этого воркшопа; dbt Cloud поможет вам пройти через рабочий процесс. В будущем, когда вы будете разрабатывать свой собственный проект, [не стесняйтесь использовать свой собственный репозиторий](/docs/cloud/git/connect-github). Это позволит вам узнать больше о таких функциях, как [Slim CI](/docs/deploy/continuous-integration) сборки после этого воркшопа.

## Изменение имени схемы разработки и навигация по IDE

1. Сначала мы изменим имя нашей схемы по умолчанию, в которой будут строиться наши модели dbt. По умолчанию имя — `dbt_`. Мы изменим его на `dbt_<ВАШЕ_ИМЯ>`, чтобы создать вашу личную схему разработки. Для этого нажмите на свое имя аккаунта в левом меню и выберите **Account settings**.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/1-settings-gear-icon.png" title="Меню настроек"/>

2. Перейдите в меню **Credentials** и выберите **Partner Connect Trial**, чтобы развернуть меню учетных данных.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/2-credentials-edit-schema-name.png" title="Редактирование имени схемы учетных данных"/>

3. Нажмите **Edit** и измените имя вашей схемы с `dbt_` на `dbt_YOUR_NAME`, заменив `YOUR_NAME` вашими инициалами и именем (`hwatson` используется в скриншотах лаборатории). Обязательно нажмите **Save** для сохранения изменений!
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/3-save-new-schema-name.png" title="Сохранить новое имя схемы"/>

4. Теперь у нас есть наша личная схема разработки, удивительно! Когда мы запустим наши первые модели dbt, они будут построены в этой схеме.
5. Давайте откроем интегрированную среду разработки (IDE) dbt Cloud и ознакомимся с ней. Выберите **Develop** в верхней части интерфейса.

6. Когда IDE загрузится, нажмите **Initialize dbt project**. Процесс инициализации создает набор файлов и папок, необходимых для запуска вашего проекта dbt.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/4-initialize-dbt-project.png" title="Инициализация проекта dbt"/>

7. После завершения инициализации вы можете просмотреть файлы и папки в меню дерева файлов. По мере продвижения по воркшопу мы обязательно коснемся нескольких ключевых файлов и папок, с которыми мы будем работать для создания нашего проекта.
8. Далее нажмите **Commit and push**, чтобы зафиксировать новые файлы и папки из шага инициализации. Мы всегда хотим, чтобы наши сообщения о фиксации были актуальны для работы, которую мы фиксируем, поэтому обязательно предоставьте сообщение, например, `initialize project`, и выберите **Commit Changes**.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/5-first-commit-and-push.png" title="Первая фиксация и отправка"/>

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/6-initalize-project.png" title="Инициализация проекта"/>

9. [Фиксация](https://www.atlassian.com/git/tutorials/saving-changes/git-commit) вашей работы здесь сохранит ее в управляемом git-репозитории, который был создан во время регистрации Partner Connect. Эта начальная фиксация будет единственной фиксацией, которая будет сделана непосредственно в нашей ветке `main`, и с этого момента мы будем выполнять всю нашу работу в ветке разработки. Это позволяет нам держать нашу разработку отдельно от нашего производственного кода.
10. Есть несколько ключевых функций, на которые стоит обратить внимание в IDE, прежде чем мы начнем работать. Это текстовый редактор, SQL и Python-исполнитель, а также CLI с управлением версиями Git, все в одном пакете! Это позволяет вам сосредоточиться на редактировании ваших SQL и Python файлов, предварительном просмотре результатов с помощью SQL-исполнителя (он даже выполняет Jinja!) и построении моделей в командной строке без необходимости переключаться между различными приложениями. Рабочий процесс Git в dbt Cloud позволяет как новичкам, так и экспертам Git легко управлять версиями всей своей работы с помощью нескольких кликов.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/7-IDE-overview.png" title="Обзор IDE"/>

11. Давайте запустим наши первые модели dbt! В ваш проект dbt включены две примерные модели в папке `models/examples`, которые мы можем использовать для иллюстрации того, как запускать dbt в командной строке. Введите `dbt run` в командной строке и нажмите **Enter** на клавиатуре. Когда панель выполнения развернется, вы сможете увидеть результаты выполнения, где вы должны увидеть успешное завершение выполнения.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/8-dbt-run-example-models.png" title="Запуск примерных моделей dbt"/>

12. Результаты выполнения позволяют вам увидеть код, который dbt компилирует и отправляет в Snowflake для выполнения. Чтобы просмотреть журналы этого выполнения, выберите одну из вкладок модели, используя значок **>**, а затем **Details**. Если вы немного прокрутите вниз, вы сможете увидеть скомпилированный код и то, как dbt взаимодействует с Snowflake. Поскольку это выполнение происходило в нашей среде разработки, модели были созданы в вашей схеме разработки.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/9-second-model-details.png" title="Детали о второй модели"/>

13. Теперь давайте переключимся на Snowflake, чтобы подтвердить, что объекты действительно были созданы. Нажмите на три точки **…** над вашими объектами базы данных, а затем **Refresh**. Разверните базу данных **PC_DBT_DB**, и вы должны увидеть вашу схему разработки. Выберите схему, затем **Tables** и **Views**. Теперь вы должны увидеть `MY_FIRST_DBT_MODEL` как таблицу и `MY_SECOND_DBT_MODEL` как представление.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/10-confirm-example-models-built-in-snowflake.png" title="Подтвердите, что примерные модели построены в Snowflake"/>

## Создание ветки и настройка конфигураций проекта

На этом этапе нам нужно создать ветку разработки и настроить конфигурации на уровне проекта.

1. Чтобы начать разработку нашего проекта, нам нужно создать новую ветку Git для нашей работы. Выберите **create branch** и назовите вашу ветку разработки. Мы назовем нашу ветку `snowpark_python_workshop`, затем нажмите **Submit**.
2. Первым шагом в разработке проекта будет обновление файла `dbt_project.yml`. Каждый проект dbt требует наличия файла `dbt_project.yml` &mdash; это то, как dbt узнает, что каталог является проектом dbt. Файл [dbt_project.yml](/reference/dbt_project.yml) также содержит важную информацию, которая сообщает dbt, как работать с вашим проектом.
3. Выберите файл `dbt_project.yml` из дерева файлов, чтобы открыть его, и замените все существующее содержимое следующим кодом. Когда закончите, сохраните файл, нажав **save**. Вы также можете использовать сочетание клавиш Command-S или Control-S с этого момента.

    ```yaml
    # Назовите ваш проект! Имена проектов должны содержать только строчные символы
    # и подчеркивания. Хорошее имя пакета должно отражать название вашей организации
    # или предполагаемое использование этих моделей
    name: 'snowflake_dbt_python_formula1'
    version: '1.3.0'
    require-dbt-version: '>=1.3.0'
    config-version: 2

    # Эта настройка конфигурирует, какой "профиль" dbt использует для этого проекта.
    profile: 'default'

    # Эти конфигурации указывают, где dbt должен искать различные типы файлов.
    # Конфигурация `model-paths`, например, указывает, что модели в этом проекте можно
    # найти в каталоге "models/". Вероятно, вам не нужно будет их изменять!
    model-paths: ["models"]
    analysis-paths: ["analyses"]
    test-paths: ["tests"]
    seed-paths: ["seeds"]
    macro-paths: ["macros"]
    snapshot-paths: ["snapshots"]

    target-path: "target"  # каталог, который будет хранить скомпилированные SQL файлы
    clean-targets:         # каталоги, которые будут удалены командой `dbt clean`
     - "target"
     - "dbt_packages"

    models:
     snowflake_dbt_python_formula1:
       staging:
    
     +docs:
       node_color: "CadetBlue"
     marts:
      +materialized: table
      aggregates:
       +docs:
         node_color: "Maroon"
       +tags: "bi"

     core:
       +docs:
         node_color: "#800080"
     intermediate:
       +docs:
         node_color: "MediumSlateBlue"
     ml:
       prep:
         +docs:
           node_color: "Indigo"
       train_predict:
         +docs:
           node_color: "#36454f"

    ```

4. Основные конфигурации, на которые стоит обратить внимание в файле в отношении работы, которую мы собираемся выполнить, находятся в разделе `models`.
    - `require-dbt-version` &mdash; Указывает dbt, какую версию dbt использовать для вашего проекта. Мы требуем 1.3.0 и любую более новую версию для запуска python моделей и цветов узлов.
    - `materialized` &mdash; Указывает dbt, как материализовать модели при компиляции кода перед его отправкой в Snowflake. Все модели в папке `marts` будут построены как таблицы.
    - `tags` &mdash; Применяет теги на уровне каталога ко всем моделям. Все модели в папке `aggregates` будут помечены как `bi` (сокращение от business intelligence).
    - `docs` &mdash; Указывает `node_color` либо по имени цвета, либо по значению hex.
5. [Материализации](/docs/build/materializations) — это стратегии для сохранения моделей dbt в хранилище, с `tables` и `views` как наиболее часто используемыми типами. По умолчанию все модели dbt материализуются как представления, и другие типы материализации могут быть настроены в файле `dbt_project.yml` или в самой модели. Очень важно отметить, что *Python модели могут быть материализованы только как таблицы или инкрементальные модели.* Поскольку все наши Python модели находятся в `marts`, следующая часть нашего `dbt_project.yml` гарантирует, что не возникнет ошибок при запуске наших Python моделей. Начиная с [версии dbt 1.4](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.4#updates-to-python-models), Python файлы автоматически материализуются как таблицы, даже если это не указано явно.

    ```yaml
    marts:     
      +materialized: table
    ```

## Создание папок и организация файлов

dbt Labs разработала [руководство по структуре проекта](/best-practices/how-we-structure/1-guide-overview/), которое содержит ряд рекомендаций по построению структуры папок для вашего проекта. Обязательно ознакомьтесь с этим руководством, если хотите узнать больше. Сейчас мы создадим несколько папок для организации наших файлов:

- Источники &mdash; Это наш набор данных Формулы 1, и он будет определен в YAML файле источника.
- Модели подготовки &mdash; Эти модели имеют 1:1 с их исходной таблицей.
- Промежуточные &mdash; Здесь мы будем объединять некоторые модели подготовки Формулы.
- Модели Marts &mdash; Здесь мы выполняем наши основные преобразования. Он содержит следующие подпапки:
  - aggregates
  - core
  - ml

1. В вашем дереве файлов используйте курсор и наведите на подкаталог `models`, нажмите на три точки **…**, которые появятся справа от имени папки, затем выберите **Create Folder**. Мы добавим две новые папки в путь к файлу, `staging` и `formula1` (в этом порядке), введя `staging/formula1` в путь к файлу.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/7-folder-structure/1-create-folder.png" title="Создать папку"/>
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/7-folder-structure/2-file-path.png" title="Установить путь к файлу"/>

    - Если вы откроете свой каталог `models` сейчас, вы должны увидеть новую папку `staging`, вложенную в `models`, и папку `formula1`, вложенную в `staging`.
2. Создайте две дополнительные папки так же, как и на предыдущем шаге. В подкаталоге `models` создайте новые каталоги `marts/core`.

3. Нам нужно будет создать еще несколько папок и подпапок с помощью интерфейса. После того, как вы создадите все необходимые папки, ваше дерево папок должно выглядеть так, когда все будет готово:

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/7-folder-structure/3-tree-of-new-folders.png" title="Дерево новых папок"/>

Помните, что вы всегда можете обратиться к полному проекту на [GitHub](https://github.com/dbt-labs/python-snowpark-formula1/tree/python-formula1), чтобы просмотреть полную структуру папок и файлов.

## Создание источников и моделей подготовки

В этом разделе мы создадим наши источники и модели подготовки.

Источники позволяют нам создать зависимость между нашим исходным объектом базы данных и нашими моделями подготовки, что поможет нам, когда мы будем смотреть на <Term id="data-lineage" /> позже. Кроме того, если ваш источник изменяет базу данных или схему, вам нужно будет обновить его только в вашем файле `f1_sources.yml`, а не обновлять все модели, в которых он может использоваться.

Модели подготовки являются основой нашего проекта, где мы собираем все отдельные компоненты, которые мы будем использовать для создания наших более сложных и полезных моделей в проект.

Поскольку мы хотим сосредоточиться на dbt и Python в этом воркшопе, ознакомьтесь с нашими [источниками](/docs/build/sources) и [документами по подготовке](/best-practices/how-we-structure/2-staging), если хотите узнать больше (или пройдите наш [курс dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals), который охватывает все наши основные функции).

### 1. Создание источников

Мы будем использовать каждую из наших 8 таблиц Формулы 1 из нашей базы данных `formula1` под схемой `raw` для наших преобразований, и мы хотим создать эти таблицы как источники в нашем проекте.

1. Создайте новый файл с именем `f1_sources.yml` с следующим путем к файлу: `models/staging/formula1/f1_sources.yml`.
2. Затем вставьте следующий код в файл перед его сохранением:

```yaml
version: 2

sources:
  - name: formula1
    description: формула 1 наборы данных с нормализованными таблицами 
    database: formula1 
    schema: raw
    tables:
      - name: circuits
        description: Одна запись на трассу, которая является конкретной гоночной трассой. 
        columns:
          - name: circuitid
            tests:
            - unique
            - not_null
      - name: constructors 
        description: Одна запись на конструктора. Конструкторы — это команды, которые строят свои автомобили Формулы 1. 
        columns:
          - name: constructorid
            tests:
            - unique
            - not_null
      - name: drivers
        description: Одна запись на водителя. Эта таблица содержит информацию о водителе. 
        columns:
          - name: driverid
            tests:
            - unique
            - not_null
      - name: lap_times
        description: Одна строка на круг в каждой гонке. Время круга начало записываться в этом наборе данных в 1984 году и соединяется через driver_id.
      - name: pit_stops 
        description: Одна строка на пит-стоп. Пит-стопы не имеют собственного столбца id, комбинация race_id и driver_id идентифицирует пит-стоп.
        columns:
          - name: stop
            tests:
              - accepted_values:
                  values: [1,2,3,4,5,6,7,8]
                  quote: false            
      - name: races 
        description: Одна гонка на строку. Важно, что эта таблица содержит год гонки для понимания тенденций. 
        columns:
          - name: raceid
            tests:
            - unique
            - not_null        
      - name: results
        columns:
          - name: resultid
            tests:
            - unique
            - not_null   
        description: Одна строка на результат. Основная таблица, которую мы соединяем для переменных сетки и позиции.
      - name: status
        description: Один статус на строку. Статус контекстуализирует, была ли гонка завершена или какие проблемы возникли, например, столкновения, двигатель и т.д. 
        columns:
          - name: statusid
            tests:
            - unique
            - not_null
```

### 2. Создание моделей подготовки

Следующим шагом будет настройка моделей подготовки для каждой из 8 исходных таблиц. Учитывая отношение один к одному между моделями подготовки и их соответствующими исходными таблицами, мы создадим здесь 8 моделей подготовки. Мы знаем, что это много, и в будущем мы постараемся обновить воркшоп, чтобы сделать этот шаг менее повторяющимся и более эффективным. Этот шаг также является хорошим представлением реального мира данных, где у вас есть несколько иерархических таблиц, которые вам нужно будет объединить!

1. Давайте пойдем в алфавитном порядке, чтобы легко отслеживать все наши модели подготовки! Создайте новый файл с именем `stg_f1_circuits.sql` с этим путем к файлу `models/staging/formula1/stg_f1_circuits.sql`. Затем вставьте следующий код в файл перед его сохранением:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','circuits') }}

    ),

    renamed as (
        select
            circuitid as circuit_id,
            circuitref as circuit_ref,
            name as circuit_name,
            location,
            country,
            lat as latitude,
            lng as longitude,
            alt as altitude
            -- omit the url
        from source
    )
    select * from renamed
    ```

    Все, что мы делаем здесь, это извлекаем исходные данные в модель, используя функцию `source`, переименовываем некоторые столбцы и пропускаем столбец `url` с комментарием, так как он нам не нужен для нашего анализа.

1. Создайте `stg_f1_constructors.sql` с этим путем к файлу `models/staging/formula1/stg_f1_constructors.sql`. Вставьте следующий код в него перед сохранением файла:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','constructors') }}

    ),

    renamed as (
        select
            constructorid as constructor_id,
            constructorref as constructor_ref,
            name as constructor_name,
            nationality as constructor_nationality
            -- omit the url
        from source
    )

    select * from renamed
    ```

    У нас есть еще 6 моделей подготовки, которые нужно создать. Мы можем сделать это, создавая новые файлы, а затем копируя и вставляя код в нашу папку `staging`.

1. Создайте `stg_f1_drivers.sql` с этим путем к файлу `models/staging/formula1/stg_f1_drivers.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','drivers') }}

    ),

    renamed as (
        select
            driverid as driver_id,
            driverref as driver_ref,
            number as driver_number,
            code as driver_code,
            forename,
            surname,
            dob as date_of_birth,
            nationality as driver_nationality
            -- omit the url
        from source
    )

    select * from renamed
    ```

1. Создайте `stg_f1_lap_times.sql` с этим путем к файлу `models/staging/formula1/stg_f1_lap_times.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','lap_times') }}

    ),

    renamed as (
        select
            raceid as race_id,
            driverid as driver_id,
            lap,
            position,
            time as lap_time_formatted,
            milliseconds as lap_time_milliseconds
        from source
    )

    select * from renamed
    ```

1. Создайте `stg_f1_pit_stops.sql` с этим путем к файлу `models/staging/formula1/stg_f1_pit_stops.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','pit_stops') }}

    ),

    renamed as (
        select
            raceid as race_id,
            driverid as driver_id,
            stop as stop_number,
            lap,
            time as lap_time_formatted,
            duration as pit_stop_duration_seconds,
            milliseconds as pit_stop_milliseconds
        from source
    )

    select * from renamed
    order by pit_stop_duration_seconds desc
    ```

1. Создайте `stg_f1_races.sql` с этим путем к файлу `models/staging/formula1/stg_f1_races.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','races') }}

    ),

    renamed as (
        select
            raceid as race_id,
            year as race_year,
            round as race_round,
            circuitid as circuit_id,
            name as circuit_name,
            date as race_date,
            to_time(time) as race_time,
            -- omit the url
            fp1_date as free_practice_1_date,
            fp1_time as free_practice_1_time,
            fp2_date as free_practice_2_date,
            fp2_time as free_practice_2_time,
            fp3_date as free_practice_3_date,
            fp3_time as free_practice_3_time,
            quali_date as qualifying_date,
            quali_time as qualifying_time,
            sprint_date,
            sprint_time
        from source
    )

    select * from renamed
    ```

1. Создайте `stg_f1_results.sql` с этим путем к файлу `models/staging/formula1/stg_f1_results.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','results') }}

    ),

    renamed as (
        select
            resultid as result_id,
            raceid as race_id,
            driverid as driver_id,
            constructorid as constructor_id,
            number as driver_number,
            grid,
            position::int as position,
            positiontext as position_text,
            positionorder as position_order,
            points,
            laps,
            time as results_time_formatted,
            milliseconds as results_milliseconds,
            fastestlap as fastest_lap,
            rank as results_rank,
            fastestlaptime as fastest_lap_time_formatted,
            fastestlapspeed::decimal(6,3) as fastest_lap_speed,
            statusid as status_id
        from source
    )

    select * from renamed
    ```

1. Последний! Создайте `stg_f1_status.sql` с этим путем к файлу: `models/staging/formula1/stg_f1_status.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','status') }}

    ),

    renamed as (
        select
            statusid as status_id,
            status
        from source
    )

    select * from renamed
    ```

    После завершения создания источника и всех моделей подготовки для каждой из 8 таблиц ваша папка подготовки должна выглядеть так:

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/1-staging-folder.png" title="Папка подготовки"/>

1. Сейчас хорошее время, чтобы удалить нашу папку с примерами, так как эти две модели являются лишними для нашего конвейера formula1, и `my_first_model` не проходит тест `not_null`, который мы не будем исследовать. dbt Cloud предупредит нас, что эта папка будет удалена навсегда, и мы согласны с этим, поэтому выберите **Delete**.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/2-delete-example.png" title="Удалить папку с примерами"/>

1. Теперь, когда модели подготовки созданы и сохранены, пришло время создать модели в нашей схеме разработки в Snowflake. Для этого мы введем в командной строке `dbt build`, чтобы запустить все модели в нашем проекте, включая 8 новых моделей подготовки и существующие модели примеров.

    Ваше выполнение должно завершиться успешно, и вы должны увидеть зеленые галочки рядом со всеми вашими моделями в результатах выполнения. Мы построили наши 8 моделей подготовки как представления и запустили 13 тестов источников, которые мы настроили в файле `f1_sources.yml` с не таким уж большим количеством кода, довольно круто!

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/3-successful-run-in-snowflake.png" title="Успешное выполнение dbt build в Snowflake"/>

    Давайте быстро взглянем на Snowflake, обновим объекты базы данных, откроем нашу схему разработки и подтвердим, что новые модели там. Если вы можете их увидеть, значит, все в порядке!

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/4-confirm-models.png" title="Подтвердите модели"/>

    Прежде чем перейти к следующему разделу, обязательно зафиксируйте ваши новые модели в вашей ветке Git. Нажмите **Commit and push** и дайте вашему коммиту сообщение, например, `profile, sources, and staging setup`, прежде чем продолжить.

## Преобразование SQL

Теперь, когда у нас есть все наши источники и модели подготовки, пришло время перейти к тому, где dbt сияет &mdash; преобразование!

Нам нужно:

- Создать некоторые промежуточные таблицы для объединения таблиц, которые не являются иерархическими
- Создать основные таблицы для загрузки в инструменты бизнес-аналитики (BI)
- Ответить на два вопроса о:
  - самых быстрых пит-стопах
  - тенденциях времени круга в данных Формулы 1, создавая агрегированные модели с использованием Python!

### Промежуточные модели

Нам нужно объединить множество справочных таблиц с нашей таблицей результатов, чтобы создать читаемую человеком таблицу данных. Что это значит? Например, мы не хотим иметь только числовой `status_id` в нашей таблице, мы хотим иметь возможность прочитать в строке данных, что водитель не смог завершить гонку из-за отказа двигателя (`status_id=5`).

К настоящему моменту мы довольно хорошо умеем создавать новые файлы в правильных каталогах, поэтому не будем подробно останавливаться на этом. Все промежуточные модели должны быть созданы в пути `models/intermediate`.

1. Создайте новый файл с именем `int_lap_times_years.sql`. В этой модели мы объединяем информацию о времени круга и гонках, чтобы мы могли смотреть на время круга за годы. В более ранние эпохи Формулы 1 время круга не записывалось (только окончательные результаты), поэтому мы отфильтровываем записи, где время круга равно null.

    ```sql
    with lap_times as (

        select * from {{ ref('stg_f1_lap_times') }}

    ),

    races as (

        select * from {{ ref('stg_f1_races') }}

    ),

    expanded_lap_times_by_year as (
        select
            lap_times.race_id,
            driver_id,
            race_year,
            lap,
            lap_time_milliseconds
        from lap_times
        left join races
            on lap_times.race_id = races.race_id
        where lap_time_milliseconds is not null
    )

    select * from expanded_lap_times_by_year
    ```

2. Создайте файл с именем `in_pit_stops.sql`. Пит-стопы имеют отношение многие-к-одному (M:1) с нашими гонками. Мы создаем функцию `total_pit_stops_per_race`, разделяя по `race_id` и `driver_id`, сохраняя при этом индивидуальные пит-стопы для скользящего среднего в нашем следующем разделе.

    ```sql
    with stg_f1__pit_stops as
    (
        select * from {{ ref('stg_f1_pit_stops') }}
    ),

    pit_stops_per_race as (
        select
            race_id,
            driver_id,
            stop_number,
            lap,
            lap_time_formatted,
            pit_stop_duration_seconds,
            pit_stop_milliseconds,
            max(stop_number) over (partition by race_id,driver_id) as total_pit_stops_per_race
        from stg_f1__pit_stops
    )

    select * from pit_stops_per_race
    ```

3. Создайте файл с именем `int_results.sql`. Здесь мы используем 4 наших таблицы &mdash; `races`, `drivers`, `constructors` и `status` &mdash; чтобы дать контекст нашей таблице `results`. Теперь мы можем рассчитать новую функцию `drivers_age_years`, приведя `date_of_birth` и `race_year` в одну таблицу. Мы также создаем столбец, чтобы указать, не завершил ли водитель гонку, на основе того, была ли их `position` равна null, называемого `dnf_flag`.

    ```sql
    with results as (

        select * from {{ ref('stg_f1_results') }}

    ),

    races as (

        select * from {{ ref('stg_f1_races') }}

    ),

    drivers as (

        select * from {{ ref('stg_f1_drivers') }}

    ),

    constructors as (

        select * from {{ ref('stg_f1_constructors') }}
    ),

    status as (

        select * from {{ ref('stg_f1_status') }}
    ),

    int_results as (
        select
            result_id,
            results.race_id,
            race_year,
            race_round,
            circuit_id,
            circuit_name,
            race_date,
            race_time,
            results.driver_id,
            results.driver_number,
            forename ||' '|| surname as driver,
            cast(datediff('year', date_of_birth, race_date) as int) as drivers_age_years,
            driver_nationality,
            results.constructor_id,
            constructor_name,
            constructor_nationality,
            grid,
            position,
            position_text,
            position_order,
            points,
            laps,
            results_time_formatted,
            results_milliseconds,
            fastest_lap,
            results_rank,
            fastest_lap_time_formatted,
            fastest_lap_speed,
            results.status_id,
            status,
            case when position is null then 1 else 0 end as dnf_flag
        from results
        left join races
            on results.race_id=races.race_id
        left join drivers
            on results.driver_id = drivers.driver_id
        left join constructors
            on results.constructor_id = constructors.constructor_id
        left join status
            on results.status_id = status.status_id
    )

    select * from int_results
    ```

1. Создайте *Markdown* файл `intermediate.md`, который мы подробно рассмотрим в разделах Тестирование и Документация руководства [Использование dbt Cloud для создания аналитических и ML-готовых конвейеров с SQL и Python в Snowflake](/guides/dbt-python-snowpark).

    ```markdown
    # цель этого .md — позволить многострочные длинные объяснения для наших промежуточных преобразований

    # ниже приведены описания 
    {% docs int_results %} В этом запросе мы хотим присоединить другую важную информацию о результатах гонок, чтобы иметь читаемую таблицу о результатах, гонках, водителях, конструкторах и статусе. 
    У нас будет 4 левых соединения с нашей таблицей результатов. {% enddocs %}

    {% docs int_pit_stops %} В одной гонке много пит-стопов, то есть отношение M:1. 
    Мы хотим агрегировать это, чтобы мы могли правильно присоединить информацию о пит-стопах без создания фан-аута.  {% enddocs %}

    {% docs int_lap_times_years %} Время круга выполняется на круг. Нам нужно присоединить их к году гонки, чтобы понять тенденции времени круга за годы. {% enddocs %}
    ```

1. Создайте *YAML* файл `intermediate.yml`, который мы подробно рассмотрим в разделах Тестирование и Документация руководства [Использование dbt Cloud для создания аналитических и ML-готовых конвейеров с SQL и Python в Snowflake](/guides/dbt-python-snowpark).

    ```yaml
    version: 2

    models:
     - name: int_results
       description: '{{ doc("int_results") }}'
     - name: int_pit_stops
       description: '{{ doc("int_pit_stops") }}'
     - name: int_lap_times_years
       description: '{{ doc("int_lap_times_years") }}'
    ```

    Это завершает промежуточные модели, которые нам нужно создать для наших основных моделей!

### Основные модели

1. Создайте файл `fct_results.sql`. Это то, что я люблю называть "мега таблицей" &mdash; действительно большая денормализованная таблица со всем нашим контекстом, добавленным на уровне строк для читаемости человеком. Важно, что у нас есть таблица `circuits`, которая связана через таблицу `races`. Когда мы присоединили `races` к `results` в `int_results.sql`, мы позволили нашим таблицам установить связь от `circuits` к `results` в `fct_results.sql`. Мы берем информацию о пит-стопах только на уровне результатов, чтобы наше соединение не вызвало [фан-аута](https://community.looker.com/technical-tips-tricks-1021/what-is-a-fanout-23327).

    ```sql
    with int_results as (

        select * from {{ ref('int_results') }}

    ),

    int_pit_stops as (
        select
            race_id,
            driver_id,
            max(total_pit_stops_per_race) as total_pit_stops_per_race
        from {{ ref('int_pit_stops') }}
        group by 1,2
    ),

    circuits as (

        select * from {{ ref('stg_f1_circuits') }}
    ),
    base_results as (
        select
            result_id,
            int_results.race_id,
            race_year,
            race_round,
            int_results.circuit_id,
            int_results.circuit_name,
            circuit_ref,
            location,
            country,
            latitude,
            longitude,
            altitude,
            total_pit_stops_per_race,
            race_date,
            race_time,
            int_results.driver_id,
            driver,
            driver_number,
            drivers_age_years,
            driver_nationality,
            constructor_id,
            constructor_name,
            constructor_nationality,
            grid,
            position,
            position_text,
            position_order,
            points,
            laps,
            results_time_formatted,
            results_milliseconds,
            fastest_lap,
            results_rank,
            fastest_lap_time_formatted,
            fastest_lap_speed,
            status_id,
            status,
            dnf_flag
        from int_results
        left join circuits
            on int_results.circuit_id=circuits.circuit_id
        left join int_pit_stops
            on int_results.driver_id=int_pit_stops.driver_id and int_results.race_id=int_pit_stops.race_id
    )

    select * from base_results
    ```

1. Создайте файл `pit_stops_joined.sql`. Наши результаты и пит-стопы находятся на разных уровнях размерности (также называемых зернистостью). Проще говоря, у нас есть несколько пит-стопов на один результат. Поскольку мы заинтересованы в понимании информации на уровне пит-стопов с информацией о годе гонки и конструкторе, мы создадим новую таблицу `pit_stops_joined.sql`, где каждая строка будет на пит-стоп. Наша новая таблица подготавливает нашу агрегацию в Python.

    ```sql
    with base_results as (

        select * from {{ ref('fct_results') }}
    
    ), 

    pit_stops as (

        select * from {{ ref('int_pit_stops') }}
    
    ),

    pit_stops_joined as (

        select 
            base_results.race_id,
            race_year,
            base_results.driver_id,
            constructor_id,
            constructor_name,
            stop_number,
            lap, 
            lap_time_formatted,
            pit_stop_duration_seconds, 
            pit_stop_milliseconds
        from base_results
        left join pit_stops
            on base_results.race_id=pit_stops.race_id and base_results.driver_id=pit_stops.driver_id
    )
    select * from pit_stops_joined
    ```

1. Введите в командной строке и выполните `dbt build`, чтобы построить весь наш конвейер до этого момента. Не беспокойтесь о "перезаписи" ваших предыдущих моделей – рабочие процессы dbt разработаны так, чтобы быть <Term id="idempotent">идемпотентными</Term>, поэтому мы можем запускать их снова и ожидать тех же результатов.

1. Давайте поговорим о нашей родословной до сих пор. Она выглядит хорошо 😎. Мы показали, как SQL можно использовать для изменения типа данных, имен столбцов и обработки иерархических соединений очень хорошо; все это время строя нашу автоматизированную родословную!

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/9-sql-transformations/1-dag.png" title="DAG"/>

1. Время **Commit and push** наших изменений и дайте вашему коммиту сообщение, например, `intermediate and fact models`, прежде чем продолжить.

## Запуск моделей dbt Python

До сих пор SQL управлял проектом (автомобильная игра слов намерена) для очистки данных и иерархических соединений. Теперь пришло время Python взять на себя управление (автомобильная игра слов все еще намерена) на оставшуюся часть нашей лаборатории! Для получения дополнительной информации о запуске Python моделей на dbt ознакомьтесь с нашими [документами](/docs/build/python-models). Чтобы узнать больше о том, как работает dbt python под капотом, ознакомьтесь с [Snowpark for Python](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html), который делает возможным запуск dbt Python моделей.

Существует довольно много различий между SQL и Python с точки зрения синтаксиса dbt и DDL, поэтому мы будем разбивать наш код и выполнение моделей дальше для наших python моделей.

### Анализ пит-стопов

Сначала мы хотим узнать: какой конструктор имел самые быстрые пит-стопы в 2021 году? (конструктор — это команда Формулы 1, которая строит или "конструирует" автомобиль).

1. Создайте новый файл с именем `fastest_pit_stops_by_constructor.py` в нашей папке `aggregates` (это первый раз, когда мы используем расширение `.py`).
2. Скопируйте следующий код в файл:

    ```python
    import numpy as np
    import pandas as pd

    def model(dbt, session):
        # dbt configuration
        dbt.config(packages=["pandas","numpy"])

        # get upstream data
        pit_stops_joined = dbt.ref("pit_stops_joined").to_pandas()

        # provide year so we do not hardcode dates 
        year=2021

        # describe the data
        pit_stops_joined["PIT_STOP_SECONDS"] = pit_stops_joined["PIT_STOP_MILLISECONDS"]/1000
        fastest_pit_stops = pit_stops_joined[(pit_stops_joined["RACE_YEAR"]==year)].groupby(by="CONSTRUCTOR_NAME")["PIT_STOP_SECONDS"].describe().sort_values(by='mean')
        fastest_pit_stops.reset_index(inplace=True)
        fastest_pit_stops.columns = fastest_pit_stops.columns.str.upper()
        
        return fastest_pit_stops.round(2)
    ```

3. Давайте разберем, что делает этот код шаг за шагом:
    - Сначала мы импортируем библиотеки Python, которые мы используем. *Библиотека* — это повторно используемый фрагмент кода, написанный кем-то другим, который вы можете захотеть включить в свои программы/проекты. Мы используем `numpy` и `pandas` в этой Python модели. Это похоже на *пакет* dbt, но наши библиотеки Python *не* сохраняются по всему проекту.
    - Определяем функцию с именем `model` с параметрами `dbt` и `session`. Параметр `dbt` — это класс, скомпилированный dbt, который позволяет вам запускать ваш Python код в контексте вашего проекта dbt и DAG. Параметр `session` — это класс, представляющий соединение вашего Snowflake с бэкэндом Python. Функция `model` *должна возвращать один DataFrame*. Вы можете видеть, что все преобразования данных происходят в теле функции `model`, к которой привязано выражение `return`.
    - Затем, в контексте нашей библиотеки моделей dbt, мы передаем конфигурацию, какие пакеты нам нужны, используя `dbt.config(packages=["pandas","numpy"])`.
    - Используйте функцию `.ref()`, чтобы получить фрейм данных `pit_stops_joined`, который мы создали на предыдущем шаге, используя SQL. Мы приводим его к pandas dataframe (по умолчанию это Snowpark Dataframe).
    - Создайте переменную с именем `year`, чтобы мы не передавали жестко закодированное значение.
    - Создайте новый столбец с именем `PIT_STOP_SECONDS`, разделив значение `PIT_STOP_MILLISECONDS` на 1000.
    - Создайте наш окончательный фрейм данных `fastest_pit_stops`, который содержит записи, где год равен нашей переменной года (в данном случае 2021), затем сгруппируйте фрейм данных по `CONSTRUCTOR_NAME` и используйте методы `describe()` и `sort_values()` в порядке убывания. Это сделает нашу первую строку в новом агрегированном фрейме данных командой с самыми быстрыми пит-стопами за весь год соревнований.
    - Наконец, он сбрасывает индекс фрейма данных `fastest_pit_stops`. Метод `reset_index()` позволяет сбросить индекс обратно к значениям по умолчанию 0, 1, 2 и т. д.; чтобы избежать этого, используйте параметр drop. Подумайте об этом как о сохранении ваших данных "плоскими и квадратными", а не "многоуровневыми". Если вы новичок в Python, сейчас может быть хорошее время [узнать об индексах за 5 минут](https://towardsdatascience.com/the-basics-of-indexing-and-slicing-python-lists-2d12c90a94cf), так как это основа того, как Python извлекает, нарезает и обрабатывает данные. Аргумент `inplace` означает, что мы перезаписываем существующий фрейм данных навсегда. Не бойтесь! Это то, что мы хотим сделать, чтобы избежать работы с многоиндексными фреймами данных!
    - Преобразуйте наши имена столбцов Python в верхний регистр, используя `.upper()`, чтобы Snowflake их распознал.
    - Наконец, мы возвращаем наш фрейм данных с двумя десятичными знаками для всех столбцов, используя метод `round()`.
4. Если взглянуть на это немного шире, что мы делаем по-другому здесь в Python по сравнению с нашим типичным SQL кодом:
    - Цепочка методов — это техника, при которой несколько методов вызываются на объекте в одном выражении, при этом каждый вызов метода изменяет результат предыдущего. Методы вызываются в цепочке, при этом вывод одного метода используется в качестве ввода для следующего. Эта техника используется для упрощения кода и повышения его читаемости за счет устранения необходимости в промежуточных переменных для хранения промежуточных результатов.
        - Способ, которым вы видите цепочку методов в Python, — это синтаксис `.().()`. Например, `.describe().sort_values(by='mean')`, где метод `.describe()` связан с `.sort_values()`.
    - Метод `.describe()` используется для генерации различных статистических данных о наборе данных. Он используется на pandas dataframe. Он дает быстрый и простой способ получить статистику вашего набора данных без написания нескольких строк кода.
    - Метод `.sort_values()` используется для сортировки pandas dataframe или серии по одному или нескольким столбцам. Метод сортирует данные по указанным столбцам в порядке возрастания или убывания. Это эквивалент `order by` в SQL.

    Мы не будем так подробно разбирать наши последующие скрипты, но продолжим объяснять на высоком уровне, что делают новые библиотеки, функции и методы.

5. Постройте модель, используя интерфейс, который **выполнит**:

    ```bash
    dbt run --select fastest_pit_stops_by_constructor
    ```

    в командной строке.

    Давайте посмотрим на некоторые детали нашей первой Python модели, чтобы увидеть, что наша модель выполнила. Существует два основных различия, которые мы можем увидеть при запуске Python модели по сравнению с SQL моделью:

    - Наша Python модель была выполнена как хранимая процедура. Snowflake нужно знать, что этот код предназначен для выполнения в среде выполнения Python, а не для интерпретации в среде выполнения SQL. Мы делаем это, создавая хранимую процедуру Python, вызываемую SQL командой.
    - Библиотека `snowflake-snowpark-python` была выбрана для выполнения нашего Python кода. Хотя это не было явно указано, это выбирается объектом класса dbt, потому что нам нужен наш пакет Snowpark для выполнения Python!

    Python модели выполняются немного дольше, чем SQL модели, однако мы всегда можем ускорить это, используя [Snowpark-оптимизированные склады](https://docs.snowflake.com/en/user-guide/warehouses-snowpark-optimized.html), если захотим. Наши данные достаточно малы, поэтому мы не будем беспокоиться о создании отдельного склада для Python по сравнению с SQL файлами сегодня.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/10-python-transformations/1-python-model-details-output.png" title="Мы можем видеть, что наша python модель выполняется как хранимая процедура в нашей личной схеме разработки"/>

    Остальная часть нашего **Details** вывода дает нам информацию о том, как dbt и Snowpark для Python работают вместе, чтобы определить объекты класса и применить определенный набор методов для выполнения наших моделей.

    Итак, какой конструктор имел самые быстрые пит-стопы в 2021 году? Давайте посмотрим на наши данные, чтобы узнать!

6. Мы не можем предварительно просмотреть Python модели напрямую, поэтому давайте создадим новый файл, используя кнопку **+** или сочетание клавиш Control-n, чтобы создать новый черновик.
7. Сошлитесь на нашу Python модель:

    ```sql
    select * from {{ ref('fastest_pit_stops_by_constructor') }}
    ```

    и предварительно просмотрите вывод:
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/10-python-transformations/2-fastest-pit-stops-preview.png" title="Смотрим на нашу новую python модель данных, мы видим, что Red Bull имел самые быстрые пит-стопы!"/>

    Red Bull не только имел самые быстрые средние пит-стопы почти на 40 секунд, но и имел наименьшее стандартное отклонение, что означает, что они являются как самыми быстрыми, так и самыми последовательными командами в пит-стопах. Используя метод `.describe()`, мы смогли избежать многословного SQL, требующего создания строки кода на столбец и повторного использования функции `PERCENTILE_COUNT()`.

    Теперь мы хотим найти среднее время круга и скользящее среднее за годы (в целом оно увеличивается или уменьшается)?

8. Создайте новый файл с именем `lap_times_moving_avg.py` в нашей папке `aggregates`.
9. Скопируйте следующий код в файл:

    ```python
    import pandas as pd

    def model(dbt, session):
        # dbt configuration
        dbt.config(packages=["pandas"])

        # get upstream data
        lap_times = dbt.ref("int_lap_times_years").to_pandas()

        # describe the data
        lap_times["LAP_TIME_SECONDS"] = lap_times["LAP_TIME_MILLISECONDS"]/1000
        lap_time_trends = lap_times.groupby(by="RACE_YEAR")["LAP_TIME_SECONDS"].mean().to_frame()
        lap_time_trends.reset_index(inplace=True)
        lap_time_trends["LAP_MOVING_AVG_5_YEARS"] = lap_time_trends["LAP_TIME_SECONDS"].rolling(5).mean()
        lap_time_trends.columns = lap_time_trends.columns.str.upper()
        
        return lap_time_trends.round(1)
    ```

10. Разбирая наш код немного:
    - Мы используем только библиотеку `pandas` для этой модели и приводим ее к pandas dataframe `.to_pandas()`.
    - Создайте новый столбец с именем `LAP_TIMES_SECONDS`, разделив значение `LAP_TIME_MILLISECONDS` на 1000.
    - Создайте окончательный фрейм данных. Получите время круга за год. Рассчитайте среднюю серию и преобразуйте в фрейм данных.
    - Сбросьте индекс.
    - Рассчитайте скользящее среднее за 5 лет.
    - Округлите наши числовые столбцы до одного десятичного знака.
11. Теперь запустите эту модель, используя интерфейс **Run model** или

    ```bash
    dbt run --select lap_times_moving_avg
    ```

 в командной строке.

12. Еще раз предварительно просматривая вывод наших данных, используя те же шаги для нашей модели `fastest_pit_stops_by_constructor`.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/10-python-transformations/3-lap-times-trends-preview.png" title="Просмотр наших тенденций времени круга и 5-летних скользящих тенденций"/>

    Мы видим, что, похоже, время круга становится все быстрее со временем. Затем в 2010 году мы видим увеличение! Используя внешний контекст предметной области, мы знаем, что в 2010 и 2011 годах в Формуле 1 были введены значительные изменения правил, что привело к более медленному времени круга.

13. Сейчас хорошее время для контрольной точки и фиксации нашей работы в Git. Нажмите **Commit and push** и дайте вашему коммиту сообщение, например, `aggregate python models`, прежде чем продолжить.

### Модель dbt, функции .source(), .ref() и .config()

Давайте сделаем шаг назад перед началом машинного обучения, чтобы как пересмотреть, так и углубиться в методы, которые делают возможным запуск dbt python моделей. Если вы хотите узнать больше за пределами объяснений этой лаборатории, прочитайте документацию [здесь](/docs/build/python-models?version=1.3).

- dbt model(dbt, session). Для начала, каждая Python модель находится в .py файле в вашей папке models/. Она определяет функцию с именем `model()`, которая принимает два параметра:
  - dbt &mdash; Класс, скомпилированный dbt Core, уникальный для каждой модели, позволяет вам запускать ваш Python код в контексте вашего dbt проекта и DAG.
  - session &mdash; Класс, представляющий соединение вашей платформы данных с Python бэкендом. Сессия необходима для чтения таблиц как DataFrame и записи DataFrame обратно в таблицы. В PySpark, по соглашению, SparkSession называется spark и доступен глобально. Для согласованности между платформами мы всегда передаем его в функцию модели как явный аргумент, называемый session.
- Функция `model()` должна возвращать один DataFrame. На Snowpark (Snowflake) это может быть Snowpark или pandas DataFrame.
- Функции `.source()` и `.ref()`. Python модели полностью участвуют в направленном ациклическом графе (DAG) преобразований dbt. Если вы хотите читать напрямую из исходной таблицы, используйте `dbt.source()`. Мы видели это в нашей предыдущей секции, используя SQL с функцией source. Эти функции имеют одинаковое выполнение, но с разным синтаксисом. Используйте метод `dbt.ref()` в Python модели, чтобы читать данные из других моделей (SQL или Python). Эти методы возвращают DataFrame, указывающие на исходный источник, модель, seed или snapshot.
- `.config()`. Как и SQL модели, есть три способа настройки Python моделей:
  - В отдельном `.yml` файле, в директории `models/`
  - Внутри `.py` файла модели, используя метод `dbt.config()`
  - Вызов метода `dbt.config()` установит конфигурации для вашей модели в вашем `.py` файле, аналогично макросу `{{ config() }}` в `.sql` файлах моделей:

    ```python
        def model(dbt, session):

            # установка конфигурации
            dbt.config(materialized="table")
    ```
  - Существует ограничение на то, насколько сложной может быть конфигурация с помощью метода `dbt.config()`. Он принимает только буквальные значения (строки, логические и числовые типы). Передача другой функции или более сложной структуры данных невозможна. Причина в том, что dbt статически анализирует аргументы для `.config()` при разборе вашей модели без выполнения вашего Python кода. Если вам нужно установить более сложную конфигурацию, мы рекомендуем определить ее, используя свойство config в [YAML файле](/reference/resource-properties/config). Узнайте больше о конфигурациях [здесь](/reference/model-configs).

## Подготовка к машинному обучению: очистка, кодирование и разделение

Теперь, когда мы получили представления и бизнес-аналитику о Формуле 1 на описательном уровне, мы хотим расширить наши возможности в области прогнозирования. Мы собираемся рассмотреть сценарий, в котором мы цензурируем данные. Это означает, что мы будем притворяться, что обучаем модель, используя более ранние данные, и применяем ее к будущим данным. На практике это означает, что мы возьмем данные с 2010 по 2019 год для обучения нашей модели, а затем предскажем данные 2020 года.

В этом разделе мы будем готовить наши данные для прогнозирования итоговой позиции гонщика.

На высоком уровне мы будем:

- Создавать новые прогнозные признаки и фильтровать наш набор данных для активных гонщиков
- Кодировать наши данные (алгоритмы любят числа) и упрощать нашу целевую переменную, называемую `position`
- Разделять наш набор данных на обучение, тестирование и валидацию

### Подготовка данных для ML

1. Чтобы наш проект был организован, нам нужно создать две новые подпапки в нашем каталоге `ml`. В папке `ml` создайте подпапки `prep` и `train_predict`.
2. Создайте новый файл в `ml/prep`, назовите его `ml_data_prep.py`. Скопируйте следующий код в файл и **сохраните**.

    ```python
    import pandas as pd

    def model(dbt, session):
        # конфигурация dbt
        dbt.config(packages=["pandas"])

        # получение данных из вышестоящей модели
        fct_results = dbt.ref("fct_results").to_pandas()

        # указание лет, чтобы не жестко кодировать даты в команде фильтрации
        start_year=2010
        end_year=2020

        # описание данных за целое десятилетие
        data =  fct_results.loc[fct_results['RACE_YEAR'].between(start_year, end_year)]

        # преобразование строки в целое число
        data['POSITION'] = data['POSITION'].astype(float)

        # мы не можем иметь null, если хотим использовать общее количество пит-стопов
        data['TOTAL_PIT_STOPS_PER_RACE'] = data['TOTAL_PIT_STOPS_PER_RACE'].fillna(0)

        # некоторые конструкторы изменили свое имя за годы, поэтому заменяем старые имена на текущие
        mapping = {'Force India': 'Racing Point', 'Sauber': 'Alfa Romeo', 'Lotus F1': 'Renault', 'Toro Rosso': 'AlphaTauri'}
        data['CONSTRUCTOR_NAME'].replace(mapping, inplace=True)

        # создание метрик уверенности для гонщиков и конструкторов
        dnf_by_driver = data.groupby('DRIVER').sum(numeric_only=True)['DNF_FLAG']
        driver_race_entered = data.groupby('DRIVER').count()['DNF_FLAG']
        driver_dnf_ratio = (dnf_by_driver/driver_race_entered)
        driver_confidence = 1-driver_dnf_ratio
        driver_confidence_dict = dict(zip(driver_confidence.index,driver_confidence))

        dnf_by_constructor = data.groupby('CONSTRUCTOR_NAME').sum(numeric_only=True)['DNF_FLAG']
        constructor_race_entered = data.groupby('CONSTRUCTOR_NAME').count()['DNF_FLAG']
        constructor_dnf_ratio = (dnf_by_constructor/constructor_race_entered)
        constructor_relaiblity = 1-constructor_dnf_ratio
        constructor_relaiblity_dict = dict(zip(constructor_relaiblity.index,constructor_relaiblity))

        data['DRIVER_CONFIDENCE'] = data['DRIVER'].apply(lambda x:driver_confidence_dict[x])
        data['CONSTRUCTOR_RELAIBLITY'] = data['CONSTRUCTOR_NAME'].apply(lambda x:constructor_relaiblity_dict[x])

        # удаление ушедших на пенсию гонщиков и конструкторов
        active_constructors = ['Renault', 'Williams', 'McLaren', 'Ferrari', 'Mercedes',
                            'AlphaTauri', 'Racing Point', 'Alfa Romeo', 'Red Bull',
                            'Haas F1 Team']
        active_drivers = ['Daniel Ricciardo', 'Kevin Magnussen', 'Carlos Sainz',
                        'Valtteri Bottas', 'Lance Stroll', 'George Russell',
                        'Lando Norris', 'Sebastian Vettel', 'Kimi Räikkönen',
                        'Charles Leclerc', 'Lewis Hamilton', 'Daniil Kvyat',
                        'Max Verstappen', 'Pierre Gasly', 'Alexander Albon',
                        'Sergio Pérez', 'Esteban Ocon', 'Antonio Giovinazzi',
                        'Romain Grosjean','Nicholas Latifi']

        # создание флагов для активных гонщиков и конструкторов, чтобы мы могли фильтровать их в дальнейшем
        data['ACTIVE_DRIVER'] = data['DRIVER'].apply(lambda x: int(x in active_drivers))
        data['ACTIVE_CONSTRUCTOR'] = data['CONSTRUCTOR_NAME'].apply(lambda x: int(x in active_constructors))
        
        return data
    ```

3. Как обычно, давайте разберем, что мы делаем в этой Python модели:
    - Сначала мы ссылаемся на нашу вышестоящую таблицу `fct_results` и преобразуем ее в pandas dataframe.
    - Фильтруем по годам 2010-2020, так как нам нужно очистить все наши данные, которые мы используем для прогнозирования (как для обучения, так и для тестирования).
    - Заполняем пустые данные для `total_pit_stops` и создаем сопоставление активных конструкторов и гонщиков, чтобы избежать ошибочных прогнозов.
        - ⚠️ Вы можете задаться вопросом, почему мы не сделали это в вышестоящей таблице `fct_results`! Причина в том, что мы хотим, чтобы наша очистка для машинного обучения отражала 2020 год для наших прогнозов и давала нам актуальное название команды. Однако для целей бизнес-аналитики мы можем сохранить исторические данные на тот момент времени. Вместо того чтобы считать одну таблицу "единственным источником правды", мы создаем разные наборы данных для разных целей: один для исторических описаний и отчетности, а другой для актуальных прогнозов.
    - Создаем новые признаки уверенности для гонщиков и конструкторов.
    - Генерируем флаги для конструкторов и гонщиков, которые были активны в 2020 году.
4. Выполните следующее в командной строке:

    ```bash
    dbt run --select ml_data_prep
    ```

5. Есть еще аспекты, которые мы могли бы рассмотреть для этого проекта, такие как нормализация уверенности гонщика по количеству заездов. Включение этого помогло бы учесть историю гонщика и рассмотреть, является ли он новым или давно выступающим гонщиком. Мы собираемся пока оставить это простым, но это некоторые из способов, которыми мы можем расширить и улучшить наши проекты машинного обучения dbt. Разбирая нашу модель подготовки к машинному обучению:
    - Лямбда-функции &mdash; Мы используем некоторые лямбда-функции для преобразования наших данных без необходимости создания полноценной функции с использованием нотации `def`. Так что же такое лямбда-функции?
        - В Python лямбда-функция это небольшая, анонимная функция, определяемая с помощью ключевого слова "lambda". Лямбда-функции используются для выполнения быстрой операции, такой как математическое вычисление или преобразование списка элементов. Они часто используются в сочетании с функциями высшего порядка, такими как `apply`, `map`, `filter` и `reduce`.
    - Метод `.apply()` &mdash; Мы использовали `.apply()`, чтобы передать наши функции в наши лямбда-выражения к столбцам и выполнить это несколько раз в нашем коде. Давайте объясним apply немного подробнее:
        - Функция `.apply()` в библиотеке pandas используется для применения функции к указанной оси DataFrame или Series. В нашем случае функция, которую мы использовали, была нашей лямбда-функцией!
        - Функция `.apply()` принимает два аргумента: первый это функция, которую нужно применить, и второй это ось, вдоль которой функция должна быть применена. Ось может быть указана как 0 для строк или 1 для столбцов. Мы используем значение по умолчанию 0, поэтому не пишем его явно в коде. Это означает, что функция будет применена к каждой *строке* DataFrame или Series.
6. Давайте посмотрим на предварительный просмотр нашего очищенного dataframe после запуска нашей модели `ml_data_prep`:
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/11-machine-learning-prep/1-completed-ml-data-prep.png" title="Как выглядит наш очищенный dataframe, готовый для машинного обучения"/>

### Кодирование ковариат

В следующей части мы будем выполнять кодирование ковариат. Разбирая это выражение, *ковариата* это переменная, которая имеет отношение к результату исследования или эксперимента, а *кодирование* относится к процессу преобразования данных (таких как текст или категориальные переменные) в числовой формат, который может быть использован в качестве входных данных для модели. Это необходимо, потому что большинство алгоритмов машинного обучения могут работать только с числовыми данными. Алгоритмы не говорят на языках, не видят изображения и т.д., поэтому мы кодируем наши данные в числа, чтобы алгоритмы могли выполнять задачи, используя вычисления, которые они иначе не могли бы.

🧠 Мы будем думать об этом как: "алгоритмы любят числа".

1. Создайте новый файл в `ml/prep`, назовите его `covariate_encoding`, скопируйте код ниже и сохраните.

    ```python
    import pandas as pd
    import numpy as np
    from sklearn.preprocessing import StandardScaler,LabelEncoder,OneHotEncoder
    from sklearn.linear_model import LogisticRegression

    def model(dbt, session):
        # конфигурация dbt
        dbt.config(packages=["pandas","numpy","scikit-learn"])

        # получение данных из вышестоящей модели
        data = dbt.ref("ml_data_prep").to_pandas()

        # перечисление ковариат, которые мы хотим использовать в дополнение к целевой переменной, которую мы моделируем - position
        covariates = data[['RACE_YEAR','CIRCUIT_NAME','GRID','CONSTRUCTOR_NAME','DRIVER','DRIVERS_AGE_YEARS','DRIVER_CONFIDENCE','CONSTRUCTOR_RELAIBLITY','TOTAL_PIT_STOPS_PER_RACE','ACTIVE_DRIVER','ACTIVE_CONSTRUCTOR', 'POSITION']]
    
        # фильтрация ковариат по активным гонщикам и конструкторам
        # используем fil_cov как сокращение для "filtered_covariates"
        fil_cov = covariates[(covariates['ACTIVE_DRIVER']==1)&(covariates['ACTIVE_CONSTRUCTOR']==1)]

        # Кодирование категориальных переменных с использованием LabelEncoder
        # TODO: мы обновим это до ohe в будущем для неординальных переменных! 
        le = LabelEncoder()
        fil_cov['CIRCUIT_NAME'] = le.fit_transform(fil_cov['CIRCUIT_NAME'])
        fil_cov['CONSTRUCTOR_NAME'] = le.fit_transform(fil_cov['CONSTRUCTOR_NAME'])
        fil_cov['DRIVER'] = le.fit_transform(fil_cov['DRIVER'])
        fil_cov['TOTAL_PIT_STOPS_PER_RACE'] = le.fit_transform(fil_cov['TOTAL_PIT_STOPS_PER_RACE'])

        # Упрощение целевой переменной "position" для представления 3 значимых категорий в Формуле 1
        # 1. Позиция на подиуме 2. Очки для команды 3. Ничего - ни подиума, ни очков!
        def position_index(x):
            if x<4:
                return 1
            if x>10:
                return 3
            else :
                return 2

        # мы удаляем столбцы, по которым фильтровали, в дополнение к нашей обучающей переменной
        encoded_data = fil_cov.drop(['ACTIVE_DRIVER','ACTIVE_CONSTRUCTOR'],axis=1))
        encoded_data['POSITION_LABEL']= encoded_data['POSITION'].apply(lambda x: position_index(x))
        encoded_data_grouped_target = encoded_data.drop(['POSITION'],axis=1))

        return encoded_data_grouped_target
    ```

2. Выполните следующее в командной строке:

    ```bash
    dbt run --select covariate_encoding
    ```

3. В этом коде мы используем множество функций из библиотек! Это действительно круто, потому что мы можем использовать код, разработанный другими людьми, и включать его в наш проект просто с помощью функции `import`. [Scikit-learn](https://scikit-learn.org/stable/), сокращенно "sklearn", это чрезвычайно популярная библиотека для науки о данных. Sklearn содержит широкий спектр методов машинного обучения, включая алгоритмы обучения с учителем и без учителя, масштабирование признаков и импутацию, а также инструменты для оценки и выбора моделей. Мы будем использовать Sklearn как для подготовки наших ковариат, так и для создания моделей (наш следующий раздел).
4. Наш набор данных довольно мал, поэтому мы можем использовать pandas и `sklearn`. Если у вас есть более крупные данные для вашего собственного проекта, рассмотрите `dask` или `category_encoders`.
5. Разбирая это немного подробнее:
    - Мы выбираем подмножество переменных, которые будут использоваться в качестве предикторов для позиции гонщика.
    - Фильтруем набор данных, чтобы включить только строки, используя флаги активных гонщиков и конструкторов, которые мы создали на предыдущем шаге.
    - Следующий шаг - использование `LabelEncoder` из scikit-learn для преобразования категориальных переменных `CIRCUIT_NAME`, `CONSTRUCTOR_NAME`, `DRIVER` и `TOTAL_PIT_STOPS_PER_RACE` в числовые значения.
    - Создаем новую переменную под названием `POSITION_LABEL`, которая является производной от нашей переменной position.
        - 💭 Почему мы изменяем нашу переменную position? В Формуле 1 всего 20 позиций, и мы группируем их вместе, чтобы упростить классификацию и улучшить производительность. Мы также хотим показать, что вы можете создать новую функцию в вашей dbt модели!
        - Наша новая переменная `position_label` имеет значение:
            - В Формуле 1, если вы находитесь:
                - В топ-3, вы получаете позицию на "подиуме"
                - В топ-10, вы получаете очки, которые добавляются к вашему общему сезону
                - Ниже топ-10, вы не получаете очков!
        - Мы сопоставляем нашу исходную переменную position с `position_label` с соответствующими местами выше на 1, 2 и 3 соответственно.
    - Удаляем флаги активных гонщиков и конструкторов, так как они были критериями фильтрации, и дополнительно удаляем нашу исходную переменную position.

### Разделение на обучающие и тестовые наборы данных

Теперь, когда мы очистили и закодировали наши данные, мы собираемся дополнительно разделить их по времени. На этом этапе мы создадим dataframes для использования в обучении и прогнозировании. Мы создадим два dataframes: 1) используя данные с 2010 по 2019 год для обучения, и 2) данные 2020 года для новых прогнозных выводов. Мы создадим переменные под названием `start_year` и `end_year`, чтобы мы не фильтровали по жестко заданным значениям (и могли бы легче их заменить в будущем, если захотим переобучить нашу модель на других временных рамках).

1. Создайте файл под названием `train_test_dataset.py`, скопируйте и сохраните следующий код:

    ```python
    import pandas as pd

    def model(dbt, session):

        # конфигурация dbt
        dbt.config(packages=["pandas"], tags="train")

        # получение данных из вышестоящей модели
        encoding = dbt.ref("covariate_encoding").to_pandas()

        # указание лет, чтобы не жестко кодировать даты в команде фильтрации
        start_year=2010
        end_year=2019

        # описание данных за целое десятилетие
        train_test_dataset =  encoding.loc[encoding['RACE_YEAR'].between(start_year, end_year)]

        return train_test_dataset
    ```

2. Создайте файл под названием `hold_out_dataset_for_prediction.py`, скопируйте и сохраните следующий код ниже. Теперь у нас будет набор данных только за 2020 год, который мы будем держать как отложенный набор, который мы будем использовать аналогично случаю развертывания.

    ```python
    import pandas as pd

    def model(dbt, session):
        # конфигурация dbt
        dbt.config(packages=["pandas"], tags="predict")

        # получение данных из вышестоящей модели
        encoding = dbt.ref("covariate_encoding").to_pandas()
        
        # переменная для года вместо жесткого кодирования
        year=2020

        # фильтрация данных на основе указанного года
        hold_out_dataset =  encoding.loc[encoding['RACE_YEAR'] == year]
        
        return hold_out_dataset
    ```

3. Выполните следующее в командной строке:

    ```bash
    dbt run --select train_test_dataset hold_out_dataset_for_prediction
    ```

    Чтобы запустить наши модели временного разделения данных, мы можем использовать этот синтаксис в командной строке, чтобы запустить их обе сразу. Убедитесь, что вы используете *пробел* [синтаксис](/reference/node-selection/syntax) между именами моделей, чтобы указать, что вы хотите запустить обе!
4. **Закоммитьте и отправьте** наши изменения, чтобы продолжать сохранять нашу работу по мере продвижения, используя `ml data prep and splits` перед тем, как двигаться дальше.

👏 Теперь, когда мы закончили нашу подготовку к машинному обучению, мы можем перейти к самой интересной части &mdash; обучению и прогнозированию!


## Обучение модели для прогнозирования в машинном обучении

Мы готовы начать обучение модели для прогнозирования позиции гонщика. Сейчас хорошее время, чтобы сделать паузу и сказать, что обычно в проектах ML вы попробуете несколько алгоритмов во время разработки и используете метод оценки, такой как кросс-валидация, чтобы определить, какой алгоритм использовать. Вы определенно можете сделать это в вашем проекте dbt, но для содержания этой лаборатории мы решили использовать логистическую регрессию для прогнозирования позиции (мы на самом деле попробовали некоторые другие алгоритмы, используя кросс-валидацию за пределами этой лаборатории, такие как k-ближайшие соседи и классификатор опорных векторов, но они не показали себя так хорошо, как логистическая регрессия и дерево решений, которое переобучилось).

Есть 3 области, которые нужно разобрать, так как мы работаем на пересечении всех в одном файле модели:

1. Машинное обучение
2. Snowflake и Snowpark
3. dbt Python модели

Если вы не видели такой код раньше или не использовали файлы joblib для сохранения моделей машинного обучения, мы рассмотрим их на высоком уровне, и вы можете изучить ссылки для более технического углубления по пути! Поскольку Snowflake и dbt абстрагировали множество деталей о сериализации и хранении нашего объекта модели для повторного вызова, мы не будем вдаваться в слишком много деталей здесь. Здесь происходит *многое*, так что берите это в своем темпе!

### Обучение и сохранение модели машинного обучения

1. Организация проекта остается ключевой, поэтому давайте создадим новую подпапку под названием `train_predict` в папке `ml`.
2. Теперь создайте новый файл под названием `train_test_position.py` и скопируйте и сохраните следующий код:

    ```python
    import snowflake.snowpark.functions as F
    from sklearn.model_selection import train_test_split
    import pandas as pd
    from sklearn.metrics import confusion_matrix, balanced_accuracy_score
    import io
    from sklearn.linear_model import LogisticRegression
    from joblib import dump, load
    import joblib
    import logging
    import sys
    from joblib import dump, load

    logger = logging.getLogger("mylog")

    def save_file(session, model, path, dest_filename):
        input_stream = io.BytesIO()
        joblib.dump(model, input_stream)
        session._conn.upload_stream(input_stream, path, dest_filename)
        return "успешно создан файл: " + path

    def model(dbt, session):
        dbt.config(
            packages = ['numpy','scikit-learn','pandas','numpy','joblib','cachetools'],
            materialized = "table",
            tags = "train"
        )
        # Создание стейджа в Snowflake для сохранения нашего файла модели
        session.sql('create or replace stage MODELSTAGE').collect()
    
        #session._use_scoped_temp_objects = False
        version = "1.0"
        logger.info('Версия обучения модели: ' + version)

        # чтение нашего обучающего и тестового набора данных из вышестоящей модели
        test_train_df = dbt.ref("train_test_dataset")

        # приведение snowpark df к pandas df
        test_train_pd_df = test_train_df.to_pandas()
        target_col = "POSITION_LABEL"

        # разделение ковариатных предикторов, x, от нашей целевой колонки position_label, y.
        split_X = test_train_pd_df.drop([target_col], axis=1)
        split_y = test_train_pd_df[target_col]

        # Разделение нашего обучающего и тестового набора данных на пропорции
        X_train, X_test, y_train, y_test  = train_test_split(split_X, split_y, train_size=0.7, random_state=42)
        train = [X_train, y_train]
        test = [X_test, y_test]
        # теперь мы обучаем только одну модель для развертывания
        # мы сосредоточены на рабочих процессах, а не на алгоритмах для этой лаборатории!
        model = LogisticRegression()
    
        # подгонка предварительной обработки и модели вместе 
        model.fit(X_train, y_train)   
        y_pred = model.predict_proba(X_test)[:,1]
        predictions = [round(value) for value in y_pred]
        balanced_accuracy =  balanced_accuracy_score(y_test, predictions)

        # Сохранение модели на стейдже
        save_file(session, model, "@MODELSTAGE/driver_position_"+version, "driver_position_"+version+".joblib" )
        logger.info('Артефакт модели:' + "@MODELSTAGE/driver_position_"+version+".joblib")
    
        # Преобразование наших pandas обучающих и тестовых dataframes обратно в snowpark dataframes
        snowpark_train_df = session.write_pandas(pd.concat(train, axis=1, join='inner'), "train_table", auto_create_table=True, create_temp_table=True)
        snowpark_test_df = session.write_pandas(pd.concat(test, axis=1, join='inner'), "test_table", auto_create_table=True, create_temp_table=True)
    
        # Объединение наших обучающих и тестовых данных вместе и добавление колонки, указывающей на строки обучения и тестирования
        return  snowpark_train_df.with_column("DATASET_TYPE", F.lit("train")).union(snowpark_test_df.with_column("DATASET_TYPE", F.lit("test")))
    ```

3. Выполните следующее в командной строке:

    ```bash
    dbt run --select train_test_position
    ```

4. Разбирая наш Python скрипт здесь:
    - Мы импортируем некоторые полезные библиотеки.
        - Определяем функцию `save_file()`, которая принимает четыре параметра: `session`, `model`, `path` и `dest_filename`, которая сохранит наш файл модели логистической регрессии.
            - `session` &mdash; объект, представляющий соединение с Snowflake.
            - `model` &mdash; объект, который нужно сохранить. В данном случае это Python объект, который является scikit-learn, который может быть сериализован с помощью joblib.
            - `path` &mdash; строка, представляющая директорию или местоположение корзины, где файл должен быть сохранен.
            - `dest_filename` &mdash; строка, представляющая желаемое имя файла.
        - Создание нашей dbt модели
            - В этой модели мы создаем стейдж под названием `MODELSTAGE`, чтобы разместить наш файл модели логистической регрессии `joblib`. Это действительно важно, так как нам нужно место, чтобы сохранить нашу модель для повторного использования и убедиться, что она там. При использовании команд Snowpark часто можно увидеть метод `.collect()`, чтобы убедиться, что действие выполнено. Думайте о сессии как о нашем "начале" и collect как о нашем "конце" при [работе с Snowpark](https://docs.snowflake.com/en/developer-guide/snowpark/python/working-with-dataframes.html) (вы можете использовать другие методы окончания, кроме collect).
            - Использование `.ref()` для подключения к нашей модели `train_test_dataset`.
            - Теперь мы видим часть машинного обучения нашего анализа:
                - Создание новых dataframes для наших прогнозных признаков из нашей целевой переменной `position_label`.
                - Разделение нашего набора данных на 70% обучения (и 30% тестирования), train_size=0.7 с указанным `random_state`, чтобы иметь повторяемые результаты.
                - Указание, что наша модель это логистическая регрессия.
                - Подгонка нашей модели. В логистической регрессии это означает нахождение коэффициентов, которые дадут наименьшую ошибку классификации.
                - Округление наших прогнозов до ближайшего целого числа, так как логистическая регрессия создает вероятность между для каждого класса и расчет сбалансированной точности, чтобы учесть дисбалансы в целевой переменной.
        - Сейчас наша модель находится только в памяти, поэтому нам нужно использовать нашу удобную функцию `save_file`, чтобы сохранить наш файл модели на нашем стейдже Snowflake. Мы сохраняем нашу модель как файл joblib, чтобы Snowpark мог легко вызвать этот объект модели для создания прогнозов. Нам действительно не нужно знать много другого как практикующему специалисту по данным, если мы не хотим. Стоит отметить, что файлы joblib не могут быть напрямую запрошены с помощью SQL. Чтобы сделать это, нам нужно было бы преобразовать файл joblib в формат, который можно запросить с помощью SQL, такой как JSON или CSV (вне рамок этого воркшопа).
        - Наконец, мы хотим вернуть наш dataframe, но создать новую колонку, указывающую, какие строки использовались для обучения, а какие для тестирования.
5. Просмотр нашего вывода этой модели:
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/12-machine-learning-training-prediction/1-preview-train-test-position.png" title="Предварительный просмотр, какие строки нашей модели использовались для обучения и тестирования"/>

6. Давайте вернемся в Snowflake и проверим, что наша модель логистической регрессии была сохранена в нашем `MODELSTAGE`, используя команду:

    ```sql
    list @modelstage
    ```

  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/12-machine-learning-training-prediction/2-list-snowflake-stage.png" title="Список объектов в нашем стейдже Snowflake для проверки нашей логистической регрессии для прогнозирования позиции гонщика"/>

7. Чтобы исследовать команды, выполненные в рамках скрипта `train_test_position`, перейдите в историю запросов Snowflake, чтобы просмотреть ее **Activity > Query History**. Мы можем просмотреть части запроса, которые мы написали, такие как `create or replace stage MODELSTAGE`, но мы также видим дополнительные запросы, которые Snowflake использует для интерпретации кода на python.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/12-machine-learning-training-prediction/3-view-snowflake-query-history.png" title="Просмотр истории запросов Snowflake, чтобы увидеть, как python модели выполняются под капотом"/>

### Прогнозирование на новых данных

1. Создайте новый файл под названием `predict_position.py` и скопируйте и сохраните следующий код:

    ```python
    import logging
    import joblib
    import pandas as pd
    import os
    from snowflake.snowpark import types as T

    DB_STAGE = 'MODELSTAGE'
    version = '1.0'
    # Имя файла модели
    model_file_path = 'driver_position_'+version
    model_file_packaged = 'driver_position_'+version+'.joblib'

    # Это локальная директория, используемая для хранения различных артефактов локально
    LOCAL_TEMP_DIR = f'/tmp/driver_position'
    DOWNLOAD_DIR = os.path.join(LOCAL_TEMP_DIR, 'download')
    TARGET_MODEL_DIR_PATH = os.path.join(LOCAL_TEMP_DIR, 'ml_model')
    TARGET_LIB_PATH = os.path.join(LOCAL_TEMP_DIR, 'lib')

    # Колонки признаков, которые использовались во время обучения модели
    # и которые будут использоваться во время прогнозирования
    FEATURE_COLS = [
            "RACE_YEAR"
            ,"CIRCUIT_NAME"
            ,"GRID"
            ,"CONSTRUCTOR_NAME"
            ,"DRIVER"
            ,"DRIVERS_AGE_YEARS"
            ,"DRIVER_CONFIDENCE"
            ,"CONSTRUCTOR_RELAIBLITY"
            ,"TOTAL_PIT_STOPS_PER_RACE"]

    def register_udf_for_prediction(p_predictor ,p_session ,p_dbt):

        # UDF для прогнозирования

        def predict_position(p_df: T.PandasDataFrame[int, int, int, int,
                                            int, int, int, int, int]) -> T.PandasSeries[int]:
            # Snowpark в настоящее время не устанавливает имя колонки во входном dataframe
            # Имена колонок по умолчанию такие как 0,1,2,... Поэтому нам нужно сбросить имена колонок
            # на признаки, которые мы изначально использовали для обучения.
            p_df.columns = [*FEATURE_COLS]
        
            # Выполнение прогнозирования. это возвращает объект массива
            pred_array = p_predictor.predict(p_df)
            # Преобразование в серию
            df_predicted = pd.Series(pred_array)
            return df_predicted

        # Список пакетов, которые будут использоваться UDF
        udf_packages = p_dbt.config.get('packages')

        predict_position_udf = p_session.udf.register(
            predict_position
            ,name=f'predict_position'
            ,packages = udf_packages
        )
        return predict_position_udf

    def download_models_and_libs_from_stage(p_session):
        p_session.file.get(f'@{DB_STAGE}/{model_file_path}/{model_file_packaged}', DOWNLOAD_DIR)
    
    def load_model(p_session):
        # Загрузка модели и инициализация предиктора
        model_fl_path = os.path.join(DOWNLOAD_DIR, model_file_packaged)
        predictor = joblib.load(model_fl_path)
        return predictor
    
    # -------------------------------
    def model(dbt, session):
        dbt.config(
            packages = ['snowflake-snowpark-python' ,'scipy','scikit-learn' ,'pandas' ,'numpy'],
            materialized = "table",
            tags = "predict"
        )
        session._use_scoped_temp_objects = False
        download_models_and_libs_from_stage(session)
        predictor = load_model(session)
        predict_position_udf = register_udf_for_prediction(predictor, session ,dbt)
    
        # Получение данных и выполнение прогнозирования
        hold_out_df = (dbt.ref("hold_out_dataset_for_prediction")
            .select(*FEATURE_COLS)
        )

        # Выполнение прогнозирования.
        new_predictions_df = hold_out_df.withColumn("position_predicted"
            ,predict_position_udf(*FEATURE_COLS)
        )
    
        return new_predictions_df
    ```

2. Выполните следующее в командной строке:

    ```bash
    dbt run --select predict_position
    ```

3. **Закоммитьте и отправьте** наши изменения, чтобы продолжать сохранять нашу работу по мере продвижения, используя сообщение коммита `logistic regression model training and application` перед тем, как двигаться дальше.
4. На высоком уровне в этом скрипте мы:
    - Извлекаем нашу модель логистической регрессии, размещенную на стейдже
    - Загружаем модель
    - Размещаем модель в пользовательской функции (UDF) для вызова прогнозов в строке на позиции гонщика
5. На более детальном уровне:
    - Импортируем наши библиотеки.
    - Создаем переменные для ссылки на `MODELSTAGE`, который мы только что создали и сохранили нашу модель.
    - Временные пути файлов, которые мы создали, могут выглядеть устрашающе, но все, что мы делаем здесь, это программно используем начальный путь файла и добавляем к нему, чтобы создать следующие директории:
        - LOCAL_TEMP_DIR ➡️ /tmp/driver_position
        - DOWNLOAD_DIR ➡️ /tmp/driver_position/download
        - TARGET_MODEL_DIR_PATH ➡️ /tmp/driver_position/ml_model
        - TARGET_LIB_PATH ➡️ /tmp/driver_position/lib
    - Предоставляем список наших колонок признаков, которые мы использовали для обучения модели и теперь будем использовать на новых данных для прогнозирования.
    - Далее мы создаем нашу основную функцию `register_udf_for_prediction(p_predictor ,p_session ,p_dbt):`. Эта функция используется для регистрации пользовательской функции (UDF), которая выполняет прогнозирование машинного обучения. Она принимает три параметра: `p_predictor` это экземпляр модели машинного обучения, `p_session` это экземпляр сессии Snowflake, и `p_dbt` это экземпляр библиотеки dbt. Функция создает UDF с именем `predict_churn`, который принимает pandas dataframe с входными признаками и возвращает pandas серию с прогнозами.
    - ⚠️ Обратите внимание на пробелы здесь. Мы используем функцию внутри функции для этого скрипта.
    - У нас есть 2 простые функции, которые программно извлекают наши пути файлов, чтобы сначала получить нашу сохраненную модель из нашего `MODELSTAGE` и загрузить ее в сессию `download_models_and_libs_from_stage`, а затем загрузить содержимое нашей модели (параметры) в `load_model` для использования в прогнозировании.
    - Берем модель, которую мы загрузили, называем ее `predictor` и оборачиваем в UDF.
    - Возвращаем наш dataframe с признаками, использованными для прогнозирования, и новой меткой.

🧠 Другой способ прочитать этот скрипт это снизу вверх. Это может помочь нам постепенно увидеть, что входит в нашу финальную dbt модель и работать назад, чтобы увидеть, как другие функции ссылаются.

6. Давайте посмотрим на нашу предсказанную позицию вместе с нашими переменными признаков. Откройте новый scratchpad и используйте следующий запрос. Я выбрал сортировку по прогнозу, кто займет позицию на подиуме:

    ```sql
    select * from {{ ref('predict_position') }} order by position_predicted
    ```

7. Мы видим, что создали прогнозы в нашем финальном наборе данных, мы готовы перейти к тестированию!

## Тестирование ваших моделей данных

Теперь мы завершили создание всех моделей для сегодняшней лаборатории, но как мы можем быть уверены, что они соответствуют нашим утверждениям? Другими словами, как мы можем быть уверены в качестве наших моделей данных? Это приводит нас к тестированию!

Мы тестируем модели данных по двум основным причинам:

- Убедиться, что наши исходные данные чисты при загрузке, прежде чем мы начнем моделирование/преобразование данных (избежать проблемы "мусор на входе, мусор на выходе").
- Убедиться, что мы не вводим ошибки в код преобразования, который мы написали (предотвратить создание плохих соединений/разветвлений).

Тестирование в dbt бывает двух видов: [общие](/docs/build/data-tests#generic-data-tests) и [единичные](/docs/build/data-tests#singular-data-tests).

Вы определяете их в блоке теста (аналогично макросу), и как только они определены, вы можете ссылаться на них по имени в ваших `.yml` файлах (применяя их к моделям, колонкам, источникам, снимкам и seed).

Вы можете задаться вопросом: *а как насчет тестирования Python моделей?*

Поскольку вывод наших Python моделей это таблицы, мы можем тестировать SQL и Python модели одинаково! Нам не нужно беспокоиться о каких-либо различиях в синтаксисе при тестировании SQL и Python моделей данных. Это означает, что мы используем `.yml` и `.sql` файлы для тестирования наших сущностей (таблиц, представлений и т.д.). Под капотом dbt выполняет SQL запрос на наших таблицах, чтобы увидеть, соответствуют ли они утверждениям. Если строки не возвращаются, dbt покажет успешный тест. Наоборот, если тест приводит к возвращению строк, он провалится или выдаст предупреждение в зависимости от конфигурации (подробнее об этом позже).

### Общие тесты

1. Чтобы реализовать общие тесты из коробки, которые предоставляет dbt, мы можем использовать YAML файлы для указания информации о наших моделях. Чтобы добавить общие тесты к нашей модели агрегатов, создайте файл под названием `aggregates.yml`, скопируйте блок кода ниже в файл и сохраните.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/1-generic-testing-file-tree.png" title="Файл aggregates.yml в нашем дереве файлов"/>

    ```yaml
    version: 2

    models:
        - name: fastest_pit_stops_by_constructor
          description: Используйте метод python .describe(), чтобы получить таблицу сводной статистики о пит-стопах по конструктору. Сортируйте по среднему времени остановки по возрастанию, чтобы первая строка возвращала самого быстрого конструктора.
          columns:
            - name: constructor_name
              description: команда, которая делает машину
              tests:
                - unique

        - name: lap_times_moving_avg
          description: Используйте метод python .rolling(), чтобы вычислить 5-летнее скользящее среднее времени пит-стопов вместе со средним для каждого года. 
          columns:
            - name: race_year
              description: год гонки
              tests:
                - relationships:
                  to: ref('int_lap_times_years')
                  field: race_year
    ```

2. Давайте разберем код, который у нас здесь. У нас есть обе наши модели агрегатов с именем модели, чтобы знать объект, на который мы ссылаемся, и описание модели, которое мы будем заполнять в нашей документации. На уровне колонки (уровень ниже нашей модели) мы предоставляем имя колонки, за которым следуют наши тесты. Мы хотим убедиться, что наш `constructor_name` уникален, так как мы использовали pandas `groupby` на `constructor_name` в модели `fastest_pit_stops_by_constructor`. Далее мы хотим убедиться, что наш `race_year` имеет ссылочную целостность из модели, которую мы выбрали из `int_lap_times_years`, в нашу последующую модель `lap_times_moving_avg`.
3. Наконец, если мы хотим увидеть, как тесты были развернуты на источниках и SQL моделях, мы можем посмотреть на другие файлы в нашем проекте, такие как `f1_sources.yml`, который мы создали в нашем разделе Источники и стадирование.

### Использование макросов для тестирования

1. В вашей папке `macros` создайте новый файл и назовите его `test_all_values_gte_zero.sql`. Скопируйте блок кода ниже и сохраните файл. Для ясности, "gte" это сокращение от greater than or equal to (больше или равно).
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/2-macro-testing.png" title="макрос файл для повторно используемого кода тестирования"/>

    ```sql
    {% macro test_all_values_gte_zero(table, column) %}

    select * from {{ ref(table) }} where {{ column }} < 0

    {% endmacro %}
    ```

2. Макросы в Jinja это куски кода, которые могут быть использованы многократно в наших SQL моделях &mdash; они аналогичны "функциям" в других языках программирования и чрезвычайно полезны, если вы обнаружите, что повторяете код в нескольких моделях.
3. Мы используем `{% macro %}` для указания начала макроса и `{% endmacro %}` для конца. Текст после начала блока макроса это имя, которое мы даем макросу, чтобы позже вызвать его. В данном случае наш макрос называется `test_all_values_gte_zero`. Макросы принимают *аргументы* для передачи, в данном случае `table` и `column`. В теле макроса мы видим SQL оператор, который использует функцию `ref` для динамического выбора таблицы, а затем колонки. Вы всегда можете просмотреть макросы без необходимости их выполнения, используя `dbt run-operation`. Вы можете узнать больше [здесь](https://docs.getdbt.com/reference/commands/run-operation).
4. Отлично, теперь мы хотим сослаться на этот макрос как на тест! Давайте создадим новый тестовый файл под названием `macro_pit_stops_mean_is_positive.sql` в нашей папке `tests`.

  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/3-gte-macro-applied-to-pit-stops.png" title="создание теста на нашей модели пит-стопов с ссылкой на макрос"/>

5. Скопируйте следующий код в файл и сохраните:

    ```sql
    {{
        config(
            enabled=true,
            severity='warn',
            tags = ['bi']
        )
    }}

    {{ test_all_values_gte_zero('fastest_pit_stops_by_constructor', 'mean') }}
    ```

6. В нашем тестовом файле мы применяем некоторые конфигурации к тесту, включая `enabled`, который является необязательной конфигурацией для отключения моделей, seed, снимков и тестов. Наша серьезность установлена на `warn` вместо `error`, что означает, что наш pipeline будет продолжать работать. Мы пометили наш тест как `bi`, так как мы применяем этот тест к одной из наших bi моделей.

Затем, в нашей финальной строке, мы вызываем макрос `test_all_values_gte_zero`, который принимает наши аргументы таблицы и колонки и вводим нашу таблицу `'fastest_pit_stops_by_constructor'` и колонку `'mean'`.

### Пользовательские единичные тесты для проверки Python моделей

Самый простой способ определить тест это написать точный SQL, который вернет неудачные записи. Мы называем их "единичными" тестами, потому что они одноразовые утверждения, пригодные для одной цели.

Эти тесты определяются в `.sql` файлах, обычно в вашем каталоге `tests` (как определено вашей конфигурацией test-paths). Вы можете использовать Jinja в SQL моделях (включая ref и source) в определении теста, так же как и при создании моделей. Каждый `.sql` файл содержит один select оператор и определяет один тест.

Давайте добавим пользовательский тест, который утверждает, что скользящее среднее времени круга за последние 5 лет больше нуля (невозможно иметь время меньше 0!). Легко предположить, что если это не так, данные были повреждены.

1. Создайте файл `lap_times_moving_avg_assert_positive_or_null.sql` в папке `tests`.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/4-custom-singular-test.png" title="пользовательский единичный тест для проверки, что времена кругов положительные значения"/>

2. Скопируйте следующий код и сохраните файл:

    ```sql
    {{
        config(
            enabled=true,
            severity='error',
            tags = ['bi']
        )
    }}

    with lap_times_moving_avg as ( select * from {{ ref('lap_times_moving_avg') }} )

    select *
    from lap_times_moving_avg 
    where lap_moving_avg_5_years < 0 and lap_moving_avg_5_years is not null
    ```

### Объединение всех наших тестов

1. Время запустить наши тесты! В целом, мы создали 4 теста для наших 2 Python моделей:
    - `fastest_pit_stops_by_constructor`
        - Уникальный `constructor_name`
        - Времена кругов больше 0 или null (чтобы позволить первые ведущие значения в скользящем расчете)
    - `lap_times_moving_avg`
        - Ссылочный тест на `race_year`
        - Среднее время пит-стопов больше или равно 0 (нет отрицательных значений времени)
2. Чтобы запустить тесты на обеих наших моделях, мы можем использовать этот синтаксис в командной строке, чтобы запустить их обе сразу, аналогично тому, как мы делали наши разделения данных ранее.
    Выполните следующее в командной строке:

    ```bash
    dbt test --select fastest_pit_stops_by_constructor lap_times_moving_avg
    ```

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/5-running-tests-on-python-models.png" title="запуск тестов на наших python моделях"/>

3. Все 4 наших теста прошли (ура за чистые данные)! Чтобы понять SQL, выполняемый против каждой из наших таблиц, мы можем нажать на детали теста.
4. Переходя в **Details** теста `unique_fastest_pit_stops_by_constructor_name`, мы можем увидеть, что каждая строка `constructor_name` должна иметь только одну строку.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/6-testing-output-details.png" title="просмотр деталей тестирования нашей python модели, которая использовала SQL для проверки утверждений данных"/>

## Документирование вашего dbt проекта

Когда дело доходит до документации, dbt объединяет как описания на уровне колонок и моделей, которые вы можете предоставить, так и детали из вашей информационной схемы Snowflake в статическом сайте для потребления другими членами команды данных и заинтересованными сторонами.

Мы собираемся вернуться к 2 областям нашего проекта, чтобы понять нашу документацию:

- файл `intermediate.md`
- файл `dbt_project.yml`

Для начала давайте посмотрим на наш файл `intermediate.md`. Мы видим, что предоставили многострочные описания для моделей в наших промежуточных моделях, используя [docs блоки](/docs/build/documentation#using-docs-blocks). Затем мы ссылаемся на эти docs блоки в нашем `.yml` файле. Создание описаний с помощью doc блоков в Markdown файлах дает вам возможность форматировать ваши описания с помощью Markdown и особенно полезно при создании длинных описаний, как на уровне колонок, так и на уровне моделей. В нашем `dbt_project.yml` мы добавили `node_colors` на уровне папок.

1. Чтобы увидеть, как все эти части объединяются, выполните это в командной строке:

  ```bash
  dbt docs generate
  ```

  Это сгенерирует документацию для вашего проекта. Нажмите на кнопку книги, как показано на скриншоте ниже, чтобы получить доступ к документации.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/1-docs-icon.png" title="иконка книги dbt docs"/>

2. Перейдите в нашу область проекта и просмотрите `int_results`. Просмотрите описание, которое мы создали в нашем doc блоке.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/2-view-docblock-description.png" title="Описание docblock в рамках сайта документации"/>

3. Просмотрите мини-родословную, которая смотрит на модель, на которой мы в данный момент выбраны (`int_results` в данном случае).
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/3-mini-lineage-docs.png" title="Мини-родословная на сайте документации"/>

4. В нашем `dbt_project.yml` мы настроили `node_colors` в зависимости от каталога файлов. Цветовое кодирование вашего проекта может помочь вам сгруппировать похожие модели или шаги и легче устранять неполадки при просмотре родословной в вашей документации.

  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/4-full-dag-docs.png" title="Полный DAG проекта на сайте документации"/>

## Развертывание вашего кода

Прежде чем мы перейдем к развертыванию нашего кода, давайте кратко рассмотрим среды. До этого момента вся работа, которую мы проделали в dbt Cloud IDE, была в нашей среде разработки, с кодом, зафиксированным в ветке функции, и моделями, которые мы построили, созданными в нашей схеме разработки в Snowflake, как определено в нашем подключении среды разработки. Выполнение этой работы в ветке функции позволяет нам отделить наш код от того, что строят другие коллеги, и кода, который уже считается готовым к производству. Создание моделей в схеме разработки в Snowflake позволяет нам отделить объекты базы данных, которые мы все еще можем модифицировать и тестировать, от объектов базы данных, которые запускают производственные панели или другие зависимости вниз по потоку. Вместе комбинация ветки Git и объектов базы данных Snowflake формирует нашу среду.

Теперь, когда мы завершили тестирование и документирование нашей работы, мы готовы развернуть наш код из нашей среды разработки в нашу производственную среду, и это включает два шага:

- Продвижение кода из нашей ветки функции в производственную ветку в нашем репозитории.
  - Обычно производственная ветка будет называться вашей основной веткой, и существует процесс проверки, который нужно пройти перед слиянием кода в основную ветку репозитория. Здесь мы будем сливать без проверки для простоты этого воркшопа.
- Развертывание кода в нашей производственной среде.
  - Как только наш код будет слит в основную ветку, нам нужно будет запустить dbt в нашей производственной среде, чтобы построить все наши модели и запустить все наши тесты. Это позволит нам построить готовые к производству объекты в нашей производственной среде в Snowflake. К счастью для нас, поток Partner Connect уже создал нашу среду развертывания и задание для облегчения этого шага.

1. Прежде чем начать, давайте убедимся, что мы зафиксировали всю нашу работу в нашей ветке функции. Если у вас все еще есть работа для фиксации, вы сможете выбрать **Commit and push**, предоставить сообщение и затем выбрать **Commit** снова.
2. Как только вся ваша работа зафиксирована, кнопка git workflow теперь будет отображаться как **Merge to main**. Выберите **Merge to main**, и процесс слияния автоматически запустится в фоновом режиме.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/1-merge-to-main-branch.png" title="Слияние в основную ветку"/>

3. Когда это завершится, вы должны увидеть, что кнопка git теперь отображается как **Create branch**, и ветка, которую вы в данный момент просматриваете, станет **main**.
4. Теперь, когда вся наша работа по разработке была слита в основную ветку, мы можем построить наше задание развертывания. Учитывая, что наша производственная среда и производственное задание были автоматически созданы для нас через Partner Connect, все, что нам нужно сделать здесь, это обновить некоторые настройки по умолчанию, чтобы они соответствовали нашим потребностям.
5. В меню выберите **Deploy** **> Environments**
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/2-ui-select-environments.png" title="Перейдите в среды в интерфейсе"/>

6. Вы должны увидеть две перечисленные среды, и вам нужно будет выбрать **Deployment** среду, затем **Settings**, чтобы изменить ее.
7. Прежде чем вносить какие-либо изменения, давайте коснемся того, что определено в этой среде. Соединение Snowflake показывает учетные данные, которые dbt Cloud использует для этой среды, и в нашем случае они такие же, как те, которые были созданы для нас через Partner Connect. Наше задание развертывания будет строиться в нашей базе данных `PC_DBT_DB` и использовать роль и склад по умолчанию Partner Connect для этого. Раздел учетных данных развертывания также использует информацию, созданную в нашем задании Partner Connect, для создания соединения учетных данных. Однако он использует ту же схему по умолчанию, которую мы использовали в качестве схемы для нашей среды разработки.
8. Давайте обновим схему, чтобы создать новую схему специально для нашей производственной среды. Нажмите **Edit**, чтобы позволить вам изменить существующие значения полей. Перейдите к **Deployment Credentials >** **schema.**
9. Обновите имя схемы на **production**. Не забудьте выбрать **Save** после того, как вы внесли изменение.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/3-update-deployment-credentials-production.png" title="Обновите схему учетных данных развертывания на production"/>
10. Обновив схему для нашей производственной среды на **production**, это гарантирует, что наше задание развертывания для этой среды будет строить наши dbt модели в **production** схеме в базе данных `PC_DBT_DB`, как определено в разделе соединения Snowflake.
11. Теперь давайте переключимся на наше производственное задание. Нажмите на вкладку deploy снова, а затем выберите **Jobs**. Вы должны увидеть существующее и предварительно настроенное **Partner Connect Trial Job**. Аналогично среде, нажмите на задание, затем выберите **Settings**, чтобы изменить его. Давайте посмотрим на задание, чтобы понять его, прежде чем вносить изменения.

    - Раздел Environment это то, что соединяет это задание с средой, в которой мы хотим его запустить. Это задание уже по умолчанию использует среду Deployment, которую мы только что обновили, и остальные настройки мы можем оставить как есть.
    - Раздел Execution settings дает нам возможность генерировать документацию, запускать свежесть источников и откладывать на предыдущее состояние выполнения. Для целей нашей лаборатории мы оставим эти настройки как есть и будем генерировать только документацию.
    - Раздел Commands это то, где мы указываем, какие именно команды мы хотим запустить во время этого задания, и мы также хотим оставить это как есть. Мы хотим, чтобы наш seed был загружен первым, затем запустить наши модели, и наконец протестировать их. Порядок этого важен, так как нам нужно, чтобы наш seed был создан до того, как мы сможем запустить нашу инкрементальную модель, и нам нужно, чтобы наши модели были созданы до того, как мы сможем их протестировать.
    - Наконец, у нас есть раздел Triggers, где у нас есть несколько различных вариантов для планирования нашего задания. Учитывая, что наши данные здесь не обновляются регулярно, и мы запускаем это задание вручную на данный момент, мы также оставим этот раздел в покое.
  
  Итак, что мы меняем? Только имя! Нажмите **Edit**, чтобы позволить вам внести изменения. Затем обновите имя задания на **Production Job**, чтобы обозначить это как наше производственное задание развертывания. После этого нажмите **Save**.
12. Теперь давайте перейдем к запуску нашего задания. Нажатие на имя задания в пути в верхней части экрана вернет вас на страницу истории выполнения задания, где вы сможете нажать **Run run**, чтобы запустить задание. Если вы столкнетесь с какими-либо сбоями задания, попробуйте запустить задание снова, прежде чем продолжать устранение неполадок.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/4-run-production-job.png" title="Запуск производственного задания"/>
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/5-job-details.png" title="Просмотр деталей производственного задания"/>

13. Давайте перейдем в Snowflake, чтобы подтвердить, что все построено, как ожидалось, в нашей производственной схеме. Обновите объекты базы данных в вашей учетной записи Snowflake, и вы должны увидеть производственную схему теперь в нашей базе данных по умолчанию Partner Connect. Если вы нажмете на схему и все прошло успешно, вы должны увидеть все модели, которые мы разработали.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/6-all-models-generated.png" title="Проверьте, что все наши модели в нашем pipeline находятся в Snowflake"/>

### Заключение

Фантастика! Вы завершили воркшоп! Мы надеемся, что вы чувствуете себя уверенно, используя как SQL, так и Python в ваших рабочих процессах dbt Cloud с Snowflake. Наличие надежного pipeline для отображения как аналитики, так и машинного обучения имеет решающее значение для создания ощутимой бизнес-ценности из ваших данных.

Для получения дополнительной помощи и информации присоединяйтесь к нашему [сообществу dbt в Slack](https://www.getdbt.com/community/), которое сегодня насчитывает более 50 000 специалистов по данным. У нас есть специальный канал в Slack #db-snowflake для контента, связанного с Snowflake. Удачи в dbt!

</div>
