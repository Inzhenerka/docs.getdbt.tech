---
title: "Настройка Materialize"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Materialize в dbt."
id: "materialize-setup"
meta:
  maintained_by: Materialize Inc.
  pypi_package: 'dbt-materialize'
  authors: 'Команда Materialize'
  github_repo: 'MaterializeInc/materialize'
  min_core_version: 'v0.18.1'
  min_supported_version: 'v0.28.0'
  cloud_support: Не поддерживается
  slack_channel_name: '#db-materialize'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWAH41A5'
  platform_name: 'Materialize'
  config_page: '/reference/resource-configs/materialize-configs'
---

:::info Плагин с поддержкой поставщика

Некоторые основные функции могут различаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете ознакомиться с указанным репозиторием и открыть проблему.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Materialize

После того как вы настроили [аккаунт Materialize](https://materialize.com/register/), адаптируйте ваш `profiles.yml` для подключения к вашему экземпляру, используя следующую конфигурацию профиля:

<File name='~/.dbt/profiles.yml'>

```yaml
materialize:
  target: dev
  outputs:
    dev:
      type: materialize
      host: [host]
      port: [port]
      user: [user@domain.com]
      pass: [password]
      dbname: [database]
      cluster: [cluster] # по умолчанию 'default'
      schema: [dbt schema]
      sslmode: require
      keepalives_idle: 0 # по умолчанию: 0, указывая на системный по умолчанию
      connect_timeout: 10 # по умолчанию: 10 секунд
      retries: 1 # по умолчанию: 1, повторная попытка в случае ошибки/таймаута при открытии соединений
```

</File>

### Конфигурации

`cluster`: По умолчанию используется [кластер](https://materialize.com/docs/overview/key-concepts/#clusters) для поддержания материализованных представлений или индексов. [`default` кластер](https://materialize.com/docs/sql/show-clusters/#default-cluster) предустановлен в каждой среде, но мы рекомендуем создавать выделенные кластеры для изоляции рабочих нагрузок в вашем проекте dbt (например, `staging` и `data_mart`).

`keepalives_idle`: Количество секунд перед отправкой пинга для поддержания активного соединения с Materialize. Если вы сталкиваетесь с ошибкой `SSL SYSCALL error: EOF detected`, возможно, вам стоит уменьшить значение [keepalives_idle](https://docs.getdbt.com/reference/warehouse-setups/postgres-setup#keepalives_idle), чтобы предотвратить закрытие соединения базой данных.

Чтобы протестировать соединение с Materialize, выполните:

```
dbt debug
```

Если вывод будет "Все проверки пройдены!", значит, все в порядке! Ознакомьтесь с [руководством по dbt и Materialize](https://materialize.com/docs/guides/dbt/), чтобы узнать больше и начать работу.

## Поддерживаемые функции

### Материализации

Поскольку Materialize оптимизирован для трансформаций на потоковых данных, а основа dbt построена вокруг пакетной обработки, адаптер `dbt-materialize` реализует несколько пользовательских типов материализации:

Тип | Поддерживается? | Подробности
-----|----------------|----------------
`source` | ДА | Создает [source](https://materialize.com/docs/sql/create-source/).
`view` | ДА | Создает [view](https://materialize.com/docs/sql/create-view/#main).
`materializedview` | ДА | Создает [материализованное представление](https://materialize.com/docs/sql/create-materialized-view/#main).
`table` | ДА | Создает [материализованное представление](https://materialize.com/docs/sql/create-materialized-view/#main). (Поддержка фактических таблиц ожидается [#5266](https://github.com/MaterializeInc/materialize/issues/5266))
`sink` | ДА | Создает [sink](https://materialize.com/docs/sql/create-sink/#main).
`ephemeral` | ДА | Выполняет запросы с использованием <Term id="cte">CTE</Term>.
`incremental` | НЕТ | Вместо этого используйте <Term id="materialization" /> `materializedview`. Материализованные представления всегда будут возвращать актуальные результаты без ручных или настроенных обновлений. Для получения дополнительной информации ознакомьтесь с [документацией Materialize](https://materialize.com/docs/).

### Индексы

Материализованные представления (`materializedview`), представления (`view`) и источники (`source`) могут иметь список [`indexes`](/reference/resource-configs/materialize-configs#indexes), определенных для них.

### Seeds

Запуск [`dbt seed`](/reference/commands/seed) создаст статическое материализованное <Term id="view" /> из CSV-файла. Вы не сможете добавлять или обновлять это представление после его создания.

### Тесты

Запуск [`dbt test`](/reference/commands/test) с необязательным флагом `--store-failures` или конфигурацией [`store_failures`](/reference/resource-configs/store_failures) создаст материализованное представление для каждого настроенного теста, которое может отслеживать сбои с течением времени.

## Ресурсы

- [Руководство по dbt и Materialize](https://materialize.com/docs/guides/dbt/)