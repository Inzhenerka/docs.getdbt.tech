---
title: "Use the dbt VS Code extension"
id: "use-dbt-extension"
description: "Prepare your local environment (files, env vars, connectivity) so the VS Code extension and terminal both work smoothly."
---

This page explains how to use the dbt VS Code extension. The steps differ slightly depending on whether you use <Constant name="dbt_platform" /> or <Constant name="core" />.

- <Constant name="dbt_platform" /> &mdash; You’ll mirror your <Constant name="dbt_platform" /> environment locally to unlock <Constant name="fusion" />-powered features like <Constant name="mesh" />, deferral, and so on.
- <Constant name="core" /> &mdash; You’ll confirm that your existing local setup and environment variables work seamlessly with the <Constant name="fusion_engine" /> and VS Code extension.

## Before you begin

If you're a <Constant name="dbt_platform" /> user new to the extension or VS Code/Cursor, you'll need to prepare your local environment to mirror your <Constant name="dbt_platform" /> environment. 

If you've already done this, skip to the [next section](#environment-variables). If you haven't already done this, follow these steps:

1. Clone your dbt project locally by cloning your <Constant name="dbt_platform" /> repo (from your Git provider).  
2. Ensure you have a [`profiles.yml` file](/docs/core/connect-data-platform/profiles.yml). This file defines your data warehouse connection. Once you've set this up or checked it, validate it by running `dbt debug`.
3. Add a `dbt_cloud.yml` file, found in your <Constant name="dbt_platform" /> project by going to **Your profile** -> **VS Code Extension** -> **Download credentials**. Download the `dbt_cloud.yml` file with your **Personal access Token (PAT)** included. This then connects the extension to <Constant name="dbt_platform" /> and enables platform features such as <Constant name="mesh" /> and deferral.
4. (Optional) For <Constant name="dbt_platform" /> users, check for a `project_id` in `dbt_project.yml`.  
5. (Optional) If your project uses environment variables, collect your environment variables and set them in VS Code or Cursor. Check out the [set environment variables](#set-environment-variables) section for more information.
   - *<Constant name="dbt_platform" />* Copy any environment variables from **Deploy → Environments** --> **Environment variables** in <Constant name="dbt_platform" />.  
     - Masked secrets will appear hidden, speak with your admin to get those values.  
   - *Core users:* Define your own vars locally if your project uses `env_var()` references.
6. Confirm connection from your workstation. Your local computer connects directly to your data warehouse and Git.  
   - *<Constant name="dbt_platform" /> users:* Ensure your laptop/VPN is allowed; <Constant name="dbt_platform" /> IPs no longer apply. Check with your admin if you have any issues.
   - *<Constant name="core" /> users:* This has likely already been configured.

## Set environment variables locally

The extension and CLI use environment variables for authentication and configuration. If you use both the VS Code extension menus and terminal commands, define your variables in both the `shell` and VS Code settings. The following table shows the different options and when to use them:

| Location | Affects | Session state | Use when |
|-----------|----------|-----------|-----------|
| **Shell profile** (`~/.zshrc`, `~/.bashrc`, PowerShell profile) | Terminal  | ✅ Permanent | Variables remain available across terminal sessions.|
| **VS Code settings (`dbt.environmentVariables`)** | Extension menus + LSP | ✅ Per VS Code profile | Editor-only workflows using the extension menus. |
| **One terminal session (`export` / `set`)** | Current terminal only | ❌ Temporary | Quick testing. |

> **Recommended:** Add vars in your **shell profile** so they persist globally, and optionally in **VS Code settings** if you use extension actions.

#### Configure at the OS / shell level
Define variables once at the OS or shell level to ensure they're available to all terminals and, after reloading VS Code, to the dbt VS Code extension as well. Even if you close a terminal window, the variables will remain available to you.

Follow these steps to configure environment variables at the OS or shell level:

<Tabs>
<TabItem value="mac-linux" label="Mac / Linux">

1. Open your shell configuration file in a text editor using the following commands: (If the file does not exist, create it using a text editor using `vi ~/.zshrc` or `vi ~/.bashrc`).
   ```bash
   open -e ~/.zshrc ## for zsh (macOS)
   nano ~/.bashrc ## for bash (Linux or older macOS)
   ```
2. Add your environment variables to the file. For example:
      - For zsh (macOS):
        ```bash
            ## ~/.zshrc 
            export DBT_ENV_VAR1="my_value"
            export DBT_ENV_VAR2="another_value"
        ```
      - For bash (Linux or older macOS):
        ```bash
            ## ~/.bashrc or ~/.bash_profile
            export DBT_ENV_VAR1="my_value"
            export DBT_ENV_VAR2="another_value"
        ```
3. Save and apply the changes using the `:wq` command in the terminal.  
4. Reload the shell by closing and reopening the terminal or running `source ~/.zshrc` or `source ~/.bashrc` in the terminal.
5. Then verify the variables by running `echo $DBT_ENV_VAR1` and `echo $DBT_ENV_VAR2` in the terminal.<br />

If you see the value printed back in the terminal, you're all set! These variables will now be available:
- In all future terminal sessions
- Inside VS Code (after you reload the window)
- For all dbt commands run in the terminal or the VS Code extension buttons

</TabItem>
<TabItem value="windows-cmd" label="Windows Cmd">
There are two main ways to create persistent environment variables on Windows: through PowerShell or the Environment Variables UI. 

The following steps will explain how to configure environment variables using PowerShell.

**PowerShell**
1. Run the following commands in PowerShell:
  ```powershell
    [Environment]::SetEnvironmentVariable("DBT_ENV_VAR1","my_value","User")
    [Environment]::SetEnvironmentVariable("DBT_ENV_VAR2","another_value","User")
    ```
1. This saves the variables permanently for your user account. (To make them available system-wide for all users, replace "User" with "Machine" (requires admin rights)).
2. Then, restart VS Code or select **Developer: Reload Window** for changes to take effect.
3. Verify the changes by running `echo $DBT_ENV_VAR1` and `echo $DBT_ENV_VAR2` in the terminal.

**GUI (Environment Variables)**
1. Press **Start** → search for **Environment Variables** → open **Edit the system environment variables**. 
2. Click **Environment Variables…**.
3. Under **User variables**, click **New…**.
4. Add the variables and values. For example:
    - Variable name: `DBT_ENV_VAR1`
    - Variable value: `my_value`
5. Repeat for any others, then click **OK**.
6. Restart VS Code or Cursor.
7. Verify the changes by running `echo $DBT_ENV_VAR1` and `echo $DBT_ENV_VAR2` in the terminal.
</TabItem>
</Tabs>

#### Configure in the VS Code extension settings

You can configure environment variables directly in the [User Settings](vscode://settings/dbt.environmentVariables) interface or in the [JSON](vscode://command/workbench.action.openSettingsJson) file.  
Something to keep in mind:
- Configuring in the User Settings works with the dbt extension buttons and menus (for LSP, "Show build menu," and so on).
- Not inherited by the VS Code terminal or external shells.
- Running a dbt command in the terminal won't fetch or use these variables.

To configure environment variables in the VS Code extension settings:
1. Open the [Command Palette](https://code.visualstudio.com/docs/configure/settings#_user-settings) (Cmd + Shift + P for Mac, Ctrl + Shift + P for Windows/Linux).
2. Then select either **Preferences: Open User Settings** or **Preferences: Open Settings (JSON)** in the dropdown menu. 
<Tabs>
<TabItem value="user-settings" label="Open User Settings">
1. Open the [VS Code user settings page](vscode://settings/dbt.environmentVariables).
2. Search for `dbt.environmentVariables`.
3. In the **dbt:Environment Variables** section, add your item and value for the environment variables.
4. Click **Ok** to save the changes.
5. Reload the VS Code extension to apply the changes.
6. Verify the changes by running a dbt command and checking the output.
</TabItem>
<TabItem value="settings-json" label="Open Settings (JSON)">

1. Open the [JSON](vscode://command/workbench.action.openSettingsJson) file.
2. Add your environment variables as a JSON object to the `.vscode/settings.json` file in your dbt project. For example:
    ```json
    {
    "dbt.environmentVariables": {
      "DBT_ENV_VAR1": "test_santi_value" // replace DBT_ENV_VAR1 and test_santi_value with your own variable and value
     }
    }
    ```
3. Save the changes.
4. Reload the VS Code extension to apply the changes.
5. Verify the changes by running a dbt command and checking the output.
</TabItem>
</Tabs>

#### Configure in the terminal session

Configure environment variables in the terminal session using the `export` command. Something to keep in mind:
- Doing so will make variables visible to commands that run in that terminal session only. 
- It lasts only for the current session and opening a new terminal will lose the values. 
- The built-in dbt VS Code extension buttons and menus will not pick these up.

To configure environment variables in the terminal session:
1. Run the following command in the terminal, replacing `DBT_ENV_VAR1` and `test1` with your own variable and value.
    <Tabs>
    <TabItem value="mac-linux" label="Mac / Linux">

        ```bash
        export DBT_ENV_VAR1=test1
        ```

    </TabItem>
    <TabItem value="windows-cmd" label="Windows Cmd">
    Refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1) for more information on the `set` command.

        ```bash
        set DBT_ENV_VAR1=test1 
        
        ```

    </TabItem>
    <TabItem value="windows-powershell" label="Windows PowerShell">
    Refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables?view=powershell-7.5#use-the-variable-syntax) for more information on the `$env:` syntax.

        ```bash
        $env:DBT_ENV_VAR1 = "test1"
        ```

    </TabItem>
    </Tabs>
2. Verify the changes by running a dbt command and checking the output.


### Example: Shell-level setup (macOS zsh)
<!--
## Configure environment variables

You need to configure [environment variables](/docs/build/environment-variables) (for example, [`DBT_ENV_VAR1`](/reference/dbt-jinja-functions/env_var)) in order to use the extension's features. You can configure environment variables in a couple of different ways (for example, user-level or workspace-level). 

#### Before you begin
If you're a dbt platform user, you might already have environment variables configured in your project or deployment environment. 
1. Check if you have any [environment variables](/docs/build/environment-variables#setting-and-overriding-environment-variables) set in the dbt platform.
2. If you need access to secret variables/values, contact you organization's dbt account admin for access.

<Constant name="core"/> users can define environment variables locally in their project. 

This set up will explain how to configure environment variables at the user-level. Use the following table to see which works best for you:

| <div style={{width:'200px'}}>Where to configure</div> | Info | Stays active | Best for |
|---|---|---|---|
| [OS / shell (recommended)](#configure-at-the-os--shell-level) | Configure at the OS / shell level.<br /><br /> Affects all terminals _and_ the dbt extension (after VS Code reload) | Yes<br /> (across sessions) | Using both extension buttons _and_ terminal commands |
| [dbt VS Code extension settings](#configure-in-the-vs-code-extension-settings) | Configure directly in the [User Settings](vscode://settings/dbt.environmentVariables) interface or in the [JSON](vscode://command/workbench.action.openSettingsJson) file.<br /><br /> Affects the dbt LSP, compile-on-save, extension menus/buttons | Yes<br /> (per VS Code settings) | Editor-only workflows |
| [Terminal session](#configure-in-the-terminal-session) | Configure in the terminal session using the `export` command.<br /><br /> Affects the current terminal window _only_.  | No<br /> (per session) | Quick, temporary testing |

:::tip Recommendation
If you use both the dbt extension’s buttons/menus _and_ the terminal, define your env vars at the _OS/shell_ level. This works everywhere with one setup.
:::

#### Configure at the OS / shell level
Define variables once at the OS or shell level to ensure they're available to all terminals and, after reloading VS Code, to the dbt VS Code extension as well. Even if you close a terminal window, the variables will remain available to you.

Follow these steps to configure environment variables at the OS or shell level:

<Tabs>
<TabItem value="mac-linux" label="Mac / Linux">

1. Open your shell configuration file in a text editor using the following commands: (If the file does not exist, create it using a text editor using `vi ~/.zshrc` or `vi ~/.bashrc`).
   ```bash
   open -e ~/.zshrc ## for zsh (macOS)
   nano ~/.bashrc ## for bash (Linux or older macOS)
   ```
2. Add your environment variables to the file. For example:
      - For zsh (macOS):
        ```bash
            ## ~/.zshrc 
            export DBT_ENV_VAR1="my_value"
            export DBT_ENV_VAR2="another_value"
        ```
      - For bash (Linux or older macOS):
        ```bash
            ## ~/.bashrc or ~/.bash_profile
            export DBT_ENV_VAR1="my_value"
            export DBT_ENV_VAR2="another_value"
        ```
3. Save and apply the changes using the `:wq` command in the terminal.  
4. Reload the shell by closing and reopening the terminal or running `source ~/.zshrc` or `source ~/.bashrc` in the terminal.
5. Then verify the variables by running `echo $DBT_ENV_VAR1` and `echo $DBT_ENV_VAR2` in the terminal.<br />

If you see the value printed back in the terminal, you're all set! These variables will now be available:
- In all future terminal sessions
- Inside VS Code (after you reload the window)
- For all dbt commands run in the terminal or the VS Code extension buttons

</TabItem>
<TabItem value="windows-cmd" label="Windows Cmd">
There are two main ways to create persistent environment variables on Windows: through PowerShell or the Environment Variables UI. 

The following steps will explain how to configure environment variables using PowerShell.

**PowerShell**
1. Run the following commands in PowerShell:
  ```powershell
    [Environment]::SetEnvironmentVariable("DBT_ENV_VAR1","my_value","User")
    [Environment]::SetEnvironmentVariable("DBT_ENV_VAR2","another_value","User")
    ```
1. This saves the variables permanently for your user account. (To make them available system-wide for all users, replace "User" with "Machine" (requires admin rights)).
2. Then, restart VS Code or select **Developer: Reload Window** for changes to take effect.
3. Verify the changes by running `echo $DBT_ENV_VAR1` and `echo $DBT_ENV_VAR2` in the terminal.

**GUI (Environment Variables)**
1. Press **Start** → search for **Environment Variables** → open **Edit the system environment variables**. 
2. Click **Environment Variables…**.
3. Under **User variables**, click **New…**.
4. Add the variables and values. For example:
    - Variable name: `DBT_ENV_VAR1`
    - Variable value: `my_value`
5. Repeat for any others, then click **OK**.
6. Restart VS Code or Cursor.
7. Verify the changes by running `echo $DBT_ENV_VAR1` and `echo $DBT_ENV_VAR2` in the terminal.
</TabItem>
</Tabs>

#### Configure in the VS Code extension settings

You can configure environment variables directly in the [User Settings](vscode://settings/dbt.environmentVariables) interface or in the [JSON](vscode://command/workbench.action.openSettingsJson) file.  
Something to keep in mind:
- Configuring in the User Settings works with the dbt extension buttons and menus (for LSP, "Show build menu," and so on).
- Not inherited by the VS Code terminal or external shells.
- Running a dbt command in the terminal won't fetch or use these variables.

To configure environment variables in the VS Code extension settings:
1. Open the [Command Palette](https://code.visualstudio.com/docs/configure/settings#_user-settings) (Cmd + Shift + P for Mac, Ctrl + Shift + P for Windows/Linux).
2. Then select either **Preferences: Open User Settings** or **Preferences: Open Settings (JSON)** in the dropdown menu. 
<Tabs>
<TabItem value="user-settings" label="Open User Settings">
1. Open the [VS Code user settings page](vscode://settings/dbt.environmentVariables).
2. Search for `dbt.environmentVariables`.
3. In the **dbt:Environment Variables** section, add your item and value for the environment variables.
4. Click **Ok** to save the changes.
5. Reload the VS Code extension to apply the changes.
6. Verify the changes by running a dbt command and checking the output.
</TabItem>
<TabItem value="settings-json" label="Open Settings (JSON)">

1. Open the [JSON](vscode://command/workbench.action.openSettingsJson) file.
2. Add your environment variables as a JSON object to the `.vscode/settings.json` file in your dbt project. For example:
    ```json
    {
    "dbt.environmentVariables": {
      "DBT_ENV_VAR1": "test_santi_value" // replace DBT_ENV_VAR1 and test_santi_value with your own variable and value
     }
    }
    ```
3. Save the changes.
4. Reload the VS Code extension to apply the changes.
5. Verify the changes by running a dbt command and checking the output.
</TabItem>
</Tabs>

#### Configure in the terminal session

Configure environment variables in the terminal session using the `export` command. Something to keep in mind:
- Doing so will make variables visible to commands that run in that terminal session only. 
- It lasts only for the current session and opening a new terminal will lose the values. 
- The built-in dbt VS Code extension buttons and menus will not pick these up.

To configure environment variables in the terminal session:
1. Run the following command in the terminal, replacing `DBT_ENV_VAR1` and `test1` with your own variable and value.
    <Tabs>
    <TabItem value="mac-linux" label="Mac / Linux">

        ```bash
        export DBT_ENV_VAR1=test1
        ```

    </TabItem>
    <TabItem value="windows-cmd" label="Windows Cmd">
    Refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1) for more information on the `set` command.

        ```bash
        set DBT_ENV_VAR1=test1 
        
        ```

    </TabItem>
    <TabItem value="windows-powershell" label="Windows PowerShell">
    Refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables?view=powershell-7.5#use-the-variable-syntax) for more information on the `$env:` syntax.

        ```bash
        $env:DBT_ENV_VAR1 = "test1"
        ```

    </TabItem>
    </Tabs>
2. Verify the changes by running a dbt command and checking the output.
-->
