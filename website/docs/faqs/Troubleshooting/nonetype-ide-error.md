---
title: Я получаю ошибку NoneType object has no attribute в IDE?
description: "Копирование SSH-ключа в ваш склад данных"
sidebar_label: 'Ошибка NoneType в IDE'
id: nonetype-ide-error

---

Если у вас не получается получить доступ к <Constant name="cloud_ide" /> из-за сообщения об ошибке ниже, мы постараемся помочь вам решить проблему с помощью шагов, описанных далее!

```shell
NoneType object has no attribute 
enumerate_fields'
```

Обычно эта ошибка означает, что вы попытались подключиться к базе данных через [SSH tunnel](/docs/cloud/connect-data-platform/about-connections#connecting-via-an-ssh-tunnel). Если вы видите эту ошибку, ещё раз проверьте, что вы указали следующие элементы:

- имя хоста
- имя пользователя
- порт сервера бастиона

Если вы выполнили шаг выше и все еще сталкиваетесь с этой проблемой, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!