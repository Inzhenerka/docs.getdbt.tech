const labels = {
  'Adapter creation': 'Создание адаптеров',
  Advanced: 'Продвинутый уровень',
  AI: 'ИИ',
  Analyst: 'Аналитика',
  Beginner: 'Начальный уровень',
  'Best practices': 'Лучшие практики',
  'dbt platform': 'Платформа dbt',
  Intermediate: 'Средний уровень',
  'Local development': 'Локальная разработка',
  Migration: 'Миграция',
  Orchestration: 'Оркестрация',
  Platform: 'Платформа',
  Quickstart: 'Быстрый старт',
  'Semantic Layer': 'Семантический слой',
  Tenancy: 'Изоляция клиентов',
  Troubleshooting: 'Устранение неполадок',
  Upgrade: 'Обновление',
  Webhooks: 'Вебхуки',
};

export function guideFilterLabel(value) {
  return Object.hasOwn(labels, value) ? labels[value] : value;
}
