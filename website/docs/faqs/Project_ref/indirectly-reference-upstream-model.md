---
title: Почему косвенно используемая upstream public модель не отображается в Explorer?
sidebar_label: Косвенно используемая upstream модель
id: indirectly-reference-upstream-model
description: Узнайте, почему косвенно используемые upstream public модели не отображаются в Explorer
---

Для [зависимостей между проектами](/docs/mesh/govern/project-dependencies) в <Constant name="mesh" /> [<Constant name="catalog" />](/docs/explore/explore-multiple-projects) отображает только те [публичные модели](/docs/mesh/govern/model-access) из вышестоящих проектов, на которые есть прямые ссылки, даже если модель из вышестоящего проекта косвенно зависит от другой публичной модели.

Например, если:

- `project_b` добавляет `project_a` как зависимость
- модель `downstream_c` в `project_b` ссылается на `project_a.upstream_b`
- `project_a.upstream_b` ссылается на другую публичную модель — `project_a.upstream_a`

Тогда:

- В Explorer отображаются только публичные модели, на которые есть прямые ссылки (в данном случае — `upstream_b`).
- Однако в представлении графа зависимостей в [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) `upstream_a` (косвенная зависимость) _будет_ отображаться, поскольку <Constant name="dbt" /> динамически определяет полный граф зависимостей.

Такое поведение гарантирует, что <Constant name="catalog" /> показывает только непосредственные зависимости, доступные конкретному проекту.
