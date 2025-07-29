import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-peach/10 to-sage-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-800 mb-6">
            {t({ fr: 'Contactez-Nous', en: 'Contact Us' })}
          </h2>
          <p className="text-sage-600 text-lg max-w-2xl mx-auto">
            {t({
              fr: 'Nous serions ravis de vous entendre. N\'hésitez pas à nous écrire pour toute question.',
              en: 'We would love to hear from you. Feel free to write to us with any questions.'
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Card - Vintage Postcard Style */}
          <div className="relative">
            <div 
              className="bg-white rounded-3xl p-8 shadow-xl border-8 border-sage-200 transform hover:rotate-1 transition-transform duration-300"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f1f5f0" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
            >
              {/* Decorative Floral Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-peach/20 m-4" />
              
              <div className="relative z-10">
                <div 
                  className="flex items-center justify-center mb-8"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`bg-gradient-to-br from-peach to-sage-400 p-4 rounded-full transition-all duration-500 ${isHovering ? 'scale-110 rotate-12 shadow-xl' : ''}`}>
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-serif text-sage-800 text-center mb-8">
                  {t({ fr: 'Informations de Contact', en: 'Contact Information' })}
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-sage-50 hover:bg-sage-100 transition-colors">
                    <div className="bg-sage-600 p-2 rounded-full">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-800">Email</p>
                      <a href="mailto:contact@soapyfy.com" className="text-sage-600 hover:text-sage-800 transition-colors">
                        contact@soapyfy.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-peach/20 hover:bg-peach/30 transition-colors">
                    <div className="bg-peach p-2 rounded-full">
                      <Phone className="w-5 h-5 text-sage-800" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-800">
                        {t({ fr: 'Téléphone', en: 'Phone' })}
                      </p>
                      <a href="tel:+15141234567" className="text-sage-600 hover:text-sage-800 transition-colors">
                        +1 (514) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-sage-50 hover:bg-sage-100 transition-colors">
                    <div className="bg-sage-600 p-2 rounded-full">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-800">
                        {t({ fr: 'Adresse', en: 'Address' })}
                      </p>
                      <p className="text-sage-600">
                        {t({ 
                          fr: 'Montréal, QC, Canada', 
                          en: 'Montreal, QC, Canada' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🌸</div>
                <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">🌿</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sage-100">
            <h3 className="text-2xl font-serif text-sage-800 mb-6">
              {t({ fr: 'Envoyez-nous un message', en: 'Send us a message' })}
            </h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sage-700 font-medium mb-2">
                  {t({ fr: 'Nom', en: 'Name' })}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                  placeholder={t({ fr: 'Votre nom', en: 'Your name' })}
                />
              </div>

              <div>
                <label className="block text-sage-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                  placeholder={t({ fr: 'votre@email.com', en: 'your@email.com' })}
                />
              </div>

              <div>
                <label className="block text-sage-700 font-medium mb-2">
                  {t({ fr: 'Message', en: 'Message' })}
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all resize-none"
                  placeholder={t({ 
                    fr: 'Partagez vos questions ou commentaires...', 
                    en: 'Share your questions or comments...' 
                  })}
                />
              </div>

              <button className="w-full bg-gradient-to-r from-sage-600 to-peach hover:from-sage-700 hover:to-peach text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {t({ fr: 'Envoyer le message', en: 'Send Message' })}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;