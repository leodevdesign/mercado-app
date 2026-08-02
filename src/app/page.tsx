'use client';

import React, { useState, useEffect } from 'react';
import { useShoppingStore, initialCatalog } from '@/store/useShoppingStore';
import { BaseProduct } from '@/types';
import { FavoritesList } from '@/components/FavoritesList';
import { AddProductForm } from '@/components/AddProductForm';
import { EditQuantityModal } from '@/components/EditQuantityModal';
import { ReadyList } from '@/components/ReadyList';
import { DeliveryChecklist } from '@/components/DeliveryChecklist';
import { AuthModal, UserProfile } from '@/components/AuthModal';
import { ListModeSelector } from '@/components/ListModeSelector';
import { ShoppingBag, ClipboardList, Store, RefreshCw, PackageCheck, LogIn, Users, Sparkles, Lock } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ready' | 'checklist'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<BaseProduct | null>(null);
  const [modalInitialQty, setModalInitialQty] = useState<string | number>(1);
  const [modalInitialUnit, setModalInitialUnit] = useState<string>('unidades');
  const [modalInitialDetails, setModalInitialDetails] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Auth State (Loaded dynamically from localStorage or null)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Zustand Store
  const {
    catalog,
    cart,
    activeChecklist,
    orderHistory,
    activeMode,
    setActiveMode,
    addProductToCatalog,
    removeProductFromCatalog,
    resetCatalogToDefault,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    syncCartToChecklist,
    toggleChecklistItemStatus,
    setChecklistItemIssueNote,
    completeAndArchiveOrder,
    deleteArchivedOrder,
    loadArchivedOrderToCart,
  } = useShoppingStore();

  // Load saved user profile & enforce Login screen on first visit
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedUserStr = localStorage.getItem('mercado_user_profile');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        setCurrentUser(parsed);
      } else {
        // Enforce Login screen on first visit
        setIsAuthModalOpen(true);
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil salvo:', e);
      setIsAuthModalOpen(true);
    }
  }, []);

  const handleLoginUser = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('mercado_user_profile', JSON.stringify(user));
    } catch (e) {
      console.warn('Erro ao salvar perfil no localStorage:', e);
    }
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mercado_user_profile');
    } catch (e) {
      console.warn('Erro ao remover perfil do localStorage:', e);
    }
    setIsAuthModalOpen(true);
  };

  // Safe Fallbacks
  const safeCatalog = catalog && catalog.length > 0 ? catalog : initialCatalog;
  const safeCart = cart || [];
  const safeChecklist = activeChecklist || [];
  const safeHistory = orderHistory || [];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-amber-50/20 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-2xl font-bold text-slate-700">Carregando sua lista de compras...</p>
        </div>
      </div>
    );
  }

  const handleOpenQuantityModal = (
    product: BaseProduct,
    currentQty?: string | number,
    currentUnit?: string,
    currentDetails?: string
  ) => {
    const existingInCart = safeCart.find((item) => item.product?.id === product.id);
    setSelectedProduct(product);
    setModalInitialQty(currentQty || (existingInCart ? existingInCart.quantity : 1));
    setModalInitialUnit(currentUnit || (existingInCart ? (existingInCart.unit || product.defaultUnit) : product.defaultUnit));
    setModalInitialDetails(currentDetails !== undefined ? currentDetails : (existingInCart ? (existingInCart.customDetails || product.details || '') : (product.details || '')));
    setIsModalOpen(true);
  };

  const handleSaveQuantity = (
    product: BaseProduct,
    quantity: string | number,
    unit: string,
    details: string
  ) => {
    addToCart(product, quantity, unit, details);
  };

  const handleTabChange = (tab: 'catalog' | 'ready' | 'checklist') => {
    if (tab === 'checklist') {
      syncCartToChecklist();
    }
    setActiveTab(tab);
  };

  const handleReuseOrder = (orderId: string) => {
    loadArchivedOrderToCart(orderId);
    setActiveTab('ready');
  };

  const totalCartCount = safeCart.length;
  const totalChecklistCount = safeChecklist.length > 0 ? safeChecklist.length : totalCartCount;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-900 pb-16">
      {/* Top Header - Warm Amber & Terracotta Theme */}
      <header className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Meu Mercado
                </h1>
                <p className="text-amber-100 text-sm sm:text-base font-semibold">
                  Lista fácil e rápida para WhatsApp
                </p>
              </div>
            </div>

            {totalCartCount > 0 && activeTab === 'catalog' && (
              <button
                onClick={() => handleTabChange('ready')}
                className="hidden md:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-black text-lg shadow-md transition-transform hover:scale-105"
              >
                <ClipboardList className="w-6 h-6" />
                <span>Ver Lista ({totalCartCount})</span>
              </button>
            )}
          </div>

          {/* Navigation 3-Tabs Bar with FIXED HEIGHT & NO WRAP SHIFT */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 pt-2">
            {/* Tab 1 */}
            <button
              onClick={() => handleTabChange('catalog')}
              className={`h-20 sm:h-22 px-2 sm:px-4 rounded-2xl font-black text-sm sm:text-lg flex flex-col items-center justify-center gap-1 transition-all shadow-sm relative ${
                activeTab === 'catalog'
                  ? 'bg-white text-amber-900 shadow-md ring-4 ring-white/30 scale-[1.02]'
                  : 'bg-amber-900/60 hover:bg-amber-900/90 text-white/90 border border-amber-400/30'
              }`}
            >
              <ShoppingBag className="w-6 h-6 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">1. MONTAR</span>
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => handleTabChange('ready')}
              className={`h-20 sm:h-22 px-2 sm:px-4 rounded-2xl font-black text-sm sm:text-lg flex flex-col items-center justify-center gap-1 transition-all shadow-sm relative ${
                activeTab === 'ready'
                  ? 'bg-white text-amber-900 shadow-md ring-4 ring-white/30 scale-[1.02]'
                  : 'bg-amber-900/60 hover:bg-amber-900/90 text-white/90 border border-amber-400/30'
              }`}
            >
              <ClipboardList className="w-6 h-6 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">2. VER LISTA</span>
              {totalCartCount > 0 && (
                <span className="absolute top-2 right-2 sm:top-2.5 sm:right-3 bg-emerald-500 text-white text-xs sm:text-sm w-6 h-6 sm:w-7 sm:h-7 rounded-full font-black flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => handleTabChange('checklist')}
              className={`h-20 sm:h-22 px-2 sm:px-4 rounded-2xl font-black text-sm sm:text-lg flex flex-col items-center justify-center gap-1 transition-all shadow-sm relative ${
                activeTab === 'checklist'
                  ? 'bg-white text-amber-900 shadow-md ring-4 ring-white/30 scale-[1.02]'
                  : 'bg-amber-900/60 hover:bg-amber-900/90 text-white/90 border border-amber-400/30'
              }`}
            >
              <PackageCheck className="w-6 h-6 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">3. CONFERIR</span>
              {totalChecklistCount > 0 && (
                <span className="absolute top-2 right-2 sm:top-2.5 sm:right-3 bg-amber-400 text-amber-950 text-xs sm:text-sm w-6 h-6 sm:w-7 sm:h-7 rounded-full font-black flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                  {totalChecklistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* List Mode Switcher: Family Shared vs Personal List */}
        <ListModeSelector
          activeMode={activeMode}
          onChangeMode={(mode) => setActiveMode(mode)}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Welcome / Login Gate Banner if not logged in */}
        {!currentUser && (
          <div className="bg-amber-100 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 mb-6 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
              ENTRE COM SUA CONTA PARA SALVAR SUAS LISTAS!
            </h2>
            <p className="text-amber-900 text-lg max-w-xl mx-auto font-medium">
              Faça login ou entre com o Google para ter acesso à **Lista Compartilhada da Família** e à sua **Lista Pessoal**.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="py-4 px-8 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xl rounded-2xl shadow-lg transition-all hover:scale-105 inline-flex items-center gap-3"
            >
              <LogIn className="w-6 h-6" />
              <span>ENTRAR OU CRIAR PERFIL AGORA</span>
            </button>
          </div>
        )}

        {activeTab === 'catalog' ? (
          <div>
            {/* Form to Add New Product to Catalog */}
            <AddProductForm onAddProduct={addProductToCatalog} />

            {/* Recurring Catalog Section Header */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  📌 SEUS ITENS RECORRENTES ({activeMode === 'family' ? 'Mundo Família' : 'Privativo'})
                </h2>
                <p className="text-slate-600 font-semibold text-base mt-1">
                  Toque em qualquer produto abaixo para escolher a quantidade, unidade e observações.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Restaurar o catálogo com todos os produtos padrão recomendados?')) {
                    resetCatalogToDefault();
                  }
                }}
                className="flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-bold text-sm bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300"
              >
                <RefreshCw className="w-4 h-4" />
                Restaurar Padrões
              </button>
            </div>

            {/* Catalog Grid */}
            <FavoritesList
              catalog={safeCatalog}
              cart={safeCart}
              onSelectProduct={(product) => handleOpenQuantityModal(product)}
              onRemoveFromCatalog={removeProductFromCatalog}
            />
          </div>
        ) : activeTab === 'ready' ? (
          <div>
            <ReadyList
              cart={safeCart}
              onUpdateQuantity={(id, qty) => updateCartItem(id, qty)}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onEditProductModal={(product, qty, unit, details) =>
                handleOpenQuantityModal(product, qty, unit, details)
              }
            />
          </div>
        ) : (
          <div>
            <DeliveryChecklist
              checklist={safeChecklist}
              orderHistory={safeHistory}
              onToggleStatus={toggleChecklistItemStatus}
              onSetIssueNote={setChecklistItemIssueNote}
              onCompleteOrder={completeAndArchiveOrder}
              onDeleteHistoryOrder={deleteArchivedOrder}
              onReuseOrder={handleReuseOrder}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-slate-500 border-t border-slate-200 text-base font-semibold">
        <p>📱 Meu Mercado • Funciona 100% Offline e Sincronizado no Firebase</p>
      </footer>

      {/* Auth & Family Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLoginUser}
        onLogout={handleLogoutUser}
      />

      {/* Edit Quantity & Unit Modal */}
      <EditQuantityModal
        product={selectedProduct}
        initialQuantity={modalInitialQty}
        initialUnit={modalInitialUnit}
        initialDetails={modalInitialDetails}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuantity}
      />
    </div>
  );
}
