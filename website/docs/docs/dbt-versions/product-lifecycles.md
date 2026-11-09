---
title: "Жизненные циклы продуктов"
id: "product-lifecycles"
hide_table_of_contents: true
description: "Узнайте о жизненных циклах продуктов dbt Labs."
availability: all_users
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

dbt Labs управляет жизненным циклом функциональности облачной платформы dbt и самостоятельно размещаемых версий v1 и v2. Каждой функции присваивается статус жизненного цикла, который описывает её стабильность, уровень поддержки и доступность. Используйте вкладки ниже, чтобы узнать об этапах жизненного цикла используемого вами продукта.

Применение целевых показателей уровня обслуживания (SLO) зависит от продукта и этапа жизненного цикла.

<Tabs>
<TabItem value="platform" label="Платформа dbt">

Функциональность платформы dbt проходит следующие этапы жизненного цикла:

<div className="grid--3-col" style={{gap: '1.5rem'}}>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-transform-orange-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-transform-orange-800)', fontSize: '1rem'}}>Бета-версия</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Находится в активной разработке. Может быть не полностью стабильной; возможны изменения, нарушающие обратную совместимость. Документация может быть неполной, техническая поддержка ограничена, а SLO могут не применяться. Подробности см. в документе [Условия использования бета-версий](/assets/beta-tc.pdf), доступном для скачивания. Если указана отметка `Private`, доступ должен быть включён dbt Labs.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-coalesce-purple-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-coalesce-purple-800)', fontSize: '1rem'}}>Предварительная версия</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Стабильна и функционально готова к использованию в производственной среде. До этапа общей доступности (GA) ещё возможны запланированные дополнения или изменения, нарушающие обратную совместимость. Предоставляются документация и техническая поддержка, применяются SLO. Если указана отметка `Private`, доступ должен быть включён dbt Labs.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-green-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-green-700)', fontSize: '1rem'}}>Общая доступность (GA)</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Стабильная функциональность, доступная всем учётным записям dbt, соответствующим необходимым требованиям. Применяются SLO, предоставляются документация и техническая поддержка. Возможны изменения цен или введение платы. Доступность функциональности может зависеть от версии dbt в вашей среде. Используйте поддерживаемый [канал выпусков](/docs/dbt-versions/dbt-release-tracks), чтобы получать новейшую общедоступную функциональность.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-yellow-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-yellow-800)', fontSize: '1rem'}}>Устаревшая функциональность</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Больше не разрабатывается и не совершенствуется активно. Функциональность продолжает работать в существующем виде, а документация остаётся доступной до даты удаления. Техническая поддержка больше не предоставляется.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-pink-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-pink-800)', fontSize: '1rem'}}>Удалённая функциональность</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Больше не доступна на платформе ни в каком виде.
  </div>
</div>

</div>

</TabItem>
<TabItem value="self-hosted" label="dbt v1 и v2">

Выпуски самостоятельно размещаемого dbt следуют правилам семантического версионирования. Подробнее см. в разделе [О версиях dbt](/docs/dbt-versions). Выпуски как v1, так и v2 проходят следующие этапы жизненного цикла:

<div className="grid--3-col" style={{gap: '1.5rem', marginTop: '1rem'}}>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-terminal-black-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-terminal-black-600)', fontSize: '1rem'}}>Недокументированная функциональность</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    В открытых кодовых базах dbt может быть видна внутренняя функциональность, функциональность без гарантированного контракта или намеренно недокументированная функциональность. Она не считается частью публичной функциональности продукта в данном выпуске.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-terminal-black-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-terminal-black-700)', fontSize: '1rem'}}>Ещё не выпущенная функциональность</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Запланирована для предварительного выпуска следующей минорной версии. Никаких обязательств относительно поведения или реализации не предоставляется. Сопровождающие проект разработчики оставляют за собой право изменить или полностью удалить её.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-terminal-black-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-terminal-black-700)', fontSize: '1rem'}}>Альфа-версия</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Никаких обязательств относительно поведения или реализации не предоставляется; версия не предназначена для использования в производственной среде. Используйте на своё усмотрение. Сопровождающие проект разработчики оставляют за собой право изменить или полностью удалить её.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-transform-orange-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-transform-orange-800)', fontSize: '1rem'}}>Бета-версия</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Первое знакомство с совершенно новой функциональностью предстоящего выпуска. Код должен работать без регрессий, но новая функциональность может быть неполной или иметь известные проблемы в граничных случаях. Изменения ещё не зафиксированы окончательно, и сопровождающие проект разработчики всё ещё могут изменить или удалить их.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-blue-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-blue-700)', fontSize: '1rem'}}>Кандидат в релиз</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Двухнедельный период для тестирования в условиях производственной среды перед финальным выпуском. Ожидается, что функциональность войдёт в выпуск без изменений, хотя сопровождающие проект разработчики ещё могут исправить существенные ошибки до финального выпуска.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-green-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-green-700)', fontSize: '1rem'}}>Общая доступность</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Готова к использованию в производственной среде.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-yellow-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-yellow-800)', fontSize: '1rem'}}>Устаревшая функциональность</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Больше не разрабатывается и не совершенствуется активно. Продолжает работать в существующем виде до даты удаления.
  </div>
</div>
</div>

</TabItem>
</Tabs>
