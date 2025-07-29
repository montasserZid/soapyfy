import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) {
      newErrors.email = t({ fr: 'Email requis', en: 'Email required' });
    } else if (!validateEmail(form.email)) {
      newErrors.email = t({ fr: 'Email invalide', en: 'Invalid email' });
    }

    if (!form.password) {
      newErrors.password = t({ fr: 'Mot de passe requis', en: 'Password required' });
    } else if (mode === 'register' && form.password.length < 6) {
      newErrors.password = t({ fr: 'Minimum 6 caractères', en: 'Minimum 6 characters' });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    let success = false;

    try {
      if (mode === 'login') {
        success = await login(form.email, form.password);
        if (!success) {
          setErrors({ auth: t({ fr: 'Email ou mot de passe incorrect', en: 'Invalid email or password' }) });
        }
      } else {
        success = await register(form.email, form.password);
        if (!success) {
          setErrors({ auth: t({ fr: 'Cet email existe déjà', en: 'Email already exists' }) });
        }
      }

      if (success) {
        onClose();
        setForm({ email: '', password: '' });
        setErrors({});
      }
    } catch (error) {
      setErrors({ auth: t({ fr: 'Une erreur est survenue', en: 'An error occurred' }) });
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-sage-800">
                {mode === 'login' 
                  ? t({ fr: 'Connexion', en: 'Login' })
                  : t({ fr: 'Créer un compte', en: 'Create Account' })
                }
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sage-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-sage-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sage-700 font-medium mb-2">
                  {t({ fr: 'Email', en: 'Email' })}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                    placeholder={t({ fr: 'votre@email.com', en: 'your@email.com' })}
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sage-700 font-medium mb-2">
                  {t({ fr: 'Mot de passe', en: 'Password' })}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                    placeholder={mode === 'register' 
                      ? t({ fr: 'Minimum 6 caractères', en: 'Minimum 6 characters' })
                      : t({ fr: 'Votre mot de passe', en: 'Your password' })
                    }
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {errors.auth && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{errors.auth}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sage-600 to-peach hover:from-sage-700 hover:to-peach text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? t({ fr: 'Chargement...', en: 'Loading...' })
                  : mode === 'login'
                    ? t({ fr: 'Se connecter', en: 'Sign In' })
                    : t({ fr: 'Créer le compte', en: 'Create Account' })
                }
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sage-600">
                {mode === 'login' 
                  ? t({ fr: 'Pas encore de compte ?', en: "Don't have an account?" })
                  : t({ fr: 'Déjà un compte ?', en: 'Already have an account?' })
                }
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="ml-2 text-sage-800 font-medium hover:underline"
                >
                  {mode === 'login' 
                    ? t({ fr: 'Créer un compte', en: 'Create one' })
                    : t({ fr: 'Se connecter', en: 'Sign in' })
                  }
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;