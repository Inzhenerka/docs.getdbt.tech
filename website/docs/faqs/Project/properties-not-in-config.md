---
```yaml
title: Можно ли добавлять тесты и описания в SQL config-блоке?
description: "Типы свойств, определяемых в SQL config-блоках"
sidebar_label: 'Типы свойств, определяемых в config-блоках'
```
id: properties-not-in-config

---

dbt умеет задавать конфигурацию узлов в YAML-файлах, в дополнение к блокам `config()` и файлу `dbt_project.yml`. Однако обратное верно не всегда: есть некоторые вещи в `.yml` файлах, которые можно определить _только_ там.

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
