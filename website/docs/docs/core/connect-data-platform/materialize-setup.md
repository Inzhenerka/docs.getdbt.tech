---
title: "Настройка Materialize"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Materialize в dbt."
id: "materialize-setup"
meta:
  maintained_by: Materialize  Inc.
  pypi_package: 'dbt-materialize'
  authors: 'Materialize team'
  github_repo: 'MaterializeInc/materialize'
  min_core_version: 'v0.18.1'
  min_supported_version: 'v0.28.0'
  cloud_support: Not Supported
  slack_channel_name: '#db-materialize'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWAH41A5'
  platform_name: 'Materialize'
  config_page: '/reference/resource-configs/materialize-configs'
---

:::info Плагин, поддерживаемый поставщиком

Некоторая основная функциональность может отличаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете посетить связанный репозиторий и открыть задачу.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Materialize {#connecting-to-materialize}

После того как вы создали [аккаунт Materialize](https://materialize.com/register/), адаптируйте ваш `profiles.yml` для подключения к вашей инстанции, используя следующую конфигурацию профиля:

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
      keepalives_idle: 0 # по умолчанию: 0, что означает системное значение по умолчанию
      connect_timeout: 10 # по умолчанию: 10 секунд
      retries: 1 # по умолчанию: 1, повтор при ошибке/тайм-ауте при открытии соединений
```

</File>

### Конфигурации {#configurations}

`cluster`: По умолчанию используется [кластер](https://materialize.com/docs/overview/key-concepts/#clusters) для поддержания материализованных представлений или индексов. [`default` кластер](https://materialize.com/docs/sql/show-clusters/#default-cluster) предустановлен в каждой среде, но мы рекомендуем создавать выделенные кластеры для изоляции рабочих нагрузок в вашем проекте dbt (например, `staging` и `data_mart`).

`keepalives_idle`: Количество секунд перед отправкой ping‑сообщения, чтобы поддерживать активное соединение с Materialize. Если вы сталкиваетесь с ошибкой `SSL SYSCALL error: EOF detected`, возможно, стоит уменьшить значение [keepalives_idle](/docs/core/connect-data-platform/postgres-setup#keepalives_idle), чтобы предотвратить закрытие соединения со стороны базы данных.

Чтобы протестировать соединение с Materialize, выполните:

```
dbt debug
```

Если вывод гласит "All checks passed!", вы готовы к работе! Ознакомьтесь с [руководством по dbt и Materialize](https://materialize.com/docs/guides/dbt/), чтобы узнать больше и начать работу.

## Поддерживаемые функции {#supported-features}

### Материализации {#materializations}

Поскольку Materialize оптимизирован для преобразований потоковых данных, а ядро dbt построено вокруг пакетной обработки, адаптер `dbt-materialize` реализует несколько пользовательских типов материализации:

Тип | Поддерживается? | Подробности
-----|----------------|------------
`source` | ДА | Создает [источник](https://materialize.com/docs/sql/create-source/).
`view` | ДА | Создает [представление](https://materialize.com/docs/sql/create-view/#main).
`materializedview` | ДА | Создает [материализованное представление](https://materialize.com/docs/sql/create-materialized-view/#main).
`table` | ДА | Создает [материализованное представление](https://materialize.com/docs/sql/create-materialized-view/#main). (Поддержка реальных таблиц ожидается [#5266](https://github.com/MaterializeInc/materialize/issues/5266))
`sink` | ДА | Создает [синк](https://materialize.com/docs/sql/create-sink/#main).
`ephemeral` | ДА | Выполняет запросы с использованием <Term id="cte">CTE</Term>.
`incremental` | НЕТ | Используйте вместо этого `materializedview` <Term id="materialization" />. Материализованные представления всегда будут возвращать актуальные результаты без ручных или настроенных обновлений. Для получения дополнительной информации ознакомьтесь с [документацией Materialize](https://materialize.com/docs/).

### Индексы {#indexes}

Материализованные представления (`materializedview`), представления (`view`) и источники (`source`) могут иметь список [`индексов`](/reference/resource-configs/materialize-configs#indexes).

### Seeds {#seeds}

Запуск [`dbt seed`](/reference/commands/seed) создаст статическое материализованное <Term id="view" /> из CSV-файла. Вы не сможете добавить или обновить это представление после его создания.

### Тесты {#tests}

Запуск [`dbt test`](/reference/commands/test) с опциональным флагом `--store-failures` или конфигурацией [`store_failures`](/reference/resource-configs/store_failures) создаст материализованное представление для каждого настроенного теста, которое может отслеживать неудачи с течением времени.

## Ресурсы {#resources}

- [Руководство по dbt и Materialize](https://materialize.com/docs/guides/dbt/)