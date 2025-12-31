---
title: "Настройка AWS PrivateLink для Redshift"
id: redshift-privatelink
description: "Настройка PrivateLink для Redshift"
sidebar_label: "AWS PrivateLink для Redshift"
---

# Настройка AWS PrivateLink для Redshift <Lifecycle status="managed_plus" /> {#configure-aws-privatelink-for-redshift}

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

AWS предоставляет два различных способа создания VPC-эндпоинта PrivateLink для кластера Redshift, работающего в другой VPC:
- [Управляемые Redshift PrivateLink Endpoints](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html)
- [Интерфейсные PrivateLink Endpoints для Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/security-private-link.html)

<Constant name="cloud" /> поддерживает оба типа эндпоинтов, однако при выборе подходящего варианта необходимо учитывать ряд [факторов](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html#managing-cluster-cross-vpc-considerations). Redshift-managed обеспечивает значительно более простую настройку и не требует дополнительных затрат, поэтому для многих пользователей он может быть предпочтительным вариантом, но он доступен не во всех средах. Исходя из этих критериев, вам нужно определить, какой тип эндпоинта подходит именно для вашей системы. Далее следуйте инструкциям из раздела ниже, который соответствует выбранному типу эндпоинта.

<CloudProviders type='Redshift' />

## Настройка Redshift-managed PrivateLink {#configuring-redshift-managed-privatelink}

1. Найдите раздел **Granted accounts** в настройках Redshift
   - **Standard Redshift**
        - В запущенном кластере Redshift выберите вкладку **Properties**.
        <Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink1.png" title="Redshift Properties tab"/>
     
   - **Redshift Serverless**
       - На странице **Workgroup configuration** для Redshift Serverless.

2. В разделе **Granted accounts** нажмите **Grant access**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink2.png" title="Предоставленные учетные записи Redshift"/>

3. Введите AWS account ID: `346425330055` — _ПРИМЕЧАНИЕ: этот account ID применяется только для Multi-Tenant‑окружений <Constant name="cloud" />. Для Virtual Private / Single‑Tenant account ID, пожалуйста, свяжитесь с [Support](/community/resources/getting-help#dbt-cloud-support)._

4. Выберите **Grant access to all VPCs** &mdash;или&mdash; (необязательно) обратитесь в [Support](/community/resources/getting-help#dbt-cloud-support), чтобы получить соответствующий региональный VPC ID и указать его в поле **Grant access to specific VPCs**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink3.png" title="Предоставление доступа Redshift"/>

5. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос в [dbt Support](/community/resources/getting-help#dbt-cloud-support):

   - **Standard Redshift**
       ```
       Subject: New Multi-Tenant PrivateLink Request
       - Type: Redshift-managed
       - Redshift cluster name:
       - Redshift cluster AWS account ID:
       - Redshift cluster AWS Region (for example, us-east-1, eu-west-2):
       - <Constant name="cloud" /> multi-tenant environment (US, EMEA, AU):
       ```

   - **Redshift Serverless**
       ```
       Subject: New Multi-Tenant PrivateLink Request
       - Type: Redshift-managed - Serverless
       - Redshift workgroup name:
       - Redshift workgroup AWS account ID:
       - Redshift workgroup AWS Region (for example, us-east-1, eu-west-2):
       - <Constant name="cloud" /> multi-tenant environment (US, EMEA, AU):
       ```

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Настройка интерфейсного PrivateLink для Redshift {#configuring-redshift-interface-type-privatelink}

### 1. Подготовка ресурсов AWS {#1-provision-aws-resources}

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

- **Network Load Balancer (NLB)** &mdash; Требуется создать Listener, который будет привязан к только что созданной Target Group (порт `5439` используется по умолчанию)
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** Выберите VPC, в которой разворачиваются VPC Endpoint Service и NLB, а также выберите сабнеты как минимум из двух Availability Zones.
    - **Security Groups:** Network Load Balancer (NLB), связанный с VPC endpoint service, либо не должен иметь привязанной security group, либо security group должна содержать правило, разрешающее запросы из соответствующих **private CIDR(s)** <Constant name="cloud" />. Обратите внимание, что _это отличается_ от статических публичных IP-адресов, перечисленных на странице <Constant name="cloud" /> [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses). Команда поддержки dbt может предоставить корректные private CIDR(s) по запросу. При необходимости, до тех пор пока вы не сможете уточнить правило до меньшего диапазона CIDR, предоставленного dbt, разрешите подключение, временно добавив allow‑правило `10.0.0.0/8`.
    - **Listeners:** Создайте по одному listener’у на каждую target group, который сопоставляет соответствующий входящий порт с нужной target group ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **VPC Endpoint Service** &mdash; Подключите к только что созданному NLB.
    - Acceptance required (optional) &mdash; Требуется [принять наш запрос на подключение](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) после того, как dbt создаст endpoint.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставление доступа учетной записи AWS dbt к VPC Endpoint Service {#2-grant-dbt-aws-account-access-to-the-vpc-endpoint-service}

На подготовленном VPC Endpoint Service нажмите вкладку **Allow principals**. Нажмите **Allow principals**, чтобы предоставить доступ. Введите ARN корневого пользователя в соответствующей производственной учетной записи AWS и сохраните изменения.

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" title="Введите ARN"/>

### 3. Получение имени VPC Endpoint Service {#3-obtain-vpc-endpoint-service-name}

После того как VPC Endpoint Service будет создан, вы можете найти имя сервиса в консоли AWS, перейдя в раздел **VPC** → **Endpoint Services** и выбрав соответствующий endpoint service. Вы можете скопировать значение поля *service name* и включить его в ваше обращение в службу поддержки <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" title="Получить значение поля имени сервиса"/>

### 4. Добавьте необходимую информацию в шаблон ниже и отправьте запрос в [dbt Support](/community/resources/getting-help#dbt-cloud-support): {#4-add-the-required-information-to-the-template-below-and-submit-your-request-to-dbt-support}

```
Subject: New Multi-Tenant PrivateLink Request
- Type: Redshift Interface-type
- VPC Endpoint Service Name:
- Redshift cluster AWS Region (for example, us-east-1, eu-west-2):
- dbt AWS multi-tenant environment (US, EMEA, AU):
```

<PrivateLinkSLA />

## Создание подключения в dbt {#create-connection-in-dbt}

После того как поддержка <Constant name="cloud" /> завершит настройку, вы сможете начать создавать новые подключения с использованием PrivateLink.

1. Перейдите в **настройки** → **Создать новый проект** → выберите **Redshift**
2. Вы увидите две радиокнопки: **Public** и **Private.** Выберите **Private**. 
3. Выберите частный эндпоинт из выпадающего списка (это автоматически заполнит поле имени хоста/учетной записи).
4. Настройте оставшиеся детали платформы данных.
5. Проверьте ваше подключение и сохраните его.

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
