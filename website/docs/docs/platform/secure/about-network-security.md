---
title: "О сетевой безопасности"
id: about-network-security
description: "Настройка сетевой безопасности для dbt Cloud"
sidebar_label: "О сетевой безопасности"
availability:
  surface: platform
  access: login_required
---

Сетевая безопасность в <Constant name="dbt" /> позволяет управлять сетевым трафиком между dbt и вашей инфраструктурой. Выберите подход, который лучше всего соответствует вашим требованиям к безопасности.

## Выберите способ подключения

<div className="grid--2-col">

<Card
    title="Через общедоступный интернет"
    body="Используйте ограничения по IP-адресам, чтобы разрешить доступ к dbt Cloud или вашей платформе данных только с определённых IP-адресов."
    link="/docs/platform/secure/ip-restrictions"
    icon="dbt-bit"
/>

<Card
    title="Через частную сеть"
    body="Используйте технологию частного подключения вашего облачного провайдера, чтобы полностью исключить передачу трафика через общедоступный интернет."
    link="/docs/platform/secure/private-connectivity/private-connectivity"
    icon="dbt-bit"
/>

</div>
