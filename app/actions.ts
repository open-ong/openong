'use server';

import { redis } from '@/lib/redis';
import { sanitizeSubdomain } from '@/lib/subdomains';
import {
  addCampaign,
  getCampaigns,
  slugify,
  updateCampaign,
  type CampaignType,
  type CampaignPayment
} from '@/lib/campaigns';
import {
  getOrders,
  updateOrderStatus,
  paidOrderStatus,
  type OrderStatus
} from '@/lib/orders';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const name = (formData.get('name') as string)?.trim();

  if (!name) {
    return { success: false, error: 'Name is required' };
  }

  const sanitizedSubdomain = sanitizeSubdomain(name);

  if (!sanitizedSubdomain) {
    return {
      name,
      success: false,
      error: 'Name must contain at least one letter or number'
    };
  }

  const exists = await redis.get(`subdomain:${sanitizedSubdomain}`);
  if (exists) {
    return {
      name,
      success: false,
      error: 'This organization already exists'
    };
  }

  await redis.set(`subdomain:${sanitizedSubdomain}`, {
    name,
    createdAt: Date.now()
  });

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}/admin`);
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  await redis.del(`subdomain:${subdomain}`);
  await redis.del(`campaigns:${subdomain}`);
  revalidatePath('/admin');
  return { success: 'Organization deleted successfully' };
}

type CreateCampaignState = {
  error?: string;
  slug?: string;
};

export async function createCampaignAction(
  subdomain: string,
  data: {
    title: string;
    type: CampaignType;
    slug: string;
    prompt: string;
    images?: string[];
    payment?: CampaignPayment;
  }
): Promise<CreateCampaignState> {
  const sub = sanitizeSubdomain(subdomain);
  const title = data.title?.trim();
  const prompt = data.prompt?.trim();

  if (!title) {
    return { error: 'Title is required' };
  }

  let slug = slugify(data.slug || title);
  if (!slug) {
    return { error: 'Could not generate a valid slug from the title' };
  }

  // Ensure slug is unique within this organization.
  const campaigns = await getCampaigns(sub);
  if (campaigns.some((c) => c.slug === slug)) {
    let i = 2;
    while (campaigns.some((c) => c.slug === `${slug}-${i}`)) i++;
    slug = `${slug}-${i}`;
  }

  await addCampaign(sub, {
    slug,
    title,
    type: data.type,
    prompt,
    images: data.images?.filter(Boolean) ?? [],
    payment: data.payment,
    status: 'pending',
    createdAt: Date.now()
  });

  revalidatePath(`/s/${sub}`);

  // Return the slug so the client can hard-navigate to the editor. A server
  // redirect here would trigger a soft navigation that can serve a stale
  // (pre-creation) Router Cache entry for the same path.
  return { slug };
}

export async function markCampaignSentAction(
  subdomain: string,
  slug: string
): Promise<void> {
  await updateCampaign(sanitizeSubdomain(subdomain), slug, {
    status: 'sent'
  });
}

export async function updateOrderStatusAction(
  subdomain: string,
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const sub = sanitizeSubdomain(subdomain);
  await updateOrderStatus(sub, orderId, status);
  revalidatePath(`/s/${sub}`);
}

/**
 * Approves a `por_validar` order. The destination depends on the campaign type:
 * store orders go to `pago_pendiente_envio`, crowdfunding goes straight to
 * `entregado` (no shipment).
 */
export async function approveOrderAction(
  subdomain: string,
  orderId: string
): Promise<void> {
  const sub = sanitizeSubdomain(subdomain);
  const order = (await getOrders(sub)).find((o) => o.id === orderId);
  if (!order) return;
  await updateOrderStatus(sub, orderId, paidOrderStatus(order.campaignType));
  revalidatePath(`/s/${sub}`);
}
