import React from 'react';
import { Leaf, Instagram, Facebook, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-sage-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-peach rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-sage-800" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-wide">
                Soapyfy
              </span>
            </div>
            <p className="text-cream/80 leading-relaxed mb-6 max-w-md">
              {t({
                fr: 'Savons artisanaux de Tunisie, créés avec amour et tradition tunisienne. Découvrez nos créations naturelles pour un rituel beauté authentique.',
                en: 'Handcrafted soaps from Tunisia, created with love and Tunisian tradition. Discover our natural creations for an authentic beauty ritual.'
              })}
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="group bg-white/10 hover:bg-peach p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5 group-hover:text-sage-800 transition-colors" />
              </a>
              <a 
                href="#" 
                className="group bg-white/10 hover:bg-peach p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5 group-hover:text-sage-800 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-4">
              {t({ fr: 'Liens Rapides', en: 'Quick Links' })}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'Accueil', en: 'Home' })}
                </a>
              </li>
              <li>
                <a href="#products" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'Produits', en: 'Products' })}
                </a>
              </li>
              <li>
                <a href="#about" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'À Propos', en: 'About' })}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'Contact', en: 'Contact' })}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-serif mb-4">
              {t({ fr: 'Informations', en: 'Information' })}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'Mentions légales', en: 'Privacy Policy' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'Livraison', en: 'Shipping' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'Retours', en: 'Returns' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-cream/80 hover:text-peach transition-colors hover:underline underline-offset-4">
                  {t({ fr: 'FAQ', en: 'FAQ' })}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-cream/60 flex items-center justify-center gap-2 flex-wrap">
            <span>© 2025 Soapyfy.</span>
            <span>
              {t({ 
                fr: 'Fait avec', 
                en: 'Made with' 
              })}
            </span>
            <Heart className="w-4 h-4 text-peach" />
            <span>
              {t({ 
                fr: 'au Canada', 
                en: 'in Canada' 
              })}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;