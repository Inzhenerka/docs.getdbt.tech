---
title: Я получаю ошибку git rev-list master в IDE?
description: "Основная ветка не распознана"
sidebar_label: 'Получение ошибки git rev-list master в IDE'
id: git-revlist-error
---

Если вы не можете получить доступ к <Constant name="cloud_ide" /> из-за приведённого ниже сообщения об ошибке, мы постараемся помочь вам разобраться, следуя шагам ниже!

```shell
git rev-list master..origin/main --count
fatal: ambiguous argument 'master..origin/main': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
```

Обычно эта ошибка указывает на то, что имя основной ветки (`"main"`) было изменено, либо на то, что <Constant name="cloud" /> не смог определить, какая ветка является вашей основной. Не переживайте — у нас есть несколько обходных решений, которые вы можете попробовать:

**Обходной путь 1**
Проверьте настройки окружения - если у вас **нет** пользовательской ветки, указанной в настройках окружения:

1. Отключите и снова подключите ваш репозиторий ([connection](/docs/cloud/git/import-a-project-by-git-url)) на странице **Project Settings**. После этого <Constant name="cloud" /> сможет определить, что ветка `"main"` теперь называется `main`.
2. В **Environment Settings** установите пользовательскую ветку в значение `master` и обновите <Constant name="cloud_ide" />.

**Обходной путь 2**
Проверьте настройки окружения - если у вас **есть** пользовательская ветка, указанная в настройках окружения:

1. Отключите и снова подключите ваш репозиторий на странице **Project Settings** ([connection](/docs/cloud/git/import-a-project-by-git-url)). После этого <Constant name="cloud" /> сможет определить, что ветка «main» теперь называется `main`.
2. В **Environment Settings** удалите пользовательскую ветку и обновите <Constant name="cloud_ide" />.

Если вы попробовали указанные выше обходные пути и все еще сталкиваетесь с этой проблемой, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!