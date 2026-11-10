import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';

// Recovery links surfaced on the 404 page. These give both people and agents
// a clear "where to look next" map (docs index, sitemap, and the llms.txt
// feeds) so a broken or guessed URL doesn't turn into a dead end.
const recoveryLinks = [
  {to: '/docs/introduction', label: 'Документация dbt', external: false},
  {to: '/guides', label: 'Руководства', external: false},
  {to: '/reference/references-overview', label: 'Справочник', external: false},
  {to: '/blog', label: 'Блог разработчиков', external: false},
  {to: '/sitemap.xml', label: 'Карта сайта (sitemap.xml)', external: true},
  {to: '/llms.txt', label: 'llms.txt', external: true},
  {to: '/llms-full.txt', label: 'llms-full.txt', external: true},
];

export default function NotFoundContent({className}) {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="hero__title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page">
              Страница не найдена
            </Translate>
          </Heading>
          <p>
            Возможно, страницу перенесли или переименовали. Попробуйте найти её через поиск
            или откройте один из разделов документации.
          </p>
          <ul>
            {recoveryLinks.map(({to, label, external}) => (
              <li key={to}>
                {external ? (
                  <a href={to}>{label}</a>
                ) : (
                  <Link to={to}>{label}</Link>
                )}
              </li>
            ))}
          </ul>
          <p>
            Поиск по сайту доступен в верхнем меню и по сочетанию <kbd>⌘</kbd> <kbd>K</kbd>.
            Машиночитаемые указатели доступны в <a href="/llms.txt">/llms.txt</a> и{' '}
            <a href="/sitemap.xml">/sitemap.xml</a>.
          </p>
          <p>
            Для агента или скрипта можно открыть Markdown-версию документации.
            Замените завершающий слеш в адресе на <code>.md</code>.
            Например, <a href="/docs/introduction.md">/docs/introduction.md</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
