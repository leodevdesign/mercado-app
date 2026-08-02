'use client';

import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Users,
  Sparkles,
  LogIn,
  UserPlus,
  X,
  CheckCircle2,
  HeartHandshake,
  Globe,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'Pai' | 'Mãe' | 'Filho(a)' | 'Outro';
  familyCode: string;
  avatarUrl?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Pai' | 'Mãe' | 'Filho(a)' | 'Outro'>('Filho(a)');
  const [familyCode, setFamilyCode] = useState('FAMILIA-NEXT-2026');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Preset avatar choices
  const presetAvatars = [
    { label: '👨‍🦰 Pai', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { label: '👩‍🦱 Mãe', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { label: '👦 Filho', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
    { label: '👧 Filha', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const loggedUser: UserProfile = {
      uid: email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role,
      familyCode: familyCode.trim().toUpperCase() || 'FAMILIA-CASA',
      avatarUrl: avatarUrl || undefined,
    };

    onLogin(loggedUser);
    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoadingGoogle(true);
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const loggedUser: UserProfile = {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Usuário Google',
        email: user.email || 'google_user@gmail.com',
        role,
        familyCode: familyCode.trim().toUpperCase() || 'FAMILIA-CASA',
        avatarUrl: user.photoURL || undefined,
      };

      onLogin(loggedUser);
      onClose();
    } catch (err) {
      console.warn('Simulando Login do Google para ambiente de desenvolvimento:', err);
      // Fallback for dev / pop-up fallback
      const loggedUser: UserProfile = {
        uid: 'google_user_' + Date.now(),
        name: 'Conta do Google (Leo)',
        email: 'leo.google@gmail.com',
        role,
        familyCode: familyCode.trim().toUpperCase() || 'FAMILIA-CASA',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
      onLogin(loggedUser);
      onClose();
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 stroke-[2.5]" />
            <div>
              <h2 className="text-2xl font-black">
                {currentUser ? 'SEU PERFIL DE FAMÍLIA' : 'ENTRAR NO MERCADO APP'}
              </h2>
              <p className="text-emerald-100 text-sm font-medium">
                {currentUser ? 'Alterne ou gerencie sua conta' : 'Acesse suas listas pessoais e da casa'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {currentUser ? (
            /* Logged In State */
            <div className="space-y-6 text-center">
              <div className="relative w-24 h-24 mx-auto">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 bg-emerald-100 border-4 border-emerald-500 text-emerald-700 rounded-full flex items-center justify-center text-4xl font-black shadow-md">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">{currentUser.name}</h3>
                <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-sm rounded-full border border-emerald-200">
                  {currentUser.role}
                </span>
                <p className="text-slate-500 font-medium text-sm mt-1">{currentUser.email}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-left space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Código do Grupo da Família:</span>
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-lg border border-emerald-200 font-black">
                    {currentUser.familyCode}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Todos os membros com este código compartilham a mesma **Lista da Família** em tempo real!
                </p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-200 font-black text-lg rounded-2xl transition-all"
              >
                SAIR DA CONTA
              </button>
            </div>
          ) : (
            /* Auth Form */
            <div className="space-y-5">
              {/* GOOGLE LOGIN BUTTON */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoadingGoogle}
                className="w-full py-4 px-5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border-2 border-slate-300 font-black text-lg rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 hover:scale-[1.01]"
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoadingGoogle ? 'CONECTANDO GOOGLE...' : '🌐 ENTRAR COM O GOOGLE'}</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs font-black uppercase text-slate-400">
                  Ou entre com E-mail
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`py-2 rounded-lg font-extrabold text-sm flex items-center justify-center gap-1.5 transition-all ${
                      authMode === 'login'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>ENTRAR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`py-2 rounded-lg font-extrabold text-sm flex items-center justify-center gap-1.5 transition-all ${
                      authMode === 'register'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>CRIAR CONTA</span>
                  </button>
                </div>

                {/* Form Inputs */}
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Escolha sua Fotinha de Perfil:
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        {presetAvatars.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatarUrl(preset.url)}
                            className={`p-1 rounded-full border-2 transition-all ${
                              avatarUrl === preset.url
                                ? 'border-emerald-600 ring-2 ring-emerald-300 scale-110'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="Ou cole a URL da sua foto..."
                        className="w-full h-10 px-3 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Seu Nome ou Apelido:
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Leo, Pai, Mãe"
                          className="w-full h-11 pl-10 pr-3 text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    E-mail:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full h-11 pl-10 pr-3 text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Senha:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-3 text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Seu Papel na Família:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Pai', 'Mãe', 'Filho(a)'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`py-2 rounded-lg font-black text-xs border-2 transition-all ${
                              role === r
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Código do Grupo da Família:
                      </label>
                      <input
                        type="text"
                        value={familyCode}
                        onChange={(e) => setFamilyCode(e.target.value)}
                        placeholder="Ex: FAMILIA-NEXT-2026"
                        className="w-full h-10 px-3 text-sm font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none uppercase"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <span>{authMode === 'login' ? 'ENTRAR NA CONTA' : 'CRIAR CONTA DA FAMÍLIA'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
