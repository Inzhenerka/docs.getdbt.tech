---
title: Я получаю ошибку "NoneType object has no attribute" в IDE?
description: "Скопируйте SSH-ключ в ваше хранилище"
sidebar_label: 'Ошибка NoneType в IDE'
id: nonetype-ide-error

---

Если вы не можете получить доступ к IDE из-за следующего сообщения об ошибке, мы постараемся помочь вам с решением проблемы с помощью следующих шагов!

```shell
NoneType object has no attribute 
enumerate_fields'
```

Обычно эта ошибка указывает на то, что вы пытались подключиться к вашей базе данных через [SSH-туннель](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database#connecting-via-an-ssh-tunnel). Если вы видите эту ошибку, дважды проверьте, что вы указали следующие элементы:

- имя хоста
- имя пользователя
- порт сервера-бастиона

Если вы выполнили указанные шаги и по-прежнему сталкиваетесь с этой проблемой, свяжитесь с командой поддержки по адресу support@getdbt.com, и мы будем рады помочь!