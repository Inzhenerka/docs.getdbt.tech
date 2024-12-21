---
resource_types: [models]
datatype: access
---

<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    access: private | protected | public
```

</File>

Вы можете применять модификаторы доступа в конфигурационных файлах, включая `dbt_project.yml`, или к моделям по отдельности в `properties.yml`. Применение конфигураций доступа к подпапке изменяет значение по умолчанию для всех моделей в этой подпапке, поэтому убедитесь, что вы хотите такого поведения. При установке индивидуального доступа к модели, группа или подпапка может содержать различные уровни доступа, поэтому, когда вы назначаете модели `access: public`, убедитесь, что вы хотите такого поведения.

Существует несколько подходов к настройке доступа:

- В `properties.yml` с использованием старого метода:

  <File name='models/properties_my_public_model.yml'>
  
  ```yml
  version: 2
  
  models:
    - name: my_public_model
      access: public # Старый метод, все еще поддерживается
      
  ```
  </File>
  
- В `properties.yml` с использованием нового метода (для версии 1.7 или выше). Используйте либо старый метод, либо новый метод, но не оба для одной и той же модели:

  <File name='models/properties_my_public_model.yml'>
  
  ```yml
  version: 2
  
  models:
    - name: my_public_model
      config:
        access: public # поддерживается с версии 1.7
      
  ```
  </File>

- В `dbt_project.yml`:

  <File name='dbt_project.yml'>
  
  ```yml
  models:
    my_project_name:
      subfolder_name:
        +group: my_group
        +access: private  # устанавливает значение по умолчанию для всех моделей в этой подпапке
  ```
  </File>

- В файле `my_public_model.sql`:

  <File name='models/my_public_model.sql'>
  
  ```sql
  -- models/my_public_model.sql
  
  {{ config(access = "public") }}
  
  select ...
  ```
  </File>

После того как вы определите `access`, перезапустите производственное задание, чтобы применить изменения.

## Определение
Уровень доступа модели, для которой вы объявляете свойства.

Некоторые модели (не все) предназначены для использования через функцию [ref](/reference/dbt-jinja-functions/ref) в разных [группах](/docs/build/groups).

| Доступ    | Доступен для                  |
|-----------|-------------------------------|
| private   | Та же группа                  |
| protected | Тот же проект/пакет           |
| public    | Любая группа, пакет или проект. После определения перезапустите производственное задание, чтобы применить изменения. |

Если вы попытаетесь сослаться на модель вне её поддерживаемого доступа, вы увидите ошибку:

```shell
dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```

## Значение по умолчанию

По умолчанию все модели "защищены". Это означает, что другие модели в том же проекте могут ссылаться на них.

## Связанные документы

* [Доступ к модели](/docs/collaborate/govern/model-access#groups)
* [Конфигурация группы](/reference/resource-configs/group)