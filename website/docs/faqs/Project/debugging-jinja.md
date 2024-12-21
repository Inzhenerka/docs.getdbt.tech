---
title: Как отладить мой Jinja?
description: "Использование папки target или функции log для отладки Jinja"
sidebar_label: 'Отладка Jinja'
id: debugging-jinja

---

Вам следует ознакомиться с проверкой скомпилированного SQL в `target/compiled/<your_project>/` и логов в `logs/dbt.log`, чтобы увидеть, что dbt выполняет за кулисами.

Вы также можете использовать функцию [log](/reference/dbt-jinja-functions/log) для отладки Jinja, выводя объекты в командную строку.