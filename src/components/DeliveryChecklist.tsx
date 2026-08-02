'use client';

import React, { useState } from 'react';
import { ChecklistItem, ArchivedOrder, DeliveryStatus } from '@/types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Archive,
  History,
  Trash2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  AlertTriangle,
  Bell,
} from 'lucide-react';

interface DeliveryChecklistProps {
  checklist: ChecklistItem[];
  orderHistory: ArchivedOrder[];
  onToggleStatus: (productId: string, status: DeliveryStatus) => void;
  onSetIssueNote: (productId: string, note: string) => void;
  onCompleteOrder: () => void;
  onDeleteHistoryOrder: (orderId: string) => void;
  onReuseOrder?: (orderId: string) => void;
}

export const DeliveryChecklist: React.FC<DeliveryChecklistProps> = ({
  checklist,
  orderHistory,
  onToggleStatus,
  onSetIssueNote,
  onCompleteOrder,
  onDeleteHistoryOrder,
  onReuseOrder,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalItems = checklist.length;
  const deliveredCount = checklist.filter((item) => item.status === 'delivered').length;
  const issuesCount = checklist.filter((item) => item.status === 'issue').length;
  const pendingCount = totalItems - deliveredCount - issuesCount;
  const progressPercent = totalItems > 0 ? Math.round(((deliveredCount + issuesCount) / totalItems) * 100) : 0;

  const handleCompleteOrder = () => {
    if (confirm('Deseja concluir o recebimento e arquivar este pedido no histórico?')) {
      onCompleteOrder();
      setToastMessage('✅ Pedido concluído e arquivado com sucesso!');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleReuseOrderClick = (order: ArchivedOrder) => {
    if (onReuseOrder) {
      onReuseOrder(order.id);
      setToastMessage(`🚀 Lista do dia ${order.date} recarregada! Abra a aba "2. VER LISTA" para conferir.`);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto z-50 bg-slate-900 text-white font-bold text-lg px-6 py-4 rounded-2xl shadow-2xl border-2 border-amber-400 animate-in slide-in-from-top-4 duration-300 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-400 shrink-0 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MISSING ITEMS ALERT BADGE */}
      {issuesCount > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 shadow-sm flex items-center gap-4 text-red-950 animate-in zoom-in-95 duration-200">
          <div className="p-3 bg-red-600 text-white rounded-2xl shrink-0 shadow-md">
            <Bell className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-black">
              ⚠️ ATENÇÃO: {issuesCount} {issuesCount === 1 ? 'ITEM FALTOU' : 'ITENS FALTARAM'} NO MERCADO!
            </h3>
            <p className="text-red-800 font-semibold text-sm mt-0.5">
              Verifique os itens marcados em vermelho abaixo para avisar o mercado ou comprar em outro local.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: ACTIVE ORDER CHECKLIST */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-amber-700" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                CONFERIR COMPRAS QUE CHEGARAM
              </h2>
            </div>
            <p className="text-slate-600 font-semibold text-base mt-1">
              Toque no checkbox circular de cada item conforme for tirando das sacolas!
            </p>
          </div>

          {totalItems > 0 && (
            <button
              onClick={handleCompleteOrder}
              className="py-4 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Archive className="w-6 h-6" />
              <span>CONCLUIR E ARQUIVAR</span>
            </button>
          )}
        </div>

        {totalItems > 0 ? (
          <div className="space-y-6">
            {/* Progress Bar & Counters */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between font-black text-lg text-slate-800">
                <span>Progresso da Conferência: {progressPercent}%</span>
                <span className="text-slate-500">{deliveredCount + issuesCount} de {totalItems} conferidos</span>
              </div>

              <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-xl">
                  <span className="block text-2xl font-black text-emerald-900">{deliveredCount}</span>
                  <span className="text-xs font-extrabold uppercase text-emerald-800">🟢 ENTREGUES OK</span>
                </div>
                <div className="bg-red-100 border border-red-300 p-3 rounded-xl">
                  <span className="block text-2xl font-black text-red-900">{issuesCount}</span>
                  <span className="text-xs font-extrabold uppercase text-red-800">🔴 FALTOU / ERRO</span>
                </div>
                <div className="bg-amber-100 border border-amber-300 p-3 rounded-xl">
                  <span className="block text-2xl font-black text-amber-950">{pendingCount}</span>
                  <span className="text-xs font-extrabold uppercase text-amber-900">⏳ PENDENTES</span>
                </div>
              </div>
            </div>

            {/* Checklist Items List - Tactile Checkbox Redesign */}
            <div className="space-y-3">
              {checklist.map((item, idx) => {
                const isDelivered = item.status === 'delivered';
                const isIssue = item.status === 'issue';

                return (
                  <div
                    key={item.product?.id ? `${item.product.id}_${idx}` : `item_${idx}`}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                      isDelivered
                        ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                        : isIssue
                        ? 'bg-red-50/80 border-red-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Checkbox & Product Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Tactile Circular Checkbox */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus(item.product.id, 'delivered')}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border-3 transition-all duration-200 ${
                            isDelivered
                              ? 'bg-emerald-600 border-emerald-700 text-white shadow-md scale-105 ring-4 ring-emerald-100'
                              : 'bg-slate-50 border-slate-300 hover:border-emerald-500 text-transparent'
                          }`}
                          title={isDelivered ? 'Marcar como pendente' : 'Marcar como entregue'}
                        >
                          <Check className={`w-7 h-7 stroke-[3.5] transition-transform ${isDelivered ? 'scale-100' : 'scale-0'}`} />
                        </button>

                        {/* Product Photo */}
                        {item.product?.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0 hidden sm:block"
                          />
                        )}

                        {/* Product Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              {item.product?.category}
                            </span>
                            {isDelivered && (
                              <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-md">
                                ✓ ENTREGUE
                              </span>
                            )}
                            {isIssue && (
                              <span className="text-[11px] font-black uppercase text-red-800 bg-red-200 px-2 py-0.5 rounded-md">
                                ⚠ FALTOU
                              </span>
                            )}
                          </div>

                          <h3
                            onClick={() => onToggleStatus(item.product.id, 'delivered')}
                            className={`text-lg sm:text-xl font-black leading-snug mt-1 cursor-pointer transition-all ${
                              isDelivered
                                ? 'line-through text-slate-400'
                                : 'text-slate-900'
                            }`}
                          >
                            {item.quantity} {item.unit || item.product?.defaultUnit} - {item.product?.name}
                          </h3>

                          {item.customDetails && (
                            <p className="text-slate-600 font-semibold text-xs sm:text-sm mt-0.5">
                              📌 {item.customDetails}
                            </p>
                          )}

                          {item.issueNote && (
                            <p className="text-red-700 font-bold text-xs sm:text-sm mt-1 bg-red-100 px-3 py-1 rounded-lg border border-red-200 inline-block">
                              ⚠️ Motivo: {item.issueNote}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Issue Trigger Button */}
                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onToggleStatus(item.product.id, 'issue');
                            if (!isIssue) setEditingIssueId(item.product.id);
                          }}
                          className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all border-2 ${
                            isIssue
                              ? 'bg-red-600 text-white border-red-700 shadow-sm'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span>FALTOU?</span>
                        </button>
                      </div>
                    </div>

                    {/* Issue Note Input Field */}
                    {isIssue && (editingIssueId === item.product.id || !item.issueNote) && (
                      <div className="mt-4 pt-3 border-t border-red-200 animate-in fade-in duration-200">
                        <label className="block text-xs font-bold text-red-900 mb-1">
                          Descreva o problema com este produto (opcional):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.issueNote || ''}
                            onChange={(e) => onSetIssueNote(item.product.id, e.target.value)}
                            placeholder="Ex: veio rasgado, produto vencido, não veio..."
                            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-900 bg-white border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingIssueId(null)}
                            className="px-4 py-2 bg-red-600 text-white font-black text-sm rounded-xl hover:bg-red-700"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8">
            <Clock className="w-16 h-16 text-slate-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-slate-700 mb-1">Nenhum pedido em andamento</p>
            <p className="text-slate-500 text-lg">
              Monte sua lista na Aba 1 e envie para o mercado para começar a conferência.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: CALENDAR & ARCHIVED ORDERS HISTORY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-slate-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
          <Calendar className="w-8 h-8 text-amber-700" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              📅 CALENDÁRIO & HISTÓRICO DE COMPRAS
            </h2>
            <p className="text-slate-600 font-semibold text-base mt-1">
              Veja suas compras passadas organizadas por data e **reaproveite qualquer lista** para a semana atual com 1 toque!
            </p>
          </div>
        </div>

        {orderHistory && orderHistory.length > 0 ? (
          <div className="space-y-5">
            {orderHistory.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-5 sm:p-6 transition-all hover:border-amber-400"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Date and Summary Info */}
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 bg-amber-100 text-amber-950 rounded-2xl border border-amber-300 shrink-0">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-slate-900">{order.date}</span>
                        </div>
                        <p className="text-slate-600 font-bold text-base mt-0.5">
                          📦 Total: {order.totalItems} itens | 🟢 Entregues: {order.deliveredCount} | 🔴 Faltaram: {order.issuesCount}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Reuse Order Button */}
                      <button
                        type="button"
                        onClick={() => handleReuseOrderClick(order)}
                        className="flex-1 md:flex-none py-3.5 px-5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                      >
                        <RotateCcw className="w-6 h-6 stroke-[2.5]" />
                        <span>🔄 REAPROVEITAR ESTA LISTA</span>
                      </button>

                      {/* Expand Details */}
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="py-3.5 px-4 bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-black rounded-2xl flex items-center justify-center"
                      >
                        {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </button>

                      {/* Delete History */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Deseja excluir este registro do histórico?')) {
                            onDeleteHistoryOrder(order.id);
                          }
                        }}
                        className="p-3.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                        title="Excluir do histórico"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items List Preview */}
                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t-2 border-slate-200 space-y-3 animate-in fade-in duration-200">
                      <h4 className="font-extrabold text-base text-slate-800 uppercase tracking-wider">
                        Itens Desta Compra:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-base font-bold text-slate-800 flex items-center justify-between">
                            <span>• {item.quantity} {item.unit || item.product?.defaultUnit} - {item.product?.name}</span>
                            {item.status === 'delivered' && <span className="text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">🟢 OK</span>}
                            {item.status === 'issue' && <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-md">🔴 Faltou</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6">
            <History className="w-14 h-14 text-slate-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-slate-700">Nenhum pedido no histórico ainda</p>
            <p className="text-slate-500 text-base mt-1">
              Conforme você for concluindo suas compras, os pedidos salvos por data aparecerão aqui para você reaproveitá-los no futuro!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
