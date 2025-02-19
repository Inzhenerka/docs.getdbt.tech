<Expandable alt_header="Когда использовать конфигурации hard_deletes и invalidate_hard_deletes?">

**Используйте `invalidate_hard_deletes` (v1.8 и ранее), если:**
- Пробелы в истории снимков (отсутствие записей для удаленных строк) допустимы.
- Вы хотите аннулировать удаленные строки, установив для их временной метки `dbt_valid_to` текущее время (неявное удаление).
- Вы работаете с небольшими наборами данных, где отслеживание удалений как отдельного состояния не требуется.

**Используйте `hard_deletes: new_record` (v1.9 и выше), если:**
- Вы хотите поддерживать непрерывную историю снимков без пробелов.
- Вы хотите явно отслеживать удаления, добавляя новые строки с колонкой `dbt_is_deleted` (явное удаление).
- Вы работаете с большими наборами данных, где явное отслеживание удаленных записей улучшает ясность происхождения данных.

</Expandable>