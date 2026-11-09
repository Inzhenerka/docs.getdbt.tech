---
title: "О макросе debug"
sidebar_label: "debug"
id: "debug-method"
description: "Макрос `{{ debug() }}` откроет отладчик iPython."
---

:::warning Только для среды разработки

:::warning Требуется dbt CLI

Макрос `debug()` доступен только при использовании самостоятельно развернутого dbt CLI в среде разработки. Он _недоступен_ в <Constant name="dbt_platform" />. 

Не развертывайте в рабочей среде код, использующий макрос `debug`.

При разработке в <Constant name="dbt_platform"/> или использовании <Constant name="fusion"/> вместо него можно использовать:
- [`{{ print() }}`](/reference/dbt-jinja-functions/print) — Вывод сообщений как в файл журнала, так и в стандартный поток вывода (`stdout`).
- [`{{ log() }}`](/reference/dbt-jinja-functions/log) — Структурированное журналирование с выводом сообщений во время рендеринга Jinja.


:::

Макрос `{{ debug() }}` откроет отладчик iPython в контексте скомпилированного макроса dbt. Для использования отладчика необходимо задать переменную окружения <VersionBlock lastVersion="1.10">`DBT_MACRO_DEBUGGING`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_MACRO_DEBUGGING`</VersionBlock>.

Для этой функции требуются:
- Доступ к интерактивному терминалу с установленным отладчиком iPython (`ipdb`). <Constant name="fusion"/> не предоставляет отладчик iPython (ipdb), поскольку построен на Rust. Вместо этого он выводит неинтерактивный снимок контекста рендеринга MiniJinja в скомпилированном коде.
- Среда разработки, в которой запущен самостоятельно развернутый dbt CLI
- Заданная переменная окружения <VersionBlock lastVersion="1.10">`DBT_MACRO_DEBUGGING`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_MACRO_DEBUGGING`</VersionBlock>

## Использование {#usage}

<File name='my_macro.sql'>

```text

{% macro my_macro() %}

  {% set something_complex = my_complicated_macro() %}
  
  {{ debug() }}

{% endmacro %}
```

</File>

Когда dbt дойдет до строки `debug()`, вы увидите что-то вроде:

<VersionBlock lastVersion="1.10">

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

</VersionBlock>

<VersionBlock firstVersion="1.11">

```shell
$ DBT_ENGINE_MACRO_DEBUGGING=write dbt compile
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

</VersionBlock>
