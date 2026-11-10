---
title: "Настройка GCP Private Service Connect для подключения к сервису в вашей инфраструктуре"
id: gcp-self-hosted
description: "Настройка подключения GCP Private Service Connect между dbt и сервисом в вашей инфраструктуре."
sidebar_label: "Сервисы в вашей инфраструктуре"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка GCP Private Service Connect для сервиса в вашей инфраструктуре



import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

GCP Private Service Connect (PSC) обеспечивает защищённое частное подключение между <Constant name="dbt" /> и сервисами в вашей инфраструктуре. Это могут быть системы управления версиями (VCS), хранилища данных или любые другие приложения, которыми вы управляете. Благодаря PSC вам не нужно открывать доступ к сервису из общедоступного интернета. Весь обмен данными происходит по частной сети, что значительно повышает безопасность. Подробнее см. в [документации GCP Private Service Connect](https://cloud.google.com/private-service-connect).

## Что рассматривается в этом руководстве
В этом руководстве рассматривается не какой-либо конкретный сервис или архитектура [Backend](#terminology), а [Service Attachment](#terminology), который связывает <Constant name="dbt" /> с сервисом в вашей инфраструктуре. Процесс такого подключения должен быть одинаковым для большинства сценариев использования.

<Lightbox src="/img/docs/dbt-platform/gcp-self-hosted-psc/scope-of-guide.png" width="90%" title="Область рассмотрения этого руководства" />

:::note За рамками руководства
В этом руководстве не рассматриваются настройка и устранение неполадок сервиса в вашей инфраструктуре, балансировщика нагрузки, а также проблемы с работоспособностью бэкендов, поскольку существует практически неограниченное количество вариантов настройки этих сред. Хотя служба поддержки dbt может по возможности помочь с такими проблемами, для ускорения их решения мы рекомендуем обращаться в [службу поддержки Google Cloud](https://cloud.google.com/support).
:::

## Для кого предназначено это руководство
Это руководство предназначено для администраторов облачных сетей и инженеров, отвечающих за настройку и поддержание защищённого сетевого взаимодействия в среде Google Cloud Platform (GCP) вашей организации.

## Терминология {#terminology}
В этом руководстве используется несколько важных терминов, связанных с Private Service Connect. Понимание этих определений поможет успешно выполнить настройку. Более подробное объяснение этих понятий см. в [документации GCP Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect#managed-services).

- **Consumer (потребитель):** В данном контексте потребителем является <Constant name="dbt" />, который устанавливает подключение PSC в качестве клиента.
- **Published Service (опубликованный сервис):** Сервис, к которому вы предоставляете доступ платформе dbt через PSC, например система управления версиями (VCS), хранилище данных или другое приложение.
- **Service Attachment (подключение сервиса):** Ресурс, который предоставляется потребителям вашего опубликованного сервиса, чтобы они могли создавать конечные точки для подключения к нему.
- **Backend (бэкенд):** Также может обозначаться как Network Endpoint Groups (NEGs), то есть группы сетевых конечных точек. Это конкретная архитектура, на которой работает ваш сервис. Например, это могут быть виртуальные машины, группы экземпляров GKE или даже IP-адреса в локальной инфраструктуре.

## Предварительные требования
Перед началом работы ознакомьтесь со следующими требованиями:

1. **Поддерживаемые типы балансировщиков нагрузки**

    dbt официально проверила работу Private Service Connect (PSC) со следующими типами балансировщиков нагрузки:
    - Regional Internal Proxy Load Balancer
    - Cross-Regional Internal Proxy Load Balancer

    > Хотя другие типы балансировщиков нагрузки могут быть совместимы с ресурсами PSC Service Attachment, в этом руководстве предполагается, что ваш сервис расположен за одним из официально поддерживаемых прокси-балансировщиков нагрузки.
    > Подробнее см. в [документации по прокси-балансировщикам нагрузки](https://docs.cloud.google.com/load-balancing/docs/tcp/internal-proxy).

2. **Работоспособность сервиса**

    - Прежде чем продолжить, убедитесь, что ваш сервис или приложение работает и находится в исправном состоянии за выбранным балансировщиком нагрузки.

3. **Идентификатор проекта dbt в GCP**

    - Обратитесь в [службу поддержки dbt](mailto:support@getdbt.com), чтобы получить идентификатор проекта dbt в GCP. Он понадобится, чтобы предоставить платформе dbt доступ к вашему ресурсу Service Attachment.


## Инструкции
1. Войдите в [консоль](https://console.cloud.google.com) Google Cloud Platform.
2. Перейдите в организацию и проект GCP, в которых находится сервис в вашей инфраструктуре.

### Создание выделенной подсети для Service Attachment
3. В поле поиска в верхней центральной части консоли найдите **VPC networks** и перейдите на страницу этого продукта.
4. На странице продукта нажмите ссылку на сеть VPC, в которой находится сервис в вашей инфраструктуре.
5. На следующей странице выберите вкладку **Subnets** и нажмите кнопку **Add subnet**.
6. На панели создания подсети:

    a. **Name:** Укажите понятное имя, например **service-attachment-subnet**

    b. **Description:** Укажите, что эта подсеть предназначена для ресурсов Service Attachment

    c. **Region:** Выберите регион, в котором расположен сервис в вашей инфраструктуре

    d. **Purpose:** Выберите **Private Service Connect**

    e. Нажмите **Add**, чтобы создать подсеть

<Lightbox src="/img/docs/dbt-platform/gcp-self-hosted-psc/service-attach-subnet-creation.png" width="90%" title="Снимок экрана для шага 6: создание подсети для PSC Service Attachment" />

### Создание Service Attachment
7. После завершения создания подсети для Service Attachment найдите **Private Service Connect** в поле поиска в верхней центральной части консоли и перейдите на страницу этого продукта.
8. На странице продукта выберите вкладку **Published services** и нажмите кнопку **Publish service**.
9. На странице Publish service:

    **В разделе Target details**

    a. Выберите **Load Balancer**

    b. Типы балансировщиков нагрузки, работу с которыми проверила <Constant name="dbt" />, — **Regional Internal Proxy Load Balancer** и **Cross-Regional Internal Proxy Load Balancer**. Другие типы также могут работать, но официально не поддерживаются.

    c. В раскрывающемся списке **Load balancer** выберите балансировщик нагрузки, за которым расположен сервис в вашей инфраструктуре.

    d. Выберите соответствующее правило **Forwarding rule** в раскрывающемся списке для вашего балансировщика нагрузки.

    **В разделе Service details**

    e. Укажите понятное имя в поле **Service Name**, например **service-to-my-vcs**

    f. В раскрывающемся списке **Subnets** выберите подсеть, созданную на шаге 6 выше.

    **В разделе Connection Preference**

    g. Оставьте выбранным вариант **Accept connections from selected projects**

    h. Нажмите кнопку **Add accepted project** и добавьте идентификатор проекта dbt в GCP, полученный от службы поддержки. Примечание: этот идентификатор проекта может отличаться для разных конфигураций.

        - Установите ограничение количества подключений равным 1

    i. Нажмите **Add service**

<Lightbox src="/img/docs/dbt-platform/gcp-self-hosted-psc/service-attach-creation.png" width="90%" title="Снимок экрана для шага 9: создание PSC Service Attachment" />

10. После создания Service Attachment для опубликованного сервиса нажмите на него, чтобы открыть страницу с подробными сведениями.
11. Скопируйте URI из поля **Service attachment** (_не_ идентификатор Service Attachment).

<Lightbox src="/img/docs/dbt-platform/gcp-self-hosted-psc/service-attach-details.png" width="90%" title="Снимок экрана для шага 11: копирование URI Service Attachment" />

### Предоставление сведений о подключении службе поддержки dbt

12. Добавьте необходимые сведения в приведённый ниже шаблон и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Шаблон письма в службу поддержки" is_open={true}>

```text
Subject: New GCP Self-hosted Private Service Connect Request

- Type: Self-hosted PSC
- dbt platform account URL:
- Platform/Service (for example, Postgres, Starburst, Spark, GitLab, etc.):
- Service Attachment URI:
- Custom DNS (if HTTPS/TLS):
  - DNS record:
- Service Region (for example, us-east1, us-central1):
- dbt GCP environment (US):
```

</Expandable>

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Устранение неполадок

Если конечная точка Private Service Connect уже создана и настроена в <Constant name="dbt" />, но подключение по-прежнему не работает, проверьте следующие параметры вашей сети, чтобы обеспечить успешную маршрутизацию запросов и ответов между dbt и вашим сервисом.

### Контрольный список настройки

1. **Состояние Service Attachment**

   В консоли Google Cloud перейдите в **Network services** → **Private Service Connect** → **Published services**. Выберите свой ресурс Service Attachment и убедитесь, что:
   - Его состояние — **Active**
   - Проект dbt отображается в списке **Connected projects** с состоянием **Accepted**

2. **Работоспособность бэкендов балансировщика нагрузки**

   Перейдите в **Network services** → **Load balancing** и выберите свой балансировщик нагрузки. На вкладке **Backend services** убедитесь, что хотя бы один бэкенд находится в состоянии **Healthy**. Неработоспособность бэкендов может указывать на то, что сервис недоступен или правила межсетевого экрана блокируют проверочные запросы.

3. **Настройка подсети NAT**

   Убедитесь, что в подсети Private Service Connect достаточно свободных IP-адресов. GCP использует эти IP-адреса для SNAT при маршрутизации трафика потребителей к вашим бэкендам.

4. **Правила межсетевого экрана**

   Убедитесь, что правила межсетевого экрана вашей VPC разрешают:
   - Трафик проверок работоспособности из диапазонов адресов Google для таких проверок (`35.191.0.0/16` и `130.211.0.0/22`)
   - Трафик из подсети, предназначенной только для прокси, к вашим бэкендам (для прокси-балансировщиков нагрузки)

   Подробнее см. в разделе [Правила межсетевого экрана для проверок работоспособности](https://cloud.google.com/load-balancing/docs/health-check-concepts#ip-ranges).

### Мониторинг

Чтобы локализовать проблемы с подключением, используйте инструменты мониторинга Google Cloud:

#### Метрики Service Attachment

В консоли Google Cloud перейдите в **Monitoring** → **Metrics Explorer**. Найдите метрики Private Service Connect:
- `compute.googleapis.com/nat/nat_connections` — отслеживает активные подключения NAT
- `compute.googleapis.com/nat/sent_bytes_count` — позволяет убедиться, что трафик передаётся

#### Журналы балансировщика нагрузки

Включите ведение журналов для бэкенд-сервиса вашего балансировщика нагрузки, чтобы записывать сведения о запросах. Перейдите к бэкенд-сервису, нажмите **Edit** и включите **Logging**, установив долю выборки 1.0 для устранения неполадок.

Подробнее см. в разделах [Мониторинг Private Service Connect](https://cloud.google.com/vpc/docs/monitor-private-service-connect-connections) и [Ведение журналов балансировщика нагрузки](https://cloud.google.com/load-balancing/docs/https/https-logging-monitoring).
