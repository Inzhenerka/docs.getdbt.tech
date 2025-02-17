---
title: Я вижу ошибку устаревшей аутентификации GitLab
description: "Несоответствие ключа развертывания между GitLab и dbt Cloud"
sidebar_label: 'Устаревшая аутентификация GitLab'
id: gitlab-authentication
---

Если вы видите страницу ошибки сервера 500 с сообщением 'Аутентификация GitLab устарела', это обычно происходит, когда ключ развертывания в настройках репозитория в dbt Cloud и GitLab не совпадают.

Не беспокойтесь — это текущая проблема, над которой работает команда dbt Labs, и у нас есть несколько обходных путей, которые вы можете попробовать:

#### Первый обходной путь

1. Отключите репозиторий от проекта в dbt Cloud.
2. Перейдите в GitLab и нажмите на Настройки > Репозиторий.
3. В настройках репозитория удалите/отмените активные токены развертывания и ключи развертывания dbt Cloud.
4. Попробуйте снова подключить ваш репозиторий через dbt Cloud.
5. Затем вам нужно будет проверить в GitLab, чтобы убедиться, что новый ключ развертывания добавлен.
6. После подтверждения, что он добавлен, обновите dbt Cloud и попробуйте снова начать разработку.

#### Второй обходной путь

1. Оставьте репозиторий в проекте как есть — не отключайте.
2. Скопируйте ключ развертывания, сгенерированный в dbt Cloud.
3. Перейдите в GitLab и нажмите на Настройки > Репозиторий.
4. В настройках репозитория вручную добавьте ключ развертывания в проект GitLab (с установленной галочкой `Grant write permissions`).
5. Вернитесь в dbt Cloud, обновите страницу и попробуйте снова начать разработку.

Если вы попробовали указанные выше обходные пути и все еще сталкиваетесь с этой проблемой, свяжитесь с нашей службой поддержки по адресу support@getdbt.com, и мы будем рады помочь!