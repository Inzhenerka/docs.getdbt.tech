При настройке автоматических downstream exposures с Tableau необходимо учитывать следующее:

- Вы можете подключиться только к одному сайту Tableau на одном и том же сервере.
- Если вы используете Tableau Server, необходимо [добавить IP-адреса <Constant name="cloud" /> в allowlist](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона <Constant name="cloud" />.
- Дашборды Tableau, построенные с использованием пользовательских SQL-запросов (custom SQL), не поддерживаются.
- Downstream exposures синхронизируются автоматически _один раз в день_ или при обновлении пользователем выбранных коллекций.
- <Expandable alt_header="Полностью квалифицированные имена баз данных (FQN) в Tableau должны совпадать с именами в dbt build.">
  Полностью квалифицированные имена (FQN — fully qualified names) баз данных в Tableau должны совпадать с теми, что используются в dbt build. Чтобы в exposure отображались все ожидаемые зависимости, FQN должны совпадать, при этом регистр символов не имеет значения. Например:
    | Tableau FQN | dbt FQN | <div style={{width:'250px'}}>Результат</div> |
    | --- | --- | --- |
    | `analytics.dbt_data_team.my_model` | `analytics.dbt_data_team.my_model` | ✅  Совпадает, зависимости будут отображаться корректно.|
    | `analytics.dbt_data_team.my_model` | `prod_analytics.dbt_data_team.my_model` | ❌ Не совпадает, не все ожидаемые зависимости будут отображаться. |

  Для устранения проблем выполните следующие шаги:
  1. В <Constant name="cloud" /> скачайте файл `manifest.json` из последнего production-запуска, который включает отсутствующие зависимости. Для этого перейдите на вкладку **Artifacts** и прокрутите до `manifest.json`.
  2. Выполните следующий запрос в [GraphiQl](https://help.tableau.com/current/api/metadata_api/en-us/docs/meta_api_start.html#explore-the-metadata-api-schema-using-graphiql). Убедитесь, что вы запускаете запрос по адресу `your_tableau_server/metadata/graphiql`, где `your_tableau_server` — это значение, которое вы указали в поле Server URL при [настройке интеграции с Tableau](/docs/cloud-integrations/downstream-exposures-tableau#set-up-in-tableau):

            ```jsx
                query {
                  workbooks {
                    name
                    uri
                    id
                    luid
                    projectLuid
                    projectName
                    upstreamTables {
                      id
                      name
                      schema
                      database {
                        name
                        connectionType
                    }
                  }
                }
              }
            ```

  3. Сравните FQN баз данных между `manifest.json` и ответом GraphiQl. Убедитесь, что `{database}.{schema}.{name}` совпадает в обоих источниках.  
    Ниже приведены примеры FQN, которые _совпадают_ как в `manifest.json`, так и в ответе GraphiQl, при этом регистр символов не учитывается:
    <Lightbox src="/img/docs/cloud-integrations/auto-exposures/manifest-json-example.png" width="80%" title="Пример manifest.json с FQN в нижнем регистре."/>
    <Lightbox src="/img/docs/cloud-integrations/auto-exposures/graphiql-example.png" width="80%" title="Пример ответа GraphiQl с FQN в верхнем регистре."/>
  4. Если FQN не совпадают, обновите FQN в Tableau так, чтобы они соответствовали FQN в dbt.
  5. Если проблемы сохраняются, обратитесь в [службу поддержки dbt](mailto:support@getdbt.com) и поделитесь с ними полученными результатами.
  </Expandable>
