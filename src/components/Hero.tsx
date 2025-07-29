import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: { fr: '🌿 Savons Naturels Artisanaux', en: '🌿 Handcrafted Natural Soaps' },
      subtitle: { fr: 'Peau Douce, Esprit Serein', en: 'Gentle Skin, Peaceful Mind' },
      image: 'https://i.ibb.co/xbqyycx/Artistic-Top-Down-View-Of-Soap-Bar-With-Flowers-1.png',
      product: 'Lavender'
    },
    {
      id: 2,
      title: { fr: '🌸 Collection Fleur d\'Oranger', en: '🌸 Orange Blossom Collection' },
      subtitle: { fr: 'Fraîcheur Méditerranéenne', en: 'Mediterranean Freshness' },
      image: 'https://i.ibb.co/q3hW27zJ/Flux-Dev-A-serene-ultradetailed-watercolorstyle-background-for-3.jpg',
      product: 'Orange Blossom'
    },
    {
      id: 3,
      title: { fr: '🌺 Essence de Jasmin', en: '🌺 Jasmine Essence' },
      subtitle: { fr: 'Élégance Florale Pure', en: 'Pure Floral Elegance' },
      image: 'https://i.ibb.co/4R9ZV6nP/Flux-Dev-A-serene-ultradetailed-watercolorstyle-background-for-0.jpg',
      product: 'Jasmine'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`
            }}
          />
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
                {t(slide.title)}
              </h1>
              <p className="text-xl md:text-2xl text-cream mb-8 font-light">
                {t(slide.subtitle)}
              </p>
              
              <button className="group bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-sage-600/25 flex items-center gap-3 mx-auto">
                <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {t({ fr: '🛒 Découvrir', en: '🛒 Shop Now' })}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;