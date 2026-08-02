'use client';

import React, { useState, useEffect } from 'react';
import { BaseProduct } from '@/types';
import { Plus, Minus, X, Check, ShoppingBag, Scale, FileText, Sparkles, ChevronDown } from 'lucide-react';

interface EditQuantityModalProps {
  product: BaseProduct | null;
  initialQuantity?: string | number;
  initialUnit?: string;
  initialDetails?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: BaseProduct, quantity: string | number, unit: string, details: string) => void;
}

export const EditQuantityModal: React.FC<EditQuantityModalProps> = ({
  product,
  initialQuantity = 1,
  initialUnit,
  initialDetails,
  isOpen,
  onClose,
  onSave,
}) => {
  const [quantity, setQuantity] = useState<string | number>(1);
  const [selectedUnit, setSelectedUnit] = useState('unidades');
  const [details, setDetails] = useState('');

  const standardUnits = [
    'unidades',
    'bandeja',
    'kg',
    'g',
    'L',
    'ml',
    'pacote',
    'cartela',
    'pote',
    'caixa',
    'dúzia',
  ];

  const presetObservations = [
    'firmes, não podres',
    'bem maduros',
    'verdes (para amadurecer)',
    'corte magro',
    'moer 2 vezes',
    'fatiado fino',
    'sem lactose',
    'sem açúcar / zero',
    'embalagem grande',
  ];

  useEffect(() => {
    if (product) {
      setQuantity(initialQuantity || 1);
      setSelectedUnit(initialUnit || product.defaultUnit || 'unidades');
      setDetails(initialDetails !== undefined ? initialDetails : (product.details || ''));
    }
  }, [product, initialQuantity, initialUnit, initialDetails]);

  if (!isOpen || !product) return null;

  const handleNumericChange = (delta: number) => {
    const currentNum = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 1;
    const nextVal = Math.max(1, currentNum + delta);
    setQuantity(nextVal);
  };

  const handlePresetClick = (preset: string | number) => {
    setQuantity(preset);
  };

  const handleChipClick = (obs: string) => {
    if (!details) {
      setDetails(obs);
    } else if (!details.includes(obs)) {
      setDetails(`${details}, ${obs}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || String(quantity).trim() === '') return;
    onSave(product, quantity, selectedUnit, details.trim());
    onClose();
  };

  const numericPresets = [
    { label: '1', val: 1 },
    { label: '2', val: 2 },
    { label: '3', val: 3 },
    { label: '5', val: 5 },
    { label: '10', val: 10 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header - Warm Amber & Terracotta */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white">
          <div className="flex items-center gap-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-2xl border-2 border-white/40 shadow-xs"
              />
            ) : (
              <span className="p-2.5 bg-white/20 text-white rounded-2xl">
                <ShoppingBag className="w-7 h-7" />
              </span>
            )}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-100 bg-black/20 px-2.5 py-1 rounded-full border border-white/20">
                {product.category}
              </span>
              <h2 id="modal-title" className="text-2xl font-black text-white mt-1 leading-tight">
                {product.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-colors focus:outline-none"
            aria-label="Fechar"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 bg-amber-50/20">
          {product.description && (
            <p className="text-amber-950 font-semibold text-base bg-amber-100/70 p-3.5 rounded-2xl border border-amber-300">
              💡 {product.description}
            </p>
          )}

          {/* Quantity Controls */}
          <div>
            <label className="block text-xl font-bold text-slate-800 mb-3 text-center">
              Informe a Quantidade Desejada:
            </label>

            <div className="flex items-center justify-center gap-3 my-3">
              <button
                type="button"
                onClick={() => handleNumericChange(-1)}
                className="w-16 h-16 rounded-2xl bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 flex items-center justify-center text-3xl font-extrabold shadow-sm transition-all"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-8 h-8 stroke-[3]" />
              </button>

              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-36 h-16 text-center text-3xl font-black text-slate-900 bg-white border-4 border-amber-600 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-200"
                placeholder="Qtd"
              />

              <button
                type="button"
                onClick={() => handleNumericChange(1)}
                className="w-16 h-16 rounded-2xl bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 flex items-center justify-center text-3xl font-extrabold shadow-sm transition-all"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-8 h-8 stroke-[3]" />
              </button>
            </div>

            {/* Quick Numeric Presets */}
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {numericPresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePresetClick(p.val)}
                  className={`px-4 py-2 rounded-xl font-extrabold text-base border-2 transition-all active:scale-95 ${
                    String(quantity) === String(p.val)
                      ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105'
                      : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unit of Measurement Selector */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
            <label className="block text-lg font-extrabold text-slate-800 mb-2 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-700" />
              Unidade de Medida desta Compra:
            </label>

            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full h-14 pl-5 pr-14 text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-amber-600 focus:ring-4 focus:ring-amber-200 focus:outline-none appearance-none cursor-pointer"
              >
                {standardUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-amber-700">
                <ChevronDown className="w-7 h-7 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Observations / Details */}
          <div>
            <label className="block text-lg font-extrabold text-slate-800 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" />
              Observação / Instrução para o Mercado:
            </label>

            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Ex: firmes, não podres, corte magro..."
              className="w-full h-12 px-4 text-lg font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-xl focus:border-amber-600 focus:ring-4 focus:ring-amber-200 focus:outline-none mb-3"
            />

            {/* Quick Chips */}
            <div>
              <span className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Toque para inserir observação rápida:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetObservations.map((obs) => (
                  <button
                    key={obs}
                    type="button"
                    onClick={() => handleChipClick(obs)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 active:scale-95 rounded-lg font-bold text-sm text-slate-800 transition-all border border-slate-300"
                  >
                    + {obs}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-5 px-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Check className="w-8 h-8 stroke-[3]" />
              <span>ADICIONAR À LISTA DA SEMANA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
