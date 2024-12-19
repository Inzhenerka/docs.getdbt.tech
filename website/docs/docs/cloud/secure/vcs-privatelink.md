---
title: "Настройка PrivateLink для саморазмещенных облачных систем управления версиями (VCS)"
id: vcs-privatelink
description: "Настройка соединения PrivateLink между dbt Cloud и облачным git-сервером вашей организации"
sidebar_label: "PrivateLink для VCS"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

AWS PrivateLink обеспечивает частное соединение между dbt Cloud и вашей саморазмещенной облачной системой управления версиями (VCS), направляя запросы через вашу виртуальную частную облачную сеть (VPC). Этот тип соединения не требует публичного раскрытия конечной точки для ваших репозиториев VCS или прохождения запросов через публичный интернет, что обеспечивает максимально безопасное соединение. AWS рекомендует использовать соединение PrivateLink в рамках своей [Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) и подробно описывает этот конкретный подход в разделе **Shared Services** белой книги [AWS PrivateLink](https://docs.aws.amazon.com/pdfs/whitepapers/latest/aws-privatelink/aws-privatelink.pdf).

Вы узнаете на высоком уровне о ресурсах, необходимых для реализации этого решения. Облачные среды и процессы развертывания сильно различаются, поэтому информацию из этого руководства может потребоваться адаптировать под ваши требования.

## Обзор соединения PrivateLink

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/privatelink-vcs-architecture.png" width="80%" title="Общий обзор архитектуры dbt Cloud и AWS PrivateLink для VCS" />

### Необходимые ресурсы для создания соединения

Создание соединения Interface VPC PrivateLink требует создания нескольких ресурсов AWS в вашем аккаунте AWS и частной сети, содержащей экземпляр саморазмещенной VCS. Вы несете ответственность за развертывание и обслуживание этих ресурсов. После развертывания информация о соединении и разрешения передаются dbt Labs для завершения соединения, что позволяет осуществлять прямое частное соединение VPC к VPC.

Этот подход отличается от и не требует реализации VPC peering между вашими аккаунтами AWS и dbt Cloud.

### 1. Разверните ресурсы AWS

Создание соединения Interface VPC PrivateLink требует создания нескольких ресурсов AWS в аккаунте, содержащем или подключенном к вашей саморазмещенной облачной VCS. Эти ресурсы можно создать через AWS Console, AWS CLI или с помощью Infrastructure-as-Code, таких как [Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) или [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

- **Группа безопасности (только для AWS)** &mdash; Если вы подключаетесь к существующей установке VCS, она, вероятно, уже существует, однако вам может потребоваться добавить или изменить правила группы безопасности для принятия трафика от сетевого балансировщика нагрузки (NLB), созданного для этой конечной точки.
- **Группа целевых объектов** - [Группа целевых объектов](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html) прикрепляется к [Слушателю](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html) на NLB и отвечает за маршрутизацию входящих запросов к здоровым целевым объектам в группе. Если вы подключаетесь к системе VCS через SSH и HTTPS, необходимо создать две **Группы целевых объектов**.
    - **Тип цели (выберите наиболее подходящий):**
        - **Экземпляр/ASG:** Выберите существующий экземпляр EC2, на котором работает система VCS, или [группу автоматического масштабирования](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html) (ASG), чтобы автоматически прикреплять любые экземпляры, запущенные из этой ASG.
        - **Балансировщик нагрузки приложения (ALB):** Выберите ALB, к которому уже прикреплены экземпляры VCS EC2 (только HTTP/S трафик).
        - **IP-адреса:** Выберите IP-адреса экземпляров EC2, на которых установлена система VCS. Имейте в виду, что IP-адрес экземпляра EC2 может измениться, если экземпляр будет перезапущен по какой-либо причине.
    - **Протокол/Порт:** Выберите одну пару протокол/порт для каждой Группы целевых объектов, например:
        - TG1 - SSH: TCP/22
        - TG2 - HTTPS: TCP/443 или TLS, если вы хотите прикрепить сертификат для расшифровки TLS-соединений ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html)).
    - **VPC:** Выберите VPC, в которой будут созданы VPC Endpoint Service и NLB.
    - **Проверки состояния:** Цели должны зарегистрироваться как здоровые, чтобы NLB мог перенаправлять запросы. Настройте проверку состояния, которая подходит для вашего сервиса и протокола Группы целевых объектов ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html)).
    - **Зарегистрируйте цели:** Зарегистрируйте цели (см. выше) для сервиса VCS ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-register-targets.html)). _Критически важно убедиться, что цели здоровы, прежде чем пытаться подключиться из dbt Cloud._
- **Сетевой балансировщик нагрузки (NLB)** - Требует создания Слушателя, который прикрепляется к вновь созданным Группам целевых объектов для порта `443` и/или `22`, в зависимости от необходимости.
    - **Схема:** Внутренняя
    - **Тип IP-адреса:** IPv4
    - **Сетевое сопоставление:** Выберите VPC, в которой развертываются VPC Endpoint Service и NLB, и выберите подсети как минимум из двух зон доступности.
    - **Группы безопасности:** Сетевой балансировщик нагрузки (NLB), связанный с VPC Endpoint Service, не должен иметь связанную группу безопасности, или группа безопасности должна иметь правило, позволяющее запросы от соответствующих **приватных CIDR** dbt Cloud. Обратите внимание, что **это отличается** от статических публичных IP-адресов, указанных на странице dbt Cloud [Access, Regions, & IP addresses](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses). Правильные приватные CIDR могут быть предоставлены поддержкой dbt по запросу. Если необходимо, временное добавление правила разрешения `10.0.0.0/8` должно позволить подключение, пока правило не будет уточнено до меньшего CIDR, предоставленного dbt.
    - **Слушатели:** Создайте один Слушатель для каждой Группы целевых объектов, который сопоставляет соответствующий входящий порт с соответствующей Группой целевых объектов ([подробности](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **Служба конечной точки** - Служба VPC Endpoint позволяет осуществлять соединение VPC к VPC, направляя входящие запросы к настроенному балансировщику нагрузки.
    - **Тип балансировщика нагрузки:** Сетевой.
    - **Балансировщик нагрузки:** Прикрепите NLB, созданный на предыдущем шаге.
    - **Требуется подтверждение (рекомендуется):** При включении требует, чтобы новый запрос на соединение с VPC Endpoint Service был принят клиентом, прежде чем будет разрешено подключение ([подробности](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests)).

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставьте доступ к службе VPC Endpoint для аккаунта dbt

После развертывания этих ресурсов необходимо предоставить доступ для аккаунта AWS dbt Labs для создания VPC Endpoint в нашей VPC. На развернутой службе VPC Endpoint нажмите на вкладку **Allow principals**. Нажмите **Allow principals**, чтобы предоставить доступ. Введите ARN следующей IAM роли в соответствующем производственном аккаунте AWS и сохраните изменения ([подробности](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions)).

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

 <Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" width="70%" title="Введите ARN"/>

### 3. Получите имя службы VPC Endpoint

После развертывания и настройки службы VPC Endpoint найдите имя службы в консоли AWS, перейдя в **VPC** → **Endpoint Services** и выбрав соответствующую службу конечной точки. Скопируйте значение поля имени службы и включите его в ваше сообщение в поддержку dbt Cloud.

 <Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" width="70%" title="Получите значение поля имени службы"/>

:::note Настройка пользовательского DNS
 
Если соединение с сервисом VCS требует пользовательского домена и/или URL для TLS, команда инфраструктуры dbt Labs может настроить частную хостинговую зону в частной сети dbt Cloud. Например:
    - Частная хостинговая зона: examplecorp.com
    - DNS-запись: github.examplecorp.com
    
:::

### 4. Добавьте необходимую информацию в шаблон ниже и отправьте свой запрос в [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):
```
Тема: Запрос на новый Multi-Tenant PrivateLink
- Тип: VCS Interface-type
- Имя службы VPC Endpoint:
- Пользовательский DNS (по желанию)
    - Частная хостинговая зона:
    - DNS-запись:
- Регион установки VCS AWS (например, us-east-1, eu-west-2):
- Многоарендная среда dbt Cloud (США, EMEA, AU):
```

import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';

<PrivateLinkSLA />

### 5. Принятие запроса на соединение

Когда вам сообщат, что ресурсы развернуты в среде dbt Cloud, вы должны принять запрос на соединение конечной точки (если служба VPC Endpoint не настроена на автоматическое принятие запросов на соединение). Запросы можно принимать через консоль AWS, как показано ниже, или через AWS CLI.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/accept-request.png" width="80%" title="Принять запрос на соединение" />

После того как вы примете запрос на соединение конечной точки, вы сможете использовать конечную точку PrivateLink в dbt Cloud.

## Настройка в dbt Cloud

После того как dbt подтвердит, что интеграция PrivateLink завершена, вы можете использовать ее в новой или существующей конфигурации git. 

1. Выберите **PrivateLink Endpoint** в качестве типа соединения, и ваши настроенные интеграции появятся в выпадающем меню. 
2. Выберите настроенную конечную точку из выпадающего списка.
3. Нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/vcs-setup-new.png" width="80%" title="Настройка новой интеграции git с PrivateLink" />

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/vcs-setup-existing.png" width="80%" title="Редактирование существующей интеграции git с PrivateLink" />

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>