---
title: Почему я получаю ошибку времени выполнения в моих пакетах?
description: "Обновите пакет dbt_utils в файле packages.yml"
sidebar_label: 'Ошибка времени выполнения в файле packages.yml'
id: runtime-packages.yml

---

Если вы получаете ошибку времени выполнения, показанную ниже, в вашем файле packages.yml, это может быть связано с устаревшей версией вашего пакета dbt_utils, которая не совместима с вашей текущей версией dbt Cloud.

```shell
Running with dbt=xxx
Runtime Error
  Failed to read package: Runtime Error
    Invalid config version: 1, expected 2  
  Error encountered in dbt_utils/dbt_project.yml
  ```

Попробуйте обновить старую версию пакета dbt_utils в вашем packages.yml до последней версии, доступной на [dbt hub](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/):

```shell
packages:
- package: dbt-labs/dbt_utils

version: xxx
```

Если вы попробовали описанное выше решение и все еще сталкиваетесь с этой проблемой, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!