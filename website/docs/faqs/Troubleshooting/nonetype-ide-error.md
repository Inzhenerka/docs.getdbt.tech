---
title: Я получаю ошибку NoneType object has no attribute в IDE?
description: "Копирование SSH-ключа в ваш склад данных"
sidebar_label: 'Ошибка NoneType в IDE'
id: nonetype-ide-error

---

Если вы не можете получить доступ к <Constant name="studio_ide" /> из-за приведённого ниже сообщения об ошибке, мы постараемся помочь вам решить эту проблему с помощью следующих шагов!

```shell
NoneType object has no attribute 
enumerate_fields'
```

Обычно эта ошибка означает, что вы пытались подключиться к базе данных через [SSH-туннель](/docs/platform/connect-data-platform/connect-redshift#connecting-using-an-ssh-tunnel). Если вы видите эту ошибку, убедитесь, что вы указали следующие данные:

- имя хоста
- имя пользователя
- порт сервера бастиона

Если вы выполнили шаг выше и все еще сталкиваетесь с этой проблемой, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!