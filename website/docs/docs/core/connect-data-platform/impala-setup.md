---
title: "Настройка Apache Impala"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Apache Impala в dbt."
id: "impala-setup"
meta:
  maintained_by: Cloudera
  authors: 'Cloudera'
  github_repo: 'cloudera/dbt-impala'
  pypi_package: 'dbt-impala'
  min_core_version: 'v1.1.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-impala'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWAH41A5'
  platform_name: 'Impala'
  config_page: '/reference/resource-configs/impala-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Методы подключения

dbt-impala может подключаться к кластерам Apache Impala и Cloudera Data Platform.

Для установления соединений с Impala используется библиотека [Impyla](https://github.com/cloudera/impyla/).

Поддерживаются два механизма передачи данных:
- binary
- HTTP(S)

Механизм по умолчанию — `binary`. Чтобы использовать HTTP-транспорт, используйте булевую опцию `use_http_transport: [true / false]`.

## Методы аутентификации

dbt-impala поддерживает три механизма аутентификации:
- [`insecure`](#Insecure) Без аутентификации, рекомендуется только для тестирования.
- [`ldap`](#ldap) Аутентификация через LDAP
- [`kerberos`](#kerberos) Аутентификация через Kerberos (GSSAPI)

### Insecure

Этот метод рекомендуется только в случае, если у вас установлена локальная версия Impala и вы хотите протестировать адаптер dbt-impala.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: impala
      host: [host] # значение по умолчанию: localhost
      port: [port] # значение по умолчанию: 21050
      dbname: [db name]  # это должно совпадать с именем схемы, указанным ниже, начиная с версии 1.1.2 этот параметр является необязательным
      schema: [schema name]
      
```

</File>

### LDAP

LDAP позволяет вам аутентифицироваться с помощью имени пользователя и пароля, когда Impala [настроена с аутентификацией LDAP](https://impala.apache.org/docs/build/html/topics/impala_ldap.html). LDAP поддерживается через механизмы подключения Binary и HTTP.

Это рекомендуемый механизм аутентификации для использования с Cloudera Data Platform (CDP).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
     type: impala
     host: [host name]
     http_path: [optional, http path to Impala]
     port: [port] # значение по умолчанию: 21050
     auth_type: ldap
     use_http_transport: [true / false] # значение по умолчанию: true
     use_ssl: [true / false] # TLS всегда должен использоваться с LDAP для обеспечения безопасной передачи учетных данных, значение по умолчанию: true
     username: [username]
     password: [password]
     dbname: [db name]  # это должно совпадать с именем схемы, указанным ниже, начиная с версии 1.1.2 этот параметр является необязательным
     schema: [schema name]
     retries: [retries] # количество попыток повторного подключения impyla к хранилищу, значение по умолчанию: 3
  
```

</File>

Примечание: При создании пользователя для рабочей нагрузки в CDP убедитесь, что у пользователя есть разрешения CREATE, SELECT, ALTER, INSERT, UPDATE, DROP, INDEX, READ и WRITE. Если пользователю необходимо выполнять операторы GRANT, см. например (https://docs.getdbt.com/reference/resource-configs/grants) или (https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end), соответствующие разрешения GRANT должны быть настроены. При использовании Apache Ranger разрешения для разрешения GRANT обычно устанавливаются с помощью опции "Delegate Admin".

### Kerberos

Механизм аутентификации Kerberos использует GSSAPI для передачи учетных данных Kerberos, когда Impala [настроена с аутентификацией Kerberos](https://impala.apache.org/docs/build/html/topics/impala_kerberos.html).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: impala
      host: [hostname]
      port: [port] # значение по умолчанию: 21050
      auth_type: [GSSAPI]
      kerberos_service_name: [kerberos service name] # значение по умолчанию: None
      use_http_transport: true # значение по умолчанию: true
      use_ssl: true # TLS всегда должен использоваться с LDAP для обеспечения безопасной передачи учетных данных, значение по умолчанию: true
      dbname: [db name]  # это должно совпадать с именем схемы, указанным ниже, начиная с версии 1.1.2 этот параметр является необязательным
      schema: [schema name]
      retries: [retries] # количество попыток повторного подключения impyla к хранилищу, значение по умолчанию: 3
  
```

</File>

Примечание: Типичная настройка Cloudera EDH будет включать следующие шаги для настройки Kerberos перед выполнением команд dbt:
- Получите правильный файл конфигурации realm для вашей установки (krb5.conf)
- Установите переменную окружения, чтобы указать на файл конфигурации (export KRB5_CONFIG=/path/to/krb5.conf)
- Установите правильные разрешения для файла конфигурации (sudo chmod 644 /path/to/krb5.conf)
- Получите keytab с помощью kinit (kinit username@YOUR_REALM.YOUR_DOMAIN)
- Keytab действителен в течение определенного периода, после чего вам нужно будет снова запустить kinit для обновления его действительности.

### Инструментирование

По умолчанию адаптер будет отправлять события инструментирования в Cloudera, чтобы помочь улучшить функциональность и понять ошибки. Если вы хотите специально отключить это, например, в производственной среде, вы можете явно установить флаг `usage_tracking: false` в вашем файле `profiles.yml`.

Если вы хотите отключить анонимное отслеживание использования dbt Lab, см. [YAML Configurations: Send anonymous usage stats](https://docs.getdbt.com/reference/global-configs#send-anonymous-usage-stats) для получения дополнительной информации.

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
|Снимки|Да|
|Документация|Да|
|Аутентификация: LDAP|Да|
|Аутентификация: Kerberos|Да|