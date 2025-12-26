Если у вас уже установлен <Constant name="fusion_engine" />, вы можете пропустить этот шаг. Если он у вас не установлен, выполните следующие действия для установки:

1. Откройте новое окно командной строки и выполните следующую команду, чтобы установить <Constant name="fusion_engine" />:

    <Tabs queryString="installation">
    <TabItem value="mac-linux" label="macOS & Linux">

    Выполните следующую команду в терминале:

    ```shell
    curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
    ```

    Чтобы начать использовать `dbtf` сразу после установки, перезагрузите вашу оболочку, чтобы новая переменная `$PATH` была распознана:

    ```shell
    exec $SHELL
    ```

    Либо закройте и снова откройте окно терминала. Это загрузит обновлённые настройки окружения в новую сессию.

    </TabItem>
    <TabItem value="windows" label="Windows (PowerShell)">

    Выполните следующую команду в PowerShell:

    ```powershell
    irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
    ```

    Чтобы начать использовать `dbtf` сразу после установки, перезагрузите вашу оболочку, чтобы новый `Path` был распознан:

    ```powershell
    Start-Process powershell
    ```

    Либо закройте и снова откройте PowerShell. Это загрузит обновлённые настройки окружения в новую сессию.

    </TabItem>
    </Tabs>

2. Выполните следующую команду, чтобы убедиться, что вы установили <Constant name="fusion" />:
    ```bash
    dbtf --version
    ```
    Вы можете использовать `dbt` или его алиас <Constant name="fusion" /> — `dbtf` (это удобно, если у вас уже установлен другой CLI dbt). Путь установки по умолчанию:

       - macOS/Linux: `$HOME/.local/bin/dbt`
       - Windows: `C:\Users\<username>\.local\bin\dbt.exe`

    Установщик добавляет этот путь автоматически, но вам может потребоваться перезагрузить оболочку, чтобы команда `dbtf` стала доступной.
