---
title: Я получаю ошибку NoneType object has no attribute в IDE?
description: "Копирование SSH-ключа в ваш склад данных"
sidebar_label: 'Ошибка NoneType в IDE'
id: nonetype-ide-error

---

Если вы не можете получить доступ к IDE из-за сообщения об ошибке, приведенного ниже, мы постараемся помочь вам с помощью следующих шагов!

```shell
NoneType object has no attribute 
enumerate_fields'
```

Обычно эта ошибка указывает на то, что вы пытались подключить вашу базу данных через [SSH-туннель](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database#connecting-via-an-ssh-tunnel). Если вы видите эту ошибку, дважды проверьте, что вы указали следующие элементы:

- имя хоста
- имя пользователя
- порт сервера бастиона

Если вы выполнили шаг выше и все еще сталкиваетесь с этой проблемой, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!