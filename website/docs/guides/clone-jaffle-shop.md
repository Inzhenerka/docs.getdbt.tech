---
title: "Клонирование примера проекта Jaffle Shop"
id: clone-jaffle-shop
description: "Клонируйте пример проекта dbt Jaffle Shop из GitHub или GitLab."
displayText: Клонирование примера проекта Jaffle Shop
hoverSnippet: "Скачайте пример проекта dbt Jaffle Shop на свой компьютер с помощью Git."
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt', 'Beginner']
level: 'Beginner'
---

<div style={{maxWidth: '900px'}}>

## Что такое Jaffle Shop?

[Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) — эталонный пример проекта dbt от dbt Labs для вымышленного кафе. В этом руководстве показано, как клонировать проект из GitHub или GitLab с помощью Git.

При клонировании на ваш компьютер загружаются файлы проекта dbt: модели, seed-файлы, тесты и конфигурация. При этом dbt не устанавливается и база данных не настраивается. Если вам нужны только файлы проекта, следуйте инструкциям в разделах [Клонирование репозитория](#clone-the-repository) и [Проверка клонирования](#verify-the-clone).

Для выполнения команд dbt, таких как `dbt seed`, `dbt run` и `dbt test`, также необходимо установить dbt и подключиться к базе данных. Ссылки на руководства по быстрому старту для хранилищ данных приведены в разделе [Дальнейшие шаги](#next-steps).

### Связанные материалы

- [Установка <Constant name="core" />](/docs/local/install-dbt)
- [О проектах dbt](/docs/build/projects)
- [Примеры проектов dbt](/faqs/Project/example-projects)

## Предварительные требования

- Установленный [Git](https://git-scm.com/downloads)
- Терминал
- Учетная запись [GitHub](https://github.com/join) или [GitLab](https://gitlab.com/users/sign_up) (только если вы планируете создать форк репозитория, отправлять изменения или клонировать закрытый репозиторий)

Убедитесь, что Git установлен:

```bash
git --version
```

## Клонирование репозитория {#clone-the-repository}

<Tabs>
  <TabItem value="github" label="GitHub">

1. Откройте терминал и перейдите в каталог, в котором вы храните проекты:

    ```bash
    cd ~/Documents/Github
    ```

2. Клонируйте репозиторий:

    ```bash
    git clone https://github.com/dbt-labs/jaffle-shop.git
    ```

3. Перейдите в каталог проекта:

    ```bash
    cd jaffle-shop
    ```

  </TabItem>
  <TabItem value="gitlab" label="GitLab">

Если ваша организация размещает Jaffle Shop в GitLab или вы создали там форк репозитория, используйте для клонирования свой URL в GitLab:

1. Откройте терминал и перейдите в каталог, в котором вы храните проекты:

    ```bash
    cd ~/Documents/Github
    ```

2. Клонируйте репозиторий (замените `YOUR_USERNAME` на свое имя пользователя или название группы в GitLab):

    ```bash
    git clone https://gitlab.com/YOUR_USERNAME/jaffle-shop.git
    ```

3. Перейдите в каталог проекта:

    ```bash
    cd jaffle-shop
    ```

  </TabItem>
  <TabItem value="other" label="Другие платформы">

Если ваша организация создала зеркало или форк Jaffle Shop в Bitbucket, Azure DevOps или на другой платформе для размещения Git-репозиториев, используйте URL для клонирования с этой платформы. Команда `git clone` работает точно так же:

1. Откройте терминал и перейдите в каталог, в котором вы храните проекты:

    ```bash
    cd ~/Documents/Github
    ```

2. Клонируйте репозиторий:

    ```bash
    git clone <your-repo-clone-url>
    ```

3. Перейдите в каталог проекта:

    ```bash
    cd jaffle-shop
    ```

  </TabItem>
</Tabs>

## Проверка клонирования {#verify-the-clone}

Убедитесь, что файлы проекта на месте:

```bash
ls
```

Среди файлов и папок должны быть:

- `dbt_project.yml`
- `models/`
- `seeds/`
- `packages.yml`

Клонирование завершено! 🎉 Теперь файлы проекта Jaffle Shop находятся на вашем компьютере.

## Изучение структуры проекта

Прежде чем устанавливать dbt или подключать базу данных, кратко ознакомьтесь с содержимым клонированного проекта. Jaffle Shop — вымышленное кафе. Проект содержит 13 моделей, которые преобразуют данные кафе о клиентах, заведениях (точках продаж), продуктах, расходных материалах и заказах.

В проект также входят:

- **Seed-файлы:** шесть CSV-файлов в `seeds/jaffle-data/`, содержащих исходные данные для примера.
- **Тесты данных и модульные тесты:** YAML-файлы рядом с моделями, содержащие проверки уникальности, отсутствия значений null и несколько сценариев модульного тестирования.
- **Макросы:** небольшие вспомогательные макросы в `macros/`.
- **Пакеты:** зависимости, перечисленные в `packages.yml` (их можно установить позже с помощью `dbt deps`).

Упрощенная структура проекта выглядит так:

```text
jaffle-shop/
├── dbt_project.yml
├── packages.yml
├── models/
│   ├── staging/          # Clean and rename raw tables
│   │   ├── stg_customers.sql
│   │   ├── stg_orders.sql
│   │   ├── stg_order_items.sql
│   │   ├── stg_products.sql
│   │   ├── stg_locations.sql
│   │   ├── stg_supplies.sql
│   │   └── __sources.yml
│   └── marts/            # Business-ready tables for the cafe
│       ├── customers.sql
│       ├── orders.sql
│       ├── order_items.sql
│       ├── products.sql
│       ├── locations.sql
│       ├── supplies.sql
│       └── metricflow_time_spine.sql
├── seeds/
│   └── jaffle-data/      # Sample CSV data (customers, orders, and more)
├── macros/
├── analyses/
└── data-tests/
```

Модели слоя staging ближе всего к исходным данным из seed-файлов. Модели слоя marts объединяют и преобразуют эти данные в таблицы, используемые для анализа. Пока не обязательно читать каждый файл. Такая структура соответствует стандартному шаблону [проекта dbt](/docs/build/projects), который встречается во многих реальных проектах.

## Дальнейшие шаги {#next-steps}

Для запуска проекта или работы над ним необходимо установить dbt и настроить подключение к базе данных. Вам могут пригодиться следующие ссылки:

- **[Установка dbt в собственной среде](/docs/local/install-dbt):** при клонировании dbt не устанавливается. Он необходим для выполнения команд.
- **[Настройка виртуального окружения](/docs/local/install-dbt):** позволяет изолировать dbt от других Python-проектов на вашем компьютере.
- **[О команде dbt deps](/reference/commands/deps):** пакеты проекта перечислены в `packages.yml`. После установки dbt выполните `dbt deps`.
- **[О проектах dbt](/docs/build/projects):** изучите структуру проекта, прежде чем редактировать модели.
- **[dbt Learn](https://learn.getdbt.com/):** интерактивные курсы для новых пользователей.

### Быстрый старт для хранилищ данных

Для запуска проекта необходимо настроить базу данных и адаптер в `profiles.yml`. Выберите руководство по быстрому старту для своего хранилища данных или локальной среды:

- [Быстрый старт с dbt и Snowflake](/guides/snowflake)
- [Быстрый старт с dbt и BigQuery](/guides/bigquery)
- [Быстрый старт с dbt и Databricks](/guides/databricks)
- [Быстрый старт с dbt и Redshift](/guides/redshift)
- [Быстрый старт с <Constant name="core" /> и DuckDB](/guides/duckdb): клонируйте [`jaffle_shop_duckdb`](https://github.com/dbt-labs/jaffle_shop_duckdb) и следуйте руководству.

Вы также можете просмотреть [все руководства](/guides) или другие [примеры проектов dbt](/faqs/Project/example-projects).

## Удаление проекта (необязательно)

Если вы клонировали репозиторий только для проверки этих шагов и проект вам больше не нужен, можно удалить папку:

```bash
rm -rf ~/Documents/Github/jaffle-shop
```

Эта команда удаляет клонированный проект с вашего компьютера. Она не затрагивает репозиторий в GitHub или GitLab.

</div>
