---
title: I'm seeing a Gitlab authentication out of date error loop
description: "GitLab and dbt deploy key mismatch "
sidebar_label: 'GitLab authentication out of date'
id: gitlab-authentication
---

Если вы видите страницу с ошибкой сервера 500 и сообщением **“GitLab Authentication is out of date”**, то, как правило, это означает, что deploy key в настройках репозитория в <Constant name="cloud" /> и в GitLab не совпадают.

Не беспокойтесь — это текущая проблема, над которой работает команда dbt Labs, и у нас есть несколько обходных путей, которые вы можете попробовать:

### Первый обходной путь {#1st-workaround}

1. Отключите репозиторий от проекта в <Constant name="cloud" />.
2. Перейдите в GitLab и нажмите **Settings > Repository**.
3. В разделе **Repository Settings** удалите или отзовите активные deploy tokens и deploy keys для <Constant name="cloud" />.
4. Попробуйте снова подключить ваш репозиторий через <Constant name="cloud" />.
5. Затем необходимо проверить в GitLab, что новый deploy key был добавлен.
6. После подтверждения того, что ключ добавлен, обновите <Constant name="cloud" /> и попробуйте снова приступить к разработке.

### Второй обходной путь {#2nd-workaround}

1. Оставьте репозиторий подключённым к проекту как есть — не отключайте его.
2. Скопируйте deploy key, сгенерированный в <Constant name="cloud" />.
3. Перейдите в GitLab и нажмите **Settings > Repository**.
4. В разделе **Repository Settings** вручную добавьте deploy key в репозиторий вашего GitLab‑проекта (с установленным флажком `Grant write permissions`).
5. Вернитесь в <Constant name="cloud" />, обновите страницу и попробуйте продолжить разработку.

Если вы попробовали указанные выше обходные пути и все еще сталкиваетесь с этой проблемой, свяжитесь с командой поддержки по адресу support@getdbt.com, и мы будем рады помочь!