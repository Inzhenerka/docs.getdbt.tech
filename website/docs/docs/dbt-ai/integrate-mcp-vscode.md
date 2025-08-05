#### VS Code

1. Open the Settings menu (Command + Comma) and select the correct tab atop the page for your use case
    - `Workspace` - configures the server in the context of your workspace
    - `User` - configures the server in the context of your user
    - **Note for WSL users**: If you're using VS Code with WSL, you'll need to configure WSL-specific settings. Run the **Preferences: Open Remote Settings** command from the Command Palette (F1) or select the **Remote** tab in the Settings editor. Local User settings are reused in WSL but can be overridden with WSL-specific settings. Configuring MCP servers in the local User settings will not work properly in a WSL environment.

2. Select Features → Chat

3. Ensure that "Mcp" is `Enabled`

![mcp-vscode-settings](https://github.com/user-attachments/assets/3d3fa853-2398-422a-8a6d-7f0a97120aba)

4. Open the command palette `Control/Command + Shift + P`, and select either "MCP: Open Workspace Folder MCP Configuration" or "MCP: Open User Configuration" depending on whether you want to install the MCP server for this workspace or for all workspaces for the user

5. Add your server configuration (`dbt`) to the provided `mcp.json` file as one of the servers:
```json
{
	"servers": {
		"dbt": {
			"command": "uvx",
      "args": [
        "--env-file",
        "<path-to-.env-file>",
        "dbt-mcp"
      ]
		}
	}
}
```

`<path-to-.env-file>` is where you saved the `.env` file from the Setup step

6. You can start, stop, and configure your MCP servers by:
- Running the `MCP: List Servers` command from the Command Palette (Control/Command + Shift + P) and selecting the server
- Utlizing the keywords inline within the `mcp.json` file

![inline-management](https://github.com/user-attachments/assets/d33d4083-5243-4b36-adab-72f12738c263)

VS Code MCP docs [here](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for reference