import React from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import slide1 from '/logo1.jpg';
import slide2 from '/logo2.png';
import slide3 from '/logo4.jpg';

const slides = [
  {
    id: 1,
    image: slide1,
    heading: 'Secure Your Tomorrow Today',
    tagline: 'Plan your future with trusted life insurance solutions.',
  },
  {
    id: 2,
    image: slide2,
    heading: 'Protection that Grows with You',
    tagline: 'Tailored policies for every life chapter — we’re here with you.',
  },
  {
    id: 3,
    image: slide3,
    heading: 'LifeSure – Your Digital Life Partner',
    tagline: 'Get fast quotes, manage claims, and secure your future with ease.',
  },
];

const Hero = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000 }}
      loop={true}
      pagination={{ clickable: true }}
      className="w-screen h-[70vh]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="w-full h-[70vh] flex flex-col lg:flex-row items-center justify-center px-6 bg-base-100">
            
            {/* Left: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5 z-10 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold text-primary drop-shadow">
                {slide.heading}
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                {slide.tagline}
              </p>
              <Link
                to="/quote"
                className="btn btn-primary text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
              >
                Get a Free Quote
              </Link>
            </div>

            {/* Right: Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center h-[300px] lg:h-full">
              <img
                src={slide.image}
                alt={slide.heading}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Hero;
