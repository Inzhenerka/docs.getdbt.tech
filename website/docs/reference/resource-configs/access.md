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

Вы можете применять модификаторы доступа в конфигурационных файлах, включая `dbt_project.yml`, или к моделям по отдельности в `properties.yml`. Применение конфигураций доступа к подпапке изменяет значение по умолчанию для всех моделей в этой подпапке, поэтому убедитесь, что вы хотите такого поведения. При установке индивидуального доступа модели группа или подпапка могут содержать различные уровни доступа, поэтому, когда вы назначаете модели `access: public`, убедитесь, что вы хотите такого поведения.

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
  
- В `properties.yml` с использованием нового метода (для v1.7 или выше). Используйте либо старый метод, либо новый метод, но не оба для одной и той же модели:

  <File name='models/properties_my_public_model.yml'>
  
  ```yml
  version: 2
  
  models:
    - name: my_public_model
      config:
        access: public # новый метод, поддерживаемый в v1.7
      
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

После того как вы определите `access`, повторно запустите производственную задачу, чтобы применить изменения.

## Определение
Уровень доступа модели, для которой вы объявляете свойства.

Некоторые модели (не все) предназначены для ссылки через функцию [ref](/reference/dbt-jinja-functions/ref) в рамках [групп](/docs/build/groups).

| Доступ    | Доступно для ссылки              |
|-----------|----------------------------------|
| private   | Та же группа                     |
| protected | Тот же проект/пакет             |
| public    | Любая группа, пакет или проект. Когда определено, повторно запустите производственную задачу, чтобы применить изменения. |

Если вы попытаетесь сослаться на модель вне ее поддерживаемого доступа, вы увидите ошибку:

```shell
dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Ошибка разбора
  Узел model.jaffle_shop.marketing_model попытался сослаться на узел model.jaffle_shop.finance_model, 
  что не разрешено, поскольку ссылающийся узел является частным для группы finance.
```

## По умолчанию

По умолчанию все модели имеют статус "protected". Это означает, что другие модели в том же проекте могут ссылаться на них.

## Связанные документы

* [Доступ к моделям](/docs/collaborate/govern/model-access#groups)
* [Конфигурация группы](/reference/resource-configs/group)