---
title: "Настройка Postgres"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Postgres в dbt."
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
      threads: [optional, 1 или более]
      [keepalives_idle](#keepalives_idle): 0 # по умолчанию 0, что означает системное значение по умолчанию. См. ниже
      connect_timeout: 10 # по умолчанию 10 секунд
      [retries](#retries): 1  # по умолчанию 1 повтор при ошибке/тайм-ауте при открытии соединений
      [search_path](#search_path): [optional, переопределить путь поиска postgres по умолчанию]
      [role](#role): [optional, установить роль, которую dbt принимает при выполнении запросов]
      [sslmode](#sslmode): [optional, установить sslmode, используемый для подключения к базе данных]
      [sslcert](#sslcert): [optional, установить sslcert для управления местоположением файла сертификата]
      [sslkey](#sslkey): [optional, установить sslkey для управления местоположением закрытого ключа]
      [sslrootcert](#sslrootcert): [optional, установить значение конфигурации sslrootcert на новый путь к файлу, чтобы настроить местоположение файла, содержащего корневые сертификаты]
  
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

Конфигурация `sslcert` управляет местоположением файла сертификата, используемого для подключения к Postgres при использовании клиентских SSL-соединений. Чтобы использовать файл сертификата, который не находится в местоположении по умолчанию, установите путь к этому файлу, используя это значение. Без этой конфигурации dbt использует местоположения по умолчанию Postgres. См. [Клиентские сертификаты](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) в документации Postgres SSL для путей по умолчанию.

#### sslkey {#sslkey}

Конфигурация `sslkey` управляет местоположением закрытого ключа для подключения к Postgres с использованием клиентских SSL-соединений. Если эта конфигурация не указана, dbt использует местоположение ключа по умолчанию для Postgres. См. [Клиентские сертификаты](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) в документации Postgres SSL для местоположений по умолчанию.

#### sslrootcert {#sslrootcert}

При подключении к серверу Postgres с использованием клиентского SSL-соединения dbt проверяет, что сервер предоставляет SSL-сертификат, подписанный доверенным корневым сертификатом. Эти корневые сертификаты по умолчанию находятся в файле `~/.postgresql/root.crt`. Чтобы настроить местоположение этого файла, установите значение конфигурации `sslrootcert` на новый путь к файлу.

### `keepalives_idle` {#keepalives_idle}
Если база данных закрывает соединение, пока dbt ожидает данные, вы можете увидеть ошибку `SSL SYSCALL error: EOF detected`. Уменьшение значения [`keepalives_idle`](https://www.postgresql.org/docs/9.3/libpq-connect.html) может предотвратить это, так как сервер будет чаще отправлять пинг, чтобы поддерживать активное соединение.

[Настройка по умолчанию в dbt](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/adapters/postgres/connections.py#L28) — 0 (значение по умолчанию для сервера), но может быть настроена на более низкое значение (возможно, 120 или 60 секунд), за счет более частого сетевого обмена.

#### retries {#retries}

Если `dbt-postgres` сталкивается с операционной ошибкой или тайм-аутом при открытии нового соединения, он будет повторять попытку до количества раз, указанного в `retries`. Значение по умолчанию — 1 повтор. Если установлено 2+ повторов, dbt будет ждать 1 секунду перед повторной попыткой. Если установлено 0, dbt не будет повторять попытки вообще.

### `psycopg2` vs `psycopg2-binary` {#psycopg2-vs-psycopg2-binary}

`psycopg2-binary` устанавливается по умолчанию при установке `dbt-postgres`.

При установке `psycopg2-binary` используется предварительно собранная версия `psycopg2`, которая может быть не оптимизирована под конкретную машину.

Это идеально подходит для процессов разработки и тестирования, где производительность менее критична, а скорость и простота установки важнее.

Однако для production‑окружений будет полезнее версия `psycopg2`, собранная из исходного кода под конкретную операционную систему и архитектуру. В таком сценарии скорость и простота установки отходят на второй план, поскольку основной фокус делается на длительной и стабильной эксплуатации.


Чтобы использовать `psycopg2`:
1. Установите `dbt-postgres`
2. Удалите `psycopg2-binary`
3. Установите эквивалентную версию `psycopg2`

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


