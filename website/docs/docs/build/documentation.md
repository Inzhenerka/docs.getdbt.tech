---
title: "О документации"
description: "Узнайте, как качественная документация для ваших моделей dbt помогает заинтересованным сторонам находить и понимать ваши наборы данных."
id: "documentation"
pagination_next: "docs/build/view-documentation"
availability: all_users
---

import CopilotBeta from '/snippets/_dbt-copilot-avail.md';

Хорошая документация для ваших моделей dbt помогает потребителям данных дальше по цепочке находить и понимать датасеты, которые вы для них создаёте и поддерживаете.  
dbt предоставляет способ генерировать документацию для вашего проекта dbt и отображать её в виде веб‑сайта.


<CopilotBeta resource='documentation' />

## Связанная документация {#related-documentation}

- [Объявление свойств](/reference/configs-and-properties)
- [Команда `dbt docs`](/reference/commands/cmd-docs)
- [Jinja‑функция `doc`](/reference/dbt-jinja-functions/doc)
- Если вы только начинаете работать с dbt, рекомендуем ознакомиться с нашим [быстрым стартом](/guides), чтобы создать свой первый проект dbt вместе с документацией.

## Предполагаемые знания {#assumed-knowledge}

- [Тесты данных](/docs/build/data-tests)

## Обзор {#overview}

dbt предоставляет масштабируемый способ [генерации](#generating-documentation) документации для вашего dbt‑проекта с использованием описаний и команд. Документация вашего проекта включает в себя:

- **Информацию о вашем проекте**: в том числе код моделей, DAG вашего проекта, любые тесты, добавленные к колонкам, и многое другое.
- **Информацию о вашем <Term id="data-warehouse" />**: включая типы данных колонок и размеры <Term id="table" />. Эта информация генерируется путём выполнения запросов к information schema.
- Что особенно важно, dbt также предоставляет возможность добавлять **описания** к моделям, колонкам, источникам и другим объектам, чтобы дополнительно улучшить документацию.

В следующих разделах описывается, как [добавлять описания](#adding-descriptions-to-your-project) в проект, как [генерировать документацию](#generating-documentation), как использовать [docs blocks](#using-docs-blocks), а также как задать [пользовательский обзор](#setting-a-custom-overview) для документации.

## Добавление описаний в проект {#adding-descriptions-to-your-project}

Перед генерацией документации добавьте [описания](/reference/resource-properties/description) к ресурсам вашего проекта. Ключ `description:` добавляется в те же YAML‑файлы, в которых вы объявляете [data tests](/docs/build/data-tests). Например:

<File name='models/<filename>.yml'>

```yaml

models:
  - name: events
    description: Эта таблица содержит события кликов с маркетингового веб-сайта

    columns:
      - name: event_id
        description: Это уникальный идентификатор события
        data_tests:
          - unique
          - not_null

      - name: user-id
        quote: true
        description: Пользователь, который выполнил событие
        data_tests:
          - not_null

```
</File>

### Часто задаваемые вопросы {#faqs}
<FAQ path="Project/example-projects" alt_header="Существуют ли примеры сайтов документации dbt?"/>
<FAQ path="Docs/document-all-columns" />
<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />
<FAQ path="Docs/document-other-resources" />

## Генерация документации {#generating-documentation}

dbt предоставляет решения как для самостоятельного размещения, так и для размещения в облаке, позволяющие [просматривать документацию](/docs/build/view-documentation) вашего проекта. Выбор зависит от версии dbt и среды, в которой вы запускаете dbt.


<VersionBlock lastVersion="1.99">

:::tip Используйте dbt Docs v2 локально!

dbt Docs v2, созданный на основе мощных возможностей dbt v2, — это современный сайт документации с открытым исходным кодом, метаданными Semantic Layer и графом зависимостей на уровне столбцов, который можно разместить где угодно. [Обновитесь до v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2) и обратитесь к разделу [dbt Docs v2](/docs/build/view-documentation?version=2#dbt-docs-v2) за дополнительной информацией.
:::

<SimpleTable>

| Вариант | Что это | Где используется | Как сгенерировать |
|--------|-----------|------------------|--------------------|
| [**dbt Docs v1**](/docs/build/view-documentation#dbt-docs-%D1%83%D1%81%D1%82%D0%B0%D1%80%D0%B5%D0%B2%D1%88%D0%B8%D0%B9-%D0%B8%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82) | Статический сайт с графом зависимостей моделей, метаданными и документацией, который можно разместить на собственном веб-сервере (например, в S3 или Netlify) | <Constant name="core_v1" /> или тарифные планы Developer в <Constant name="dbt" /> | Выполните `dbt docs generate`. Пошаговые инструкции см. в разделе [Генерация документации локально](#generate-docs-locally) |
| [**dbt <Constant name="catalog" />**](/docs/explore/explore-projects) | Динамический интерфейс, работающий в реальном времени, с расширенными метаданными, настраиваемыми представлениями, углублённой аналитикой проекта и инструментами для совместной работы. | <Constant name="dbt_platform" /> на [тарифных планах Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing) | Наполняется автоматически при выполнении ваших заданий с <Constant name="fusion_engine" />. Дополнительные действия не требуются! |

</SimpleTable>

</VersionBlock>

<VersionBlock firstVersion="2.0">
<SimpleTable>

| Вариант | Что это | Где используется | Как сгенерировать |
|--------|-----------|------------------|--------------------|
| [**dbt Docs v2**](/docs/build/view-documentation#dbt-docs-v2) | Переработанный сайт документации с открытым исходным кодом, метаданными Semantic Layer и [графом зависимостей на уровне столбцов](/docs/explore/column-level-lineage), который можно разместить где угодно | Локально с <Constant name="fusion_engine" />. Недоступен в <Constant name="dbt_platform" /> | Выполните `dbt docs generate` локально. Пошаговые инструкции см. в разделе [Генерация документации локально](#generate-docs-locally) |
| [**dbt <Constant name="catalog" />**](/docs/explore/explore-projects) | Динамический интерфейс, работающий в реальном времени, с расширенными метаданными, настраиваемыми представлениями, углублённой аналитикой проекта и инструментами для совместной работы. | <Constant name="dbt_platform" /> на [тарифных планах Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing) | Наполняется автоматически при выполнении ваших заданий с <Constant name="fusion_engine" />. Дополнительные действия не требуются! |

</SimpleTable>

</VersionBlock>

:::tip Хотите поделиться документацией с заинтересованными сторонами?
Любой пользователь с лицензией разработчика или лицензией только для чтения может изучать ваши проекты в <Constant name="catalog" />. Добавьте столько лицензий только для чтения, сколько нужно, чтобы предоставить заинтересованным сторонам доступ к документации, — отдельный сайт документации не требуется.
:::

### Генерация документации локально {#generate-docs-locally}

<VersionBlock lastVersion="1.99">

1. Сохраните изменения описаний моделей, источников и столбцов в YAML. Используйте тот же контекст проекта, что и при разработке, включая все селекторы и исключения, чтобы сгенерированные артефакты соответствовали ресурсам, которые dbt разбирает при этом запуске.
2. Постройте модели с помощью `dbt run` или `dbt build`, чтобы документация включала все столбцы, а не только те, которые описаны в проекте.
3. Выполните [`dbt docs generate`](/reference/commands/cmd-docs?version=1.12#dbt-docs-generate), чтобы скомпилировать информацию о проекте и хранилище данных в файлы `manifest.json` и `catalog.json`.
4. Выполните [`dbt docs serve`](/reference/commands/cmd-docs?version=1.12#dbt-docs-serve), чтобы использовать эти файлы для наполнения локального веб-сайта.

</VersionBlock>

<VersionBlock firstVersion="2.0">

Используя <Constant name="fusion_engine" />, dbt Docs v2 расширяет возможности исходного статического сайта v1, предоставляя современный высокопроизводительный каталог. Команда dbt docs generate компилирует проект, создаёт артефакты v2 в формате Parquet и записывает статический сайт, к которому браузер обращается напрямую с помощью DuckDB-WASM (WebAssembly), поэтому сервер для его просмотра не нужен. 

Чтобы сгенерировать документацию и запустить её просмотр локально:

- Выполните `dbt docs generate`, чтобы одной командой скомпилировать проект, записать индекс и экспортировать сайт документации.
- Выполните `dbt docs serve` для локального предварительного просмотра сайта.

:::note Доступность dbt Docs v2
dbt Docs v2 работает только в самостоятельно размещённых установках dbt v2. Если вы используете <Constant name="dbt_platform" />, воспользуйтесь [<Constant name="catalog" />](/docs/explore/explore-projects), который наполняется автоматически при выполнении ваших заданий с v2. Добавление шага `dbt docs generate` в задание не создаст статический сайт в <Constant name="dbt_platform" />.
:::

</VersionBlock>

Полную информацию об использовании см. в разделе [Команды dbt docs](/reference/commands/cmd-docs), а рекомендации по эффективной работе с документацией проекта — в разделе [Просмотр документации](/docs/build/view-documentation).

## Использование docs blocks {#using-docs-blocks}

Docs blocks предоставляют удобный и гибкий способ документирования моделей и других ресурсов с использованием Jinja и markdown. Файлы с docs blocks могут содержать произвольный markdown, но каждый блок должен иметь уникальное имя.

### Синтаксис {#syntax}

Чтобы объявить docs block, используйте Jinja‑тег `docs`. Имя docs block не может начинаться с цифры и может содержать:

- Заглавные и строчные буквы (A–Z, a–z)  
- Цифры (0–9)  
- Символы подчёркивания (`_`)

<File name='events.md'>

```markdown
{% docs table_events %}

Эта таблица содержит события кликов с маркетингового веб-сайта.

События в этой таблице регистрируются с помощью [Snowplow](https://github.com/snowplow/snowplow) и ежечасно загружаются в хранилище данных. Отслеживаются следующие страницы маркетингового сайта:
 - /
 - /about
 - /team
 - /contact-us

{% enddocs %}
```

</File>

В этом примере определяется docs-блок с именем `table_events`, содержащий некоторое описательное содержимое в формате markdown. В самом имени `table_events` нет ничего принципиального — docs-блоки можно называть как угодно, при условии что имя содержит только буквенно-цифровые символы и символ подчёркивания и не начинается с цифры.

### Размещение {#placement}

<VersionBlock lastVersion="1.11">

Блоки документации должны быть размещены в файлах с расширением `.md`. По умолчанию dbt будет искать блоки документации во всех путях ресурсов (например, в объединенном списке [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [test-paths](/reference/project-configs/test-paths), [macro-paths](/reference/project-configs/macro-paths) и [snapshot-paths](/reference/project-configs/snapshot-paths)) &mdash; вы можете настроить это поведение с помощью конфигурации [docs-paths](/reference/project-configs/docs-paths).

</VersionBlock>

<VersionBlock firstVersion="1.12">

Размещайте блоки docs в файлах `.md`. Также можно использовать расширения в стиле Jinja (`.md.j2`, `.md.jinja`, `.md.jinja2`), однако для этого необходимо задать [`allow_jinja_file_extensions: true`](/reference/global-configs/behavior-flags/allow_jinja_file_extensions) в файле `dbt_project.yml`. Это позволяет использовать подсветку синтаксиса с учётом Jinja в IDE, которые связывают эти расширения с шаблонизацией Jinja.

По умолчанию dbt ищет блоки docs во всех путях к ресурсам (например, в объединённом списке [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [test-paths](/reference/project-configs/test-paths), [macro-paths](/reference/project-configs/macro-paths) и [snapshot-paths](/reference/project-configs/snapshot-paths)). Это поведение можно изменить с помощью настройки [docs-paths](/reference/project-configs/docs-paths).

</VersionBlock>

### Использование
Чтобы использовать блок docs, сошлитесь на него из файла `schema.yml` с помощью функции [doc()](/reference/dbt-jinja-functions/doc) вместо строки Markdown. Документацию `table_events` из приведённых выше примеров можно включить в файл `schema.yml`, как показано ниже:

<File name='schema.yml'>

```yaml

models:
  - name: events
    description: '{{ doc("table_events") }}'

    columns:
      - name: event_id
        description: Это уникальный идентификатор события
        data_tests:
            - unique
            - not_null
```

</File>

В полученной документации `'{{ doc("table_events") }}'` будет расширено до markdown, определенного в блоке документации `table_events`.

## Установка пользовательского обзора {#setting-a-custom-overview}
*Доступно только для dbt Docs.*

## Настройка собственного обзора

:::info Доступность
Эта функция доступна только в [dbt Docs](/docs/build/documentation) — сгенерированном сайте документации вашего проекта dbt.
:::

Раздел **overview**, отображаемый на сайте dbt Docs, можно переопределить, указав собственный docs-блок с именем `__overview__`.

- По умолчанию dbt предоставляет overview с полезной информацией о самом сайте документации.
- В зависимости от ваших потребностей может иметь смысл переопределить этот docs-блок и добавить, например, информацию о корпоративном style guide, ссылки на отчёты или сведения о том, к кому обращаться за помощью.
- Чтобы переопределить стандартный overview, создайте docs-блок следующего вида:

<File name='models/overview.md'>

```markdown
{% docs __overview__ %}
# Руководство по ежемесячной повторяющейся выручке (MRR).
Этот проект dbt является рабочим примером, демонстрирующим, как моделировать выручку от подписки. **Ознакомьтесь с полным описанием \[здесь](https://blog.getdbt.com/modeling-subscription-revenue/),
а также с репозиторием для этого проекта \[здесь](https://github.com/dbt-labs/mrr-playbook/).**
...

{% enddocs %}
```

</File>

### Пользовательские обзоры на уровне проекта

Вы можете задать разные обзорные страницы (overviews) для каждого dbt‑проекта или пакета, включённого в ваш сайт документации, создав блок документации с именем `__[project_name]__`.

Например, чтобы определить пользовательские обзорные страницы, которые будут отображаться, когда пользователь переходит внутрь пакета `dbt_utils` или `snowplow`:

<File name='models/overview.md'>

```markdown
{% docs __dbt_utils__ %}
# Утилитарные макросы
Наш проект dbt активно использует этот набор утилитарных макросов, особенно:
- `surrogate_key`
- `test_equality`
- `pivot`
{% enddocs %}

{% docs __snowplow__ %}
# Сессии Snowplow
Наша организация использует этот пакет преобразований для объединения событий Snowplow в просмотры страниц и сессии.
{% enddocs %}
```

</File>
