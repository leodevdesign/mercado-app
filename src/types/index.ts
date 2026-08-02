export type Category =
  | 'Hortifrúti'
  | 'Laticínios'
  | 'Açougue'
  | 'Mercearia'
  | 'Limpeza'
  | 'Higiene Pessoal'
  | 'Bebidas'
  | 'Padaria';

export interface BaseProduct {
  id: string;
  name: string;             // ex: "Banana prata", "Arroz Camil"
  description?: string;      // ex: "Arroz tipo 1 refinado para refeições diárias"
  details?: string;         // ex: "firmes, não podres", "marca Ypê"
  defaultUnit: string;      // ex: "unidades", "kg", "g", "L", "ml", "pacote", "cartela", "pote", "bandeja"
  category: Category;
  variety?: string;         // ex: "Prata", "Patinho", "Gala", "Carioca"
  brand?: string;           // ex: "Ypê", "Dove", "Colgate", "Camil", "Tio João"
  imageUrl?: string;        // URL da imagem ou ícone ilustrativo
}

export interface CartItem {
  product: BaseProduct;
  quantity: string | number; // ex: 2, 5, "600g", "1/2"
  unit?: string;             // ex: "kg", "unidades", "g" (caso alterado ao adicionar)
  customDetails?: string;    // observação personalizada específica desta compra
}

export type DeliveryStatus = 'pending' | 'delivered' | 'issue';

export interface ChecklistItem extends CartItem {
  status: DeliveryStatus;
  issueNote?: string;
}

export interface ArchivedOrder {
  id: string;
  date: string;
  items: ChecklistItem[];
  totalItems: number;
  deliveredCount: number;
  issuesCount: number;
}
