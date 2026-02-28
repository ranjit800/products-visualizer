"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import banner images
import offer1 from '../../public/TempImg/offer1.png';
import offer2 from '../../public/TempImg/offer2.png';

// Import demo data (will be replaced with API data)
import { demoSwiperData } from '@/data/demoSwiperData';

const BannerSwiper = ({ swiperData = demoSwiperData }) => {
    // Use demo data for now, will accept swiperData prop from API in future
    const { enabled, autoplayDelay, banners } = swiperData;

    // Map image URLs to imported images (temporary until API provides full URLs)
    const imageMap = {
        '/Temimg/offer1.png': offer1,
        '/Temimg/offer2.png': offer2,
    };

    // Don't render if swiper is disabled or no banners
    if (!enabled || !banners || banners.length === 0) {
        return null;
    }

    // Filter only active banners and sort by order
    const activeBanners = banners
        .filter(banner => banner.active)
        .sort((a, b) => a.order - b.order);

    if (activeBanners.length === 0) {
        return null;
    }

    return (
        <div className="w-full px-2 pt-2 md:px-8 pb-0">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView={1.3}
                centeredSlides={false}
                autoplay={{
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-gray-400 dark:!bg-gray-600',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-black dark:!bg-white',
                }}
                loop={activeBanners.length > 1}
                speed={600}
                className="rounded-xl"
            >
                {activeBanners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full aspect-[2/1] md:aspect-[2.8/1]">
                            <Image
                                src={imageMap[banner.imageUrl] || banner.imageUrl}
                                alt={banner.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                style={{ objectFit: 'contain' }}
                                className="rounded-xl"
                                priority={banner.order === 1}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style jsx global>{`
        .swiper-pagination {
          position: relative !important;
          bottom: auto !important;
          margin-top: 12px !important;
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
        </div>
    );
};

export default BannerSwiper;
