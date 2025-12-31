---
title: "Переопределение в модульных тестах"
sidebar_label: "Переопределения"
---

При настройке вашего модульного теста вы можете переопределить вывод [макросов](/docs/build/jinja-macros#macros), [переменных проекта](/docs/build/project-variables) или [переменных окружения](/docs/build/environment-variables) для данного модульного теста.


<File name='models/schema.yml'>

```yml

 - name: test_my_model_overrides
    model: my_model
    given:
      - input: ref('my_model_a')
        rows:
          - {id: 1, a: 1}
      - input: ref('my_model_b')
        rows:
          - {id: 1, b: 2}
          - {id: 2, b: 2}
    overrides:
      macros:
        type_numeric: override
        invocation_id: 123
      vars:
        my_test: var_override
      env_vars:
        MY_TEST: env_var_override
    expect:
      rows:
        - {macro_call: override, var_call: var_override, env_var_call: env_var_override, invocation_id: 123}

```

</File>

## Макросы {#macros}

Вы можете переопределить вывод любого макроса в определении вашего модульного теста.

Если модель, которую вы тестируете, использует эти макросы, вы должны их переопределить:
  - [`is_incremental`](/docs/build/incremental-models#understand-the-is_incremental-macro): Если вы тестируете инкрементальную модель, вы должны явно установить `is_incremental` в `true` или `false`. Подробнее о тестировании инкрементальных моделей можно прочитать [здесь](/docs/build/unit-tests#unit-testing-incremental-models).

<File name='models/schema.yml'>

  ```yml

  unit_tests:
    - name: my_unit_test
      model: my_incremental_model
      overrides:
        macros:
          # тестирование этой модели в режиме "полного обновления"
          is_incremental: false 
      ...

  ```
</File>

  - [`dbt_utils.star`](/blog/star-sql-love-letter): Если вы тестируете модель, которая использует макрос `star`, вы должны явно установить `star` в список столбцов. Это необходимо, потому что `star` принимает только [relation](/reference/dbt-classes#relation) для аргумента `from`; тестовые данные вводятся непосредственно в SQL модели, заменяя функцию `ref('')` или `source('')`, что приводит к сбою макроса `star`, если он не переопределен.

<File name='models/schema.yml'>

  ```yml

  unit_tests:
    - name: my_other_unit_test
      model: my_model_that_uses_star
      overrides:
        macros:
          # явно установить star в соответствующий список столбцов
          dbt_utils.star: col_a,col_b,col_c 
      ...

```
</File>
```
