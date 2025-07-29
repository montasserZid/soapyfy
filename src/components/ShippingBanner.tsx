import React from 'react';
import { Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ShippingBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-sage-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <Truck className="w-4 h-4" />
        <span>
          {t({ 
            fr: 'Commandes de 30$ et plus : Livraison gratuite à Montréal', 
            en: 'Orders over $30: Free shipping within Montreal' 
          })}
        </span>
      </div>
    </div>
  );
};

export default ShippingBanner;