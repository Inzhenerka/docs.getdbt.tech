---
title: "Настройка AWS PrivateLink для Postgres"
id: postgres-privatelink
description: "Настройка PrivateLink для Postgres"
sidebar_label: "AWS PrivateLink для Postgres"
---

# Настройка AWS PrivateLink для Postgres <Lifecycle status="managed_plus" /> {#configure-aws-privatelink-for-postgres}

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

База данных Postgres, размещенная либо в AWS, либо в правильно подключенном локальном центре обработки данных, может быть доступна через частное сетевое соединение с использованием AWS Interface-type PrivateLink. Тип группы целей, подключенной к сетевому балансировщику нагрузки (NLB), может варьироваться в зависимости от местоположения и типа подключаемого экземпляра Postgres, как объясняется в следующих шагах.

<CloudProviders type='Postgres' />

## Настройка интерфейсного типа PrivateLink для Postgres {#configuring-postgres-interface-type-privatelink}

### 1. Подготовка ресурсов AWS {#1-provision-aws-resources}

Создание соединения Interface VPC PrivateLink требует создания нескольких ресурсов AWS в учетной записи, содержащей или подключенной к экземпляру Postgres:

- **Группа безопасности (только для размещения в AWS)** &mdash; Если вы подключаетесь к существующему экземпляру Postgres, это, вероятно, уже существует, однако вам может потребоваться добавить или изменить правила группы безопасности, чтобы принимать трафик от сетевого балансировщика нагрузки (NLB), созданного для этой службы конечной точки.
- **Группа целей** &mdash; Группа целей будет прикреплена к NLB, чтобы указать, куда направлять запросы. Для групп целей NLB доступны различные типы целей, поэтому выберите тот, который подходит для вашей настройки Postgres.
    
    - Тип цели:

        - _[Amazon RDS для PostgreSQL](https://aws.amazon.com/rds/postgresql/)_ -  **IP**

            - Найдите IP-адрес вашего экземпляра RDS, используя командную строку, такую как `nslookup <endpoint>` или `dig +short <endpoint>` с вашим DNS-адресом RDS

            - _Примечание_: С возможностями отказоустойчивости RDS Multi-AZ IP-адрес вашего экземпляра RDS может измениться, в этом случае ваша группа целей должна быть обновлена. См. [этот блог AWS](https://aws.amazon.com/blogs/database/access-amazon-rds-across-vpcs-using-aws-privatelink-and-network-load-balancer/) для получения более подробной информации и возможного решения. 

        - _Локальный сервер Postgres_ -  **IP**

            - Используйте IP-адрес локального сервера Postgres, связанного с AWS через AWS Direct Connect или соединение VPN "сайт-сайт"

        - _Postgres на EC2_ - **Instance/ASG** (или **IP**)

            - Если ваш экземпляр Postgres размещен на EC2, тип группы целей _instance_ (или, в идеале, [использование типа instance для подключения к группе автоматического масштабирования](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)) может быть использован для подключения экземпляра без необходимости в статическом IP-адресе

            - Тип IP также может быть использован, с пониманием того, что IP-адрес экземпляра EC2 может измениться, если экземпляр будет перезапущен по какой-либо причине

    - Протокол группы целей: **TCP** 

- **Network Load Balancer (NLB)** &mdash; Требуется создать Listener, который будет привязан к только что созданной Target Group для порта `5432`
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** Выберите VPC, в котором разворачиваются VPC Endpoint Service и NLB, и укажите подсети как минимум из двух Availability Zones.
    - **Security Groups:** Network Load Balancer (NLB), связанный с VPC endpoint service, либо не должен иметь привязанной security group, либо security group должна содержать правило, разрешающее запросы из соответствующих **private CIDR(s)** <Constant name="cloud" />. Обратите внимание, что _это отличается_ от статических публичных IP-адресов, перечисленных на странице <Constant name="cloud" /> [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses). Поддержка dbt может предоставить корректные private CIDR(s) по запросу. При необходимости, до тех пор пока вы не сможете сузить правило до меньшего CIDR, предоставленного dbt, можно временно разрешить подключение, добавив allow‑правило `10.0.0.0/8`.
    - **Listeners:** Создайте по одному listener’у на каждую target group, который сопоставляет соответствующий входящий порт с нужной target group ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **VPC Endpoint Service** &mdash; Подключите его к только что созданному NLB.
    - Acceptance required (optional) &mdash; Требует, чтобы вы [приняли наш запрос на подключение](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) после того, как dbt создаст endpoint.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставление доступа учетной записи AWS dbt к службе конечной точки VPC {#2-grant-dbt-aws-account-access-to-the-vpc-endpoint-service}

На подготовленной службе конечной точки VPC нажмите вкладку **Разрешить принципалов**. Нажмите **Разрешить принципалов**, чтобы предоставить доступ. Введите ARN корневого пользователя в соответствующей производственной учетной записи AWS и сохраните изменения.

 - Принципал: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" width="70%" title="Введите ARN"/>

### 3. Получение имени службы конечной точки VPC {#3-obtain-vpc-endpoint-service-name}

После того как сервис VPC Endpoint Service будет создан, вы можете найти его имя в консоли AWS, перейдя в раздел **VPC** → **Endpoint Services** и выбрав соответствующий endpoint‑сервис. Вы можете скопировать значение поля service name и включить его в обращение в службу поддержки <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" width="70%" title="Получите значение поля имени службы"/>

### 4. Добавьте необходимую информацию в шаблон ниже и отправьте ваш запрос в [dbt Support](/community/resources/getting-help#dbt-cloud-support): {#4-add-the-required-information-to-the-template-below-and-submit-your-request-to-dbt-support}
```
Subject: New Multi-Tenant PrivateLink Request
- Type: Postgres Interface-type
- VPC Endpoint Service Name:
- Postgres server AWS Region (for example, us-east-1, eu-west-2):
- dbt AWS multi-tenant environment (US, EMEA, AU):
```

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

### 5. Принятие запроса на подключение {#5-accepting-the-connection-request}

Когда вы получите уведомление о том, что ресурсы развернуты в среде <Constant name="cloud" />, вам необходимо принять подключение к endpoint (если только сервис VPC Endpoint Service не настроен на автоматическое принятие запросов на подключение). Запросы можно принять через консоль AWS, как показано ниже, либо с помощью AWS CLI.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/accept-request.png" width="80%" title="Принять запрос на подключение" />

## Создание подключения в dbt {#create-connection-in-dbt}

После того как поддержка <Constant name="cloud" /> завершит настройку, вы сможете начать создавать новые подключения с использованием PrivateLink.

1. Перейдите в **настройки** → **Создать новый проект** → выберите **PostgreSQL**
2. Вы увидите две радиокнопки: **Публичный** и **Частный.** Выберите **Частный**. 
3. Выберите частную конечную точку из выпадающего списка (это автоматически заполнит поле имени хоста/учетной записи).
4. Настройте оставшиеся детали платформы данных.
5. Проверьте ваше подключение и сохраните его.

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
