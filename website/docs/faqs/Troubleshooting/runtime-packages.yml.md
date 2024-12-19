---
title: Почему я получаю ошибку времени выполнения в своих пакетах?
description: "Обновите пакет dbt_utils в файле packages.yml"
sidebar_label: 'Ошибка времени выполнения в файле packages.yml'
id: runtime-packages.yml

---

Если вы получаете ошибку времени выполнения, приведенную ниже, в вашей папке packages.yml, это может быть связано со старой версией вашего пакета dbt_utils, которая несовместима с вашей текущей версией dbt Cloud.

```shell
Running with dbt=xxx
Runtime Error
  Failed to read package: Runtime Error
    Invalid config version: 1, expected 2  
  Error encountered in dbt_utils/dbt_project.yml
  ```

Попробуйте обновить старую версию пакета dbt_utils в вашем файле packages.yml до последней версии, найденной на [dbt hub](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/):

```shell
packages:
- package: dbt-labs/dbt_utils

version: xxx
```

Если вы попробовали предложенное решение и все еще испытываете эту проблему, свяжитесь с командой поддержки по адресу support@getdbt.com, и мы будем рады помочь!