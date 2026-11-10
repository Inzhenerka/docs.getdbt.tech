Выберите предпочтительный способ установки:

<Expandable alt_header="Установка через pip для Windows, macOS и Linux">

```shell
python -m pip install dbt
```

Для обновления до более новой версии:

```shell
python -m pip install --upgrade dbt
```

</Expandable>

<Expandable alt_header="Автономная установка для macOS и Linux">

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

Чтобы использовать `dbt` сразу после установки, закройте и снова откройте терминал или перезапустите командную оболочку, чтобы новое значение `$PATH` вступило в силу:

```shell
exec $SHELL
```

Для обновления до более новой версии:

```shell
dbt system update
```

:::note
Команда `dbtf system update` устанавливает <Constant name="fusion" /> глобально &mdash; обновляет `PATH` в `~/.zshrc` и создаёт псевдоним `dbtf`. Для управления несколькими версиями или изоляции установки используйте отдельные профили командной оболочки или виртуальные окружения.
:::

</Expandable>

<Expandable alt_header="Автономная установка для Windows">

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

Чтобы использовать `dbt` сразу после установки, закройте и снова откройте командную оболочку или перезапустите её, чтобы новое значение `Path` вступило в силу:

```powershell
Start-Process powershell
```

Для обновления до более новой версии:

```shell
dbt system update
```

</Expandable>

<Expandable alt_header="Установка через Homebrew для macOS">

```shell
brew tap dbt-labs/dbt
brew install dbt-labs/dbt/dbt
```

Для обновления до более новой версии:

```shell
brew tap dbt-labs/dbt
brew upgrade dbt
```

</Expandable>

<Expandable alt_header="Установка через Winget для Windows">

```shell
winget install --id dbtLabs.dbt --exact
```

Для обновления до определённой версии:

```shell
winget install --id dbtLabs.dbt --exact --version <version>
```

</Expandable>


Выполните следующую команду, чтобы проверить установку:

```bash
dbt --version
```

Вы можете использовать `dbt` или его псевдоним `dbtf` для <Constant name="fusion" /> (это удобно, если у вас уже установлен другой dbt CLI). Путь установки по умолчанию:

- macOS/Linux: `$HOME/.local/bin/dbt`
- Windows: `C:\Users\<username>\.local\bin\dbt.exe`

Установщик добавляет этот путь автоматически, но для работы команды `dbtf` может потребоваться перезапуск командной оболочки.
