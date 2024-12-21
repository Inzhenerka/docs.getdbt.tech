---
title: "Coalesce: Быстрый старт для dbt Cloud CLI"
id: "dbt-cloud-cli"
level: 'Beginner'
icon: 'guides'
hide_table_of_contents: true
tags: ['Cloud CLI', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как настроить и использовать dbt Cloud CLI в рамках мастер-класса Coalesce 24.

Вы узнаете, как:

- Настроить песочницу dbt Cloud.
- Установить dbt Cloud CLI и подключиться к dbt Cloud.
- Выполнять команды локально с помощью dbt Cloud CLI.
- Переключаться на разные производственные среды.
- Использовать cross-project ref.
- Установить dbt Power User.
- Использовать dbt Power User для ускорения разработки.

### Предварительные требования

- Знакомство с проектами dbt и общими командами (например, `dbt build`)
- Установленный Git
- Установленный редактор, такой как Visual Studio Code (предпочтительно)

### Связанные материалы

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)

## Установка Git и Visual Studio Code (Предварительные требования)

Вам нужно будет установить Git локально и редактор кода (предпочтительно Visual Studio Code).

### Проверьте статус установки

Запустите `git --version` в вашем терминале, чтобы проверить, установлен ли он. Например:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/terminal-git-check.png" title="Пример проверки установки Git" />
</div>

Проверьте установленные приложения на наличие Visual Studio Code (vscode) или другого редактора. Например:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/finder-vscode-check.png" title="Пример проверки установки Visual Studio Code на macOS" />
</div>

### Установите Git и Visual Studio Code

Перейдите на следующую страницу установки Git и установите его для вашей операционной системы:

https://git-scm.com/downloads

Перейдите на следующую страницу установки Visual Studio Code и установите его для вашей операционной системы.

https://code.visualstudio.com/download

## Настройка dbt Cloud (Только для мастер-класса Coalesce)

Давайте настроим песочницу dbt Cloud, которая уже подключена к аккаунту Snowflake для мастер-класса.

1. Перейдите на [bit.ly/coalesce-24-sandboxes](https://bit.ly/coalesce-24-sandboxes), чтобы создать аккаунт. Убедитесь, что вы вышли из других аккаунтов dbt Cloud.
    
    a. Введите ваше **Имя** и **Фамилию**
    
    b. Для **Мастер-класса** выберите **Test driving dbt Cloud CLI and dbt power user** из выпадающего списка
    
    c. **Пароль** будет предоставлен вашими ведущими
    
    d. Примите условия и нажмите **Завершить регистрацию**

1. Перейдите к проекту платформы, выбрав **Project** в левой боковой панели и выбрав **Platform Analytics**.

1. Выберите **Deploy >> Runs**, чтобы найти созданные задания. Для каждого задания нажмите на задание и нажмите **run**.

1. Теперь повторите для **Analytics project**. Переключитесь в проект Analytics.

1. Выберите **Deploy >> Runs**, чтобы найти созданные задания. Для одного задания нажмите на задание и нажмите **run**.

1. Выберите **Explore** в навигации и выберите XX. Теперь вы можете визуализировать вашу dbt Mesh. Нажмите на каждый проект, чтобы увидеть уровень родословной проекта.

Теперь вы успешно запустили ваш проект в средах развертывания, чтобы вы могли использовать cross project ref и deferral позже на мастер-классе.

## Настройка dbt Cloud CLI

Теперь мы клонируем репозиторий проекта и настроим dbt Cloud CLI для подключения к вашей песочнице.

### Клонирование репозитория

1. Перейдите в папку на вашем компьютере, чтобы клонировать репозиторий.

1. В вашем терминале выполните следующую команду, чтобы клонировать downstream (аналитический) проект:

    ```shell
    git clone https://github.com/dbt-labs/c24-workshops-analytics.git
    ```

### Установка Cloud CLI

1. В dbt Cloud выберите Platform Analytics и выберите **Develop >> Configure Cloud CLI**.

1. В зависимости от вашей текущей локальной настройки используйте следующие рекомендации для определения вашего подхода к установке:

    a. Проверьте, есть ли у вас dbt в PATH, запустив `dbt --version`

    b. Если у вас нет dbt в PATH, мы рекомендуем метод установки для macOS или Windows.

    c. Если у вас есть dbt в PATH (глобальная среда), мы рекомендуем:
        1. Удалить dbt глобально
        2. Установить dbt Cloud CLI с помощью виртуальной среды Python

    d. Если у вас есть dbt в виртуальной среде, установите dbt Cloud CLI с помощью отдельной виртуальной среды Python. Обязательно активируйте ее с помощью `source <path to env>/bin/activate`.

1. Загрузите файл конфигурации CLI из интерфейса dbt Cloud. Сохраните его в вашей папке `.dbt`.

1. Перейдите в папку проекта dbt, которую вы клонировали ранее, и откройте файл `dbt_project.yml` с вашим `project_id`.

### Подтверждение установки

Запустите `dbt compile`, чтобы проверить вашу установку.

Вот и все! Вы установили dbt Cloud CLI! Давайте погрузимся в работу!

### Дополнительные ресурсы
Обратитесь к следующим документам, если у вас возникнут проблемы при попытке установить dbt Cloud CLI:
- [Установка dbt Cloud CLI](https://docs.getdbt.com/docs/cloud/cloud-cli-installation)
- [Настройка и использование dbt Cloud CLI](https://docs.getdbt.com/docs/cloud/configure-cloud-cli)

## Использование dbt Cloud CLI

Давайте выполним несколько команд вместе, чтобы привыкнуть к dbt Cloud CLI:
* `dbt debug` &mdash; Отображает ваши данные подключения и информацию
* `dbt compile --select stg_campaigns` &mdash; Компилирует ваш проект dbt
* `dbt run --select stg_campaigns` &mdash; Материализует ваши модели dbt
* `dbt run --select stg_campaigns` &mdash; Предварительный просмотр результатов модели
* `dbt test --select stg_campaigns` &mdash; Выполняет тесты на ваших материализованных моделях

Теперь давайте углубимся в некоторые более продвинутые компоненты dbt Cloud CLI.

### Deferral

Deferral — это мощная функция, позволяющая использовать вышестоящие активы, которые существуют за пределами вашей личной среды разработки. В результате вы можете ускорить свои рабочие процессы разработки и сэкономить на вычислительных ресурсах склада. Давайте выполним несколько команд с использованием deferral:

1. Запустите `dbt compile -s stg_campaigns`. Обратите внимание, как мы можем разрешать зависимости в скомпилированном SQL без загрузки `campaigns.csv`.
1. Теперь давайте изменим модель `stg_campaigns`, добавив временную метку:
    ```sql
    current_timestamp() as updated_at
    ```

    Давайте построим эту модель с помощью следующей команды.
1. Запустите `dbt build --select stg_campaigns`. Мы используем deferral и концепцию "состояния", чтобы проверить объекты, которые были изменены, и разрешить зависимости вышестоящих активов, если они существуют.

    По умолчанию dbt Cloud CLI откладывает выполнение в [Staging](https://docs.getdbt.com/docs/deploy/deploy-environments#staging-environment) среде, если она существует. Если нет, dbt использует активы из производственной среды.

    Чтобы переопределить, в какую среду dbt Cloud CLI откладывает выполнение, вы можете установить ключ `defer-env-id` в вашем файле `dbt_project.yml` или `dbt_cloud.yml`. Например:

    ```yml
    dbt-cloud:
        defer-env-id: '123456'
    ```

### dbt Mesh

У вас есть доступ к cross-project ref, который поддерживается метаданными dbt Cloud.

1. Откройте модель `agg_campaign_customer_contacts`.
1. Найдите ссылку `{{ ref('platform', 'dim_customers', v=1) }}`.
1. Выполните команду:

    ```shell
    dbt run --select agg_campaign_customer_contacts
    ```

1. Перейдите в dbt Cloud Explorer и найдите публичную модель. Давайте используем модель `fct_order_items`.
1. Создайте новую модель под названием `agg_orders` в вашем проекте с следующим кодом:

    ```sql
    with orders as (
    
        select * from {{ ref('platform', 'fct_order_items') }}

    ),

    final as (
    
        select
            customer_key as customer_id,
            is_return as return_status,
            count(*) as count_orders

        from
            orders
        group by
            customer_key,
            is_return
    )

    select * from final
    ```

### Линтинг и исправление SQL файлов

С встроенным SQLFluff вы можете проверять ваш код на соответствие стилю и автоматически вносить исправления.

1. Выполните команду SQLFluff `lint`:

    ```shell
    dbt sqlfluff lint models/staging/campaigns/stg_campaigns.sql --dialect snowflake
    ```

    Это выявляет изменения, которые нужно внести в модель `stg_campaigns`.
2. Выполните команду SQLFluff `fix`:

    ```shell
    dbt sqlfluff fix models/staging/campaigns/stg_campaigns.sql --dialect snowflake
    ```

    Это пытается напрямую внести исправления в модель `stg_campaigns`.

### Смена веток

Вы можете быстро менять ветки без полного пуша в ваш Git-провайдер (например, GitHub):

```shell
git checkout -b my-new-branch

git checkout main
```

Теперь вы ознакомились с тем, что можно сделать с dbt Cloud CLI. Давайте перейдем к dbt Power User.

## Установка dbt Power User

Давайте установим dbt Power User, чтобы ускорить наш рабочий процесс.

1. В Visual Studio Code нажмите на расширения и найдите "Power User for dbt".

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-01.png" title="Найдите расширение VS Code для dbt Power User" />
    </div>
1. Нажмите на установку.
1. Нажмите **Switch to dbt Cloud**. Возможно, потребуется обновить.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-02.png" title="Переключитесь на dbt Cloud" />
    </div>
1. Завершите шаги настройки. (нажмите на приветствие в VSCode и выберите dbt Poweruser)
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-03.png" title="Завершите процесс настройки" />
    </div>
1. Создайте аккаунт для регистрации и получения API-ключа: https://app.myaltimate.com/register

1. Скопируйте ваш API-ключ и введите его в настройки расширения dbt Power User.

Теперь давайте погрузимся в работу!

## Использование dbt Power User

Существует множество возможностей для ускорения вашего рабочего процесса с dbt Cloud. Давайте рассмотрим некоторые из них.

### Предварительный просмотр ваших изменений вверх/вниз по потоку

Откройте расширение Power User на левой панели. Вы можете увидеть проекты вверх и вниз по потоку.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-01.png" title="Просмотр зависимостей вверх и вниз по потоку" />
</div>

### Предварительный просмотр результатов

Нажмите Command-Enter (или Control-Enter для Windows) и мгновенно увидьте результаты вашей модели ниже.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-02.png" title="Предварительный просмотр результатов" />
</div>

### Визуализация SQL

Просматривая файл модели, нажмите на логотип Altimate в правом верхнем углу и выберите **Visualize SQL**, чтобы увидеть разбор вашей SQL модели.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-03.png" title="Визуализация обработки SQL" />
</div>

### Генерация тестов и документации YML с удобным UX и AI

В верхней части вашего файла модели нажмите на генерацию документации для интерфейса, чтобы быстро создать документацию и тесты с помощью AI

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-04.png" title="Генерация тестов и документации" />
</div>

И это еще не все! Ознакомьтесь с документацией dbt Power User здесь: https://docs.myaltimate.com/

## Заключение

Вы успешно установили dbt Cloud CLI и dbt Power User! Теперь вы можете получить преимущества локальной разработки _и_ dbt Cloud, работая вместе.

Следите за следующими улучшениями dbt Cloud CLI:
- Более глубокая интеграция с dbt Explorer для визуального взаимодействия
- Поддержка вызова производственных заданий непосредственно из CLI
- Продолжение оптимизации для повышения производительности и масштабируемости

</div>