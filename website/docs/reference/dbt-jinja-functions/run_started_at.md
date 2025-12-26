---
title: "О переменной run_started_at"
sidebar_label: "run_started_at"
id: "run_started_at"
description: "Используйте `run_started_at`, чтобы вывести временную метку начала выполнения."
---

`run_started_at` выводит временную метку, когда начался этот запуск, например, `2017-04-21 01:23:45.678`.

Переменная `run_started_at` — это объект Python `datetime`. Начиная с версии 0.9.1, временная зона этой переменной по умолчанию установлена в UTC.

<File name='run_started_at_example.sql'>

```sql
select
	'{{ run_started_at.strftime("%Y-%m-%d") }}' as date_day

from ...
```

</File>

Чтобы изменить часовой пояс этой переменной, используйте модуль `pytz`:

<File name='run_started_at_utc.sql'>

```sql
select
	'{{ run_started_at.astimezone(modules.pytz.timezone("America/New_York")) }}' as run_started_est

from ...
```

</File>