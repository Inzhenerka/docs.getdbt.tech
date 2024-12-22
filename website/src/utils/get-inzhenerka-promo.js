import spotlightData from './../../.docusaurus/docusaurus-build-spotlight-index-page-plugin/default/spotlight-page-data.json'

/*
 * Returns the featured promo of Inzhenerka.Tech
*/  
export const getInzhenerkaPromo = () => {
  return {
    title: "Обучение работе с данными",
    description:
      "Интерактивные тренажеры и симуляторы по работе с данными. Освойте на практике работу с dbt, построение Data Warehouse, оркестрацию данных с Dagster и не только...",
    link: "https://inzhenerka.tech/working-with-data/",
    image: "/img/inzhenerka-promo.jpg",
    sectionTitle: "В центре внимания",
  };
}
