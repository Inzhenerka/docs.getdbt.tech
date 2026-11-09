---
title: "Настройка AWS PrivateLink для Postgres"
id: aws-postgres
description: "Настройка PrivateLink для Postgres."
sidebar_label: "Postgres"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка AWS PrivateLink для Postgres

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

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
- **Сопоставление сети:** Выберите VPC, в которой развертываются VPC Endpoint Service и NLB, и выберите подсети как минимум из двух зон доступности.
    - **Группы безопасности:** У балансировщика сетевой нагрузки (NLB), связанного с сервисом конечной точки VPC, либо не должно быть связанной группы безопасности, либо в этой группе должно быть правило, разрешающее запросы из соответствующих **частных диапазонов CIDR** <Constant name="dbt" />. Обратите внимание: _это не те же диапазоны_, что и статические публичные IP-адреса, перечисленные на странице <Constant name="dbt" /> [Доступ, регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses). Служба поддержки dbt предоставит нужные частные диапазоны CIDR по запросу. При необходимости, пока вы не сможете сузить правило до меньшего диапазона CIDR, предоставленного dbt, разрешите подключение, временно добавив разрешающее правило для `10.0.0.0/8`.
    - **Обработчики подключений:** Создайте по одному обработчику подключений для каждой целевой группы, сопоставив соответствующий входящий порт с нужной целевой группой ([подробнее](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **Сервис конечной точки VPC** &mdash; Подключите его к созданному NLB.
    - Требуется подтверждение (необязательно) &mdash; Требует от вас [подтвердить наш запрос на подключение](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) после того, как dbt создаст конечную точку.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставьте аккаунту AWS dbt доступ к сервису конечной точки VPC

На подготовленной службе конечной точки VPC нажмите вкладку **Разрешить принципалов**. Нажмите **Разрешить принципалов**, чтобы предоставить доступ. Введите ARN корневого пользователя в соответствующей производственной учетной записи AWS и сохраните изменения.

 - Принципал: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-platform/privatelink-allow-principals.png" width="70%" title="Введите ARN"/>

### 3. Получите имя сервиса конечной точки VPC

После создания сервиса конечной точки VPC его имя можно найти в консоли AWS: перейдите в **VPC** → **Endpoint Services** и выберите нужный сервис конечной точки. Скопируйте значение поля с именем сервиса и включите его в обращение в службу поддержки <Constant name="dbt" />.

<Lightbox src="/img/docs/dbt-platform/privatelink-endpoint-service-name.png" width="70%" title="Получите значение поля с именем сервиса"/>

### 4. Отправьте запрос в службу поддержки dbt
Добавьте необходимую информацию в приведённый ниже шаблон и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Шаблон письма для обращения в службу поддержки" is_open={true}>

```text
Subject: New Multi-Tenant PrivateLink Request

- Type: Postgres Interface-type
- dbt platform account URL:
- VPC Endpoint Service Name:
- Postgres server AWS Region (for example, us-east-1, eu-west-2):
- dbt AWS multi-tenant environment (US, EMEA, AU, JP):
```

</Expandable>
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

### 5. Примите запрос на подключение

Когда вы получите уведомление о том, что ресурсы подготовлены в среде <Constant name="dbt" />, необходимо принять запрос на подключение к конечной точке (если сервис конечной точки VPC не настроен на автоматическое принятие запросов на подключение). Вы можете принимать запросы через консоль AWS, как показано ниже, или через AWS CLI.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/accept-request.png" width="80%" title="Примите запрос на подключение" />

## Создайте подключение в dbt

После того как служба поддержки <Constant name="dbt" /> завершит настройку, вы сможете создавать новые подключения с использованием PrivateLink.

<PrivateLinkCreateConnection platform="PostgreSQL" />

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
