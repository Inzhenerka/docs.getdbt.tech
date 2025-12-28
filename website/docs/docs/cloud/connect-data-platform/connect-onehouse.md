---
title: "Подключение Onehouse"
id: connect-onehouse
sidebar_label: "Подключение Onehouse"
description: "Инструкции по настройке подключения Onehouse к dbt"
pagination_next: null
---


<Constant name="cloud" /> поддерживает подключение к [Onehouse SQL](https://www.onehouse.ai/product/quanton) с использованием Apache Spark Connector через метод Thrift.

:::note
Подключайтесь к Onehouse SQL Cluster с помощью адаптера [dbt-spark](/docs/cloud/connect-data-platform/connect-apache-spark).**
:::

## Требования

* Для <Constant name="cloud" /> убедитесь, что ваш Onehouse SQL endpoint доступен через внешний DNS/IP, и выполнена настройка whitelisting IP-адресов <Constant name="cloud" />.

## Что работает 

* Все команды dbt, включая: `dbt clean`, `dbt compile`, `dbt debug`, `dbt seed` и `dbt run`.
* Материализации dbt: `table` и `incremental`
* Типы таблиц Apache Hudi: Merge on Read (MoR) и Copy on Write (CoW). Для изменяемых (mutable) нагрузок рекомендуется использовать MoR.

## Ограничения

* Представления (views) не поддерживаются
* Для `dbt seed` существуют ограничения по количеству строк / записей.
* `dbt seed` поддерживает только таблицы Copy on Write.

## Подключение dbt

При создании подключения **Apache Spark** с использованием метода Thrift заполните следующие поля:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Method | Метод подключения к Spark | Thrift |
| Hostname | Имя хоста endpoint’а вашего Onehouse SQL Cluster | `yourProject.sparkHost.com` |
| Port | Порт для подключения к Spark | 10000 |
| Cluster | Onehouse не использует это поле | |
| Connection Timeout | Количество секунд до таймаута соединения | 10 |
| Connection Retries | Количество попыток подключения к кластеру перед ошибкой | 0 |
| Organization | Onehouse не использует это поле | |
| User | Необязательно. По умолчанию не включено. | dbt_cloud_user |
| Auth | Необязательно, укажите при использовании Kerberos. По умолчанию не включено. | `KERBEROS` |
| Kerberos Service Name | Необязательно, укажите при использовании Kerberos. По умолчанию не включено. | `hive` |

<Lightbox src="/img/onehouse/onehouse-dbt.png" width="70%" title="Конфигурация Onehouse"/>

## проект dbt

Мы рекомендуем задать конфигурации по умолчанию в dbt_project.yml, чтобы адаптер выполнялся с SQL, совместимым с Onehouse.

| Field | Description | Required | Default  | Recommended |
| ----- | ----------- | -------- | -------- | -------- |
| materialized | Материализация, используемая по умолчанию для проекта/каталога | Yes | без указания — `view` | `table` |
| file_format | Формат таблиц, используемый по умолчанию в проекте | Yes | N/A | hudi |
| location_root | Расположение базы данных в DFS | Yes | N/A | `<your_database_location_dfs>` |
| hoodie.table.type | Merge on Read или Copy on Write | No | cow | mor |

Шаблон dbt_project.yml

```yml
      +materialized: table | incremental
      +file_format: hudi
      +location_root: <storage_uri>
      +tblproperties:
         hoodie.table.type: mor | cow
```

Пример dbt_project.yml при использовании jaffle shop:
```sql
models:
  jaffle_shop:
    +file_format: hudi
    +location_root: s3://lakehouse/demolake/dbt_ecomm/
    +tblproperties:
      hoodie.table.type: mor
    staging:
      +materialized: incremental
    marts:
      +materialized: table
```
