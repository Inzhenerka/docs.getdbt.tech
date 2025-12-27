---
title: Почему косвенно используемая upstream public модель не отображается в Explorer?
sidebar_label: Косвенно используемая upstream модель
id: indirectly-reference-upstream-model
description: Узнайте, почему косвенно используемые upstream public модели не отображаются в Explorer
---

Для [зависимостей проекта](/docs/mesh/govern/project-dependencies) в <Constant name="mesh" /> [<Constant name="explorer" />](/docs/explore/explore-multiple-projects) отображает **только напрямую используемые** [публичные модели](/docs/mesh/govern/model-access) из вышестоящих проектов, даже если модель из вышестоящего проекта косвенно зависит от другой публичной модели.

Например, если:

- `project_b` добавляет `project_a` как зависимость
- модель `downstream_c` в `project_b` ссылается на `project_a.upstream_b`
- `project_a.upstream_b` ссылается на другую публичную модель — `project_a.upstream_a`

Тогда:

- В Explorer отображаются только напрямую используемые публичные модели (в данном случае — `upstream_b`).
- В представлении lineage в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), однако, `upstream_a` (косвенная зависимость) **будет** отображаться, поскольку <Constant name="cloud" /> динамически разрешает полный граф зависимостей.

Такое поведение гарантирует, что <Constant name="explorer" /> показывает только непосредственные зависимости, доступные для конкретного проекта.
