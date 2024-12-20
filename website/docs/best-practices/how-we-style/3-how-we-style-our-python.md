---
title: Как мы оформляем наш Python
id: 3-how-we-style-our-python
---

## Инструменты для Python

- 🐍 У Python более зрелая и надежная экосистема для форматирования и линтинга (что облегчается отсутствием множества различных диалектов). Мы рекомендуем использовать эти инструменты для форматирования и линтинга вашего кода в предпочитаемом вами стиле.

- 🛠️ Наши текущие рекомендации:

  - Форматтер [black](https://pypi.org/project/black/)
  - Линтер [ruff](https://pypi.org/project/ruff/)

  :::info
  ☁️ dbt Cloud поставляется с [встроенным форматтером black](https://docs.getdbt.com/docs/cloud/dbt-cloud-ide/lint-format) для автоматического линтинга и форматирования их SQL. Вам не нужно ничего скачивать или настраивать, просто нажмите `Format` в Python модели, и все готово!
  :::

## Пример Python

```python
import pandas as pd


def model(dbt, session):
    # установить длину времени, считаемую оттоком
    pd.Timedelta(days=2)

    dbt.config(enabled=False, materialized="table", packages=["pandas==1.5.2"])

    orders_relation = dbt.ref("stg_orders")

    # преобразование DuckDB Python Relation в pandas DataFrame
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