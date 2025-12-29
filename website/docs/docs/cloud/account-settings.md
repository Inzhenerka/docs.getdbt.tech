---
title: "Настройки аккаунта в dbt"
sidebar_label: "Настройки аккаунта" 
description: "Узнайте, как включить и настроить параметры аккаунта для пользователей dbt."
---

В следующих разделах описаны различные **настройки аккаунта**, доступные в вашем аккаунте <Constant name="cloud" /> в боковой панели (под именем вашего аккаунта в нижней левой части интерфейса).

<Lightbox src="/img/docs/dbt-cloud/example-sidebar-account-settings.png" title="Пример настроек аккаунта из боковой панели" />

## Кэширование Git-репозитория <Lifecycle status="managed,managed_plus" />

:::important Кеширование репозитория включено по умолчанию

Кэширование <Constant name="git" />‑репозитория включено по умолчанию для всех новых аккаунтов Enterprise и Enterprise+, что повышает надежность за счет возможности <Constant name="cloud" /> использовать кэшированную копию репозитория, если операция клонирования завершилась неудачей.

Подробнее о кэшировании репозитория, сроках хранения и других деталях см. в следующем разделе.
:::

В начале каждого запуска [job](/docs/deploy/jobs) <Constant name="cloud" /> клонирует Git‑репозиторий проекта, чтобы получить самые актуальные версии кода проекта, а затем выполняет `dbt deps` для установки зависимостей.

Для повышения надежности и производительности запусков вы можете включить сохранение кэша <Constant name="cloud" /> для <Constant name="git" />‑репозитория проекта. В этом случае, если из‑за сбоя у стороннего сервиса операция клонирования не удастся, <Constant name="cloud" /> вместо этого использует кэшированную копию репозитория, и ваши задания продолжат выполняться по расписанию.

<Constant name="cloud" /> сохраняет кэш <Constant name="git" />‑репозитория проекта после каждого успешного запуска и хранит его в течение 8 дней при отсутствии обновлений репозитория. Кэшируются все пакеты независимо от способа их установки, и код не загружается вне запусков заданий.

<Constant name="cloud" /> использует кэшированную копию <Constant name="git" />‑репозитория проекта в следующих случаях:

- Сбои у сторонних сервисов (например, [dbt package hub](https://hub.getdbt.com/)).
- Сбой аутентификации <Constant name="git" />.
- Наличие синтаксических ошибок в файле `packages.yml`. Вы можете настроить и использовать [continuous integration (CI)](/docs/deploy/continuous-integration), чтобы выявлять такие ошибки раньше.
- Если пакет несовместим с текущей версией dbt. Вы можете настроить и использовать [continuous integration (CI)](/docs/deploy/continuous-integration), чтобы обнаруживать эту проблему раньше.
- Обратите внимание: кэширование <Constant name="git" />‑репозитория не следует использовать для CI‑заданий. CI‑задания предназначены для тестирования последних изменений кода в pull request и проверки актуальности кода. Использование кэшированной копии репозитория в CI‑заданиях может привести к тестированию устаревшего кода.

Чтобы использовать, выберите опцию **Enable repository caching** в настройках вашего аккаунта.

<Lightbox src="/img/docs/deploy/account-settings-repository-caching.png" width="85%" title="Пример опции Enable repository caching" />

## Частичный парсинг

В начале каждого вызова dbt читает все файлы в вашем проекте, извлекает информацию и создает внутренний манифест, содержащий каждый объект (модель, источник, макрос и так далее). Среди прочего, он использует вызовы макросов `ref()`, `source()` и `config()` внутри моделей для установки свойств, определения зависимостей и построения DAG вашего проекта. Когда dbt завершает парсинг вашего проекта, он сохраняет внутренний манифест в файле под названием `partial_parse.msgpack`.

Парсинг проектов может занимать значительное время, особенно для крупных проектов с сотнями моделей и тысячами файлов. Чтобы сократить время, которое dbt тратит на парсинг вашего проекта, используйте функцию частичного парсинга в <Constant name="cloud" /> для вашего окружения. Когда она включена, <Constant name="cloud" /> использует файл `partial_parse.msgpack`, чтобы определить, какие файлы изменились (если изменились) с момента последнего парсинга проекта, и затем парсит **только** изменённые файлы и файлы, связанные с этими изменениями.

Частичный парсинг в <Constant name="cloud" /> требует dbt версии 1.4 или новее. У этой функции есть некоторые известные ограничения. Подробнее о них см. в разделе [Known limitations](/reference/parsing#known-limitations).

Чтобы использовать, выберите опцию **Enable partial parsing between deployment runs** в настройках вашего аккаунта.

<Lightbox src="/img/docs/deploy/account-settings-partial-parsing.png" width="85%" title="Пример опции Enable partial parsing between deployment runs" />

## Доступ к аккаунту и включение функций

### Включение dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> 

[<Constant name="copilot" />](/docs/cloud/dbt-copilot) — это AI‑ассистент, полностью интегрированный в работу с dbt и предназначенный для ускорения аналитических рабочих процессов.

Чтобы использовать эту функцию, администратор вашего аккаунта <Constant name="cloud" /> должен включить <Constant name="copilot" /> на уровне аккаунта, выбрав опцию **Enable account access to dbt Copilot features** в настройках аккаунта. Подробнее см. в разделе [Enable dbt Copilot](/docs/cloud/enable-dbt-copilot).

### Включение функций Advanced CI <Lifecycle status="managed,managed_plus" />

Функции [Advanced CI](/docs/deploy/advanced-ci), такие как [compare changes](/docs/deploy/advanced-ci#compare-changes), позволяют участникам аккаунта <Constant name="cloud" /> просматривать подробную информацию об изменениях между продакшн‑окружением и pull request.

Чтобы использовать функции Advanced CI, ваш аккаунт <Constant name="cloud" /> должен иметь к ним доступ. Попросите администратора вашего аккаунта <Constant name="cloud" /> включить функции Advanced CI — это можно сделать, выбрав опцию **Enable account access to Advanced CI** в настройках аккаунта.

После включения опция **dbt compare** становится доступной в настройках CI задания для выбора.

<Lightbox src="/img/docs/deploy/account-settings-advanced-ci.png" width="85%" title="Опция Enable account access to Advanced CI" />

### Включение dbt Catalog <Lifecycle status='self_service,managed,managed_plus' /> <Lifecycle status="preview" />

[<Constant name="explorer" />](/docs/explore/explore-projects) позволяет просматривать ресурсы вашего проекта (например, модели, тесты и метрики), их lineage, а также использование моделей, чтобы лучше понимать текущее состояние продакшена вашего проекта.

Чтобы включить dbt <Constant name="explorer" />, требуется [лицензия разработчика с правами Owner](/docs/cloud/manage-access/about-user-access#role-based-access-control). Включите <Constant name="explorer" /> в своей учетной записи, выбрав опцию **Enable dbt Catalog’s (formerly dbt Explorer) New Navigation** в настройках аккаунта. Подробнее см. [обзор Catalog](/docs/explore/explore-projects#catalog-overview).

Вы можете загружать [внешние метаданные](/docs/explore/external-metadata-ingestion) в <Constant name="explorer" />, подключаясь напрямую к вашему хранилищу данных. Это позволяет просматривать таблицы и другие активы, которые не определены в dbt. В настоящее время загрузка внешних метаданных поддерживается только для Snowflake.

Для использования загрузки внешних метаданных вы должны быть [администратором аккаунта](/docs/cloud/manage-access/enterprise-permissions#account-admin) с правами на редактирование подключений. Включите <Constant name="explorer" /> в своей учетной записи, выбрав опцию **Ingest external metadata in dbt Catalog (formerly dbt Explorer)** в настройках аккаунта. Подробнее см. [Enable external metadata ingestion](/docs/explore/external-metadata-ingestion#enable-external-metadata-ingestion).

## История настроек проекта

Вы можете просматривать историю изменений настроек проекта за последние 90 дней.

Чтобы посмотреть историю изменений:
1. Нажмите на имя своей учетной записи внизу левого меню и выберите **Account settings**.
2. Нажмите **Projects**.
3. Выберите **project name**.
4. Нажмите **History**.

<Lightbox src="/img/docs/deploy/project-history.png" width="85%" title="Пример опции project history." />
