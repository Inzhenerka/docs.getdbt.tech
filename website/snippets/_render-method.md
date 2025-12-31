#### Метод render {#the-render-method}

Метод `.render()` обычно используется для разрешения или вычисления выражений Jinja (таких как `{{ source(...) }}`) во время выполнения.

При использовании флага `--empty`, dbt может пропустить обработку `ref()` или `source()` для оптимизации. Чтобы избежать ошибок компиляции и явно указать dbt обработать конкретное отношение (`ref()` или `source()`), используйте метод `.render()` в вашем файле модели. Например:

<File name='models.sql'>

```Jinja
{{ config(
    pre_hook = [
        "alter external table {{ source('sys', 'customers').render() }} refresh"
    ]
) }}

select ...
```

</File>