---
title: "Настройка RisingWave"
id: "risingwave-setup"
description: "Прочитайте это руководство, чтобы узнать, как настроить RisingWave в dbt."
meta:
  maintained_by: RisingWave
  pypi_package: 'dbt-risingwave'
  authors: 'Дилан Чен'
  github_repo: 'risingwavelabs/dbt-risingwave'
  min_core_version: 'v1.6.1'
  min_supported_version: ''
  cloud_support: Не поддерживается
  slack_channel_name: 'N/A'
  slack_channel_link: 'https://www.risingwave.com/slack'
  platform_name: 'RisingWave'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Поддерживаемый поставщиком плагин

Некоторые основные функции могут различаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете ознакомиться с указанным репозиторием и открыть проблему.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к RisingWave с помощью dbt-risingwave

Перед подключением к RisingWave убедитесь, что RisingWave установлен и запущен. Для получения дополнительной информации о том, как запустить RisingWave, смотрите [руководство по быстрому старту RisingWave](https://docs.risingwave.com/get-started/quickstart).

Чтобы подключиться к RisingWave с помощью dbt, вам нужно добавить профиль RisingWave в файл профиля dbt (`~/.dbt/profiles.yml`). Ниже приведен пример профиля RisingWave. При необходимости измените значения полей.

<File name='~/.dbt/profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: risingwave
      host: [имя хоста] 
      user: [имя пользователя]
      pass: [пароль]
      dbname: [имя базы данных]
      port: [порт]
      schema: [схема dbt]
  target: dev
```

</File>

|Поле|Описание|
|---|---|
|`host`| Имя хоста или IP-адрес экземпляра RisingWave|
|`user`|Имя пользователя базы данных RisingWave, которое вы хотите использовать|
|`pass`| Пароль пользователя базы данных|
|`dbname` | Имя базы данных RisingWave|
|`port` | Номер порта, на котором слушает RisingWave|
|`schema`| Схема базы данных RisingWave|

Чтобы протестировать подключение к RisingWave, выполните:

```bash
dbt debug
```

## Материализации

Модели dbt для управления преобразованиями данных в RisingWave аналогичны типичным SQL моделям dbt. В адаптере `dbt-risingwave` мы настроили некоторые материализации, чтобы они соответствовали модели обработки потоковых данных RisingWave.

|Материализации| Поддерживается|Примечания|
|----|----|----|
|`table` |Да |Создает [таблицу](https://docs.risingwave.com/sql/commands/sql-create-table). Чтобы использовать эту материализацию, добавьте `{{ config(materialized='table') }}` в ваши SQL файлы модели. |
|`view`|Да | Создает [представление](https://docs.risingwave.com/sql/commands/sql-create-view). Чтобы использовать эту материализацию, добавьте `{{ config(materialized='view') }}` в ваши SQL файлы модели. |
|`ephemeral`|Да| Эта материализация использует [общие таблицы выражений](https://docs.risingwave.com/sql/query-syntax/with-clause) в RisingWave под капотом. Чтобы использовать эту материализацию, добавьте `{{ config(materialized='ephemeral') }}` в ваши SQL файлы модели.|
|`materializedview`| Будет устаревать. |Доступно только для обратной совместимости (для v1.5.1 плагина адаптера dbt-risingwave). Если вы используете версии v1.6.0 и более поздние версии плагина адаптера dbt-risingwave, используйте `materialized_view` вместо этого.|
|`materialized_view`| Да| Создает [материализованное представление](https://docs.risingwave.com/sql/commands/sql-create-mv). Эта материализация соответствует `incremental` в dbt. Чтобы использовать эту материализацию, добавьте `{{ config(materialized='materialized_view') }}` в ваши SQL файлы модели.|
| `incremental`|Нет|Пожалуйста, используйте `materialized_view` вместо этого. Поскольку RisingWave предназначен для использования материализованного представления для управления преобразованием данных инкрементально, вы можете просто использовать материализацию `materialized_view`.|
|`source`| Да| Создает [источник](https://docs.risingwave.com/sql/commands/sql-create-source). Чтобы использовать эту материализацию, добавьте \{\{ config(materialized='source') \}\} в ваши SQL файлы модели. Вам нужно предоставить ваше полное выражение создания источника в этой модели. Смотрите [Примеры файлов моделей](https://docs.risingwave.com/integrations/other/dbt#example-model-files) для получения подробной информации.|
|`table_with_connector`| Да| Создает таблицу с настройками соединителя. В RisingWave таблица с настройками соединителя аналогична источнику. Разница в том, что объект таблицы с настройками соединителя сохраняет необработанные потоковые данные в источнике, в то время как объект источника этого не делает. Чтобы использовать эту материализацию, добавьте `{{ config(materialized='table_with_connector') }}` в ваши SQL файлы модели. Вам нужно предоставить ваше полное выражение создания таблицы с настройками соединителя в этой модели (см. [Примеры файлов моделей](https://docs.risingwave.com/integrations/other/dbt#example-model-files) для получения подробной информации). Поскольку таблицы dbt имеют свою собственную семантику, RisingWave использует `table_with_connector` для отличия от таблицы dbt.|
|`sink`| Да| Создает [синк](https://docs.risingwave.com/sql/commands/sql-create-sink). Чтобы использовать эту материализацию, добавьте `{{ config(materialized='sink') }}` в ваши SQL файлы. Вам нужно предоставить ваше полное выражение создания синка в этой модели. Смотрите [Примеры файлов моделей](https://docs.risingwave.com/integrations/other/dbt#example-model-files) для получения подробной информации.|

## Ресурсы

- [Руководство RisingWave о использовании dbt для преобразования данных](https://docs.risingwave.com/integrations/other/dbt)
- [Демо-проект, использующий dbt для управления запросами бенчмарка Nexmark в RisingWave](https://github.com/risingwavelabs/dbt_rw_nexmark)