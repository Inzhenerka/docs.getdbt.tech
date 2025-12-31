---
resource_types: [models]
datatype: model_name
required: yes
---

<File name='models/<schema>.yml'>

```yml

models:
  - name: model_name
```

</File>

## Definition {#definition}
Имя модели, для которой вы объявляете свойства. Оно должно совпадать с _именем файла_ модели — с учётом регистра. Любое несовпадение регистра может помешать dbt корректно применить конфигурации и повлиять на метаданные в <Constant name="explorer" />.

## Значение по умолчанию {#default}

Это **обязательное свойство**, значение по умолчанию отсутствует.