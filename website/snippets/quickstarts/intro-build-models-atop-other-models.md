Как лучшая практика в SQL, следует разделять логику, которая очищает ваши данные, от логики, которая трансформирует ваши данные. Вы уже начали делать это в существующем запросе, используя общие табличные выражения (CTE).

Теперь вы можете поэкспериментировать, разделив логику на отдельные модели и используя функцию [ref](/reference/dbt-jinja-functions/ref) для построения моделей на основе других моделей:

<Lightbox src="/img/dbt-dag.png" title="Граф, который мы хотим для нашего проекта dbt" />