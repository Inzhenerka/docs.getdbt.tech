---
title: "Python SDK"
id: sl-python
description: "Узнайте, как использовать библиотеку Python SDK для взаимодействия с dbt Semantic Layer."
tags: [Semantic Layer, APIs]
keywords: [dbt Cloud, API, dbt Semantic Layer, python, sdk]
sidebar_label: "Python SDK"
---

[Python SDK для разработки программного обеспечения `dbt-sl-sdk`](https://github.com/dbt-labs/semantic-layer-sdk-python) (SDK) — это библиотека на Python, которая предоставляет вам легкий доступ к dbt Semantic Layer с помощью Python. Она позволяет разработчикам взаимодействовать с API dbt Semantic Layer и запрашивать метрики и измерения в последующих инструментах.

## Установка

Для установки Python SDK вам нужно указать дополнительные зависимости в зависимости от того, хотите ли вы использовать его синхронно, с поддержкой [requests](https://github.com/psf/requests/), или асинхронно ([asyncio](https://docs.python.org/3/library/asyncio.html) с поддержкой [aiohttp](https://github.com/aio-libs/aiohttp/)).

Python SDK поддерживает версии Python с долгосрочной поддержкой (LTS), такие как 3.9, 3.10, 3.11 и 3.12. Когда Python прекращает поддержку версии, Python SDK также прекращает поддержку этой версии. Если вы используете неподдерживаемую версию, вы можете столкнуться с проблемами совместимости и не получите обновления или исправления безопасности от SDK.

<Tabs>
<TabItem value="sync" label="Синхронная установка">

Синхронная установка означает, что ваша программа ждет завершения каждой задачи перед переходом к следующей.

Это проще, легче для понимания и подходит для небольших задач или когда вашей программе не нужно обрабатывать много задач одновременно.

```bash
pip install "dbt-sl-sdk[sync]"
```
Если вы используете асинхронные фреймворки, такие как [FastAPI](https://fastapi.tiangolo.com/) или [Strawberry](https://github.com/strawberry-graphql/strawberry), установка синхронной версии SDK заблокирует ваш цикл событий и может значительно замедлить вашу программу. В этом случае мы настоятельно рекомендуем использовать асинхронную установку.

</TabItem>

<TabItem value="async" label="Асинхронная установка">

Асинхронная установка означает, что ваша программа может начать задачу и затем перейти к другим задачам, ожидая завершения первой. Это позволяет обрабатывать множество задач одновременно без ожидания, делая выполнение быстрее и эффективнее для больших задач или когда нужно управлять несколькими задачами одновременно.

Для получения более подробной информации обратитесь к [asyncio](https://docs.python.org/3/library/asyncio.html).

```bash
pip install "dbt-sl-sdk[sync]"
```

Поскольку [Python ADBC драйвер](https://github.com/apache/arrow-adbc/tree/main/python/adbc_driver_manager) еще не поддерживает asyncio нативно, `dbt-sl-sdk` использует [`ThreadPoolExecutor`](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/5e52e1ca840d20a143b226ae33d194a4a9bc008f/dbtsl/api/adbc/client/asyncio.py#L62) для выполнения `query` и `list dimension-values` (всех операций, выполняемых с ADBC). Поэтому вы можете увидеть появление нескольких потоков Python.

Если вы используете асинхронные фреймворки, такие как [FastAPI](https://fastapi.tiangolo.com/) или [Strawberry](https://github.com/strawberry-graphql/strawberry), установка синхронной версии Python SDK заблокирует ваш цикл событий и может значительно замедлить вашу программу. В этом случае мы настоятельно рекомендуем использовать асинхронную установку.

</TabItem>
</Tabs>

## Использование
Чтобы выполнять операции с API Semantic Layer, создайте экземпляр `SemanticLayerClient` с вашими [параметрами подключения к API](/docs/dbt-cloud-apis/sl-api-overview):

```python
from dbtsl import SemanticLayerClient

client = SemanticLayerClient(
    environment_id=123,
    auth_token="<your-semantic-layer-api-token>",
    host="semantic-layer.cloud.getdbt.com",
)

# запрос первой метрики по `metric_time`
def main():
    with client.session():
        metrics = client.metrics()
        table = client.query(
            metrics=[metrics[0].name],
            group_by=["metric_time"],
        )
        print(table)

main()
```

**Примечание**: Все вызовы методов, обращающихся к API, должны находиться в контексте `client.session()`. Это позволяет клиенту установить соединение с API только один раз и повторно использовать то же соединение между вызовами API.

Мы рекомендуем создавать сессию на уровне всего приложения и повторно использовать ту же сессию в течение всего приложения для оптимальной производительности. Создание сессии для каждого запроса не рекомендуется и неэффективно.

### Использование asyncio
Если вы используете asyncio, импортируйте `AsyncSemanticLayerClient` из `dbtsl.asyncio`. API `SemanticLayerClient` и `AsyncSemanticLayerClient` идентичны, но асинхронная версия имеет асинхронные методы, которые нужно `await`.

```python
import asyncio
from dbtsl.asyncio import AsyncSemanticLayerClient

client = AsyncSemanticLayerClient(
    environment_id=123,
    auth_token="<your-semantic-layer-api-token>",
    host="semantic-layer.cloud.getdbt.com",
)

async def main():
    async with client.session():
        metrics = await client.metrics()
        table = await client.query(
            metrics=[metrics[0].name],
            group_by=["metric_time"],
        )
        print(table)

asyncio.run(main())

```

## Интеграция с библиотеками для работы с данными

Python SDK возвращает все данные запросов в виде таблиц [pyarrow](https://arrow.apache.org/docs/python/index.html).

Библиотека Python SDK не поставляется в комплекте с [Polars](https://pola.rs/) или [Pandas](https://pandas.pydata.org/). Если вы используете эти библиотеки, добавьте их в зависимости вашего проекта.

Чтобы использовать данные с такими библиотеками, как Polars или Pandas, вручную преобразуйте данные в нужный формат. Например:

#### Если вы используете pandas

```python
# ... инициализация клиента

arrow_table = client.query(...)
pandas_df = arrow_table.to_pandas()

```

#### Если вы используете polars

```python
import polars as pl

# ... инициализация клиента

arrow_table = client.query(...)
polars_df = pl.from_arrow(arrow_table)
```

## Примеры использования
Для дополнительных примеров использования ознакомьтесь с [примерами использования](https://github.com/dbt-labs/semantic-layer-sdk-python/tree/main/examples), некоторые из которых включают:

- [Получение значений измерений синхронно](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/fetch_dimension_values_sync.py)
- Получение метрик [асинхронно](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/fetch_metric_async.py) и [синхронно](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/fetch_metric_sync.py)
- [Список сохраненных запросов асинхронно](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/list_saved_queries_async.py)

## Отключение телеметрии
По умолчанию, Python SDK отправляет некоторую [информацию о платформе](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/dbtsl/env.py) в dbt Labs. Чтобы отказаться от этого, установите атрибут `PLATFORM.anonymous` в `True`:

```python
from dbtsl.env import PLATFORM
PLATFORM.anonymous = True

# ... инициализация клиента
```

## Вклад
Чтобы внести вклад в этот проект, ознакомьтесь с нашими [руководствами по вкладу](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/CONTRIBUTING.md) и откройте GitHub [issue](https://github.com/dbt-labs/semantic-layer-sdk-python/issues) или [pull request](https://github.com/dbt-labs/semantic-layer-sdk-python/pulls).