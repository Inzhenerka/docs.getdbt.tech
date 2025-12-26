---
title: "Подключение Apache Spark"
id: connect-apache-spark
description: "Инструкции по настройке подключения Apache Spark к dbt"
sidebar_label: "Подключение Apache Spark"
pagination_next: null
---

<Snippet path="dbt-databricks-for-databricks" />

:::note
См. [Подключение Databricks](#connect-databricks) для версии этой страницы для Databricks.
:::

<Constant name="cloud" /> поддерживает подключение к кластеру Apache Spark с использованием HTTP-метода
или метода Thrift. Примечание: хотя HTTP-метод можно использовать для подключения
к all-purpose кластеру Databricks, для всех подключений к Databricks рекомендуется
использовать ODBC-метод. Подробнее о настройке этих параметров подключения см. в
[документации dbt-spark](https://github.com/dbt-labs/dbt-spark#configuring-your-profile).

Чтобы узнать, как оптимизировать производительность с помощью платформенно-специфичных
настроек данных в <Constant name="cloud" />, см.
[конфигурации, специфичные для Apache Spark](/reference/resource-configs/spark-configs).

Следующие поля доступны при создании подключения Apache Spark с использованием методов подключения HTTP и Thrift:

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Host Name | Имя хоста кластера Spark для подключения | `yourorg.sparkhost.com` |
| Port | Порт для подключения к Spark | 443 |
| Organization | Необязательно (по умолчанию: 0) | 0123456789 |
| Cluster | ID кластера для подключения | 1234-567890-abc12345 |
| Connection Timeout | Количество секунд до истечения времени ожидания подключения | 10 |
| Connection Retries | Количество попыток подключения к кластеру перед отказом | 10 |
| User | Необязательно | dbt_cloud_user |
| Auth | Необязательно, укажите, если используется Kerberos | `KERBEROS` |
| Kerberos Service Name | Необязательно, укажите, если используется Kerberos | `hive` |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/spark-connection.png" title="Настройка подключения Spark"/>