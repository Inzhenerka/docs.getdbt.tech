Auto-exposures with Tableau have the following considerations:

- You can only connect to a single Tableau site on the same server.
- If you're using Tableau Server, you need to [allowlist dbt Cloud's IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your dbt Cloud region.
- Tableau dashboards built using custom SQL queries aren't supported.
- Auto-exposures sync automatically **once per day** or when a user updates the selected collections.
