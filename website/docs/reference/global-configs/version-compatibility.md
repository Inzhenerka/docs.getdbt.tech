---
title: "Проверка совместимости версий"
id: "version-compatibility"
sidebar: "Совместимость версий"
---

В первые несколько лет разработки dbt Core изменения, нарушающие совместимость, были более частыми. По этой причине мы рекомендовали устанавливать [требования к версии dbt](/reference/project-configs/require-dbt-version) &mdash; особенно если используются функции, которые являются новыми или могут измениться в будущих версиях dbt Core. По умолчанию, если вы запускаете проект с несовместимой версией dbt, dbt выдаст ошибку.

Вы можете использовать конфигурацию `VERSION_CHECK`, чтобы отключить эту проверку и подавить сообщение об ошибке:

```
dbt --no-version-check run
Running with dbt=1.0.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

:::info Выпуски dbt Cloud
<Snippet path="_config-dbt-version-check" />

:::