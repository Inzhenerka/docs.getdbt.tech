
The [dbt extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) for VS Code and Cursor, powered by the <Constant name="fusion_engine" />, streamlines dbt development workflows. 

## Prerequisites

To use the extension, you must meet the following prerequisites:

| Prerequisite | Details |
| --- | --- |
| **<Constant name="fusion_engine" />**  | The [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) requires the <Constant name="fusion_engine" /> binary (a small executable program). Installing the extension prompts for installation of the <Constant name="fusion_engine" />. You can also [manually install](/docs/fusion/install-fusion) it at any time.|
|  | _Registration_ &mdash; After installation, use the extension for 14 days, then register your email or log in with your existing <Constant name="dbt_platform" /> account to continue using it.<br /><br /> ⁃ _Don't have a dbt account?_ Follow the VS Code “get started” flow to register and verify your email.<br /> ⁃ _Returning user?_ If you have an existing <Constant name="dbt_platform" /> (whether expired or active), no need to register! Just log in with the same email to prevent duplicate accounts. If you cannot log into the account associated with your email or if it's locked, reach out to dbt Support to have it unlocked or reset before logging in. |
| **Project files** | Your dbt project needs a `profiles.yml` configuration file.<br /><br />⁃ dbt platform users need to have a `dbt_cloud.yml` file as well as a `profiles.yml` file configured in their dbt project.<br />⁃ Note that having a <Constant name="dbt_platform" /> user account isn't the same as having a <Constant name="dbt_platform" /> project — you  don't need a <Constant name="dbt_platform" /> project to use the extension. |
| **Editor** | [VS Code](https://code.visualstudio.com/) or [Cursor](https://www.cursor.com/en) code editor. |
| **Operating systems** | macOS, Windows, or Linux-based computer. |

## Installation instructions

:::note

This is the only official dbt Labs VS Code extension. Other extensions _can_ work alongside the dbt VS Code extension, but they aren’t tested or supported by dbt Labs.

Read the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements) for the latest updates.

::: 

In VS Code:

1. Navigate to the **Extensions** tab of your editor and search for `dbt`. Locate the extension from the publisher `dbtLabsInc` or `dbt Labs Inc`. Click **Install**.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Search for the extension"/>
2. Open a dbt project in your VS Code environment if you haven't already. Make sure it is added to your current workspace. If you see a **dbt Extension** label in your editor's status bar, then the extension has installed successfully. You can hover over this **dbt Extension** label to see diagnostic information about the extension.
    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension` label, the extension is activated"/>
3. Once the dbt extension is activated, it will automatically begin downloading the correct dbt Language Server for your operating system.
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>
4. If the dbt Fusion engine is not already installed on your machine, the extension will prompt you to download and install it. Follow the steps shown in the notification to complete the installation.
    <Lightbox src="/img/docs/extension/install-dbt-fusion-engine.png" width="60%" title="Follow the prompt to install the dbt Fusion engine"/>
5. Run the VS Code extension [upgrade tool](#upgrade-to-fusion) to ensure your dbt project is Fusion ready and help you fix any errors and deprecations.
6. You're all set up! See [about the dbt extension](/docs/about-dbt-extension) for more information on how to use the dbt extension.
    <Lightbox src="/img/docs/extension/kitchen-sink.png" width="90%" title="Showing lineage and compiled code in the extension"/>

## Getting started

Once the dbt VS Code extension has been installed in your environment, the dbt logo will appear on the sidebar. From here, you can access workflows to help you get started, offers information about the extension and your dbt project, and provides helpful links to guide you. For more information, see the [the dbt extension menu](/docs/about-dbt-extension#the-dbt-extension-menu) documentation. 

To get started with the extension:
1. From the sidebar menu, click the dbt logo to open the menu and expand the **Get started** section. 
2. Click the **dbt Walkthrough** status bar to view the welcome screen.
    <Lightbox src="/img/docs/extension/welcome-screen.png" width="80%" title="dbt VS Code extension welcome screen."/>
3. Click through the items to get started with the extension:
    - **Open your dbt project:** Launches file explorer so you can select the dbt project you want to open with Fusion.
    - **Check Fusion compatibility:** Runs the [Fusion upgrade](#upgrade-to-fusion) workflows to bring your project up-to-date.
    - **Explore features:** Opens the [documentation](/docs/about-dbt-extension) so you can learn more about all the extension has to offer.
    - **Register:** Launches the registration workflow so you can continue to use the extension beyond the trial period.

## Upgrade to Fusion

:::note

If you are already running the <Constant name="fusion_engine" />, you must be on version `2.0.0-beta.66` or higher to use the upgrade tool.

:::

The dbt extension provides a built-in upgrade tool to walk you through the process of configuring <Constant name="fusion" />  and updating your dbt project to support all of its features and fix any deprecated code. To start the process:

1. From the VS Code sidebar menu, click the **dbt logo**.
2. In the resulting pane, open the **Get started** section and click the **Get started** button. 

    <Lightbox src="/img/docs/extension/fusion-onboarding-experience.png" width="80%" title="The dbt extension help pane and upgrade assistant." /> 

You can also manually start this process by opening a CLI window and running: 

```
dbt init --fusion-upgrade
```

This will start the upgrade tool and guide you through the Fusion upgrade with a series of prompts:
- **Do you have an existing dbt platform account?**: If you answer `Y`, you will be given instructions for downloading your dbt platform profile to register the extension. An `N` answer will skip to the next step.
- **Ready to run a dbtf init?** (If there is no `profiles.yml` file present): You will go through the dbt configuration processes, including connecting to your data warehouse. 
- **Ready to run a dbtf debug?** (If there is an existing `profiles.yml` file): Validates that your project is configured correctly and can connect to your data warehouse.
- **Ready to run a dbtf parse?**: Your dbt project will be parsed to check for compatibility with <Constant name="fusion" />.
    - If any issues are encountered during the parsing, you'll be given the option to run the [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) tool to resolve the errors. If you opt to not run the tool during the upgrade processes, you can always run it later or manually fix any errors. However, the upgrade tool cannot continue until the errors are resolved.
        :::tip AI Agents
        There are cases where dbt-autofix may not resolve all errors and requires manual intervention. For those cases, the dbt-autofix tool provides an [AI Agents.md](https://github.com/dbt-labs/dbt-autofix/blob/main/AGENTS.md) file to enable AI agents to help with migration work after dbt-autofix has completed its part.
        :::
- **Ready to run a ‘dbtf compile -static-analysis off’?** (Only runs once the parse passes): Compiles your project without any static analysis, mimicking dbt Core. This compile only renders Jinja into SQL, so <Constant name="fusion" />'s advanced SQL comprehension is temporarily disabled. 
- **Ready to run a ‘dbtf compile’?**: Compiles your project with full <Constant name="fusion" /> static analysis. It checks that your SQL code is valid in the context of your warehouse's tables and columns. 

    <Lightbox src="/img/docs/extension/fusion-onboarding-complete.png" width="70%" title="The message received when you have completed upgrading your project to the dbt Fusion engine." /> 

Once the upgrade is completed, you're ready to dive into all the features that the <Constant name="fusion_engine" /> has to offer!

## Register the extension

Users must complete registration within 14 days of installing the dbt extension. There are two ways to register:

- Users without an existing dbt account can register quickly and easily through an online registration form. For the initial installation, you only need to provide your name and email address to complete the registration. Subsequent installations will require you to complete the entire [dbt account registration process](#accessing-your-dbt-account) to use the extension. 
- Users with an existing dbt account can connect their account using a `dbt_cloud.yml` credentials file.

The VS Code extension is free for organizations for up to 15 users.

### New user registration

If you do not already have a dbt account, you'll need to get registered. This only takes a minute!
1. Click the registration prompt in your editor.
     <Lightbox src="/img/docs/extension/registration-prompt.png" width="70%" title="The extension registration prompt in VS Code."/>
2. Accept any prompts to open the link in your browser.
3. Fill out the registration form, then click **Continue**.
    <Lightbox src="/img/docs/extension/registration-screen.png" width="70%" title="The extension registration page in the browser."/>
4. You will receive an email with a verification link. Once you click it, your registration is complete!

### Accessing your dbt account

Registering to use the dbt extension makes it easy to create a full dbt account. You can follow these
steps to finish setting up your account (_Note: This is not required to use the dbt extension_).

1. Navigate to [us1.dbt.com](https://us1.dbt.com) and click **Forgot password?**.
2. Enter the email address you used for your dbt extension registration and click **Continue**.
3. Check your email for a verification link and follow the password reset instructions to set a password for your account.

Now that you have activated your dbt developer account, you can access features of the <Constant name="dbt_platform" />. You can also re-download your registration key using the steps outlined in [Register with an existing dbt account](#register-with-an-existing-dbt-account) if you need to set up the dbt extension on a new machine.

### Register with an existing dbt account 

<!-- This anchor is linked from the VS Code registration page. Please do not change it -->

If you already have a dbt account, you do not need to re-register to use the dbt extension. The dbt extension can authenticate with the dbt platform using a `dbt_cloud.yml` file. If this file is present in your `~/.dbt/` folder, then the registration flow will automatically attempt to use this
file during registration. If you do not have a `~/.dbt/dbt_cloud.yml` file downloaded, refer to the following instructions:

<Expandable alt_header="For dbt accounts with Fusion enabled">

1. Log in to your dbt account.
2. Click your account name at the bottom of the left-side menu and click **Account settings**.
3. Under the **Your profile** section, click **VS Code Extension**. 
4. In the **Set up your credentials** section, click **Download credentials**. This downloads the `dbt_cloud.yml` file. 
    <Lightbox src="/img/docs/extension/download-registration-2.png" width="70%" title="Download the dbt_cloud.yml file to complete registration."/>
5. Move the downloaded `dbt_cloud.yml` file to your `~/.dbt/` directory.
6. To update your registration in VS Code, open the command palette (`ctrl+shift+P` (Windows/Linux) or `cmd+shift+p` (macOS)), then select `dbt: Register dbt extension` to complete the registration.

</Expandable>

<Expandable alt_header="For dbt accounts without Fusion enabled">

1. Log in to your dbt account.
2. Click your account name at the bottom of the left-side menu and click **Account settings**.
3. Under the **Your profile** section, click **CLI**. 
4. In the **Configure Cloud authentication** section, click **Download CLI configuration file**. This downloads the `dbt_cloud.yml` file. 
    <Lightbox src="/img/docs/extension/download-registration.png" width="70%" title="Download the dbt_cloud.yml file to complete registration."/>
5. Move the downloaded `dbt_cloud.yml` file to your `~/.dbt/` directory.
6. To update your registration in VS Code, open the command palette (`ctrl+shift+P` (Windows/Linux) or `cmd+shift+p` (macOS)), then select `dbt: Register dbt extension` to complete the registration.

</Expandable>

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

## Troubleshooting
<!-- This anchor is linked from the  VS Code extension. Please do not change it -->

import FusionTroubleshooting from '/snippets/_fusion-troubleshooting.md';

<FusionTroubleshooting />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
