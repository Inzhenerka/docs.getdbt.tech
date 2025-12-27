---
title: volatility
sidebar_label: "volatility"
id: volatility
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      volatility: deterministic | stable | non-deterministic
```

</File>

## Определение

import VolatilityDefinition from '/snippets/_volatility-definition.md';

<VolatilityDefinition />

По умолчанию dbt не указывает значение volatility. Если вы не задаёте volatility, dbt генерирует оператор `CREATE` без ключевого слова volatility, и применяется поведение хранилища данных по умолчанию &mdash; за исключением Redshift.

В Redshift dbt по умолчанию устанавливает `non-deterministic` (`VOLATILE`), если volatility не указана, потому что Redshift требует явного указания volatility, а `VOLATILE` является самым безопасным предположением.

import Volatility from '/snippets/_warehouse-volatility.md';

<Volatility />

## Поддерживаемые типы volatility

В dbt для конфигурации `volatility` можно использовать следующие значения:

| Value | Description | Example |
| --- | --- | --- |
| `deterministic` | Всегда возвращает один и тот же результат для одинаковых входных данных. Безопасно для агрессивных оптимизаций и кэширования. | `substr()` &mdash; Возвращает одну и ту же подстроку при одинаковой строке и параметрах. |
| `stable` | Возвращает одно и то же значение в рамках одного выполнения запроса, но может изменяться между выполнениями. Поддерживается не всеми хранилищами. Подробнее см. [Warehouse-specific volatility keywords](/reference/resource-configs/volatility#warehouse-specific-volatility-keywords). | `now()` &mdash; Возвращает текущее время на момент начала запроса; остаётся постоянным в рамках одного запроса, но отличается между запусками. |
| `non-deterministic` | Может возвращать разные результаты для одинаковых входных данных. Хранилища не должны кэшировать или переупорядочивать вычисления, предполагая стабильный результат. | `first()` &mdash; Может возвращать разные строки в зависимости от плана запроса или порядка данных. <br></br>`random()` &mdash; Генерирует случайное число, которое меняется при каждом вызове, даже при одинаковых входных данных. |

## Пример

В этом примере используется volatility `deterministic` для функции `is_positive_int`:

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Check whether a string is a positive integer
    config:
      volatility: deterministic # Optional: stable | non-deterministic | deterministic
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: boolean
```
</File>

## Связанная документация

- [Пользовательские функции (UDF)](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Аргументы](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
