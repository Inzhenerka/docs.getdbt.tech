---
title: "Настройка AWS PrivateLink для Redshift"
id: redshift-privatelink
description: "Настройка PrivateLink для Redshift"
sidebar_label: "PrivateLink для Redshift"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

AWS предоставляет два различных способа создания VPC-эндпоинта PrivateLink для кластера Redshift, работающего в другой VPC:
- [Управляемые Redshift PrivateLink Endpoints](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html)
- [Интерфейсные PrivateLink Endpoints для Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/security-private-link.html)

dbt Cloud поддерживает оба типа эндпоинтов, но при выборе типа эндпоинта необходимо учитывать ряд [факторов](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html#managing-cluster-cross-vpc-considerations). Управляемые Redshift обеспечивают гораздо более простую настройку без дополнительных затрат, что может сделать их предпочтительным вариантом для многих, но они могут быть недоступны во всех средах. Основываясь на этих критериях, вам нужно определить, какой тип подходит для вашей системы. Следуйте инструкциям из раздела ниже, который соответствует выбранному вами типу эндпоинта.

<CloudProviders type='Redshift' />

:::note Redshift Serverless
Хотя Redshift Serverless поддерживает управляемые Redshift VPC-эндпоинты, эта функциональность в настоящее время недоступна между учетными записями AWS. Из-за этого ограничения для подключения PrivateLink кластера Redshift Serverless из dbt Cloud необходимо использовать интерфейсный VPC-эндпоинт.
:::

## Настройка управляемого Redshift PrivateLink

1. На работающем кластере Redshift выберите вкладку **Properties**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink1.png" title="Вкладка свойств Redshift"/>

2. В разделе **Granted accounts** нажмите **Grant access**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink2.png" title="Предоставленные учетные записи Redshift"/>

3. Введите ID учетной записи AWS: `346425330055` - _ПРИМЕЧАНИЕ: Этот ID учетной записи применяется только к средам dbt Cloud Multi-Tenant. Для ID учетных записей Virtual Private/Single-Tenant, пожалуйста, свяжитесь с [поддержкой](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support)._

4. Выберите **Grant access to all VPCs** &mdash;или&mdash; (опционально) свяжитесь с [поддержкой](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support) для получения соответствующего регионального ID VPC, чтобы указать его в поле **Grant access to specific VPCs**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink3.png" title="Предоставление доступа Redshift"/>

5. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос в [поддержку dbt](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):

```
Тема: Новый запрос на Multi-Tenant PrivateLink
- Тип: Управляемый Redshift
- Имя кластера Redshift:
- ID учетной записи AWS кластера Redshift:
- Регион AWS кластера Redshift (например, us-east-1, eu-west-2):
- Среда dbt Cloud multi-tenant (US, EMEA, AU):
```

import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';

<PrivateLinkSLA />

## Настройка интерфейсного PrivateLink для Redshift

### 1. Подготовка ресурсов AWS

Создание интерфейсного VPC PrivateLink соединения требует создания нескольких ресурсов AWS в учетной записи, содержащей кластер Redshift:

- **Security Group** &mdash; Если вы подключаетесь к существующему кластеру Redshift, это, вероятно, уже существует, однако вам может потребоваться добавить или изменить правила Security Group, чтобы принимать трафик от Network Load Balancer (NLB), созданного для этого Endpoint Service.
- **Target Group** &mdash; Target Group будет прикреплена к NLB, чтобы указать, куда направлять запросы. Существуют различные типы целей для Target Groups NLB, но вы будете использовать тип IP-адреса.
    
    - Тип цели: **IP**

        - **Стандартный Redshift**

            - Используйте IP-адреса из **Network Interfaces** кластера Redshift, когда это возможно. Хотя IP-адреса, указанные в разделе **Node IP addresses**, будут работать, они также более подвержены изменениям.
            <Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink4.png" title="Тип цели: IP-адрес"/>

            - Вероятно, будет только один сетевой интерфейс (NI) в начале, но если кластер перейдет в другую зону доступности (AZ), будет создан новый NI для этой AZ. IP NI из оригинальной AZ все еще будет работать, но новый IP NI также может быть добавлен в Target Group. Если добавляются дополнительные IP, обратите внимание, что NLB также должен добавить соответствующую AZ. После создания NI(ы) должны оставаться неизменными (это наше наблюдение из тестирования, но AWS официально это не документирует).

        - **Redshift Serverless**

            - Чтобы найти IP-адреса для экземпляра Redshift Serverless, найдите и скопируйте конечную точку (только URL, указанный перед портом) в разделе конфигурации Workgroup в консоли AWS для экземпляра.
            <Lightbox src="/img/docs/dbt-cloud/redshiftserverless.png" title="Конечная точка Redshift Serverless"/>

            - Из командной строки выполните команду `nslookup <endpoint>`, используя конечную точку, найденную на предыдущем шаге, и используйте связанные IP для Target Group.

    - Протокол Target Group: **TCP** 

- **Network Load Balancer (NLB)** &mdash; Требуется создание Listener, который прикрепляется к вновь созданной Target Group для порта `5439`
    - **Схема:** Внутренняя
    - **Тип IP-адреса:** IPv4
    - **Сетевое отображение:** Выберите VPC, в которой развертываются VPC Endpoint Service и NLB, и выберите подсети как минимум из двух зон доступности.
    - **Security Groups:** Network Load Balancer (NLB), связанный с VPC Endpoint Service, должен либо не иметь связанной группы безопасности, либо группа безопасности должна иметь правило, позволяющее запросы от соответствующих **частных CIDR** dbt Cloud. Обратите внимание, что _это отличается_ от статических публичных IP, указанных на странице dbt Cloud [Доступ, регионы и IP-адреса](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses). Поддержка dbt может предоставить правильные частные CIDR по запросу. Если необходимо, до того как вы сможете уточнить правило до меньшего CIDR, предоставленного dbt, разрешите подключение, временно добавив правило разрешения `10.0.0.0/8`.
    - **Listeners:** Создайте один listener на каждую целевую группу, который сопоставляет соответствующий входящий порт с соответствующей целевой группой ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **VPC Endpoint Service** &mdash; Прикрепите к вновь созданному NLB.
    - Требуется принятие (опционально) &mdash; Требует [принять наш запрос на подключение](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) после того, как dbt создаст эндпоинт.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставление доступа учетной записи AWS dbt к VPC Endpoint Service

На подготовленном VPC Endpoint Service нажмите вкладку **Allow principals**. Нажмите **Allow principals**, чтобы предоставить доступ. Введите ARN корневого пользователя в соответствующей производственной учетной записи AWS и сохраните изменения.

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" title="Введите ARN"/>

### 3. Получение имени VPC Endpoint Service

После того как VPC Endpoint Service будет подготовлен, вы можете найти имя сервиса в консоли AWS, перейдя в **VPC** → **Endpoint Services** и выбрав соответствующий сервис эндпоинта. Вы можете скопировать значение поля имени сервиса и включить его в ваше сообщение в поддержку dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" title="Получить значение поля имени сервиса"/>

### 4. Добавьте необходимую информацию в шаблон ниже и отправьте ваш запрос в [поддержку dbt](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):
```
Тема: Новый запрос на Multi-Tenant PrivateLink
- Тип: Интерфейсный Redshift
- Имя VPC Endpoint Service:
- Регион AWS кластера Redshift (например, us-east-1, eu-west-2):
- Среда dbt Cloud multi-tenant (US, EMEA, AU):
```

<PrivateLinkSLA />

## Создание подключения в dbt Cloud

После того как поддержка dbt Cloud завершит настройку, вы можете начать создавать новые подключения, используя PrivateLink.

1. Перейдите в **настройки** → **Создать новый проект** → выберите **Redshift**
2. Вы увидите две радиокнопки: **Public** и **Private.** Выберите **Private**. 
3. Выберите частный эндпоинт из выпадающего списка (это автоматически заполнит поле имени хоста/учетной записи).
4. Настройте оставшиеся детали платформы данных.
5. Проверьте ваше подключение и сохраните его.

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>