## Определение
**Обязательная конфигурация**

Имя проекта dbt. Должно содержать только буквы, цифры и символы подчеркивания, и не может начинаться с цифры.

## Рекомендации
Часто в организации есть один проект dbt, поэтому имеет смысл назвать проект именем вашей организации в формате `snake_case`. Например:
* `name: acme`
* `name: jaffle_shop`
* `name: evilcorp`

## Устранение неполадок
### Недопустимое имя проекта

```
Encountered an error while reading the project:
  ERROR: Runtime Error
  at path ['name']: 'jaffle-shop' does not match '^[^\\d\\W]\\w*$'
Runtime Error
  Could not run dbt
```

В этом проекте указано:

<File name='dbt_project.yml'>

```yml
name: jaffle-shop
```

</File>

В этом случае измените имя вашего проекта на формат `snake_case`:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
```

</File>