---
title: Какие конфигурации моделей существуют?
description: "Изучение конфигураций моделей"
sidebar_label: 'Конфигурации моделей'
id: available-configurations
---
Вы также можете настроить:

* [теги](/reference/resource-configs/tags) для удобной категоризации и выбора графиков
* [пользовательские схемы](/reference/resource-properties/schema) для распределения ваших моделей по нескольким схемам
* [псевдонимы](/reference/resource-configs/alias), если ваше <Term id="view" />/<Term id="table" /> имя должно отличаться от имени файла
* Фрагменты SQL, которые выполняются в начале или в конце модели, известные как [хуки](/docs/build/hooks-operations)
* Конфигурации, специфичные для склада, для повышения производительности (например, `sort` и `dist` ключи на Redshift, `partitions` на BigQuery)

Посмотрите документацию о [конфигурациях моделей](/reference/model-configs), чтобы узнать больше.