---
title: "Доступ, регионы и IP-адреса"
sidebar: "Доступ, регионы и IP-адреса"
id: "access-regions-ip-addresses"
description: "Доступные регионы и IP-адреса"
---

<Constant name="cloud" /> [размещается](/docs/cloud/about-cloud/architecture) в нескольких регионах и всегда подключается к вашей платформе данных или git-провайдеру с IP-адресов, указанных ниже. Обязательно разрешите трафик с этих IP-адресов в вашем файрволе и включите их в соответствующие разрешения (grants) базы данных.

- Планы [<Constant name="cloud" /> уровня Enterprise](https://www.getdbt.com/pricing/) позволяют выбрать регион размещения аккаунта из списка в таблице ниже.  
- Организации **обязаны** выбрать один регион для каждого аккаунта <Constant name="cloud" />. Для работы <Constant name="cloud" /> в нескольких регионах мы рекомендуем использовать несколько аккаунтов <Constant name="cloud" />.  

<FilterableTable>

| Region | Location | <div style={{width:'110px'}}>Access URL</div> | <div style={{width:'100px'}}>IP addresses</div> | Available plans | <div style={{width:'200px'}}>Status page link</div> |
|--------|----------|------------|--------------|-------| --------- |
| North America  | AWS us-east-1 (N. Virginia) | **Multi-tenant:**<br />[cloud.getdbt.com](https://cloud.getdbt.com) <br /><br /> **Cell based:** <small>ACCOUNT_PREFIX.us1.dbt.com</small> | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 <br />52.3.77.232 <br />3.214.191.130 <br />34.233.79.135 | [All dbt platform plans](https://www.getdbt.com/pricing/) | **Multi-tenant:** <br /> [US AWS](https://status.getdbt.com/us-aws)<br /><br /> **Cell based:** <br />[US Cell 1 AWS](https://status.getdbt.com/us-cell-1-aws) <br /> [US Cell 2 AWS](https://status.getdbt.com/us-cell-2-aws) <br /> [US Cell 3 AWS](https://status.getdbt.com/us-cell-3-aws) |
| North America  | Azure <br /> East US 2 (Virginia) | **Cell based:** <small>ACCOUNT_PREFIX.us2.dbt.com</small> | 20.10.67.192/26 | All Enterprise plans | [US Cell 1 AZURE](https://status.getdbt.com/us-cell-1-azure) |
| North America  | GCP (us-central1) | **Cell based:** <small>ACCOUNT_PREFIX.us3.dbt.com</small> | 34.33.2.0/26 | All Enterprise plans | [US Cell 1 GCP](https://status.getdbt.com/us-cell-1-gcp) | 
| EMEA  | AWS eu-central-1	(Frankfurt) | **Multi-tenant:**<br />[emea.dbt.com](https://emea.dbt.com) <br /><br /> **Cell based:** <small>ACCOUNT_PREFIX.eu1.dbt.com</small> | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | All Enterprise plans | [EMEA AWS](https://status.getdbt.com/emea-aws) |
| EMEA  | Azure <br /> North Europe (Ireland)  |    **Cell based:** <small>ACCOUNT_PREFIX.eu2.dbt.com</small>  | 20.13.190.192/26   | All Enterprise plans | [EMEA Cell 1 AZURE](https://status.getdbt.com/emea-cell-1-azure) |
| EMEA  | GCP <br /> (London)  |  [eu3.dbt.com](https://eu3.dbt.com)  |  34.33.2.0/26  | All Enterprise plans | [EU Cell 1 GCP](https://status.getdbt.com/eu-cell-1-gcp) |
| APAC  | 	AWS ap-southeast-2  (Sydney)| **Multi-tenant:**<br />[au.dbt.com](https://au.dbt.com) <br /><br /> **Cell based:** <small>ACCOUNT_PREFIX.au1.dbt.com</small> | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />|  All Enterprise plans | [APAC AWS](https://status.getdbt.com/apac-aws) |
| Japan | AWS ap-northeast-1 (Tokyo) | [jp1.dbt.com](https://jp1.dbt.com) | 35.76.76.152 <br />  54.238.211.79 <br /> 13.115.236.233 <br /> | All Enterprise plans | [JP Cell 1 AWS](https://status.getdbt.com/jp-cell-1-aws) | 
| Virtual Private dbt or Single tenant | Customized |  Customized | Ask [Support](/community/resources/getting-help#dbt-cloud-support) for your IPs | All Enterprise plans | Customized |

</FilterableTable>

## Доступ к вашему аккаунту {#accessing-your-account}

Чтобы войти в <Constant name="cloud" />, используйте URL, соответствующий вашей среде. Используемый URL доступа зависит от нескольких факторов, включая регион и тип размещения (tenancy):

- **US multi-tenant:** используйте уникальный URL, который начинается с префикса вашего аккаунта и заканчивается на `us1.dbt.com`. Например, `abc123.us1.dbt.com`. Также можно использовать `cloud.getdbt.com`, однако этот URL будет удалён в будущем.  
    - Если вы не уверены в своём URL доступа, перейдите на `us1.dbt.com` и введите свои учетные данные <Constant name="cloud" />. Если вы являетесь участником одного аккаунта, вход будет выполнен автоматически, а ваш URL отобразится в браузере. Если вы состоите в нескольких аккаунтах, вам будет показан список вариантов с соответствующими URL для входа.

    <Lightbox src="/img/docs/dbt-cloud/find-account.png" width="60%" title="Аккаунты dbt" />

- **EMEA multi-tenant:** используйте `emea.dbt.com`.  
- **APAC multi-tenant:** используйте `au.dbt.com`.  
- **Single-tenant и VPC по всему миру:** используйте vanity URL, предоставленный вам в процессе онбординга.

## Поиск IP-адресов dbt {#locating-your-dbt-ip-addresses}

Существует два способа посмотреть IP-адреса вашего <Constant name="cloud" />:

- Если в аккаунте ещё нет проектов, создайте новый проект — IP-адреса будут показаны на этапе **Configure your environment**.  
- Если у вас уже есть проект, перейдите в **Account Settings** и убедитесь, что вы находитесь во вкладке **Projects**. Нажмите на название проекта — откроется окно **Project Settings**. Найдите поле **Connection** и нажмите на его название. Прокрутите страницу до раздела **Settings** — в первом текстовом блоке будут перечислены ваши IP-адреса.  

### Статические IP-адреса {#static-ip-addresses}

<Constant name="cloud" /> размещается в AWS, Azure и Google Cloud Platform (GCP). Хотя мы можем предоставить статические URL для доступа, мы не можем предоставить фиксированный список IP-адресов для настройки соединений из‑за особенностей работы этих облачных сервисов.

* Динамические IP-адреса — <Constant name="cloud" /> предоставляет статические URL для упрощённого доступа, однако динамическая природа облачных сервисов означает, что базовые IP-адреса периодически меняются. Облачный провайдер управляет диапазонами IP-адресов и может изменять их в соответствии со своими операционными и требованиями безопасности.

* Использование hostname для стабильного доступа — чтобы обеспечить бесперебойный доступ, мы рекомендуем использовать сервисы <Constant name="cloud" /> через hostname. Hostname обеспечивает стабильную точку доступа независимо от изменений базовых IP-адресов. Мы следуем отраслевым стандартам, используемым, в том числе, такими компаниями, как Snowflake.

* Оптимизация VPN‑подключений — пользователям, работающим через VPN, рекомендуется использовать прокси в связке с VPN. Такой подход обеспечивает стабильные IP-адреса для соединений и упрощает прохождение трафика через VPN и далее в <Constant name="cloud" />. Используя прокси и VPN, вы можете направлять трафик сначала через VPN, а затем в <Constant name="cloud" />. Настройка прокси особенно важна, если требуется интеграция с дополнительными сервисами.

## URL доступа к API {#api-access-urls}

Аккаунты <Constant name="cloud" /> с cell-based префиксами имеют уникальные URL доступа к API аккаунта. Эти URL можно найти в разделе **Account settings** под блоком **Account information**.

<Lightbox src="/img/docs/dbt-cloud/access-urls.png" title="URL доступа в настройках аккаунта" />

Эти URL уникальны для каждого аккаунта и начинаются с того же префикса, что и URL, используемый для [доступа к вашему аккаунту](#доступ-к-вашему-аккаунту). Эти URL охватывают следующие API:

- Admin API (через access URL)
- <Constant name="semantic_layer" /> JDBC API
- <Constant name="semantic_layer" /> GraphQL API
- Discovery API  

Подробнее об этих возможностях читайте в нашей [документации по API](/docs/dbt-cloud-apis/overview).
