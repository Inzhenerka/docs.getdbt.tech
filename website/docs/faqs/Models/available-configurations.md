---
title: Какие существуют конфигурации моделей?
description: "Изучение конфигураций моделей"
sidebar_label: 'Конфигурации моделей'
id: available-configurations
---
Вы также можете настроить:

* [теги](/reference/resource-configs/tags) для поддержки легкой категоризации и выбора графа
* [пользовательские схемы](/reference/resource-properties/schema) для разделения ваших моделей по нескольким схемам
* [алиасы](/reference/resource-configs/alias), если имя вашего <Term id="view" />/<Term id="table" /> должно отличаться от имени файла
* Фрагменты SQL, которые выполняются в начале или в конце модели, известные как [хуки](/docs/build/hooks-operations)
* Конфигурации, специфичные для хранилища, для повышения производительности (например, ключи `sort` и `dist` на Redshift, `partitions` на BigQuery)

Ознакомьтесь с документацией по [конфигурациям моделей](/reference/model-configs), чтобы узнать больше.