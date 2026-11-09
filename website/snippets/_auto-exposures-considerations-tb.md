При настройке автоматических downstream exposures с Tableau необходимо учитывать следующее:

- Вы можете подключиться только к одному сайту Tableau на одном сервере.
- Если вы используете Tableau Server, необходимо [добавить IP-адреса <Constant name="dbt" /> в список разрешённых](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона <Constant name="dbt" />.
- Дашборды Tableau, созданные с использованием пользовательских SQL-запросов, не поддерживаются.
- Зависимые экспозиции синхронизируются автоматически _один раз в день_ или когда пользователь обновляет выбранные коллекции.
- <Expandable alt_header="Полные имена (FQN) баз данных в Tableau должны совпадать с именами в сборке dbt.">
  Полные имена (FQN) баз данных в Tableau должны совпадать с именами в сборке dbt. Чтобы в вашей экспозиции отображались все ожидаемые зависимости, FQN должны совпадать, но регистр символов не учитывается. Например:
    | FQN в Tableau | FQN в dbt | <div style={{width:'250px'}}>Результат</div> |
    | --- | --- | --- |
    | `analytics.dbt_data_team.my_model` | `analytics.dbt_data_team.my_model` | ✅  Совпадает, зависимости будут отображаться корректно.|
    | `analytics.dbt_data_team.my_model` | `prod_analytics.dbt_data_team.my_model` | ❌ Не совпадает, не все ожидаемые зависимости будут отображаться. |

  Чтобы устранить эту проблему:
  1. В <Constant name="dbt" /> скачайте `manifest.json` из последнего запуска в production, который включает недостающие зависимости: откройте вкладку **Artifacts** и прокрутите страницу до `manifest.json`.
  2. Выполните следующий запрос [GraphiQl](https://help.tableau.com/current/api/metadata_api/en-us/docs/meta_api_start.html#explore-the-metadata-api-schema-using-graphiql). Обязательно выполните запрос по адресу `your_tableau_server/metadata/graphiql`, где `your_tableau_server` — значение, указанное в поле Server URL при [настройке интеграции с Tableau](/docs/platform-integrations/downstream-exposures-tableau#set-up-in-tableau):

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

  3. Сравните полные имена объектов базы данных (FQN) в `manifest.json` и ответе GraphiQL. Убедитесь, что `{database}.{schema}.{name}` совпадает в обоих источниках.
    На следующих изображениях показаны примеры FQN, которые _совпадают_ в `manifest.json` и ответе GraphiQL без учёта регистра:
    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/docs/platform-integrations/auto-exposures/manifest-json-example.png" width="80%" title="Пример manifest.json с FQN в нижнем регистре."/>

    <Lightbox src="/img/docs/platform-integrations/auto-exposures/graphiql-example.png" width="80%" title="Пример ответа GraphiQL с FQN в верхнем регистре."/>

    </DocCarousel>
  4. Если FQN не совпадают, обновите FQN в Tableau так, чтобы они совпадали с FQN в dbt.
  5. Если проблема сохраняется, обратитесь в [службу поддержки dbt](mailto:support@getdbt.com) и передайте им результаты проверки.
  </Expandable>
