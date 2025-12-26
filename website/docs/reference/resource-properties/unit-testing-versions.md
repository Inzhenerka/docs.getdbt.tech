---
title: "Юнит-тестирование версионированных SQL моделей"
sidebar_label: "Версии"
---

Если у вашей модели есть несколько версий, то по умолчанию юнит-тест будет выполняться для _всех_ версий вашей модели. Чтобы указать версию(и) вашей модели для юнит-тестирования, используйте `include` или `exclude` для нужных версий в конфигурации версий вашей модели:

<File name='models/schema.yml'>

```yaml

# мой юнит-тест test_is_valid_email_address будет выполняться для всех версий my_model
unit_tests:
  - name: test_is_valid_email_address
    model: my_model
    ...
            
# мой юнит-тест test_is_valid_email_address будет выполняться ТОЛЬКО для версии 2 my_model
unit_tests:
  - name: test_is_valid_email_address 
    model: my_model 
    versions:
      include: 
        - 2
    ...
            
# мой юнит-тест test_is_valid_email_address будет выполняться для всех версий, КРОМЕ 1, my_model
unit_tests:
  - name: test_is_valid_email_address
    model: my_model 
    versions:
      exclude: 
        - 1
    ...

```
</File>
```
