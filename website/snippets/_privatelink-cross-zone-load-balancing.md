:::note Балансировка нагрузки между зонами (Cross-Zone Load Balancing)
Мы настоятельно рекомендуем включить балансировку нагрузки между зонами для вашего NLB или Target Group; для некоторых подключений она может быть обязательной. Балансировка между зонами также может [улучшить распределение маршрутизации и устойчивость соединений](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#cross-zone-load-balancing). Учтите, что межзональная связность может повлечь дополнительные расходы на передачу данных, хотя для запросов из <Constant name="cloud" /> они должны быть минимальными.

- [Включение балансировки нагрузки между зонами для load balancer или target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-target-group-attributes.html#target-group-cross-zone)
:::
