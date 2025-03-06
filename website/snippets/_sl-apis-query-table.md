| Query type | Description |
| ---- | ---- |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | You can filter/add any SQL outside of the templating syntax. |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | Fetch multiple metrics with a change in time dimension granularities. |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | Select common dimensions for multiple metrics. |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | Query categorical dimensions with a group by |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | Where filters in API allow for a filter list or string. We recommend using the filter list for production applications as this format will realize all benefits from the <Term id="predicate-pushdown"/> where possible. Where Filters have a few objects that you can use:<br /> -`Dimension()` — Used for any categorical or time dimensions.<br /> -`Dimension('metric_time').grain('week')` or `Dimension('customer__country')`.<br /> - `TimeDimension()` — Used as a more explicit definition for time dimensions, optionally takes in a granularity `TimeDimension('metric_time', 'month')`<br />- `Entity()` — Used for entities like primary and foreign keys - `Entity('order_id')`.<br />-<br />- For `TimeDimension()`, the grain is only required in the `where` filter if the aggregation time dimensions for the measures and metrics associated with the where filter have different grains. |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | Order by can take a basic string that's a Dimension, Metric, or Entity, and this will default to ascending order |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | Query using a `limit` or `order_by` clause. |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | <span>Query using a the {props.savedQuery} clause.</span> |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | Query using a compile keyword |
| <span>https://docs.getdbt.com/docs/dbt-cloud-apis/{props.url}</span> | You can filter/add any SQL outside of the templating syntax. |
