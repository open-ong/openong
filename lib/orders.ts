import { redis } from '@/lib/redis';
import type { CampaignType, PaymentMethod } from '@/lib/campaigns';

/**
 * Order lifecycle. The status keys are stable; UI labels differ:
 *
 *   por_validar          comprobante (CBU) submitted — awaiting admin approval
 *   pago_pendiente_envio "Pendiente de envío" — store order, paid, to ship
 *   entregado            "Listo" — completed (crowdfunding paid, or store shipped)
 *   rechazado            payment rejected by the admin
 *
 * Flow depends on payment method AND campaign type:
 *   - MercadoPago is treated as paid immediately (no validation).
 *   - CBU requires the admin to approve the uploaded comprobante.
 *   - Crowdfunding never ships: once paid/approved it goes straight to `entregado`.
 *   - Store ships: once paid/approved it goes to `pago_pendiente_envio`, then the
 *     admin marks it `entregado`.
 */
export type OrderStatus =
  | 'por_validar'
  | 'pago_pendiente_envio'
  | 'entregado'
  | 'rechazado';

/** Status a paid order lands in (crowdfunding never ships). */
export function paidOrderStatus(type: CampaignType): OrderStatus {
  return type === 'tienda' ? 'pago_pendiente_envio' : 'entregado';
}

/** Status assigned right after checkout, before any admin action. */
export function initialOrderStatus(
  method: PaymentMethod,
  type: CampaignType
): OrderStatus {
  // CBU transfers must be validated against the uploaded comprobante.
  if (method === 'cbu') return 'por_validar';
  // MercadoPago is considered paid on checkout.
  return paidOrderStatus(type);
}

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export type Buyer = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type Order = {
  id: string;
  subdomain: string;
  campaignSlug: string;
  campaignType: CampaignType;
  items: OrderItem[];
  total: number;
  buyer: Buyer;
  paymentMethod: PaymentMethod;
  /** Cloudinary URL of the payment receipt (required for CBU). */
  comprobanteUrl?: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};

function ordersKey(orgId: string) {
  return `org:${orgId}:orders`;
}

export async function getOrders(orgId: string): Promise<Order[]> {
  const data = await redis.get<Order[]>(ordersKey(orgId));
  // Newest first.
  return (data || []).sort((a, b) => b.createdAt - a.createdAt);
}

export type NewOrderInput = {
  orgId: string;
  subdomain: string;
  campaignSlug: string;
  campaignType: CampaignType;
  items: OrderItem[];
  buyer: Buyer;
  paymentMethod: PaymentMethod;
  comprobanteUrl?: string;
};

export async function addOrder(input: NewOrderInput): Promise<Order> {
  const now = Date.now();
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const order: Order = {
    id: crypto.randomUUID(),
    subdomain: input.subdomain,
    campaignSlug: input.campaignSlug,
    campaignType: input.campaignType,
    items: input.items,
    total,
    buyer: input.buyer,
    paymentMethod: input.paymentMethod,
    comprobanteUrl: input.comprobanteUrl,
    status: initialOrderStatus(input.paymentMethod, input.campaignType),
    createdAt: now,
    updatedAt: now
  };

  const orders = (await redis.get<Order[]>(ordersKey(input.orgId))) || [];
  orders.push(order);
  await redis.set(ordersKey(input.orgId), orders);
  return order;
}

export async function updateOrderStatus(
  orgId: string,
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const orders = (await redis.get<Order[]>(ordersKey(orgId))) || [];
  const next = orders.map((o) =>
    o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o
  );
  await redis.set(ordersKey(orgId), next);
}
