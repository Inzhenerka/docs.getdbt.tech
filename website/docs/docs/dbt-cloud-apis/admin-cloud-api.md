---
title: "Административный API dbt Cloud"
id: "admin-cloud-api"
pagination_next: "docs/dbt-cloud-apis/discovery-api"
---

Административный API dbt Cloud включен по умолчанию для [командных и корпоративных планов](https://www.getdbt.com/pricing/). Его можно использовать для:

- Загрузки артефактов после завершения задания
- Запуска выполнения задания из инструмента оркестрации
- Управления вашей учетной записью dbt Cloud
- и многого другого

В настоящее время dbt Cloud поддерживает две версии Административного API: v2 и v3. В общем, рекомендуется использовать версию v3, но у нас еще не все маршруты v2 обновлены до v3. Мы сейчас работаем над этим. Если вы не можете найти что-то в нашей документации v3, посмотрите на более короткий список конечных точек v2, так как вы можете найти нужное там.

Многие конечные точки Административного API также можно вызывать через [провайдер Terraform для dbt Cloud](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest). Встроенная документация на реестре Terraform содержит [руководство по началу работы с провайдером](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/1_getting_started), а также [страницу, показывающую все доступные ресурсы Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/99_list_resources) для настройки.

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
    title="Провайдер Terraform для dbt Cloud"
    link="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    body="Провайдер Terraform, поддерживаемый dbt Labs, который можно использовать для управления учетной записью dbt Cloud."
    icon="pencil-paper"/>
    <a href="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    className="external-link"      
    target="_blank"
    rel="noopener noreferrer">
    <Icon name='fa-external-link' />
  </a>
</div>
    
</div>