---
title: "О команде dbt clone"
sidebar_label: "clone"
id: "clone"
---

Команда `dbt clone` клонирует выбранные ноды из [указанного состояния](/reference/node-selection/syntax#establishing-state) в целевые схемы. Эта команда использует материализацию `clone`:
- Если ваша платформа данных поддерживает zero-copy клонирование таблиц (Snowflake, Databricks или BigQuery), и модель существует как таблица в исходном окружении, dbt создаст её в целевом окружении как клон.
- В противном случае dbt создаст простое представление-указатель (`select * from` исходного объекта).
- По умолчанию `dbt clone` не пересоздаёт уже существующие relation’ы в текущем target. Чтобы изменить это поведение, используйте флаг `--full-refresh`.
- Вы можете указать большее количество [threads](/docs/running-a-dbt-project/using-threads), чтобы сократить время выполнения, поскольку отдельные операции клонирования не зависят друг от друга.

Команда `clone` полезна для:
- blue/green непрерывного деплоя (на хранилищах данных, которые поддерживают zero-copy клонирование таблиц)
- клонирования текущего production-состояния в development-схемы
- работы с инкрементальными моделями в CI-задачах <Constant name="cloud" /> (на хранилищах данных, которые поддерживают zero-copy клонирование таблиц)
- тестирования изменений кода на downstream-зависимостях в вашем BI-инструменте


```bash
# clone all of my models from specified state to my target schema(s)
dbt clone --state path/to/artifacts

# clone one_specific_model of my models from specified state to my target schema(s)
dbt clone --select "one_specific_model" --state path/to/artifacts

# clone all of my models from specified state to my target schema(s) and recreate all pre-existing relations in the current target
dbt clone --state path/to/artifacts --full-refresh

# clone all of my models from specified state to my target schema(s), running up to 50 clone statements in parallel
dbt clone --state path/to/artifacts --threads 50
```

### Когда использовать `dbt clone` вместо [deferral](/reference/node-selection/defer)?

В отличие от deferral, `dbt clone` требует некоторого объёма вычислений и создания дополнительных объектов в вашем хранилище данных. Во многих случаях deferral является более дешёвой и простой альтернативой `dbt clone`. Однако `dbt clone` покрывает дополнительные сценарии использования, где deferral может быть невозможен.

Например, за счёт создания реальных объектов в хранилище данных, `dbt clone` позволяет тестировать изменения кода на downstream-зависимостях _вне dbt_ (например, в BI-инструменте).

В качестве другого примера, вы можете выполнить `clone` изменённых инкрементальных моделей как первый шаг CI-задачи в <Constant name="cloud" />, чтобы избежать дорогостоящих `full-refresh` сборок для хранилищ, поддерживающих zero-copy клонирование.

## Клонирование в dbt

Вы можете клонировать ноды между состояниями в <Constant name="cloud" /> с помощью команды `dbt clone`. Она доступна в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) и [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) и опирается на функциональность [`--defer`](/reference/node-selection/defer). Подробнее о defer в <Constant name="cloud" /> читайте в разделе [Using defer in <Constant name="cloud" />](/docs/cloud/about-cloud-develop-defer).

- **Использование <Constant name="cloud_cli" />** &mdash; Команда `dbt clone` в <Constant name="cloud_cli" /> автоматически включает флаг `--defer`. Это означает, что вы можете использовать команду `dbt clone` без какой-либо дополнительной настройки.

- **Использование <Constant name="cloud_ide" />** &mdash; Чтобы использовать команду `dbt clone` в <Constant name="cloud_ide" />, выполните следующие шаги перед запуском `dbt clone`:

  - Настройте **Production environment** и убедитесь, что есть успешно выполненный job.
  - Включите **Defer to production**, переключив тумблер в правом нижнем углу командной панели.
    <Lightbox src="/img/docs/dbt-cloud/defer-toggle.png" width="80%" title="Выберите переключатель «Defer to production» в правом нижнем углу командной панели, чтобы включить defer в Studio IDE."/>
  - Запустите команду `dbt clone` из командной панели.
  
  
Ознакомьтесь с [этим постом в Developer blog](/blog/to-defer-or-to-clone), чтобы узнать больше о лучших практиках и о том, когда стоит использовать `dbt clone` по сравнению с deferral.
