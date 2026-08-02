'use client';

import React, { useState } from 'react';
import { BaseProduct, CartItem, Category } from '@/types';
import { generateWhatsAppMessage } from '@/utils/formatList';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  MessageSquare,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  ShoppingBag,
  Share2,
} from 'lucide-react';

interface ReadyListProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: string | number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onEditProductModal: (product: BaseProduct, currentQty: string | number, currentUnit?: string, currentDetails?: string) => void;
}

export const ReadyList: React.FC<ReadyListProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onEditProductModal,
}) => {
  const [copied, setCopied] = useState(false);

  const rawMessage = generateWhatsAppMessage(cart);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawMessage);
      setCopied(true);
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Falha ao copiar texto:', err);
    }
  };

  const handleSendWhatsApp = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    const encodedText = encodeURIComponent(rawMessage);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleIncrement = (item: CartItem) => {
    const currentNum = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity as string) || 1;
    onUpdateQuantity(item.product.id, currentNum + 1);
  };

  const handleDecrement = (item: CartItem) => {
    const currentNum = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity as string) || 1;
    if (currentNum > 1) {
      onUpdateQuantity(item.product.id, currentNum - 1);
    } else {
      if (confirm(`Deseja remover "${item.product.name}" da sua lista da semana?`)) {
        onRemoveItem(item.product.id);
      }
    }
  };

  const categoriesOrder: Category[] = [
    'Hortifrúti',
    'Açougue',
    'Laticínios',
    'Padaria',
    'Mercearia',
    'Bebidas',
    'Limpeza & Higiene',
    'Outros',
  ];

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border-2 border-slate-200 shadow-sm max-w-2xl mx-auto my-6">
        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">Sua lista está vazia!</h2>
        <p className="text-xl font-medium text-slate-600 mb-8 max-w-md mx-auto">
          Toque na primeira aba <strong>"1. MONTAR LISTA"</strong> para escolher os produtos que você precisa comprar nesta semana.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-200 space-y-4">
        <h2 className="text-2xl font-black text-slate-900 text-center flex items-center justify-center gap-2">
          <Share2 className="w-7 h-7 text-green-600" />
          ENVIAR OU COPIAR SUA LISTA PRONTA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Main Action WhatsApp Button */}
          <button
            onClick={handleSendWhatsApp}
            className="w-full py-5 px-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-black text-xl rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            <MessageSquare className="w-8 h-8 fill-current" />
            <span>ENVIAR NO WHATSAPP</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`w-full py-5 px-6 font-black text-xl rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 focus:outline-none focus:ring-4 ${
              copied
                ? 'bg-blue-800 text-white ring-4 ring-blue-300'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-blue-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-8 h-8 stroke-[3]" />
                <span>LISTA COPIADA!</span>
              </>
            ) : (
              <>
                <Copy className="w-8 h-8 stroke-[2.5]" />
                <span>COPIAR TEXTO DA LISTA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formatted List Preview Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-6">
          <h3 className="text-2xl font-black text-slate-900">
            🛒 LISTA DA SEMANA ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
          </h3>

          <button
            onClick={() => {
              if (confirm('Tem certeza de que deseja apagar todos os itens da sua lista da semana?')) {
                onClearCart();
              }
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 font-extrabold text-base px-4 py-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Limpar Tudo
          </button>
        </div>

        {/* Categories Item Cards */}
        <div className="space-y-8">
          {categoriesOrder.map((cat) => {
            const itemsInCat = cart.filter((item) => item.product.category === cat);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 bg-slate-100 px-4 py-2 rounded-xl border-l-8 border-blue-600">
                  {cat.toUpperCase()}
                </h4>

                {/* Butcher Special Warning Banner */}
                {cat === 'Açougue' && (
                  <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-950 font-bold text-lg">
                    <AlertTriangle className="w-7 h-7 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>
                      Observação enviada ao mercado: Por gentileza, pedir para outro atendente preparar os cortes.
                    </span>
                  </div>
                )}

                <div className="divide-y-2 divide-slate-100">
                  {itemsInCat.map((item, idx) => {
                    const displayUnit = item.unit || item.product.defaultUnit;
                    const displayDetails = item.customDetails || item.product.details;

                    return (
                      <div
                        key={`${item.product.id}_${idx}`}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-2xl transition-colors"
                      >
                        <div
                          onClick={() =>
                            onEditProductModal(item.product, item.quantity, item.unit, item.customDetails)
                          }
                          className="cursor-pointer flex-1"
                        >
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-2xl font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl">
                              {item.quantity} {displayUnit}
                            </span>
                            <span className="text-2xl font-black text-slate-900">
                              {item.product.name}
                            </span>
                          </div>
                          {displayDetails && (
                            <p className="text-slate-600 font-semibold text-lg mt-1 pl-1">
                              📌 ({displayDetails})
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls & Delete */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="w-12 h-12 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 rounded-xl flex items-center justify-center font-black text-2xl transition-colors"
                            aria-label="Diminuir"
                          >
                            <Minus className="w-6 h-6 stroke-[3]" />
                          </button>

                          <button
                            onClick={() =>
                              onEditProductModal(item.product, item.quantity, item.unit, item.customDetails)
                            }
                            className="px-4 h-12 bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 font-bold text-base rounded-xl transition-colors"
                          >
                            Ajustar
                          </button>

                          <button
                            onClick={() => handleIncrement(item)}
                            className="w-12 h-12 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 rounded-xl flex items-center justify-center font-black text-2xl transition-colors"
                            aria-label="Aumentar"
                          >
                            <Plus className="w-6 h-6 stroke-[3]" />
                          </button>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="w-12 h-12 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-center transition-colors ml-2"
                            aria-label="Remover item da lista"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw WhatsApp Message Preview Box */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md">
        <h4 className="text-xl font-bold text-slate-300 mb-3 flex items-center gap-2">
          <span>📱 PRÉ-VISUALIZAÇÃO MENSAGEM DO WHATSAPP:</span>
        </h4>
        <pre className="whitespace-pre-wrap font-mono text-lg bg-slate-950 p-5 rounded-2xl border border-slate-800 text-green-400 overflow-x-auto leading-relaxed">
          {rawMessage}
        </pre>
      </div>
    </div>
  );
};
