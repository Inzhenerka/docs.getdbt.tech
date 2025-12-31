---
title: "Настройка PrivateLink для самоуправляемых облачных систем контроля версий (VCS)"
id: vcs-privatelink
description: "Настройка подключения PrivateLink между dbt и облачным git‑сервером организации"
sidebar_label: "PrivateLink для VCS"
---

# Настройка PrivateLink для самостоятельно размещённого облачного VCS <Lifecycle status="managed_plus" /> {#configuring-privatelink-for-self-hosted-cloud-vcs}

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

AWS PrivateLink обеспечивает приватное подключение от <Constant name="cloud" /> к вашей самостоятельно размещённой облачной системе управления версиями (VCS), направляя запросы через вашу виртуальную частную сеть (VPC). Такой тип подключения не требует публичного раскрытия конечной точки ваших VCS‑репозиториев и не предполагает прохождения запросов через публичный интернет, что обеспечивает максимально возможный уровень безопасности. AWS рекомендует использовать подключение через PrivateLink в рамках своего [Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) и подробно описывает этот паттерн в разделе **Shared Services** документа [AWS PrivateLink whitepaper](https://docs.aws.amazon.com/pdfs/whitepapers/latest/aws-privatelink/aws-privatelink.pdf).

Вы узнаете, на высоком уровне, какие ресурсы необходимы для реализации этого решения. Облачные среды и процессы развертывания сильно различаются, поэтому информация из этого руководства может потребовать адаптации под ваши требования.

## Обзор соединения PrivateLink {#privatelink-connection-overview}

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/privatelink-vcs-architecture.png" width="80%" title="Обзор архитектуры dbt и AWS PrivateLink для VCS на высоком уровне" />

### Необходимые ресурсы для создания соединения {#required-resources-for-creating-a-connection}

Создание соединения Interface VPC PrivateLink требует создания нескольких ресурсов AWS в вашем аккаунте AWS и частной сети, содержащей самоуправляемый экземпляр VCS. Вы несете ответственность за развертывание и обслуживание этих ресурсов. После развертывания информация о соединении и разрешения передаются в dbt Labs для завершения соединения, что позволяет прямое частное подключение VPC к VPC.

Этот подход отличается от других и не требует настраивать VPC peering между вашими аккаунтами AWS и <Constant name="cloud" />.

### 1. Развертывание ресурсов AWS {#1-provision-aws-resources}

Создание соединения Interface VPC PrivateLink требует создания нескольких ресурсов AWS в аккаунте, содержащем или подключенном к вашему самоуправляемому облачному VCS. Эти ресурсы могут быть созданы через AWS Console, AWS CLI или Infrastructure-as-Code, такие как [Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) или [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

- **Security Group (только для размещенных в AWS)** &mdash; Если вы подключаетесь к существующей установке VCS, это, вероятно, уже существует, однако, возможно, вам потребуется добавить или изменить правила Security Group для принятия трафика от Network Load Balancer (NLB), созданного для этой Endpoint Service.
- **Target Group(s)** - [Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html) прикрепляется к [Listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html) на NLB и отвечает за маршрутизацию входящих запросов к здоровым целям в группе. Если подключение к системе VCS осуществляется как по SSH, так и по HTTPS, необходимо создать две **Target Groups**.
    - **Тип цели (выберите наиболее подходящий):**
        - **Instance/ASG:** Выберите существующие экземпляры EC2, на которых работает система VCS, или [группу автоматического масштабирования](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html) (ASG) для автоматического подключения любых экземпляров, запущенных из этой ASG.
        - **Application Load Balancer (ALB):** Выберите ALB, который уже имеет прикрепленные экземпляры VCS EC2 (только HTTP/S трафик).
        - **IP Addresses:** Выберите IP-адрес(а) экземпляров EC2, на которых установлена система VCS. Имейте в виду, что IP-адрес экземпляра EC2 может измениться, если экземпляр будет перезапущен по какой-либо причине.
    - **Протокол/Порт:** Выберите одну пару протокол/порт для каждой Target Group, например:
        - TG1 - SSH: TCP/22
- **TG2 — HTTPS:** TCP/443 или TLS, если вы хотите прикрепить сертификат для расшифровки TLS‑соединений ([подробнее](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html)).
    - **VPC:** Выберите VPC, в котором будут созданы VPC Endpoint Service и NLB.
    - **Health checks:** Цели должны зарегистрироваться как healthy, чтобы NLB начал перенаправлять запросы. Настройте проверку состояния, подходящую для вашего сервиса и протокола Target Group ([подробнее](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html)).
    - **Register targets:** Зарегистрируйте цели (см. выше) для сервиса VCS ([подробнее](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-register-targets.html)). _Крайне важно убедиться, что цели находятся в состоянии healthy, прежде чем пытаться установить соединение со стороны <Constant name="cloud" />._
- **Network Load Balancer (NLB)** — требуется создать Listener, который будет привязан к только что созданным Target Group для порта `443` и/или `22`, в зависимости от конфигурации.
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** Выберите VPC, в котором разворачиваются VPC Endpoint Service и NLB, и выберите подсети как минимум в двух зонах доступности (Availability Zones).
    - **Security Groups:** Network Load Balancer (NLB), связанный с VPC Endpoint Service, либо не должен иметь привязанных Security Group, либо Security Group должна содержать правило, разрешающее запросы из соответствующих **private CIDR(s)** <Constant name="cloud" />. Обратите внимание, что **это отличается** от статических публичных IP‑адресов, перечисленных на странице <Constant name="cloud" /> [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses). Корректные private CIDR(s) могут быть предоставлены службой поддержки dbt по запросу. При необходимости временное добавление разрешающего правила `10.0.0.0/8` позволит обеспечить подключение до тех пор, пока правило не будет уточнено до меньшего диапазона CIDR, предоставленного dbt.
    - **Listeners:** Создайте по одному Listener для каждой Target Group, который сопоставляет соответствующий входящий порт с соответствующей Target Group ([подробнее](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **Endpoint Service** — VPC Endpoint Service обеспечивает VPC‑to‑VPC подключение, маршрутизируя входящие запросы к настроенному балансировщику нагрузки.
    - **Load balancer type:** Network.
    - **Load balancer:** Подключите NLB, созданный на предыдущем шаге.
    - **Acceptance required (recommended):** При включении требует, чтобы каждый новый запрос на подключение к VPC Endpoint Service был принят клиентом перед тем, как будет разрешена связность ([подробнее](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests)).

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставление доступа аккаунту AWS dbt к VPC Endpoint Service {#2-grant-dbt-aws-account-access-to-the-vpc-endpoint-service}

После развертывания этих ресурсов необходимо предоставить доступ аккаунту AWS dbt Labs для создания VPC Endpoint в нашей VPC. На развернутом VPC Endpoint Service нажмите вкладку **Allow principals**. Нажмите **Allow principals**, чтобы предоставить доступ. Введите ARN следующей роли IAM в соответствующем производственном аккаунте AWS и сохраните изменения ([подробности](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions)).

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

 <Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" width="70%" title="Введите ARN"/>

### 3. Получение имени VPC Endpoint Service {#3-obtain-vpc-endpoint-service-name}

После того как **VPC Endpoint Service** будет создан и настроен, найдите имя сервиса в консоли AWS, перейдя в раздел **VPC** → **Endpoint Services** и выбрав соответствующий endpoint service. Скопируйте значение поля **service name** и укажите его в обращении в службу поддержки <Constant name="cloud" />.

 <Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" width="70%" title="Получите значение поля имени сервиса"/>

:::note Настройка пользовательского DNS
 
Если для подключения к сервису VCS требуется пользовательский домен и/или URL для TLS, команда dbt Labs Infrastructure может настроить **private hosted zone** в частной сети <Constant name="cloud" />. Например:
- Private hosted zone: examplecorp.com
- DNS record: github.examplecorp.com

:::

### 4. Добавьте необходимую информацию в шаблон ниже и отправьте запрос в [dbt Support](/community/resources/getting-help#dbt-cloud-support): {#4-add-the-required-information-to-the-template-below-and-submit-your-request-to-dbt-support}
```
Subject: New Multi-Tenant PrivateLink Request
- Type: VCS Interface-type
- VPC Endpoint Service Name:
- Custom DNS (if HTTPS)
    - Private hosted zone:
    - DNS record:
- VCS install AWS Region (for example, us-east-1, eu-west-2):
- dbt AWS multi-tenant environment (US, EMEA, AU):
```

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

### 5. Принятие запроса на соединение {#5-accepting-the-connection-request}

Когда вы получите уведомление о том, что ресурсы развернуты в среде <Constant name="cloud" />, вам необходимо принять подключение к endpoint (если только VPC Endpoint Service не настроен на автоматическое принятие запросов на подключение). Запросы можно принять через консоль AWS, как показано ниже, или с помощью AWS CLI.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/accept-request.png" width="80%" title="Принять запрос на соединение" />

После того как вы примете запрос на подключение к endpoint, вы сможете использовать PrivateLink endpoint в <Constant name="cloud" />.

## Настройка в dbt {#configure-in-dbt}

После того как dbt подтвердит, что интеграция PrivateLink завершена, вы можете использовать ее в новой или существующей конфигурации git.

**Чтобы настроить новую git‑интеграцию с PrivateLink:**

1. Нажмите на имя своей учетной записи в нижнем левом меню и перейдите в **Account settings** > **Projects**.
2. Нажмите **New project**.
3. Задайте имя проекта и настройте среду разработки.
4. В разделе **Set up repository** нажмите **Git clone**.
5. В качестве типа подключения выберите **PrivateLink Endpoint**.  
   Настроенные интеграции появятся в выпадающем списке.
6. Выберите настроенный endpoint из выпадающего списка.
7. Нажмите **Save**.

**Чтобы настроить существующую git‑интеграцию с PrivateLink:**

1. Щёлкните имя своей учётной записи в нижнем левом меню и перейдите в **Account settings** > **Integrations**.
2. В разделе **Gitlab** выберите **PrivateLink Endpoint** в качестве типа подключения.
     Настроенные интеграции появятся в выпадающем меню.
3. Выберите настроенную конечную точку из выпадающего списка.
4. Нажмите **Save**.


<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
