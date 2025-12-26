---
title: "О документации"
description: "Узнайте, как качественная документация для ваших моделей dbt помогает заинтересованным сторонам находить и понимать ваши наборы данных."
id: "documentation"
pagination_next: "docs/build/view-documentation"
---

import CopilotBeta from '/snippets/_dbt-copilot-avail.md';

Хорошая документация для ваших моделей dbt помогает потребителям данных дальше по цепочке находить и понимать датасеты, которые вы для них создаёте и поддерживаете.  
dbt предоставляет способ генерировать документацию для вашего проекта dbt и отображать её в виде веб‑сайта.


<CopilotBeta resource='documentation' />

## Связанная документация

- [Объявление свойств](/reference/configs-and-properties)
- [Команда `dbt docs`](/reference/commands/cmd-docs)
- [Jinja‑функция `doc`](/reference/dbt-jinja-functions/doc)
- Если вы только начинаете работать с dbt, рекомендуем ознакомиться с нашим [быстрым стартом](/guides), чтобы создать свой первый проект dbt вместе с документацией.

## Предполагаемые знания

- [Тесты данных](/docs/build/data-tests)

## Обзор

dbt предоставляет масштабируемый способ [генерации](#generating-documentation) документации для вашего dbt‑проекта с использованием описаний и команд. Документация вашего проекта включает в себя:

- **Информацию о вашем проекте**: в том числе код моделей, DAG вашего проекта, любые тесты, добавленные к колонкам, и многое другое.
- **Информацию о вашем <Term id="data-warehouse" />**: включая типы данных колонок и размеры <Term id="table" />. Эта информация генерируется путём выполнения запросов к information schema.
- Что особенно важно, dbt также предоставляет возможность добавлять **описания** к моделям, колонкам, источникам и другим объектам, чтобы дополнительно улучшить документацию.

В следующих разделах описывается, как [добавлять описания](#adding-descriptions-to-your-project) в проект, как [генерировать документацию](#generating-documentation), как использовать [docs blocks](#using-docs-blocks), а также как задать [пользовательский обзор](#setting-a-custom-overview) для документации.

## Добавление описаний в проект

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

### Часто задаваемые вопросы
<FAQ path="Project/example-projects" alt_header="Существуют ли примеры сайтов документации dbt?"/>
<FAQ path="Docs/document-all-columns" />
<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />
<FAQ path="Docs/document-other-resources" />

## Генерация документации

Сгенерируйте документацию для вашего проекта, выполнив следующие шаги:

1. Запустите команду `dbt docs generate` ([command](/reference/commands/cmd-docs#dbt-docs-generate)), чтобы скомпилировать релевантную информацию о вашем dbt‑проекте и хранилище данных в файлы `manifest.json` и `catalog.json` соответственно.  
2. Убедитесь, что вы создали модели с помощью `dbt run` или `dbt build`, чтобы в документации отображались все колонки, а не только те, которые описаны в вашем проекте.  
3. Если вы разрабатываете локально, запустите команду `dbt docs serve` ([command](/reference/commands/cmd-docs#dbt-docs-serve)), чтобы использовать эти `.json`‑файлы для наполнения локального веб‑сайта.

dbt предоставляет два взаимодополняющих способа [просмотра документации](/docs/build/view-documentation) и описаний после их генерации:

- [**dbt Docs**:](/docs/build/view-documentation#dbt-docs) Статический сайт документации с lineage моделей, метаданными и описаниями, который можно разместить на вашем веб‑сервере (например, S3 или Netlify). Доступно для тарифов разработчика <Constant name="core" /> или <Constant name="cloud" />.  
- [**<Constant name="explorer" />**](/docs/explore/explore-projects): Расширяет dbt Docs, предоставляя динамический интерфейс в реальном времени с расширенными метаданными, настраиваемыми представлениями, более глубоким анализом проекта и инструментами для совместной работы. Доступно в <Constant name="cloud" /> на тарифах [Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing).

См. раздел [View documentation](/docs/build/view-documentation), чтобы получить максимальную пользу от документации вашего dbt‑проекта.

## Использование docs blocks

Docs blocks предоставляют удобный и гибкий способ документирования моделей и других ресурсов с использованием Jinja и markdown. Файлы с docs blocks могут содержать произвольный markdown, но каждый блок должен иметь уникальное имя.

### Синтаксис

Чтобы объявить docs block, используйте Jinja‑тег `docs`. Имя docs block не может начинаться с цифры и может содержать:

- Заглавные и строчные буквы (A–Z, a–z)  
- Цифры (0–9)  
- Символы подчёркивания (`_`)

<File name='events.md'>

```markdown
{% docs table_events %}

Эта таблица содержит события кликов с маркетингового веб-сайта.

События в этой таблице записываются с помощью [Snowplow](http://github.com/snowplow/snowplow) и передаются в хранилище каждый час. Отслеживаются следующие страницы маркетингового сайта:
 - /
 - /about
 - /team
 - /contact-us

{% enddocs %}
```

</File>

В этом примере определяется docs-блок с именем `table_events`, содержащий некоторое описательное содержимое в формате markdown. В самом имени `table_events` нет ничего принципиального — docs-блоки можно называть как угодно, при условии что имя содержит только буквенно-цифровые символы и символ подчёркивания и не начинается с цифры.

### Размещение

<VersionBlock firstVersion="1.9">

Блоки документации должны быть размещены в файлах с расширением `.md`. По умолчанию dbt будет искать блоки документации во всех путях ресурсов (например, в объединенном списке [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [test-paths](/reference/project-configs/test-paths), [macro-paths](/reference/project-configs/macro-paths) и [snapshot-paths](/reference/project-configs/snapshot-paths)) &mdash; вы можете настроить это поведение с помощью конфигурации [docs-paths](/reference/project-configs/docs-paths).

</VersionBlock>

### Использование
Чтобы использовать блок документации, сослитесь на него в файле `schema.yml`, указав функцию [doc()](/reference/dbt-jinja-functions/doc) вместо markdown-строки. Используя примеры выше, документацию `table_events` можно подключить в файле `schema.yml`, как показано здесь:

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

## Установка пользовательского обзора
*Доступно только для dbt Docs.*

## Настройка собственного overview
*В настоящее время доступно только для dbt Docs.*

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
*Доступно только для dbt Docs.*

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
