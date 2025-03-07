## Устранение неполадок

Если конечная точка PrivateLink была создана и настроена в dbt Cloud, но подключение все еще не работает, проверьте следующее в вашей сетевой конфигурации, чтобы убедиться, что запросы и ответы могут успешно маршрутизироваться между dbt Cloud и поддерживающим сервисом.

### Конфигурация

Начните с конфигурации:

<Expandable alt_header="1. Группа безопасности NLB">

Сетевой балансировщик нагрузки (NLB), связанный с сервисом конечной точки VPC, не должен иметь связанную группу безопасности, либо группа безопасности должна иметь правило, разрешающее запросы от соответствующих _частных CIDR_ dbt Cloud. Обратите внимание, что это отличается от статических публичных IP-адресов, указанных на странице подключения dbt Cloud. Поддержка dbt может предоставить правильные частные CIDR по запросу.
   - **Примечание***: Чтобы проверить, является ли это проблемой, временное добавление правила разрешения `10.0.0.0/8` должно позволить подключение до тех пор, пока правило не будет уточнено до меньшего CIDR.

</Expandable>

<Expandable alt_header="2. Слушатель NLB и целевая группа">

Проверьте, что к NLB подключен слушатель, который соответствует порту, к которому dbt Cloud пытается подключиться. Этот слушатель должен иметь настроенное действие для пересылки в целевую группу с целями, указывающими на ваш поддерживающий сервис. По крайней мере одна (но предпочтительно все) из этих целей должна быть **здоровой**. Нездоровые цели могут указывать на то, что поддерживающий сервис действительно нездоров или что сервис защищен группой безопасности, которая не позволяет запросы от NLB.

</Expandable>

<Expandable alt_header="3. Балансировка нагрузки между зонами">

Проверьте, включена ли _балансировка нагрузки между зонами_ для вашего NLB (проверьте вкладку **Атрибуты** NLB в консоли AWS). Если это отключено, и зоны, к которым подключен dbt Cloud, не совпадают с зонами, где работает сервис, запросы могут не маршрутизироваться корректно. Включение балансировки нагрузки между зонами также сделает подключение более устойчивым в случае отказа в сценарии отключения зоны. Межзонная связь может повлечь дополнительные расходы на передачу данных, хотя это должно быть минимальным для запросов от dbt Cloud.

</Expandable>

<Expandable alt_header="4. Таблицы маршрутизации и ACL">

Если все вышеперечисленное проверено, возможно, что запросы неправильно маршрутизируются внутри частной сети. Это может быть связано с неправильной конфигурацией таблиц маршрутизации VPC или списков контроля доступа. Проверьте эти настройки с вашим сетевым администратором, чтобы убедиться, что запросы могут быть маршрутизированы от сервиса конечной точки VPC к поддерживающему сервису и что ответ может быть возвращен к сервису конечной точки VPC. Один из способов проверить это — создать конечную точку VPC в другой VPC в вашей сети, чтобы проверить, что подключение работает независимо от подключения dbt.

</Expandable>

### Мониторинг

Чтобы помочь изолировать проблемы с подключением через соединение PrivateLink из dbt Cloud, есть несколько источников мониторинга, которые можно использовать для проверки активности запросов. Сначала запросы должны быть отправлены на конечную точку, чтобы увидеть что-либо в мониторинге. Свяжитесь с поддержкой dbt, чтобы узнать, когда проводилось тестирование подключения, или запросите новые попытки подключения. Используйте эти временные метки для корреляции с активностью в следующих источниках мониторинга.

<Expandable alt_header="Мониторинг сервиса конечной точки VPC">

В консоли AWS перейдите в VPC -> Endpoint Services. Выберите тестируемый сервис конечной точки и нажмите вкладку **Monitoring**. Обновите временной интервал, чтобы включить время, когда были отправлены попытки тестового подключения. Если есть активность в графиках _New connections_ и _Bytes processed_, значит, запросы были получены сервисом конечной точки, что предполагает, что конечная точка dbt маршрутизируется правильно.

</Expandable>

<Expandable alt_header="Мониторинг NLB">

В консоли AWS перейдите в EC2 -> Load Balancers. Выберите тестируемый сетевой балансировщик нагрузки (NLB) и нажмите вкладку **Monitoring**. Обновите временной интервал, чтобы включить время, когда были отправлены попытки тестового подключения. Если есть активность в графиках _New flow count_ и _Processed bytes_, значит, запросы были получены NLB от сервиса конечной точки, что предполагает, что слушатель NLB, целевая группа и группа безопасности настроены правильно.

</Expandable>

<Expandable alt_header="Логи потоков VPC">

Логи потоков VPC могут предоставить различную полезную информацию о запросах, маршрутизируемых через ваши VPC, хотя иногда их может быть сложно найти и интерпретировать. Логи потоков могут записываться либо в S3, либо в CloudWatch Logs, поэтому определите доступность этих логов для вашей VPC и запросите их соответствующим образом. Логи потоков записывают идентификатор сетевого интерфейса (ENI), исходный и целевой IP и порт, а также информацию о том, был ли запрос принят или отклонен группой безопасности и/или сетевым ACL. Это может быть полезно для понимания, прибыл ли запрос на определенный сетевой интерфейс и был ли этот запрос принят, что может выявить чрезмерно ограничительные правила. Для получения дополнительной информации о доступе и интерпретации логов потоков VPC см. соответствующую [документацию AWS](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html).

</Expandable>