import { CartItem, Category } from '@/types';

export function generateWhatsAppMessage(cart: CartItem[]): string {
  if (cart.length === 0) return 'Sua lista de compras está vazia!';

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
  
  let message = '🛒 *PEDIDO / LISTA DE COMPRAS*\n\n';

  categoriesOrder.forEach((cat) => {
    const itemsInCat = cart.filter((item) => item.product?.category === cat);
    if (itemsInCat.length > 0) {
      message += `*${cat.toUpperCase()}:*\n`;
      
      // Observação fixa para o açougue se houver itens de açougue
      if (cat === 'Açougue') {
        message += `⚠️ _Observação: Por gentileza, pedir para outro atendente preparar os cortes._\n`;
      }

      itemsInCat.forEach((item) => {
        const unitText = item.unit ? ` ${item.unit}` : ` ${item.product?.defaultUnit}`;
        const details = item.customDetails || item.product?.details;
        const detailsText = details ? ` (${details})` : '';
        
        message += `• ${item.quantity}${unitText} - ${item.product?.name}${detailsText}\n`;
      });
      message += '\n';
    }
  });

  return message.trim();
}
