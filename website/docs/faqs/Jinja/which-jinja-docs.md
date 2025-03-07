---
title: Какие документы использовать при написании Jinja или создании макроса?
description: "Полезные документы по Jinja"
sidebar_label: 'Полезные документы по Jinja'
id: which-jinja-docs
---

Если вы столкнулись с проблемой в Jinja, может быть сложно понять, где искать дополнительную информацию. Мы рекомендуем проверять (в порядке приоритета):

1. [Документация по дизайну шаблонов Jinja](https://jinja.palletsprojects.com/page/templates/): Это лучший справочник для большинства Jinja, который вы будете использовать.
2. [Наш справочник функций Jinja](/reference/dbt-jinja-functions): Здесь документирована дополнительная функциональность, которую мы добавили в Jinja в dbt.
3. [Документация по таблицам Agate](https://agate.readthedocs.io/page/api/table.html): Если вы работаете с результатом запроса, dbt вернет его вам в виде таблицы agate. Это означает, что методы, которые вы вызываете на <Term id="table" />, принадлежат библиотеке Agate, а не Jinja или dbt.