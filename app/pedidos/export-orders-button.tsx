'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Order, OrderStatus } from '@/lib/orders';

const STATUS_LABEL: Record<OrderStatus, string> = {
  por_validar: 'Por validar',
  pago_pendiente_envio: 'Pendiente de envío',
  entregado: 'Entregado',
  rechazado: 'Rechazado'
};

const PAYMENT_LABEL: Record<string, string> = {
  mercadopago: 'MercadoPago',
  cbu: 'CBU / transferencia'
};

/** Escape a value for CSV (RFC 4180). */
function esc(value: unknown): string {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function isoDate(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function buildCsv(orders: Order[]): string {
  const headers = [
    'Fecha',
    'Cliente',
    'Email',
    'Teléfono',
    'Campaña',
    'Items',
    'Total',
    'Método de pago',
    'Estado'
  ];
  const lines = orders.map((o) =>
    [
      isoDate(o.createdAt),
      o.buyer.name,
      o.buyer.email,
      o.buyer.phone ?? '',
      o.campaignSlug,
      o.items.map((i) => `${i.qty}x ${i.name}`).join('; '),
      o.total,
      PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod,
      STATUS_LABEL[o.status]
    ]
      .map(esc)
      .join(',')
  );
  return [headers.join(','), ...lines].join('\r\n');
}

export function ExportOrdersButton({
  subdomain,
  orders
}: {
  subdomain: string;
  orders: Order[];
}) {
  function handleExport() {
    // Prepend BOM so Excel reads UTF-8 (accents) correctly.
    const csv = '﻿' + buildCsv(orders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos-${subdomain}-${isoDate(Date.now())}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={orders.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
