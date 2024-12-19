---
datatype: string
description: "Прочитайте это руководство, чтобы понять конфигурацию имени в dbt."
required: True
---

<File name='dbt_project.yml'>

```yml
name: string
```

</File>

## Определение
**Обязательная конфигурация**

Имя проекта dbt. Должно содержать только буквы, цифры и символы подчеркивания, и не может начинаться с цифры.

## Рекомендация
Часто у организации есть один проект dbt, поэтому разумно называть проект именем вашей организации в формате `snake_case`. Например:
* `name: acme`
* `name: jaffle_shop`
* `name: evilcorp`

## Устранение неполадок
### Неверное имя проекта

```
При чтении проекта возникла ошибка:
  ERROR: Runtime Error
  at path ['name']: 'jaffle-shop' не соответствует '^[^\\d\\W]\\w*$'
Runtime Error
  Не удалось запустить dbt
```

Этот проект имеет:

<File name='dbt_project.yml'>

```yml
name: jaffle-shop
```

</File>

В этом случае измените имя вашего проекта на `snake_case`:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
```

</File>