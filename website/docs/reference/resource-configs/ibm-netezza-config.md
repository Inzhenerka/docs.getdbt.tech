---
title: "Конфигурация IBM Netezza"
id: "ibm-netezza-config"
---

## Требования к инстансу {#instance-requirements}

Чтобы использовать IBM Netezza с адаптером `dbt-ibm-netezza`, убедитесь, что экземпляр имеет подключённый каталог, который поддерживает создание, переименование, изменение и удаление объектов, таких как таблицы и представления. Пользователь, подключающийся к экземпляру через адаптер `dbt-ibm-netezza`, должен иметь необходимые права доступа к целевой базе данных.

Для получения дополнительной информации посетите официальную [документацию IBM](https://cloud.ibm.com/docs/netezza?topic=netezza-getstarted).

### IBM Netezza SQL Extension Toolkit {#ibm-netezza-sql-extension-toolkit}

Убедитесь, что на вашей системе IBM Netezza установлен SQL Extension Toolkit. Это обязательное предварительное требование для выполнения всех функций, которым необходимы операции со строковыми данными и опции представлений. Подробнее см. в [документации](https://www.ibm.com/docs/en/netezza?topic=toolkit-sql-extensions-installation-setup).

## Seeds и подготовленные выражения {#seeds-and-prepared-statements}

Адаптер `dbt-ibm-netezza` предоставляет полноценную поддержку всех [типов данных](https://www.ibm.com/docs/en/netezza?topic=nrl-data-types) в seed-файлах. Чтобы воспользоваться этой возможностью, необходимо явно задать типы данных для каждого столбца.

Вы можете настраивать типы данных столбцов либо в файле `dbt_project.yml`, либо в property-файлах, поддерживаемых dbt. Подробнее о конфигурации seed-файлов и рекомендуемых практиках см. в [документации по настройке dbt seeds](/reference/seed-configs).

### Рекомендации {#recommendations}

- **Изучите SQL-документацию:** ознакомьтесь со справочником команд SQL для IBM Netezza — [SQL command reference](https://www.ibm.com/docs/en/netezza?topic=dud-netezza-performance-server-sql-command-reference) — при создании вашего dbt‑проекта.
