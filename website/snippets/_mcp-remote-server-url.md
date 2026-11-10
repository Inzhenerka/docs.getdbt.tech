Вы можете скопировать полный **MCP URL** в разделе **Account settings** → **Access URLs** → **MCP Endpoint URL** в <Constant name="dbt_platform"/> и вставить его непосредственно в свой ИИ-инструмент.

<Expandable alt_header="Составьте собственный MCP URL" anchor_id={props.anchorId ?? "construct-mcp-url"}>

Рекомендуем использовать MCP URL из раздела **Account settings** → **Access URLs** → **MCP Endpoint URL** в <Constant name="dbt_platform"/>. Однако, если вы хотите составить собственный MCP URL, используйте свой **Access URL** из раздела **Account settings** в <Constant name="dbt_platform"/>. Удаленная конечная точка MCP — `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp`. Замените `YOUR_DBT_HOST_URL` только именем хоста (без `https://`). 

Информацию о хостах по умолчанию, аккаунтах multi-cell и регионах см. в разделе [Доступ, регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses).
</Expandable>
