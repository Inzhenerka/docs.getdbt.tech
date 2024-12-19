---
title: "Подключение Apache Spark"
id: connect-apache-spark
description: "Инструкции по настройке подключения Apache Spark к dbt Cloud"
sidebar_label: "Подключение Apache Spark"
pagination_next: null
---

<Snippet path="dbt-databricks-for-databricks" />

:::note
Смотрите [Подключение Databricks](#connect-databricks) для версии этой страницы, относящейся к Databricks.
:::

dbt Cloud поддерживает подключение к кластеру Apache Spark с использованием метода HTTP или метода Thrift. Примечание: хотя метод HTTP можно использовать для подключения к универсальному кластеру Databricks, рекомендуется использовать метод ODBC для всех подключений к Databricks. Для получения дополнительных сведений о настройке этих параметров подключения, пожалуйста, смотрите [документацию dbt-spark](https://github.com/dbt-labs/dbt-spark#configuring-your-profile).

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для платформы данных в dbt Cloud, обратитесь к [конфигурации, специфичной для Apache Spark](/reference/resource-configs/spark-configs).

Следующие поля доступны при создании подключения Apache Spark с использованием методов подключения HTTP и Thrift:

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Host Name | Имя хоста кластера Spark, к которому нужно подключиться | `yourorg.sparkhost.com` |
| Port | Порт для подключения к Spark | 443 |
| Organization | Необязательно (по умолчанию: 0) | 0123456789 |
| Cluster | Идентификатор кластера, к которому нужно подключиться | 1234-567890-abc12345 |
| Connection Timeout | Количество секунд, после которых соединение будет прервано | 10 |
| Connection Retries | Количество попыток подключения к кластеру перед неудачей | 10 |
| User | Необязательно | dbt_cloud_user |
| Auth | Необязательно, укажите, если используете Kerberos | `KERBEROS` |
| Kerberos Service Name | Необязательно, укажите, если используете Kerberos | `hive` |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/spark-connection.png" title="Настройка подключения Spark"/>