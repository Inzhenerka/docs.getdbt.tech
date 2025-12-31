---
title: "Настройка Vertica"
id: "vertica-setup"
meta:
  maintained_by: 'Vertica'
  authors: 'Vertica (Бывшие авторы: Matthew Carter, Andy Regan, Andrew Hedengren)'
  github_repo: 'vertica/dbt-vertica'
  pypi_package: 'dbt-vertica'
  min_core_version: 'v1.8.5'
  cloud_support: 'Не поддерживается'
  min_supported_version: 'Vertica 24.3.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community/'
  platform_name: 'Vertica'
  config_page: '/reference/resource-configs/vertica-configs'
---

:::info ПЛАГИН, ПОДДЕРЖИВАЕМЫЙ ПОСТАВЩИКОМ

Если вы заинтересованы в участии, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

<h3> Подключение к {frontMatter.meta.platform_name} с помощью {frontMatter.meta.pypi_package} </h3>

#### Аутентификация с использованием имени пользователя и пароля {#username-password-authentication}

Настройте ваш dbt профиль для использования Vertica:

##### Информация о подключении к Vertica {#vertica-connection-information}

<File name='profiles.yml'>

```yaml
your-profile:
  outputs:
    dev:
      type: vertica # Не изменяйте это!
      host: [hostname]
      port: [port] # или ваш пользовательский порт (опционально)
      username: [your username]
      password: [your password]
      database: [database name]
      oauth_access_token: [access token]
      schema: [dbt schema]
      connection_load_balance: True
      backup_server_node: [list of backup hostnames or IPs]
      retries: [1 or more]
      autocommit: False
      
      threads: [1 or more]
  target: dev
```

</File>

##### Описание полей профиля: {#description-of-profile-fields}

| Свойство                         | Описание                                                                                                  | Обязательно?                                                                                                        | Значение по умолчанию | Пример                          |
|--------------------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------|----------------------------------|
|type                         | Конкретный адаптер для использования.                                                                        | Да    | Нет          | vertica
| host                           | Имя хоста или IP-адрес любого активного узла в сервере Vertica.                                                                         |Да                                                 | Нет                     | 127.0.0.1
| port                       | Порт для использования, стандартный или пользовательский.                                                                      | Да                                                                      | 5433       |5433
| username                         | Имя пользователя для подключения к серверу.                                                              | Да                                                           | Нет            | dbadmin|
password   |Пароль для аутентификации на сервере. |Да|Нет|my_password|
database |Имя базы данных, работающей на сервере. |Да | Нет | my_db |
| oauth_access_token | Для аутентификации через OAuth предоставьте OAuth Access Token, который авторизует пользователя в базе данных. | Нет | "" | По умолчанию: "" |
schema|	Схема для построения моделей.|	Нет|	Нет	|VMart|
connection_load_balance|	Логическое значение, указывающее, может ли соединение быть перенаправлено на другой хост в базе данных, отличный от host.|	Нет|	True	|True|
backup_server_node|	Список хостов для подключения, если основной хост, указанный в соединении (host, port), недоступен. Каждый элемент в списке должен быть либо строкой хоста (используя стандартный порт 5433), либо кортежем (host, port). Хост может быть именем хоста или IP-адресом.|	Нет|	Нет	|['123.123.123.123','www.abc.com',('123.123.123.124',5433)]|
retries	|Количество попыток после неудачного соединения.|	Нет|	2	|3|
threads	|Количество потоков, на которых будет работать проект dbt.|	Нет|	1|	3|
label|	Метка сессии для идентификации соединения.	|Нет	|Автоматически сгенерированная метка в формате: dbt_username	|dbt_dbadmin|
autocommit | Логическое значение, указывающее, может ли соединение включать или отключать автофиксацию.| Нет | True | False

Для получения дополнительной информации о свойствах подключения Vertica, пожалуйста, обратитесь к [Vertica-Python](https://github.com/vertica/vertica-python#create-a-connection) Connection Properties.