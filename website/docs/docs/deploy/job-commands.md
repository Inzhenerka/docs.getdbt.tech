---
title: "Команды заданий"
id: "job-commands"
description: "Как использовать команды dbt, чтобы задавать задачи для ваших dbt jobs."
---

Production job в <Constant name="cloud" /> позволяет настроить систему, которая будет запускать dbt job и job commands по расписанию, вместо того чтобы выполнять dbt-команды вручную из командной строки или из [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio). Job состоит из команд, которые «цепочкой» выполняются как шаги запуска (run steps). Каждый шаг запуска может завершиться успехом или ошибкой, что влияет на итоговый статус job (Success, Cancel или Error).

Каждая job позволяет вам:

- Настраивать job commands
- Просматривать детали запусков job, включая тайминги, артефакты и подробные шаги запуска
- Открывать логи, чтобы просматривать их, помогать с отладкой проблем и видеть историю запусков dbt
- Настраивать уведомления и [другое](/docs/deploy/deployments#dbt-cloud)

## Типы команд job

Job commands — это конкретные задачи, которые выполняются в рамках job. Их можно настроить двумя способами: добавлять [dbt-команды](/reference/dbt-commands) или использовать опции‑чекбоксы в разделе **Commands**.

Во время запуска job команды выполняются «цепочкой» и идут как run steps. При добавлении dbt-команды в разделе **Commands** вы можете ожидать иные результаты по сравнению с вариантом через чекбоксы.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="85%" title="Настройка чекбоксов и списка команд"/>


### Встроенные команды

Каждый запуск job автоматически включает команду [`dbt deps`](/reference/commands/deps), поэтому вам не нужно добавлять ее в список **Commands** в настройках job. Также вы заметите, что у каждой job есть шаг повторного клонирования репозитория и подключения к data platform — это может повлиять на статус job, если эти шаги не выполнятся успешно.

**Результат job** &mdash; Во время запуска job built-in commands выполняются «цепочкой». Это означает, что если один из шагов в цепочке падает, последующие команды не выполняются, а вся job завершается со статусом "Error".

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/fail-dbtdeps.png" width="85%" title="Неуспешная job с ошибкой на шаге dbt deps"/>

### Команды-чекбоксы

Для каждой job у вас есть возможность выбрать чекбоксы [Generate docs on run](/docs/explore/build-and-view-your-docs) или [Run source freshness](/docs/deploy/source-freshness), чтобы запускать эти команды автоматически.

**Результат job для чекбокса Generate docs on run** &mdash; <Constant name="cloud" /> выполняет команду `dbt docs generate` _после_ команд из списка. Если этот шаг падает, job всё равно может завершиться успешно, если все последующие шаги выполнятся успешно. Подробнее см. [Set up documentation job](/docs/explore/build-and-view-your-docs).

**Результат job для чекбокса Source freshness** &mdash; <Constant name="cloud" /> выполняет команду `dbt source freshness` первым шагом запуска в job. Если этот шаг падает, job всё равно может завершиться успешно, если все последующие шаги выполнятся успешно. Подробнее см. [Source freshness](/docs/deploy/source-freshness).

### Список команд

Вы можете добавлять и удалять столько dbt-команд, сколько нужно для каждой job. Однако должна быть как минимум одна dbt-команда. На странице [dbt Command reference](/reference/dbt-commands) некоторые команды помечены как "<Constant name="cloud" /> CLI" или "<Constant name="core" />". Это значит, что они предназначены для использования в <Constant name="core" /> или <Constant name="cloud" /> CLI, а не в <Constant name="cloud_ide" />.

:::tip Используйте selectors

Используйте [selectors](/reference/node-selection/syntax) как мощный способ выбирать и выполнять части проекта во время запуска job. Например, чтобы запускать тесты для `one_specific_model`, используйте селектор: `dbt test --select one_specific_model`. Job всё равно выполнится, даже если selector не совпадет ни с одной моделью.

:::

#### Кастомные команды для Compare changes
Если у вас включена функция Advanced CI [compare changes](/docs/deploy/advanced-ci#compare-changes) и вы выбрали чекбокс **dbt compare**, вы можете добавить кастомные dbt-команды, чтобы оптимизировать выполнение сравнения (например, исключить большие модели или группы моделей по тегам). Сравнение на больших моделях может заметно увеличить время выполнения CI jobs.

<Lightbox src="/img/docs/deploy/dbt-compare.jpg" width="90%" title="Добавление кастомных dbt-команд при использовании dbt compare" />

Ниже приведены примеры, показывающие, как можно кастомизировать поле команды dbt compare:

- Исключить большую модель `fct_orders` из сравнения, чтобы запускать CI job на меньшем количестве или меньшем размере моделей и сократить время/потребление ресурсов. Используйте следующую команду:

  
  ```sql
  --select state:modified --exclude fct_orders
  ```
- Исключите модели на основе тегов для сценариев, когда модели имеют общую функцию или характеристику. Используйте следующую команду:

   ```sql 
      --select state modified --exclude tag:tagname_a tag:tagname_b
   ```
- Включите модели, которые были непосредственно изменены, а также те, которые находятся на один шаг ниже по потоку, используя селектор `modified+1`. Используйте следующую команду:
  ```sql
  --select state:modified+1
  ```

#### Результат job
Во время запуска job команды выполняются «цепочкой» и идут как run steps. Если один из шагов в цепочке падает, последующие шаги не выполняются, и job завершится с ошибкой.

На изображении ниже первые четыре run steps успешны. Однако если пятый шаг (`dbt run --select state:modified+ --full-refresh --fail-fast`) падает, следующие шаги не выполняются, и вся job завершается с ошибкой. Неуспешная job возвращает ненулевой [exit code](/reference/exit-codes) и статус job "Error":

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/skipped-jobs.png" width="85%" title="Неуспешный запуск job с ошибкой на run step"/>

## Ошибки выполнения job commands

Ошибки job commands могут означать разные вещи для разных команд. Некоторые распространенные причины, по которым job command может завершиться неуспешно:

- **Ошибка на `dbt run`** &mdash; [`dbt run`](/reference/commands/run) выполняет скомпилированные SQL-файлы моделей в текущей target database. Команда упадет, если в любой из собранных моделей есть ошибка. Тесты на upstream-ресурсах предотвращают запуск downstream-ресурсов, а упавший тест приведет к пропуску downstream.

- **Ошибка на `dbt test`** &mdash; [`dbt test`](/reference/commands/test) запускает тесты, определенные для моделей, sources, snapshots и seeds. Тест может пройти, упасть или выдать warning в зависимости от его [severity](/reference/resource-configs/severity). Если вы не настроили [warnings как errors](/reference/global-configs/warnings), только error останавливает следующий шаг.

- **Ошибка на `dbt build`** &mdash; [`dbt build`](/reference/commands/build) запускает модели, тесты, snapshots и seeds. Эта команда выполняет ресурсы в порядке, заданном DAG. Если любой upstream-ресурс упадет, все downstream-ресурсы будут пропущены, и команда завершится с кодом ошибки 1.

- **Ошибки selector’ов**
   - Если [`select`](/reference/node-selection/set-operators) выбирает несколько нод и одна из них падает, job получит exit code `1`, а последующая команда в job завершится ошибкой. Если вы указали флаг [`—fail-fast`](/reference/global-configs/failing-fast), то первая ошибка остановит всё выполнение для моделей, которые выполняются в данный момент.

   - Если selector не совпадает ни с одной нодой, это не считается ошибкой.


## Связанные материалы
- [Job creation best practices](https://discourse.getdbt.com/t/job-creation-best-practices-in-dbt-cloud-feat-my-moms-lasagna/2980)
- [dbt Command reference](/reference/dbt-commands)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)
- [Build and view your docs](/docs/explore/build-and-view-your-docs)
