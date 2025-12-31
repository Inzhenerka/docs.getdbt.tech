---
resource_types: [models]
datatype: access
---

<File name='models/<schema>.yml'>

```yml

models:
  - name: model_name
    config:
      access: private | protected | public # changed to config in v1.10
```

</File>

Вы можете применять модификаторы `access` в конфигурационных файлах, включая `dbt_project.yml`, либо задавать их для моделей по отдельности в `properties.yml`. Применение конфигурации `access` к подпапке изменяет значение по умолчанию для всех моделей в этой подпапке, поэтому убедитесь, что вы действительно подразумеваете такое поведение. При задании уровня доступа для отдельных моделей группа или подпапка может содержать разные уровни доступа, поэтому, назначая модели `access: public`, убедитесь, что это сделано осознанно.

Обратите внимание, что для обратной совместимости `access` поддерживается как ключ верхнего уровня, но без возможностей наследования конфигурации.

Существует несколько подходов к настройке доступа:

- В `properties.yml` с использованием старого метода:

  <File name='models/properties_my_public_model.yml'>
  
  ```yml
  
  models:
    - name: my_public_model
      config:
        access: public # Старый способ, по‑прежнему поддерживается
          # изменён на config в версии v1.10
      
  ```
  </File>
  
- В `properties.yml` с использованием нового метода (для версии 1.7 или выше). Используйте либо старый метод, либо новый метод, но не оба для одной и той же модели:

  <File name='models/properties_my_public_model.yml'>
  
  ```yml
  
  models:
    - name: my_public_model
      config:
        access: public
      
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

## Определение {#definition}
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

## Значение по умолчанию {#default}

По умолчанию все модели "защищены". Это означает, что другие модели в том же проекте могут ссылаться на них.

## Связанные документы {#related-docs}

* [Доступ к моделям](/docs/mesh/govern/model-access#groups)
* [Конфигурация групп](/reference/resource-configs/group)
