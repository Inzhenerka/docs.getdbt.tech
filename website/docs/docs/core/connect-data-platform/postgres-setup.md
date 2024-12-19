---
title: "Настройка Postgres"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Postgres в dbt."
id: "postgres-setup"
meta:
  maintained_by: dbt Labs
  authors: 'основные разработчики dbt'
  github_repo: 'dbt-labs/dbt-postgres'
  pypi_package: 'dbt-postgres'
  min_core_version: 'v0.4.0'
  cloud_support: Поддерживается
  min_supported_version: 'n/a'
  slack_channel_name: '#db-postgres'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0172G2E273'
  platform_name: 'Postgres'
  config_page: '/reference/resource-configs/postgres-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Конфигурация профиля

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
      threads: [опционально, 1 или более]
      [keepalives_idle](#keepalives_idle): 0 # по умолчанию 0, указывая на системное значение по умолчанию. См. ниже
      connect_timeout: 10 # по умолчанию 10 секунд
      [retries](#retries): 1  # по умолчанию 1 повторная попытка при ошибке/тайм-ауте при открытии соединений
      [search_path](#search_path): [опционально, переопределите значение по умолчанию для postgres search_path]
      [role](#role): [опционально, установите роль, которую dbt предполагает при выполнении запросов]
      [sslmode](#sslmode): [опционально, установите sslmode, используемый для подключения к базе данных]
      [sslcert](#sslcert): [опционально, установите sslcert для управления расположением файла сертификата]
      [sslkey](#sslkey): [опционально, установите sslkey для управления расположением закрытого ключа]
      [sslrootcert](#sslrootcert): [опционально, установите значение конфигурации sslrootcert на новый путь к файлу, чтобы настроить расположение файла, содержащего корневые сертификаты]
  
```

</File>

### Конфигурации

#### search_path

Конфигурация `search_path` управляет "поисковым путем" Postgres, который dbt настраивает при открытии новых соединений с базой данных. По умолчанию поисковый путь Postgres равен `"$user, public"`, что означает, что неквалифицированные <Term id="table" /> имена будут искаться в схеме `public` или в схеме с тем же именем, что и вошедший в систему пользователь. **Примечание:** Установка `search_path` на пользовательское значение не является необходимой или рекомендуемой для типичного использования dbt.

#### role

Конфигурация `role` управляет ролью Postgres, которую dbt предполагает при открытии новых соединений с базой данных.

#### sslmode

Конфигурация `sslmode` управляет тем, как dbt подключается к базам данных Postgres с использованием SSL. См. [документацию Postgres](https://www.postgresql.org/docs/9.1/libpq-ssl.html) по `sslmode` для получения информации о его использовании. Если не установлено, dbt будет подключаться к базам данных, используя значение по умолчанию Postgres, `prefer`, в качестве `sslmode`.

#### sslcert

Конфигурация `sslcert` управляет расположением файла сертификата, используемого для подключения к Postgres при использовании клиентских SSL-соединений. Чтобы использовать файл сертификата, который не находится в расположении по умолчанию, установите этот путь к файлу с помощью этого значения. Если эта конфигурация не установлена, dbt использует расположения по умолчанию Postgres. См. [Клиентские сертификаты](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) в документации Postgres по SSL для получения путей по умолчанию.

#### sslkey

Конфигурация `sslkey` управляет расположением закрытого ключа для подключения к Postgres с использованием клиентских SSL-соединений. Если эта конфигурация опущена, dbt использует расположение ключа по умолчанию для Postgres. См. [Клиентские сертификаты](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) в документации Postgres по SSL для получения расположений по умолчанию.

#### sslrootcert

При подключении к серверу Postgres с использованием клиентского SSL-соединения dbt проверяет, что сервер предоставляет SSL-сертификат, подписанный доверенным корневым сертификатом. Эти корневые сертификаты по умолчанию находятся в файле `~/.postgresql/root.crt`. Чтобы настроить расположение этого файла, установите значение конфигурации `sslrootcert` на новый путь к файлу.

### `keepalives_idle`
Если база данных закрывает соединение, пока dbt ожидает данные, вы можете увидеть ошибку `SSL SYSCALL error: EOF detected`. Понижение значения [`keepalives_idle`](https://www.postgresql.org/docs/9.3/libpq-connect.html) может предотвратить это, поскольку сервер будет чаще отправлять пинг, чтобы поддерживать соединение активным.

[Настройка по умолчанию dbt](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/adapters/postgres/connections.py#L28) равна 0 (значение по умолчанию сервера), но может быть настроена на более низкое значение (возможно, 120 или 60 секунд), за счет более активного сетевого соединения.

#### retries

Если `dbt-postgres` сталкивается с операционной ошибкой или тайм-аутом при открытии нового соединения, он повторит попытку до количества раз, указанного в `retries`. Значение по умолчанию — 1 повторная попытка. Если установлено 2 или более повторных попыток, dbt будет ждать 1 секунду перед повторной попыткой. Если установлено 0, dbt не будет повторять попытки вообще.

### `psycopg2` против `psycopg2-binary`

`psycopg2-binary` устанавливается по умолчанию при установке `dbt-postgres`.
Установка `psycopg2-binary` использует предварительно собранную версию `psycopg2`, которая может не быть оптимизирована для вашего конкретного компьютера.
Это идеально подходит для рабочих процессов разработки и тестирования, где производительность менее важна, а скорость и простота установки имеют большее значение.
Однако производственные среды получат выгоду от версии `psycopg2`, которая собрана из исходного кода для вашей конкретной операционной системы и архитектуры. В этом сценарии скорость и простота установки менее важны, так как основное внимание уделяется текущему использованию.

<VersionBlock firstVersion="1.8">

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

</VersionBlock>

<VersionBlock lastVersion="1.7">

Чтобы убедиться, что ваша установка dbt использует `psycopg2`, добавьте префикс ко всем командам установки `dbt-postgres` с `DBT_PSYCOPG2_NAME=psycopg2`.
Например:
```bash
DBT_PSYCOPG2_NAME=psycopg2 pip install dbt-postgres
```

</VersionBlock>

Установка `psycopg2` часто требует зависимостей на уровне ОС.
Эти зависимости могут различаться в зависимости от операционных систем и архитектур.

Например, на Ubuntu вам нужно установить `libpq-dev` и `python-dev`:
```bash
sudo apt-get update
sudo apt-get install libpq-dev python-dev
```
в то время как на Mac вам нужно установить `postgresql`:
```bash
brew install postgresql
pip install psycopg2
```
Ваша ОС может иметь свои собственные зависимости в зависимости от вашей конкретной ситуации.

<VersionBlock firstVersion="1.8">

#### Ограничения

В версиях 1.8.0 и 1.8.1 `psycopg2-binary` устанавливается на операционных системах MacOS и Windows, а `psycopg2` устанавливается на операционных системах Linux.
Это имеет побочный эффект, требующий вышеуказанных зависимостей ОС для установки `dbt-postgres` на Linux.
Пользователям необходимо будет обновить свои рабочие процессы для установки этих зависимостей или обновиться до версии 1.8.2.

</VersionBlock>