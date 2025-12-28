---
title: "Настройка Cloudera Hive"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Cloudera Hive в dbt."
id: "hive-setup"
meta:
  maintained_by: Cloudera
  authors: 'Cloudera'
  github_repo: 'cloudera/dbt-hive'
  pypi_package: 'dbt-hive'
  min_core_version: 'v1.1.0'
  cloud_support: Не поддерживается
  min_supported_version: 'n/a'
  slack_channel_name: '#db-hive'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0401DTNSKW'
  platform_name: 'Hive'
  config_page: '/reference/resource-configs/hive-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Методы подключения

dbt-hive может подключаться к кластерам Apache Hive и Cloudera Data Platform. Для установления соединений с Hive используется библиотека [Impyla](https://github.com/cloudera/impyla/).

dbt-hive поддерживает два механизма передачи данных:
- бинарный
- HTTP(S)

Механизм по умолчанию — `binary`. Чтобы использовать HTTP-транспорт, используйте булевую опцию. Например, `use_http_transport: true`.

## Методы аутентификации

dbt-hive поддерживает два механизма аутентификации:
- [`insecure`](#Insecure) Без аутентификации, рекомендуется только для тестирования.
- [`ldap`](#ldap) Аутентификация через LDAP

### Небезопасно

Этот метод рекомендуется только в случае, если у вас установлена локальная версия Hive и вы хотите протестировать адаптер dbt-hive.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: hive
      host: localhost
      port: PORT # значение по умолчанию: 10000
      schema: SCHEMA_NAME
      
```

</File>

### LDAP

LDAP позволяет аутентифицироваться с помощью имени пользователя и пароля, когда Hive [настроен с LDAP Auth](https://cwiki.apache.org/confluence/display/Hive/Setting+Up+HiveServer2). LDAP поддерживается через механизмы подключения Binary и HTTP.

Это рекомендуемый механизм аутентификации для использования с Cloudera Data Platform (CDP).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
     type: hive
     host: HOST_NAME
     http_path: YOUR/HTTP/PATH # необязательно, http путь к Hive, значение по умолчанию: None
     port: PORT # значение по умолчанию: 10000
     auth_type: ldap
```yaml
use_http_transport: BOOLEAN # значение по умолчанию: true
use_ssl: BOOLEAN # TLS всегда следует использовать с LDAP, чтобы обеспечить безопасную передачу учетных данных; значение по умолчанию: true
user: USERNAME
```
     password: PASSWORD
     schema: SCHEMA_NAME
```

</File>

Примечание: При создании workload-пользователя в CDP убедитесь, что у пользователя есть права CREATE, SELECT, ALTER, INSERT, UPDATE, DROP, INDEX, READ и WRITE. Если пользователю требуется выполнять операторы GRANT, необходимо дополнительно настроить соответствующие права на GRANT. При использовании Apache Ranger разрешения, позволяющие выполнять GRANT, обычно настраиваются с помощью опции «Delegate Admin». Подробнее см. в разделе [`grants`](/reference/resource-configs/grants) и [on-run-start & on-run-end](/reference/project-configs/on-run-start-on-run-end).

### Kerberos

Механизм аутентификации Kerberos использует GSSAPI для обмена учетными данными Kerberos, когда Hive [настроен с Kerberos Auth](https://ambari.apache.org/1.2.5/installing-hadoop-using-ambari/content/ambari-kerb-2-3-3.html).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: hive
      host: HOSTNAME
      port: PORT # значение по умолчанию: 10000
      auth_type: GSSAPI
      kerberos_service_name: KERBEROS_SERVICE_NAME # значение по умолчанию: None
      use_http_transport: BOOLEAN # значение по умолчанию: true
      use_ssl: BOOLEAN # TLS всегда должен использоваться для обеспечения безопасной передачи учетных данных, значение по умолчанию: true
      schema: SCHEMA_NAME

```

</File>

Примечание: Типичная настройка Cloudera Private Cloud будет включать следующие шаги для настройки Kerberos перед выполнением команд dbt:
- Получите правильный файл конфигурации realm для вашей установки (krb5.conf)
- Установите переменную окружения, чтобы указать на файл конфигурации (export KRB5_CONFIG=/path/to/krb5.conf)
- Установите правильные разрешения для файла конфигурации (sudo chmod 644 /path/to/krb5.conf)
- Получите keytab с помощью kinit (kinit username@YOUR_REALM.YOUR_DOMAIN)
- Keytab действителен в течение определенного периода, после чего вам нужно будет снова запустить kinit для обновления его действительности.
- Пользователю потребуются разрешения CREATE, DROP, INSERT на схему, указанную в profiles.yml

### Инструментирование
По умолчанию адаптер будет собирать события инструментирования, чтобы помочь улучшить функциональность и понять ошибки. Если вы хотите специально отключить это, например, в производственной среде, вы можете явно установить флаг `usage_tracking: false` в вашем файле `profiles.yml`.

## Установка и распространение

Адаптер dbt для Cloudera Hive поддерживается в отдельном репозитории — [dbt-hive](https://github.com/cloudera/dbt-hive).  
Чтобы использовать его, необходимо установить плагин `dbt-hive`.

### Использование pip
Следующие команды установят последнюю версию `dbt-hive`, а также необходимую версию `dbt-core` и драйвер `impyla`, используемый для подключений.

```
python -m pip install dbt-hive
```

### Поддерживаемая функциональность

| Название | Поддерживается |
|------|-----------|
|Материализация: Таблица|Да|
|Материализация: Представление|Да|
|Материализация: Инкрементальная - Добавление|Да|
|Материализация: Инкрементальная - Вставка+Перезапись|Да|
|Материализация: Инкрементальная - Слияние|Нет|
|Материализация: Эфемерная|Нет|
|Семена|Да|
|Тесты|Да|
|Снимки|Нет|
|Документация|Да|
|Аутентификация: LDAP|Да|
|Аутентификация: Kerberos|Да|
