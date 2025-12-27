---
title: Сообщение об обновлении токена GitLab
description: "Узнайте, как устранить сообщения об обновлении токена GitLab во время ваших CI jobs"
sidebar_label: "Сообщение об обновлении токена GitLab"
id: gitlab-token-refresh
---

Когда вы подключаете <Constant name="cloud" /> к репозиторию GitLab, GitLab автоматически в фоновом режиме создаёт [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) в вашем репозитории GitLab. Этот токен используется для отправки статуса выполнения джоб обратно в GitLab с помощью API <Constant name="cloud" /> для CI‑задач.

По умолчанию project access token имеет следующий шаблон имени: `dbt token for GitLab project: <project_id>`. Если в вашем репозитории есть несколько токенов, ищите токен с таким шаблоном имени, чтобы определить, какой именно используется <Constant name="cloud" />.

Если вы видите сообщение «Refresh token», не переживайте &mdash; <Constant name="cloud" /> автоматически обновляет этот project access token, поэтому вам не нужно вручную выполнять его ротацию.

Если после этого вы всё ещё сталкиваетесь с ошибками обновления токена, попробуйте отключить и заново подключить репозиторий в вашем проекте <Constant name="cloud" />, чтобы обновить токен.

Если у вас возникнут какие‑либо проблемы, пожалуйста, свяжитесь с командой поддержки по адресу support@getdbt.com — мы с радостью поможем!
