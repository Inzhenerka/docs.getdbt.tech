---
title: Могу ли я установить пороги срабатывания тестов?
description: "Используйте конфигурации для установки пользовательских порогов срабатывания в тестах"
sidebar_label: 'Как установить пороги срабатывания в тестах'
id: custom-test-thresholds

---

Вы можете использовать конфигурации `error_if` и `warn_if` для установки пользовательских порогов срабатывания в ваших тестах. Для получения более подробной информации, смотрите [справочник](/reference/resource-configs/severity).

Вы также можете попробовать следующие решения:

* Установка параметра [severity](/reference/resource-configs/severity) в значение `warn` или `error`
* Написание [пользовательского обобщённого теста](/best-practices/writing-custom-generic-tests), который принимает аргумент порога (threshold) ([пример](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966))
