---
title: "Анонимная статистика использования"
id: "usage-stats"
sidebar: "Анонимная статистика использования"
---

dbt Labs стремится создать лучшую версию dbt, и важной частью этого является понимание того, как пользователи работают с dbt. С этой целью мы добавили простое отслеживание событий (или телеметрию) в dbt с использованием Snowplow. Важно отметить, что мы не отслеживаем учетные данные, содержимое моделей или их названия: мы считаем это частной информацией и, честно говоря, это не наше дело.

Собранные данные используются для таких целей, как идентификация отрасли, исследование вариантов использования, улучшение продаж, маркетинга, функций продукта и услуг. Телеметрия позволяет пользователям беспрепятственно вносить вклад в непрерывное улучшение dbt, что позволяет нам лучше обслуживать сообщество данных.

Статистика использования отправляется, когда dbt вызывается и когда запускаются модели. Эти события содержат основную информацию о платформе (ОС + версия Python) и метаданные, такие как:
- Успешность вызова.
- Время выполнения.
- Анонимизированный хеш-ключ, представляющий содержимое модели.
- Количество узлов, которые были запущены.

<VersionBlock lastVersion="1.99">

## Телеметрия <Constant name="core" />

В <Constant name="core" /> телеметрия включена по умолчанию. Для полной прозрачности все определения событий доступны в файле [`tracking.py`](https://github.com/dbt-labs/dbt/blob/1.latest/core/dbt/tracking.py).

You can opt out of event tracking at any time by adding the following configuration to your `dbt_project.yml` file:

<File name="dbt_project.yml">

```yaml
flags:
  send_anonymous_usage_stats: false
```

</File>

Вы также можете задать переменную окружения `DO_NOT_TRACK`. Дополнительную информацию см. в разделе [Переменные окружения](/docs/build/environment-variables).

`DO_NOT_TRACK=1` эквивалентно <VersionBlock lastVersion="1.10">`DBT_SEND_ANONYMOUS_USAGE_STATS=False`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_SEND_ANONYMOUS_USAGE_STATS=False`</VersionBlock>.

</VersionBlock>

<VersionBlock firstVersion="2.0">

## Телеметрия <Constant name="fusion_engine" />

В <Constant name="fusion" /> телеметрия включена по умолчанию. Для полной прозрачности определения событий доступны в файле [`event_functions.rs`](https://github.com/dbt-labs/dbt/blob/main/crates/vortex-events/src/event_functions.rs).

Для работы телеметрии требуется исходящий доступ по HTTPS к `https://p.vx.dbt.com`. Если этот адрес недоступен, <Constant name="fusion" /> записывает ошибки в журнал при каждом запуске. Полный список адресов для исходящих подключений см. в разделе [Сетевые требования dbt v2](/docs/local/dbt-networking-requirements).

Чтобы отключить сбор анонимной статистики использования, задайте следующую переменную окружения:

```shell
export DBT_ENGINE_SEND_ANONYMOUS_USAGE_STATS=false
```

Вы также можете задать `DO_NOT_TRACK=1`.

</VersionBlock>
