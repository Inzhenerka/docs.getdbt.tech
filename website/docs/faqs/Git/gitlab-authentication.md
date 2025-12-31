---
title: Я вижу зацикленную ошибку «GitLab authentication out of date»
description: "Несоответствие deploy key между GitLab и dbt"
sidebar_label: 'Аутентификация GitLab устарела'
id: gitlab-authentication
---

Если вы видите страницу с ошибкой сервера 500 и сообщением **'GitLab Authentication is out of date'**, это обычно означает, что deploy key в настройках репозитория в <Constant name="cloud" /> и в GitLab не совпадают.

Не беспокойтесь — это текущая проблема, над которой работает команда dbt Labs, и у нас есть несколько обходных путей, которые вы можете попробовать:

#### Первый обходной путь {#first-workaround}

1. Отключите репозиторий от проекта в <Constant name="cloud" />.
2. Перейдите в GitLab и нажмите **Settings > Repository**.
3. В разделе **Repository Settings** удалите или отзовите активные deploy tokens и deploy keys для <Constant name="cloud" />.
4. Попробуйте повторно подключить ваш репозиторий через <Constant name="cloud" />.
5. Затем вам нужно проверить в GitLab, что новый deploy key был добавлен.
6. После подтверждения того, что ключ добавлен, обновите <Constant name="cloud" /> и попробуйте снова приступить к разработке.

#### Второй обходной путь {#second-workaround}

1. Оставьте репозиторий в проекте как есть — не отключайте его.
2. Скопируйте deploy key, сгенерированный в <Constant name="cloud" />.
3. Перейдите в Gitlab и нажмите **Settings > Repository**.
4. В разделе **Repository Settings** вручную добавьте deploy key в репозиторий вашего Gitlab‑проекта (с установленным флажком `Grant write permissions`).
5. Вернитесь в <Constant name="cloud" />, обновите страницу и попробуйте продолжить разработку.

Если вы попробовали указанные выше обходные пути и все еще сталкиваетесь с этой проблемой, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!