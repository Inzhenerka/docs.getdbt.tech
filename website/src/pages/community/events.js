import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import EventsFeed from '@site/src/components/events';

function Events() {
  return (
    <Layout>
        <Head>
          <title>События сообщества dbt</title>
          <meta name="description" content="Присоединяйтесь к dbt Labs на предстоящие встречи, конференции или офисные часы с командой." />
        </Head>
        <div className="container events-page">
           <section>
            <h1>Предстоящие события сообщества dbt</h1>
            <p>Присоединяйтесь к dbt Labs на предстоящие встречи, конференции или офисные часы с командой. Все события проводятся онлайн, если не указано, что они проходят очно.</p>

            <EventsFeed />
           </section>
        </div>
    </Layout>
  );
}

export default Events;
