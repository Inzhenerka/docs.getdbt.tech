---
title: "Настройка PrivateLink для самоуправляемых облачных систем контроля версий (VCS)"
id: vcs-privatelink
description: "Настройка соединения PrivateLink между dbt Cloud и облачным сервером git, размещенным в организации"
sidebar_label: "PrivateLink для VCS"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

AWS PrivateLink предоставляет частное подключение от dbt Cloud к вашей самоуправляемой облачной системе контроля версий (VCS) путем маршрутизации запросов через вашу виртуальную частную сеть (VPC). Этот тип соединения не требует публичного раскрытия конечной точки для ваших VCS-репозиториев или прохождения запросов через публичный интернет, обеспечивая максимально безопасное соединение. AWS рекомендует подключение PrivateLink как часть своей [Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) и подробно описывает этот конкретный шаблон в разделе **Shared Services** [белой книги AWS PrivateLink](https://docs.aws.amazon.com/pdfs/whitepapers/latest/aws-privatelink/aws-privatelink.pdf).

Вы узнаете, на высоком уровне, какие ресурсы необходимы для реализации этого решения. Облачные среды и процессы развертывания сильно различаются, поэтому информация из этого руководства может потребовать адаптации под ваши требования.

## Обзор соединения PrivateLink

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/privatelink-vcs-architecture.png" width="80%" title="Общий обзор архитектуры dbt Cloud и AWS PrivateLink для VCS" />

### Необходимые ресурсы для создания соединения

Создание соединения Interface VPC PrivateLink требует создания нескольких ресурсов AWS в вашем аккаунте AWS и частной сети, содержащей самоуправляемый экземпляр VCS. Вы несете ответственность за развертывание и обслуживание этих ресурсов. После развертывания информация о соединении и разрешения передаются в dbt Labs для завершения соединения, что позволяет прямое частное подключение VPC к VPC.

Этот подход отличается от и не требует реализации VPC peering между вашим аккаунтом AWS и dbt Cloud.

### 1. Развертывание ресурсов AWS

Создание соединения Interface VPC PrivateLink требует создания нескольких ресурсов AWS в аккаунте, содержащем или подключенном к вашему самоуправляемому облачному VCS. Эти ресурсы могут быть созданы через AWS Console, AWS CLI или Infrastructure-as-Code, такие как [Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) или [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

- **Security Group (только для размещенных в AWS)** &mdash; Если вы подключаетесь к существующей установке VCS, это, вероятно, уже существует, однако, возможно, вам потребуется добавить или изменить правила Security Group для принятия трафика от Network Load Balancer (NLB), созданного для этой Endpoint Service.
- **Target Group(s)** - [Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html) прикрепляется к [Listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html) на NLB и отвечает за маршрутизацию входящих запросов к здоровым целям в группе. Если подключение к системе VCS осуществляется как по SSH, так и по HTTPS, необходимо создать две **Target Groups**.
    - **Тип цели (выберите наиболее подходящий):**
        - **Instance/ASG:** Выберите существующие экземпляры EC2, на которых работает система VCS, или [группу автоматического масштабирования](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html) (ASG) для автоматического подключения любых экземпляров, запущенных из этой ASG.
        - **Application Load Balancer (ALB):** Выберите ALB, который уже имеет прикрепленные экземпляры VCS EC2 (только HTTP/S трафик).
        - **IP Addresses:** Выберите IP-адрес(а) экземпляров EC2, на которых установлена система VCS. Имейте в виду, что IP-адрес экземпляра EC2 может измениться, если экземпляр будет перезапущен по какой-либо причине.
    - **Протокол/Порт:** Выберите одну пару протокол/порт для каждой Target Group, например:
        - TG1 - SSH: TCP/22
        - TG2 - HTTPS: TCP/443 или TLS, если вы хотите прикрепить сертификат для расшифровки TLS соединений ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html)).
    - **VPC:** Выберите VPC, в котором будут созданы VPC Endpoint Service и NLB.
    - **Проверки здоровья:** Цели должны регистрироваться как здоровые, чтобы NLB мог перенаправлять запросы. Настройте проверку здоровья, которая подходит для вашего сервиса и протокола Target Group ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html)).
    - **Регистрация целей:** Зарегистрируйте цели (см. выше) для сервиса VCS ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-register-targets.html)). _Крайне важно убедиться, что цели здоровы, прежде чем пытаться подключиться из dbt Cloud._
- **Network Load Balancer (NLB)** - Требует создания Listener, который прикрепляется к вновь созданным Target Group(s) для порта `443` и/или `22`, в зависимости от случая.
    - **Схема:** Внутренняя
    - **Тип IP-адреса:** IPv4
    - **Сетевое отображение:** Выберите VPC, в котором развертываются VPC Endpoint Service и NLB, и выберите подсети как минимум из двух зон доступности.
    - **Security Groups:** Network Load Balancer (NLB), связанный с VPC Endpoint Service, должен либо не иметь связанной Security Group, либо Security Group должна иметь правило, позволяющее запросы от соответствующих **частных CIDR** dbt Cloud. Обратите внимание, что **это отличается** от статических публичных IP, указанных на странице dbt Cloud [Access, Regions, & IP addresses](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses). Правильные частные CIDR могут быть предоставлены службой поддержки dbt по запросу. Если необходимо, временное добавление правила разрешения `10.0.0.0/8` должно позволить подключение до тех пор, пока правило не будет уточнено до меньшего CIDR, предоставленного dbt.
    - **Listeners:** Создайте один Listener для каждой Target Group, который сопоставляет соответствующий входящий порт с соответствующей Target Group ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **Endpoint Service** - VPC Endpoint Service позволяет соединение VPC с VPC, маршрутизируя входящие запросы к настроенному балансировщику нагрузки.
    - **Тип балансировщика нагрузки:** Сетевой.
    - **Балансировщик нагрузки:** Прикрепите NLB, созданный на предыдущем шаге.
    - **Требуется принятие (рекомендуется)**: Когда включено, требует, чтобы новый запрос на соединение с VPC Endpoint Service был принят клиентом, прежде чем будет разрешено подключение ([подробности](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests)).

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставление доступа аккаунту AWS dbt к VPC Endpoint Service

После развертывания этих ресурсов необходимо предоставить доступ аккаунту AWS dbt Labs для создания VPC Endpoint в нашей VPC. На развернутом VPC Endpoint Service нажмите вкладку **Allow principals**. Нажмите **Allow principals**, чтобы предоставить доступ. Введите ARN следующей роли IAM в соответствующем производственном аккаунте AWS и сохраните изменения ([подробности](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions)).

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

 <Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" width="70%" title="Введите ARN"/>

### 3. Получение имени VPC Endpoint Service

После развертывания и настройки VPC Endpoint Service найдите имя сервиса в консоли AWS, перейдя в **VPC** → **Endpoint Services** и выбрав соответствующий endpoint service. Скопируйте значение поля имени сервиса и включите его в ваше сообщение в службу поддержки dbt Cloud.

 <Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" width="70%" title="Получите значение поля имени сервиса"/>

:::note Настройка пользовательского DNS
 
Если подключение к сервису VCS требует пользовательского домена и/или URL для TLS, частная хост-зона может быть настроена командой инфраструктуры dbt Labs в частной сети dbt Cloud. Например:
    - Частная хост-зона: examplecorp.com
    - DNS-запись: github.examplecorp.com
    
:::

### 4. Добавьте необходимую информацию в шаблон ниже и отправьте ваш запрос в [поддержку dbt](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):
```
Тема: Новый запрос на Multi-Tenant PrivateLink
- Тип: VCS Interface-type
- Имя VPC Endpoint Service:
- Пользовательский DNS (необязательно)
    - Частная хост-зона:
    - DNS-запись:
- Регион установки VCS AWS (например, us-east-1, eu-west-2):
- Мульти-тенантная среда dbt Cloud (US, EMEA, AU):
```

import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';

<PrivateLinkSLA />

### 5. Принятие запроса на соединение

Когда вас уведомят, что ресурсы развернуты в среде dbt Cloud, вы должны принять запрос на соединение с конечной точкой (если VPC Endpoint Service не настроен на автоматическое принятие запросов на соединение). Запросы могут быть приняты через консоль AWS, как показано ниже, или через AWS CLI.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/accept-request.png" width="80%" title="Принять запрос на соединение" />

После принятия запроса на соединение с конечной точкой вы можете использовать конечную точку PrivateLink в dbt Cloud.

## Настройка в dbt Cloud

После того как dbt подтвердит, что интеграция PrivateLink завершена, вы можете использовать ее в новой или существующей конфигурации git.

1. Выберите **PrivateLink Endpoint** как тип соединения, и ваши настроенные интеграции появятся в выпадающем меню.
2. Выберите настроенную конечную точку из выпадающего списка.
3. Нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/vcs-setup-new.png" width="80%" title="Настройка новой git-интеграции с PrivateLink" />

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/vcs-setup-existing.png" width="80%" title="Редактирование существующей git-интеграции с PrivateLink" />

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>