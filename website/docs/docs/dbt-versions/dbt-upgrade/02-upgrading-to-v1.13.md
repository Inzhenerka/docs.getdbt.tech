---
title: "Обновление до v1.13"
id: upgrading-to-v1.13
description: Новые возможности и изменения в dbt v1.13
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---

# Обновление до v1.13 <Lifecycle status="beta" />

## Ресурсы
- [Список изменений dbt v1.13](https://github.com/dbt-labs/dbt/blob/1.13.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/local/install-dbt)
- [Руководство по обновлению платформы dbt](/docs/dbt-versions/upgrade-dbt-platform-version)

## Что нужно знать перед обновлением

:::info
Для dbt v1.13 требуется Python 3.11 или более поздней версии. Python 3.10 больше не поддерживается. Полную матрицу совместимости см. в разделе [Какую версию Python можно использовать?](/faqs/Core/install-python-compatibility).
:::

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x. Любые изменения поведения будут сопровождаться [флагом изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags), чтобы предоставить время для миграции существующих проектов. Если при обновлении возникнет ошибка, сообщите нам об этом, [создав issue](https://github.com/dbt-labs/dbt/issues/new).

<Constant name="dbt" /> предоставляет функциональность новых версий <Constant name="core" /> через [каналы выпуска](/docs/dbt-versions/dbt-release-tracks) с автоматическими обновлениями. Если в <Constant name="dbt" /> выбран канал выпуска **v1 Latest**, вам уже доступны все возможности, исправления и другая функциональность последней версии <Constant name="core" />! Если выбран канал выпуска **v1 Compatible**, они станут доступны в следующем ежемесячном выпуске **v1 Compatible** после выхода финальной версии dbt v1.13.

## Новые и изменённые возможности и функциональность

### dbt State

[dbt State](/docs/deploy/dbt-state-about) помогает dbt более обоснованно определять, какие узлы нужно перестраивать: вместо перестроения каждого узла при каждом запуске dbt повторно использует узлы, клонируя их из другого расположения или пропуская перестроение, если логика и данные не изменились. dbt State встроен в dbt v1.13. Чтобы начать работу, см. раздел [Настройка dbt State](/docs/deploy/dbt-state-setup).

## Возможности и функциональность отдельных адаптеров

### Snowflake

- Если [`copy_grants`](/reference/resource-configs/snowflake-configs#copying-grants) имеет значение `false` или не задан, `dbt-snowflake` добавляет `IGNORE GRANTS` в команды `CREATE OR REPLACE` для таблиц, представлений и клонов. Это сохраняет прежнее поведение по умолчанию без копирования прав доступа после [изменения обработки прав доступа в CREATE OR REPLACE в Snowflake](https://docs.snowflake.com/en/release-notes/bcr-bundles/2026_08/bcr-2433). Установите `copy_grants: true`, если вместо этого требуется использовать `COPY GRANTS`. Поведение динамических таблиц не изменилось.
