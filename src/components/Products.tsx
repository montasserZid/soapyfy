import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

const Products: React.FC = () => {
  const { t } = useLanguage();

  const products: Product[] = [
    {
      id: '1',
      name: { fr: '🌸 Savon Lavande', en: '🌸 Lavender Soap' },
      description: {
        fr: 'Apaisant, peaux sensibles. Huile essentielle de lavande de Provence pour une relaxation profonde.',
        en: 'Calming, sensitive skin. Provence lavender essential oil for deep relaxation.'
      },
      price: '$5.00 CAD',
      ingredients: {
        fr: ['Huile d\'olive bio', 'Lavande de Provence', 'Beurre de karité', 'Huile de coco'],
        en: ['Organic olive oil', 'Provence lavender', 'Shea butter', 'Coconut oil']
      },
      image: 'https://i.ibb.co/G4N7kks8/Close-Up-Of-Lavender-Soap-Bar-With-Embossed-Text.png',
      botanical: '🌿'
    },
    {
      id: '2',
      name: { fr: '🍊 Savon Fleur d\'Oranger', en: '🍊 Orange Blossom Soap' },
      description: {
        fr: 'Énergisant, tous types de peau. Essence de fleur d\'oranger pour un réveil sensoriel.',
        en: 'Energizing, all skin types. Orange blossom essence for a sensory awakening.'
      },
      price: '$5.00 CAD',
      ingredients: {
        fr: ['Huile d\'olive bio', 'Fleur d\'oranger', 'Glycérine végétale', 'Vitamine E'],
        en: ['Organic olive oil', 'Orange blossom', 'Vegetable glycerin', 'Vitamin E']
      },
      image: 'https://i.ibb.co/YByxS4rC/Close-Up-Of-Peach-Soap-With-Embossed-Fleur-D-Oranger.png',
      botanical: '🌸'
    },
    {
      id: '3',
      name: { fr: '🌺 Savon Jasmin', en: '🌺 Jasmine Soap' },
      description: {
        fr: 'Luxueux, peaux matures. Parfum envoûtant de jasmin pour une expérience sensorielle unique.',
        en: 'Luxurious, mature skin. Enchanting jasmine fragrance for a unique sensory experience.'
      },
      price: '$5.00 CAD',
      ingredients: {
        fr: ['Huile d\'argan', 'Jasmin sambac', 'Beurre de cacao', 'Huile d\'amande douce'],
        en: ['Argan oil', 'Sambac jasmine', 'Cocoa butter', 'Sweet almond oil']
      },
      image: 'https://i.ibb.co/Vc1jDwPv/Close-Up-Of-Cream-Soap-Bar-With-Embossed-Design.png',
      botanical: '🌺'
    }
  ];

  return (
    <section id="products" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-800 mb-6">
            {t({ fr: 'Collection Signature', en: 'Signature Collection' })}
          </h2>
          <p className="text-sage-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {t({
              fr: 'Découvrez nos trois créations artisanales, inspirées de la tradition française et des jardins de Provence.',
              en: 'Discover our three artisanal creations, inspired by French tradition and Provence gardens.'
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="relative mt-16 flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="text-8xl">🌿</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;