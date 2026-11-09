---
title: "Быстрый старт с dbt v2"
id: "dbt"
# time_to_complete: '30 minutes' закомментировано до проведения тестирования
level: 'Beginner'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt v2', 'dbt platform','Quickstart']
recently_updated: true
agent_guidance:
  pacing: In the first reply, confirm the reader’s prerequisites and connection path before listing steps. Then default to one guide section per reply (combine two or three short sections), with all its steps, labeled Step 1, Step 2, and so on, and confirm the success check before continuing. If the reader asks for a different pace, follow it.
  safety: Never ask for passwords or keys in chat.
  signup_link: If the reader wants to try the dbt platform, share https://www.getdbt.com/signup?utm_source=ai_assistant&utm_medium=docs_md&utm_campaign=dbt-qs
---

<div style={{maxWidth: '900px'}}>
import FusionDWH from '/snippets/_v2-dwh.md';

## Введение {#introduction}

import FusionLifecycle from '/snippets/_v2-lifecycle-callout.md';

<FusionLifecycle />

<Constant name="fusion_engine" /> — это новый мощный подход к классическим идеям dbt! Полностью переписанный с нуля на Rust, <Constant name="fusion" /> позволяет компилировать и запускать проекты dbt быстрее, чем когда-либо, — зачастую за считаные секунды. 

Это руководство по быстрому старту поможет вам с нуля настроить и запустить свой первый проект dbt с помощью <Constant name="fusion" /> и VS Code. К концу руководства у вас будут:
- Работающий проект dbt (`jaffle_shop`), созданный с помощью <Constant name="fusion_engine" />
- Установленное и подключённое расширение dbt для VS Code  
- Возможность просматривать результаты, компилировать проект и выполнять команды dbt прямо из IDE 

<AgentPrompt />

### О <Constant name="fusion_engine" /> {#about-dbt-v2}

<Constant name="fusion" /> и предоставляемые им возможности доступны в нескольких средах:

| Среда | Как использовать <Constant name="fusion" /> |
|--------------|-------------------|
| **<Constant name="studio_ide" />** | <Constant name="fusion" /> включается автоматически; просто [обновите свои среды](/docs/dbt-versions/upgrade-dbt-platform-version#dbt-v2). |
| **Локальный CLI** | [Установите <Constant name="fusion_engine" />](/docs/local/install-dbt?version=2) локально, следуя этому руководству. |
| **VS Code / Cursor IDE** | [Установите расширение dbt](/docs/install-dbt-extension), чтобы использовать интерактивные возможности <Constant name="fusion" /> в своём редакторе. |

Чтобы узнать, какой инструмент лучше всего вам подходит, ознакомьтесь со страницей [доступности v2](/docs/dbt/dbt-availability). Чтобы узнать больше о <Constant name="fusion_engine" /> и принципах его работы, прочитайте раздел [о <Constant name="fusion_engine" />](/docs/introduction).

## Предварительные требования {#prerequisites}

Чтобы получить максимум от этого руководства, вам потребуется:

Чтобы в полной мере воспользоваться этим руководством, необходимо выполнить следующие предварительные требования:

- У вас должно быть базовое понимание [проектов dbt](/docs/build/projects), [рабочих процессов git](/docs/platform/git/git-version-control) и [требований к хранилищам данных](/docs/supported-data-platforms).
- Убедитесь, что вы используете поддерживаемый адаптер и метод аутентификации:
    <FusionDWH /> 
- Для запуска <Constant name="fusion_engine" /> вам понадобится компьютер с macOS (Terminal), Linux или Windows (Powershell). 
- У вас должен быть установлен [Visual Studio Code](https://code.visualstudio.com/). Редактор кода [Cursor](https://www.cursor.com/en) также подойдёт, но инструкции в этом руководстве ориентированы на VS Code.
- Вам необходимы права администратора или разрешение на установку программ на вашем компьютере.

### Чему вы научитесь {#what-youll-learn}

Следуя этому руководству, вы сможете:
- Настроить полнофункциональную среду dbt с работающим проектом  
- Установить и использовать <Constant name="fusion_engine" /> и расширение dbt для VS Code  
- Выполнять команды dbt из IDE или терминала  
- Просматривать данные и граф зависимостей, быстрее писать SQL с помощью автодополнения и многое другое!

Дополнительные материалы доступны в виде качественных [курсов и воркшопов dbt Learn](https://learn.getdbt.com/).  

## Установка {#installation}

Легко представить <Constant name="fusion_engine" /> и расширение dbt как два разных продукта, но вместе они образуют мощную комбинацию, которая раскрывает весь потенциал dbt. Думайте о <Constant name="fusion_engine" /> именно как о движке. Расширение dbt и VS Code — это шасси, а вместе они образуют мощное средство для преобразования ваших данных. 

:::info
- Вы можете установить <Constant name="fusion_engine" /> и использовать его отдельно через CLI.
- Вы *не можете* использовать расширение dbt без установленного <Constant name="fusion" />.
- Используйте `dbt` в качестве команды по умолчанию. Если у вас уже установлен другой инструмент командной строки dbt (например, <Constant name="platform_cli" /> или <Constant name="core" />), вы можете использовать `dbtf` как однозначный псевдоним для <Constant name="fusion" />.
:::

Ниже приведены основные шаги из руководств по установке [<Constant name="fusion_engine" />](/docs/local/install-dbt?version=2) и [расширения](/docs/install-dbt-extension):

1. Выполните следующие команды, чтобы установить CLI <Constant name="fusion_engine" />:
    ```shell
    python -m pip install dbt
    ```

### Проверка установки <Constant name="fusion_engine" /> {#verify-the-installation}

1. После установки откройте новое окно командной строки и проверьте версию, чтобы убедиться, что <Constant name="fusion" /> установлен корректно.
    ```bash
    dbt --version
    ```
2. Вы должны увидеть вывод, похожий на следующий:
    ```bash
    dbt 2.0.0
    ```

### Установка расширения dbt для VS Code {#install-the-dbt-vs-code-extension}

Расширение dbt для VS Code доступно в [Visual Studio extension marketplace](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt). Его можно установить прямо из редактора:

1. Перейдите на вкладку **Расширения** в VS Code (или Cursor).
2. Найдите `dbt` и выберите расширение от издателя `dbt Labs, LLC`.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="60%" title="Поиск расширения"/>
3. Нажмите **Установить**.
4. Когда появится соответствующий запрос, вы можете войти в учетную запись <Constant name="dbt_platform" /> или пропустить этот шаг. Чтобы вернуться к нему позже, воспользуйтесь инструкциями по [входу в учетную запись](/docs/sign-in-dbt-extension) или [установке](/docs/install-dbt-extension).
5. Убедитесь, что расширение установлено: найдите надпись **dbt Extension** в строке состояния. Если она отображается, расширение успешно установлено!
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="Проверка установки в строке состояния."/>

## Инициализация проекта Jaffle Shop {#initialize-the-jaffle-shop-project}

1. Выполните `dbt init` в терминале из каталога, в котором хотите создать проект. Команда `dbt init` создаст пример проекта и поможет вам настроить профиль подключения.
   - Если у вас *нет* профиля подключения, который вы хотите использовать, запустите `dbt init` и следуйте подсказкам для настройки профиля:
    - Если у вас уже есть профиль подключения, который вы хотите использовать, укажите флаг `--skip-profile-setup`, а затем отредактируйте созданный файл `dbt_project.yml`, заменив `profile: jaffle_shop` на `profile: <YOUR-PROFILE-NAME>`.

        ```bash
        dbt init --skip-profile-setup
        ```

- Если вы создали новые учетные данные с помощью интерактивных запросов, `init` автоматически запускает `dbt debug` в конце. Это позволяет убедиться, что созданный профиль обеспечивает корректное подключение к базе данных.

2. Перейдите в каталог созданного проекта:
    ```bash
    cd jaffle_shop
    ```

3. Соберите dbt‑проект (включая создание примерных данных):
    ```bash
    dbt build
    ```

#### Просмотр метаданных в Catalog

    Выполните `dbt build --write-catalog` локально, чтобы сгенерировать метаданные документации (команда `dbt build` без этого флага не генерирует метаданные документации). Чтобы просмотреть эти метаданные в <Constant name="catalog" />, запустите задание в <Constant name="dbt_platform" />, чтобы загрузить метаданные на платформу. Подробнее см. в разделе [Поведение платформы](/reference/commands/cmd-docs?version=2.0#dbt-platform-behavior).

    Это позволит:
    - Загрузить демонстрационные данные в ваше хранилище данных
    - Создать, построить и протестировать модели
    - Убедиться, что ваша среда dbt полностью работоспособна

## Изучение возможностей с расширением dbt для VS Code {#explore-with-the-dbt-vs-code-extension}

Расширение dbt для VS Code (доступное для VS Code и Cursor) компилирует и собирает ваш проект с помощью <Constant name="fusion_engine" /> — мощной и невероятно быстрой реализации dbt, созданной с нуля.

Хотите увидеть <Constant name="fusion" /> в действии? Посмотрите следующее видео‑демо, чтобы понять, как это работает:

<div style={{ position: 'relative', maxWidth: '960px', margin: '2rem auto', overflow: 'hidden', borderRadius: '12px', height: '500px', boxShadow: 'var(--ifm-global-shadow-lw)' }}>
  <iframe
    src="https://app.storylane.io/share/a1rkqx0mbd7a" 
    title="dbt v2 + VS Code extension walkthrough"
    style={{ position: 'relative', top: '-48px', height: '900px', width: '100%', border: 0, paddingBottom:'calc(42.20% + 25px)',transform: 'scale(1)'}}
    allow="fullscreen; autoplay; encrypted-media"
  />
</div>

Теперь, когда ваш проект работает, откройте его в VS Code или Cursor и посмотрите на <Constant name="fusion" /> в действии:

1. Откройте меню **View** и нажмите **Command Palette**. Введите **Workspaces: Add Folder to Workspace**.
2. Выберите папку `jaffle_shop`.
        Если вы не добавите корневую папку проекта dbt в рабочую область, [языковой сервер dbt](https://docs.getdbt.com/blog/dbt-fusion-engine-components#the-dbt-vs-code-extension-and-language-server) (LSP) не запустится. LSP обеспечивает такие возможности, как автодополнение, отображение информации при наведении и подсветка ошибок непосредственно в коде.
3. Нажмите на **логотип dbt** на боковой панели, чтобы открыть панель **Get started**. Эта панель определяет ваше окружение и показывает следующий шаг настройки: установку исполняемого файла <Constant name="fusion" />, подтверждение того, что проект открыт, проверку совместимости с <Constant name="fusion" /> или регистрацию. Если вы ещё не перевели свой проект на <Constant name="fusion" />, прямо на панели можно выбрать **Start with an agent** (Copilot или Cursor) или **Start manually in CLI**. Подробности см. в разделе [Начало работы](/docs/install-dbt-extension#%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%BE-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B).
4. Откройте файл модели, чтобы посмотреть определение модели `orders`. Именно эту модель мы будем использовать во всех примерах ниже.
    ```bash
        models/marts/orders.sql
    ```
5. В нижней панели найдите **Lineage** и **Query Results**, а в правом верхнем углу — **иконку dbt**. Если всё это отображается, расширение установлено и работает корректно!
    <Lightbox src="/img/docs/extension/extension-running.png" width="80%" title="Интерфейс VS Code с запущенным расширением."/>

Теперь вы готовы попробовать эти возможности на практике!

<!-- no toc -->
- [Просмотр данных и кода](#preview-data-and-code)
- [Навигация по проекту с помощью lineage‑инструментов](#navigate-your-project-with-lineage-tools)
- [Использование понимания SQL](#use-the-power-of-sql-understanding)
- [Ускорение стандартных dbt‑команд](#speed-up-common-dbt-commands)

#### Просмотр данных и кода {#preview-data-and-code}

Получайте полезные инсайты о трансформации данных на каждом этапе разработки.  
Вы можете быстро просматривать результаты моделей и структуру данных прямо из кода. Это помогает поэтапно проверять корректность логики.

1. Найдите **значок таблицы** для команды **Preview File** в правом верхнем углу. Нажмите на него, чтобы просмотреть результаты на вкладке **Query Results**.
    <Lightbox src="/img/docs/extension/preview-query-results.png" width="80%" title="Предварительный просмотр результатов запроса модели."/>
2. Нажмите **Preview CTE** над `orders as (`, чтобы просмотреть результаты на вкладке **Query Results**.
    <Lightbox src="/img/docs/extension/preview-cte-query-results-3.png" width="80%" title="Предварительный просмотр результатов запроса CTE."/>
3. Найдите значок кода для команды **Compile File** между значками dbt и таблицы. При нажатии на этот значок открывается окно со скомпилированной версией модели.
    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/docs/extension/compile-file-icon.png" width="50%" title="Значок команды Compile File."/>

    <Lightbox src="/img/docs/extension/compile-file.png" width="80%" title="Результаты выполнения команды Compile File."/>

    </DocCarousel>

#### Навигация по проекту с помощью инструментов отслеживания происхождения данных {#navigate-your-project-with-lineage-tools}

Понимание того, откуда пришли данные, почти так же важно, как и понимание того, куда они идут. Инструменты lineage позволяют визуализировать зависимости между моделями и на уровне отдельных колонок, углубляя понимание структуры проекта.

1. Откройте вкладку **Lineage**, чтобы увидеть lineage на уровне моделей.
    <Lightbox src="/img/docs/extension/extension-pane.png" width="80%" title="Визуализация lineage на уровне моделей."/>
1. Откройте меню **View**, выберите **Command Palette** и введите `dbt: Show Column Lineage`, чтобы увидеть lineage на уровне колонок во вкладке **Lineage**.
    <Lightbox src="/img/docs/extension/show-cll.png" width="80%" title="Показ lineage на уровне колонок."/>

#### Использование понимания SQL {#use-the-power-of-sql-understanding}

Пишите код умнее, а не сложнее. Автодополнение и контекстные подсказки помогают избегать ошибок и быстрее создавать корректный SQL.

1. Чтобы увидеть **Autocomplete** в действии, удалите `ref('stg_orders')` и начните вводить `ref(stg_`, чтобы увидеть подходящие имена моделей. Используйте стрелки вверх и вниз, чтобы выбрать `stg_orders`.
    <Lightbox src="/img/docs/extension/autocomplete.png" width="80%" title="Автодополнение имени модели."/>
1. Наведите курсор на `*`, чтобы увидеть список выбираемых колонок и их типы данных.
    <Lightbox src="/img/docs/extension/hover-star.png" width="80%" title="Наведение на * для просмотра имён колонок и типов данных."/>

#### Ускорение стандартных dbt‑команд {#speed-up-common-dbt-commands}

Тестирование, тестирование… микрофон включён? Да — и он готов выполнять ваши команды с молниеносной скоростью! Когда нужно проверить код с помощью различных dbt‑команд:

1. Иконка dbt в правом верхнем углу открывает список команд, доступных через расширение:
    <Lightbox src="/img/docs/extension/run-command.png" width="80%" title="Выберите команду через иконку dbt."/>
1. Если открыть меню **View**, выбрать **Command Palette** и ввести `>dbt:`, вы увидите полный список доступных команд.
    <Lightbox src="/img/docs/extension/extension-commands-all.png" width="80%" title="Команды dbt в командной строке."/>

<ConfettiTrigger>
Попробуйте выбрать некоторые из них и посмотрите, что они делают 😎

Это только начало. Уже доступно гораздо больше возможностей, и ещё больше появится в будущем. Обязательно ознакомьтесь с нашими ресурсами, чтобы узнать всё о <Constant name="fusion_engine" /> и расширении dbt для VS Code!

Это только начало. Возможностей уже много, и впереди — ещё больше. Обязательно изучите наши материалы, чтобы узнать всё о <Constant name="fusion_engine" /> и расширении dbt для VS Code!
</ConfettiTrigger>

<Snippet path="quickstarts/connect-your-ai" />

## Устранение неполадок

import FusionTroubleshooting from '/snippets/_v2-troubleshooting.md';

<FusionTroubleshooting />

import AboutFusion from '/snippets/_about-v2.md';

<AboutFusion hideQuickstartLink/>

</div>
