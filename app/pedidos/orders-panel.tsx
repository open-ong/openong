'use client';

import { useState, useTransition } from 'react';
import { Check, X, Truck, FileText } from 'lucide-react';
import { approveOrderAction, updateOrderStatusAction } from '@/app/actions';
import { formatPrice } from '@/lib/cart/cart-context';
import type { Order, OrderStatus } from '@/lib/orders';

const TABS: { key: OrderStatus; label: string }[] = [
  { key: 'por_validar', label: 'Por validar' },
  { key: 'pago_pendiente_envio', label: 'Pendiente de envío' },
  { key: 'entregado', label: 'Listos' }
];

export function OrdersPanel({
  subdomain,
  orders
}: {
  subdomain: string;
  orders: Order[];
}) {
  const [tab, setTab] = useState<OrderStatus>('por_validar');
  const [isPending, startTransition] = useTransition();

  const filtered = orders.filter((o) => o.status === tab);

  function update(orderId: string, status: OrderStatus) {
    startTransition(() => updateOrderStatusAction(subdomain, orderId, status));
  }

  function approve(orderId: string) {
    startTransition(() => approveOrderAction(subdomain, orderId));
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-1 border-b border-gray-200 p-2">
        {TABS.map((t) => {
          const count = orders.filter((o) => o.status === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 text-xs ${
                  active ? 'bg-white/20' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            No hay pedidos en esta categoría.
          </p>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{order.buyer.name}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {order.paymentMethod === 'cbu' ? 'CBU' : 'MercadoPago'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{order.buyer.email}</p>
                {order.buyer.phone && (
                  <p className="text-sm text-gray-500">{order.buyer.phone}</p>
                )}
                {order.buyer.address && (
                  <p className="text-sm text-gray-500">📍 {order.buyer.address}</p>
                )}
                <ul className="mt-2 space-y-0.5 text-sm text-gray-700">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.qty}× {item.name} —{' '}
                      {formatPrice(item.price * item.qty)}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  Total: {formatPrice(order.total)}
                </p>
                {order.comprobanteUrl && (
                  <a
                    href={order.comprobanteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Ver comprobante
                  </a>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                {order.status === 'por_validar' && (
                  <>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => approve(order.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Aprobar
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => update(order.id, 'rechazado')}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Rechazar
                    </button>
                  </>
                )}
                {order.status === 'pago_pendiente_envio' && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => update(order.id, 'entregado')}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Truck className="h-4 w-4" />
                    Marcar listo
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
