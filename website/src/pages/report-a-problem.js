import React from "react";
import Layout from "@theme/Layout";
import Hero from "@site/src/components/hero";
import { HubSpotForm } from "@site/src/components/hubspotForm";

function ReportAProblem() {
  return (
    <>
      <Layout>
        <div
          className="container container--fluid home"
          style={{ padding: "0", background: "#FFF" }}
        >
          <Hero
            heading="Сообщить о проблеме с сайтом"
            subheading="Испытываете проблему на нашем сайте? Напишите об этом в GitHub-репозитории сайта (ссылка внизу страницы)."
            showGraphic
          />
          <section className="report-a-problem">
            <div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}

export default ReportAProblem;
