---
title: "Проверка совместимости версий"
id: "version-compatibility"
sidebar: "Совместимость версий"
---

В первые несколько лет разработки <Constant name="core" /> ломающие изменения появлялись довольно часто. По этой причине мы рекомендовали указывать [требования к версии dbt](/reference/project-configs/require-dbt-version) &mdash; особенно если проект использует функции, которые появились недавно или могут измениться в будущих версиях <Constant name="core" />. По умолчанию, если вы запускаете проект с несовместимой версией dbt, dbt выдаст ошибку.

Вы можете использовать конфигурацию `VERSION_CHECK`, чтобы отключить эту проверку и подавить сообщение об ошибке:

```
$ dbt run --no-version-check
Running with dbt=1.0.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

:::note <Constant name="cloud" /> каналы релизов
<Snippet path="_config-dbt-version-check" />

:::