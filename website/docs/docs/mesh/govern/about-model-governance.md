---
title: "О governance моделей"
id: about-model-governance
description: "Информация о новых возможностях, связанных с governance моделей"
pagination_next: "docs/mesh/govern/model-access"
pagination_prev: null
hide_table_of_contents: true
---

dbt поддерживает управление моделями, позволяя контролировать, кто может получать доступ к моделям, какие данные они содержат, как они меняются со временем и как на них ссылаются из других проектов. Управление моделями поддерживается в <Constant name="core" /> и на <Constant name="dbt_platform" />, при этом набор доступных функций зависит от среды и тарифного плана.

- Используйте управление моделями, чтобы определять структуру и видимость моделей в <Constant name="core" /> и на <Constant name="dbt_platform" />.
- <Constant name="dbt" /> расширяет эти возможности такими функциями, как [межпроектные ссылки ref](/docs/mesh/govern/project-dependencies), которые позволяют масштабировать совместную работу над несколькими проектами благодаря сервису метаданных и [<Constant name="catalog" />](/docs/explore/explore-projects). Эти функции доступны в тарифных планах <Constant name="dbt" /> Enterprise или Enterprise+.

Все перечисленные ниже функции доступны в <Constant name="core" /> и на <Constant name="dbt_platform" />, _за исключением_ зависимостей между проектами, которые доступны только в [тарифных планах <Constant name="dbt" /> уровня Enterprise](https://www.getdbt.com/pricing).

- [**Model access**](/docs/mesh/govern/model-access) &mdash; Помечайте модели как «public» или «private», чтобы отличать зрелые data-продукты от деталей реализации, а также контролировать, кто может вызывать `ref` для каждой модели.  
- [**Model contracts**](/docs/mesh/govern/model-contracts) &mdash; Гарантируйте форму модели (имена колонок, типы данных, ограничения) ещё до её сборки, чтобы избежать неожиданных изменений для downstream-потребителей данных.  
- [**Model versions**](/docs/mesh/govern/model-versions) &mdash; Когда ломающие изменения неизбежны, предоставляйте более плавный путь обновления и период депрекации для downstream-потребителей данных.  
- [**Model namespaces**](/reference/dbt-jinja-functions/ref#ref-project-specific-models) &mdash; Организуйте модели в [groups](/docs/build/groups) и [packages](/docs/build/packages), чтобы обозначить границы ответственности. Модели в разных пакетах могут иметь одинаковые имена, а функция `ref` может принимать пространство имён проекта или пакета в качестве первого аргумента.  
- [**Project dependencies**](/docs/mesh/govern/project-dependencies) &mdash; Разрешайте ссылки на public-модели в других проектах («cross-project ref») с помощью постоянно работающего stateful-сервиса метаданных, вместо импорта всех моделей из этих проектов в виде пакетов. Каждый проект предоставляет data-продукты (публичные ссылки на модели), при этом управляя собственными деталями реализации, что позволяет реализовать [enterprise data mesh](/best-practices/how-we-mesh/mesh-1-intro). <Lifecycle status="managed,managed_plus"/>

import DataFreshnessSLATip from '/snippets/_data-freshness-sla-tip.md';
import ModelGovernanceRollback from '/snippets/_model-governance-rollback.md';

<DataFreshnessSLATip />

<ModelGovernanceRollback />
