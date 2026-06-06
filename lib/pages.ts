import type { Data } from '@puckeditor/core';
import { redis } from '@/lib/redis';
import { sanitizeSubdomain } from '@/lib/subdomains';

function pageKey(subdomain: string, slug: string) {
  return `page:${sanitizeSubdomain(subdomain)}:${slug}`;
}

export async function getPageData(subdomain: string, slug: string) {
  const data = await redis.get<Data>(pageKey(subdomain, slug));
  return data;
}

export async function savePageData(
  subdomain: string,
  slug: string,
  data: Data
) {
  await redis.set(pageKey(subdomain, slug), data);
}
