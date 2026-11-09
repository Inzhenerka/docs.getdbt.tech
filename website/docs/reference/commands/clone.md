---
title: "О команде dbt clone"
sidebar_label: "clone"
id: "clone"
---

Команда `dbt clone` клонирует выбранные ноды из [указанного состояния](/reference/node-selection/methods#state) в целевые схемы. Эта команда использует материализацию `clone`:
- Если ваша платформа данных поддерживает zero-copy клонирование таблиц (Snowflake, Databricks или BigQuery), и модель существует как таблица в исходном окружении, dbt создаст её в целевом окружении как клон.
- В противном случае dbt создаст простое представление-указатель (`select * from` исходного объекта).
- По умолчанию `dbt clone` не пересоздаёт уже существующие relation’ы в текущем target. Чтобы изменить это поведение, используйте флаг `--full-refresh`.
- Вы можете указать большее количество [threads](/docs/running-a-dbt-project/using-threads), чтобы сократить время выполнения, поскольку отдельные операции клонирования не зависят друг от друга.

Команда `clone` полезна для:
- непрерывного развертывания по схеме blue/green (в хранилищах данных, поддерживающих клонирование таблиц без копирования данных)
- клонирования текущего состояния среды production в схемы разработки
- работы с инкрементальными моделями в заданиях CI <Constant name="dbt" /> (в хранилищах данных, поддерживающих клонирование таблиц без копирования данных)
- тестирования изменений кода на зависимых объектах в вашем BI-инструменте


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

### Когда использовать `dbt clone` вместо [deferral](/reference/node-selection/defer)? {#when-to-use-dbt-clone-instead-of-deferral}

В отличие от deferral, `dbt clone` требует некоторого объёма вычислений и создания дополнительных объектов в вашем хранилище данных. Во многих случаях deferral является более дешёвой и простой альтернативой `dbt clone`. Однако `dbt clone` покрывает дополнительные сценарии использования, где deferral может быть невозможен.

Например, за счёт создания реальных объектов в хранилище данных, `dbt clone` позволяет тестировать изменения кода на downstream-зависимостях _вне dbt_ (например, в BI-инструменте).

В качестве другого примера вы можете выполнить `clone` для изменённых инкрементальных моделей на первом шаге CI-задания <Constant name="dbt" />, чтобы избежать ресурсоёмких сборок с `full-refresh` в хранилищах данных, поддерживающих клонирование без копирования.

## Клонирование в dbt {#cloning-in-dbt}

Вы можете клонировать узлы между состояниями в <Constant name="dbt" /> с помощью команды `dbt clone`. Она доступна в [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) и [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) и использует функцию [`--defer`](/reference/node-selection/defer). Подробнее о defer в <Constant name="dbt" /> читайте в разделе [Использование defer в <Constant name="dbt" />](/docs/platform/about-defer).

- **Использование <Constant name="platform_cli" />** &mdash; Команда `dbt clone` в <Constant name="platform_cli" /> автоматически включает флаг `--defer`. Это означает, что вы можете использовать команду `dbt clone` без дополнительной настройки.

- **Использование <Constant name="studio_ide" />** &mdash; Чтобы использовать команду `dbt clone` в <Constant name="studio_ide" />, выполните следующие действия перед её запуском:

  - Настройте **производственную среду (Production environment)** и убедитесь, что задание успешно выполнено.
  - Включите **Defer to production**, активировав переключатель в правом нижнем углу панели команд.
    <Lightbox src="/img/docs/dbt-platform/defer-toggle.png" width="80%" title="Активируйте переключатель 'Defer to production' в правом нижнем углу панели команд, чтобы включить defer в Studio IDE."/>
  - Выполните команду `dbt clone` на панели команд.
  
  
Ознакомьтесь с [этим постом в Developer blog](/blog/to-defer-or-to-clone), чтобы узнать больше о лучших практиках и о том, когда стоит использовать `dbt clone` по сравнению с deferral.
