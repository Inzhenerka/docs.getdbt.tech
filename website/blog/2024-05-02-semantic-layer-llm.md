---
title: "Аналитика на естественном языке: Интерфейс для данных Snowflake"
description: "Учебник по созданию интерфейса на естественном языке для данных Snowflake с использованием семантического слоя dbt Cloud, Snowflake Cortex и Streamlit"
slug: semantic-layer-cortex

authors: [doug_guthrie]

tags: [llm, semantic-layer]
hide_table_of_contents: false

date: 2024-05-02
is_featured: true
---

## Введение

Как архитектор решений в dbt Labs, моя роль заключается в том, чтобы помогать нашим клиентам и потенциальным клиентам понять, как лучше всего использовать платформу dbt Cloud для решения их уникальных задач с данными. Эта уникальность проявляется по-разному — зрелость организации, стек данных, размер и состав команды, технические возможности, случаи использования или их комбинация. Однако, несмотря на все эти различия, в большинстве моих взаимодействий присутствует одна общая нить: генеративный ИИ и большие языковые модели (LLM). Команды по работе с данными либо 1) проактивно думают о применении этих технологий в контексте своей работы, либо 2) их подталкивают к этому их заинтересованные стороны. Это стало "слоном в комнате" в каждом (zoom) разговоре, в котором я участвую.

<!--truncate-->

<Lightbox src="/img/blog/2024-05-02-semantic-layer-llm/gen-ai-everywhere.png" width="85%" title="Генеративный ИИ повсюду!" />

Очевидно, что эта технология никуда не исчезнет. Уже существует бесчисленное количество случаев использования и приложений, которые демонстрируют очень реальные улучшения в эффективности, продуктивности и креативности. Вдохновленный общей проблемой, с которой сталкиваются команды по работе с данными, я создал [приложение Streamlit](https://dbt-semantic-layer.streamlit.app/), которое использует Snowflake Cortex и семантический слой dbt для точного и последовательного ответа на вопросы в свободной форме. Вы можете просмотреть примеры вопросов, на которые оно способно ответить, ниже:

<LoomVideo id='3b5cc878ef53488583691c390159007d?t=0' />

## Зачем это строить

Итак, зачем строить это и чем оно отличается?

- Результат такого приложения невероятно хорошо соответствует мандату большинства команд по работе с данными — предоставлять заинтересованным сторонам данные, которые им нужны, в формате, который они могут потреблять, при этом учитывая аспекты доверия, управления и точности.
- Компонент точности является уникальным предложением ценности такого приложения по сравнению с любым другим решением, которое утверждает, что пишет SQL из текстового запроса (ознакомьтесь с ранними тестами [здесь](https://www.getdbt.com/blog/semantic-layer-as-the-data-interface-for-llms)). Причина в том, что мы не просим LLM написать SQL-запрос, что может привести к ошибкам в таблицах, столбцах или просто к недействительному SQL. Вместо этого он генерирует высокоструктурированный запрос [MetricFlow](https://docs.getdbt.tech/docs/build/about-metricflow). MetricFlow — это основная технология в семантическом слое, которая переводит этот запрос в SQL на основе семантики, определенной в вашем проекте dbt.
- Если быть честным, это также невероятно ценный инструмент для демонстрации нашим клиентам и потенциальным клиентам!

## Технологии

Приложение использует [семантический слой dbt Cloud](https://docs.getdbt.tech/docs/use-dbt-semantic-layer/dbt-sl) вместе с [Snowflake Cortex](https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview) и [Streamlit](https://docs.snowflake.com/en/developer-guide/streamlit/about-streamlit) для создания интерфейса на естественном языке, который позволяет пользователям получать данные из их платформ Snowflake, просто задавая вопросы, такие как "Каков общий доход по месяцам в 2024 году?". Прежде чем углубляться, давайте рассмотрим, что это за инструменты:

|  | **Семантический слой** | **Snowflake Cortex** | **Streamlit** |
|---|---|---|---|
| Что это? | Действует как посредник между платформой данных клиента и различными точками потребления в его организации, принимая запросы и переводя их в SQL. | Полностью управляемый сервис Snowflake, предлагающий решения для машинного обучения и ИИ, включая функции LLM и ML. | Открытая Python-фреймворк, позволяющая быстро разрабатывать интерактивные веб-приложения. |
| Зачем использовать? | Обеспечивает согласованный доступ к метрикам в инструментах и приложениях для работы с данными, устраняя необходимость в дублировании кода и, что более важно, гарантируя, что любой заинтересованный работает с одними и теми же, проверенными определениями метрик, независимо от их инструмента или технических возможностей. | Обеспечивает бесшовный опыт взаимодействия с LLM, все из вашего аккаунта Snowflake. | Декларативный подход к созданию приложений, основанных на данных, позволяющий разработчикам сосредоточиться на основной функциональности, а не тратить чрезмерное время на разработку интерфейса. |

## Предварительные условия

### Snowflake

В Snowflake вам потребуется следующее:

Необходимые привилегии для Snowflake Cortex подробно описаны [здесь](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#required-privileges), но в общих чертах вам нужно будет предоставить роль `SNOWFLAKE.CORTEX_USER` пользователю(ям), имеющим доступ к любым функциям, доступным через Cortex. Например:

```sql
use role accountadmin;

create role cortex_user_role;
grant database role snowflake.cortex_user to role cortex_user_role;

grant role cortex_user_role to user some_user;
```

Для создания приложений Streamlit в Snowflake вам нужно предоставить привилегию `CREATE STREAMLIT`. Пример скрипта ниже:

```sql
-- Если вы хотите, чтобы все роли могли создавать приложения Streamlit, выполните
grant usage on database <database_name> to role public;
grant usage on schema <database_name>.<schema_name> to role public;
grant create streamlit on schema <database_name>.<schema_name> to role public;
grant create stage on schema <database_name>.<schema_name> to role public;

-- Не забудьте предоставить USAGE на склад (если можете).
grant usage on warehouse <warehouse_name> to role public;

-- Если вы хотите, чтобы только определенные роли могли создавать приложения Streamlit,
-- измените имя роли в командах выше.
```

Кроме того, вам нужно будет настроить сетевое правило, интеграцию внешнего доступа и UDF, который делает запрос к семантическому слою dbt Cloud. Обратите внимание на значения в вашем сетевом правиле и UDF — они должны соответствовать хосту, где развернут ваш аккаунт dbt Cloud [развернут](https://docs.getdbt.tech/docs/dbt-cloud-apis/sl-graphql#dbt-semantic-layer-graphql-api).

```sql
grant create network rule on schema <database_name>.<schema_name> to role public;
grant create secret on schema <database_name>.<schema_name> to role public;

use database <database_name>;
use schema <schema_name>;

create or replace network rule dbt_cloud_semantic_layer_rule
    mode = egress
    type = host_port
    value_list = (
        'semantic-layer.cloud.getdbt.com',
        'semantic-layer.emea.dbt.com',
        'semantic-layer.au.dbt.com'
    );

create or replace secret dbt_cloud_service_token
    type = generic_string
    secret_string = '<service_token>';

create or replace external access integration dbt_cloud_semantic_layer_integration
    allowed_network_rules = (dbt_cloud_semantic_layer_rule)
    allowed_authentication_secrets = (dbt_cloud_service_token)
    enabled = true;

grant usage on integration dbt_cloud_semantic_layer_integration to role public;
grant ownership on secret dbt_cloud_service_token to role public;
grant usage on secret dbt_cloud_service_token to role public;
```

UDF описаны отдельно в дальнейших разделах ниже.

### dbt Cloud

В dbt Cloud вам потребуется следующее (подробности можно найти [здесь](https://docs.getdbt.tech/docs/use-dbt-semantic-layer/quickstart-sl#prerequisites)):

- Иметь командный или корпоративный аккаунт dbt Cloud. Подходит как для многопользовательского, так и для однопользовательского развертывания.
- Иметь как производственные, так и разработческие [среды](https://docs.getdbt.tech/docs/dbt-cloud-environments), работающие на версии dbt 1.6 или выше.
- Создать успешный запуск задания в среде, где вы [настраиваете семантический слой](https://docs.getdbt.tech/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).

## Код
Существует несколько компонентов приложения, которые стоит выделить отдельно: получение семантики вашего проекта (в частности, метрик и измерений) при загрузке приложения, примеры, которые направляют LLM на то, как выглядит допустимый и недопустимый вывод, разбор вывода в структурированный объект, а затем использование этого вывода в качестве аргумента в UDF, который мы создали ранее, чтобы сделать запрос к семантическому слою.

### Получение семантики
Когда мы создаем наш запрос для LLM, нам нужно передать соответствующие метрики и измерения, которые были определены в нашем проекте dbt. Без этого LLM не будет иметь соответствующей информации для разбора, когда пользователь задает свой конкретный вопрос. Кроме того, это внешний запрос к API семантического слоя dbt Cloud, поэтому нам нужно использовать существующий UDF. Опять же, убедитесь, что вы обновили URL, чтобы он соответствовал вашему типу развертывания. Также обратите внимание, что мы используем интеграцию внешнего доступа и секрет, которые мы создали ранее.

```sql
create or replace function retrieve_sl_metadata()
    returns object
    language python
    runtime_version = 3.9
    handler = 'main'
    external_access_integrations = (dbt_cloud_semantic_layer_integration)
    packages = ('requests')
    secrets = ('cred' = dbt_cloud_service_token)
as
$$
from typing import Dict
import _snowflake
import requests

query = """
query GetMetrics($environmentId: BigInt!) {
  metrics(environmentId: $environmentId) {
    description
    name
    queryableGranularities
    type
    dimensions {
      description
      name
      type
    }
  }
}
"""

def main():
    session = requests.Session()
    token = _snowflake.get_generic_secret_string('cred')
    session.headers = {'Authorization': f'Bearer {token}'}

    # TODO: Обновите для вашего ID среды
    payload = {"query": query, "variables": {"environmentId": 1}}

    # TODO: Обновите для вашего типа развертывания
    response = session.post("https://semantic-layer.cloud.getdbt.com/api/graphql", json=payload)
    response.raise_for_status()
    return response.json()

$$;

grant usage on function retrieve_sl_metadata() to role public;
```

Несколько моментов, на которые стоит обратить внимание в коде выше:

- Убедитесь, что вы обновили код, чтобы включить ваш ID среды и ваш URL, который специфичен для вашего [типа развертывания](https://docs.getdbt.tech/docs/dbt-cloud-apis/sl-graphql#dbt-semantic-layer-graphql-api).
Вы можете изменить функцию, чтобы она принимала аргументы для payload, variables, query и т.д., чтобы сделать ее более динамичной и удовлетворить другие случаи использования, кроме этого.
- После того как данные были возвращены, мы будем использовать функцию [session state](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state) Streamlit для хранения определенных метрик и измерений проекта dbt. Эта функция позволит нам делать несколько вызовов без необходимости постоянно получать эти метаданные.

### Создание примеров

Помимо использования метрик и измерений, которые мы получили на предыдущем шаге, мы также будем использовать в запросе примеры вопросов, которые пользователь может задать, и как должен выглядеть соответствующий вывод. Это позволяет нам "обучать" LLM и гарантировать, что мы можем учитывать различные способы, которыми люди задают вопросы. Примером этого является руководство для LLM о том, как он может структурировать SQL, используемый в условии where, когда вопрос основан на времени (например, "Дайте мне доход с начала года по отделам"). Пример этого может выглядеть так:

```python
{
    "metrics": "revenue, costs, profit",
    "dimensions": "department, salesperson, cost_center, metric_time, product__product_category",
    "question": "Give me YTD revenue by department?",
    "result": Query.model_validate(
        {
            "metrics": [{"name": "revenue"}],
            "groupBy": [{"name": "department"}],
            "where": [
                {
                    "sql": "{{ TimeDimension('metric_time', 'DAY') }} >= date_trunc('year', current_date)"
                }
            ],
        }
    )
    .model_dump_json()
    .replace("{", "{{")
    .replace("}", "}}"),
}
```

Однако стоит упомянуть о компромиссе с этим подходом — примеры, которые мы используем для руководства LLM, будут использоваться в запросе и, таким образом, увеличат количество обрабатываемых токенов, что является мерой вычислительных затрат функций Cortex Snowflake. Для контекста, LLM, используемая в этом приложении, — это mistral-8x7b, которая взимает 0.22 кредита за 1 миллион токенов и имеет контекстное окно в 32,000 токенов.

### Разбор структурированного объекта
Еще одна важная часть этого приложения — разбор вывода из LLM в структурированный объект, в частности, модель [Pydantic](https://docs.pydantic.dev/latest/concepts/models/). В процессе создания этого приложения я постоянно сталкивался с проблемами с LLM. Проблема заключалась не в предоставлении правильных ответов, которые она давала, а в ответах, которые имели одинаковую структуру и непрерывность от вопроса к вопросу. Даже при попытке очень явных инструкций в запросе, таких как "Возвращайте только соответствующие метрики и измерения" или "Не объясняйте свой вывод никаким образом", я продолжал получать вывод, который затруднял разбор и извлечение соответствующей информации для формирования подходящего запроса к семантическому слою. Это привело меня к LangChain и [PydanticOutputParser](https://python.langchain.com/docs/modules/model_io/output_parsers/types/pydantic/), который позволил мне указать произвольную модель Pydantic и заставить вывод из LLM соответствовать этой схеме.

```python
class Query(BaseModel):
    metrics: List[MetricInput]
    groupBy: Optional[List[GroupByInput]] = None
    where: Optional[List[WhereInput]] = None
    orderBy: Optional[List[OrderByInput]] = None
    limit: Optional[int] = None
```

Прелесть этого подхода в том, что я могу создать отдельные атрибуты, которые формируют запрос, такие как `metrics` или `groupBy`, и создать отдельные модели Pydantic для каждого из них, которые соответствуют схеме, ожидаемой API GraphQL. Как только я получаю это в таком формате, становится очень легко создать API-запрос, чтобы наконец вернуть данные из моего хранилища Snowflake, которые отвечают на вопрос, заданный пользователем.

### Получение данных

Как только мой объект `Query` создан, я могу использовать этот вывод для формирования GraphQL-запроса и соответствующих переменных, которые будут использоваться в полезной нагрузке. Эта полезная нагрузка будет аргументом, который мы передаем в UDF, который мы создали ранее, чтобы 1) создать запрос через семантический слой и 2) используя этот ID запроса, опрашивать до завершения события и вернуть данные обратно в приложение Streamlit. Это снова внешний запрос к семантическому слою dbt Cloud, поэтому будет использоваться UDF.

```sql
create or replace function submit_sl_request(payload string)
    returns object
    language python
    runtime_version = 3.9
    handler = 'main'
    external_access_integrations = (dbt_cloud_semantic_layer_integration)
    packages = ('requests')
    secrets = ('cred' = dbt_cloud_service_token )
as
$$
from typing import Dict
import _snowflake
import json
import requests


def main(payload: str):
    session = requests.Session()
    token = _snowflake.get_generic_secret_string('cred')
    session.headers = {'Authorization': f'Bearer {token}'}
    payload = json.loads(payload)
    results = submit_request(session, payload)
    try:
        query_id = results["data"]["createQuery"]["queryId"]
    except TypeError as e:
        raise e
    
    data = None
    while True:
        graphql_query = """
            query GetResults($environmentId: BigInt!, $queryId: String!) {
                query(environmentId: $environmentId, queryId: $queryId) {
                    arrowResult
                    error
                    queryId
                    sql
                    status
                }
            }
        """
        results_payload = {"variables": {"queryId": query_id}, "query": graphql_query}
        results = submit_request(session, results_payload)
        try:
            data = results["data"]["query"]
        except TypeError as e:
            break
        else:
            status = data["status"].lower()
            if status in ["successful", "failed"]:
                break

    return data

def submit_request(session: requests.Session, payload: Dict):
    if not "variables" in payload:
        payload["variables"] = {}
    payload["variables"].update({"environmentId": 1})
    response = session.post(
        "https://semantic-layer.cloud.getdbt.com/api/graphql", json=payload
    )
    response.raise_for_status()
    return response.json()
$$;

grant usage on function submit_sl_request(string) to role public;
```

## Завершение

Создание этого приложения было невероятно увлекательным по нескольким причинам. Во-первых, мы смогли использовать его внутри организации SA для демонстрации работы семантического слоя. Это предоставляет еще одну [интеграцию](https://docs.getdbt.tech/docs/cloud-integrations/avail-sl-integrations), которая еще больше подчеркивает основное предложение ценности использования семантического слоя. Во-вторых, и что более важно, оно служило примером для тех клиентов, которые думают (или их подталкивают к мысли) о том, как они могут наилучшим образом использовать эти технологии для достижения своих целей. Наконец, я смог погрузиться в изучение всех этих интересных технологий и вернуться к роли создателя — это то, от чего я никогда не откажусь!

Наконец, чтобы увидеть весь код, от Snowflake до Streamlit, ознакомьтесь с репозиторием [здесь](https://github.com/dpguthrie/dbt-sl-cortex-streamlit-blog/tree/main?tab=readme-ov-file).