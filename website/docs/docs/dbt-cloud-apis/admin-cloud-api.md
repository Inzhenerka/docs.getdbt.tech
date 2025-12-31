---
title: "Административный API dbt"
id: "admin-cloud-api"
pagination_next: "docs/dbt-cloud-apis/discovery-api"
---

# Административный API dbt <Lifecycle status="self_service,managed,managed_plus" /> {#dbt-administrative-api}

Административный API <Constant name="cloud" /> включён по умолчанию для тарифных планов [Enterprise и Enterprise+](https://www.getdbt.com/pricing/). Его можно использовать для того, чтобы:

- загружать артефакты после завершения выполнения job
- запускать выполнение job из инструмента оркестрации
- управлять вашей учётной записью <Constant name="cloud" />
- и многого другого

В настоящее время <Constant name="cloud" /> поддерживает две версии Административного API: v2 и v3. В целом рекомендуется использовать версию v3, однако пока не все маршруты из v2 обновлены до v3. Мы активно работаем над этим. Если вы не находите нужный функционал в документации по v3, проверьте более короткий список эндпоинтов v2 — возможно, он есть именно там.

Многие эндпоинты Административного API также можно вызывать через [Terraform‑провайдер <Constant name="cloud" />](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest). Встроенная документация в реестре Terraform содержит [руководство по началу работы с провайдером](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/1_getting_started), а также [страницу со списком всех доступных Terraform‑ресурсов](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/99_list_resources), которые можно настроить.

<div className="grid--2-col">

<Card
    title="API v2"
    body="Наша устаревшая версия API с ограниченными конечными точками и функциями. Содержит информацию, недоступную в v3."
    link="/dbt-cloud/api-v2"
    icon="pencil-paper"/>

<Card
    title="API v3"
    body="Наша последняя версия API с новыми конечными точками и функциями."
    link="/dbt-cloud/api-v3"
    icon="pencil-paper"/>

<div className="card-container">
 <Card
    title="Terraform‑провайдер dbt"
    link="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    body="Terraform‑провайдер, поддерживаемый компанией dbt Labs, который можно использовать для управления аккаунтом dbt."
    icon="pencil-paper"/>
<a href="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    className="external-link"
    target="_blank"
    rel="noopener noreferrer">
    <Icon name='fa-external-link' />
</a>
</div>
</div>
