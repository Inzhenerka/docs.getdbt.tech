---
title: "Coalesce: Быстрый старт для dbt Cloud CLI"
id: "dbt-cloud-cli"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Начинающий'
icon: 'guides'
hide_table_of_contents: true
tags: ['Cloud CLI', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как настроить и использовать dbt Cloud CLI в рамках семинара Coalesce 24.

Вы научитесь:

- Настраивать песочницу dbt Cloud.
- Устанавливать dbt Cloud CLI и подключаться к dbt Cloud.
- Запускать команды локально с помощью dbt Cloud CLI.
- Откладывать выполнение в разные производственные среды.
- Использовать кросс-проектные ссылки.
- Устанавливать dbt Power User.
- Использовать dbt Power User для ускорения разработки.

### Предварительные требования

- Знание проектов dbt и общих команд (например, `dbt build`)
- Установлен Git
- Установлен редактор, такой как Visual Studio Code (предпочтительно)

### Связанный контент

- Узнайте больше на [курсах dbt Learn](https://learn.getdbt.com)

## Установка Git и Visual Studio Code (предварительные требования)

Вам необходимо установить Git локально и редактор кода (предпочтительно Visual Studio Code).

### Проверьте статус установки

Запустите `git --version` в вашем терминале, чтобы проверить, установлен ли он. Например:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/terminal-git-check.png" title="Пример проверки установки Git" />
</div>

Проверьте установленные приложения для Visual Studio Code (vscode) или другого редактора. Например:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/finder-vscode-check.png" title="Пример проверки установки Visual Studio Code на macOS" />
</div>

### Установка Git и Visual Studio Code

Перейдите на следующую страницу установки Git и установите его для вашей операционной системы:

https://git-scm.com/downloads

Перейдите на следующую страницу установки Visual Studio Code и установите его для вашей операционной системы.

https://code.visualstudio.com/download

## Настройка dbt Cloud (только для семинара Coalesce)

Давайте настроим песочницу dbt Cloud, которая уже подключена к аккаунту Snowflake для семинара.

1. Перейдите по ссылке [bit.ly/coalesce-24-sandboxes](https://bit.ly/coalesce-24-sandboxes), чтобы создать аккаунт. Убедитесь, что вы вышли из других аккаунтов dbt Cloud.
    
    a. Введите ваше **Имя** и **Фамилию**
    
    b. Для **Семинара** выберите **Тестирование dbt Cloud CLI и dbt Power User** из выпадающего списка
    
    c. **Пароль** будет предоставлен вашими организаторами
    
    d. Примите условия и нажмите **Завершить регистрацию**

1. Перейдите к проекту платформы, выбрав **Проект** в левой боковой панели и выбрав **Platform Analytics**.

1. Выберите **Развертывание >> Запуски**, чтобы найти созданные задания. Для каждого задания нажмите на задание и нажмите **запустить**.

1. Теперь повторите для **Аналитического проекта**. Переключитесь на Аналитический проект.

1. Выберите **Развертывание >> Запуски**, чтобы найти созданные задания. Для одного задания нажмите на задание и нажмите **запустить**.

1. Выберите **Исследовать** в навигации и выберите XX. Теперь вы можете визуализировать вашу dbt Mesh. Нажмите на каждый проект, чтобы увидеть уровень родства проекта.

Теперь вы успешно запустили ваш проект в развертываемых средах, чтобы позже использовать кросс-проектные ссылки и откладывание.

## Настройка dbt Cloud CLI

Теперь мы клонируем репозиторий проекта и настраиваем dbt Cloud CLI для подключения к вашей песочнице.

### Клонирование репозитория

1. Перейдите в папку на вашем компьютере, чтобы клонировать репозиторий.

1. В вашем терминале выполните следующую команду, чтобы клонировать проект downstream (аналитический):

    ```shell
    git clone https://github.com/dbt-labs/c24-workshops-analytics.git
    ```

### Установка Cloud CLI

1. В dbt Cloud выберите Platform Analytics и выберите **Разработка >> Настроить Cloud CLI**.

1. В зависимости от вашей текущей локальной настройки, используйте следующие рекомендации, чтобы определить подход к установке:

    a. Проверьте, есть ли dbt в вашем PATH, запустив `dbt --version`

    b. Если у вас нет dbt в вашем PATH, мы рекомендуем метод установки для macOS или Windows.

    c. Если у вас есть dbt в вашем PATH (глобальная среда), мы рекомендуем:
        1. Удалить dbt глобально
        2. Установить dbt Cloud CLI с помощью виртуальной среды Python

    d. Если у вас есть dbt в виртуальной среде, установите dbt Cloud CLI с помощью отдельной виртуальной среды Python. Обязательно активируйте ее с помощью `source <path to env>/bin/activate`.

1. Скачайте файл конфигурации CLI из интерфейса dbt Cloud. Сохраните его в вашей папке `.dbt`.

1. Перейдите в папку проекта dbt, которую вы клонировали ранее, и откройте файл `dbt_project.yml` с вашим `project_id`.

### Подтверждение установки

Запустите `dbt compile`, чтобы проверить вашу установку.

Вот и все! Вы установили dbt Cloud CLI! Давайте углубимся!

### Дополнительные ресурсы
Обратитесь к следующим документам, если у вас возникнут проблемы при установке dbt Cloud CLI:
- [Установка dbt Cloud CLI](https://docs.getdbt.com/docs/cloud/cloud-cli-installation)
- [Настройка и использование dbt Cloud CLI](https://docs.getdbt.com/docs/cloud/configure-cloud-cli)

## Использование dbt Cloud CLI

Давайте запустим несколько команд вместе, чтобы привыкнуть к dbt Cloud CLI:
* `dbt debug` &mdash; Отображает ваши данные подключения и информацию
* `dbt compile --select stg_campaigns` &mdash; Компилирует ваш проект dbt
* `dbt run --select stg_campaigns` &mdash; Материализует ваши модели dbt
* `dbt run --select stg_campaigns` &mdash; Предварительный просмотр результатов модели
* `dbt test --select stg_campaigns` &mdash; Выполняет тесты на ваших материализованных моделях

Теперь давайте углубимся в некоторые более сложные компоненты dbt Cloud CLI.

### Откладывание

Откладывание — это мощная функция, позволяющая использовать активы, находящиеся вне вашей личной среды разработки. В результате вы можете ускорить свои рабочие процессы разработки и сэкономить на вычислительных затратах в хранилище. Давайте запустим несколько команд, используя откладывание:

1. Запустите `dbt compile -s stg_campaigns`. Обратите внимание, как мы можем разрешить зависимости в скомпилированном SQL без загрузки `campaigns.csv`.
1. Теперь давайте изменим модель `stg_campaigns`, добавив временную метку:
    ```sql
    current_timestamp() as updated_at
    ```

    Давайте соберем эту модель с помощью следующей команды.
1. Запустите `dbt build --select stg_campaigns`. Мы используем откладывание и концепцию "состояния", чтобы проверить объекты, которые были изменены, и разрешить зависимости upstream-активов, если они существуют.

    По умолчанию dbt Cloud CLI откладывает выполнение в [Staging](https://docs.getdbt.com/docs/deploy/deploy-environments#staging-environment) среду, если она существует. Если нет, dbt использует активы из производственной среды.

    Чтобы переопределить, в какую среду откладывает выполнение dbt Cloud CLI, вы можете установить ключ `defer-env-id` в вашем файле `dbt_project.yml` или `dbt_cloud.yml`. Например:

    ```yml
    dbt-cloud:
        defer-env-id: '123456'
    ```

### dbt Mesh

У вас есть доступ к кросс-проектным ссылкам, которые работают на основе метаданных dbt Cloud.

1. Откройте модель `agg_campaign_customer_contacts`.
1. Найдите ссылку под названием `{{ ref('platform', 'dim_customers', v=1) }}`.
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

С помощью встроенного SQLFluff вы можете проверить свой код на соответствие стилевому руководству и автоматически внести исправления.

1. Запустите команду SQLFluff `lint`:

    ```shell
    dbt sqlfluff lint models/staging/campaigns/stg_campaigns.sql --dialect snowflake
    ```

    Это выявляет изменения, которые необходимо внести в модель `stg_campaigns`.
2. Запустите команду SQLFluff `fix`:

    ```shell
    dbt sqlfluff fix models/staging/campaigns/stg_campaigns.sql --dialect snowflake
    ```

    Это пытается напрямую внести исправления в модель `stg_campaigns`.

### Смена веток

Вы можете быстро сменить ветки, не полностью отправляя изменения в ваш Git-провайдер (например, GitHub):

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
1. Нажмите **Переключиться на dbt Cloud**. Возможно, вам потребуется обновить страницу.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-02.png" title="Переключиться на dbt Cloud" />
    </div>
1. Завершите шаги настройки. (нажмите на приветствие в VSCode и выберите dbt Poweruser)
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-03.png" title="Завершите процесс настройки" />
    </div>
1. Создайте аккаунт, чтобы зарегистрироваться и получить API-ключ: https://app.myaltimate.com/register

1. Скопируйте ваш API-ключ и введите его в настройках расширения dbt Power User.

Теперь давайте углубимся!

## Использование dbt Power User

С помощью dbt Cloud вы можете сделать много для ускорения вашего рабочего процесса. Давайте рассмотрим некоторые ключевые моменты.

### Предварительный просмотр ваших изменений upstream/downstream

Откройте расширение Power User на левой стороне. Вы можете увидеть upstream и downstream проекты.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-01.png" title="Смотрите зависимости upstream и downstream" />
</div>

### Предварительный просмотр результатов

Нажмите Command-Enter (или Control-Enter для Windows), и мгновенно увидите результаты вашей модели ниже.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-02.png" title="Предварительный просмотр результатов" />
</div>

### Визуализация SQL

При просмотре файла модели нажмите на логотип Altimate в правом верхнем углу и выберите **Визуализировать SQL**, чтобы увидеть разбивку вашей SQL модели.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-03.png" title="Визуализация обработки SQL" />
</div>

### Генерация тестов и документации YML с удобным интерфейсом и ИИ

В верхней части вашего файла модели нажмите на генерацию документации для интерфейса, чтобы быстро создать документацию и тесты с помощью ИИ.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-04.png" title="Генерация тестов и документации" />
</div>

Есть еще много всего! Ознакомьтесь с документацией dbt Power User здесь: https://docs.myaltimate.com/

## Заключение

Вы успешно установили dbt Cloud CLI и dbt Power User! Теперь вы можете получить преимущества локальной разработки _и_ dbt Cloud, работающих вместе.

Следите за следующими улучшениями dbt Cloud CLI:
- Более глубокая интеграция с dbt Explorer для визуального взаимодействия
- Поддержка запуска производственных заданий непосредственно из CLI
- Продолжительная оптимизация для повышения производительности и масштабируемости

</div>