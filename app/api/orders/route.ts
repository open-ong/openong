import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { addOrder, type OrderItem } from '@/lib/orders';
import { getOrgBySlug } from '@/lib/orgs';
import { getCampaign } from '@/lib/campaigns';

/**
 * POST /api/orders
 *
 * Creates an order from the public checkout. The payment method and campaign
 * type are read from the campaign (authoritative), not the client, and decide
 * the initial status:
 *   - MercadoPago  -> paid: store => pago_pendiente_envio, crowdfunding => entregado
 *   - CBU          -> por_validar (admin approves the comprobante)
 */
export async function POST(request: Request) {
  let body: {
    subdomain?: string;
    campaignSlug?: string;
    items?: OrderItem[];
    buyer?: { name?: string; email?: string; phone?: string; address?: string };
    comprobanteUrl?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { subdomain, campaignSlug, items, buyer, comprobanteUrl } = body;

  if (!subdomain || !campaignSlug) {
    return NextResponse.json(
      { error: 'Faltan subdomain o campaignSlug' },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
  }
  if (!buyer?.name || !buyer?.email) {
    return NextResponse.json(
      { error: 'Faltan datos del comprador' },
      { status: 400 }
    );
  }

  const org = await getOrgBySlug(subdomain);
  if (!org || !org.slug) {
    return NextResponse.json(
      { error: 'La organización no existe' },
      { status: 404 }
    );
  }

  const campaign = await getCampaign(org.id, campaignSlug);
  if (!campaign) {
    return NextResponse.json(
      { error: 'La campaña no existe' },
      { status: 404 }
    );
  }

  const paymentMethod = campaign.payment?.method;
  if (!paymentMethod) {
    return NextResponse.json(
      { error: 'La organización no configuró el método de pago' },
      { status: 400 }
    );
  }
  if (paymentMethod === 'cbu' && !comprobanteUrl) {
    return NextResponse.json(
      { error: 'Falta el comprobante de pago' },
      { status: 400 }
    );
  }

  const order = await addOrder({
    orgId: org.id,
    subdomain: org.slug,
    campaignSlug,
    campaignType: campaign.type,
    items,
    buyer: {
      name: buyer.name,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address
    },
    paymentMethod,
    comprobanteUrl
  });

  revalidatePath(`/s/${org.slug}`);

  return NextResponse.json({ ok: true, orderId: order.id });
}
