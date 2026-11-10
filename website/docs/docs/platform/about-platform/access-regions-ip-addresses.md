---
title: "Доступ, регионы и IP-адреса"
sidebar: "Доступ, регионы и IP-адреса"
id: "access-regions-ip-addresses"
description: "Доступные регионы и IP-адреса"
availability:
  surface: platform
  access: login_required
---

За исключением случаев, указанных ниже, <Constant name="dbt" /> [размещается](/docs/platform/about-platform/architecture) в нескольких регионах у следующих поставщиков облачных услуг:

- [Amazon Web Services](#AWS)
- [Google Cloud Platform](#GCP)
- [Microsoft Azure](#Azure)

Ваш аккаунт <Constant name="dbt" /> будет подключаться к вашей платформе данных или Git-провайдеру с указанных ниже IP-адресов. Обязательно разрешите трафик с этих IP-адресов в межсетевом экране и укажите их во всех соответствующих разрешениях на доступ к базе данных.

- На [тарифных планах Enterprise для <Constant name="dbt" />](https://www.getdbt.com/pricing/) можно выбрать размещение аккаунта в любом из регионов, перечисленных в следующей таблице. 
- Организации **должны** выбрать один регион для каждого аккаунта <Constant name="dbt" />. Для работы с <Constant name="dbt" /> в нескольких регионах рекомендуем использовать несколько аккаунтов <Constant name="dbt" />. 

[dbt State](/docs/deploy/dbt-state-about) в настоящее время доступен только в регионе Google Cloud Platform в США. Подробнее см. в разделе [Как хранятся данные в dbt State?](/faqs/State/data-storage)

## Amazon Web Services (AWS) {#AWS}


| Регион | Расположение | <div style={{width:'110px'}}>URL для доступа</div> | <div style={{width:'100px'}}>IP-адреса</div> | Доступные тарифные планы | <div style={{width:'200px'}}>Ссылка на страницу состояния</div> |
|--------|----------|------------|--------------|-------| --------- |
| Северная Америка  | AWS us-east-1 (Северная Вирджиния) | <small>ACCOUNT_PREFIX.us1.dbt.com</small> | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 <br />52.3.77.232 <br />3.214.191.130 <br />34.233.79.135 | [Все тарифные планы платформы dbt](https://www.getdbt.com/pricing/) | **Мультитенантное размещение:** <br /> [US East AWS](https://status.getdbt.com/us-aws)<br /><br /> **Размещение на основе ячеек:** <br />[US East Cell 1 AWS](https://status.getdbt.com/us-cell-1-aws) <br /> [US East Cell 2 AWS](https://status.getdbt.com/us-cell-2-aws) <br /> [US East Cell 3 AWS](https://status.getdbt.com/us-cell-3-aws) <br /> [US East Cell 4 AWS](https://status.getdbt.com/us-cell-4-aws) |
| Северная Америка  | AWS us-west-2 (Орегон)      | <small>ACCOUNT_PREFIX.us5.dbt.com</small> | 32.185.64.51 <br /> 34.217.173.137 <br /> 52.37.223.167 | Все тарифные планы Enterprise | [US West Cell 1 AWS](https://status.getdbt.com/us-5-cell-1-aws) |
| EMEA  | eu-central-1	(Франкфурт) | <small>ACCOUNT_PREFIX.eu1.dbt.com</small> | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | Все тарифные планы Enterprise | [EMEA AWS](https://status.getdbt.com/emea-aws) |
| APAC  | ap-southeast-2  (Сидней)| <small>ACCOUNT_PREFIX.au1.dbt.com</small> | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />|  Все тарифные планы Enterprise | [APAC AWS](https://status.getdbt.com/apac-aws) |
| Япония | ap-northeast-1 (Токио) | <small>ACCOUNT_PREFIX.jp1.dbt.com</small> | 35.76.76.152 <br />  54.238.211.79 <br /> 13.115.236.233 <br /> | Все тарифные планы Enterprise | [JP Cell 1 AWS](https://status.getdbt.com/jp-cell-1-aws) | 
| Virtual Private dbt или выделенное размещение | Индивидуально |  Индивидуально | Уточните свои IP-адреса в [службе поддержки](/community/resources/getting-help#dbt-cloud-support) | Все тарифные планы Enterprise | Индивидуально |


## Google Cloud Platform (GCP) {#GCP}


| Регион | Расположение | <div style={{width:'110px'}}>URL для доступа</div> | <div style={{width:'100px'}}>IP-адреса</div> | Доступные тарифные планы | <div style={{width:'200px'}}>Ссылка на страницу состояния</div> |
|--------|----------|------------|--------------|-------| --------- |
| Северная Америка  | us-central1 | <small>ACCOUNT_PREFIX.us3.dbt.com</small> | 34.33.2.0/26 | Все тарифные планы Enterprise | [US Cell 1 GCP](https://status.getdbt.com/us-cell-1-gcp) | 
| EMEA  | Лондон  |  <small>ACCOUNT_PREFIX.eu3.dbt.com</small> |  34.39.41.0/26  | Все тарифные планы Enterprise | [EU Cell 1 GCP](https://status.getdbt.com/eu-cell-1-gcp) |
| EMEA  | Франкфурт | <small>ACCOUNT_PREFIX.eu4.dbt.com</small> | 34.185.244.128/26 | Все тарифные планы Enterprise | [EU4 Cell 1 GCP](https://status.getdbt.com/eu-4-cell-1-gcp) |
| Virtual Private dbt или выделенное размещение | Индивидуально |  Индивидуально | Уточните свои IP-адреса в [службе поддержки](/community/resources/getting-help#dbt-cloud-support) | Все тарифные планы Enterprise | Индивидуально |


## Microsoft Azure {#Azure}

| Регион | Расположение | <div style={{width:'110px'}}>URL для доступа</div> | <div style={{width:'100px'}}>IP-адреса</div> | Доступные тарифные планы | <div style={{width:'200px'}}>Ссылка на страницу состояния</div> |
|--------|----------|------------|--------------|-------| --------- |
| Северная Америка  | East US 2 (Вирджиния) | <small>ACCOUNT_PREFIX.us2.dbt.com</small> | 20.10.67.192/26 | Все тарифные планы Enterprise | [US Cell 1 AZURE](https://status.getdbt.com/us-cell-1-azure) |
| EMEA  |  North Europe (Ирландия)  |  <small>ACCOUNT_PREFIX.eu2.dbt.com</small>  | 20.13.190.192/26   | Все тарифные планы Enterprise | [EMEA Cell 1 AZURE](https://status.getdbt.com/emea-cell-1-azure) |
| APAC | Australia East | <small>ACCOUNT_PREFIX.au2.dbt.com</small> | 20.11.97.208/28 | Все тарифные планы Enterprise | [AUS Cell 1 AZURE](https://status.getdbt.com/au-2-cell-1-azure) |
| Virtual Private dbt или выделенное размещение | Индивидуально |  Индивидуально | Уточните свои IP-адреса в [службе поддержки](/community/resources/getting-help#dbt-cloud-support) | Все тарифные планы Enterprise | Индивидуально |


## Доступ к аккаунту {#accessing-your-account}

Рекомендуемый способ входа в <Constant name="dbt_platform"/> — через [https://login.dbt.com](https://login.dbt.com). Введите свой адрес электронной почты, подтвердите его и выберите нужный аккаунт из списка аккаунтов, связанных с этим адресом. Подробнее о процессе входа см. в разделе [Вход в платформу dbt](/docs/platform/about-platform/login).

Если вы уже знаете **URL для доступа** к своему аккаунту, вы можете войти напрямую. URL для доступа зависит от региона и типа размещения:

<Lightbox src="/img/docs/dbt-platform/find-account.png" width="60%" title="Аккаунты dbt" />

- **Мультитенантное размещение в США:** `ACCOUNT_PREFIX.us1.dbt.com` (например, `abc123.us1.dbt.com`)
- **Мультитенантное размещение в EMEA:** `ACCOUNT_PREFIX.eu1.dbt.com` (например, `abc123.eu1.dbt.com`)
- **Мультитенантное размещение в APAC:** `ACCOUNT_PREFIX.au1.dbt.com` (например, `abc123.au1.dbt.com`)
- **Выделенное размещение и VPC по всему миру:** используйте персонализированный URL, предоставленный при подключении.

Полный список URL для доступа по регионам см. в [таблицах выше](#AWS).

## Где найти IP-адреса dbt

Просмотреть IP-адреса <Constant name="dbt_platform" /> можно двумя способами:
- Если в аккаунте ещё нет проектов, создайте новый проект: IP-адреса отобразятся на этапах **Configure your environment**.
- Если у вас уже есть проект, перейдите в **Account Settings** и убедитесь, что открыта панель **Projects**. Нажмите на название проекта, чтобы открыть окно **Project Settings**. Найдите поле **Connection** и нажмите на название подключения. Прокрутите страницу вниз до раздела **Settings**: ваши IP-адреса перечислены в первом текстовом блоке. 

### Статические IP-адреса

<Constant name="dbt_platform" /> размещается в AWS, Azure и Google Cloud Platform (GCP). Мы можем предоставить постоянные URL для доступа, но из-за особенностей этих облачных сервисов не можем предоставить список IP-адресов для настройки подключений.

* Динамические IP-адреса &mdash; <Constant name="dbt_platform" /> предоставляет постоянные URL для удобного доступа, однако из-за динамической природы облачных сервисов соответствующие IP-адреса могут время от времени меняться. Облачные провайдеры управляют этими диапазонами IP-адресов и могут обновлять их в соответствии с эксплуатационными требованиями и требованиями безопасности.

* Использование имён хостов для стабильного доступа &mdash; чтобы обеспечить бесперебойный доступ, используйте имена хостов <Constant name="dbt_platform" />. Имя хоста, например `abc123.us1.dbt.com`, остаётся постоянной точкой доступа, даже если соответствующие IP-адреса меняются. Такой подход соответствует общепринятой отраслевой практике, которую используют, в частности, такие платформы, как Snowflake.

* Оптимизация VPN-подключений &mdash; для пользователей, подключающихся через VPN, следует дополнительно настроить прокси-сервер. Такой подход обеспечивает постоянные IP-адреса для подключений, позволяя трафику беспрепятственно проходить через VPN и далее к <Constant name="dbt_platform" />. Используя прокси-сервер совместно с VPN, вы можете направлять трафик через VPN, а затем к <Constant name="dbt_platform" />. Настройка прокси-сервера особенно важна, если вам требуется интеграция с дополнительными сервисами.

## URL для доступа к API {#api-access-urls}

Для аккаунтов <Constant name="dbt_platform" /> с префиксами, основанными на ячейках, URL для доступа к API уникальны для каждого аккаунта. Эти URL можно найти в **Account settings**, в разделе **Account information**.

<Lightbox src="/img/docs/dbt-platform/access-urls.png" title="URL для доступа в настройках аккаунта" />

Эти URL уникальны для каждого аккаунта и начинаются с того же префикса, что и URL для [доступа к аккаунту](#accessing-your-account). URL предназначены для следующих API:

- Admin API (через URL для доступа)
- JDBC API <Constant name="semantic_layer" />
- GraphQL API <Constant name="semantic_layer" />
- Discovery API 

Подробнее об этих возможностях см. в нашей [документации по API](/docs/dbt-apis/overview).
