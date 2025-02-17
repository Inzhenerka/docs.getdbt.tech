---
title: Сохраняются ли где-нибудь результаты проверки актуальности?
description: "Как получить доступ к результатам проверки актуальности источников"
sidebar_label: 'Доступ к результатам проверки актуальности источников'
id: dbt-source-freshness

---
Да!

Команда `dbt source freshness` выводит статус прохождения/предупреждения/ошибки для каждой <Term id="table" /> выбранной в снимке актуальности.

Кроме того, dbt по умолчанию записывает результаты проверки актуальности в файл в каталоге `target/` под названием `sources.json`. Вы также можете изменить это место назначения, используя флаг `-o` в команде `dbt source freshness`.

После включения проверки актуальности источников в рамках задания, настройте [Артефакты](/docs/deploy/artifacts) на странице **Детали проекта**, которую можно найти, выбрав имя вашей учетной записи в левом меню в dbt Cloud и нажав **Настройки учетной записи**. Вы можете увидеть текущий статус актуальности источников, нажав **Просмотр источников** на странице задания.