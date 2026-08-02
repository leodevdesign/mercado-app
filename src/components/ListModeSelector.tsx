'use client';

import React from 'react';
import { Home, User, Users, Sparkles } from 'lucide-react';
import { UserProfile } from './AuthModal';

interface ListModeSelectorProps {
  activeMode: 'family' | 'personal';
  onChangeMode: (mode: 'family' | 'personal') => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
}

export const ListModeSelector: React.FC<ListModeSelectorProps> = ({
  activeMode,
  onChangeMode,
  currentUser,
  onOpenAuthModal,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 w-full md:w-auto bg-slate-100 p-2 rounded-2xl border-2 border-slate-200">
        <button
          type="button"
          onClick={() => onChangeMode('family')}
          className={`py-3.5 px-5 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all ${
            activeMode === 'family'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-[1.02] ring-2 ring-emerald-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Home className="w-6 h-6 stroke-[2.5]" />
          <span>🏠 LISTA DA FAMÍLIA</span>
          <span className="hidden sm:inline-block text-xs bg-emerald-800/40 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
            Compartilhada
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode('personal')}
          className={`py-3.5 px-5 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all ${
            activeMode === 'personal'
              ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md scale-[1.02] ring-2 ring-teal-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <User className="w-6 h-6 stroke-[2.5]" />
          <span>👤 MINHA LISTA</span>
          <span className="hidden sm:inline-block text-xs bg-teal-800/40 text-teal-100 px-2 py-0.5 rounded-full font-bold">
            Privativa
          </span>
        </button>
      </div>

      {/* User Account / Profile Button */}
      <button
        type="button"
        onClick={onOpenAuthModal}
        className="w-full md:w-auto px-5 py-3.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border-2 border-slate-300 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer"
      >
        <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-500 shadow-xs flex items-center justify-center bg-emerald-600 text-white font-black text-lg">
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          ) : currentUser ? (
            currentUser.name.charAt(0).toUpperCase()
          ) : (
            <Users className="w-6 h-6" />
          )}
        </div>
        <div className="text-left">
          <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
            {currentUser ? `CONTA: ${currentUser.role}` : 'ENTRAR NA CONTA'}
          </div>
          <div className="text-base font-black text-slate-900">
            {currentUser ? currentUser.name : 'Logar / Alternar Conta'}
          </div>
        </div>
      </button>
    </div>
  );
};
