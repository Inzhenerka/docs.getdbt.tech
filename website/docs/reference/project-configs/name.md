---
datatype: string
description: "Прочитайте это руководство, чтобы понять настройку имени проекта в dbt."
required: True
---

<File name='dbt_project.yml'>

```yml
name: string
```

</File>

## Определение {#definition}
**Обязательная настройка**

Имя dbt‑проекта. Может содержать только буквы, цифры и символы подчёркивания и не может начинаться с цифры.

## Рекомендации {#recommendation}
Часто в организации используется один dbt‑проект, поэтому разумно называть проект именем вашей организации в формате `snake_case`. Например:
* `name: acme`
* `name: jaffle_shop`
* `name: evilcorp`

## Устранение неполадок {#troubleshooting}
### Некорректное имя проекта {#invalid-project-name}

```
Encountered an error while reading the project:
  ERROR: Runtime Error
  at path ['name']: 'jaffle-shop' does not match '^[^\\d\\W]\\w*$'
Runtime Error
  Could not run dbt
```

В этом проекте указано следующее:

<File name='dbt_project.yml'>

```yml
name: jaffle-shop
```

</File>

В таком случае измените имя проекта, используя формат `snake_case`:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
```

</File>
