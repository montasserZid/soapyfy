import React, { useState } from 'react';
import { ShoppingCart, Info } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [showIngredients, setShowIngredients] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={product.image}
          alt={t(product.name)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Ingredients Popup */}
        {showIngredients && (
          <div className="absolute inset-0 bg-sage-900/90 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="text-center">
              <h4 className="text-white font-serif text-lg mb-3">
                {t({ fr: 'Ingrédients', en: 'Ingredients' })}
              </h4>
              <ul className="text-cream text-sm space-y-1">
                {t(product.ingredients).map((ingredient, index) => (
                  <li key={index}>• {ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Ingredients Button */}
        <button
          onMouseEnter={() => setShowIngredients(true)}
          onMouseLeave={() => setShowIngredients(false)}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
        >
          <Info className="w-4 h-4 text-sage-600" />
        </button>

        {/* Botanical Badge */}
        <div className="absolute top-4 left-4 bg-peach/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sage-800 text-sm font-medium">{product.botanical}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-serif text-sage-800 mb-2 group-hover:text-sage-600 transition-colors">
          {t(product.name)}
        </h3>
        <p className="text-sage-600 text-sm mb-4 leading-relaxed">
          {t(product.description)}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-sage-800">{product.price}</span>
          
          <button 
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-peach to-sage-400 hover:from-sage-600 hover:to-peach text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group"
          >
            <ShoppingCart className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {t({ fr: '🛍️ Ajouter', en: '🛍️ Add to Cart' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;