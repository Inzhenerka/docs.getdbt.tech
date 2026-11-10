---
title: "Настройка AWS PrivateLink для Redshift"
id: aws-redshift
description: "Настройка PrivateLink для Redshift."
sidebar_label: "Redshift"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка AWS PrivateLink для Redshift

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

AWS предоставляет два способа создания конечной точки VPC PrivateLink для кластера Redshift, работающего в другой VPC: 
- [Конечные точки PrivateLink, управляемые Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html)
- [Конечные точки PrivateLink интерфейсного типа для Redshift](https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html)

<Constant name="dbt" /> поддерживает оба типа конечных точек, но при выборе типа необходимо учитывать ряд [особенностей](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html#managing-cluster-cross-vpc-considerations). Конечные точки, управляемые Redshift, проще настроить, и они не требуют дополнительных затрат, что делает их предпочтительным вариантом для многих пользователей. Однако они могут быть доступны не во всех средах. Определите подходящий для вашей системы тип с учётом этих критериев. Следуйте инструкциям в разделе ниже, соответствующем выбранному типу конечной точки.

<CloudProviders type='Redshift' />

Настроить конечную точку AWS PrivateLink для Redshift можно двумя способами:

- [Самостоятельная настройка частных конечных точек](#self-serve-private-endpoints): создавайте конечные точки Redshift PrivateLink и управляйте ими непосредственно в пользовательском интерфейсе <Constant name="dbt_platform" />. Сейчас эта возможность находится в стадии бета-тестирования.
- [Настройка с помощью службы поддержки](#support-led-setup): обратитесь в службу поддержки dbt для настройки конечной точки Redshift PrivateLink.

Настройка на стороне AWS одинакова для обоих способов. Вы подготавливаете ресурсы AWS (предоставляете доступ для конечных точек, управляемых Redshift, или создаёте сервис конечных точек VPC для конечных точек интерфейсного типа), а затем отправляете запрос через интерфейс (при самостоятельной настройке) или по электронной почте в службу поддержки dbt (при настройке с помощью службы поддержки).

## Самостоятельная настройка частных конечных точек <Lifecycle status="beta" /> {#self-serve-private-endpoints}

_Самостоятельная настройка частных конечных точек для Redshift в AWS сейчас находится в стадии бета-тестирования и доступна всем клиентам, соответствующим требованиям. Если в настройках вашего аккаунта нет раздела **Private endpoints**, используйте [настройку с помощью службы поддержки](#support-led-setup)._

При самостоятельной настройке вы запрашиваете конечную точку Redshift PrivateLink в <Constant name="dbt_platform" /> без создания обращения в службу поддержки. Если запрос завершится ошибкой, вы сможете изменить и повторно отправить его либо удалить конечную точку и повторить попытку самостоятельно.

<Constant name="dbt_platform" /> поддерживает самостоятельную настройку для всех трёх типов Redshift:

- **Redshift Managed** &mdash; выделенные кластеры Redshift (выберите **Redshift Managed** в интерфейсе).
- **Redshift Managed Serverless** &mdash; Redshift Serverless (выберите **Redshift Managed** в интерфейсе, затем выберите **Serverless**).
- **Redshift интерфейсного типа** (выберите **Redshift** в интерфейсе).

### Предварительные требования

- Набор разрешений [Account admin](/docs/platform/manage-access/enterprise-permissions?version=2.0#account-admin) или [Project creator](/docs/platform/manage-access/enterprise-permissions?version=2.0#project-creator) в <Constant name="dbt_platform"/>. Пользователи с лицензией IT также могут создавать частные конечные точки.
- Завершённая настройка на стороне AWS для выбранного типа конечной точки. Выполните те же действия, что и при [настройке с помощью службы поддержки](#support-led-setup): предоставьте доступ для [конечных точек, управляемых Redshift](#configuring-redshift-managed-privatelink), или подготовьте сервис конечных точек VPC для [конечных точек интерфейсного типа](#configuring-redshift-interface-type-privatelink). Однако остановитесь перед шагом **Отправьте запрос в службу поддержки dbt** и вместо него воспользуйтесь инструкциями для интерфейса ниже.

### Запрос новой частной конечной точки

1. В <Constant name="dbt_platform" /> перейдите в **Account settings → Private endpoints**.
2. В таблице **Private endpoints** просмотрите существующие конечные точки. В таблице представлены все частные конечные точки вашего аккаунта (включая те, которые не относятся к Redshift) с такими сведениями, как **Name**, **Connection type**, **URL**, **Connectivity status**, а также количеством подключений (**Connections**), использующих конечную точку. Поиск доступен по **Name** или **URL**.
3. Чтобы запросить новую конечную точку, нажмите **Request new**.
4. В разделе **Provider type** выберите вариант, соответствующий типу вашей конечной точки, затем заполните поля для этого типа:

   <Tabs>

   <TabItem value="managed" label="Redshift Managed / Serverless">

   Выберите **Redshift Managed** как для выделенных кластеров Redshift, так и для Redshift Serverless.
   
        1. На шаге **Step 1: Choose your deployment type** выберите **Provisioned** или **Serverless**. Если вы выбрали **Serverless** и у вас несколько рабочих групп, обязательно предоставьте доступ в разделе **Granted accounts** для каждой рабочей группы при настройке на стороне AWS. См. раздел [Необходима авторизация для каждой рабочей группы](#per-workgroup-authorization).
        2. На шаге **Step 2: Enter your cluster details** укажите **Cluster identifier** и **Resource owner AWS account ID**.
        3. На шаге **Step 3: Select your AWS region** выберите регион AWS, в котором размещён кластер или рабочая группа Redshift.
        4. Нажмите **Submit request**.

   <Lightbox src="/img/docs/dbt-platform/redshift-managed-private-endpoint-request.png" title="Форма запроса конечной точки Redshift Managed с полями типа развёртывания, сведений о кластере и региона AWS"/>

   </TabItem>

   <TabItem value="interface" label="Redshift (интерфейсного типа)">

   Для конечной точки интерфейсного типа выберите **Redshift**.

   1. На шаге **Step 1: Enter your AWS PrivateLink service name** введите имя сервиса конечных точек AWS VPC, который вы настроили для своего кластера Redshift (например, `com.amazonaws.vpce.us-east-1.vpce-svc-xxxxxxxxxxxxxxxxx`).
   2. На шаге **Step 2: Name your Redshift endpoint** выберите имя для идентификации конечной точки. При регистрации оно используется как префикс имени хоста.
   3. Нажмите **Submit request**.

   <Lightbox src="/img/docs/dbt-platform/redshift-interface-private-endpoint-request.png" title="Форма запроса конечной точки Redshift интерфейсного типа с полями имени сервиса AWS PrivateLink и имени конечной точки"/>

   </TabItem>

   </Tabs>

5. После отправки запрос и его статус появятся в таблице **Private endpoints**. После одобрения вы получите уведомление.
6. Перейдите на страницу **Connections** и выполните действия из раздела [Создание подключения в dbt](#create-connection-in-dbt), чтобы настроить PrivateLink. После настройки новая конечная точка появится в разделе **Private endpoints → Associated connections**.

:::note Распространение изменений DNS
Если проверка подключения завершается ошибкой сразу после настройки, это ожидаемо и не означает, что что-то не так. Распространение изменений DNS может занять несколько минут. Подождите несколько минут и повторите проверку, прежде чем обращаться в службу поддержки.
:::

### Устранение неполадок и ошибки

Если запрос конечной точки завершается ошибкой, <Constant name="dbt_platform"/> отображает её в баннере на странице сведений о конечной точке вместе с подробностями, которыми можно безопасно делиться за пределами организации. Изучите сообщение, устраните причину (например, убедитесь, что аккаунту AWS dbt предоставлен доступ в разделе **Granted accounts** кластера), затем нажмите **Retry**.

<Lightbox src="/img/docs/dbt-platform/redshift-private-endpoint-error.png" title="Баннер ошибки создания ресурсов на странице сведений о конечной точке Redshift с кнопкой Retry"/>

Если отображается состояние ошибки без понятных дальнейших действий, соберите сведения о запросе (имя конечной точки, время создания и статус) и обратитесь в [службу поддержки dbt](mailto:support@getdbt.com).

## Настройка с помощью службы поддержки {#support-led-setup}

Если раздел **Private endpoints** недоступен в настройках вашего аккаунта, настройте Redshift PrivateLink, выполнив приведённые ниже действия и отправив запрос в службу поддержки dbt.

## Настройка PrivateLink, управляемого Redshift {#configuring-redshift-managed-privatelink}

1. Найдите раздел **Granted accounts** в настройках Redshift
   - **Стандартный Redshift**
        - В работающем кластере Redshift выберите вкладку **Properties**.
        <Lightbox src="/img/docs/dbt-platform/redshiftprivatelink1.png" title="Вкладка Properties в Redshift"/>
     
   - **Redshift Serverless**
       - На странице **Workgroup configuration** в Redshift Serverless. Если у вас несколько рабочих групп, обязательно предоставьте доступ в разделе **Granted accounts** для каждой рабочей группы при настройке на стороне AWS. См. раздел [Необходима авторизация для каждой рабочей группы](#per-workgroup-authorization).  

2. В разделе **Granted accounts** нажмите **Grant access**.

<Lightbox src="/img/docs/dbt-platform/redshiftprivatelink2.png" title="Аккаунты с предоставленным доступом в Redshift"/>

3. Введите идентификатор аккаунта AWS: `346425330055` — _ПРИМЕЧАНИЕ: этот идентификатор аккаунта применим только к мультитенантным средам <Constant name="dbt" />. Для получения идентификаторов аккаунтов Virtual Private/Single-Tenant обратитесь в [службу поддержки](mailto:support@getdbt.com)._

4. Выберите **Grant access to all VPCs** &mdash;или&mdash; (необязательно) обратитесь в [службу поддержки](mailto:support@getdbt.com), чтобы получить соответствующий региональный идентификатор VPC для указания в поле **Grant access to specific VPCs**.

<Lightbox src="/img/docs/dbt-platform/redshiftprivatelink3.png" title="Предоставление доступа в Redshift"/>

5. Добавьте необходимые сведения в следующий шаблон и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

   - **Стандартный Redshift**

     <Expandable alt_header="Шаблон письма с запросом в службу поддержки" is_open={true}>

     ```text
     Subject: New Multi-Tenant PrivateLink Request

     - Type: Redshift-managed
     - dbt platform account URL:
     - Redshift cluster name:
     - Redshift cluster AWS account ID:
     - Redshift cluster AWS Region (for example, us-east-1, eu-west-2):
     - dbt multi-tenant environment (US, EMEA, AU, JP):
     ```

     </Expandable>

   - **Redshift Serverless**

     <Expandable alt_header="Шаблон письма с запросом в службу поддержки" anchor_id="redshift-serverless-support-request" is_open={true}>

     ```text
     Subject: New Multi-Tenant PrivateLink Request

     - Type: Redshift-managed - Serverless
     - dbt platform account URL:
     - Redshift workgroup name:
     - Redshift workgroup AWS account ID:
     - Redshift workgroup AWS Region (for example, us-east-1, eu-west-2):
     - dbt multi-tenant environment (US, EMEA, AU, JP):
     ```

     </Expandable>

### Необходима авторизация для каждой рабочей группы {#per-workgroup-authorization}

В Redshift Serverless раздел **Granted accounts** относится к одной рабочей группе. Если в вашей среде несколько рабочих групп, необходимо отдельно предоставить доступ для каждой рабочей группы, которую вы хотите подключить к <Constant name="dbt" />.

- Авторизация одной рабочей группы (например, _sales_) не распространяется на другие рабочие группы (например, _finance_ или _product_).
- Повторите шаги с 1 по 4 из раздела [Настройка PrivateLink, управляемого Redshift](#configuring-redshift-managed-privatelink) отдельно для каждой рабочей группы.

Это требование действует независимо от того, настраиваете ли вы конечную точку [самостоятельно](#self-serve-private-endpoints) или с помощью службы поддержки.

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Настройка PrivateLink интерфейсного типа для Redshift {#configuring-redshift-interface-type-privatelink}

### 1. Подготовьте ресурсы AWS

Для создания подключения Interface VPC PrivateLink необходимо создать несколько ресурсов AWS в аккаунте, содержащем кластер Redshift:

- **Группа безопасности (Security Group)** &mdash; если вы подключаетесь к существующему кластеру Redshift, она, скорее всего, уже существует. Однако может потребоваться добавить или изменить правила группы безопасности, чтобы принимать трафик от Network Load Balancer (NLB), созданного для этого сервиса конечных точек.
- **Целевая группа (Target Group)** &mdash; целевая группа подключается к NLB и указывает, куда направлять запросы. Для целевых групп NLB доступны различные типы целей, но здесь будет использоваться тип IP-адреса.
    
    - Тип цели (Target Type): **IP**

        - **Стандартный Redshift**

            - По возможности используйте IP-адреса из раздела **Network Interfaces** кластера Redshift. IP-адреса из раздела **Node IP addresses** тоже подойдут, но вероятность их изменения выше.
            <Lightbox src="/img/docs/dbt-platform/redshiftprivatelink4.png" title="Тип цели: IP-адрес"/>

            - Изначально, скорее всего, будет только один сетевой интерфейс (NI), но если кластер переключится в другую зону доступности (AZ), для этой зоны также будет создан новый NI. IP-адрес NI из исходной зоны доступности продолжит работать, но IP-адрес нового NI тоже можно добавить в целевую группу. При добавлении дополнительных IP-адресов учтите, что соответствующую зону доступности также нужно добавить в NLB. После создания сетевые интерфейсы должны оставаться неизменными (это наше наблюдение по результатам тестирования, но AWS официально это не документирует).

        - **Redshift Serverless**

            - Чтобы найти IP-адреса экземпляра Redshift Serverless, найдите и скопируйте конечную точку (только URL, указанный до порта) в разделе Workgroup configuration консоли AWS для этого экземпляра.
            <Lightbox src="/img/docs/dbt-platform/redshiftserverless.png" title="Конечная точка Redshift Serverless"/>

            - Выполните в командной строке команду `nslookup <endpoint>`, используя конечную точку из предыдущего шага, и укажите полученные IP-адреса в целевой группе.

    - Протокол целевой группы (Target Group protocol): **TCP** 

- **Network Load Balancer (NLB)** &mdash; необходимо создать прослушиватель (Listener), связанный с только что созданной целевой группой (порт по умолчанию — `5439`)
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** выберите VPC, в которой развёртываются сервис конечных точек VPC и NLB, и выберите подсети как минимум из двух зон доступности.
    - **Security Groups:** у Network Load Balancer (NLB), связанного с сервисом конечных точек VPC, либо не должно быть связанной группы безопасности, либо в этой группе должно быть правило, разрешающее запросы из соответствующих **частных CIDR-диапазонов** <Constant name="dbt" />. Обратите внимание: _они отличаются_ от статических публичных IP-адресов, перечисленных на странице <Constant name="dbt" /> [Доступ, регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses). Служба поддержки dbt может предоставить нужные частные CIDR-диапазоны по запросу. При необходимости, пока вы не сможете сузить правило до меньшего CIDR-диапазона, предоставленного dbt, временно добавьте разрешающее правило для `10.0.0.0/8`, чтобы обеспечить подключение.
    - **Listeners:** создайте по одному прослушивателю для каждой целевой группы, сопоставив соответствующий входящий порт с соответствующей целевой группой ([подробнее](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **Сервис конечных точек VPC (VPC Endpoint Service)** &mdash; свяжите его с только что созданным NLB.
    - Acceptance required (необязательно) &mdash; требуется [принять наш запрос на подключение](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) после того, как dbt создаст конечную точку.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Предоставьте аккаунту AWS dbt доступ к сервису конечных точек VPC

В созданном сервисе конечных точек VPC откройте вкладку **Allow principals**. Нажмите **Allow principals**, чтобы предоставить доступ. Введите ARN корневого пользователя соответствующего производственного аккаунта AWS и сохраните изменения.

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-platform/privatelink-allow-principals.png" title="Ввод ARN"/>

### 3. Получите имя сервиса конечных точек VPC

После создания сервиса конечных точек VPC его имя можно найти в консоли AWS: перейдите в **VPC** → **Endpoint Services** и выберите соответствующий сервис конечных точек. Скопируйте значение поля имени сервиса и включите его в обращение в службу поддержки <Constant name="dbt" />.

<Lightbox src="/img/docs/dbt-platform/privatelink-endpoint-service-name.png" title="Получение значения поля имени сервиса"/>

### 4. Отправьте запрос в службу поддержки dbt
Добавьте необходимые сведения в шаблон ниже и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Шаблон письма с запросом в службу поддержки" anchor_id="redshift-interface-endpoint-support-request" is_open={true}>

```text
Subject: New Multi-Tenant PrivateLink Request

- Type: Redshift Interface-type
- dbt platform account URL:
- VPC Endpoint Service Name:
- Redshift cluster AWS Region (for example, us-east-1, eu-west-2):
- dbt AWS multi-tenant environment (US, EMEA, AU, JP):
```

</Expandable>

<PrivateLinkSLA />

## Создание подключения в dbt {#create-connection-in-dbt}

После того как служба поддержки <Constant name="dbt" /> завершит настройку, вы сможете создавать новые подключения с использованием PrivateLink.

<PrivateLinkCreateConnection platform="Redshift" />

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
