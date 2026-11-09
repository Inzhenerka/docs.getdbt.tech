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

Вы можете переопределить результат выполнения любого макроса, на который непосредственно ссылается тестируемая модель, в определении юнит-теста. Переопределения применяются только к макросам, переменным и переменным окружения, на которые непосредственно ссылается тестируемая модель. Если макрос, переменная или переменная окружения используются только косвенно (например, внутри макроса, который вызывает ваша модель), переопределение не будет применено.

Если модель, для которой вы пишете юнит-тест, использует следующие макросы, их необходимо переопределить:
  - [`is_incremental`](/docs/build/incremental-models#understand-the-is_incremental-macro): Если вы пишете юнит-тест для инкрементальной модели, необходимо явно задать для `is_incremental` значение `true` или `false`. Подробнее о юнит-тестировании инкрементальных моделей читайте [здесь](/docs/build/unit-tests#unit-testing-incremental-models).

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

- [`dbt_utils.star`](/blog/star-sql-love-letter): Если вы выполняете модульное тестирование модели, использующей макрос `star`, необходимо явно задать для `star` список столбцов. Это связано с тем, что `star` принимает в качестве аргумента `from` только [relation](/reference/dbt-classes#relation); подставные входные данные модульного теста внедряются непосредственно в SQL-код модели, заменяя вызов функции `ref('')` или `source('')`, из-за чего макрос `star` завершится с ошибкой, если его не переопределить.

<File name='models/schema.yml'>

  ```yml

  unit_tests:
    - name: my_other_unit_test
      model: my_model_that_uses_star
      overrides:
        macros:
# явно задать для star соответствующий список столбцов
          dbt_utils.star: col_a,col_b,col_c 
      ...

  ```
</File>
