---
title: "Руководство по стилю Copilot"
sidebar_label: Руководство по стилю Copilot
id: copilot-styleguide
description: "Используйте файл Copilot `dbt-styleguide.md` для лучших практик и соглашений об именовании в проектах dbt."
---

<IntroText>
Это руководство предоставляет обзор файла <Constant name="copilot" /> `dbt-styleguide.md`, описывая его структуру, рекомендуемое использование и лучшие практики для эффективного применения в ваших проектах dbt.
</IntroText>

`dbt-styleguide.md` — это шаблон для создания руководства по стилю для проектов dbt. Он включает в себя:

- Рекомендации по стилю SQL (например, использование ключевых слов в нижнем регистре и завершающих запятых)
- Организацию моделей и соглашения об именовании
- Конфигурации моделей и практики тестирования
- Рекомендации по использованию pre-commit hooks для принудительного соблюдения правил стиля

Это руководство помогает обеспечить согласованность и понятность в проектах dbt.

## `dbt-styleguide.md` для Copilot {#dbt-styleguidemd-for-copilot}

Используя <Constant name="copilot" /> в <Constant name="cloud_ide" />, вы можете автоматически сгенерировать шаблон руководства по стилю с именем `dbt-styleguide.md`. Если руководство по стилю добавляется или редактируется вручную, оно также должно следовать этому соглашению об именовании. Любое другое имя файла не может быть использовано с <Constant name="copilot" />.

Добавьте файл `dbt-styleguide.md` в корень вашего проекта. <Constant name="copilot" /> будет использовать его как контекст для большой языковой модели (LLM) при генерации [data tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), [semantic models](/docs/build/semantic-models) и [documentation](/docs/build/documentation).

Обратите внимание: создавая `dbt-styleguide.md` для <Constant name="copilot" />, вы переопределяете руководство по стилю dbt по умолчанию.

## Создание `dbt-styleguide.md` в Studio IDE {#creating-dbt-styleguidemd-in-the-studio-ide}

1. Откройте файл в <Constant name="cloud_ide" />.
2. Нажмите **<Constant name="copilot" />** на панели инструментов.
3. Выберите **Generate ... Style guide** в меню.
<Lightbox src="/img/docs/dbt-cloud/generate-styleguide.png" title="Генерация руководства по стилю в Copilot" />
4. Шаблон руководства по стилю появится в <Constant name="cloud_ide" />. Нажмите **Save**.  
      Файл `dbt-styleguide.md` будет добавлен на корневом уровне вашего проекта.

Если вы ранее не генерировали файл руководства по стилю, последняя версия будет автоматически получена из <Constant name="dbt_platform" />.

## Если `dbt-styleguide.md` уже существует {#if-dbt-styleguidemd-already-exists}

Если файл `dbt-styleguide.md` уже существует и вы попытаетесь сгенерировать новое руководство по стилю, появится модальное окно со следующими вариантами:

- **Cancel** &mdash; Выйти без внесения изменений.
- **Restore** &mdash; Вернуться к последней версии из <Constant name="dbt_platform" />.
- **Edit** &mdash; Вручную изменить существующее руководство по стилю.

<Lightbox src="/img/docs/dbt-cloud/styleguide-exists.png" title="Руководство по стилю уже существует" />

## Дополнительные материалы {#further-reading}

- [О dbt Copilot](/docs/cloud/dbt-copilot)
- [Как мы оформляем наши проекты dbt](/best-practices/how-we-style/0-how-we-style-our-dbt-projects)
