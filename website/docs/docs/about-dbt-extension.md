---
title: О расширении dbt для VS Code
id: about-dbt-extension
description: "Привнесите всю скорость и мощь движка dbt Fusion в ваш локальный процесс разработки."
sidebar_label: "Расширение dbt для VS Code"
image: /img/docs/extension/extension-marketplace.png
pagination_next: "docs/dbt-extension-features"
---

# О расширении dbt для VS Code <Lifecycle status="preview" /> {#about-the-dbt-vs-code-extension}

Расширение dbt VS Code предоставляет сверхбыстрый, интеллектуальный и экономичный опыт разработки dbt прямо в VS Code.  
Это единственный способ получить всю мощь <Constant name="fusion_engine" /> при локальной разработке.

- _Экономьте время и ресурсы_ благодаря почти мгновенному парсингу, обнаружению ошибок в реальном времени, мощным возможностям IntelliSense и многому другому.
- _Оставайтесь в потоке_ благодаря цельному, сквозному процессу разработки dbt, созданному с нуля специально для локальной работы с dbt.

Расширение dbt VS Code доступно в [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt).  
_Обратите внимание: это публичный preview-релиз. Поведение расширения может измениться до выхода общей доступной версии (GA)._

:::tip Попробуйте Fusion quickstart guide

Ознакомьтесь с [Fusion quickstart guide](/guides/fusion?step=1), чтобы увидеть расширение dbt VS Code в действии.

:::

## Навигация по dbt extension {#navigating-the-dbt-extension}

После установки расширения dbt VS Code в вашей IDE появятся несколько визуальных улучшений, которые помогут ориентироваться в возможностях и функциональности расширения.

Посмотрите следующее видео, чтобы увидеть функции и возможности расширения dbt VS Code:

<div style={{ position: 'relative', maxWidth: '960px', margin: '2rem auto', overflow: 'hidden', borderRadius: '12px', height: '500px', boxShadow: 'var(--ifm-global-shadow-lw)' }}>
  <iframe
    src="https://app.storylane.io/share/a1rkqx0mbd7a"
    title="dbt Fusion + VS Code extension walkthrough"
    style={{ position: 'relative', top: '-48px', height: '900px', width: '100%', border: 0, paddingBottom:'calc(42.20%)',transform: 'scale(1)'}}
    allow="fullscreen; autoplay; encrypted-media"
  />
</div>

### Меню dbt extension {#the-dbt-extension-menu}

Логотип dbt на боковой панели (или текст **dbt Extension** в нижней панели) открывает главное меню расширения. В этом меню собрана полезная информация и действия, которые вы можете выполнить:
- **Get started button:** запускает процесс [Fusion upgrade](/docs/install-dbt-extension#upgrade-to-fusion).
- **Extension info:** информация о расширении, Fusion и вашем dbt-проекте. Включает параметры конфигурации и доступные действия.
- **Help:** быстрые ссылки на поддержку, отправку баг-репортов и документацию.

<Lightbox src="/img/docs/extension/sidebar-menu.png" width="30%" title="Экран приветствия dbt VS Code extension." />

### Кэширование {#caching}

Расширение dbt кэширует важную информацию о схемах из вашего data warehouse для повышения скорости и производительности. Кэш автоматически обновляется со временем, но если были внесены недавние изменения, которые не отображаются в проекте, вы можете обновить информацию вручную:

1. Нажмите на **логотип dbt** на боковой панели, чтобы открыть меню.
2. Раскройте раздел **Extension info** и найдите подраздел **Actions**.
3. Нажмите **Clear Cache**, чтобы обновить данные.

### Функции продуктивности {#productivity-features}

:::info Этот раздел был перенесён

Мы вынесли функции продуктивности на отдельную страницу. Ознакомьтесь с ними в [новом разделе](/docs/dbt-extension-features).

:::

## Использование расширения {#using-the-extension}

Для работы с этим расширением ваше окружение dbt должно использовать dbt Fusion engine. Подробнее о требованиях и процессе обновления см. в [документации Fusion](/docs/fusion).

После установки расширение dbt автоматически активируется, когда вы открываете любой файл `.sql` или `.yml` внутри директории dbt-проекта.

## Конфигурация {#configuration}

После установки вы можете настроить расширение под свой рабочий процесс:

1. Откройте настройки VS Code, нажав `Ctrl+,` (Windows/Linux) или `Cmd+,` (Mac).
2. Введите в поиске `dbt`. На этой странице вы сможете настроить параметры расширения под свои нужды.

<Lightbox src="/img/docs/extension/dbt-extension-settings.png" width="70%" title="Настройки dbt extension в настройках VS Code." />

## Известные ограничения {#known-limitations}

Ниже перечислены известные на данный момент ограничения dbt extension:

- **Remote development:** расширение dbt пока не поддерживает удалённые сессии разработки по SSH. Поддержка будет добавлена в одном из будущих релизов. Подробнее об удалённой разработке см. в [Supporting Remote Development and GitHub Codespaces](https://code.visualstudio.com/api/advanced-topics/remote-extensions) и [Visual Studio Code Server](https://code.visualstudio.com/docs/remote/vscode-server).

- **Работа с YAML-файлами:** на текущий момент существуют следующие ограничения при работе с YAML:
  - Go-to-definition не поддерживается для узлов, определённых в YAML-файлах (например, snapshots).
  - Переименование моделей и колонок не обновляет ссылки в YAML-файлах.
  - В будущих релизах dbt extension эти ограничения будут устранены.

- **Переименование моделей:** при переименовании файла модели расширение dbt вносит правки, обновляя все вызовы `ref()`, которые ссылаются на переименованную модель. Из‑за ограничений Language Server Client в VS Code расширение не может автоматически сохранять изменённые файлы. В результате после переименования модели в проекте могут появиться ошибки компиляции. Чтобы их исправить, необходимо либо вручную сохранить каждый файл, изменённый расширением dbt, либо выбрать **File** --> **Save All**, чтобы сохранить все изменённые файлы.

- **Использование Agent mode в Cursor:** при использовании dbt extension в Cursor визуализация lineage корректно работает в режиме Editor и не отображается в Agent mode. Если вы работаете в Agent mode и вам нужно посмотреть lineage, переключитесь в Editor mode, чтобы получить доступ ко всем возможностям вкладки lineage.

## Поддержка {#support}

Клиенты dbt platform могут обратиться в службу поддержки dbt Labs по адресу [support@getdbt.com](mailto:support@getdbt.com). Также вы можете связаться с нами напрямую через вашего Account Manager.

Для организаций, которые не являются клиентами dbt platform, лучшим местом для вопросов и обсуждений является [dbt Community Slack](https://www.getdbt.com/community/join-the-community).

Мы будем рады вашему фидбэку и предложениям, так как постоянно работаем над улучшением расширения!

Дополнительную информацию о поддержке и допустимом использовании dbt VS Code extension см. в нашем документе [Acceptable Use Policy](https://www.getdbt.com/dbt-assets/vscode-plugin-aup).

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
