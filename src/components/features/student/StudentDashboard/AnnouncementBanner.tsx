"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { useApi } from "@/hooks/useApi";
import { announcementsService } from "@/services/announcements.service";

export default function AnnouncementBanner() {
  const { data, loading } = useApi(
    () => announcementsService.list({ activeOnly: true, audience: "STUDENTS", pageSize: 6 }),
    [],
  );

  const banners = data?.items ?? [];

  if (loading) {
    return (
      <div className="relative bg-surface-200 border border-border-default rounded-2xl overflow-hidden min-h-70 lg:min-h-60 animate-pulse" />
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="relative bg-surface-200 border border-border-default rounded-2xl overflow-hidden group hover:border-white/15 transition-colors duration-300 min-h-70 lg:min-h-60"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={banners.length > 1}
          className="w-full h-full"
        >
          {banners.map((banner) => {
            const tagColor = banner.tagColor || "bg-emerald-400";
            const tagTextColor = banner.tagTextColor || "text-black";
            const ctaColor =
              banner.ctaColor || "bg-emerald-400 hover:bg-emerald-300 text-black";

            return (
              <SwiperSlide key={banner.id} className="w-full h-full bg-surface-200">
                <div className="relative w-full h-full">
                  {banner.imageUrl && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.imageUrl}
                        alt=""
                        className="absolute right-0 top-0 h-full w-3/5 object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-surface-200 via-surface-200/95 via-40% to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                      {banner.tag && (
                        <span
                          className={`${tagColor} ${tagTextColor} text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-lg whitespace-nowrap`}
                        >
                          {banner.tag}
                        </span>
                      )}
                      {banner.sponsor && (
                        <span className="text-[#A1A1AA] text-xs whitespace-nowrap">
                          • {banner.sponsor}
                        </span>
                      )}
                    </div>

                    <h2 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight mb-3 max-w-lg">
                      {banner.title}
                    </h2>
                    {banner.description && (
                      <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-md">
                        {banner.description}
                      </p>
                    )}

                    {(banner.ctaText || banner.ctaUrl) && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
                        <a
                          href={banner.ctaUrl || "#"}
                          className={`px-5 py-2.5 ${ctaColor} text-sm font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-center`}
                        >
                          {banner.ctaText || "Learn more"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </motion.div>
  );
}
