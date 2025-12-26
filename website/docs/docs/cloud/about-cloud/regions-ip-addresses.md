---
title: "Доступ, регионы и IP-адреса"
sidebar: "Доступ, регионы и IP-адреса"
id: "access-regions-ip-addresses"
description: "Доступные регионы и IP-адреса"
---

<Constant name="cloud" /> [размещён](/docs/cloud/about-cloud/architecture) в нескольких регионах и всегда подключается к вашей платформе данных или git‑провайдеру с IP‑адресов, перечисленных ниже. Обязательно разрешите трафик с этих IP‑адресов в вашем firewall и добавьте их во все необходимые права доступа (grants) в базе данных.

- Тарифы [<Constant name="cloud" /> Enterprise-tier](https://www.getdbt.com/pricing/) позволяют выбрать размещение аккаунта в любом из регионов, указанных в таблице ниже.  
- Организация **должна** выбрать один регион для каждого аккаунта <Constant name="cloud" />. Чтобы использовать <Constant name="cloud" /> в нескольких регионах, мы рекомендуем создавать несколько аккаунтов <Constant name="cloud" />.  

<FilterableTable>

| Регион | Локация | <div style={{width:'110px'}}>URL доступа</div> | <div style={{width:'100px'}}>IP-адреса</div> | Доступные планы | <div style={{width:'200px'}}>Ссылка на страницу статуса</div> |
|--------|----------|------------|--------------|-------| --------- |
| North America  | AWS us-east-1 (N. Virginia) | **Multi-tenant:**<br />[cloud.getdbt.com](https://cloud.getdbt.com) <br /><br /> **Cell based:** <small>ACCOUNT_PREFIX.us1.dbt.com</small> | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 <br />52.3.77.232 <br />3.214.191.130 <br />34.233.79.135 | [All dbt platform plans](https://www.getdbt.com/pricing/) | **Multi-tenant:** <br /> [US AWS](https://status.getdbt.com/us-aws)<br /><br /> **Cell based:** <br />[US Cell 1 AWS](https://status.getdbt.com/us-cell-1-aws) <br /> [US Cell 2 AWS](https://status.getdbt.com/us-cell-2-aws) <br /> [US Cell 3 AWS](https://status.getdbt.com/us-cell-3-aws) |
| North America  | Azure <br /> East US 2 (Virginia) | **Cell based:** <small>ACCOUNT_PREFIX.us2.dbt.com</small> | 20.10.67.192/26 | All Enterprise plans | [US Cell 1 AZURE](https://status.getdbt.com/us-cell-1-azure) |
| North America  | GCP (us-central1) | **Cell based:** <small>ACCOUNT_PREFIX.us3.dbt.com</small> | 34.33.2.0/26 | All Enterprise plans | [US Cell 1 GCP](https://status.getdbt.com/us-cell-1-gcp) | 
| EMEA  | AWS eu-central-1	(Frankfurt) | **Multi-tenant:**<br />[emea.dbt.com](https://emea.dbt.com) <br /><br /> **Cell based:** <small>ACCOUNT_PREFIX.eu1.dbt.com</small> | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | All Enterprise plans | [EMEA AWS](https://status.getdbt.com/emea-aws) |
| EMEA  | Azure <br /> North Europe (Ireland)  |    **Cell based:** <small>ACCOUNT_PREFIX.eu2.dbt.com</small>  | 20.13.190.192/26   | All Enterprise plans | [EMEA Cell 1 AZURE](https://status.getdbt.com/emea-cell-1-azure) |
| EMEA  | GCP <br /> (London)  |  [eu3.dbt.com](https://eu3.dbt.com)  |  34.33.2.0/26  | All Enterprise plans | [EU Cell 1 GCP](https://status.getdbt.com/eu-cell-1-gcp) |
| APAC  | 	AWS ap-southeast-2  (Sydney)| **Multi-tenant:**<br />[au.dbt.com](https://au.dbt.com) <br /><br /> **Cell based:** <small>ACCOUNT_PREFIX.au1.dbt.com</small> | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />|  All Enterprise plans | [APAC AWS](https://status.getdbt.com/apac-aws) |
| Japan | AWS ap-northeast-1 (Tokyo) | [jp1.dbt.com](https://jp1.dbt.com) | 35.76.76.152 <br />  54.238.211.79 <br /> 13.115.236.233 <br /> | All Enterprise plans | [JP Cell 1 AWS](https://status.getdbt.com/jp-cell-1-aws) | 
| Virtual Private dbt or Single tenant | Индивидуальная конфигурация |  Индивидуально | Запросите ваши IP‑адреса у [Support](/community/resources/getting-help#dbt-cloud-support) | All Enterprise plans | Индивидуально |

</FilterableTable>

    <Lightbox src="/img/docs/dbt-cloud/find-account.png" title="Аккаунты dbt Cloud" />

Чтобы войти в <Constant name="cloud" />, используйте URL, который подходит для вашей среды. Используемый URL для доступа зависит от нескольких факторов, включая регион и тип размещения (tenancy):

- **US multi-tenant:** Используйте ваш уникальный URL, который начинается с префикса вашего аккаунта, за которым следует `us1.dbt.com`. Например, `abc123.us1.dbt.com`. Вы также можете использовать `cloud.getdbt.com`, однако этот URL будет удалён в будущем.  
  - Если вы не уверены, какой URL для доступа использовать, перейдите на `us1.dbt.com` и введите свои учетные данные <Constant name="cloud" />. Если вы являетесь участником только одного аккаунта, вы будете автоматически авторизованы, и ваш URL отобразится в браузере. Если вы являетесь участником нескольких аккаунтов, вам будет предложен список вариантов с соответствующими URL для входа в каждый из них.

    <Lightbox src="/img/docs/dbt-cloud/find-account.png" width="60%" title="dbt accounts" />

Существует два способа просмотра ваших IP-адресов dbt Cloud:
- Если в аккаунте нет проектов, создайте новый проект, и IP-адреса будут отображены во время шагов **Настройка вашей среды**.
- Если у вас есть существующий проект, перейдите в **Настройки аккаунта** и убедитесь, что вы находитесь на вкладке **Проекты**. Нажмите на имя проекта, и откроется окно **Настройки проекта**. Найдите поле **Подключение** и нажмите на имя. Прокрутите вниз до **Настройки**, и первый текстовый блок перечислит ваши IP-адреса.

## Поиск IP-адресов dbt

Существует два способа посмотреть ваши IP-адреса <Constant name="cloud" />:

- Если в аккаунте ещё нет проектов, создайте новый проект — IP-адреса будут показаны на этапе **Configure your environment**.
- Если у вас уже есть проект, перейдите в **Account Settings** и убедитесь, что вы находитесь на вкладке **Projects**. Нажмите на имя проекта — откроется окно **Project Settings**. Найдите поле **Connection** и кликните по названию. Прокрутите страницу вниз до раздела **Settings** — в первом текстовом блоке будут указаны ваши IP-адреса.

* Динамические IP-адреса &mdash; инфраструктура dbt Cloud использует Amazon Web Services (AWS). dbt Cloud предлагает статические URL для упрощенного доступа, но динамическая природа облачных сервисов означает, что базовые IP-адреса иногда меняются. AWS управляет диапазонами IP и может изменять их в соответствии с их операционными и безопасными потребностями.

<Constant name="cloud" /> размещён в AWS, Azure и Google Cloud Platform (GCP). Хотя мы можем предоставить статические URL для доступа, мы не можем предоставить список IP-адресов для настройки подключений из‑за особенностей работы этих облачных сервисов.

* **Динамические IP-адреса** — <Constant name="cloud" /> предоставляет статические URL для упрощённого доступа, однако динамическая природа облачных сервисов означает, что базовые IP-адреса время от времени меняются. Провайдер облака управляет диапазонами IP-адресов и может изменять их в соответствии со своими эксплуатационными и требованиями безопасности.

* **Использование hostnames для стабильного доступа** — Чтобы обеспечить непрерывный доступ, мы рекомендуем использовать сервисы <Constant name="cloud" /> через hostnames. Hostnames дают стабильную точку обращения независимо от изменений базовых IP-адресов. Мы следуем отраслевому стандарту, который применяют такие организации, как Snowflake.

* **Оптимизация VPN-подключений** — Пользователям, которые работают через VPN, рекомендуется использовать прокси в дополнение к VPN. Такой подход обеспечивает стабильные IP-адреса для подключений, что позволяет трафику без сбоев проходить через VPN и далее к <Constant name="cloud" />. Используя прокси и VPN, вы можете направлять трафик сначала через VPN, а затем к <Constant name="cloud" />. Важно настроить прокси, если вам требуется интеграция с дополнительными сервисами.

<Lightbox src="/img/docs/dbt-cloud/access-urls.png" title="URL-адреса доступа в настройках аккаунта" />

У аккаунтов <Constant name="cloud" /> с префиксами аккаунтов на основе ячеек есть уникальные URL‑адреса доступа к API аккаунта. Эти URL‑адреса можно найти в **настройках аккаунта** в разделе **Account information**.

- Административный API (через URL доступа)
- JDBC API семантического слоя
- GraphQL API семантического слоя
- API обнаружения

Эти URL-адреса уникальны для каждой учетной записи и начинаются с того же префикса, что и URL, используемый для [доступа к вашей учетной записи](#accessing-your-account). Эти URL-адреса охватывают следующие API:

- Admin API (через URL доступа)
- <Constant name="semantic_layer" /> JDBC API
- <Constant name="semantic_layer" /> GraphQL API
- Discovery API

Подробнее об этих возможностях читайте в нашей [документации по API](/docs/dbt-cloud-apis/overview).
