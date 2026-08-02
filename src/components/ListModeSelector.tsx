'use client';

import React from 'react';
import { Home, User, Users, Sparkles, Camera } from 'lucide-react';
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
      {/* Mode Switcher Tabs - Warm Amber & Terracotta */}
      <div className="grid grid-cols-2 gap-2 w-full md:w-auto bg-slate-100 p-2 rounded-2xl border-2 border-slate-200">
        <button
          type="button"
          onClick={() => onChangeMode('family')}
          className={`py-3.5 px-5 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all ${
            activeMode === 'family'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md scale-[1.02] ring-2 ring-amber-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Home className="w-6 h-6 stroke-[2.5]" />
          <span>🏠 LISTA DA FAMÍLIA</span>
          <span className="hidden sm:inline-block text-xs bg-amber-900/40 text-amber-100 px-2 py-0.5 rounded-full font-bold">
            Compartilhada
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode('personal')}
          className={`py-3.5 px-5 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all ${
            activeMode === 'personal'
              ? 'bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-md scale-[1.02] ring-2 ring-orange-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <User className="w-6 h-6 stroke-[2.5]" />
          <span>👤 MINHA LISTA</span>
          <span className="hidden sm:inline-block text-xs bg-orange-900/40 text-orange-100 px-2 py-0.5 rounded-full font-bold">
            Privativa
          </span>
        </button>
      </div>

      {/* User Account / Interactive Avatar Button */}
      <button
        type="button"
        onClick={onOpenAuthModal}
        className="w-full md:w-auto px-5 py-3.5 bg-amber-50/60 hover:bg-amber-100/80 active:bg-amber-200/80 border-2 border-amber-200 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer group"
      >
        <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-500 shadow-xs flex items-center justify-center bg-amber-600 text-white font-black text-xl group-hover:scale-105 transition-all">
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
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        <div className="text-left">
          <div className="text-xs font-extrabold uppercase text-amber-800 tracking-wider">
            {currentUser ? `CONTA: ${currentUser.role}` : 'ENTRAR NA CONTA'}
          </div>
          <div className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <span>{currentUser ? currentUser.name : 'Logar / Alternar Conta'}</span>
            <span className="text-xs text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-md font-extrabold">
              Trocar Foto
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};
