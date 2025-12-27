---
title: "О governance моделей"
id: about-model-governance
description: "Информация о новых возможностях, связанных с governance моделей"
pagination_next: "docs/mesh/govern/model-access"
pagination_prev: null
hide_table_of_contents: true
---

dbt поддерживает model governance, чтобы помочь вам контролировать, кто может получать доступ к моделям, какие данные они содержат, как они изменяются со временем и как на них можно ссылаться между проектами. Поддержка model governance доступна в dbt Core и в <Constant name="dbt_platform" />, с некоторыми различиями в доступных возможностях в зависимости от среды и тарифного плана.

- Используйте model governance, чтобы определять структуру моделей и их видимость в dbt Core и <Constant name="dbt_platform" />.
- <Constant name="cloud" /> развивает эти возможности, добавляя такие функции, как [cross-project ref](/docs/mesh/govern/project-dependencies), которые позволяют масштабно сотрудничать между несколькими проектами благодаря сервису метаданных и [<Constant name="explorer" />](/docs/explore/explore-projects). Доступно в тарифных планах <Constant name="cloud" /> Enterprise или Enterprise+.

Все перечисленные ниже возможности доступны в dbt Core и <Constant name="dbt_platform" />, _за исключением_ project dependencies, которые доступны только для [тарифных планов <Constant name="cloud" /> уровня Enterprise](https://www.getdbt.com/pricing).

- [**Model access**](model-access) &mdash; Помечайте модели как «public» или «private», чтобы отличать зрелые data-продукты от деталей реализации, а также контролировать, кто может вызывать `ref` для каждой модели.  
- [**Model contracts**](model-contracts) &mdash; Гарантируйте форму модели (имена колонок, типы данных, ограничения) ещё до её сборки, чтобы избежать неожиданных изменений для downstream-потребителей данных.  
- [**Model versions**](model-versions) &mdash; Когда ломающие изменения неизбежны, предоставляйте более плавный путь обновления и период депрекации для downstream-потребителей данных.  
- [**Model namespaces**](/reference/dbt-jinja-functions/ref#ref-project-specific-models) &mdash; Организуйте модели в [groups](/docs/build/groups) и [packages](/docs/build/packages), чтобы обозначить границы ответственности. Модели в разных пакетах могут иметь одинаковые имена, а функция `ref` может принимать пространство имён проекта или пакета в качестве первого аргумента.  
- [**Project dependencies**](/docs/mesh/govern/project-dependencies) &mdash; Разрешайте ссылки на public-модели в других проектах («cross-project ref») с помощью постоянно работающего stateful-сервиса метаданных, вместо импорта всех моделей из этих проектов в виде пакетов. Каждый проект предоставляет data-продукты (публичные ссылки на модели), при этом управляя собственными деталями реализации, что позволяет реализовать [enterprise data mesh](/best-practices/how-we-mesh/mesh-1-intro). <Lifecycle status="managed,managed_plus"/>

import ModelGovernanceRollback from '/snippets/_model-governance-rollback.md';

<ModelGovernanceRollback />
