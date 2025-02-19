---
title: Быстрый старт с dbt Core, используя GitHub Codespaces
id: codespace
platform: 'dbt-core'
icon: 'fa-github'
level: 'Beginner'
hide_table_of_contents: true
tags: ['dbt Core','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы научитесь создавать codespace и сможете выполнить команду `dbt build` из него _менее чем за 5 минут_.

dbt Labs предоставляет шаблон [GitHub Codespace](https://docs.github.com/en/codespaces/overview), который вы (и любой другой пользователь) можете использовать для создания полноценной среды dbt с работающим и исполняемым проектом. Когда вы создаете codespace, [dev container](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) создает полностью функционирующую среду dbt, подключается к базе данных DuckDB и загружает год данных из нашего вымышленного кафе Jaffle Shop, которое продает еду и напитки в нескольких городах США. [README](https://github.com/dbt-labs/jaffle-shop-template#readme) для шаблона Jaffle Shop также предоставляет инструкции о том, как это сделать, вместе с анимированными GIF.

### Предварительные требования

- Чтобы использовать интерфейс командной строки (CLI) dbt, важно знать некоторые основы работы с терминалом. В частности, вы должны понимать команды `cd`, `ls` и `pwd`, чтобы легко перемещаться по структуре каталогов вашего компьютера.
- У вас есть [аккаунт GitHub](https://github.com/join).

## Связанные материалы

- [Создать репозиторий на GitHub](/guides/manual-install?step=2)
- [Создать свои первые модели](/guides/manual-install?step=3)
- [Тестировать и документировать ваш проект](/guides/manual-install?step=4)
- [Запланировать задачу](/guides/manual-install?step=5)
- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)

## Создание codespace

1. Перейдите в репозиторий `jaffle-shop-template` [repository](https://github.com/dbt-labs/jaffle-shop-template) после входа в ваш аккаунт GitHub.
1. Нажмите **Use this template** в верхней части страницы и выберите **Create new repository**.
1. Нажмите **Create repository from template**, когда закончите настройку параметров для вашего нового репозитория.
1. Нажмите **Code** (в верхней части страницы нового репозитория). На вкладке **Codespaces** выберите **Create codespace on main**. В зависимости от того, как вы настроили параметры вашего компьютера, это либо откроет новую вкладку браузера с средой разработки Codespace с запущенным VSCode, либо откроет новое окно VSCode с codespace.
1. Подождите, пока codespace завершит сборку, дождавшись завершения команды `postCreateCommand`; это может занять несколько минут:

    <Lightbox src="/img/codespace-quickstart/postCreateCommand.png" title="Подождите завершения postCreateCommand" />

    Когда эта команда завершится, вы можете начать использовать среду разработки codespace. Терминал, в котором выполнялась команда, закроется, и вы получите приглашение в совершенно новом терминале.

1. В приглашении терминала вы можете выполнить любую команду dbt, которую хотите. Например:

    ```shell
    /workspaces/test (main) $ dbt build
    ```

    Вы также можете использовать [duckcli](https://github.com/dbcli/duckcli) для написания SQL-запросов к хранилищу из командной строки или создания отчетов в проекте [Evidence](https://evidence.dev/), предоставленном в каталоге `reports`.
    
    Для получения полной информации обратитесь к [справочнику команд dbt](https://docs.getdbt.com/reference/dbt-commands). Общие команды:
    
    - [dbt compile](https://docs.getdbt.com/reference/commands/compile) — генерирует исполняемый SQL из файлов исходного кода вашего проекта
    - [dbt run](https://docs.getdbt.com/reference/commands/run) — компилирует и выполняет ваш проект
    - [dbt test](https://docs.getdbt.com/reference/commands/test) — компилирует и тестирует ваш проект
    - [dbt build](https://docs.getdbt.com/reference/commands/build) — компилирует, выполняет и тестирует ваш проект

## Генерация большего набора данных

Если вы хотите работать с более крупным набором данных Jaffle Shop, вы можете сгенерировать произвольное количество лет вымышленных данных из вашего codespace.

1. Установите Python-пакет под названием [jafgen](https://pypi.org/project/jafgen/). В приглашении терминала выполните:

    ```shell
    /workspaces/test (main) $ python -m pip install jafgen
    ```

1. Когда установка завершится, выполните:
    ```shell
    /workspaces/test (main) $ jafgen --years NUMBER_OF_YEARS
    ``` 
    Замените `NUMBER_OF_YEARS` на количество лет, которое вы хотите сымитировать. Эта команда создает CSV-файлы и сохраняет их в папке `jaffle-data`, и они автоматически подключаются на основе файла `sources.yml` и адаптера [dbt-duckdb](/docs/core/connect-data-platform/duckdb-setup).

По мере увеличения количества лет, требуется экспоненциально больше времени для генерации данных, так как магазины Jaffle Shop увеличиваются в размере и количестве. Для хорошего баланса между размером данных и временем сборки, dbt Labs предлагает максимум 6 лет.

</div>