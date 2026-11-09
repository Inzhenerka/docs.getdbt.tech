:::note Балансировка нагрузки между зонами (Cross-Zone Load Balancing)
Мы настоятельно рекомендуем включить балансировку нагрузки между зонами для вашего NLB или Target Group; для некоторых подключений она может быть обязательной. Балансировка между зонами также может [улучшить распределение маршрутизации и устойчивость соединений](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#cross-zone-load-balancing). Учтите, что межзональная связность может повлечь дополнительные расходы на передачу данных, хотя для запросов из <Constant name="cloud" /> они должны быть минимальными.

:::note Балансировка нагрузки между зонами
Мы настоятельно рекомендуем включить балансировку нагрузки между зонами для вашего NLB или целевой группы (Target Group); для некоторых подключений она может быть необходима. Балансировка нагрузки между зонами также может [улучшить распределение трафика и повысить устойчивость подключений к сбоям](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#cross-zone-load-balancing). Обратите внимание, что подключение между зонами может повлечь дополнительные расходы на передачу данных, хотя для запросов от <Constant name="dbt" /> они должны быть минимальными.

- [Включение балансировки нагрузки между зонами для балансировщика нагрузки или целевой группы](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-target-group-attributes.html#target-group-cross-zone)
:::
