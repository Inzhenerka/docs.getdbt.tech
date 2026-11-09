---
title: Можно ли определять приватные пакеты в файле dependencies.yml?
sidebar_label: Определение приватных пакетов
id: define-private-packages
description: Узнайте, как определять приватные пакеты в вашем проекте
---

Это зависит от того, каким способом вы получаете доступ к приватным пакетам:

- Если вы используете [встроенную поддержку приватных пакетов](/docs/build/packages#native-private-packages), их можно определить в файле `dependencies.yml`.
- Если вы используете [метод с Git-токеном](/docs/build/packages#git-token-method), в <Constant name="core" /> используйте `packages.yml`, поскольку Jinja не поддерживается в `dependencies.yml`. В <Constant name="fusion_engine" /> можно использовать `dependencies.yml`, но мы рекомендуем использовать `packages.yml`, если ваш проект должен также работать в <Constant name="core" />. См. [Поддержка Jinja по типам файлов](/reference/jinja-file-support).
