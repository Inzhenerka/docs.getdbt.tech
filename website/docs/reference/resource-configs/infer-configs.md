---
title: "Конфигурации Infer"
description: "Прочтите это руководство, чтобы понять, как настроить Infer с dbt."
id: "infer-configs"
---

## Аутентификация {#authentication}

Чтобы подключиться к Infer из вашей dbt-инстанции, вам необходимо настроить правильный профиль в вашем `profiles.yml`.

Формат должен выглядеть следующим образом:

<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: infer
      url: "<infer-api-endpoint>"
      username: "<infer-api-username>"
      apikey: "<infer-apikey>"
      data_config:
        [configuration for your underlying data warehouse]  
```

</File>

### Описание полей профиля Infer {#description-of-infer-profile-fields}

| Поле       | Обязательно | Описание                                                                                                                                       |
|------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`     | Да          | Должно быть установлено в `infer`. Это должно быть включено либо в `profiles.yml`, либо в файл `dbt_project.yml`.                             |
| `url`      | Да          | Имя хоста сервера Infer для подключения. Обычно это `https://app.getinfer.io`.                                                                |
| `username` | Да          | Ваше имя пользователя Infer - то, которое вы используете для входа.                                                                           |
| `apikey`   | Да          | Ваш API-ключ Infer.                                                                                                                           |
| `data_config` | Да       | Конфигурация для вашего основного хранилища данных. Формат этой конфигурации соответствует формату конфигурации для вашего адаптера хранилища данных. |
