---
title: "О моделях dbt"
description: "Прочтите это руководство, чтобы узнать, как использовать модели при работе с dbt."
id: "models"
pagination_next: "docs/build/sql-models"
pagination_prev: null
---

dbt Core и Cloud состоят из различных движущихся частей, работающих в гармонии. Все они важны для того, что делает dbt — трансформации данных, то есть 'T' в ELT. Когда вы выполняете `dbt run`, вы запускаете модель, которая преобразует ваши данные, не покидая вашего хранилища.

Модели — это то место, где ваши разработчики проводят большую часть своего времени в среде dbt. Модели в основном пишутся в виде оператора `select` и сохраняются как файл `.sql`. Хотя определение простое, сложность выполнения будет варьироваться в зависимости от среды. Модели будут писаться и переписываться по мере изменения потребностей и поиска вашей организацией новых способов максимизации эффективности.

SQL — это язык, который большинство пользователей dbt будет использовать, но он не единственный для создания моделей. Начиная с версии 1.3, dbt Core и dbt Cloud поддерживают модели на Python. Модели на Python полезны для обучения или развертывания моделей data science, сложных преобразований или когда определенный пакет Python удовлетворяет потребности &mdash; например, использование библиотеки `dateutil` для разбора дат.

### Модели и современные рабочие процессы

Верхний уровень рабочего процесса dbt — это проект. Проект — это директория с файлом `.yml` (конфигурация проекта) и файлами `.sql` или `.py` (модели). Файл проекта сообщает dbt контекст проекта, а модели позволяют dbt знать, как построить конкретный набор данных. Для получения более подробной информации о проектах обратитесь к [О проектах dbt](/docs/build/projects).

Вашей организации может понадобиться всего несколько моделей, но, скорее всего, вам потребуется сложная структура вложенных моделей для преобразования необходимых данных. Модель — это один файл, содержащий финальный оператор `select`, и проект может иметь несколько моделей, и модели могут даже ссылаться друг на друга. Добавьте к этому множество проектов, и уровень усилий, необходимых для преобразования сложных наборов данных, может значительно улучшиться по сравнению со старыми методами.

Узнайте больше о моделях на страницах [SQL модели](/docs/build/sql-models) и [Python модели](/docs/build/python-models). Если вы хотите начать с небольшой практики, посетите наше [Руководство для начинающих](/guides) для получения инструкций по настройке примера данных Jaffle_Shop, чтобы вы могли на практике оценить мощь dbt.