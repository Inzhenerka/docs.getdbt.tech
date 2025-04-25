There are three license types in dbt Cloud:

- **Developer** &mdash; User can be granted _any_ permissions.
- **Read-Only** &mdash; Available on [Starter, Enterprise, and Enterprise plus plans only](https://www.getdbt.com/pricing).
  - User has read-only permissions applied to all <Constant name="cloud" /> resources. 
  - Intended to view the [artifacts](/docs/deploy/artifacts) and the [deploy](/docs/deploy/deployments) section (jobs, runs, schedules) in a <Constant name="cloud" /> account, but can’t make changes. 
  - _Read-only licensed users do not inherit rights from any permission sets_. 
  - Every read-only licensed user has the same access across the account, regardless of the group permissions assigned.
- **IT** &mdash; Available on Starter, Enterprise, and Enterprise plus plans only. User has Security Admin and Billing Admin [permissions](/docs/cloud/manage-access/enterprise-permissions#permission-sets) applied. 
  - Can manage users, groups, and licenses, among other permissions. 
  - _IT licensed users do not inherit rights from any permission sets_. 
  - Every IT licensed user has the same access across the account, regardless of the group permissions assigned.
