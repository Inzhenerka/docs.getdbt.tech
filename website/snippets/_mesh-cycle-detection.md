Вы можете включить двунаправленные зависимости между проектами, чтобы эти связи могли идти в любом направлении. Это означает, что проект `jaffle_finance` может добавить новую модель, которая зависит от любых публичных моделей, созданных проектом `jaffle_marketing`, при условии, что новая зависимость не вводит циклы на уровне узлов. dbt проверяет наличие циклов между проектами и выдает ошибки, если они обнаружены.

При настройке проектов, которые зависят друг от друга, важно делать это пошагово. Каждый проект должен выполняться и создавать публичные модели, прежде чем исходный проект-производитель сможет взять зависимость от исходного проекта-потребителя. Например, порядок действий для простой настройки из двух проектов будет следующим:

1. Проект `project_a` выполняется в среде развертывания и создает публичные модели.
2. Проект `project_b` добавляет `project_a` в качестве зависимости.
3. Проект `project_b` выполняется в среде развертывания и создает публичные модели.
4. Проект `project_a` добавляет `project_b` в качестве зависимости.