'use client';

import React, { useState } from 'react';
import { BaseProduct, CartItem, Category } from '@/types';
import {
  Search,
  Plus,
  Check,
  Trash2,
  Apple,
  Milk,
  Beef,
  ShoppingBag,
  Sparkles,
  Coffee,
  Croissant,
  HelpCircle,
  ShowerHead,
  SprayCan,
  Image as ImageIcon,
} from 'lucide-react';

interface FavoritesListProps {
  catalog: BaseProduct[];
  cart: CartItem[];
  onSelectProduct: (product: BaseProduct) => void;
  onRemoveFromCatalog: (id: string) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  catalog,
  cart,
  onSelectProduct,
  onRemoveFromCatalog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categoriesOrder: Category[] = [
    'Hortifrúti',
    'Açougue',
    'Laticínios',
    'Padaria',
    'Mercearia',
    'Bebidas',
    'Limpeza',
    'Higiene Pessoal',
  ];

  // Filter catalog based on search
  const filteredCatalog = catalog.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.variety && product.variety.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.details && product.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCartItem = (productId: string): CartItem | undefined => {
    return cart.find((c) => c.product?.id === productId);
  };

  const getCategoryTheme = (cat: Category) => {
    switch (cat) {
      case 'Hortifrúti':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <Apple className="w-5 h-5 text-amber-800" />,
        };
      case 'Laticínios':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <Milk className="w-5 h-5 text-amber-800" />,
        };
      case 'Açougue':
        return {
          bg: 'bg-red-100 text-red-950 border-red-300',
          icon: <Beef className="w-5 h-5 text-red-800" />,
        };
      case 'Padaria':
        return {
          bg: 'bg-orange-100 text-orange-950 border-orange-300',
          icon: <Croissant className="w-5 h-5 text-orange-800" />,
        };
      case 'Mercearia':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <ShoppingBag className="w-5 h-5 text-amber-800" />,
        };
      case 'Bebidas':
        return {
          bg: 'bg-purple-100 text-purple-950 border-purple-300',
          icon: <Coffee className="w-5 h-5 text-purple-800" />,
        };
      case 'Limpeza':
        return {
          bg: 'bg-cyan-100 text-cyan-950 border-cyan-300',
          icon: <SprayCan className="w-5 h-5 text-cyan-800" />,
        };
      case 'Higiene Pessoal':
        return {
          bg: 'bg-orange-100 text-orange-950 border-orange-300',
          icon: <ShowerHead className="w-5 h-5 text-orange-800" />,
        };
      default:
        return {
          bg: 'bg-slate-200 text-slate-900 border-slate-300',
          icon: <HelpCircle className="w-5 h-5 text-slate-700" />,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-7 w-7 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔎 Procurar por Arroz, Feijão, Café, Azeitona, Palmito, Banana..."
          className="w-full h-16 pl-14 pr-24 text-xl font-bold text-slate-900 bg-white border-3 border-slate-300 rounded-2xl shadow-sm focus:border-amber-600 focus:ring-4 focus:ring-amber-200 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 font-extrabold text-base hover:text-slate-900"
          >
            LIMPAR
          </button>
        )}
      </div>

      {/* Categories Grouped List */}
      {categoriesOrder.map((cat) => {
        const itemsInCat = filteredCatalog.filter((item) => item.category === cat);
        if (itemsInCat.length === 0) return null;

        const categoryTheme = getCategoryTheme(cat);

        return (
          <div key={cat} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-slate-100">
              <span className={`px-4 py-2 rounded-2xl border-2 font-black text-lg flex items-center gap-2 ${categoryTheme.bg}`}>
                {categoryTheme.icon}
                <span>{cat.toUpperCase()}</span>
              </span>
              <span className="text-slate-500 text-base font-extrabold">
                ({itemsInCat.length} {itemsInCat.length === 1 ? 'item' : 'itens'})
              </span>
            </div>

            {/* Grid of Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {itemsInCat.map((product, idx) => {
                const cartItem = getCartItem(product.id);
                const isAdded = !!cartItem;

                return (
                  <div
                    key={`${product.id}_${idx}`}
                    className={`relative flex flex-col justify-between rounded-3xl border-3 overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md ${
                      isAdded
                        ? 'bg-amber-100/60 border-amber-600 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-300 hover:border-amber-500 hover:bg-amber-50/40'
                    }`}
                  >
                    {/* Delete Catalog Product Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Deseja remover "${product.name}" do seu catálogo de favoritos?`)) {
                          onRemoveFromCatalog(product.id);
                        }
                      }}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-md text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-xs"
                      title="Excluir produto do catálogo"
                      aria-label={`Excluir ${product.name}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Product Image Thumbnail */}
                    {product.imageUrl ? (
                      <div
                        onClick={() => onSelectProduct(product)}
                        className="w-full h-44 bg-slate-200 relative overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white font-black text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs">
                          {product.category}
                        </span>
                      </div>
                    ) : (
                      <div
                        onClick={() => onSelectProduct(product)}
                        className="w-full h-24 bg-slate-200/60 flex items-center justify-center cursor-pointer text-slate-400"
                      >
                        <ImageIcon className="w-10 h-10 stroke-[1.5]" />
                      </div>
                    )}

                    {/* Product Main Content */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="p-5 cursor-pointer flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1">
                          {product.name}
                        </h3>

                        {/* Variety / Brand Badges */}
                        {(product.variety || product.brand) && (
                          <div className="flex flex-wrap gap-1.5 my-2">
                            {product.variety && (
                              <span className="bg-amber-100 text-amber-950 font-extrabold text-xs px-2.5 py-0.5 rounded-lg border border-amber-300">
                                Tipo: {product.variety}
                              </span>
                            )}
                            {product.brand && (
                              <span className="bg-purple-100 text-purple-900 font-extrabold text-xs px-2.5 py-0.5 rounded-lg border border-purple-200">
                                Marca: {product.brand}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Brief Description */}
                        {product.description && (
                          <p className="text-slate-600 font-medium text-sm leading-snug mb-2">
                            {product.description}
                          </p>
                        )}

                        {/* Fixed Details / Note */}
                        {product.details && (
                          <p className="text-slate-700 font-bold text-base leading-snug">
                            📌 {product.details}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Unit Badge and Add Action Button */}
                    <div className="p-5 pt-0 mt-auto space-y-3">
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                          Medida padrão:
                        </span>
                        <span className="bg-slate-200 text-slate-800 font-black text-sm px-3 py-1 rounded-xl">
                          {product.defaultUnit}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className={`w-full py-3.5 px-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xs ${
                          isAdded
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                            : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:scale-[1.01]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-6 h-6 stroke-[3]" />
                            <span>Na Lista: {cartItem.quantity} {cartItem.unit || ''}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-6 h-6 stroke-[3]" />
                            <span>Adicionar à Lista</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filteredCatalog.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8">
          <p className="text-2xl font-bold text-slate-700 mb-2">Nenhum produto encontrado</p>
          <p className="text-slate-500 text-lg">
            Utilize o botão acima para cadastrar um novo item no seu catálogo.
          </p>
        </div>
      )}
    </div>
  );
};
