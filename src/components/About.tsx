import React from 'react';
import { Heart, Leaf, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: { fr: 'Fait Main avec Amour', en: 'Handmade with Love' },
      description: {
        fr: 'Chaque savon est créé artisanalement dans notre atelier provençal avec passion et dévouement.',
        en: 'Each soap is handcrafted in our Provençal workshop with passion and dedication.'
      }
    },
    {
      icon: Leaf,
      title: { fr: 'Ingrédients Naturels', en: 'Natural Ingredients' },
      description: {
        fr: 'Nous utilisons uniquement des ingrédients biologiques et durables, respectueux de votre peau.',
        en: 'We only use organic and sustainable ingredients, respectful of your skin.'
      }
    },
    {
      icon: Award,
      title: { fr: 'Tradition Tunisienne', en: 'Tunisian Tradition' },
      description: {
        fr: 'Notre savoir-faire s\'enracine dans l\'art ancestral des savonniers de Tunisie.',
        en: 'Our expertise is rooted in the ancestral art of Tunisian soap makers.'
      }
    }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Watercolor Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(1px)'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-800 mb-6">
            {t({ fr: '✨ Fabrication Artisanale & Éthique', en: '✨ Ethical Handcrafted Soaps' })}
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-sage-700 text-lg leading-relaxed mb-6">
              {t({
                fr: 'Dans notre atelier niché au cœur de la Tunisie, nous perpétuons l\'art ancestral de la savonnerie tunisienne. Chaque savon Soapyfy naît de la rencontre entre tradition séculaire et innovation moderne, créant des produits d\'exception qui respectent votre peau et l\'environnement.',
                en: 'In our workshop nestled in the heart of Tunisia, we perpetuate the ancestral art of Tunisian soap making. Each Soapyfy soap is born from the meeting between centuries-old tradition and modern innovation, creating exceptional products that respect your skin and the environment.'
              })}
            </p>
            <p className="text-sage-600 text-base leading-relaxed">
              {t({
                fr: 'Nos créations artisanales sont élaborées en petites quantités, garantissant fraîcheur et qualité premium. Nous sélectionnons avec soin chaque ingrédient : huiles végétales biologiques, essences florales pures, et beurres nourrissants pour offrir à votre peau le luxe qu\'elle mérite.',
                en: 'Our artisanal creations are made in small batches, guaranteeing freshness and premium quality. We carefully select each ingredient: organic vegetable oils, pure floral essences, and nourishing butters to give your skin the luxury it deserves.'
              })}
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-sage-100 to-peach/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <Icon className="w-8 h-8 text-sage-600 group-hover:text-sage-800 transition-colors" />
                </div>
                <h3 className="text-xl font-serif text-sage-800 mb-4">
                  {t(value.title)}
                </h3>
                <p className="text-sage-600 leading-relaxed">
                  {t(value.description)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-sage-100 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-serif text-sage-800 mb-6">
                {t({ fr: 'Notre Histoire', en: 'Our Story' })}
              </h3>
              <p className="text-sage-700 leading-relaxed mb-6">
                {t({
                  fr: 'Née de la passion pour les senteurs tunisiennes et l\'art du bien-être, Soapyfy a vu le jour dans un petit village de Tunisie où les champs de lavande se mêlent aux orangers et aux jasmins. Notre fondatrice, inspirée par les recettes traditionnelles de sa grand-mère, a créé une gamme de savons qui capture l\'essence même de la Méditerranée.',
                  en: 'Born from a passion for Tunisian scents and the art of well-being, Soapyfy was created in a small Tunisian village where lavender fields mingle with orange trees and jasmine. Our founder, inspired by her grandmother\'s traditional recipes, created a range of soaps that captures the very essence of the Mediterranean.'
                })}
              </p>
              <p className="text-sage-600 leading-relaxed">
                {t({
                  fr: 'Aujourd\'hui, chaque savon continue de raconter cette histoire d\'amour entre nature et savoir-faire, offrant à votre rituel beauté un moment d\'évasion sensorielle unique.',
                  en: 'Today, each soap continues to tell this love story between nature and know-how, offering your beauty ritual a unique sensory escape.'
                })}
              </p>
            </div>
            <div className="relative">
              <img
                src="https://st.depositphotos.com/1174085/57501/i/450/depositphotos_575010504-stock-photo-photographic-documentation-jasmine-hedge-full.jpg"
                alt="Artisan soap making process"
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-peach to-sage-400 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl">🌿</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;