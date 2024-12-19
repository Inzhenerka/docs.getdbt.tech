---
title: Могу ли я добавить тесты и описания в блок конфигурации?
description: "Типы свойств, определенных в блоках конфигурации"
sidebar_label: 'Типы свойств, определенных в блоках конфигурации'
id: properties-not-in-config

---

dbt имеет возможность определять конфигурации узлов в файлах `.yml`, помимо блоков `config()` и `dbt_project.yml`. Однако обратное не всегда верно: есть некоторые вещи в файлах `.yml`, которые могут _быть определены только там_.

Некоторые свойства являются особыми, потому что:
- У них уникальный контекст рендеринга Jinja
- Они создают новые ресурсы проекта
- Они не имеют смысла как иерархическая конфигурация
- Это более старые свойства, которые еще не были переопределены как конфигурации

Эти свойства:
- [`description`](/reference/resource-properties/description)
- [`tests`](/reference/resource-properties/data-tests)
- [`docs`](/reference/resource-configs/docs)
- `columns`
- [`quote`](/reference/resource-properties/quote)
- [`source` properties](/reference/source-properties) (например, `loaded_at_field`, `freshness`)
- [`exposure` properties](/reference/exposure-properties) (например, `type`, `maturity`)
- [`macro` properties](/reference/macro-properties) (например, `arguments`)