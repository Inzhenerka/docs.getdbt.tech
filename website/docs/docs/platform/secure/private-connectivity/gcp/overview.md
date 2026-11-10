---
title: "Частное подключение в GCP"
id: gcp-overview
description: "Настройка частных подключений для развертываний платформы dbt в GCP."
sidebar_label: "О GCP Private Service Connect"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import GCPMatrix from '/snippets/_gcp-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

GCP Private Service Connect обеспечивает безопасное частное подключение между <Constant name="dbt" /> и вашими сервисами, размещенными в GCP. При использовании Private Service Connect трафик между dbt и вашими платформами данных или самостоятельно размещенными сервисами остается в сети Google Cloud и не проходит через общедоступный интернет.

Дополнительные сведения см. в [документации GCP Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect).

<GCPMatrix />

## Частные подключения между регионами

У dbt Labs есть частные сети, объединенные на глобальном уровне и предназначенные специально для размещения частных конечных точек, которые подключены к средам экземпляров <Constant name="dbt" />. Такая сетевая связность позволяет средам <Constant name="dbt" /> подключаться к любому поддерживаемому региону из любого экземпляра <Constant name="dbt" /> в пределах сети одного облачного провайдера. Для обеспечения безопасности доступ к этим конечным точкам защищен группами безопасности, сетевыми политиками и средствами защиты подключений на уровне приложений в дополнение к механизмам аутентификации и авторизации, предоставляемым каждой из подключенных платформ.
