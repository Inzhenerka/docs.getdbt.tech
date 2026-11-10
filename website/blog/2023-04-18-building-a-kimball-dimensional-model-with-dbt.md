---
title: "Создание размерной модели Кимбалла с помощью dbt"
description: "Освойте размерное моделирование в dbt с помощью этого пошагового руководства от Джонатана Нео из Canva."
slug: kimball-dimensional-model

authors: [jonathan_neo]

tags: [аналитическое ремесло, dbt руководства]
hide_table_of_contents: false

date: 2023-04-20
is_featured: true
---

<Term id="dimensional-modeling">Размерное моделирование</Term> — это одна из многих техник моделирования данных, используемых специалистами по данным для организации и представления данных для аналитики. Другие техники моделирования данных включают Data Vault (DV), Third Normal Form (3NF) и One Big Table (OBT), чтобы назвать несколько.

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/data-modelling.png" width="85%" title="Техники моделирования данных на шкале нормализации и денормализации"/>

Хотя актуальность размерного моделирования [обсуждается специалистами по данным](https://discourse.getdbt.com/t/is-kimball-dimensional-modeling-still-relevant-in-a-modern-data-warehouse/225/6), оно по-прежнему остается одной из наиболее широко применяемых техник моделирования данных для аналитики.

Несмотря на свою популярность, ресурсы по созданию размерных моделей с использованием dbt остаются скудными и недостаточно детализированными. Это руководство призвано решить эту проблему, предоставив окончательное руководство по размерному моделированию с dbt.

К концу этого руководства вы:

- Поймете концепции размерного моделирования
- Настроите макетный проект dbt и базу данных
- Определите бизнес-процесс для моделирования
- Определите таблицы фактов и измерений
- Создадите таблицы измерений
- Создадите таблицу фактов
- Задокументируете отношения размерной модели
- Используете размерную модель

<!--truncate-->

## Размерное моделирование {#dimensional-modeling}

Размерное моделирование — это техника, представленная Ральфом Кимбаллом в 1996 году в его книге [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/).

Цель размерного моделирования — взять сырые данные и преобразовать их в таблицы фактов и измерений, которые представляют бизнес.

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/3nf-to-dimensional-model.png" title="Сырые данные 3NF в размерную модель"/>

Преимущества размерного моделирования:

- **Простая модель данных для аналитики**: Пользователям размерных моделей не нужно выполнять сложные соединения при использовании размерной модели для аналитики. Выполнение соединений между таблицами фактов и измерений упрощается за счет использования суррогатных ключей.
- <Term id="dry">Не повторяйся</Term>: Измерения могут быть легко повторно использованы с другими таблицами фактов, чтобы избежать дублирования усилий и логики кода. Повторно используемые измерения называются согласованными измерениями.
- **Быстрое извлечение данных**: Аналитические запросы, выполняемые против размерной модели, значительно быстрее, чем модель 3NF, поскольку преобразования данных, такие как соединения и агрегации, уже применены.
- **Тесное соответствие с реальными бизнес-процессами**: Бизнес-процессы и метрики моделируются и рассчитываются как часть размерного моделирования. Это помогает гарантировать, что смоделированные данные легко использовать.

Теперь, когда мы понимаем общие концепции и преимущества размерного моделирования, давайте перейдем к практике и создадим нашу первую размерную модель с использованием dbt.

## Часть 1: Настройка проекта dbt и базы данных {#part-1-setup-dbt-project-and-database}

### Шаг 1: Перед началом работы {#step-1-before-you-get-started}

Перед началом работы:

- У вас должен быть установлен либо DuckDB, либо PostgreSQL. Выберите один и загрузите и установите базу данных, используя одну из следующих ссылок:
    - Загрузить [DuckDB](https://duckdb.org/docs/installation/index)
    - Загрузить [PostgreSQL](https://www.postgresql.org/download/)
- У вас должен быть установлен Python 3.8 или выше
- У вас должна быть установлена версия dbt 1.3.0 или выше
- Вы должны иметь базовое понимание [SQL](https://www.sqltutorial.org/)
- Вы должны иметь базовое понимание [dbt](https://docs.getdbt.tech/guides)

### Шаг 2: Клонирование репозитория {#step-2-clone-the-repository}

Клонируйте [репозиторий github](https://github.com/Data-Engineer-Camp/dbt-dimensional-modelling), выполнив эту команду в вашем терминале:

```text
git clone https://github.com/Data-Engineer-Camp/dbt-dimensional-modelling.git
cd dbt-dimensional-modelling/adventureworks
```

### Шаг 3: Установка адаптеров базы данных dbt {#step-3-install-dbt-database-adaptors}

В зависимости от выбранной вами базы данных установите соответствующий адаптер базы данных:

```text
# установка адаптера для duckdb
python -m pip install dbt-duckdb

# ИЛИ

# установка адаптера для postgresql
python -m pip install dbt-postgres
```

### Шаг 4: Настройка профиля dbt {#step-4-setup-dbt-profile}

Профиль dbt (см. `adventureworks/profiles.yml`) уже предварительно настроен для вас. Убедитесь, что конфигурации установлены правильно на основе ваших учетных данных базы данных:

```yaml
adventureworks:
  target: duckdb # оставьте это как duckdb или измените на выбранную вами базу данных

  # поддерживаемые базы данных: duckdb, postgres 
  outputs:
    duckdb: 
     type: duckdb
     path: target/adventureworks.duckdb
     threads: 12

    postgres:  
      type: postgres
      host: localhost
      user: postgres
      password: postgres
      port: 5432
      dbname: adventureworks # создайте эту пустую базу данных заранее 
      schema: dbo
      threads: 12
```

### Шаг 5: Установка зависимостей dbt {#step-5-install-dbt-dependencies}

Мы используем пакеты, такие как [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), в этом проекте, и нам нужно установить библиотеки для этого пакета, выполнив команду:

```
dbt deps 
```

### Шаг 6: Заполнение вашей базы данных {#step-6-seed-your-database}

Мы используем [dbt seeds](https://docs.getdbt.tech/docs/build/seeds) (см. `adventureworks/seeds/*`) для вставки данных AdventureWorks в вашу базу данных:

```text
# заполнение duckdb 
dbt seed --target duckdb

# заполнение postgres
dbt seed --target postgres
```

### Шаг 7: Изучение схемы источника базы данных {#step-7-examine-the-database-source-schema}

Все данные, сгенерированные бизнесом, хранятся в базе данных OLTP. Диаграмма сущностей и связей (ERD) базы данных предоставлена вам.

Изучите схему источника базы данных ниже, уделяя особое внимание:

- Таблицам
- Ключам
- Отношениям

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/source-schema.png" width="85%" title="Схема источника"/>

### Шаг 8: Запрос таблиц {#step-8-query-the-tables}

Получите лучшее представление о том, как выглядят записи, выполняя операторы select с помощью SQL-редактора вашей базы данных.

Например:

```sql
select * from sales.salesorderheader limit 10; 
```

Вывод:

```
┌──────────────┬──────────────┬─────────────────┬───┬───────────────┬─────────────────────┬────────────────┐
│ salesorderid │ shipmethodid │ billtoaddressid │ … │ salespersonid │      shipdate       │ accountnumber  │
│    int32     │    int32     │      int32      │   │     int32     │      timestamp      │    varchar     │
├──────────────┼──────────────┼─────────────────┼───┼───────────────┼─────────────────────┼────────────────┤
│        43659 │            5 │             985 │ … │           279 │ 2011-06-07 00:00:00 │ 10-4020-000676 │
│        43660 │            5 │             921 │ … │           279 │ 2011-06-07 00:00:00 │ 10-4020-000117 │
│        43661 │            5 │             517 │ … │           282 │ 2011-06-07 00:00:00 │ 10-4020-000442 │
│        43662 │            5 │             482 │ … │           282 │ 2011-06-07 00:00:00 │ 10-4020-000227 │
│        43663 │            5 │            1073 │ … │           276 │ 2011-06-07 00:00:00 │ 10-4020-000510 │
│        43664 │            5 │             876 │ … │           280 │ 2011-06-07 00:00:00 │ 10-4020-000397 │
│        43665 │            5 │             849 │ … │           283 │ 2011-06-07 00:00:00 │ 10-4020-000146 │
│        43666 │            5 │            1074 │ … │           276 │ 2011-06-07 00:00:00 │ 10-4020-000511 │
│        43667 │            5 │             629 │ … │           277 │ 2011-06-07 00:00:00 │ 10-4020-000646 │
│        43668 │            5 │             529 │ … │           282 │ 2011-06-07 00:00:00 │ 10-4020-000514 │
├──────────────┴──────────────┴─────────────────┴───┴───────────────┴─────────────────────┴────────────────┤
│ 10 rows                                                                             23 columns (6 shown) │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Когда вы успешно настроили проект dbt и базу данных, мы можем перейти к следующей части, чтобы определить таблицы, необходимые для размерной модели.

## Часть 2: Определение бизнес-процесса {#part-2-identify-the-business-process}

Теперь, когда вы настроили проект dbt, базу данных и взглянули на схему, пришло время определить бизнес-процесс.

Определение бизнес-процесса осуществляется в сотрудничестве с бизнес-пользователем. Бизнес-пользователь имеет контекст вокруг бизнес-целей и бизнес-процессов и может предоставить вам эту информацию.

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/conversation.png" title="Разговор между бизнес-пользователем и аналитическим инженером"/>

Поговорив с генеральным директором AdventureWorks, вы узнаете следующую информацию:

> AdventureWorks производит велосипеды и продает их потребителям (B2C) и бизнесам (B2B). Велосипеды отправляются клиентам по всему миру. Как генеральный директор компании, я хотел бы знать, сколько дохода мы получили за год, заканчивающийся в 2011 году, с разбивкой по:
- Категории и подкатегории продукта
- Клиенту
- Статусу заказа
- Стране, штату и городу доставки

На основе информации, предоставленной бизнес-пользователем, вы определили, что бизнес-процесс, о котором идет речь, — это ***Процесс продаж***. В следующей части вы собираетесь разработать размерную модель для процесса продаж.

## Часть 3: Определение таблиц фактов и измерений {#part-3-identify-the-fact-and-dimension-tables}

На основе информации, предоставленной в предыдущей части, мы хотим создать размерную модель, которая представляет процесс продаж бизнеса и также позволяет анализировать данные по:

- Категории и подкатегории продукта
- Клиенту
- Статусу заказа
- Стране, штату и городу доставки
- Дате (год, месяц, день)

### Таблицы фактов {#fact-tables}

:::info
[Таблицы фактов](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/facts-for-measurement/) — это таблицы базы данных, которые представляют бизнес-процесс в реальном мире. Каждая запись в таблице фактов представляет бизнес-событие, такое как:

- Продажа товара
- Клик на сайте
- Производственный заказ
:::

В схеме продаж есть две таблицы, которые привлекают наше внимание. Эти две таблицы могут быть использованы для создания таблицы фактов для процесса продаж:

- Таблица `sales.salesorderheader` содержит информацию о кредитной карте, использованной в заказе, адресе доставки и клиенте. Каждая запись в этой таблице представляет заголовок заказа, содержащий одну или несколько деталей заказа.
- Таблица `sales.salesorderdetail` содержит информацию о заказанном продукте, количестве заказа и цене за единицу, которые мы можем использовать для расчета дохода. Каждая запись в этой таблице представляет одну деталь заказа.

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/sales-order-header-detail.png" width="85%" title="Заголовок и детали заказа на продажу"/>

Давайте определим таблицу фактов под названием `fct_sales`, которая объединяет `sales.salesorderheader` и `sales.salesorderdetail`. Каждая запись в таблице фактов (также известная как [зерно](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/grain/)) — это деталь заказа.

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/fct_sales.png" width="85%" title="Таблица fct_sales"/>

### Таблицы измерений {#dimension-tables}

:::info
[Таблицы измерений](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/dimensions-for-context/) используются для представления контекстной или описательной информации для события бизнес-процесса. Примеры измерений включают:

- Детали клиента: Кто является клиентом для определенного номера заказа?
- Детали местоположения клика на сайте: На какую кнопку пользователь нажимает?
- Детали продукта: Каковы детали продукта, добавленного в корзину?
:::

На основе бизнес-вопросов, на которые наш бизнес-пользователь хотел бы получить ответы, мы можем определить несколько таблиц, которые содержат полезную контекстную информацию для нашего бизнес-процесса:

- `person.address`
- `person.countryregion`
- `production.product`
- `production.productcategory`
- `sales.customer`
- `sales.store`
- И многие другие …

Существуют разные способы создания таблиц измерений. Мы могли бы использовать существующие отношения между таблицами, как показано на диаграмме ниже.

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/snowflake-schema.png" width="85%" title="Схема снежинки"/>

Это известно как дизайн схемы снежинки, где таблица фактов является центром снежинки, и от центра снежинки отходят многие фракталы. Однако это приводит к множеству соединений, которые должны быть выполнены потребителем размерной модели.

Вместо этого мы можем денормализовать таблицы измерений, выполняя соединения.

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/star-schema.png" width="85%" title="Схема звезды"/>

Это известно как схема звезды, и этот подход уменьшает количество соединений, которые должны быть выполнены потребителем размерной модели.

Используя подход схемы звезды, мы можем определить 6 измерений, которые помогут нам ответить на бизнес-вопросы:

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/dimension-tables.png" width="85%" title="Таблицы измерений"/>

- `dim_product`: таблица измерений, объединяющая `product`, `productsubcategory`, `productcategory`
- `dim_address`: таблица измерений, объединяющая `address`, `stateprovince`, `countryregion`
- `dim_customer`: таблица измерений, объединяющая `customer`, `person`, `store`
- `dim_credit_card`: таблица измерений, созданная из `creditcard`
- `dim_order_status`: таблица измерений, созданная путем выбора уникальных статусов из `salesorderheader`
- `dim_date`: специально сгенерированная таблица измерений, содержащая атрибуты даты с использованием пакета [dbt_date](https://hub.getdbt.com/calogica/dbt_date/latest/).

:::note
Мы вручную заполнили таблицу `dim_date`, так как DuckDB не поддерживается пакетом dbt_date.
:::

В следующей части мы используем dbt для создания таблиц фактов и измерений, которые мы определили.

## Часть 4: Создание таблиц измерений {#part-4-create-the-dimension-tables}

Давайте сначала создадим `dim_product`. Остальные таблицы измерений будут использовать те же шаги, которые мы собираемся пройти.

### Шаг 1: Создание файлов моделей {#step-1-create-model-files}

Давайте создадим новые файлы моделей dbt, которые будут содержать наш код преобразования. В каталоге `adventureworks/models/marts/` создайте два файла:

- `dim_product.sql`: Этот файл будет содержать наш SQL-код преобразования.
- `dim_product.yml`: Этот файл будет содержать нашу документацию и тесты для `dim_product`.

```
adventureworks/models/
└── marts
    ├── dim_product.sql
    ├── dim_product.yml
```

### Шаг 2: Извлечение данных из вышестоящих таблиц {#step-2-fetch-data-from-the-upstream-tables}

В `dim_product.sql` вы можете выбрать данные из вышестоящих таблиц, используя Общие Табличные Выражения (CTE).

```sql
with stg_product as (
    select *
    from {{ ref('product') }}
),

stg_product_subcategory as (
    select *
    from {{ ref('productsubcategory') }}
),

stg_product_category as (
    select *
    from {{ ref('productcategory') }}
)

... 
```

Мы используем функцию `ref`, чтобы ссылаться на вышестоящие таблицы и создавать <Term id="dag">ориентированный ациклический граф (DAG)</Term> зависимостей.

### Шаг 3: Выполнение соединений {#step-3-perform-the-joins}

Далее выполните соединения между <Term id="cte">CTE</Term> таблицами, используя соответствующие ключи соединения.

```sql
...

select
    ... 
from stg_product
left join stg_product_subcategory on stg_product.productsubcategoryid = stg_product_subcategory.productsubcategoryid
left join stg_product_category on stg_product_subcategory.productcategoryid = stg_product_category.productcategoryid
```

### Шаг 4: Создание суррогатного ключа {#step-4-create-the-surrogate-key}

:::info
[Суррогатные ключи](https://www.kimballgroup.com/1998/05/surrogate-keys/) предоставляют потребителям размерной модели простой в использовании ключ для соединения таблиц фактов и измерений, без необходимости понимания основного бизнес-контекста.
:::

Существует несколько подходов к созданию <Term id="surrogate-key">суррогатного ключа</Term>:

- **Хеширование суррогатного ключа**: суррогатный ключ, который создается путем хеширования уникальных ключей таблицы (например, `md5(key_1, key_2, key_3)`).
- **Инкрементный суррогатный ключ**: суррогатный ключ, который создается с использованием числа, которое всегда увеличивается (например, `row_number()`).
- **Конкатенация суррогатного ключа**: суррогатный ключ, который создается путем конкатенации уникальных столбцов ключей (например, `concat(key_1, key_2, key_3)`).

Мы используем, пожалуй, самый простой подход, который заключается в выполнении хеширования уникальных столбцов ключей таблицы измерений. Этот подход устраняет необходимость выполнения соединения с таблицами измерений при генерации суррогатного ключа для таблиц фактов позже.

Для генерации суррогатного ключа мы используем макрос dbt, предоставляемый пакетом `dbt_utils`, под названием `generate_surrogate_key()`. Макрос генерации суррогатного ключа использует соответствующую функцию хеширования из вашей базы данных для генерации суррогатного ключа из списка столбцов ключей (например, `md5()`, `hash()`). Подробнее о [макросе generate_surrogate_key](https://docs.getdbt.tech/blog/sql-surrogate-keys).

```sql
...

select
    {{ dbt_utils.generate_surrogate_key(['stg_product.productid']) }} as product_key, 
    ... 
from stg_product
left join stg_product_subcategory on stg_product.productsubcategoryid = stg_product_subcategory.productsubcategoryid
left join stg_product_category on stg_product_subcategory.productcategoryid = stg_product_category.productcategoryid
```

### Шаг 5: Выбор столбцов таблицы измерений {#step-5-select-dimension-table-columns}

Теперь вы можете выбрать столбцы таблицы измерений, чтобы они могли быть использованы вместе с таблицей фактов позже. Мы выбираем столбцы, которые помогут нам ответить на ранее определенные бизнес-вопросы.

```sql
...

select
    {{ dbt_utils.generate_surrogate_key(['stg_product.productid']) }} as product_key, 
    stg_product.productid,
    stg_product.name as product_name,
    stg_product.productnumber,
    stg_product.color,
    stg_product.class,
    stg_product_subcategory.name as product_subcategory_name,
    stg_product_category.name as product_category_name
from stg_product
left join stg_product_subcategory on stg_product.productsubcategoryid = stg_product_subcategory.productsubcategoryid
left join stg_product_category on stg_product_subcategory.productcategoryid = stg_product_category.productcategoryid
```

### Шаг 6: Выбор типа материализации {#step-6-choose-a-materialization-type}

Вы можете выбрать один из следующих типов материализации, поддерживаемых dbt:

- View
- Table
- Incremental

Обычно таблицы измерений материализуются как `table` или `view`, так как объемы данных в таблицах измерений обычно не очень большие. В этом примере мы выбрали `table` и установили тип материализации для всех размерных моделей в схеме `marts` как `table` в `dbt_project.yml`.

```sql
models:
  adventureworks:
    marts:
      +materialized: table
      +schema: marts
```

### Шаг 7: Создание документации и тестов модели {#step-7-create-model-documentation-and-tests}

Вместе с нашей моделью `dim_product.sql` мы можем заполнить соответствующий файл `dim_product.yml`, чтобы задокументировать и протестировать нашу модель.

```yaml
version: 2

models:
  - name: dim_product
    columns:
      - name: product_key 
        description: Суррогатный ключ продукта
        tests:
          - not_null
          - unique
      - name: productid 
        description: Естественный ключ продукта
        tests:
          - not_null
          - unique
      - name: product_name 
        description: Название продукта
        tests:
          - not_null
```

### Шаг 8: Построение моделей dbt {#step-8-build-dbt-models}

Выполните команды [dbt run](https://docs.getdbt.tech/reference/commands/run) и [dbt test](https://docs.getdbt.tech/reference/commands/run), чтобы запустить и протестировать ваши модели dbt:

```
dbt run && dbt test 
```

Теперь мы завершили все шаги для создания таблицы измерений. Мы можем повторить те же шаги для всех таблиц измерений, которые мы определили ранее. Убедитесь, что вы создали все таблицы измерений, прежде чем переходить к следующей части.

## Часть 5: Создание таблицы фактов {#part-5-create-the-fact-table}

После того как мы создали все необходимые таблицы измерений, мы можем создать таблицу фактов для `fct_sales`.

### Шаг 1: Создание файлов моделей {#step-1-create-model-files-1}

Давайте создадим новые файлы моделей dbt, которые будут содержать наш код преобразования. В каталоге `adventureworks/models/marts/` создайте два файла:

- `fct_sales.sql`: Этот файл будет содержать наш SQL-код преобразования.
- `fct_sales.yml`: Этот файл будет содержать нашу документацию и тесты для `fct_sales`.

```
adventureworks/models/
└── marts
    ├── fct_sales.sql
    ├── fct_sales.yml
```

### Шаг 2: Извлечение данных из вышестоящих таблиц {#step-2-fetch-data-from-the-upstream-tables-1}

Чтобы ответить на бизнес-вопросы, нам нужны столбцы как из `salesorderheader`, так и из `salesorderdetail`. Давайте отразим это в `fct_sales.sql`:

```sql
with stg_salesorderheader as (
    select
        salesorderid,
        customerid,
        creditcardid,
        shiptoaddressid,
        status as order_status,
        cast(orderdate as date) as orderdate
    from {{ ref('salesorderheader') }}
),

stg_salesorderdetail as (
    select
        salesorderid,
        salesorderdetailid,
        productid,
        orderqty,
        unitprice,
        unitprice * orderqty as revenue
    from {{ ref('salesorderdetail') }}
)

... 
```

### Шаг 3: Выполнение соединений {#step-3-perform-joins}

Зерно таблицы `fct_sales` — это одна запись в таблице SalesOrderDetail, которая описывает количество продукта в SalesOrderHeader. Поэтому мы выполняем соединение между `salesorderheader` и `salesorderdetail`, чтобы достичь этого зерна.

```sql
... 

select
    ... 
from stg_salesorderdetail
inner join stg_salesorderheader on stg_salesorderdetail.salesorderid = stg_salesorderheader.salesorderid
```

### Шаг 4: Создание суррогатного ключа {#step-4-create-the-surrogate-key-1}

Далее мы создаем суррогатный ключ для уникальной идентификации каждой строки в таблице фактов. Каждая строка в таблице `fct_sales` может быть уникально идентифицирована с помощью `salesorderid` и `salesorderdetailid`, поэтому мы используем оба столбца в макросе `generate_surrogate_key()`.

```sql
... 

select
    {{ dbt_utils.generate_surrogate_key(['stg_salesorderdetail.salesorderid', 'salesorderdetailid']) }} as sales_key,
		... 
from stg_salesorderdetail
inner join stg_salesorderheader on stg_salesorderdetail.salesorderid = stg_salesorderheader.salesorderid
```

### Шаг 5: Выбор столбцов таблицы фактов {#step-5-select-fact-table-columns}

Теперь вы можете выбрать столбцы таблицы фактов, которые помогут нам ответить на ранее определенные бизнес-вопросы. Мы хотим иметь возможность рассчитать сумму дохода, и поэтому мы включаем столбец дохода на каждую деталь заказа, который был рассчитан выше как `unitprice * orderqty as revenue`.

```sql
...

select
    {{ dbt_utils.generate_surrogate_key(['stg_salesorderdetail.salesorderid', 'salesorderdetailid']) }} as sales_key,
    stg_salesorderdetail.salesorderid,
    stg_salesorderdetail.salesorderdetailid,
    stg_salesorderdetail.unitprice,
    stg_salesorderdetail.orderqty,
    stg_salesorderdetail.revenue
from stg_salesorderdetail
inner join stg_salesorderheader on stg_salesorderdetail.salesorderid = stg_salesorderheader.salesorderid
```

### Шаг 6: Создание внешних суррогатных ключей {#step-6-create-foreign-surrogate-keys}

Мы хотим иметь возможность анализировать нашу таблицу фактов в разрезе таблиц измерений, которые мы создали на предыдущем шаге. Поэтому нам нужно создать внешние суррогатные ключи, которые будут использоваться для соединения таблицы фактов с таблицами измерений.

Мы достигаем этого, применяя макрос `generate_surrogate_key()` к тем же уникальным столбцам идентификаторов, которые мы использовали ранее при генерации суррогатных ключей в таблицах измерений.

```sql
...

select
    {{ dbt_utils.generate_surrogate_key(['stg_salesorderdetail.salesorderid', 'salesorderdetailid']) }} as sales_key,
    {{ dbt_utils.generate_surrogate_key(['productid']) }} as product_key,
    {{ dbt_utils.generate_surrogate_key(['customerid']) }} as customer_key,
    {{ dbt_utils.generate_surrogate_key(['creditcardid']) }} as creditcard_key,
    {{ dbt_utils.generate_surrogate_key(['shiptoaddressid']) }} as ship_address_key,
    {{ dbt_utils.generate_surrogate_key(['order_status']) }} as order_status_key,
    {{ dbt_utils.generate_surrogate_key(['orderdate']) }} as order_date_key,
    stg_salesorderdetail.salesorderid,
    stg_salesorderdetail.salesorderdetailid,
    stg_salesorderdetail.unitprice,
    stg_salesorderdetail.orderqty,
    stg_salesorderdetail.revenue
from stg_salesorderdetail
inner join stg_salesorderheader on stg_salesorderdetail.salesorderid = stg_salesorderheader.salesorderid
```

### Шаг 7: Выбор типа материализации {#step-7-choose-a-materialization-type}

Вы можете выбрать один из следующих типов материализации, поддерживаемых dbt:

- View
- Table
- Incremental

Обычно таблицы фактов материализуются как `incremental` или `table` в зависимости от объема данных. [Как правило](/docs/build/incremental-models-overview#when-to-use-an-incremental-model), если вы преобразуете миллионы или миллиарды строк, то вам следует начать использовать материализацию `incremental`. В этом примере мы выбрали `table` для простоты.

### Шаг 8: Создание документации и тестов модели {#step-8-create-model-documentation-and-tests}

Вместе с нашей моделью `fct_sales.sql` мы можем заполнить соответствующий файл `fct_sales.yml`, чтобы задокументировать и протестировать нашу модель.

```yaml
version: 2

models:
  - name: fct_sales
    columns:

      - name: sales_key
        description: Суррогатный ключ продаж
        tests:
          - not_null
          - unique

      - name: product_key
        description: Внешний ключ продукта
        tests:
          - not_null

      - name: customer_key
        description: Внешний ключ клиента
        tests:
          - not_null 
      
      ... 

      - name: orderqty
        description: Количество продукта 
        tests:
          - not_null

      - name: revenue
        description: Доход, полученный путем умножения unitprice и orderqty
```

### Шаг 9: Построение моделей dbt {#step-9-build-dbt-models}

Выполните команды [dbt run](https://docs.getdbt.tech/reference/commands/run) и [dbt test](https://docs.getdbt.tech/reference/commands/run), чтобы запустить и протестировать ваши модели dbt:

```
dbt run && dbt test 
```

Отличная работа, вы успешно создали свои первые таблицы фактов и измерений! Наша размерная модель теперь завершена!! 🎉

## Часть 6: Документирование отношений размерной модели {#part-6-document-the-dimensional-model-relationships}

Давайте упростим потребителям нашей размерной модели понимание отношений между таблицами, создав [Диаграмму сущностей и связей (ERD)](https://www.visual-paradigm.com/guide/data-modeling/what-is-entity-relationship-diagram/).

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/target-schema.png" width="85%" title="Итоговая ERD размерной модели"/>

ERD позволит потребителям нашей размерной модели быстро определить ключи и тип отношений (один-к-одному, один-ко-многим), которые необходимо использовать для соединения таблиц.

## Часть 7: Использование размерной модели {#part-7-consume-dimensional-model}

Наконец, мы можем использовать нашу размерную модель, подключив наш склад данных к нашим инструментам бизнес-аналитики (BI), таким как Tableau, Power BI и Looker.

Большинство современных BI-инструментов имеют встроенный семантический слой, который поддерживает отношения между таблицами, что необходимо, если мы хотим использовать размерные модели напрямую без дополнительных преобразований данных.

В Looker, например, мы можем определить отношения, используя [LookML](https://cloud.google.com/looker/docs/what-is-lookml):

```
explore: fct_order {
  join: dim_user {
    sql_on: ${fct_order.user_key} = ${dim_user.user_key} ;;
    relationship: many_to_one
  }
}
```

Если ваш BI-инструмент не имеет семантического слоя, поддерживающего отношения, то вам придется отразить это отношение, создав One Big Table (OBT), который соединяет таблицу фактов со всеми ее таблицами измерений.

```sql
with f_sales as (
    select * from {{ ref('fct_sales') }}
),

d_customer as (
    select * from {{ ref('dim_customer') }}
),

d_credit_card as (
    select * from {{ ref('dim_credit_card') }}
),

d_address as (
    select * from {{ ref('dim_address') }}
),

d_order_status as (
    select * from {{ ref('dim_order_status') }}
),

d_product as (
    select * from {{ ref('dim_product') }}
),

d_date as (
    select * from {{ ref('dim_date') }}
)

select
    {{ dbt_utils.star(from=ref('fct_sales'), relation_alias='f_sales', except=[
        "product_key", "customer_key", "creditcard_key", "ship_address_key", "order_status_key", "order_date_key"
    ]) }},
    {{ dbt_utils.star(from=ref('dim_product'), relation_alias='d_product', except=["product_key"]) }},
    {{ dbt_utils.star(from=ref('dim_customer'), relation_alias='d_customer', except=["customer_key"]) }},
    {{ dbt_utils.star(from=ref('dim_credit_card'), relation_alias='d_credit_card', except=["creditcard_key"]) }},
    {{ dbt_utils.star(from=ref('dim_address'), relation_alias='d_address', except=["address_key"]) }},
    {{ dbt_utils.star(from=ref('dim_order_status'), relation_alias='d_order_status', except=["order_status_key"]) }},
    {{ dbt_utils.star(from=ref('dim_date'), relation_alias='d_date', except=["date_key"]) }}
from f_sales
left join d_product on f_sales.product_key = d_product.product_key
left join d_customer on f_sales.customer_key = d_customer.customer_key
left join d_credit_card on f_sales.creditcard_key = d_credit_card.creditcard_key
left join d_address on f_sales.ship_address_key = d_address.address_key
left join d_order_status on f_sales.order_status_key = d_order_status.order_status_key
left join d_date on f_sales.order_date_key = d_date.date_key
```

В приведенном выше OBT мы выполняем соединения между таблицей фактов и таблицами измерений, используя суррогатные ключи.

Используя `dbt_utils.star()`, мы выбираем все столбцы, кроме столбцов суррогатных ключей, так как суррогатные ключи не имеют никакого значения, кроме как быть полезными для соединений.

Затем мы можем построить OBT, запустив `dbt run`. Ваш DAG dbt теперь должен выглядеть так:

<Lightbox src="/img/blog/2023-04-18-building-a-kimball-dimensional-model-with-dbt/dbt-dag.png" width="85%" title="Итоговый DAG dbt"/>

Поздравляем, вы дошли до конца этого руководства. Если вы хотите узнать больше, пожалуйста, ознакомьтесь с учебными ресурсами ниже по размерному моделированию.

## Учебные ресурсы {#learning-resources}

- [Учебные ресурсы группы Кимбалла](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/)
- [Книга The Data Warehouse toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/)
- [Обсуждение dbt о том, актуально ли еще размерное моделирование](https://discourse.getdbt.com/t/is-kimball-dimensional-modeling-still-relevant-in-a-modern-data-warehouse/225)
- [Глоссарий dbt по размерному моделированию](https://www.getdbt.com/blog/guide-to-dimensional-modeling)

Если у вас есть вопросы по материалу, пожалуйста, свяжитесь со мной в сообществе dbt Slack (@Jonathan Neo) или на [LinkedIn](https://www.linkedin.com/in/jonneo/).

*Примечание автора: Материалы в этой статье были созданы [Data Engineer Camp](https://dataengineercamp.com/), 16-недельным буткемпом по инженерии данных для профессионалов, желающих перейти в инженерию данных и аналитическую инженерию. Статья была написана Джонатаном Нео, с редакционным и техническим руководством от [Кенни Нинга](https://www.linkedin.com/in/kenny-ning/) и редакционным обзором от [Пола Халласте](https://www.linkedin.com/in/paulhallaste/) и [Джоша Девлина](https://www.linkedin.com/in/josh-devlin/).*