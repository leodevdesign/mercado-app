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
import { ShoppingBag, ClipboardList, Store, RefreshCw, PackageCheck } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ready' | 'checklist'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<BaseProduct | null>(null);
  const [modalInitialQty, setModalInitialQty] = useState<string | number>(1);
  const [modalInitialUnit, setModalInitialUnit] = useState<string>('unidades');
  const [modalInitialDetails, setModalInitialDetails] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Auth & List Mode State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    uid: 'user_default',
    name: 'Família',
    email: 'familia@casa.com',
    role: 'Pai',
    familyCode: 'FAMILIA-NEXT-2026',
  });
  const [activeMode, setActiveMode] = useState<'family' | 'personal'>('family');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Zustand Store
  const {
    catalog,
    cart,
    activeChecklist,
    orderHistory,
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

  // Prevent SSR Hydration Mismatch for localstorage state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe Fallbacks
  const safeCatalog = catalog && catalog.length > 0 ? catalog : initialCatalog;
  const safeCart = cart || [];
  const safeChecklist = activeChecklist || [];
  const safeHistory = orderHistory || [];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Store className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Meu Mercado
                </h1>
                <p className="text-blue-100 text-sm sm:text-base font-semibold">
                  Lista fácil e rápida para WhatsApp
                </p>
              </div>
            </div>

            {totalCartCount > 0 && activeTab === 'catalog' && (
              <button
                onClick={() => handleTabChange('ready')}
                className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-5 py-2.5 rounded-2xl font-black text-lg shadow-md transition-transform hover:scale-105"
              >
                <ClipboardList className="w-6 h-6" />
                <span>Ver Lista ({totalCartCount})</span>
              </button>
            )}
          </div>

          {/* Navigation 3-Tabs Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 pt-2">
            <button
              onClick={() => handleTabChange('catalog')}
              className={`py-3.5 px-2 sm:px-4 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all shadow-sm ${
                activeTab === 'catalog'
                  ? 'bg-white text-blue-800 shadow-md ring-4 ring-white/30 scale-[1.02]'
                  : 'bg-blue-800/60 hover:bg-blue-800/90 text-white/90 border border-blue-400/30'
              }`}
            >
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
              <span>1. MONTAR</span>
            </button>

            <button
              onClick={() => handleTabChange('ready')}
              className={`py-3.5 px-2 sm:px-4 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all shadow-sm relative ${
                activeTab === 'ready'
                  ? 'bg-white text-blue-800 shadow-md ring-4 ring-white/30 scale-[1.02]'
                  : 'bg-blue-800/60 hover:bg-blue-800/90 text-white/90 border border-blue-400/30'
              }`}
            >
              <ClipboardList className="w-6 h-6 stroke-[2.5]" />
              <div className="flex items-center gap-1">
                <span>2. VER LISTA</span>
                {totalCartCount > 0 && (
                  <span className="bg-green-500 text-white text-xs sm:text-sm px-2 py-0.5 rounded-full font-black shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => handleTabChange('checklist')}
              className={`py-3.5 px-2 sm:px-4 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all shadow-sm relative ${
                activeTab === 'checklist'
                  ? 'bg-white text-blue-800 shadow-md ring-4 ring-white/30 scale-[1.02]'
                  : 'bg-blue-800/60 hover:bg-blue-800/90 text-white/90 border border-blue-400/30'
              }`}
            >
              <PackageCheck className="w-6 h-6 stroke-[2.5]" />
              <div className="flex items-center gap-1">
                <span>3. CONFERIR</span>
                {totalChecklistCount > 0 && (
                  <span className="bg-amber-400 text-amber-950 text-xs sm:text-sm px-2 py-0.5 rounded-full font-black shadow-xs">
                    {totalChecklistCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* List Mode Switcher: Family Shared vs Personal List */}
        <ListModeSelector
          activeMode={activeMode}
          onChangeMode={setActiveMode}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {activeTab === 'catalog' ? (
          <div>
            {/* Form to Add New Product to Catalog */}
            <AddProductForm onAddProduct={addProductToCatalog} />

            {/* Recurring Catalog Section Header */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  📌 SEUS ITENS RECORRENTES
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
                className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200"
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
        <p>📱 Mercado App • Funciona 100% Offline e Sincronizado no Firebase</p>
      </footer>

      {/* Auth & Family Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
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
