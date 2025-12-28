---
title: "О схеме Discovery API"
sidebar_label: "О схеме"
id: "discovery-schema-about"
---

С помощью Discovery API вы можете запрашивать метаданные в dbt, чтобы лучше понимать свои развертывания dbt и данные, которые они генерируют. Вы можете анализировать эти данные и находить возможности для улучшений. Если вы только начинаете работать с API, ознакомьтесь с документом [About the Discovery API](/docs/dbt-cloud-apis/discovery-api), где приводится вводное описание. Также вам могут быть полезны [use cases and examples](/docs/dbt-cloud-apis/discovery-use-cases-and-examples).

*Схема* Discovery API предоставляет все необходимые элементы для выполнения запросов и взаимодействия с Discovery API. Наиболее распространённые запросы используют эндпоинт `environment`:

<div className="grid--2-col">

<Card
    title="Схема environment"
    body="Запрос и сравнение определения модели (задуманного состояния) и её применённого (фактического) состояния."
    link="/docs/dbt-cloud-apis/discovery-schema-environment"
    icon="dbt-bit"/>
<Card
    title="Схема applied"
    body="Запрос фактического состояния объектов и метаданных в хранилище данных после выполнения `dbt run` или `dbt build`."
    link="/docs/dbt-cloud-apis/discovery-schema-environment-applied"
    icon="dbt-bit"/>
<Card
    title="Схема definition"
    body="Запрос задуманного состояния в коде проекта и конфигурации, определённой в вашем dbt-проекте."
    link="/docs/dbt-cloud-apis/discovery-schema-environment-definition"
    icon="dbt-bit"/>

 <Card
    title="Схема Model Historical Runs"
    body="Запрос информации об истории запусков модели."
    link="/docs/dbt-cloud-apis/discovery-schema-environment-applied-modelHistoricalRuns"
    icon="dbt-bit"/>

</div>
