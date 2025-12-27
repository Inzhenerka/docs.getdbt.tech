---
title: Можно ли определять приватные пакеты в файле dependencies.yml?
sidebar_label: Определение приватных пакетов
id: define-private-packages
description: Узнайте, как определять приватные пакеты в вашем проекте
---

Это зависит от того, каким способом вы получаете доступ к приватным пакетам:

- Если вы используете [нативные приватные пакеты](/docs/build/packages#native-private-packages), вы можете определять их в файле `dependencies.yml`.
- Если вы используете [метод с git-токеном](/docs/build/packages#git-token-method), вы должны определять их в файле `packages.yml`, а не в `dependencies.yml`. Это связано с тем, что условный рендеринг (например, Jinja в YAML) не поддерживается в `dependencies.yml`.
