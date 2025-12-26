---
title: Как подключить dbt к репозиторию Google Source?
description: "Используйте метод SSH URL для подключения к Google Source Repo"
sidebar_label: 'Подключение dbt к репозиторию Google Source'
id: google-cloud-repo

---

Хотя мы официально не поддерживаем Google Cloud в качестве git-репозитория, приведенное ниже решение с использованием метода SSH URL должно помочь вам подключиться:

- Сначала **«импортируйте»** ваш репозиторий в <Constant name="cloud" />, используя SSH URL, предоставленный вам GCP. Он будет выглядеть примерно так:  
  `ssh://drew@fishtownanalytics.com@source.developers.google.com:2022/p/dbt-integration-tests/r/drew-debug`

- После импорта репозитория вы должны увидеть публичный ключ, сгенерированный <Constant name="cloud" /> для этого репозитория. Скопируйте этот публичный ключ и добавьте его как новый SSH Key для вашего пользователя здесь: [https://source.cloud.google.com/user/ssh_keys](https://source.cloud.google.com/user/ssh_keys)

- После сохранения этого SSH‑ключа <Constant name="cloud" /> сможет читать и записывать данные в этот репозиторий.

Если вы попробовали вышеуказанное решение и у вас все еще возникают проблемы с подключением, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!