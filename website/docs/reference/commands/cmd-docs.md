---
title: "О командах dbt docs"
description: "Генерация и запуск документации для вашего dbt‑проекта."
sidebar_label: "docs"
id: "cmd-docs"
---

`dbt docs` поддерживает две подкоманды: `generate` и `serve`.

### dbt docs generate

Эта команда отвечает за генерацию сайта документации вашего проекта путем:

1. Копирования файла сайта `index.html` в директорию `target/`.
2. Компиляции ресурсов в вашем проекте, чтобы их `compiled_code` был включен в [`manifest.json`](/reference/artifacts/manifest-json).
3. Выполнения запросов к метаданным базы данных для создания файла [`catalog.json`](/reference/artifacts/catalog-json), который содержит метаданные о таблицах и <Term id="view">представлениях</Term>, созданных моделями в вашем проекте.

**Пример**:

```
dbt docs generate
```

Используйте аргумент `--select`, чтобы ограничить узлы, включенные в `catalog.json`. Когда этот флаг указан, шаг (3) будет ограничен выбранными узлами. Все остальные узлы будут исключены. Шаг (2) не затрагивается.

**Пример**:

```shell
dbt docs generate --select +orders
```

Используйте аргумент `--no-compile`, чтобы пропустить повторную компиляцию. Если этот флаг указан, команда `dbt docs generate` пропустит шаг (2), описанный выше. Обратите внимание, что dbt всё равно выполняет некоторые специальные макросы (например, `generate_schema_name`) [во время парсинга](/reference/global-configs/parsing), даже если компиляция пропущена.

**Пример**:

```
dbt docs generate --no-compile
```

Используйте аргумент `--empty-catalog`, чтобы пропустить выполнение запросов к базе данных для заполнения `catalog.json`. Когда этот флаг указан, `dbt docs generate` пропустит шаг (3), описанный выше.

Это **не рекомендуется для продакшен-окружений**, поскольку в таком случае в документации будет отсутствовать информация, получаемая из метаданных базы данных (полный набор колонок в каждой таблице, а также статистика по этим таблицам).  

Зато это может ускорить выполнение команды `docs generate` в процессе разработки, когда вам нужно лишь визуализировать lineage и другую информацию, определённую внутри вашего проекта.  

Чтобы узнать, как собирать документацию в <Constant name="cloud" />, см. раздел [build your docs in <Constant name="cloud" />](/docs/explore/build-and-view-your-docs).

**Пример**:

```
dbt docs generate --empty-catalog
```

**Example**:

Use the `--static` flag to generate the docs as a static page for hosting on a cloud storage provider. The `catalog.json` and `manifest.json` files will be inserted into the `index.html` file, creating a single page easily shared via email or file-sharing apps. 

```
dbt docs generate --static
```

### dbt docs serve

Эта команда запускает веб-сервер на порту 8080 для локальной подачи вашей документации и открывает сайт документации в вашем браузере по умолчанию. Веб-сервер коренится в вашей директории `target/`. Убедитесь, что вы запустили `dbt docs generate` перед `dbt docs serve`, потому что команда `generate` создает [артефакт метаданных каталога](/reference/artifacts/catalog-json), от которого зависит команда `serve`. Вы увидите сообщение об ошибке, если каталог отсутствует.

Используйте команду `dbt docs serve`, если вы разрабатываете локально с помощью [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) или [<Constant name="core" />](/docs/core/installation-overview). [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) не поддерживает эту команду.

**Использование:**

<VersionBlock lastVersion="1.8.1">
```
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>
<VersionBlock firstVersion="1.8.2">
```
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--host HOST]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>

Вы можете указать другой порт, используя флаг `--port`.

**Пример**:

```
dbt docs serve --port 8001
```

<VersionBlock firstVersion="1.8.2">

Вы можете указать другой хост, используя флаг `--host`.

:::info Note
Флаг `--host` доступен только в [<Constant name="core"/>](/docs/core/installation-overview). Он не поддерживается в [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation).
:::

**Пример**:

```shell
dbt docs serve --host ""
```

Начиная с версии 1.8.1, хост по умолчанию — `127.0.0.1`. Для версий 1.8.0 и ранее хост по умолчанию был `""`.
</VersionBlock>