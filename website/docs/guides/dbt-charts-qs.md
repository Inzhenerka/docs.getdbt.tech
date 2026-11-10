---
title: "Краткое руководство по dbt Charts"
id: "dbt-charts"
description: "Создайте проект dbt локально, вручную напишите свою первую панель dbt Charts и просмотрите её в браузере."
hoverSnippet: "Создайте проект dbt локально, вручную напишите свою первую панель dbt Charts и просмотрите её в браузере."
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Charts', 'Quickstart']
level: 'Beginner'
---

<div style={{maxWidth: '900px'}}>

## Введение

dbt Charts — это слой визуализации, который превращает YAML-файлы в интерактивные дашборды. Вы определяете запросы, диаграммы и макеты в текстовом виде и храните их в Git вместе с проектом dbt. Поскольку dbt Charts выполняет запросы непосредственно к вашим моделям dbt, дашборды остаются согласованными с теми же преобразованиями, которым ваша команда уже доверяет.

Вы разрабатываете панели dbt Charts локально с помощью инструмента командной строки `dct`: он читает файл панели, выполняет её запросы через подключение из вашего dbt-файла `profiles.yml` и отображает результат в браузере с автоматическим обновлением при редактировании.

В этом кратком руководстве вы научитесь:

- Создавать каталог `charts/` и файл панели вручную.
- Создавать первые пять визуализаций &mdash; линейную, столбчатую, с областями, круговую диаграммы и таблицу &mdash; на основе моделей dbt.
- Устанавливать dbt Charts и просматривать панель локально.

В этом руководстве используется пример проекта [`fusion-jaffle-shop`](https://github.com/matthewshaver/jaffle-shop-multi-adapter), рассчитанный на v1.12+ и включающий такие витрины данных, как `order_items` и `location_performance`. По завершении у вас будет панель, которая показывает динамику выручки, сравнивает показатели разных магазинов и отображает ключевые показатели эффективности (KPI) для каждого магазина.

### Предварительные требования

- У вас [установлен dbt v1.12+](/docs/local/install-dbt?version=2). В этом руководстве предполагается использование <Constant name="fusion" />.
  - Если вы используете v2, необходимо установить адаптер v1, чтобы проект dbt Charts загружался в браузере. Дополнительная настройка не требуется. Например, если вы используете Snowflake, выполните `pip install dbt-snowflake` перед установкой dbt Charts. По мере развития dbt Charts это требование будет снято.
- У вас установлен [Git](https://git-scm.com/downloads), и вы знакомы с основами работы в командной строке и с YAML.
- У вас установлен [Python](https://www.python.org/downloads/) 3.9 или более поздней версии и менеджер пакетов, например [uv](https://docs.astral.sh/uv/) или `pip`, для установки инструмента `dct`.
- У вас есть рабочее подключение к платформе данных (в этом руководстве используется Snowflake), на которой dbt может создавать модели.

### Связанные материалы

- [Создание моделей dbt](/docs/build/models)
- [Как мы организуем проекты dbt](/best-practices/how-we-structure/1-guide-overview)
- [Типы запросов dbt Charts](https://docs.dataface.com/queries/)
- [Документация dbt Charts](https://docs.dataface.com/)

## Клонирование примера проекта и его сборка

dbt Charts выполняет запросы к таблицам, которые уже существуют на вашей платформе данных, поэтому сначала создайте модели проекта, а затем стройте на их основе диаграммы.

1. Клонируйте пример проекта и перейдите в его каталог:

    ```bash
    git clone https://github.com/matthewshaver/jaffle-shop-multi-adapter.git
    cd fusion-jaffle-shop
    ```

2. Добавьте `profiles.yml` для вашей платформы данных. В файле `dbt_project.yml` проекта задано `profile: default`, поэтому назовите профиль `default` и добавьте в него целевое окружение `dev`. dbt читает `profiles.yml` из корня проекта, а если его там нет — использует `~/.dbt/profiles.yml`. Поля для конкретной платформы описаны в разделе [Профили подключения](/docs/local/connect-data-platform/about-dbt-connections).

3. Установите пакеты проекта:

    ```bash
    dbt deps
    ```

4. Загрузите исходные CSV-файлы как seed-данные, создайте модели и запустите тесты одной командой:

    ```bash
    dbt build
    ```

    Команда `dbt build` выполняет seed-файлы, модели, снимки и тесты в порядке зависимостей, поэтому отдельный шаг `dbt seed` не нужен. Полный список команд приведён в разделе [Команды dbt](/reference/dbt-commands).

5. Убедитесь, что витрина данных, к которой будут обращаться диаграммы, возвращает строки:

    ```bash
    dbt show --inline "select count(*) from {{ ref('order_items') }}"
    ```

:::note
Запишите базу данных и схему, в которых dbt создал модели, &mdash; они понадобятся в SQL-запросах диаграмм. Чтобы найти их, выполните `dbt list --output json` и посмотрите значение `relation_name` для каждой модели.
:::

## Создание каталога charts и файла панели

Пример проекта не содержит файлов dbt Charts, поэтому вы создадите их самостоятельно. Для dbt Charts нужны две вещи: конфигурационный файл проекта в корневом каталоге, объявляющий источник данных, и хотя бы один файл панели в каталоге `charts/`.

1. В корне проекта создайте каталог для панелей:

    ```bash
    mkdir charts
    ```

    Каждый файл `.yaml`, `.yml` и `.md` в каталоге `charts/` становится доступной для просмотра страницей, а вложенные каталоги — вложенными путями.

2. Создайте `dbt_charts.yml` в корне проекта. При локальной работе dbt Charts использует ваше подключение dbt &mdash; отдельная настройка учётных данных не требуется. Объявите источник, указывающий на профиль и целевое окружение dbt, а в панелях ссылайтесь на него по имени:

    <File name='dbt_charts.yml'>

    ```yaml
    sources:
      analytics:
        type: dbt_profile
        profile: default
        target: dev
    ```

    </File>

    Значения `profile` и `target` должны соответствовать вашему `profiles.yml` (`default` и `dev` в этом проекте). Учётные данные остаются в `profiles.yml`, включая аутентификацию Snowflake по паре ключей через `private_key_path`, если она требуется для вашей учётной записи.

3. Создайте пустой файл панели `charts/analytics.yml` и укажите в нём заголовок и источник:

    <File name='charts/analytics.yml'>

    ```yaml
    title: "Jaffle Shop overview"
    source: analytics
    ```

    </File>

На следующих двух шагах вы добавите в этот файл запросы и диаграммы, а затем макет, определяющий их расположение.

## Добавление первых пяти диаграмм

Теперь добавьте в `charts/analytics.yml` пять визуализаций — по одной для каждого из наиболее распространённых типов. Каждая диаграмма ссылается на SQL-запрос, определённый в блоке `queries:`, и сопоставляет выходные столбцы этого запроса с каналами диаграммы (`x`, `y`, `theta`, `color`).

Каждый фрагмент ниже содержит запрос и диаграмму, которые нужно добавить. Диаграммы не отобразятся, пока вы не добавите макет на следующем шаге; полный файл приведён в разделе [Размещение элементов панели](/guides/dbt-charts?step=5).

Каждый запрос ссылается на модель по её полному имени. Замените `MY_DATABASE.MY_SCHEMA` на базу данных и схему, в которых dbt создал ваши витрины данных. В SQL используется синтаксис Snowflake, поэтому при работе с другой платформой адаптируйте такие функции, как `date_trunc`.

### 1. Линейная диаграмма: динамика выручки

Линейные диаграммы показывают изменение показателей во времени. Этот запрос агрегирует выручку по месяцам на основе модели `order_items`.

```yaml
queries:
  revenue_by_month:
    sql: |
      SELECT date_trunc('month', ordered_at) AS month,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1
      ORDER BY 1

charts:
  revenue_trend:
    type: line
    query: revenue_by_month
    x: month
    y: revenue
    title: "Revenue by month"
```

### 2. Столбчатая диаграмма: выручка по магазинам

Столбчатые диаграммы позволяют сравнивать значения между категориями. Этот запрос получает предварительно агрегированную выручку по каждому магазину из витрины `location_performance`.

```yaml
queries:
  revenue_by_location:
    sql: |
      SELECT location_name,
             total_revenue AS revenue
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC

charts:
  revenue_by_location:
    type: bar
    query: revenue_by_location
    x: location_name
    y: revenue
    title: "Revenue by location"
```

### 3. Диаграмма с областями: накопленная выручка

Диаграммы с областями подчёркивают накопление значений во времени. Этот запрос использует оконную функцию для расчёта выручки нарастающим итогом по месяцам.

```yaml
queries:
  cumulative_revenue:
    sql: |
      SELECT month,
             sum(revenue) OVER (ORDER BY month) AS cumulative_revenue
      FROM (
        SELECT date_trunc('month', ordered_at) AS month,
               sum(product_price) AS revenue
        FROM MY_DATABASE.MY_SCHEMA.order_items
        GROUP BY 1
      )
      ORDER BY month

charts:
  cumulative_revenue:
    type: area
    query: cumulative_revenue
    x: month
    y: cumulative_revenue
    title: "Cumulative revenue"
```

### 4. Круговая диаграмма: выручка по типам продуктов

Круговые (секторные) диаграммы показывают соотношение частей и целого. Этот запрос разделяет выручку на еду и напитки. Секторная диаграмма использует `theta` для размера сектора и `color` для категории.

```yaml
queries:
  revenue_by_type:
    sql: |
      SELECT CASE WHEN is_food_item
                  THEN 'Food' ELSE 'Drink' END AS product_type,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1

charts:
  revenue_by_type:
    type: pie
    query: revenue_by_type
    theta: revenue
    color: product_type
    title: "Revenue by product type"
```

### 5. Таблица: KPI магазинов

Таблицы показывают подробные значения. Этот запрос выводит несколько столбцов для каждого магазина, формируя удобную для просмотра таблицу KPI.

```yaml
queries:
  location_kpis:
    sql: |
      SELECT location_name,
             total_revenue,
             total_orders,
             avg_order_value
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC

charts:
  location_kpis_table:
    type: table
    query: location_kpis
    title: "Location KPIs"
```

## Размещение элементов панели

Диаграммы не появятся, пока вы не укажете их в макете. В панелях используется `rows:` для вертикального размещения содержимого и `cols:` для размещения элементов рядом друг с другом. Объедините запросы и диаграммы из предыдущего шага в единые блоки `queries:` и `charts:`, затем добавьте макет, ссылающийся на каждую диаграмму по её ID.

Теперь ваш полный файл `charts/analytics.yml` должен выглядеть следующим образом, причём `MY_DATABASE.MY_SCHEMA` нужно заменить на базу данных и схему, в которых dbt создал ваши витрины данных:

<File name='charts/analytics.yml'>

```yaml
title: "Jaffle Shop overview"
source: analytics

queries:
  revenue_by_month:
    sql: |
      SELECT date_trunc('month', ordered_at) AS month,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1
      ORDER BY 1
  revenue_by_location:
    sql: |
      SELECT location_name,
             total_revenue AS revenue
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC
  cumulative_revenue:
    sql: |
      SELECT month,
             sum(revenue) OVER (ORDER BY month) AS cumulative_revenue
      FROM (
        SELECT date_trunc('month', ordered_at) AS month,
               sum(product_price) AS revenue
        FROM MY_DATABASE.MY_SCHEMA.order_items
        GROUP BY 1
      )
      ORDER BY month
  revenue_by_type:
    sql: |
      SELECT CASE WHEN is_food_item
                  THEN 'Food' ELSE 'Drink' END AS product_type,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1
  location_kpis:
    sql: |
      SELECT location_name,
             total_revenue,
             total_orders,
             avg_order_value
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC

charts:
  revenue_trend:
    type: line
    query: revenue_by_month
    x: month
    y: revenue
    title: "Revenue by month"
  revenue_by_location:
    type: bar
    query: revenue_by_location
    x: location_name
    y: revenue
    title: "Revenue by location"
  cumulative_revenue:
    type: area
    query: cumulative_revenue
    x: month
    y: cumulative_revenue
    title: "Cumulative revenue"
  revenue_by_type:
    type: pie
    query: revenue_by_type
    theta: revenue
    color: product_type
    title: "Revenue by product type"
  location_kpis_table:
    type: table
    query: location_kpis
    title: "Location KPIs"

rows:
  - title: "Trends"
    cols:
      - revenue_trend
      - cumulative_revenue
  - title: "Locations"
    cols:
      - revenue_by_location
      - revenue_by_type
  - title: "Detail"
    rows:
      - location_kpis_table
```

</File>

Теперь корневой каталог проекта должен содержать:

```shell
fusion-jaffle-shop/
├── charts/
│   └── analytics.yml      # Your board
├── dbt_charts.yml         # dbt Charts project config
├── dbt_project.yml
├── models/
├── profiles.yml
└── seeds/
```

## Установка dbt Charts и просмотр панели

dbt Charts поставляется в виде пакета Python с инструментом командной строки `dct`.

1. Установите dbt Charts с помощью `uv`:

    ```bash
    uv tool install dbt-charts
    ```

    Или с помощью `pip`:

    ```bash
    pip install dbt-charts
    ```

2. В корне проекта выполните проверку панели, чтобы выявить ошибки YAML, ссылок и SQL до её отображения:

    ```bash
    dct validate
    ```

    Без аргументов команда `dct validate` проверяет все панели в каталоге `charts/`. Передайте путь &mdash; `dct validate charts/analytics.yml` &mdash; для проверки одной панели.

3. Запустите локальный сервер разработки:

    ```bash
    dct serve
    ```

    `dct` поднимается от текущего каталога вверх в поисках `dbt_charts.yml` или `dbt_project.yml`, определяет диалект SQL по целевому окружению вашего профиля и выбирает порт на основе каталога проекта.

4. Откройте URL, который выведет `dct`. На странице перечислены все панели из каталога `charts/`. Выберите `analytics.yml`, чтобы открыть свою.

    Все пять визуализаций отображаются в трёх рядах: две диаграммы динамики рядом друг с другом, две диаграммы по магазинам под ними и таблица KPI внизу. Сервер автоматически обновляет страницу при редактировании YAML, поэтому оставьте его запущенным, пока вносите изменения.

5. При необходимости сформируйте статический результат, чтобы поделиться им или просмотреть скомпилированный SQL:

    ```bash
    dct render charts/analytics.yml --format html
    ```

## Устранение неполадок

- **Ошибка проверки `dbt_charts.yml`: extra inputs are not permitted** &mdash; `dbt_charts.yml` принимает фиксированный набор ключей верхнего уровня, таких как `sources` и `server`. Удалите все остальные, включая ключ `name`.
- **Диаграмма не показывает данные** &mdash; Убедитесь, что подключение из `profiles.yml` работает (`dbt debug`) и что роль, указанная в профиле, имеет право `SELECT` для схем, к которым обращаются ваши запросы.
- **Некоторые диаграммы показывают данные, а на остальных только нули** &mdash; Проверьте, не обращаются ли пустые диаграммы к модели, данные которой фильтруются в целевом окружении разработки. Часто для разработки данные ограничивают недавним временным интервалом, например с помощью макроса `limit_in_dev` для заказов. В статическом демонстрационном наборе данных такой интервал может исключить все строки и обнулить зависимые модели, тогда как модели без фильтра по-прежнему будут содержать данные. Привяжите интервал к максимальной временной метке самих данных с помощью `max()`, расширьте его или выполните сборку в целевом окружении, где этот фильтр не применяется.
- **Таблица или представление не найдены** &mdash; Убедитесь, что префикс базы данных и схемы в каждом `FROM` соответствует месту, где dbt фактически создаёт модель. Выполните `dbt list --output json` и посмотрите значение `relation_name`, чтобы узнать точное расположение.
- **Столбец не найден** &mdash; Каналы диаграммы (`x`, `y`, `theta`, `color`) должны соответствовать именам столбцов, которые возвращает `SELECT` вашего запроса. Задайте псевдонимы столбцов в SQL, чтобы имена совпадали.
- **Диаграмма отображается пустой** &mdash; Убедитесь, что `type` диаграммы поддерживает заданные вами каналы. Секторные диаграммы (круговые и кольцевые) используют `theta` и `color`, а не `x` и `y`.
- **`dct validate` предупреждает о повторной агрегации** &mdash; Запрос накопленной выручки намеренно суммирует уже агрегированный столбец, поэтому это предупреждение можно игнорировать. При этом `dct validate` завершается успешно.

## Что дальше

<ConfettiTrigger>

Поздравляем 🎉! Вы собрали проект dbt локально, создали собственный каталог dbt Charts и файл панели, добавили пять визуализаций на основе моделей dbt и просмотрели панель в браузере.

Теперь вы можете:

- Добавить интерактивность с помощью [переменных](https://docs.dataface.com/variables/), чтобы пользователи могли фильтровать данные по магазину или диапазону дат.
- Изучить другие [типы диаграмм](https://docs.dataface.com/charts/), например наборы однотипных диаграмм, многослойные диаграммы и карты.
- Добавить новые файлы в каталог `charts/` &mdash; каждый из них станет отдельной страницей, поэтому большой дашборд можно разделить на тематические панели.
- Построить диаграммы на основе других моделей dbt, добавив новые SQL-запросы, или изучить другие [типы запросов](https://docs.dataface.com/queries/), например значения и HTTP-источники.

</ConfettiTrigger>

</div>
