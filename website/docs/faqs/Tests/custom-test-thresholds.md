---
title: Могу ли я установить пороги для неудач тестов?
description: "Используйте конфигурации для установки пользовательских порогов неудач в тестах"
sidebar_label: 'Как установить пороги неудач в тестах'
id: custom-test-thresholds

---

Вы можете использовать конфигурации `error_if` и `warn_if`, чтобы установить пользовательские пороги неудач в ваших тестах. Для получения дополнительной информации смотрите [справку](/reference/resource-configs/severity).

Вы также можете попробовать следующие решения:

* Установить [severity](/reference/resource-properties/data-tests#severity) на `warn`, или:
* Написать [пользовательский общий тест](/best-practices/writing-custom-generic-tests), который принимает аргумент порога ([пример](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966))