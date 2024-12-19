---
title: Как мы стилизуем наш Python
id: 3-how-we-style-our-python
---

## Инструменты Python

- 🐍 Python имеет более зрелую и надежную экосистему для форматирования и линтинга (что облегчено тем фактом, что у него нет миллиона различных диалектов). Мы рекомендуем использовать эти инструменты для форматирования и линтинга вашего кода в предпочитаемом вами стиле.

- 🛠️ Наши текущие рекомендации:

  - [black](https://pypi.org/project/black/) для форматирования
  - [ruff](https://pypi.org/project/ruff/) для линтинга

  :::info
  ☁️ dbt Cloud поставляется с [встроенным форматером black](https://docs.getdbt.com/docs/cloud/dbt-cloud-ide/lint-format), который автоматически выполняет линтинг и форматирование вашего SQL. Вам не нужно ничего загружать или настраивать, просто нажмите `Format` в модели Python, и вы готовы к работе!
  :::

## Пример Python

```python
import pandas as pd


def model(dbt, session):
    # устанавливаем продолжительность времени, считаемого оттоком
    pd.Timedelta(days=2)

    dbt.config(enabled=False, materialized="table", packages=["pandas==1.5.2"])

    orders_relation = dbt.ref("stg_orders")

    # преобразуем отношение DuckDB Python в DataFrame pandas
    orders_df = orders_relation.df()

    orders_df.sort_values(by="ordered_at", inplace=True)
    orders_df["previous_order_at"] = orders_df.groupby("customer_id")[
        "ordered_at"
    ].shift(1)
    orders_df["next_order_at"] = orders_df.groupby("customer_id")["ordered_at"].shift(
        -1
    )
    return orders_df
```