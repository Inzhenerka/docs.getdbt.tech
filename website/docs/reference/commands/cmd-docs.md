---
title: "О командах dbt docs"
description: "Генерация и запуск документации для вашего dbt‑проекта."
sidebar_label: "docs"
id: "cmd-docs"
---

<VersionBlock lastVersion="1.99">

`dbt docs` поддерживает две подкоманды: `generate` и `serve`.

:::tip Для пользователей <Constant name="fusion_engine" />
При использовании <Constant name="fusion_engine" /> создавайте метаданные документации, выполняя команду `dbt build --write-catalog`. При запуске только `dbt build` метаданные по умолчанию не создаются. Чтобы просмотреть их в <Constant name="catalog" />, запустите задание в <Constant name="dbt_platform" /> для загрузки метаданных, затем откройте [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs).
:::

### dbt docs generate {#dbt-docs-generate}

`dbt docs generate` создаёт сайт документации вашего проекта, выполняя следующие действия:

1. Копирует файл сайта `index.html` в каталог `target/`.
2. Компилирует ресурсы вашего проекта, чтобы их `compiled_code` был включён в [`manifest.json`](/reference/artifacts/manifest-json).
3. Выполняет запросы к метаданным базы данных для создания файла [`catalog.json`](/reference/artifacts/catalog-json), который содержит метаданные о таблицах и <Term id="view">представлениях</Term>, создаваемых моделями вашего проекта.

**Пример**:

```shell
dbt docs generate
```

При указании `--select` dbt включает в `catalog.json` только выбранные узлы. dbt ограничивает шаг (3) выбранными узлами и исключает все остальные. Шаг (2) остаётся без изменений.

**Пример**:

```shell
dbt docs generate --select +orders
```

:::info Поведение запроса к каталогу для больших проектов

Если выбрано менее 100 узлов, dbt фильтрует запрос к каталогу на уровне базы данных с помощью условия `WHERE` по именам конкретных отношений, что обеспечивает более высокую производительность. Если выбрано 100 или более узлов, dbt запрашивает все отношения в соответствующих схемах, а затем фильтрует результаты в памяти.

В обоих случаях содержимое `catalog.json` дополнительно фильтруется, чтобы включать только выбранные узлы (модели, источники и другие ресурсы).

:::

При указании `--no-compile` команда `dbt docs generate` пропускает шаг (2), описанный выше. Обратите внимание, что dbt по-прежнему выполняет некоторые специальные макросы (например, `generate_schema_name`) [во время разбора](/reference/global-configs/parsing), даже если компиляция пропущена.

**Пример**:

```shell
dbt docs generate --no-compile
```

При указании `--empty-catalog` команда `dbt docs generate` пропускает шаг (3), описанный выше.

Это не рекомендуется для производственных сред: ваша документация не будет содержать метаданные хранилища, такие как полный набор столбцов в каждой таблице и статистика по этим таблицам. Это может ускорить выполнение `docs generate` в среде разработки, когда вам нужно лишь визуализировать происхождение данных и другую информацию, определённую в вашем проекте. О том, как создать документацию в <Constant name="dbt" />, см. [Создание и просмотр документации в dbt](/docs/explore/build-and-view-your-docs).

Зато это может ускорить выполнение команды `docs generate` в процессе разработки, когда вам нужно лишь визуализировать lineage и другую информацию, определённую внутри вашего проекта.  

Как собрать документацию в <Constant name="cloud" />, описано в разделе [Сборка и просмотр документации](/docs/explore/build-and-view-your-docs).

**Пример**:

```shell
dbt docs generate --empty-catalog
```

Используйте флаг `--static`, чтобы сгенерировать документацию в виде статической страницы для размещения в облачном хранилище. dbt встраивает `catalog.json` и `manifest.json` в `index.html`, создавая единую страницу, которой можно поделиться по электронной почте или через приложения для обмена файлами.

```shell
dbt docs generate --static
```

### dbt docs serve {#dbt-docs-serve}

`dbt docs serve` запускает веб-сервер на порту 8080 для локального просмотра документации и открывает сайт документации в браузере по умолчанию. Корневым каталогом веб-сервера служит ваш каталог `target/`. Выполните `dbt docs generate` перед `dbt docs serve`, поскольку команда `generate` создаёт [артефакт метаданных каталога](/reference/artifacts/catalog-json), необходимый для работы команды `serve`. Если каталог отсутствует, вы увидите сообщение об ошибке.

Используйте `dbt docs serve`, если вы ведёте локальную разработку с помощью [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) или [<Constant name="core" />](/docs/local/install-dbt). Среда [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) не поддерживает эту команду.

**Использование:**

<VersionBlock lastVersion="1.8.1">
```shell
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>
<VersionBlock firstVersion="1.8.2">
```shell
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--host HOST]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>

Вы можете указать другой порт, используя флаг `--port`.

**Пример**:

```shell
dbt docs serve --port 8001
```

<VersionBlock firstVersion="1.8.2">

Вы можете указать другой хост, используя флаг `--host`.

:::info Примечание
Флаг `--host` доступен только в [<Constant name="core"/>](/docs/local/install-dbt). Он не поддерживается в [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation).
:::

**Пример**:

```shell
dbt docs serve --host ""
```

Начиная с версии 1.8.1, хост по умолчанию — `127.0.0.1`. Для версий 1.8.0 и ранее хост по умолчанию был `""`.
</VersionBlock>

</VersionBlock>

<VersionBlock firstVersion="2.0">

С <Constant name="fusion_engine" /> используйте [dbt Docs v2](/docs/build/view-documentation#dbt-docs-v2), чтобы создать и просмотреть документацию проекта локально. Команда `dbt docs generate` собирает сайт, а `dbt docs serve` запускает предпросмотр.

Чтобы создать только метаданные каталога (`catalog.json`), используйте [флаг `--write-catalog`](#--write-catalog-flag).

dbt Docs v2 предназначен для локального запуска и размещения в собственной инфраструктуре. В <Constant name="dbt_platform" /> используйте [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs): это облачное представление документации, которое задания обновляют автоматически. Подробнее см. [Поведение на платформе](#dbt-platform-behavior).

## dbt Docs v2

Сайт dbt Docs v2 собирается локально или в вашем пайплайне, например в GitHub Actions, и размещается в вашей инфраструктуре. На <Constant name="dbt_platform" /> вместо него используется [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs). Подробнее см. [Поведение на платформе](#dbt-platform-behavior).

При компиляции или сборке проекта v2 создаёт артефакты Parquet вместо статического `manifest.json`, который загружался в браузер. Команда `dbt docs generate` экспортирует сайт как набор статических файлов: одностраничное приложение и эти артефакты. Их можно разместить на любом файловом хостинге. Браузер читает Parquet напрямую через DuckDB-WASM (WebAssembly), поэтому отдельный сервер с состоянием не нужен и просмотр остаётся быстрым даже для крупных проектов.

### Сборка сайта {#generate-the-site}

Команда `dbt docs generate` компилирует проект, записывает индекс и экспортирует сайт документации:

```shell
dbt docs generate
```

По умолчанию dbt записывает сайт в `target/`: `target/index.html`, `target/assets/` и индекс в `target/index/`. Структура совпадает с <Constant name="core_v1" />. Файл `index.html` можно отдавать из `target/` так же, как в v1, поэтому пайплайн с командой `dbt docs generate && mv target public` продолжит работать.

Чтобы записать автономную копию сайта в другой каталог, используйте `--output-dir`:

```shell
dbt docs generate --output-dir site
```

Будет создан каталог `site/` с приложением, ресурсами с хешами в именах и копией индекса. Его можно разместить в S3, GitHub Pages, Netlify, GitLab Pages или на аналогичном хостинге статических файлов.

Чтобы пропустить компиляцию и экспортировать существующий индекс, используйте `--no-compile`. Если индекса нет, команда завершится ошибкой:

```shell
dbt docs generate --no-compile
```

#### Зависимости столбцов и дополнительные метаданные {#column-lineage-and-richer-metadata}

Чтобы добавить типы столбцов, выведенные из SQL моделей, и зависимости на уровне столбцов, запустите `dbt build`, `dbt run` или `dbt compile` с флагами [`--generate-info-schema`](/docs/build/dbt-information-schema) и [`--static-analysis strict`](/docs/build/about-static-analysis), затем экспортируйте сайт:

```shell
dbt build --generate-info-schema --static-analysis strict
dbt docs generate --no-compile
```

Флаг `--no-compile` пропускает этап компиляции в `dbt docs generate` и экспортирует существующий индекс.

Если при сборке сайта сведения о зависимостях столбцов не были добавлены, dbt Docs v2 скрывает соответствующие функции.

### Локальный запуск dbt Docs v2 {#serve-dbt-docs-v2}

Чтобы просмотреть сайт локально, выполните:

```shell
dbt docs serve
```

Команда `dbt docs serve` открывает документацию на вашем компьютере. На <Constant name="dbt_platform"/> для просмотра проекта используйте <Constant name="catalog" />. Подробнее см. [Поведение на платформе](#dbt-platform-behavior).

Команда `dbt docs serve` собирает сайт, если его ещё нет или он старше индекса, а затем отдаёт статические файлы. По умолчанию сервер запускается на порту `8580`, и сайт открывается в браузере. Порт можно изменить флагом `--port`:

```shell
dbt docs serve --port 8081
```

Флаг `--target-path` позволяет изменить каталог, из которого dbt читает артефакты:

```shell
dbt docs serve --target-path ~/Developer/internal-analytics/target
```

Сайт состоит из статических файлов, поэтому вместо локального сервера можно разместить его в объектном хранилище или на хостинге статических сайтов.

### Страница обзора проекта {#project-overview-page}

Как и в dbt Docs v1, начальная страница dbt Docs v2 использует блок документации `__overview__`. dbt ищет блоки `{% docs %}` в каталогах `docs-paths`, поэтому файл `models/overview.md` находится по умолчанию. Файл `docs/overview.md` будет найден, только если в проекте задано `docs-paths: ["docs"]`. Если блок обзора не задан, dbt использует стандартную страницу.

## Флаг `--write-catalog` {#--write-catalog-flag}

Флаг `--write-catalog` создаёт артефакт [`catalog.json`](/reference/artifacts/catalog-json) с метаданными таблиц и <Term id="view">представлений</Term>, созданных моделями проекта. Флаг только собирает метаданные. Чтобы собрать сайт документации, используйте [dbt Docs v2](#dbt-docs-v2).

При локальном запуске dbt добавляйте этот флаг явно. Он поддерживается следующими командами:

- `dbt build`
- `dbt run`
- `dbt parse`
- `dbt compile`

**Пример**:

```shell
dbt build --write-catalog
```

:::info Задания на <Constant name="dbt_platform" />
Задания <Constant name="fusion" /> на <Constant name="dbt_platform" /> автоматически обновляют метаданные <Constant name="catalog" /> при каждом запуске, поэтому флаг `--write-catalog` в них не нужен. Подробнее см. [Поведение на платформе dbt](#dbt-platform-behavior).
:::

### Локальный запуск {#local-usage}

При локальном запуске <Constant name="fusion" /> добавьте флаг `--write-catalog`, чтобы сгенерировать метаданные каталога:

```shell
dbt build --write-catalog
```

### Отличие от docs generate {#whats-different-from-docs-generate}

Обе команды записывают артефакты. Сайт документации, который можно открыть в браузере, создаёт только `dbt docs generate`.

<SimpleTable>

| | Флаг `--write-catalog` | Команда `dbt docs generate` |
|--|-------------------|---------------------|
| Что создаёт | `catalog.json` и артефакты, которые команда создаёт и без флага | `index.html`, `assets/` и файлы индекса |
| Для чего используется | Метаданные для [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs) и API метаданных | Статический сайт, который можно просмотреть через `dbt docs serve` или разместить на хостинге |
| Где работает | Локально и на <Constant name="dbt_platform" />. В заданиях <Constant name="fusion" /> на платформе команда добавляется автоматически. | Только локально в v2. В заданиях <Constant name="dbt_platform" /> вместо неё выполняется `dbt compile --write-catalog` |

</SimpleTable>

## Команды для сбора метаданных {#commands-for-generating-metadata}

Флаги собирают разные метаданные для разных задач. Выберите подходящую команду из списка. В [Справочнике флагов](#flag-reference) указано, какие данные создаёт каждый флаг и куда он их записывает.

- Чтобы показать выведенные типы столбцов моделей и зависимости столбцов в [dbt Docs v2](#dbt-docs-v2):

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  dbt docs generate --no-compile
  ```

- Чтобы создать [информационную схему dbt](/docs/build/dbt-information-schema) с выведенными типами столбцов моделей и зависимостями столбцов:

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  ```

- Чтобы создать информационную схему dbt с выведенными типами и зависимостями столбцов моделей, типами из хранилища и всеми столбцами источников, используемых выбранными узлами:

  ```shell
  dbt build --generate-info-schema --static-analysis strict --write-catalog
  ```

- Чтобы создать информационную схему dbt только с типами столбцов из хранилища:
  ```shell
  dbt build --generate-info-schema --write-catalog
  ```

- Чтобы создать [`catalog.json`](/reference/artifacts/catalog-json) с типами столбцов из хранилища:

  ```shell
  dbt build --write-catalog
  ```

#### Справочник флагов {#flag-reference}

В таблице указано, какие метаданные создаёт каждый флаг и куда они записываются:

<SimpleTable>
| Флаг | Описание | Куда записываются данные |
|------|-------------|-----------------|
| [`--generate-info-schema`](/docs/build/dbt-information-schema) | Создаёт [информационную схему dbt](/docs/build/dbt-information-schema). Добавьте `--static-analysis strict`, чтобы включить выведенные типы и зависимости столбцов моделей. | `target/info_schema/v1/` |
| [`--static-analysis strict`](/docs/build/about-static-analysis) | Включает выведенные типы и зависимости столбцов при использовании вместе с `--generate-info-schema`. | Зависит от флага, с которым используется |
| [`--write-catalog`](#--write-catalog-flag) | Создаёт [`catalog.json`](/reference/artifacts/catalog-json) с типами столбцов из хранилища. <br /><br /> Вместе с `--generate-info-schema` в `dbt build` или `dbt run` записывает типы из хранилища и все столбцы источников для выбранных узлов в информационную схему dbt. | `target/catalog.json` (и `target/info_schema/v1/` вместе с `--generate-info-schema`) |
</SimpleTable>

dbt Docs v2 читает метаданные из информационной схемы dbt. Файл `catalog.json` — отдельный артефакт для внешних инструментов.

## Поведение на платформе dbt {#dbt-platform-behavior}
dbt Docs v2 предназначен для локального запуска и размещения в собственной инфраструктуре. На <Constant name="dbt_platform" /> используйте [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs), где доступно актуальное представление проекта:

- Каждый запуск задания v2 в <Constant name="dbt_platform" /> автоматически обновляет метаданные <Constant name="catalog" />. Отдельный шаг генерации документации не нужен.
- Если добавить в задание шаг `dbt docs generate`, dbt автоматически выполнит вместо него `dbt compile --write-catalog` и направит вас в <Constant name="catalog" />. Задание не создаст статический сайт или файл `index.html`.
- Чтобы дать коллегам, которые не разрабатывают в dbt, доступ к проекту, добавьте необходимое число [мест с правом чтения](/docs/platform/manage-access/seats-and-users). Доступ к <Constant name="catalog" /> включён и для разработчиков, и для пользователей с правом чтения.


</VersionBlock>
