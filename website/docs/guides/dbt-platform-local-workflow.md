---
title: "Гибридная разработка с dbt platform и dbt v2"
id: "dbt-platform-local-workflow"
level: 'Beginner'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt v2', 'dbt platform', 'Local development']
recently_updated: true
---

## Введение {#introduction}

Гибридные развертывания dbt становятся всё более распространенными. Пользователи <Constant name="fusion" /> часто работают сразу в нескольких местах: в <Constant name="dbt_platform" /> для выполнения запусков в рабочей среде и разработки в IDE, а также на локальном компьютере с помощью CLI <Constant name="dbt_platform"/> или расширения dbt для VS Code.

Эти варианты работы полностью поддерживаются для пользователей <Constant name="dbt_platform" />. Согласование учетных данных, переменных окружения и версий движка между средами — одна из первых эксплуатационных задач, с которыми сталкиваются команды.

В этом руководстве рассматриваются выбор команды для запуска нужного инструмента, учетные данные, переменные окружения, версии <Constant name="fusion" />, а также Mesh и отложенное разрешение ссылок (deferral). Для поддержания согласованности приведены конкретные шаги с примерами, готовыми к копированию.

Если в одном проекте вы используете и <Constant name="platform_cli" />, и локальную сборку <Constant name="fusion" />, начните с раздела [Выбор запускаемой программы dbt](/guides/dbt-platform-local-workflow?step=3#choosing-which-dbt-runs). Оба инструмента вызываются командой `dbt`, и далее в руководстве предполагается, что вы умеете их различать.

## Предварительные требования {#prerequisites}

- У вас есть учетная запись <Constant name="dbt_platform" /> как минимум с одним проектом, использующим <Constant name="fusion_engine" />.
- У вас установлен либо [dbt platform CLI](/docs/platform/dbt-cli-installation), либо [расширение dbt для VS Code и локальная версия dbt](/docs/local/install-dbt).


## Выбор запускаемой программы dbt {#choosing-which-dbt-runs}

Если вы установите и <Constant name="platform_cli" />, и локальную сборку <Constant name="fusion" />, на вашем компьютере окажутся две отдельные программы, которые вызываются одной и той же командой `dbt`. Прежде чем настраивать учетные данные, переменные окружения или версии, убедитесь, что вы однозначно определили, какую из них вызываете.

Пропустите этот раздел, если вы устанавливаете только один из этих двух инструментов.

### Два варианта выполнения {#the-two-execution-paths}

И <Constant name="platform_cli" />, и локальная версия <Constant name="fusion" /> читают одни и те же файлы проекта &mdash; один клон репозитория, один `dbt_project.yml`, один набор моделей, макросов и тестов. Различаются место выполнения работы и источник сведений о подключении.

<SimpleTable>

| Аспект | <Constant name="platform_cli" /> | Локальная версия <Constant name="fusion" /> |
|---|---|---|
| **Что это** | Клиент, который отправляет вашу команду в <Constant name="dbt_platform" /> | Исполняемый файл dbt, который запускается на вашем компьютере |
| **Где выполняется dbt** | В инфраструктуре <Constant name="dbt_platform" /> | Локально или внутри виртуальной машины вашего агента |

</SimpleTable>

### Назначьте каждому инструменту отдельную команду {#give-each-tool-its-own-command}

Поскольку обе программы устанавливаются под именем `dbt`, при вызове `dbt` запускается та, которая первой найдется в `$PATH`. Чтобы не зависеть от порядка записей в `$PATH`, можно назначить хотя бы одной из них псевдоним, который позволит явно вызывать нужную программу из командной строки.

[Скрипт установки](/docs/local/install-dbt) <Constant name="fusion" /> уже создает псевдоним `dbtf`, указывающий на локальный бинарный, или исполняемый, файл <Constant name="fusion" />. Вы также можете добавить псевдоним `dbt-cli` для <Constant name="platform_cli" />, чтобы каждая команда вызывала именно тот инструмент, который обозначен ее именем, например:

```shell
dbtf build --select my_model      # Runs locally, on your installed v2 binary
dbt-cli build --select my_model   # Runs on dbt platform, on your environment's release track
```

Чтобы настроить псевдоним, выполните следующие действия:

1. Выясните, какая программа сейчас вызывается командой `dbt` и установлено ли несколько таких программ:

   ```shell
   which -a dbt
   ```

2. Установите необходимые инструменты:
   - Установите <Constant name="fusion" /> с помощью [скрипта установки](/docs/local/install-dbt), который размещает его в `$HOME/.local/bin/dbt` на macOS и Linux или в `C:\Users\USERNAME\.local\bin\dbt.exe` на Windows и добавляет псевдоним `dbtf`.
   - Отдельно установите [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation).

3. Используя путь к установленному dbt platform CLI, определенный на шаге 1, добавьте в файл профиля оболочки псевдоним, указывающий на его исполняемый файл.

   Например, на macOS при установке через Homebrew можно создать псевдоним для исполняемого файла `/opt/homebrew/bin/dbt`:

   ```shell
   # ~/.zshrc or ~/.bashrc
   alias dbt-cli="/opt/homebrew/bin/dbt"
   ```

   Перезагрузите профиль оболочки:

   ```shell
   source ~/.zshrc   # or source ~/.bashrc
   ```

4. Убедитесь, что каждая команда вызывает ожидаемый инструмент, а строки версий у них различаются:

   ```shell
   dbtf --version
   dbt-cli --version
   ```

5. Определите, какая программа должна запускаться при вызове просто `dbt` на вашем компьютере, и установите соответствующее правило для команды. При любом выборе `dbtf` и `dbt-cli` будут однозначно запускать обозначенные ими программы.

:::caution Псевдонимы оболочки действуют не везде

`dbtf` и `dbt-cli` — это псевдонимы оболочки. Они доступны в интерактивном терминале, но не в рецептах `Makefile`, скриптах оболочки, заданиях CI или командах, которые ИИ-агент выполняет в неинтерактивной оболочке. В этих случаях используйте абсолютный путь к исполняемому файлу или задайте порядок записей в `$PATH` так, чтобы команда `dbt` вызывала нужный инструмент.

:::

### Команды, которые имеют разное значение в каждом инструменте {#commands-that-mean-different-things-in-each-tool}

Большинство команд (`build`, `run`, `test`, `compile`) работают одинаково, но выполняются в разных местах. Некоторые команды предназначены только для одного инструмента, и их вызов в другом либо завершается ошибкой, либо приводит к неожиданному результату:

- `dbt system update` и `dbt system uninstall` управляют локальной установкой <Constant name="fusion" />. Они неприменимы к <Constant name="platform_cli" /> и не влияют на <Constant name="dbt_platform" />.
- `dbt init` заполняет локальный файл `profiles.yml`. Он нужен для работы с локальной версией <Constant name="fusion" />, но не для <Constant name="platform_cli" />, который не использует `profiles.yml`.
- `dbt debug` проверяет локальный профиль, целевую конфигурацию и подключение. Для получения сведений о среде и подключении <Constant name="platform_cli" /> используйте [`dbt environment`](/reference/commands/dbt-environment).

Если установлены оба инструмента, записывайте эти команды как `dbtf system update`, `dbtf init` и `dbtf debug`, чтобы исключить неоднозначность.

### Как редакторы и агенты выбирают dbt {#how-each-editor-and-agent-picks-a-dbt}

Каждый инструмент в вашем рабочем процессе определяет вызываемый `dbt` по собственным правилам. Настройка одного инструмента не настраивает остальные.

<SimpleTable>

| Где вы запускаете dbt | Как выбирается dbt | Что нужно настроить |
|---|---|---|
| **Расширение dbt для VS Code** | Параметр `dbt.fusionPath` или сборка v2, которую расширение загружает и обслуживает самостоятельно | Не задавайте `dbt.fusionPath`, чтобы расширение само управляло v2. Если вы устанавливаете v2 самостоятельно, укажите абсолютный путь к исполняемому файлу v2 |
| **Встроенный терминал VS Code или Cursor** | Переменная `$PATH` оболочки и псевдонимы из ее профиля | Псевдонимы `dbtf` и `dbt-cli`, описанные выше |
| **Агенты для программирования, например Claude Code или агентный режим Cursor** | Неинтерактивная оболочка &mdash; `$PATH` действует, а псевдонимы оболочки обычно нет | Абсолютные пути к исполняемым файлам и явно записанное правило выбора команд в файле инструкций агента |
| **Удаленные виртуальные машины агентов** | Собственная переменная `$PATH` виртуальной машины, а не вашей рабочей станции | Установите оба инструмента в виртуальной машине, закрепите их установку в конфигурации настройки, чтобы они сохранялись в новых сеансах, и храните учетные данные в менеджере секретов этой платформы |

</SimpleTable>

:::note `dbt.fusionPath` — не настройка терминала

`dbt.fusionPath` указывает расширению dbt для VS Code, какой исполняемый файл использовать для запуска <Term id="lsp" /> и собственных действий меню расширения. Этот параметр не влияет ни на команды, которые вы вводите во встроенном терминале, ни на команды, выполняемые агентом. Он должен указывать на корректный исполняемый файл <Constant name="fusion" /> &mdash; это должен быть абсолютный путь в файловой системе, а не имя псевдонима и не <Constant name="platform_cli" />.

Чтобы найти путь для этого параметра, выполните:

```shell
command -v dbtf
```

Храните абсолютные пути, зависящие от конкретного компьютера, в пользовательских настройках, а не в настройках рабочей области, добавляемых в репозиторий. Так настройка не нарушит работу коллег, у которых пути отличаются.

:::

### Укажите агенту для программирования, какую команду использовать {#tell-your-coding-agent-which-command-to-use}

Агенты выполняют команды оболочки так же, как скрипты: они наследуют `$PATH`, но не ваши интерактивные псевдонимы, и не могут догадаться, какой вариант выполнения вы имели в виду. Зафиксируйте соглашение в файле инструкций, который читает агент: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/` или аналогичном файле для вашего инструмента:

```markdown
## dbt command routing

Replace the paths below with the output of `which -a dbt` on this machine.

- Use `$HOME/.local/bin/dbt` for local dbt v2 commands. It runs on this machine
  against `profiles.yml`.
- Use `/opt/homebrew/bin/dbt` for dbt platform CLI commands. It runs on
  dbt platform against the environment's release track.
- Never substitute one for the other.
- Run dbt commands from the repository root.
- Ask before running any command that creates or modifies warehouse objects.
```

В инструкциях агента используйте абсолютные пути вместо псевдонимов `dbtf` и `dbt-cli`, поскольку оболочка агента может не загружать ваш профиль оболочки. Определите фактические пути на компьютере, где работает агент, с помощью `which -a dbt` и обновляйте файл инструкций при их изменении. На удаленной виртуальной машине агента проверяйте пути в новом сеансе: инструменты, установленные вручную в предыдущем сеансе, могут не сохраниться.

## Управление учетными данными {#managing-credentials}

Способ локальной аутентификации в хранилище данных зависит от того, какой самостоятельно размещенный инструмент вы используете:
- [dbt platform CLI](/guides/dbt-platform-local-workflow?step=4#dbt-platform-cli): для разработки только через CLI (без расширения dbt для VS Code) используйте <Constant name="platform_cli" />, выбрав <Constant name="fusion"/> в качестве канала релизов платформы. Учетные данные хранилища централизованно управляются в <Constant name="dbt_platform" /> и передаются автоматически &mdash; файл `profiles.yml` не требуется.
- [Расширение dbt для VS Code](/guides/dbt-platform-local-workflow?step=4#dbt-vs-code-extension-profilesyml-required): для локальной разработки в IDE расширение dbt для VS Code запускает <Constant name="fusion_engine" /> и его функции <Term id="lsp" /> в локальном процессе. Для этого варианта требуется файл `profiles.yml`, обеспечивающий прямое подключение к хранилищу данных.

### <Constant name="platform_cli" /> {#dbt-platform-cli}

[<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) — самый простой вариант для пользователей <Constant name="dbt_platform" />, которым нужен локально установленный CLI без VS Code. Он выполняет аутентификацию через ваш сеанс <Constant name="dbt_platform" />, а учетные данные хранилища централизованно управляются в <Constant name="dbt_platform" /> и передаются автоматически.

Подробные инструкции по установке см. в разделе [Установка dbt platform CLI](/docs/platform/dbt-cli-installation?version=1.10). <Constant name="platform_cli" /> устанавливается из локальной командной строки.

Файл конфигурации, скачанный из раздела **Account settings** в <Constant name="dbt_platform" />, обеспечит подключение и аутентификацию с использованием существующих учетных данных. 

Это самый простой вариант для команд, которым не нужна полноценная локальная интеграция с IDE.

### Расширение dbt для VS Code (требуется profiles.yml) {#dbt-vs-code-extension-profilesyml-required}

Расширение dbt для VS Code запускает <Constant name="fusion" /> и его языковой сервер в локальном процессе и подключается непосредственно к вашему хранилищу данных. Поэтому для локальных сеансов разработки с расширением нужен файл `profiles.yml`.

Скачайте [`dbt_cloud.yml`](/reference/dbt_cloud.yml) из раздела **Account settings** в <Constant name="dbt_platform" />, и <Constant name="fusion" /> попытается автоматически заполнить неконфиденциальные метаданные учетных данных из <Constant name="dbt_platform" />. 


Если вы получили доступ к новому проекту, повторно скачайте файл `dbt_cloud.yml`, прежде чем работать с ним локально. Чтобы переключаться между проектами, уже перечисленными в файле, обновите [`context.active-project`](/reference/dbt_cloud.yml#update-or-switch-projects). Чтобы не воссоздавать конфигурацию хранилища вручную, используйте `dbt init`.

```shell
dbt init
```

<Constant name="fusion" /> загружает такие поля, как **имя пользователя**, **роль**, **вычислительное хранилище (warehouse)**, **база данных** и **схема**, но никогда не загружает конфиденциальные значения, такие как пароли или токены. Если ваш механизм аутентификации не требует пароля (например, `externalbrowser` или OAuth на основе SSO), <Constant name="fusion" /> настроит и его, чтобы вы могли работать без локального хранения секретов.

:::note
Такое заполнение выполняется один раз при первоначальной настройке и не синхронизируется автоматически. Если конфигурация хранилища в <Constant name="dbt_platform" /> изменится, снова выполните `dbt init`, чтобы обновить локальный `profiles.yml`.
:::

Мастер первоначальной настройки расширения dbt для VS Code проводит вас через этот процесс, поэтому обычно запускать `dbt init` вручную не нужно.

:::info Скоро
Мы работаем над решением, которое позволит разрабатывать локально в расширении dbt для VS Code, полностью управляя учетными данными в <Constant name="dbt_platform" />, без локального `profiles.yml`. Мы обновим эту страницу, когда решение станет доступно.
:::

## Управление переменными окружения {#managing-environment-variables}

Переменные окружения, заданные в <Constant name="dbt_platform" />, применяются к запускам в рабочей среде и сеансам <Constant name="studio_ide" />. Для локальной разработки переменными окружения нужно управлять отдельно.

### <Constant name="platform_cli" /> {#dbt-platform-cli-env-vars}

При использовании <Constant name="platform_cli" /> платформа <Constant name="dbt_platform" /> добавляет в ваш сеанс <Constant name="platform_cli" /> те же переменные окружения, которые используются в рабочей среде. Дополнительная настройка не требуется.

### Расширение VS Code (файл .env) {#vs-code-extension-env-file}

Расширение dbt для VS Code запускает <Constant name="fusion" /> как локальный процесс, поэтому переменные окружения из <Constant name="dbt_platform" /> недоступны автоматически. Вместо этого используйте [файл `.env`](https://dotenvx.com/docs) в корне проекта dbt:

```shell
# .env
DBT_MY_DATABASE=my_database
DBT_MY_SCHEMA=my_dev_schema
DBT_TARGET_SCHEMA=analytics_dev
```

<Constant name="fusion" /> и расширение dbt для VS Code автоматически загружают значения из этого файла. Вы также можете просматривать и переопределять отдельные переменные окружения в интерфейсе настроек расширения.

Ссылайтесь на эти переменные в `profiles.yml` или в других частях проекта dbt с помощью [функции Jinja `env_var`](/reference/dbt-jinja-functions/env_var):

```yaml
# profiles.yml
my_profile:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: my_account
      database: "{{ env_var('DBT_MY_DATABASE') }}"
      schema: "{{ env_var('DBT_MY_SCHEMA') }}"
```

Подробное описание использования файла `.env`, приоритетов переменных и расположения настроенных переменных см. в разделе [Переменные окружения](/docs/build/environment-variables), а инструкции по локальной настройке — в разделе [Локальная настройка переменных окружения](/docs/configure-dbt-extension?version=2.0#set-environment-variables-locally).

### Согласование переменных платформы и локальных переменных {#keeping-platform-and-local-variables-in-sync}

Переменные окружения в <Constant name="dbt_platform" /> и локальном файле `.env` не синхронизируются автоматически. 

Добавьте в репозиторий файл `.env.example` со списком обязательных переменных. Каждый разработчик копирует его локально и заполняет собственными значениями; эта копия никогда не добавляется в репозиторий.

```shell
# .env.example (committed to version control)
DBT_MY_DATABASE=            # Your development database name
DBT_MY_SCHEMA=              # Your personal dev schema, for example dbt_yourname
DBT_TARGET_SCHEMA=          # Target schema for dbt output
```

```shell
# Developer setup: copy the example and fill in your values
cp .env.example .env
```

:::warning Не добавляйте .env в репозиторий
<Constant name="fusion" /> и расширение dbt для VS Code загружают переменные только из файла с точным именем `.env`, поэтому каждому разработчику нужна собственная копия. Убедитесь, что `.env` указан в `.gitignore`, чтобы учетные данные никогда не попадали в репозиторий. Команда `dbt init` добавляет эту запись автоматически.

```shell
echo ".env" >> .gitignore
```
:::

Когда переменные окружения в <Constant name="dbt_platform" /> меняются (вы добавляете переменные или переименовываете значения), обновляйте `.env.example` в том же pull request, чтобы локальные разработчики знали, что нужно обновить собственный `.env`.

:::tip Для команд со строгими требованиями к безопасности 

Рассмотрите возможность использования скрипта, который в начале сеанса получает переменные из менеджера секретов (например, AWS Secrets Manager или 1Password) и записывает их в `.env`, вместо долговременного хранения значений в файле.

:::

## Управление версиями dbt v2 {#managing-dbt-v2-versions}

Канал релизов **v2 Stable** в <Constant name="dbt_platform" /> постоянно обновляется по мере выхода новых релизов <Constant name="fusion" />. Если локальная версия отстает, поведение может различаться. Один и тот же запрос может компилироваться локально иначе, чем в рабочей среде, а какая-либо функция может быть доступна в <Constant name="dbt_platform" />, но отсутствовать в локальном исполняемом файле. Поддерживайте актуальную версию, чтобы избежать таких расхождений.

:::warning Канал релизов v2 не изменяет локальный dbt

Перевод среды <Constant name="dbt_platform" /> на канал релизов v2 изменяет движок, который <Constant name="dbt_platform" /> использует для этой среды. Он не устанавливает, не обновляет, не заменяет и не выбирает исполняемый файл <Constant name="fusion" /> на вашем компьютере и не превращает <Constant name="platform_cli" /> в <Constant name="fusion" />.

Обратное тоже верно: локальный запуск `dbt system update` обновляет только вашу локальную установку. Он не влияет на то, какую сборку используют ваши среды <Constant name="dbt_platform" />.

Рассматривайте эти две настройки версии как независимые и самостоятельно поддерживайте их согласованность с помощью шагов из этого раздела.

:::

### Версии на dbt platform {#versions-on-the-dbt-platform}

В <Constant name="dbt_platform" /> движок <Constant name="fusion" /> использует модель каналов релизов без привязки к конкретной версии. Канал релизов по умолчанию — **v2 Stable**; он всегда использует последний стабильный релиз. Подробности о каналах релизов и уровнях их стабильности см. в разделе [Релизы <Constant name="fusion" />](/docs/dbt-versions/dbt-release-tracks#dbt-v2-release-tracks).

### Версии, установленные локально {#versions-installed-locally}

По умолчанию [инструкции по установке](/docs/local/install-dbt) <Constant name="fusion" /> устанавливают последний стабильный релиз — ту же версию, которая поставляется в канале релизов **v2 Stable** на <Constant name="dbt_platform" />:

```shell
# macOS / Linux
pip install dbt
```

Чтобы в любой момент обновить самостоятельно размещенную установку до последнего стабильного релиза:

```shell
dbt system update
```

Чтобы проверить текущую версию:

```shell
dbt --version
```

### Согласование версий: контейнеры разработки (рекомендуется) {#keeping-versions-in-sync-dev-containers-recommended}

Для наиболее надежного соответствия локальных версий <Constant name="fusion" /> и <Constant name="dbt_platform" /> используйте [контейнер разработки VS Code](https://code.visualstudio.com/docs/devcontainers/containers). Контейнер разработки запускает вашу среду внутри образа Docker, который пересобирается в начале каждого сеанса и каждый раз заново устанавливает <Constant name="fusion" />. Так все участники команды используют ту же версию, что и <Constant name="dbt_platform" />, без ручных обновлений.

Наши коллеги из Brooklyn Data опубликовали готовый контейнер разработки для <Constant name="fusion" />:

- **Шаблон контейнера разработки:** [brooklyn-data/dbt-fusion-devcontainer](https://github.com/brooklyn-data/dbt-fusion-devcontainer)
- **Статья в блоге:** [Почему стоит использовать контейнеры разработки с dbt v2](https://www.brooklyndata.co/ideas/2025/06/11/why-you-should-use-dev-containers-with-dbt-fusion)

Чтобы начать работу с их шаблоном:

```shell
# Clone the devcontainer template into your project
curl -fsSL https://raw.githubusercontent.com/brooklyn-data/dbt-fusion-devcontainer/main/setup.sh | sh
```

Затем откройте проект в VS Code и при появлении запроса выберите **Reopen in Container**. VS Code автоматически соберет образ и установит последний стабильный релиз <Constant name="fusion" />.

:::info Скоро
Мы добавляем в <Constant name="dbt_platform" /> новые каналы релизов <Constant name="fusion" /> помимо **v2 Stable**. Когда они станут доступны, мы дополним это руководство инструкциями по привязке контейнера разработки к определенному каналу.
:::

### Без контейнеров разработки: обновление в начале каждого сеанса {#without-dev-containers-update-at-the-start-of-each-session}

Если ваша команда не может использовать контейнеры разработки, вместо этого запускайте `dbt system update` в начале каждого сеанса разработки. Эта команда устанавливает последний стабильный релиз — ту же версию, что и в канале **v2 Stable** на <Constant name="dbt_platform" />, — поэтому локальный исполняемый файл остается актуальным:

```shell
dbt system update && dbt debug
```

Фиксация конкретного номера версии здесь не подходит для долгосрочного использования: канал **v2 Stable** в <Constant name="dbt_platform" /> продолжает обновляться, и самостоятельно размещенная установка с закрепленной версией отстает. Старайтесь оставаться на **v2 Stable**, а не привязываться к одному релизу.

Чтобы об этом было проще помнить, добавьте цель `dev` в `Makefile` проекта:

```makefile
# Makefile
.PHONY: dev
dev:
	dbt system update
	dbt debug
```

Тогда разработчики будут начинать сеанс с команды:

```shell
make dev
```

Вы также можете описать это соглашение в `CONTRIBUTING.md` проекта, чтобы оно стало частью контрольного списка для новых участников.

---

## dbt Mesh и отложенное разрешение ссылок {#dbt-mesh-and-deferral}

Если ваш проект использует [dbt Mesh](/docs/mesh/about-mesh), ссылаясь на модели из других проектов dbt через межпроектные ссылки, <Constant name="fusion" /> обрабатывает их автоматически во время разработки при наличии [`dbt_cloud.yml`](/reference/dbt_cloud.yml).

### Как это работает {#how-it-works}

Когда <Constant name="fusion" /> обнаруживает вышестоящие проекты, определенные в `dependencies.yml`, он скачивает артефакт публикации каждого такого проекта из <Constant name="dbt_platform" /> перед разрешением межпроектных ссылок. После этого `ref('upstream_project', 'model_name')` работает локально без ручной настройки.

При разрешении межпроектных ссылок <Constant name="fusion" /> добавляет в журналы строки, подобные следующим:

```
Downloading publication artifact for <upstream_project> (resolving cross-project refs)
Downloaded publication artifact for <upstream_project> to <path> (resolving cross-project refs)
```

<Constant name="fusion" /> кеширует скачанные артефакты публикации на срок до одного часа, поэтому последующие запуски в том же сеансе пропускают скачивание и разрешают ссылки из локального кеша.

Автоматическое отложенное разрешение ссылок также включено по умолчанию. При наличии [`dbt_cloud.yml`](/reference/dbt_cloud.yml) движок <Constant name="fusion" /> использует настроенную для проекта среду отложенного разрешения ссылок: вы собираете только измененные модели и зависящие от них нижестоящие модели, а остальные ссылки разрешаются по состоянию рабочей среды.

### Отключение отложенного разрешения ссылок {#disabling-deferral}

- **В расширении VS Code:** отключите автоматическое отложенное разрешение ссылок в настройках расширения. Найдите `Dbt > Flag: Defer` и снимите флажок:

    <Lightbox src="/img/v2/vsce-defer-settings.png"  title="Настройки отложенного разрешения ссылок в расширении dbt для VS Code" />

- **В CLI:** передайте `--no-defer` любой команде, чтобы пропустить и отложенное разрешение ссылок, и скачивание артефакта публикации:

    ```shell
    dbt run --no-defer
    dbt compile --no-defer
    ```

## Справочная таблица {#reference-table}

В следующей таблице приведены основные различия между двумя вариантами разработки, рассмотренными в этом руководстве:

<SimpleTable>

| Аспект | dbt platform CLI | Расширение dbt для VS Code |
|---|---|---|
| **Команда, когда установлены оба инструмента** | `dbt-cli` (псевдоним, который добавляете вы) | `dbtf` (псевдоним, который добавляет установщик) |
| **Учетные данные** | Управляются через ваш сеанс <Constant name="dbt_platform" />, файл `profiles.yml` не требуется | Требуется `profiles.yml`; используйте `dbt init` для заполнения данными из <Constant name="dbt_platform" /> |
| **Переменные окружения** | Автоматически используются те же переменные окружения, что и в <Constant name="dbt_platform" /> | Используйте файл `.env` в корне проекта |
| **Управление версиями** | `dbt system update` для поддержания актуальной версии | Для автоматической синхронизации рекомендуется контейнер разработки |
| **dbt Mesh / отложенное разрешение ссылок** | Включается автоматически при наличии [`dbt_cloud.yml`](/reference/dbt_cloud.yml); для отключения используйте `--no-defer` | Включается автоматически при наличии [`dbt_cloud.yml`](/reference/dbt_cloud.yml); отключается в настройках расширения |
</SimpleTable>

## Связанная документация {#related-docs}

- [Установка <Constant name="fusion" />](/docs/local/install-dbt)
- [Установка dbt platform CLI](/docs/platform/dbt-cli-installation)
- [Настройки расширения dbt, включая `dbt.fusionPath`](/docs/configure-dbt-extension#dbt-extension-settings)
- [Команда `dbt environment`](/reference/commands/dbt-environment)
- [Релизы и каналы релизов <Constant name="fusion" />](/docs/dbt/dbt-releases)
- [О файле profiles.yml](/docs/local/profiles.yml)
- [Переменные окружения (локально)](/docs/local/configure-environment-variables)
- [Контейнеры разработки VS Code](https://code.visualstudio.com/docs/devcontainers/containers)
- [Обзор dbt Mesh](/docs/mesh/about-mesh)
- [Отложенное разрешение ссылок в dbt](/docs/platform/about-defer)
