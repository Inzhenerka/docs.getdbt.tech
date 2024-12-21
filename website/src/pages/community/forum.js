import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { DiscourseFeed } from '@site/src/components/discourse';

function Events() {
  return (
    <Layout>
      <Head>
        <title>Вопросы | Центр разработчиков dbt</title>
        <meta name="description" content="Последние интересные обсуждения на форуме dbt" />
      </Head>
      <section className='discourse-forum-page'>
        <div className='container'>
          <h1>Форум сообщества dbt</h1>
          <p>Форум сообщества dbt — это предпочтительная платформа для вопросов по поддержке, а также пространство для долгосрочных обсуждений, связанных с dbt, аналитической инженерией и профессией аналитика. Это место, где мы создаем долговременную базу знаний о распространенных проблемах, возможностях и шаблонах, с которыми мы работаем каждый день.</p>
          <DiscourseFeed title='Вопросы без ответа' category='help' status='unsolved' link_text='Смотреть открытые темы' link_href='https://discourse.getdbt.com/c/help/19' show_cta={true} />
          <DiscourseFeed title='Глубокие обсуждения' category='discussions' link_text='Смотреть обсуждения' link_href='https://discourse.getdbt.com/c/discussions/21' show_cta={true} />
          <DiscourseFeed title='Показать и рассказать' category='show-and-tell' link_text='Смотреть больше тем' link_href='https://discourse.getdbt.com/c/show-and-tell/22' show_cta={true} />
        </div>
      </section>
    </Layout>
  );
}

export default Events;
