'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  X,
  Trash2,
  Loader2,
  CheckCircle2,
  Upload
} from 'lucide-react';
import { useCart, formatPrice } from '@/lib/cart/cart-context';
import { PH, capture } from '@/lib/posthog/events';
import type { CampaignPayment } from '@/lib/campaigns';

type View = 'cart' | 'checkout' | 'done';

export function CartCheckout({
  subdomain,
  slug,
  payment
}: {
  subdomain: string;
  slug: string;
  payment?: CampaignPayment;
}) {
  const cart = useCart();
  const [view, setView] = useState<View>('cart');
  const [buyer, setBuyer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [comprobanteUrl, setComprobanteUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart.enabled) return null;

  async function uploadComprobante(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', `openong/${subdomain}/comprobantes`);
      const res = await fetch('/api/files/upload', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al subir');
      if (json.storageError) throw new Error(json.storageError);
      if (!json.attachment?.url) throw new Error('No se pudo guardar el comprobante');
      setComprobanteUrl(json.attachment.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir el comprobante');
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setError(null);
    if (!buyer.name.trim() || !buyer.email.trim()) {
      setError('Completá tu nombre y email.');
      return;
    }
    if (payment?.method === 'cbu' && !comprobanteUrl) {
      setError('Subí el comprobante de la transferencia.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain,
          campaignSlug: slug,
          items: cart.items,
          buyer,
          paymentMethod: payment?.method ?? 'cbu',
          comprobanteUrl
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'No se pudo crear el pedido');
      capture(PH.purchase, {
        campaign: slug,
        value: cart.total,
        items: cart.count,
        payment_method: payment?.method ?? 'cbu'
      });
      cart.clear();
      setView('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el pedido');
    } finally {
      setSubmitting(false);
    }
  }

  function close() {
    cart.close();
    // Reset transient checkout state when the drawer is dismissed.
    if (view === 'done') setView('cart');
  }

  return (
    <>
      {/* Floating cart button */}
      <button
        type="button"
        onClick={cart.open}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
        aria-label="Abrir carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-blue-700">
            {cart.count}
          </span>
        )}
      </button>

      {!cart.isOpen ? null : (
        <div className="fixed inset-0 z-50">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {view === 'done'
                  ? 'Pedido recibido'
                  : view === 'checkout'
                    ? 'Finalizar compra'
                    : 'Tu carrito'}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {view === 'done' ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                  <p className="text-gray-900">
                    ¡Gracias! Tu pedido fue registrado y está pendiente de
                    validación. Te vamos a contactar por email.
                  </p>
                </div>
              ) : cart.items.length === 0 ? (
                <p className="py-10 text-center text-gray-500">
                  Tu carrito está vacío.
                </p>
              ) : view === 'cart' ? (
                <ul className="space-y-3">
                  {cart.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) =>
                              cart.setQty(item.id, Number(e.target.value))
                            }
                            className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => cart.removeItem(item.id)}
                            aria-label="Quitar"
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-3">
                  <input
                    placeholder="Nombre y apellido"
                    value={buyer.name}
                    onChange={(e) =>
                      setBuyer((b) => ({ ...b, name: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={buyer.email}
                    onChange={(e) =>
                      setBuyer((b) => ({ ...b, email: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Teléfono (opcional)"
                    value={buyer.phone}
                    onChange={(e) =>
                      setBuyer((b) => ({ ...b, phone: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Dirección de envío (opcional)"
                    value={buyer.address}
                    onChange={(e) =>
                      setBuyer((b) => ({ ...b, address: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />

                  {payment?.method === 'mercadopago' && (
                    <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
                      <p className="mb-2">Pagá con MercadoPago y volvé acá para confirmar:</p>
                      <a
                        href={payment.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                      >
                        Pagar en MercadoPago
                      </a>
                    </div>
                  )}

                  {payment?.method === 'cbu' && (
                    <div className="space-y-2 rounded-lg bg-amber-50 p-3 text-sm text-gray-700">
                      <p>
                        Transferí a este CBU/alias:{' '}
                        <span className="font-semibold">{payment.cbu}</span>
                      </p>
                      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-amber-300 bg-white px-3 py-2 text-gray-700 hover:bg-amber-100">
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {comprobanteUrl ? 'Comprobante cargado ✓' : 'Subir comprobante'}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            void uploadComprobante(e.target.files?.[0]);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {!payment && (
                    <p className="rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
                      La organización todavía no configuró el método de pago.
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="mt-3 text-sm text-red-500">{error}</p>
              )}
            </div>

            {view !== 'done' && cart.items.length > 0 && (
              <div className="space-y-3 border-t border-gray-200 px-5 py-4">
                <div className="flex items-center justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
                {view === 'cart' ? (
                  <button
                    type="button"
                    onClick={() => setView('checkout')}
                    className="w-full rounded-md bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting || uploading || !payment}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirmar pedido
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
