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
        <div className="fixed top-20 right-4 left-4 sm:left-auto z-50 bg-slate-900 text-white font-bold text-lg px-6 py-4 rounded-2xl shadow-2xl border-2 border-emerald-400 animate-in slide-in-from-top-4 duration-300 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400 shrink-0 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: ACTIVE ORDER CHECKLIST */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                CONFERIR COMPRAS QUE CHEGARAM
              </h2>
            </div>
            <p className="text-slate-600 font-semibold text-base mt-1">
              Quando o entregador do mercado chegar, marque o que veio certo ou o que faltou.
            </p>
          </div>

          {totalItems > 0 && (
            <button
              onClick={handleCompleteOrder}
              className="py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
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
                  className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-green-100 border border-green-300 p-3 rounded-xl">
                  <span className="block text-2xl font-black text-green-900">{deliveredCount}</span>
                  <span className="text-xs font-extrabold uppercase text-green-800">🟢 Entregues OK</span>
                </div>
                <div className="bg-red-100 border border-red-300 p-3 rounded-xl">
                  <span className="block text-2xl font-black text-red-900">{issuesCount}</span>
                  <span className="text-xs font-extrabold uppercase text-red-800">🔴 Faltou / Errado</span>
                </div>
                <div className="bg-amber-100 border border-amber-300 p-3 rounded-xl">
                  <span className="block text-2xl font-black text-amber-900">{pendingCount}</span>
                  <span className="text-xs font-extrabold uppercase text-amber-800">⏳ Pendentes</span>
                </div>
              </div>
            </div>

            {/* Checklist Items List */}
            <div className="space-y-4">
              {checklist.map((item, idx) => {
                const isDelivered = item.status === 'delivered';
                const isIssue = item.status === 'issue';

                return (
                  <div
                    key={item.product?.id ? `${item.product.id}_${idx}` : `item_${idx}`}
                    className={`p-5 rounded-2xl border-3 transition-all ${
                      isDelivered
                        ? 'bg-green-50 border-green-500'
                        : isIssue
                        ? 'bg-red-50 border-red-500'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {item.product?.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-2xl border border-slate-300 shrink-0"
                          />
                        )}
                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                            {item.product?.category}
                          </span>
                          <h3 className="text-xl font-black text-slate-900 leading-snug mt-1">
                            {item.quantity} {item.unit || item.product?.defaultUnit} - {item.product?.name}
                          </h3>
                          {item.customDetails && (
                            <p className="text-slate-600 font-semibold text-sm mt-0.5">
                              📌 {item.customDetails}
                            </p>
                          )}
                          {item.issueNote && (
                            <p className="text-red-700 font-bold text-sm mt-1 bg-red-100 p-2 rounded-lg border border-red-200">
                              ⚠️ Motivo: {item.issueNote}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(item.product.id, 'delivered')}
                          className={`flex-1 sm:flex-none py-3 px-4 rounded-xl font-black text-base flex items-center justify-center gap-1.5 transition-all ${
                            isDelivered
                              ? 'bg-green-600 text-white shadow-md ring-2 ring-green-300'
                              : 'bg-white hover:bg-green-100 text-slate-700 border-2 border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          <span>ENTREGUE</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onToggleStatus(item.product.id, 'issue');
                            if (!isIssue) setEditingIssueId(item.product.id);
                          }}
                          className={`flex-1 sm:flex-none py-3 px-4 rounded-xl font-black text-base flex items-center justify-center gap-1.5 transition-all ${
                            isIssue
                              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-300'
                              : 'bg-white hover:bg-red-100 text-slate-700 border-2 border-slate-300'
                          }`}
                        >
                          <XCircle className="w-6 h-6 text-red-600" />
                          <span>FALTOU</span>
                        </button>
                      </div>
                    </div>

                    {/* Issue Note Input Field */}
                    {isIssue && (editingIssueId === item.product.id || !item.issueNote) && (
                      <div className="mt-4 pt-3 border-t border-red-200">
                        <label className="block text-sm font-bold text-red-900 mb-1">
                          Descreva o problema (opcional):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.issueNote || ''}
                            onChange={(e) => onSetIssueNote(item.product.id, e.target.value)}
                            placeholder="Ex: veio rasgado, produto vencido, não veio..."
                            className="flex-1 px-4 py-2 text-base font-semibold text-slate-900 bg-white border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingIssueId(null)}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl"
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
          <Calendar className="w-8 h-8 text-indigo-600" />
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
                  className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-5 sm:p-6 transition-all hover:border-indigo-400"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Date and Summary Info */}
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 bg-indigo-100 text-indigo-900 rounded-2xl border border-indigo-200 shrink-0">
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
                        className="flex-1 md:flex-none py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
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
                            {item.status === 'delivered' && <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-md">🟢 OK</span>}
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
