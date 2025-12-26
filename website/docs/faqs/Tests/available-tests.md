---
title: Какие тесты данных доступны для использования в dbt?
description: "Типы тестов данных, которые можно использовать в dbt"
sidebar_label: 'Доступные тесты данных в dbt'
id: available-tests

---
«Из коробки» dbt поставляется со следующими тестами данных:

* `unique`
* `not_null`
* `accepted_values`
* `relationships` (т.е. ссылочная целостность)

Вы также можете написать свои собственные [пользовательские тесты схемы данных](/docs/build/data-tests).

Некоторые дополнительные пользовательские schema tests были выложены в open source в пакете [dbt-utils](https://github.com/dbt-labs/dbt-utils?#generic-tests). Ознакомьтесь с документацией по [packages](/docs/build/packages), чтобы узнать, как сделать эти тесты доступными в вашем проекте.

Обратите внимание, что на данный момент документировать data tests нельзя, однако мы рекомендуем посмотреть [это обсуждение <Constant name="core" />](https://github.com/dbt-labs/dbt-core/issues/2578), где сообщество dbt делится идеями и предложениями.
