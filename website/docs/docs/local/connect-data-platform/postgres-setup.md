---
title: "Подключение Postgres к dbt v1"
sidebar_label: "Postgres"
description: "Прочитайте это руководство, чтобы узнать, как настроить хранилище данных Postgres в dbt."
id: "postgres-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-postgres'
  min_core_version: 'v0.4.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-postgres'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0172G2E273'
  platform_name: 'Postgres'
  config_page: '/reference/resource-configs/postgres-configs'
availability: local_free
---


<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Конфигурация профиля {#profile-configuration}

Цели Postgres должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: postgres
      host: [hostname]
      user: [username]
      password: [password]
      port: [port]
      dbname: [database name] # или database вместо dbname
      schema: [dbt schema]
threads: [необязательно, 1 или больше]
      [keepalives_idle](#keepalives_idle): 0 # по умолчанию 0, что означает использование системного значения по умолчанию. См. ниже
      connect_timeout: 10 # по умолчанию 10 секунд
      [retries](#retries): 1  # по умолчанию 1 повторная попытка при ошибке или тайм-ауте во время открытия соединений
      [search_path](#search_path): [необязательно, переопределяет значение search_path по умолчанию в postgres]
      [role](#role): [необязательно, задаёт роль, которую dbt принимает при выполнении запросов]
      [sslmode](#sslmode): [необязательно, задаёт режим sslmode для подключения к базе данных]
      [sslcert](#sslcert): [необязательно, задаёт значение sslcert для указания расположения файла сертификата]
      [sslkey](#sslkey): [необязательно, задаёт значение sslkey для указания расположения закрытого ключа]
      [sslrootcert](#sslrootcert): [необязательно, задаёт новый путь к файлу в параметре sslrootcert для изменения расположения файла с корневыми сертификатами]
  
```

</File>

### Конфигурации {#configurations}

#### search_path {#search_path}

Конфигурация `search_path` управляет "путем поиска" Postgres, который dbt настраивает при открытии новых соединений с базой данных. По умолчанию путь поиска Postgres — `"$user, public"`, что означает, что неуточненные имена <Term id="table" /> будут искаться в схеме `public` или в схеме с тем же именем, что и у вошедшего пользователя. **Примечание:** Установка `search_path` на пользовательское значение не является необходимой или рекомендуемой для типичного использования dbt.

#### role {#role}

Конфигурация `role` управляет ролью Postgres, которую dbt принимает при открытии новых соединений с базой данных.

#### sslmode {#sslmode}

Конфигурация `sslmode` управляет тем, как dbt подключается к базам данных Postgres с использованием SSL. См. [документацию Postgres](https://www.postgresql.org/docs/9.1/libpq-ssl.html) о `sslmode` для получения информации о использовании. Если не установлено, dbt будет подключаться к базам данных, используя значение по умолчанию Postgres, `prefer`, в качестве `sslmode`.

#### sslcert {#sslcert}

Параметр `sslcert` задаёт расположение файла сертификата, используемого для подключения к Postgres через клиентское SSL-соединение. Чтобы использовать файл сертификата, расположенный не по стандартному пути, укажите путь к этому файлу в данном параметре. Если этот параметр не задан, dbt использует стандартные пути Postgres. Стандартные пути приведены в разделе [Клиентские сертификаты](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) документации Postgres по SSL.

#### sslkey {#sslkey}

Параметр `sslkey` задаёт расположение закрытого ключа для подключения к Postgres через клиентское SSL-соединение. Если этот параметр не указан, dbt использует стандартное расположение ключа Postgres. Стандартные пути приведены в разделе [Клиентские сертификаты](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) документации Postgres по SSL.

#### sslrootcert {#sslrootcert}

При подключении к серверу Postgres через клиентское SSL-соединение dbt проверяет, что сервер предоставляет SSL-сертификат, подписанный доверенным корневым сертификатом. По умолчанию эти корневые сертификаты находятся в файле `~/.postgresql/root.crt`. Чтобы изменить расположение этого файла, укажите новый путь к файлу в параметре `sslrootcert`.

### `keepalives_idle` {#keepalives_idle}
Если база данных закрывает соединение, пока dbt ожидает данные, может возникнуть ошибка `SSL SYSCALL error: EOF detected`. Уменьшение [значения `keepalives_idle`](https://www.postgresql.org/docs/9.3/libpq-connect.html) может предотвратить эту ошибку, поскольку сервер будет чаще отправлять проверочные пакеты для поддержания соединения. 

[Значение по умолчанию в dbt](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/src/dbt/adapters/postgres/connections.py#L32) равно 0 (используется значение сервера по умолчанию), но можно настроить меньший интервал (например, 120 или 60 секунд), что приведёт к более частому обмену данными по сети.


#### retries {#retries}

Если при открытии нового соединения в `dbt-postgres` возникает операционная ошибка или истекает время ожидания, он повторит попытку не более того количества раз, которое задано параметром `retries`. Значение по умолчанию — 1 повторная попытка. Если задано 2 или более повторных попыток, dbt будет ждать 1 секунду перед каждой повторной попыткой. Если задано 0, dbt не будет выполнять повторные попытки.


### `psycopg2` и `psycopg2-binary` {#psycopg2-vs-psycopg2-binary}

При установке `dbt-postgres` по умолчанию устанавливается `psycopg2-binary`.
При установке `psycopg2-binary` используется предварительно собранная версия `psycopg2`, которая может быть не оптимизирована для вашего компьютера.
Этот вариант идеально подходит для разработки и тестирования, где производительность менее важна, чем скорость и простота установки.
Однако в производственных средах предпочтительнее использовать версию `psycopg2`, собранную из исходного кода для вашей операционной системы и архитектуры. В этом случае скорость и простота установки менее важны, поскольку основное внимание уделяется дальнейшей эксплуатации.


Чтобы использовать `psycopg2`:
1. Установите `dbt-postgres`
2. Удалите `psycopg2-binary`
3. Установите соответствующую версию `psycopg2`

```bash
pip install dbt-postgres
if [[ $(pip show psycopg2-binary) ]]; then
    PSYCOPG2_VERSION=$(pip show psycopg2-binary | grep Version | cut -d " " -f 2)
    pip uninstall -y psycopg2-binary && pip install psycopg2==$PSYCOPG2_VERSION
fi
```


Установка `psycopg2` часто требует зависимостей на уровне ОС.
Эти зависимости могут варьироваться в зависимости от операционных систем и архитектур.

Например, на Ubuntu вам нужно установить `libpq-dev` и `python-dev`:
```bash
sudo apt-get update
sudo apt-get install libpq-dev python-dev
```
тогда как на Mac вам нужно установить `postgresql`:
```bash
brew install postgresql
pip install psycopg2
```
Ваша ОС может иметь свои собственные зависимости в зависимости от вашей конкретной ситуации.

