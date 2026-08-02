import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BaseProduct, CartItem, ChecklistItem, ArchivedOrder, DeliveryStatus } from '@/types';
import { PRODUCT_PRESETS } from '@/data/productPresets';

interface ShoppingStore {
  // Catálogo Permanente
  catalog: BaseProduct[];
  addProductToCatalog: (product: Omit<BaseProduct, 'id'>) => void;
  updateProductInCatalog: (id: string, updated: Omit<BaseProduct, 'id'>) => void;
  removeProductFromCatalog: (id: string) => void;
  resetCatalogToDefault: () => void;

  // Pedido Atual da Semana (Carrinho)
  cart: CartItem[];
  addToCart: (product: BaseProduct, quantity: string | number, unit?: string, customDetails?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: string | number, unit?: string, customDetails?: string) => void;
  clearCart: () => void;

  // Checklist de Entrega Atual
  activeChecklist: ChecklistItem[];
  syncCartToChecklist: () => void;
  toggleChecklistItemStatus: (productId: string, status: DeliveryStatus) => void;
  setChecklistItemIssueNote: (productId: string, note: string) => void;
  completeAndArchiveOrder: () => void;

  // Histórico de Pedidos Arquivados & Clonagem de Pedidos
  orderHistory: ArchivedOrder[];
  deleteArchivedOrder: (orderId: string) => void;
  loadArchivedOrderToCart: (orderId: string) => void;
}

export const initialCatalog: BaseProduct[] = [
  // HORTIFRÚTI
  {
    id: 'h0',
    name: 'Chuchu',
    description: 'Chuchu fresco e verde.',
    details: 'firmes e verdes',
    defaultUnit: 'kg',
    category: 'Hortifrúti',
    imageUrl: '/images/chuchu_fresco_photo_1785623776615.jpg',
  },
  {
    id: 'h1',
    name: 'Banana nanica',
    description: 'Fruta rica em potássio ideal para lanches e doces.',
    details: 'firmes, não podres',
    defaultUnit: 'unidades',
    category: 'Hortifrúti',
    variety: 'Nanica',
    imageUrl: '/images/banana_nanica_photo_1785623754006.jpg',
  },
  {
    id: 'h2',
    name: 'Maçã Gala',
    description: 'Fruta crocante e doce.',
    details: 'firmes e vermelhas',
    defaultUnit: 'unidades',
    category: 'Hortifrúti',
    variety: 'Gala',
    imageUrl: '/images/maca_gala_photo_1785623765184.jpg',
  },
  {
    id: 'h3',
    name: 'Laranja Pera',
    description: 'Rica em vitamina C, ótima para sucos.',
    details: 'suculentas para suco',
    defaultUnit: 'unidades',
    category: 'Hortifrúti',
    variety: 'Pera',
    imageUrl: '/images/laranja_pera_photo_1785624129854.jpg',
  },
  {
    id: 'h4',
    name: 'Manga Palmer madura',
    description: 'Manga doce e sem fiapo.',
    details: 'firmes, não podres',
    defaultUnit: 'unidades',
    category: 'Hortifrúti',
    variety: 'Palmer',
    imageUrl: '/images/manga_palmer_photo_1785624138681.jpg',
  },
  {
    id: 'h5',
    name: 'Mamão Papaia',
    description: 'Ótimo para o café da manhã.',
    details: 'firmes, não podres',
    defaultUnit: 'unidades',
    category: 'Hortifrúti',
    variety: 'Papaia',
    imageUrl: '/images/mamao_papaia_photo_1785624148245.jpg',
  },

  // AÇOUGUE
  {
    id: 'a0',
    name: 'Tulipa de Frango (Meio da Asa)',
    description: 'Tulipas de frango frescas para grelhar ou assar.',
    details: 'bandeja de tulipas',
    defaultUnit: 'bandeja',
    category: 'Açougue',
    variety: 'Tulipa de Frango (Meio da Asa)',
    imageUrl: '/images/tulipa_frango_photo_1785623789427.jpg',
  },
  {
    id: 'a01',
    name: 'Coxinha da Asa (Drumet)',
    description: 'Coxinha da asa de frango retirada da asinha.',
    details: 'só a coxinha da asa',
    defaultUnit: 'kg',
    category: 'Açougue',
    variety: 'Coxinha da Asa (Drumet)',
    imageUrl: '/images/coxinha_asa_photo_1785623800295.jpg',
  },
  {
    id: 'a1',
    name: 'Carne moída (Patinho)',
    description: 'Corte bovino magro moído 2 vezes.',
    details: 'corte magro',
    defaultUnit: 'g',
    category: 'Açougue',
    variety: 'Patinho',
    imageUrl: '/images/carne_bovina.jpeg',
  },
  {
    id: 'a2',
    name: 'Linguiça Toscana Sadia',
    description: 'Linguiça toscana grossa para churrasco e refeições.',
    details: 'para churrasco / almoço',
    defaultUnit: 'kg',
    category: 'Açougue',
    brand: 'Sadia',
    variety: 'Linguiça Toscana (Grossa de Churrasco)',
    imageUrl: '/images/linguica_toscana_photo_1785623846649.jpg',
  },

  // LATICÍNIOS & FRIOS
  {
    id: 'l0',
    name: 'Iogurte Fazenda (Morango)',
    description: 'Iogurte saboroso estilo fazenda.',
    details: 'pote de vidro Fazenda 500g',
    defaultUnit: 'pote',
    category: 'Laticínios',
    brand: 'Fazenda Bela Vista',
    variety: 'Iogurte Fazenda (Morango)',
    imageUrl: '/images/iogurte_fazenda_photo_1785623812976.jpg',
  },
  {
    id: 'l1',
    name: 'Leite Ninho Integral',
    description: 'Leite pasteurizado 1L.',
    details: '1L cada',
    defaultUnit: 'unidades',
    category: 'Laticínios',
    brand: 'Ninho',
    variety: 'Integral',
    imageUrl: '/images/leite.jpeg',
  },
  {
    id: 'l2',
    name: 'Manteiga Vigor Mix',
    description: 'Manteiga cremosa ideal para pães.',
    details: '500g com sal',
    defaultUnit: 'pote',
    category: 'Laticínios',
    brand: 'Vigor Mix',
    variety: 'Com Sal',
    imageUrl: '/images/manteiga.jpeg',
  },
  {
    id: 'l3',
    name: 'Requeijão Danubio',
    description: 'Requeijão cremoso Danubio.',
    details: 'pote 200g',
    defaultUnit: 'pote',
    category: 'Laticínios',
    brand: 'Danubio',
    variety: 'Tradicional',
    imageUrl: '/images/requeijao.jpeg',
  },

  // PADARIA
  {
    id: 'p0',
    name: 'Pão de Hambúrguer Pullman',
    description: 'Pão macio de hambúrguer.',
    details: 'saco com 6 pães',
    defaultUnit: 'pacotes',
    category: 'Padaria',
    brand: 'Pullman',
    variety: 'Com Gergelim em cima',
    imageUrl: '/images/pao_hamburguer_photo_1785623823744.jpg',
  },
  {
    id: 'p1',
    name: 'Mini Discos de Pizza Massa Leve',
    description: 'Disquinhos de mini pizza prontos para rechear.',
    details: 'saco com 12 mini discos',
    defaultUnit: 'pacotes',
    category: 'Padaria',
    brand: 'Massa Leve',
    variety: 'Mini Disquinhos de Pizza',
    imageUrl: '/images/mini_discos_pizza_photo_1785623836101.jpg',
  },
  {
    id: 'p2',
    name: 'Pão Francês',
    description: 'Pão francês quentinho e crocante.',
    details: 'fresquinhos',
    defaultUnit: 'unidades',
    category: 'Padaria',
    imageUrl: '/images/pao_frances.jpeg',
  },

  // MERCEARIA
  {
    id: 'm1',
    name: 'Arroz Branco Camil',
    description: 'Arroz de grão longo tipo 1 essencial para o almoço.',
    details: 'pacote 5kg',
    defaultUnit: 'pacote',
    category: 'Mercearia',
    brand: 'Camil',
    variety: 'Branco Tipo 1',
    imageUrl: '/images/arroz.jpeg',
  },
  {
    id: 'm2',
    name: 'Feijão Carioca Camil',
    description: 'Feijão carioca de grãos novos.',
    details: 'pacote 1kg',
    defaultUnit: 'pacote',
    category: 'Mercearia',
    brand: 'Camil',
    variety: 'Carioca',
    imageUrl: '/images/feijao.jpeg',
  },

  // LIMPEZA
  {
    id: 'lim0',
    name: 'Amaciante Baby Soft Azul',
    description: 'Amaciante de roupas Baby Soft Azul.',
    details: 'frasco 2L tradicional',
    defaultUnit: 'unidades',
    category: 'Limpeza',
    brand: 'Baby Soft Azul',
    variety: 'Baby Soft Azul Tradicional',
    imageUrl: '/images/amaciante_baby_soft.jpeg',
  },
  {
    id: 'lim01',
    name: 'Papel Toalha Snob (2 Unidades)',
    description: 'Papel toalha Snob pacote com 2 unidades.',
    details: 'pacote com 2 unidades (Snob)',
    defaultUnit: 'pacote',
    category: 'Limpeza',
    brand: 'Snob',
    imageUrl: '/images/papel_toalha_snob.jpeg',
  },

  // HIGIENE PESSOAL
  {
    id: 'hig1',
    name: 'Sabonete Dove',
    description: 'Sabonete hidratante em barra.',
    details: 'barra 90g',
    defaultUnit: 'unidades',
    category: 'Higiene Pessoal',
    brand: 'Dove',
    imageUrl: '/images/sabonete.jpeg',
  },
];

export const useShoppingStore = create<ShoppingStore>()(
  persist(
    (set, get) => ({
      catalog: initialCatalog,
      cart: [],
      activeChecklist: [],
      orderHistory: [],

      addProductToCatalog: (newProd) =>
        set((state) => ({
          catalog: [...(state.catalog || []), { ...newProd, id: Date.now().toString() }],
        })),

      updateProductInCatalog: (id, updated) =>
        set((state) => ({
          catalog: (state.catalog || []).map((p) => (p.id === id ? { ...updated, id } : p)),
        })),

      removeProductFromCatalog: (id) =>
        set((state) => ({
          catalog: (state.catalog || []).filter((p) => p.id !== id),
          cart: (state.cart || []).filter((item) => item.product?.id !== id),
          activeChecklist: (state.activeChecklist || []).filter((item) => item.product?.id !== id),
        })),

      resetCatalogToDefault: () =>
        set({
          catalog: initialCatalog,
        }),

      addToCart: (product, quantity, unit, customDetails) =>
        set((state) => {
          const currentCart = state.cart || [];
          const existingIndex = currentCart.findIndex((item) => item.product?.id === product.id);
          const finalUnit = unit || product.defaultUnit;
          const finalDetails = customDetails !== undefined ? customDetails : product.details;

          let updatedCart: CartItem[];
          if (existingIndex > -1) {
            updatedCart = [...currentCart];
            updatedCart[existingIndex] = {
              product,
              quantity,
              unit: finalUnit,
              customDetails: finalDetails,
            };
          } else {
            updatedCart = [
              ...currentCart,
              { product, quantity, unit: finalUnit, customDetails: finalDetails },
            ];
          }

          const currentChecklist = state.activeChecklist || [];
          const updatedChecklist: ChecklistItem[] = updatedCart.map((cItem) => {
            const existingCheck = currentChecklist.find((check) => check.product?.id === cItem.product.id);
            return {
              ...cItem,
              status: existingCheck ? existingCheck.status : 'pending',
              issueNote: existingCheck ? existingCheck.issueNote : undefined,
            };
          });

          return { cart: updatedCart, activeChecklist: updatedChecklist };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: (state.cart || []).filter((item) => item.product?.id !== productId),
          activeChecklist: (state.activeChecklist || []).filter((item) => item.product?.id !== productId),
        })),

      updateCartItem: (productId, quantity, unit, customDetails) =>
        set((state) => {
          const updatedCart = (state.cart || []).map((item) =>
            item.product?.id === productId
              ? {
                  ...item,
                  quantity,
                  unit: unit || item.unit,
                  customDetails: customDetails !== undefined ? customDetails : item.customDetails,
                }
              : item
          );

          const updatedChecklist = (state.activeChecklist || []).map((item) =>
            item.product?.id === productId
              ? {
                  ...item,
                  quantity,
                  unit: unit || item.unit,
                  customDetails: customDetails !== undefined ? customDetails : item.customDetails,
                }
              : item
          );

          return { cart: updatedCart, activeChecklist: updatedChecklist };
        }),

      clearCart: () => set({ cart: [], activeChecklist: [] }),

      syncCartToChecklist: () => {
        const state = get();
        const currentCart = state.cart || [];
        const currentChecklist = state.activeChecklist || [];

        const syncedChecklist: ChecklistItem[] = currentCart.map((cItem) => {
          const existingCheck = currentChecklist.find((check) => check.product?.id === cItem.product.id);
          return {
            ...cItem,
            status: existingCheck ? existingCheck.status : 'pending',
            issueNote: existingCheck ? existingCheck.issueNote : undefined,
          };
        });

        set({ activeChecklist: syncedChecklist });
      },

      toggleChecklistItemStatus: (productId, status) =>
        set((state) => ({
          activeChecklist: (state.activeChecklist || []).map((item) =>
            item.product?.id === productId
              ? {
                  ...item,
                  status: item.status === status ? 'pending' : status,
                }
              : item
          ),
        })),

      setChecklistItemIssueNote: (productId, note) =>
        set((state) => ({
          activeChecklist: (state.activeChecklist || []).map((item) =>
            item.product?.id === productId ? { ...item, issueNote: note } : item
          ),
        })),

      completeAndArchiveOrder: () => {
        const state = get();
        const currentChecklist = state.activeChecklist || [];
        if (currentChecklist.length === 0) return;

        const deliveredCount = currentChecklist.filter((item) => item.status === 'delivered').length;
        const issuesCount = currentChecklist.filter((item) => item.status === 'issue').length;

        const dateFormatted = new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newArchivedOrder: ArchivedOrder = {
          id: Date.now().toString(),
          date: dateFormatted,
          items: currentChecklist,
          totalItems: currentChecklist.length,
          deliveredCount,
          issuesCount,
        };

        set({
          orderHistory: [newArchivedOrder, ...(state.orderHistory || [])],
          cart: [],
          activeChecklist: [],
        });
      },

      deleteArchivedOrder: (orderId) =>
        set((state) => ({
          orderHistory: (state.orderHistory || []).filter((o) => o.id !== orderId),
        })),

      loadArchivedOrderToCart: (orderId) =>
        set((state) => {
          const targetOrder = (state.orderHistory || []).find((o) => o.id === orderId);
          if (!targetOrder || !targetOrder.items || targetOrder.items.length === 0) return state;

          const newCart: CartItem[] = targetOrder.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            unit: item.unit || item.product?.defaultUnit,
            customDetails: item.customDetails || item.product?.details,
          }));

          const newChecklist: ChecklistItem[] = newCart.map((cItem) => ({
            ...cItem,
            status: 'pending',
          }));

          return {
            cart: newCart,
            activeChecklist: newChecklist,
          };
        }),
    }),
    {
      name: 'lista-mercado-storage',
      merge: (persistedState: any, currentState: ShoppingStore) => {
        if (!persistedState) return currentState;

        const persistedCatalog: BaseProduct[] = Array.isArray(persistedState.catalog)
          ? persistedState.catalog
          : [];

        // Map fresh images from presets into persisted catalog items
        const updatedPersisted = persistedCatalog.map((p) => {
          const matchingPreset = PRODUCT_PRESETS.find(
            (preset) => preset.name.toLowerCase() === p.name.toLowerCase() || preset.id === p.id
          );
          if (matchingPreset && matchingPreset.imageUrl) {
            return { ...p, imageUrl: matchingPreset.imageUrl };
          }
          return p;
        });

        const existingNames = new Set(updatedPersisted.map((p) => p.name.toLowerCase()));
        const missingInitial = initialCatalog.filter(
          (initP) => !existingNames.has(initP.name.toLowerCase())
        );

        const mergedCatalog = [...updatedPersisted, ...missingInitial];

        return {
          ...currentState,
          ...persistedState,
          catalog: mergedCatalog.length > 0 ? mergedCatalog : initialCatalog,
          cart: Array.isArray(persistedState.cart) ? persistedState.cart : [],
          activeChecklist: Array.isArray(persistedState.activeChecklist) ? persistedState.activeChecklist : [],
          orderHistory: Array.isArray(persistedState.orderHistory) ? persistedState.orderHistory : [],
        };
      },
    }
  )
);
