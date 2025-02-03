import React from 'react';
import QuickstartGuideCard from '@site/src/components/quickstartGuideCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper';
import 'swiper/css/navigation';
import styles from './styles.module.css';

function GuidesCarousel({ guidesData }) {
  const showNavigation = guidesData.length > 3;

  return (
    <div className={styles.carouselContainer}>
      <Swiper
        slidesPerView={3}
        navigation={showNavigation}
        modules={showNavigation ? [Navigation] : []}
      >
        {guidesData.map((frontMatter) => (
          <SwiperSlide key={frontMatter.id || frontMatter.index}>
            <QuickstartGuideCard frontMatter={frontMatter} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default GuidesCarousel;

