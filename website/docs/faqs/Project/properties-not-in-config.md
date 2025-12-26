---
title: Могу ли я добавлять тесты и описания в блок конфигурации?
description: "Типы свойств, определяемых в блоках конфигурации"
sidebar_label: 'Типы свойств, определяемых в блоках конфигурации'
id: properties-not-in-config

---

dbt позволяет определять конфигурации узлов в файлах `.yml`, в дополнение к блокам `config()` и `dbt_project.yml`. Но обратное не всегда верно: есть вещи в файлах `.yml`, которые могут быть определены _только_ там.

Некоторые свойства особенные, потому что:
- У них уникальный контекст рендеринга Jinja
- Они создают новые ресурсы проекта
- Они не имеют смысла как иерархическая конфигурация
- Это более старые свойства, которые еще не были переопределены как конфигурации

Эти свойства:
- [`description`](/reference/resource-properties/description)
- [`tests`](/reference/resource-properties/data-tests)
- [`docs`](/reference/resource-configs/docs)
- `columns`
- [`quote`](/reference/resource-properties/columns#quote)
- свойства [`source`](/reference/source-properties) (например, `loaded_at_field`, `freshness`)
- свойства [`exposure`](/reference/exposure-properties) (например, `type`, `maturity`)
- свойства [`macro`](/reference/resource-properties/arguments) (например, `arguments`)
