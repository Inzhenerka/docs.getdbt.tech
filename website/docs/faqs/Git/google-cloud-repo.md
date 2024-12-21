---
title: Как подключить dbt к репозиторию Google Source?
description: "Используйте метод SSH URL для подключения к Google Source Repo"
sidebar_label: 'Подключение dbt к репозиторию Google Source'
id: google-cloud-repo

---

Хотя мы официально не поддерживаем Google Cloud в качестве git-репозитория, приведенное ниже решение с использованием метода SSH URL должно помочь вам подключиться:

- Сначала: "импортируйте" ваш репозиторий в dbt Cloud, используя SSH URL, предоставленный вам GCP. Это будет выглядеть примерно так: 
`ssh://drew@fishtownanalytics.com@source.developers.google.com:2022/p/dbt-integration-tests/r/drew-debug`

- После импорта репозитория вы должны увидеть открытый ключ, сгенерированный dbt Cloud для репозитория. Вам нужно скопировать этот открытый ключ в новый SSH-ключ для вашего пользователя здесь: [https://source.cloud.google.com/user/ssh_keys](https://source.cloud.google.com/user/ssh_keys)

- После сохранения этого SSH-ключа dbt Cloud должен иметь возможность читать и записывать в этот репозиторий.

Если вы попробовали вышеуказанное решение и у вас все еще возникают проблемы с подключением, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!