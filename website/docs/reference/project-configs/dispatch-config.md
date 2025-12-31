---
title: dispatch (config)
description: "Прочтите это руководство, чтобы понять конфигурацию dispatch в dbt."
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

## Определение {#definition}

При необходимости переопределите [dispatch](/reference/dbt-jinja-functions/dispatch) пути поиска для макросов в определенных пространствах имен. Если не указано, `dispatch` будет искать сначала в вашем корневом проекте по умолчанию, а затем искать реализации в пакете, указанном в `macro_namespace`.

## Примеры {#examples}

Я хочу "заменить" пакет `dbt_utils` на пакет совместимости `spark_utils`.

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['spark_utils', 'dbt_utils']
```

</File>

Я переопределил некоторые макросы из пакета `dbt_utils` в моем корневом проекте (`'my_root_project'`), и я хочу, чтобы мои версии имели приоритет. В противном случае, использовать версии из `dbt_utils`.

_Примечание: Это поведение по умолчанию. Вы можете дополнительно выбрать явное указание порядка поиска следующим образом:_

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_root_project', 'dbt_utils']
```

</File>