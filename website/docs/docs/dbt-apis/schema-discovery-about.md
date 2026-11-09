---
title: "О схеме Discovery API"
sidebar_label: "О схеме"
id: "discovery-schema-about"
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

С помощью Discovery API вы можете запрашивать метаданные в dbt, чтобы больше узнать о своих развертываниях dbt и данных, которые они генерируют. Вы можете анализировать эти данные, чтобы вносить улучшения. Если вы впервые работаете с этим API, ознакомьтесь с вводной информацией в разделе [О Discovery API](/docs/dbt-apis/discovery-api). Вам также могут пригодиться [сценарии использования и примеры](/docs/dbt-apis/discovery-use-cases-and-examples).

*Схема* Discovery API предоставляет все необходимые элементы для выполнения запросов и взаимодействия с Discovery API. Наиболее распространённые запросы используют эндпоинт `environment`:

<div className="grid--2-col">

<Card
title="Схема окружения"
    body="Запрашивайте и сравнивайте определение модели (желаемое состояние) и её применённое (фактическое) состояние."
    link="/docs/dbt-apis/discovery-schema-environment"
    icon="dbt-bit"/>
<Card
    title="Схема применённого состояния"
    body="Запрашивайте фактическое состояние объектов и метаданных в хранилище данных после выполнения `dbt run` или `dbt build`."
    link="/docs/dbt-apis/discovery-schema-environment-applied"
    icon="dbt-bit"/>
<Card
    title="Схема определения"
    body="Запрашивайте желаемое состояние, заданное в коде и конфигурации вашего проекта dbt."
    link="/docs/dbt-apis/discovery-schema-environment-definition"
    icon="dbt-bit"/>

 <Card
    title="Схема истории запусков модели"
    body="Запрашивайте информацию об истории запусков модели."
    link="/docs/dbt-apis/discovery-schema-environment-applied-modelHistoricalRuns"
    icon="dbt-bit"/>

</div>
