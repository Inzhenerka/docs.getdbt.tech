---
title: "Настройка Databricks PrivateLink"
id: databricks-privatelink
description: "Настройка PrivateLink для Databricks"
sidebar_label: "PrivateLink для Databricks"
pagination_next: null
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

Следующие шаги помогут вам настроить конечную точку Databricks AWS PrivateLink или Azure Private Link в многопользовательской среде dbt Cloud.

<CloudProviders type='Databricks'/>

## Настройка AWS PrivateLink

1. Найдите имя вашей [инстанции Databricks](https://docs.databricks.com/en/workspace/workspace-details.html#workspace-instance-names-urls-and-ids)
    - Пример: `cust-success.cloud.databricks.com`

1. Добавьте необходимую информацию в следующий шаблон и отправьте свой запрос на AWS PrivateLink в [поддержку dbt](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support): 
    ```
    Тема: Новый запрос на AWS Multi-Tenant PrivateLink
    - Тип: Databricks
    - Имя инстанции Databricks:
    - Регион AWS кластера Databricks (например, us-east-1, eu-west-2):
    - Многопользовательская среда dbt Cloud (США, EMEA, AU):
    ```
    <PrivateLinkSLA />

1. После того как поддержка dbt Cloud уведомит вас о завершении настройки, [зарегистрируйте VPC конечную точку в Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) и прикрепите ее к рабочему пространству:
    - [Зарегистрируйте вашу VPC конечную точку](https://docs.databricks.com/en/security/network/classic/vpc-endpoints.html) &mdash; Зарегистрируйте VPC конечную точку, используя ID конечной точки VPC, предоставленный поддержкой dbt.
    - [Создайте объект настроек частного доступа](https://docs.databricks.com/en/security/network/classic/private-access-settings.html) &mdash; Создайте объект настроек частного доступа (PAS) с желаемыми настройками публичного доступа и установите уровень частного доступа на **Endpoint**. Выберите зарегистрированную конечную точку, созданную на предыдущем шаге.
    - [Создайте или обновите ваше рабочее пространство](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both) &mdash; Создайте рабочее пространство или обновите существующее. В разделе **Расширенные настройки → Private Link** выберите объект настроек частного доступа, созданный на предыдущем шаге.

    :::warning
    Если вы используете существующее рабочее пространство Databricks, все рабочие нагрузки, выполняющиеся в рабочем пространстве, должны быть остановлены для включения Private Link. Рабочие нагрузки также не могут быть запущены в течение следующих 20 минут после внесения изменений. Из [документации Databricks](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both):

    "После создания (или обновления) рабочего пространства дождитесь, пока оно станет доступным для использования или создания кластеров. Статус рабочего пространства остается на уровне RUNNING, и изменение VPC происходит немедленно. Однако вы не можете использовать или создавать кластеры в течение следующих 20 минут. Если вы создадите или используете кластеры до истечения этого времени, кластеры не запустятся успешно, завершатся с ошибкой или могут вызвать другое неожиданное поведение."

    :::

## Настройка Azure Private Link

1. Перейдите в ваше рабочее пространство Azure Databricks. 
    Формат пути: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Databricks/workspaces/<workspace_name>`.
2. На странице обзора рабочего пространства нажмите **JSON view**. 
3. Скопируйте значение в поле `resource_id`.  
4. Добавьте необходимую информацию в следующий шаблон и отправьте свой запрос на Azure Private Link в [поддержку dbt](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support): 
    ```
      Тема: Новый запрос на Azure Multi-Tenant Private Link
    - Тип: Databricks
    - Имя инстанции Databricks:
    - Azure resource ID Databricks:
    - Многопользовательская среда dbt Cloud: EMEA
    ```
5. После того как наша команда поддержки подтвердит, что ресурсы доступны в портале Azure, перейдите в рабочее пространство Azure Databricks и перейдите в **Сеть** > **Подключения частных конечных точек**. Затем выделите опцию с именем `dbt` и выберите **Одобрить**.


## Создание подключения в dbt Cloud

После завершения настройки в среде Databricks вы сможете настроить частную конечную точку в dbt Cloud:

1. Перейдите в **Настройки** → **Создать новый проект** → выберите **Databricks**. 
2. Вы увидите две радиокнопки: **Public** и **Private.** Выберите **Private**. 
3. Выберите частную конечную точку из выпадающего списка (это автоматически заполнит поле имени хоста/аккаунта).
4. Настройте оставшиеся детали платформы данных.
5. Протестируйте ваше подключение и сохраните его.