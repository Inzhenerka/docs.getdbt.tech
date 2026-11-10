---
title: Быстрый старт с dbt v1 и DuckDB
id: duckdb
description: "Научитесь использовать dbt v1 с DuckDB."
hoverSnippet: "Научитесь использовать dbt v1 с DuckDB."
platform: 'dbt-core'
icon: 'duckdb-seeklogo'
level: 'Beginner'
hide_table_of_contents: true
tags: ['Quickstart']
agent_guidance:
  pacing: In the first reply, confirm the reader’s prerequisites and connection path before listing steps. Then default to one guide section per reply (combine two or three short sections), with all its steps, labeled Step 1, Step 2, and so on, and confirm the success check before continuing. If the reader asks for a different pace, follow it.
  safety: Never ask for passwords or keys in chat.
  signup_link: If the reader wants to try the dbt platform, share https://www.getdbt.com/signup?utm_source=ai_assistant&utm_medium=docs_md&utm_campaign=duckdb-qs
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом кратком руководстве вы узнаете, как использовать <Constant name="core" /> вместе с DuckDB, чтобы быстро и эффективно начать работу. [DuckDB](https://duckdb.org/) — это система управления базами данных с открытым исходным кодом, предназначенная для аналитических нагрузок. Она обеспечивает быстрый и удобный доступ к большим наборам данных, что делает её хорошо подходящей для задач аналитики данных.

В этом руководстве используется DuckDB с CLI <Constant name="core" />. Для dbt v2 см. [Настройка DuckDB](/docs/local/connect-data-platform/duckdb-setup?version=2).

В этом руководстве будет показано, как:

- Создайте виртуальную среду разработки с помощью шаблона, предоставленного dbt Labs.
- Мы настроим полнофункциональную среду dbt с рабочим проектом, готовым к запуску. Среда codespace автоматически подключается к базе данных DuckDB и загружает данные за год из нашего вымышленного кафе Jaffle Shop, которое продаёт еду и напитки в нескольких городах США.
- Выполните шаги, описанные в репозитории `jaffle_shop_duckdb`, а если хотите подробнее изучить код, обратитесь к [README](https://github.com/dbt-labs/jaffle_shop_duckdb/blob/duckdb/README.md) шаблона Jaffle Shop.
- Выполните любую команду dbt в терминале среды. 
- Сгенерируйте более объёмный набор данных для кафе Jaffle Shop (например, данные за пять лет вместо одного года).

<AgentPrompt />

Узнать больше можно на качественных [курсах и практических занятиях dbt Learn](https://learn.getdbt.com).


### Связанный контент {#related-content}


- [Настройка DuckDB](/docs/local/connect-data-platform/duckdb-setup)
- [Создайте репозиторий GitHub](/guides/manual-install?step=2)
- [Создайте свои первые модели](/guides/manual-install?step=3)
- [Протестируйте и задокументируйте свой проект](/guides/manual-install?step=4)
- [Начните работу с dbt Wizard](/docs/platform/wizard-overview#get-started), чтобы создавать модели с помощью ИИ, а не вручную


## Предварительные требования {#prerequisites}

- При использовании DuckDB с <Constant name="core" /> вам потребуется CLI. В настоящее время DuckDB не поддерживается в <Constant name="dbt_platform" />.
- Важно знать основы работы с терминалом. В частности, вы должны понимать, как использовать `cd`, `ls` и `pwd`, чтобы легко перемещаться по структуре каталогов вашего компьютера.
- У вас есть [учётная запись GitHub](https://github.com/join).
- У вас установлен Python 3.12 или более поздней версии. При использовании более ранних версий установка зависимостей из `requirements.txt` может завершиться ошибкой (например, для `networkx` 3.7 требуется Python 3.12 или более поздней версии).

## Настройка DuckDB для <Constant name="core" />

В этом разделе приведено пошаговое руководство по настройке DuckDB для использования в локальных окружениях (Mac и Windows) и в веб-браузере.

В репозитории есть файл [`requirements.txt`](https://github.com/dbt-labs/jaffle_shop_duckdb/blob/duckdb/requirements.txt), который используется для установки <Constant name="core" />, DuckDB и всех остальных необходимых зависимостей. Вы можете просмотреть этот файл, чтобы узнать, что будет установлено на вашем компьютере. Обычно он находится в корневом каталоге проекта рядом с другими ключевыми файлами, такими как `dbt_project.yml`. Если его там нет, мы покажем, что делать, на следующих шагах.

Ниже приведён пример файла `requirements.txt` рядом с другими ключевыми файлами, такими как `dbt_project.yml`:


```shell

/my_dbt_project/
├── dbt_project.yml
├── models/
│   ├── my_model.sql
├── tests/
│   ├── my_test.sql
└── requirements.txt

```

Дополнительную информацию см. в разделе [Настройка DuckDB](/docs/local/connect-data-platform/duckdb-setup).

<Tabs>
  <TabItem value="local" label="Local">


1. Сначала [клонируйте](https://git-scm.com/docs/git-clone) git-репозиторий Jaffle Shop, выполнив следующую команду в терминале:



    ```bash
    git clone https://github.com/dbt-labs/jaffle_shop_duckdb.git

    ```

2. Перейдите в каталог `jaffle_shop_duckdb` из командной строки:

    ```shell

    cd jaffle_shop_duckdb

    ```


3. Установите <Constant name="core" /> и DuckDB в виртуальном окружении.

    <Expandable alt_header="Пример для Mac" >

    ```shell

    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install --upgrade pip
    python3 -m pip install -r requirements.txt
    source venv/bin/activate

    ```
    </Expandable>

    <Expandable alt_header="Пример для Windows" >

    ```shell

    python -m venv venv
    venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    venv\Scripts\activate.bat

    ```

    </Expandable>

    <Expandable alt_header="Пример для Windows PowerShell" >

    ```shell

    python -m venv venv
    venv\Scripts\Activate.ps1
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    venv\Scripts\Activate.ps1

    ```
    </Expandable>


4. Убедитесь, что ваш профиль настроен корректно, выполнив следующие [команды dbt](/reference/dbt-commands) из командной строки:

    - [dbt seed](/reference/commands/seed) — загружает CSV-файлы из каталога seed-paths проекта в хранилище данных
    - [dbt compile](/reference/commands/compile) — генерирует исполняемый SQL из исходных файлов проекта
    - [dbt run](/reference/commands/run) — компилирует и выполняет проект
    - [dbt test](/reference/commands/test) — компилирует и запускает тесты проекта
    - [dbt build](/reference/commands/build) — компилирует, выполняет и тестирует проект
    - [dbt docs generate](/reference/commands/cmd-docs?version=1.12#dbt-docs-generate) — генерирует документацию проекта
    - [dbt docs serve](/reference/commands/cmd-docs?version=1.12#dbt-docs-serve) — запускает веб-сервер на порту 8080 для локального просмотра документации и автоматически открывает сайт в браузере по умолчанию

Полные сведения см. в [справочнике команд dbt](/reference/dbt-commands).

Ниже показан пример успешного вывода:

```jinja

(venv) ➜  jaffle_shop_duckdb git:(duckdb) dbt build
15:10:12  Running with dbt=x.y.z
15:10:13  Registered adapter: duckdb=x.y.z
15:10:13  Found 5 models, 3 seeds, 20 data tests, 416 macros
15:10:13  
15:10:14  Concurrency: 24 threads (target='dev')
15:10:14  
15:10:14  1 of 28 START seed file main.raw_customers ..................................... [RUN]
15:10:14  2 of 28 START seed file main.raw_orders ........................................ [RUN]
15:10:14  3 of 28 START seed file main.raw_payments ...................................... [RUN]
....

15:10:15  27 of 28 PASS relationships_orders_customer_id__customer_id__ref_customers_ .... [PASS in 0.32s]
15:10:15  
15:10:15  Finished running 3 seeds, 3 view models, 20 data tests, 2 table models in 0 hours 0 minutes and 1.52 seconds (1.52s).
15:10:15  
15:10:15  Completed successfully
15:10:15  
15:10:15  Done. PASS=28 WARN=0 ERROR=0 SKIP=0 TOTAL=28

```
Для выполнения запросов к данным можно использовать следующие полезные команды из командной строки:

- `dbt show --select "raw_orders"` &mdash; выполняет запрос к хранилищу данных и выводит предварительный просмотр результатов в терминале.
- [`dbt source`](/reference/commands/source) &mdash; предоставляет подкоманду [`dbt source freshness`](/reference/commands/source#dbt-source-freshness), которая полезна при работе с исходными данными. 
   - `dbt source freshness` &mdash; проверяет свежесть (насколько актуальны данные) конкретной исходной таблицы.

:::note

Эти шаги завершатся ошибкой, если вы попытаетесь запустить данный проект в другом хранилище данных (за пределами этого демонстрационного примера с DuckDB). В этом случае потребуется перенастроить файлы проекта под ваше хранилище. Обязательно учитывайте это, если вы используете адаптер, поддерживаемый сообществом.

:::


### Устранение неполадок {#troubleshoot}

    <Expandable alt_header="Ошибка Could not set lock on file">

    ```Jinja

    IO Error: Could not set lock on file "jaffle_shop.duckdb": Resource temporarily unavailable

    ```

    Это известная проблема DuckDB. Попробуйте отключиться от всех сессий, которые блокируют базу данных. Если вы используете DBeaver, это означает полное закрытие DBeaver (простое отключение не всегда помогает).

    В крайнем случае удаление файла базы данных позволит продолжить работу (_но_ при этом вы потеряете все данные).

    </Expandable>


  </TabItem>

  <TabItem value="web" label="Веб-браузер">

1. Перейдите в репозиторий `jaffle-shop-template` на [GitHub](https://github.com/dbt-labs/jaffle_shop_duckdb) после входа в свой аккаунт.
1. Нажмите **Use this template** в верхней части страницы и выберите **Create new repository**.
1. После настройки параметров нового репозитория нажмите **Create repository from template**.
1. Нажмите **Code** (в верхней части страницы нового репозитория). На вкладке **Codespaces** выберите **Create codespace on main**. В зависимости от настроек вашего компьютера откроется новая вкладка браузера с окружением Codespace и запущенным VSCode либо новое окно VSCode с этим codespace.
1. Дождитесь завершения сборки codespace — необходимо, чтобы команда `postCreateCommand` завершилась; это может занять несколько минут:

    <Lightbox src="/img/codespace-quickstart/postCreateCommand.png" title="Дождитесь завершения postCreateCommand" />

    После завершения этой команды вы сможете начать работу в окружении codespace. Терминал, в котором выполнялась команда, закроется, и вы увидите приглашение в новом терминале.

1. В терминале вы можете выполнять любые команды dbt. Например:

    ```shell
    /workspaces/test (main) $ dbt build
    ```

    Вы также можете использовать [duckcli](https://duckdb.org/docs/api/cli/overview.html) для написания SQL-запросов к хранилищу из командной строки или для построения отчётов в проекте [Evidence](https://evidence.dev/), который находится в каталоге `reports`.

    Для полной информации см. [справочник команд dbt](/reference/dbt-commands). Часто используемые команды:

    - [dbt compile](/reference/commands/compile) — генерирует исполняемый SQL из исходных файлов проекта
    - [dbt run](/reference/commands/run) — компилирует и выполняет проект
    - [dbt test](/reference/commands/test) — компилирует и запускает тесты проекта
    - [dbt build](/reference/commands/build) — компилирует, выполняет и тестирует проект


  </TabItem>

</Tabs>


## Локальное хранилище {#local-storage}

DuckDB хранит данные в локальном файле `.duckdb`. Его расположение задаёт поле `path` в [`profiles.yml`](/docs/local/profiles.yml).

В этом руководстве проект использует файл `jaffle_shop.duckdb`. После запуска `dbt build` проверьте, что файл базы данных создан, следующей командой:

```shell
ls -lah *.duckdb
```

В каталоге проекта должен появиться файл `jaffle_shop.duckdb`. Он содержит таблицы и представления, созданные dbt, и сохраняется между запусками.

Если удалить файл:

```shell
rm *.duckdb
```

Повторный запуск `dbt build` создаст его заново.

:::note
Относительный путь, например `./local.duckdb`, отсчитывается от каталога, где находится `profiles.yml`.
:::



## Генерация большего набора данных {#generate-a-larger-data-set}

Если вы хотите работать с большим объёмом данных Jaffle Shop, вы можете сгенерировать произвольное количество лет фиктивных данных прямо в вашем codespace.

1. Установите Python-пакет [jafgen](https://pypi.org/project/jafgen/). В терминале выполните:

    ```shell
    python -m pip install jafgen
    ```

1. После завершения установки выполните:

    ```shell
jafgen NUMBER_OF_YEARS
    ``` 
    Замените `NUMBER_OF_YEARS` на количество лет, за которые вы хотите смоделировать данные. Например, чтобы сгенерировать данные за 6 лет, выполните `jafgen 6`. Эта команда создаёт CSV-файлы и сохраняет их в папке `jaffle-data`. Они автоматически подключаются как источники на основе файла `sources.yml` и адаптера [dbt-duckdb](/docs/local/connect-data-platform/duckdb-setup).

По мере увеличения количества лет время генерации данных растёт экспоненциально, так как магазины Jaffle Shop увеличиваются в размере и количестве. Для разумного баланса между объёмом данных и временем сборки dbt Labs рекомендует максимум 6 лет.

## Следующие шаги {#next-steps}

- Страница [О проектах](/docs/build/projects) знакомит вас со структурой проекта dbt и его компонентами.
- [Справочник команд dbt](/reference/dbt-commands) описывает доступные команды и их назначение.
- [Курсы dbt Labs](https://courses.getdbt.com/collections) предлагают разнообразные учебные модули начального, среднего и продвинутого уровней, которые помогут вам стать экспертом по dbt. 
- Когда вы оцените потенциал dbt и поймёте, какую пользу он может принести вашей организации, зарегистрируйтесь для бесплатного пробного использования [<Constant name="dbt" />](https://www.getdbt.com/signup). Это самый быстрый и простой способ развернуть dbt уже сегодня!
- Ознакомьтесь с другими [руководствами по быстрому старту](/guides?tags=Quickstart), чтобы начать интеграцию с вашим существующим хранилищем данных.

- Страница [About projects](/docs/build/projects) описывает структуру проекта dbt и его компоненты.
- В [справочнике команд dbt](/reference/dbt-commands) описаны доступные команды и их назначение.
- [Курсы dbt Labs](https://courses.getdbt.com/collections) предлагают обучающие модули начального, среднего и продвинутого уровня, которые помогут вам стать экспертом по dbt.
- Когда вы увидите потенциал dbt для вашей организации, зарегистрируйтесь для бесплатного пробного периода [<Constant name="cloud" />](https://www.getdbt.com/signup). Это самый быстрый и простой способ развернуть dbt на сегодняшний день.
- Ознакомьтесь с другими [quickstart‑руководствами](/guides?tags=Quickstart), чтобы начать интеграцию с вашим существующим хранилищем данных.

Кроме того, с новым пониманием основ работы с DuckDB стоит рассмотреть оптимизацию вашей настройки: [документируйте проект](/docs/build/documentation), [зафиксируйте изменения](/guides/duckdb) и [настройте расписание выполнения](/guides/duckdb#schedule-a-job).

### Документирование проекта {#document-your-project}

Чтобы задокументировать проекты dbt с DuckDB, выполните следующие шаги:

- Используйте команду `dbt docs generate` для компиляции информации о проекте dbt и хранилище данных в файлы `manifest.json` и `catalog.json`
- Запустите команду [`dbt docs serve`](/reference/commands/cmd-docs?version=1.12#dbt-docs-serve), чтобы создать локальный веб‑сайт на основе сгенерированных `.json`‑файлов. Это позволит просматривать документацию проекта в браузере.
- Улучшите документацию, добавляя [описания](/reference/resource-properties/description) моделей, колонок и источников с помощью ключа `description` в YAML‑файлах.

### Фиксация изменений {#commit-your-changes}

Зафиксируйте изменения, чтобы репозиторий содержал актуальную версию кода.

1. В созданном вами GitHub‑репозитории выполните в терминале следующие команды:

```shell
git add .
git commit -m "Your commit message"
git push
```

2. Вернитесь в репозиторий GitHub и убедитесь, что новые файлы были добавлены.

### Планирование задания {#schedule-a-job}

1. Убедитесь, что <Constant name="core" /> установлен и настроен для подключения к вашему экземпляру DuckDB.
2. Создайте проект dbt и определите ваши [`models`](/docs/build/models), [`seeds`](/reference/seed-properties) и [`tests`](/reference/commands/test).
3. Используйте планировщик, например [Prefect](/docs/deploy/deployment-tools#prefect), чтобы запускать задания dbt по расписанию. Вы можете создать DAG (направленный ациклический граф), который будет запускать команды dbt через заданные интервалы.
4. Напишите скрипт, который выполняет команды dbt, такие как [`dbt run`](/reference/commands/run), `dbt test` и другие.
5. Используйте выбранный планировщик для запуска скрипта с нужной периодичностью.

<ConfettiTrigger>

Поздравляем с успешным прохождением руководства 🎉!

</ConfettiTrigger>

<Snippet path="quickstarts/connect-your-ai" />

</div>
