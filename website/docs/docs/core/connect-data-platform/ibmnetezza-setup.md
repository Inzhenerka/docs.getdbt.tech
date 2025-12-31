---
title: "Настройка IBM Netezza"
description: "Прочитайте это руководство, чтобы узнать о настройке IBM Netezza в dbt."
id: "ibmnetezza-setup"
meta:
  maintained_by: IBM
  authors: Abhishek Jog, Sagar Soni, Ayush Mehrotra
  github_repo: 'IBM/nz-dbt'
  pypi_package: 'dbt-ibm-netezza'
  min_core_version: v1.9.2
  cloud_support: 'Not Supported'
  min_supported_version: '11.2.3.4'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM Netezza
  config_page: /reference/resource-configs/ibm-netezza-config
---

Адаптер `dbt-ibm-netezza` позволяет использовать dbt для трансформации и управления данными в IBM Netezza, используя возможности распределённого SQL-движка. Перед началом убедитесь, что у вас есть следующее:
<ul>
  <li>Активный движок IBM Netezza с данными для подключения (host, port, database, schema и т.д.) в SaaS/PaaS.</li>
  <li>Учётные данные для аутентификации: имя пользователя и пароль.</li>
</ul>
Обратитесь к разделу [Configuring dbt-ibm-netezza](https://github.com/IBM/nz-dbt?tab=readme-ov-file#testing-sample-dbt-project) для получения рекомендаций по получению и организации этих данных.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Подключение к IBM Netezza {#connecting-to-ibm-netezza}

Чтобы подключить dbt к IBM Netezza, необходимо настроить профиль в файле `profiles.yml`, расположенном в каталоге `.dbt/` вашего домашнего каталога. Ниже приведён пример конфигурации для подключения к экземплярам IBM Netezza:

<File name='~/.dbt/profiles.yml'>

```yaml
my_project:
  outputs:
    dev:
      type: netezza
      user: [user]
      password: [password]
      host: [hostname]
      database: [catalog name]
      schema: [schema name]
      port: 5480
      threads: [1 or more]

  target: dev

```

</File>


### Настройка параметров внешних таблиц {#setup-external-table-options}

Также необходимо настроить файл `et_options.yml`, расположенный в каталоге вашего проекта. Убедитесь, что файл корректно настроен перед запуском `dbt seed`. Это гарантирует, что данные будут загружены в таблицы в соответствии с параметрами, указанными во внешнем файле данных.

<File name='./et_options.yml'>

```yaml
- !ETOptions
    SkipRows: "1"
    Delimiter: "','"
    DateDelim: "'-'"
    MaxErrors: " 0 "
```

</File>

Дополнительные параметры можно найти в разделе [Netezza external tables option summary](https://www.ibm.com/docs/en/netezza?topic=eto-option-summary).


## Параметры подключения (Host parameters) {#host-parameters}

Для настройки подключения к IBM Netezza требуются следующие поля профиля.

| Option    | Required/Optional | Description | Example  |
| --------- | ------- | ------- | ----------- |
|   `user`  | Required | Имя пользователя или адрес электронной почты для аутентификации. | `user` |
| `password`| Required | Пароль или API-ключ для аутентификации. | `password` |
|   `host`  | Required | Имя хоста для подключения к Netezza. | `127.0.0.1` |
| `database`| Required | Имя каталога (catalog) в вашем экземпляре Netezza. | `SYSTEM` |
|  `schema` | Required | Имя схемы в выбранном каталоге экземпляра Netezza. | `my_schema`  |
|   `port`  | Required | Порт для подключения к Netezza.  | `5480`  |


### Схемы и базы данных {#schemas-and-databases}
При выборе базы данных и схемы убедитесь, что у пользователя есть права на чтение и запись в обеих. Этот выбор не ограничивает ваши возможности по выполнению запросов к базе данных. Вместо этого они используются как расположение по умолчанию, где будут материализовываться таблицы и представления.

## Примечания: {#notes}

Адаптер `dbt-ibm-netezza` построен на Python-драйвере IBM Netezza — [nzpy](https://pypi.org/project/nzpy/), который является обязательной зависимостью и устанавливается вместе с адаптером.
