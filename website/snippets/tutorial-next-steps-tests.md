Прежде чем двигаться дальше от тестирования, внесите изменения и посмотрите, как это повлияет на ваши результаты:

* Напишите тест, который не пройдет, например, исключите один из статусов заказа из списка `accepted_values`. Как выглядит неудачный тест? Можете ли вы отладить ошибку?
* Запустите тесты только для одной модели. Если вы сгруппировали свои модели с префиксом `stg_` в отдельную директорию, попробуйте запустить тесты для всех моделей в этой директории.
* Используйте [блок документации](/docs/build/documentation#using-docs-blocks), чтобы добавить описание в формате Markdown к модели.