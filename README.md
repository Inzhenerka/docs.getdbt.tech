<!-- статистика репозитория документации -->
[![Открытые issues](https://img.shields.io/github/issues/dbt-labs/docs.getdbt.com)](https://github.com/dbt-labs/docs.getdbt.com/issues)
[![Открытые PR](https://img.shields.io/github/issues-pr/dbt-labs/docs.getdbt.com)](https://github.com/dbt-labs/docs.getdbt.com/pulls)
[![Всего страниц документации](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fmirnawong1%2F618181e9b63cd72035c4eef203705cec%2Fraw%2Fdocs_total.json&cacheSeconds=0)](https://docs.getdbt.com)
[![Slack](https://img.shields.io/badge/Slack-Присоединиться%20к%20сообществу%20dbt-4A154B?logo=slack&logoColor=white)](https://docs.getdbt.com/community/join)

_Мы используем [docusaurus](https://v2.docusaurus.io/) для сайта [docs.getdbt.com](https://docs.getdbt.com/)._


#### Содержание

- [Кодекс поведения](#кодекс-поведения)
- [Вклад в проект](#вклад-в-проект)
- [Написание документации](#написание-документации)
  - [SME- и редакторские ревью](#sme--и-редакторские-ревью)
  - [Версионирование и single-sourcing контента](#версионирование-и-single-sourcing-контента)
  - [Добавление табов на страницу](#добавление-табов-на-страницу)
- [Локальный запуск сайта документации](#локальный-запуск-сайта-документации)
  - [Предварительные требования](#предварительные-требования)

# Кодекс поведения

Пожалуйста, ознакомьтесь с [кодексом поведения](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/contributor-code-of-conduct.md) для участников документации dbt.
Создание инклюзивной и справедливой среды для нашей документации важнее любого другого аспекта. Синтаксические ошибки можно исправить, но доверие, однажды потерянное, очень трудно вернуть.

# Вклад в проект

Мы приветствуем вклад членов сообщества в этот репозиторий:
- **Исправления**: если вы заметили ошибку, вы можете использовать кнопку `Edit this page` внизу каждой страницы, чтобы предложить правку.
- **Новая документация**: если вы внесли вклад в код [dbt-core](https://github.com/dbt-labs/dbt-core), мы рекомендуем также написать документацию здесь! Обратитесь в сообщество dbt, если нужна помощь, чтобы найти подходящее место для этих материалов.
- **Крупные переработки**: вы можете [создать issue](https://github.com/dbt-labs/docs.getdbt.com/issues/new/choose), чтобы предложить идеи для раздела документации, который требует внимания.

Вы можете использовать компоненты, описанные в [библиотеке docusaurus](https://v2.docusaurus.io/docs/markdown-features/).

# Написание документации

Документация dbt Labs написана на Markdown и иногда на HTML. При написании материалов ориентируйтесь на [style guide](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-style-guide.md) и [типы контента](/contributing/content-types.md), чтобы понимать наши стандарты и то, как мы структурируем информацию в продуктовой документации.

## SME- и редакторские ревью

Все PR, которые отправляются, будут проверены командой документации dbt Labs на предмет редакторского качества.

Контент, который отправляют пользователи и open-source сообщество, также проходит проверку у наших subject matter experts (SME), чтобы обеспечить техническую корректность.


## Версионирование и single-sourcing контента

Теперь вы можете переиспользовать контент между разными страницами документации и версиями, а также задавать product variables в документации dbt Labs. Подробнее о том, как организовать single-sourcing контента между версиями, product variables и другим контентом, см. [Single-sourcing content](/contributing/single-sourcing-content.md).

## Добавление табов на страницу

Вы можете добавлять сниппеты кода и другой контент в виде табов. Подробнее см. [Adding page components](/contributing/adding-page-components.md).

# Локальный запуск сайта документации

Вы можете перейти по ссылке из комментария Vercel bot в PR, чтобы посмотреть ваши изменения на staging-сервере. Также вы можете просматривать предлагаемые правки локально на своем компьютере. В наших инструкциях для настройки используется [homebrew](https://brew.sh/):

## Предварительные требования

* (Mac Terminal) Установите [Xcode Command Line Tools](https://developer.apple.com/download/more/)
  - Откройте терминал, выполните `xcode-select --install` и следуйте инструкциям в появившемся окне.
* (Mac и Linux) Установите [homebrew](https://brew.sh/)
  - Скопируйте и вставьте `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` в терминал и следуйте инструкциям. После завершения установки выполните шаги **Next Steps**, которые терминал выведет в конце.
* (Windows) Установите [Node.js](https://nodejs.org/en/download/)

1. (только для Mac и Linux) Установите `node`: `brew install node`
2. Склонируйте репозиторий: `git clone https://github.com/dbt-labs/docs.getdbt.com.git`
3. Перейдите в репозиторий: `cd docs.getdbt.com`
4. Перейдите в поддиректорию `website`: `cd website`
5. Установите необходимые node-пакеты: `make install` или `bun install` (опционально &mdash; установить обновления)
6. Запустите сайт: `make run` или `bun start`
7. Перед тем как пушить изменения в ветку, запустите `make build` или `bun run build` и проверьте, что все ссылки работают

Примечание:
- Если при запуске `bun install` вы получаете ошибку `fatal error: 'vips/vips8' file not found`, возможно, нужно выполнить `brew install vips`. Предупреждение: это займет время — можно пойти за кофе!
