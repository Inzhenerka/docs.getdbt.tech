---
title: "Настройка RisingWave"
id: "risingwave-setup"
description: "Прочтите это руководство, чтобы узнать, как настроить RisingWave в dbt."
meta:
  maintained_by: RisingWave
  pypi_package: 'dbt-risingwave'
  authors: 'Dylan Chen'
  github_repo: 'risingwavelabs/dbt-risingwave'
  min_core_version: 'v1.6.1'
  min_supported_version: ''
  cloud_support: Не поддерживается
  slack_channel_name: 'N/A'
  slack_channel_link: 'https://www.risingwave.com/slack'
  platform_name: 'RisingWave'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Плагин, поддерживаемый поставщиком

Некоторые основные функции могут отличаться. Если вы хотите сообщить об ошибке, запросить функцию или внести вклад, вы можете посетить связанный репозиторий и открыть задачу.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к RisingWave с помощью dbt-risingwave {#connecting-to-risingwave-with-dbt-risingwave}

Перед подключением к RisingWave убедитесь, что RisingWave установлен и запущен. Для получения дополнительной информации о том, как запустить RisingWave, см. [Руководство по быстрому старту RisingWave](https://docs.risingwave.com/get-started/quickstart).

Чтобы подключиться к RisingWave с помощью dbt, вам нужно добавить профиль RisingWave в файл профилей dbt (`~/.dbt/profiles.yml`). Ниже приведен пример профиля RisingWave. При необходимости измените значения полей.

<File name='~/.dbt/profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: risingwave
      host: [host name] 
      user: [user name]
      pass: [password]
      dbname: [database name]
      port: [port]
      schema: [dbt schema]
  target: dev
```

</File>

|Поле|Описание|
|---|---|
|`host`| Имя хоста или IP-адрес экземпляра RisingWave|
|`user`|Пользователь базы данных RisingWave, которого вы хотите использовать|
|`pass`| Пароль пользователя базы данных|
|`dbname` | Имя базы данных RisingWave|
|`port` | Номер порта, на котором RisingWave прослушивает|
|`schema`| Схема базы данных RisingWave|

Чтобы протестировать подключение к RisingWave, выполните:

```bash
dbt debug
```

## Материализации {#materializations}

Модели dbt для управления преобразованиями данных в RisingWave аналогичны типичным SQL-моделям dbt. В адаптере `dbt-risingwave` мы настроили некоторые материализации, чтобы они соответствовали модели обработки потоковых данных RisingWave.

|Материализации| Поддерживается|Примечания|
|----|----|----|
|`table` |Да |Создает [таблицу](https://docs.risingwave.com/sql/commands/sql-create-table). Чтобы использовать эту материализацию, добавьте `{{ config(materialized='table') }}` в ваши SQL-файлы модели. |
|`view`|Да | Создает [представление](https://docs.risingwave.com/sql/commands/sql-create-view). Чтобы использовать эту материализацию, добавьте `{{ config(materialized='view') }}` в ваши SQL-файлы модели. |
|`ephemeral`|Да| Эта материализация использует [общие табличные выражения](https://docs.risingwave.com/sql/query-syntax/with-clause) в RisingWave. Чтобы использовать эту материализацию, добавьте `{{ config(materialized='ephemeral') }}` в ваши SQL-файлы модели.|
|`materializedview`| Будет устаревать. |Доступно только для обеспечения обратной совместимости (для версии v1.5.1 плагина адаптера dbt-risingwave). Если вы используете версии v1.6.0 и выше плагина адаптера dbt-risingwave, используйте `materialized_view`.|
|`materialized_view`| Да| Создает [материализованное представление](https://docs.risingwave.com/sql/commands/sql-create-mv). Эта материализация соответствует `incremental` в dbt. Чтобы использовать эту материализацию, добавьте `{{ config(materialized='materialized_view') }}` в ваши SQL-файлы модели.|
| `incremental`|Нет|Пожалуйста, используйте `materialized_view`. Поскольку RisingWave предназначен для использования материализованного представления для управления преобразованием данных инкрементным способом, вы можете просто использовать материализацию `materialized_view`.|
|`source`| Да| Создает [источник](https://docs.risingwave.com/sql/commands/sql-create-source). Чтобы использовать эту материализацию, добавьте \{\{ config(materialized='source') \}\} в ваши SQL-файлы модели. Вам нужно предоставить ваше полное заявление о создании источника в этой модели. См. [Примеры файлов моделей](https://docs.risingwave.com/integrations/other/dbt#example-model-files) для деталей.|
|`table_with_connector`| Да| Создает таблицу с настройками коннектора. В RisingWave таблица с настройками коннектора аналогична источнику. Разница в том, что объект таблицы с настройками коннектора сохраняет необработанные потоковые данные в источнике, тогда как объект источника этого не делает. Чтобы использовать эту материализацию, добавьте `{{ config(materialized='table_with_connector') }}` в ваши SQL-файлы модели. Вам нужно предоставить ваше полное заявление о создании таблицы с коннектором в этой модели (см. [Примеры файлов моделей](https://docs.risingwave.com/integrations/other/dbt#example-model-files) для деталей). Поскольку таблицы dbt имеют свои собственные семантики, RisingWave использует `table_with_connector`, чтобы отличаться от таблицы dbt.|
|`sink`| Да| Создает [приемник](https://docs.risingwave.com/sql/commands/sql-create-sink). Чтобы использовать эту материализацию, добавьте `{{ config(materialized='sink') }}` в ваши SQL-файлы. Вам нужно предоставить ваше полное заявление о создании приемника в этой модели. См. [Примеры файлов моделей](https://docs.risingwave.com/integrations/other/dbt#example-model-files) для деталей.|

## Ресурсы {#resources}

- [Руководство RisingWave по использованию dbt для преобразований данных](https://docs.risingwave.com/integrations/other/dbt)
- [Демонстрационный проект, использующий dbt для управления запросами Nexmark benchmark в RisingWave](https://github.com/risingwavelabs/dbt_rw_nexmark)