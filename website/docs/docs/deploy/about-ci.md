---
title: "О непрерывной интеграции (CI) в dbt Cloud"
sidebar_label: "О непрерывной интеграции"
pagination_prev: null
pagination_next: "docs/deploy/continuous-integration"
hide_table_of_contents: true
---

Используйте [CI задачи](/docs/deploy/ci-jobs) в dbt Cloud для настройки автоматизации тестирования изменений кода перед слиянием в продакшн. Кроме того, [включите расширенные функции CI](/docs/cloud/account-settings#account-access-to-advanced-ci-features) для этих задач, чтобы оценить, приводят ли изменения в коде к желаемым изменениям данных, просматривая различия, предоставляемые dbt.

Обратитесь к руководству [Начало работы с тестами непрерывной интеграции](/guides/set-up-ci?step=1) для получения дополнительной информации.

<div className="grid--2-col" >

<Card
    title="Непрерывная интеграция"
    body="Настройте проверки CI, чтобы тестировать каждое изменение перед развертыванием кода в продакшн."
    link="/docs/deploy/continuous-integration"
    icon="dbt-bit"/>

  <Card
    title="Расширенные функции CI"
    body="Сравните различия между тем, что находится в производственной среде, и запросом на слияние перед объединением этих изменений, чтобы гарантировать, что вы всегда поставляете надежные продукты данных."
    link="/docs/deploy/advanced-ci"
    icon="dbt-bit"/>

</div><br />