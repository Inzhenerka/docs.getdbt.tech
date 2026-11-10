---
title: "Административный API dbt"
id: "admin-api"
pagination_next: "docs/dbt-apis/discovery-api"
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

import ApiRateLimitsCallout from '/snippets/_api-rate-limits-callout.md';

# Административный API dbt

Административный API <Constant name="dbt" /> включён по умолчанию в [тарифных планах Starter, Enterprise и Enterprise+](https://www.getdbt.com/pricing/). Его можно использовать, чтобы:

- Скачивать артефакты после завершения задания
- Запускать задание из инструмента оркестрации
- Управлять своим аккаунтом <Constant name="dbt" />
- И многое другое

В настоящее время <Constant name="dbt" /> поддерживает две версии административного API: v2 и v3. Как правило, рекомендуется использовать v3, однако ещё не все маршруты v2 перенесены в v3. Сейчас мы работаем над этим. Если вы не можете найти что-то в документации v3, загляните в более короткий список конечных точек v2 — возможно, нужная конечная точка есть там. 

Многие конечные точки административного API также можно вызывать через [провайдер Terraform для <Constant name="dbt" />](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest). Документация в реестре Terraform содержит [руководство по началу работы с провайдером](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/1_getting_started), а также [страницу со всеми ресурсами Terraform, доступными для настройки](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/99_list_resources).

<ApiRateLimitsCallout />

<div className="grid--2-col">

<Card
    title="API v2"
    body="Устаревшая версия нашего API с ограниченным набором конечных точек и возможностей. Содержит информацию, недоступную в v3."
link="/dbt-cloud/api-v2"
    icon="pencil-paper"/>

<Card
    title="API v3"
    body="Последняя версия нашего API с новыми конечными точками и возможностями."
link="/dbt-cloud/api-v3"
    icon="pencil-paper"/>

<div className="card-container">
 <Card
    title="Провайдер Terraform для dbt"
    link="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    body="Провайдер Terraform, поддерживаемый dbt Labs, который можно использовать для управления аккаунтом dbt."
    icon="pencil-paper"/>
    <a href="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    className="external-link"
    target="_blank"
    rel="noopener noreferrer">
    <Icon name='fa-external-link' />
  </a>
</div>

</div>
