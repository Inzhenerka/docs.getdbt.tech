---
title: "Модульное тестирование версионированных SQL моделей"
sidebar_label: "Версии"
---

Если у вашей модели есть несколько версий, то тестирование по умолчанию будет выполняться на _всех_ версиях вашей модели. Чтобы указать версию(и) вашей модели для модульного тестирования, используйте `include` или `exclude` для нужных версий в конфигурации версий вашей модели:

```yaml

# мой модульный тест test_is_valid_email_address будет выполняться на всех версиях my_model
unit_tests:
  - name: test_is_valid_email_address
    model: my_model
    ...
            
# мой модульный тест test_is_valid_email_address будет выполняться ТОЛЬКО на версии 2 my_model
unit_tests:
  - name: test_is_valid_email_address 
    model: my_model 
    versions:
      include: 
        - 2
    ...
            
# мой модульный тест test_is_valid_email_address будет выполняться на всех версиях, ЗА ИСКЛЮЧЕНИЕМ 1 my_model
unit_tests:
  - name: test_is_valid_email_address
    model: my_model 
    versions:
      exclude: 
        - 1
    ...

```