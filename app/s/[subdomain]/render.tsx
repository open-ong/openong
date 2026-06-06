'use client';

import type { Data } from '@puckeditor/core';
import { Render } from '@puckeditor/core';
import config from '@/puck.config';
import { CartProvider } from '@/lib/cart/cart-context';
import { CartCheckout } from './cart-checkout';
import type { CampaignPayment } from '@/lib/campaigns';

export function PageRender({
  data,
  subdomain,
  slug,
  payment
}: {
  data: Data;
  subdomain: string;
  slug: string;
  payment?: CampaignPayment;
}) {
  return (
    <CartProvider storageKey={`cart:${subdomain}:${slug}`}>
      <Render config={config} data={data} />
      <CartCheckout subdomain={subdomain} slug={slug} payment={payment} />
    </CartProvider>
  );
}
