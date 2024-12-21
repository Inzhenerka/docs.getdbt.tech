---
title: "О командах dbt docs"
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

Используйте аргумент `--no-compile`, чтобы пропустить повторную компиляцию. Когда этот флаг указан, `dbt docs generate` пропустит шаг (2), описанный выше.

**Пример**:

```
dbt docs generate --no-compile
```

Используйте аргумент `--empty-catalog`, чтобы пропустить выполнение запросов к базе данных для заполнения `catalog.json`. Когда этот флаг указан, `dbt docs generate` пропустит шаг (3), описанный выше.

Это не рекомендуется для производственных сред, так как это означает, что в вашей документации будет отсутствовать информация, полученная из метаданных базы данных (полный набор столбцов в каждой таблице и статистика по этим таблицам). Это может ускорить `docs generate` в процессе разработки, когда вы просто хотите визуализировать родословную и другую информацию, определенную в вашем проекте. Чтобы узнать, как создать вашу документацию в dbt Cloud, обратитесь к [созданию документации в dbt Cloud](/docs/collaborate/build-and-view-your-docs).

**Пример**:

```
dbt docs generate --empty-catalog
```

### dbt docs serve

Эта команда запускает веб-сервер на порту 8080 для локальной подачи вашей документации и открывает сайт документации в вашем браузере по умолчанию. Веб-сервер коренится в вашей директории `target/`. Убедитесь, что вы запустили `dbt docs generate` перед `dbt docs serve`, потому что команда `generate` создает [артефакт метаданных каталога](/reference/artifacts/catalog-json), от которого зависит команда `serve`. Вы увидите сообщение об ошибке, если каталог отсутствует.

Используйте команду `dbt docs serve`, если вы разрабатываете локально с [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) или [dbt Core](/docs/core/installation-overview). [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) не поддерживает эту команду.

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

**Пример**:

```shell
dbt docs serve --host ""
```

Начиная с версии 1.8.1, хост по умолчанию — `127.0.0.1`. Для версий 1.8.0 и ранее хост по умолчанию был `""`.
</VersionBlock>