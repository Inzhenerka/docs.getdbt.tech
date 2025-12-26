:::note Балансировка нагрузки между зонами
Мы настоятельно рекомендуем использовать балансировку нагрузки между зонами для вашего NLB или группы целевых ресурсов; некоторые соединения могут требовать этого. Балансировка нагрузки между зонами также может [улучшить распределение маршрутизации и устойчивость соединений](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#cross-zone-load-balancing). Обратите внимание, что подключение между зонами может повлечь дополнительные расходы на передачу данных, хотя для запросов из dbt Cloud они должны быть минимальными.

:::note Cross-Zone Load Balancing
Мы настоятельно рекомендуем включить cross-zone load balancing для вашего NLB или Target Group; для некоторых соединений это может быть обязательным. Cross-zone load balancing также может [улучшить распределение трафика и устойчивость соединений](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#cross-zone-load-balancing). Обратите внимание, что межзональный трафик может повлечь дополнительные расходы на передачу данных, однако для запросов от <Constant name="cloud" /> они, как правило, будут минимальными.

- [Enabling cross-zone load balancing for a load balancer or target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-target-group-attributes.html#target-group-cross-zone)
:::
