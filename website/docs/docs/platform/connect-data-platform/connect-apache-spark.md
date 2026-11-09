---
title: "Подключение Apache Spark"
id: connect-apache-spark
description: "Инструкции по настройке подключения Apache Spark к dbt"
sidebar_label: "Подключение Apache Spark"
pagination_next: null
availability:
  surface: platform
  access: login_required
---

<Snippet path="dbt-databricks-for-databricks" />

:::note
См. [Подключение Databricks](/docs/platform/connect-data-platform/connect-databricks) для версии этой страницы для Databricks.
:::

<Constant name="dbt" /> поддерживает подключение к кластеру Apache Spark по протоколу HTTP
или Thrift. Примечание: хотя HTTP можно использовать для подключения
к универсальному кластеру Databricks, для всех подключений
к Databricks рекомендуется использовать ODBC. Подробную информацию о настройке этих параметров
подключения см. в [документации dbt-spark](https://github.com/dbt-labs/dbt-spark#configuring-your-profile).

Чтобы узнать, как оптимизировать производительность с помощью настроек <Constant name="dbt" />, специфичных для платформы данных, см. раздел [Настройки для Apache Spark](/reference/resource-configs/spark-configs).

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

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/spark-connection.png" title="Настройка подключения к Spark"/>
