'use client';

import React, { useState } from 'react';
import { BaseProduct, Category } from '@/types';
import { PRODUCT_PRESETS, ProductPreset } from '@/data/productPresets';
import {
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  FileText,
  Package,
  Scale,
  Sparkles,
  Wand2,
  Edit3,
  Check,
} from 'lucide-react';

interface AddProductFormProps {
  onAddProduct: (product: Omit<BaseProduct, 'id'>) => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'guided' | 'manual'>('guided');

  // Guided Mode State
  const [guidedCategory, setGuidedCategory] = useState<Category>('Hortifrúti');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('p_banana');
  const [selectedVariety, setSelectedVariety] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [guidedUnit, setGuidedUnit] = useState<string>('unidades');
  const [guidedDetails, setGuidedDetails] = useState<string>('');

  // Manual Mode State
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState<Category>('Hortifrúti');
  const [manualUnit, setManualUnit] = useState('unidades');
  const [manualCustomUnit, setManualCustomUnit] = useState('');
  const [manualDetails, setManualDetails] = useState('');

  const categories: Category[] = [
    'Hortifrúti',
    'Açougue',
    'Laticínios',
    'Padaria',
    'Mercearia',
    'Bebidas',
    'Limpeza',
    'Higiene Pessoal',
  ];

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
    'Personalizada...',
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

  // Presets matching chosen category in guided mode
  const currentCategoryPresets = PRODUCT_PRESETS.filter(
    (p) => p.category === guidedCategory
  );

  const selectedPreset: ProductPreset | undefined =
    PRODUCT_PRESETS.find((p) => p.id === selectedPresetId) || currentCategoryPresets[0];

  const handleCategorySelect = (cat: Category) => {
    setGuidedCategory(cat);
    const firstInCat = PRODUCT_PRESETS.find((p) => p.category === cat);
    if (firstInCat) {
      setSelectedPresetId(firstInCat.id);
      setSelectedVariety(firstInCat.varieties?.[0] || '');
      setSelectedBrand(firstInCat.brands?.[0] || '');
      setGuidedUnit(firstInCat.defaultUnit || 'unidades');
      setGuidedDetails(firstInCat.suggestedDetails?.[0] || '');
    } else {
      setSelectedPresetId('');
      setSelectedVariety('');
      setSelectedBrand('');
      setGuidedUnit('unidades');
      setGuidedDetails('');
    }
  };

  const handlePresetSelect = (preset: ProductPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedVariety(preset.varieties?.[0] || '');
    setSelectedBrand(preset.brands?.[0] || '');
    setGuidedUnit(preset.defaultUnit || 'unidades');
    setGuidedDetails(preset.suggestedDetails?.[0] || '');
  };

  const handleChipClickGuided = (obs: string) => {
    if (!guidedDetails) {
      setGuidedDetails(obs);
    } else if (!guidedDetails.includes(obs)) {
      setGuidedDetails(`${guidedDetails}, ${obs}`);
    }
  };

  const handleChipClickManual = (obs: string) => {
    if (!manualDetails) {
      setManualDetails(obs);
    } else if (!manualDetails.includes(obs)) {
      setManualDetails(`${manualDetails}, ${obs}`);
    }
  };

  const handleSubmitGuided = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPreset) return;

    let finalName = selectedPreset.name;

    if (selectedVariety && !finalName.toLowerCase().includes(selectedVariety.toLowerCase())) {
      finalName += ` ${selectedVariety}`;
    }

    if (selectedBrand && !finalName.toLowerCase().includes(selectedBrand.toLowerCase())) {
      finalName += ` ${selectedBrand}`;
    }

    onAddProduct({
      name: finalName.trim(),
      category: guidedCategory,
      defaultUnit: guidedUnit || 'unidades',
      details: guidedDetails.trim() || undefined,
      variety: selectedVariety || undefined,
      brand: selectedBrand || undefined,
    });

    setIsOpen(false);
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const finalUnit =
      manualUnit === 'Personalizada...'
        ? manualCustomUnit.trim() || 'unidades'
        : manualUnit;

    onAddProduct({
      name: manualName.trim(),
      category: manualCategory,
      defaultUnit: finalUnit,
      details: manualDetails.trim() || undefined,
    });

    setManualName('');
    setManualDetails('');
    setManualUnit('unidades');
    setManualCustomUnit('');
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-md border-2 border-slate-200 overflow-hidden mb-8 transition-all">
      {/* Header Toggle - Fresh Emerald Organic Theme */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between font-black text-xl hover:from-emerald-800 hover:to-teal-800 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <div className="flex items-center gap-3">
          <PlusCircle className="w-8 h-8 stroke-[2.5]" />
          <span>➕ CADASTRAR NOVO ITEM NO CATÁLOGO</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-8 h-8 stroke-[3]" />
        ) : (
          <ChevronDown className="w-8 h-8 stroke-[3]" />
        )}
      </button>

      {/* Form Content */}
      {isOpen && (
        <div className="p-6 sm:p-8 space-y-7 bg-slate-50 border-t-2 border-slate-200">
          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-2 gap-3 bg-white p-2.5 rounded-2xl border-2 border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setMode('guided')}
              className={`py-3.5 px-4 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2 transition-all ${
                mode === 'guided'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Wand2 className="w-6 h-6 stroke-[2.5]" />
              <span>🚀 GUIADO (Sem Digitar)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`py-3.5 px-4 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2 transition-all ${
                mode === 'manual'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Edit3 className="w-6 h-6 stroke-[2.5]" />
              <span>✏️ MANUAL (Digitar)</span>
            </button>
          </div>

          {/* MODE 1: GUIDED SELECTION FORM */}
          {mode === 'guided' && (
            <form onSubmit={handleSubmitGuided} className="space-y-6">
              {/* Step 1: Category Selector */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
                <label className="block text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                  <Package className="w-6 h-6 text-emerald-600" />
                  <span>1. Escolha a Categoria:</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-4 py-2.5 rounded-xl font-black text-base transition-all border-2 ${
                        guidedCategory === cat
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                          : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Base Product Picker */}
              {currentCategoryPresets.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
                  <label className="block text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                    <Tag className="w-6 h-6 text-emerald-600" />
                    <span>2. Escolha o Produto:</span>
                  </label>

                  <div className="flex flex-wrap gap-2.5">
                    {currentCategoryPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`px-4 py-3 rounded-2xl font-black text-lg transition-all border-2 ${
                          selectedPreset?.id === preset.id
                            ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-300'
                            : 'bg-slate-50 text-slate-900 border-slate-300 hover:bg-emerald-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Varieties / Cuts / Brands Picker */}
              {selectedPreset && (
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
                  {/* Varieties / Cuts */}
                  {selectedPreset.varieties && selectedPreset.varieties.length > 0 && (
                    <div>
                      <label className="block text-base font-extrabold text-slate-700 mb-2">
                        Tipo / Variedade / Corte:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedPreset.varieties.map((v, idx) => (
                          <button
                            key={`${v}_${idx}`}
                            type="button"
                            onClick={() => setSelectedVariety(v)}
                            className={`px-4 py-2 rounded-xl font-extrabold text-base border-2 transition-all ${
                              selectedVariety === v
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brands */}
                  {selectedPreset.brands && selectedPreset.brands.length > 0 && (
                    <div>
                      <label className="block text-base font-extrabold text-slate-700 mb-2">
                        Marca de Preferência:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedPreset.brands.map((b, idx) => (
                          <button
                            key={`${b}_${idx}`}
                            type="button"
                            onClick={() => setSelectedBrand(b)}
                            className={`px-4 py-2 rounded-xl font-extrabold text-base border-2 transition-all ${
                              selectedBrand === b
                                ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Unit Selector */}
                  <div>
                    <label className="block text-base font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-emerald-600" />
                      Unidade de Medida:
                    </label>

                    <div className="relative">
                      <select
                        value={guidedUnit}
                        onChange={(e) => setGuidedUnit(e.target.value)}
                        className="w-full h-14 pl-5 pr-14 text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 focus:outline-none appearance-none cursor-pointer"
                      >
                        {standardUnits.filter((u) => u !== 'Personalizada...').map((u, idx) => (
                          <option key={`${u}_${idx}`} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-emerald-700">
                        <ChevronDown className="w-7 h-7 stroke-[3]" />
                      </div>
                    </div>
                  </div>

                  {/* Suggested Observations Chips */}
                  <div>
                    <label className="block text-base font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      Observações (Toque para selecionar):
                    </label>

                    <input
                      type="text"
                      value={guidedDetails}
                      onChange={(e) => setGuidedDetails(e.target.value)}
                      placeholder="Ex: firmes, não podres"
                      className="w-full h-14 px-4 text-lg font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl mb-3 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                    />

                    <div className="flex flex-wrap gap-2">
                      {(selectedPreset.suggestedDetails || presetObservations).map((obs, idx) => (
                        <button
                          key={`${obs}_${idx}`}
                          type="button"
                          onClick={() => handleChipClickGuided(obs)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 rounded-xl font-bold text-sm text-slate-800 border border-slate-300 transition-all"
                        >
                          + {obs}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Card Before Saving */}
              {selectedPreset && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-emerald-950">
                  <span className="block text-xs font-black uppercase tracking-wider text-emerald-800 mb-1">
                    Pré-visualização do Item Cadastrado:
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {selectedPreset.name} {selectedVariety} {selectedBrand}
                  </div>
                  <div className="text-base font-bold text-emerald-900 mt-1">
                    Unidade: <span className="bg-emerald-200 px-2 py-0.5 rounded-lg">{guidedUnit}</span>
                    {guidedDetails && <span className="ml-2 font-semibold">📌 ({guidedDetails})</span>}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xl rounded-2xl shadow-lg transition-all hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-emerald-300 flex items-center justify-center gap-2"
              >
                <Check className="w-7 h-7 stroke-[3]" />
                <span>+ ADICIONAR AO SEU CATÁLOGO</span>
              </button>
            </form>
          )}

          {/* MODE 2: MANUAL FORM */}
          {mode === 'manual' && (
            <form onSubmit={handleSubmitManual} className="space-y-6">
              <div>
                <label className="block text-xl font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-emerald-600" />
                  <span>Nome do Produto</span> <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Ex: Queijo Minas Frescal, Tomate Débora, Detergente"
                  className="w-full h-16 px-5 text-xl font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-2xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 focus:outline-none shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-2">
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
                  <label className="block text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                    <Package className="w-6 h-6 text-emerald-600" />
                    <span>Categoria do Produto</span> <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value as Category)}
                      className="w-full h-16 pl-5 pr-14 text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 focus:outline-none appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-emerald-700">
                      <ChevronDown className="w-7 h-7 stroke-[3]" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
                  <label className="block text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                    <Scale className="w-6 h-6 text-emerald-600" />
                    <span>Unidade de Medida Padrão</span> <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={manualUnit}
                      onChange={(e) => setManualUnit(e.target.value)}
                      className="w-full h-16 pl-5 pr-14 text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 focus:outline-none appearance-none cursor-pointer"
                    >
                      {standardUnits.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-emerald-700">
                      <ChevronDown className="w-7 h-7 stroke-[3]" />
                    </div>
                  </div>

                  {manualUnit === 'Personalizada...' && (
                    <input
                      type="text"
                      value={manualCustomUnit}
                      onChange={(e) => setManualCustomUnit(e.target.value)}
                      placeholder="Digite a unidade (ex: garrafa, lata)"
                      className="w-full h-16 px-5 text-xl font-bold text-slate-900 bg-white border-2 border-emerald-500 rounded-2xl mt-4 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                    />
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
                <label className="block text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <span>Observações / Detalhes (Opcional)</span>
                </label>

                <input
                  type="text"
                  value={manualDetails}
                  onChange={(e) => setManualDetails(e.target.value)}
                  placeholder="Ex: firmes, não podres, corte magro, etc."
                  className="w-full h-16 px-5 text-xl font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 focus:outline-none mb-4"
                />

                <div className="flex flex-wrap gap-2.5">
                  {presetObservations.map((obs) => (
                    <button
                      key={obs}
                      type="button"
                      onClick={() => handleChipClickManual(obs)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 rounded-xl font-bold text-base text-slate-800 border-2 border-slate-200 transition-all"
                    >
                      + {obs}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xl rounded-2xl shadow-lg transition-all hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-emerald-300 flex items-center justify-center gap-2"
              >
                <span>+ SALVAR ITEM NO CATÁLOGO</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
