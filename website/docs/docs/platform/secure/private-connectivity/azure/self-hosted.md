---
title: "Настройка Azure Private Link для сервиса в вашей инфраструктуре"
id: azure-self-hosted
description: "Настройка подключения Azure Private Link между dbt и сервисом в вашей инфраструктуре."
sidebar_label: "Сервисы в вашей инфраструктуре"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка Azure Private Link для сервиса в вашей инфраструктуре

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Azure Private Link обеспечивает безопасное частное подключение между <Constant name="dbt" /> и сервисами в вашей инфраструктуре. К таким сервисам могут относиться системы контроля версий (VCS), хранилища данных и любые другие приложения, которыми вы управляете. При использовании Private Link вам не нужно предоставлять доступ к сервису через общедоступный интернет. Весь обмен данными происходит по частной сети, что значительно повышает безопасность. Подробнее см. в [документации Azure Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview).

## Что рассматривается в этом руководстве
Это руководство посвящено не конкретному сервису или архитектуре серверной части, а [Private Link Service](#terminology), который связывает <Constant name="dbt" /> с сервисом в вашей инфраструктуре. Этот процесс должен быть одинаковым для большинства сценариев использования.

<!-- TODO: Добавить архитектурную схему, показывающую область охвата руководства -->
<Lightbox src="/img/docs/dbt-platform/az-self-hosted-privatelink/scope-of-guide.png" width="90%" title="Область охвата этого руководства" />

:::note Что не входит в руководство
Это руководство не охватывает настройку и устранение неполадок сервиса в вашей инфраструктуре, балансировщика нагрузки или работоспособности серверного пула, поскольку варианты конфигурации таких сред практически не ограничены. Служба поддержки dbt может по возможности помочь с такими проблемами, однако для ускорения их решения мы рекомендуем обращаться в [службу поддержки Azure](https://azure.microsoft.com/en-us/support/).
:::

## Для кого предназначено руководство
Это руководство предназначено для администраторов облачных сетей и инженеров, отвечающих за настройку и поддержание безопасного сетевого взаимодействия в среде Microsoft Azure вашей организации.

## Терминология {#terminology}
В этом руководстве используется несколько важных терминов, связанных с Azure Private Link. Понимание этих определений поможет успешно выполнить настройку. Более подробное объяснение этих понятий см. в [документации Azure Private Link Service](https://learn.microsoft.com/en-us/azure/private-link/private-link-service-overview).

- **Потребитель (Consumer):** В данном контексте потребителем является <Constant name="dbt" />, который создаёт частную конечную точку для подключения к вашему Private Link Service.
- **Поставщик сервиса (Service provider):** Ваша организация, которая владеет сервисом за Standard Load Balancer, эксплуатирует его и создаёт Private Link Service.
- **Private Link Service:** Ресурс Azure, который предоставляет потребителям доступ к вашему сервису, позволяя им создавать частные конечные точки для подключения к нему. Этот ресурс привязан к конфигурации внешнего IP-адреса Standard Load Balancer.
- **Псевдоним (Alias):** Глобально уникальное имя, которое Azure генерирует для вашего Private Link Service. Вы передаёте этот псевдоним службе поддержки dbt, чтобы dbt мог подключиться к вашему сервису в качестве потребителя.
- **Standard Load Balancer:** Обязательный тип балансировщика нагрузки, размещаемого перед вашим сервисом. Для использования Private Link Service ваше приложение должно работать за Standard Load Balancer.
- **Подсеть NAT:** Выделенная подсеть в вашей VNet, используемая для IP-адресов трансляции сетевых адресов источника (SNAT) в Private Link Service. Трафик потребителя выглядит так, будто он поступает из этого пула частных IP-адресов.

## Предварительные требования
Перед началом ознакомьтесь со следующими требованиями:

1. **Поддерживаемые типы балансировщиков нагрузки**

    dbt официально проверил работу Private Link со следующим типом балансировщика нагрузки:
    - Standard Load Balancer (Internal)

    > Хотя другие конфигурации могут быть совместимы с Azure Private Link Services, в этом руководстве предполагается, что ваш сервис настроен за Standard Internal Load Balancer.
    > Подробнее см. в [документации Azure Load Balancer](https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview).

2. **Работоспособность сервиса**

    - Прежде чем продолжить, убедитесь, что ваш сервис или приложение работает корректно за выбранным балансировщиком нагрузки.

3. **Идентификатор подписки dbt в Azure**

    - Обратитесь в [службу поддержки dbt](mailto:support@getdbt.com), чтобы получить идентификатор подписки dbt в Azure. Он потребуется, чтобы разрешить dbt подключаться к вашему Private Link Service.


## Инструкции
1. Войдите на [портал Azure](https://portal.azure.com).
2. Перейдите к подписке Azure и группе ресурсов, в которых размещён сервис в вашей инфраструктуре.

### Создание подсети NAT для Private Link Service
3. В разделе **Resources** найдите **Virtual network** и откройте VNet, в которой работает сервис в вашей инфраструктуре.
4. Разверните **Settings** на панели слева и перейдите в **Subnets**. Нажмите кнопку **+ Subnet**, чтобы создать новую подсеть.
5. На панели создания подсети:

    a. **Subnet purpose:** Оставьте значение **Default**

    b. **Name:** Укажите понятное имя, например **private-link-nat-subnet**

    c. **IPv4 address range:** Выберите подходящий блок CIDR из вашей VNet, в котором вы хотите создать подсеть NAT. В этом примере используется CIDR 10.30.0.0/16, как показано на снимке экрана ниже.

    d. **Starting address:** Укажите желаемый начальный адрес новой подсети

    e. **Size:** Рекомендуется наименьший доступный размер (например, /28).

    f. Установите флажок **Enable private subnet (no default outbound access)**.

    g. **NAT gateway:** Оставьте значение **None**

    h. Оставьте в полях **Network security group** и **Route table** значение **None**, если ваша среда не требует указания других значений.

    i. Оставьте значения по умолчанию во всех остальных полях.

    j. Нажмите **Add**, чтобы создать подсеть.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/az-self-hosted-privatelink/vnet-search.png" width="90%" title="Снимок экрана для шага 3: поиск VNet сервиса в вашей инфраструктуре" />

<Lightbox src="/img/docs/dbt-platform/az-self-hosted-privatelink/nat-subnet-creation.png" width="90%" title="Снимок экрана для шагов 4–5: создание подсети NAT для Private Link Service" />

</DocCarousel>

### Создание Private Link Service
6. После завершения создания подсети в поле поиска в верхней центральной части портала найдите **Private link services** и откройте соответствующую страницу.
7. Нажмите кнопку **+ Create**.
8. На странице Create private link service:

    **В разделе Basics**

    a. Выберите **Subscription** и **Resource group**

    b. **Name:** Укажите понятное имя, например **pls-to-my-vcs**

    c. **Region:** Выберите регион, в котором размещён сервис в вашей инфраструктуре

    **В разделе Outbound settings**

    d. **Load balancer:** В раскрывающемся списке выберите Standard Internal Load Balancer, размещённый перед сервисом в вашей инфраструктуре

    e. **Load balancer frontend IP address:** Выберите конфигурацию внешнего IP-адреса вашего балансировщика нагрузки

    f. **Source NAT subnet:** Выберите подсеть NAT, созданную на шаге 5 выше

    g. **Source NAT Virtual network:** Это поле будет заполнено автоматически на основе выбранной подсети

    h. **Enable TCP proxy V2:** Оставьте этот параметр отключённым

    **В разделе Access security**

    i. Выберите **Restricted by subscription**

    j. Нажмите **Add subscriptions** и добавьте идентификатор подписки dbt в Azure, полученный от службы поддержки

    k. Установите для параметра **Request Auto-approve** значение **Yes** для подписки dbt

    l. Нажмите **Next: Review + create**, затем **Create**

<!-- TODO: Добавить снимок экрана создания Private Link Service -->
<Lightbox src="/img/docs/dbt-platform/az-self-hosted-privatelink/privatelink-service-creation.png" width="90%" title="Снимок экрана для шага 8: создание Azure Private Link Service" />

9. После создания Private Link Service нажмите на него, чтобы открыть страницу с подробными сведениями.
10. Скопируйте значение **Alias** (это идентификатор, который вы передадите службе поддержки dbt).

<!-- TODO: Добавить снимок экрана страницы сведений Private Link Service с полем Alias -->
<Lightbox src="/img/docs/dbt-platform/az-self-hosted-privatelink/alias-info.png" width="90%" title="Снимок экрана для шага 10: копирование псевдонима Private Link Service" />

### Передача сведений о подключении службе поддержки dbt

11. Добавьте необходимые сведения в приведённый ниже шаблон и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Шаблон письма для обращения в службу поддержки" is_open={true}>

```text
Subject: New Azure Self-hosted Private Link Request

- Type: Self-hosted Private Link
- Platform/Service (for example, Postgres, Starburst, Spark, GitLab, etc.):
- dbt platform account URL:
- Private Link Service Alias:
- Custom DNS (if HTTPS/TLS):
  - DNS record:
- Service Region (for example, East US, West Europe):
- dbt Azure environment (EMEA):
```

</Expandable>

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Устранение неполадок

Если конечная точка Private Link уже создана и настроена в <Constant name="dbt" />, но подключение по-прежнему не работает, проверьте перечисленные ниже параметры сети, чтобы убедиться, что запросы и ответы могут успешно передаваться между dbt и вашим сервисом.

### Контрольный список конфигурации

1. **Состояние Private Link Service**

   На портале Azure перейдите к вашему Private Link Service и убедитесь, что параметр **Provisioning state** имеет значение **Succeeded**. На вкладке **Private endpoint connections** убедитесь, что подключение dbt отображается со статусом **Approved**.

2. **Работоспособность серверной части балансировщика нагрузки**

   Перейдите к вашему Standard Load Balancer и проверьте работоспособность **Backend pool**. Как минимум один серверный экземпляр должен иметь статус **Healthy**. Неработоспособность серверных экземпляров может означать, что сервис недоступен или что группа безопасности сети (NSG) блокирует трафик от балансировщика нагрузки.

3. **Конфигурация подсети NAT**

   Убедитесь, что в подсети NAT достаточно свободных IP-адресов. Azure Private Link Service использует эти IP-адреса для SNAT. Если адреса в подсети исчерпаны, новые подключения могут завершаться ошибкой.

4. **Группы безопасности сети**

   Если к подсети NAT или подсети серверной части применены NSG, убедитесь, что они разрешают необходимый трафик:
   - Подсеть NAT: рекомендуется оставить для NSG значение **None** (как указано в инструкциях по настройке)
   - Подсеть серверной части: должна разрешать трафик с внешнего IP-адреса балансировщика нагрузки

### Мониторинг

Чтобы локализовать проблемы с подключением, используйте инструменты мониторинга Azure:

#### Метрики Private Link Service

На портале Azure перейдите к вашему Private Link Service и нажмите **Metrics**. Отслеживайте:
- **Bytes In/Out** — подтверждает, что трафик проходит через сервис
- **NAT Port Usage** — высокая загрузка может указывать на то, что подсети NAT требуется больше IP-адресов

#### Метрики Load Balancer

Перейдите к вашему Standard Load Balancer и нажмите **Metrics**. Отслеживайте:
- **Health Probe Status** — показывает работоспособность серверной части с течением времени
- **Byte Count** — подтверждает, что трафик достигает балансировщика нагрузки
- **SNAT Connection Count** — отслеживает исходящие подключения

Дополнительные сведения см. в разделах [Мониторинг Azure Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-service-overview#monitoring) и [Мониторинг Load Balancer](https://learn.microsoft.com/en-us/azure/load-balancer/monitor-load-balancer).
