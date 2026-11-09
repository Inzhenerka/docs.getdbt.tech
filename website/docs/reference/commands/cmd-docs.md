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

Чтобы узнать, как собирать документацию в <Constant name="cloud" />, см. раздел [build your docs in <Constant name="cloud" />](/docs/explore/build-and-view-your-docs).

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

:::info Note
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

With <Constant name="fusion_engine" />, use [dbt Docs v2](/docs/build/view-documentation#dbt-docs-v2) to generate and view your project's documentation locally. Run `dbt docs generate` to build the site, then `dbt docs serve` to preview it.

To generate catalog metadata (`catalog.json`) without building the documentation site, use the [`--write-catalog` flag](#--write-catalog-flag).

dbt Docs v2 is built for local and self-hosted workflows. In <Constant name="dbt_platform" />, use [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs) instead, a hosted, always-up-to-date view of your docs that your jobs refresh automatically. Refer to [Platform behavior](#dbt-platform-behavior) for details.

## dbt Docs v2

dbt Docs v2 is a self-hosted documentation site generated on your local machine or your own pipeline (like GitHub Actions). It isn't available in the <Constant name="dbt_platform" />, where you use [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs) instead. Refer to [dbt platform behavior](#dbt-platform-behavior) for details.

Instead of loading a static `manifest.json` in the browser, v2 produces Parquet artifacts when you compile or build your project. `dbt docs generate` exports a documentation site made of plain static files (a single-page app plus those artifacts) that any file host can serve. The browser reads the Parquet directly using DuckDB-WASM (WebAssembly), so you don't need to run a stateful server to view your docs. This keeps the experience fast even for large projects.

### Generate the site

`dbt docs generate` compiles your project, writes the index, and exports the documentation site in a single command:

```shell
dbt docs generate
```

By default, dbt writes the site into your `target/` directory (`target/index.html`, `target/assets/`, and the index under `target/index/`), matching the layout of <Constant name="core_v1" />. You can serve `index.html` from `target/` the same way you did in v1, so a self-hosted pipeline that runs `dbt docs generate && mv target public` keeps working.

Use `--output-dir` to write a self-contained copy of the site to a different directory:

```shell
dbt docs generate --output-dir site
```

This writes a `site/` directory (the app, hashed assets, and a copy of the index) that you can host on S3, GitHub Pages, Netlify, GitLab Pages, or any similar static file host.

To skip compilation and export whatever index is already on disk, use `--no-compile`, which fails with an error if no index exists:

```shell
dbt docs generate --no-compile
```

#### Column lineage and richer metadata

To include model column types inferred from your SQL and column-level lineage, run `dbt build`, `dbt run`, or `dbt compile` with [`--generate-info-schema`](/docs/build/dbt-information-schema) and [`--static-analysis strict`](/docs/build/about-static-analysis), then export the site:

```shell
dbt build --generate-info-schema --static-analysis strict
dbt docs generate --no-compile
```

`--no-compile` skips the default compile step in `dbt docs generate` and exports the existing index.

If you generate the site without column lineage, dbt Docs v2 hides those features instead of showing empty data.

### Serve dbt Docs v2

To preview the site locally, run:

```shell
dbt docs serve
```

Use `dbt docs serve` to view your documentation locally on your own machine. In <Constant name="dbt_platform"/>, use <Constant name="catalog" /> to explore your project. Refer to [platform behavior](#dbt-platform-behavior) for details.

`dbt docs serve` generates the site if it's missing or older than the index, then serves the static files. The server starts on port `8580` by default and opens in your browser. Use `--port` to change the port:

```shell
dbt docs serve --port 8081
```

Use the `--target-path` flag to change the path where dbt reads artifacts from:

```shell
dbt docs serve --target-path ~/Developer/internal-analytics/target
```

Because the generated site is a set of static files, you can also host it on any static file host — such as cloud object storage or a static site host — instead of serving it locally.

### Project overview page

dbt Docs v2 renders your project's `__overview__` doc block as the landing page, the same as dbt Docs v1. dbt discovers overview content by scanning your `docs-paths` for `{% docs %}` blocks, so a block in `models/overview.md` is found by default. A file at `docs/overview.md` is only picked up when your project sets `docs-paths: ["docs"]`. If your project defines no overview, dbt renders its default overview content.

## --write-catalog flag

The `--write-catalog` flag generates the [`catalog.json`](/reference/artifacts/catalog-json) artifact, which contains metadata about the tables and <Term id="view">views</Term> produced by the models in your project. It focuses solely on metadata hydration and does not build the documentation site — use [dbt Docs v2](#dbt-docs-v2) for that.

When you run dbt locally, add the flag yourself. You can use it with the following commands:

- `dbt build`
- `dbt run`
- `dbt parse`
- `dbt compile`

**Example**:

```shell
dbt build --write-catalog
```

:::info <Constant name="dbt_platform" /> jobs
<Constant name="fusion" /> jobs in <Constant name="dbt_platform" /> refresh <Constant name="catalog" /> metadata automatically on every run, so you don't need to add the `--write-catalog` flag there. Refer to [Platform behavior](#dbt-platform-behavior) for more info.
:::

### Local usage

When running <Constant name="fusion" /> locally, add the `--write-catalog` flag to your command to generate the catalog:

```shell
dbt build --write-catalog
```

### What's different from docs generate

Both write artifacts, but only `dbt docs generate` builds a documentation site you can view in a browser.

<SimpleTable>

| | `--write-catalog` flag | `dbt docs generate` command |
|--|-------------------|---------------------|
| What it produces | `catalog.json`, plus the artifacts the command already generates | `index.html`, `assets/`, and the index files |
| What it's for | Metadata for [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs) and the metadata APIs | A static site you can preview with `dbt docs serve` or host anywhere |
| Where it works | Locally and in <Constant name="dbt_platform" />. The command is added automatically in dbt platform jobs on <Constant name="fusion" />. | Locally only in v2. <Constant name="dbt_platform" /> job runs use `dbt compile --write-catalog` instead |

</SimpleTable>

## Commands for generating metadata

Each flag targets different metadata and addresses different use cases. Find the right command for your use case in the following list. The [Flag reference](#flag-reference) section breaks down what each flag generates and where it writes.

- To display inferred model column types and column-level lineage in [dbt Docs v2](#dbt-docs-v2):

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  dbt docs generate --no-compile
  ```

- To generate the [dbt Information Schema](/docs/build/dbt-information-schema) with inferred model column types and column-level lineage:

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  ```

- To generate the dbt Information Schema with inferred model column types and column-level lineage, plus warehouse types and all columns from sources used by the selected nodes:

  ```shell
  dbt build --generate-info-schema --static-analysis strict --write-catalog
  ```

- To generate the dbt Information Schema with warehouse column types only:
  ```shell
  dbt build --generate-info-schema --write-catalog
  ```

- To generate [`catalog.json`](/reference/artifacts/catalog-json) with warehouse column types:

  ```shell
  dbt build --write-catalog
  ```

#### Flag reference

The following table explains what each flag generates and where the metadata is stored:

<SimpleTable>
| Flag | Description | Output location |
|------|-------------|-----------------|
| [`--generate-info-schema`](/docs/build/dbt-information-schema) | Generates the [dbt Information Schema](/docs/build/dbt-information-schema). Add `--static-analysis strict` to include inferred model column types and column-level lineage. | `target/info_schema/v1/` |
| [`--static-analysis strict`](/docs/build/about-static-analysis) | Enables inferred column types and column-level lineage when used with `--generate-info-schema`. | Depends on the flag it's combined with |
| [`--write-catalog`](#--write-catalog-flag) | Generates [`catalog.json`](/reference/artifacts/catalog-json) with warehouse column types. <br /><br /> When combined with `--generate-info-schema` on `dbt build` or `dbt run`, writes warehouse column types and all source columns for selected nodes to the dbt Information Schema. | `target/catalog.json` (and `target/info_schema/v1/` when used with `--generate-info-schema`) |
</SimpleTable>

dbt Docs v2 reads metadata from the dbt Information Schema, not from `catalog.json`. The `catalog.json` file is a separate artifact for external tools.

## dbt platform behavior
dbt Docs v2 is built for local and self-hosted workflows. In <Constant name="dbt_platform" />, use [<Constant name="catalog" />](/docs/explore/build-and-view-your-docs), which gives you a cloud-hosted, always-up-to-date view of your project:

- In <Constant name="dbt_platform" /> jobs running v2, every job run automatically refreshes <Constant name="catalog" /> metadata, so you don't need a separate docs step.
- If you add `dbt docs generate` as a job step, dbt automatically runs `dbt compile --write-catalog` instead and directs you to <Constant name="catalog" />. The job doesn't produce the static site or `index.html`.
- To share your project with stakeholders who don't develop in dbt, add as many [read-only seats](/docs/platform/manage-access/seats-and-users) as you need.  Developer and read-only seats both include access to <Constant name="catalog" />


</VersionBlock>
