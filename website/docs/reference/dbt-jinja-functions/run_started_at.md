---
title: "О переменной run_started_at"
sidebar_label: "run_started_at"
id: "run_started_at"
description: "Используйте `run_started_at`, чтобы вывести временную метку начала выполнения."
---

`run_started_at` выводит временную метку, когда началось выполнение, например, `2017-04-21 01:23:45.678`.

Переменная `run_started_at` является объектом `datetime` в Python. Начиная с версии 0.9.1, часовой пояс этой переменной по умолчанию установлен на UTC.

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