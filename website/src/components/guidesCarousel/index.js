import React from 'react';
import QuickstartGuideCard from '@site/src/components/quickstartGuideCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper';
import 'swiper/css/navigation';
import styles from './styles.module.css';

function GuidesCarousel({ guidesData, showNavigation }) {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        navigation={showNavigation}
        modules={showNavigation ? [Navigation] : []}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}

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

