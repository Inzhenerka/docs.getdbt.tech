---
title: dispatch (конфигурация)
description: "Прочитайте это руководство, чтобы понять конфигурацию dispatch в dbt."
datatype: list
required: False
---

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: packagename
    search_order: [packagename]
  - macro_namespace: packagename
    search_order: [packagename]
```

</File>

## Определение

Опционально переопределите [dispatch](/reference/dbt-jinja-functions/dispatch) местоположения поиска для макросов в определенных пространствах имен. Если не указано, `dispatch` по умолчанию сначала будет искать в вашем корневом проекте, а затем искать реализации в пакете, названном `macro_namespace`.

## Примеры

Я хочу "подменить" пакет `dbt_utils` с пакетом совместимости `spark_utils`.

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['spark_utils', 'dbt_utils']
```

</File>

Я повторно реализовал определенные макросы из пакета `dbt_utils` в своем корневом проекте (`'my_root_project'`), и я хочу, чтобы мои версии имели приоритет. В противном случае следует использовать версии из `dbt_utils`.

_Примечание: Это поведение по умолчанию. Вы можете опционально выбрать явное выражение этого порядка поиска следующим образом:_

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_root_project', 'dbt_utils']
```

</File>