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
} from 'lucide-react';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'Pai' | 'Mãe' | 'Filho(a)' | 'Outro';
  familyCode: string;
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const loggedUser: UserProfile = {
      uid: email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: name.trim() || (email.split('@')[0]),
      email: email.trim(),
      role,
      familyCode: familyCode.trim().toUpperCase() || 'FAMILIA-CASA',
    };

    onLogin(loggedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 stroke-[2.5]" />
            <div>
              <h2 className="text-2xl font-black">
                {currentUser ? 'SEU PERFIL DE FAMÍLIA' : 'ENTRAR NO MERCADO APP'}
              </h2>
              <p className="text-blue-100 text-sm font-medium">
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
        <div className="p-6 sm:p-8 space-y-6">
          {currentUser ? (
            /* Logged In State */
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-indigo-100 border-4 border-indigo-500 text-indigo-700 rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">{currentUser.name}</h3>
                <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-800 font-extrabold text-sm rounded-full border border-indigo-200">
                  {currentUser.role}
                </span>
                <p className="text-slate-500 font-medium text-sm mt-1">{currentUser.email}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-left space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Código do Grupo da Família:</span>
                  <span className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-lg border border-blue-200 font-black">
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2.5 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-5 h-5" />
                  <span>ENTRAR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2.5 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>CRIAR CONTA</span>
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 mb-1">
                      Seu Nome ou Apelido:
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Leo, Pai, Mãe"
                        className="w-full h-13 pl-12 pr-4 text-lg font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-extrabold text-slate-700 mb-1">
                    E-mail:
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full h-13 pl-12 pr-4 text-lg font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-700 mb-1">
                    Senha:
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-13 pl-12 pr-4 text-lg font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-sm font-extrabold text-slate-700 mb-1">
                        Seu Papel na Família:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Pai', 'Mãe', 'Filho(a)'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`py-2.5 rounded-xl font-black text-sm border-2 transition-all ${
                              role === r
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-extrabold text-slate-700 mb-1">
                        Código do Grupo da Família:
                      </label>
                      <input
                        type="text"
                        value={familyCode}
                        onChange={(e) => setFamilyCode(e.target.value)}
                        placeholder="Ex: FAMILIA-NEXT-2026"
                        className="w-full h-12 px-4 text-base font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none uppercase"
                      />
                      <span className="text-xs text-slate-500 mt-1 block">
                        Use o mesmo código com seu pai e sua mãe para compartilharem a mesma lista!
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xl rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <span>{authMode === 'login' ? 'ENTRAR NA CONTA' : 'CRIAR CONTA DA FAMÍLIA'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
