---
title: Свойства проверок
availability:
  engine: v2
---

Вы можете объявлять свойства проверок в файлах `.yml` в каталоге `checks/` (который задаётся [параметром конфигурации `check-paths`](/reference/project-configs/check-paths)).

<File name='checks/_checks.yml'>

```yaml
checks:
  - name: <string>
    [description](/reference/resource-properties/description): <markdown_string>
    [config](/reference/check-configs):
      [<check_config>](/reference/check-configs): <config_value>

  - name: ... # объявите свойства дополнительных проверок
```

</File>

## Пример

<File name='checks/_checks.yml'>

```yaml
version: 2

checks:
  - name: all_models_have_descriptions
    description: "Завершается ошибкой, если у какой-либо модели отсутствует описание."
    config:
      severity: error
      tags: ["governance"]
      meta:
        owner: "data-platform-team"

  - name: public_models_have_owners
    description: "Выдаёт предупреждение, если у какой-либо публичной модели не указан владелец."
    config:
      severity: warn
```

</File>
