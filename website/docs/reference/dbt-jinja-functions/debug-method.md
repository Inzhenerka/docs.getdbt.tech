---
title: "О макросе debug"
sidebar_label: "debug"
id: "debug-method"
description: "Макрос `{{ debug() }}` откроет отладчик iPython."
---

:::warning Только для среды разработки

Макрос `debug` предназначен только для использования в контексте разработки с dbt. Не разворачивайте код в продакшн, если он использует макрос `debug`.

:::

Макрос `{{ debug() }}` откроет отладчик iPython в контексте скомпилированного макроса dbt. Для использования отладчика необходимо установить значение переменной окружения `DBT_MACRO_DEBUGGING`.

## Использование

<File name='my_macro.sql'>

```text

{% macro my_macro() %}

  {% set something_complex = my_complicated_macro() %}
  
  {{ debug() }}

{% endmacro %}
```

</File>

Когда dbt дойдет до строки `debug()`, вы увидите что-то вроде:

```shell
$ DBT_MACRO_DEBUGGING=write dbt compile
Running with dbt=1.0
> /var/folders/31/mrzqbbtd3rn4hmgbhrtkfyxm0000gn/T/dbt-macro-compiled-cxvhhgu7.py(14)root()
     13         environment.call(context, (undefined(name='debug') if l_0_debug is missing else l_0_debug)),
---> 14         environment.call(context, (undefined(name='source') if l_0_source is missing else l_0_source), 'src', 'seedtable'),
     15     )

ipdb> l 9,12
      9     l_0_debug = resolve('debug')
     10     l_0_source = resolve('source')
     11     pass
     12     yield '%s\nselect * from %s' % (
```