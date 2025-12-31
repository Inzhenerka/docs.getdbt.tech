---
title: Размещение вашего DAG в интернете
description: "Используйте dbt и интеграции внешнего доступа Snowflake, чтобы позволить моделям Python в Snowflake получить доступ к интернету."
slug: dag-on-the-internet

authors: [ernesto_ongaro, sebastian_stan, filip_byrén]

tags: [аналитическое ремесло, API, экосистема данных]
hide_table_of_contents: false

date: 2024-06-14
is_featured: true
---

## Новое в dbt: разрешение моделям Python в Snowflake доступ к интернету {#new-in-dbt-allow-snowflake-python-models-to-access-the-internet}

С выпуском dbt 1.8, dbt добавил поддержку [интеграций внешнего доступа](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) Snowflake, что позволяет использовать dbt + AI для обогащения ваших данных. Это позволяет выполнять запросы к внешним API в моделях Python в dbt, что было необходимо для клиента dbt Cloud, [EQT AB](https://eqtgroup.com/). Узнайте, почему им это было нужно и как они помогли разработать и внедрить эту функцию!

<!--truncate-->
## Почему EQT требовалась эта функциональность? {#why-did-eqt-require-this-functionality}
от Филипа Бриена, вице-президента и архитектора программного обеспечения (EQT) и Себастьяна Стэна, инженера данных (EQT)

_EQT AB — это глобальная инвестиционная организация и давний клиент dbt Cloud, выступавшая на конференции dbt Coalesce в [2020](https://www.getdbt.com/coalesce-2020/seven-use-cases-for-dbt) и [2023](https://www.youtube.com/watch?v=-9hIUziITtU) годах._

_Motherbrain Labs — это специализированная команда AI в EQT, основное внимание которой сосредоточено на ускорении дорожных карт наших портфельных компаний через практическую работу с данными и AI. Из-за высокого спроса на наше время мы постоянно исследуем механизмы упрощения наших процессов и увеличения собственной производительности. Интеграция компонентов рабочего процесса непосредственно в dbt стала значительным приростом эффективности и помогла нам быстро доставлять результаты по всему глобальному портфелю._

Motherbrain Labs сосредоточена на создании измеримого AI-эффекта в нашем портфеле. Мы работаем рука об руку с руководством наших команд по сделкам и руководством портфельных компаний, но наш начальный подход всегда одинаков: определить, какие данные имеют значение.

Хотя у нас есть доступ к огромному количеству собственных данных, мы считаем, что наибольший эффект достигается, когда мы комбинируем эту информацию с внешними наборами данных, такими как геолокация, демография или активность конкурентов.

Эти ценные наборы данных часто поступают от сторонних поставщиков, работающих по модели оплаты за использование; взимается плата за каждую единицу информации, которую мы хотим получить. Чтобы избежать перерасхода, мы сосредотачиваемся на обогащении только той конкретной подмножества данных, которая имеет отношение к стратегическому вопросу отдельной компании.

В ответ на эту повторяющуюся потребность мы объединились с Snowflake и dbt для внедрения новой функциональности, которая облегчает связь с внешними конечными точками и управляет секретами в dbt. Эта новая интеграция позволяет нам включать процессы обогащения непосредственно в наши DAG, аналогично тому, как текущие модели Python используются в средах dbt. Мы обнаружили, что этот расширенный подход позволяет нам уменьшить сложность и обеспечить внешние коммуникации до материализации.

## Пример с углеродной интенсивностью: как это работает? {#an-example-with-carbon-intensity-how-does-it-work}

В этом разделе мы продемонстрируем, как интегрировать внешний API для получения текущей углеродной интенсивности энергосистемы Великобритании. Цель состоит в том, чтобы показать, как работает эта функция, и, возможно, исследовать, как планирование преобразований данных в разное время может потенциально снизить их углеродный след, делая их более экологичным выбором. Мы будем использовать API от [UK National Grid ESO](https://www.nationalgrideso.com/) для достижения этой цели.

Для начала нам нужно настроить сетевое правило (инструкции Snowflake [здесь](https://docs.snowflake.com/en/user-guide/network-rules)), чтобы разрешить доступ к внешнему API. В частности, мы создадим правило исходящего трафика, чтобы разрешить Snowflake общаться с api.carbonintensity.org.

Далее, чтобы получить доступ к сетевым местоположениям за пределами Snowflake, вам сначала нужно определить интеграцию внешнего доступа и указать ее в модели Python в dbt. Обзор внешнего сетевого доступа Snowflake можно найти [здесь](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview).

Этот API является открытым, и если для него требуется API-ключ, следует обращаться с ним так же, как с управлением секретами. Более подробную информацию об аутентификации API в Snowflake можно найти [здесь](https://docs.snowflake.com/en/user-guide/api-authentication).

Для простоты мы покажем, как создавать их с использованием [pre-hooks](/reference/resource-configs/pre-hook-post-hook) в YAML-файле конфигурации модели:

Для простоты мы покажем, как создать их, используя [pre-hooks](/reference/resource-configs/pre-hook-post-hook) в конфигурационном файле модели yml:

```yml
models:
  - name: external_access_sample
    config:
      pre_hook: 
        - "create or replace network rule test_network_rule type = host_port mode = egress value_list= ('api.carbonintensity.org.uk:443');"
        - "create or replace external access integration test_external_access_integration allowed_network_rules = (test_network_rule) enabled = true;"
```

Затем мы можем просто использовать новый параметр конфигурации external_access_integrations, чтобы использовать наше сетевое правило в модели Python (называемой external_access_sample.py):

```python
import snowflake.snowpark as snowpark
def model(dbt, session: snowpark.Session):
    dbt.config(
        materialized="table",
        external_access_integrations=["test_external_access_integration"],
        packages=["httpx==0.26.0"]
    )
    import httpx
    return session.create_dataframe(
            [{"carbon_intensity": httpx.get(url="https://api.carbonintensity.org.uk/intensity").text}]
    )
```

В результате получается модель с некоторым JSON, который я могу распарсить, например, в SQL‑модели, чтобы извлечь часть информации:

```sql
{{
    config(
        materialized='incremental',
        unique_key='dbt_invocation_id'
    )
}}

with raw as (
    select parse_json(carbon_intensity) as carbon_intensity_json
    from {{ ref('external_access_demo') }}
)

select
    '{{ invocation_id }}' as dbt_invocation_id,
    value:from::TIMESTAMP_NTZ as start_time,
    value:to::TIMESTAMP_NTZ as end_time,
    value:intensity.actual::NUMBER as actual_intensity,
    value:intensity.forecast::NUMBER as forecast_intensity,
    value:intensity.index::STRING as intensity_index
from raw,
    lateral flatten(input => raw.carbon_intensity_json:data)
```

Результатом является модель, которая будет отслеживать вызовы dbt и текущие уровни углеродной интенсивности в Великобритании.

<Lightbox src="/img/blog/2024-06-12-putting-your-dag-on-the-internet/image1.png" title="Предварительный просмотр в dbt Cloud IDE вывода" />

## Лучшие практики dbt {#dbt-best-practices}

Это очень новая область для Snowflake и dbt — что-то особенное в SQL и dbt заключается в том, что они очень устойчивы к внешней энтропии. Как только мы начинаем полагаться на вызовы API, пакеты Python и другие внешние зависимости, мы открываемся для гораздо большего количества внешней энтропии. API будут изменяться, ломаться, и ваши модели могут выйти из строя.

Традиционно dbt является T в ELT (обзор dbt [здесь](https://docs.getdbt.tech/terms/elt)), и эта функциональность открывает совершенно новые возможности EL, для которых еще не существуют лучшие практики. Очевидно, что рабочие нагрузки EL должны быть отделены от рабочих нагрузок T, возможно, в другом слое моделирования. Обратите внимание, что если не использовать инкрементные модели, ваши исторические данные могут быть легко удалены. dbt видел множество случаев использования этого, включая этот пример AI, как описано в этом внешнем [инженерном блоге](https://klimmy.hashnode.dev/enhancing-your-dbt-project-with-large-language-models).

## Несколько слов о силе коммерческого программного обеспечения с открытым исходным кодом {#a-few-words-about-the-power-of-commercial-open-source-software}

Чтобы быстро внедрить эту функциональность, EQT открыла pull request, Snowflake помогла с некоторыми проблемами, которые у нас возникли с CI, и сотрудник dbt Labs помог написать тесты и объединить код!

Теперь dbt включает эту функциональность в dbt 1.8+ и во всех [выпусках](/docs/dbt-versions/cloud-release-tracks) в dbt Cloud.

Сотрудники dbt Labs и члены сообщества будут рады обсудить это в канале slack [#db-snowflake](https://getdbt.slack.com/archives/CJN7XRF1B).