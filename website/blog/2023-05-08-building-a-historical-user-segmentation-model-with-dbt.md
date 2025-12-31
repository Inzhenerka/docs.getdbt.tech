---
title: "Создание модели исторической сегментации пользователей с помощью dbt"
description: "Узнайте, как использовать dbt для создания пользовательских сегментов и отслеживания их изменений во времени."
slug: historical-user-segmentation

authors: [santiago_jauregui]

tags: [аналитическое мастерство, dbt учебники, sql магия]
hide_table_of_contents: false

date: 2023-06-13
is_featured: true
---

## Введение {#introduction}

Большинство подходов к моделированию данных для сегментации клиентов основаны на широкой таблице с атрибутами пользователей. Эта таблица хранит только текущие атрибуты для каждого пользователя и затем загружается в различные SaaS платформы с помощью инструментов обратного ETL.

Возьмем, к примеру, команду по работе с клиентами (CX), которая использует Salesforce в качестве CRM. Пользователи создают заявки на помощь, и команда CX начинает их обрабатывать в порядке создания. Это хороший первый подход, но не основанный на данных.

Улучшением этого подхода было бы приоритизировать заявки на основе сегмента клиента, отвечая сначала нашим наиболее ценным клиентам. Инженер-аналитик может построить сегментацию для идентификации активных пользователей (например, с помощью подхода RFM) и сохранить ее в хранилище данных. Команда по обработке данных затем может экспортировать этот атрибут пользователя в CRM, позволяя команде по работе с клиентами строить правила на его основе.

<!--truncate-->
<Lightbox src="/img/blog/2023-05-08-building-a-historical-user-segmentation-model-with-dbt/rfm-segments-example.png" width="40%" title="Пример сегментации пользователей с помощью RFM"/>

## Проблемы {#problems}

Это довольно распространенный подход, который помогает командам аналитической инженерии добавлять ценность компании, выходя за рамки просто построения моделей, влияющих на отчеты или панели управления. Основная проблема здесь в том, что мы часто строим модели, которые показывают нам только последнее состояние каждого пользователя, что приводит к следующим вызовам.

### Проверка улучшения {#validating-the-improvement}

Предположим, что вам удалось построить сегментацию и экспортировать ее в CRM. Команда по работе с клиентами теперь приоритизирует заявки на основе ценности, добавленной вашим клиентом. Но как вы можете проверить, сработала ли эта инициатива на самом деле?

- Если вы проводите кампанию по удержанию и приоритизируете своих "Чемпионов", можете ли вы проверить, остаются ли они "Чемпионами" через месяц после того, как вы с ними связались? С предложенной ранее моделью вы не можете проверить, остается ли Чемпион чемпионом, потому что вы храните только последнее состояние клиента.
- Если вы проводите кампанию по активации и приоритизируете своих "Новых пользователей", вы также не можете проверить, стали ли они "Чемпионами" или "Гибернирующими" через месяц.

### Избыточность кода с учеными данных {#code-redundancy-with-data-scientists}

Также может быть так, что у вас в компании есть команда по науке о данных или машинному обучению (ML). Практики ML часто используют атрибуты пользователей в качестве входных данных для обучения своих моделей (также называемых признаками в контексте науки о данных). Чтобы этот атрибут был полезен в качестве признака в модели ML, им нужно знать, как он изменялся со временем.

В результате ученые данных часто переписывают ту же логику атрибутов пользователей на своем языке моделирования (обычно Python). Это приводит к потере усилий и несоответствиям в бизнес-логике между моделями машинного обучения и аналитической инженерии.

Лучшие практики аналитической инженерии ориентированы на помощь команде данных в повторном использовании моделей, построенных другими практиками. Нам нужно найти способ расширить это за пределы только аналитической команды и повлиять на команду данных в целом.

## Решение {#solution}

Подход к решению этой проблемы довольно прост; нам нужно построить модель, которая не просто учитывает последнее значение для каждого атрибута пользователя, а вместо этого сохраняет снимок того, как он изменялся со временем.

Один из способов решения этой задачи — использовать [снимки dbt](https://docs.getdbt.tech/docs/build/snapshots), но это будет сохранять историю атрибутов только с момента развертывания нашей модели, теряя потенциально полезные данные, существовавшие до этого момента.

Лучший подход для нашего случая использования — это вычисление снимков в нашей SQL-логике. Этот снимок можно вычислять в различных временных окнах (ежемесячно, еженедельно, ежедневно) в зависимости от типа анализа, который вам нужно выполнить.

В этом разделе мы покажем вам, как построить базовую модель сегментации пользователей с RFM, которая сохраняет только текущее значение, а затем мы рассмотрим изменения в коде для сохранения истории сегментации.

### Сегментация RFM {#rfm-segmentation}

Цель анализа RFM — сегментировать клиентов на группы на основе того, как недавно они совершили покупку (Recency), как часто они совершают покупки (Frequency) и сколько денег они тратят (Monetary).

Мы будем использовать только матрицу Recency и Frequency, а значение Monetary использовать в качестве вспомогательного атрибута. Это распространенный подход в компаниях, где Frequency и Monetary Value сильно коррелируют.

<Lightbox src="/img/blog/2023-05-08-building-a-historical-user-segmentation-model-with-dbt/rfm-segmentation-matrix.png" width="100%" title="Пример матрицы Recency и Frequency"/>

### Модель RFM для текущего сегмента {#rfm-model-for-current-segment}

Сначала мы используем `SELECT *` CTE, чтобы загрузить все наши данные о платежах. Колонки, которые мы будем использовать для сегментации, следующие:

- **user_id:** Уникальный идентификатор для каждого пользователя или клиента
- **payment_date:** Дата каждого платежа клиента
- **payment_id:** Уникальный идентификатор каждого платежа
- **payment_amount:** Сумма каждой транзакции

```sql
WITH payments AS(
    SELECT *
    FROM ref {{'fact_payments'}}
),
```

| user_id | payment_date | payment_id | payment_amount |
| --- | --- | --- | --- |
| A | 2022-11-28 14:41:45 | AA | 2588.35 |
| B | 2022-11-28 14:42:37 | BB | 10104.99 |
| C | 2022-11-28 14:42:51 | CC | 2588.35 |
| D | 2022-11-28 14:43:42 | DD | 580.5 |
| E | 2022-11-28 14:44:44 | EE | 462.36 |

Далее мы рассчитаем RFM (recency, frequency и monetary value) для каждого пользователя:

- **max_payment_date:** Дата последнего платежа каждого пользователя. Мы сохраняем ее для аудита
- **recency:** Дни, прошедшие с момента последней транзакции каждого пользователя до сегодняшнего дня
- **frequency:** Количество транзакций пользователя в анализируемом окне
- **monetary:** Сумма транзакций пользователя в анализируемом окне

```sql
rfm_values AS (
    SELECT  user_id,
            MAX(payment_date) AS max_payment_date,
            NOW() - MAX(payment_date) AS recency,
            COUNT(DISTINCT payment_id) AS frequency,
            SUM(payment_amount) AS monetary
    FROM payments
    GROUP BY user_id
),
```

| user_id | max_payment_date | recency | frequency | monetary |
| --- | --- | --- | --- | --- |
| A | 2023-04-20 10:22:39 | 4 18:20:22.034 | 4 | 83686.65 |
| B | 2023-04-20 10:56:15 | 4 17:46:46.034 | 13 | 53196.06 |
| C | 2023-04-24 13:19:18 | 0 15:23:43.034 | 22 | 56422.6 |
| D | 2023-04-19 19:00:24 | 5 09:42:37.034 | 4 | 2911.16 |
| E | 2023-03-23 19:22:00 | 32 09:21:01.034 | 40 | 30595.15 |

Существует несколько подходов к разделению пользователей на основе их значений RFM. В этой модели мы используем перцентили для разделения клиентов на группы на основе их относительного ранжирования в каждой из трех метрик, используя функцию `PERCENT_RANK()`.

```sql
rfm_percentiles AS (
    SELECT  user_id,
            recency,
            frequency,
            monetary,
            PERCENT_RANK() OVER (ORDER BY recency DESC) AS recency_percentile,
            PERCENT_RANK() OVER (ORDER BY frequency ASC) AS frequency_percentile,
            PERCENT_RANK() OVER (ORDER BY monetary ASC) AS monetary_percentile
    FROM rfm_values
),
```

| user_id | recency | frequency | monetary | recency_percentile | frequency_percentile | monetary_percentile |
| --- | --- | --- | --- | --- | --- | --- |
| A | 44 22:06:59.615 | 8 | 960.01 | 0.65 | 0.75 | 0.5 |
| B | 421 15:21:49.829 | 13 | 2348.49 | 0.09 | 0.84 | 0.78 |
| C | 1 15:04:48.922 | 7 | 3532.08 | 0.97 | 0.71 | 0.81 |
| D | 4 21:16:33.112 | 4 | 490.14 | 0.91 | 0.56 | 0.34 |
| E | 2 08:08:22.921 | 14 | 7239.69 | 0.95 | 0.85 | 0.28 |

Теперь, когда у нас есть перцентили каждого значения RFM для каждого пользователя, мы можем присвоить им оценку на основе того, где они находятся в распределении, с шагом 0.2 или 20%:

- **recency_score:** Значения перцентилей Recency, сгруппированные от 1 до 5
- **frequency_score:** Значения перцентилей Frequency, сгруппированные от 1 до 5
- **monetary_score:** Значения перцентилей Monetary, сгруппированные от 1 до 5

```sql
rfm_scores AS(
    SELECT  *,
            CASE
                WHEN recency_percentile >= 0.8 THEN 5
                WHEN recency_percentile >= 0.6 THEN 4
                WHEN recency_percentile >= 0.4 THEN 3
                WHEN recency_percentile >= 0.2 THEN 2
                ELSE 1
                END AS recency_score,
            CASE
                WHEN frequency_percentile >= 0.8 THEN 5
                WHEN frequency_percentile >= 0.6 THEN 4
                WHEN frequency_percentile >= 0.4 THEN 3
                WHEN frequency_percentile >= 0.2 THEN 2
                ELSE 1
                END AS frequency_score,
            CASE
                WHEN monetary_percentile >= 0.8 THEN 5
                WHEN monetary_percentile >= 0.6 THEN 4
                WHEN monetary_percentile >= 0.4 THEN 3
                WHEN monetary_percentile >= 0.2 THEN 2
                ELSE 1
                END AS monetary_score
    FROM rfm_percentiles
),
```

| user_id | recency_percentile | frequency_percentile | monetary_percentile | recency_score | frequency_score | monetary_score |
| --- | --- | --- | --- | --- | --- | --- |
| A | 0.26 | 0.3 | 0.12 | 2 | 2 | 1 |
| B | 0.94 | 0.38 | 0.23 | 5 | 2 | 2 |
| C | 0.85 | 0.96 | 0.87 | 5 | 5 | 5 |
| D | 0.71 | 0.63 | 0.93 | 4 | 4 | 5 |
| E | 0.67 | 0.51 | 0.76 | 4 | 3 | 5 |

Наконец, мы можем сегментировать пользователей по их оценкам частоты и недавности на основе предложенной матрицы R-F:

- **rfm_segment:** Сегмент каждого пользователя на основе сопоставления оценок недавности и частоты.

```sql

rfm_segment AS(
SELECT *,
        CASE
            WHEN recency_score <= 2
                AND frequency_score <= 2 THEN 'Hibernating'
            WHEN recency_score <= 2
                AND frequency_score <= 4 THEN 'At Risk'
            WHEN recency_score <= 2
                AND frequency_score <= 5 THEN 'Cannot Lose Them'
            WHEN recency_score <= 3
                AND frequency_score <= 2 THEN 'About to Sleep'
            WHEN recency_score <= 3
                AND frequency_score <= 3 THEN 'Need Attention'
            WHEN recency_score <= 4
                AND frequency_score <= 1 THEN 'Promising'
            WHEN recency_score <= 4
                AND frequency_score <= 3 THEN 'Potential Loyalists'
            WHEN recency_score <= 4
                AND frequency_score <= 5 THEN 'Loyal Customers'
            WHEN recency_score <= 5
                AND frequency_score <= 1 THEN 'New Customers'
            WHEN recency_score <= 5
                AND frequency_score <= 3 THEN 'Potential Loyalists'
            ELSE 'Champions'
        END AS rfm_segment
FROM  rfm_scores
)
SELECT *
FROM rfm_segment
```

| user_id | recency_score | frequency_score | monetary_score | rfm_segment |
| --- | --- | --- | --- | --- |
| A | 4 | 3 | 5 | Potential Loyalists |
| B | 4 | 5 | 5 | Loyal Customers |
| C | 5 | 4 | 5 | Champions |
| D | 1 | 5 | 5 | Cannot Lose Them |
| E | 1 | 4 | 5 | At Risk |

### Модель RFM с историей сегментации {#rfm-model-with-segmentation-history}

Следующий пример показывает, как можно построить модель со снимком атрибутов пользователя на конец каждого месяца. То же самое можно сделать для еженедельной модели с небольшими изменениями.

```sql
WITH payments AS(
    SELECT *
    FROM ref {{'fact_payments'}}
),
months AS(
	SELECT NOW() AS date_month
    UNION ALL
    SELECT DISTINCT date_month AS date_month
    FROM ref {{'dim_calendar'}}
),
payments_with_months AS(
    SELECT  user_id,
            date_month,
            payment_date,
            payment_id,
            payment_amount
    FROM months
        JOIN payments ON payment_date <= date_month 
),
rfm_values AS (
    SELECT  user_id,
            date_month,
            MAX(payment_date) AS max_payment_date,
            date_month - MAX(payment_date) AS recency,
            COUNT(DISTINCT payment_id) AS frequency,
            SUM(payment_amount) AS monetary
    FROM payments_with_months
    GROUP BY user_id, date_month
),
rfm_percentiles AS (
    SELECT  user_id,
            date_month,
            recency,
            frequency,
            monetary,
            PERCENT_RANK() OVER (ORDER BY recency DESC) AS recency_percentile,
            PERCENT_RANK() OVER (ORDER BY frequency ASC) AS frequency_percentile,
            PERCENT_RANK() OVER (ORDER BY monetary ASC) AS monetary_percentile
    FROM rfm_values
),
rfm_scores AS(
    SELECT  *,
            CASE
                WHEN recency_percentile >= 0.8 THEN 5
                WHEN recency_percentile >= 0.6 THEN 4
                WHEN recency_percentile >= 0.4 THEN 3
                WHEN recency_percentile >= 0.2 THEN 2
                ELSE 1
                END AS recency_score,
            CASE
                WHEN frequency_percentile >= 0.8 THEN 5
                WHEN frequency_percentile >= 0.6 THEN 4
                WHEN frequency_percentile >= 0.4 THEN 3
                WHEN frequency_percentile >= 0.2 THEN 2
                ELSE 1
                END AS frequency_score,
            CASE
                WHEN monetary_percentile >= 0.8 THEN 5
                WHEN monetary_percentile >= 0.6 THEN 4
                WHEN monetary_percentile >= 0.4 THEN 3
                WHEN monetary_percentile >= 0.2 THEN 2
                ELSE 1
                END AS monetary_score
    FROM rfm_percentiles
),
rfm_segment AS(
SELECT *,
        CASE
            WHEN recency_score <= 2
                AND frequency_score <= 2 THEN 'Hibernating'
            WHEN recency_score <= 2
                AND frequency_score <= 4 THEN 'At Risk'
            WHEN recency_score <= 2
                AND frequency_score <= 5 THEN 'Cannot Lose Them'
            WHEN recency_score <= 3
                AND frequency_score <= 2 THEN 'About to Sleep'
            WHEN recency_score <= 3
                AND frequency_score <= 3 THEN 'Need Attention'
            WHEN recency_score <= 4
                AND frequency_score <= 1 THEN 'Promising'
            WHEN recency_score <= 4
                AND frequency_score <= 3 THEN 'Potential Loyalists'
            WHEN recency_score <= 4
                AND frequency_score <= 5 THEN 'Loyal Customers'
            WHEN recency_score <= 5
                AND frequency_score <= 1 THEN 'New Customers'
            WHEN recency_score <= 5
                AND frequency_score <= 3 THEN 'Potential Loyalists'
            ELSE 'Champions'
        END AS rfm_segment
FROM  rfm_scores
)
SELECT *
FROM rfm_segment
```

Оригинальный запрос использует текущую дату (полученную с помощью функции `NOW()`) для расчета недавности каждого пользователя, тогда как новый подход включает 2 CTE, которые позволяют рассчитывать оценки RFM на ежемесячной основе.

- Первый CTE запрашивает таблицу календаря и выбирает столбец `date_month`. Он также добавляет строку с функцией `NOW()`, чтобы рассчитать атрибуты для текущего месяца.

```sql
months AS(
	SELECT NOW() AS date_month
    UNION ALL
    SELECT DISTINCT date_month AS date_month
    FROM ref {{'dim_calendar'}}
),
```

| date_month |
| --- |
| 2023-04-25 5:51:09 |
| 2023-04-01 0:00:00 |
| 2023-03-01 0:00:00 |
| 2023-02-01 0:00:00 |
| 2023-01-01 0:00:00 |

- Второй CTE имеет `LEFT JOIN`, который сохраняет список платежей, которые пользователь имел до конца каждого месяца, что позволяет модели рассчитывать сегмент RFM, который пользователь имел в конце каждого периода.
- Метрика недавности рассчитывается до конца каждого месяца. Если месяц еще не закончился, мы рассчитываем ее до текущего дня (благодаря `UNION` в первом запросе).

```sql
payments_with_months AS(
    SELECT  user_id,
            date_month,
            payment_date,
            payment_id,
            payment_amount
    FROM months
        JOIN payments ON payment_date <= date_month 
),
```

| user_id | date_month | payment_date | payment_id | amount |
| --- | --- | --- | --- | --- |
| A | 2023-04-25 5:55:05 | 2022-04-16 19:41:05 | BB | 120 |
| A | 2023-04-25 5:55:05 | 2023-03-23 18:17:46 | AA | 160 |
| A | 2023-04-01 0:00:00 | 2023-03-23 18:17:46 | AA | 160 |
| B | 2023-04-25 5:55:05 | 2022-08-23 17:52:44 | CC | 90 |
| B | 2023-04-01 0:00:00 | 2022-08-23 17:52:44 | CC | 90 |
| E | 2023-04-25 5:55:05 | 2023-02-05 12:17:19 | EE | 10630 |
| E | 2023-04-01 0:00:00 | 2023-02-05 12:17:19 | EE | 10630 |

### Получение последнего статуса {#getting-the-lastest-status}

Как только мы построили нашу историческую модель, мы можем добавить другую модель, которая запускается после нее в нашем графе зависимостей. Это может помочь уменьшить задержку в случаях, когда запрос всей истории не требуется (например, в инициативах по персонализации).

```sql
WITH rfm_segments AS(
	SELECT *
	FROM ref {{'model_rfm_segments_hist'}}
),	
current_segments AS(
	SELECT *
	FROM rfm_segments
	WHERE date_month = (SELECT MAX(date_month) FROM rfm_segments)
)
SELECT *
FROM current_segments
```

### Обзор решения {#solution-overview}

С новым подходом наш граф зависимостей будет выглядеть следующим образом:

<Lightbox src="/img/blog/2023-05-08-building-a-historical-user-segmentation-model-with-dbt/rfm-models-dependency-graph.png" width="100%" title="Граф зависимостей моделей RFM"/>

- Для аналитиков, которые хотят увидеть, как сегменты изменялись со временем, они могут запросить историческую модель. Также есть возможность построить агрегированную модель перед загрузкой ее в инструмент бизнес-аналитики.
- Для обучения моделей ML ученые данных и практики машинного обучения могут импортировать эту модель в свои ноутбуки или хранилище признаков, вместо того чтобы заново строить атрибуты с нуля.
- Если вы хотите персонализировать опыт пользователя на основе его сегмента, как в примере CX в начале, вы можете запросить текущую сегментацию и экспортировать ее в свою CRM с помощью инструмента обратного ETL.

## Заключение {#conclusions}

Этот дизайн имеет свои компромиссы, в частности, более длительное время сборки и сложность объяснения. Однако мы считаем, что команды данных, которые инвестируют в этот подход, получат лучшие наборы данных для исторического анализа, больше сотрудничества с учеными данных и в целом больший эффект от своих усилий в области аналитической инженерии.

## Связанные ресурсы {#related-resources}

[Операционная аналитика на практике](https://www.getdbt.com/analytics-engineering/use-cases/operational-analytics/)

[Как команда данных dbt Labs подходит к обратному ETL](https://www.getdbt.com/open-source-data-culture/reverse-etl-playbook/)

[Операционное хранилище данных: обратный ETL, CDP и будущее активации данных](https://www.getdbt.com/coalesce-2021/operational-data-warehouse-reverse-etl-cdp-data-activation/)