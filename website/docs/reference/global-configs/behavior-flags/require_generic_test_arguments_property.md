---
title: "Свойство arguments для универсальных тестов"
id: "require_generic_test_arguments_property"
sidebar_label: "Обязательное свойство arguments для универсальных тестов"
---

:::info Этот флаг перешёл в стабильную фазу

Значение по умолчанию теперь — `true`. Чтобы сохранить прежнее поведение, установите для этого флага значение `false` в файле `dbt_project.yml`.

:::

| require_generic_test_arguments_property | <Constant name="dbt" /> **v1 Последняя версия** | <Constant name="core" /> |
|---|---|---|
| Введён | 2025.07 | 1.10.5 |
| Перешёл в стабильную фазу (по умолчанию → `true`) | 2025.08 | 1.10.8 |
| Удалён | — | — |

dbt поддерживает разбор аргументов в виде пар «ключ — значение», передаваемых универсальным тестам, если они указаны в свойстве `arguments`. Ранее в dbt не было способа однозначно разграничить свойства, передаваемые универсальным тестам в качестве входных аргументов, и настройки фреймворка; аргументы принимались только как свойства верхнего уровня.

Если вы используете более старую версию <Constant name="core" />, в которой флаг имеет значение `false`, dbt распознает свойство `arguments`, но выдаст предупреждение `ArgumentsPropertyInGenericTestDeprecation`.

Ниже приведён пример использования нового свойства `arguments`:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - dbt_utils.expression_is_true:
          arguments:
            expression: "order_items_subtotal = subtotal"
```

</File>

Ниже приведён пример использования альтернативного формата `test_name`:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
    - name: arbitrary_name
      test_name: dbt_utils.expression_is_true
      arguments:
         expression: "order_items_subtotal = subtotal"
      config:
        where: "1=1"
```

</File>

Когда этот флаг включён, dbt будет:
- Разбирать все пары «ключ — значение» в свойстве `arguments` универсальных тестов как входные аргументы макроса универсального теста.
- Выдавать предупреждение `MissingArgumentsPropertyInGenericTestDeprecation`, если дополнительные аргументы, не относящиеся к настройкам, указаны вне свойства `arguments`.

Чтобы сохранить прежнее поведение:

<File name='dbt_project.yml'>

```yaml
flags:
  require_generic_test_arguments_property: false
```

</File>
